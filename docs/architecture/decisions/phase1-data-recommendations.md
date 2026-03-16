# Phase 1 DATA Layer — Recommendations for Decision Lock

> **Lens: Solve Satvik's problem FIRST. Free/open-source. Fastest to implement. SaaS comes later.**
> 
> Satvik's situation: Desperately needs job switch + building products fast. LinkRight is the secret sauce — use it personally first, THEN monetize. No budget for paid services right now.

---

## What Already Exists (Don't Throw Away)

Before deciding anything — what do we ALREADY have working?

| Component | Status | Location |
|-----------|--------|----------|
| **ChromaDB** | Running, has data | `/home/ubuntu/MasterWorkspace/shipquick/data/chromadb/` (9 collections) |
| **Dolt/Beads** | Running, 369 issues loaded | `.beads/dolt/shipquick/` |
| **MCP configs** | Set up for Cline, Codex, Windsurf | `linkright/*.mcp.json` |
| **Agent-Mail MCP** | Running on port 8765 | Already integrated |
| **Git repo** | Active, pushed to GitHub | `linkright_final` |

**Rule: Don't replace what works. Extend what exists.**

---

## Decision 1: Vector Database

### 🏆 Recommendation: **ChromaDB (keep what you have)**

**Why ChromaDB NOW:**
- ✅ Already installed and running with 9 collections
- ✅ Free, open-source, zero cost
- ✅ Perfect for single user with ~500 files
- ✅ LlamaIndex + LangChain native integration
- ✅ Python-native — matches your stack
- ✅ No server to manage (embedded mode works fine for 1 user)
- ✅ NEW: ChromaDB 1.5.3 has Chroma Sync for GitHub repo integration

**What changes for SaaS (LATER):**
- Migrate to Qdrant when you have paying users and need multi-tenancy
- ChromaDB's API is simple enough that migration = change the vector store adapter in LlamaIndex
- All embeddings can be re-generated from stored text (Decision 5 handles this)

**Why NOT switch to Qdrant now:**
- Extra setup time for zero benefit at 1 user
- One more service to run on your EC2
- Qdrant solves multi-tenant problems you DON'T have yet

### Decision needed: **Keep ChromaDB for now, plan Qdrant migration for SaaS? Y/N**

---

## Decision 2: Embedding Model

### 🏆 Recommendation: **OpenAI text-embedding-3-small (1536d)**

**Why:**
- $0.02/1M tokens — your entire codebase (~2MB text) costs < $0.10 to embed
- Practically free at your scale
- Best ecosystem support — works everywhere
- Matryoshka support (can store at 512d to save ChromaDB space)

**Why not local models:**
- Your EC2 has no GPU. Running nomic-embed-text on CPU = slow
- At $0.10 per full re-index, API is cheaper than the time you'd spend setting up local inference

**SaaS upgrade path:** Switch to Voyage-4-Large or Jina-v5 when quality matters more than cost (i.e., paying users).

### Decision needed: **Lock OpenAI text-embedding-3-small? Y/N**

---

## Decision 3: Chunking Strategy

### 🏆 Recommendation: **Hybrid — structure-aware + 512-token fallback**

Same as before. This doesn't change based on personal vs SaaS:

1. **Markdown**: LlamaIndex `MarkdownNodeParser` (split by headings, frontmatter → metadata)
2. **YAML**: Custom parser (chunk by top-level keys)
3. **CSV**: Row-per-document
4. **Code**: Tree-sitter (function/class level)
5. **Fallback**: `RecursiveCharacterTextSplitter` at 512 tokens

**Implementation time:** ~1 day to write parsers + test on your actual files.

### Decision needed: **Lock hybrid chunking? Y/N**

---

## Decision 4: Namespace Design

### 🏆 Recommendation: **One ChromaDB collection per module**

**Why collection-per-module (not metadata filtering):**
- ChromaDB works best with separate collections (it's designed this way)
- You have 6 modules → 6 collections. Easy to manage.
- Cross-module query = query multiple collections (ChromaDB supports this)
- Clean isolation — Flex can't accidentally pollute Sync's context

**Metadata schema for every vector:**
```yaml
content_type: "agent"       # agent|workflow|config|template|knowledge|checklist
file_path: "agents/content-strategist.md"
section_id: "## Strategy"
git_hash: "abc123"
tags: ["linkedin", "content"]
```

**SaaS change:** When migrating to Qdrant, switch to single-collection-per-user + metadata filtering (Qdrant handles this better than ChromaDB).

### Decision needed: **Lock collection-per-module in ChromaDB? Y/N**

---

## Decision 5: Source of Truth & Sync

### 🏆 Recommendation: **Files = source. CLI sync command. Store raw text in Dolt.**

**For personal use, you don't need webhooks/queues. You need:**
1. `lr sync` CLI command that:
   - Scans all module files
   - Hashes each file (content hash)
   - Compares with stored hashes in Dolt
   - Re-embeds ONLY changed files
   - Upserts to ChromaDB
   - Removes vectors for deleted files
2. Raw text of each chunk stored in Dolt (protects against model lock-in)
3. Run `lr sync` manually or via git post-commit hook

**Why this is enough:**
- You push to git → run `lr sync` → vectors updated. Done.
- No message queue. No webhook server. No infrastructure.
- Total implementation: ~2 days

**SaaS upgrade:** Add GitHub webhook → SQS → worker when you have users with their own repos.

### Decision needed: **Lock CLI sync + raw text in Dolt? Y/N**

---

## Decision 6: Beads/Dolt Access Strategy

### 🏆 Recommendation: **Keep Dolt. Build one MCP server for everything. Skip DoltHub for now.**

**The design:**
1. **Dolt stays** — already working, 369 issues loaded, MySQL-compatible
2. **One MCP server** exposing BOTH task tools AND vector search tools:
   - `beads_list` / `beads_update` / `beads_create` → Dolt queries
   - `vector_search` / `vector_add` → ChromaDB queries
   - `module_list` / `agent_context` → file system reads
3. **ChatGPT access**: Same MCP server + Express route for Actions (when needed)
4. **Concurrency**: Optimistic locking (you're the only user — conflicts are rare)
5. **Backup**: `dolt push` to DoltHub free tier (100MB, plenty for task data) OR just git commit the Dolt dir

**Why NOT DoltHub Pro ($50/mo):**
- Free tier gives 100MB. Your task DB is < 5MB. 100MB is plenty.
- $50/mo for backup when `dolt push` to free tier works = waste

**Why one MCP server (not two):**
- Less infrastructure. One process. One port. One config per IDE.
- You already have agent-mail MCP running. Add tools to it or create one new server.

### Decision needed: **Lock Dolt + single MCP server + free DoltHub? Y/N**

---

## Decision 7: Architecture

### 🏆 Recommendation: **Split, but minimal — ChromaDB + Dolt, one MCP server**

```
┌──────────────────────────────────┐
│         AI Clients               │
│ Claude Code │ Cursor │ ChatGPT   │
└──────┬──────┴───┬────┴─────┬────┘
       │          │          │
       ▼          ▼          ▼
┌────────────────────────────────┐
│     LinkRight MCP Server       │
│  (TypeScript or Python)        │
│                                │
│  Tools:                        │
│  - vector_search  → ChromaDB   │
│  - beads_list     → Dolt       │
│  - beads_update   → Dolt       │
│  - module_context → Files      │
│  - lr_sync        → Embed+Store│
└──────┬────────────┬────────────┘
       │            │
  ┌────┴────┐  ┌───┴─────┐
  │ChromaDB │  │  Dolt   │
  │(vectors)│  │ (tasks) │
  │ FREE    │  │  FREE   │
  └─────────┘  └─────────┘
```

**Total cost: $0/mo** (only OpenAI embedding API calls, < $1/mo at your scale)

**Implementation priority:**
1. Build MCP server with basic tools (~3-4 days)
2. Build `lr sync` CLI (~2 days)
3. Test with Claude Code + Cursor (~1 day)
4. Start using it for actual work

**~1 week to a working system.**

### Decision needed: **Lock this architecture? Y/N**

---

## Summary: All 7 Decisions (Personal-First)

| # | Decision | Pick | Cost | Implementation |
|---|----------|------|------|---------------|
| 1 | Vector DB | **ChromaDB** (existing) | $0 | Already done |
| 2 | Embedding | **OpenAI 3-small** | ~$0.10/re-index | 1 hour |
| 3 | Chunking | **Hybrid structure-aware** | $0 | 1 day |
| 4 | Namespace | **1 collection per module** | $0 | 1 hour |
| 5 | Sync | **CLI sync + Dolt text store** | $0 | 2 days |
| 6 | Tasks/State | **Dolt + single MCP server** | $0 | 3-4 days |
| 7 | Architecture | **ChromaDB + Dolt + 1 MCP** | $0 | Combined above |

**Total cost: ~$0/mo** (embedding API < $1/mo)
**Time to working system: ~1 week**
**SaaS migration later: ChromaDB→Qdrant, add webhook sync, add REST API**

---

*Go through each. Y or N. Let's lock and BUILD.*
