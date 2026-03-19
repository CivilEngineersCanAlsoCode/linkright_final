# Step 11a: Inquisitor Type C Deepening

## Workflow: sync.portfolio-deploy / Phase H: Inquisitor Gap Fill

## Agent: Sync-Inquisitor

---

### Objective
Generate the specific metric-focused questions required to deepen Type C Gaps (Metric Gaps) within existing signals.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-inquisitor-prompts.md`
- Requires: `type_c_gaps[]` (from Phase G)

### Hard Stop Conditions
- IF `type_c_gaps[]` is empty → Proceed to `step-11b`.

### Process

1. [READ] Load the list of Type C Gaps from `type_c_gaps[]`.
2. [CONSTRUCT] For each metric gap, generate a deepening question focused on the missing dimension:
   - "For your [Signal Title] at [Role], what was the specific outcome in terms of [Missing Metric Type]? (e.g., % growth, user count, budget size)."
   - "How many [People/Users/Teams] were impacted by this decision?"
3. [FORMAT] Append to the `inquisitor_queue[]`.
4. [PROMPT] Surface the next question to the user and collect raw data.
5. [COLLECT] Store user's raw metric responses in the session metadata.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-11a-inquisitor-type-c-deepening" \
  --description="Executing the Inquisitor for Type C gaps. This step targets 'weak' metrics, prompting the user for specific numbers and quantifiable outcomes to turn 'good' signals into 'great' ones." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `inquisitor_queue[]` (Appended)
- Variable: `raw_user_responses[]` (Appended)

### Validation Checklist
- [ ] Questions explicitly target the missing metric types identified in Phase G.
- [ ] User response contains at least one numerical signal.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-11a. [N] metric questions generated. Session variables updated." \
  --set-metadata last_completed_step=step-11a \
  --set-metadata session_variables='{"inquisitor_deepening_ready": true, "question_count_total": [Total]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Generated [N] metric-deepening questions for existing signals (Type C gaps)." \
  --json
```

**Next:** `step-11b-confirm-and-register-signals.md`
