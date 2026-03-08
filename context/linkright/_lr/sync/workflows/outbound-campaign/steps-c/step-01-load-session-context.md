# Step 01: Load Session Context


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER generate content without loading context.
✅ ALWAYS strictly follow the defined sequence below.

## EXECUTION PROTOCOLS
1. [READ] Load `{project-root}/_lr/lr-config.yaml`.
2. [ANALYZE] Resolve session variables: {system_name}, {mode}, {user_details}.
3. [VALIDATE] Ensure all core configurations are present before proceeding.
