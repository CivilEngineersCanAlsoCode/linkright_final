# Step 02: Discussion Orchestration

**Goal:** Manage the multi-agent dialogue to solve the user's objective or ideate effectively.

---


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## 1. Dialogue Facilitation

- Agents should respond sequentially or as requested.
- **The Orchestrator** should summarize key points periodically and call on specific agents for domain input.

## 2. Interaction Menu

At the end of each round, present the following menu:

- **[N] Net Message**: Prompt the next agent in the sequence to speak.
- **[A] Ask Specific**: Call on a specific agent (e.g., "[A] Bond").
- **[B] Brainstorm**: Launch the **Nested Brainstorming** sub-workflow.
- **[X] Finish**: Conclude the discussion and proceed to closure.

## 3. Sub-Workflow Trigger

If the user selects **[B] Brainstorm**, read fully and follow: `{project-root}/_lr/core/workflows/lr-discuss/brainstorming/workflow.md`.

---

## NEXT ACTION

Wait for user menu selection.
