# Step 21c: Score Metric Density (Final)

## Workflow: sync.jd-optimize / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Calculate the final metric density score (max 20) for the optimized resume artifact.

### Dependencies
- Requires: `optimized-resume.md` (from Phase K)

### Hard Stop Conditions
- IF `optimized-resume.md` is missing → Surface error: "No artifact to score."

### Process

1. [READ] Load the finalized `optimized-resume.md`.
2. [EXTRACT] Count the total number of bullet points in the resume.
3. [COUNT] Identify all bullet points that contain at least one numerical metric (%, $, #, [N] years).
4. [CALCULATE] Compute the metric density:
   - `density = (bullets_with_metrics / total_bullets)`
5. [NORMALIZE] Map to a 20-point scale:
   - `score = density * 20`
6. [LOG] Surface the result: "Final metric density: [D]% = [score]/20".

### Beads Task

```bash
bd create "sync.jd-optimize.step-21c-score-metric-density-final" \
  --description="Scoring the final metric density. This step ensures that the resume meets the high-performance threshold for quantifiable evidence, a key driver for interview conversion." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `final_dim3_metrics` (Float 0-20)

### Validation Checklist
- [ ] Every bullet is audited for numerical signals.
- [ ] Final score reflects the percentage of 'hard evidence' bullets.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-21c. Final Metrics Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-21c \
  --set-metadata session_variables='{"final_dim3": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Final metric density score [S]/20 assigned based on [D]% of bullets having quantifiable outcomes." \
  --json
```

**Next:** `step-21d-score-persona-alignment-final.md`
