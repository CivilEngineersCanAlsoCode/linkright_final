# Step 01: Ingest Diff Request


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

1. [READ] Ask user for the specific section to update and the change payload.
2. [ANALYZE] Identify constraints (character limits, tone matching).
3. [VALIDATE] Confirm scope with user.

## INPUT CONTRACT

- User diff payload / instruction string.

## OUTPUT CONTRACT

- Defined scope boundary for edit.
