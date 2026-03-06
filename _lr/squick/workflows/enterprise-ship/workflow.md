---
name: "enterprise-ship"
description: "Rapid end-to-end delivery of enterprise-grade professional artifacts"
---

# Workflow: Enterprise Ship

A high-momentum delivery pipeline for complex, multi-stakeholder professional requirements.

```xml
<workflow id="enterprise-ship" name="Ship + Quick (Squick) Engine">
  <execution>
    <step n="1" id="discovery">Execute ./steps-b/step-b-01-discovery.md.</step>
    <step n="2" id="briefing">Execute ./steps-b/step-b-02-briefing.md.</step>
    <step n="3" id="delivery">Execute terminal steps for PRD, Architecture, and QA.</step>
  </execution>
</workflow>
```

## Initialization Sequence

1.  **Configuration**: Load and read full config from `{project-root}/_lr/lr-config.yaml`.
2.  **Squad Load**: Activate the Squick specialist manifest (Analyst, PM, Architect, QA).
3.  **Handoff**: Proceed to discovery phase in `step-b-01-discovery.md`.
