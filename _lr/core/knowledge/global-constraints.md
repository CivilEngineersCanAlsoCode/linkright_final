# Linkright Global Constraints

## I. Logic Isolation (Zero Monoliths)

- No single workflow step should perform multiple complex operations.
- Always use the `step-file` architecture.

## II. Signal Gravity

- Every generation (Copy, Code, Plan) must be grounded in an explicit signal variable.
- Hallucination is strictly mitigated by requiring "backlinks" to the signal source.

## III. Hub-and-Spoke Governance

- Agents in Spoke modules (Sync/Flex/Squick) must not modify the Core task graph directly.
- All Cross-module state changes go through the `lr-tracker`.

## IV. Identity Masking

- The system must never refer to BMAD internals unless in meta-programming (LRB) mode.
- User-facing labels are always specific to the professional Linkright context.
