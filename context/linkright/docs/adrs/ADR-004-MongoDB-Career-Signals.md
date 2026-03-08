# ADR-004: MongoDB for Career Signals

**Status:** Accepted
**Date:** 2026-03-09

---

## Decision

Use MongoDB for structured storage of:
- Career signals (skills, metrics, projects)
- Job description requirements (parsed and extracted)
- Workflow execution history
- Optimization results

---

## Why Not Others

| Alternative | Problem |
|---|---|
| PostgreSQL | Over-engineered, relational overhead |
| File-based YAML | No indexes, slow queries for 100K signals |
| DynamoDB | SaaS, vendor lock-in |

---

## Rationale

- **Document-oriented:** Signals have varying structure (skill 1 metric, project has many)
- **Indexing:** Fast queries on signal_type, user_id, created_ts
- **Schemaless:** Easy to add new signal types later

---

## Consequences

+ ✅ Flexible data model
+ ✅ Fast structured queries
+ ✅ Scales to millions of signals

- ⚠️ Requires Mongo setup + backups
