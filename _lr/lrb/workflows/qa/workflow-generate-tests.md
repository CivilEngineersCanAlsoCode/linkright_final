---
name: "workflow-generate-tests"
description: "Automated workflow for generating and verifying tests"
---

# Workflow: Generate Tests

Automated creation and verification of test suites for Linkright components.

```xml
<workflow id="qa-generate" name="Test Generation Engine">
  <execution>
    <step n="1" id="analyze">Execute ./steps-g/step-01-analyze.md.</step>
    <step n="2" id="plan">Execute ./steps-g/step-02-plan.md.</step>
    <step n="3" id="generate">Execute ./steps-g/step-03-generate.md.</step>
    <step n="4" id="verify">Execute ./steps-g/step-04-verify.md.</step>
    <step n="5" id="finalize">Execute ./steps-g/step-05-finalize.md.</step>
  </execution>
</workflow>
```

## Operational Rules

- Ensure `lr-config.yaml` is loaded during analysis.
- Tests must be registered in the module manifest.
