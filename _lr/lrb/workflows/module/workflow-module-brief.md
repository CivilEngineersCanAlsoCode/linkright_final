---
name: "workflow-module-brief"
description: "Interactive briefing for designing a new Linkright module"
---

# Workflow: Module Briefing

Guides the user through a creative discovery process to design a complete Linkright module architecture.

```xml
<workflow id="module-brief" name="Module Architectural Discovery">
  <execution>
    <step n="1" id="welcome">Execute ./steps-b/step-01-welcome.md.</step>
    <step n="2" id="discovery">Follow sequential discovery steps (b-02 to b-14).</step>
  </execution>
</workflow>
```

## Execution Rules

1.  **Iterative Discovery**: Use [A] Advanced Elicitation for deep-dives into module capabilities.
2.  **Output**: Generate a structured brief in `_lr/lrb/briefs/`.
3.  **Modularity**: Ensure the resulting brief defines atomic agents and workflows.
