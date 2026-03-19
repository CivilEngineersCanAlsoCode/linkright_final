# Step 06e: Select Primary Persona

## Workflow: sync.outbound-campaign / Phase D: Persona Scoring

## Agent: Sync-Linker

---

### Objective
Select the primary and secondary persona "tilts" for the resume based on the aggregate scores from steps 06a-06d.

### Dependencies
- Requires: `persona_scores` {tech_pm, growth_pm, strategy_pm, product_pm} (from steps 06a-06d)
- Blocks: Phase E (Signal Retrieval)

### Hard Stop Conditions
- IF all `persona_scores` are zero → Surface error: "Could not determine persona. Manual override required."

### Process

1. [READ] Load the 4 dimension scores: `tech_pm`, `growth_pm`, `strategy_pm`, `product_pm`.
2. [SELECT] Identify the dimension with the highest score as `persona_fit_primary`.
3. [SELECT] Identify the dimension with the 2nd highest score as `persona_fit_secondary` (only if the score is ≥ 5).
4. [TIE-BREAKER] If the top two scores are within 1 point of each other:
   - Request user preference via prompt.
   - Or default to the dimension that matches the `company_brief.pm_culture` most closely.
5. [DOCUMENT] Write the rationale for the selection in the session notes.
6. [UPDATE] Update `jd_profile` with:
   - `persona_fit_primary`
   - `persona_fit_secondary`
   - `persona_scores` (finalized dictionary)
7. [CONFIRM] Present selection to user: "Primary tilt: [persona] ([score]/10). This changes how every bullet is written. Proceed? (Y/N)"

### Beads Task

```bash
bd create "sync.outbound-campaign.step-06e-select-primary-persona" \
  --description="Finalizing the persona selection (Tech/Growth/Strategy/Product). This decision is critical as it cascades into the narrative mapping and content writing phases." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `jd_profile.persona_fit_primary`
- Variable: `jd_profile.persona_fit_secondary`

### Validation Checklist
- [ ] Primary persona is explicitly confirmed by the agent or user.
- [ ] Selection is backed by the highest score in the dimension matrix.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-06e. Selected Primary Persona: [persona]. Session variables updated." \
  --set-metadata last_completed_step=step-06e \
  --set-metadata session_variables='{"persona_fit_primary": "[persona]", "persona_fit_secondary": "[persona2]"}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Primary persona '[persona]' selected based on highest dimension score of [N]/10." \
  --json
```

**Phase Complete.** → Load: `step-07-construct-retrieval-query.md` (Phase E)
