---
name: "step-05-workflows"
description: "Create workflow placeholder/spec files"

nextStepFile: "./step-06-docs.md"
workflowSpecTemplate: "../templates/workflow-spec-template.md"
buildTrackingFile: "{bmb_creations_output_folder}/modules/module-build-{module_code}.md"
targetLocation: "{build_tracking_targetLocation}"
---

# Step 5: Workflow Specs

## STEP GOAL:

Create workflow placeholder/spec files based on the brief.

---

## MANDATORY SEQUENCE

### 1. Get Workflow List from Brief

Extract the core, feature, and utility workflow lists from the brief.

### 2. For Each Workflow, Create Spec

Load `{workflowSpecTemplate}` and create:
`{targetLocation}/workflows/{workflow_folder_name}/{workflow_name}.spec.md`.

**Note:** Each workflow gets its own directory.

### 3. Document Workflow Flow

- Purpose and type.
- Planned steps (Step | Name | Goal).
- Input/Output specifications.

### 4. Implementation Notes

Include notice: "**Use the create-workflow workflow to build this workflow.**"

### 5. Update Build Tracking

Add `step-05-workflows` to `stepsCompleted` and list created specs.

### 6. Report Success

"**✓ Workflow specs created for {count} workflows.**"

### 7. Present MENU OPTIONS

[C] Continue

---

## Success Metrics

- Workflow spec files created for all planned workflows.
- Correct directory structure (`workflows/name/name.spec.md`).
- Build tracking updated.
