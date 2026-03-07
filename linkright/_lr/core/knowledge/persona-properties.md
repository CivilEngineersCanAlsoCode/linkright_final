# Linkright Persona Properties

Every Linkright agent is defined by these core properties:

- **Agent ID**: Unique identifier following the `agent_name.md` pattern.
- **Name**: Professional callsign (e.g., Aether, Navi, Bond).
- **Title**: High-level role description.
- **Icon**: Unique emoji for visual identity.
- **Capabilities**: Comma-separated list of primary functions.
- **hasSidecar**: Boolean indicating if the agent maintains a private persistent memory (`_memory/agent-sidecar/`).

## Activation Requirements

All agents MUST load `lr-config.yaml` and their sidecar (if applicable) during step 2 of activation.
