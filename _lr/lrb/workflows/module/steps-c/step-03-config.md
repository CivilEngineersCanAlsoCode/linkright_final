---
name: "step-03-config"
description: "Generate module.yaml with install questions"

nextStepFile: "./step-04-agents.md"
moduleYamlConventionsFile: "../data/module-yaml-conventions.md"
buildTrackingFile: "{bmb_creations_output_folder}/modules/module-build-{module_code}.md"
targetLocation: "{build_tracking_targetLocation}"
---

# Step 3: Module Configuration

## STEP GOAL:

Generate `module.yaml` with install configuration and custom variables.

---

## MANDATORY SEQUENCE

### 1. Load Conventions

Load `{moduleYamlConventionsFile}` for reference.

### 2. Generate Base module.yaml

Create `{targetLocation}/module.yaml` with:

- `code`, `name`, `header`, `subheader`, `default_selected`.

### 3. Add Custom Variables

"**Does your module need any custom configuration variables?**"
Ask about user inputs, paths, or settings needed during installation.

### 4. Write module.yaml

Write the complete file to the target location.

### 5. Update Build Tracking

Add `step-03-config` to `stepsCompleted`.

### 6. Report and Confirm

"**✓ module.yaml created with {count} custom variables.** Review the file."

### 7. Present MENU OPTIONS

[C] Continue

---

## Success Metrics

- `module.yaml` created with required fields.
- Custom variables added (if any).
- Build tracking updated.
