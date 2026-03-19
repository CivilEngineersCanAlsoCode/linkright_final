# Step 20: Compile HTML/CSS

## Workflow: sync.portfolio-deploy / Phase L: Styling & Compile

## Agent: Sync-Styler

---

### Objective
Compile the finalized resume content, template, and branding configuration into a production-ready HTML/CSS artifact.

### Dependencies
- Requires: `optimized-resume.md` (from Phase K)
- Requires: `target_template_id`, `styled_config` (from Phase L)

### Hard Stop Conditions
- IF template compilation fails → Surface error: "Template syntax error. Check `styled_config`."

### Process

1. [READ] Load the Markdown content from `optimized-resume.md`.
2. [COMPILE] Execute the Sync compiler engine:
   - Inject Markdown content into the `target_template_id`.
   - Apply `styled_config` (CSS variables/styles).
   - Generate static HTML/CSS.
3. [EVALUATE] Perform a final visual sanity check:
   - Ensure all sections are present.
   - Verify that brand colors are active.
4. [SAVE] Write the output to the session's export directory.
5. [LOG] Surface the file path to the user.

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-20-compile-html-css" \
  --description="Compiling the final resume artifact. This step assembles all previous work (content, layout, branding) into a single, high-fidelity HTML/CSS document, ready for export or conversion to PDF." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Artifact: `sync-output/optimized-artifacts/resume-[uuid].html`
- Artifact: `sync-output/optimized-artifacts/resume-[uuid].css`

### Validation Checklist
- [ ] HTML file is valid and includes all resume sections.
- [ ] CSS file includes the injected brand variables.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed Phase L. Resume compiled. Session variables updated." \
  --set-metadata last_completed_step=step-20 \
  --set-metadata session_variables='{"compilation_complete": true, "output_path": "[PATH]"}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Successfully compiled the resume into HTML/CSS format. Artifact stored at [PATH]." \
  --json
```

**Phase Complete.** → Load: `step-21a-score-keyword-coverage-final.md` (Phase M)
