# Phase 1 DATA Layer — Final Recommendations

> **Lens:** Satvik ka problem pehle solve karo. Free/open-source. Fastest implementation. SaaS baad me.

---

## Satvik Ki Actual Situation (March 2026)

| Cheez | Status |
|-------|--------|
| **Machine** | AWS EC2, 2 vCPU, 7.6GB RAM, 30GB disk (16GB used, 14GB free) |
| **AWS free tier** | Sirf 30 din baaki. Uske baad Google Cloud free credits ya Oracle free tier pe shift |
| **Budget** | Max ₹20,000/month (~$200). Claude Max subscription isme se hi hai |
| **MongoDB 8.2.5** | ✅ ALREADY INSTALLED AUR RUNNING — mongod + mongot dono chal rahe hain |
| **MongoDB data** | `sma` DB hai (linkedin_posts, life_experiences, sma_config), `test_vector` bhi hai |
| **Dolt/Beads** | ✅ Running, 369 issues loaded |
| **ChromaDB** | Hai par MongoDB already hai toh ChromaDB ki zaroorat nahi |
| **Embedding** | Gemini API FREE use kar raha hai n8n workflows me |
| **MCP** | Configs exist for Cline, Codex, Windsurf |
| **Goal** | Job switch ASAP + apne products fast banana |

---

## Decision 1: Vector Database

### 🏆 Final Pick: **MongoDB 8.2 Community (jo already chal raha hai)**

**Kyun MongoDB:**
- ✅ **Already installed hai** — mongod + mongot dono running hain. Setup time = ZERO
- ✅ **$vectorSearch support hai** — mongot chal raha hai matlab vector search ready hai
- ✅ **Free, self-hosted** — koi paisa nahi lagega
- ✅ **Document + Vector ek jagah** — task data, user data, vectors sab ek DB me. No split architecture needed
- ✅ **`sma` database already hai** — linkedin_posts, life_experiences already stored
- ✅ **Hybrid search** — $rankFusion se keyword + semantic search combine ho sakta hai
- ✅ **Cloud migration easy** — jab SaaS banega, MongoDB Atlas pe shift karna same API hai

**Kyun NAHI ChromaDB:**
- MongoDB already hai aur chal raha hai. ChromaDB extra dependency hai
- ChromaDB me document storage alag se manage karna padega, MongoDB me sab ek jagah

**Kyun NAHI Qdrant abhi:**
- Extra service install karni padegi, extra RAM lagega (already 2.7GB used out of 7.6GB)
- 30GB disk pe ek aur DB = disk space waste
- Single user ke liye Qdrant ki multi-tenancy ki zaroorat nahi

**SaaS upgrade path:** MongoDB Community → MongoDB Atlas (same API, same queries, zero code change)

### ✅ LOCK karna hai? Y/N

---

## Decision 2: Embedding Model

### 🏆 Final Pick: **Gemini Embedding API (FREE — jo tu already use kar raha hai)**

**Kyun Gemini:**
- ✅ **FREE hai** — zero cost. Tu already n8n me use kar raha hai
- ✅ **gemini-embedding-001 / text-embedding-005** — quality achhi hai (68.32 MTEB retrieval score)
- ✅ **3072 dimensions** — OpenAI 3-small (1536d) se zyada rich representation
- ✅ **No extra API key cost** — Google AI Studio free tier sufficient hai
- ✅ **Multilingual** — Hinglish handling better than OpenAI for Indian languages

**Kyun NAHI OpenAI text-embedding-3-small:**
- $0.02/1M tokens — chota amount hai par jab FREE option available hai toh kyun pay karein?
- Satvik already Gemini embeddings use kar raha hai n8n me — consistency maintain rakhein

**Kyun NAHI local models:**
- EC2 pe GPU nahi hai. CPU pe embedding slow hoga
- Gemini API free hai toh local ka kya fayda?

**SaaS note:** Jab paid users aayenge, Voyage-4-Large ya OpenAI 3-large pe switch kar sakte hain for better quality. Abhi FREE se kaam chalao.

### ✅ LOCK karna hai? Y/N

---

## Decision 3: Chunking Strategy

### 🏆 Final Pick: **Hybrid — structure-aware parsing + 512-token fallback**

Ye decision personal vs SaaS se change nahi hota:

1. **Markdown files** → LlamaIndex `MarkdownNodeParser` (headings se split, YAML frontmatter → metadata)
2. **YAML configs** → Custom parser (PyYAML se top-level keys pe chunk)
3. **CSV files** → Row-per-document (har row = ek chunk)
4. **Code files** → Tree-sitter (function/class level)
5. **Fallback** → `RecursiveCharacterTextSplitter` 512 tokens, 50-token overlap

**Implementation time:** ~1 din parsers likhne me + test karne me

### ✅ LOCK karna hai? Y/N

---

## Decision 4: Namespace Design

### 🏆 Final Pick: **Ek MongoDB collection per module + metadata filtering**

**Design:**
- `linkright` database me 6 collections: `flex_vectors`, `sync_vectors`, `squick_vectors`, `lifeos_vectors`, `autoflow_vectors`, `lrb_vectors`
- Har vector document ka schema:
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
- Cross-module query chahiye? → Multiple collections pe $vectorSearch chalao

**Kyun collection-per-module:**
- MongoDB me collection = natural isolation boundary
- Vector search index per collection hota hai
- Clean separation — Flex ka data Sync me mix nahi hoga

**SaaS change:** Collection naming convention change hoga: `{user_id}_flex_vectors`. Ya single collection + `tenant_id` filter.

### ✅ LOCK karna hai? Y/N

---

## Decision 5: Source of Truth & Sync

### 🏆 Final Pick: **Files = source of truth. `lr sync` CLI command. Raw text MongoDB me store.**

**Flow:**
1. Tu apne markdown/YAML/CSV files edit karta hai git repo me
2. `lr sync` command chalata hai (ya git post-commit hook se auto)
3. Script:
   - Saari module files scan karta hai
   - Har file ka content hash nikalta hai
   - Dolt me stored hash se compare karta hai
   - Sirf changed files ko re-chunk + re-embed karta hai (Gemini API se)
   - MongoDB me vectors upsert karta hai
   - Deleted files ke vectors remove karta hai
4. Raw text Dolt me bhi store hota hai (model switch ke liye backup)

**Kyun ye approach:**
- Simple. Ek command. No webhook, no queue, no infra
- Tu akela user hai — real-time sync ki zaroorat nahi
- Content hash reliable hai — git hook se zyada stable

**Implementation:** ~2 din

### ✅ LOCK karna hai? Y/N

---

## Decision 6: Beads/Dolt Access Strategy

### 🏆 Final Pick: **Dolt rehne do. Ek MCP server banao jo tasks + vectors dono expose kare. DoltHub free tier for backup.**

**Design:**
1. **Dolt** — already running, 369 issues loaded. Kuch change nahi
2. **Ek MCP server** (TypeScript ya Python) jo expose kare:
   - `beads_list` / `beads_update` / `beads_create` → Dolt SQL queries
   - `vector_search` → MongoDB $vectorSearch
   - `module_context` → File system reads
   - `lr_sync_status` → Last sync info
3. **DoltHub free tier** (100MB free, tera DB < 5MB) — `dolt push` for backup
4. **Concurrency** — Optimistic locking (tu akela hai, conflicts nahi honge)

**Kyun ek MCP server:**
- Kam infrastructure. Ek process, ek port
- Claude Code, Cursor, Windsurf sab ek config se connect
- Agent-mail MCP already port 8765 pe hai — naya server 8766 pe chalega

**Cost: $0** (DoltHub free tier sufficient hai)

### ✅ LOCK karna hai? Y/N

---

## Decision 7: Overall Architecture

### 🏆 Final Pick: **MongoDB (vectors + documents) + Dolt (tasks) + Ek MCP server**

```
┌──────────────────────────────────┐
│         AI Clients               │
│ Claude Code │ Cursor │ ChatGPT   │
└──────┬──────┴───┬────┴─────┬────┘
       │          │          │
       ▼          ▼          ▼
┌────────────────────────────────┐
│     LinkRight MCP Server       │
│     (port 8766)                │
│                                │
│  Tools:                        │
│  - vector_search  → MongoDB    │
│  - beads_list     → Dolt       │
│  - beads_update   → Dolt       │
│  - module_context → Files      │
│  - lr_sync        → Embed+Store│
└──────┬────────────┬────────────┘
       │            │
  ┌────┴──────┐ ┌──┴─────┐
  │ MongoDB   │ │  Dolt  │
  │ 8.2.5     │ │(Beads) │
  │ vectors + │ │ tasks  │
  │ documents │ │        │
  │ FREE      │ │ FREE   │
  └───────────┘ └────────┘
```

**Total monthly cost: ₹0 extra** (sirf Claude subscription jo already hai)
- MongoDB: FREE (self-hosted, already running)
- Dolt: FREE (self-hosted, already running)
- Gemini Embedding: FREE (Google AI Studio)
- DoltHub: FREE (100MB tier)
- MCP Server: FREE (self-hosted)

**Implementation timeline:**
| Step | Time | What |
|------|------|------|
| 1 | 1 din | `lr sync` CLI — file scanning + hashing + Gemini embed + MongoDB upsert |
| 2 | 2 din | MCP server — basic tools (vector_search, beads_list, beads_update) |
| 3 | 1 din | Chunking parsers — markdown, YAML, CSV |
| 4 | 1 din | Test with Claude Code + Cursor |
| **Total** | **~5 din** | **Working system** |

**30-din AWS constraint ke baad:**
- MongoDB + Dolt + MCP server sab Oracle Free Tier ya Google Cloud free credits pe shift kar sakte hain
- Oracle free tier me 24GB RAM + 200GB disk milta hai FOREVER — MongoDB easily chalega
- Google Cloud $300 free credit for 90 days — usse bhi kaam chal jayega

### ✅ LOCK karna hai? Y/N

---

## Summary — Sab Decisions Ek Jagah

| # | Decision | Final Pick | Cost | Time |
|---|----------|-----------|------|------|
| 1 | Vector DB | **MongoDB 8.2 Community** (already running) | ₹0 | 0 |
| 2 | Embedding | **Gemini API** (already using, FREE) | ₹0 | 0 |
| 3 | Chunking | **Hybrid structure-aware + 512-token** | ₹0 | 1 din |
| 4 | Namespace | **1 collection per module** in MongoDB | ₹0 | 1 hr |
| 5 | Sync | **`lr sync` CLI + content hashing** | ₹0 | 2 din |
| 6 | Tasks | **Dolt + single MCP server** | ₹0 | 3 din |
| 7 | Architecture | **MongoDB + Dolt + 1 MCP** | ₹0 | Combined |

**Grand total: ₹0 extra per month. ~5 din me working system.**

---

*Har decision pe Y ya N bol. Jo N ho uspe baat karte hain. Lock karte hain aur BUILD karte hain.* 🐾
