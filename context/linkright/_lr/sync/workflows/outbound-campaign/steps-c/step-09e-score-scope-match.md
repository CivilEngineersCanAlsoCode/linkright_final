# Step 09e: Score Scope Match

## Workflow: sync.outbound-campaign / Phase F: Baseline Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the scope match dimension (max 20) by comparing the JD's implied organizational scope against the distribution in the user's signal library.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-ownership-levels.md` (for scope taxonomy)
- Requires: `jd_profile.requirements` (from Phase B)
- Requires: `top_signals[].scope` (from Phase E)

### Hard Stop Conditions
- IF `top_signals[]` is empty → Surface error: "No signals found to evaluate scope."

### Process

1. [EXTRACT] Identify the target `expected_scope` from the JD (e.g., "team-level", "org-level", "cross-functional", "external").
2. [EVALUATE] Analyze the distribution of `scope` across the `top_signals[]`.
3. [MATCH] Assign a score based on alignment:
   - **18-20**: High alignment. JD expects "org-level" and the user has multiple "org-level" signals.
   - **12-17**: Moderate alignment. JD expects "org-level" but user signals are mostly "team-level".
   - **6-11**: Low alignment. JD expects "team-level" but user has mostly "individual" signals.
   - **0-5**: Zero or negligible scope match.
4. [SCORE] Record the `baseline_dim5_scope` score.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-09e-score-scope-match" \
  --description="Scoring the scope match dimension (max 20). This step measures organizational impact. It ensures the user's evidence matches the scale (team vs. org vs. external) required by the hiring company." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `baseline_dim5_scope` (Float 0-20)

### Validation Checklist
- [ ] Score accurately reflects the scale/impact gap.
- [ ] Comparison uses the standard scope taxonomy (individual/team/org/external).

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-09e. Scope Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-09e \
  --set-metadata session_variables='{"baseline_dim5": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Scope match score [S]/20 assigned based on [E] expected scale vs [O] observed impact." \
  --json
```

**Next:** `step-09f-aggregate-baseline-score.md`
