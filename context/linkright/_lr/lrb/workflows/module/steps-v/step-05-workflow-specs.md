---
name: "step-05-workflow-specs"
description: "Validate workflow specifications"

nextStepFile: "./step-06-documentation.md"
workflowSpecTemplate: "../templates/workflow-spec-template.md"
---

# Step 5: Workflow Specs Validation

## STEP GOAL:

Validate workflow specifications and folders, distinguishing between placeholder specs and fully implemented workflows.

---

## MANDATORY SEQUENCE

### 1. Categorize Workflows

Detect `.spec.md` (placeholder) vs folder structure for built workflows.

### 2. Validate Specs (.spec.md)

Check for:

- Workflow purpose and type.
- Planned steps (Step | Name | Goal).
- Input/Output specifications.

### 3. Validate Built Workflows

Verify folder structure (`workflows/name/`) and required tri-modal steps (steps-c/steps-e/steps-v).

### 4. Record Results

Append workflow validation results and recommendations to the report.

### 5. Auto-Proceed

"**✓ Workflow specs check complete. Proceeding to documentation validation...**"

---

## Success Metrics

- Workflow roster compliance verified.
- Status (spec vs built) tracked for each workflow.
