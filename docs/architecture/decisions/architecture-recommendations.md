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

---
---

# Phase 2 ACCESS Layer — Final Recommendations

> **Same lens:** Personal-first. Free. Use what exists. SaaS baad me.

---

## Decision 8: MCP Server Technology

### 🏆 Final Pick: **TypeScript MCP server using official @modelcontextprotocol/sdk**

**Kyun TypeScript:**
- ✅ Official MongoDB MCP server Node.js me hai — study + reuse kar sakte hain
- ✅ Official MySQL MCP server bhi Node.js — Dolt ke liye directly use ho sakta hai
- ✅ TypeScript SDK sabse mature hai (official Anthropic SDK)
- ✅ IDE components ecosystem TypeScript me zyada hai
- ✅ Agent-Mail MCP already Node.js pe hai — consistency

**Kyun NAHI Python:**
- Python SDK less mature, fewer examples
- FastMCP (Python) exists par community smaller hai
- Humara existing MCP (agent-mail) Node.js pe hai — ek stack rakh

**SaaS note:** TypeScript → production-ready. No migration needed.

### ✅ LOCK karna hai? Y/N

---

## Decision 9: MCP Server Architecture

### 🏆 Final Pick: **Ek MCP server, dual transport (stdio + HTTP), ≤15 tools**

**Design:**
- **Ek server process** jo dono transports support kare:
  - **stdio** → Claude Code, Cursor, Windsurf, Codex (local IDE clients)
  - **HTTP (Streamable)** → ChatGPT via Apps/Connectors
- **Port:** 8766 (agent-mail 8765 ke baad)
- **Tool count:** Max 15 (Cursor ka 40-tool limit hai, par kam tools = better AI performance)

**Tools list (Phase 1 — minimum viable):**
```
1. vector_search(query, module, limit)     → MongoDB $vectorSearch
2. beads_list(filter, status, type)         → Dolt SQL query
3. beads_update(id, status, notes)          → Dolt SQL update
4. beads_create(title, type, parent_id)     → Dolt SQL insert
5. module_list()                            → List available modules
6. module_context(module, topic)            → Vector search scoped to module
7. lr_sync(module?)                         → Trigger re-indexing
8. sprint_status()                          → High-level: open tasks, blockers, progress
```

**Kyun high-level tools:**
- Research confirms: `sprint_status()` > `get_tasks() + filter() + count()`. Kam round-trips, kam tokens.
- AI ko atomic SQL nahi dena — composite tools do jo useful context return kare

**Kyun ek server (not two):**
- Kam infrastructure. Ek codebase. Ek deploy.
- MongoDB MCP + MySQL MCP alag se bhi exist karte hain (official) par humein custom tools chahiye jo DONO DBs se baat kare

### ✅ LOCK karna hai? Y/N

---

## Decision 10: ChatGPT Integration

### 🏆 Final Pick: **Same MCP server via HTTP + ChatGPT Apps/Connectors (GA since end 2025)**

**Design:**
- ChatGPT ab MCP support karta hai via "Apps" (previously Connectors) — ye GA hai
- Same MCP server jo IDE clients ko serve karta hai, wo ChatGPT ko bhi serve karega
- ChatGPT HTTP+SSE use karta hai — stdio nahi. Isliye dual transport zaroori
- **Tunnel for personal use:** ngrok ya cloudflared se EC2 ka port 8766 expose karo ChatGPT ko
- **SaaS:** Direct public endpoint

**Session-start state load:**
- ChatGPT session start hote hi `sprint_status()` tool call karega
- System prompt me instruction: "BEFORE responding to ANY user message, FIRST call sprint_status() to load current context"
- Response format: YAML (proven, universal). TOON evaluate later jab LangChain integration mature ho

**Kyun MCP over custom Actions:**
- One codebase serves ALL clients (Claude, Cursor, ChatGPT)
- No separate OpenAPI schema maintenance
- ChatGPT MCP support GA hai — Actions eventually deprecated ho sakte hain

**Backup plan:** Agar ChatGPT MCP flaky ho toh n8n webhook as fallback Action endpoint. Par pehle MCP try karo.

### ✅ LOCK karna hai? Y/N

---

## Decision 11: Context Enforcement Strategy

### 🏆 Final Pick: **Tool-based RAG — MCP tools abstract all data access, raw file paths hidden**

**Strategy:**
1. MCP server me `vector_search()` aur `module_context()` tools do
2. `read_file()` tool bilkul MAT do — ya sirf specific cases me (code editing)
3. AI ko file paths NEVER dikhao — sirf search results dikhao with content
4. System prompt instruction: "Always use vector_search to find relevant context. Do NOT guess file paths."

**Kyun ye kaam karega:**
- Agar AI ke paas sirf search tools hain, toh wo search hi karega (no choice)
- Cursor bhi yehi karta hai — Turbopuffer se context pull karwata hai, raw reads nahi
- 98% token savings vs raw file reads (research confirmed)

**Exception:**
- Code editing tools (file_write, file_edit) zaroor dena padega — par READ ke liye vector search enforce karo

**SaaS benefit:** Multi-tenant security automatically milti hai — vectors me tenant isolation hai, files me nahi

### ✅ LOCK karna hai? Y/N

---

## Decision 12: Write-Back Pattern

### 🏆 Final Pick: **Dolt = source of truth for tasks. "Best-effort side effects" for vectors/files.**

**Write chain:**
```
AI calls beads_update(id, status)
  → Dolt updated (source of truth, optimistic locking) ✅
  → Vector re-index? NAHI (selective — only if content changes, not status)
  → File update? NAHI (files are source for CONTENT, Dolt for TASKS)
```

**Rules:**
- Task status changes → Dolt only. No cascade.
- Content changes (new file, edited doc) → `lr_sync` re-indexes affected vectors
- Vector DB is NEVER the source of truth — always rebuildable from files + Dolt

**Optimistic locking:**
```sql
UPDATE issues SET status='done', version=version+1 
WHERE id='lr-123' AND version=5;
-- If 0 rows affected → conflict → retry with fresh data
```

**Kyun "best-effort" not "saga":**
- Tu akela user hai. Saga pattern overkill hai.
- Agar vector re-index fail ho jaye, manually `lr sync` chala de. No big deal.
- SaaS me saga pattern add karenge jab paying users honge.

### ✅ LOCK karna hai? Y/N

---
---

# Phase 3 COORDINATION Layer — Final Recommendations

> **Same lens.** Sabse simple pattern jo kaam kare. Extra infra mat add karo.

---

## Decision 13: Cross-Module Communication

### 🏆 Final Pick: **MongoDB Change Streams (humara MongoDB replica set pe hai!) + n8n for orchestration**

**Kyun Change Streams:**
- ✅ Humara MongoDB already replica set mode me chal raha hai (process flags me `--replSet 7a1b66ea9370` hai)
- ✅ Change Streams free hai Community edition me (replica set pe)
- ✅ Real-time — polling ki zaroorat nahi
- ✅ No extra infrastructure (Redis, NATS, Kafka ki zaroorat nahi)
- ✅ RAM overhead minimal — ek watcher process < 50MB

**Design:**
```
LifeOS writes new experience → MongoDB `lifeos_vectors` collection
  → Change Stream detects insert
  → Triggers n8n webhook → n8n orchestrates Flex content generation
  → Flex creates LinkedIn draft → stored in `flex_vectors`
```

**n8n ka role:**
- Change Stream → n8n webhook trigger → n8n workflow executes cross-module logic
- Satvik n8n me comfortable hai — wo manually flows edit kar sakta hai
- n8n scheduling bhi handle karta hai (cron, delays, retries)

**Kyun NAHI Redis/NATS/Kafka:**
- Extra service install karni padegi (disk + RAM use hoga)
- Tu akela user hai — Change Streams sufficient hai
- SaaS me Redis Streams ya NATS add karenge for durability + scale

### ✅ LOCK karna hai? Y/N

---

## Decision 14: Agent Coordination

### 🏆 Final Pick: **Sequential agents (Satvik's preference) + MCP tool listing for discovery**

**Design:**
- Agents ek ke baad ek chalenge — parallel nahi (Satvik reviews between rounds)
- Agent discovery: MCP server ka `module_list()` tool batayega kya modules available hain
- Shared memory: **MongoDB + Dolt IS the shared memory.** Mem0/Zep ki zaroorat nahi.
  - Tasks/state → Dolt (cross-session)
  - Content/context → MongoDB vectors (cross-module)
  - Ye DO cheezein combined = complete shared memory

**Kyun NAHI CrewAI/AutoGen/LangGraph:**
- Ye frameworks agent ORCHESTRATION ke liye hain — humein orchestration nahi chahiye (Satvik manually orchestrate karta hai)
- Extra dependency, extra complexity, extra learning curve
- Humara MCP server + Dolt + MongoDB = sufficient coordination layer

**SaaS note:** Jab automated multi-agent workflows chahiye honge, LangGraph evaluate karna. Abhi nahi.

### ✅ LOCK karna hai? Y/N

---

## Decision 15: Shared State Design

### 🏆 Final Pick: **Module owns its collection. Cross-module via explicit vector search. User profile shared.**

**MongoDB collections:**
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

**Access rules:**
- Module apni collection freely read/write kar sakta hai
- Cross-module read: `vector_search(query, module="lifeos")` — explicit module parameter
- Cross-module write: NAHI. Modules doosre ki collection me write nahi kar sakte.
- `lr_events` = shared event log for cross-module triggers

**Kyun ye simple model:**
- No ACL, no RBAC, no complex permissions — tu akela user hai
- Module isolation = collection isolation. Clean aur simple.
- SaaS me `tenant_id` field add karenge har document me

### ✅ LOCK karna hai? Y/N

---
---

# Phase 4 DISTRIBUTION Layer — Final Recommendations

> **Same lens.** Personal use pehle. Product distribution baad me.

---

## Decision 16: Web Bundle Strategy

### 🏆 Final Pick: **Custom Pandoc pipeline (markdown/YAML → HTML). Keep existing Flex bundle pattern.**

**Design:**
- Tu already Flex ke liye web bundles bana chuka hai (K1-K6 HTML files)
- Same pattern continue karo: Pandoc se markdown → HTML convert
- `lr bundle <module>` CLI command banayenge jo automated karega:
  1. Module ke saare files scan kare
  2. File allocation strategy ke hisaab se group kare
  3. Pandoc se HTML convert kare
  4. Version stamp add kare (git hash + date)
  5. Output: `bundles/<module>/` folder me HTML files

**File allocation (proven by Satvik):**
- 1 file per workflow (detailed steps)
- 1 file for all agents combined
- 1 file for frameworks + vocabulary
- 1 file for config + schemas
- 1 file for checklists
- 1 file for orchestrator
- 1 file for OpenAPI Actions schema

**HTML > Markdown:** Confirmed by research — ChatGPT parses HTML sections better. Keep doing HTML.

**Staleness:** Version stamp in each HTML file. ChatGPT Actions se version check possible.

### ✅ LOCK karna hai? Y/N

---

## Decision 17: MCP Client Compatibility

### 🏆 Final Pick: **stdio transport primary. ≤15 tools. Test on Claude Code + Cursor first.**

**Compatibility matrix:**
| Client | Transport | Tool Limit | Priority |
|--------|-----------|------------|----------|
| Claude Code | stdio | Unlimited (deferred) | 🔴 HIGH |
| Cursor | stdio | 40 tools | 🔴 HIGH |
| ChatGPT | HTTP+SSE | Via Apps | 🟡 MEDIUM |
| Windsurf | stdio | 100 tools | 🟢 LOW |
| Codex | stdio | TBD | 🟢 LOW |

**Testing strategy:**
1. Build MCP server
2. Test on Claude Code (tu yahi use karta hai)
3. Test on Cursor
4. ChatGPT HTTP test (ngrok tunnel)
5. Others later

### ✅ LOCK karna hai? Y/N

---

## Decision 18: Stateless Client (ChatGPT) Strategy

### 🏆 Final Pick: **Action-based state injection. YAML format. sprint_status() on session start.**

**Pattern:**
1. ChatGPT session start hota hai
2. System prompt instruction: "FIRST call sprint_status()"
3. MCP tool `sprint_status()` returns:
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
4. ~500-1000 tokens. ChatGPT ke context me fit ho jayega.

**Kyun YAML (not TOON):**
- YAML proven hai, universal support
- TOON abhi bahut naya hai — LangChain support claim hai par real-world adoption minimal
- Jab TOON mature ho jaye, switch kar lenge (same data, different format)

**Kyun NOT ChatGPT persistent memory:**
- Developer-controllable nahi hai
- Structured task hierarchy store nahi kar sakta
- Unreliable — ChatGPT kabhi bhi forget kar sakta hai

### ✅ LOCK karna hai? Y/N

---

## Decision 19: SaaS Distribution Strategy (FUTURE — not now)

### 🏆 Final Pick: **Pehle personal use. Phir MCP registry publish. Phir ChatGPT marketplace. Phir standalone SaaS.**

**Phased approach:**
1. **NOW:** Use LinkRight personally for job switch + product building
2. **Month 3:** Open-source core MCP server on GitHub
3. **Month 4:** Publish on Smithery + mcp.run (MCP registries)
4. **Month 6:** Flex module as ChatGPT Custom Model (LinkedIn AI tool)
5. **Month 9:** Assistants API integration for programmatic access
6. **Month 12:** Standalone SaaS website (pricing: freemium + $20/mo pro)

**Pricing (future):**
- Free tier: 1 module, 100 files, basic features
- Pro: $20/mo (unlimited modules, priority support)
- Enterprise: Custom (on-prem, SSO, dedicated instance)

**Ye decision abhi LOCK nahi karunga** — ye future planning hai. Market conditions change honge. Par direction clear hai.

### ✅ NOTED (not locked — future planning)

---
---

# All Decisions Summary

## Phase 1 DATA (LOCKED ✅)
| # | Decision | Pick |
|---|----------|------|
| 1 | Vector DB | MongoDB 8.2 Community |
| 2 | Embedding | Gemini API (FREE) |
| 3 | Chunking | Hybrid structure-aware + 512-token |
| 4 | Namespace | 1 collection per module |
| 5 | Sync | `lr sync` CLI + content hashing |
| 6 | Tasks | Dolt + single MCP + DoltHub free |
| 7 | Architecture | MongoDB + Dolt + 1 MCP |

## Phase 2 ACCESS (Lock karna hai)
| # | Decision | Pick |
|---|----------|------|
| 8 | MCP Tech | TypeScript + official SDK |
| 9 | MCP Architecture | Dual transport (stdio+HTTP), ≤15 tools |
| 10 | ChatGPT | Same MCP via Apps/Connectors |
| 11 | Enforcement | Tool-based RAG, hide file paths |
| 12 | Write-Back | Dolt source of truth, best-effort side effects |

## Phase 3 COORDINATION (Lock karna hai)
| # | Decision | Pick |
|---|----------|------|
| 13 | Cross-Module | MongoDB Change Streams + n8n |
| 14 | Agent Coordination | Sequential + MCP discovery |
| 15 | Shared State | Module owns collection, explicit cross-module |

## Phase 4 DISTRIBUTION (Lock karna hai)
| # | Decision | Pick |
|---|----------|------|
| 16 | Web Bundles | Custom Pandoc pipeline, HTML |
| 17 | MCP Clients | stdio primary, ≤15 tools, Claude+Cursor first |
| 18 | Stateless | Action-based injection, YAML, sprint_status() |
| 19 | SaaS Strategy | Personal → OSS → Registry → ChatGPT → SaaS (NOTED, not locked) |

**Total extra cost: ₹0/month. Implementation: ~2-3 weeks for complete system.**
