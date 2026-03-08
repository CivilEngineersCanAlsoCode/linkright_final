# ADR-006: Atomic Steps (One Cognitive Operation Per Step)

**Status:** Accepted
**Date:** 2026-03-09

---

## Decision

**Every step file = one and only one cognitive operation.**

Not: "Parse JD AND extract requirements AND score" (3 ops)
But: "Extract requirements from JD" (1 op)

---

## Rationale

- ✅ **Testability:** One operation = one unit test
- ✅ **Resumability:** Can resume at step granularity
- ✅ **Observability:** Clear progress (step 06/23)
- ✅ **Debugging:** If step fails, know exactly where

---

## Rule

If you write "AND" or "THEN" → split into multiple steps

---

## Consequences

+ ✅ More steps (30 → 60), but clearer progress
+ ✅ Easier debugging and resumption

- ⚠️ More file management (more step files to maintain)
