# 06 — Dolt Scale Limits & Stateless Client Beads Access Patterns

> **Agent 6 Research** | Phase 1 Data Layer | 2026-03-16
> **Status**: Complete — ready for architecture decision review

---

## Table of Contents

1. [Dolt Performance Benchmarks](#1-dolt-performance-benchmarks)
2. [Row Count, Storage & Memory](#2-row-count-storage--memory)
3. [Concurrent Access & Branch-per-Agent](#3-concurrent-access--branch-per-agent)
4. [DoltHub Cloud Sync](#4-dolthub-cloud-sync)
5. [Dolt-Specific Features for Beads](#5-dolt-specific-features-for-beads)
6. [Stateless Client Access Patterns](#6-stateless-client-access-patterns)
7. [API-First Task Manager Patterns](#7-api-first-task-manager-patterns)
8. [Comparison: Stateless Access Options](#8-comparison-stateless-access-options)
9. [Implications for LinkRight](#9-implications-for-linkright)
10. [Deep Research Prompt for External AI](#deep-research-prompt-for-external-ai)

---

## 1. Dolt Performance Benchmarks

### Sysbench Latency vs MySQL (Dolt v1.83.6, late 2025)

Dolt has reached **parity with MySQL** on sysbench latency after 5 years of optimization.

| Metric | Multiplier vs MySQL | Notes |
|--------|-------------------|-------|
| **Mean read latency** | **1.0x** (parity) | Scans actually faster |
| **Mean write latency** | **0.88x** (12% faster) | Insert/update/delete |
| **Combined** | **0.96x** | Slight edge over MySQL |
| **TPC-C throughput** | **2.47x slower** | 37.76 vs 93.4 tps — the remaining gap |

### Individual Read Benchmarks (ms)

| Test | MySQL | Dolt | Multiplier |
|------|-------|------|-----------|
| covering_index_scan | 1.96 | 0.55 | **0.28** |
| groupby_scan | 13.22 | 9.91 | 0.75 |
| index_join | 1.52 | 1.82 | 1.20 |
| index_join_scan | 1.47 | 1.39 | 0.95 |
| index_scan | 34.33 | 22.28 | **0.65** |
| oltp_point_select | 0.20 | 0.27 | 1.35 |
| oltp_read_only | 3.82 | 5.18 | 1.36 |
| select_random_points | 0.35 | 0.53 | 1.51 |
| select_random_ranges | 0.39 | 0.55 | 1.41 |
| table_scan | 34.95 | 22.28 | **0.64** |

### Individual Write Benchmarks (ms)

| Test | MySQL | Dolt | Multiplier |
|------|-------|------|-----------|
| oltp_insert | 4.18 | 3.13 | **0.75** |
| oltp_update_index | 4.25 | 3.19 | 0.75 |
| oltp_update_non_index | 4.18 | 3.13 | 0.75 |
| oltp_read_write | 9.06 | 11.24 | 1.24 |
| oltp_write_only | 5.28 | 6.09 | 1.15 |

### Historical Trajectory

| Year | Sysbench Multiplier | TPC-C Multiplier |
|------|-------------------|------------------|
| 2020 | ~15x slower | N/A |
| 2023 | ~2x slower | N/A |
| Early 2024 | ~1.5x slower | ~4.5x slower |
| Late 2024 | ~1.1x slower | ~3x slower |
| Late 2025 | **1.0x (parity)** | **2.47x slower** |

**Key insight**: Dolt matches MySQL on single-query latency but achieves only ~40% of MySQL's transactional throughput under heavy concurrent load (TPC-C). For Beads (low-volume task management), this is irrelevant — we'll never approach TPC-C loads.

---

## 2. Row Count, Storage & Memory

### Practical Size Limits

| Metric | Value |
|--------|-------|
| Largest tested | **1TB** (FBI NIBRS on DoltHub) |
| Comfortable production range | Up to **100GB** |
| Largest known production DB | **104GB** on disk |

### Memory Requirements

| Workload | RAM Recommendation |
|----------|--------------------|
| Rule of thumb | 10-20% of disk size |
| Minimum production | 2GB |
| Recommended | 4-8GB |
| Heavy parallelism | 32GB |

Example: 104GB database used 2GB at startup, 4.6GB during full table scans.

### Storage Overhead from Versioning

- Dolt stores **complete history** back to inception (no pruning available yet)
- Growth formula: ~4KB × (transactions) × (indexes updated) × log(table_size)/2
- 1,000 updates to 2.8M row table → ~16MB before GC, ~7MB after GC
- **Single-row inserts produce up to 10x disk garbage** vs bulk inserts — batching is critical
- UUID primary keys are antagonistic to Prolly Tree structure — prefer sequential IDs

### Beads Projection

For LinkRight's 6-level SAFe hierarchy with ~500 active beads:
- **Disk**: < 50MB (negligible)
- **RAM**: < 100MB
- **History after 1 year**: < 500MB (with regular commits)
- **Verdict**: Dolt is massively over-provisioned for our scale. Zero concern.

---

## 3. Concurrent Access & Branch-per-Agent

### Locking Model

- **No row-level locking** — this is a key difference from MySQL
- Uses **REPEATABLE_READ** isolation for all transactions
- Concurrency is **merge-based**, not lock-based

### Conflict Rules

| Scenario | Result |
|----------|--------|
| Two agents modify **same row, different columns** | Auto-merge succeeds |
| Two agents modify **same cell, different values** | Conflict — transaction fails |
| Two agents modify **different rows** | No conflict |

### Branch-per-Agent Pattern (Ideal for LinkRight)

```
main ──────────────────────────────── (source of truth)
  ├── agent/claude-opus ──────┐      (Claude's workspace)
  ├── agent/chatgpt ──────────┤      (ChatGPT's workspace)
  └── agent/codex ────────────┘      (Codex's workspace)
                              │
                    DOLT_MERGE('main')
```

- Each branch is fully isolated
- Writes to branch A don't affect branch B until explicit merge
- Clients can connect to different branches simultaneously
- Conflicts resolved via SQL: `SELECT * FROM dolt_conflicts_<table>`

### Write Throughput

- **~300 writes/second** practical limit
- Recommend batching writes (not single-row inserts)
- For Beads: ~10 writes/minute max → zero concern

---

## 4. DoltHub Cloud Sync

### DoltHub (Git-style repo hosting)

| Tier | Limit | Cost |
|------|-------|------|
| Public repos | Unlimited | Free |
| Private repos ≤ 1GB | Unlimited | Free |
| Private repos > 1GB | Per repo | $50/month |
| Private repos > 100GB | Per repo | Scales up |

### Hosted Dolt (Managed database, like RDS)

| Tier | Storage | Cost |
|------|---------|------|
| Trial | Up to 50GB | $50/month |
| Standard | Custom | Variable |
| Support | 24/7 enterprise | Included |

### Multi-Device Sync Workflow

```bash
# Laptop → DoltHub (like git push)
dolt remote add origin https://doltremoteapi.dolthub.com/satvik/linkright-beads
dolt push origin main

# Server pulls latest
dolt pull origin main

# Branch isolation for concurrent work
dolt checkout -b agent/claude
# ... work ...
dolt push origin agent/claude
```

### Backup Strategy

1. **Primary**: DoltHub remote (free for < 1GB private)
2. **Secondary**: `dolt backup` to S3/GCS
3. **Tertiary**: Git-style clone on separate machine
4. Dolt's immutable commit history provides built-in point-in-time recovery

---

## 5. Dolt-Specific Features for Beads

### Time Travel Queries (AS OF)

```sql
-- See task state at any point in time
SELECT * FROM beads AS OF TIMESTAMP('2026-03-01');

-- Compare task state across branches
SELECT m.status AS main_status, b.status AS branch_status
FROM beads AS OF 'main' m
JOIN beads AS OF 'agent/claude' b ON m.id = b.id
WHERE m.status != b.status;

-- Query by commit hash
SELECT * FROM beads AS OF 'kfvpgcf8pkd6blnkvv8e0kle8j6lug7a';
```

### Diff Between Commits

```sql
-- What changed in the last commit?
SELECT * FROM dolt_diff_beads WHERE to_commit = HASHOF('HEAD');

-- Cell-level change history
SELECT from_status, to_status, diff_type, to_commit_date
FROM dolt_diff_beads
WHERE to_id = 'sync-qm-p0-1';
```

### History & Blame

```sql
-- Full revision history of a task
SELECT * FROM dolt_history_beads WHERE id = 'sync-qm-p0-1';

-- Who last changed each task?
SELECT * FROM dolt_blame_beads;
```

### Branching via SQL

```sql
-- Create experiment branch
CALL DOLT_BRANCH('experiment/new-hierarchy');

-- Switch to it
CALL DOLT_CHECKOUT('experiment/new-hierarchy');

-- Make changes, commit
CALL DOLT_COMMIT('-am', 'Restructure hierarchy');

-- Merge back or discard
CALL DOLT_MERGE('experiment/new-hierarchy');
-- OR
CALL DOLT_BRANCH('-D', 'experiment/new-hierarchy');
```

### Beads-Specific Value

| Feature | Beads Use Case |
|---------|---------------|
| Time travel | "What was the sprint plan on March 1st?" |
| Diff | "What tasks changed since last standup?" |
| Blame | "Who closed this task and when?" |
| Branching | "Let me try a different task breakdown without affecting main" |
| History | "Show me every status change for this epic" |
| Merge | "Agent finished planning on branch, merge to main" |

---

## 6. Stateless Client Access Patterns

### The Core Problem

ChatGPT (and similar stateless clients) have **no persistent state between sessions**. Each conversation starts from zero. How does ChatGPT know what tasks exist, what's in progress, and what to work on?

### Option A: Session-Start State Load

**How it works**: On first message, ChatGPT calls a Beads API endpoint that returns current task summary.

```
User: "What should I work on next?"
ChatGPT → GET /api/beads/summary?agent=chatgpt
← Returns: active tasks, blocked items, recent changes
ChatGPT: "Based on current state, you should work on..."
```

**Pros**: Fresh state every session, minimal prompt bloat
**Cons**: Requires API call before any response, 45s timeout limit

### Option B: Webhook Push Sync

**How it works**: Every Beads change triggers a webhook that updates a ChatGPT-accessible state store.

```
Beads DB → webhook → State Cache (Redis/file) → ChatGPT reads on demand
```

**Pros**: Always current, no startup delay
**Cons**: Complex infrastructure, ChatGPT can't receive webhooks natively

### Option C: State Summary in System Prompt

**How it works**: A pre-processor generates a task state summary and injects it into the system prompt.

```
System prompt: "Current sprint: 12 tasks, 5 complete, 3 in progress.
Active: [sync-qm-p1-1: Atomicity fixes (IN_PROGRESS)]..."
```

**Pros**: Immediate awareness, no API calls needed
**Cons**: Stale by definition, limited by prompt size, manual refresh

### Option D: Hybrid — Summary + API (Recommended)

**How it works**: System prompt contains compact summary. Detailed queries use API tools.

```
System prompt: "Sprint: 12 tasks, 5 done, 3 active. Use beads_query() for details."
ChatGPT → beads_query("SELECT * FROM beads WHERE status='blocked'")
← Returns: blocked tasks with reasons
```

**Pros**: Best of both worlds — instant awareness + depth on demand
**Cons**: Requires both prompt engineering and API infrastructure

### Option E: MCP Server (Best for Claude/Native Clients)

**How it works**: Beads exposes an MCP server with resources and tools.

```
MCP Resources: task list, hierarchy, dependency graph (auto-loaded as context)
MCP Tools: create_task, update_status, close_task, query_tasks
MCP Prompts: "plan-feature", "close-with-evidence"
```

**Pros**: Native integration, bidirectional, standardized
**Cons**: Only works with MCP-compatible clients (Claude, Cursor, etc.)

---

## 7. API-First Task Manager Patterns

### Linear

| Aspect | Detail |
|--------|--------|
| **API Type** | GraphQL (`api.linear.app/graphql`) |
| **Auth** | OAuth2 or Personal API Keys |
| **Pagination** | Cursor-based via `nodes` |
| **Webhooks** | HMAC-SHA256 signed, entities: issues/comments/projects |
| **Webhook retry** | 3 retries (1 min, 1 hour, 6 hours) |
| **AI integration** | Native agent session support in GraphQL schema |
| **Filtering** | By team, resource type, state |

### Jira

| Aspect | Detail |
|--------|--------|
| **API Type** | REST v3 (`/rest/api/3/`) |
| **Query** | JQL (Jira Query Language) |
| **Auth** | OAuth 2.0 (3LO), Basic Auth, JWT |
| **Pagination** | `nextPageToken` (new), up to 5000 results |
| **Webhooks** | JQL-filtered, JWT-validated |
| **Webhook retry** | 5 retries over 25-75 minutes |
| **AI integration** | Via Atlassian Intelligence / third-party |

### Asana

| Aspect | Detail |
|--------|--------|
| **API Type** | REST |
| **Hierarchy** | Workspace > Team > Project > Section > Task > Subtask (5 levels) |
| **Auth** | OAuth2, PAT |
| **Webhooks** | Resource-level, up to 10,000 active per token |
| **Multi-homing** | Tasks can exist in multiple projects |
| **AI integration** | Via third-party (Zapier, Pipedream) |

### ChatGPT Actions Constraints

| Constraint | Limit |
|-----------|-------|
| Payload size (request + response) | < 100,000 characters each |
| Timeout | 45 seconds (non-configurable) |
| API calls per turn | ~3-5 practical (no hard limit) |
| Auth methods | None, API Key, OAuth 2.0 |
| Spec format | OpenAPI 3.x |
| Domain | Single domain per action schema |

---

## 8. Comparison: Stateless Access Options

| Criteria | A: Session Load | B: Webhook | C: Prompt Inject | D: Hybrid | E: MCP Server |
|----------|----------------|------------|------------------|-----------|---------------|
| **Freshness** | Fresh per session | Real-time | Stale | Fresh + real-time | Fresh per tool call |
| **Latency** | 1-5s startup | None | None | Minimal | Minimal |
| **Complexity** | Low | High | Low | Medium | Medium |
| **ChatGPT support** | Yes (Actions) | No (native) | Yes | Yes | No (not yet) |
| **Claude support** | Yes (tools) | Via webhook→MCP | Yes | Yes | **Yes (native)** |
| **Codex support** | Yes (tools) | No | Yes | Yes | Yes (MCP) |
| **Prompt overhead** | None | None | 500-2000 tokens | 200-500 tokens | None (resources) |
| **Depth** | API-limited | Full | Summary only | Full | Full |
| **Offline capable** | No | No | Yes | Partial | No |
| **Multi-agent safe** | Yes | Yes | Race conditions | Yes | Yes |

### Recommendation for LinkRight

**Primary**: Option E (MCP Server) for Claude and MCP-compatible clients
**Secondary**: Option D (Hybrid) for ChatGPT via Actions
**Fallback**: Option C (Prompt Inject) for minimal-setup scenarios

---

## 9. Implications for LinkRight

### Dolt is Perfect for Beads at Our Scale

- **500-5000 tasks** is trivially small for Dolt (tested to 1TB)
- **< 100MB RAM** needed, **< 50MB disk** for our data
- Single-query latency at MySQL parity — users won't notice
- TPC-C gap (2.47x) is irrelevant at < 10 writes/minute
- Versioning overhead is negligible for task data volumes

### Branch-per-Agent is the Killer Feature

- Each AI agent gets an isolated workspace
- No locking conflicts between Claude, ChatGPT, Codex
- Merge to main when work is reviewed/approved
- Time travel lets us audit "what did agent X do during session Y?"
- Diff shows exactly what changed between standups

### DoltHub Free Tier Covers Us

- Private repo under 1GB: Free forever
- Our Beads DB will be < 50MB for years
- Push/pull gives laptop ↔ server ↔ cloud sync
- Built-in backup via remote

### Stateless Access Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Claude Code  │     │  ChatGPT     │     │   Codex      │
│ (MCP native) │     │ (Actions)    │     │ (MCP/tools)  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │ MCP                │ REST/OpenAPI       │ MCP
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────┐
│                 Beads API Server                      │
│  ┌─────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ MCP     │  │ REST API   │  │ State Summarizer │  │
│  │ Server  │  │ (OpenAPI)  │  │ (prompt inject)  │  │
│  └────┬────┘  └─────┬──────┘  └────────┬─────────┘  │
│       │             │                  │             │
│       └─────────────┼──────────────────┘             │
│                     ▼                                │
│              ┌──────────────┐                        │
│              │   Dolt DB    │                        │
│              │  (server)    │                        │
│              └──────────────┘                        │
└──────────────────────────────────────────────────────┘
```

### Key Decisions Needed

1. **Branch strategy**: Branch-per-agent vs branch-per-session vs single-main?
2. **MCP server scope**: Full CRUD or read-heavy with write via CLI?
3. **ChatGPT Actions**: Build REST API wrapper or defer to MCP-only?
4. **DoltHub remote**: Set up now or wait until multi-device needed?
5. **State summary format**: Token budget for prompt injection (200 vs 500 vs 1000)?

---

## Deep Research Prompt for External AI

> Use this prompt with a latest-model AI (GPT-4o, Claude Opus, Gemini) to get updated data. The landscape moves fast.

**Prompt:**

I'm building a task management system called "Beads" that uses Dolt (git-for-data, MySQL-compatible) as its database. The system tracks tasks in a 6-level SAFe hierarchy (Epic→Capability→Feature→Story→Task→Subtask) with ~500-5000 active tasks. Multiple AI agents (Claude, ChatGPT, Codex) need concurrent read/write access.

Please research and provide sourced answers for:

**1. Latest Dolt Benchmarks (2025-2026)**
- What are the latest Dolt sysbench and TPC-C results vs MySQL? (They publish quarterly updates on dolthub.com/blog)
- Has the TPC-C gap (historically 2.47x) narrowed further?
- What's the current storage format version and any breaking changes?
- Any new concurrency improvements (row-level locking, optimistic concurrency)?

**2. DoltHub Pricing & Limits (current)**
- Current free tier limits for private repos on DoltHub
- Hosted Dolt pricing tiers (trial vs standard vs enterprise)
- Any new features: collaboration, CI/CD for data, automated testing?
- DoltgreSQL (Postgres-compatible) maturity — production-ready?

**3. ChatGPT Actions / GPTs (latest capabilities)**
- Current payload size limits (request and response) for GPT Actions
- Timeout limits — still 45 seconds or changed?
- Can GPTs now maintain state between sessions (persistent memory, threads)?
- Maximum number of actions per GPT, rate limits per user
- Any new auth methods beyond None/API Key/OAuth 2.0?
- Streaming support for long-running operations?

**4. MCP (Model Context Protocol) Ecosystem (2026)**
- Which AI clients now support MCP natively? (Claude, ChatGPT desktop, Cursor, others?)
- MCP server registry — how many servers? Any task management MCP servers?
- MCP authentication/authorization best practices
- MCP over HTTP (remote servers) — maturity level?
- Any standardized patterns for database-backed MCP servers?

**5. AI Agent Task Management Integration Patterns**
- How does Linear's AI integration work? (they have native agent support)
- Any published patterns for Jira + AI agent workflows?
- Best practices for multi-agent write coordination on shared task databases
- Token-efficient task state serialization formats (YAML vs JSON vs custom)

**6. Branch-per-Agent Database Patterns**
- Any published architectures using Dolt branches for multi-agent isolation?
- Merge conflict resolution strategies for automated agents
- Comparison: branch-per-agent vs optimistic concurrency vs CRDT-based approaches

Please provide specific URLs/sources for all claims. Prioritize official documentation and blog posts from DoltHub, OpenAI, Anthropic, Linear, and Atlassian. Flag anything that may have changed since your training cutoff.

---

## Sources

### Dolt Performance
- [Dolt is as Fast as MySQL on Sysbench](https://www.dolthub.com/blog/2025-12-04-dolt-is-as-fast-as-mysql/) (Dec 2025)
- [How Dolt Got as Fast as MySQL](https://www.dolthub.com/blog/2025-12-12-how-dolt-got-as-fast-as-mysql/) (Dec 2025)
- [More Read Performance Wins](https://www.dolthub.com/blog/2026-01-06-more-read-performance-wins/) (Jan 2026)
- [2024 Performance Summary](https://www.dolthub.com/blog/2024-12-23-2024-perf-summary/) (Dec 2024)
- [Sizing Your Dolt Instance](https://www.dolthub.com/blog/2023-12-06-sizing-your-dolt-instance/) (Dec 2023)
- [Storage Layer Memory Optimizations](https://www.dolthub.com/blog/2022-02-28-dolt-storage-layer-memory-optimizations/) (Feb 2022)
- [Concurrent Transactions](https://www.dolthub.com/blog/2023-12-14-concurrent-transaction-example/) (Dec 2023)
- [Latency Benchmarks Docs](https://docs.dolthub.com/sql-reference/benchmarks/latency)
- [Saying Goodbye to LD1](https://www.dolthub.com/blog/2026-03-03-saying-goodbye-to-ld1/) (Mar 2026)

### DoltHub & Hosting
- [Private Repos Free](https://www.dolthub.com/blog/2021-03-29-private-repos-free/) (Mar 2021)
- [DoltHub Pricing](https://www.dolthub.com/pricing)
- [Hosted Dolt Pricing](https://hosted.doltdb.com/pricing)

### Dolt Features
- [Querying History](https://docs.dolthub.com/sql-reference/version-control/querying-history)
- [Merges](https://docs.dolthub.com/sql-reference/version-control/merges)
- [Conflicts](https://docs.dolthub.com/concepts/dolt/git/conflicts)
- [Branching](https://docs.dolthub.com/concepts/dolt/git/branch)

### ChatGPT Actions
- [OpenAI GPT Actions Production](https://platform.openai.com/docs/actions/production)
- [GPT Action Authentication](https://platform.openai.com/docs/actions/authentication)
- [GPT Actions Introduction](https://platform.openai.com/docs/actions/introduction)

### Task Manager APIs
- [Linear GraphQL API](https://linear.app/developers/graphql)
- [Linear Webhooks](https://linear.app/developers/webhooks)
- [Jira REST API v3](https://developer.atlassian.com/cloud/jira/platform/rest/v2/)
- [Jira Webhooks](https://developer.atlassian.com/cloud/jira/platform/webhooks/)
- [Asana Object Hierarchy](https://developers.asana.com/docs/object-hierarchy)

### MCP & Context Engineering
- [MCP Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Wikipedia](https://en.wikipedia.org/wiki/Model_Context_Protocol)
- [Anthropic: Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [LangChain: Context Engineering](https://docs.langchain.com/oss/python/langchain/context-engineering)
