---
name: "outbound-campaign"
description: "Execute a multi-step outbound outreach campaign for a job application"
---

# Workflow: Outbound Campaign

Creates a high-fidelity outreach sequence (Cover Letter, In-Mail, Connect Invite) leveraging the "Bridge" methodology.

```xml
<workflow id="outbound-campaign" name="Signal-Driven Outreach">
  <execution>
    <step n="1" id="ingest">Execute ./steps-c/step-out-01-ingest.md.</step>
    <step n="2" id="strategy">Execute ./steps-c/step-out-02-strategy.md.</step>
    <step n="3" id="drafting">Follow sequential drafting steps (out-03 to out-06).</step>
  </execution>
</workflow>
```

## Initialization Sequence

1.  **Configuration**: Load and read full config from `{project-root}/_lr/lr-config.yaml`.
2.  **Context**: Ensure `sync-publicist` and `flex-publicist` are available for orchestration.
3.  **Handoff**: Transition to ingestion phase in `step-out-01-ingest.md`.
