# Step 01b: Resume if Interrupted


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ONLY execute if a previous session was interrupted.

## EXECUTION PROTOCOLS
1. [READ] Check for existing artifacts in `artifacts/` folder.
2. [ANALYZE] Identify the last successfully completed step from the metadata.
3. [VALIDATE] Ask the user whether to [C] Continue from last state or [R] Restart from Step 01.
