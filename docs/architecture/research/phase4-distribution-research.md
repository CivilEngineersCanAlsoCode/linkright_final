# Phase 4: Distribution Layer Research

> **Date:** 2026-03-16
> **Status:** Research Complete — Pending Decision Lock
> **Budget Constraint:** ₹0/mo (free/self-hosted only)
> **Locked Dependencies:** MongoDB 8.2 Community, Gemini API, Dolt, Single MCP Server, ChatGPT Custom Model (Flex SMA working)

---

## Table of Contents

- [Section A — ChatGPT Custom Model Packaging](#section-a--chatgpt-custom-model-packaging)
  - [A1. Web Bundle Builder Automation](#a1-web-bundle-builder-automation)
  - [A2. 20-File Allocation Strategy](#a2-20-file-allocation-strategy)
  - [A3. System Prompt Design](#a3-system-prompt-design)
  - [A4. Staleness Detection](#a4-staleness-detection)
  - [A5. HTML vs Markdown for Knowledge Files](#a5-html-vs-markdown-for-knowledge-files)
- [Section B — MCP Client Compatibility](#section-b--mcp-client-compatibility)
  - [B6. Cross-Client MCP Server Design](#b6-cross-client-mcp-server-design)
  - [B7. Testing Strategy](#b7-testing-strategy)
  - [B8. Client-Specific Optimizations](#b8-client-specific-optimizations)
- [Section C — Stateless Client Problem](#section-c--stateless-client-problem)
  - [C9. ChatGPT Stateless Beads](#c9-chatgpt-stateless-beads)
  - [C10. State Summary Format](#c10-state-summary-format)
  - [C11. Continuous Sync vs On-Demand](#c11-continuous-sync-vs-on-demand)
- [Section D — SaaS Distribution (Future)](#section-d--saas-distribution-future)
  - [D12. Single-Tenant vs Multi-Tenant](#d12-single-tenant-vs-multi-tenant)
  - [D13. Pricing Model Research](#d13-pricing-model-research)
  - [D14. Distribution Channels](#d14-distribution-channels)
- [Deep Research Prompt — Distribution Layer](#deep-research-prompt--distribution-layer)

---

## Section A — ChatGPT Custom Model Packaging

### A1. Web Bundle Builder Automation

**Problem:** Convert Markdown/YAML/CSV source files → HTML knowledge files for ChatGPT custom models. Must be automated, versioned, and diff-aware.

#### Recommended Pipeline

```
Source Files (MD/YAML/CSV)
    ↓ [content hash check — skip unchanged]
    ↓ CSV → Markdown tables (csv-to-md or custom script)
    ↓ Merge related files per topic (1 source of truth per topic)
    ↓ Pandoc → HTML (--standalone --self-contained)
    ↓ Inject version metadata header
    ↓ Output: build/knowledge/*.html
```

#### Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **Pandoc** | MD → HTML conversion | `pandoc input.md -o output.html --standalone`. Universal, supports YAML metadata |
| **csv-to-md** | CSV → Markdown tables | Batch mode, configurable formatting, YAML frontmatter support |
| **yaml-to-markdown** | YAML → Markdown | Python package, can chain into Pandoc |
| **simple-static-generator** | Multi-MD → single HTML | Generates index.html with TOC from multiple markdown files |

#### Diff Detection & Rebuild Strategy

1. **Content hash manifest**: Store SHA256 of each source file in `build/.manifest.json`
2. **On build**: Compare current hashes to manifest — only rebuild changed files
3. **Git hook integration**: Run build as pre-commit hook so commits always contain current bundles
4. **Version stamp injection**: Every HTML gets a metadata block:
   ```html
   <meta name="lr-version" content="2026-03-16T14:30:00Z">
   <meta name="lr-source-hash" content="abc123">
   <meta name="lr-module" content="flex">
   ```

#### Minimal Build Script Design

```bash
#!/bin/bash
# lr-bundle-build.sh — Build HTML knowledge files from source
MANIFEST="build/.manifest.json"
mkdir -p build/knowledge

for src in modules/*/knowledge/*.md; do
  hash=$(sha256sum "$src" | cut -d' ' -f1)
  prev_hash=$(jq -r ".\"$src\" // \"\"" "$MANIFEST" 2>/dev/null)

  if [ "$hash" != "$prev_hash" ]; then
    module=$(echo "$src" | cut -d'/' -f2)
    name=$(basename "$src" .md)
    out="build/knowledge/${module}-${name}.html"

    pandoc "$src" -o "$out" --standalone \
      --metadata title="${module}: ${name}" \
      --metadata date="$(date -Iseconds)"

    echo "  BUILT: $out"
  fi
done

# Update manifest
find modules/*/knowledge/*.md -exec sha256sum {} \; | \
  jq -Rs 'split("\n") | map(select(length > 0) | split("  ") | {(.[1]): .[0]}) | add' \
  > "$MANIFEST"
```

#### When to Rebuild

- **Always rebuild**: When source content hash changes
- **Skip rebuild**: When only whitespace/formatting changes (normalize before hashing)
- **Force rebuild**: When build template changes (Pandoc template, CSS, metadata format)
- **CI trigger**: On merge to main, rebuild all and compare to previous bundle set

---

### A2. 20-File Allocation Strategy

**Constraint:** ChatGPT allows max 20 knowledge files per custom GPT, 512MB per file, ~2M tokens per text file.

#### Satvik's Proven Pattern (SMA Model)

Currently working allocation for Flex SMA custom model:

| Slot | File | Content |
|------|------|---------|
| 1 | `INDEX.html` | **Master index** — what each file contains, relationships, when to use each |
| 2 | `workflow-{name}.html` | 1 file per primary workflow |
| 3-6 | `workflow-*.html` | Additional workflow files (up to 4-5 workflows) |
| 7 | `agents.html` | All agent definitions, capabilities, handoff rules |
| 8 | `frameworks.html` | Decision frameworks, evaluation matrices |
| 9 | `config.html` | Configuration, settings, parameters |
| 10 | `checklists.html` | Quality checklists, review criteria |
| 11 | `orchestrator.html` | Orchestration logic, state machine, flow control |
| 12 | `openapi-schema.html` | OpenAPI spec for Actions endpoint (if applicable) |
| 13-20 | **Module-specific** | Domain knowledge, examples, templates |

#### Scaling Strategy Across Modules

For a multi-module system like LinkRight (7 modules), two approaches:

**Option A: One GPT Per Module** (recommended for now)
- Each module gets its own GPT with full 20-file budget
- Flex SMA, Sync Career Agent, Squick PM, etc.
- Pro: Full knowledge depth per module
- Con: Users switch between GPTs

**Option B: Single GPT, Consolidated Knowledge**
- Merge module knowledge into themed mega-files
- Use INDEX.html extensively for routing
- Pro: Single entry point
- Con: Shallower knowledge per module, harder retrieval

#### File Sizing Guidelines

- **Sweet spot**: 10-50KB per HTML file (good chunk granularity for RAG)
- **Max practical**: 200KB before retrieval quality degrades [NEEDS VERIFICATION]
- **INDEX.html**: Keep under 5KB — it's a routing map, not content
- ChatGPT uses 800-token chunks with 400-token overlap internally

---

### A3. System Prompt Design

#### Mandatory Pre-Load Instructions

```
You are [Module Name] — a specialized AI agent within the LinkRight platform.

## Knowledge File Protocol
1. You have access to uploaded knowledge files. ALWAYS search them before answering.
2. Slow down and analyze the ENTIRE relevant file before responding.
3. Never fabricate information — if it's not in your knowledge files, say so.
4. Reference the specific file and section when citing knowledge.

## File Map (refer to INDEX.html for full details)
- INDEX.html → Master index of all knowledge files
- workflow-*.html → Step-by-step workflows
- agents.html → Agent definitions and capabilities
- frameworks.html → Decision frameworks
- config.html → Configuration reference

## Response Protocol
1. Check knowledge files FIRST for any domain-specific question
2. Follow workflow steps exactly as documented
3. Use checklists for quality validation
4. When uncertain, cite the relevant knowledge file and ask for clarification

## Version: {BUILD_DATE}
If the user asks about version or freshness, report this build date.
```

#### ChatGPT-Specific Tricks

1. **Explicit file naming in prompt**: Tell the GPT exactly which files to check for which topics. This dramatically improves recall.
2. **"Slow down and analyze"**: Meta-instruction that reduces hallucination.
3. **Trigger/instruction pairs**: Use delimiters to separate multi-step instructions:
   ```
   ---WORKFLOW TRIGGER---
   When user asks about [topic], follow these steps:
   1. Search workflow-[name].html
   2. Extract the relevant section
   3. Present steps in order
   ---END TRIGGER---
   ```
4. **Role + Task + Constraints + Output**: Structure prompt in this order for best results.
5. **Include examples**: Good/bad response examples in a dedicated knowledge file improve output quality.
6. **Conversation starters**: Pre-set suggested prompts that guide users to high-value interactions.

---

### A4. Staleness Detection

#### The Core Problem

ChatGPT knowledge files are static uploads. There's no built-in mechanism to detect when they're outdated.

#### Solution: In-File Version Headers + Actions Endpoint

**Layer 1: In-File Metadata** (always present)
```html
<header id="lr-meta">
  <span class="version">2026-03-16T14:30:00Z</span>
  <span class="source-hash">abc123def456</span>
  <span class="module">flex</span>
</header>
```

**Layer 2: Version Check via Actions** [NEEDS VERIFICATION — Actions may be deprecated]

GPT Actions were deprecated by OpenAI in early 2024. The documentation remains but the feature is no longer available in the GPT builder. OpenAI moved toward function calling, memory, and tool use as replacements.

**Alternative approaches for staleness detection:**

1. **System prompt version stamp**: Include build date in system prompt. User can ask "when was this last updated?"
2. **INDEX.html changelog**: Maintain a changelog section in the index file with last-modified dates per knowledge file
3. **Assistants API route**: Instead of custom GPTs, use the Assistants API with function calling — this allows programmatic state loading and version checking
4. **n8n webhook bridge**: n8n workflow triggered by user message → checks version → returns staleness warning if bundle is old

#### Practical Recommendation

Since Actions are deprecated, the simplest approach:
1. Stamp every knowledge file with build date
2. Put "Bundle version: {date}" in system prompt
3. System prompt instruction: "If the user asks about data freshness, report the bundle version date and note that knowledge may not reflect changes after that date."
4. Rebuild and re-upload bundles on a regular cadence (weekly or on significant changes)

---

### A5. HTML vs Markdown for Knowledge Files

#### Research Finding: HTML > Markdown for GPT Retrieval

**Satvik's observation is correct and supported by research.**

| Evidence | Finding |
|----------|---------|
| **HtmlRAG paper (Nov 2024)** | HTML meets or outperforms plain text and Markdown on most RAG datasets. Semantic tags (headings, lists, tables) improve chunk boundary detection |
| **Community reports** | Multiple GPT builders report .md files cause hallucination and retrieval failures. Renaming .md → .md.txt improves recall |
| **OpenAI internals** | GPT knowledge ingestion uses `myfiles_browser` — .txt, .docx, PDF, HTML, JSON all map cleanly. .md is treated as code artifact, not knowledge source |
| **Practical tests** | "GPTs read text files better than markdown" (SeanMcP, widely cited) |

#### Format Ranking for Knowledge Files

1. **HTML** — Best semantic structure, reliable retrieval, supports headings/lists/tables natively
2. **Plain text (.txt)** — Reliable, no parsing ambiguity, clean ingestion
3. **JSON** — Best for structured/tabular data, consistent parsing
4. **PDF** — Works but can't be updated incrementally, binary format
5. **Markdown (.md)** — Worst performer. ChatGPT often misinterprets as code, not knowledge

#### Recommendation

**Use HTML for all knowledge files.** The Pandoc pipeline (A1) already outputs HTML. Key benefits:
- Heading hierarchy preserved (H1-H6 → chunk boundaries)
- Tables rendered properly
- Lists maintain structure
- Semantic HTML tags improve retrieval relevance
- Version metadata can be embedded as HTML meta tags

---

## Section B — MCP Client Compatibility

### B6. Cross-Client MCP Server Design

#### Client Compatibility Matrix

| Feature | Claude Code | Cursor | Windsurf | VS Code Copilot | Codex CLI | Cline |
|---------|------------|--------|----------|-----------------|-----------|-------|
| **stdio** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SSE** | ✅ | ✅ | ✅ | ✅ | ? | ✅ |
| **Streamable HTTP** | ✅ | ? | ✅ | ✅ | ✅ | WIP |
| **Tools** | ✅ | ✅ (max 40) | ✅ (max 100) | ✅ | ✅ | ✅ |
| **Resources** | ✅ | ✅ | ✅ | ❌ | ? | ✅ |
| **Prompts** | ✅ | ✅ | ✅ | ✅ | ? | ✅ |
| **Sampling** | ✅ | ? | ? | ❌ | ? | ? |

#### Minimum Viable MCP Server

**Transport: stdio (universal compatibility)**. Every client supports it. No network config, no auth, no infrastructure.

**Minimum implementation requires:**
1. JSON-RPC 2.0 handler on stdin/stdout
2. `initialize` / `initialized` handshake
3. `tools/list` returning tool definitions with JSON Schema
4. `tools/call` handler executing tool logic

**SDK recommendation for LinkRight:**

| Option | Language | Pros | Cons |
|--------|----------|------|------|
| **FastMCP (Python)** | Python | Decorator-based, built-in testing, Pythonic | Python ecosystem only |
| **FastMCP (TypeScript)** | TypeScript | Higher-level, Zod schemas, fast prototyping | Newer, less mature |
| **Official SDK (TypeScript)** | TypeScript | Maximum control, strict spec | More boilerplate |
| **Official SDK (Python)** | Python | Good for Python stacks | Lower-level than FastMCP |

**Recommendation:** FastMCP (Python) — aligns with existing Python tooling (Agent Mail), built-in test support, decorator-based tool definitions.

#### Critical Constraints

- **Cursor 40-tool limit**: Only first 40 tools across ALL MCP servers are sent to the agent. Design tools to be consolidated.
- **Windsurf 100-tool limit**: More generous but still finite.
- **Claude Code deferred tools**: Tools are lazy-loaded via search — descriptions must be discoverable.
- **VS Code/Copilot**: Tools only — no Resources or Sampling. Everything must be a Tool.
- **Codex CLI**: Config in TOML format. Servers auto-launch at session start — fast startup essential.

#### Tool Count Strategy for LinkRight

Given Cursor's 40-tool limit, LinkRight MCP server should expose **≤15 tools** to leave room for other MCP servers users may have:

| Tool | Purpose |
|------|---------|
| `beads_list` | List/filter Beads issues (tasks, epics, features) |
| `beads_update` | Update issue status, add comments |
| `beads_create` | Create new issues |
| `vector_search` | Semantic search across all module vectors |
| `module_context` | Get module-specific context (agents, workflows, config) |
| `lr_sync_status` | Check sync status between files and vector store |
| `lr_build_status` | Check knowledge bundle build status |
| `state_summary` | Get current sprint/project state summary |

8 tools total — well within all client limits.

---

### B7. Testing Strategy

#### Testing Pyramid

**Layer 1: Unit Tests (In-Process)**
- FastMCP Python: `from fastmcp import Client; client = Client(server)` — zero-config in-memory testing
- Test each tool handler independently
- Validate JSON Schema compliance of inputs/outputs
- Use `pytest.mark.parametrize` for input variation

**Layer 2: Integration Tests (Subprocess)**
- Spawn MCP server as child process over stdio
- Send raw JSON-RPC messages, validate responses
- Test transport layer + message handling together
- Closer to production behavior

**Layer 3: Protocol Compliance (MCP Inspector)**
- Official tool: `npx @modelcontextprotocol/inspector@latest`
- Web UI for interactive testing + CLI mode for CI/CD
- Supports stdio, SSE, Streamable HTTP
- Run as part of CI pipeline to catch protocol regressions

**Layer 4: Cross-Client Smoke Tests**
- Manual: Open same MCP server in Claude Code, Cursor, VS Code
- Verify tool discovery, execution, error handling in each
- Document any client-specific behavior differences
- Automate where possible with MCP Inspector CLI

#### CI/CD Integration

```yaml
# Example GitHub Actions step
- name: MCP Protocol Tests
  run: |
    npx @modelcontextprotocol/inspector@latest \
      --mode cli \
      --transport stdio \
      --command "python -m linkright_mcp" \
      --test-suite tests/mcp_protocol.json
```

#### Testing Frameworks

| Framework | Purpose |
|-----------|---------|
| **FastMCP built-in** | In-memory unit testing, fastest iteration |
| **MCP Inspector** | Protocol compliance, visual debugging, CI mode |
| **haakco/mcp-testing-framework** | Automated test generation, cross-server validation |
| **lobehub/mcp-hello-world** | Mock server for testing MCP clients |

---

### B8. Client-Specific Optimizations

#### Cursor vs Claude Code: Key Differences

| Aspect | Cursor | Claude Code |
|--------|--------|-------------|
| Tool discovery | All tools loaded upfront (max 40) | Deferred/lazy via Tool Search |
| Context window | 70-120K usable (truncation) | Full 200K (1M beta on Opus) |
| Resource/Prompt UX | Polished | Less polished |
| MCP toggle | Required in settings | Auto-connects after config |
| Description impact | Short descriptions preferred | Descriptive for search discovery |

#### Tool Design Patterns Per Client

**Universal best practices:**
- 1-2 sentence descriptions, front-load critical info
- Verb + resource pattern: "Search Beads issues by status and module"
- Parameter descriptions in schema, not tool description
- Mark required vs optional explicitly
- Plain text descriptions — no XML tags, no markdown formatting
- Include default values for optional parameters

**Cursor-specific:**
- Consolidate related operations into fewer tools (40-tool budget)
- Shorter descriptions help given context truncation
- Consider `mcp-hub-mcp` meta-tool pattern if hitting limits

**Claude Code-specific:**
- Rich, descriptive tool descriptions — they're used for search/discovery
- Can register many tools without context bloat (deferred loading)
- Front-load important keywords in descriptions

**VS Code/Copilot-specific:**
- Don't rely on Resources or Sampling — expose everything as Tools
- Tools-only constraint means state must be returned as tool output

**Codex CLI-specific:**
- Fast startup critical (auto-launches at session start)
- TOML config format

---

## Section C — Stateless Client Problem

### C9. ChatGPT Stateless Beads

#### The Problem

ChatGPT has no persistent state between conversations. Each new conversation starts from zero. For Beads task management, the user needs to see: what's active, what's blocked, what changed since last session.

#### Session-Start State Loading

**Since GPT Actions are deprecated**, state cannot be loaded via API call on conversation start. Available approaches:

**Approach 1: Knowledge File State Snapshot** (simplest)
- Periodically rebuild a `state-current.html` knowledge file with active Beads state
- Include: active sprint, in-progress tasks, recent closures, blockers
- Upload as part of the 20-file bundle
- Pro: Works today, no infrastructure
- Con: Stale between rebuilds

**Approach 2: Assistants API with Function Calling** (programmatic)
- Build a ChatGPT-compatible assistant using the Assistants API
- Register function calling tools that hit the LinkRight MCP server
- On first user message, assistant calls `state_summary` tool
- Pro: Real-time state, programmable
- Con: Requires Assistants API integration (not free custom GPT)

**Approach 3: n8n Orchestrated Bridge** (hybrid)
- User interacts with custom GPT
- GPT's system prompt instructs: "On first message, ask user to trigger state refresh"
- User clicks conversation starter → triggers n8n webhook → n8n fetches from Beads → returns formatted state
- Pro: Real-time, uses existing n8n infra
- Con: Extra user step, fragile

**Recommendation:** Start with Approach 1 (knowledge file snapshot), plan migration to Approach 2 when real-time state becomes critical.

#### Five-Layer Handoff Protocol

Research shows the most effective state summary follows this structure:

| Layer | Content | Priority |
|-------|---------|----------|
| **1. Facts** | Current status of all tracked items | Highest |
| **2. Story** | What happened recently and why | High |
| **3. Reasoning** | Key decisions and their rationale | Medium |
| **4. Action** | What needs attention next | Medium |
| **5. Caution** | Blockers, risks, failure modes | Medium |

#### Priority Order for State Summary

1. **Active blockers and failures** (highest — these need immediate attention)
2. **In-progress work items** (current sprint)
3. **Decisions made since last session** (with rationale)
4. **Recent changes** (files modified, PRs merged, issues closed)
5. **Upcoming work** (next items in backlog)
6. **Historical context** (lowest — load on-demand only)

#### Token Budget

Target: **≤2000 tokens** for full state summary. Breakdown:
- Blockers: 200 tokens
- Active tasks (top 10): 500 tokens
- Recent decisions: 300 tokens
- Recent changes: 300 tokens
- Upcoming: 200 tokens
- Meta (version, module): 100 tokens
- Buffer: 300 tokens

---

### C10. State Summary Format

#### Format Comparison

| Format | Token Efficiency vs JSON | ChatGPT Parsing | Human Readable | Best For |
|--------|--------------------------|-----------------|----------------|----------|
| **TOON** | **40-60% fewer tokens** | Good for flat data | Moderate | Task lists, sprint summaries, tabular state |
| **YAML** | 18% fewer tokens | Good | Excellent | Hierarchical config, human-editable state |
| **JSON** | Baseline (most verbose) | Best (native) | Moderate | Nested structures, API responses |
| **Plain text** | ~20% fewer tokens | Good | Excellent | Narrative summaries |
| **Markdown** | ~15% fewer tokens | Variable (see A5) | Excellent | Mixed content |

#### TOON Details

TOON (Token-Oriented Object Notation) achieves compression through:
- Indentation instead of braces
- Unquoted strings
- Array length annotations (`tags[2]:`)
- Schema defined once, then rows listed without repeating field names

Example:
```toon
sprint:
  name: Phase-1-Data
  status: in_progress

tasks[3]:
  id | title | status | priority
  sync-001 | MongoDB vector setup | done | P0
  sync-002 | Embedding pipeline | in_progress | P0
  sync-003 | MCP server scaffold | todo | P1

blockers[1]:
  id | description | owner
  blk-001 | Gemini API rate limit on batch embed | satvik
```

**Benchmark:** TOON achieves 76.4% accuracy while using 39.9% fewer tokens vs JSON.

#### Recommendation

**Use TOON for Beads state summaries in knowledge files.** Reasons:
1. Beads state is inherently tabular (task lists, sprint boards)
2. 40-60% token savings = more state in the same budget
3. ChatGPT handles TOON well for flat/tabular structures
4. Falls back gracefully — even if parsing isn't perfect, the structure is human-readable

**Use JSON for**: API responses, deeply nested data, function calling returns
**Use YAML for**: Human-editable configuration files

---

### C11. Continuous Sync vs On-Demand

#### Analysis

| Approach | Pros | Cons | Cost |
|----------|------|------|------|
| **Continuous push** | Always fresh | No webhook to push TO ChatGPT; requires Assistants API | Higher compute |
| **Periodic rebuild** | Simple, predictable | Stale between rebuilds | Low (cron job) |
| **On-demand** | Fresh when needed | User must trigger | Lowest |

#### ChatGPT Webhook Limitations

- **No inbound webhooks**: ChatGPT custom GPTs cannot receive push notifications
- **No auto-execute**: Actions (deprecated) couldn't auto-trigger on conversation start
- **Assistants API**: Can programmatically update knowledge/vector stores, but requires API integration

#### Recommendation: Tiered Approach

**Tier 1: Periodic Rebuild (implement now)**
- Cron job: rebuild `state-current.html` every 4 hours (or on git push)
- Re-upload to custom GPT via OpenAI API (`POST /v1/files`)
- Simple, reliable, ₹0 cost

**Tier 2: On-Demand via Conversation Starter (implement soon)**
- Custom GPT conversation starter: "🔄 Refresh my state"
- Triggers the GPT to instruct user to visit a URL or run a command
- State is then available in the next rebuild

**Tier 3: Real-Time via Assistants API (future)**
- Migrate from custom GPT to Assistants API
- Function calling tools hit LinkRight MCP server
- State loaded in real-time on every conversation
- Requires: Assistants API integration, possibly paid tier [NEEDS VERIFICATION]

---

## Section D — SaaS Distribution (Future)

### D12. Single-Tenant vs Multi-Tenant

#### Analysis for LinkRight

| Factor | Single-Tenant | Multi-Tenant |
|--------|--------------|--------------|
| **Cost at <100 users** | High (linear infra scaling) | Low (shared infra) |
| **Data isolation** | Natural | Requires careful design |
| **Deployment complexity** | Per-customer ops burden | One deployment |
| **Self-hosted option** | Easier to offer | Harder to extract |
| **Maintenance** | N deployments to patch | 1 deployment |
| **Breakeven** | Never viable at ₹0 budget | Works at ₹0 |

#### When Multi-Tenant Becomes Necessary

No magic user count. Driven by:
- Security/compliance requirements (enterprise demands single-tenant)
- Target market (SMBs fine with multi-tenant)
- Practical threshold: >50 users makes single-tenant operationally painful

#### Recommendation

**Start multi-tenant, offer self-hosted as premium.**

1. **Phase 1 (now)**: Single-user, self-hosted (Satvik's personal instance)
2. **Phase 2 (beta)**: Multi-tenant SaaS with namespace isolation (MongoDB metadata filtering already designed)
3. **Phase 3 (scale)**: Hybrid — multi-tenant default, single-tenant/self-hosted for enterprise

The existing MongoDB namespace design (1 collection per module + userId metadata) already supports multi-tenancy. No architecture change needed.

---

### D13. Pricing Model Research

#### Industry Pricing Landscape (2025-2026)

| Tool | Free | Pro | Teams | Model |
|------|------|-----|-------|-------|
| Cursor | Hobby (free) | $20/mo (credit-based) | $40/user/mo | Credits |
| Windsurf | 25 credits/mo | $15/mo | $30/user/mo | Credits |
| GitHub Copilot | Limited free | $10/mo | $19/user/mo | Seat + usage |
| Continue.dev | Fully free (OSS) | — | — | BYO-model |
| Tabnine | Basic free | Per-developer | Enterprise custom | Seat |

**Key trend:** Industry shifted from flat per-seat to **credit/usage-based** in 2025-2026.

#### AI Agent Platform Pricing

| Platform | Core | Hosted | Observability |
|----------|------|--------|---------------|
| LangChain/LangGraph | Free (OSS) | N/A | LangSmith $39/seat/mo |
| CrewAI | Free (OSS) | ~$99/mo starting | Enterprise custom |

#### Recommended Pricing for LinkRight

**Open-Core + Usage-Based Hybrid:**

| Tier | Price | Includes |
|------|-------|----------|
| **Free (self-hosted)** | ₹0 | Full platform, BYO infrastructure, community support |
| **Pro (managed)** | $9-15/mo | Hosted instance, auto-sync, managed MCP server, ChatGPT bundles auto-updated |
| **Teams** | $25/user/mo | Multi-user, shared modules, team dashboards |
| **Enterprise** | Custom | Single-tenant, SLA, custom modules, on-prem |

**Why this works:**
- Free tier = growth engine (devs self-host, build reputation)
- Pro tier captures convenience premium
- Usage-based add-ons: per query for vector search, per module for premium content
- Reverse trial: 14 days full Pro access, then downgrade (better conversion than permanent free)

---

### D14. Distribution Channels

#### Channel Ranking for LinkRight

| Channel | ROI | Effort | Discovery | When |
|---------|-----|--------|-----------|------|
| **1. MCP Registries** (Smithery, mcp.run) | High | Low | Growing fast, low competition | Now |
| **2. Direct SaaS + SEO** | High | Medium | Controllable, long-term | Phase 2 |
| **3. VS Code Extension Marketplace** | Medium | Medium | Large audience | Phase 2 |
| **4. Cloud Marketplaces** (Azure, AWS) | High | High | Enterprise discovery | Phase 3 |
| **5. GPT Store** | Low | Low | Oversaturated, ~$0.03/conversation | Low priority |

#### MCP Registry Details

| Registry | Notes |
|----------|-------|
| **Smithery.ai** | Leading registry, discovery + install + management |
| **mcp.run** | ChatGPT Desktop gateway to MCP ecosystem |
| **registry.modelcontextprotocol.io** | Official Anthropic/protocol registry |
| **MCPMarket.com** | 54+ MCPs for ChatGPT specifically |
| **LobeHub MCP Marketplace** | Growing directory |

17+ registries exist — ecosystem is fragmented but growing fast.

#### GPT Store Reality Check

- 3M+ GPTs created, only ~159K public/active
- Average revenue: ~$0.03 per conversation
- Need 33K+ quality conversations/mo for $1K/mo
- Most creators hit $100-500/mo ceiling
- Real money is B2B consulting ($5K-$20K setup fees)
- **Verdict:** Not a viable primary distribution channel

#### Recommended Distribution Strategy

**Phase 1 (now):** Personal use — no distribution needed
**Phase 2 (beta):** Publish MCP server to Smithery + mcp.run. Free, immediate developer audience.
**Phase 3 (launch):** Direct SaaS website + VS Code extension + content marketing
**Phase 4 (scale):** Cloud marketplaces for enterprise discovery

---

## Key Uncertainties

Items marked [NEEDS VERIFICATION]:
1. Whether GPT Actions are fully deprecated or just deprecated in GPT Builder (Assistants API function calling is the replacement)
2. Exact knowledge file size where retrieval quality degrades (estimated ~200KB but no hard benchmark)
3. Assistants API free tier availability for function calling
4. TOON parsing reliability across different ChatGPT model versions
5. Streamable HTTP support status in Cursor (likely in progress)

---

## Deep Research Prompt — Distribution Layer

```
You are a senior platform architect researching distribution strategies for LinkRight,
a modular AI platform. The system is personal-first (single user), ₹0/month budget,
running on self-hosted infrastructure (MongoDB 8.2 Community, Dolt, Gemini API).

LOCKED CONTEXT:
- 7 modules: Flex, Sync, Squick, LRB, TEA, CIS, Core
- Single MCP server (port 8766) exposing: beads_list, beads_update, vector_search,
  module_context, lr_sync_status
- ChatGPT custom model (Flex SMA) already working with HTML knowledge files
- Web bundle builder converts MD/YAML/CSV → HTML via Pandoc pipeline
- TOON format used for state summaries (40-60% token savings vs JSON)
- MCP transport: stdio primary, Streamable HTTP for remote

RESEARCH DEEPLY:

1. KNOWLEDGE FILE OPTIMIZATION
   - Benchmark HTML vs structured JSON vs TOON for ChatGPT retrieval accuracy
   - Test: upload same content in HTML, JSON, TOON formats → measure recall on 50 questions
   - Measure: chunk boundary alignment with heading hierarchy
   - Test: does file ordering in the GPT builder affect retrieval priority?
   - Measure: at what file size does retrieval quality degrade? (test 10KB, 50KB, 200KB, 500KB)

2. ASSISTANTS API MIGRATION PATH
   - Cost analysis: Assistants API pricing for function calling + file search
   - Can Assistants API replace custom GPTs entirely for LinkRight's use case?
   - Latency comparison: knowledge file retrieval vs function calling to MCP server
   - Multi-turn state management: how does Assistants API handle session state?
   - Vector store integration: can Assistants API use external vector stores (MongoDB)?

3. MCP ECOSYSTEM POSITIONING
   - Analyze top 50 MCP servers on Smithery by category, downloads, ratings
   - What categories are underserved? Where does "AI workflow orchestration" fit?
   - Competitive analysis: existing task management MCP servers (Linear, Jira, etc.)
   - What makes an MCP server go viral? Case studies of top-downloaded servers
   - Registry SEO: how do Smithery/mcp.run rank servers? What metadata matters?

4. CROSS-PLATFORM STATE SYNC
   - Design a universal state format that works across: ChatGPT (knowledge files),
     MCP clients (tool responses), Slack (message formatting), Web UI (JSON API)
   - Test TOON parsing reliability: Claude Code, Cursor, VS Code Copilot, ChatGPT
   - Measure token overhead of state summary at different granularities:
     - Minimal (blockers + active only): estimated ~500 tokens
     - Standard (full sprint): estimated ~2000 tokens
     - Comprehensive (sprint + history + decisions): estimated ~5000 tokens
   - Design adaptive loading: client declares token budget, server adjusts detail level

5. MONETIZATION EXPERIMENTS
   - A/B test pricing page designs for developer tools (open-source + managed tier)
   - Survey 50 developers: would they pay for a managed AI workflow platform?
   - Test: self-serve signup flow vs "book a demo" for different tiers
   - Analyze: which LinkRight modules have highest standalone value for SaaS?
   - Model: unit economics at 10, 100, 1000 users (infra cost, support cost, margin)

OUTPUT FORMAT:
- Detailed findings with data and citations
- Actionable recommendations ranked by impact/effort
- Architecture diagrams for state sync and distribution flow
- Decision matrix for each choice point
- Implementation timeline estimates
```

---

*Research compiled 2026-03-16. Phase 4 Distribution Layer — ready for decision lock.*
