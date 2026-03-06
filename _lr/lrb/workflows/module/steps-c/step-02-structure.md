---
name: "step-02-structure"
description: "Create the module directory structure"

nextStepFile: "./step-03-config.md"
moduleStandardsFile: "../data/module-standards.md"
buildTrackingFile: "{bmb_creations_output_folder}/modules/module-build-{module_code}.md"
---

# Step 2: Directory Structure

## STEP GOAL:

Create the module directory structure based on the module type.

---

## MANDATORY SEQUENCE

### 1. Determine Target Location

**IF Standalone:** `_lr/{module_code}/`
**IF Extension:** `_lr/{base_module_code}/extensions/{extension_folder_name}/`
**IF Global:** `_lr/{module_code}/`

### 2. Present Structure Plan

"**I'll create this directory structure at {target_location}:**"

- `agents/`
- `workflows/`
- `module.yaml`
- `README.md`

### 3. Confirm and Create

"**Shall I create the directory structure?**"
**IF confirmed:** Create the folders.

### 4. Update Build Tracking

Add `step-02-structure` to `stepsCompleted` and set `targetLocation`.

### 5. Report Success

"**✓ Directory structure created at:** {target_location}"

### 6. Present MENU OPTIONS

[C] Continue

---

## Success Metrics

- Directory structure created.
- Build tracking updated.
