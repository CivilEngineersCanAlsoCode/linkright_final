# Step 09a: Score Keyword Coverage

## Workflow: sync.portfolio-deploy / Phase F: Baseline Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the keyword coverage dimension (max 20) for the current signal library relative to the JD's ATS keywords.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-scoring-dimensions.csv`
- Requires: `jd_profile.keywords_ats[]` (from Phase B)
- Requires: `top_signals[]` (from Phase E)

### Hard Stop Conditions
- IF `jd_profile.keywords_ats[]` is empty → Surface error: "No keywords found to score. Re-run Phase B."

### Process

1. [EXTRACT] Consolidate all text from `top_signals[].skills_demonstrated` and `top_signals[].raw_reflection`.
2. [MATCH] For each keyword in `jd_profile.keywords_ats[]`, check if it appears in the consolidated text (case-insensitive).
3. [COUNT] Determine the `count_covered` (number of unique keywords found).
4. [CALCULATE] Compute the baseline score for this dimension:
   - `score = (count_covered / total_keywords) * 20`
5. [LOG] Record the match rate: "Keyword coverage: [covered]/[total] = [score]/20".

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-09a-score-keyword-coverage" \
  --description="Scoring the keyword coverage dimension (max 20). This step measures how well the existing signal library matches the ATS keywords required by the JD, providing a baseline for optimization." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `baseline_dim1_keywords` (Float 0-20)

### Validation Checklist
- [ ] Covered count is less than or equal to total keywords.
- [ ] Score is correctly normalized to a 20-point scale.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-09a. Keyword Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-09a \
  --set-metadata session_variables='{"baseline_dim1": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Keyword coverage score [S]/20 assigned based on [C] matches out of [T] keywords." \
  --json
```

**Next:** `step-09b-score-ownership-match.md`
