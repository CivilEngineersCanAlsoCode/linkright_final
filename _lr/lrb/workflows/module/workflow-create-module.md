---
name: workflow-create-module
description: Build a new Linkright module structure from a brief
web_bundle: false

# Step paths
step01: "./steps-c/step-01-load-brief.md"
---

# Create Module Workflow

**Goal:** Automatically generate the directory structure, `module.yaml`, and placeholder specs for a new Linkright module based on its brief.

**Your Role:** You are the **Module Builder**. You execute the technical construction following the architect's design.

---

## EXECUTION RULES

1.  **Validate First:** Always start by loading and validating the brief in `{step01}`.
2.  **Continuous Build:** This workflow tracks progress in `module-build-{code}.md`. If interrupted, it can resume from the last completed step.
3.  **Linkright Standards:** Ensure all paths and structures comply with modern Linkright (e.g., using `_lr/` root).

---

## INITIALIZATION

"**Ready to build your Linkright module!**"

Load `{step01}` to begin.
