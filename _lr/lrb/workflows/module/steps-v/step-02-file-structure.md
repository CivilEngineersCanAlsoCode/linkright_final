---
name: "step-02-file-structure"
description: "Validate file structure compliance"

nextStepFile: "./step-03-module-yaml.md"
moduleStandardsFile: "../data/module-standards.md"
---

# Step 2: File Structure Validation

## STEP GOAL:

Validate file structure against module standards.

---

## MANDATORY SEQUENCE

### 1. Load Standards

Load `{moduleStandardsFile}` for reference.

### 2. Perform Structure Checks

- [ ] `module.yaml` exists.
- [ ] `README.md` exists.
- [ ] `agents/` and `workflows/` folders exist.
- [ ] **IF Extension:** Check base module compatibility and unique folder name.

### 3. Record Results

Append structure check results (PASS/FAIL/WARNINGS) to the validation report.

### 4. Auto-Proceed

"**✓ File structure check complete. Proceeding to configuration validation...**"

---

## Success Metrics

- Structural compliance verified.
- Results recorded in the report.
