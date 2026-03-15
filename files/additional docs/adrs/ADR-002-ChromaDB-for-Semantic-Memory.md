# ADR-002: ChromaDB for Semantic Memory

**Status:** Accepted
**Date:** 2026-03-09
**Decision Maker:** Satvik Jain

---

## Context

Linkright workflows need to retrieve relevant career signals and portfolio patterns based on **semantic similarity**, not just keyword matching:
- "Python expert" ≈ "strong in systems programming" (semantic, not keyword match)
- "Led team of 5" ≈ "managed 5-person engineering squad" (different words, same meaning)
- Signal retrieval must find similar signals across resume + JD + signal library (100K+ signals)

**Constraints:**
- Single-user, self-hosted
- No cloud dependency (keep data private)
- <100ms retrieval latency for typical queries
- Low operational overhead (easy backups)

---

## Decision

**Use ChromaDB (lightweight vector database) for semantic search across:**
- Resume embeddings (user's optimized resumes)
- Job description embeddings (company JDs)
- Professional signal library (50K+ signals indexed)

---

## Alternatives Considered

### Option 1: Pinecone (SaaS Vector DB)

**Pros:** Fully managed, automatic scaling, 99.99% uptime
**Cons:** ❌ Vendor lock-in, ❌ Privacy concerns (data on Pinecone's servers), ❌ Cost per query, ❌ Requires API key management

**Why Rejected:** Cloud SaaS violates self-hosted requirement

---

### Option 2: Weaviate (Self-Hosted Vector DB)

**Pros:** Powerful, GraphQL API, good docs
**Cons:** ❌ Heavy (~500MB container), ❌ Complex to set up and maintain, ❌ Overkill for single user

**Why Rejected:** Over-engineered; too much operational overhead

---

### Option 3: FAISS (Facebook AI Similarity Search, Local)

**Pros:** Fast, low memory, no server needed
**Cons:** ❌ No persistence out of box, ❌ Requires manual reloading, ❌ Poor for live updates

**Why Rejected:** Not designed for persistent live retrieval

---

## Rationale: Why ChromaDB

1. **Lightweight:** Single Python library, <50MB footprint
2. **Self-Contained:** Works in-memory or file-based, no separate server
3. **Persistent:** Saves embeddings to disk automatically
4. **Simple API:** Built for semantic search (not general-purpose vector DB)
5. **Open Source:** MIT licensed, auditable code
6. **Collection Management:** Built-in collection organization (resumes, JDs, signals)

---

## How It Works in Linkright

```
signal-capture workflow (phase E)
  ↓ construct-retrieval-query
  ↓ Embedding: "API design expertise"
  ↓ Query ChromaDB collections
  ↓ Returns top-10 similar signals with cosine similarity scores
  ↓ Filters by persona relevance
```

**Collections:**
1. `resume_embeddings`: User's past resume bullets
2. `jd_embeddings`: Job description key phrases
3. `professional_signals`: 50K+ signal library (indexed by domain)

---

## Consequences

### Positive

+ ✅ Private data (no cloud)
+ ✅ Fast (<50ms) semantic search
+ ✅ Minimal operational overhead
+ ✅ Works offline
+ ✅ No licensing surprises

### Negative

- ⚠️ Vector indexing is slower than keyword (but worth the semantics)
- ⚠️ Embedding quality depends on model (OpenAI text-embedding-3-small)
- ⚠️ Not designed for 1M+ embeddings (limit: ~1M per collection)

---

## Integration with Linkright

- MongoDB: Stores structured signal metadata
- ChromaDB: Stores embeddings + vector index
- Combined: Query structure + semantic search

---

## Related Decisions

- ADR-004: MongoDB for structured signals (complements this)
- ADR-008: JIT Loading (ChromaDB collection lazy-loaded only when needed)
