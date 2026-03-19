# Step 08a: Filter by Persona Relevance

## Workflow: sync.outbound-campaign / Phase E: Signal Retrieval

## Agent: Sync-Linker

---

### Objective
Filter the `raw_retrieved_signals[]` to ensure all candidates meet the minimum relevance threshold for the primary persona tilt.

### Dependencies
- Requires: `raw_retrieved_signals[]` (from step-08)
- Requires: `persona_fit_primary` (from Phase D)

### Hard Stop Conditions
- IF all signals are filtered out → Surface error: "All retrieved signals failed persona relevance check. Relaxing constraints or manual review needed."

### Process

1. [READ] Load the `raw_retrieved_signals[]` array.
2. [EVALUATE] For each signal in the array, check the following criteria:
   - `persona_relevance.[primary_persona]` >= 2.
   - If the signal score is < 2 for the primary persona but >= 2 for the secondary persona: retain but flag as `secondary_fit`.
3. [FILTER] Discard any signal where both primary and secondary persona relevance is < 2.
4. [ASSEMBLE] Create the `filtered_signals[]` array.
5. [LOG] Record the count of retained vs. discarded signals.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-08a-filter-by-persona-relevance" \
  --description="Filtering the 15 candidate signals based on persona alignment. This ensures that the retrieved experience is not just semantically similar, but also fits the 'Tech/Growth/Strategy/Product' tilt selected for the resume." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `filtered_signals[]`

### Validation Checklist
- [ ] At least 5 signals remain in `filtered_signals[]`.
- [ ] Any signals with persona relevance < 2 have been discarded.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-08a. [N] signals passed persona filter. Session variables updated." \
  --set-metadata last_completed_step=step-08a \
  --set-metadata session_variables='{"filtered_count": [N]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Filtered candidate pool to [N] signals based on persona alignment." \
  --json
```

**Next:** `step-08b-rank-by-metric-density.md`
