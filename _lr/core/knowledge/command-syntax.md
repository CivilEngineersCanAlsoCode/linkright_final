# Linkright Command Syntax

Unified command registry for cross-agent orchestration and global system control.

## Menu Interaction Pattern

Menu items follow a standardized `[Trigger] Label: Description` pattern for consistent UX.

### Standard Triggers

- **[GO] Module Entry**: Route to a specific spoke (e.g., `[GO] Sync`).
- **[CP] Construct Product**: Generate a technical or narrative artifact (e.g., `[CP] PRD`).
- **[RS] Resume Session**: Restore the last active Bead context.
- **[PM] Party Mode**: Launch a distributed multi-agent discussion.
- **[DA] Dismiss Agent**: Terminate the current agent persona.

## Global Slash Commands

Available to the user at any point in the conversation, regardless of the active agent.

- **/lr-menu**: Standardizes the return path to the Core Orchestrator.
- **/lr-help**: Accesses the global Linkright utility registry.
- **/lr-status**: Displays the success ledger and project health history.
- **/lr-sync**: Forces a Beads state synchronization.
