---
name: "content-automation"
description: "Transform professional reflections into viral social narratives"
---

# Workflow: Content Automation

Orchestrates the conversion of "Deep Water" signal reflections into authentic, high-retention social content.

```xml
<workflow id="content-automation" name="Professional Signal Amplification">
  <execution>
    <step n="1" id="ingest">Execute ./steps-c/step-flx-01-ingest-reflection.md.</step>
    <step n="2" id="insights">Execute ./steps-c/step-flx-02-query-viral-insights.md.</step>
    <step n="3" id="drafting">Follow sequential drafting steps (flx-03 to flx-05).</step>
  </execution>
</workflow>
```

## Initialization Sequence

1.  **Configuration**: Load and read full config from `{project-root}/_lr/lr-config.yaml`.
2.  **Brand Sync**: Ensure `flex-publicist` is calibrated to the user's professional positioning profile.
3.  **Handoff**: Transition to ingestion phase in `step-flx-01-ingest-reflection.md`.
