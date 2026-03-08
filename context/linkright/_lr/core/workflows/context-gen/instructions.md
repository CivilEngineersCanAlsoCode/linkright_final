# Linkright Context-Gen Engine

This workflow allows Linkright to scan its own directory structure and generate `CONTEXT.md` files for subagents and humans.

## Sequence:

1. **Index**: Scan all `.md` files in the target module.
2. **Summarize**: Create concise functional summaries for each agent and workflow.
3. **Generate**: Output the final `CONTEXT.md` artifact.
