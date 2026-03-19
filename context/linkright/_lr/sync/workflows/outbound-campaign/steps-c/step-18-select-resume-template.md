# Step 18: Select Resume Template

## Workflow: sync.outbound-campaign / Phase L: Styling & Compile

## Agent: Sync-Styler

---

### Objective
Select the most appropriate visual template for the resume based on the company stage and target persona.

### Dependencies
- Load: `_lr/sync/workflows/jd-optimize/templates/manifest.yaml` (List of available templates)
- Requires: `company_brief.stage` (from Phase C)
- Requires: `persona_fit_primary` (from Phase D)

### Hard Stop Conditions
- IF no templates are available → Surface error: "Template library empty."

### Process

1. [READ] Load the list of available resume templates (Modern, Classic, Creative, Minimal).
2. [EVALUATE] Apply selection logic:
   - **Startup/Scale-up**: Select "Modern" or "Minimal" (clean, high-energy).
   - **Enterprise/FAANG**: Select "Classic" or "Standard" (traditional, professional).
   - **Design-led/Creative**: Select "Creative" (unique layout).
3. [MATCH] Align template choice with `persona_fit_primary` (e.g., Tech-PM prefers "Minimal/Clean").
4. [SELECT] Assign the `target_template_id`.
5. [LOG] Surface the selection: "Selected template: [ID] based on [Stage/Persona]."

### Beads Task

```bash
bd create "sync.outbound-campaign.step-18-select-resume-template" \
  --description="Selecting the visual template for the final resume. This step ensures that the 'look and feel' of the document matches the cultural expectations of the target company." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `target_template_id`

### Validation Checklist
- [ ] Template selection is justified by company stage and persona.
- [ ] The template ID exists in the manifest.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-18. Template: [ID]. Session variables updated." \
  --set-metadata last_completed_step=step-18 \
  --set-metadata session_variables='{"template_selected": "[ID]"}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Selected '[ID]' template based on [S] stage and [P] persona fit." \
  --json
```

**Next:** `step-19-inject-company-branding.md`
