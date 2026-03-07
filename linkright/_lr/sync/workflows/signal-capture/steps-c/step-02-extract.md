# Step 02: Extract Professional Signal


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)

✅ ONLY process indexed data from Step 01.

## EXECUTION PROTOCOLS

1. [READ] Load `raw_signals.yaml`.
2. [ANALYZE] Map milestones to the `signal-ontology.yaml` schema.
3. [VALIDATE] Verify XYZ format for all technical metrics.

## OUTPUT CONTRACT

- `career_signals.yaml` (Finalized state)
