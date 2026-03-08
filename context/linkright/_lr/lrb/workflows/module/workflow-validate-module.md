---
name: "workflow-validate-module"
description: "Comprehensive diagnostic check for Linkright module compliance"
---

# Workflow: Validate Module

Diagnostic suite to ensure a Linkright module meets structural, YAML, and agent/workflow standards.

```xml
<workflow id="validate-module" name="Module Quality Auditor">
  <execution>
    <step n="1" id="init">Execute ./steps-v/step-01-load-target.md.</step>
    <step n="2" id="audit">Follow sequential audit steps (v-02 to v-08).</step>
  </execution>
</workflow>
```

## Execution Rules

1.  **Iterative Audit**: Each step must provide a pass/fail status and remediation advice.
2.  **Output**: Generate a comprehensive `validation-report.md` in the target module's `_docs/` folder.
3.  **Gatekeeper**: Provide a clear Go/No-Go decision at the end of the workflow.
