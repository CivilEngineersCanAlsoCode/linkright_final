# E2 (Slides Integration) - Complete 5-Level Beads Plan

**Date:** 2026-03-08  
**Epic ID:** sync-ajq  
**Status:** PLANNED - Ready for execution  
**Total Issues:** 31 (1 Epic, 4 Features, 13 Tasks, 12 Subtasks, 3 Bugs)  
**Dependencies Wired:** 15 edges  
**Estimated Effort:** 60-80 hours  

---

## 5-Level Hierarchy Summary

### Level E: Epic (1)
- sync-ajq: Release 3 E2 - Slides Integration (Portfolio View 2)

### Level F: Features (4)
- sync-ajq.1 (P0): Contract Definition & Prototype
- sync-ajq.2 (P0): Slides Content Generation Pipeline
- sync-ajq.3 (P1): Portfolio Integration & Deployment
- sync-ajq.4 (P1): Abyssal Depth Theming & Styling

### Level T: Tasks/User Stories (13)
- **F1:** 3 tasks (schema, prototype, API docs)
- **F2:** 4 tasks (extraction, ranking, generation, validation)
- **F3:** 3 tasks (workflow steps, bundling, deployment)
- **F4:** 3 tasks (colors, typography, responsive layouts)

### Level S: Subtasks (12)
- Research & design (3)
- Implementation (6)
- Testing & validation (3)

### Level B: Bugs (3)
- **P0 BLOCKER:** Frontend-Slides skill missing
- **P1:** Signal library diversity concern
- **P1:** Portfolio-Deploy extensibility check

---

## Critical Path

```
Blockers → F1 (Contract) → F2 (Pipeline) → F3 (Integration) + F4 (Theming)
```

**Effort:** 60-80 hours  
**Timeline:** 2-3 weeks (8h/day)

---

## Next Steps

1. Resolve P0 blocker (frontend-slides skill)
2. Execute Feature 1 (schema + prototype)
3. Execute Feature 2 (pipeline)
4. Execute Feature 3 (integration)
5. Execute Feature 4 (theming) in parallel

**View full hierarchy:** `bd list --parent=sync-ajq --limit=0`
