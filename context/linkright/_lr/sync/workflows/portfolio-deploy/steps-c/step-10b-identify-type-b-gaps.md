# Step 10b: Identify Type B Gaps

## Workflow: sync.portfolio-deploy / Phase G: Gap Analysis

## Agent: Sync-Linker

---

### Objective
Identify all retrieved signals that match JD requirements but are of low quality (Quality Gaps) or lack sufficient evidence depth.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-signal-gap-taxonomy.md`
- Requires: `top_signals[]` (from Phase E)

### Hard Stop Conditions
- IF `top_signals[]` is empty → Surface error: "No signals available for quality check."

### Process

1. [READ] Load the `top_signals[]` array.
2. [EVALUATE] For each signal, check the quality metrics:
   - **Quality Gap (Type B):** Signal exists but has a `metric_density` < 0.3 or a composite `quality_score` < 0.4.
3. [IDENTIFY] Flag signals where the experience matches the requirement but the *strength* of the evidence is insufficient for high-tier roles.
4. [ASSEMBLE] Build the `type_b_gaps[]` array, including:
   - `signal_id`
   - `current_metric_density`
   - `gap_description` (e.g., "Generic language used", "Lack of ownership indicators").
5. [LOG] Surface the count of quality gaps identified.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-10b-identify-type-b-gaps" \
  --description="Identifying Type B Gaps (Quality Gaps). This step finds signals that are 'weak' or 'generic'. These require deepening via the Inquisitor to add more context, ownership, or impact before they can be used effectively." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `type_b_gaps[]`

### Validation Checklist
- [ ] Low-density signals are correctly flagged.
- [ ] Gaps are actionable (describe exactly what is weak).

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-10b. [N] Type B gaps identified. Session variables updated." \
  --set-metadata last_completed_step=step-10b \
  --set-metadata session_variables='{"type_b_count": [N]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Identified [N] quality gaps (Type B) where existing signals lack sufficient evidence depth." \
  --json
```

**Next:** `step-10c-identify-type-c-gaps.md`
