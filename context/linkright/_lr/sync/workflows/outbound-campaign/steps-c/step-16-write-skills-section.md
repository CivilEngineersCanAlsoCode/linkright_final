# Step 16: Write Skills Section

## Workflow: sync.outbound-campaign / Phase J: Content Writing

## Agent: Sync-Writer

---

### Objective
Generate the finalized skills section, organized into 3 prioritized categories as defined in the narrative plan.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/templates/sync-optimized-resume.template.md`
- Requires: `sync-narrative-plan.md` (from Phase I)

### Hard Stop Conditions
- IF `skills_plan_ready` is false in session metadata → Surface error: "Skills ordering plan missing."

### Process

1. [READ] Load the Skills section plan from `sync-narrative-plan.md`.
2. [WRITE] Generate the 3-category skills list:
   - Category 1: Top Technical/Persona Skills.
   - Category 2: Domain/Strategic Skills.
   - Category 3: Tools & Methodologies.
3. [FORMAT] Ensure all keywords are correctly spelled and formatted for ATS readability (comma-separated within categories).
4. [OUTPUT] Append the Skills section to the `optimized-resume.md` artifact.

### Beads Task

```bash
bd create "sync.outbound-campaign.step-16-write-skills-section" \
  --description="Generating the final skills section. This step organizes the user's technical and soft skills into 3 categorized blocks, ensuring maximum keyword density and logical flow for human readers." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/optimized-artifacts/optimized-resume-[uuid].md` (Updated)

### Validation Checklist
- [ ] Skills section is categorized into 3 distinct blocks.
- [ ] No duplicate keywords exist across categories.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed Phase J. Skills section written. Session variables updated." \
  --set-metadata last_completed_step=step-16 \
  --set-metadata session_variables='{"content_complete": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Final skills section generated and appended to the optimized resume artifact. Phase J complete." \
  --json
```

**Phase Complete.** → Load: `step-17a-sizer-line-overflow-check.md` (Phase K)
