# ADR-008: Atomic Steps Principle

**Date:** 2026-03-09
**Status:** Accepted
**Author:** Phoenix (RoseGlacier)

## Context
Initial Linkright workflows often combined multiple complex operations into a single step file (e.g., "Parse JD and Optimize Bullets"). This led to high failure rates, difficult debugging, and the inability to resume from the exact point of failure.

## Decision
Mandate the **Atomic Steps Principle**: Every workflow step must perform exactly one cognitive or technical operation.

## Rationale
- **Resumability**: If a workflow is interrupted, the system can resume from the exact atomic step that failed, rather than re-running a large block of operations.
- **Reliability**: Smaller, focused steps are less likely to hit context window limits or trigger complex logic errors.
- **Auditability**: Makes it clear exactly which operation produced which output, simplifying the "Evidence Collection" process.
- **Scalability**: New operations can be inserted into the pipeline as independent atomic units without refactoring existing logic.

## Consequences
- Workflows will have a higher total step count (e.g., 67 steps for `jd-optimize`).
- Requires strict adherence to the "Atomic Step Standard" during file creation.
- Some existing multi-op steps must be split.

## Alternatives Considered
- **Coarse-Grained Steps**: Simpler to manage (fewer files) but significantly harder to make reliable and resumable for autonomous agents.
- **Functional Modules**: Grouping steps into large scripts; lacks the step-by-step visibility and human-in-the-loop validation points of atomic files.
