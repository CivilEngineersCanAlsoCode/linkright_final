# ADR-003: Agent Mail for Multi-Agent Coordination

**Status:** Accepted
**Date:** 2026-03-09
**Decision Maker:** Satvik Jain

---

## Context

Linkright workflows involve 29+ agents coordinating across phases. Agents need to:
- Send structured messages to other agents
- Request contact permissions before messaging
- Track message delivery and acknowledgment
- Coordinate on shared files (file reservations)

---

## Decision

**Use Agent MCP Mail (HTTP-based message broker) for:**
- Async agent-to-agent messaging
- Contact negotiation (request → approve/deny)
- File conflict detection (who has reservation?)
- Message persistence (Git-backed archive)

---

## Rationale

- **Purpose-built:** Designed for multi-agent coordination in agentic workflows
- **Git-backed:** All messages persisted to Git (audit trail)
- **Async:** Agents don't need to wait for responses (decoupled)
- **Contact protocol:** Prevents spam/unauthorized messaging

---

## Examples

```
Vulcan claims sync-qm-p0-2 (modify zero-byte files)
  → reserve: "context/linkright/_lr/core/config/**"
  → If Hephaestus also needs it: FILE-CONFLICT message
  → Hephaestus waits or takes different task
```

---

## Consequences

+ ✅ Structured agent coordination
+ ✅ Git audit trail
+ ✅ Async, non-blocking

- ⚠️ Requires Agent Mail server running (HTTP on port 8765)

---

## Related

- ADR-001: Beads (complements Beads for agent state)
