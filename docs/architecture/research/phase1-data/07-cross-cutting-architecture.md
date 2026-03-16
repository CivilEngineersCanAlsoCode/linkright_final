# 07 — Cross-Cutting Architecture Concerns

> **Phase 1 Data Layer** | Cross-cutting findings from final external research
> **Date:** 2026-03-16
> **Source:** Comprehensive external research answers (Q18–Q21), verified March 2026
> **Scope:** Unified vs split DB, cross-module communication, platform examples, multi-tenant security

---

## Table of Contents

1. [Unified vs Split Database](#1-unified-vs-split-database)
2. [Cross-Module Communication](#2-cross-module-communication)
3. [AI Platform Architecture Examples](#3-ai-platform-architecture-examples)
4. [Multi-Tenant Vector Store Security](#4-multi-tenant-vector-store-security)
5. [Recommendations for LinkRight](#5-recommendations-for-linkright)

---

## 1. Unified vs Split Database

### Q18: Should Docs + State Live in One DB or Separate?

**Unified approach (e.g., MongoDB for both vectors and tasks):**
- Simplifies operations — one system to manage
- Allows vector search with document filters in a single query
- MongoDB Atlas can store task records and vector indexes together
- **Downsides:** More expensive, less specialized — single cluster handles diverse workloads, may not get top vector performance

**Split approach (dedicated vector DB + task DB):**
- Each tool used at its strength: Dolt/MySQL for ACID transactions, Qdrant/Pinecone for high-speed kNN
- Better scalability — scale each system independently
- **Downsides:** Added complexity (two systems to manage), syncing logic needed between them

### Verdict: Split Wins for SaaS

Most large RAG systems (and frameworks like Semantic Kernel) separate state from embeddings. For a SaaS product:

| Factor | Unified | Split |
|---|---|---|
| **Operational simplicity** | Better | More complex |
| **Performance optimization** | Compromised | Each system optimized |
| **Scalability** | Limited by slowest workload | Scale independently |
| **Cost efficiency** | Often over-provisioned | Pay for what each needs |
| **Maintainability** | Simpler at small scale | Better at scale |

**For LinkRight:** Split architecture is recommended — Dolt for task/state management (Beads), dedicated vector DB for embeddings. This aligns with our existing architecture decisions.

---

## 2. Cross-Module Communication

### Q19: How Should Modules A → B Communicate?

**Options evaluated:**

| Pattern | Complexity | Scalability | Coupling | Best For |
|---|---|---|---|---|
| **Direct function calls** | Low | Low | High | Single-process, dev/prototype |
| **Webhooks** | Low | Medium | Medium | One-off tasks, simple integrations |
| **Event bus (Redis Streams/NATS/Kafka)** | Medium | **High** | **Low** | **Production SaaS** |
| **Shared vector namespace polling** | Low | Low | High | Not recommended — B must poll/query |
| **n8n/Temporal orchestration** | High | High | Low | Complex multi-step workflows with retries |

### Recommended: Event Bus

For linking LinkRight modules (e.g., Sync publishes `task_created`, Flex subscribes to act on it):

- **Redis Streams or Pub/Sub** — scales well, lightweight, tenant-aware routing possible
- **NATS** — extremely lightweight, good for microservices
- **Kafka** — enterprise-grade, overkill for current scale but future-proof
- **AWS SNS/SQS or Azure Service Bus** — cloud-native options

**Key principles:**
1. Module A publishes an event (e.g., `signal_extracted`, `task_completed`)
2. Module B subscribes and acts on relevant events
3. Decouples modules — A doesn't need to know about B
4. Events carry tenant context for multi-tenant isolation

**For early-stage LinkRight:** Webhook chains or in-process function calls are acceptable. Migrate to event bus (Redis Streams) when building production SaaS with multiple deployed modules.

---

## 3. AI Platform Architecture Examples

### Q20: How Do Existing Platforms Handle Context & Memory?

#### LangGraph Platform
- **Architecture:** Graph-based orchestration — each "node" is a module, edges carry context
- **State management:** Explicit state stored in graph nodes/edges for cyclical workflows
- **Memory:** Proprietary, stored in graph structure
- **Key pattern:** Nodes can read/write to shared state, enabling complex multi-step agent workflows

#### CrewAI (Enterprise)
- **Architecture:** Commercial multi-agent orchestrator with role-based teams
- **State management:** Central store (likely vector or DB) — details closed-source
- **Key pattern:** Agents assigned roles, collaborate with defined communication protocols
- **Relevance:** Role-based agent assignment maps to LinkRight's module-agent structure

#### Composio
- **Architecture:** Low-code platform integrating LLMs, knowledge graphs, and workflows
- **State management:** Central vector store for content, policy-based agent orchestration
- **Not open-source** — used internally by companies

#### Semantic Kernel (Microsoft)
- **Architecture:** Open-source SDK separating "skills" (modules) and "memory"
- **Memory store:** Vector DB or SQL for persisting chat history or facts
- **Key pattern:** Developer explicitly manages what to write/read from memory; injects relevant memory chunks into prompts (RAG)
- **Maturity:** v1.7 (Feb 2026) — most mature open-source option

### Common Patterns Across All Platforms

1. **External stores for persistence** — all use vector DBs for embeddings, SQL for state
2. **Orchestration layer** — control loop or event-driven flow feeds relevant info to LLMs
3. **No infinite context magic** — all rely on RAG or retrieval to manage context limits
4. **Decoupled modules from memory** — memory/state accessed via APIs, not hardcoded in agents

**Lesson for LinkRight:** Decouple modules from their memory stores. Use an orchestration layer (event bus or Aether orchestrator) to feed relevant context into each agent at runtime. Don't try to give agents permanent access to all state.

---

## 4. Multi-Tenant Vector Store Security

### Q21: Embeddings Can Leak Original Text

**Critical finding:** Embedding inversion attacks achieve **~92% recovery of 32-token text inputs** from embeddings alone. This means embeddings qualify as personal data under GDPR.

### Threat Model

| Threat | Severity | Mitigation |
|---|---|---|
| **Embedding inversion** | High — 92% text recovery | Per-tenant isolation, encrypted storage |
| **Cross-tenant data leakage** | High — filter bypass bug exposes data | One tenant per index, defense-in-depth filtering |
| **Unauthorized access** | High | Row-level security, API authentication |
| **Data residency violation** | Medium — GDPR | Tenant-specific KMS keys, regional deployment |
| **Stale data exposure** | Medium | Right-to-deletion includes embeddings |

### Security Best Practices

1. **One tenant per index** — no shared vectors across tenants. This is the strongest isolation model
2. **Strict query filtering** — every query MUST include `tenant_id` filter at both application AND database level
3. **Encrypt at rest** — use tenant-specific KMS keys
4. **Encrypt in transit** — TLS for all vector DB connections
5. **Pre-process sensitive info** — redact or tokenize PII before embedding
6. **Access control** — row-level security, audit all access
7. **Right to deletion** — must include embeddings, not just source documents; rebuild affected indexes

### GDPR Compliance Checklist

- [ ] Treat embeddings as sensitive personal data
- [ ] Implement data minimization — embed only what's needed
- [ ] Strict access control with per-tenant isolation
- [ ] Thorough logging and audit trail for all vector access
- [ ] Support data-deletion requests by re-building affected indexes
- [ ] Data residency requirements apply to vector stores, not just document stores
- [ ] Document lawful basis for processing career data embeddings

### Per-DB Security Features

| Database | Tenant Isolation | Encryption at Rest | Access Control |
|---|---|---|---|
| **MongoDB Atlas** | Pre-filter on `tenantId` or separate collections | AES-256, customer-managed keys available | Atlas RBAC, field-level encryption |
| **Qdrant** | Payload-based filtering or shard-per-tenant | Configurable | API key auth, optional ACL |
| **Weaviate** | Shard-per-tenant | Configurable | Built-in RBAC |
| **Pinecone** | Namespaces | Managed encryption | API key per index |
| **pgvector** | Postgres RLS on tenant_id | Postgres TDE or disk encryption | Full Postgres auth + RLS |

---

## 5. Recommendations for LinkRight

### Architecture Decisions

| Decision | Recommendation | Rationale |
|---|---|---|
| **Unified vs split DB** | **Split** — Dolt for tasks, vector DB for embeddings | Each optimized for its workload; scales independently |
| **Cross-module communication** | **Event bus** (Redis Streams) for production, **function calls** for now | Decouples modules; start simple, scale up |
| **Platform pattern** | Orchestrator + RAG (like Semantic Kernel) | Proven pattern — decouple agents from memory stores |
| **Security model** | Per-tenant isolation + encryption + filtering | Career data is PII — treat embeddings accordingly |

### Implementation Priority

1. **Now:** Direct function calls between modules, shared collection with metadata filtering
2. **Next (multi-user):** Add `tenant_id` to all vectors, implement per-tenant filtering, add Redis Streams for event bus
3. **Later (production SaaS):** Per-tenant indexes, KMS encryption, GDPR compliance tooling, shadow indexing for zero-downtime rebuilds

---

## Sources

- Firecrawl (2026) vector DB comparison
- Athenic (Sep 2025) independent benchmarks
- OWASP LLM Top 10 — LLM08 (Vector and Embedding Weaknesses)
- Morris et al. 2023 — Embedding inversion attacks
- Microsoft Semantic Kernel documentation (v1.7, Feb 2026)
- LangGraph Platform documentation
- CrewAI Enterprise documentation
- MongoDB Atlas security architecture documentation
- Qdrant multi-tenancy guide
