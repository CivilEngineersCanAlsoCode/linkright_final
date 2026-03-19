# Step 06c: Score Strategy-PM Fit

## Workflow: sync.portfolio-deploy / Phase D: Persona Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the strategy-pm dimension (0-10) for the target job description based on strategic and planning requirements.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-persona-tilt-guide.md`
- Requires: `jd_profile` (from Phase B)
- Context: `jd_profile.requirements.hard`, `jd_profile.ownership_signals`

### Hard Stop Conditions
- IF `jd_profile.requirements.hard` is empty → Surface error: "No requirements found. Re-run Phase B."

### Process

1. [SCAN] Identify all requirements (hard and soft) with `signal_type = "strategy"`.
2. [EVIDENCE] Identify mentions of strategic activities: "OKR setting", "roadmap ownership", "market sizing", "executive alignment", "go-to-market strategy", "competitive analysis", "resource allocation", "business case".
3. [CHECK] Verify presence of strategy tools/frameworks: "Market analysis", "Blue ocean", "Porter's 5 forces", "SWOT".
4. [SCORE] Assign a value from 0-10 based on same logic:
   - **8-10**: Strategic thinking and roadmap prioritization are the primary expectations.
   - **5-7**: Strategy is a significant component alongside execution.
   - **2-4**: Strategic input is expected but execution/tech is the main focus.
   - **0-1**: No strategy-specific requirements found.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-06c-score-strategy-pm-fit" \
  --description="Scoring the Strategy-PM dimension. Focuses on OKRs, market sizing, and exec alignment to assign a 0-10 score, determining the strategic 'tilt' of the resume." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `persona_scores.strategy_pm` (Integer 0-10)
- Update: `jd_profile.persona_scores.strategy_pm`

### Validation Checklist
- [ ] Strategy-PM score is an integer between 0 and 10.
- [ ] Rationale for score is documented.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-06c. Strategy-PM score: [N]. Session variables updated." \
  --set-metadata last_completed_step=step-06c \
  --set-metadata session_variables='{"persona_scores": {"strategy_pm": [N]}}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Strategy-PM score [N] assigned based on [X] strategic requirements and [Y] roadmap signals." \
  --json
```

**Next:** `step-06d-score-product-pm-fit.md`
