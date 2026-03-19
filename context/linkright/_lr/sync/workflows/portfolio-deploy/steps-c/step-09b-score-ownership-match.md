# Step 09b: Score Ownership Match

## Workflow: sync.portfolio-deploy / Phase F: Baseline Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the ownership match dimension (max 20) by comparing the JD's expected ownership level against the user's signal library distribution.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-ownership-levels.md`
- Requires: `jd_profile.ownership_signals` (from Phase B)
- Requires: `top_signals[].ownership_level` (from Phase E)

### Hard Stop Conditions
- IF `jd_profile.ownership_signals` is empty → Surface error: "No ownership expectations found in JD. Re-run Phase B."

### Process

1. [EXTRACT] Determine the `expected_ownership_level` for the JD (the most frequent level in `ownership_signals`).
2. [EVALUATE] Analyze the distribution of `ownership_level` across the `top_signals[]`.
3. [MATCH] Assign a score based on alignment:
   - **18-20**: High alignment. JD expects "sole/lead" and the majority of top signals are "sole/shared".
   - **12-17**: Moderate alignment. JD expects "sole" but signals are mostly "contributed/shared".
   - **6-11**: Low alignment. JD expects "sole" but signals are mostly "advised/contributed".
   - **0-5**: Zero alignment or missing data.
4. [SCORE] Record the `baseline_dim2_ownership` score.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-09b-score-ownership-match" \
  --description="Scoring the ownership match dimension (max 20). This compares the level of seniority/autonomy expected by the hiring company against the evidence in the user's signal library." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `baseline_dim2_ownership` (Float 0-20)

### Validation Checklist
- [ ] Score reflects the actual seniority gap between the JD and the library.
- [ ] Alignment logic follows the sync-ownership-levels guidelines.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-09b. Ownership Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-09b \
  --set-metadata session_variables='{"baseline_dim2": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Ownership match score [S]/20 assigned based on [E] expected vs [O] observed levels." \
  --json
```

**Next:** `step-09c-score-metric-density.md`
