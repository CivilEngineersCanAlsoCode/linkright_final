# Step 09c: Score Metric Density

## Workflow: sync.jd-optimize / Phase F: Baseline Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the metric density dimension (max 20) by calculating the average quantification level across the `top_signals[]`.

### Dependencies
- Requires: `top_signals[].metric_density` (from Phase E)

### Hard Stop Conditions
- IF `top_signals[]` is empty → Surface error: "No signals found to calculate density."

### Process

1. [EXTRACT] Aggregate the `metric_density` scores for all signals in `top_signals[]`.
2. [CALCULATE] Compute the average density:
   - `avg_density = sum(metric_density) / count(signals)`
3. [NORMALIZE] Map the average density to a 20-point scale:
   - `score = avg_density * 20`
4. [SCORE] Record the `baseline_dim3_metrics` score.
5. [LOG] Document the result: "Average metric density: [avg] = [score]/20".

### Beads Task

```bash
bd create "sync.jd-optimize.step-09c-score-metric-density" \
  --description="Scoring the metric density dimension (max 20). This measures the 'hardness' of the user's evidence. High density means more numbers and quantifiable outcomes, which are essential for high-performance resumes." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `baseline_dim3_metrics` (Float 0-20)

### Validation Checklist
- [ ] Average calculation is correct based on signal metadata.
- [ ] Final score does not exceed 20.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-09c. Metrics Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-09c \
  --set-metadata session_variables='{"baseline_dim3": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Metric density score [S]/20 assigned based on average quantification level of [A]." \
  --json
```

**Next:** `step-09d-score-persona-alignment.md`
