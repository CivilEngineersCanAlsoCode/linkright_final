# Step 09d: Score Persona Alignment

## Workflow: sync.outbound-campaign / Phase F: Baseline Scoring

## Agent: Sync-Linker

---

### Objective
Score ONLY the persona alignment dimension (max 20) by measuring how well the `top_signals[]` fit the `persona_fit_primary` tilt.

### Dependencies
- Requires: `persona_fit_primary` (from Phase D)
- Requires: `top_signals[].persona_relevance` (from Phase E)

### Hard Stop Conditions
- IF `persona_fit_primary` is null → Surface error: "No primary persona identified."

### Process

1. [EXTRACT] For each signal in `top_signals[]`, retrieve the `persona_relevance` score for the `primary_persona`.
2. [CALCULATE] Compute the average persona relevance:
   - `avg_persona = sum(relevance_primary) / count(signals)`
3. [NORMALIZE] Map the average (0-3 scale) to a 20-point scale:
   - `score = (avg_persona / 3) * 20`
4. [SCORE] Record the `baseline_dim4_persona` score.
5. [LOG] Document the result: "Primary persona alignment: [avg] = [score]/20".

### Beads Task

```bash
bd create "sync.outbound-campaign.step-09d-score-persona-alignment" \
  --description="Scoring the persona alignment dimension (max 20). This measures how well the retrieved signals fit the specific 'tilt' (Tech/Growth/Strategy/Product) required by the target role." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `baseline_dim4_persona` (Float 0-20)

### Validation Checklist
- [ ] Average calculation correctly targets the primary persona.
- [ ] Final score reflects the qualitative fit of the experience pool.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-09d. Persona Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-09d \
  --set-metadata session_variables='{"baseline_dim4": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Persona alignment score [S]/20 assigned based on [A] average relevance to '[P]' persona." \
  --json
```

**Next:** `step-09e-score-scope-match.md`
