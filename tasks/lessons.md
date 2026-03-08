# Lessons Learned

## Workflow Rules
1. **Never kill processes without asking:** If I discover a background process that might be causing an issue, I must explain the situation and ask for the user's explicit permission before sending SIGKILL or any termination signal to it. Killing background services (like MCP wrappers) abruptly can disrupt workflows or lead to data loss.
