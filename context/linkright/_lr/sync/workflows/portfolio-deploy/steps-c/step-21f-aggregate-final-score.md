# Step 21f: Aggregate Final Score

## Workflow: sync.portfolio-deploy / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Sum all 5 final dimension scores into a single post-optimization alignment score (0-100).

### Dependencies
- Requires: `final_dim1` through `final_dim5` (from steps 21a-21e)

### Hard Stop Conditions
- IF any final dimension is missing → Surface error: "Incomplete final scoring pool."

### Process

1. [SUM] Add the 5 scores to compute the `alignment_score_final`:
   - `total = d1 + d2 + d3 + d4 + d5`
2. [UPDATE] Update `jd_profile.alignment_score_final` with the total.
3. [LOG] Surface the final summary: "Final alignment score: [N]/100."

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-21f-aggregate-final-score" \
  --description="Aggregating the final alignment score. This step provides the conclusive 'Fit Score' for the optimized resume, validating the effectiveness of the entire Sync workflow." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `alignment_score_final` (Float 0-100)

### Validation Checklist
- [ ] Final score is accurately summed.
- [ ] Score is stored in the session context.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-21f. Final Score: [N]/100. Session variables updated." \
  --set-metadata last_completed_step=step-21f \
  --set-metadata session_variables='{"final_total": [total]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Final post-optimization alignment score of [N]/100 calculated." \
  --json
```

**Next:** `step-21g-calculate-uplift.md`
