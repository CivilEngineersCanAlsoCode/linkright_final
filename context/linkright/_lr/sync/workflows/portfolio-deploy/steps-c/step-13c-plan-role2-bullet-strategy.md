# Step 13c: Plan Role 2 Bullet Strategy

## Workflow: sync.portfolio-deploy / Phase I: Narrative Mapping

## Agent: Sync-Linker

---

### Objective
Map 3-4 supporting signals to the user's secondary role (Role 2), emphasizing complementary skills and experience depth.

### Dependencies
- Requires: `requirement_signal_map` (from step-12)
- Requires: `top_signals[]` (from Phase H)

### Hard Stop Conditions
- IF no signals are mapped to Role 2 → Surface error: "Role 2 has no mapped signals. Supporting evidence missing."

### Process

1. [READ] Load the `requirement_signal_map` and the user's career history for Role 2.
2. [ALLOCATE] Select 3-4 signals from Role 2 tenure.
3. [STRATEGIZE] Focus on "Evidence of Persistence" — show the skill has been used across multiple roles.
   - Use `persona_fit_secondary` as a secondary anchor if applicable.
4. [DOCUMENT] Populate the Role 2 section in `sync-narrative-plan.md`.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-13c-plan-role2-bullet-strategy" \
  --description="Planning the bullet points for the user's secondary role. These signals provide the 'depth' of experience, proving the user has a consistent track record in their core competencies." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/planning-artifacts/sync-narrative-plan-[uuid].md` (Updated)

### Validation Checklist
- [ ] At least 3 signals are planned for the secondary role.
- [ ] Rationale for signal selection is consistent with the narrative plan.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-13c. Role 2 strategy mapped. Session variables updated." \
  --set-metadata last_completed_step=step-13c \
  --set-metadata session_variables='{"role2_strategy_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Planned [N] bullets for Role 2 with focused narrative angles." \
  --json
```

**Next:** `step-13d-plan-role3-bullet-strategy.md`
