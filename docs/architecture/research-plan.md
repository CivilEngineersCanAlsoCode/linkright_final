# LinkRight Architecture Research Plan

## Why This Matters
LinkRight has exactly TWO differentiators over BMAD:
1. **Vector DB** — lean context pulls instead of reading/grepping entire codebases
2. **Beads** — structured dependencies + cross-session persistence

If these don't work elegantly at scale, LinkRight IS BMAD with extra folders. Every architecture decision must serve these two pillars.

---

## Reframing: 4 Layers, Not 6 Random Problems

The 6 problems we identified are actually symptoms of 4 architectural layers that need to be designed together:

### Layer 1: DATA LAYER — "Where does everything live?"
| Sub-problem | What we need to decide |
|-------------|----------------------|
| Vector DB choice | MongoDB Atlas Vector Search vs ChromaDB vs Qdrant vs pgvector — which one, WHY |
| Chunking strategy | How to split markdown/yaml/csv into meaningful vectors. Fixed-size? Semantic? Per-section? |
| Embedding model | OpenAI ada-002 vs open-source (nomic, BGE) vs Cohere. Cost, quality, self-hostable? |
| Namespace design | Per-module isolation vs shared pool with metadata filters. Cross-module queries? |
| File system role | Do raw files still exist alongside vectors? Source of truth = files or DB? |
| Beads storage | Dolt is decided. But: local-only forever? Cloud sync? Multi-device? |

### Layer 2: ACCESS LAYER — "How do AI clients get to the data?"
| Sub-problem | What we need to decide |
|-------------|----------------------|
| MCP Server architecture | One monolithic server vs per-module servers. Tool naming. Auth. |
| ChatGPT Actions | n8n webhooks vs Express API vs hybrid. What endpoints exactly? |
| Web Bundles role | Static knowledge snapshots vs live-connected bundles. Staleness problem. |
| Context enforcement | How to make vector DB the PRIMARY path, not raw file reads |
| Write path | AI writes back (task updates, new content) — through what? |

### Layer 3: COORDINATION LAYER — "How do modules talk to each other?"
| Sub-problem | What we need to decide |
|-------------|----------------------|
| Cross-module data flow | Event-driven (pub/sub) vs shared namespace vs direct API vs n8n orchestration |
| Agent coordination | How does Agent A in Flex know about Agent B in Sync's work? |
| Shared state | What state is module-private vs platform-shared? |
| Dependency graph | Module X depends on Module Y's output — how tracked? |

### Layer 4: DISTRIBUTION LAYER — "How do users consume this?"
| Sub-problem | What we need to decide |
|-------------|----------------------|
| ChatGPT Custom Model packaging | Web bundle builder automation. What goes in, what stays out. |
| MCP client compatibility | Claude Code, Cursor, Windsurf, Codex — what's the minimum viable MCP? |
| Stateless client problem | ChatGPT can't hold state. How does Beads work there? |
| Future: standalone app? | Express + React we discussed — is this even needed if MCP works? |

---

## Research Approach (Per Layer)

For each layer, the research document will contain:

```
## [Layer Name]

### Problem Statement
What exactly are we solving? What breaks if we don't solve it?

### Constraints (Non-Negotiable)
- What Satvik has already decided (e.g., Dolt for Beads)
- What the tech forces on us (e.g., ChatGPT 20 file limit)
- What our resources allow (solo dev, free tiers, no DevOps team)

### State of the Art
What are serious projects doing RIGHT NOW for this problem?
- Open source examples (LangChain, LlamaIndex, Mem0, Cognee, etc.)
- Commercial products (Cursor, Windsurf, Devin, etc.)
- Papers/blogs with real benchmarks (not hype)

### Options Matrix
| Option | Pros | Cons | Scale behavior | Cost | Complexity |
|--------|------|------|---------------|------|------------|
| A      |      |      |               |      |            |
| B      |      |      |               |      |            |
| C      |      |      |               |      |            |

### Scale Analysis
- At 1 module (now): what works?
- At 6 modules (near-term): what breaks?
- At 20+ modules (LRB future): what's impossible?
- At multi-user (product launch): what needs to change?

### Recommendation
My pick + reasoning. Not "it depends" — an actual opinion.

### Decision Needed
Exact question for Satvik to answer.
```

---

## Execution Order

**Why this order matters:** Each layer depends on the one before it. Can't design access without knowing where data lives. Can't coordinate without knowing how to access. Can't distribute without knowing how to coordinate.

| Phase | Layer | Estimated Research Time | Key Dependencies |
|-------|-------|------------------------|-----------------|
| 1 | DATA | Deep dive | None — foundational |
| 2 | ACCESS | Deep dive | Needs DATA decisions locked |
| 3 | COORDINATION | Medium dive | Needs DATA + ACCESS locked |
| 4 | DISTRIBUTION | Medium dive | Needs all above locked |

**After each phase:**
1. I present research to Satvik
2. We discuss and LOCK decisions
3. Move to next phase
4. After ALL 4 locked → Build fresh Beads plan with proper SAFe hierarchy

---

## What I'll Research (Specific Questions)

### Phase 1: DATA LAYER
1. MongoDB Atlas Vector Search — free tier limits, HNSW performance, 512-dim vs 1536-dim tradeoff
2. MongoDB 8.2 Community local vector search — is it production-ready? Limitations?
3. Hybrid architecture (Atlas cloud + local Community) — how does sync work?
4. Chunking strategies for structured docs (markdown with YAML frontmatter, CSV, workflow files)
5. Embedding models: cost per 1M tokens, dimension sizes, multilingual support (Hinglish content!)
6. How LlamaIndex/LangChain handle namespace isolation in multi-tenant vector stores
7. Source of truth problem: files → vectors (one-way sync) or bidirectional?
8. Dolt limitations at scale — max DB size, query performance, concurrent access

### Phase 2: ACCESS LAYER
9. MCP protocol spec — current capabilities, limitations, what's coming
10. How Cursor/Windsurf/Claude Code implement MCP clients — what tool patterns work best
11. ChatGPT Actions: webhook latency, payload limits, auth patterns
12. n8n vs Express for webhook layer — when does n8n become a bottleneck?
13. Context enforcement patterns from RAG literature — how to make retrieval > raw reads
14. Write-back patterns: how does AI update Beads/vectors through MCP vs webhooks

### Phase 3: COORDINATION LAYER
15. Event-driven patterns for AI agent systems (CrewAI, AutoGen, LangGraph)
16. Shared memory patterns (Mem0, Zep, Motorhead) — what works, what's overhyped
17. Cross-module vector queries — metadata filtering vs separate collections vs views
18. n8n as orchestration backbone — can it handle agent-to-agent communication?

### Phase 4: DISTRIBUTION LAYER
19. ChatGPT Custom Model real-world performance with 20 knowledge files
20. Web bundle staleness — how to version-check against live data
21. MCP server deployment — local process vs cloud-hosted vs hybrid
22. Stateless Beads: session-start state load vs continuous sync vs summary injection

---

## Deliverable

One research document per layer. Each ends with:
- Locked decisions (after discussion with Satvik)
- Architecture Decision Record (ADR) format
- Input for fresh Beads SAFe plan

**Final output:** Complete LinkRight Architecture Blueprint + Fresh Beads backlog built on LOCKED decisions, not TODO wishes.

---

## Timeline Estimate
- Phase 1 (DATA): 1 deep session
- Phase 2 (ACCESS): 1 deep session  
- Phase 3 (COORDINATION): 1 session
- Phase 4 (DISTRIBUTION): 1 session
- Beads rebuild: 1 session

**5 focused sessions total.** Not weeks of meandering.
