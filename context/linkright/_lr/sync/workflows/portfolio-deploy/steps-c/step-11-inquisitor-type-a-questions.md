# Step 11: Inquisitor Type A Questions

## Workflow: sync.portfolio-deploy / Phase H: Inquisitor Gap Fill

## Agent: Sync-Inquisitor

---

### Objective
Generate the specific interview questions required to extract raw career signals for Type A Gaps (Critical Absences).

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-inquisitor-prompts.md`
- Requires: `type_a_gaps[]` (from Phase G)
- Blocks: `step-11b-confirm-and-register-signals.md`

### Hard Stop Conditions
- IF `type_a_gaps[]` is empty AND `type_b/c` are also empty → Skip Phase H.

### Process

1. [READ] Load the list of Type A Gaps from `type_a_gaps[]`.
2. [CONSTRUCT] For each critical gap, generate a high-signal interview question:
   - "Think back to [Year/Role]. Did you ever [Requirement]? Tell me about a specific time when you owned [Outcome]."
   - Use the `signal_type` taxonomy to focus the question (e.g., if Technical, ask for architecture details).
3. [FORMAT] Assemble the `inquisitor_queue[]` of questions.
4. [PROMPT] Surface the first question to the user and wait for raw text/voice response.
5. [COLLECT] Store the user's raw response in the session metadata.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-11-inquisitor-type-a-questions" \
  --description="Executing the Inquisitor for Type A gaps. This step prompts the user for missing career signals, turning 'gaps' into 'evidence' through targeted interview questions." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `inquisitor_queue[]`
- Variable: `raw_user_responses[]`

### Validation Checklist
- [ ] Questions are specific, not generic.
- [ ] Every Type A gap has a corresponding question in the queue.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-11. [N] questions generated. Session variables updated." \
  --set-metadata last_completed_step=step-11 \
  --set-metadata session_variables='{"inquisitor_ready": true, "question_count": [N]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Generated [N] targeted questions for critical Type A gaps and initiated user interview." \
  --json
```

**Next:** `step-11a-inquisitor-type-c-deepening.md`
