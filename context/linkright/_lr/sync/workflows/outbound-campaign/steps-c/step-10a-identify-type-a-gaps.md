# Step 10a: Identify Type A Gaps

## Workflow: sync.outbound-campaign / Phase G: Gap Analysis

## Agent: Sync-Linker

---

### Objective
Identify all hard requirements in the JD that have ZERO matching signals in the user's current signal library pool (Critical Absences).

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-signal-gap-taxonomy.md`
- Requires: `jd_profile.requirements.hard[]` (from Phase B)
- Requires: `signal_coverage_map` (from Phase E)

### Hard Stop Conditions
- IF `jd_profile.requirements.hard` is empty → Surface error: "No requirements to check for gaps."

### Process

1. [READ] Load the list of mandatory hard requirements from `jd_profile`.
2. [COMPARE] For each hard requirement:
   - Check if the requirement's `signal_type` exists in the `signal_coverage_map`.
   - If the type exists, perform a keyword scan of the top signals' `raw_reflection` to see if the specific requirement is mentioned.
3. [IDENTIFY] If no match is found (by type or by content), categorize as a **Type A Gap** (Complete Gap).
4. [ASSEMBLE] Build the `type_a_gaps[]` array, including:
   - `requirement_text`
   - `signal_type`
   - `weight` (criticality)
5. [LOG] Surface the count of critical gaps identified.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-10a-identify-type-a-gaps" \
  --description="Identifying Type A Gaps (Critical Absences). This step finds mandatory JD requirements that are completely missing from the user's library, which will be the primary focus for the Inquisitor agent." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `type_a_gaps[]`

### Validation Checklist
- [ ] At least one gap is identified if keyword coverage is low.
- [ ] Gaps are linked to specific mandatory requirements.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-10a. [N] Type A gaps identified. Session variables updated." \
  --set-metadata last_completed_step=step-10a \
  --set-metadata session_variables='{"type_a_count": [N]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Identified [N] critical gaps (Type A) where mandatory requirements have zero signal coverage." \
  --json
```

**Next:** `step-10b-identify-type-b-gaps.md`
