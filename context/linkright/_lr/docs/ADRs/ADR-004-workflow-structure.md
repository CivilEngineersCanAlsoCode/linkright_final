# ADR-004: 3-Phase Workflow Structure (c/e/v)

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
Linkright workflows vary greatly in complexity and naming conventions, making it difficult for agents to consistently locate and execute specific types of operations. A standardized structure is needed to improve discoverability and predictability.

## Decision
Standardize all Linkright workflows using a 3-phase directory structure: **steps-c/** (Create/Setup), **steps-e/** (Execute/Process), and **steps-v/** (Validate/Verify).

## Rationale
- **Predictability**: Agents always know where to find setup, execution, and validation steps.
- **Modularity**: Allows for easier auditing and replacement of specific phases without impacting others.
- **B-MAD Alignment**: Reflects the Plan-Act-Validate cycle mandated by the engineering standards.
- **Clarity**: Separates the "what to do" (Create) from the "doing it" (Execute) and the "how it went" (Validate).

## Consequences
- Workflows must be refactored to fit into this 3-phase model.
- Manifests must be updated to track coverage across these phases.
- New workflows must follow this directory pattern from inception.

## Alternatives Considered
- **Flat Step Lists**: Simpler but becomes unmanageable for 50+ step workflows.
- **Numbered Phases (1, 2, 3)**: Less descriptive than functional names (c/e/v).
- **Ad-hoc Directories**: Lead to the current fragmentation and discovery issues.
