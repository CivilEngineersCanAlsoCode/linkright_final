# Step 13e: Plan Skills Ordering

## Workflow: sync.portfolio-deploy / Phase I: Narrative Mapping

## Agent: Sync-Linker

---

### Objective
Organize and prioritize the skills section categories to match the JD's keyword density and the selected persona tilt.

### Dependencies
- Requires: `jd_profile.keywords_ats[]` (from Phase B)
- Requires: `persona_fit_primary` (from Phase D)

### Hard Stop Conditions
- IF `jd_profile.keywords_ats` is empty → Surface error: "No keywords found to order skills."

### Process

1. [READ] Load the `jd_profile.keywords_ats[]` and `persona_fit_primary`.
2. [GROUP] Categorize all skills from the user's library into 3 standard sections:
   - **Category 1 (Primary):** Technical skills matching P0 requirements + `persona_fit_primary`.
   - **Category 2 (Secondary):** Domain/Soft skills matching P1 requirements.
   - **Category 3 (Foundational):** Tools, methodologies, and supporting technologies.
3. [ORDER] Rank keywords within each category by their appearance frequency in the JD.
4. [DOCUMENT] Populate the Skills section in `sync-narrative-plan.md`.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-13e-plan-skills-ordering" \
  --description="Planning the skills section layout. This step ensures that the most relevant technical and domain keywords are surfaced first, satisfying both ATS parsers and human recruiters." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/planning-artifacts/sync-narrative-plan-[uuid].md` (Updated)

### Validation Checklist
- [ ] Skills are grouped into at least 3 logical categories.
- [ ] The first category is dominated by P0-relevant technical keywords.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-13e. Skills ordering finalized. Session variables updated." \
  --set-metadata last_completed_step=step-13e \
  --set-metadata session_variables='{"skills_plan_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Finalized skills section ordering across 3 categories with [N] total keywords." \
  --json
```

**Next:** `step-13f-user-confirm-narrative-plan.md`
