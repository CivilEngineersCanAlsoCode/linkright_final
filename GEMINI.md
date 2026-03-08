# Autonomous Development Protocol v8.0 — Gemini Edition

> Boot loader for autonomous AI development with Google Gemini.
> All project knowledge lives in Beads memories + ChromaDB. Not in this file.
>
> Version: 8.0 | Updated: 2026-03-08

---

## Critical Rules

- **Stop and pivot**: If you get stuck on an operation and fail repeatedly (2-3 attempts), do NOT push through or brute-force it. Stop immediately, explain what's failing and why, and suggest an alternative approach. Ask the user before continuing.
- **Language**: Communicate with user in Romanized Hindi (Hinglish) unless they switch to English.

---

## 1. Principles

| #  | Principle       | Rule                                                                  |
|----|-----------------|-----------------------------------------------------------------------|
| P1 | Minimal change  | Simplest possible change. Minimal files, minimal code.                |
| P2 | Root cause      | No temporary patches. No workarounds. Fix the real problem.           |
| P3 | Fail-fast       | Command fails 2x same error → stop, `bd create --type=bug`, try alternative. |
| P4 | Verify always   | Never claim done without running verification command.                |
| P5 | External memory | Zero project knowledge in this file. `bd remember` or ChromaDB only. |
| P6 | Silent ops      | Only involve user for BLOCKLIST items (Section 2).                    |

---

## 2. Blocklist (User Approval Required)

These 18 actions ALWAYS require user approval.
Everything NOT on this list → handle silently.

### Files

| #  | Action                                          |
|----|-------------------------------------------------|
| 1  | Delete more than 2 files in one action          |
| 2  | Delete any file larger than 100 lines           |
| 3  | Create new directory at project root            |
| 4  | Modify dotfile configs (.gitignore, .env, etc.) |

### Git

| #  | Action                                     |
|----|--------------------------------------------|
| 5  | `git push` (any remote, any branch)        |
| 6  | `git reset --hard`                         |
| 7  | `git checkout -- <file>` (discard changes) |
| 8  | `git branch -D` (force delete branch)      |
| 9  | Any `--force` flag on any git command      |

### Dependencies

| #  | Action                                                         |
|----|----------------------------------------------------------------|
| 10 | Add/remove/upgrade packages (package.json, requirements.txt)  |
| 11 | Modify lockfiles (package-lock.json, yarn.lock, poetry.lock)  |

### Infrastructure

| #  | Action                                        |
|----|-----------------------------------------------|
| 12 | Modify CI/CD files (.github/workflows/*, etc) |
| 13 | Modify Docker files (Dockerfile, compose.yml) |
| 14 | Database schema changes or migrations         |
| 15 | Auth, security, or encryption code changes    |

### Architecture

| #  | Action                                             |
|----|----------------------------------------------------|
| 16 | Create new module or top-level directory           |
| 17 | Rename/move file imported by 5+ other files        |
| 18 | Change public API signature (params, return types) |

### NEVER (refuse even if user asks)

- `rm -rf /` or any root-level recursive delete
- Commit credentials, tokens, `.env` files with secrets
- `git push --force` to main/master
- `--no-verify` on any git command

---

## 3. Boot Sequence

```
INIT → LOAD → [BOOTSTRAP | OPERATE] → WORK_LOOP → CLOSING
```

| State     | Action                              | Success                | Failure                    |
|-----------|-------------------------------------|------------------------|----------------------------|
| INIT      | `bd info 2>/dev/null`               | → LOAD                 | `bd init` → LOAD           |
| LOAD      | `bd prime`                          | Check `bd memories project` | → BOOTSTRAP           |
|           | ↳ Has output?                       | → OPERATE              | → BOOTSTRAP                |
| BOOTSTRAP | Execute Section 14                  | → OPERATE              | —                          |
| OPERATE   | 1. `bd dolt pull` (fail → warn)     | —                      | Continue anyway             |
|           | 2. Check ChromaDB availability      | Available              | Skip ChromaDB features     |
|           | 3. `bd ready` → show work           | → WORK_LOOP            | —                          |
| CLOSING   | See Section 3.1                     | —                      | —                          |

### 3.1 Closing Protocol

1. `git add <specific-files>` → `bd dolt pull` → `git commit`
2. Ensure all work is committed and pushed

---

## 4. Work Loop

```
PICK → CLAIM → CONTEXT → IMPLEMENT → VERIFY → CLOSE → [AUTO-COMMIT] → repeat
```

| Step          | Action                                      | Command / Detail                                   |
|---------------|---------------------------------------------|----------------------------------------------------|
| 1. PICK       | First item from ready queue                 | `bd ready`                                         |
| 2. CLAIM      | Take ownership                              | `bd update <id> --status=in_progress`              |
| 3. CONTEXT    | Get knowledge                               | `bd memories <keyword>` → if insufficient + ChromaDB available: query ChromaDB |
| 4. IMPLEMENT  | Write code                                  | Use available tools                                |
| 5. VERIFY     | Run tests                                   | Project test command from `project-test-cmd` memory |
| 6. CLOSE      | Mark done, increment counter                | `bd close <id>`                                    |
| 7. AUTO-COMMIT| Every 5th close                             | See auto-commit rule below                         |

### Auto-Commit Rule

- Track `bd close` count per session (use modulo)
- Every 5th close → auto-commit without asking
- Message format: `checkpoint: 5 tasks completed [sync-xx, sync-yy, ...]`
- Also commit on session end regardless of count
- This is NOT in the BLOCKLIST — no permission needed

---

## 5. "beads" Keyword Protocol

When user says "beads":

1. **STOP** — zero code, zero file changes
2. **ANALYZE** — decompose the task into hierarchy
3. **CREATE** — Epic → Feature → Task → Subtask
4. **WIRE** — `bd dep <blocker> --blocks <blocked>`
5. **SHOW** — `bd dep tree <epic-id>`
6. **WAIT** — user approval before execution
7. **EXECUTE** — via WORK_LOOP (Section 4)

---

## 6. Naming Conventions

| Entity              | Pattern                                     | Example                                |
|---------------------|---------------------------------------------|----------------------------------------|
| Project name        | `basename(git remote URL)` or `basename(pwd)` | `linkright_final`, `my-app`         |
| Beads memory: overview | `project-overview`                       | `bd remember "X: desc" --key project-overview` |
| Beads memory: stack | `project-stack`                              | `bd remember "Node+Express" --key project-stack` |
| Beads memory: entry | `project-entry`                              | `bd remember "src/index.ts" --key project-entry` |
| Beads memory: structure | `project-structure`                      | `bd remember "src/,tests/" --key project-structure` |
| Beads memory: test  | `project-test-cmd`                           | `bd remember "npm test" --key project-test-cmd` |
| Rule keys           | `rule-<name>`                                | `rule-no-console-log`                  |
| Lesson keys         | `lesson-<category>-<nnn>`                    | `lesson-setup-001`                     |
| Stack keys          | `stack-<component>`                          | `stack-mongodb`                        |
| Pattern keys        | `pattern-<name>`                             | `pattern-error-handling`               |
| ChromaDB collection | `<project>-qa`                               | `my-app-qa`                            |
| ChromaDB doc IDs    | `<project>-<category>-<nnn>`                 | `my-app-howto-001`                     |
| ChromaDB categories | `howto`, `arch`, `rule`, `pattern`, `debug`  | —                                      |

---

## 7. Storage Architecture

| Layer          | Tool             | What Goes Here                          | When                        |
|----------------|------------------|-----------------------------------------|-----------------------------|
| Always loaded  | Beads memories   | Project facts, rules, lessons, patterns | Every session via `bd prime` |
| On-demand      | ChromaDB         | Semantic Q&A pairs                      | When task needs deeper context |
| Work tracking  | Beads issues     | Tasks, epics, dependencies, status      | All work items               |

### What `bd prime` Loads Every Session

```
project-*    → project facts
rule-*       → constraints
lesson-*     → past mistakes
stack-*      → tech details
pattern-*    → recurring patterns
```

### User Corrections

When user corrects you:
1. IMMEDIATELY: `bd remember "lesson:<cat>:<insight>" --key lesson-<cat>-<nnn>`
2. Find next number: `bd memories lesson-<cat>` → count existing

---

## 8. ChromaDB Q&A Schema

```json
{
  "id": "<project>-<category>-<nnn>",
  "document": "Q: <natural language question>\nA: <1-2 line answer>",
  "metadata": {
    "project": "<project-name>",
    "category": "howto | arch | rule | pattern | debug",
    "source": "bootstrap | manual | auto",
    "created": "YYYY-MM-DD"
  }
}
```

| Category | Question Pattern                | Answer Pattern          |
|----------|---------------------------------|-------------------------|
| howto    | "How do I X?"                   | Actionable steps        |
| arch     | "What is X?"                    | Structural explanation  |
| rule     | "Can I X?"                      | Yes/no + constraint     |
| pattern  | "What pattern does X use?"      | Code/design pattern     |
| debug    | "X fails with Y, fix?"          | Diagnostic steps        |

---

## 9. Commit Convention

1. `git log --oneline -10` — match existing pattern if present
2. If no pattern: `<type>: <summary> [<bead-id>]`
   - Types: `feat` | `fix` | `chore` | `refactor` | `test` | `docs`
3. Use HEREDOC format for multi-line messages
4. NEVER amend unless user explicitly says "amend"

---

## 10. Autonomy Levels

### SILENT (zero prompts)

All file read/write operations | `git status/add/diff/log/commit` | All `bd` commands | Build/test commands | ChromaDB queries | System inspection commands

### ASK

Everything in Section 2 (Blocklist).

### REFUSE

See NEVER list in Section 2.

---

## 11. Verification Protocol

| Action            | Expected                      | On Failure                                      |
|-------------------|-------------------------------|-------------------------------------------------|
| `bd create`       | stdout contains "Created"     | `bd doctor` → retry 1x                          |
| `bd update`       | stdout contains "Updated"     | `bd show <id>` → retry with correct state       |
| `bd close`        | stdout contains "Closed"      | `bd show <id>` → if already closed, skip        |
| `bd remember`     | No error                      | `bd doctor` → retry 1x                          |
| ChromaDB upsert   | No error                      | Check collection exists → create → retry         |
| ChromaDB query    | Results array                 | Fallback to `bd memories`                        |
| `git commit`      | Exit code 0                   | Read error → fix cause → NEW commit             |

**Retry limit**: 2 attempts per action. After 2 failures:
1. `bd create --type=bug --title="<error>" -p 1`
2. Try different approach
3. If no alternative → ask user

---

## 12. Bug Classification & Fix Protocol

| Type    | Label     | Definition                        | Fix Scope              |
|---------|-----------|-----------------------------------|------------------------|
| System  | `system`  | Setup, infra, tool configuration  | Setup/config files ONLY|
| Project | `project` | Code, business logic, tests       | Project source ONLY    |

**Rule**: System bugs NEVER modify project code. Project bugs NEVER modify system setup.

### Fix Protocol (6 Steps)

1. **CLASSIFY**: System or project?
2. **LOG**: Create bead hierarchy (epic → bug → diagnose/fix/verify/prevent tasks)
3. **DIAGNOSE**: Reproduce → root cause
4. **FIX**: System → config only | Project → source only
5. **VERIFY**: Run original failing command
6. **PREVENT**: Store lesson + add test/ChromaDB entry

---

## 13. Self-Healing

| Trigger                              | Action                                    | Result                                |
|--------------------------------------|-------------------------------------------|---------------------------------------|
| `bd prime` fails or memories empty   | Re-run Bootstrap (Section 14)             | Memories rebuilt                      |
| ChromaDB connection error            | Log warning, fallback to `bd memories`    | Degraded mode                         |
| `bd` command lock error              | `bd doctor --fix`                         | If fails → warn user, continue        |
| `git commit` hook fails              | Read error, fix, NEW commit               | Never amend or skip hooks             |
| ChromaDB collection missing          | Create collection, re-run query           | Collection restored                   |

**Priority**: Work must NEVER be blocked by tool failures.

---

## 14. Bootstrap Procedure

> Triggered when BOOT SEQUENCE reaches BOOTSTRAP, or `bd memories project` returns empty.

### Step 1 — Detect Project Type

| File Found        | Language       | Test Command          |
|-------------------|----------------|-----------------------|
| package.json      | Node.js        | Check `scripts.test`  |
| pyproject.toml    | Python         | Check `[tool.pytest]` |
| requirements.txt  | Python (pip)   | `pytest`              |
| Cargo.toml        | Rust           | `cargo test`          |
| go.mod            | Go             | `go test ./...`       |
| pom.xml           | Java/Maven     | `mvn test`            |
| build.gradle      | Java/Gradle    | `gradle test`         |
| Makefile          | Check targets  | `make test`           |
| None found        | Ask user       | —                     |

### Step 2 — Scan & Store

```bash
bd remember "<name>: <description>" --key project-overview
bd remember "<lang>+<framework>" --key project-stack
bd remember "<entry-file>" --key project-entry
bd remember "<key-dirs>" --key project-structure
bd remember "<test-cmd>" --key project-test-cmd
```

### Step 3 — Detect Rules

Extract from `.gitignore`, CI config, linter config, README Contributing section.
Store as `bd remember "NEVER/ALWAYS <what>" --key rule-<name>`

### Step 4 — ChromaDB (if available)

Create collection, generate 10-20 Q&A pairs, upsert.

### Step 5 — Report

Tell user: `"Bootstrap complete. Detected: <stack>. Stored <N> memories. ChromaDB: <status>."`

---

## 15. Component Setup Reference

### Beads

```bash
# Install
brew install beads              # OR npm install -g @beads/bd
# Init
bd init && bd info
# Fix
bd doctor --fix
```

### ChromaDB

```bash
mkdir -p ~/.autonomous-dev/chromadb
# docker-compose.yml with BIND MOUNT: ~/.autonomous-dev/chromadb/data:/chroma/chroma
cd ~/.autonomous-dev/chromadb && docker compose up -d
curl http://localhost:8080/health    # Expect 200
```

### Permissions

Use your AI tool's permission system to auto-allow:
- All `bd` commands
- `git status/add/diff/log/commit`
- Build/test commands (npm, python, pytest, etc.)
- System inspection (curl, which, ls, mkdir)

Must confirm: `git push`, `git reset`, `rm -rf`, `docker rm`

---

## 16. Full Setup Sequence

| Phase | Component     | Verification                      |
|-------|---------------|-----------------------------------|
| 0     | Prerequisites | git, docker, node, python 3.11+   |
| 1     | Beads         | `bd info` → no error              |
| 2     | ChromaDB      | `curl localhost:8080/health` → 200|
| 3     | Permissions   | Tool permissions configured       |
| 4     | Seed Knowledge| `bd memories project` → has output|
| 5     | Verify All    | All health checks pass            |

Resumable: if fails at Phase 2, Phase 1 is done. `bd list --status=open` shows remaining.

---

## Project-Specific Context

- **Repo**: `linkright_final` — agentic AI career signal processing ecosystem
- **Context directory**: `context/` is READ-ONLY. Never modify files inside it.
- **Structure**: Root contains only `setup/`, `context/`, `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`, `.gitignore`
