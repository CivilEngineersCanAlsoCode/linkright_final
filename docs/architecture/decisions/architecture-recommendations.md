# LinkRight Architecture Blueprint

> **Version:** 1.0 | **Date:** 2026-03-16
> **Author:** Satvik + AI Architecture Team
> **Status:** All 19 decisions LOCKED. Ready for implementation.

---

## Table of Contents

1. [Vision & Problem Statement](#1-vision--problem-statement)
2. [Current State (March 2026)](#2-current-state-march-2026)
3. [Architecture Decisions (All 19)](#3-architecture-decisions-all-19)
   - [Phase 1 DATA (Decisions 1-7)](#phase-1-data-decisions-1-7)
   - [Phase 2 ACCESS (Decisions 8-12)](#phase-2-access-decisions-8-12)
   - [Phase 3 COORDINATION (Decisions 13-15)](#phase-3-coordination-decisions-13-15)
   - [Phase 4 DISTRIBUTION (Decisions 16-19)](#phase-4-distribution-decisions-16-19)
4. [Transition Roadmap](#4-transition-roadmap)
5. [Cost Projection](#5-cost-projection)
6. [Risk Analysis](#6-risk-analysis)
7. [Implementation Priority (Build Order)](#7-implementation-priority-build-order)

---

## 1. Vision & Problem Statement

### LinkRight Kya Solve Karta Hai

LinkRight do core problems solve karta hai jo aaj har AI user face karta hai:

**Problem 1: Limited Context**
AI tools (ChatGPT, Claude, Cursor) har conversation me sab kuch bhool jaate hain. Tu apna resume, career goals, LinkedIn strategy — har baar se explain karta hai. Ye 10,000+ tokens waste hota hai har session me. Context window limited hai (128K-200K tokens), aur tera lifetime knowledge usme fit nahi hota.

**Problem 2: No Persistent Memory Across Tools**
Tu Claude Code me code likhta hai, ChatGPT me LinkedIn posts banata hai, Cursor me bugs fix karta hai — par ye teeno ek doosre se baat nahi karte. Tera career signal jo LinkedIn post me hai, wo resume builder ko nahi dikhta. Tera debugging experience jo code me hai, wo content creation me nahi aata.

### LinkRight Ka Solution

**Module-agnostic AI platform** jo:
1. Tera saara knowledge vectorize karke store karta hai (persistent memory)
2. Har AI tool ko relevant context automatically deta hai (MCP protocol)
3. Modules ke beech data flow karta hai (cross-module coordination)
4. Kisi bhi domain me plug-in ho sakta hai (module = domain)

### Modules (Current 7)

| Module | Domain | Kya Karta Hai |
|--------|--------|---------------|
| **Flex** | LinkedIn Content | AI-assisted content creation, audience strategy |
| **Sync** | Career Management | Resume optimization, JD matching, interview prep |
| **Squick** | Software Dev | SDLC docs, PRDs, code review |
| **LifeOS** | Personal Knowledge | Experiences, learnings, life events |
| **AutoFlow** | Workflow Automation | n8n workflow documentation |
| **LRB** | Platform Building | Module templates, builder tools |
| **Core** | Platform Core | Shared config, schemas, orchestration |

### Journey: Personal Tool → SaaS Product → Enterprise Platform

```
NOW                    MONTH 3-6               MONTH 6-12              YEAR 2+
┌──────────┐          ┌──────────────┐         ┌──────────────┐       ┌────────────────┐
│ Personal │          │  Open Source  │         │  Growth SaaS │       │  Enterprise    │
│ Tool     │ ──────→  │  + Early     │ ──────→ │  1K-10K      │ ────→ │  100K+ users   │
│ 1 user   │          │  Users       │         │  users       │       │  Multi-region  │
│ ₹0/mo    │          │  ₹0/mo       │         │  $200-500/mo │       │  $10K+/mo rev  │
└──────────┘          └──────────────┘         └──────────────┘       └────────────────┘
```

---

## 2. Current State (March 2026)

### Satvik Ki Situation

| Cheez | Status |
|-------|--------|
| **Machine** | AWS EC2, 2 vCPU, 7.6 GB RAM, 30 GB disk (16 GB used, 14 GB free) |
| **AWS free tier** | Sirf 30 din baaki. Uske baad Oracle Free Tier (24 GB RAM, 200 GB disk, FOREVER FREE) |
| **Budget** | Max ₹20,000/mo (~$200). Claude Max subscription isme se hai |
| **Skills** | Full-stack dev, n8n workflows, AI tools, Python/TypeScript |
| **Goal** | Job switch ASAP + apne products fast banana |

### Jo Already Running Hai

| Component | Version/Status | Port | Notes |
|-----------|---------------|------|-------|
| **MongoDB** | 8.2.5 Community | 27017 | `mongod` + `mongot` dono running. `$vectorSearch` supported. Replica set mode active (`--replSet 7a1b66ea9370`) |
| **Dolt** | Running | 3306 | 369 issues loaded (Beads task system). MySQL-compatible. |
| **n8n** | Running | 5678 | Workflow automation. Gemini embeddings already configured. |
| **Agent-Mail MCP** | Running | 8765 | Agent coordination server |
| **ChatGPT Flex** | Custom Model | — | Flex SMA model with HTML knowledge files. Working. |
| **Gemini API** | FREE tier | — | `gemini-embedding-001` / `text-embedding-005`. 1500 RPD, 15 RPM. |
| **Data** | `sma` DB | — | `linkedin_posts`, `life_experiences`, `sma_config` collections |
| **MCP Configs** | Multiple | — | Cline, Codex, Windsurf configs exist |

### Jo NAHI Bana Hai (Build Karna Hai)

| Component | Priority | Est. Time |
|-----------|----------|-----------|
| `lr sync` CLI (file → embed → MongoDB) | P0 | 2 din |
| LinkRight MCP Server (vector_search, beads tools) | P0 | 3 din |
| Chunking parsers (MD, YAML, CSV, code) | P0 | 1 din |
| MongoDB vector indexes per module | P0 | 1 hr |
| Change Stream watchers (cross-module events) | P1 | 1 din |
| `lr bundle` CLI (MD → HTML for ChatGPT) | P1 | 1 din |
| ChatGPT HTTP transport (ngrok tunnel) | P2 | 0.5 din |

---

## 3. Architecture Decisions (All 19)

---

### Phase 1 DATA (Decisions 1-7)

> **Lens:** Personal use pehle. Free/open-source. Fastest implementation. SaaS baad me.

---

#### Decision 1: Vector Database

**Decision:** MongoDB 8.2 Community Edition (jo already chal raha hai)

**Rationale:**
- Already installed aur running hai — `mongod` + `mongot` dono processes active. Setup time = ZERO.
- `$vectorSearch` Community Edition 8.2+ me supported hai via `mongot` (Lucene-based HNSW index).
- Document + vector ek jagah — task data, user data, vectors sab ek DB me. No split architecture.
- `sma` database already hai — `linkedin_posts`, `life_experiences` stored.
- Hybrid search supported — `$rankFusion` (RRF) se keyword + semantic combine. MongoDB 8.2 me `$scoreFusion` bhi hai.
- HNSW tunable hai — `M` (default 16, range 16-64) aur `efConstruction` (default 200, range 100-400) configurable since June 2025 Atlas release.

**Alternatives Considered:**

| Alternative | Kyun Reject | Key Data |
|-------------|-------------|----------|
| **ChromaDB** | Already MongoDB hai, extra dependency. Concurrent access issues multi-module me. Single-node, no clustering. | 26K GitHub stars, but multi-tenant = manual isolation |
| **Qdrant** | Extra service = extra RAM (2.7 GB already used / 7.6 GB). 30 GB disk pe ek aur DB. Best for SaaS scale par abhi overkill. | p50 ~8ms @1M vectors, 98% recall. Free 1 GB cloud tier. Score: 9/10 for SaaS. |
| **pgvector** | Postgres nahi hai stack me. Extra DB dependency add karna padega. | pgvectorscale: 471 QPS @99% recall @50M vectors (11.4x Qdrant). Impressive but wrong stack. |
| **Pinecone** | Proprietary, vendor lock-in HIGH, linear cost scaling ($50→$380→$2,847/mo). | Free 2 GB tier but no self-hosting. Score: 3/10. |
| **Weaviate** | Go runtime + modules system = operational complexity. Hybrid search achha hai par MongoDB me bhi hai ab. | p50 ~22ms @1M, BM25+vector native. Score: 7/10. |

**Performance Benchmarks (MongoDB):**

| Dataset Size | Dimensions | Latency (p50) | Latency (p95) | Recall@10 |
|-------------|------------|---------------|---------------|-----------|
| 100K vectors | 1536 | ~5ms | ~15ms | ~95% |
| 1M vectors | 1536 | ~10ms | ~30ms | ~95% |
| 15.3M vectors | 2048 | — | <50ms | 90-95% (scalar quantization) |

**Current Implementation (1 user):**
- MongoDB Community 8.2.5, self-hosted on EC2
- `$vectorSearch` via `mongot` process
- 1 collection per module (`flex_vectors`, `sync_vectors`, etc.)
- Cosine similarity, 3072 dimensions (Gemini embedding)
- Cost: ₹0

**Growth Path (1K users):**
- MongoDB Community → MongoDB Atlas Flex tier (~$8-30/mo)
- 10 vector indexes (vs M0 ke 3) — per-module indexes possible
- 500 ops/sec, 5 GB storage
- Same API, same queries — **zero code change**
- Pre-filtering with `userId` field for tenant isolation

**Scale Path (100K users):**
- MongoDB Atlas M30-M40 cluster ($387-$780/mo) + dedicated Search Nodes
- Scalar quantization (INT8) → 3.75x RAM reduction, >95% recall maintained
- `$rankFusion` weighted pipelines for hybrid search
- Or pivot to **Qdrant Cloud** ($100-300/mo for 10M vectors) if pure vector QPS needed

**Enterprise Path:**
- MongoDB Atlas dedicated cluster ($5K-70K/yr) with multi-region replication
- Or **Qdrant Hybrid Cloud** (data on-prem, control plane managed)
- Or **Turbopuffer** ($64-4K+/mo) for Cursor/Notion-style architecture

**Migration Effort:**
- Personal → Atlas Flex: Config change only (connection string). Zero code change.
- Atlas → Qdrant: Vector schema migration + query rewrite. ~2-3 weeks. LlamaIndex abstraction layer helps.
- Atlas → Turbopuffer: Full rewrite of vector layer. ~1 month.

---

#### Decision 2: Embedding Model

**Decision:** Gemini Embedding API (FREE — jo already use ho raha hai n8n me)

**Rationale:**
- FREE hai — zero cost. Google AI Studio free tier.
- `gemini-embedding-001` / `text-embedding-005` — MTEB retrieval score 68.32 NDCG@10 (rank 4 globally).
- 3072 dimensions — OpenAI `text-embedding-3-small` (1536d) se zyada rich representation.
- Multilingual — Hinglish handling better than OpenAI for Indian languages.
- Already n8n workflows me configured. Consistency maintain.

**Alternatives Considered:**

| Model | NDCG@10 | Dimensions | Cost | Kyun Reject |
|-------|---------|------------|------|-------------|
| **jina-embeddings-v5-text-small** | 71.7 | 1024 | Paid | #1 ranked but costs money |
| **Qwen3-Embedding-8B** | 70.58 | 4096 | Self-hosted | EC2 pe GPU nahi hai |
| **OpenAI text-embedding-3-small** | ~60 | 1536 | $0.02/1M tokens | Paid, lower quality |
| **OpenAI text-embedding-3-large** | 64.6 | 3072 | $0.13/1M tokens | Paid |
| **Voyage-4-large** | 66.8 | 1024 | Paid | MoE architecture, great quality but costs |
| **Cohere embed-v4** | 65.2 | 1024 | Paid | 128K context window impressive but paid |
| **MuRIL** | — | — | Free/self-hosted | Best for Hinglish (87.3% intent accuracy) but needs GPU |

**Hinglish Note:** MuRIL best hai for Hinglish (87.3% intent accuracy, 84.2% entity F1). Deromanization strategy (Romanized Hindi → Devanagari) boosts F1 by ~3% with XLM-R. Future me evaluate karenge.

**Current Implementation (1 user):**
- Gemini API via Google AI Studio (free tier: 1500 RPD, 15 RPM)
- 3072 dimensions, cosine similarity
- n8n workflows me embedded
- Cost: ₹0

**Growth Path (1K users):**
- Gemini free tier sufficient for moderate usage (1500 requests/day)
- If rate limited → **Voyage-4-large** ($0.01/1M tokens, MoE architecture)
- Voyage 4 ka "shared embedding space" — small model for queries, large for indexing

**Scale Path (100K users):**
- **Voyage-4-large** or **OpenAI text-embedding-3-large** for production quality
- Atlas Vectorize for automated embedding on insert (OpenAI, Voyage, Cohere supported)
- Batch embedding pipeline for bulk operations

**Migration Effort:**
- Model switch = re-embed ALL vectors (one-time batch job)
- Query code unchanged (dimension change → index rebuild)
- ~1 din for 10K documents, ~1 week for 1M documents

---

#### Decision 3: Chunking Strategy

**Decision:** Hybrid — structure-aware parsing + 512-token fallback

**Rationale:**
Different file types need different chunking. One-size-fits-all se quality girti hai. Structure-aware chunking preserves semantic boundaries (headings, functions, rows).

**Strategy by File Type:**

| File Type | Parser | Chunk Boundary | Metadata Extracted |
|-----------|--------|----------------|-------------------|
| **Markdown** | LlamaIndex `MarkdownNodeParser` | Headings (H1-H6) | YAML frontmatter → metadata |
| **YAML configs** | Custom PyYAML parser | Top-level keys | Key names, nesting depth |
| **CSV files** | Row-per-document | Each row = 1 chunk | Column headers → metadata |
| **Code files** | Tree-sitter | Function/class level | Language, function names |
| **Fallback** | `RecursiveCharacterTextSplitter` | 512 tokens, 50-token overlap | File path, position |

**Kyun 512 Tokens:**
- ChatGPT internally 800-token chunks use karta hai with 400-token overlap.
- 512 tokens sweet spot hai — enough context without diluting embedding quality.
- Gemini ka max input 2048 tokens hai per embedding call — 512 safely fits.

**Current Implementation:** Same for all stages. Chunking strategy scale se change nahi hota.

**Migration Effort:** None — strategy remains constant across all stages.

---

#### Decision 4: Namespace Design

**Decision:** Ek MongoDB collection per module + metadata filtering

**Rationale:**
- MongoDB me collection = natural isolation boundary.
- Vector search index per collection.
- Clean separation — Flex ka data Sync me mix nahi hoga.
- Cross-module query chahiye → multiple collections pe `$vectorSearch` chalao.

**Schema:**
```json
{
  "_id": "auto",
  "content": "actual text chunk",
  "embedding": [0.1, 0.2, ...],
  "metadata": {
    "module": "flex",
    "content_type": "agent",
    "file_path": "agents/content-strategist.md",
    "section": "## Strategy",
    "git_hash": "abc123",
    "tags": ["linkedin", "content"],
    "updated_at": "2026-03-16"
  }
}
```

**Collections:**
```
linkright DB:
├── user_profile        → Shared (name, preferences, settings)
├── flex_vectors        → Flex owns (LinkedIn content, drafts)
├── sync_vectors        → Sync owns (resume, cover letters, JD matches)
├── squick_vectors      → Squick owns (SDLC docs, PRDs, code)
├── lifeos_vectors      → LifeOS owns (experiences, memories)
├── autoflow_vectors    → AutoFlow owns (n8n workflow docs)
├── lrb_vectors         → Builder owns (module templates)
└── lr_events           → Shared (cross-module event log)
```

**Current Implementation (1 user):** 7 collections, 1 vector index each. No `userId` field needed.

**Growth Path (1K users):** Add `userId` field to every document. Pre-filter in `$vectorSearch`:
```javascript
filter: { "userId": "user_abc123", "content_type": "agent" }
```
MongoDB Atlas Flex tier ke 10 indexes sufficient hain (7 modules + 3 spare).

**Scale Path (100K users):** Single collection per module with `userId` metadata filtering (Pattern A from research). Or merge to fewer collections with compound filters.

**Migration Effort:** Personal → SaaS: Add `userId` field to schema + index definition. ~1 din.

---

#### Decision 5: Source of Truth & Sync

**Decision:** Files = source of truth. `lr sync` CLI command. Raw text MongoDB me store.

**Rationale:**
- Simple. Ek command. No webhook, no queue, no infra.
- Content hash se sirf changed files re-embed hoti hain — API calls save.
- Git repo = version history. Dolt = task history. MongoDB = vector index. Sab ka apna role.

**Sync Flow:**
```
Git Repo Files (MD/YAML/CSV/Code)
    │
    ▼
lr sync (CLI command)
    │
    ├── Scan module files
    ├── Content hash nikalo (SHA256)
    ├── Compare with Dolt stored hashes
    ├── Changed files → chunk + embed (Gemini API)
    ├── MongoDB me vectors upsert
    ├── Deleted files ke vectors remove
    └── Raw text Dolt me store (model switch backup)
```

**Current Implementation (1 user):**
- Manual CLI: `lr sync` ya `lr sync --module flex`
- Optional: git post-commit hook se auto-trigger
- Content hash in Dolt for change detection

**Growth Path (1K users):**
- CLI sync → **GitHub webhook + queue + worker**
- On git push → webhook triggers → job queue → worker re-embeds changed files
- Queue: Redis Streams ya simple MongoDB-based queue

**Scale Path (100K users):**
- Distributed embedding workers (multiple instances)
- Batch processing with rate limiting
- CDC (Change Data Capture) pipeline for real-time sync

**Migration Effort:**
- CLI → webhook: New webhook handler + queue system. ~3 din.
- Queue → distributed: Kubernetes workers. ~1 week.

---

#### Decision 6: Beads/Dolt Access Strategy

**Decision:** Dolt rehne do. Ek MCP server jo tasks + vectors dono expose kare. DoltHub free tier for backup.

**Rationale:**
- Dolt already running, 369 issues loaded. Kuch change nahi.
- DoltHub free tier: 100 MB free. Humara DB < 5 MB. Sufficient.
- Ek MCP server = kam infrastructure. Ek codebase. Ek deploy.
- Branch-per-agent pattern possible (Dolt ka killer feature) — PR workflow for data.

**Design:**
1. **Dolt** — task management (issues, sprints, status tracking)
2. **MCP server** — tools expose kare: `beads_list`, `beads_update`, `beads_create`, `vector_search`, `module_context`, `lr_sync_status`
3. **DoltHub** — `dolt push` for backup (free tier)
4. **Concurrency** — Optimistic locking (single user, conflicts nahi honge)

**Optimistic Locking SQL:**
```sql
UPDATE issues SET status='done', version=version+1
WHERE id='lr-123' AND version=5;
-- If 0 rows affected → conflict → retry with fresh data
```

**Current Implementation (1 user):** Dolt local + DoltHub free backup. Cost: ₹0.

**Growth Path (1K users):**
- DoltHub free → **DoltHub Pro** ($50/mo)
- Branch-per-agent: each agent gets own Dolt branch, cell-wise merge on completion
- Conflict resolution: LLM-based (if two agents edit same task)

**Scale Path (100K users):**
- Dolt → **Dolt Cloud** ya **PostgreSQL** (if SQL scale needed)
- Task management me Dolt ka version control unique advantage hai

**Migration Effort:**
- DoltHub free → Pro: Config change. Zero code.
- Dolt → PostgreSQL: Schema migration + query rewrite. ~1 week.

---

#### Decision 7: Overall Architecture (Personal Stage)

**Decision:** MongoDB (vectors + documents) + Dolt (tasks) + Ek MCP Server

```
┌──────────────────────────────────────────┐
│            AI Clients                     │
│  Claude Code │ Cursor │ ChatGPT │ Codex  │
└──────┬───────┴───┬────┴────┬────┴───┬────┘
       │           │         │        │
       │   stdio   │  stdio  │  HTTP  │ stdio
       │           │         │        │
       ▼           ▼         ▼        ▼
┌─────────────────────────────────────────┐
│       LinkRight MCP Server               │
│       (port 8766 / stdio)                │
│                                          │
│  Tools:                                  │
│  ┌─────────────────┐ ┌────────────────┐  │
│  │ vector_search   │ │ beads_list     │  │
│  │ module_context  │ │ beads_update   │  │
│  │ lr_sync         │ │ beads_create   │  │
│  │ sprint_status   │ │ module_list    │  │
│  └────────┬────────┘ └───────┬────────┘  │
│           │                  │            │
└───────────┼──────────────────┼────────────┘
            │                  │
       ┌────┴──────┐    ┌─────┴──────┐
       │ MongoDB   │    │   Dolt     │
       │ 8.2.5     │    │  (Beads)   │
       │           │    │            │
       │ Vectors + │    │ Tasks +    │
       │ Documents  │    │ Issues     │
       │ FREE      │    │ FREE       │
       └───────────┘    └────────────┘

  ┌──────────────┐    ┌──────────────┐
  │   Gemini     │    │    n8n       │
  │ Embedding    │    │ Orchestrator │
  │ API (FREE)   │    │ (port 5678)  │
  └──────────────┘    └──────────────┘
```

**Total Monthly Cost: ₹0 extra** (sirf Claude subscription jo already hai)

| Component | Cost | Status |
|-----------|------|--------|
| MongoDB Community 8.2.5 | ₹0 (self-hosted) | Running |
| Dolt | ₹0 (self-hosted) | Running |
| Gemini Embedding API | ₹0 (Google free tier) | Active |
| DoltHub backup | ₹0 (100 MB free) | Available |
| MCP Server | ₹0 (self-hosted) | To build |
| n8n | ₹0 (self-hosted) | Running |

---

### Phase 2 ACCESS (Decisions 8-12)

> **Lens:** MCP server design. How AI clients access LinkRight data.

---

#### Decision 8: MCP Server Technology

**Decision:** TypeScript MCP server using official `@modelcontextprotocol/sdk`

**Rationale:**
- Official MongoDB MCP server Node.js me hai — study + reuse patterns.
- Official MySQL MCP server bhi Node.js — Dolt ke liye directly usable.
- TypeScript SDK sabse mature (v1.x stable, v2 Q1 2026).
- Agent-Mail MCP already Node.js pe — stack consistency.
- FastMCP (TypeScript, npm) available for higher-level API.
- Node.js startup fast (~50 MB baseline vs Python ~80-100 MB).

**Alternatives Considered:**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Python FastMCP** | Official in SDK, decorator-based, Pythonic | Less mature ecosystem for MCP, higher memory | Close second |
| **TypeScript Official SDK** | Max control, strict spec | More boilerplate | Good for complex servers |
| **TypeScript FastMCP** | Higher-level, Zod schemas | Newer, community package | **RECOMMENDED** for speed |

**Research Data:**
- TypeScript SDK: `@modelcontextprotocol/server` v1.x stable, community ecosystem larger
- Python SDK: `mcp` PyPI, FastMCP built-in since v1.0, decorator-based
- Memory: TypeScript ~50 MB baseline vs Python ~80-100 MB (matters on 7.6 GB RAM)
- MongoDB driver: `mongodb` (Node.js native, excellent) vs `motor` (Python async, excellent)
- Dolt driver: `mysql2` (Node.js) vs `mysql-connector-python` (Python) — both work

**Current → Enterprise:** TypeScript → production-ready. No migration needed at any scale.

**Migration Effort:** None. Language choice is permanent.

---

#### Decision 9: MCP Server Architecture

**Decision:** Ek MCP server, dual transport (stdio + HTTP), ≤15 tools

**Rationale:**
- **Ek server** = kam infrastructure, ek codebase, ek deploy.
- **Dual transport** zaroori hai:
  - stdio → Claude Code, Cursor, Windsurf, Codex (local IDE clients)
  - HTTP (Streamable) → ChatGPT via Apps/Connectors
- **≤15 tools** kyunki Cursor ka 40-tool limit hai across ALL MCP servers. 15 tools = room for other servers.

**MCP Client Compatibility Matrix (March 2026):**

| Client | stdio | HTTP | Tools Limit | Resources | Priority |
|--------|-------|------|-------------|-----------|----------|
| **Claude Code** | ✅ | ✅ | Unlimited (deferred) | ✅ | HIGH |
| **Cursor** | ✅ | ✅ | **40 total** | Limited | HIGH |
| **ChatGPT** | ❌ | ✅ (Apps) | Via Apps | ❌ | MEDIUM |
| **Windsurf** | ✅ | ✅ | 100 | Limited | LOW |
| **VS Code Copilot** | ✅ | ✅ | Unlimited | ✅ | LOW |
| **Codex CLI** | ✅ | ❌ | TBD | ❌ | LOW |

**Tool Surface (8 tools — well within all limits):**

| Tool | Purpose | Data Source |
|------|---------|-------------|
| `vector_search` | Semantic search across module vectors | MongoDB `$vectorSearch` |
| `beads_list` | List/filter Beads issues | Dolt SQL |
| `beads_update` | Update issue status, add comments | Dolt SQL |
| `beads_create` | Create new issues | Dolt SQL |
| `module_list` | List available modules | File system |
| `module_context` | Get module-specific context | MongoDB (scoped vector search) |
| `lr_sync` | Trigger re-indexing | Embed + Store pipeline |
| `sprint_status` | High-level: open tasks, blockers, progress | Dolt composite query |

**Kyun High-Level Tools (not atomic CRUD):**
Research confirms: `sprint_status()` > `get_tasks() + filter() + count()`. Kam round-trips, kam tokens, better AI comprehension.

**Current Implementation (1 user):**
- stdio primary (Claude Code + Cursor)
- HTTP via ngrok tunnel for ChatGPT
- Port 8766 (agent-mail 8765 ke baad)

**Growth Path (1K users):** Same server, add auth layer (API keys).

**Scale Path (100K users):** Kubernetes deployment, load balanced, multiple replicas.

**Migration Effort:** Single → Kubernetes: Dockerfile + K8s manifests. ~3 din.

---

#### Decision 10: ChatGPT Integration

**Decision:** Same MCP server via HTTP + ChatGPT Apps/Connectors (GA since end 2025)

**Rationale:**
- ChatGPT MCP support GA hai via "Apps" (previously Connectors).
- Same server — one codebase serves ALL clients.
- No separate OpenAPI schema maintenance needed.
- Session-start: `sprint_status()` tool call loads context (~500-1000 tokens).

**Design:**
```
ChatGPT ──HTTP+SSE──→ ngrok/cloudflared ──→ EC2:8766 ──→ MCP Server
```

**Session-Start State Load:**
```yaml
sprint:
  open_tasks: 12
  blockers: 2
  recent_changes:
    - "lr-mcp-des-t1: MCP tool surface defined → closed"
    - "lr-enforce-t1: RAG enforcement research → closed"
  current_focus: "Phase 2 ACCESS layer — building MCP server"
  modules_active: ["flex", "squick"]
```

**Backup Plan:** Agar ChatGPT MCP flaky ho toh n8n webhook as fallback endpoint.

**Current Implementation:** ngrok tunnel for personal use. ₹0.

**Growth Path:** Public endpoint on cloud server. Let's Encrypt SSL.

**Scale Path:** Assistants API integration for programmatic access (replaces custom GPTs).

**Migration Effort:** ngrok → public: DNS + SSL setup. ~2 hours.

---

#### Decision 11: Context Enforcement Strategy

**Decision:** Tool-based RAG — MCP tools abstract all data access, raw file paths hidden

**Rationale:**
- Agar AI ke paas sirf search tools hain, toh wo search hi karega (no choice).
- Cursor bhi yehi karta hai — Turbopuffer se context pull karwata hai, raw reads nahi.
- Research confirmed: **98% token savings** vs raw file reads.
- Multi-tenant security automatically milti hai — vectors me tenant isolation hai.

**Strategy:**
1. MCP server me `vector_search()` aur `module_context()` tools do
2. `read_file()` tool bilkul MAT do (except code editing cases)
3. AI ko file paths NEVER dikhao — sirf search results with content
4. System prompt: "Always use vector_search to find relevant context."

**Hallucination Prevention:**
- Source attribution: every search result includes file_path + section in metadata
- Confidence scoring: vectorSearchScore threshold (e.g., >0.7 only)
- Instruction: "If not in knowledge files, say so. Don't fabricate."

**Current → Enterprise:** Same strategy at all scales. Tool-based RAG is inherently multi-tenant safe.

---

#### Decision 12: Write-Back Pattern

**Decision:** Dolt = source of truth for tasks. "Best-effort side effects" for vectors/files.

**Rationale:**
- Saga pattern overkill for single user.
- Task status change (Dolt) ≠ content change (vectors). Don't cascade unnecessarily.
- Vector DB is NEVER source of truth — always rebuildable from files + Dolt.

**Write Chain:**
```
AI calls beads_update(id, status="done")
  → Dolt updated (source of truth, optimistic locking) ✅
  → Vector re-index? NAHI (only if content changes, not status)
  → File update? NAHI (files = source for CONTENT, Dolt for TASKS)
```

**Rules:**
- Task status → Dolt only. No cascade.
- Content changes → `lr_sync` re-indexes affected vectors.
- Failed vector re-index? Manually `lr sync`. No big deal for 1 user.

**Growth Path (1K users):** Add event queue for write propagation. Still best-effort.

**Scale Path (100K users):** Saga pattern with compensating transactions. Redis Streams for event bus.

**Migration Effort:** Best-effort → Saga: Event bus + compensation logic. ~1 week.

---

### Phase 3 COORDINATION (Decisions 13-15)

> **Lens:** Modules ke beech data kaise flow kare. Sabse simple pattern.

---

#### Decision 13: Cross-Module Communication

**Decision:** MongoDB Change Streams (replica set pe hai!) + n8n for orchestration

**Rationale:**
- MongoDB already replica set mode me hai (`--replSet 7a1b66ea9370`). Change Streams FREE hai Community me.
- Real-time (<100ms latency), resume tokens survive restarts.
- n8n ka MongoDB Trigger node Change Streams use karta hai — zero custom code.
- n8n already running, Gemini configured, visual debugging possible.

**Alternatives Considered:**

| Pattern | Complexity | Cost | Solo Fit | SaaS Scale |
|---------|-----------|------|----------|------------|
| **MongoDB Change Streams + n8n** | Low | ₹0 | ★★★★★ | ★★★★ |
| **Redis Streams** | Medium | ₹0 (self-hosted) | ★★★ | ★★★★★ |
| **NATS** | Medium-High | ₹0 | ★★ | ★★★★★ |
| **RabbitMQ** | High | ₹0 | ★★ | ★★★★ |
| **File-based events** | Minimal | ₹0 | ★★★★ | ★ |

**Flagship Pipeline: LifeOS → Flex:**
```
User writes experience → lr sync → MongoDB lifeos_vectors
  → Change Stream detects insert
  → n8n MongoDB Trigger fires
  → n8n Code Node: extract + format
  → n8n Gemini Node: generate LinkedIn post draft
  → n8n MongoDB Node: insert into flex_vectors (type=draft)
  → n8n Telegram/Email: notify Satvik
```

**n8n Limitations:**
- Not a message queue (no persistence/replay) — MongoDB `lr_events` collection as event store
- Single instance (no HA in Community) — acceptable for solo dev
- Memory: ~50-100 MB per complex workflow
- Gemini rate: 1500 RPD, 15 RPM — add delays in batch operations

**Current Implementation (1 user):** Change Streams + n8n. Cost: ₹0.

**Growth Path (1K users):** Add **Redis Streams** as event bus (consumer groups, message persistence, replay).

**Scale Path (100K users):** Redis Streams → **NATS** or **Kafka** for enterprise-grade event streaming.

**Migration Effort:** Change Streams → Redis: Event bus adapter. ~3 din. n8n workflows unchanged (webhook triggers).

---

#### Decision 14: Agent Coordination

**Decision:** Sequential agents (Satvik manually orchestrates) + MCP tool listing for discovery

**Rationale:**
- Agents ek ke baad ek chalenge — parallel nahi. Satvik reviews between rounds.
- Agent discovery: MCP server ka `module_list()` tool batayega available modules.
- Shared memory: **MongoDB + Dolt IS the shared memory.** No Mem0/Zep needed.
  - Tasks/state → Dolt (cross-session persistent)
  - Content/context → MongoDB vectors (cross-module searchable)

**Kyun NAHI CrewAI/AutoGen/LangGraph:**
- Ye frameworks agent ORCHESTRATION ke liye hain — humein abhi orchestration nahi chahiye.
- Extra dependency, extra complexity, extra learning curve.
- MCP server + Dolt + MongoDB = sufficient coordination layer.
- CrewAI: $99/mo starting for hosted. We're at ₹0.
- LangGraph: Free OSS core, but LangSmith $39/seat/mo for observability.

**Current Implementation:** Manual sequential execution via IDE.

**Growth Path:** n8n-orchestrated agent chains (workflow triggers agent A → result → agent B).

**Scale Path:** LangGraph for automated multi-agent orchestration. Evaluate when needed.

**Migration Effort:** Manual → n8n: Workflow design. ~2 din. n8n → LangGraph: Framework migration. ~2 weeks.

---

#### Decision 15: Shared State Design

**Decision:** Module owns its collection. Cross-module via explicit vector search. User profile shared.

**Rationale:**
- No ACL, no RBAC, no complex permissions — single user.
- Module isolation = collection isolation. Clean aur simple.
- Cross-module read: `vector_search(query, module="lifeos")` — explicit module parameter.
- Cross-module write: NAHI. Modules doosre ki collection me write nahi karte.
- `lr_events` = shared event log for cross-module triggers.

**Access Rules:**
```
Module → Own collection:     READ ✅  WRITE ✅
Module → Other collection:   READ ✅ (via vector_search with module param)
Module → Other collection:   WRITE ❌ (only via events → n8n → target module)
Module → lr_events:          READ ✅  WRITE ✅
Module → user_profile:       READ ✅  WRITE ✅
```

**Current → Growth:** Add `tenant_id` field har document me. Same access rules, filtered by tenant.

**Migration Effort:** None for personal. Add `tenant_id` for SaaS: ~1 din schema update.

---

### Phase 4 DISTRIBUTION (Decisions 16-19)

> **Lens:** Content kaise package karo. Users tak kaise pahunchao.

---

#### Decision 16: Web Bundle Strategy

**Decision:** Custom Pandoc pipeline (markdown/YAML → HTML). Keep existing Flex bundle pattern.

**Rationale:**
- Satvik already Flex ke liye web bundles bana chuka hai (HTML knowledge files for ChatGPT).
- Research confirmed: **HTML > Markdown** for ChatGPT knowledge file retrieval.
  - HtmlRAG paper (Nov 2024): HTML meets or outperforms plain text on RAG datasets.
  - ChatGPT treats .md as code artifact, not knowledge source.
  - HTML heading hierarchy (H1-H6) improves chunk boundary detection.
- No dedicated "MD→ChatGPT bundle" tools exist (March 2026) — custom Pandoc scripting is the standard approach.

**Pipeline:**
```
Source Files (MD/YAML/CSV)
  ↓ [content hash check — skip unchanged]
  ↓ CSV → Markdown tables
  ↓ Merge related files per topic
  ↓ Pandoc → HTML (--standalone --self-contained)
  ↓ Inject version metadata header
  ↓ Output: bundles/<module>/*.html
```

**File Allocation (20-file ChatGPT limit):**

| Slot | File | Content |
|------|------|---------|
| 1 | `INDEX.html` | Master index — routing map (<5 KB) |
| 2-6 | `workflow-*.html` | 1 file per primary workflow |
| 7 | `agents.html` | All agent definitions |
| 8 | `frameworks.html` | Decision frameworks |
| 9 | `config.html` | Configuration reference |
| 10 | `checklists.html` | Quality checklists |
| 11 | `orchestrator.html` | Orchestration logic |
| 12 | `openapi-schema.html` | API spec (if applicable) |
| 13-20 | Module-specific | Domain knowledge, examples |

**File Sizing:** Sweet spot 10-50 KB per HTML. Max practical ~200 KB before retrieval degrades.

**Current Implementation:** Pandoc script, manual upload to ChatGPT. ₹0.

**Growth Path:** Automated rebuild via cron/git hook. OpenAI API upload (`POST /v1/files`).

**Scale Path:** Assistants API replaces custom GPTs (programmatic file + tool management).

**Migration Effort:** Manual → automated: Build script + cron. ~1 din.

---

#### Decision 17: MCP Client Compatibility

**Decision:** stdio transport primary. ≤15 tools. Test on Claude Code + Cursor first.

**Rationale:**
- stdio works on EVERY client. Universal compatibility.
- 8 tools (well within Cursor's 40-tool limit).
- Claude Code: deferred/lazy tool loading — rich descriptions for search discovery.
- Cursor: all tools loaded upfront — short descriptions preferred.

**Tool Description Strategy:**
- 1-2 sentence descriptions, front-load critical info
- Verb + resource pattern: "Search Beads issues by status and module"
- Claude Code: rich, descriptive (used for search/discovery)
- Cursor: shorter (context truncation at 70-120K)
- VS Code/Copilot: tools-only (no Resources or Sampling)
- Codex CLI: fast startup critical (auto-launches at session start, TOML config)

**Testing Pyramid:**
1. **Unit:** FastMCP in-memory testing (zero-config)
2. **Integration:** Subprocess over stdio, raw JSON-RPC
3. **Protocol:** MCP Inspector (`npx @modelcontextprotocol/inspector@latest`)
4. **Cross-client:** Manual smoke tests on Claude Code, Cursor, VS Code

**Current Implementation:** Build → test Claude Code → test Cursor → test ChatGPT.

**Migration Effort:** None — design is forward-compatible.

---

#### Decision 18: Stateless Client (ChatGPT) Strategy

**Decision:** Action-based state injection. YAML format. `sprint_status()` on session start.

**Rationale:**
- ChatGPT has NO persistent state between conversations.
- System prompt instruction: "FIRST call sprint_status()" loads current context.
- YAML format chosen over TOON (proven, universal, ChatGPT parses well).

**TOON vs YAML Analysis:**

| Format | Token Savings vs JSON | ChatGPT Parsing | Verdict |
|--------|----------------------|-----------------|---------|
| **TOON** | 40-60% fewer tokens | Good for flat data | Future — when mature |
| **YAML** | 18% fewer tokens | Excellent | **NOW — proven** |
| **JSON** | Baseline (most verbose) | Best (native) | Too verbose |

TOON benchmark: 76.4% accuracy, 39.9% fewer tokens. Impressive par adoption minimal. LangChain v0.2.8+ support hai.
**Decision:** Start with YAML. Evaluate TOON switch later.

**State Summary Budget:** ≤2000 tokens
- Blockers: 200 tokens
- Active tasks (top 10): 500 tokens
- Recent decisions: 300 tokens
- Recent changes: 300 tokens
- Upcoming: 200 tokens
- Meta: 100 tokens
- Buffer: 300 tokens

**Current Implementation:** MCP tool returns YAML on session start.

**Growth Path:** Knowledge file state snapshot (periodic rebuild of `state-current.html`).

**Scale Path:** Assistants API with real-time function calling (state loaded per-conversation).

**Migration Effort:** YAML → Assistants API: New integration layer. ~1 week.

---

#### Decision 19: SaaS Distribution Strategy (FUTURE — planning phase)

**Decision:** Personal → OSS → MCP Registry → ChatGPT Marketplace → Standalone SaaS

**Rationale:**
- Open-core model validated by industry (LangChain, CrewAI, Continue.dev).
- MCP registries (Smithery, mcp.run) growing fast, low competition.
- GPT Store reality check: 3M+ GPTs, ~$0.03/conversation, most hit $100-500/mo ceiling. **Not viable as primary channel.**

**Distribution Channels (ranked by ROI):**

| Channel | ROI | Effort | When |
|---------|-----|--------|------|
| **MCP Registries** (Smithery, mcp.run) | High | Low | Month 3 |
| **Direct SaaS + SEO** | High | Medium | Month 6 |
| **VS Code Marketplace** | Medium | Medium | Month 6 |
| **Cloud Marketplaces** (Azure, AWS) | High | High | Year 2 |
| **GPT Store** | Low | Low | Low priority |

**Pricing (Future):**

| Tier | Price | Includes |
|------|-------|----------|
| **Free (self-hosted)** | ₹0 | Full platform, BYO infrastructure |
| **Pro (managed)** | $9-15/mo | Hosted instance, auto-sync, managed MCP |
| **Teams** | $25/user/mo | Multi-user, shared modules, dashboards |
| **Enterprise** | Custom | Single-tenant, SLA, on-prem, custom modules |

**Phased Rollout:**
1. **NOW:** Personal use for job switch + product building
2. **Month 3:** Open-source core MCP server on GitHub
3. **Month 4:** Publish on Smithery + mcp.run
4. **Month 6:** Flex module as ChatGPT Custom Model (LinkedIn AI tool)
5. **Month 9:** Assistants API integration for programmatic access
6. **Month 12:** Standalone SaaS website (freemium)

**Multi-Tenant Design:**
- Start multi-tenant (MongoDB metadata filtering already designed)
- Offer self-hosted as premium for enterprise
- Namespace-per-tenant model (like Turbopuffer for Cursor — 95% storage cost savings)

**Security Note:**
- Embeddings ARE PII under GDPR — 92% text recovery possible from embeddings (Morris et al. 2023).
- Multi-tenant SaaS requires: metadata pre-filtering at query plan level, scoped OAuth tokens, burn-after-use for ephemeral sessions.

---

## 4. Transition Roadmap

---

### Stage 1: Personal (NOW — ₹0/mo)

**Timeline:** 2-3 weeks

**Kya Build Karna Hai:**
1. `lr sync` CLI — file scanning + hashing + Gemini embed + MongoDB upsert
2. MCP server — 8 tools (vector_search, beads_*, module_*, sprint_status, lr_sync)
3. Chunking parsers — markdown (LlamaIndex), YAML (PyYAML), CSV (row-per-doc), code (Tree-sitter)
4. MongoDB vector indexes — 1 per module collection
5. Test with Claude Code + Cursor
6. ChatGPT HTTP transport (ngrok tunnel)

**Architecture:**
```
┌─────────────────────────────────────────────────┐
│              PERSONAL STAGE (NOW)                │
│                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │ Claude   │  │ Cursor   │  │ ChatGPT  │     │
│   │ Code     │  │          │  │ (ngrok)  │     │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│        │stdio        │stdio        │HTTP        │
│        └──────┬──────┘─────────────┘            │
│               ▼                                  │
│   ┌───────────────────────────┐                  │
│   │  LinkRight MCP Server     │                  │
│   │  (8 tools, TS, port 8766) │                  │
│   └─────┬───────────┬─────────┘                  │
│         │           │                            │
│   ┌─────▼─────┐ ┌──▼──────┐  ┌──────────┐      │
│   │ MongoDB   │ │  Dolt   │  │  Gemini  │      │
│   │ 8.2.5    │ │ (tasks) │  │  (embed) │      │
│   │ (vectors) │ │  FREE   │  │  FREE    │      │
│   │  FREE     │ └─────────┘  └──────────┘      │
│   └───────────┘                                  │
│                     ┌──────────┐                 │
│                     │   n8n    │                 │
│                     │ (events) │                 │
│                     │  FREE    │                 │
│                     └──────────┘                 │
│                                                  │
│   Machine: EC2 → Oracle Free Tier (24GB RAM)    │
│   Total Cost: ₹0/mo                             │
└─────────────────────────────────────────────────┘
```

---

### Stage 2: Open Source + Early Users (Month 3-6 — ₹0/mo)

**Kya Change Hoga:**
- MCP server open-source on GitHub (MIT/Apache 2.0 license)
- Publish to Smithery + mcp.run (MCP registries)
- README + docs + quickstart guide
- GitHub Actions CI/CD for testing

**Kya Same Rahega:**
- Same codebase, same architecture
- Self-hosted MongoDB Community + Dolt
- Gemini free tier for embeddings
- stdio transport for IDE clients

**Kya Naya Infra Chahiye:** Nothing. Users self-host on their own machines.

**Architecture:** Same as Stage 1. Users run their own instance.

---

### Stage 3: Growth (1,000-10,000 users — ~$200-500/mo)

**Key Changes:**

| Component | From | To | Code Change |
|-----------|------|-----|-------------|
| **Vector DB** | MongoDB Community | MongoDB Atlas Flex ($8-30/mo) | Connection string change only |
| **Embeddings** | Gemini free | Voyage-4 or OpenAI 3-large | Config change + re-embed batch |
| **Sync** | CLI `lr sync` | GitHub webhook + queue + worker | New webhook handler (~3 din) |
| **Hosting** | EC2/Oracle | Small cloud instance | Same code, new deploy |
| **Dolt backup** | DoltHub free | DoltHub Pro ($50/mo) | Config change |
| **Auth** | None | API keys (simple) | Middleware addition (~1 din) |
| **Monitoring** | None | Basic logging + alerting | New service |

**Architecture:**
```
┌─────────────────────────────────────────────────────┐
│              GROWTH STAGE (1K-10K users)             │
│                                                      │
│   ┌──────────────────────────────────────┐          │
│   │        Load Balancer (Nginx)          │          │
│   └──────────┬───────────────┬───────────┘          │
│              │               │                       │
│   ┌──────────▼──┐   ┌───────▼────────┐             │
│   │ MCP Server  │   │  MCP Server    │             │
│   │ (instance 1)│   │  (instance 2)  │             │
│   └──────┬──────┘   └──────┬─────────┘             │
│          └────────┬────────┘                        │
│                   │                                  │
│   ┌───────────────▼──────────────────┐              │
│   │     MongoDB Atlas Flex           │              │
│   │     ($8-30/mo, 10 indexes)       │              │
│   │     userId pre-filtering         │              │
│   └──────────────────────────────────┘              │
│                                                      │
│   ┌──────────┐  ┌───────────┐  ┌──────────────┐    │
│   │  Dolt    │  │  Voyage-4 │  │  Redis Queue │    │
│   │ (DoltHub │  │  Embedding│  │  (sync jobs) │    │
│   │  Pro)    │  │  ($0.01/  │  │              │    │
│   │ $50/mo   │  │  1M tok)  │  │              │    │
│   └──────────┘  └───────────┘  └──────────────┘    │
│                                                      │
│   Total Cost: ~$200-500/mo                          │
└─────────────────────────────────────────────────────┘
```

---

### Stage 4: Scale (10,000-100,000 users — ~$1,000-5,000/mo)

**Key Changes:**

| Component | From | To | Effort |
|-----------|------|-----|--------|
| **Vector DB** | Atlas Flex | Atlas M30-M40 dedicated OR Qdrant Cloud | Config or ~2 weeks migration |
| **Task DB** | Dolt | Dolt Cloud or PostgreSQL | ~1 week if PostgreSQL |
| **MCP Server** | 2 instances | Kubernetes deployment, auto-scaling | ~1 week K8s setup |
| **Events** | Change Streams + n8n | Redis Streams for cross-module events | ~3 din adapter |
| **Auth** | API keys | **OAuth 2.1** (proper auth) | ~1 week |
| **ChatGPT** | Custom GPT + MCP | **Assistants API** (programmatic) | ~1 week |
| **Monitoring** | Basic | Prometheus + Grafana | ~3 din |
| **Quantization** | None | Scalar INT8 (3.75x RAM savings) | Index rebuild (~1 din) |

**Architecture:**
```
┌───────────────────────────────────────────────────────────┐
│                SCALE STAGE (10K-100K users)                │
│                                                           │
│   ┌────────────────────────────────────────┐              │
│   │      Kubernetes Cluster                 │              │
│   │                                         │              │
│   │  ┌──────────┐ ┌──────────┐ ┌────────┐  │              │
│   │  │MCP Pod 1 │ │MCP Pod 2 │ │MCP Pod │  │              │
│   │  │          │ │          │ │  ...N   │  │              │
│   │  └────┬─────┘ └────┬─────┘ └───┬────┘  │              │
│   │       └──────┬──────┘───────────┘       │              │
│   │              │                          │              │
│   │  ┌───────────▼──────────────┐           │              │
│   │  │  Redis Streams           │           │              │
│   │  │  (event bus + job queue) │           │              │
│   │  └──────────────────────────┘           │              │
│   └─────────────────────────────────────────┘              │
│                                                           │
│   ┌─────────────────┐  ┌──────────────────┐              │
│   │ MongoDB Atlas    │  │  Qdrant Cloud    │              │
│   │ M30-M40         │  │  (alternative)   │              │
│   │ + Search Nodes   │  │  $100-300/mo     │              │
│   │ $387-780/mo     │  │  10M vectors     │              │
│   │ INT8 quant      │  └──────────────────┘              │
│   └─────────────────┘                                     │
│                                                           │
│   ┌──────────┐  ┌──────────────┐  ┌───────────────┐     │
│   │ OAuth 2.1│  │ Assistants   │  │ Prometheus +  │     │
│   │ Auth     │  │ API          │  │ Grafana       │     │
│   │ Server   │  │ (ChatGPT)    │  │ Monitoring    │     │
│   └──────────┘  └──────────────┘  └───────────────┘     │
│                                                           │
│   Total Cost: ~$1,000-5,000/mo                           │
│   Revenue Target: $5,000-20,000/mo                       │
└───────────────────────────────────────────────────────────┘
```

---

### Stage 5: Enterprise SaaS (100K+ users — $10K+/mo revenue)

**Key Changes:**
- Multi-region deployment (US, EU, APAC)
- SOC2 Type II + GDPR compliance
- On-premise deployment option (Qdrant Hybrid Cloud: data on-prem, control plane managed)
- Team collaboration features (shared modules, role-based access)
- Custom modules marketplace (third-party developers build modules)
- Dedicated instances for enterprise clients (single-tenant option)
- Enterprise SSO (SAML, OIDC)
- SLA guarantees (99.9% uptime)

**Architecture:**
```
┌──────────────────────────────────────────────────────────────────┐
│                  ENTERPRISE STAGE (100K+ users)                   │
│                                                                   │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │  US Region   │  │  EU Region   │  │ APAC Region  │          │
│   │              │  │              │  │              │          │
│   │ K8s Cluster  │  │ K8s Cluster  │  │ K8s Cluster  │          │
│   │ MCP Pods     │  │ MCP Pods     │  │ MCP Pods     │          │
│   │ Redis        │  │ Redis        │  │ Redis        │          │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│          │                 │                 │                   │
│   ┌──────▼─────────────────▼─────────────────▼──────┐           │
│   │           Global Load Balancer (CDN)              │           │
│   └──────────────────────┬────────────────────────────┘           │
│                          │                                       │
│   ┌──────────────────────▼────────────────────────┐              │
│   │                Data Layer                      │              │
│   │                                                │              │
│   │  MongoDB Atlas       │  Qdrant Hybrid Cloud   │              │
│   │  Multi-region        │  (on-prem option)      │              │
│   │  Enterprise cluster  │  Data stays local      │              │
│   │  $5K-70K/yr         │  Control plane managed  │              │
│   │                      │                         │              │
│   │  OR Turbopuffer      │  For enterprise         │              │
│   │  ($4K+/mo)          │  tenants who need        │              │
│   │  S3-backed           │  data residency          │              │
│   └──────────────────────────────────────────────┘               │
│                                                                   │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│   │ SOC2 + GDPR  │  │ Module       │  │ Enterprise   │          │
│   │ Compliance   │  │ Marketplace  │  │ SSO (SAML)   │          │
│   └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│   Revenue: $10K-100K+/mo                                         │
│   Infra Cost: $3K-10K/mo                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Cost Projection

| Stage | Users | Monthly Infra Cost | Revenue Target | Gross Margin |
|-------|-------|-------------------|----------------|-------------|
| **1. Personal** | 1 | **₹0** | ₹0 | N/A |
| **2. Open Source** | 10-100 | **₹0** | ₹0 (reputation) | N/A |
| **3. Growth** | 1K-10K | **$200-500** (~₹17K-42K) | $2K-10K/mo | 75-95% |
| **4. Scale** | 10K-100K | **$1K-5K** (~₹84K-420K) | $10K-50K/mo | 80-90% |
| **5. Enterprise** | 100K+ | **$3K-10K** (~₹250K-840K) | $50K-100K+/mo | 85-90% |

**Detailed Cost Breakdown (Stage 3 — Growth):**

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| MongoDB Atlas Flex | $8-30 | 5 GB, 10 indexes, 500 ops/sec |
| Embedding API (Voyage-4) | $10-50 | ~5M tokens/mo @$0.01/1M |
| DoltHub Pro | $50 | Unlimited repos |
| Cloud hosting | $50-100 | Small VPS (Oracle, Hetzner) |
| Ngrok Pro (or Cloudflare Tunnel) | $0-10 | ChatGPT HTTP endpoint |
| Redis (managed) | $0-30 | Free tier or small instance |
| Domain + SSL | $10 | Annual cost amortized |
| **Total** | **$128-270** | |

**Detailed Cost Breakdown (Stage 4 — Scale):**

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| MongoDB Atlas M30 | $387 | 8 GB RAM, 40 GB storage |
| OR Qdrant Cloud | $100-300 | 10M vectors, multi-tenant |
| Embedding API | $50-200 | Bulk embedding at scale |
| Kubernetes cluster | $200-500 | 3-5 nodes |
| Redis managed | $50-100 | Streams + cache |
| Monitoring (Grafana Cloud) | $0-50 | Free tier often sufficient |
| Auth service | $0-100 | Auth0 free → paid |
| **Total** | **$787-1,637** | |

---

## 6. Risk Analysis

### Risk 1: MongoDB Community → Atlas Migration

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| API breaking changes between Community 8.2 and Atlas | HIGH | LOW | Same `$vectorSearch` syntax. Verified: identical API. |
| Atlas pricing increase | MEDIUM | MEDIUM | Qdrant Cloud as backup ($100-300/mo for same workload). LlamaIndex abstraction layer enables switch. |
| Performance degradation on Atlas shared tier | LOW | LOW | Atlas Flex tier has 500 ops/sec. Upgrade to M10 ($57/mo) if needed. |

**Verdict:** LOW risk. Same API guaranteed. Qdrant escape hatch available.

### Risk 2: Dolt Scaling Bottleneck

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Dolt query performance at >100K tasks | MEDIUM | MEDIUM | Dolt is MySQL-compatible. Can migrate to PostgreSQL or MySQL. |
| DoltHub service discontinuation | LOW | LOW | Dolt is open-source. Self-hosted backup always available. |
| Branch-per-agent merge conflicts | LOW | MEDIUM | Cell-wise merge handles 95% cases. LLM-based resolution for rest. |

**Verdict:** MEDIUM risk. PostgreSQL migration path clear if needed (~1 week).

### Risk 3: MCP Protocol Adoption

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| MCP doesn't become industry standard | HIGH | LOW | MCP already supported by: Claude, Cursor, Windsurf, VS Code Copilot, Codex, ChatGPT. Anthropic + major players backing it. |
| MCP spec breaking changes | MEDIUM | MEDIUM | v2 (Q1 2026) planned. SDK handles migration. Active working groups on backwards compatibility. |
| Client support fragmentation | MEDIUM | MEDIUM | Design tools-first (universal primitive). Avoid relying on Resources/Prompts (limited support). |

**Verdict:** LOW risk. MCP is the emerging standard. All major AI tools support it.

### Risk 4: Gemini Free Tier Changes

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Google removes free Gemini embedding API | MEDIUM | MEDIUM | Switch to Voyage-4 ($0.01/1M tokens) or OpenAI 3-small ($0.02/1M tokens). Config change only. |
| Rate limit tightened (currently 1500 RPD) | LOW | HIGH | Batch processing, caching, off-peak scheduling. |
| Embedding quality degradation in updates | LOW | LOW | Pin model version. Re-embed on model change. |

**Verdict:** MEDIUM risk. Multiple fallback options at low cost.

### Risk 5: Security — Embedding Inversion Attacks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| Text recovery from stored embeddings (92% success for short text) | HIGH | LOW (single user now) | Personal stage: no exposure. SaaS: metadata pre-filtering enforced at query plan level. |
| GDPR compliance for career data embeddings | HIGH | MEDIUM (if EU users) | Right to deletion must include embeddings. Design "delete user" to cascade to vectors. |

**Verdict:** LOW risk now (single user). HIGH priority when SaaS launches.

### Risk 6: AWS Free Tier Expiry (30 days)

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| EC2 instance becomes paid | HIGH | CERTAIN | **Oracle Free Tier**: 24 GB RAM, 200 GB disk, 4 OCPU — FOREVER FREE. MongoDB + Dolt + MCP server sab easily chalega. |
| Data migration required | MEDIUM | CERTAIN | `mongodump` + `mongorestore` for MongoDB. `dolt clone` for Dolt. ~2 hours total. |

**Verdict:** PLANNED. Oracle Free Tier is the immediate next step. Zero cost impact.

---

## 7. Implementation Priority (Build Order)

### Week 1: Foundation (Days 1-5)

| Day | Task | Deliverable | Dependency |
|-----|------|-------------|-----------|
| **1** | MongoDB vector indexes create karo (1 per module) | 7 vector search indexes on existing collections | None |
| **1** | `lr sync` CLI — file scanner + content hasher | Script jo module files scan kare, SHA256 hash kare, changed detect kare | None |
| **2** | `lr sync` CLI — Gemini embed + MongoDB upsert | Changed files embed hoke MongoDB me store hon | Day 1 |
| **3** | MCP server scaffold — TypeScript, stdio transport | Server starts, responds to `initialize`, lists tools | None |
| **3** | MCP tool: `vector_search` | Semantic search working via MCP | Day 2 + Day 3 |
| **4** | MCP tools: `beads_list`, `beads_update`, `beads_create` | Dolt task management via MCP | Day 3 |
| **4** | MCP tools: `module_list`, `module_context` | Module discovery + scoped search | Day 3 |
| **5** | MCP tool: `sprint_status`, `lr_sync` | Composite status + trigger sync | Day 4 |
| **5** | Test: Claude Code + Cursor integration | Both IDEs connected, tools working | Day 4 |

### Week 2: Enrichment (Days 6-10)

| Day | Task | Deliverable | Dependency |
|-----|------|-------------|-----------|
| **6** | Chunking parsers — markdown, YAML, CSV, code | LlamaIndex + custom parsers | None |
| **6** | Update `lr sync` to use proper chunking | Better quality embeddings | Day 6 |
| **7** | HTTP transport for MCP server | Streamable HTTP on port 8766 | Week 1 |
| **7** | ChatGPT integration (ngrok tunnel) | ChatGPT calls MCP tools | Day 7 |
| **8** | `lr bundle` CLI — Pandoc pipeline for ChatGPT bundles | HTML knowledge files auto-generated | None |
| **9** | Change Stream watcher + n8n integration | Cross-module events flowing | Week 1 |
| **10** | End-to-end test: LifeOS → Flex pipeline | Write experience → auto-generate LinkedIn draft | Day 9 |

### Week 3: Polish + Migration (Days 11-15)

| Day | Task | Deliverable | Dependency |
|-----|------|-------------|-----------|
| **11** | Oracle Free Tier setup + data migration | MongoDB + Dolt running on Oracle | None |
| **12** | MCP server deploy on Oracle | All clients reconnected | Day 11 |
| **13** | Performance testing + tuning | numCandidates optimization, response time <200ms | Day 12 |
| **14** | Documentation — setup guide, API docs | Users can self-deploy | All |
| **15** | Dogfooding — use LinkRight for actual job search | Real-world validation | All |

**After Week 3:**
- System is LIVE for personal use
- Job search with AI-assisted resume + LinkedIn optimization
- Every AI tool (Claude, Cursor, ChatGPT) has full context of career, projects, tasks
- Foundation ready for open-source release (Month 3)

---

## Summary — Sab Decisions Ek Jagah

### Phase 1 DATA ✅

| # | Decision | Pick | Cost | Time |
|---|----------|------|------|------|
| 1 | Vector DB | MongoDB 8.2 Community (already running) | ₹0 | 0 |
| 2 | Embedding | Gemini API (FREE, 68.32 NDCG@10) | ₹0 | 0 |
| 3 | Chunking | Hybrid structure-aware + 512-token fallback | ₹0 | 1 din |
| 4 | Namespace | 1 collection per module in MongoDB | ₹0 | 1 hr |
| 5 | Sync | `lr sync` CLI + content hashing | ₹0 | 2 din |
| 6 | Tasks | Dolt + single MCP + DoltHub free | ₹0 | 3 din |
| 7 | Architecture | MongoDB + Dolt + 1 MCP Server | ₹0 | Combined |

### Phase 2 ACCESS ✅

| # | Decision | Pick | Cost | Time |
|---|----------|------|------|------|
| 8 | MCP Tech | TypeScript + official SDK | ₹0 | — |
| 9 | MCP Architecture | Dual transport (stdio+HTTP), ≤15 tools | ₹0 | 3 din |
| 10 | ChatGPT | Same MCP via Apps/Connectors | ₹0 | 0.5 din |
| 11 | Enforcement | Tool-based RAG, hide file paths | ₹0 | Built-in |
| 12 | Write-Back | Dolt source of truth, best-effort side effects | ₹0 | Built-in |

### Phase 3 COORDINATION ✅

| # | Decision | Pick | Cost | Time |
|---|----------|------|------|------|
| 13 | Cross-Module | MongoDB Change Streams + n8n | ₹0 | 1 din |
| 14 | Agent Coord | Sequential + MCP discovery | ₹0 | Built-in |
| 15 | Shared State | Module owns collection, explicit cross-module | ₹0 | Built-in |

### Phase 4 DISTRIBUTION ✅

| # | Decision | Pick | Cost | Time |
|---|----------|------|------|------|
| 16 | Web Bundles | Custom Pandoc pipeline, HTML | ₹0 | 1 din |
| 17 | MCP Clients | stdio primary, ≤15 tools, Claude+Cursor first | ₹0 | Built-in |
| 18 | Stateless | YAML state injection, sprint_status() on start | ₹0 | Built-in |
| 19 | SaaS Strategy | Personal → OSS → Registry → SaaS (planned) | ₹0 | Future |

---

**Grand Total: ₹0 extra per month. ~2-3 weeks me working system.**

**Clear growth path: Personal (₹0) → OSS (₹0) → Growth ($200/mo) → Scale ($1-5K/mo) → Enterprise ($10K+/mo revenue).**

**Har transition me kya change hoga, kya same rahega, kitna code rewrite hoga — sab documented hai.**

*Ye blueprint hai. Ab BUILD karte hain.* 🔨

---

*Document compiled: 2026-03-16 | Based on 7 research documents, 21 deep research questions, benchmarks from Athenic 2025, Firecrawl 2026, MongoDB internal benchmarks, and industry pricing analysis.*
