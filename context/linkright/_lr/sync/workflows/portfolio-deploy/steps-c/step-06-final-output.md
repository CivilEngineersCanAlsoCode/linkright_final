# Step 06: Final Optimized JD Profile Generation

## MANDATORY EXECUTION RULES (READ FIRST)
🛑 NEVER proceed without all artifacts from Phases A and B (Steps 01-05).
✅ ALWAYS use the official `optimized-jd.template.md` as the output base.
✅ ALWAYS ensure the final output is a ready-to-use, signal-aligned profile.

## DEPENDENCIES
- Requires: `jd-parsed.yaml`, `requirement-signal-map.yaml`, `keyword-list.yaml`, `competitive-moat.yaml`, `adversarial-review.yaml`.
- Requires: `_lr/sync/workflows/jd-optimize/templates/optimized-jd.template.md`.

## EXECUTION PROTOCOLS
1. [READ] Load all session artifacts and the official optimized JD template.
2. [POPULATE] Map the extracted signals to the template sections:
   - **User Information**: From session context (Step 01).
   - **Job Context**: Company name and target role (Step 01).
   - **Strategic Alignment**: Matched P0 requirements and moat statements (Step 04).
   - **ATS Optimization**: Top 15 keywords and their contexts (Step 03).
   - **Gap Bridging**: Proactive mitigation statements for critical weaknesses (Step 05).
3. [ASSEMBLE] Construct the final document by injecting the populated data into the template placeholders.
4. [REFINE] Conduct a final quality review of the generated content:
   - Check for formatting consistency and professional tone.
   - Verify all P0 requirements are highlighted with supporting evidence.
   - Ensure the competitive moats are clearly articulated as key differentiators.
5. [SAVE] Generate the final `{optimized-jd}.md` file in the session artifacts directory.
6. [FINAL] Update the workflow frontmatter `stepsCompleted` array with all Steps 01-06.

## OUTPUT ARTIFACT
- **File**: `{Company}_{Role}_Optimized_JD.md`
- **Schema**: Markdown format based on the provided template.

## SUCCESS CRITERIA
- ✅ The final optimized JD file exists and is well-formatted.
- ✅ All core JD requirements are addressed with specific evidence.
- ✅ The document includes at least 3 competitive moat statements.
- ✅ All placeholders in the template have been replaced with real data.

## FAILURE PROTOCOL
- If placeholders remain in the output: Halt and re-run population logic with stricter variable matching.
- If tone is too generic: Re-inject specific achievement details from Step 04 moat statements.

## NEXT STEP
- The JD Optimization (Phases A and B) is now COMPLETE.
- Proceed to Phase C (Signals and Achievements) if the user requests deeper bullet-point optimization.
