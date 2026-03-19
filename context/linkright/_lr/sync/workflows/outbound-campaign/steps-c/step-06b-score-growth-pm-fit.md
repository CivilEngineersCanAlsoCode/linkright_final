# Step 06b: Score Growth-PM Fit

## Workflow: sync.outbound-campaign / Phase D: Persona Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the growth-pm dimension (0-10) for the target job description based on growth-related requirements and metrics.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-persona-tilt-guide.md`
- Requires: `jd_profile` (from Phase B)
- Context: `jd_profile.requirements.hard`, `jd_profile.requirements.soft`

### Hard Stop Conditions
- IF `jd_profile.requirements.hard` is empty → Surface error: "No requirements found. Re-run Phase B."

### Process

1. [SCAN] Identify all requirements (hard and soft) with `signal_type = "growth"`.
2. [EVIDENCE] Identify mentions of growth-specific activities: "A/B testing", "funnel optimization", "retention", "acquisition", "conversion", "experiment velocity", "cohort analysis".
3. [METRICS] Search for growth KPIs: "DAU/MAU", "Churn", "CAC", "LTV", "Revenue growth", "NPS", "Adoption rate".
4. [SCORE] Assign a value from 0-10 based on same logic:
   - **8-10**: Growth metrics are the primary success criteria; role is conversion-focused.
   - **5-7**: Growth mentioned as a key pillar alongside product/tech.
   - **2-4**: Growth mentioned as a secondary outcome or shared responsibility.
   - **0-1**: No growth-specific requirements found.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-06b-score-growth-pm-fit" \
  --description="Scoring the Growth-PM dimension. Uses signal taxonomy and growth KPIs (A/B testing, churn, CAC) to assign a 0-10 score for persona weighting." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `persona_scores.growth_pm` (Integer 0-10)
- Update: `jd_profile.persona_scores.growth_pm`

### Validation Checklist
- [ ] Growth-PM score is an integer between 0 and 10.
- [ ] Rationale for score is documented.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-06b. Growth-PM score: [N]. Session variables updated." \
  --set-metadata last_completed_step=step-06b \
  --set-metadata session_variables='{"persona_scores": {"growth_pm": [N]}}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Growth-PM score [N] assigned based on [X] growth-focused requirements and metrics." \
  --json
```

**Next:** `step-06c-score-strategy-pm-fit.md`
