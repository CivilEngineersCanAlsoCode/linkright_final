# insights-sidecar Memory Instructions

This sidecar stores session state for the associated agent.

## Files:
- `active-session.yaml` — Current session context.
- `history/` — Past session snapshots.

## Rules:
- NEVER delete history files.
- ALWAYS append, never overwrite active-session.yaml.
