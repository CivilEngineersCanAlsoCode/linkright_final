# Phase 1 DATA Layer — Recommendations for Decision Lock

> Based on combined research: 6 internal research docs + 2 rounds of external deep research (March 2026)
> These are Raju's recommendations. Each needs Satvik's approval to LOCK.

---

## Decision 1: Vector Database Choice

### 🏆 Recommendation: **Qdrant**

**Why Qdrant:**
- **Performance**: 8ms p50 latency @1M vectors, ~24ms @100M. 98% recall. Best-in-class for pure vector search.
- **Multi-tenancy**: Native support — collection-per-tenant OR payload-based isolation. Built for SaaS from day 1.
- **Hybrid cloud**: Qdrant Operator on your Kubernetes + Qdrant Cloud control plane. Data stays on-prem when needed.
- **Cost**: Free 1GB cloud tier → Starter $25/mo → Production ~$150/mo @10M vectors. Self-host on AWS ~$270/mo.
- **Local dev parity**: Same OSS binary runs locally and in cloud. Same API everywhere.
- **Open source**: Apache 2.0. No vendor lock-in. Full self-host option forever.
- **Ecosystem**: First-class LlamaIndex + LangChain support. gRPC + REST APIs. Rust-based (fast, memory-safe).

**Why NOT the others:**
| Option | Why Not |
|--------|---------|
| MongoDB Atlas | $5K-70K/yr at production scale. Overkill cost for a bootstrapped SaaS. Vector search is secondary to their document DB business. |
| pgvector | 471 QPS at 99% recall is impressive, but we're not already on Postgres. Adding Postgres just for vectors = unnecessary dependency. Scale ceiling at ~50M vectors. |
| ChromaDB | Great for prototyping, not for multi-tenant SaaS. No clustering, concurrent access issues, max 5M records/collection. |
| Pinecone | Proprietary, vendor lock-in, linear cost scaling. $200-300/mo for our scale, can't self-host. |
| Weaviate | Good hybrid search, but Qdrant's pure vector performance is better. Weaviate is more complex to operate. |
| Milvus | Designed for massive scale (100M-B vectors). Overkill complexity for our scale. Complex self-hosting (needs GPUs or large RAM). |
| Turbopuffer | $64/mo minimum, used by Cursor/Notion — tempting. BUT no self-host, proprietary, can't inspect internals. SaaS needs control. |

**Migration path**: Start with Qdrant Cloud free tier → Starter $25/mo → Self-host when cost justifies.

### Decision needed: **Lock Qdrant as vector DB? Y/N**

---

## Decision 2: Embedding Model

### 🏆 Recommendation: **OpenAI text-embedding-3-small (1536d)** as default, with **Matryoshka at 512d** for storage optimization

**Why text-embedding-3-small:**
- **Cost**: $0.02/1M tokens — cheapest production-quality option. Full re-index of 500 files (~2MB) costs < $0.10.
- **Quality**: 62.3 MTEB retrieval — not the best, but sufficient for structured document retrieval.
- **Matryoshka support**: Can truncate to 512d or 256d for faster search with minimal quality loss (~96% recall preserved).
- **Ecosystem**: Universal support. Every framework, every vector DB. Zero integration friction.
- **Context window**: 8,191 tokens — enough for our chunk sizes.

**Why NOT the others:**
| Option | Why Not |
|--------|---------|
| Voyage-4-Large | Best benchmarks (beats OpenAI by 14%), but $0.12/1M tokens = 6x more expensive. Consider upgrading later when revenue justifies. |
| Jina-v5 | 71.7 MTEB retrieval (top), $0.05/1M tokens. Strong contender but newer, less ecosystem maturity. |
| Cohere embed-v4 | $0.12/1M. Good but expensive. No significant advantage over OpenAI for our use case. |
| Local models (BGE-M3, nomic) | Free but needs GPU. Our EC2 doesn't have GPU. Break-even vs API is ~10M tokens/month — not there yet. |
| MuRIL (Hinglish) | 87.3% intent accuracy for Hinglish. BUT: only relevant for LifeOS/Flex modules where Hinglish content exists. Not a general choice. |

**Hinglish strategy**: Use transliteration (Romanized Hindi → Devanagari) as preprocessing before embedding. This boosts accuracy ~3% F1 without changing the base model.

**Upgrade path**: Start with OpenAI 3-small → Switch to Voyage-4 or Jina-v5 when scale/revenue justifies. Store raw text in Dolt so re-embedding is just an API call, not data recovery.

### Decision needed: **Lock OpenAI text-embedding-3-small (1536d, Matryoshka 512d)? Y/N**

---

## Decision 3: Chunking Strategy

### 🏆 Recommendation: **Hybrid approach — structure-aware parsing + fixed-size fallback**

**The strategy:**
1. **Markdown files**: Use LlamaIndex `MarkdownNodeParser` — splits by headings, preserves section hierarchy. Extract YAML frontmatter as metadata (not as content).
2. **YAML configs**: Custom parser using PyYAML — chunk by top-level keys or logical groups. Each key-value group = one chunk.
3. **CSV files**: Row-per-document — each row becomes one chunk with column headers as context.
4. **Code files**: Tree-sitter based parsing (function/class level chunks).
5. **Fallback**: For any content that doesn't fit above → `RecursiveCharacterTextSplitter` at 512 tokens with 50-token overlap.

**Why this approach:**
- No magic "schema-aware" chunker exists (confirmed by research). Custom parsers are the production standard.
- 512 tokens is the sweet spot — research shows it often OUTPERFORMS semantic chunking because semantic creates 3-5x more fragments (more noise, higher cost).
- Structure-aware parsing preserves meaning better than blind splitting.

**Why NOT:**
| Option | Why Not |
|--------|---------|
| Pure semantic chunking | Creates 3-5x more vectors. More noise, higher storage cost. Research shows 512-token recursive often beats it. |
| Agentic/LLM chunking | Experimental, slow (needs LLM call per chunk), expensive. Not production-ready. |
| Fixed-size only | Loses document structure. A 512-token chunk might split a YAML config mid-key. |

### Decision needed: **Lock hybrid chunking (structure-aware + 512-token fallback)? Y/N**

---

## Decision 4: Namespace & Metadata Design

### 🏆 Recommendation: **Single Qdrant collection per user, metadata filtering per module**

**The design:**
- **One collection per user/tenant** (for SaaS isolation)
- **Within collection**: filter by `module_id` metadata field
- **Cross-module queries**: Same collection, just remove/change the module filter
- **Metadata schema for every vector**:
  ```yaml
  module_id: "flex"          # Which module owns this
  content_type: "agent"      # agent|workflow|config|template|knowledge|checklist|reference
  file_path: "flex/agents/content-strategist.md"
  section_id: "## Strategy"  # Heading or section within file
  version: "abc123"          # Git commit hash
  tags: ["linkedin", "content"]
  created_at: "2026-03-16"
  updated_at: "2026-03-16"
  ```

**Why this approach:**
- Qdrant handles metadata filtering efficiently with payload indexes
- One collection per tenant = clean SaaS isolation (GDPR compliant)
- Metadata filtering within collection = fast cross-module queries without federation
- Avoids collection explosion (6 modules × 1000 users = 6000 collections is unmaintainable)

**Why NOT collection-per-module:**
- Cross-module queries require federation (slow, complex)
- Collection management overhead scales linearly with modules × users
- Qdrant recommends payload-based isolation for < 100K tenants

### Decision needed: **Lock single-collection-per-user + metadata filtering? Y/N**

---

## Decision 5: Source of Truth & Sync Strategy

### 🏆 Recommendation: **Files = source of truth. Git webhook → queue → worker → embed → upsert.**

**The design:**
1. **Source of truth**: Git repo (markdown/YAML/CSV files)
2. **Vectors**: Derived index, NOT source of truth. Can be rebuilt from files anytime.
3. **Change detection**: Content hashing (hash each file, compare with stored hash in Dolt)
4. **Sync trigger**: 
   - **Dev**: CLI command (`lr sync`) that detects changes and re-embeds
   - **SaaS**: GitHub webhook → message queue (Redis/SQS) → worker → embed → upsert to Qdrant
5. **Deletion**: When file is deleted from git, corresponding vectors are removed (tracked via `file_path` metadata)
6. **Raw text storage**: Store original chunk text in Dolt alongside the file hash. This enables re-embedding with a different model without re-reading files.

**Why this approach:**
- Git is already the collaboration layer. Don't fight it.
- Content hashing is simpler and more reliable than git hooks (hooks are fragile)
- Storing raw text in Dolt protects against embedding model lock-in (Decision 2 upgrade path)
- Queue-based architecture scales from 1 user to 100K users
- Chroma Sync is tempting but ties us to ChromaDB (and we chose Qdrant)

**Why NOT:**
| Option | Why Not |
|--------|---------|
| Bidirectional sync | Unnecessary complexity. Vectors are derived, not authoritative. |
| Git hooks | Fragile. Break on rebases. Not available in SaaS (users' repos). |
| File watchers (inotify) | Only works locally. Doesn't scale to SaaS. |
| Chroma Sync | Tied to Chroma Cloud. We chose Qdrant. |

### Decision needed: **Lock files-as-source + webhook/queue sync? Y/N**

---

## Decision 6: Beads/Dolt Persistence & Access Strategy

### 🏆 Recommendation: **Dolt stays. MCP for IDE clients. REST API for ChatGPT. Optimistic locking for concurrency.**

**The design:**
1. **Database**: Dolt 2.0 (MySQL-compatible, git-for-data). Keep it.
2. **Access pattern**:
   - **MCP clients** (Claude Code, Cursor, Windsurf): One MCP server exposing task tools (`beads_list`, `beads_update`, `beads_create`, etc.)
   - **ChatGPT**: REST API via Express.js → ChatGPT Actions (OpenAPI schema)
   - **SaaS web app**: Same REST API
3. **ChatGPT state**: Session-start state load (Option A). On first Action call, return current task summary (open tasks, recent changes). ~500-2000 tokens.
4. **Concurrency**: Optimistic locking with version counter. `UPDATE tasks SET status='X', version=version+1 WHERE id=Y AND version=old`. Retry on conflict.
5. **Backup**: DoltHub Pro ($50/mo, 1GB) for cloud backup + multi-device sync.
6. **Task serialization**: YAML for now (proven, universal). Evaluate TOON later when adoption grows.

**Why this approach:**
- Dolt 2.0 is as fast as MySQL now (0.96x sysbench). No reason to migrate.
- MCP is THE standard for AI client access (1000+ servers, all major clients support it)
- Optimistic locking is simpler than branch-per-agent (no merge conflicts)
- Session-start load is most reliable for ChatGPT (confirmed by research)
- DoltHub Pro is cheap insurance ($50/mo)

**Why NOT:**
| Option | Why Not |
|--------|---------|
| Branch-per-agent | Merge conflicts on shared tasks. Optimistic locking is simpler. Reserve branching for "what-if" scenarios only. |
| TOON serialization | Too new. Minimal adoption. Libraries exist but ecosystem is immature. Revisit in 6 months. |
| ChatGPT persistent memory | Not developer-controllable. Can't store structured task hierarchy. |
| Migrate to PostgreSQL | No reason. Dolt 2.0 matches MySQL. DoltgreSQL is still beta. |

### Decision needed: **Lock Dolt + MCP + REST + optimistic locking? Y/N**

---

## Decision 7: Overall Architecture (Split vs Unified)

### 🏆 Recommendation: **Split architecture — Qdrant for vectors + Dolt for tasks/state**

**Why split:**
- Each tool does what it's best at. Qdrant = fast vector search. Dolt = versioned task management.
- Independent scaling. Vector load ≠ task load.
- No single point of failure.
- Industry consensus: most production RAG systems use split architecture.

**Why NOT unified (MongoDB for everything):**
- MongoDB Atlas is $5K-70K/yr at production scale
- Vector search is a secondary feature for MongoDB, primary for Qdrant
- Dolt's git-for-data branching/diffing is unique — MongoDB can't replicate this

**The stack:**
```
┌─────────────────────────────────────────┐
│           AI Clients                     │
│  Claude Code │ Cursor │ ChatGPT │ Web   │
└──────┬───────┴────┬───┴────┬────┴───┬───┘
       │            │        │        │
       ▼            ▼        ▼        ▼
┌──────────────┐  ┌──────────────────────┐
│  MCP Server  │  │    REST API          │
│  (tasks +    │  │  (Express.js)        │
│   vectors)   │  │  ChatGPT Actions     │
└──────┬───────┘  └──────┬───────────────┘
       │                 │
  ┌────┴────┐      ┌────┴────┐
  │  Dolt   │      │ Qdrant  │
  │ (tasks) │      │(vectors)│
  └─────────┘      └─────────┘
       │                 │
  ┌────┴────┐      ┌────┴────┐
  │ DoltHub │      │ Qdrant  │
  │ (backup)│      │  Cloud  │
  └─────────┘      └─────────┘
```

### Decision needed: **Lock split architecture (Qdrant + Dolt)? Y/N**

---

## Summary: All 7 Decisions

| # | Decision | Recommendation | Monthly Cost (start) |
|---|----------|---------------|---------------------|
| 1 | Vector DB | Qdrant | Free → $25/mo |
| 2 | Embedding Model | OpenAI text-embedding-3-small (512d Matryoshka) | ~$0.10/re-index |
| 3 | Chunking | Hybrid (structure-aware + 512-token fallback) | $0 |
| 4 | Namespace | Single collection per user + metadata filtering | $0 |
| 5 | Sync | Files-as-source + webhook/queue pipeline | $0 |
| 6 | Tasks/State | Dolt + MCP + REST API + optimistic locking | $50/mo (DoltHub) |
| 7 | Architecture | Split (Qdrant + Dolt) | Combined above |

**Total starting cost: ~$75/mo** (Qdrant $25 + DoltHub $50)
**At 10K users: ~$420/mo** (Qdrant $150-270 + DoltHub $250)

---

*Ready for decision lock. Go through each, say Y or N. Any N = we discuss further.*
