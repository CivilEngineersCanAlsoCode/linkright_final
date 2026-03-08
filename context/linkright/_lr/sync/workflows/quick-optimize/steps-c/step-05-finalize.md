# Step 05: Finalize Output


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)

🛑 NEVER generate content without user validation.
✅ ALWAYS strictly follow the defined sequence below.
🚫 FORBIDDEN to load next step until discovery and extraction are complete.

## CONTEXT BOUNDARIES

- Available configurations from parent: {system_version}, {mode}

## EXECUTION PROTOCOLS

1. [READ] Hardened text block.
2. [ANALYZE] Map into `../templates/quick-update.template.md`.
3. [VALIDATE] Output the final artifact wrapper for saving.

## INPUT CONTRACT

- Hardened text block.

## OUTPUT CONTRACT

- Final templated artifact.
