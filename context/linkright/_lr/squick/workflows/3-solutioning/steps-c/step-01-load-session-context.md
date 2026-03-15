# Step 01: Load & Validate Session Context

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER generate content without loading session context.
🛑 HALT IMMEDIATELY if any placeholder tokens are detected in `lr-config.yaml`.
✅ ALWAYS extract validated user details into the session context block.

## DEPENDENCIES
- Requires: `{project-root}/_lr/lr-config.yaml`
- Requires: Standard Linkright session variable schema

## EXECUTION PROTOCOLS
1. [READ] Load the full configuration from `_lr/lr-config.yaml`.
2. [SCAN] Perform a rigorous scan of the `user` block for any remaining placeholder tokens:
   - Search for: `[`, `]`, `${`, `}`.
   - Specific check: Ensure `name` is not "[USER_NAME]", `bio` is not "[USER_PROFESSIONAL_SUMMARY]", etc.
3. [HALT] If any placeholder is found:
   - Output: "CRITICAL ERROR: Placeholder detected in field [FIELD_NAME]"
   - Action: Halt execution and notify the user to fill `lr-config.yaml` with real data.
4. [EXTRACT] Once validated, resolve and extract the following session variables:
   - `user_name`: Full legal/professional name.
   - `user_bio`: Professional summary or brief bio.
   - `target_role`: The specific job title or role being targeted.
   - `target_companies`: List of priority organizations.
   - `user_skills`: Array of verified technical and soft skills.
5. [FORMAT] Create a structured "Session Context Block" for downstream steps to reference.
6. [VALIDATE] Confirm that all 5 core user fields are present and non-empty.

## OUTPUT ARTIFACT
- **Internal State**: Validated Session Context Block
- **Schema**:
  ```yaml
  session_context:
    user:
      name: string
      bio: string
      role: string
      companies: [string]
      skills: [string]
    system:
      name: string
      version: float
      mode: string
  ```

## SUCCESS CRITERIA
- ✅ `lr-config.yaml` successfully read and parsed.
- ✅ Zero placeholder tokens detected in core user fields.
- ✅ Session context block populated with at least 5 user signals.

## FAILURE PROTOCOL
- If `lr-config.yaml` is missing: Create from template and prompt user for input.
- If placeholder detected: Halt and provide clear instructions on which field to fix.

## NEXT STEP
- Proceed to `step-01-ingest-jd.md` to collect the target job description.
