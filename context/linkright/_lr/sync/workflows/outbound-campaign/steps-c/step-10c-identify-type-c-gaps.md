# Step 10c: Identify Type C Gaps

## Workflow: sync.outbound-campaign / Phase G: Gap Analysis

## Agent: Sync-Linker

---

### Objective
Identify all retrieved signals where the core experience exists but specific metrics or quantifiable outcomes are missing (Metric Gaps).

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-signal-gap-taxonomy.md`
- Requires: `top_signals[]` (from Phase E)

### Hard Stop Conditions
- IF `top_signals[]` is empty → Surface error: "No signals available for metric check."

### Process

1. [READ] Load the `top_signals[]` array.
2. [EVALUATE] For each signal, check the following criteria:
   - **Metric Gap (Type C):** Signal experience clearly matches a JD requirement, but `impact_metrics[]` is empty OR all existing metrics are marked as `unconfirmed` or `estimated`.
3. [IDENTIFY] Flag signals where the "story" is good but the "proof" (numbers) is missing.
4. [ASSEMBLE] Build the `type_c_gaps[]` array, including:
   - `signal_id`
   - `missing_metric_types[]` (e.g., "User count", "Timeframe", "Revenue %").
5. [LOG] Surface the count of metric gaps identified.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-10c-identify-type-c-gaps" \
  --description="Identifying Type C Gaps (Metric Gaps). This step finds signals where the user has the relevant experience but has not provided specific numbers. These are the highest-ROI gaps for the Inquisitor to fill, as they turn generic bullets into high-impact ones." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `type_c_gaps[]`

### Validation Checklist
- [ ] Signals with empty metrics are correctly identified.
- [ ] `missing_metric_types` provides clear guidance for the Inquisitor.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed Phase G. [N] Type C gaps identified. Session variables updated." \
  --set-metadata last_completed_step=step-10c \
  --set-metadata session_variables='{"type_c_count": [N], "total_gaps": [Total]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Identified [N] metric gaps (Type C) where specific quantifiable outcomes are missing from relevant signals." \
  --json
```

**Phase Complete.** → Load: `step-11-inquisitor-type-a-questions.md` (Phase H)
