# ADR-004: TEA Knowledge Base Initially Empty - Rationale

**Status:** Accepted

**Date:** 2026-03-08

---

## Context

TEA (Test Engineering & Assurance) module in Linkright includes 3 agents (tea-scout, tea-qa-engineer, tea-validator) responsible for quality validation workflows. BMAD-METHOD template specifies tea/testarch/knowledge/ directory with 12+ knowledge files covering:
- Test design patterns
- QA automation strategies
- Validation gates
- Performance testing
- Security testing
- Accessibility testing
- UAT approaches
- Test data management
- Regression suite design
- CI patterns
- Quality metrics
- Test reporting

Release 3 created TEA module structure but left knowledge base empty. Decision required: populate now (Release 4) or defer (Release 5).

---

## Decision

Defer TEA knowledge base population to Release 5. Release 4 focuses on Context Z phases D-M (core business logic); TEA knowledge is support infrastructure.

Empty knowledge base accepted as Technical Debt item: TEA-KB-EMPTY (tracked in Release_4.md gaps).

---

## Rationale

1. **Critical Path**: Context Z phases D-M are user-facing, business-critical
2. **TEA Utility Limited**: Without full Context Z implementation, QA focus narrow
3. **Knowledge Building**: TEA KB requires domain expertise; Release 4 focused on phase implementation
4. **Batch Priority**: Phase D-M implementation (40+ hours) > TEA KB population (25+ hours)
5. **Release Discipline**: Better to ship complete Phase D-M than partial TEA KB

---

## Consequences

### Positive
- Release 4 timeline preserved for Context Z phases
- TEA module structure ready for knowledge injection
- Allows time for domain expertise gathering in Release 4
- TEA agents can still run basic validation without KB

### Negative
- TEA agents lack rich knowledge for advanced QA
- Quality validation limited to rule-based checks
- Missing best practices documentation
- Users lack test design guidance

**Mitigation**: 
- Document TEA KB as Release 5 P1 task
- Designate TEA KB owner early in Release 5
- Create TEA KB template structure for rapid population

---

## Alternatives Considered

1. **Populate TEA KB in Release 4**: Would delay Phase D-M; lower user impact
2. **Populate subset (6 files) in Release 4**: Still delays phases; partial KB less useful
3. **Skip TEA module entirely**: Not viable; QA essential to BMAD

---

## Related ADRs

- ADR-XXX: (Future) TEA knowledge base implementation plan (Release 5)
- ADR-XXX: Technical debt and deferred work tracking

---

## References

- TEA Module: _lr/tea/workflows/
- BMAD TEST ARCHITECTURE: https://github.com/anthropics/BMAD-METHOD/tea/
- Release 4 Technical Debt: Release_4.md (Section 9: Consolidated Gaps)
- Release 5 Planning: (To be created)

