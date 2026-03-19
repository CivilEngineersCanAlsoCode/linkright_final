# Step 12: Map Requirements to Signals

## Workflow: sync.portfolio-deploy / Phase I: Narrative Mapping

## Agent: Sync-Linker

---

### Objective
Map each P0/P1 JD requirement to the single best signal from the updated `top_signals[]` pool.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-narrative-strategies.md`
- Requires: `jd_profile.requirements.hard[]` (from Phase B)
- Requires: `top_signals[]` (from Phase H)

### Hard Stop Conditions
- IF `top_signals[]` is empty → Surface error: "No signals available to map."

### Process

1. [READ] Load all `top_signals[]` and JD requirements.
2. [MATCH] For each P0 requirement, perform semantic matching to find the top signal.
   - Priority 1: High `composite_score`.
   - Priority 2: Matches `persona_fit_primary`.
   - Priority 3: Matches `company_brief.pm_culture`.
3. [ALLOCATE] Assign the best signal to the requirement.
   - Each signal can be used multiple times if it's high-density, but ideally diversify across roles.
4. [MAP] Build the `requirement_signal_map`:
   - `requirement_id` → `signal_id`
5. [LOG] Surface the match rate: "Matched [N] of [M] hard requirements with signals."

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-12-map-requirements-to-signals" \
  --description="Mapping job requirements to user signals. This step creates the 'logical skeleton' of the resume, ensuring that every mandatory JD expectation is met with specific evidence from the user's library." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `requirement_signal_map`

### Validation Checklist
- [ ] Every P0 requirement has at least one associated signal.
- [ ] No requirement is left unmatched without a gap flag.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-12. Requirement-Signal map generated. Session variables updated." \
  --set-metadata last_completed_step=step-12 \
  --set-metadata session_variables='{"requirement_map_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Successfully mapped [N] requirements to high-impact signals from the pool." \
  --json
```

**Next:** `step-13a-plan-summary-positioning.md`
