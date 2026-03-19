# Step 14: Write Professional Summary

## Workflow: sync.outbound-campaign / Phase J: Content Writing

## Agent: Sync-Writer

---

### Objective
Generate the final professional summary section based on the `one-line-positioning` and `summary_approach` defined in the narrative plan.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/templates/sync-optimized-resume.template.md`
- Requires: `sync-narrative-plan.md` (from Phase I)

### Hard Stop Conditions
- IF `sync-narrative-plan.md` status is not `user-confirmed` → Surface error: "Narrative plan not confirmed. Return to Phase I."

### Process

1. [READ] Load the confirmed `sync-narrative-plan.md`.
2. [WRITE] Generate the `Professional Summary` section using the following rules:
   - **Line 1**: The `one-line-positioning` statement verbatim.
   - **Bullet 1**: A 2-line impact statement focused on the user's biggest P0-matching signal.
   - **Bullet 2**: A 2-line impact statement focused on the user's secondary P0/P1 signal.
   - **Metric Check**: Ensure both bullets contain at least one hard number from the signals.
3. [EVALUATE] Score the draft summary:
   - Keyword density? (Does it match the target JD?)
   - Persona fit? (Does the tone match the primary persona?)
4. [OUTPUT] Initialize the `optimized-resume.md` artifact with the summary section.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-14-write-professional-summary" \
  --description="Writing the resume's professional summary. This step turns the strategic plan into final resume copy, ensuring the user's value proposition is immediately clear to both ATS and human reviewers." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/optimized-artifacts/optimized-resume-[uuid].md` (Started)

### Validation Checklist
- [ ] Summary includes at least 2 hard numbers from the signal pool.
- [ ] First line matches the positioning statement from the plan.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-14. Professional summary written. Session variables updated." \
  --set-metadata last_completed_step=step-14 \
  --set-metadata session_variables='{"summary_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Professional summary generated and written to the optimized resume artifact." \
  --json
```

**Next:** `step-15a-write-role1-bullets.md`
