# ADR-002: Agent Count (+2 agents vs BMAD Baseline)

**Status:** Accepted

**Date:** 2026-03-08

---

## Context

BMAD method baseline for similar systems: 25-27 agents across core functions. Linkright currently has 29 agents across 7 modules (core×7, sync×8, tea×3, cis×2, flex×2, squick×5, lrb×2).

This represents +2 agents beyond BMAD baseline (29 vs 27). The excess was justified by domain specialization needs:
- Squick agents (5) handle multi-phase optimization (BMAD baseline: 3)
- Tea agents (3) expanded QA and knowledge management
- Sync agents (8) cover multi-step career signal processing

---

## Decision

Accept +2 agent surplus above BMAD baseline (29 total agents). Justify by specialized role expansion in career signal processing domain.

---

## Rationale

1. **Domain Specificity**: Career positioning requires more granular agent specialization than generic systems
2. **Agent Separation Principle**: Each agent < 40 lines, single concern; excess agents respect modularity
3. **Scalability**: Extra agents reduce individual agent complexity; cleaner than monolithic designs
4. **BMAD Alignment**: Deviation justified, documented, and bounded (only +2 agents)
5. **Future Reduction Possible**: If domain requirements change, agents can be consolidated

---

## Consequences

### Positive
- Specialized agents handle complex domain tasks
- Individual agents remain lean (BMAD < 40 line goal)
- Cleaner separation of concerns
- Easier to test, debug, maintain

### Negative
- Higher operational complexity (coordination overhead)
- More agents to monitor, upgrade, troubleshoot
- Memory/compute footprint slightly larger
- Potential for agent redundancy if oversight lapses

**Mitigation**: Agent-manifest.csv tracks all 29, quarterly review for consolidation opportunities.

---

## Alternatives Considered

1. **Compress to BMAD baseline (27 agents)**: Would bloat remaining agents beyond 40-line ideal
2. **Expand to 35+ agents**: No domain justification; violates simplicity principle
3. **Hybrid approach (28 agents)**: Compromise; loses specialization benefits

---

## Related ADRs

- ADR-004: Agent XML depth normalization to ≥40 lines
- (Future) ADR-NNN: Agent consolidation review (Release 5+)

---

## References

- BMAD Method: https://github.com/anthropics/BMAD-METHOD/
- Agent Manifest: _lr/_config/agent-manifest.csv
- Agent Module Breakdown: context/linkright/releases/Release_4.md (Section 4.3)

