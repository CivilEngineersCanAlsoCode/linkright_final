# ADR-001: Context Z Phase E2 (Signal Retrieval) Deferral Rationale

**Status:** Accepted

**Date:** 2026-03-08

---

## Context

The Context Z model defines 13 phases (A-M) for complete career signal processing. Phases A-C (Session Init, JD Ingestion, Company Intel) were implemented in Release 3. Phases D-M (Persona Scoring through Final Scoring) were deferred to Release 4.

Phase E (Signal Retrieval) specifically encompasses signal extraction, ranking, and validation—critical for accurate positioning. However, Release 4 capacity constraints required selective phase prioritization.

Decision was made to defer Phase E.2 (advanced signal enrichment) to Release 5 while implementing Phase E.1 (core signal retrieval) in Release 4.

---

## Decision

Phase E (Signal Retrieval) will be implemented in Release 4 with core functionality (steps E.1-E.1.4) ready for agent execution. Advanced enrichment features (E.2) deferred to Release 5 planning.

---

## Rationale

1. **MVP Principle**: Core signal retrieval unblocks phases F-M; enrichment is polish, not blocker
2. **Timeline**: E.1 completion (4 weeks) + E.2 (2 weeks) fit Release 4 capacity
3. **User Value**: E.1 delivers complete signal set; E.2 adds richness, not essentiality
4. **Risk Mitigation**: Early E.1 completion allows validation, reduces Phase F-M risk
5. **BMAD Alignment**: Incremental delivery, phase-based decomposition respected

---

## Consequences

### Positive
- Release 4 Phase E complete and testable
- Phase F-M unblocked for implementation
- User gets actionable signals without delay
- Signal enrichment (E.2) can be prioritized in Release 5 based on feedback

### Negative
- Signal evidence richness limited (SCAR format deferred to E.2)
- Advanced signal scoring strategies delayed
- Minor re-work if enrichment requirements change

**Mitigation**: Design Phase E.1 with extensibility for E.2 integration.

---

## Alternatives Considered

1. **Skip Phase E entirely**: Too risky; E is foundational for phases F-M
2. **Implement E.2 first**: Backwards; E.1 must precede E.2
3. **Compress both phases into Release 4**: Would exceed capacity; quality would suffer

---

## Related ADRs

- (Future) ADR-NNN: Phase E.2 enrichment implementation plan
- ADR-003: Phases D-M step file implementation strategy

---

## References

- Context Z Phase Model: context/linkright/releases/Release_4.md
- Signal Retrieval Steps: context/linkright/_lr/sync/workflows/jd-optimize/steps-c/step-44-47.md
- Release 4 Plan: Release_4.md (Phases D-M timeline)

