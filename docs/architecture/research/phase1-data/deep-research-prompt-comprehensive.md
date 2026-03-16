# Deep Research Prompt — LinkRight Core Architecture (All Sections Combined)

## Context for the AI Researcher

I am building **LinkRight**, a modular AI platform that solves two universal problems every AI agent faces:

1. **Limited Context** — AI agents cannot read an entire codebase, knowledge base, or project. They need the RIGHT context pulled intelligently from hundreds of files (markdown, YAML, CSV, code) stored in git repositories.

2. **No Persistent Memory** — AI agents forget everything between sessions. They need a structured, persistent task/state tracker that survives across sessions and works across multiple AI clients (Claude Code, Cursor, ChatGPT, Codex, Windsurf).

The platform is **module-agnostic** — the core solves these two problems, and domain-specific modules (software development, content creation, career management, life documentation, workflow automation) plug into that same core. It starts as a single-user tool, scales to a SaaS product serving thousands of users, each running multiple modules simultaneously.

**AI clients we must support:**
- MCP-compatible IDEs: Claude Code, Cursor, Windsurf, Codex
- ChatGPT custom models via Actions (webhooks)
- Future: standalone web/mobile SaaS app

**Content types being indexed:**
- Agent definition files (markdown with YAML frontmatter)
- Workflow definitions (YAML)
- Configuration files (YAML, JSON)
- Knowledge base documents (markdown, CSV)
- Code files (JS, Python, etc.)
- Mixed-language content (English + Romanized Hindi/Hinglish)

**Scale trajectory:**
- NOW: 1 user, 6 modules, ~500 files, ~2-3MB text
- NEAR-TERM: 1 user, 20+ modules (via module builder)
- PRODUCT LAUNCH: Thousands of users, each with multiple modules
- LONG-TERM: Full SaaS with team collaboration

---

## Research Questions

### SECTION A: Vector Database Selection for a Multi-Module AI Platform

I need to select a vector database that works as the intelligent context layer. The database must:
- Handle per-module namespace isolation (each module's content is separate)
- Support cross-module queries when needed (e.g., one module querying another's knowledge)
- Work both locally (development) and in cloud (production SaaS)
- Support metadata filtering (filter by module, content_type, file_path, tags)
- Scale from 500 files to millions of documents across thousands of tenants
- Be cost-effective for a bootstrapped solo founder

**Specific questions:**

1. **MongoDB Atlas Vector Search vs Qdrant vs pgvector vs ChromaDB vs Weaviate vs Milvus** — As of March 2026, which is the best fit for a multi-module, multi-tenant AI platform? I need a comparison that weighs: (a) multi-tenancy/namespace support, (b) hybrid search (vector + keyword), (c) local development + cloud production parity, (d) cost at 1K/10K/100K users, (e) ecosystem maturity (LlamaIndex/LangChain integrations), (f) metadata filtering performance. Please provide specific benchmark numbers (QPS, recall@10, latency) from independent sources, not vendor marketing.

2. **Hybrid cloud + local architecture** — For a SaaS that also needs local development and potentially on-premise deployment for enterprise customers, what is the recommended architecture? Can I use MongoDB Atlas in cloud + MongoDB Community 8.2 locally with the same codebase? Or is Qdrant Hybrid Cloud a better option? How does data sync work between environments?

3. **Vector quantization in practice** — For a platform indexing structured documents (not images), what is the real-world impact of scalar quantization (int8) vs binary quantization on retrieval accuracy? At what scale does quantization become necessary? Are there benchmarks specifically for text document retrieval (not image embeddings)?

4. **Cost modeling** — For a SaaS with 10,000 users, each with ~1000 documents, using 1536-dimensional vectors: what is the estimated monthly infrastructure cost on (a) MongoDB Atlas, (b) Qdrant Cloud, (c) Self-hosted Qdrant on AWS, (d) Pinecone Serverless? Include storage, compute, and query costs.

5. **Turbopuffer** — This is used by Cursor, Notion, and Linear for their AI features. What is its architecture, pricing model, multi-tenancy approach, and how does it compare to Qdrant/MongoDB for our use case? Is it self-hostable?

### SECTION B: Chunking and Embedding Strategy for Structured Documents

The content being indexed is NOT generic web text. It is highly structured: YAML configs, markdown with YAML frontmatter, CSV files, workflow definitions, agent instructions. Standard chunking approaches may not be optimal.

**Specific questions:**

6. **Structured document chunking (2026 best practices)** — What are the current best practices for chunking YAML files, markdown with YAML frontmatter, and CSV files for vector search? Are there specialized parsers beyond LlamaIndex's MarkdownNodeParser? Has anyone built production-ready "schema-aware" chunkers that understand document structure? What about "agentic chunking" where an LLM decides the boundaries?

7. **Embedding models for mixed-language structured content** — My content is primarily English technical documentation but user queries may include Romanized Hindi (Hinglish). Which embedding models (as of March 2026) handle: (a) technical/structured content well, (b) mixed-language queries, (c) short queries against long documents? Specifically: how do Jina-embeddings-v5, Voyage-4, Cohere embed-v4, and OpenAI text-embedding-3-small compare for this use case? Any benchmarks on retrieval quality for structured documents specifically?

8. **Matryoshka embeddings in practice** — For a SaaS that needs to balance cost and quality, how effective is the Matryoshka approach (using smaller dimensions for initial retrieval, full dimensions for reranking)? What dimensions work best for 1536-dim models? Any production case studies?

9. **Embedding model lock-in risk** — If I embed all documents with Model A and later want to switch to Model B (better quality or cheaper), what is the migration cost? Are there any abstraction layers or strategies to minimize re-embedding costs? How does Matryoshka help here?

### SECTION C: File-to-Vector Synchronization for Git-Based Content

All content lives in git repositories. The vector database is a derived index, not the source of truth. Changes happen via git commits.

**Specific questions:**

10. **Git-native vector sync (2026 state of art)** — Are there any production-ready tools that watch a git repository and automatically sync changed files to a vector database? Specifically: tools that use git diff to detect changes, support incremental re-embedding, and handle file deletions. Chroma Sync claims GitHub integration — how mature is it? Are there alternatives?

11. **LlamaIndex vs LangChain ingestion pipelines (March 2026)** — For a system that needs: (a) incremental updates (only re-embed changed files), (b) deletion tracking (remove vectors when files are deleted), (c) metadata extraction from YAML frontmatter, (d) support for multiple vector stores — which framework is more production-ready? Specific version numbers and API stability please.

12. **Webhook-triggered re-indexing for SaaS** — When this becomes a SaaS product, users will push to their own repos. What is the recommended architecture for triggering re-indexing on git push? GitHub webhooks → queue → worker → embed → upsert? Any open-source examples of this pattern at scale?

### SECTION D: Persistent Task/State Management Across AI Sessions

The second core problem: AI agents lose state between sessions. We use Dolt (git-for-data, MySQL-compatible) for task tracking. The task database needs to be accessible from multiple AI clients.

**Specific questions:**

13. **Dolt 2.0 production readiness** — As of March 2026, is Dolt 2.0 production-ready for a SaaS backend? What are the remaining gaps vs MySQL/PostgreSQL? How does DoltgreSQL (Postgres-compatible) compare? Any companies using Dolt in production for customer-facing SaaS?

14. **MCP as the universal access layer** — The Model Context Protocol now has 1000+ servers and is supported by Claude, Cursor, Windsurf, and ChatGPT (via Connectors). For a platform that needs to expose task data + vector search to ANY AI client: is one MCP server sufficient, or should there be separate servers for tasks vs. vectors? What are the best practices for building a database-backed MCP server in 2026? TypeScript vs Python SDK maturity?

15. **ChatGPT stateless problem** — ChatGPT cannot maintain state between sessions natively. For a task management system: what is the most effective pattern? (a) Load full state summary at session start via Action, (b) Use ChatGPT's persistent memory feature, (c) Custom state injection via system prompt, (d) Real-time webhook sync. What are the token costs and latency tradeoffs of each approach?

16. **TOON (Token-Oriented Object Notation)** — Research claims 40-60% token savings over JSON with higher accuracy. Is this format actually being adopted in production? Any libraries/parsers available? How does it compare to just using YAML for task serialization?

17. **Branch-per-agent in Dolt** — For multi-agent workflows where agents work in parallel: is the branch-per-agent pattern practical? What about merge conflicts when two agents modify the same task? How does this compare to simple optimistic locking with retry?

### SECTION E: Cross-Cutting Architecture Questions

18. **Unified vs Split architecture** — Should the vector database and the task database be the same system (e.g., MongoDB for both documents + vectors) or separate (MongoDB for vectors + Dolt for tasks)? What are the real-world tradeoffs for a SaaS product? Any case studies of AI platforms that went unified vs split and what happened?

19. **Event-driven cross-module communication** — When Module A produces output that Module B needs (e.g., life documentation → content creation pipeline), what is the simplest reliable pattern? Event bus (Redis Streams, NATS), shared vector namespace, n8n workflows, or simple webhook chains? What scales for solo dev AND for SaaS?

20. **AI platform architecture patterns (2026)** — Are there any open-source AI platforms or frameworks that solve a similar problem (multi-module, multi-client, vector context + persistent state)? Specifically looking at: LangGraph Platform, CrewAI Enterprise, Composio, Semantic Kernel, or any others. How do they handle the context + memory problems? What can we learn from their architecture?

21. **Security for multi-tenant vector stores** — Research shows 92% text recovery from embeddings is possible. For a SaaS storing user documents as vectors: what are the current best practices for tenant isolation, embedding encryption, and data segregation? Any regulatory considerations (GDPR, SOC2)?

---

## Output Format Requested

For each question, please provide:
1. **Direct answer** with specific recommendations
2. **Version numbers and dates** (as of March 2026)
3. **Cost estimates** where relevant
4. **Links to official documentation, benchmarks, or case studies**
5. **Confidence level** — mark anything uncertain as [LOW CONFIDENCE] or [UNVERIFIED]

Prioritize independent benchmarks and production case studies over vendor marketing materials. If two sources conflict, note both.
