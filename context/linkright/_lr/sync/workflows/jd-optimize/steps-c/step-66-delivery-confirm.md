# Step 66: Delivery Confirmation & Handoff Summary

## MANDATORY EXECUTION RULES (READ FIRST)
✅ ALWAYS provide a clear summary of what was delivered.
✅ ALWAYS specify the exact location of the handoff package.

## DEPENDENCIES
- Requires: Validated delivery package (from `step-65-delivery-review`)

## EXECUTION PROTOCOLS
1. [SUMMARIZE] Extract the following for the final summary:
   - Target Company and Role.
   - List of all delivered files.
   - Total number of JD requirements addressed.
   - Number of competitive moats identified.
2. [FORMAT] Create the final `delivery-summary.md` artifact.
3. [PROMPT] Present the handoff summary to the user:
   - "Handoff Complete for {Company} - {Role}."
   - "Location: {project-root}/_lr/_output/sync-artifacts/{Company}/{Date}/"
   - "Next Steps: Review the talking points and submit your application."
4. [COMPLETE] Update the workflow Beads issue to `status: closed`.
5. [FLUSH] Clear any temporary session state from memory.

## OUTPUT ARTIFACT
- **File**: `delivery-summary.md`
- **User Output**: Final handoff message with path.

## SUCCESS CRITERIA
- ✅ `delivery-summary.md` exists and is non-empty.
- ✅ User has received the final location of the artifacts.
- ✅ All session objectives are documented as met.

## NEXT STEP
- **WORKFLOW COMPLETE**.
- The user is now equipped to submit their optimized application.
