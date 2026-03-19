# Step 08c: Group by Signal Type

## Workflow: sync.jd-optimize / Phase E: Signal Retrieval

## Agent: Sync-Linker

---

### Objective
Group the `top_signals[]` by their signal type to identify coverage levels and potential gaps relative to the JD requirements.

### Dependencies
- Requires: `top_signals[]` (from step-08b)
- Requires: `jd_profile.requirements.hard[]` (from Phase B)

### Hard Stop Conditions
- IF `top_signals[]` is empty → Surface error: "No signals available for grouping. Re-run Phase E."

### Process

1. [READ] Load the `top_signals[]` array.
2. [GROUP] Categorize each signal into its corresponding `signal_type` from the 9-category taxonomy.
3. [MAP] Build the `signal_coverage_map`:
   - `signal_type` → [Array of Signal IDs]
4. [ANALYZE] Compare the map against the JD requirement categories in `jd_profile.requirements.hard[]`:
   - Identify `gap_types[]`: Required signal types with zero matching signals in `top_signals[]`.
   - Identify `thin_coverage[]`: Required signal types with only 1 matching signal.
5. [LOG] Surface a coverage summary to the session notes: "Coverage: [Map Summary]. Gaps: [Gap Types]".

### Beads Task

```bash
bd create "sync.jd-optimize.step-08c-group-by-signal-type" \
  --description="Grouping top signals by type. This step provides the high-level 'inventory' of available material, identifying where the user has strong coverage vs. where gaps exist before entering the scoring phase." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `signal_coverage_map`
- Variable: `gap_types[]`
- Variable: `thin_coverage[]`

### Validation Checklist
- [ ] Every signal in `top_signals[]` is categorized.
- [ ] `gap_types[]` correctly identifies missing mandatory requirement types.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-08c. Signal coverage map generated. Session variables updated." \
  --set-metadata last_completed_step=step-08c \
  --set-metadata session_variables='{"coverage_map_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Coverage map generated; identified [N] gap types and [M] types with thin coverage." \
  --json
```

**Phase Complete.** → Load: `step-09a-score-keyword-coverage.md` (Phase F)
