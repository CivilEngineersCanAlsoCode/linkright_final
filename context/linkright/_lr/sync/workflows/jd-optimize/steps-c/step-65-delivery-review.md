# Step 65: Delivery Review & Quality Check

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER deliver a package with empty or corrupted files.
✅ ALWAYS perform a final content scan for placeholder tokens.

## DEPENDENCIES
- Requires: Populated delivery folder (from `step-64-delivery-prep`)

## EXECUTION PROTOCOLS
1. [LIST] Extract the list of all files in the delivery folder.
2. [VALIDATE] Verify each core file:
   - Check file size: Must be > 0 bytes.
   - Check for placeholder tokens: Scan for any `[` or `}` characters.
   - Check file format: Ensure extensions match the expected content (e.g., .html, .md).
3. [CHECK] Confirm the `optimized-jd.md` contains the specific company and role.
4. [VERIFY] Ensure the cover letter correctly references the JD's P0 requirements.
5. [STATUS] Finalize the review report for user confirmation.

## SUCCESS CRITERIA
- ✅ All 4+ core files verified as non-empty.
- ✅ Zero placeholder tokens detected across all deliverables.
- ✅ Final formatting and naming verified.

## FAILURE PROTOCOL
- If file is missing or empty: Halt and re-run the relevant generation step (Phase D-L).
- If placeholder detected: Halt and re-run Step 01 validation and then regenerate.

## NEXT STEP
- Proceed to `step-66-delivery-confirm.md` for final user handoff.
