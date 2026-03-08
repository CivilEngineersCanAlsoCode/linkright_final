# Autonomous Development Protocol v8.0

> Boot loader for autonomous AI development.
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
If Agent Mail available → send `ack_required` message. Otherwise → ask in terminal.
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
|           | 2. Check ChromaDB: `chroma_list_collections` | Available        | Skip ChromaDB features     |
|           | 3. Check Agent Mail: `list_projects`| Available              | Skip Agent Mail features   |
|           | 4. If Agent Mail: `register_agent(...)` | —                  | —                          |
|           | 5. `bd ready` → show work           | → WORK_LOOP            | —                          |
| CLOSING   | See Section 3.1                     | —                      | —                          |

### 3.1 Closing Protocol

1. If Agent Mail → release ALL file reservations
2. `git add <specific-files>` → `bd dolt pull` → `git commit`
3. **Safe push sequence** (rebase conflict protection):
   ```bash
   git pull --rebase
   # If rebase conflicts occur:
   #   1. git rebase --abort        (immediately abort — NEVER auto-resolve rebase conflicts)
   #   2. git pull --no-rebase      (fallback to merge commit)
   #   3. If merge ALSO conflicts → ask user for help. Do NOT auto-resolve.
   git push
   ```
4. If Agent Mail → `send_message(subject="Session complete", body_md="<summary>")`

---

## 4. Work Loop

```
PICK → CLAIM → [RESERVE] → CONTEXT → IMPLEMENT → VERIFY → CLOSE → [AUTO-COMMIT] → repeat
```

| Step          | Action                                      | Command / Detail                                   |
|---------------|---------------------------------------------|----------------------------------------------------|
| 1. PICK       | First item from ready queue                 | `bd ready`                                         |
| 2. CLAIM      | Take ownership                              | `bd update <id> --status=in_progress`              |
| 3. RESERVE    | Lock files *(Agent Mail only)*              | `file_reservation_paths(paths=[<globs>], exclusive=true, reason="<bead-id>")` |
| 4. CONTEXT    | Get knowledge                               | `bd memories <keyword>` → if insufficient + ChromaDB available: `chroma_query_documents(collection="<project>-qa", query_texts=["<question>"], n_results=5)` |
| 5. IMPLEMENT  | Write code                                  | Edit/Write tools                                   |
| 6. VERIFY     | Run tests                                   | Project test command from `project-test-cmd` memory |
| 7. CLOSE      | Mark done, increment counter                | `bd close <id>`                                    |
| 8. AUTO-COMMIT| Every 5th close                             | See auto-commit rule below                         |

### Auto-Commit Rule

- Track `bd close` count per session (mental counter, use modulo)
- Every 5th close → auto-commit without asking
- Message format: `checkpoint: 5 tasks completed [sync-xx, sync-yy, ...]`
- Also commit on session end regardless of count
- This is NOT in the BLOCKLIST — no permission needed
- **CRITICAL**: Use `git add <specific-files>` — NEVER `git add .` or `git add -A`
  - Only stage files that were modified by the 5 closed tasks
  - If unsure which files belong to which task, use `git diff --name-only` and review before staging
  - This prevents accidentally committing WIP for the next task or unrelated changes

### Agent Mail Steps (conditional — only if available)

| When           | Action                                                                |
|----------------|-----------------------------------------------------------------------|
| Before work    | Reserve files with glob patterns, announce start in thread `<bead-id>` |
| After work     | Release reservations, announce completion                             |
| Blocklist item | Send `ack_required` to `HumanOverseer`, WAIT for response            |

---

## 5. "beads" Keyword Protocol

When user says "beads":

1. **STOP** — zero code, zero file changes
2. **ANALYZE** — decompose the task into hierarchy
3. **CREATE** —
   - EPIC: `bd create --type=epic --title="<goal>" -p <priority>`
   - FEATURE: `bd create --type=feature --parent=<epic> --title="<capability>"`
   - TASK: `bd create --type=task --parent=<feature> --title="<work-item>"`
   - SUBTASK: `bd create --type=task --parent=<task> --title="<atomic-step>"`
4. **WIRE** — `bd dep <blocker> --blocks <blocked>`
5. **SHOW** — `bd dep tree <epic-id>`
6. **WAIT** — user approval before execution
7. **EXECUTE** — via WORK_LOOP (Section 4)

---

## 6. Naming Conventions

| Entity              | Pattern                                     | Example                                |
|---------------------|---------------------------------------------|----------------------------------------|
| Project name        | `basename(git remote URL)` or `basename(pwd)` | `linkright_final`, `sync`           |
| Beads memory: overview | `project-overview`                       | `bd remember "X: desc" --key project-overview` |
| Beads memory: stack | `project-stack`                              | `bd remember "Node+Express" --key project-stack` |
| Beads memory: entry | `project-entry`                              | `bd remember "src/index.ts" --key project-entry` |
| Beads memory: structure | `project-structure`                      | `bd remember "src/,tests/,docs/" --key project-structure` |
| Beads memory: test  | `project-test-cmd`                           | `bd remember "npm test" --key project-test-cmd` |
| Rule keys           | `rule-<name>`                                | `rule-no-console-log`                  |
| Lesson keys         | `lesson-<category>-<nnn>`                    | `lesson-setup-001`                     |
| Stack keys          | `stack-<component>`                          | `stack-mongodb`                        |
| Pattern keys        | `pattern-<name>`                             | `pattern-error-handling`               |
| ChromaDB collection | `<project>-qa`                               | `linkright_final-qa`                   |
| ChromaDB doc IDs    | `<project>-<category>-<nnn>`                 | `linkright_final-howto-001`            |
| ChromaDB categories | `howto`, `arch`, `rule`, `pattern`, `debug`  | —                                      |
| Agent Mail threads  | Bead issue ID only                           | `sync-907`                             |
| Reservation reason  | Bead issue ID only                           | `sync-907`                             |

---

## 7. Storage Architecture

| Layer          | Tool             | What Goes Here                          | When                        |
|----------------|------------------|-----------------------------------------|-----------------------------|
| Always loaded  | Beads memories   | Project facts, rules, lessons, patterns | Every session via `bd prime` |
| On-demand      | ChromaDB         | Semantic Q&A pairs                      | When task needs deeper context |
| Work tracking  | Beads issues     | Tasks, epics, dependencies, status      | All work items               |
| Coordination   | Agent Mail       | Messages, file locks, decisions         | Multi-agent sessions         |

### What `bd prime` Loads Every Session

```
project-*    → project facts (overview, stack, entry, structure, test-cmd)
rule-*       → constraints (NEVER/ALWAYS rules)
lesson-*     → past mistakes and insights
stack-*      → tech component details
pattern-*    → recurring code/design patterns
```

### User Corrections

When user corrects you:
1. IMMEDIATELY: `bd remember "lesson:<cat>:<insight>" --key lesson-<cat>-<nnn>`
2. Find next number: `bd memories lesson-<cat>` → count existing entries

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
| debug    | "X fails with Y, fix?"         | Diagnostic steps        |

---

## 9. Commit Convention

1. `git log --oneline -10` — match existing pattern if present
2. If no pattern or empty history:
   ```
   <type>: <summary> [<bead-id>]
   ```
   Types: `feat` | `fix` | `chore` | `refactor` | `test` | `docs`
3. Always end with: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
4. Use HEREDOC format for multi-line messages
5. NEVER amend unless user explicitly says "amend"

---

## 10. Agent Mail Protocol

> All Agent Mail actions are CONDITIONAL. If Agent Mail MCP unavailable → skip silently.

### Register (session start, once)

```
register_agent(
  project_key=<pwd-absolute-path>,
  program="claude-code",
  model="claude-opus-4-6",
  task_description="<session-goal>"
)
```

### Reserve Files (before editing, every task)

```
file_reservation_paths(
  project_key=<pwd>, agent_name=<name>,
  paths=["<glob>"], ttl_seconds=3600,
  exclusive=true, reason="<bead-id>"
)
```

| Task Type           | Glob Pattern        |
|---------------------|---------------------|
| Edit files in dir X | `X/**`              |
| Edit single file F  | `F`                 |
| Edit all configs    | `<config-dir>/*`    |
| Unknown scope       | Ask user            |

### Critical Decision (any BLOCKLIST item)

```
send_message(
  sender=<name>, to=["HumanOverseer"],
  subject="[<bead-id>] DECISION: <one-line-summary>",
  body_md="## Context\n<what-why>\n## Options\n1. <A>\n2. <B>\n## Recommend\n<pick>",
  ack_required=true, importance="high", thread_id="<bead-id>"
)
```

WAIT for ack. Do NOT proceed until acknowledged.

### Handoff (task done, unblocks another agent)

```
send_message(
  sender=<name>, to=["<other-agent>"],
  subject="[<bead-id>] UNBLOCKED: <what>",
  body_md="Completed <task>. Files released.",
  thread_id="<bead-id>"
)
```

### Session End

```
release_file_reservations(project_key=<pwd>, agent_name=<name>)
send_message(subject="Session complete", body_md="<bullet-summary>")
```

---

## 11. Autonomy Levels

### SILENT (zero prompts, zero confirmations)

Read, Write, Edit, Glob, Grep | `git status/add/diff/log/commit` | All `bd` commands | `npm/node/npx/python/pytest/jest/cargo/go` (test/build) | ChromaDB queries/upserts | Agent Mail messages/reservations | `curl/which/ls/mkdir` (system inspection) | `docker compose logs/docker ps` (inspection only)

### ASK (via blocklist or terminal)

Everything in Section 2.

### REFUSE

See NEVER list in Section 2.

---

## 12. Verification Protocol

After EVERY action, check result:

| Action            | Expected                      | On Failure                                      |
|-------------------|-------------------------------|-------------------------------------------------|
| `bd create`       | stdout contains "Created"     | `bd doctor` → retry 1x                          |
| `bd update`       | stdout contains "Updated"     | `bd show <id>` → retry with correct state       |
| `bd close`        | stdout contains "Closed"      | `bd show <id>` → if already closed, skip        |
| `bd remember`     | No error                      | `bd doctor` → retry 1x                          |
| ChromaDB upsert   | No error                      | Check collection exists → create → retry         |
| ChromaDB query    | Results array                 | Fallback to `bd memories`                        |
| Agent Mail send   | Message ID returned           | Warn, continue without coordination              |
| `git commit`      | Exit code 0                   | Read error → fix cause → NEW commit (never amend)|
| File edit         | "updated successfully"        | Read file → verify content → adjust → retry      |

**Retry limit**: 2 attempts per action. After 2 failures:
1. `bd create --type=bug --title="<error-message>" -p 1 --label auto-detected`
2. **Do NOT self-assign this bug.** Bugs with `auto-detected` label are for human triage only. Move on.
3. Try completely different approach to the original task
4. If no alternative → send `ack_required` to user

---

## 13. Bug Classification

| Type    | Label     | Definition                        | Fix Scope              | Example                        |
|---------|-----------|-----------------------------------|------------------------|--------------------------------|
| System  | `system`  | Setup, infra, tool configuration  | Setup/config files ONLY| ChromaDB won't start           |
| Project | `project` | Code, business logic, tests       | Project source ONLY    | Function returns wrong value   |

**Strict isolation rule**: System bugs NEVER modify project code. Project bugs NEVER modify system setup.

### Bug Fix Protocol (6 Steps)

1. **CLASSIFY**: System or project?
2. **LOG** — Create bead hierarchy (if "Bug Fixing" epic doesn't exist, create it):
   ```
   Bug Fixing (epic, P1)
   └── <error-message-first-50-chars> (bug, label: system|project)
       ├── Diagnose: reproduce and root-cause (task)
       ├── Fix: implement solution (task)
       ├── Verify: confirm fix works (task)
       └── Prevent: add guard against recurrence (task)
   ```
3. **DIAGNOSE**: `bd update <diagnose> --status=in_progress` → reproduce → root cause → `bd close`
4. **FIX**: System → config files only | Project → source code only → `bd close`
5. **VERIFY**: Run original failing command → expect success. Still fails → back to step 3 → `bd close`
6. **PREVENT**:
   - System bug → `bd remember "lesson:setup:<what>" --key lesson-setup-<nnn>`
   - Project bug → add regression test + ChromaDB debug Q&A pair → `bd close` all

---

## 14. Self-Healing

Self-healing triggers automatically. No user action needed.

| Trigger                              | Action                                    | Result                                |
|--------------------------------------|-------------------------------------------|---------------------------------------|
| `bd prime` fails or memories empty   | Re-run Bootstrap (Section 15)             | Memories rebuilt from project scan    |
| ChromaDB connection error            | Log warning, fallback to `bd memories`    | Degraded mode (keyword search only)   |
| Agent Mail unavailable               | Log warning, skip Agent Mail steps        | Solo mode (terminal decisions)        |
| `bd` command lock error              | `bd doctor --fix`                         | If still fails → warn user, continue  |
| `git commit` hook fails              | Read error, fix issue, NEW commit         | Never amend or `--no-verify`          |
| ChromaDB collection missing          | `chroma_create_collection(name="<project>-qa")` | Re-run failed query            |

**Priority**: Work must NEVER be blocked by tool failures.

| Tools Down     | Fallback                                |
|----------------|-----------------------------------------|
| Beads down     | Track in git commits                    |
| ChromaDB down  | Use `bd memories`                       |
| Agent Mail down| Work solo, decisions via terminal        |
| All down       | Principles (Section 1) still apply, work manually |

---

## 15. Bootstrap Procedure

> Triggered when BOOT SEQUENCE reaches BOOTSTRAP state, or `bd memories project` returns empty.

### Step 1 — Detect Project Type

```bash
ls README.md package.json pyproject.toml Cargo.toml requirements.txt \
   go.mod pom.xml build.gradle Makefile 2>/dev/null
```

| File Found        | Language       | Test Command                  |
|-------------------|----------------|-------------------------------|
| package.json      | Node.js        | Check `scripts.test`          |
| pyproject.toml    | Python         | Check `[tool.pytest]`         |
| requirements.txt  | Python (pip)   | `pytest`                      |
| Cargo.toml        | Rust           | `cargo test`                  |
| go.mod            | Go             | `go test ./...`               |
| pom.xml           | Java/Maven     | `mvn test`                    |
| build.gradle      | Java/Gradle    | `gradle test`                 |
| Makefile          | Check targets  | `make test`                   |
| None found        | Ask user       | —                             |

### Step 2 — Scan Structure

```bash
ls -d */ 2>/dev/null
find . -maxdepth 2 -name "*.config.*" -o -name ".*.yml" 2>/dev/null | head -20
```

### Step 3 — Store in Beads

```bash
bd remember "<name>: <README first line>" --key project-overview
bd remember "<lang>+<framework>+<test-runner>" --key project-stack
bd remember "<main-entry-file>" --key project-entry
bd remember "<key-dirs-comma-separated>" --key project-structure
bd remember "<exact-test-command>" --key project-test-cmd
```

### Step 4 — Detect & Store Rules

- `.gitignore` exists → extract patterns, store relevant as `rule-*`
- CI config exists → extract constraints as `rule-*`
- Linter config exists → note command as `rule-lint`
- README has "Contributing" → extract rules
- Store each: `bd remember "NEVER/ALWAYS <what>" --key rule-<name>`

### Step 5 — ChromaDB Setup (if available)

```
chroma_list_collections → if available:
  chroma_create_collection(name="<project>-qa")
  Generate 10-20 Q&A pairs from README + structure
  chroma_add_documents(collection="<project>-qa", ids=[...], documents=[...], metadatas=[...])
```

### Step 6 — Agent Mail Registration (if available)

```
list_projects → if available:
  register_agent(project_key=<pwd>)
```

### Step 7 — Report

Tell user: `"Bootstrap complete. Detected: <stack>. Stored <N> memories. ChromaDB: <available/unavailable>. Agent Mail: <available/unavailable>."`

---

## 16. Component Setup: Beads

> **IMPORTANT**: Use `bd` (Go, v0.59.0+) — NOT `br` (beads_rust). Only bd has memory features (remember/memories/prime).
> If `bd version` shows "br version", you have the wrong tool. See Agent Mail section for alias fix.

### Install

```bash
# Check
which bd && bd info

# Install (prefer npm — latest version with memory features)
npm install -g @beads/bd              # npm global (RECOMMENDED)
brew install beads                    # macOS Homebrew
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# Verify — must show "bd version", NOT "br version"
bd version
```

### Initialize

```bash
bd init                               # Creates .beads/
bd dolt set database "$(basename $(pwd))"  # Fix database name (init uses wrong default)
bd info                               # Expect "Issue Count: 0"
```

### Multi-Project Port Allocation

When running multiple projects with dolt servers (e.g., sync + Antigravity), each project needs a unique port. The bootstrap script auto-allocates ports in range **13400-13599** based on project name hash.

```bash
# See your project's port:
grep "port:" .beads/dolt/config.yaml

# See all active dolt ports:
lsof -i -P | grep dolt | grep LISTEN

# Manually set port if needed:
bd dolt set port <port>
```

### Fix Issues

```bash
bd doctor --fix                       # Auto-fix common issues
bd migrate --update-repo-id           # Manual (interactive y/n required)
```

### Health Check

`bd info` → expect no error, shows Issue Count.

---

## 17. Component Setup: ChromaDB

### Prerequisites

Docker must be running: `docker ps` (fail → `open -a Docker` on macOS)

### Directory Setup

```bash
mkdir -p ~/.autonomous-dev/chromadb
```

### Docker Compose File

Location: `~/.autonomous-dev/chromadb/docker-compose.yml`

Requirements:
- Image: `chromadb/chroma:latest`
- **BIND MOUNT** (critical — NOT Docker volume):
  ```yaml
  volumes:
    - ~/.autonomous-dev/chromadb/data:/chroma/chroma    # RIGHT
  # NOT:
  #   - chroma-data:/chroma/chroma                      # WRONG (data lost if container removed)
  ```
- ChromaDB port: 8000
- `restart: unless-stopped`

### Environment File

Location: `~/.autonomous-dev/chromadb/.env`

```
CHROMA_DATA_PATH=./data
```

### Start & Verify

```bash
cd ~/.autonomous-dev/chromadb && docker compose up -d
curl http://localhost:8000/api/v2/heartbeat     # Expect JSON with heartbeat
```

### Connect to Claude Code

```bash
# Use uvx native MCP client (connects to ChromaDB on port 8000)
claude mcp add chromadb -- uvx chroma-mcp --client-type http --host localhost --port 8000
claude mcp list                       # Expect "chromadb" in output
```

### Create Collection

```
chroma_create_collection(name="<project-name>-qa")
chroma_list_collections               # Expect collection in list
```

### Data Persistence Guarantee

Data lives at `~/.autonomous-dev/chromadb/data/` on filesystem.
Survives: `docker rm`, `docker uninstall`, system restart.
Only `rm -rf ~/.autonomous-dev/chromadb/data/` destroys it.

---

## 18. Component Setup: Agent Mail

### Prerequisites

Python 3.11+, uv: `python3 --version && which uv`

### Install

```bash
# IMPORTANT: Run from HOME directory, and use --skip-beads to avoid installing br (beads_rust)
cd ~ && curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/mcp_agent_mail/main/scripts/install.sh?$(date +%s)" | bash -s -- --yes --skip-beads
```

Creates: Python venv, bearer token, shell alias `am` in ~/mcp_agent_mail.
> **WARNING**: Without `--skip-beads`, the install script adds `alias bd='br'` to .zshrc which masks bd (Go). Always use `--skip-beads`.

### Start & Verify

```bash
am                                    # Shell alias
# OR: uv run python -m mcp_agent_mail.http --host 127.0.0.1 --port 8765
curl http://localhost:8765/health/liveness     # Expect {"status":"alive"}
```

### Connect to Claude Code

```bash
# Find your token (generated during install):
grep BEARER ~/mcp_agent_mail/.env

claude mcp add --transport http agent-mail "http://localhost:8765/mcp" \
  --header "Authorization: Bearer <TOKEN-FROM-ABOVE>"
claude mcp list                       # Expect "agent-mail" in output
```

### Pre-Commit Guard (optional, multi-agent)

```
install_precommit_guard(project_key=<abs-path>, code_repo_path=<abs-path>)
```

### Data Persistence

Git-backed. Messages stored in Git repo (automatic, persistent).
Search index: SQLite (rebuilds from Git if lost).
No bind mount needed — Git IS the persistence layer.

---

## 19. Component Setup: Claude Code Permissions

### File: `~/.claude/settings.json`

#### Auto-Allow (add to `permissions.allow` array)

```
"Bash(bd *)", "Bash(git status*)", "Bash(git add *)", "Bash(git diff*)",
"Bash(git log*)", "Bash(git commit *)", "Bash(npm *)", "Bash(node *)",
"Bash(npx *)", "Bash(python*)", "Bash(pytest*)", "Bash(docker compose *)",
"Bash(docker ps*)", "Bash(curl *)", "Bash(which *)", "Bash(mkdir *)", "Bash(ls *)"
```

Or use wildcard shortcut: `"Bash(*)"` (allows ALL bash commands — faster but less guardrails)

#### Must Confirm (do NOT auto-allow)

```
Bash(git push*), Bash(git reset*), Bash(rm -rf*), Bash(docker rm*)
```

#### Hooks

| Hook          | Command    | Purpose                          |
|---------------|------------|----------------------------------|
| SessionStart  | `bd prime` | Load context at session start    |
| PreCompact    | `bd prime` | Preserve context before compact  |

---

## 20. Full Setup Sequence

Each phase depends on the previous. If setup fails mid-way, resume from first open task.

| Phase      | Component     | Depends On | Action                                         | Verification                     |
|------------|---------------|------------|-------------------------------------------------|----------------------------------|
| preflight  | Fresh Mac     | —          | Xcode CLT, Homebrew, node, python, dolt, uv, git identity | All tools in PATH |
| 0          | Prerequisites | preflight  | Verify git, docker, node, python 3.11+, uv    | All commands return versions     |
| 1          | Beads         | Phase 0    | Install + `bd init` (npm EACCES-safe)          | `bd info` → no error             |
| 2     | ChromaDB      | Phase 0    | Docker compose + bind mount     | `curl localhost:8000/api/v2/heartbeat` → JSON |
| 3     | Agent Mail    | Phase 0    | Install script + MCP connect    | `curl localhost:8765/health/liveness` → 200 |
| 4     | Permissions   | Phase 1    | Update settings.json + hooks    | `claude mcp list` → shows servers |
| 5     | Seed Knowledge| Phases 1-4 | Bootstrap Procedure (Section 15)| `bd memories project` → has output |
| 6     | Verify All    | Phases 1-5 | Run all 7 health checks         | All pass                          |

### Pre-flight Phase: Fresh Mac Setup

> Runs automatically before Phase 0. Skip with `--skip-preflight` if tools are already installed.

The pre-flight phase handles the "brand new Mac with nothing installed" scenario:

1. **Xcode CLT**: Detects Apple shim (fake `git` that triggers GUI popup) via `xcode-select -p`. Auto-installs non-interactively and waits for completion.
2. **Homebrew**: Installs via `NONINTERACTIVE=1` to avoid terminal hangs. Adds `/opt/homebrew/bin/brew` to PATH for Apple Silicon.
3. **Missing tools**: Auto-installs `node`, `python@3.11`, `dolt` via `brew install`. Uses `HOMEBREW_NO_AUTO_UPDATE=1` for speed.
4. **uv**: Installs via `curl -LsSf https://astral.sh/uv/install.sh | sh` (needed for Agent Mail).
5. **Git identity**: Checks `git config --global user.name/email`. Prompts interactively if missing (required for dolt/beads commits).

**Timeout behavior**: Install-heavy phases (1=Beads, 2=ChromaDB, 3=Agent Mail) have **no timeout** — `npm install`, `docker pull`, and `git clone` can take minutes on slow connections. Phases 4-6 keep the 120s timeout.

**npm EACCES**: Phase 1 detects npm permission errors (common with macOS `.pkg` Node installs) and falls back to `sudo npm install -g` or `brew install beads`.

**Agent Mail safety**: The installer is given a 15s grace period on SIGTERM before SIGKILL, preventing corrupted venv from mid-write kills.

### Phase 1 Detail: Beads Tracks Its Own Setup

After beads init, create tracking epic:

```bash
bd create --type=epic --title="System Bootstrap" -p 0
bd create --type=task --parent=<epic> --title="Setup ChromaDB" -p 1
bd create --type=task --parent=<epic> --title="Setup Agent Mail" -p 1
bd create --type=task --parent=<epic> --title="Configure Claude permissions" -p 1
bd create --type=task --parent=<epic> --title="Seed project knowledge" -p 1
bd create --type=task --parent=<epic> --title="Verify full system" -p 0
```

### Phase 6 Detail: Full Verification Checklist

| #  | Check                              | Command                           | Expected    |
|----|------------------------------------|-----------------------------------|-------------|
| 1  | Beads running                      | `bd info`                         | No error    |
| 2  | Memories populated                 | `bd memories project`             | Has output  |
| 3  | ChromaDB healthy                   | `curl http://localhost:8000/api/v2/heartbeat` | JSON    |
| 4  | Agent Mail healthy                 | `curl http://localhost:8765/health/liveness` | 200       |
| 5  | MCP servers connected              | `claude mcp list`                 | Shows both  |
| 6  | ChromaDB collection works          | `chroma_query_documents` test     | Returns results |
| 7  | Beads context loads                | `bd prime`                        | Outputs context |

All pass → `bd close <verify-task>` → `bd close <epic>`.
Any fail → diagnose using Bug Fix Protocol (Section 13).

### Resumability

If setup fails at Phase 3, phases 1-2 are complete.
Run `bd list --status=open --parent=<epic>` → shows remaining tasks. Resume from first open.

---

## 21. Agent Workflows Setup

Agent workflows live in `.agents/workflows/` and are invoked by referencing them in prompts (e.g., `@.agents/workflows/sync-beads.md`).

### Available Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| **sync-beads** | `.agents/workflows/sync-beads.md` | Task management & memory management via beads. Use before any plan with 3+ steps. |
| **sync-session** | `.agents/workflows/sync-session.md` | Records terminal activity as a chronological story in `session_history.md`. |

### Setup Instructions

Workflows require no installation — they're markdown files read by Claude Code at invocation time.

**Step 1**: Ensure the directory structure exists:

```bash
mkdir -p .agents/workflows
```

**Step 2**: Create `sync-beads.md` — task & memory management workflow:

```yaml
---
description: Task Management and Memory Management expert called Beads, to be used before execution of any plan with more than 3 steps
---
```

Key contents:
- bd (Go) quick reference commands (ready, show, update, close, sync, prime)
- Non-interactive shell command patterns (cp -f, mv -f, rm -f)
- Issue hierarchy (Epic → Feature → User Story → Task → Subtask)
- Issue types, priorities, agent workflow steps
- Session protocol (starting: bd prime → bd dolt pull → bd ready)
- Session closing checklist (git pull --rebase → bd sync → git push)

> **IMPORTANT**: Must include warning about NOT using `br` (beads_rust) — only `bd` (Go) has memory features.

**Step 3**: Create `sync-session.md` — session history recorder:

```yaml
---
description: Claude terminal history ko ek kahani (story) ki tarah session_history.md mein record karna
---
```

Key contents:
- Reads `~/.claude/history.jsonl` for terminal history
- Analyzes each interaction
- Updates `session_history.md` in third-person Romanized Hindi (story format)
- Reports latest status to user

### How to Use

```bash
# In Claude Code prompts:
# Plan work using beads workflow:
"plan using beads @.agents/workflows/sync-beads.md"

# Record session history:
"@.agents/workflows/sync-session.md"
```

### Adding New Workflows

1. Create a `.md` file in `.agents/workflows/`
2. Add YAML frontmatter with `description:` field
3. Write instructions the agent should follow
4. Reference via `@.agents/workflows/<name>.md` in prompts

---

## Project-Specific Context

- **Repo**: `sync` — agentic AI career signal processing ecosystem
- **Context directory**: `context/` is READ-ONLY. Never modify files inside it.
- **Structure**: `setup/`, `context/`, `.agents/`, `CLAUDE.md`, `AGENTS.md`, `session_history.md`, `.gitignore`
