# ADR-009: Beads-Aware Workflows (Resumption via Task Tracking)

**Status:** Accepted
**Date:** 2026-03-09

---

## Decision

Workflows check Beads for resumption, not just file-based state.

**step-01b:** Query `bd list --status=in_progress`
- If found → resume from last checkpoint
- If not → start fresh

---

## Rationale

- ✅ **Beads as source-of-truth:** Task state lives in Git
- ✅ **Multi-day workflows:** Can interrupt day 1, resume day 2
- ✅ **Audit trail:** Every resume is a Git commit

---

## Example

```
2026-03-09 10:00 → User starts jd-optimize
  → step-01b checks Beads (none found)
  → Create bd issue "jd-optimize session"
  → Begin phase C

2026-03-09 14:30 → Workflow crashes at step-09 (out of token budget)
  → Last checkpoint saved in MongoDB
  → Beads issue still "in_progress"

2026-03-10 09:00 → User runs jd-optimize again
  → step-01b checks Beads
  → Finds yesterday's issue "in_progress"
  → Loads checkpoint from MongoDB
  → Resumes at step-09 + 1
```

---

## Consequences

+ ✅ Multi-day workflows viable
+ ✅ No data loss
+ ✅ Clear progress tracking

- ⚠️ Requires Beads integration in every workflow (step-01b)
