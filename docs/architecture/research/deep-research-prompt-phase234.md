# Deep Research Prompt — Phase 2 (ACCESS) + Phase 3 (COORDINATION) + Phase 4 (DISTRIBUTION)

## Context for the AI Researcher

I am building **LinkRight**, a modular AI platform that solves two universal problems for AI agents: (1) limited context — agents need the RIGHT context pulled intelligently from hundreds of files, and (2) no persistent memory — agents forget everything between sessions. The platform is module-agnostic (software dev, content creation, career management, etc.), starts as a personal tool, scales to a SaaS product.

**LOCKED architecture decisions (Phase 1 DATA):**
- Vector DB: MongoDB 8.2 Community Edition (self-hosted, mongod + mongot running, $vectorSearch available)
- Embedding: Google Gemini API (free tier, text-embedding-005, 3072 dimensions)
- Task DB: Dolt (git-for-data, MySQL-compatible, self-hosted)
- Architecture: MongoDB (vectors + documents) + Dolt (tasks) + ONE MCP server
- Budget: ₹0 extra infrastructure cost. Everything free/self-hosted.
- Machine: AWS EC2, 2 vCPU, 7.6GB RAM, 30GB disk

**What already exists and is running:**
- MongoDB 8.2.5 with mongot (vector search engine) on port 27017/27027
- Dolt with 369 task issues in 6-level SAFe hierarchy
- n8n workflow automation (Satvik builds workflows manually)
- Agent-Mail MCP server on port 8765
- ChatGPT custom model for Flex (Social Media Agency) module — already working with web bundle knowledge files
- MCP configs for Cline, Codex, Windsurf

---

## Research Questions

### SECTION A: MCP Server Architecture (Phase 2 — ACCESS)

1. **MCP Protocol state of art (March 2026):** What is the current stable MCP specification version? What transport options are production-ready (stdio, SSE, Streamable HTTP)? Which AI clients support which transports — specifically Claude Code, Cursor, Windsurf, Codex, ChatGPT (via Connectors)? Is there a single transport that works across ALL major clients? What are the tool count limits per client (I've heard Cursor limits to 40 tools)?

2. **Building a database-backed MCP server:** Are there any open-source examples of MCP servers that connect to MongoDB or MySQL/Dolt for real-time queries? What SDK is recommended — TypeScript (@modelcontextprotocol/sdk) vs Python (mcp library)? Which is more mature and has better documentation as of March 2026? Any tutorials for building a custom MCP server with database queries?

3. **ChatGPT MCP Connectors:** How exactly does ChatGPT support MCP now? Can the SAME MCP server running on localhost serve both Claude Code (via stdio) AND ChatGPT (via HTTP)? What configuration is needed on the ChatGPT side? Is this in beta or GA? Any limitations compared to native ChatGPT Actions?

4. **MCP server deployment for personal use:** For a single user running everything on one EC2 instance — what is the simplest MCP server architecture? One process exposing stdio (for IDE clients) + HTTP (for ChatGPT)? Or two processes? How to handle port management alongside existing services (MongoDB 27017, n8n, Agent-Mail 8765)?

### SECTION B: Context Enforcement & RAG Patterns (Phase 2 — ACCESS)

5. **How do production AI coding tools handle context (March 2026)?** Specifically: How does Cursor's codebase indexing work (they use Turbopuffer — what's the retrieval pipeline)? How does GitHub Copilot Workspace handle context? How does Devin/Codex sandbox file access? Do any of these FORCE retrieval (prevent raw file reads) or just make retrieval more convenient?

6. **RAG-first MCP tool design:** If the MCP server is the ONLY interface AI clients use to access project data, we can design tools that naturally enforce vector search over raw file reads. Are there any design patterns or papers on "retrieval-enforced" tool APIs? How to design MCP tools so that AI agents prefer `vector_search(query)` over `read_file(path)`?

### SECTION C: Cross-Module Communication (Phase 3 — COORDINATION)

7. **MongoDB Change Streams for event-driven architecture:** Does MongoDB Community 8.2 support Change Streams (or only Atlas/replica sets)? Our MongoDB IS running as a replica set (confirmed from process flags). Can we use Change Streams to trigger cross-module actions (e.g., new document in LifeOS triggers Flex content generation)? What is the resource overhead on a 7.6GB RAM machine?

8. **n8n as cross-module orchestrator:** n8n is already running. Can it efficiently orchestrate cross-module flows via MongoDB triggers or webhooks? What are n8n's limitations for real-time event processing vs batch? Any production examples of n8n orchestrating AI agent workflows?

9. **Simplest cross-module pattern for solo dev:** For ONE user with 6 modules — what is the minimum viable cross-module communication? Is a shared MongoDB collection with polling sufficient? Or do we need Change Streams/webhooks/event bus? What adds the least complexity while enabling the LifeOS→Flex→Sync pipeline?

### SECTION D: ChatGPT Custom Model & Web Bundles (Phase 4 — DISTRIBUTION)

10. **ChatGPT knowledge file performance (March 2026):** Has ChatGPT improved at recalling from uploaded knowledge files? What is the current recommended format — HTML or Markdown? Any benchmarks on recall accuracy by file count (5 files vs 10 vs 20)? Does the HtmlRAG paper's finding (HTML > Markdown) still hold?

11. **Web bundle automation tools:** Are there any tools or frameworks for automatically compiling markdown/YAML into ChatGPT-ready knowledge packages? Or is custom scripting (Pandoc pipeline) still the only option?

12. **ChatGPT Assistants API vs Custom GPTs (March 2026):** For programmatic control over a ChatGPT-based product — should we use the Assistants API (more control, code-driven) or Custom GPTs (easier, UI-driven)? Cost comparison. Can Assistants API access knowledge files AND call Actions? What are the current rate limits and pricing?

### SECTION E: SaaS Distribution Strategy (Phase 4 — DISTRIBUTION)

13. **MCP server registries and marketplaces (March 2026):** What registries exist for publishing MCP servers (Smithery, mcp.run, etc.)? How do developers discover and install MCP servers? Is this a viable distribution channel for LinkRight? Any success stories of MCP-based products gaining users through these registries?

14. **AI tool pricing models (March 2026):** How do similar AI productivity tools price their products? Specifically: Cursor ($20/mo), Windsurf pricing, CrewAI Enterprise, LangGraph Cloud, Composio, any AI content tools. What pricing model fits a modular AI platform (per-module, per-user, usage-based, freemium)?

15. **Open-core AI platform examples:** Are there any open-source AI platforms that have successfully monetized with an open-core model (free OSS + paid cloud/enterprise)? What works, what doesn't? Lessons learned.

---

## Output Format

For each question, provide:
1. **Direct answer** with specific recommendations for our setup (MongoDB + Dolt + MCP + ₹0 budget)
2. **Version numbers and dates** (as of March 2026)
3. **Links to documentation, repos, or case studies**
4. **Confidence level** — mark uncertain as [LOW CONFIDENCE]

Focus on what's practical for a solo dev with zero extra budget, not enterprise solutions.
