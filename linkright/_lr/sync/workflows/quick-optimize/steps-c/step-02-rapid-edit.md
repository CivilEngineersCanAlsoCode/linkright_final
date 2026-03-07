# Step 02: Rapid Edit


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

1. [READ] Load the target section from existing resume data.
2. [ANALYZE] Apply the diff instruction seamlessly. Focus ONLY on requested changes.
3. [VALIDATE] Print the isolated updated section for the user.

## INPUT CONTRACT

- Scope boundary from Step 01.

## OUTPUT CONTRACT

- Draft updated text block.
