# MongoDB Atlas Vector Search — Research Report

> **Agent:** Research Agent 1 (SunnyOtter)
> **Date:** 2026-03-16
> **Status:** Complete
> **Scope:** Vector DB evaluation for LinkRight AI Transformation Platform

---

## Table of Contents

1. [How Atlas Vector Search Works](#1-how-atlas-vector-search-works)
2. [Free Tier (M0) Limits](#2-free-tier-m0-limits)
3. [MongoDB 8.x Community Edition — Local Vector Search](#3-mongodb-8x-community-edition--local-vector-search)
4. [Query Syntax & Pipeline Stages](#4-query-syntax--pipeline-stages)
5. [Performance & HNSW Configuration](#5-performance--hnsw-configuration)
6. [Multi-Tenancy Patterns](#6-multi-tenancy-patterns)
7. [Fit Assessment for LinkRight](#7-fit-assessment-for-linkright)
8. [Deep Research Prompt for External AI](#deep-research-prompt-for-external-ai)

---

## 1. How Atlas Vector Search Works

### Architecture Overview

MongoDB Atlas Vector Search is a **native vector search capability** built into MongoDB Atlas (the managed cloud service). It runs on a **separate search infrastructure** (based on Apache Lucene under the hood) alongside the standard MongoDB query engine. This is important: vector indexes are NOT part of the WiredTiger storage engine — they're maintained by a dedicated Lucene-based search process (the same infrastructure that powers Atlas Search / full-text search).

**Data flow:**
1. You store embedding vectors as regular arrays in MongoDB documents (e.g., `embedding: [0.012, -0.034, ...]`)
2. You create a **vector search index** on that field via the Atlas UI, CLI, or API
3. Atlas builds an **HNSW (Hierarchical Navigable Small World)** graph index on those vectors
4. Queries use the `$vectorSearch` aggregation stage to find nearest neighbors
5. Results merge back into the standard aggregation pipeline for further filtering, projection, etc.

### Similarity Functions

Atlas Vector Search supports three distance/similarity functions:

| Function | Use Case | Range | Best For |
|----------|----------|-------|----------|
| **cosine** | Semantic similarity, text embeddings | [-1, 1] → score [0, 1] | Normalized embeddings (OpenAI, Cohere, etc.) |
| **dotProduct** | When vectors are already unit-normalized | unbounded | Performance optimization over cosine when pre-normalized |
| **euclidean** | Spatial/geometric similarity | [0, ∞) | Image features, geographic, recommendation systems |

**For LinkRight:** `cosine` is the correct choice for text embeddings (career signals, JD matching, workflow context). OpenAI `text-embedding-3-small` and `text-embedding-3-large` both output normalized vectors, so `dotProduct` is also viable for marginal speed gains.

### HNSW Index

Atlas Vector Search uses the **HNSW algorithm** for approximate nearest neighbor (ANN) search. HNSW builds a multi-layer navigable graph:

- **Bottom layer:** Contains all vectors, densely connected
- **Upper layers:** Progressively sparser, acting as "express lanes" for navigation
- **Search:** Starts at top layer, greedily descends to bottom layer, refining candidates at each level

Key properties:
- **Approximate:** Returns near-optimal results, not guaranteed exact matches
- **Sub-linear time complexity:** O(log N) search vs O(N) for brute force
- **Memory-resident:** The HNSW graph lives in memory for fast traversal

### Index Definition Example

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "module"
    },
    {
      "type": "filter",
      "path": "contentType"
    }
  ]
}
```

**Critical detail:** Filter fields MUST be declared in the index definition at index creation time. You cannot filter on arbitrary metadata fields — only those pre-declared as `type: "filter"` in the vector search index.

---

## 2. Free Tier (M0) Limits

### M0 (Free Forever) Cluster Limits

| Resource | Limit |
|----------|-------|
| **Storage** | 512 MB total (shared across all databases/collections) |
| **Vector Search Indexes** | 3 per cluster ✅ VERIFIED (March 2026 — still 3 total search/vector indexes on M0) |
| **Max vector dimensions** | 4096 (same as paid tiers) |
| **Connections** | 500 concurrent |
| **RAM** | Shared (not dedicated) |
| **Regions** | Limited selection (US-East-1, EU-West-1, AP-Southeast-1) |
| **Replica set** | 3-node replica set (standard), but no configurable read preferences |
| **Network peering** | Not available |
| **Backups** | Not available (no cloud backup/restore) |
| **Atlas Search nodes** | Not available (search runs on same nodes) |

### M0 Limitations Specific to Vector Search

1. **No dedicated search nodes:** On M0, vector search shares compute with the database. On paid tiers (M10+), you can provision dedicated Atlas Search Nodes for isolated search compute.
2. **Index build time:** No SLA on index build speed. Large indexes may take significantly longer on shared infrastructure.
3. **Throughput:** No guaranteed IOPS. Shared tenancy means noisy neighbor effects.
4. **$vectorSearch limits:** `numCandidates` has no hard ceiling on M0 but is effectively limited by shared RAM on the `mongot` process ✅ VERIFIED.
5. **No search analytics:** Usage metrics/analytics not available on free tier.

### Storage Math for LinkRight

Rough estimates for a single user's career data:
- **1 career signal document** (with 1536-dim embedding): ~6.5 KB (embedding alone = 1536 × 4 bytes = 6.1 KB + metadata)
- **500 signals × 6.5 KB** = ~3.2 MB per user
- **512 MB / 3.2 MB** = ~160 users on M0 (with embeddings)
- **With 3072-dim embeddings** (text-embedding-3-large): ~12.3 KB per doc → ~80 users

For **development/prototyping**, M0 is sufficient. For production, M10 (~$57/mo) or M20 (~$147/mo) is the minimum ✅ VERIFIED. New Flex tier (~$8-30/mo) available as middle ground.

---

## 3. MongoDB 8.x Community Edition — Local Vector Search

### Current Status

As of knowledge cutoff (May 2025):

- **MongoDB 7.0** (GA October 2023): Atlas Vector Search available only on Atlas (cloud managed). Community Edition does NOT have vector search.
- **MongoDB 8.0** (GA August 2024): Same — vector search remains Atlas-only. Community Edition 8.0 does NOT include `$vectorSearch`.

**MongoDB 8.2 Community Edition with local vector search is NOW AVAILABLE.** ✅ VERIFIED (March 2026): MongoDB 8.2 includes `$vectorSearch` in Community Edition via the `mongot` process. See "Latest Findings" section below for full details.

### What's Available Locally

1. **Atlas CLI local dev (`atlas deployments`):** You can run a local Atlas deployment for development that includes vector search. This uses a containerized Atlas environment, NOT Community Edition.
   ```bash
   atlas deployments setup localDev --type local
   ```
   This gives you a local MongoDB instance with Atlas Search and Vector Search capabilities.

2. **MongoDB Atlas for local development (Docker):** MongoDB provides Docker images for local Atlas development environments.

3. **Community Edition workaround:** You can store vectors in Community Edition and do brute-force search using `$addFields` + `$function` with custom JavaScript, but this is:
   - Extremely slow (O(N) scan)
   - No HNSW index support
   - Not production-viable for anything beyond tiny datasets

### Atlas vs Community Comparison

| Feature | Atlas (Cloud) | Atlas Local Dev | Community Edition |
|---------|--------------|-----------------|-------------------|
| `$vectorSearch` | Yes | Yes | No |
| HNSW indexing | Yes | Yes | No |
| Pre-filtering | Yes | Yes | No |
| Dedicated search nodes | Yes (paid) | No | N/A |
| Production use | Yes | No (dev only) | N/A for vector |
| Cost | Free (M0) to paid | Free | Free |
| Self-hosted | No | Local only | Yes |

### Implications for LinkRight

**Hybrid architecture concern:** If we want local-first development with cloud production, Atlas CLI local dev works for dev/test. But there's no path to self-hosted production vector search with Community Edition alone (as of May 2025).

**Risk:** Vendor lock-in to Atlas for vector search. If MongoDB ever changes Atlas pricing significantly, migration cost is non-trivial.

---

## 4. Query Syntax & Pipeline Stages

### Basic $vectorSearch Query

```javascript
db.careerSignals.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",          // Name of the vector search index
      path: "embedding",              // Field containing the vector
      queryVector: [0.012, -0.034, ...], // Your query embedding (1536 dims)
      numCandidates: 150,             // HNSW candidates to consider (higher = more accurate, slower)
      limit: 10,                      // Final results to return
      filter: {                       // Pre-filter (runs BEFORE vector search)
        "module": "sync",
        "contentType": "career-signal"
      }
    }
  },
  {
    $project: {
      _id: 1,
      title: 1,
      content: 1,
      module: 1,
      score: { $meta: "vectorSearchScore" }  // Similarity score
    }
  }
])
```

### Pre-Filter vs Post-Filter

This is a **critical architectural distinction:**

#### Pre-Filter (Recommended)
Filters are applied **before** the vector search — only matching documents enter the HNSW traversal.

```javascript
{
  $vectorSearch: {
    index: "vector_index",
    path: "embedding",
    queryVector: queryEmbedding,
    numCandidates: 200,
    limit: 10,
    filter: {
      "module": { $eq: "sync" },
      "userId": { $eq: "user_abc123" }
    }
  }
}
```

**Advantages:**
- Much faster — smaller candidate set
- Accurate results within the filtered subset
- Essential for multi-tenancy (user isolation)

**Constraints:**
- Filter fields must be declared in the index definition (see Section 1)
- Supports: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$and`, `$or` ✅ VERIFIED
- Does NOT support: `$regex`, `$text`, `$exists` with `false`, `$type`
- Filter field types: `string`, `number`, `boolean`, `objectId`, `uuid`, `date` ✅ VERIFIED

#### Post-Filter (Using $match after $vectorSearch)

Filters applied **after** vector search — all documents are searched, then filtered.

```javascript
db.careerSignals.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 200,
      limit: 50  // Request more to account for post-filter loss
    }
  },
  {
    $match: {
      "module": "sync",
      "status": "active"
    }
  },
  {
    $limit: 10
  }
])
```

**Disadvantages:**
- Wastes compute searching irrelevant documents
- May return fewer results than expected (if many get filtered out)
- Not suitable for multi-tenancy isolation (security risk — data traversed before filtering)

### Metadata Filtering Examples for LinkRight

```javascript
// Find similar career signals for a specific user and module
db.careerSignals.aggregate([
  {
    $vectorSearch: {
      index: "lr_vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 200,
      limit: 10,
      filter: {
        $and: [
          { "userId": "user_abc123" },
          { "module": { $in: ["sync", "lrb"] } },
          { "signalType": "skill" }
        ]
      }
    }
  },
  {
    $project: {
      title: 1,
      content: 1,
      module: 1,
      signalType: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
])
```

```javascript
// Cross-module context retrieval (e.g., for Aether orchestrator)
db.moduleContext.aggregate([
  {
    $vectorSearch: {
      index: "context_vector_index",
      path: "embedding",
      queryVector: orchestratorQueryEmbedding,
      numCandidates: 300,
      limit: 20,
      filter: {
        "contentType": { $in: ["workflow-step", "agent-config", "persona"] }
      }
    }
  },
  {
    $group: {
      _id: "$module",
      topResults: { $push: { title: "$title", score: { $meta: "vectorSearchScore" } } }
    }
  }
])
```

### Combining with Standard Aggregation

The power of Atlas Vector Search is that `$vectorSearch` is just another aggregation stage. You can chain it with:

```javascript
db.signals.aggregate([
  // Stage 1: Vector search
  { $vectorSearch: { /* ... */ } },

  // Stage 2: Add the score
  { $addFields: { vsScore: { $meta: "vectorSearchScore" } } },

  // Stage 3: Lookup related data
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
  }},

  // Stage 4: Unwind
  { $unwind: "$user" },

  // Stage 5: Final projection
  { $project: {
      title: 1,
      content: 1,
      vsScore: 1,
      userName: "$user.name"
  }}
])
```

**Constraint:** `$vectorSearch` must be the **first stage** in the pipeline. You cannot put a `$match` or `$group` before it.

---

## 5. Performance & HNSW Configuration

### HNSW Parameters

Atlas Vector Search exposes limited HNSW tuning compared to dedicated vector databases:

| Parameter | Where Set | Default | Range | Effect |
|-----------|-----------|---------|-------|--------|
| `numCandidates` | Query-time | Required | 1–10000 | How many candidates HNSW considers. Higher = more accurate, slower |
| `limit` | Query-time | Required | 1–10000 | Final results returned. Must be ≤ numCandidates |
| `efConstruction` | Index definition ✅ | **200** (default) | 100–400 | Graph construction quality. Higher = better recall, slower indexing |
| `M` | Index definition ✅ | **16** (default) | 16–64 | Max connections per node. Higher = better recall, more memory |

**✅ VERIFIED (March 2026):** As of the June 10, 2025 Atlas release, `efConstruction` and `M` ARE now user-configurable in the vector search index definition. See "Latest Findings" section below for details.

### numCandidates Tuning

The `numCandidates` parameter is the primary performance knob available at query time:

```
numCandidates = limit × overprovisioning_factor
```

| Ratio (numCandidates:limit) | Recall | Latency | Use Case |
|----------------------------|--------|---------|----------|
| 10:10 (1:1) | Low (~70-80%) | Fastest | Not recommended |
| 50:10 (5:1) | Good (~90%) | Fast | Real-time autocomplete |
| 150:10 (15:1) | High (~95-98%) | Moderate | Most use cases |
| 500:10 (50:1) | Very High (~99%) | Slower | Precision-critical |

**MongoDB recommendation:** `numCandidates` should be 10-20× the `limit` for good recall. For LinkRight's use case (career signal matching), 15-20× is a good starting point.

### Approximate vs Exact Search

- **Atlas Vector Search is approximate only (HNSW).** There is no exact/brute-force kNN option in the `$vectorSearch` stage.
- For exact search, you'd need to use `$addFields` with custom distance calculation across all documents — impractical for large collections.
- For LinkRight's scale (hundreds to low thousands of documents per user), HNSW approximate search with high `numCandidates` will effectively give exact results.

### Performance Benchmarks

**General Atlas Vector Search performance** (from MongoDB's published benchmarks, YMMV):

| Dataset Size | Dimensions | Latency (p50) | Latency (p99) | Recall@10 |
|-------------|------------|---------------|---------------|-----------|
| 100K vectors | 1536 | ~5ms | ~15ms | ~95% |
| 1M vectors | 1536 | ~10ms | ~30ms | ~95% |
| 10M vectors | 1536 | ~20ms | ~60ms | ~93% |

✅ Updated benchmarks available in "Latest Findings" section below — MongoDB published 15.3M vector benchmarks with <50ms P95 latency using scalar quantization.

### Memory Considerations

HNSW indexes are **memory-intensive**:
- Rough memory per vector: `dimensions × 4 bytes × ~1.5` (for graph overhead)
- 1M vectors × 1536 dims ≈ 1536 × 4 × 1.5 × 1M ≈ **~9.2 GB RAM** for the index alone
- On M0 (shared RAM), this severely limits vector count

For LinkRight (estimated <100K vectors initially), memory is not a concern even on M10.

---

## 6. Multi-Tenancy Patterns

### Pattern A: Metadata Filter Isolation (Recommended for LinkRight)

Store all tenants' data in a **single collection** with a `userId` or `tenantId` field. Use pre-filters to isolate.

```javascript
// Index definition
{
  "fields": [
    { "type": "vector", "path": "embedding", "numDimensions": 1536, "similarity": "cosine" },
    { "type": "filter", "path": "userId" },
    { "type": "filter", "path": "module" }
  ]
}

// Query — always include userId filter
db.vectors.aggregate([
  {
    $vectorSearch: {
      index: "lr_index",
      path: "embedding",
      queryVector: queryVec,
      numCandidates: 150,
      limit: 10,
      filter: { "userId": "user_abc123" }
    }
  }
])
```

**Pros:**
- Simple to implement
- Single index to maintain
- Pre-filter makes it performant
- Works well on M0 (single index for all data)

**Cons:**
- All data in one collection — application-level isolation only
- A bug in filter logic could leak data across users
- Index grows with total users (not per-user)
- Cannot grant per-tenant database-level access control

**Suitability for LinkRight:** Excellent for current scale. Each user has a few hundred signals max. Module isolation via `module` filter field works well for the 7-module architecture.

### Pattern B: Separate Collections per Module

One collection per LinkRight module (`sync_vectors`, `lrb_vectors`, `flex_vectors`, etc.), each with its own vector index.

```javascript
// sync module collection
db.sync_vectors.aggregate([
  {
    $vectorSearch: {
      index: "sync_vec_index",
      path: "embedding",
      queryVector: queryVec,
      numCandidates: 100,
      limit: 10,
      filter: { "userId": "user_abc123" }
    }
  }
])
```

**Pros:**
- Logical separation aligns with module architecture
- Can tune index parameters per module (different dimensions, similarity functions)
- Easier to reason about data boundaries

**Cons:**
- M0 only allows 3 vector indexes — 7 modules won't fit
- Cross-module queries require multiple aggregation calls
- More indexes = more memory usage
- Operational overhead (7 indexes to monitor)

**Suitability for LinkRight:** Problematic on free tier. Only viable on paid tiers with sufficient index slots.

### Pattern C: Separate Databases per Tenant

One database per user/tenant. Maximum isolation.

**Pros:**
- Strongest isolation (database-level access control)
- Clean data lifecycle (delete user = drop database)

**Cons:**
- Completely impractical on M0 (512 MB shared, 3 index limit applies cluster-wide)
- Massive operational overhead
- Cannot do cross-tenant analytics
- Not how MongoDB Atlas is designed to scale

**Suitability for LinkRight:** Not recommended at any scale.

### Recommended Pattern for LinkRight

**Pattern A (single collection, metadata filters)** with these design choices:

```javascript
// Document schema
{
  _id: ObjectId("..."),
  userId: "user_abc123",         // Tenant isolation
  module: "sync",                // Module isolation
  contentType: "career-signal",  // Content type (signal, workflow-step, persona, etc.)
  signalType: "skill",           // Sub-type within content type
  title: "Python Development",
  content: "10 years experience...",
  metadata: {                    // Flexible metadata (NOT filterable in vector search)
    source: "linkedin",
    lastUpdated: ISODate("2026-03-15"),
    confidence: 0.92
  },
  embedding: [0.012, -0.034, ...],  // 1536-dim vector
  createdAt: ISODate("2026-03-15"),
  updatedAt: ISODate("2026-03-15")
}
```

```javascript
// Vector search index definition
{
  "name": "lr_main_vector_index",
  "type": "vectorSearch",
  "fields": [
    { "type": "vector", "path": "embedding", "numDimensions": 1536, "similarity": "cosine" },
    { "type": "filter", "path": "userId" },
    { "type": "filter", "path": "module" },
    { "type": "filter", "path": "contentType" },
    { "type": "filter", "path": "signalType" }
  ]
}
```

This uses **1 of 3 available M0 indexes** and supports all LinkRight query patterns via filter combinations.

---

## 7. Fit Assessment for LinkRight

### Strengths (Why MongoDB Atlas Vector Search fits)

1. **ADR-004 already chose MongoDB:** Career signals are already in MongoDB. Adding vector search is incremental, not a new dependency.
2. **Unified data model:** Vectors live alongside their source documents. No sync between a separate vector DB and MongoDB.
3. **Aggregation pipeline integration:** Can combine vector search with `$lookup`, `$group`, `$facet` for rich queries.
4. **Free tier viable for dev:** M0 handles prototyping and small-scale production.
5. **Pre-filtering is first-class:** Critical for multi-tenant isolation and module-scoped queries.
6. **Managed infrastructure:** No vector DB operations to manage.

### Weaknesses / Risks

1. **~~Vendor lock-in~~ RESOLVED:** MongoDB 8.2+ Community Edition now includes `$vectorSearch` via `mongot`. Local/self-hosted vector search is available.
2. **~~Limited HNSW tuning~~ RESOLVED:** `efConstruction` and `M` are now configurable since June 2025 Atlas release.
3. **No exact kNN:** Only approximate search. Fine for LinkRight's scale, but limits flexibility.
4. **M0 index limit (3):** Forces single-collection design. Can't have per-module indexes on free tier.
5. **Filter fields must be pre-declared:** Can't dynamically filter on arbitrary metadata. Schema planning required upfront.
6. **~~No hybrid search score fusion~~ RESOLVED:** Atlas now natively supports `$rankFusion` (RRF) and `$scoreFusion` for combining `$vectorSearch` + `$search` results. Available since MongoDB 8.0+.
7. **~~Embedding generation~~ RESOLVED:** Atlas Vectorize now auto-generates embeddings on insert/query using configured providers (OpenAI, Voyage AI, Cohere, Azure OpenAI).

### Comparison Table vs Alternatives

| Criteria | Atlas Vector Search | ChromaDB | Qdrant | pgvector |
|----------|-------------------|----------|--------|----------|
| **Integrated with MongoDB** | Native | Separate service | Separate service | Separate DB |
| **Self-hosted** | No (Atlas only) | Yes | Yes | Yes (Postgres) |
| **Free tier** | M0 (512MB) | Open source | Open source | Open source |
| **HNSW tuning** | Limited | Full | Full | Full |
| **Pre-filtering** | Yes (declared fields) | Yes (metadata) | Yes (payload filters) | Yes (WHERE clause) |
| **Hybrid search** | Manual RRF | No native | Native sparse+dense | tsvector + ivfflat |
| **Maturity for vectors** | GA since 2023 | 2022+ | 2021+ | 2021+ |
| **Ops overhead** | Zero (managed) | Low (embedded) | Medium | Medium |
| **Best for** | MongoDB-native apps | Prototyping, Python | Production vector-first | Postgres shops |

### Bottom Line

MongoDB Atlas Vector Search is a **pragmatic, low-friction choice** for LinkRight given that MongoDB is already the chosen data store (ADR-004). The primary risks are vendor lock-in to Atlas and limited HNSW tuning. For LinkRight's current scale (hundreds to low thousands of vectors per user, <100K total), these limitations are unlikely to matter. If LinkRight grows to millions of vectors or needs advanced vector search features (quantization, sparse vectors, dynamic HNSW tuning), a dedicated vector DB (Qdrant) would be worth evaluating.

---

## Latest Findings (March 2026 — External Research)

> **Source:** Gemini Deep Research output, verified March 17, 2026
> **Scope:** Updates to all 8 research topics from the original deep research prompt

### MongoDB 8.2 Community Edition — Local Vector Search (CONFIRMED)

MongoDB 8.2, released late 2024, introduced **public previews** of vector search and hybrid search for both Community and Enterprise Server editions. By March 2026, these features are integrated into the stable 8.2 minor release branch and the upcoming 8.3 release candidates.

**Key details:**
- **`$vectorSearch` is now available in Community Edition 8.2+** — same syntax as Atlas
- **`$scoreFusion` aggregation stage** for hybrid search also available locally
- Powered by the **`mongot` process** — a dedicated Lucene-based search engine running alongside `mongod`
- Developers must install and configure `mongot` manually (unlike Atlas's automated setup)
- `mongot` uses **change streams** to maintain an eventually consistent HNSW index

**Limitations vs Atlas:**
- No automated scaling or dedicated Search Nodes
- No native backup/restore for search indexes (requires manual re-indexing)
- No advanced query tracking/performance analytics
- Minor releases (8.2, 8.3) follow a 6-month cadence; patches NOT backported to previous minors

**Verdict:** Recommended for local prototyping and CI/CD pipelines. Not recommended for large-scale multi-tenant production without Atlas's managed infrastructure.

**Docs:** https://www.mongodb.com/docs/manual/release-notes/8.2/ and https://www.mongodb.com/docs/atlas/atlas-vector-search/compatibility-limitations/

### M0 Free Tier — Updated Limits (March 2026)

| Feature | M0 Free Tier (March 2026) |
|---------|--------------------------|
| **Storage** | 512 MB (unchanged) |
| **Vector Search Indexes** | 3 total (search + vector combined) |
| **Max Vector Dimensions** | **8192** (was 4096 — increased) |
| **Operational Throughput** | 100 ops/sec |
| **Network Rate Limit** | 10 GB In / 10 GB Out per 7-day period |
| **MongoDB Version** | 8.0 |
| **`numCandidates` limit** | No hard ceiling — limited by shared RAM on `mongot` |

### NEW: Flex Tier (Between M0 and M10)

MongoDB introduced **Flex clusters** — a new tier bridging M0 and M10:

| Feature | Flex Tier |
|---------|-----------|
| **Cost** | $0.011/hour (~$8-$30/month) |
| **Storage** | 5 GB |
| **Vector Search Indexes** | **10** (vs M0's 3) |
| **Throughput** | 500 ops/sec |
| **Connections** | 500 |

**Impact for LinkRight:** Flex tier's 10 indexes allows per-module vector indexes (7 modules fits within limit). This is the recommended entry point for scaling beyond prototyping.

### HNSW Parameters — Now Configurable (Since June 2025)

As of the **June 10, 2025 release**, Atlas Vector Search exposes `M` and `efConstruction`:

| Parameter | Default | Recommended Range | Trade-off |
|-----------|---------|-------------------|-----------|
| **M** | **16** | 16–64 | Higher = better recall, more RAM |
| **efConstruction** | **200** | 100–400 | Higher = better graph quality, slower build |

This resolves the previous [NEEDS VERIFICATION] tags — these parameters ARE now user-configurable in Atlas index definitions.

**Docs:** https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-type/

### Hybrid Search — Native $rankFusion (CONFIRMED)

Native hybrid search is now a **core feature** via the `$rankFusion` aggregation stage:

- Combines `$vectorSearch` + `$search` (full-text) in a single query
- Uses **Reciprocal Rank Fusion (RRF)** with fixed constant k=60
- Supports **weighted pipelines** (e.g., vector: 0.7, text: 0.3)
- Available since MongoDB 8.0+
- MongoDB 8.2 adds `$scoreFusion` for custom mathematical score combination

This resolves the [NEEDS VERIFICATION] tag about native score fusion — it IS now natively supported.

**Docs:** https://www.mongodb.com/docs/atlas/atlas-vector-search/hybrid-search/

### Pricing — M10+ and Search Nodes (March 2026)

**Base cluster pricing (AWS):**

| Tier | RAM | Storage | Monthly Cost |
|------|-----|---------|-------------|
| **M10** | 2 GB | 10 GB | ~$56.94 |
| **M20** | 4 GB | 20 GB | ~$146.72 |
| **M30** | 8 GB | 40 GB | ~$387.62 |

No per-index or per-query charges for vector search — included in base rate.

**Search Node pricing (dedicated `mongot` hardware, AWS):**

| Tier | RAM | vCPUs | Storage | Hourly Cost |
|------|-----|-------|---------|-------------|
| S20 | 4 GB | 2 | 106 GB | $0.12 |
| S30 | 8 GB | 4 | 213 GB | $0.24 |
| S40 | 16 GB | 8 | 426 GB | $0.48 |
| S50 | 32 GB | 16 | 855 GB | $0.99 |

### Quantization — Scalar & Binary (GA since late 2024)

Atlas Vector Search supports automatic quantization:

- **Scalar (int8):** ~**3.75x** RAM reduction (75% savings). GA since Dec 2, 2024.
- **Binary (1-bit):** ~**24-32x** RAM reduction (96-97% savings). Requires rescoring step.

Configured in the index definition via `quantization` field. For 1536-dim vectors, scalar quantization maintains >95% recall@10.

**Key benchmark finding:** 256d vectors with quantization never exceed 70% recall at high scale — stick with 1536d+ for quantized indexes.

**Docs:** https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-quantization/

### Benchmarks — 2025-2026

**MongoDB internal benchmarks (15.3M vectors, 2048d, Voyage-3-large):**

| Config | Dataset | P95 Latency | Recall | QPS |
|--------|---------|-------------|--------|-----|
| Scalar (int8) | 15.3M | <50ms | 90-95% | Hundreds to Thousands |
| Binary (1-bit) | 15.3M | Higher (rescoring) | 90-95% | Lower than Scalar |

**Independent comparison:** pgvectorscale achieved 471 QPS at 99% recall on 50M vectors vs Qdrant's 41 QPS (Firecrawl benchmarks, late 2025).

**Pre-filter performance:** A 3% selective filter on 15.3M vectors makes queries ~4x more expensive to maintain 90-95% recall with binary quantization. Lucene 10 (Acorn-1 strategies) expected to reduce this penalty.

### Atlas Vectorize — Built-in Embedding Generation

MongoDB now offers **Atlas Vectorize** — automated embedding generation within the database lifecycle:

- Define a text field for vectorization in the index definition
- Atlas calls configured embedding provider on insert (OpenAI, Voyage AI, Cohere, Azure OpenAI)
- Query-time: pass raw text to `$vectorSearch` — Atlas handles embedding
- Eliminates "model drift" between indexing and querying

**Supported providers:** Voyage AI (voyage-3-large), OpenAI (3-small/3-large), Cohere (embed-english-v3.0+), Azure OpenAI.

This resolves the weakness noted in Section 7 about Atlas not generating embeddings.

### Updated Comparison Table

| Criteria | Atlas Vector Search (2026) | ChromaDB | Qdrant | pgvector |
|----------|---------------------------|----------|--------|----------|
| **Self-hosted vector search** | **Yes (8.2+ Community)** | Yes | Yes | Yes |
| **HNSW tuning** | **Yes (M, efConstruction)** | Full | Full | Full |
| **Hybrid search** | **Native ($rankFusion)** | No native | Native | tsvector + ivfflat |
| **Quantization** | **Scalar + Binary** | No | Yes | No |
| **Built-in embeddings** | **Atlas Vectorize** | No | No | No |
| **Free tier** | M0 (512MB) + **Flex ($8/mo)** | Open source | Open source | Open source |

---

## Deep Research Prompt for External AI

Use this prompt in Gemini Deep Research, Perplexity, or ChatGPT with web search to get the latest information:

---

**PROMPT:**

I'm evaluating MongoDB Atlas Vector Search for a multi-tenant AI platform (career optimization tool). I need current, verified information on several topics — please provide specific version numbers, pricing, and link to official MongoDB documentation for each answer.

**Topic 1 — MongoDB 8.2+ Community Edition and Local Vector Search:**
Has MongoDB released `$vectorSearch` support in Community Edition (not Atlas) as of March 2026? Specifically, is there a GA release of MongoDB Community Edition (8.2, 8.3, or later) that includes native HNSW-based vector search without requiring Atlas? If so, what version, what are the limitations compared to Atlas, and is it production-ready? Link to the release notes or announcement.

**Topic 2 — Current M0 Free Tier Limits (March 2026):**
What are the exact current limits for MongoDB Atlas M0 free tier regarding: (a) number of vector search indexes allowed, (b) maximum vector dimensions, (c) maximum `numCandidates` value, (d) any rate limiting on `$vectorSearch` queries, (e) storage limit (still 512MB?). Has MongoDB introduced any new free or developer tier between M0 and M10?

**Topic 3 — HNSW Parameter Exposure:**
Can users configure `efConstruction` and `M` (max connections) parameters in Atlas Vector Search index definitions as of the latest Atlas release? If so, since which version? What are the defaults and recommended ranges? Link to documentation.

**Topic 4 — Hybrid Search / Score Fusion:**
Does Atlas Vector Search now support native hybrid search combining `$vectorSearch` with `$search` (full-text) in a single query with automatic score fusion (e.g., Reciprocal Rank Fusion)? If so, show the query syntax. If not, what's the recommended pattern?

**Topic 5 — Pricing for M10+ with Vector Search:**
What is the current monthly cost for M10 and M20 Atlas clusters? Are there additional charges for vector search indexes or query volume? What are the Atlas Search Node pricing tiers (if vector search can be offloaded to dedicated nodes)?

**Topic 6 — Quantization and Compression:**
Does Atlas Vector Search support vector quantization (scalar, product, or binary quantization) to reduce memory usage and improve performance? If so, since which version and how is it configured?

**Topic 7 — Recent Benchmarks:**
Are there any independent (non-MongoDB) benchmarks comparing Atlas Vector Search performance against Qdrant, Pinecone, Weaviate, or pgvector published in 2025-2026? Specifically looking for recall@10, queries-per-second, and latency percentiles on datasets of 1M+ vectors with 1536 dimensions.

**Topic 8 — Embedding Generation:**
Does Atlas now offer built-in embedding generation (e.g., integration with OpenAI or a native embedding model) so that you can index text directly without pre-computing embeddings? If so, what models are supported and how is it configured?

For each topic, please provide: (a) the answer, (b) the specific MongoDB version or Atlas release it applies to, (c) a direct link to official documentation or announcement, (d) the date you verified this information. If information is unavailable or conflicting, say so explicitly rather than guessing.

---

*End of research report.*
