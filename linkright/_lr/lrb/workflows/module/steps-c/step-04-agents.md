---
name: "step-04-agents"
description: "Create agent placeholder/spec files"

nextStepFile: "./step-05-workflows.md"
agentSpecTemplate: "../data/agent-spec-template.md"
agentArchitectureFile: "../data/agent-architecture.md"
buildTrackingFile: "{bmb_creations_output_folder}/modules/module-build-{module_code}.md"
targetLocation: "{build_tracking_targetLocation}"
---

# Step 4: Agent Specs


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## STEP GOAL:

Create agent placeholder/spec files based on the brief.

---

## MANDATORY SEQUENCE

### 1. Get Agent Roster from Brief

Extract agent names, roles, workflows, and communication styles.

### 2. For Each Agent, Create Spec

Load `{agentSpecTemplate}` and create:
`{targetLocation}/agents/{agent_file_name}.spec.md`.

### 3. Document Metadata & Persona

- YAML metadata.
- Role, Identity, Style, Principles.
- Planned menu triggers.

### 4. Implementation Notes

Include notice: "**Use the create-agent workflow to build this agent.**"

### 5. Update Build Tracking

Add `step-04-agents` to `stepsCompleted` and list created specs.

### 6. Report Success

"**✓ Agent specs created for {count} agents.**"

### 7. Present MENU OPTIONS

[C] Continue

---

## Success Metrics

- Agent spec files created for all planned agents.
- Roster matches the brief.
- Build tracking updated.
