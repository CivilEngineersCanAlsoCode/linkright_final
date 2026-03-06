---
name: "step-08-report"
description: "Generate final validation report"

agentValidationWorkflow: "{project-root}/_lr/lrb/workflows/agent/steps-v/step-01-validate.md"
workflowValidationWorkflow: "{project-root}/_lr/lrb/workflows/workflow/steps-v/step-01-validate.md"
---

# Step 8: Validation Report

## STEP GOAL:

Compile all validation results into a final actionable report.

---

## MANDATORY SEQUENCE

### 1. Compile Overall Status

Determine if the module is **PASS**, **FAIL**, or has **WARNINGS**.

### 2. Generate Final Report

Assemble the summary, breakdown by category, component status (spec vs built), and prioritized recommendations.

### 3. Sub-Process Validation Opportunities

Point to deep validation workflows for built agents and workflows.

- Agent validation: `{agentValidationWorkflow}`.
- Workflow validation: `{workflowValidationWorkflow}`.

### 4. Present Report and Next Steps

Show overall status and saved report path. Provide next steps based on the results.

### 5. Present MENU OPTIONS

[R] Read Report [S] Sub-process [F] Fix [D] Done

---

## Success Metrics

- Final report generated with actionable feedback.
- Overall module status confirmed.
- Next steps provided.
