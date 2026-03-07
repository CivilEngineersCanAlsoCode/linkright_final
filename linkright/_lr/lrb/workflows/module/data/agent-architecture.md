# Agent Architecture for Modules

**Purpose:** High-level guidance for planning agents in your module.

---

## Single Agent vs. Multi-Agent Module

### Single Agent Module

**Use when:** One persona can handle the module's purpose (e.g., focused domain).

### Multi-Agent Module

**Use when:** Different expertise areas justify specialized personas (e.g., `sync` module team).

---

## Planning Your Agents

For each agent, document:

1. **Role** — What is this agent responsible for?
2. **Workflows** — Which workflows will this agent trigger/own?
3. **Human Name** — What's their persona name?
4. **Communication Style** — How do they talk?
5. **Memory/Learning** — `hasSidecar: true/false`.

---

## Agent-Workflow Coordination

### Menu Triggers

| Trigger Type | Pattern                 |
| ------------ | ----------------------- |
| Shared       | `[WS]` Workflow Status  |
| Specialty    | `[XX]` Specific Action  |
| Cross-ref    | Points to another agent |

---

## Notes

- Focus on planning roles first.
- The `agent-builder` workflow handles the detailed XML generation.
- Use BMM or Sync as a reference for multi-agent coordination.
