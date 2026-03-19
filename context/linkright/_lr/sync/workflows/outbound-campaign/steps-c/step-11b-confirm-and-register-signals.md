# Step 11b: Confirm and Register Signals

## Workflow: sync.outbound-campaign / Phase H: Inquisitor Gap Fill

## Agent: Sync-Inquisitor

---

### Objective
Parse raw user responses into structured career signals, confirm accuracy with the user, and register them into the session context.

### Dependencies
- Requires: `raw_user_responses[]` (from step-11/11a)

### Hard Stop Conditions
- IF `raw_user_responses[]` is empty AND `inquisitor_queue[]` was not empty → Surface error: "No responses collected from Inquisitor session."

### Process

1. [READ] Load the `raw_user_responses[]`.
2. [PARSE] Convert each raw response into a structured Signal Object:
   - `signal_type`: Auto-categorize (Tech/Growth/Strategy/Product).
   - `metric_density`: Calculate based on numbers in response.
   - `ownership_level`: Infer from "I did" vs "We did".
   - `raw_reflection`: The verbatim response text.
3. [UPDATE] For Type C responses, update the existing signal metrics in `top_signals[]`.
4. [CREATE] For Type A responses, create new signal IDs (e.g., `sig-temp-[uuid]`) and add to `top_signals[]`.
5. [CONFIRM] Surface structured signals to user: "I've registered these new signals: [Summary]. Is this correct? (Y/N)".
6. [LOG] Update `session_variables` with the final `top_signals[]` pool.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-11b-confirm-and-register-signals" \
  --description="Finalizing the Inquisitor results. This step takes the raw user interview data, structures it into B-MAD signal objects, and registers them into the active session context for use in narrative mapping." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `top_signals[]` (Updated/Expanded)

### Validation Checklist
- [ ] At least one new or deepened signal exists in the pool.
- [ ] User has confirmed the structured interpretation.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed Phase H. [N] signals updated/registered. Session variables updated." \
  --set-metadata last_completed_step=step-11b \
  --set-metadata session_variables='{"signals_finalized": true, "pool_size": [N]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Successfully registered [N] new/deepened signals into the session context from the Inquisitor session." \
  --json
```

**Phase Complete.** → Load: `step-12-map-requirements-to-signals.md` (Phase I)
