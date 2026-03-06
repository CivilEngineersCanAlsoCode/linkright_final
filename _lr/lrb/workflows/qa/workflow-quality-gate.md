---
name: "workflow-quality-gate"
description: "Automated workflow for full test suites and Go/No-Go decisions"
---

# Workflow: Quality Gate

Consolidated test execution and performance evaluation for Linkright components.

```xml
<workflow id="qa-gate" name="Final Quality Gate">
  <execution>
    <step n="1" id="collect">Execute ./steps-o/step-01-collect.md.</step>
    <step n="2" id="run">Execute ./steps-o/step-02-run.md.</step>
    <step n="3" id="result">Execute ./steps-o/step-03-result.md.</step>
    <step n="4" id="badge">Execute ./steps-o/step-04-badge.md.</step>
  </execution>
</workflow>
```

## Operational Rules

- A failure in any high-severity test triggers an automatic "No-Go" status.
- Generate a visual quality badge in the module's `README.md`.
