# Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

## Project Structure

```
sync/
├── linkright/          # Linkright multi-agent platform (primary project)
│   ├── _lr/            # Agent definitions, workflows, memory, config
│   ├── .lr-commands/   # IDE command stubs (35 IDEs)
│   └── .claude/        # Claude slash commands (21 commands)
├── bmad-method/        # BMAD reference implementation (read-only comparison)
│   └── _bmad/          # BMAD agents, workflows, config
├── context/            # Documentation, audit reports, release plans
└── AGENTS.md           # This file
```

---

## Beads Quick Reference

### Finding Work

```bash
bd ready                    # Issues ready to work (no blockers)
bd list --status=open       # All open issues
bd list --status=in_progress # Your active work
bd blocked                  # Issues waiting on dependencies
```

### Working on Issues

```bash
bd show <id>                        # View issue details
bd update <id> --status=in_progress # Claim work
bd close <id>                       # Complete an issue
bd close <id1> <id2> ...            # Close multiple at once
bd close <id> --reason="why"        # Close with explanation
```

### Creating Issues

```bash
bd create --title="Summary" --description="Details" --type=task --priority=2
# Types: task, bug, feature, epic
# Priority: 0=critical, 1=high, 2=medium, 3=low, 4=backlog
```

### Dependencies & Search

```bash
bd dep add <issue> <depends-on>     # Add dependency
bd search <query>                   # Search by keyword
bd stats                            # Project health overview
```

### Persistent Memory

```bash
bd remember "insight"               # Save knowledge across sessions
bd memories <keyword>               # Search saved knowledge
```

---

## Session Completion Protocol

**When ending a work session**, complete ALL steps. Work is NOT complete until `git push` succeeds.

1. **File issues** for remaining work (`bd create`)
2. **Close finished work** (`bd close <id1> <id2> ...`)
3. **Push to remote**:
   ```bash
   git pull --rebase && bd sync && git push
   git status  # MUST show "up to date with origin"
   ```
4. **Verify** all changes committed AND pushed

> [!IMPORTANT]
> - Work is NOT complete until `git push` succeeds.
> - NEVER stop before pushing - that leaves work stranded locally.
> - If push fails, resolve and retry until it succeeds.

---

## Key Conventions

- **Issue tracking**: Always use `bd` (beads). Do NOT use TodoWrite, markdown files, or other trackers.
- **Git workflow**: Local-only (no remote configured). Push when remote is available.
- **Session recovery**: Run `bd prime` after compaction, clear, or new session.
- **Parallel creation**: Use subagents when creating many issues at once.
- **No interactive editors**: Do NOT use `bd edit` — it opens vim/nano which blocks agents.
