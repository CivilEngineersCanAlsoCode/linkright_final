# Step 21e: Score Scope Match (Final)

## Workflow: sync.portfolio-deploy / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Calculate the final scope match score (max 20) by auditing the organizational impact level of the optimized resume.

### Dependencies
- Requires: `optimized-resume.md` (from Phase K)
- Requires: `jd_profile.requirements` (from Phase B)

### Hard Stop Conditions
- IF `optimized-resume.md` is missing → Surface error: "No artifact to score."

### Process

1. [READ] Load the finalized `optimized-resume.md`.
2. [EVALUATE] Analyze the "scope" of each impact statement:
   - Identify "Org-level" signals (Company-wide, $10M+, Global, Exec-facing).
   - Identify "Team-level" signals (Department, Pod, Feature-level).
3. [MATCH] Compare the observed scope distribution against the `expected_scope` identified in Phase F.
4. [SCORE] Assign a score (0-20) based on alignment.
5. [LOG] Surface the final scope score.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-21e-score-scope-match-final" \
  --description="Scoring the final scope match. This step ensures that the organizational scale and impact level described in the resume perfectly match the expectations of the target JD." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `final_dim5_scope` (Float 0-20)

### Validation Checklist
- [ ] Resume copy accurately reflects the required scale of impact.
- [ ] No mismatch between seniority level and scope language.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-21e. Final Scope Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-21e \
  --set-metadata session_variables='{"final_dim5": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Final scope match score [S]/20 assigned based on observed scale of impact." \
  --json
```

**Next:** `step-21f-aggregate-final-score.md`
