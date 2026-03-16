# Phase 2: ACCESS LAYER — MCP Server Architecture & Implementation Research

> **Date**: 2026-03-16
> **Status**: Research Complete — Ready for Decision Lock
> **Scope**: MCP protocol, SDK choices, tool design, hosting, auth, ChatGPT compatibility
> **Constraint**: ₹0 budget, EC2 2vCPU/7.6GB RAM/14GB free disk, personal use (1 user)

---

## Table of Contents

1. [MCP Protocol Spec (2025-11-25)](#1-mcp-protocol-spec-2025-11-25)
2. [MCP Client Support Matrix](#2-mcp-client-support-matrix)
3. [Existing MCP Server Implementations](#3-existing-mcp-server-implementations)
4. [TypeScript vs Python MCP SDK](#4-typescript-vs-python-mcp-sdk)
5. [Building a Database-Backed MCP Server](#5-building-a-database-backed-mcp-server)
6. [MCP Server Hosting](#6-mcp-server-hosting)
7. [Tool Design Patterns](#7-tool-design-patterns)
8. [Auth Model](#8-auth-model)
9. [MCP + ChatGPT](#9-mcp--chatgpt)
10. [ChatGPT Actions — OpenAPI Schema Design](#10-chatgpt-actions--openapi-schema-design)
11. [ChatGPT MCP Support (Connectors → Apps)](#11-chatgpt-mcp-support-connectors--apps)
12. [n8n vs Express for ChatGPT Action Backend](#12-n8n-vs-express-for-chatgpt-action-backend)
13. [LinkRight Endpoint Design](#13-linkright-endpoint-design)
14. [Session-Start State Load for ChatGPT](#14-session-start-state-load-for-chatgpt)
15. [RAG-First Architecture](#15-rag-first-architecture)
16. [How AI Coding Tools Handle Context](#16-how-ai-coding-tools-handle-context-industry-analysis)
17. [MCP Tool Design for Context Enforcement](#17-mcp-tool-design-for-context-enforcement)
18. [Hallucination Prevention](#18-hallucination-prevention)
19. [AI Writes Back Through MCP](#19-ai-writes-back-through-mcp)
20. [Optimistic Locking in Dolt](#20-optimistic-locking-in-dolt)
21. [Event Chain on Write](#21-event-chain-on-write)
22. [Saga Pattern for Distributed Writes](#22-saga-pattern-for-distributed-writes)
23. [Deep Research Prompt — ChatGPT Actions + Enforcement + Write-Back](#deep-research-prompt--chatgpt-actions--enforcement--write-back)
24. [Deep Research Prompt for External AI (MCP)](#deep-research-prompt-for-external-ai)

---

## 1. MCP Protocol Spec (2025-11-25)

### 1.1 Architecture

MCP follows a **client-host-server** model using JSON-RPC 2.0:

```
Host (e.g. Claude Code)
  ├── Client 1 ──→ Server 1 (Files & Git)
  ├── Client 2 ──→ Server 2 (Database)
  └── Client 3 ──→ Server 3 (External APIs)
```

- **Host**: Container process (IDE, chat app). Manages clients, enforces security, handles user consent.
- **Client**: 1:1 stateful session with a server. Handles protocol negotiation, routes messages.
- **Server**: Exposes capabilities (tools, resources, prompts). Operates independently, focused responsibilities.

Key principle: **Servers cannot see the full conversation or other servers.** The host controls isolation.

### 1.2 Server Primitives (Stable)

| Primitive | Purpose | Direction | Example |
|-----------|---------|-----------|---------|
| **Tools** | Functions the LLM executes (with user approval) | Server → Client | `get_forecast(state)`, `vector_search(query)` |
| **Resources** | Read-only data (file-like) for context | Server → Client | `file:///docs/arch.md`, `db://collections` |
| **Prompts** | Reusable message templates for users | Server → Client | `draft_email`, `summarize_doc` |

### 1.3 Client Primitives

| Primitive | Purpose | Status |
|-----------|---------|--------|
| **Sampling** | Server asks client's LLM to generate text | Stable (limited visibility) |
| **Roots** | Server queries filesystem/URI boundaries | Stable |
| **Elicitation** | Server asks user for additional info | Stable (2025-11-25) |

### 1.4 Transport Options

| Transport | Mechanism | Best For | Status |
|-----------|-----------|----------|--------|
| **stdio** | stdin/stdout JSON-RPC | Local process per IDE. Simplest. | ✅ Stable, universal |
| **Streamable HTTP** | HTTP POST + optional SSE streaming | Remote servers, multi-client | ✅ Stable, production |
| **SSE (legacy)** | Server-Sent Events over HTTP | Deprecated in favor of Streamable HTTP | ⚠️ Still supported, being phased out |

**For LinkRight (personal, 1 user):** stdio is the clear winner.
- Zero network overhead, zero port management
- Client spawns server process directly
- Every major client supports it
- No auth needed (process-level isolation)

**When to use Streamable HTTP:**
- Remote/cloud servers
- Multiple clients sharing one server instance
- ChatGPT integration (requires HTTP endpoint)

### 1.5 Capability Negotiation

```
Client → Server: initialize(capabilities={sampling: true})
Server → Client: initialized(capabilities={tools: true, resources: true})
```

Both parties declare supported features. Session operates within negotiated capabilities. Progressive feature addition is supported.

### 1.6 Additional Protocol Features

- **Progress tracking**: Long-running operations report progress
- **Cancellation**: Client can cancel in-flight requests
- **Error reporting**: Standard JSON-RPC error codes
- **Logging**: Server can send log messages to client
- **Subscriptions**: Client subscribes to resource changes

### 1.7 What's Changing (2026 Roadmap)

| Area | Status | Detail |
|------|--------|--------|
| Transport scalability | Active WG | Stateless sessions, `.well-known` metadata for server discovery |
| Agent communication | Experimental (SEP-1686) | Tasks primitive — retry semantics, expiry policies |
| Enterprise readiness | Extensions | Audit trails, SSO, gateway behavior |
| Governance | Org change | Working group-centered structure, contributor ladder |
| Triggers/Events | On horizon | Event-driven updates, community-led |

---

## 2. MCP Client Support Matrix

### 2.1 Feature Support (March 2026)

| Client | Tools | Resources | Prompts | Sampling | Roots | Transport | Config Format |
|--------|-------|-----------|---------|----------|-------|-----------|---------------|
| **Claude Code** | ✅ | ✅ | ✅ | ✅ | ✅ | stdio, HTTP | `.mcp.json` |
| **Claude Desktop** | ✅ | ✅ | ✅ | ✅ | ✅ | stdio, HTTP | `claude_desktop_config.json` |
| **Cursor** | ✅ | ⚠️ Limited | ❌ | ❌ | ❌ | stdio, HTTP | Settings UI + `.cursor/mcp.json` |
| **Windsurf** | ✅ | ⚠️ Limited | ❌ | ❌ | ❌ | stdio | `windsurf.mcp.json` |
| **VS Code (Copilot)** | ✅ | ✅ | ✅ | ❌ | ❌ | stdio, HTTP | `.vscode/mcp.json` |
| **Codex CLI** | ✅ | ❌ | ❌ | ❌ | ❌ | stdio | `codex.mcp.json` |
| **Continue.dev** | ✅ | ✅ | ❌ | ❌ | ❌ | stdio | `config.json` |
| **ChatGPT** | ✅ | ❌ | ❌ | ❌ | ❌ | HTTP only | API/Settings UI |

### 2.2 Key Observations

1. **Tools are universally supported** — design around tools as the primary primitive
2. **Resources have patchy support** — Cursor/Windsurf limited; avoid relying on resources for core functionality
3. **Prompts are poorly supported** outside Claude — don't depend on them
4. **Sampling is Claude-only** — can't assume cross-client
5. **stdio works everywhere** for local IDE use — the universal transport
6. **ChatGPT requires HTTP** — needs a separate transport if you want ChatGPT support

### 2.3 LinkRight Implication

**Design tools-first.** Resources and prompts are nice-to-have but tools are the only primitive guaranteed across all clients. For LinkRight personal use, stdio transport covers Claude Code + Cursor + Windsurf + Codex + Continue.

---

## 3. Existing MCP Server Implementations

### 3.1 Official MongoDB MCP Server

**Repo**: `mongodb-js/mongodb-mcp-server`
**Language**: TypeScript
**Transport**: stdio + HTTP (`--transport http --httpPort 3000`)

**Tool Categories** (30+ tools):

| Category | Tools | Notes |
|----------|-------|-------|
| Query | `find`, `aggregate`, `count`, `explain` | Full MongoDB query support |
| Write | `insert-many`, `update-many`, `delete-many` | `--readOnly` flag disables |
| Schema | `collection-schema`, `collection-indexes`, `collection-storage-size` | Introspection |
| Index | `create-index`, `drop-index` | **Supports vector search indexes** (Winter 2026) |
| Admin | `list-databases`, `list-collections`, `db-stats`, `mongodb-logs` | |
| Atlas | `atlas-list-clusters`, `atlas-create-free-cluster`, etc. | Cloud management |
| Local | `atlas-local-create-deployment` | Local dev clusters |
| Knowledge | `search-knowledge`, `list-knowledge-sources` | MongoDB docs search |

**Key Winter 2026 Features:**
- `create-index` now handles **vector search indexes** (same tool, different params)
- `insert-many` does **automatic embedding generation** via Voyage AI
- Performance Advisor integration (`listSlowQueries`, `listClusterSuggestedIndexes`)

**Architecture Patterns Used:**
- One tool per operation (CRUD-style)
- `--readOnly` flag as safety default
- Environment variables for secrets (`MDB_MCP_CONNECTION_STRING`)
- Dual transport (stdio default, HTTP optional)

### 3.2 Official Reference Servers

| Server | Language | Pattern | Key Learning |
|--------|----------|---------|--------------|
| **Filesystem** | TypeScript | Resource-heavy | Exposes file tree as resources, edit tools |
| **GitHub** | TypeScript | Tool-heavy | 20+ tools for PRs, issues, repos |
| **Slack** | TypeScript | Tool-heavy | Channel/message tools with pagination |
| **PostgreSQL** | TypeScript | Query tool | Single `query` tool with SQL input |
| **SQLite** | Python | Query + schema | `read_query`, `write_query`, `list_tables` |

### 3.3 Architectural Patterns Observed

1. **Tool granularity**: Most servers use fine-grained tools (one per operation), not coarse "do everything" tools
2. **Read-only by default**: Safety first, opt-in to writes
3. **Connection on init**: Database connection established at server startup, reused across tool calls
4. **Error as content**: Errors returned as text content, not thrown — lets LLM self-correct
5. **Zod/Pydantic schemas**: Input validation via schema libraries, auto-generates JSON Schema for MCP

---

## 4. TypeScript vs Python MCP SDK

### 4.1 Comparison Matrix

| Dimension | TypeScript SDK | Python SDK |
|-----------|---------------|------------|
| **Package** | `@modelcontextprotocol/server` (v2 pre-alpha, v1.x stable) | `mcp` (PyPI, includes FastMCP) |
| **High-level API** | FastMCP (community, `fastmcp` npm) | FastMCP (official, built into SDK since v1.0) |
| **Schema validation** | Zod v4 | Pydantic / type hints (auto-inferred) |
| **Transport** | stdio, Streamable HTTP, SSE | stdio, Streamable HTTP, SSE |
| **Middleware** | Express, Hono, Node HTTP adapters | FastAPI, ASGI |
| **Maturity** | v1.x stable, v2 Q1 2026 | v1.7+, FastMCP 3.0 (Jan 2026) |
| **Community** | Larger ecosystem (more npm servers) | Growing fast, Pythonic DX |
| **Async** | Native (Node.js event loop) | Native (asyncio) |
| **Startup time** | Fast (Node.js) | Moderate (Python import overhead) |
| **Memory** | Lower baseline (~50MB) | Higher baseline (~80-100MB) |
| **MongoDB driver** | `mongodb` (native, excellent) | `pymongo`/`motor` (excellent) |
| **Dolt driver** | MySQL-compatible (`mysql2`) | MySQL-compatible (`mysql-connector-python`) |

### 4.2 Python FastMCP Example

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("linkright")

@mcp.tool()
async def vector_search(query: str, module: str = "flex", limit: int = 5) -> str:
    """Search LinkRight knowledge base using semantic similarity.

    Args:
        query: Natural language search query
        module: Module to search (flex, sync, squick, lifeos)
        limit: Max results to return (1-20)
    """
    # MongoDB $vectorSearch pipeline
    pipeline = [
        {"$vectorSearch": {
            "index": f"{module}_vector_index",
            "path": "embedding",
            "queryVector": await get_embedding(query),
            "numCandidates": limit * 10,
            "limit": limit
        }},
        {"$project": {"content": 1, "metadata": 1, "score": {"$meta": "vectorSearchScore"}}}
    ]
    results = await db[f"{module}_vectors"].aggregate(pipeline).to_list(limit)
    return format_results(results)
```

### 4.3 TypeScript FastMCP Example

```typescript
import { FastMCP } from "fastmcp";
import { z } from "zod";

const server = new FastMCP("linkright");

server.addTool({
  name: "vector_search",
  description: "Search LinkRight knowledge base using semantic similarity",
  parameters: z.object({
    query: z.string().describe("Natural language search query"),
    module: z.enum(["flex", "sync", "squick", "lifeos"]).default("flex"),
    limit: z.number().min(1).max(20).default(5),
  }),
  execute: async ({ query, module, limit }) => {
    const pipeline = [
      { $vectorSearch: {
        index: `${module}_vector_index`,
        path: "embedding",
        queryVector: await getEmbedding(query),
        numCandidates: limit * 10,
        limit
      }},
      { $project: { content: 1, metadata: 1, score: { $meta: "vectorSearchScore" } }}
    ];
    const results = await db.collection(`${module}_vectors`).aggregate(pipeline).toArray();
    return formatResults(results);
  },
});
```

### 4.4 Recommendation for LinkRight

**Python wins for our stack:**

1. **FastMCP is official** — built into the Python SDK, not a community fork
2. **Decorator-based** — `@mcp.tool()` auto-infers schema from type hints, less boilerplate
3. **motor (async pymongo)** — excellent async MongoDB driver
4. **Dolt MySQL** — `mysql-connector-python` or `aiomysql` work great
5. **Gemini SDK** — Google's Python SDK is more mature than JS
6. **Already on EC2** — Python is pre-installed, no Node.js setup needed [NEEDS VERIFICATION: check if Node.js is already installed on EC2]
7. **Memory** — slightly higher but acceptable for 7.6GB RAM with 1 user

**TypeScript is viable if:** Node.js is already installed, or you want to match the official MongoDB MCP server's language for easier reference.

---

## 5. Building a Database-Backed MCP Server

### 5.1 Architecture for LinkRight MCP Server

```
┌─────────────────────────────────────────────┐
│           LinkRight MCP Server              │
│                                             │
│  Tools Layer                                │
│  ├── lr_vector_search (MongoDB)             │
│  ├── lr_find_documents (MongoDB)            │
│  ├── lr_list_tasks (Dolt)                   │
│  ├── lr_query_tasks (Dolt)                  │
│  ├── lr_module_info (MongoDB)               │
│  └── lr_sync_status (filesystem)            │
│                                             │
│  Connection Layer                           │
│  ├── MongoDB client (motor/pymongo)         │
│  ├── Dolt MySQL client (aiomysql)           │
│  └── Gemini embedding client                │
│                                             │
│  Transport: stdio (primary)                 │
│             HTTP (optional, for ChatGPT)    │
└─────────────────────────────────────────────┘
```

### 5.2 MongoDB $vectorSearch as MCP Tool

```python
from mcp.server.fastmcp import FastMCP
from motor.motor_asyncio import AsyncIOMotorClient
import google.generativeai as genai

mcp = FastMCP("linkright")

# Connection pooling — single client, reused across all tool calls
mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["linkright"]

# Gemini for embeddings
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

async def get_embedding(text: str) -> list[float]:
    """Generate embedding via Gemini API (free tier)."""
    result = genai.embed_content(
        model="models/text-embedding-004",
        content=text
    )
    return result['embedding']  # 768 dimensions

@mcp.tool()
async def lr_vector_search(
    query: str,
    module: str = "flex",
    limit: int = 5,
    min_score: float = 0.7
) -> str:
    """Search LinkRight knowledge base using semantic vector similarity.

    Args:
        query: Natural language search query
        module: Module collection to search (flex, sync, squick, lifeos, autoflow)
        limit: Maximum results (1-20)
        min_score: Minimum similarity score threshold (0.0-1.0)
    """
    embedding = await get_embedding(query)

    pipeline = [
        {"$vectorSearch": {
            "index": f"{module}_vector_idx",
            "path": "embedding",
            "queryVector": embedding,
            "numCandidates": limit * 10,
            "limit": limit
        }},
        {"$addFields": {"score": {"$meta": "vectorSearchScore"}}},
        {"$match": {"score": {"$gte": min_score}}},
        {"$project": {
            "content": 1,
            "metadata.source": 1,
            "metadata.chunk_index": 1,
            "score": 1,
            "_id": 0
        }}
    ]

    results = await db[f"{module}_vectors"].aggregate(pipeline).to_list(limit)

    if not results:
        return f"No results found for '{query}' in module '{module}' above score {min_score}"

    formatted = []
    for i, r in enumerate(results, 1):
        formatted.append(
            f"[{i}] Score: {r['score']:.3f} | Source: {r.get('metadata', {}).get('source', 'unknown')}\n"
            f"    {r.get('content', '')[:500]}"
        )
    return "\n\n".join(formatted)
```

### 5.3 Dolt SQL Queries as MCP Tool

```python
import aiomysql

# Dolt exposes a MySQL-compatible interface
dolt_pool = None

async def get_dolt_pool():
    global dolt_pool
    if dolt_pool is None:
        dolt_pool = await aiomysql.create_pool(
            host='127.0.0.1',
            port=3306,
            user='root',
            db='linkright_tasks',
            minsize=1,
            maxsize=3  # Conservative for 7.6GB RAM
        )
    return dolt_pool

@mcp.tool()
async def lr_list_tasks(
    status: str = "open",
    module: str = "",
    limit: int = 20
) -> str:
    """List LinkRight tasks from Dolt version-controlled database.

    Args:
        status: Filter by status (open, in_progress, done, all)
        module: Filter by module name (empty = all modules)
        limit: Maximum tasks to return (1-100)
    """
    pool = await get_dolt_pool()
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cur:
            query = "SELECT id, title, status, module, priority FROM tasks WHERE 1=1"
            params = []

            if status != "all":
                query += " AND status = %s"
                params.append(status)
            if module:
                query += " AND module = %s"
                params.append(module)

            query += " ORDER BY priority DESC, created_at DESC LIMIT %s"
            params.append(limit)

            await cur.execute(query, params)
            rows = await cur.fetchall()

    if not rows:
        return f"No tasks found (status={status}, module={module or 'all'})"

    lines = [f"Tasks ({len(rows)} found):"]
    for r in rows:
        lines.append(f"  [{r['id']}] {r['title']} | {r['status']} | {r['module']} | P{r['priority']}")
    return "\n".join(lines)
```

### 5.4 Connection Pooling Strategy

| Database | Library | Pool Config | Rationale |
|----------|---------|-------------|-----------|
| MongoDB | `motor` | Default (100 max) | Motor handles pooling internally, 1 user = low concurrency |
| Dolt | `aiomysql` | minsize=1, maxsize=3 | Conserve RAM, Dolt is lightweight MySQL |
| Gemini | `httpx` | Single client | Rate-limited anyway (free tier) |

### 5.5 Query Caching

For personal use with 1 user, aggressive caching is unnecessary. Simple approaches:

```python
from functools import lru_cache
from datetime import datetime, timedelta

# Cache embeddings — same query text = same embedding
@lru_cache(maxsize=128)
def _cached_embedding(text: str) -> tuple:
    """Cache embedding results. Returns tuple (hashable) for lru_cache."""
    return tuple(get_embedding_sync(text))

# For vector search results — TTL-based simple cache
_search_cache = {}
CACHE_TTL = timedelta(minutes=5)

async def cached_vector_search(query, module, limit):
    key = (query, module, limit)
    if key in _search_cache:
        result, ts = _search_cache[key]
        if datetime.now() - ts < CACHE_TTL:
            return result
    result = await _do_vector_search(query, module, limit)
    _search_cache[key] = (result, datetime.now())
    return result
```

---

## 6. MCP Server Hosting

### 6.1 Options Comparison

| Option | Setup | Complexity | Multi-client | ChatGPT | RAM Impact |
|--------|-------|------------|--------------|---------|------------|
| **stdio (local process)** | Each IDE spawns server | Minimal | No (1 process per client) | ❌ | ~80-100MB per instance |
| **HTTP server (persistent)** | systemd service on port | Low | ✅ Yes | ✅ Yes | ~100MB (shared) |
| **Hybrid** | stdio default + HTTP optional | Medium | Partial | ✅ Yes | Variable |

### 6.2 Recommendation: stdio Primary, HTTP Optional

**For personal use (1 user, 1 IDE at a time):** stdio is perfect.

```json
// .mcp.json (Claude Code config)
{
  "mcpServers": {
    "linkright": {
      "command": "python",
      "args": ["/home/ubuntu/MasterWorkspace/linkright/mcp-server/server.py"],
      "env": {
        "MONGODB_URI": "mongodb://localhost:27017",
        "GEMINI_API_KEY": "${GEMINI_API_KEY}"
      }
    }
  }
}
```

**If ChatGPT support needed later**, add HTTP transport:

```python
# server.py
import sys

if __name__ == "__main__":
    if "--http" in sys.argv:
        mcp.run(transport="streamable-http", host="127.0.0.1", port=8766)
    else:
        mcp.run(transport="stdio")
```

### 6.3 Port Management

| Service | Port | Purpose |
|---------|------|---------|
| MongoDB | 27017 | Database |
| Dolt | 3306 | Task DB (MySQL protocol) |
| Agent Mail | 8765 | Agent coordination MCP |
| **LinkRight MCP** | **8766** | Access layer (HTTP mode only) |

### 6.4 Process Management (if HTTP mode)

```ini
# /etc/systemd/system/linkright-mcp.service
[Unit]
Description=LinkRight MCP Server
After=mongod.service

[Service]
ExecStart=/usr/bin/python3 /home/ubuntu/MasterWorkspace/linkright/mcp-server/server.py --http
Restart=always
User=ubuntu
Environment=MONGODB_URI=mongodb://localhost:27017
Environment=GEMINI_API_KEY=<key>

[Install]
WantedBy=multi-user.target
```

### 6.5 Memory Budget

With 7.6GB RAM total:
- MongoDB: ~1.5-2GB
- Dolt: ~200-400MB
- Agent Mail: ~100MB
- **LinkRight MCP (stdio)**: ~80-100MB
- OS + other: ~1-2GB
- **Free**: ~3-4GB ✅ Comfortable

---

## 7. Tool Design Patterns

### 7.1 Naming Convention

**Chosen pattern: `lr_{action}_{resource}`**

Rationale:
- `lr_` prefix prevents collision with other MCP servers (MongoDB server, filesystem server, etc.)
- Snake_case: 90%+ of MCP tools use this convention
- Action-first: matches natural language ("search vectors", "list tasks")
- Under 32 characters

### 7.2 Planned Tool Set

| Tool Name | Source | Purpose | Priority |
|-----------|--------|---------|----------|
| `lr_vector_search` | MongoDB | Semantic search across module knowledge | P0 |
| `lr_find_docs` | MongoDB | Find documents by metadata/filter | P0 |
| `lr_list_collections` | MongoDB | Show available knowledge modules | P1 |
| `lr_list_tasks` | Dolt | List tasks with status/module filters | P0 |
| `lr_query_tasks` | Dolt | Custom SQL query on task DB | P1 |
| `lr_task_history` | Dolt | Version history of a task (Dolt diff) | P2 |
| `lr_sync_status` | Filesystem | Show sync state, last hash, staleness | P1 |
| `lr_module_info` | MongoDB | Module metadata, doc count, index status | P1 |
| `lr_embed_text` | Gemini API | Generate embedding for arbitrary text | P2 |
| `lr_ingest_doc` | MongoDB | Chunk and ingest a document | P2 |

**Target: 5-8 tools initially (P0 + P1).** Best practice says 5-15 tools per server.

### 7.3 Parameter Schema Best Practices

```python
@mcp.tool()
async def lr_vector_search(
    query: str,                          # Required, no default
    module: str = "flex",                # Default to most common
    limit: int = 5,                      # Sensible default
    min_score: float = 0.7,              # Quality threshold
    include_metadata: bool = True        # Control verbosity
) -> str:
    """Search LinkRight knowledge using semantic similarity.

    Use this tool when you need to find relevant documentation,
    code patterns, or knowledge across LinkRight modules.

    Args:
        query: Natural language search query (e.g. "how does Flex sync work")
        module: Module to search — one of: flex, sync, squick, lifeos, autoflow, lrb
        limit: Max results (1-20, default 5)
        min_score: Minimum similarity threshold (0.0-1.0, default 0.7)
        include_metadata: Include source file and chunk info (default true)
    """
```

Key principles:
- **Flat parameters** — no nested objects, reduces hallucination
- **Constrained types** — use Literal/enum where possible
- **Descriptive docstring** — tells LLM *when* to use the tool
- **Sensible defaults** — most calls need only `query`

### 7.4 Return Value Format

```python
# Good: structured text, immediately useful
def format_results(results: list) -> str:
    if not results:
        return "No results found."

    lines = [f"Found {len(results)} results:\n"]
    for i, r in enumerate(results, 1):
        lines.append(f"[{i}] Score: {r['score']:.3f}")
        lines.append(f"    Source: {r['metadata']['source']}")
        lines.append(f"    Content: {r['content'][:300]}")
        lines.append("")
    return "\n".join(lines)

# Bad: raw JSON dump — wastes context tokens, hard to read
# return json.dumps(results)
```

Principles:
- Return **text**, not JSON (unless `json_response=True` on server)
- Include **actionable** info only — skip internal IDs, embeddings
- Truncate content to ~300-500 chars per result
- Include result count and metadata for navigation

### 7.5 Pagination

```python
@mcp.tool()
async def lr_find_docs(
    filter_module: str = "",
    offset: int = 0,
    limit: int = 20
) -> str:
    """Find documents with pagination.

    Args:
        filter_module: Filter by module name
        offset: Skip first N results (for pagination)
        limit: Max results per page (1-50, default 20)
    """
    # ... query ...
    total = await collection.count_documents(query_filter)
    results = await collection.find(query_filter).skip(offset).limit(limit).to_list(limit)

    header = f"Results {offset+1}-{offset+len(results)} of {total}"
    if offset + limit < total:
        header += f" | Next page: offset={offset+limit}"

    return header + "\n" + format_docs(results)
```

---

## 8. Auth Model

### 8.1 Current State: Personal Use (No Auth)

For **stdio transport** with personal use:
- Process-level isolation — server runs as user's own process
- No network exposure — no port, no attack surface
- **No auth needed.** This is the simplest, most secure option.

### 8.2 Future: SaaS / Multi-User

MCP spec mandates **OAuth 2.1 with PKCE** for HTTP transport (since March 2025 revision):

```
Evolution path:
  Phase 1 (now):   stdio, no auth, personal use
  Phase 2 (later): HTTP + API key (simple, for ChatGPT connector)
  Phase 3 (SaaS):  HTTP + OAuth 2.1 + PKCE (full spec compliance)
```

### 8.3 Design for Auth-Later Without Rewriting

```python
# server.py — auth middleware pattern
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("linkright")

# All tools defined normally — no auth awareness needed
@mcp.tool()
async def lr_vector_search(query: str, module: str = "flex") -> str:
    ...

# Auth added at transport level, not tool level
if __name__ == "__main__":
    transport = sys.argv[1] if len(sys.argv) > 1 else "stdio"

    if transport == "stdio":
        mcp.run(transport="stdio")  # No auth
    elif transport == "http":
        # Phase 2: Simple API key check
        mcp.run(
            transport="streamable-http",
            host="127.0.0.1",
            port=8766,
            # Auth middleware added here, tools untouched
        )
```

**Key insight:** MCP auth is at the **transport/connection level**, not the tool level. Tools don't need to know about auth. This means adding auth later is a transport configuration change, not a rewrite.

### 8.4 OAuth 2.1 + PKCE (When Needed)

The MCP spec requires:
- OAuth 2.1 with PKCE for all clients (even confidential ones)
- Protected Resource Metadata (RFC 9728) — server advertises its auth requirements
- Client ID Metadata Documents (CIMD) — client registration
- Short-lived tokens, no long-lived secrets

Libraries: `authlib` (Python), Auth0/Supabase as identity providers.

---

## 9. MCP + ChatGPT

### 9.1 How ChatGPT MCP Works

ChatGPT supports MCP via two mechanisms:

1. **Connectors**: OpenAI-maintained wrappers for popular services (Google Workspace, Dropbox). Use `connector_id`.
2. **Remote MCP servers**: Any publicly-accessible server implementing MCP. Use `server_url`.

```python
# ChatGPT Responses API with MCP
response = client.responses.create(
    model="gpt-4o",
    tools=[{
        "type": "mcp",
        "server_url": "https://your-server.com/mcp",
        "authorization": {"type": "bearer", "token": "..."}
    }],
    input="Search LinkRight for sync architecture"
)
```

### 9.2 Transport Requirements for ChatGPT

- **Must use Streamable HTTP or SSE** — stdio NOT supported
- Server must be **network-accessible** (localhost won't work for ChatGPT cloud)
- OAuth or bearer token auth required
- ChatGPT calls `mcp_list_tools` to discover available tools, then invokes them

### 9.3 Can One Server Serve Both IDE and ChatGPT?

**Yes, with dual transport:**

```python
# Option A: Two entry points, same tools
if transport == "stdio":
    mcp.run(transport="stdio")        # IDE clients
elif transport == "http":
    mcp.run(transport="streamable-http", port=8766)  # ChatGPT + remote

# Option B: Both simultaneously (needs two processes or async server)
# Process 1: python server.py stdio (for IDE)
# Process 2: python server.py http  (for ChatGPT)
# Both share same tool definitions, same DB connections
```

**Caveat for ChatGPT:** The server needs to be reachable from the internet. For personal EC2:
- Use Cloudflare Tunnel or ngrok (free tier) to expose HTTP endpoint
- Or access ChatGPT only when on same network [NEEDS VERIFICATION: ChatGPT connector network requirements]

### 9.4 ChatGPT Limitations

- **Tools only** — no Resources, Prompts, or Sampling support
- Auth token **not stored** — must be resupplied per request
- Available for **Business/Enterprise/Edu** plans (developer mode)
- Tool approval may be required per invocation

### 9.5 LinkRight Strategy for ChatGPT

**Phase 1**: Skip ChatGPT. Use stdio for IDE clients only.
**Phase 2 (if needed)**: Add HTTP transport, expose via Cloudflare Tunnel, use bearer token auth. Same tools, zero rewrite.

---

---

# SECTION A — ChatGPT Actions Design

> Research date: 2026-03-16 | Sources: OpenAI platform docs, community reports, verified March 2026

## 10. ChatGPT Actions — OpenAPI Schema Design

### 10.1 Schema Requirements

- **OpenAPI 3.1.0** (3.0.x also works)
- Every operation **must** have an `operationId` — this becomes the function name ChatGPT invokes
- Required top-level: `openapi`, `info` (title, description, version), `servers` (base URL), `paths`
- `summary` and `description` on each endpoint are critical — ChatGPT uses them to decide which action to call

### 10.2 Limits

| Parameter | Value | Confidence |
|-----------|-------|------------|
| Schema file size | ~1 MB | HIGH |
| Endpoint description | 300 chars max | HIGH |
| Parameter description | 700 chars max | HIGH |
| Action slots per GPT | 10 | HIGH |
| Endpoints per action slot | 30 | HIGH |
| Response size | ~100 KB | MEDIUM (community-reported) |
| Request body (POST) | Large bodies get truncated, corrupting JSON | MEDIUM |
| Response token processing | Was ~8,000 tokens (GPT-4 era); likely higher with GPT-5 | [NEEDS VERIFICATION] |
| Action timeout | ~45 seconds (not configurable) | HIGH |

### 10.3 Authentication Options

1. **None** — Public endpoints
2. **API Key** — Sent as header (`X-API-Key`) or query param. Configured once in GPT Builder. Same key for all users.
3. **OAuth 2.0** — Full Authorization Code flow with PKCE. Requires `authorization_url` + `token_url`. User's token passed as `Authorization: Bearer <token>`.

**LinkRight recommendation**: API Key auth. Generate a strong random key, store in GPT Builder, validate server-side. Simplest for personal use.

### 10.4 Error Handling

- ChatGPT respects **429 (Too Many Requests)** — auto-backs off after multiple 429s/500s
- Honor `Retry-After` headers in 429 responses
- Return **meaningful error messages** in response body — ChatGPT reads and relays to user
- Validate payloads against schema before processing

### 10.5 Best Practices

- Keep responses compact — use server-side pagination/filtering
- For long operations (>30s), return a job ID immediately and have ChatGPT poll a status endpoint
- Response JSON should be flat, concise, and self-explanatory
- Test with the GPT Builder preview before deploying

### 10.6 Minimal Schema Example

```yaml
openapi: "3.1.0"
info:
  title: "LinkRight API"
  description: "API for LinkRight contact & knowledge management"
  version: "1.0.0"
servers:
  - url: "https://linkright.example.com"
paths:
  /api/vector-search:
    post:
      operationId: vectorSearch
      summary: "Semantic search across LinkRight knowledge base"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                  description: "Natural language search query"
                top_k:
                  type: integer
                  description: "Max results (default 5)"
              required: ["query"]
      responses:
        "200":
          description: "Search results with scores"
          content:
            application/json:
              schema:
                type: object
                properties:
                  results:
                    type: array
                    items:
                      type: object
                      properties:
                        content:
                          type: string
                        source:
                          type: string
                        score:
                          type: number
```

---

## 11. ChatGPT MCP Support (Connectors → Apps)

### 11.1 Current Status (March 2026)

ChatGPT **fully supports MCP** since September 2025. Rebranded from "Connectors" to **"Apps"** in December 2025.

### 11.2 Transport Compatibility

| Protocol | ChatGPT | Claude Code | Cursor |
|----------|---------|-------------|--------|
| **Streamable HTTP** (recommended) | ✅ | ✅ | ✅ |
| **HTTP/SSE** (legacy) | ✅ | ✅ | ✅ |
| **stdio** (local) | ❌ (needs remote) | ✅ (primary) | ✅ |

**Key constraint**: ChatGPT requires a **remote, publicly accessible** MCP server. Cannot connect to localhost.

### 11.3 Can the SAME MCP Server Serve Both Claude Code AND ChatGPT?

**Yes.** Both follow the MCP specification (JSON-RPC 2.0). Requirements:

1. Server must expose **Streamable HTTP or SSE transport** (not just stdio)
2. CORS must allow ChatGPT domains: `https://chatgpt.com`, `https://chat.openai.com`
3. Claude Code can connect to the same remote URL OR use stdio locally
4. Same `tools/list`, `tools/call` interface for both clients

**Practical architecture for LinkRight:**
```
┌─────────────────┐     ┌──────────────────────┐
│  Claude Code    │────▶│                      │
│  (stdio local)  │     │  LinkRight MCP Server │──▶ MongoDB
│                 │     │  (Streamable HTTP)    │──▶ Dolt
├─────────────────┤     │  Port 3200            │──▶ Git
│  ChatGPT        │────▶│                      │
│  (remote HTTPS) │     └──────────────────────┘
├─────────────────┤
│  Cursor         │────▶ (same URL or stdio)
└─────────────────┘
```

### 11.4 ChatGPT Configuration Steps

1. **Settings → Connectors → Advanced** → Toggle **Developer Mode**
2. Click **"Create app"**
3. Enter MCP server URL (root for Streamable HTTP, or `/sse/` endpoint for SSE)
4. Configure auth (None, OAuth, or mixed)
5. Save — tools from MCP server appear in chat

### 11.5 Claude Code Configuration

```json
// .claude/mcp.json — remote mode (same server as ChatGPT)
{
  "mcpServers": {
    "linkright": {
      "type": "url",
      "url": "https://linkright.example.com/mcp"
    }
  }
}
```

```json
// .claude/mcp.json — local stdio mode (development)
{
  "mcpServers": {
    "linkright": {
      "command": "node",
      "args": ["./mcp-server/index.js"]
    }
  }
}
```

### 11.6 ChatGPT MCP Limitations

- **Tools only** — no Resources, Prompts, or Sampling
- OAuth discovery must be at root domain (`/.well-known/oauth-authorization-server`)
- ChatGPT uses dynamically-generated UUIDs as client IDs — server must accept any valid UUID
- 8 built-in connectors exist (Dropbox, Gmail, Google Calendar, etc.)

---

## 12. n8n vs Express for ChatGPT Action Backend

### 12.1 Current Server Memory Budget

| Process | RSS Memory | Notes |
|---------|-----------|-------|
| MongoDB (mongod + mongot) | ~650 MB | Atlas local dev container |
| n8n (main + task-runner) | ~530 MB | Two Node processes |
| openclaw-gateway | ~780 MB | Separate app |
| mcp-agent-mail | ~280 MB | Python MCP server |
| chroma | ~95 MB | Vector DB |
| **Total used** | **~3.7 GB / 7.6 GB** | **~3.5 GB available** |

### 12.2 n8n Webhook Limitations for ChatGPT Actions

- **No native OpenAPI schema generation** — must manually write and serve spec separately
- **One webhook = one endpoint = one workflow** — 5 actions = 5 separate workflows
- **Response formatting is limited** — complex shaping needs extra nodes
- **Sequential processing** by default per workflow (configurable with `EXECUTIONS_CONCURRENCY`)
- **Cold start** — webhooks don't respond until all workflows re-register after restart
- Already consuming **~530 MB** (main 404 MB + task-runner 125 MB)

### 12.3 Express.js Footprint

- Minimal Express server: **~30-50 MB** RSS at idle
- With swagger-ui + routes: **~50-80 MB**
- **10x lighter** than n8n for the same job
- Sub-millisecond routing vs n8n's workflow-engine dispatch

### 12.4 Recommendation: Hybrid Pattern

```
ChatGPT  ──▶  Express.js (:3100)  ──▶  MongoDB (direct)
                                   ──▶  Dolt (direct)
                                   ──▶  n8n webhook (complex flows only)

n8n (:5678)  ──▶  Orchestration workflows
             ──▶  Scheduled jobs
             ──▶  Multi-step integrations
```

| Use Express.js | Use n8n |
|---------------|---------|
| ChatGPT Action endpoints | Multi-step workflows |
| OpenAPI schema serving | Scheduled data sync |
| Simple CRUD API calls | Integration with 400+ services |
| Low-latency, high-frequency calls | Visual debugging of complex flows |
| MCP server HTTP transport | Prototyping new integrations |

### 12.5 Express Calling n8n When Needed

```javascript
// Express handles the fast path; delegates complex orchestration to n8n
app.post('/api/enrich-contact', async (req, res) => {
  if (!req.body.contactId) return res.status(400).json({ error: 'contactId required' });
  // Delegate to n8n for multi-step enrichment
  const result = await fetch('http://localhost:5678/webhook/enrich-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  res.json(await result.json());
});
```

### 12.6 When n8n Becomes a Bottleneck

- **10+ concurrent webhook executions**: memory spikes significantly [NEEDS VERIFICATION]
- **Large JSON payloads (>1 MB)**: n8n parses entire payload into memory per execution
- **50+ active workflows**: registration and polling overhead increases
- At current **49% memory utilization**, adding Express (+50 MB) is safe; routing more through n8n is riskier

---

## 13. LinkRight Endpoint Design

### 13.1 Required Endpoints

| Endpoint | Method | Purpose | Backend |
|----------|--------|---------|---------|
| `/api/vector-search` | POST | Semantic search across knowledge base | MongoDB `$vectorSearch` |
| `/api/beads-list` | GET/POST | List Beads tasks with filters | Dolt SQL |
| `/api/beads-update` | POST | Update a Beads task (with optimistic lock) | Dolt SQL |
| `/api/module-info` | GET | Get module metadata, status, config | Dolt SQL + files |
| `/api/context-load` | POST | Session-start context injection | MongoDB + Dolt |
| `/openapi.json` | GET | OpenAPI schema for ChatGPT | Static file |

### 13.2 OpenAPI Schema for All Endpoints

```yaml
openapi: "3.1.0"
info:
  title: "LinkRight API"
  description: "LinkRight knowledge management and task tracking API"
  version: "1.0.0"
servers:
  - url: "https://linkright.example.com"
components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key
security:
  - apiKey: []
paths:
  /api/vector-search:
    post:
      operationId: vectorSearch
      summary: "Search LinkRight knowledge base semantically"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                query: { type: string, description: "Natural language query" }
                top_k: { type: integer, default: 5, description: "Max results" }
                namespace: { type: string, description: "Filter by module namespace" }
              required: ["query"]
      responses:
        "200":
          description: "Ranked search results"

  /api/beads-list:
    post:
      operationId: beadsList
      summary: "List Beads tasks with optional filters"
      requestBody:
        required: false
        content:
          application/json:
            schema:
              type: object
              properties:
                status: { type: string, enum: ["open", "in_progress", "blocked", "done"] }
                assignee: { type: string }
                module: { type: string }
                limit: { type: integer, default: 20 }
      responses:
        "200":
          description: "List of matching tasks"

  /api/beads-update:
    post:
      operationId: beadsUpdate
      summary: "Update a Beads task (optimistic locking via version)"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id: { type: string, description: "Task ID" }
                version: { type: integer, description: "Current version for optimistic lock" }
                updates:
                  type: object
                  properties:
                    status: { type: string }
                    title: { type: string }
                    description: { type: string }
                    assignee: { type: string }
              required: ["id", "version", "updates"]
      responses:
        "200":
          description: "Updated task with new version"
        "409":
          description: "Version conflict — stale data"

  /api/module-info:
    get:
      operationId: moduleInfo
      summary: "Get module metadata and current status"
      parameters:
        - name: module
          in: query
          schema: { type: string }
          description: "Module name (e.g. flex, sync, build)"
      responses:
        "200":
          description: "Module info including phase, status, config"

  /api/context-load:
    post:
      operationId: contextLoad
      summary: "Load session context — call at conversation start"
      requestBody:
        required: false
        content:
          application/json:
            schema:
              type: object
              properties:
                modules: { type: array, items: { type: string }, description: "Filter by modules" }
                include_tasks: { type: boolean, default: true }
                include_recent_changes: { type: boolean, default: true }
      responses:
        "200":
          description: "Session context summary"
```

---

## 14. Session-Start State Load for ChatGPT

### 14.1 GPT Instruction Limits

| Field | Limit |
|-------|-------|
| GPT Instructions (system prompt) | 8,000 characters (~2,000 tokens) |
| Conversation Starters | 55,000 characters (up to 4 shown) |
| User Custom Instructions | 1,500 characters per field |
| Uploaded knowledge files | 20 files, 512 MB each, 2M tokens per text file |

### 14.2 Session-Start Pattern (Instruction-Driven Auto-Call)

There is **no built-in session-start hook** in custom GPTs. Use this pattern:

```
# LinkRight GPT — System Instructions

You are LinkRight's AI assistant. You manage contacts, knowledge, and tasks.

CRITICAL: At the start of EVERY conversation, before responding to the user,
call the `contextLoad` action to load current project state.

After receiving context, summarize what's active:
- Open tasks count and any blocked items
- Recent changes in the last 24 hours
- Active modules and their phases

Always use `vectorSearch` before answering questions about the knowledge base.
Never guess — search first, then answer with citations.
```

### 14.3 Token Budget Strategy

The `contextLoad` endpoint should return a **compact summary** (~500-1000 tokens) to leave room for conversation:

```json
{
  "summary": {
    "open_tasks": 12,
    "blocked_tasks": 2,
    "recent_changes": [
      "2026-03-16: Phase 2 research started",
      "2026-03-15: MongoDB vector search configured"
    ],
    "active_modules": ["flex", "sync"],
    "top_priorities": [
      { "id": "LR-42", "title": "MCP server implementation", "status": "in_progress" },
      { "id": "LR-38", "title": "Dolt schema migration", "status": "blocked" }
    ]
  },
  "format": "json",
  "token_estimate": 280
}
```

### 14.4 Format Comparison: TOON vs YAML vs Plain Text

| Format | Tokens for same data | Readability | Parsability |
|--------|---------------------|-------------|-------------|
| **JSON** | 280 | Medium | Perfect |
| **YAML** | 220 | High | Good |
| **Plain text** | 200 | Highest | Low |
| **TOON** | 180 | Medium | Good (custom parser needed) |

**Recommendation**: JSON for ChatGPT (native parsing), YAML for human review, TOON for MCP agent-mail integration.

### 14.5 GPT-5.1+ Loading Order Change

Critical: uploaded knowledge files now load **after** initial response generation. This means:
1. System prompt (instructions) executes first
2. Conversation starters run before first response
3. Knowledge files load last

**Do NOT rely on knowledge files for session-start logic.** Use the instruction-driven auto-call pattern.

---

# SECTION B — Context Enforcement

> Research date: 2026-03-16 | Sources: Cursor, Devin/Cognition, OpenAI Codex docs, MCP RAG implementations

## 15. RAG-First Architecture

### 15.1 Core Principle

Make vector search the **PRIMARY context path**, not raw file reads. The MCP server abstracts away file paths — AI clients interact with knowledge through search tools, not filesystem tools.

### 15.2 Tool Design That Abstracts File Paths

```typescript
// Instead of: readFile("/home/ubuntu/linkright/docs/arch/phase1.md")
// AI calls:   vectorSearch("phase 1 data layer architecture decisions")

// The AI never needs to know file paths — it searches by meaning
tools: {
  vector_search: {
    description: "Search LinkRight knowledge base by meaning. Returns relevant snippets with source references.",
    parameters: { query: string, top_k: number, namespace?: string }
  },
  hybrid_search: {
    description: "Combined keyword + semantic search. Use for exact identifiers, function names, or config keys.",
    parameters: { query: string, keyword?: string, top_k: number }
  },
  get_context: {
    description: "Get detailed context around a search result. Use after vector_search to expand a specific finding.",
    parameters: { source_ref: string, expand_lines: number }
  }
}
```

### 15.3 System Prompt Pattern for Enforcement

```
RULES:
1. ALWAYS use vector_search or hybrid_search BEFORE answering any question
   about LinkRight's codebase, architecture, or data. Never answer from memory.
2. If search returns no relevant results, say "I could not find relevant
   information for this question."
3. Cite source references for every claim about the project.
4. If uncertain about a detail, explicitly mark it as uncertain.
5. Never fabricate file paths, function signatures, or config values.
```

---

## 16. How AI Coding Tools Handle Context (Industry Analysis)

### 16.1 Cursor

- Uses **Merkle tree** + **vector embeddings** (via turbopuffer) for semantic search
- Files split into **syntactic chunks** (functions, classes — not arbitrary text)
- **Does NOT force retrieval** — requires users to manually tag files with `@` symbols
- Uses **simhash** for index sharing across teammates (~92% overlap detected → reuse index)
- Semantic search improves accuracy by ~12.5%
- Industry debate: Cursor may move toward **lexical/keyword search** because vector returns semantically similar (not exact) results

### 16.2 Devin (Cognition)

- Explicitly moved **away from embedding-based RAG** (fast but inaccurate for complex queries)
- Built **SWE-grep** — specialized RL-trained models for code location
- Uses **8 parallel searches** (grep + glob) simultaneously, limited to 4 turns
- Key insight: **delegate search to purpose-built subagents**, preventing context pollution
- **Forces retrieval** via dedicated search agent before coding agent sees context

### 16.3 OpenAI Codex

- Each task runs in its **own isolated cloud container** with full repo cloned
- Uses **direct file access** within sandbox — fundamentally different from RAG
- Agent runs terminal commands, edits code, runs checks
- **No forced vector retrieval** — relies on filesystem access + web search
- Supports MCP for extending context retrieval

### 16.4 Industry Convergence

| Tool | Strategy | Forces Retrieval? | Key Innovation |
|------|----------|-------------------|----------------|
| **Cursor** | Vector embeddings + Merkle tree | No (manual @-tags) | Index sharing |
| **Devin** | RL-trained parallel search agent | Yes (subagent) | SWE-grep |
| **Codex** | Full repo clone in sandbox | N/A (direct access) | Container isolation |
| **Claude Code** | Lexical search (grep/glob) | Agentic (tools) | Precise keyword matching |

**Trend**: Hybrid approaches — combining lexical precision with semantic understanding, mediated by specialized retrieval subagents.

---

## 17. MCP Tool Design for Context Enforcement

### 17.1 Minimal RAG MCP Server (3 tools)

```typescript
// Tool 1: Semantic Search (primary entry point)
{
  name: "rag_query",
  description: "Semantic search returning scored snippets with source paths",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Natural language search" },
      top_k: { type: "number", default: 5, description: "Max results" }
    },
    required: ["query"]
  }
  // Returns: [{ path, score, snippet }]
}

// Tool 2: Safe File Read (constrained to repo root)
{
  name: "read_file",
  description: "Read file content — constrained to project root. Use after rag_query to get full context.",
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Relative path within project" },
      startLine: { type: "number" },
      endLine: { type: "number" }
    },
    required: ["path"]
  }
  // Rejects absolute paths; validates against repo root boundary
}

// Tool 3: Directory listing
{
  name: "list_files",
  description: "List directory contents with filtering",
  inputSchema: {
    type: "object",
    properties: {
      dir: { type: "string", default: "." },
      recursive: { type: "boolean", default: false },
      extensions: { type: "array", items: { type: "string" } }
    }
  }
}
```

### 17.2 Full-Featured Code RAG Server (RagCode pattern — 9 tools)

| Tool | Purpose |
|------|---------|
| `search_code` | Semantic search by meaning (primary) |
| `hybrid_search` | Keyword + semantic for exact identifiers |
| `get_function_details` | Complete function source code |
| `find_type_definition` | Type/class with fields and methods |
| `find_implementations` | All usages and callers |
| `list_package_exports` | All exported symbols |
| `search_docs` | Markdown documentation search |
| `get_code_context` | Code snippet with surrounding context |
| `index_workspace` | Reindex codebase after changes |

### 17.3 Key Design Principles

1. **AST-Based Chunking**: Functions, classes, methods — not arbitrary text splits
2. **Hybrid Search**: Vector embeddings + BM25 keyword matching
3. **Constrained File Access**: Reject absolute paths, validate against project root
4. **Token Efficiency**: Without RAG, AI reads 5-10 files (~15,000 tokens). With RAG, ~200 tokens per result. **98% savings.**
5. **Local-Only**: Embeddings via Gemini API (free), vectors in MongoDB — zero paid dependencies

### 17.4 Making Raw File Reads Unnecessary

The key: provide **structured retrieval tools** that return precisely the needed context with metadata. When `search_code` returns a function's source, parameters, dependencies, and callers in one call, there's no reason to `cat` a file.

---

## 18. Hallucination Prevention

### 18.1 SELF-RAG Pattern

Three sequential steps:
1. "Generate an initial answer with citations"
2. "List any claims lacking citation"
3. "Refine your answer using only the cited passages"

### 18.2 CRAG (Corrective RAG)

Lightweight retrieval evaluator assigns **confidence score (0.0-1.0)** to each retrieved document. When quality is low → fall back to "I cannot answer."

### 18.3 Practical Grounding Patterns

- **Attribution Verification**: Check if cited sources actually support claims
- **Citation Coverage**: Track % of claims with source references
- **Faithfulness Scoring**: Score whether output reflects retrieved context
- **Multi-pass Generation**: Generate multiple answers, select highest-confidence

### 18.4 "I Don't Know" Enforcement

```
If you see enough detail in these documents to form an answer, do so.
Otherwise, respond: "I do not have complete information for this question."
```

### 18.5 Reality Check

All current frontier models exceed **10% hallucination rates** on enterprise-length documents, even with RAG. RAG reduces but does not eliminate hallucination. Design for graceful uncertainty.

---

# SECTION C — Write-Back Patterns

> Research date: 2026-03-16 | Sources: Dolt docs, saga pattern literature, MCP spec, n8n docs

## 19. AI Writes Back Through MCP

### 19.1 Write-Back Tools

```typescript
// beads_update — Dolt with optimistic locking
{
  name: "beads_update",
  description: "Update a Beads task. Requires version for optimistic lock.",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string" },
      version: { type: "integer", description: "Current version (from beads_list)" },
      updates: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["open", "in_progress", "blocked", "done", "cancelled"] },
          title: { type: "string" },
          description: { type: "string" },
          assignee: { type: "string" }
        }
      }
    },
    required: ["id", "version", "updates"]
  }
}

// vector_upsert — MongoDB vector store
{
  name: "vector_upsert",
  description: "Add or update a document in the vector store",
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  inputSchema: {
    type: "object",
    properties: {
      doc_id: { type: "string", description: "Unique document identifier" },
      content: { type: "string", description: "Text content to embed" },
      metadata: { type: "object", description: "Namespace, source, tags" }
    },
    required: ["doc_id", "content"]
  }
}

// file_write — Git-tracked file edit
{
  name: "file_write",
  description: "Write content to a file (auto-committed to git)",
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false },
  inputSchema: {
    type: "object",
    properties: {
      path: { type: "string", description: "Relative path within project" },
      content: { type: "string" },
      commit_message: { type: "string" }
    },
    required: ["path", "content"]
  }
}
```

### 19.2 Sync Strategy

**Dolt is source of truth for tasks.** Vectors and files are derived/recoverable.

```
AI calls beads_update(id, version, updates)
  ├── 1. Dolt: UPDATE beads_tasks SET ... WHERE id=? AND version=?
  │     └── If ROW_COUNT() = 0 → return 409 Conflict
  ├── 2. MongoDB: Re-embed changed text fields, upsert vector
  │     └── If fails → log warning (rebuildable from Dolt)
  └── 3. Git: If file path linked, update file content
        └── If fails → log warning (files derived from Dolt state)
```

---

## 20. Optimistic Locking in Dolt

### 20.1 Schema

```sql
CREATE TABLE beads_tasks (
    id          VARCHAR(64) PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    status      ENUM('open', 'in_progress', 'blocked', 'done', 'cancelled') DEFAULT 'open',
    assignee    VARCHAR(64),
    description TEXT,
    module      VARCHAR(64),
    version     INT UNSIGNED NOT NULL DEFAULT 1,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_module (module)
);
```

### 20.2 Update Pattern

```sql
-- Read current state (includes version)
SELECT id, title, status, version FROM beads_tasks WHERE id = 'LR-42';
-- Returns: version = 3

-- Update with version guard
UPDATE beads_tasks
SET title = 'New title', status = 'in_progress', version = version + 1
WHERE id = 'LR-42' AND version = 3;

-- Check if update succeeded
SELECT ROW_COUNT();
-- 1 = success, 0 = conflict (someone else updated since our read)
```

### 20.3 MCP Handler Implementation

```javascript
async function beadsUpdate(params) {
  const { id, version, updates } = params;

  const setClauses = [];
  const values = [];
  for (const [key, val] of Object.entries(updates)) {
    setClauses.push(`${key} = ?`);
    values.push(val);
  }
  setClauses.push('version = version + 1');
  values.push(id, version);

  const sql = `UPDATE beads_tasks SET ${setClauses.join(', ')}
               WHERE id = ? AND version = ?`;

  const result = await dolt.query(sql, values);

  if (result.affectedRows === 0) {
    // Conflict — read current state for client
    const current = await dolt.query('SELECT * FROM beads_tasks WHERE id = ?', [id]);
    return {
      content: [{ type: 'text', text: JSON.stringify({
        error: 'VERSION_CONFLICT',
        message: `Task ${id} was modified. Current version: ${current[0].version}`,
        current: current[0]
      })}],
      isError: true
    };
  }

  // Success — return updated task
  const updated = await dolt.query('SELECT * FROM beads_tasks WHERE id = ?', [id]);
  return {
    content: [{ type: 'text', text: JSON.stringify({ success: true, task: updated[0] }) }],
    isError: false
  };
}
```

### 20.4 Dolt-Specific Advantages

- **Branch-per-agent isolation**: Each AI agent works on its own branch, merges back to main
- **Conflict resolution**: `dolt_conflicts_$TABLE` shows `base_*`, `our_*`, `their_*` columns
- **Full audit trail**: `dolt_diff_$TABLE`, `dolt_blame_$TABLE`, `dolt_history_$TABLE` — free

---

## 21. Event Chain on Write

### 21.1 Not Every Change Cascades

| Change Type | Re-index Vectors? | Update Files? | Notify? |
|-------------|-------------------|---------------|---------|
| Title/description edit | ✅ Yes | Maybe | No |
| Status change | ❌ No | Maybe | ✅ Yes |
| Assignee change | ❌ No | ❌ No | ✅ Yes |
| New task created | ✅ Yes | ❌ No | ✅ Yes |
| Task closed | ❌ No | Maybe | ✅ Yes |

### 21.2 Event Patterns (Ranked)

1. **Application-level emit** (simplest) — MCP handler calls side effects inline after Dolt write. Acceptable for personal scale.
2. **Transactional Outbox** (most reliable) — Event written in same Dolt transaction as data change. Poller reads outbox, triggers side effects.
3. **CDC polling** — Poll `dolt_diff` tables for changes. Dolt lacks native CDC. [NEEDS VERIFICATION]

**Recommendation**: Start with application-level (Phase 1). Graduate to outbox when multi-agent.

### 21.3 Write Chain Flow

```
AI calls beads_update
  │
  ├── 1. DOLT: UPDATE + version bump (MUST succeed)
  │
  ├── 2. If title/description changed:
  │     └── MONGODB: Re-embed text → upsert vector (best-effort)
  │
  ├── 3. If linked file exists:
  │     └── GIT: Update file content → commit (best-effort)
  │
  └── 4. If status changed to 'done':
        └── n8n webhook: /webhook/task-completed (fire-and-forget)
```

### 21.4 n8n for Complex Chains (Phase 2)

```
MCP writes to Dolt
  └── fires webhook to n8n
        ├── Branch 1: Re-embed in MongoDB (parallel)
        ├── Branch 2: Update git file (parallel)
        └── Branch 3: Send notification (parallel)
```

n8n provides retry logic per-node, error workflows, and visual debugging. But for Phase 1: handle side effects inline in MCP handler — skip n8n overhead.

---

## 22. Saga Pattern for Distributed Writes

### 22.1 Three-Store Write Problem

When updating Dolt + MongoDB + Git, partial failures can leave stores inconsistent.

### 22.2 Orchestration Saga (Recommended)

```
Step 1: DOLT UPDATE (compensable — DOLT_REVERT)
  ↓ success
Step 2: GIT COMMIT (pivot point)
  ↓ success
Step 3: MONGODB VECTOR UPSERT (retryable — idempotent)
```

**Compensation on failure:**
- Step 2 fails → `CALL DOLT_REVERT('HEAD')` to undo Dolt change
- Step 3 fails → Retry (idempotent). If persistent failure → log. Vectors are always rebuildable.

### 22.3 Pragmatic Recommendation for LinkRight

**"Best-effort side effects" pattern** — not a true saga, but matches reality:

1. **Dolt write MUST succeed** (source of truth, optimistic lock)
2. **Git + MongoDB updates are best-effort** with error logging
3. **Vectors and files are always rebuildable** from Dolt + source files
4. Background reconciliation job (cron or n8n schedule) catches any drift

This is simpler than a full saga and sufficient for personal-first, single-user use. Graduate to proper saga when multi-agent or multi-user.

---

## Deep Research Prompt — ChatGPT Actions + Enforcement + Write-Back

> Research the following questions about ChatGPT Actions, context enforcement, and write-back patterns as of March 2026, providing specific version numbers, code examples, and verified facts:
>
> (1) What is the exact maximum response body size for a ChatGPT Action API call — is it 100 KB as community reports suggest, or has OpenAI increased this for GPT-5? What happens when the response exceeds the limit — truncation or error?
>
> (2) For ChatGPT MCP "Apps" (formerly Connectors): Can a free/Plus subscriber add a custom MCP server URL in Developer Mode, or is this feature restricted to Business/Enterprise/Edu plans? What is the exact plan availability matrix as of March 2026?
>
> (3) What is the exact token budget that ChatGPT allocates for processing Action responses? The GPT-4 era limit was reportedly 8,000 tokens — has this increased with GPT-5/GPT-5.1? How does this interact with the conversation context window?
>
> (4) How does Cursor's new Composer mode handle retrieval — does it auto-search the codebase before generating code, or does it still require manual @-tagging? Has Cursor's move away from vector search (toward lexical/keyword search) been confirmed?
>
> (5) What are the exact MCP tool annotation fields in the June 2025 stable spec? Do any clients (Claude Code, Cursor, ChatGPT) actually enforce `destructiveHint` by requiring user confirmation, or are annotations advisory only?
>
> (6) For Dolt's `DOLT_REVERT('HEAD')` — does this create a new revert commit (like `git revert`) or does it reset the branch head (like `git reset`)? What is the exact SQL syntax for compensating a failed saga step?
>
> (7) Can n8n webhook nodes return custom HTTP status codes (like 409 for conflict)? Or do they always return 200? This affects whether ChatGPT Actions can distinguish between success and version conflicts.
>
> (8) What is the measured latency overhead of n8n webhook processing vs a direct Express.js route for a simple MongoDB query? Is the 50-200ms estimate accurate?
>
> (9) For the "instruction-driven auto-call" pattern (forcing ChatGPT to call an Action at session start): How reliable is this in practice? Does ChatGPT consistently follow the instruction, or does it sometimes skip the call and answer from training data?
>
> (10) What are the CORS requirements for an MCP server serving ChatGPT? Exact domains to allow, headers needed, preflight handling.

---

## Deep Research Prompt for External AI

> Research the following questions about MCP (Model Context Protocol) as of March 2026, providing specific version numbers, code examples, and verified facts: (1) What is the exact current stable version of the Python MCP SDK (`mcp` on PyPI) and the TypeScript SDK (`@modelcontextprotocol/server` on npm), and has the TypeScript v2 stable release shipped yet? (2) Does the official Python FastMCP (`mcp.server.fastmcp`) support dual transport — running stdio AND HTTP simultaneously in the same process, or do you need two separate processes? (3) What are the exact memory footprints of a minimal Python FastMCP server and a TypeScript FastMCP server on Linux x86_64 with MongoDB motor client loaded? (4) For the MongoDB Community 8.2 `$vectorSearch` operator, does it work with the `mongot` process on Community Edition, or only with Atlas — specifically, can a self-hosted mongod+mongot setup use `$vectorSearch` through an MCP tool without Atlas? (5) What is the current state of ChatGPT MCP connector support for personal/Plus users vs Business/Enterprise — can a Plus subscriber add a custom MCP server URL, or is it enterprise-only? (6) Does Cursor IDE support MCP Resources and Prompts as of March 2026, or only Tools — what is the exact feature gap vs Claude Code? (7) For the Dolt database, what is the recommended Python async MySQL driver that works with Dolt's MySQL-compatible interface — does `aiomysql` handle Dolt-specific features like `DOLT_DIFF()` and `AS OF` queries? (8) What is the maximum number of tools an MCP server should expose before clients start degrading in performance or truncating tool lists — are there documented limits in Claude Code, Cursor, or ChatGPT? (9) Has the MCP spec added `outputSchema` for typed tool returns in the stable spec, or is it still draft — and which clients actually validate or use outputSchema?

---

## Sources

- [MCP Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25)
- [2026 MCP Roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [FastMCP (TypeScript)](https://github.com/punkpeye/fastmcp)
- [MongoDB MCP Server](https://github.com/mongodb-js/mongodb-mcp-server)
- [MongoDB MCP Server Winter 2026](https://www.mongodb.com/company/blog/product-release-announcements/whats-new-mongodb-mcp-server-winter-2026-edition)
- [Build an MCP Server (Official Tutorial)](https://modelcontextprotocol.io/docs/develop/build-server)
- [MCP Naming Conventions](https://zazencodes.com/blog/mcp-server-naming-conventions)
- [MCP Best Practices (Phil Schmid)](https://www.philschmid.de/mcp-best-practices)
- [ChatGPT MCP/Connectors](https://developers.openai.com/api/docs/guides/tools-connectors-mcp/)
- [OpenAI MCP Server Building Guide](https://developers.openai.com/apps-sdk/build/mcp-server/)
- [MCP Auth - OAuth 2.1](https://auth0.com/blog/mcp-specs-update-all-about-auth/)
- [MCP SDK Comparison](https://www.stainless.com/mcp/mcp-sdk-comparison-python-vs-typescript-vs-go-implementations)
- [AI Coding Agents 2026 Comparison](https://lushbinary.com/blog/ai-coding-agents-comparison-cursor-windsurf-claude-copilot-kiro-2026/)
- [REST to MCP Mapping (Zuplo)](https://zuplo.com/learning-center/mapping-rest-apis-to-mcp-tools)
- [MCP Tools Spec (June 2025)](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)

### ChatGPT Actions & MCP Sources (Section A)
- [OpenAI GPT Actions Production Notes](https://platform.openai.com/docs/actions/production)
- [OpenAI GPT Actions Introduction](https://platform.openai.com/docs/actions/introduction)
- [OpenAI GPT Actions Authentication](https://platform.openai.com/docs/actions/authentication)
- [OpenAI MCP Documentation](https://platform.openai.com/docs/mcp)
- [OpenAI MCP & Connectors Guide](https://developers.openai.com/api/docs/guides/tools-connectors-mcp/)
- [Developer Mode & Apps in ChatGPT](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta)
- [Apps in ChatGPT (renamed from Connectors)](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt)
- [Community: Response Size Limits](https://community.openai.com/t/limits-to-the-size-of-request-response-in-gpt-actions/951186)
- [Community: Timeout Discussion](https://community.openai.com/t/is-there-a-timeout-restriction-for-gpt-actions/545694)
- [InfoQ: OpenAI Adds MCP Support](https://www.infoq.com/news/2025/10/chat-gpt-mcp/)

### Context Enforcement Sources (Section B)
- [How Cursor Indexes Your Codebase (TDS)](https://towardsdatascience.com/how-cursor-actually-indexes-your-codebase/)
- [Cursor Blog: Secure Codebase Indexing](https://cursor.com/blog/secure-codebase-indexing)
- [Why Cursor May Ditch Vector Search (TigerData)](https://www.tigerdata.com/blog/why-cursor-is-about-to-ditch-vector-search-and-you-should-too)
- [Cognition: Fast Context Retrieval (SWE-grep)](https://www.startuphub.ai/ai-news/ai-research/2025/cognitions-new-bet-on-fast-context-retrieval)
- [Cognition: Devin 2.0](https://cognition.ai/blog/devin-2)
- [OpenAI Codex CLI](https://developers.openai.com/codex/cli)
- [OpenAI Codex Cloud](https://developers.openai.com/codex/cloud/)
- [mcp-rag-server (GitHub)](https://github.com/Daniel-Barta/mcp-rag-server)
- [RagCode MCP (GitHub)](https://github.com/doITmagic/rag-code-mcp)
- [Prompt Engineering for RAG (MachineLearningMastery)](https://machinelearningmastery.com/prompt-engineering-patterns-successful-rag-implementations/)
- [Hallucination Mitigation for RAG (MDPI)](https://www.mdpi.com/2227-7390/13/5/856)
- [Confident RAG (arXiv)](https://arxiv.org/abs/2507.17442)

### Write-Back & Sync Sources (Section C)
- [Dolt Documentation — SQL Procedures](https://docs.dolthub.com/sql-reference/version-control/dolt-sql-procedures)
- [Optimistic Locking Pattern (MySQL)](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html)
- [Saga Pattern (Microsoft Docs)](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga)
- [MCP Tool Annotations Spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
