# ADR-008: JIT Loading (Just-In-Time, Not Preload)

**Status:** Accepted
**Date:** 2026-03-09

---

## Decision

Don't preload anything. Load only what the user requests.

Not: Preload all 29 agents at startup
But: Load agent when user selects "invite this agent"

---

## Rationale

- ✅ **Fast startup:** Agent loading takes ~2-5 seconds per agent
- ✅ **Low memory:** Don't keep 30 agents in memory if using 3
- ✅ **Scales:** Can add 100+ agents without slowdown

---

## Examples

| JIT | Wrong |
|---|---|
| User selects "jd-optimize" → load workflow | Preload all 17 workflows at startup |
| User invites "sync-linker" agent → load persona | Preload all 29 agents |
| User types "signal" command → suggest 10 related steps | Load all 2000+ steps |

---

## Consequences

+ ✅ Fast, responsive startup
+ ✅ Scales to 100+ workflows/agents

- ⚠️ Slight latency on first selection (loading from disk)
