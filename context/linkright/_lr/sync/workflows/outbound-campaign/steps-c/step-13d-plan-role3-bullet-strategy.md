# Step 13d: Plan Role 3 Bullet Strategy

## Workflow: sync.outbound-campaign / Phase I: Narrative Mapping

## Agent: Sync-Linker

---

### Objective
Map 2-3 foundation signals to the user's earlier professional experience (Role 3), emphasizing foundational skills and career growth trajectory.

### Dependencies
- Requires: `requirement_signal_map` (from step-12)
- Requires: `top_signals[]` (from Phase H)

### Hard Stop Conditions
- IF no signals are mapped to Role 3 → Surface error: "Role 3 has no mapped signals. Career trajectory evidence missing."

### Process

1. [READ] Load the `requirement_signal_map` and the user's career history for Role 3.
2. [ALLOCATE] Select 2-3 signals from Role 3 tenure.
3. [STRATEGIZE] Focus on "Foundational Competence" — show the earliest evidence of the skills required by the current JD.
4. [DOCUMENT] Populate the Role 3 section in `sync-narrative-plan.md`.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-13d-plan-role3-bullet-strategy" \
  --description="Planning the bullet points for the user's tertiary role. These signals show the early 'foundation' of the user's career, completing the narrative arc of growth and long-term skill acquisition." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/planning-artifacts/sync-narrative-plan-[uuid].md` (Updated)

### Validation Checklist
- [ ] At least 2 signals are planned for the tertiary role.
- [ ] Strategic angle focuses on "foundational" expertise.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-13d. Role 3 strategy mapped. Session variables updated." \
  --set-metadata last_completed_step=step-13d \
  --set-metadata session_variables='{"role3_strategy_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Planned [N] bullets for Role 3 with foundational narrative angles." \
  --json
```

**Next:** `step-13e-plan-skills-ordering.md`
