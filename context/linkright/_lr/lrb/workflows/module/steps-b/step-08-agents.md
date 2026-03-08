---
name: "step-08-agents"
description: "Agent architecture planning"

nextStepFile: "./step-09-workflows.md"
agentArchitectureFile: "../data/agent-architecture.md"
---

# Step 8: Agents

## STEP GOAL:

Design the agent architecture — who's on the team?

---

## MANDATORY SEQUENCE

### 1. Single vs Multi-Agent

"**Does your module need a single expert or a team of agents?**"
Reference `{agentArchitectureFile}` (Single vs Multi-agent tradeoffs).

### 2. Design the Agent Team

For each agent, capture:

- **Role:** What are they responsible for?
- **Workflow Triggers:** Which workflows will they own?
- **Name/Personality:** Human name and style.
- **Memory:** `hasSidecar: true/false`.

### 3. Party Mode Simulation

"**Want to simulate how your agents might interact?**"
Use `[P] Party Mode` to see them "talk" through a scenario.

### 4. Present MENU OPTIONS

[A] Advanced Elicitation [P] Party Mode [C] Continue

---

## Success Metrics

- Agent roles and counts decided.
- Agent-workflow mappings established.
