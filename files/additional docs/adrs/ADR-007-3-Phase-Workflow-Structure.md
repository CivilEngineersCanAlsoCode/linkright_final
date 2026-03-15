# ADR-007: 3-Phase Workflow Structure (Create/Edit/Validate)

**Status:** Accepted
**Date:** 2026-03-09

---

## Decision

Every Linkright workflow has three phases:
- **Phase C (Create):** Build output from scratch
- **Phase E (Edit):** Modify existing output
- **Phase V (Validate):** Verify output meets criteria

---

## Rationale

- ✅ Users can "create new resume" (phase C) or "edit existing" (phase E)
- ✅ Quality gates (phase V) catch all problems
- ✅ Clear workflow semantics

---

## Example: jd-optimize

| Phase | Workflow |
|---|---|
| C | Load JD → extract requirements → score user resume → optimize bullets → compile |
| E | Load past resume → identify improvement area → rewrite bullets → recompile |
| V | Load resume → validate keyword coverage → validate ownership → generate report |

---

## Consequences

+ ✅ User choice: new or edit?
+ ✅ Quality gates built-in
+ ✅ Flexible (users mix phases as needed)

- ⚠️ Requires thinking in terms of 3 phases
