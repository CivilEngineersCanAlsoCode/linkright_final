---
name: "step-01b-continue"
description: "Handle workflow continuation for Create mode"

workflowFile: "../workflow-create-module.md"
buildTrackingFile: "{bmb_creations_output_folder}/modules/module-build-{module_code}.md"
---

# Step 1b: Continue (Create Mode)


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## STEP GOAL:

Resume a paused Create mode session by loading the build tracking state and routing to the correct step.

---

## MANDATORY SEQUENCE

### 1. Welcome Back

"**Welcome back to the Module Builder! picking up where we left off.** 👋"

### 2. Load Build Tracking

Read `module-build-{module_code}.md`:

- `stepsCompleted`, `moduleCode`, `moduleName`, `moduleType`.

### 3. Report Progress

Show completed steps and module status.

### 4. Determine Next Step

Find the last completed step and route:

- `step-01-load-brief` → `step-02-structure`
- `step-02-structure` → `step-03-config`
- ...

### 5. Route to Next Step

"**Continuing to: {next_step_name}**"

---

## Success Metrics

- Build state loaded.
- Correct next step identified.
- Seamless resume.
