---
name: "party-mode"
description: "Orchestrates multi-agent discussions."
---

# Workflow: Party Mode

This workflow facilitates a multi-agent discussion to synthesize professional signals and resolve cross-module challenges.

```xml
<workflow id="party-mode" name="Party Mode Orchestration">
  <execution>
    <step n="1" id="loading">Load relevant agents from manifest and user selection.</step>
    <step n="2" id="discussion">Facilitate structured dialogue between selected agents.</step>
    <step n="3" id="exit">Summarize the session and reconcile state in Beads.</step>
  </execution>
</workflow>
```
