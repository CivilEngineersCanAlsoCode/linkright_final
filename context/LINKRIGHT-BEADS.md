# LINKRIGHT BEADS GOVERNANCE (LINKRIGHT-BEADS)

Linkright uses **Beads** (`bd`) for persistent task memory and long-term context retention.

## 📏 Governance Rules

1.  **Mandatory Descriptions**: Every `bd create` MUST have a `--description`.
2.  **Epics for Modules**: Every task must be linked to a module-specific Epic.
3.  **Sync Frequency**: Always run `bd sync` before concluding a session.
4.  **Zero Orphan Tasks**: All new issues must have a relationship (blocks, parent-child, related).

## 🏗 Linkright Builder (LRB) Meta-Programming Patterns

When using LRB to create or modify agents/workflows, follow these persistent memory patterns:

1.  **Atomic Creation**: Every file created by LRB MUST be linked to a granular Beads sub-task (e.g., `sync-7be.2.1`).
2.  **Verification Checkpoints**: Use Beads tags like `needs-qa` for any file that requires structural validation.
3.  **Dependency Mapping**: Before creating a new module, ensure the module's EPIC exists and all workflow steps are pre-planned as blocked tasks in Beads.
4.  **Zero-Shadow Commit**: Always ensure `bd sync` is run after file generation to prevent "shadow" files that aren't tracked in the governance layer.

## 📊 Status Keywords

- `backlog`: Future work.
- `in_progress`: Current focus.
- `done`: implementation completed and verified.
- `blocked`: Waiting on external input.
