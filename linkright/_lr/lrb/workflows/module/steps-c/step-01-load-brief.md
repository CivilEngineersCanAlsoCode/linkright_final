---
name: "step-01-load-brief"
description: "Load brief or user write-up, validate completeness"

nextStepFile: "./step-02-structure.md"
continueFile: "./step-01b-continue.md"
agentSpecTemplate: "../data/agent-spec-template.md"
workflowSpecTemplate: "../templates/workflow-spec-template.md"
moduleStandardsFile: "../data/module-standards.md"
moduleYamlConventionsFile: "../data/module-yaml-conventions.md"
---

# Step 1: Load Brief (Create Mode)


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## STEP GOAL:

Load the module brief (or get a detailed user write-up) and validate it has the information needed to build the module.

---

## MANDATORY SEQUENCE

### 1. Check for Existing Work

Check for `module-build-{module_code}.md` in the output folder.
**IF exists:** Load `{continueFile}`.
**IF not:** Continue to Step 1.2.

### 2. Get the Brief or Write-Up

"**Welcome to Create mode! I'll build your module structure from your brief.**"
Options:

- **A)** Brief from Brief mode (`module-brief-{code}.md`).
- **B)** User-provided write-up (CSV/PDF/Doc).
- **C)** Detailed description (conversation).

### 3. Validate Brief Completeness

Ensure the brief contains:

- Module code and name.
- Module type (Standalone/Extension/Global).
- Agent roster & Workflow list.
- **IF Extension:** Base module code.

### 4. Confirm and Create Tracking

Once validated:
"**I have everything I need to build your module!**"
Create the build tracking file: `module-build-{code}.md`.

### 5. Present MENU OPTIONS

[A] Advanced Elicitation [P] Party Mode [C] Continue

---

## Success Metrics

- Brief loaded and validated.
- Tracking file created.
- User ready to build.
