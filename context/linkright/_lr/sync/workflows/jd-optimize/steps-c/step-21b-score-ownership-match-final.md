# Step 21b: Score Ownership Match (Final)

## Workflow: sync.jd-optimize / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Calculate the final ownership match score (max 20) by auditing the seniority and leadership signals in the optimized resume.

### Dependencies
- Requires: `optimized-resume.md` (from Phase K)
- Requires: `jd_profile.ownership_signals` (from Phase B)

### Hard Stop Conditions
- IF `optimized-resume.md` is missing → Surface error: "No artifact to score."

### Process

1. [READ] Load the finalized `optimized-resume.md`.
2. [EVALUATE] Analyze the ownership language in each bullet:
   - Identify "Sole/Lead" verbs (Directed, Orchestrated, Owned, Built).
   - Identify "Shared/Contributed" verbs (Supported, Collaborated, Partnered).
3. [MATCH] Compare the distribution of leadership signals against the `expected_ownership_level`.
4. [SCORE] Assign a score (0-20) based on alignment density.
5. [LOG] Surface the ownership score.

### Beads Task

```bash
bd create "sync.jd-optimize.step-21b-score-ownership-match-final" \
  --description="Scoring the final ownership match. This step ensures that the optimized bullets correctly signal the level of seniority and impact expected by the target JD." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `final_dim2_ownership` (Float 0-20)

### Validation Checklist
- [ ] Score accurately reflects the leadership signals in the text.
- [ ] Language audit identifies specific ownership-heavy verbs.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-21b. Final Ownership Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-21b \
  --set-metadata session_variables='{"final_dim2": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Final ownership match score [S]/20 assigned based on seniority signals in the text." \
  --json
```

**Next:** `step-21c-score-metric-density-final.md`
