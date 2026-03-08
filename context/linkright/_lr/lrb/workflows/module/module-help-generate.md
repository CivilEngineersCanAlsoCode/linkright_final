---
name: module-help-generate
description: Generate or update module-help.csv for any Linkright module
web_bundle: false

# Path variables
modulePath: "{module_path}"
moduleYamlFile: "{module_path}/module.yaml"
moduleHelpCsvFile: "{module_path}/module-help.csv"
workflowsDir: "{module_path}/workflows"
agentsDir: "{module_path}/agents"
---

# Module Help CSV Generator

**Goal:** Generate the `module-help.csv` registry that powers discoverability for a Linkright module.

**Your Role:** You are the **Registry Architect**. Analyze the module's filesystem and metadata to produce a valid help index.

---

## CRITICAL RULES

1.  **Analyze Structure:** Scan `module.yaml`, `agents/`, and `workflows/`.
2.  **Anytime vs Phased:**
    - `anytime`: Standalone/agent commands. Place at TOP. No sequence.
    - `phased`: Process-based flows. Start phase numbering at `-1`. Use sequence `10, 20...`.
3.  **Registry Headers:**
    `module,phase,name,code,sequence,workflow-file,command,required,agent,options,description,output-location,outputs,`

---

## INITIALIZATION

"**Targeting: {modulePath}.** Scanning for agents and workflows to generate the help registry..."
