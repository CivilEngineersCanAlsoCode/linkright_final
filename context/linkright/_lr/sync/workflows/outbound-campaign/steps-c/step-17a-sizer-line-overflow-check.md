# Step 17a: Sizer Line Overflow Check

## Workflow: sync.outbound-campaign / Phase K: Layout Validation

## Agent: Sync-Sizer

---

### Objective
Audit the `optimized-resume.md` for any bullet points that exceed 2 lines or have "widow" words (single words on the last line).

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/data/sync-layout-constraints.yaml`
- Requires: `optimized-resume.md` (from Phase J)

### Hard Stop Conditions
- IF `optimized-resume.md` is missing → Surface error: "No content to validate."

### Process

1. [READ] Load the draft `optimized-resume.md`.
2. [SCAN] For each bullet point:
   - Calculate the estimated character count (assuming 80-90 chars per line).
   - Flag any bullet point exceeding 170 characters (2 lines).
   - Flag any bullet point where the last line contains only 1 word or < 10 characters.
3. [IDENTIFY] List all `overflow_bullets[]` and `widow_bullets[]`.
4. [LOG] Surface the count of layout violations found.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-17a-sizer-line-overflow-check" \
  --description="Auditing resume layout for line overflows and widow words. This step ensures that the content fits perfectly within professional layout constraints, preventing awkward spacing and maximizing white space." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `overflow_bullets[]`
- Variable: `widow_bullets[]`

### Validation Checklist
- [ ] No bullet point exceeds the 170-character threshold.
- [ ] No widows exist in the draft copy.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-17a. [N] overflows detected. Session variables updated." \
  --set-metadata last_completed_step=step-17a \
  --set-metadata session_variables='{"layout_violations_count": [N]}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Line overflow audit complete; identified [N] bullets for reframing." \
  --json
```

**Next:** `step-17b-sizer-page-budget-check.md`
