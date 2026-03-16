# Phase 3: Coordination Layer — Research

> **Date:** 2026-03-16
> **Status:** RESEARCH COMPLETE — awaiting decisions
> **Locked context:** MongoDB 8.2 Community, Dolt, Single MCP Server, n8n running, ₹0 budget

---

## Table of Contents

- [Section A — Cross-Module Data Flow](#section-a--cross-module-data-flow)
  - [A1. Event-Driven Patterns for Solo Dev](#a1-event-driven-patterns-for-solo-dev)
  - [A2. MongoDB Change Streams](#a2-mongodb-change-streams)
  - [A3. n8n as Orchestration Backbone](#a3-n8n-as-orchestration-backbone)
  - [A4. Flagship Pipeline: LifeOS → Flex](#a4-flagship-pipeline-lifeos--flex)
  - [A5. Flex → Sync Pipeline](#a5-flex--sync-pipeline)
  - [A6. Error Handling & Resilience](#a6-error-handling--resilience)
- [Section B — Agent Coordination](#section-b--agent-coordination)
  - [B7. Multi-Agent Frameworks (2026 State)](#b7-multi-agent-frameworks-2026-state)
  - [B8. Shared Memory: Do We Need Mem0/Zep?](#b8-shared-memory-do-we-need-mem0zep)
  - [B9. Agent Discovery & Registry](#b9-agent-discovery--registry)
  - [B10. Sequential vs Parallel Agents](#b10-sequential-vs-parallel-agents)
- [Section C — Shared State Design](#section-c--shared-state-design)
  - [C11. Module Data Ownership](#c11-module-data-ownership)
  - [C12. Access Control Model](#c12-access-control-model)
  - [C13. Schema Design for Shared State](#c13-schema-design-for-shared-state)
- [Deep Research Prompt — Coordination Layer](#deep-research-prompt--coordination-layer)

---

## Section A — Cross-Module Data Flow

### A1. Event-Driven Patterns for Solo Dev

**Question:** What is the simplest event-driven pattern for a single user? What scales to SaaS?

#### Options Evaluated

| Pattern | Complexity | Cost | Solo Fit | SaaS Scale | Verdict |
|---------|-----------|------|----------|------------|---------|
| **MongoDB Change Streams** | Low | ₹0 (already running) | ★★★★★ | ★★★★ | **RECOMMENDED — Phase 1** |
| **n8n Webhooks** | Low | ₹0 (already running) | ★★★★★ | ★★★ | **RECOMMENDED — co-primary** |
| **File-based events** | Minimal | ₹0 | ★★★★ | ★ | Viable for dev only |
| **Redis Streams** | Medium | ₹0 (self-hosted) | ★★★ | ★★★★★ | Overkill now, great later |
| **NATS** | Medium-High | ₹0 (self-hosted) | ★★ | ★★★★★ | Over-engineered for solo |
| **RabbitMQ** | High | ₹0 (self-hosted) | ★★ | ★★★★ | Too heavy for our scale |

#### Recommendation: Two-Phase Approach

**Phase 1 (NOW — solo dev):** MongoDB Change Streams + n8n Webhooks
- Zero new infrastructure (both already running)
- Change Streams for data-triggered events (new experience → generate content)
- n8n webhooks for workflow-triggered events (post published → update metrics)
- Simple, debuggable, sufficient for 1 user

**Phase 2 (LATER — SaaS):** Add Redis Streams as event bus
- Redis Streams provide consumer groups (multiple subscribers per event)
- Message persistence, replay, backpressure
- Add only when >1 user or >5 modules need real-time coordination

#### File-Based Events (Development Shortcut)

For the absolute simplest dev workflow:
```
_lr/_events/
├── pending/
│   └── 2026-03-16T10-30-00_lifeos_experience_added.json
├── processed/
│   └── ...
└── failed/
    └── ...
```

A cron job or n8n schedule trigger polls `pending/`, processes, moves to `processed/`. This is ugly but works for prototyping. **Not recommended for production.**

#### Why NOT NATS/RabbitMQ Now

- Both require a separate daemon (memory on our 7.6GB EC2)
- Solo dev doesn't need consumer groups, partitioning, or backpressure
- MongoDB Change Streams give us 80% of the value at 0% additional cost
- Premature infrastructure = maintenance burden with no user benefit

---

### A2. MongoDB Change Streams

**Question:** Can MongoDB watch for inserts/updates and trigger cross-module actions? Free in Community?

#### Answer: YES — Fully Available in Community Edition

MongoDB Change Streams work on **any replica set**, including Community Edition. Our MongoDB 8.2 instance just needs to run as a replica set (even a single-node replica set works).

#### How It Works

```javascript
// Watch the lifeos_vectors collection for new experiences
const pipeline = [
  { $match: { 'operationType': { $in: ['insert', 'update'] } } },
  { $match: { 'fullDocument.metadata.module': 'lifeos' } },
  { $match: { 'fullDocument.metadata.content_type': 'experience' } }
];

const changeStream = db.collection('lr_vectors').watch(pipeline);

changeStream.on('change', async (change) => {
  // Trigger Flex module to generate content from this experience
  await triggerFlexContentGeneration(change.fullDocument);
});
```

#### Key Properties

| Property | Detail |
|----------|--------|
| **Cost** | ₹0 — included in Community Edition |
| **Requirement** | Must run as replica set (single-node RS works fine) |
| **Resume** | Has resume tokens — survives restarts without missing events |
| **Filtering** | Aggregation pipeline filters server-side (efficient) |
| **Latency** | Near real-time (<100ms typically) |
| **Ordering** | Guaranteed per-collection ordering |
| **Full document** | Can return full document on update (not just delta) |

#### Setup: Single-Node Replica Set

If not already configured as replica set:
```bash
# In mongod.conf, add:
replication:
  replSetName: "rs0"

# Then initiate:
mongosh --eval 'rs.initiate()'
```

This is a one-time, non-breaking change. All existing operations continue to work.

#### Practical Architecture

```
MongoDB Collection: lr_vectors
    │
    ├── Change Stream Watcher (Node.js/Python process)
    │   ├── Filter: module=lifeos, type=experience → trigger Flex pipeline
    │   ├── Filter: module=flex, type=published_post → trigger Sync update
    │   └── Filter: module=sync, type=skill_validated → trigger Squick
    │
    └── Alternative: n8n MongoDB Trigger node
        └── Polls change stream via n8n (no custom code needed)
```

#### Limitations

- Change Streams require oplog — storage overhead ~5% (negligible at our scale)
- Maximum 1000 concurrent change streams per deployment [NEEDS VERIFICATION]
- If the watcher process crashes, it must resume from the last token (built-in support for this)
- Change streams on the free M0 Atlas tier are limited, but we're self-hosted Community, so no limits

#### n8n Integration

n8n has a **MongoDB Trigger** node that uses Change Streams under the hood. This means we can react to MongoDB changes directly in n8n workflows — zero custom code.

```
n8n Workflow:
  Trigger: MongoDB (watch lr_vectors, filter module=lifeos)
  → Code Node: Extract experience text
  → Gemini Node: Generate LinkedIn post draft
  → MongoDB Node: Insert into lr_vectors (module=flex, type=draft)
```

---

### A3. n8n as Orchestration Backbone

**Question:** Can n8n orchestrate cross-module flows? Limitations?

#### Answer: YES — n8n is a Strong Fit as Primary Orchestrator

n8n is already running. It supports webhooks, schedules, MongoDB triggers, HTTP requests, and code execution. It can absolutely serve as the coordination backbone.

#### What n8n Does Well for Us

| Capability | How We Use It |
|-----------|--------------|
| **Webhook triggers** | Module A calls `http://localhost:5678/webhook/flex-generate` to trigger Flex |
| **MongoDB triggers** | Watch Change Streams directly (no custom code) |
| **Schedule triggers** | Daily: "Check for new experiences, generate content batch" |
| **Error handling** | Built-in retry, error workflows, notifications |
| **Workflow chaining** | Workflow A completes → triggers Workflow B via webhook |
| **Code nodes** | Inline JS/Python for transformation logic |
| **Gemini integration** | Already configured for embeddings — reuse for generation |
| **Visual debugging** | See exactly where a pipeline failed |

#### Cross-Module Workflow Examples

**1. LifeOS → Flex Pipeline (n8n)**
```
[MongoDB Trigger: new experience]
  → [Code: extract + format]
  → [Gemini: generate post draft]
  → [MongoDB: save draft to flex collection]
  → [Webhook: notify user via Telegram/email]
```

**2. Flex → Sync Pipeline (n8n)**
```
[Schedule: every 6 hours]
  → [HTTP: fetch LinkedIn post metrics]
  → [Code: calculate engagement score]
  → [IF: score > threshold]
    → [MongoDB: add to sync portfolio]
    → [Dolt: update skill evidence]
```

**3. Error Recovery (n8n)**
```
[Any workflow fails]
  → [Error Trigger node]
  → [MongoDB: log to lr_events collection]
  → [IF: retryable?]
    → [Wait 5 min] → [Execute Workflow: retry original]
  → [ELSE]
    → [Telegram: alert Satvik]
```

#### Limitations of n8n as Orchestrator

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| **Not a message queue** | No built-in message persistence/replay | Use MongoDB as event store alongside |
| **Single instance** | No HA/clustering in Community Edition | Acceptable for solo dev; add Redis-backed queue for SaaS |
| **Webhook reliability** | If n8n is down, webhooks are lost | MongoDB Change Streams + resume tokens as backup |
| **Complex branching** | Deep conditional logic gets messy in visual editor | Keep workflows simple; chain small workflows |
| **Memory** | Each execution uses RAM (~50-100MB for complex workflows) | Keep workflows lightweight; avoid large data in memory |
| **Rate limits** | Gemini free tier: 1500 RPD, 15 RPM | Batch operations; add delays between API calls |

#### Architecture Decision

**n8n = primary orchestrator for cross-module workflows.**
**MongoDB Change Streams = event source feeding into n8n.**
**MongoDB = event store (lr_events collection) for audit/replay.**

This gives us:
- Visual workflow management (n8n)
- Reliable event sourcing (MongoDB Change Streams)
- Audit trail (MongoDB lr_events)
- Zero additional infrastructure

---

### A4. Flagship Pipeline: LifeOS → Flex

**Question:** LifeOS captures experience → stored as vector → Flex generates LinkedIn post. Concrete architecture.

#### End-to-End Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Experience Capture (LifeOS)                             │
│                                                                 │
│ User writes experience in _lr/lifeos/experiences/               │
│ OR enters via chat → MCP tool → saved to file                   │
│                                                                 │
│ File: _lr/lifeos/experiences/2026-03-16-cicd-debugging.md       │
│ ┌─────────────────────────────────────────────────────────┐     │
│ │ ---                                                     │     │
│ │ date: 2026-03-16                                        │     │
│ │ tags: [devops, debugging, ci-cd, learning]              │     │
│ │ emotion: frustrated-then-satisfied                      │     │
│ │ shareable: true                                         │     │
│ │ ---                                                     │     │
│ │ Spent 4 hours debugging why CI was flaky. Turned out    │     │
│ │ the test DB wasn't being reset between runs. The fix    │     │
│ │ was 2 lines. Lesson: always check shared state first.   │     │
│ └─────────────────────────────────────────────────────────┘     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Vectorize (lr sync / post-commit hook)                  │
│                                                                 │
│ LlamaIndex pipeline:                                            │
│   1. Parse markdown (MarkdownNodeParser)                        │
│   2. Extract frontmatter → metadata                             │
│   3. Embed via Gemini (text-embedding-005, 1536-dim)            │
│   4. Upsert to MongoDB lr_vectors collection                    │
│                                                                 │
│ Document in MongoDB:                                            │
│ {                                                               │
│   content: "Spent 4 hours debugging...",                        │
│   embedding: [0.12, -0.34, ...],                                │
│   metadata: {                                                   │
│     module: "lifeos",                                           │
│     content_type: "experience",                                 │
│     tags: ["devops", "debugging"],                              │
│     shareable: true,                                            │
│     date: "2026-03-16",                                         │
│     emotion: "frustrated-then-satisfied"                        │
│   }                                                             │
│ }                                                               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Trigger (MongoDB Change Stream → n8n)                   │
│                                                                 │
│ n8n MongoDB Trigger watches for:                                │
│   operationType: insert                                         │
│   fullDocument.metadata.module: "lifeos"                        │
│   fullDocument.metadata.content_type: "experience"              │
│   fullDocument.metadata.shareable: true                         │
│                                                                 │
│ Only shareable experiences trigger content generation.           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Context Retrieval (Flex module via n8n)                  │
│                                                                 │
│ n8n Code Node:                                                  │
│   1. Vector search: find similar past experiences                │
│      → "What other debugging stories have I shared?"            │
│   2. Vector search: find user's LinkedIn voice/style             │
│      → "How does Satvik usually write posts?"                   │
│   3. Vector search: find relevant skills from Sync               │
│      → "What DevOps skills are on the resume?"                  │
│   4. Fetch: last 5 LinkedIn posts (avoid repetition)             │
│                                                                 │
│ All via MongoDB $vectorSearch aggregation pipeline.              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Generate Draft (Gemini via n8n)                          │
│                                                                 │
│ Prompt assembled from context:                                   │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ You are writing a LinkedIn post for Satvik.               │   │
│ │ Voice: [retrieved from Flex persona vectors]              │   │
│ │ Experience: [the new experience]                          │   │
│ │ Similar past posts: [retrieved, to avoid repetition]      │   │
│ │ Relevant skills: [from Sync module]                       │   │
│ │ Tone: authentic, reflective, Hinglish-friendly            │   │
│ │                                                           │   │
│ │ Generate 2-3 draft variations.                            │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ Output: 2-3 draft posts                                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Store & Notify                                          │
│                                                                 │
│ 1. Save drafts to MongoDB:                                      │
│    { module: "flex", content_type: "draft",                     │
│      source_experience_id: <ObjectId>,                          │
│      status: "pending_review", drafts: [...] }                  │
│                                                                 │
│ 2. Save to file: _lr/flex/drafts/2026-03-16-cicd-post.md       │
│                                                                 │
│ 3. Notify user (Telegram/email): "New post draft ready"          │
│                                                                 │
│ 4. User reviews, edits, approves → publishes to LinkedIn        │
└─────────────────────────────────────────────────────────────────┘
```

#### Key Design Decisions

1. **`shareable: true` gate** — Not every experience should become content. User marks explicitly.
2. **Multi-module context** — Flex doesn't just use LifeOS data. It pulls voice from Flex, skills from Sync. This is the power of shared vector store.
3. **Human-in-the-loop** — Drafts are NEVER auto-published. Always pending user review.
4. **File + MongoDB dual storage** — Drafts saved to both (file = git-trackable, MongoDB = searchable).
5. **Deduplication** — Vector search for similar past posts prevents repetitive content.

---

### A5. Flex → Sync Pipeline

**Question:** Published LinkedIn post metrics → Sync adds to portfolio/resume. Trigger mechanisms.

#### Flow

```
┌────────────────────────────────────────────┐
│ TRIGGER: Post Published on LinkedIn         │
│                                            │
│ Option A: Manual — user marks post as      │
│   "published" in _lr/flex/published/       │
│                                            │
│ Option B: n8n Schedule — poll LinkedIn API  │
│   every 6 hours for new post metrics       │
│                                            │
│ Option C: Webhook — if using LinkedIn API   │
│   (limited availability for personal accts) │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│ n8n Workflow: flex-to-sync-metrics          │
│                                            │
│ 1. Fetch post metrics:                      │
│    - impressions, likes, comments, shares   │
│    - engagement rate                        │
│    - audience demographics (if available)   │
│                                            │
│ 2. Score the post:                          │
│    - engagement_score = weighted formula     │
│    - portfolio_worthy = score > threshold   │
│                                            │
│ 3. Extract skills demonstrated:             │
│    - Match post tags against skill taxonomy │
│    - "debugging" → DevOps skill evidence    │
└──────────────────┬─────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────┐
│ Update Sync Module                          │
│                                            │
│ 1. MongoDB (lr_vectors):                    │
│    Insert with module=sync,                 │
│    content_type=portfolio_item              │
│    { post_url, metrics, skills_demonstrated,│
│      engagement_score, date }               │
│                                            │
│ 2. Dolt (beads):                            │
│    Update skill evidence table              │
│    "DevOps: +1 evidence (LinkedIn post,     │
│     engagement: 4.2%)"                      │
│                                            │
│ 3. File:                                    │
│    _lr/sync/portfolio/2026-03-cicd-post.md  │
└────────────────────────────────────────────┘
```

#### Trigger Mechanism Recommendation

**For solo dev:** Option A (manual) + Option B (scheduled poll)

LinkedIn's API for personal profiles is restrictive. The practical approach:
1. User publishes post, copies URL to `_lr/flex/published/` file
2. n8n scheduled workflow picks up new published posts
3. Fetches metrics via LinkedIn API (if available) or user manually adds metrics
4. Runs scoring and sync pipeline

**For SaaS:** LinkedIn OAuth + webhook integration (requires LinkedIn Marketing Developer Platform approval).

#### Metrics Schema

```javascript
// In lr_vectors collection
{
  content: "LinkedIn post about CI/CD debugging (4.2% engagement, 1.2K impressions)",
  embedding: [...],  // embed the post content for similarity
  metadata: {
    module: "sync",
    content_type: "portfolio_item",
    source_module: "flex",
    source_post_id: "flex_post_2026-03-16",
    linkedin_url: "https://linkedin.com/posts/...",
    metrics: {
      impressions: 1200,
      likes: 34,
      comments: 8,
      shares: 3,
      engagement_rate: 0.042
    },
    skills_demonstrated: ["devops", "debugging", "ci-cd"],
    portfolio_score: 8.5,  // out of 10
    date_published: "2026-03-16"
  }
}
```

---

### A6. Error Handling & Resilience

**Question:** What happens when one module is down or fails?

#### Error Handling Strategy

| Scenario | Handling | Implementation |
|----------|---------|---------------|
| **n8n workflow fails** | Retry 3x with exponential backoff → dead letter | n8n built-in error handling |
| **MongoDB down** | Queue events in file system → replay on recovery | File-based fallback queue |
| **Gemini API rate limited** | Exponential backoff, max 3 retries, then queue for later | n8n Wait + retry nodes |
| **Gemini API down** | Skip generation, log event, retry in next scheduled run | n8n error workflow |
| **Module-specific logic fails** | Log error with full context, continue other modules | Per-module error isolation |
| **Change Stream disconnects** | Resume from last token (built into MongoDB driver) | Automatic with resume token |

#### Architecture: Event Store as Safety Net

```javascript
// lr_events collection — audit trail + replay capability
{
  _id: ObjectId,
  event_type: "experience_added",       // what happened
  source_module: "lifeos",              // who triggered
  target_module: "flex",                // who should process
  payload: { experience_id: "..." },    // event data
  status: "pending" | "processing" | "completed" | "failed" | "dead_letter",
  attempts: 0,
  max_attempts: 3,
  created_at: ISODate,
  processed_at: ISODate | null,
  error: null | "Error message",
  retry_after: ISODate | null
}
```

#### Dead Letter Pattern

Events that fail 3x go to `status: "dead_letter"`. A weekly n8n workflow:
1. Scans dead letters
2. Sends summary to user (Telegram/email)
3. User decides: retry, skip, or investigate

#### Key Principle: Eventual Consistency, Not Real-Time

For a solo dev platform, we don't need real-time guarantees. If LifeOS adds an experience at 10:00 AM and Flex generates a draft at 10:05 AM, that's fine. Even a delay of hours is acceptable. This relaxed consistency requirement means:
- No need for distributed transactions
- Simple retry logic suffices
- MongoDB's at-least-once delivery (Change Streams) is good enough
- Idempotent handlers (check if already processed) prevent duplicates

---

## Section B — Agent Coordination

### B7. Multi-Agent Frameworks (2026 State)

**Question:** CrewAI, AutoGen, LangGraph, Semantic Kernel — what works in production?

#### Framework Comparison (March 2026)

| Framework | Production Ready? | Strengths | Weaknesses | Our Fit |
|-----------|------------------|-----------|-----------|---------|
| **LangGraph** | ★★★★★ | Graph-based orchestration, state machines, production-proven at scale. LangSmith observability. | Heavy dependency chain; tied to LangChain ecosystem. Python-first. | **STRONG** — if we go Python |
| **CrewAI** | ★★★☆☆ | Easy multi-agent setup, role-based agents, nice abstractions. | Still maturing; production stories are limited. Memory management is basic. Opinionated about agent roles. | **MEDIUM** — good for prototyping |
| **AutoGen (Microsoft)** | ★★★★☆ | Strong Microsoft backing, .NET + Python. Good for multi-turn agent conversations. | Complex setup. Designed for conversational agents, not pipeline orchestration. | **LOW** — wrong paradigm for us |
| **Semantic Kernel** | ★★★★☆ | Microsoft's orchestration SDK. Plugins, planner, memory. C#/Python/Java. | Enterprise-focused, verbose. Overkill for solo dev. | **LOW** — too enterprise |
| **Claude Agent SDK** | ★★★★☆ | Native Claude tool use, simple API, streaming. | Anthropic-only. Newer, smaller ecosystem. | **HIGH** — if staying Claude-native |
| **Direct MCP + custom code** | ★★★★★ | Full control, no framework overhead, exactly what you need. | You build everything. | **HIGHEST** — for our scale |

#### The Honest Assessment

**Overhyped:**
- **CrewAI** — Great demos, but production deployments are rare. The "crew of agents chatting" paradigm sounds cool but introduces latency and unpredictability. For our use case (pipelines, not conversations), it's the wrong tool.
- **AutoGen** — Designed for multi-agent debates/conversations. We need pipelines, not debates.

**Actually Production-Ready:**
- **LangGraph** — The most battle-tested. Companies actually run this in production. The state machine paradigm maps well to our module pipelines. But it's a heavy dependency.
- **Semantic Kernel** — Enterprise-grade but overkill. Good if we were a 50-person team.

**Best Fit for LinkRight:**
- **Direct MCP tools + n8n orchestration** — We already have MCP (for tool exposure) and n8n (for orchestration). Adding a framework on top creates a third coordination layer. That's one too many.

#### Recommendation

**Don't adopt a multi-agent framework.** Instead:

1. **MCP tools** = how agents discover and call capabilities
2. **n8n workflows** = how cross-module pipelines are orchestrated
3. **MongoDB** = shared state/memory
4. **Dolt** = task tracking

This is simpler, cheaper, and avoids framework lock-in. If we later need complex agent-to-agent conversations (not pipelines), then evaluate LangGraph.

**When to reconsider:** If we need agents that dynamically decide which other agents to call (not predetermined pipelines), a framework adds value. Until then, it's overhead.

---

### B8. Shared Memory: Do We Need Mem0/Zep?

**Question:** Mem0, Zep, Motorhead — needed? Or is MongoDB + Dolt sufficient?

#### What These Tools Do

| Tool | Purpose | Key Feature |
|------|---------|-------------|
| **Mem0** | Long-term memory for AI agents | Auto-extracts facts from conversations, stores in vector DB |
| **Zep** | Memory server for LLM apps | Session memory, fact extraction, user summaries |
| **Motorhead** | Redis-backed memory server | Simple key-value memory with TTL |

#### Do We Need Them?

**Short answer: No.** Here's why:

| Need | Mem0/Zep Solution | Our Existing Solution |
|------|-------------------|----------------------|
| Long-term facts about user | Mem0 auto-extracts | **MongoDB vectors** — we already store user experiences, preferences, skills |
| Session memory | Zep session store | **MCP context** — Claude/Cursor already maintain session context |
| Cross-session memory | Mem0 persistent memory | **MongoDB + files** — `_lr/_memory/` directory + vectors |
| Agent memory sharing | Zep shared memory | **MongoDB shared collection** — all modules read same vectors |
| Conversation history | Motorhead Redis store | **MongoDB lr_conversations** collection (if needed) |

#### What We'd Gain from Mem0/Zep

- Automatic fact extraction ("user mentioned they know Python" → stored as fact)
- Structured memory with confidence scores
- Built-in forgetting/decay (old facts lose weight)

#### What We'd Lose

- Another dependency to maintain
- Another process consuming RAM (our EC2 has 7.6GB)
- Complexity in knowing which system is the "source of truth" for user knowledge
- Mem0 free tier limits [NEEDS VERIFICATION — may have changed in 2026]

#### Recommendation: Skip Mem0/Zep, Build Minimal Memory Layer

```javascript
// lr_memory collection in MongoDB
{
  _id: ObjectId,
  key: "user.skills.python",
  value: "Expert — 10 years experience",
  source: "lifeos",                    // which module learned this
  confidence: 0.95,                    // how confident
  evidence: ["experience_id_1", "experience_id_2"],
  created_at: ISODate,
  updated_at: ISODate,
  access_count: 12                     // how often queried
}
```

This gives us:
- Structured memory (key-value with metadata)
- Source tracking (which module learned what)
- Confidence scores (updated as more evidence appears)
- No additional dependencies

**When to reconsider:** If we find ourselves building complex fact-extraction logic, Mem0 becomes worth it. But for V1, simple key-value memory in MongoDB is sufficient.

---

### B9. Agent Discovery & Registry

**Question:** How does an agent in Flex know what tools/agents exist in Sync?

#### The Problem

Module A (Flex) wants to: "Check if user has DevOps on their resume"
Module A needs to know: Sync module exists, has a `get_skills` tool, and how to call it.

#### Solution: MCP Tool Registry (Already Planned)

Our single MCP server (port 8766) is the natural registry. Every module registers its tools with the MCP server:

```typescript
// MCP Server — tool registry
const tools = {
  // LifeOS tools
  "lifeos.add_experience": { description: "Add a new life experience", params: {...} },
  "lifeos.search_experiences": { description: "Search past experiences", params: {...} },

  // Flex tools
  "flex.generate_post": { description: "Generate LinkedIn post from experience", params: {...} },
  "flex.get_drafts": { description: "List pending post drafts", params: {...} },

  // Sync tools
  "sync.get_skills": { description: "List skills with evidence", params: {...} },
  "sync.add_portfolio_item": { description: "Add item to portfolio", params: {...} },
  "sync.match_jd": { description: "Match resume against job description", params: {...} },

  // Squick tools
  "squick.validate_skill": { description: "Quick skill assessment", params: {...} },

  // Cross-module tools
  "shared.vector_search": { description: "Search across all module vectors", params: {...} },
  "shared.get_user_profile": { description: "Get unified user profile", params: {...} },
};
```

#### Discovery Pattern

```
Agent A (Flex) wants to call Sync:
  1. Agent A asks MCP: "list tools matching sync.*"
  2. MCP returns: [sync.get_skills, sync.add_portfolio_item, sync.match_jd]
  3. Agent A calls: sync.get_skills({ category: "devops" })
  4. MCP routes to Sync module logic, returns result
```

#### Why This Works

- **Single entry point** — MCP server knows all tools (already our architecture)
- **Self-documenting** — Each tool has description + parameter schema
- **No direct module coupling** — Flex never calls Sync directly; MCP mediates
- **Discovery is built-in** — MCP protocol supports `tools/list`

#### Tool Naming Convention

```
{module}.{action}_{resource}

Examples:
  lifeos.add_experience
  flex.generate_post
  sync.get_skills
  shared.vector_search     ← cross-module tools use "shared" prefix
```

#### Runtime Discovery vs Static Registry

**For solo dev:** Static registry (hardcoded tool list in MCP server) is fine. Modules don't change often.

**For SaaS:** Dynamic registration — modules register tools on startup:
```typescript
// Each module registers on startup
mcp.registerTool("flex.generate_post", {
  handler: flexGeneratePost,
  schema: { ... },
  module: "flex",
  version: "1.0"
});
```

---

### B10. Sequential vs Parallel Agents

**Question:** Satvik prefers sequential (quality over speed). When is parallel justified?

#### Default: Sequential

For LinkRight, sequential agent execution is the right default because:

1. **Debugging** — When something goes wrong, sequential execution has a clear trace
2. **Context building** — Later steps often depend on earlier results (experience → context → draft)
3. **Cost control** — Sequential = one API call at a time = predictable Gemini usage
4. **Quality** — Each step can validate the previous step's output before proceeding

#### When Parallel is Justified

| Scenario | Why Parallel | Example |
|----------|-------------|---------|
| **Independent data fetches** | No dependency between fetches | Fetch LinkedIn metrics + search similar posts simultaneously |
| **Multi-module context retrieval** | All lookups are read-only, independent | Vector search LifeOS + search Sync skills + fetch Flex persona — all at once |
| **Batch processing** | Same operation on multiple items | Generate drafts for 5 experiences simultaneously |
| **Validation checks** | Independent validations | Check spelling + check tone + check length — all at once |

#### Architecture: Sequential Pipeline, Parallel Steps

```
Pipeline (sequential):
  Step 1: Trigger (receive event)
  Step 2: Context Gathering (PARALLEL within this step)
    ├── Vector search: similar experiences
    ├── Vector search: user voice/style
    └── Vector search: recent posts (dedup)
  Step 3: Generate draft (sequential — needs all context)
  Step 4: Validation (PARALLEL within this step)
    ├── Check: not too similar to recent posts
    ├── Check: tone matches persona
    └── Check: length within LinkedIn limits
  Step 5: Store & notify (sequential)
```

**Rule of thumb:** Pipeline steps are sequential. Within a step, independent operations run in parallel.

#### n8n Implementation

n8n supports this natively:
- **Sequential:** Default node-to-node flow
- **Parallel within step:** Use "Split In Batches" or multiple branches that merge

---

## Section C — Shared State Design

### C11. Module Data Ownership

**Question:** What does each module own vs share?

#### Ownership Matrix

| Data | Owner | Shared? | Who Can Read | Who Can Write |
|------|-------|---------|-------------|---------------|
| **User profile** (name, bio, skills) | `shared` | Yes | All modules | Any module (merge conflicts resolved by timestamp) |
| **Life experiences** | `lifeos` | Read-only to others | All modules (if shareable=true) | LifeOS only |
| **LinkedIn post drafts** | `flex` | No (private) | Flex only | Flex only |
| **Published post metrics** | `flex` | Read-only to others | All modules | Flex only |
| **Resume/portfolio** | `sync` | Read-only to others | All modules | Sync only |
| **Job descriptions** | `sync` | No (private) | Sync only | Sync only |
| **Skill assessments** | `squick` | Read-only to others | All modules | Squick only |
| **Workflow definitions** | `autoflow` | Read-only to others | All modules | AutoFlow only |
| **Module config** | Each module | No (private) | Own module only | Own module only |
| **Event log** | `shared` | Yes (read) | All modules | Any module (append-only) |
| **User preferences** | `shared` | Yes | All modules | Any module |

#### Ownership Rules

1. **Owner writes, others read** — A module owns its data and is the only writer. Other modules get read access.
2. **Shared data = append/update by anyone, no deletes** — User profile, event log, preferences.
3. **Private data = invisible to others** — Drafts, JDs, module configs. Not even readable.
4. **Shareable flag** — Some private data can opt-in to sharing (experiences with `shareable: true`).

#### MongoDB Implementation

```javascript
// Metadata field determines access
{
  metadata: {
    module: "lifeos",           // owner
    visibility: "shared_read",  // shared_read | private | public
    shareable: true,            // opt-in sharing for private data
  }
}
```

Access enforcement happens in the MCP server — not in MongoDB (no row-level security in Community).

---

### C12. Access Control Model

**Question:** Open read, controlled write? Or explicit permission?

#### Recommendation: Open Read, Controlled Write (with Private Override)

```
┌──────────────────────────────────────────────────┐
│ ACCESS MODEL                                      │
│                                                  │
│ DEFAULT: Any module can READ any other module's   │
│ data (except private data).                       │
│                                                  │
│ WRITE: Only the owning module can write.          │
│                                                  │
│ PRIVATE: Module can mark data as private          │
│ (visibility: "private"). Not readable by others.  │
│                                                  │
│ SHARED: Some collections (user_profile, events)   │
│ are writable by any module.                       │
└──────────────────────────────────────────────────┘
```

#### Why Open Read?

For a solo dev platform with 1 user:
- There's no multi-tenancy concern (it's all your data)
- Cross-module reads are the core value proposition (Flex reading LifeOS experiences)
- Restricting reads adds complexity with zero benefit for solo use
- The MCP server mediates all access anyway — we can add restrictions later

#### Why Controlled Write?

- Prevents accidental data corruption (Flex shouldn't modify LifeOS experiences)
- Clear ownership = clear responsibility
- Debugging: "who wrote this?" → always the owning module

#### Implementation in MCP Server

```typescript
// MCP server access control middleware
function checkAccess(module: string, operation: string, targetModule: string): boolean {
  // Read access
  if (operation === 'read') {
    // Check if target data is private
    if (targetModule !== module && visibility === 'private') return false;
    return true;  // open read for non-private data
  }

  // Write access
  if (operation === 'write') {
    if (targetModule === 'shared') return true;  // shared collections = open write
    return module === targetModule;  // only owner can write own data
  }

  return false;
}
```

#### SaaS Evolution

For multi-tenant SaaS, add `tenant_id` filter:
```javascript
{
  metadata: {
    tenant_id: "user_123",  // added for SaaS
    module: "lifeos",
    visibility: "shared_read"
  }
}
```

---

### C13. Schema Design for Shared State

**Question:** How to structure shared state in MongoDB?

#### Collection Strategy

Based on Phase 1 decision (1 shared collection with metadata filtering):

```
MongoDB Database: linkright
│
├── lr_vectors           # PRIMARY — all module vectors (shared collection)
│   ├── Vector index (HNSW, 1536-dim)
│   └── Metadata filter index (module, content_type, visibility)
│
├── lr_events            # Event store for cross-module coordination
│   └── TTL index (auto-expire old events after 90 days)
│
├── lr_memory            # Shared agent memory (key-value + metadata)
│   └── Unique index on (key)
│
├── lr_user_profile      # Unified user profile (shared write)
│   └── Single document per user (solo: just 1 doc)
│
└── lr_module_state      # Per-module runtime state
    └── Index on (module)
```

#### lr_vectors Schema (Primary Collection)

```javascript
{
  _id: ObjectId,

  // Content
  content: "The actual text chunk",
  embedding: [/* 1536 floats */],

  // Ownership & Access
  metadata: {
    module: "lifeos" | "flex" | "sync" | "squick" | "autoflow" | "core" | "shared",
    content_type: "experience" | "draft" | "published_post" | "portfolio_item" | "skill" | "config" | "workflow",
    visibility: "shared_read" | "private" | "public",

    // Source tracking
    file_path: "_lr/lifeos/experiences/2026-03-16.md",
    git_hash: "abc123",

    // Flexible metadata
    tags: ["devops", "debugging"],
    shareable: true,

    // Cross-module linking
    source_module: null | "lifeos",     // if this was derived from another module
    source_id: null | ObjectId,         // link to source document

    // Timestamps
    created_at: ISODate,
    updated_at: ISODate
  }
}
```

#### lr_events Schema (Event Store)

```javascript
{
  _id: ObjectId,
  event_type: "experience_added" | "post_published" | "skill_validated" | "metrics_updated",
  source_module: "lifeos",
  target_module: "flex" | null,    // null = broadcast to all
  payload: {
    // Event-specific data
    experience_id: ObjectId,
    content_preview: "First 100 chars..."
  },
  status: "pending" | "processing" | "completed" | "failed" | "dead_letter",
  attempts: 0,
  max_attempts: 3,
  error: null,
  created_at: ISODate,
  processed_at: null,
  retry_after: null,
  processed_by: null | "n8n_workflow_123"
}
```

#### lr_user_profile Schema (Shared)

```javascript
{
  _id: "satvik",  // user ID (solo: just one)
  name: "Satvik",
  bio: "...",
  skills: {
    "python": { level: "expert", evidence_count: 15, last_validated: ISODate },
    "devops": { level: "intermediate", evidence_count: 8, last_validated: ISODate }
  },
  linkedin: {
    profile_url: "...",
    voice_description: "Reflective, technical, occasional humor",
    posting_frequency: "2x/week"
  },
  preferences: {
    language: "hinglish",
    content_tone: "authentic",
    auto_publish: false
  },
  updated_by: {
    last_module: "sync",
    last_updated: ISODate
  }
}
```

#### lr_module_state Schema (Runtime State)

```javascript
{
  module: "flex",
  state: {
    last_post_generated: ISODate,
    drafts_pending: 3,
    linkedin_api_last_call: ISODate,
    rate_limit_remaining: 95
  },
  health: {
    status: "healthy" | "degraded" | "down",
    last_heartbeat: ISODate,
    error: null
  }
}
```

#### Index Strategy

```javascript
// lr_vectors — vector search index
db.lr_vectors.createSearchIndex({
  name: "vector_index",
  type: "vectorSearch",
  definition: {
    fields: [{
      type: "vector",
      path: "embedding",
      numDimensions: 1536,
      similarity: "cosine"
    }, {
      type: "filter",
      path: "metadata.module"
    }, {
      type: "filter",
      path: "metadata.content_type"
    }, {
      type: "filter",
      path: "metadata.visibility"
    }, {
      type: "filter",
      path: "metadata.tags"
    }]
  }
});

// lr_events — for polling pending events
db.lr_events.createIndex({ status: 1, target_module: 1, created_at: 1 });

// lr_events — TTL for auto-cleanup
db.lr_events.createIndex({ created_at: 1 }, { expireAfterSeconds: 7776000 }); // 90 days
```

#### Cross-Module Query Examples

```javascript
// Flex asks: "Find shareable experiences from LifeOS about debugging"
db.lr_vectors.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: embedQuery("debugging CI/CD pipelines"),
      numCandidates: 50,
      limit: 5,
      filter: {
        "metadata.module": "lifeos",
        "metadata.content_type": "experience",
        "metadata.visibility": { $ne: "private" }
      }
    }
  }
]);

// Sync asks: "What skills has the user demonstrated across all modules?"
db.lr_vectors.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: embedQuery("professional skills expertise"),
      numCandidates: 100,
      limit: 20,
      filter: {
        "metadata.content_type": { $in: ["skill", "portfolio_item", "published_post"] },
        "metadata.visibility": { $ne: "private" }
      }
    }
  }
]);
```

---

## Summary: Recommended Coordination Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    COORDINATION LAYER                         │
│                                                             │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  LifeOS  │     │     Flex     │     │    Sync      │    │
│  │  Module   │     │    Module    │     │   Module     │    │
│  └────┬─────┘     └──────┬───────┘     └──────┬───────┘    │
│       │                  │                     │            │
│       └──────────┬───────┴─────────┬───────────┘            │
│                  │                 │                         │
│           ┌──────▼───────┐  ┌─────▼──────────┐             │
│           │  MCP Server  │  │   n8n Workflows │             │
│           │  (Registry   │  │  (Orchestrator) │             │
│           │   + Access)  │  │                 │             │
│           └──────┬───────┘  └─────┬──────────┘             │
│                  │                │                         │
│           ┌──────▼────────────────▼──────┐                  │
│           │      MongoDB 8.2             │                  │
│           │  ┌─────────────────────────┐ │                  │
│           │  │ lr_vectors (shared)     │ │                  │
│           │  │ lr_events (event store) │ │                  │
│           │  │ lr_memory (agent memory)│ │                  │
│           │  │ lr_user_profile (shared)│ │                  │
│           │  │ lr_module_state         │ │                  │
│           │  └─────────────────────────┘ │                  │
│           │  + Change Streams (triggers) │                  │
│           └──────────────────────────────┘                  │
│                       │                                     │
│               ┌───────▼───────┐                             │
│               │     Dolt      │                             │
│               │  (Task State) │                             │
│               └───────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Decisions Summary

| # | Decision | Recommendation | Confidence |
|---|----------|---------------|------------|
| A1 | Event pattern | MongoDB Change Streams + n8n webhooks | HIGH |
| A2 | Change Streams | Yes, free in Community, needs replica set | HIGH |
| A3 | n8n as orchestrator | Yes, primary orchestrator for cross-module flows | HIGH |
| A4 | LifeOS → Flex pipeline | Change Stream trigger → context retrieval → Gemini → draft | HIGH |
| A5 | Flex → Sync pipeline | Scheduled n8n + manual trigger → metrics → portfolio update | HIGH |
| A6 | Error handling | Retry 3x → dead letter → weekly review | HIGH |
| B7 | Multi-agent framework | None — use MCP + n8n directly | HIGH |
| B8 | Shared memory | Skip Mem0/Zep — use MongoDB lr_memory collection | HIGH |
| B9 | Agent discovery | MCP tool registry with `module.action` naming | HIGH |
| B10 | Sequential vs parallel | Sequential pipeline, parallel within steps | HIGH |
| C11 | Data ownership | Owner writes, others read. Shared collections for cross-cutting | HIGH |
| C12 | Access control | Open read, controlled write, private override | HIGH |
| C13 | Schema design | 5 collections: vectors, events, memory, user_profile, module_state | HIGH |

---

## External Research Findings (March 2026)

> Sources: Gemini Deep Research + Q&A synthesis from `phase1-data/final_answers_data_phase1.md`

### MongoDB Change Streams — Replica Set Requirement

- **MongoDB Change Streams ONLY work with replica sets** — standalone `mongod` instances do NOT support them
- **Our MongoDB IS a replica set** — confirmed from process flags (single-node replica set configuration)
- This means Change Streams are available for near-real-time event-driven coordination without additional setup
- Alternative for non-replica-set setups: polling with `find({timestamp: {$gt: lastChecked}})`

### n8n as Orchestration Backbone — Limitations

- n8n is good for **scheduled and event-driven** workflows (cron triggers, webhook triggers, database polling)
- n8n is **NOT suitable for ultra-low-latency** coordination (sub-second response times)
- For low-latency needs, use direct MongoDB Change Streams or a dedicated event bus

### Simplest Cross-Module Pattern (Solo Dev)

- **Simplest (zero infra)**: Shared MongoDB collection + polling loop — Module A writes a doc, Module B polls `find({event: ...})` every minute or via n8n schedule
- **Near-real-time (no extra tools)**: Enable single-node replica set → use Change Streams with a small worker script
- **Key insight**: For 6 modules on a single EC2, avoid overengineering — shared MongoDB is sufficient

### SaaS-Scale Event Bus Options

- **NATS**: "The messenger built for scale and sanity" — ideal for low-latency pub/sub across modules/regions
- **Redis Streams**: Best for persistent message logs and consumer groups — reliable delivery with replayability
- Both are overkill for personal/solo use but are the right graduation path for multi-tenant SaaS

### Cross-Module Communication Pattern

Recommended pattern from research:

```
1. Module A (e.g., Content Creation) finishes work
2. NATS Publish: Module A publishes `content.draft.ready` event
3. Redis Stream Record: Event recorded in stream for auditability
4. Module B (e.g., Workflow Automation) consumes event → triggers review task
```

For solo dev, simplify to:
```
1. Module A writes event doc to MongoDB `lr_events` collection
2. n8n polls `lr_events` every N minutes (or Change Stream triggers n8n webhook)
3. n8n routes to appropriate Module B workflow
```

### Git-Vector Sync Architecture

- **Webhook-Queue-Worker pattern** recommended for SaaS:
  1. Git Webhook → HTTP POST to LinkRight API
  2. Durable Queue (Redis Streams or NATS) → ensures no updates lost
  3. Worker pulls tasks, does `git diff` to identify modified files
  4. Only changed files are re-embedded; deleted files trigger vector removal via metadata filters
- For solo dev: simplified version using n8n + git hooks instead of full queue infrastructure

---

## Deep Research Prompt — Coordination Layer

Use this prompt with a deep research model (Claude, Gemini Deep Research, Perplexity Pro) to get current 2026 information:

```
I'm building LinkRight, a modular AI platform for personal branding. The coordination layer connects 5+ modules (LifeOS, Flex, Sync, Squick, AutoFlow) running on a single EC2 instance.

LOCKED stack: MongoDB 8.2 Community (self-hosted), Dolt, n8n (self-hosted), single MCP server, Gemini API (free tier). Budget: ₹0/month for infrastructure.

RESEARCH THESE SPECIFIC QUESTIONS (March 2026 state):

1. MongoDB Change Streams in Community Edition 8.2:
   - Maximum concurrent change streams on a single-node replica set?
   - Resume token expiry — how long does the oplog retain?
   - Performance impact of 5-10 active change streams on 7.6GB RAM?
   - Can n8n MongoDB Trigger node use change streams reliably for long-running watches?

2. n8n as cross-module orchestrator (2026):
   - n8n Community Edition limitations for self-hosted production use
   - n8n webhook reliability — what happens to webhook calls when n8n restarts?
   - n8n + MongoDB integration — any known issues with change stream triggers?
   - n8n workflow-to-workflow chaining — best practices, pitfalls
   - n8n memory consumption per active workflow execution

3. Multi-agent coordination WITHOUT frameworks (2026):
   - Is "just use MCP tools + n8n" a pattern others use in production?
   - MCP protocol — does it support tool discovery/listing natively?
   - Any case studies of MCP-based multi-module AI platforms?

4. MongoDB as event store:
   - Is using MongoDB as an event store an anti-pattern? Or viable at small scale?
   - TTL indexes for event cleanup — any gotchas?
   - Change Streams + event store pattern — documented architectures?

5. LangGraph vs no-framework (2026):
   - What percentage of production AI apps use LangGraph vs custom orchestration?
   - LangGraph overhead — memory, latency, dependency size
   - Is the "framework fatigue" real in 2026 AI engineering?

6. Shared memory patterns:
   - Mem0 2026 status — production-ready? Free tier limits?
   - Zep 2026 status — still maintained? Community edition viable?
   - "MongoDB as agent memory" pattern — any documented examples?

Return: Specific, sourced answers with version numbers and dates. Flag anything uncertain.
```
