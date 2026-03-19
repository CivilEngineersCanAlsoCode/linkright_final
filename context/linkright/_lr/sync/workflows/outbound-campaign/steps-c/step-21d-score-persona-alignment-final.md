# Step 21d: Score Persona Alignment (Final)

## Workflow: sync.outbound-campaign / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Calculate the final persona alignment score (max 20) by auditing the tone and focus of the optimized resume against the primary persona tilt.

### Dependencies
- Requires: `optimized-resume.md` (from Phase K)
- Requires: `persona_fit_primary` (from Phase D)

### Hard Stop Conditions
- IF `optimized-resume.md` is missing → Surface error: "No artifact to score."

### Process

1. [READ] Load the finalized `optimized-resume.md`.
2. [EVALUATE] Analyze the "tilt" of the resume copy:
   - Identify persona-specific keywords and phrasing.
   - Example: If Tech-PM, look for "spec", "PRD", "engineering", "technical trade-off".
3. [MATCH] Score the alignment from 0-20 based on how consistently the copy reflects the `persona_fit_primary` choice.
4. [SCORE] Record the `final_dim4_persona` score.
5. [LOG] Surface the result: "Final persona alignment score: [score]/20".

### Beads Task

```bash
bd create "sync.outbound-campaign.step-21d-score-persona-alignment-final" \
  --description="Scoring the final persona alignment. This step ensures that the 'tone of voice' and strategic focus of the resume consistently reflect the selected persona (Tech/Growth/Strategy/Product) throughout the document." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `final_dim4_persona` (Float 0-20)

### Validation Checklist
- [ ] Resume tone is consistently aligned with the primary persona.
- [ ] No major tone shifts detected between roles.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-21d. Final Persona Score: [S]/20. Session variables updated." \
  --set-metadata last_completed_step=step-21d \
  --set-metadata session_variables='{"final_dim4": [score]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Final persona alignment score [S]/20 assigned based on consistent '[P]' tone." \
  --json
```

**Next:** `step-21e-score-scope-match-final.md`
