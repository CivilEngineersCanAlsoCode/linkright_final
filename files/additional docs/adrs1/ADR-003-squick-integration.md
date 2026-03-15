# ADR-003: Squick Module Integration Strategy

**Status:** Accepted

**Date:** 2026-03-08

---

## Context

Squick module (Special Query Intelligence Calibration Kit) comprises 5 workflows implementing multi-phase optimization:
1. 1-analysis: Signal analysis and gap identification
2. 2-plan: Optimization strategy generation
3. 3-solutioning: Solution design per gap
4. 4-implementation: Narrative/content implementation
5. enterprise-ship: Enterprise-scale deployment

Squick was designed as autonomous optimization layer operating on top of Context Z core phases (A-M). Integration point: after Phase G (Gap Analysis).

---

## Decision

Squick integrates as optimization/enrichment layer post-Phase G, running in parallel with Phases H-J. Squick outputs inform positioning adjustments in Phase J (Content Writing) refinement.

Squick execution is optional but recommended for maximum positioning impact.

---

## Rationale

1. **Modularity**: Squick is add-on layer, not core BMAD path
2. **Timing**: Gap Analysis (Phase G) completion triggers Squick opportunity
3. **User Choice**: Execution optional; users can proceed straight H→J
4. **Optimization Impact**: Squick's multi-phase optimization reduces narrative risk
5. **Enterprise Readiness**: Enterprise-scale deployment (Squick-5) supports batch job applications

---

## Consequences

### Positive
- Advanced optimization available for users seeking competitive edge
- Enterprise workflow supports bulk positioning campaigns
- Parallel execution doesn't delay core phase timeline
- Optional nature reduces commitment

### Negative
- Additional complexity if user chooses Squick path
- Squick output must integrate seamlessly with Phase H-J
- Potential for user confusion (core path vs. Squick-enhanced path)
- Requires additional testing for integration scenarios

**Mitigation**: Clear documentation of Squick trigger point and integration flow.

---

## Alternatives Considered

1. **Make Squick mandatory**: Would increase timeline, complicate core path
2. **Embed Squick into Phase G**: Would bloat gap analysis phase
3. **Defer Squick entirely to Release 5**: Loses competitive positioning advantage

---

## Related ADRs

- ADR-002: Agent count (Squick has 5 agents)
- (Future) ADR-NNN: Enterprise deployment scaling patterns

---

## References

- Squick Module: _lr/squick/workflows/
- Gap Analysis Phase G: steps-c/step-50-gap-category.md
- Phase J Content Writing: steps-c/step-53-content-draft.md

