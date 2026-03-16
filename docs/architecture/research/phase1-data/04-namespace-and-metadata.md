# 04 — Vector Namespace Design & Metadata Schema

> **Layer:** DATA | **Status:** Research Complete | **Date:** 2026-03-16
> **Scope:** Multi-module vector isolation, metadata schema, cross-module queries, content taxonomy

---

## 1. Problem Statement

LinkRight has 7 modules (Core, Sync, Flex, Squick, LifeOS, AutoFlow, LRB) each producing content that needs to be vector-indexed: agent profiles, workflows, knowledge articles, templates, configs, sidecars. Two fundamental questions:

1. **Isolation vs Sharing** — Should each module get its own vector collection, or should all vectors live in one shared collection with metadata filters?
2. **Cross-Module Queries** — When Flex needs to reference Sync's signal taxonomy, or LifeOS needs Squick's enterprise workflows, how does the retrieval work?

**What breaks if we don't solve this:**
- Without a clear namespace strategy, queries return irrelevant cross-module noise
- Without metadata schema, no way to filter, version, or audit vector content
- Without cross-module patterns, modules become information silos (defeats LinkRight's purpose)

---

## 2. Constraints (Non-Negotiable)

| Constraint | Impact |
|-----------|--------|
| MongoDB Atlas Vector Search (decided in 01/02 research) | Must use Atlas `$vectorSearch` aggregation pipeline |
| Solo developer, free/low-cost tiers | Can't run separate vector DB instances per module |
| 7 modules now, 20+ via LRB in future | Pattern must scale without config explosion |
| Hinglish content mixed with English | Embedding model must handle multilingual |
| Agent sidecars are per-agent, not per-module | Metadata needs agent-level granularity |
| Files are source of truth (one-way sync) | Vectors are derived, files are canonical |

---

## 3. Multi-Tenant Vector Isolation Patterns

### 3.1 Pattern Comparison Matrix

| Pattern | Description | Pros | Cons | Scale Behavior | Best For |
|---------|-------------|------|------|---------------|----------|
| **A. Collection-per-Module** | Separate MongoDB collection for each module (e.g., `vectors_sync`, `vectors_flex`) | Strong isolation; independent indexing; no filter overhead; simple mental model | Cross-module queries need union across collections; schema drift risk; connection overhead multiplies; index maintenance per collection | 7 modules = 7 collections (fine). 20+ = index memory pressure. Multi-user = collections × users explosion | Strict regulatory isolation, very large modules with distinct schemas |
| **B. Shared Collection + Metadata Filter** | Single `vectors` collection, `module` field in metadata, use `$vectorSearch` with `filter` | Single index to maintain; cross-module queries trivial (remove filter); simple backup/restore; consistent schema enforced | Filter overhead on every query; large index may degrade ANN recall; "noisy neighbor" if one module dominates vector count | Scales linearly with content. At 100K+ vectors, HNSW filter performance depends on selectivity. Multi-user = add `user_id` filter | Most SaaS multi-tenant systems, moderate-scale projects |
| **C. Shared Collection + Namespace Prefix** | Single collection, vectors namespaced by ID prefix (`sync:doc:001`) | No filter overhead for full-collection queries; namespace visible in IDs; easy to grep/debug | Prefix parsing is fragile; no built-in filter acceleration; cross-module = full scan; not idiomatic for MongoDB | Doesn't leverage MongoDB indexing well. Breaks at scale. | Prototyping, debugging, very small datasets |
| **D. Hybrid: Shared + Module Views** | Single base collection + MongoDB views per module (filtered) | Logical isolation without physical duplication; views are zero-cost; base collection for cross-module | Views can't have their own indexes; `$vectorSearch` may not work through views [NEEDS VERIFICATION]; adds abstraction layer | Views scale fine but query routing adds complexity | When you want isolation semantics without physical separation |
| **E. Index-per-Module (Atlas Search Index partitioning)** | Single collection, multiple Atlas Search indexes with different filter configs | Each module gets optimized index; cross-module via base index; no collection sprawl | Atlas free tier: limited indexes [NEEDS VERIFICATION — M0 tier limits]; index build time multiplies; more complex to manage | Index count = O(modules). Manageable at 20. Expensive beyond. | Performance-critical multi-tenant on paid Atlas tiers |

### 3.2 MongoDB Atlas `$vectorSearch` Filter Mechanics

```javascript
// How metadata filtering works in Atlas Vector Search
db.vectors.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: [0.1, 0.2, ...],  // 1536-dim
      numCandidates: 150,             // pre-filter candidate pool
      limit: 10,                      // final results
      filter: {
        // PRE-FILTER: applied BEFORE ANN search (efficient)
        "metadata.module": "sync",
        "metadata.content_type": { $in: ["workflow", "agent"] }
      }
    }
  },
  {
    $project: {
      content: 1,
      metadata: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
])
```

**Critical Detail:** Atlas Vector Search supports **pre-filtering** — the `filter` clause narrows the candidate set BEFORE the ANN traversal. This means metadata filters don't degrade recall the way post-filtering does. The `numCandidates` parameter controls the pre-filter pool size.

**Compound Index for Hybrid Queries:**

```javascript
// Atlas Search index definition with filter fields
{
  "mappings": {
    "fields": {
      "embedding": {
        "type": "knnVector",
        "dimensions": 1536,
        "similarity": "cosine"
      },
      "metadata.module": {
        "type": "token"       // indexed for pre-filtering
      },
      "metadata.content_type": {
        "type": "token"
      },
      "metadata.tags": {
        "type": "token"
      },
      "metadata.agent_id": {
        "type": "token"
      },
      "metadata.created_at": {
        "type": "date"
      }
    }
  }
}
```

**Performance Characteristics:**
- Pre-filter on `module` with 7 values: minimal overhead (~1-5% latency increase)
- Pre-filter on `module` + `content_type`: still fast if both are indexed as `token` type
- Pre-filter on high-cardinality fields (e.g., `file_path`): may increase latency
- `numCandidates` should be 10-20x `limit` for good recall with filters

### 3.3 Scale Analysis for Each Pattern

| Scale Point | Collection-per-Module (A) | Shared + Filter (B) | Hybrid Views (D) |
|------------|--------------------------|---------------------|-------------------|
| **1 module (now)** | Works, but overkill | Works perfectly | Unnecessary |
| **7 modules (current)** | 7 collections + 3 existing = 10 total. Manageable. | 1 collection, 7 filter values. Clean. | 1 base + 7 views. Fine. |
| **20+ modules (LRB future)** | 20+ collections = index memory concern on free tier. Cross-module queries = 20 aggregations. | 1 collection, `numCandidates` may need tuning. Still single index. | 20+ views. MongoDB view limit [NEEDS VERIFICATION]. |
| **Multi-user (product launch)** | Collections × users = explosion. Unviable. | Add `user_id` to filter. Single index still. | Views can't parameterize by user. |

---

## 4. LlamaIndex Namespace Handling

### 4.1 VectorStoreIndex with Metadata Filters

LlamaIndex's approach maps directly to Pattern B (shared collection + metadata filtering):

```python
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core.vector_stores import MetadataFilters, MetadataFilter, FilterOperator
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch

# Single vector store, shared across modules
vector_store = MongoDBAtlasVectorSearch(
    mongodb_client=client,
    db_name="linkright",
    collection_name="vectors",          # ONE collection
    vector_index_name="vector_index",
)

# Build index from module-specific documents
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = VectorStoreIndex.from_documents(
    documents,                           # documents have metadata attached
    storage_context=storage_context,
)

# Query with module filter
filters = MetadataFilters(
    filters=[
        MetadataFilter(key="module", value="sync", operator=FilterOperator.EQ),
        MetadataFilter(key="content_type", value="workflow", operator=FilterOperator.EQ),
    ]
)
query_engine = index.as_query_engine(filters=filters, similarity_top_k=10)
response = query_engine.query("How does JD optimization work?")
```

### 4.2 Multi-Index Pattern (for Collection-per-Module)

```python
# If using separate collections per module
indexes = {}
for module in ["sync", "flex", "squick", "lifeos", "autoflow", "lrb", "core"]:
    store = MongoDBAtlasVectorSearch(
        mongodb_client=client,
        db_name="linkright",
        collection_name=f"vectors_{module}",
        vector_index_name=f"vector_index_{module}",
    )
    indexes[module] = VectorStoreIndex.from_documents(
        module_docs[module],
        storage_context=StorageContext.from_defaults(vector_store=store),
    )

# Cross-module query requires custom routing
from llama_index.core.tools import QueryEngineTool
from llama_index.core.query_engine import RouterQueryEngine

tools = [
    QueryEngineTool.from_defaults(
        query_engine=indexes[mod].as_query_engine(),
        description=f"Searches {mod} module content"
    )
    for mod in indexes
]
router_engine = RouterQueryEngine.from_defaults(query_engine_tools=tools)
```

### 4.3 LlamaIndex Takeaway

- **Metadata filtering is the idiomatic approach** — LlamaIndex's `MetadataFilter` maps 1:1 to Atlas `$vectorSearch` filter
- Multi-index is supported but adds complexity (router query engine, LLM-based routing overhead)
- LlamaIndex `Document` objects carry metadata dict natively — easy to inject module/content_type at ingestion

---

## 5. LangChain Namespace Patterns

### 5.1 Collection Management

```python
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

# Shared collection approach
vectorstore = MongoDBAtlasVectorSearch(
    collection=db["vectors"],
    embedding=embeddings,
    index_name="vector_index",
    relevance_score_fn="cosine",
)

# Query with metadata filter (LangChain filter syntax)
results = vectorstore.similarity_search(
    "JD optimization workflow",
    k=10,
    pre_filter={
        "metadata.module": {"$eq": "sync"},
        "metadata.content_type": {"$in": ["workflow", "knowledge"]}
    }
)
```

### 5.2 Self-Query Retriever (Dynamic Filtering)

```python
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo

metadata_field_info = [
    AttributeInfo(name="module", description="LinkRight module name", type="string"),
    AttributeInfo(name="content_type", description="Type of content", type="string"),
    AttributeInfo(name="agent_id", description="Agent that owns this content", type="string"),
]

retriever = SelfQueryRetriever.from_llm(
    llm=llm,
    vectorstore=vectorstore,
    document_contents="LinkRight module content including workflows, agents, and knowledge",
    metadata_field_info=metadata_field_info,
)

# LLM auto-generates the filter from natural language
# "Find Sync module workflows about signal extraction"
# → filter: {module: "sync", content_type: "workflow"} + semantic: "signal extraction"
```

### 5.3 LangChain Takeaway

- LangChain's `MongoDBAtlasVectorSearch` supports `pre_filter` that maps directly to Atlas `$vectorSearch` filter
- Self-Query Retriever is powerful for LinkRight: agents can query in natural language and filters are auto-generated
- No built-in multi-collection federation — would need custom retriever class

---

## 6. Cross-Namespace Query Patterns

### 6.1 Pattern: Federated Search Across Modules

When a query needs results from multiple modules (e.g., "What signals from Sync are relevant to my Flex content strategy?"):

**Option A: Remove Filter (Query All)**
```python
# Simply don't apply module filter — searches everything
results = vectorstore.similarity_search("signal extraction for content", k=20)
# Returns mixed results from all modules, ranked by relevance
```

**Option B: Multi-Filter Union**
```python
# Explicitly search specific modules
results = vectorstore.similarity_search(
    "signal extraction for content",
    k=20,
    pre_filter={
        "metadata.module": {"$in": ["sync", "flex"]}  # union of modules
    }
)
```

**Option C: Parallel Search + Merge (for Collection-per-Module)**
```python
import asyncio

async def federated_search(query, modules, k_per_module=5):
    tasks = [
        search_module(query, module, k=k_per_module)
        for module in modules
    ]
    results = await asyncio.gather(*tasks)
    # Merge and re-rank by score
    merged = sorted(
        [r for batch in results for r in batch],
        key=lambda x: x.score,
        reverse=True
    )
    return merged[:k_per_module * 2]  # top results across modules
```

**Option D: Module Graph-Aware Routing**
```python
# Define module relationships for intelligent routing
MODULE_GRAPH = {
    "flex":   {"depends_on": ["sync", "core"], "shares_with": ["lifeos"]},
    "sync":   {"depends_on": ["core"], "shares_with": ["flex", "squick"]},
    "squick": {"depends_on": ["core", "sync"], "shares_with": []},
    "lifeos": {"depends_on": ["core"], "shares_with": ["flex", "sync"]},
}

def get_search_modules(primary_module, query_intent="related"):
    """Expand search to related modules based on dependency graph."""
    modules = {primary_module}
    if query_intent == "related":
        modules.update(MODULE_GRAPH[primary_module]["depends_on"])
        modules.update(MODULE_GRAPH[primary_module]["shares_with"])
    return list(modules)
```

### 6.2 Relevance Scoring Across Namespaces

When merging results from different modules, raw cosine scores may not be directly comparable (different content distributions). Normalization strategies:

1. **Score Normalization**: Min-max normalize within each module's results before merging
2. **Reciprocal Rank Fusion (RRF)**: Rank-based merging that's score-independent
   ```python
   def rrf_score(rank, k=60):
       return 1.0 / (k + rank)

   # Merge by sum of RRF scores across module result sets
   ```
3. **Module Boost**: Apply weight multiplier based on query-module relevance
   ```python
   MODULE_BOOST = {"sync": 1.2, "core": 1.0, "flex": 0.9}  # query-dependent
   ```

### 6.3 Recommendation for LinkRight

**Use Option B (Multi-Filter Union) as primary pattern.** Rationale:
- Single collection means cross-module is just changing the `$in` filter
- No merge/normalization complexity
- Atlas handles the ANN search holistically across filtered candidates
- Module Graph (Option D) can be layered on top to auto-expand the `$in` list

---

## 7. Universal Metadata Schema

### 7.1 Core Schema (Required for Every Vector)

```yaml
# Every vector document in the shared collection MUST have:
metadata:
  # === Identity ===
  module: "sync"                    # enum: core|sync|flex|squick|lifeos|autoflow|lrb|tea|cis
  content_type: "workflow"          # enum: see Section 8 taxonomy
  source_file: "_lr/sync/workflows/jd-optimize/README.md"  # relative to project root
  section_id: "step-14-signal-extraction"                    # unique within file
  chunk_index: 0                    # chunk position within section (0-based)

  # === Ownership ===
  agent_id: "sync-parser"           # owning agent (null for shared content)
  team: "sync-team"                 # team grouping

  # === Versioning ===
  version: "2.0"                    # content version (from file/frontmatter)
  content_hash: "sha256:a1b2c3..."  # hash of source content (for change detection)

  # === Temporal ===
  created_at: "2026-03-16T10:00:00Z"   # first indexed
  updated_at: "2026-03-16T10:00:00Z"   # last re-indexed
  source_modified: "2026-03-15T08:30:00Z"  # source file mtime

  # === Classification ===
  tags: ["signal", "jd", "optimization"]  # freeform tags
  phase: "B"                         # LinkRight phase (A-E) if applicable
  priority: "p0"                     # content priority if applicable
  language: "en"                     # content language (en|hi|hinglish)
```

### 7.2 Extended Fields (Optional, Content-Type Specific)

```yaml
# For workflow content
metadata_ext:
  workflow_id: "jd-optimize"
  step_number: 14
  step_count: 64
  workflow_phase: "signal-extraction"

# For agent content
metadata_ext:
  agent_persona: "Orion"
  agent_role: "Lead Signal Engineer"
  capabilities: ["parsing", "extraction", "matching"]

# For knowledge/reference content
metadata_ext:
  domain: "recruiter-intelligence"
  confidence: 0.85                  # knowledge confidence score
  source_authority: "primary"       # primary|secondary|derived

# For template content
metadata_ext:
  template_type: "resume-section"
  variables: ["company", "role", "signals"]
  output_format: "markdown"

# For sidecar/memory content
metadata_ext:
  sidecar_agent: "sync-parser"
  memory_type: "instruction"        # instruction|memory|lesson
  session_id: "session-2026-03-16"
```

### 7.3 Schema as MongoDB Document

```javascript
// Full vector document structure in MongoDB
{
  _id: ObjectId("..."),

  // Vector embedding
  embedding: [0.012, -0.034, ...],  // 1536 dimensions

  // Raw content (for retrieval display)
  content: "Step 14: Extract professional signals from...",

  // Structured metadata (all indexed for filtering)
  metadata: {
    module: "sync",
    content_type: "workflow",
    source_file: "_lr/sync/workflows/jd-optimize/README.md",
    section_id: "step-14-signal-extraction",
    chunk_index: 0,
    agent_id: "sync-parser",
    team: "sync-team",
    version: "2.0",
    content_hash: "sha256:a1b2c3d4e5f6...",
    created_at: ISODate("2026-03-16T10:00:00Z"),
    updated_at: ISODate("2026-03-16T10:00:00Z"),
    source_modified: ISODate("2026-03-15T08:30:00Z"),
    tags: ["signal", "jd", "optimization"],
    phase: "B",
    language: "en"
  },

  // Extended metadata (not indexed for vector search, but queryable via standard MongoDB)
  metadata_ext: {
    workflow_id: "jd-optimize",
    step_number: 14,
    step_count: 64
  }
}
```

### 7.4 Atlas Search Index Definition (Production)

```json
{
  "name": "vector_index",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "cosine"
      },
      {
        "type": "filter",
        "path": "metadata.module"
      },
      {
        "type": "filter",
        "path": "metadata.content_type"
      },
      {
        "type": "filter",
        "path": "metadata.agent_id"
      },
      {
        "type": "filter",
        "path": "metadata.tags"
      },
      {
        "type": "filter",
        "path": "metadata.phase"
      },
      {
        "type": "filter",
        "path": "metadata.language"
      },
      {
        "type": "filter",
        "path": "metadata.team"
      }
    ]
  }
}
```

---

## 8. Content Type Taxonomy

### 8.1 Taxonomy Mapping to LinkRight File Types

| Content Type | Description | LR File Examples | Module(s) | Avg Chunks |
|-------------|-------------|-----------------|-----------|------------|
| `agent` | Agent profile, persona, capabilities, instructions | `agents/sync-parser.md`, `_memory/*/instructions.md` | All | 3-8 |
| `workflow` | Workflow steps, procedures, decision trees | `workflows/jd-optimize/README.md`, step files | All | 10-50 |
| `config` | Module/system configuration | `config.yaml`, `lr-config.yaml`, `manifest.yaml` | All | 1-3 |
| `template` | Reusable output templates | `templates/resume-section.md` | Core, Sync, Flex | 2-5 |
| `knowledge` | Domain knowledge, reference material | `knowledge/signal-taxonomy.md`, viral mechanics | Sync, Flex, TEA | 5-20 |
| `checklist` | QA checklists, validation criteria | `tests/*.md`, QA workflows | TEA, Squick, LRB | 3-10 |
| `reference` | External references, patterns, best practices | `knowledge/recruiter-intelligence/` | Sync, TEA | 5-15 |
| `sidecar` | Agent memory, lessons, session history | `_memory/*/memories.md` | All | 2-10 |
| `manifest` | Registry files, manifests, ledgers | `_config/*-manifest.csv` | Core | 1-2 |
| `team` | Team composition, role definitions | `teams/` directories | Sync, Squick, LRB | 2-5 |
| `data` | Input data, examples, samples | `data/` directories | Flex, Sync | 3-15 |

### 8.2 Content Type Hierarchy

```
content_type (L1)
├── agent
│   ├── profile          # Agent definition and persona
│   ├── instruction      # Sidecar instructions
│   └── memory           # Sidecar accumulated memories
├── workflow
│   ├── overview         # Workflow README/summary
│   ├── step             # Individual workflow step
│   └── decision         # Decision tree / branching logic
├── knowledge
│   ├── domain           # Domain-specific knowledge
│   ├── pattern          # Reusable patterns / best practices
│   └── taxonomy         # Classification systems (signals, etc.)
├── config
│   ├── module           # Module-level config
│   ├── system           # System-level config
│   └── integration      # External integration config
├── template
│   ├── output           # Output generation template
│   └── prompt           # Prompt template
├── reference
│   ├── external         # External reference material
│   └── internal         # Cross-module reference
├── checklist
│   ├── qa               # Quality assurance
│   └── validation       # Input/output validation
├── sidecar              # (L1 only — no sub-types needed)
├── manifest             # (L1 only)
├── team                 # (L1 only)
└── data                 # (L1 only)
```

### 8.3 Usage in Queries

```javascript
// "Find all agent profiles in Sync module"
filter: { "metadata.module": "sync", "metadata.content_type": "agent" }

// "Find workflow steps about signal extraction"
filter: { "metadata.content_type": "workflow", "metadata.tags": "signal" }

// "Find all knowledge across Sync and Flex"
filter: { "metadata.content_type": "knowledge", "metadata.module": { $in: ["sync", "flex"] } }

// "Find sidecar memories for sync-parser agent"
filter: { "metadata.content_type": "sidecar", "metadata.agent_id": "sync-parser" }
```

---

## 9. MongoDB Atlas Specifics

### 9.1 `$vectorSearch` with Compound Filters

Atlas Vector Search pre-filtering uses the search index definition (Section 7.4) to narrow candidates before ANN traversal. Key behaviors:

- **`token` type fields**: Exact match filtering. Best for `module`, `content_type`, `agent_id`, `phase`
- **`date` type fields**: Range filtering. Best for `created_at`, `updated_at`
- **Array fields** (like `tags`): Token filter matches ANY element in the array
- **Compound filters**: Multiple filter fields are AND-ed together

```javascript
// Compound filter example: Sync workflows from Phase B, tagged "signal"
db.vectors.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 200,
      limit: 10,
      filter: {
        $and: [
          { "metadata.module": "sync" },
          { "metadata.content_type": "workflow" },
          { "metadata.phase": "B" },
          { "metadata.tags": "signal" }
        ]
      }
    }
  }
])
```

### 9.2 Hybrid Search (Vector + Full-Text)

For queries that benefit from both semantic and keyword matching:

```javascript
// Step 1: Vector search
{ $vectorSearch: { ... } }

// Step 2: Full-text search on same collection (requires separate Atlas Search index)
{ $search: { text: { query: "JD optimization", path: "content" } } }

// Step 3: Combine with $unionWith or RRF in application layer
```

**VERIFIED (March 2026):** As of MongoDB 8.0/8.1, `$vectorSearch` and `$search` (full-text) CAN be combined in a single aggregation pipeline via the native `$rankFusion` stage. RRF is natively supported with a fixed smoothing constant of 60. Weights can be assigned per pipeline (e.g., vector: 0.7, text: 0.3). MongoDB 8.2 adds `$scoreFusion` for explicit mathematical score combination as an alternative to RRF.

### 9.3 Index Size and Free Tier Limits

| Tier | Vector Dimensions | Max Vectors (est.) | Search Indexes | Filter Fields |
|------|------------------|--------------------|----------------|---------------|
| M0 (Free) | 1536 | ~50K | 3 per collection [NEEDS VERIFICATION] | Limited by index definition |
| M10 (Paid) | 1536 | ~500K | 10+ per collection | Generous |
| M30+ | 1536 | Millions | Unlimited practical | Unlimited practical |

**For LinkRight at current scale:**
- ~750 files × avg 5 chunks = ~3,750 vectors
- Well within M0 free tier limits
- Single search index with 8 filter fields is sufficient

### 9.4 Standard MongoDB Indexes (Non-Vector)

In addition to the Atlas Search vector index, create standard MongoDB indexes for administrative queries:

```javascript
// For content management (not vector search)
db.vectors.createIndex({ "metadata.source_file": 1 })           // find vectors by source file
db.vectors.createIndex({ "metadata.content_hash": 1 })          // change detection
db.vectors.createIndex({ "metadata.module": 1, "metadata.content_type": 1 })  // admin listing
db.vectors.createIndex({ "metadata.updated_at": -1 })           // staleness detection
```

---

## 10. Recommendation

### Primary Pattern: Shared Collection + Metadata Filtering (Pattern B)

**Decision:** Use a single `vectors` collection with mandatory metadata on every document.

**Rationale:**

1. **Simplicity** — One collection, one index, one schema. Solo dev can't afford N collections × N indexes maintenance burden.
2. **Cross-module queries are free** — Just change the `filter` clause. No federation, no merging, no score normalization.
3. **Scale path is clear** — At 7 modules (~3,750 vectors), M0 tier handles it. At 20+ modules (~20K vectors), still fine. At multi-user, add `user_id` to filter — same pattern.
4. **Atlas pre-filtering is efficient** — Filter narrows before ANN, not after. Module filter with 7 values has negligible overhead.
5. **LlamaIndex and LangChain both prefer this pattern** — Their MongoDB integrations are optimized for metadata filtering on a shared collection.
6. **Future escape hatch** — If a module grows massive (100K+ vectors), can shard it to its own collection later. The metadata schema is the same either way.

**What we're NOT doing:**
- Not Collection-per-Module (Pattern A): premature complexity, cross-module penalty
- Not Namespace Prefix (Pattern C): doesn't leverage MongoDB indexing
- Not Hybrid Views (Pattern D): uncertain `$vectorSearch` support through views
- Not Index-per-Module (Pattern E): free tier index limits

### Migration Path from Current ChromaDB Config

The current `chromadb-config.yaml` defines 3 collections: `resumes`, `job_descriptions`, `professional_signals`. In the new design:

```yaml
# OLD (ChromaDB — 3 separate collections)
collections:
  resume_embeddings: { name: "resumes" }
  jd_embeddings: { name: "job_descriptions" }
  signal_library: { name: "professional_signals" }

# NEW (MongoDB Atlas — 1 collection, metadata-differentiated)
collection: "vectors"
# resume content    → metadata.content_type: "data", metadata.tags: ["resume"]
# JD content        → metadata.content_type: "data", metadata.tags: ["jd"]
# signal library    → metadata.content_type: "knowledge", metadata.tags: ["signal"]
# + all other module content with appropriate metadata
```

### Decision Needed

> **For Satvik:** Confirm shared-collection approach (Pattern B). The only reason to reconsider is if you foresee strict data isolation requirements between modules (e.g., different access controls per module for future multi-user). In that case, we'd pivot to Pattern A (collection-per-module) or Pattern E (index-per-module).

---

## 11. Summary: Schema Quick Reference

```yaml
# Minimum viable vector document
{
  embedding: float[1536],
  content: string,
  metadata: {
    module: enum[core|sync|flex|squick|lifeos|autoflow|lrb|tea|cis],
    content_type: enum[agent|workflow|config|template|knowledge|checklist|reference|sidecar|manifest|team|data],
    source_file: string,       # relative path
    section_id: string,        # unique within file
    chunk_index: int,          # position in section
    agent_id: string|null,     # owning agent
    team: string|null,         # team grouping
    version: string,           # content version
    content_hash: string,      # sha256 of source
    created_at: datetime,
    updated_at: datetime,
    source_modified: datetime,
    tags: string[],
    phase: string|null,        # A-E
    language: string            # en|hi|hinglish
  }
}
```

**Indexed filter fields** (in Atlas Search index): `module`, `content_type`, `agent_id`, `tags`, `phase`, `language`, `team`

**Standard MongoDB indexes**: `source_file`, `content_hash`, `module+content_type` compound, `updated_at`

---

## 12. Latest Findings (March 2026 — External Research)

> **Source:** Gemini Deep Research report, verified March 17, 2026.

### 12.1 MongoDB Pre-Filter Performance (Measured Data)

- **Filter selectivity impact:** In 15.3M vector tests, a **3% selective filter** (restricting to ~500K items) made queries approximately **4x more expensive** (compute/latency) to maintain 90–95% recall when using binary quantization vs. unfiltered queries.
- **Token-type filters:** Pre-filtering with discrete values maintains sub-100ms latency for most workloads under 10M vectors.
- **ENN fallback:** If the filter is too restrictive, the engine switches to Exact Nearest Neighbor scan within the filtered subset — maintains sub-second latency for up to 10,000 matching documents.
- **Future improvement:** Lucene 10 (Acorn-1 search strategies) expected to reduce the "selective filter penalty" in upcoming MongoDB 8.x patches.
- **Implication for LinkRight:** Module-level filtering (7 values) is ~14% selectivity — well above the 3% danger zone. Compound filters on `module` + `content_type` remain safe. High-cardinality filters (e.g., `agent_id` across many agents) should be tested.

### 12.2 Metadata Isolation Pattern — Confirmed Best Practice

- **Pattern A (Shared Collection + Pre-filtering) confirmed as best for <100K tenants** by MongoDB architects and Gemini research. This matches our Section 10 recommendation.
- Pinecone comparison: supports up to 100,000 namespaces per index, but MongoDB architects prefer metadata-based isolation to leverage transactional joins with other tenant data.
- **Case study:** General Intelligence Co ("Cofounder" AI) uses LlamaIndex + MongoDB with continuous 30-minute ingestion cycles, citing lower costs than managed-only RAG solutions.

### 12.3 LlamaIndex / LangChain MongoDB Integration Updates

- **Hybrid search:** Both frameworks now natively support the `$rankFusion` stage (RRF) introduced in MongoDB 8.0 — single call combines semantic and keyword results.
- **Async support:** Both integrations support full async vector search methods for non-blocking agent loops.
- **LangChain SelfQueryRetriever:** Confirmed working with Atlas filter syntax — supports `$eq`, `$lt`, `$gt`, `$and`, `$or` operators. Note: complex array filters must be mapped to the `filter` type in the index definition.
- **LlamaIndex Agentic Document Processing:** Evolved into durable workflows that survive crashes via DBOS integration. New features: LlamaSplit (beta, auto document sectioning), LlamaSheets (spreadsheet parsing with hierarchical headers).

### 12.4 Atlas M0 / Flex Tier Limits (Verified March 2026)

| Limit | M0 Free Tier | Flex Tier |
|-------|-------------|-----------|
| **Search Indexes** | Max 3 total | Max 10 total |
| **Max Dimensions** | 8192 | 8192 |
| **Storage** | 512 MB | 5 GB |
| **Throughput** | 100 ops/sec | 500 ops/sec |
| **Cost** | Free | ~$8-30/month ($0.011/hr) |

**Recommendation update:** For LinkRight's "7 scaling to 20" module plan, start with **Flex tier** (not M0) — 10 indexes and 5GB storage provide adequate headroom. Scale to M10/M20 when approaching 50K vectors.

---

## 13. Deep Research Prompt for External AI

> Use this prompt with a frontier model (GPT-4o, Claude, Gemini) that has web access to get the latest benchmarks and real-world data.

---

**Prompt:**

I'm designing a vector namespace and metadata schema for a multi-module AI agent orchestration system (7 modules now, scaling to 20+). I've decided on MongoDB Atlas Vector Search with a shared-collection approach using metadata pre-filtering. My embedding model is text-embedding-3-small (1536 dimensions) and I expect 5,000-50,000 vectors.

Please research and provide the following with sources (URLs, paper citations, or documentation links):

1. **MongoDB Atlas Vector Search pre-filter performance benchmarks (2025-2026)**: What is the measured latency impact of pre-filtering on `$vectorSearch` with token-type filter fields? Specifically: (a) filtering on 1 field with 7-20 discrete values, (b) compound filtering on 2-3 fields, (c) array field filtering (tags). I need actual benchmark numbers, not theoretical claims. Check MongoDB engineering blog posts, Atlas documentation changelog, and community benchmarks.

2. **MongoDB Atlas M0 (free tier) vector search limits as of 2026**: Exact limits on (a) number of Atlas Search indexes per collection, (b) maximum vector dimensions supported, (c) maximum documents with vector embeddings, (d) `numCandidates` ceiling, (e) any throttling on `$vectorSearch` queries per second. Check the official Atlas pricing/limits page and MongoDB community forums.

3. **LlamaIndex `MongoDBAtlasVectorSearch` latest features (v0.11+)**: Does the latest LlamaIndex MongoDB integration support (a) hybrid search (vector + full-text in one call), (b) metadata auto-extraction from documents, (c) async vector search, (d) batch upsert with deduplication? Check LlamaIndex GitHub releases, documentation, and changelog.

4. **LangChain `MongoDBAtlasVectorSearch` latest features (v0.3+)**: Same questions as above for LangChain's MongoDB integration. Additionally: does the `SelfQueryRetriever` work correctly with MongoDB Atlas filter syntax? Any known issues? Check LangChain GitHub issues and documentation.

5. **Real-world multi-tenant vector search architectures**: Find 2-3 case studies or blog posts from companies running multi-tenant vector search on MongoDB Atlas (or similar). How do they handle namespace isolation? What metadata schema do they use? What scale are they operating at? Check MongoDB customer stories, engineering blogs (Notion, Canva, etc.), and conference talks (MongoDB.local, AI Engineer Summit).

6. **MongoDB Atlas combined vector + full-text search**: As of 2026, can `$vectorSearch` and `$search` (full-text) be combined in a single aggregation pipeline? Is Reciprocal Rank Fusion (RRF) supported natively, or must it be done in the application layer? Check MongoDB 8.x release notes and Atlas Search documentation.

7. **Embedding model comparison for mixed-language content (English + Hindi/Hinglish)**: How does `text-embedding-3-small` perform on Hinglish content vs alternatives like Cohere embed-v3, Voyage-3, or open-source multilingual models (BGE-M3, multilingual-e5-large)? Any benchmarks on MIRACL or similar multilingual retrieval benchmarks? Check MTEB leaderboard, Cohere blog, and academic papers.

For each finding, please provide: the specific data/benchmark, the source URL, and the date of the source. Flag anything that may have changed since your training cutoff.

---
