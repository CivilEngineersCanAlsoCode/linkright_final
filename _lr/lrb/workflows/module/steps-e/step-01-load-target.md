---
name: "step-01-load-target"
description: "Load target for editing"

nextStepFile: "./step-02-select-edit.md"
moduleStandardsFile: "../data/module-standards.md"
---

# Step 1: Load Target (Edit Mode)

## STEP GOAL:

Load the target (brief, module.yaml, agent specs, or workflow specs) for editing.

---

## MANDATORY SEQUENCE

### 1. Determine Edit Target

"**What would you like to edit?**"
Options:

- **[B]rief** — Module brief (`module-brief-{code}.md`).
- **[Y]aml** — `module.yaml` configuration.
- **[A]gents** — Agent specifications (`agents/`).
- **[W]orkflows** — Workflow specifications (`workflows/`).
- **[D]ocs** — `README.md` or `TODO.md`.

### 2. Load Target File

Based on selection, locate and read the target file.
(Paths: `_lr/{code}/` or `_lr/lrb/creations/modules/`).

### 3. Display Current Content

Show the current content or a summary of the target file.

### 4. Present MENU OPTIONS

[C] Continue

---

## Success Metrics

- Edit target identified and loaded.
- Current state displayed.
