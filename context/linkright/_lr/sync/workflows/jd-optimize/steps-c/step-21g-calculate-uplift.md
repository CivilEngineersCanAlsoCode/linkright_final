# Step 21g: Calculate Uplift

## Workflow: sync.jd-optimize / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Calculate the "Uplift" (delta between baseline and final scores) to measure the objective improvement achieved by the optimization workflow.

### Dependencies
- Requires: `alignment_score_baseline` (from Phase F)
- Requires: `alignment_score_final` (from step-21f)

### Hard Stop Conditions
- IF either baseline or final score is missing → Surface error: "Cannot calculate uplift."

### Process

1. [READ] Load the baseline and final scores.
2. [CALCULATE] Compute the delta:
   - `uplift = alignment_score_final - alignment_score_baseline`
3. [EVALUATE] Determine the optimization effectiveness:
   - **High Uplift**: > 30 points.
   - **Moderate Uplift**: 15-30 points.
   - **Low Uplift**: < 15 points.
4. [UPDATE] Update `jd_profile.uplift` with the result.
5. [LOG] Surface the result: "Optimization Uplift: +[U] points."

### Beads Task

```bash
bd create "sync.jd-optimize.step-21g-calculate-uplift" \
  --description="Calculating the optimization uplift. This step measures the 'Value Added' by the Sync system, providing a clear ROI metric for the user by comparing their original resume fit against the optimized version." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `uplift` (Float)

### Validation Checklist
- [ ] Uplift calculation is correct.
- [ ] Positive uplift is achieved (if final > baseline).

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-21g. Uplift: +[N] pts. Session variables updated." \
  --set-metadata last_completed_step=step-21g \
  --set-metadata session_variables='{"uplift": [uplift]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Optimization uplift of +[N] points calculated and recorded." \
  --json
```

**Next:** `step-22-store-resume-version.md`
