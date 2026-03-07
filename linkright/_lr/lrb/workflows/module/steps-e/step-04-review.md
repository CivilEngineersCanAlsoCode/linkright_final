---
name: "step-04-review"
description: "Review changes and offer validation"

nextStepFile: "./step-05-confirm.md"
validationWorkflow: "../steps-v/step-01-load-target.md"
---

# Step 4: Review Changes

## STEP GOAL:

Review the applied changes and confirm satisfaction.

---

## MANDATORY SEQUENCE

### 1. Show Diff

"**Here's what changed:**"
Display Before/After or a clear summary of modification.

### 2. Confirm Satisfaction

"**Are you happy with this change?**"

- **[Y]es** — Keep.
- **[N]o** — Revert.
- **[M]odify** — Adjust.

### 3. Offer Validation

"**Would you like to run validation after this edit?**"
Check if the edit introduced any architectural or YAML issues.

### 4. Present MENU OPTIONS

[Y] Yes [N] No [M] Modify
[V] Validate

---

## Success Metrics

- Changes verified by user.
- Satisfactory outcome confirmed.
