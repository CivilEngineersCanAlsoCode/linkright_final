---
name: "workflow-create-module"
description: "Build a new Linkright module structure from a brief"
---

# Workflow: Create Module

Technical construction of a new Linkright module (spoke), including structure and manifest generation.

```xml
<workflow id="create-module" name="Module Construction Engine">
  <execution>
    <step n="1" id="validate-brief">Execute ./steps-c/step-01-load-brief.md.</step>
    <step n="2" id="generate-structure">Execute ./steps-c/step-02-structure.md.</step>
  </execution>
</workflow>
```

## Execution Rules

1.  **Validate First**: Always start by loading and validating the brief.
2.  **Standard Compliance**: Ensure all paths follow the `_lr/` root pattern.
3.  **State Tracking**: Document progress in `_lr/lrb/build-logs/`.
