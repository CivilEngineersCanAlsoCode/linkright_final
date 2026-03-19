# Step 13b: Plan Role 1 Bullet Strategy

## Workflow: sync.jd-optimize / Phase I: Narrative Mapping

## Agent: Sync-Linker

---

### Objective
Map 4-5 high-impact signals to the most recent professional role (Role 1), tailoring them to the JD's P0 requirements.

### Dependencies
- Requires: `requirement_signal_map` (from step-12)
- Requires: `top_signals[]` (from Phase H)

### Hard Stop Conditions
- IF no signals are mapped to Role 1 → Surface error: "Role 1 (most recent) has no mapped signals. Check signal-to-requirement mapping."

### Process

1. [READ] Load the `requirement_signal_map` and the user's career history for Role 1.
2. [ALLOCATE] Select 4-5 signals that occurred during Role 1 tenure and map to JD requirements.
3. [STRATEGIZE] For each selected signal, define the `narrative_angle`:
   - If Gap Type A/B/C: Define remediation strategy (Learn/Reframe/Offset).
   - If Match: Focus on "Mirroring" JD language and "Amplifying" the metric.
4. [DOCUMENT] Populate the Role 1 section in `sync-narrative-plan.md`.

### Beads Task

```bash
bd create "sync.jd-optimize.step-13b-plan-role1-bullet-strategy" \
  --description="Planning the bullet points for the user's most recent role. This step selects the best 4-5 signals and defines the narrative 'angle' for each, ensuring they align perfectly with the hiring company's top priorities." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/planning-artifacts/sync-narrative-plan-[uuid].md` (Updated)

### Validation Checklist
- [ ] At least 4 signals are planned for the primary role.
- [ ] Every planned bullet has a designated signal ID and narrative angle.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-13b. Role 1 strategy mapped. Session variables updated." \
  --set-metadata last_completed_step=step-13b \
  --set-metadata session_variables='{"role1_strategy_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Planned [N] bullets for Role 1 with specific narrative angles for each." \
  --json
```

**Next:** `step-13c-plan-role2-bullet-strategy.md`
