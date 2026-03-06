---
name: "step-03-module-type"
description: "Determine the type of module (Standalone, Extension, Global)"

nextStepFile: "./step-04-vision.md"
moduleStandardsFile: "../data/module-standards.md"
---

# Step 3: Module Type

## STEP GOAL:

Determine if the module is Standalone, an Extension, or Global.

---

## MANDATORY SEQUENCE

### 1. Explain Module Types

Present the 3 types from `{moduleStandardsFile}`:

- **Standalone**: New independent domain (e.g., `sync`).
- **Extension**: Builds on an existing module (e.g., `bmm-security`).
- **Global**: Affects everything (rare).

### 2. Determine Type Together

"**Based on your idea, what type makes sense?**"
Help them think through:

- "Is this a brand new domain?"
- "Does this build on an existing module?"

### 3. Confirm and Store

"**Module Type: {Standalone/Extension/Global}**"

**IF Extension:** Capture the base module code.

### 4. Present MENU OPTIONS

[C] Continue

---

## Success Metrics

- Module type clearly decided.
- Extension base module identified (if applicable).
