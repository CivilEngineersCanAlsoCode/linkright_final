# Step 21a: Score Keyword Coverage (Final)

## Workflow: sync.outbound-campaign / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Calculate the final keyword coverage score (max 20) for the optimized resume artifact.

### Dependencies
- Requires: `optimized-resume.md` (from Phase K)
- Requires: `jd_profile.keywords_ats[]` (from Phase B)

### Hard Stop Conditions
- IF `optimized-resume.md` is missing → Surface error: "No artifact to score."

### Process

1. [READ] Load the finalized `optimized-resume.md`.
2. [MATCH] Perform an exact keyword match for all terms in `jd_profile.keywords_ats[]` against the resume text.
3. [COUNT] Determine the `final_count_covered`.
4. [CALCULATE] Compute the final score:
   - `score = (final_count_covered / total_keywords) * 20`
5. [LOG] Surface the final match rate: "Final keyword coverage: [covered]/[total] = [score]/20".

### Beads Task

```bash
bd create "sync.outbound-campaign.step-21a-score-keyword-coverage-final" \
  --description="Scoring the final keyword coverage. This step validates that the optimization process successfully injected the required ATS keywords into the resume copy." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `final_dim1_keywords` (Float 0-20)

### Validation Checklist
- [ ] Final score is significantly higher than the baseline score (step-09a).
- [ ] Coverage count is accurate based on text scan.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-21a. Final Keyword Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-21a \
  --set-metadata session_variables='{"final_dim1": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Final keyword coverage score [S]/20 assigned based on [C] matches." \
  --json
```

**Next:** `step-21b-score-ownership-match-final.md`
