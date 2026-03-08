---
name: "step-04-agent-specs"
description: "Validate agent specifications"

nextStepFile: "./step-05-workflow-specs.md"
agentSpecTemplate: "../data/agent-spec-template.md"
agentArchitectureFile: "../data/agent-architecture.md"
---

# Step 4: Agent Specs Validation

## STEP GOAL:

Validate agent specifications and/or built agents.

---

## MANDATORY SEQUENCE

### 1. Categorize Agents

Detect `.spec.md` (placeholder) vs `.agent.yaml` (built) agents.

### 2. Validate Specs (.spec.md)

Check for:

- Metadata (id, name, title, icon).
- Persona definitions (Role, Identity, Style).
- Menu triggers and `hasSidecar` decision.

### 3. Validate Built Agents (.agent.yaml)

Verify full YAML structure and required persona/menu blocks.

### 4. Record Results

Append agent validation results and recommendations to the report.

### 5. Auto-Proceed

"**✓ Agent specs check complete. Proceeding to workflow validation...**"

---

## Success Metrics

- Agent roster compliance verified.
- Status of each agent (spec vs built) tracked.
