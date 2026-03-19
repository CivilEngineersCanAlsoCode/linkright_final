# Step 08b: Rank by Metric Density

## Workflow: sync.portfolio-deploy / Phase E: Signal Retrieval

## Agent: Sync-Linker

---

### Objective
Re-rank the `filtered_signals[]` using a composite score that weights both semantic relevance and metric density, selecting the top 10 for final optimization.

### Dependencies
- Requires: `filtered_signals[]` (from step-08a)

### Hard Stop Conditions
- IF `filtered_signals[]` is empty → Surface error: "No signals available for ranking. Re-run Phase E."

### Process

1. [READ] Load the `filtered_signals[]` array.
2. [CALCULATE] For each signal, compute a `composite_score`:
   - `relevance_weight`: 0.6
   - `metric_density_weight`: 0.4
   - `composite_score = (relevance_score * 0.6) + (metric_density * 0.4)`
3. [SORT] Rank the signals in descending order of their `composite_score`.
4. [SELECT] Select the top 10 signals as `top_signals[]`.
5. [LOG] Record the composite scores for the top 10 signals.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-08b-rank-by-metric-density" \
  --description="Re-ranking the filtered signals by metric density. This step prioritizes 'hard evidence' (quantifiable results) alongside semantic relevance, ensuring the most impactful bullets lead the resume." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `top_signals[]`

### Validation Checklist
- [ ] Exactly 10 signals (or all available if <10) are selected for `top_signals[]`.
- [ ] Ranks correctly reflect the composite score.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-08b. Top 10 signals ranked. Session variables updated." \
  --set-metadata last_completed_step=step-08b \
  --set-metadata session_variables='{"top_signals_ranked": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Ranked candidate pool based on 60/40 relevance/density weighting; top 10 selected." \
  --json
```

**Next:** `step-08c-group-by-signal-type.md`
