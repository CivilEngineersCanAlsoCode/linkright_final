# Step 17c: Sizer-Refiner Iterate

## Workflow: sync.portfolio-deploy / Phase K: Layout Validation

## Agent: Sync-Sizer

---

### Objective
Execute targeted reframing of flagged bullets to resolve layout violations (overflows/widows) while maintaining the original semantic meaning and metric strength.

### Dependencies
- Requires: `overflow_bullets[]`, `widow_bullets[]` (from step-17a)
- Requires: `optimized-resume.md` (from Phase J)

### Hard Stop Conditions
- IF no layout violations were found → Skip to Phase L.

### Process

1. [READ] Load the violations from step-17a.
2. [REFRAME] For each flagged bullet:
   - Identify redundant words or passive phrasing.
   - Re-draft the bullet to fit the line constraints (e.g., "Achieved a reduction in X" → "Reduced X").
   - Ensure the `metric` and `result` remain unchanged.
3. [UPDATE] Replace the old bullets in `optimized-resume.md` with the reframed versions.
4. [VALIDATE] Re-run the character count check to ensure the new versions pass.
5. [LOG] Surface the final status: "All layout violations resolved."

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-17c-sizer-refiner-iterate" \
  --description="Iteratively reframing resume copy to resolve layout issues. This step ensures that the final text is not just strategically sound but also visually perfect, fitting every bullet within the grid constraints." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `optimized-resume.md` (Layout Finalized)

### Validation Checklist
- [ ] No widows or overflows remain in the finalized artifact.
- [ ] Semantic meaning of bullets is preserved after reframing.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed Phase K. Layout finalized. Session variables updated." \
  --set-metadata last_completed_step=step-17c \
  --set-metadata session_variables='{"layout_finalized": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Successfully reframed [N] bullets to resolve layout violations. Artifact ready for styling." \
  --json
```

**Phase Complete.** → Load: `step-18-select-resume-template.md` (Phase L)
