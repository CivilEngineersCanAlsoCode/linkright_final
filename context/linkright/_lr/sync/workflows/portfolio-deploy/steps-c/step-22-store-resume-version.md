# Step 22: Store Resume Version

## Workflow: sync.portfolio-deploy / Phase M: Final Scoring & Store

## Agent: Sync-Auditor

---

### Objective
Register and store the final optimized resume version in the career database (MongoDB) and the local artifacts directory.

### Dependencies
- Requires: `optimized-resume.md`, `resume-[uuid].html` (from Phase L)
- Requires: `jd_id`, `cb_id` (from Phase B/C)

### Hard Stop Conditions
- IF database connection fails → Surface warning and ensure local file storage succeeds.

### Process

1. [GENERATE] Create a unique `rv_id` (Resume Version ID) for this artifact.
2. [METADATA] Assemble the version metadata object:
   - `rv_id`, `jd_id`, `cb_id`, `timestamp`.
   - `scores`: {baseline, final, uplift}.
   - `path`: Path to the HTML/CSS artifact.
3. [STORE] Save the metadata object to the `resume_versions` collection in MongoDB.
4. [SAVE] Copy the final artifacts to the user's permanent career-vault:
   - `permanent-vault/resumes/[company]-[role]-[rv_id].html`
5. [LOG] Surface the storage confirmation.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-22-store-resume-version" \
  --description="Storing the final resume version. This step registers the artifact in the career database and ensures it is safely archived in the user's permanent vault for future reference or applications." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `rv_id`
- Artifact: Permanent vault copy of resume.

### Validation Checklist
- [ ] Metadata is correctly formatted for MongoDB.
- [ ] Local file copy exists in the permanent vault.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-22. Version [ID] stored. Session variables updated." \
  --set-metadata last_completed_step=step-22 \
  --set-metadata session_variables='{"rv_id": "[rv_id]"}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Optimized resume version [ID] successfully stored in database and permanent vault." \
  --json
```

**Next:** `step-23-generate-optimization-report.md`
