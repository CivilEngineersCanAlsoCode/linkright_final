# Step 19: Inject Company Branding

## Workflow: sync.portfolio-deploy / Phase L: Styling & Compile

## Agent: Sync-Styler

---

### Objective
Apply the target company's visual identity (colors, tone) to the selected resume template.

### Dependencies
- Requires: `target_template_id` (from step-18)
- Requires: `company_brief.brand_color_primary`, `company_brief.tone_descriptor` (from Phase C)

### Hard Stop Conditions
- IF `brand_color_primary` is null → Use Sync default color (Deep Blue).

### Process

1. [READ] Load the `company_brief` branding signals.
2. [APPLY] Update the CSS variables for the selected template:
   - `--brand-primary`: Set to `brand_color_primary`.
   - `--font-style`: Set based on `tone_descriptor` (e.g., Serif for Formal, Sans-Serif for Modern).
3. [EVALUATE] Check contrast accessibility:
   - Ensure the brand color has sufficient contrast against white/background.
   - Adjust luminosity if necessary.
4. [ASSEMBLE] Create the `styled_config.json` for the compiler.
5. [LOG] Surface the branding summary: "Applied [Color] primary and [Style] typography."

### Beads Task

```bash
bd create "sync.portfolio-deploy.step-19-inject-company-branding" \
  --description="Injecting company-specific branding into the resume. This subtle visual alignment (using the company's primary color and typography style) signals 'cultural belonging' to human reviewers." \
  -t task \
  -p 0 \
  --deps discovered-from:[PARENT_TASK_ID] \
  --json
```

### Output
- Variable: `styled_config`

### Validation Checklist
- [ ] CSS variables are correctly mapped to company brand signals.
- [ ] Contrast check passes for the primary brand color.

### On Step Completion

```bash
# 1. Save Checkpoint (Mandatory)
bd update [STEP_VAR_NAME] \
  --notes="CHECKPOINT: Completed step-19. Branding injected. Session variables updated." \
  --set-metadata last_completed_step=step-19 \
  --set-metadata session_variables='{"branding_ready": true}' \
  --json

# 2. Close Step
bd close [STEP_VAR_NAME] \
  --reason "Company branding (Color: [C], Tone: [T]) successfully injected into the template config." \
  --json
```

**Next:** `step-20-compile-html-css.md`
