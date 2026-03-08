---
name: "step-03-module-yaml"
description: "Validate module.yaml against conventions"

nextStepFile: "./step-04-agent-specs.md"
moduleYamlConventionsFile: "../data/module-yaml-conventions.md"
---

# Step 3: module.yaml Validation

## STEP GOAL:

Validate `module.yaml` formatting and conventions.

---

## MANDATORY SEQUENCE

### 1. Validate Required Fields

Check for essential frontmatter:

- `code`, `name`, `header`, `subheader`, `default_selected`.

### 2. Validate Custom Variables

For each variable, ensure:

- `prompt` and `default` are present.
- `result` template is valid.
- Selection options (if any) are correctly formatted.

### 3. Record Results

Append YAML validation results to the report.

### 4. Auto-Proceed

"**✓ module.yaml check complete. Proceeding to agent validation...**"

---

## Success Metrics

- `module.yaml` syntax and structure verified.
- Results recorded.
