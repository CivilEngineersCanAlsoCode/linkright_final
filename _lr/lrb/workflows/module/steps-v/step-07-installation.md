---
name: "step-07-installation"
description: "Installation readiness check"

nextStepFile: "./step-08-report.md"
moduleHelpGenerateWorkflow: "../module-help-generate.md"
---

# Step 7: Installation Readiness

## STEP GOAL:

Check if the module is ready for installation via `bmad install`.

---

## MANDATORY SEQUENCE

### 1. Check module.yaml Variables

Validate prompts, defaults, and result templates for custom variables.

### 2. Check module-help.csv

**CRITICAL:** Every module must have `module-help.csv` at its root.
Verify header, phased entries, and `anytime` commands.

### 3. Module Type Installation

**IF Extension:** Verify code matches base for proper merge.
**IF Global:** Confirm global impact is intentional.

### 4. Record Results

Append installation readiness results and "Ready to Install" status to the report.

### 5. Auto-Proceed

"**✓ Installation readiness check complete. Proceeding to final report...**"

---

## Success Metrics

- `module-help.csv` presence verified.
- `module.yaml` variables validated.
- Ready-to-install status determined.
