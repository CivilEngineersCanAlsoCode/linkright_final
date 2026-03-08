# Step 01: Agent Loading


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## Objective

Identify and load the set of agents required for the current discussion.

## Instructions

1.  **Read Manifest**: Load `_lr/_config/manifests/agent-manifest.csv`.
2.  **User Selection**: Ask the user which agents they want to invite to the party (provide the available list).
3.  **Automatic Additions**: Always include `lr-orchestrator` as the moderator unless explicitly overridden.
4.  **Verification**: Ensure all selected agents have valid `.md` persona files in their respective module directories.

## Deliverables

- `session_agents`: List of IDs for active agents.
