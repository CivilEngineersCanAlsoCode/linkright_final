# CLAUDE.md — Autonomous Development Protocol v7.0
# This file is a BOOT LOADER + OPERATING SYSTEM for Claude.
# All project knowledge lives in Beads memories + ChromaDB. Not here.
# Last updated: 2026-03-08

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART A: OPERATIONAL PROTOCOL (active every session)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ─── 1. PRINCIPLES ──────────────────────────────────────────
# P1: Simplest possible change. Minimal files, minimal code.
# P2: Root causes only. No temporary patches. No workarounds.
# P3: Command fails 2x same error → stop, bd create --type=bug, try alternative.
# P4: Never claim done without running verification command.
# P5: Zero project knowledge in this file. bd remember or ChromaDB only.
# P6: Silent by default. Only involve user for BLOCKLIST items.

# ─── 2. BLOCKLIST (ack_required before ANY of these) ────────
#
# These 18 actions ALWAYS require user approval.
# If Agent Mail available → send ack_required message.
# If Agent Mail unavailable → ask in terminal.
# Everything NOT on this list → handle silently.
#
# FILES:
#   1. Delete more than 2 files in one action
#   2. Delete any file larger than 100 lines
#   3. Create new directory at project root
#   4. Modify dotfile configs (.gitignore, .env, .eslintrc, etc.)
#
# GIT:
#   5. git push (any remote, any branch)
#   6. git reset --hard
#   7. git checkout -- <file> (discard changes)
#   8. git branch -D (force delete branch)
#   9. Any --force flag on any git command
#
# DEPENDENCIES:
#   10. Add/remove/upgrade packages (package.json, requirements.txt, Cargo.toml)
#   11. Modify lockfiles (package-lock.json, yarn.lock, poetry.lock)
#
# INFRASTRUCTURE:
#   12. Modify CI/CD files (.github/workflows/*, .gitlab-ci.yml)
#   13. Modify Docker files (Dockerfile, docker-compose.yml)
#   14. Database schema changes or migrations
#   15. Auth, security, or encryption code changes
#
# ARCHITECTURE:
#   16. Create new module or top-level directory
#   17. Rename/move file imported by 5+ other files
#   18. Change public API signature (function params, return types)
#
# NEVER (even if user asks, refuse):
#   - rm -rf / or any root-level recursive delete
#   - Commit credentials, tokens, .env files with secrets
#   - git push --force to main/master
#   - --no-verify on any git command

# ─── 3. BOOT SEQUENCE (state machine) ──────────────────────
#
# INIT:
#   RUN: bd info 2>/dev/null
#   OK → go to LOAD
#   FAIL → RUN: bd init → go to LOAD
#
# LOAD:
#   RUN: bd prime
#   OK (memories printed) → RUN: bd memories project
#     HAS output → go to OPERATE
#     EMPTY → go to BOOTSTRAP
#   FAIL → go to BOOTSTRAP
#
# BOOTSTRAP (first session or data loss):
#   → Execute Section 8 (Bootstrap Procedure)
#   → Then go to OPERATE
#
# OPERATE:
#   1. bd dolt pull (fail → warn, continue)
#   2. Check tool availability:
#      ChromaDB: chroma_list_collections (fail → skip ChromaDB features)
#      Agent Mail: list_projects (fail → skip Agent Mail features)
#   3. IF Agent Mail available:
#      register_agent(project_key=<pwd>, program="claude-code",
#        model="claude-opus-4-6", task_description="Session started")
#   4. bd ready → show available work
#   5. Go to WORK_LOOP
#
# WORK_LOOP:
#   1. PICK: first item from bd ready output
#   2. CLAIM: bd update <id> --status=in_progress
#   3. IF Agent Mail available:
#      RESERVE: file_reservation_paths(project_key=<pwd>, agent_name=<name>,
#        paths=[<glob-patterns-of-files-to-edit>],
#        ttl_seconds=3600, exclusive=true, reason="<bead-id>")
#      ANNOUNCE: send_message(sender=<name>, to=[<other-agents>],
#        subject="[<bead-id>] Starting: <task-title>", thread_id="<bead-id>")
#   4. CONTEXT:
#      FIRST: bd memories <keyword-from-task>
#      IF insufficient AND ChromaDB available:
#        chroma_query_documents(collection="<project-name>-qa",
#          query_texts=["<question>"], n_results=5)
#   5. IMPLEMENT → TEST → VERIFY
#   6. CLOSE: bd close <id>. INCREMENT close_count.
#   7. IF Agent Mail available:
#      release_file_reservations(project_key=<pwd>, agent_name=<name>)
#      send_message(subject="[<bead-id>] Done: <summary>", thread_id="<bead-id>")
#   8. IF close_count % 5 == 0 (every 5th close):
#      AUTO-COMMIT: git add <changed-files> → bd dolt pull → git commit
#      Message: "checkpoint: <N> tasks completed [<bead-ids>]"
#      Reset is not needed — use modulo, keep counting.
#   9. Go to step 1 (next task)
#
# AUTO-COMMIT RULE:
#   Maintain a mental counter of bd close calls in this session.
#   After every 5th close: auto-commit all changes without asking.
#   Commit message format: "checkpoint: 5 tasks completed [bd-xx, bd-yy, ...]"
#   Also commit on session end regardless of count.
#   This is NOT in the BLOCKLIST — no permission needed.
#
# CLOSING (session end):
#   1. IF Agent Mail: release ALL reservations
#   2. git add <specific-files> → bd dolt pull → git commit (regardless of close_count)
#   3. IF Agent Mail: send_message(subject="Session complete", body="<work-summary>")

# ─── 4. NAMING CONVENTIONS (formulaic, zero creativity) ─────
#
# PROJECT_NAME:
#   = basename of git remote URL (without .git)
#   = FALLBACK: basename of working directory
#   Example: github.com/user/linkright.git → "linkright"
#   Example: /Users/user/Downloads/sync → "sync"
#
# BEADS MEMORY KEYS (exactly these namespaces):
#   project-overview    "One-line project description"
#   project-stack       "Languages + frameworks + tools"
#   project-entry       "Main entry point file path"
#   project-structure   "Key directories, comma-separated"
#   project-test-cmd    "Exact command to run tests"
#   rule-<name>         "NEVER/ALWAYS <specific action>"
#   lesson-<cat>-<nnn>  "Learned insight from mistake"
#   stack-<component>   "Technical detail about component"
#   pattern-<name>      "Recurring code/design pattern"
#
# CHROMADB COLLECTION: "<PROJECT_NAME>-qa"
# CHROMADB DOC IDS:    "<PROJECT_NAME>-<category>-<nnn>"
# CATEGORIES:          howto | arch | rule | pattern | debug (exactly these 5)
# AGENT MAIL THREADS:  bead issue ID only (e.g., "bd-a3f8"). Never custom.
# RESERVATION REASON:  bead issue ID only. Never free text.

# ─── 5. CHROMADB Q&A SCHEMA ────────────────────────────────
#
# id:       "<project>-<category>-<nnn>"
# document: "Q: <natural language question>\nA: <1-2 line answer>"
# metadata: {
#   "project":  "<project-name>",
#   "category": "howto" | "arch" | "rule" | "pattern" | "debug",
#   "source":   "bootstrap" | "manual" | "auto",
#   "created":  "YYYY-MM-DD"
# }
#
# howto   = "How do I X?" → actionable steps
# arch    = "What is X?" → structural explanation
# rule    = "Can I X?" → yes/no + constraint
# pattern = "What pattern does X use?" → code/design pattern
# debug   = "X fails with Y, fix?" → diagnostic steps

# ─── 6. STORAGE RULES ──────────────────────────────────────
#
# ALWAYS LOADED (bd prime injects every session):
#   → bd remember --key project-*   (project facts)
#   → bd remember --key rule-*      (constraints)
#   → bd remember --key lesson-*    (past mistakes)
#   → bd remember --key stack-*     (tech details)
#   → bd remember --key pattern-*   (recurring patterns)
#
# ON-DEMAND (query when task needs it):
#   → ChromaDB: chroma_query_documents   (semantic Q&A search)
#
# WORK TRACKING (structured task management):
#   → bd create / bd update / bd close   (issues, epics, dependencies)
#
# COMMUNICATION + AUDIT:
#   → Agent Mail: send_message / fetch_inbox   (coordination, decisions)
#
# USER CORRECTIONS:
#   → IMMEDIATELY: bd remember "lesson:<cat>:<insight>" --key lesson-<cat>-<nnn>
#   → Find next number: bd memories lesson-<cat> | count existing

# ─── 7. COMMIT CONVENTION ──────────────────────────────────
#
# 1. RUN: git log --oneline -10
# 2. IF commits exist with clear pattern → match exactly
# 3. IF no pattern OR empty history → use:
#      <type>: <summary> [<bead-id>]
#      types: feat | fix | chore | refactor | test | docs
# 4. ALWAYS end with: Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
# 5. Use HEREDOC format for multi-line messages
# 6. NEVER amend unless user explicitly says "amend"

# ─── 8. BOOTSTRAP PROCEDURE ────────────────────────────────
#
# Triggered by: BOOT SEQUENCE reaching BOOTSTRAP state.
# Also triggered by: bd memories project returning empty (data loss recovery).
#
# STEP 1 — DETECT PROJECT TYPE:
#   RUN: ls README.md package.json pyproject.toml Cargo.toml requirements.txt \
#        go.mod pom.xml build.gradle Makefile 2>/dev/null
#   READ: first config file found
#   DETERMINE: language, framework, test runner
#   Mapping:
#     package.json         → Node.js. Check "scripts.test" for test command.
#     pyproject.toml       → Python. Check [tool.pytest] or [tool.ruff].
#     requirements.txt     → Python (pip). Test: pytest or python -m pytest.
#     Cargo.toml           → Rust. Test: cargo test.
#     go.mod               → Go. Test: go test ./...
#     pom.xml              → Java/Maven. Test: mvn test.
#     build.gradle         → Java/Gradle. Test: gradle test.
#     Makefile             → Check targets: test, build, lint.
#     None found           → Ask user for project details.
#
# STEP 2 — SCAN STRUCTURE:
#   RUN: ls -d */ 2>/dev/null (top-level directories)
#   RUN: find . -maxdepth 2 -name "*.config.*" -o -name ".*.yml" 2>/dev/null | head -20
#   IDENTIFY: source dirs, test dirs, config dirs, docs dirs
#
# STEP 3 — STORE IN BEADS (exact commands):
#   bd remember "<name>: <description from README first line>" --key project-overview
#   bd remember "<lang>+<framework>+<test-runner>" --key project-stack
#   bd remember "<main-entry-file>" --key project-entry
#   bd remember "<key-dirs-comma-separated>" --key project-structure
#   bd remember "<exact-test-command>" --key project-test-cmd
#
# STEP 4 — DETECT AND STORE RULES:
#   IF .gitignore exists → extract patterns, store relevant as rule-*
#   IF CI config exists → extract constraints (required checks, branch protection)
#   IF linter config exists → note linting command as rule-lint
#   IF README has "Contributing" section → extract rules
#   STORE each as: bd remember "NEVER/ALWAYS <what>" --key rule-<name>
#
# STEP 5 — CHROMADB SETUP (if available):
#   TEST: chroma_list_collections
#   IF available:
#     CREATE: chroma_create_collection(name="<project-name>-qa")
#     GENERATE: 10-20 Q&A pairs from README + project structure
#     UPSERT: chroma_add_documents(collection="<project-name>-qa",
#       ids=[...], documents=[...], metadatas=[...])
#   IF unavailable: skip, log warning
#
# STEP 6 — AGENT MAIL REGISTRATION (if available):
#   TEST: list_projects
#   IF available:
#     register_agent(project_key=<absolute-path-to-project>)
#   IF unavailable: skip, log warning
#
# STEP 7 — REPORT:
#   Tell user: "Bootstrap complete. Detected: <stack>. Stored <N> memories.
#   ChromaDB: <available/unavailable>. Agent Mail: <available/unavailable>."

# ─── 9. VERIFICATION PROTOCOL ──────────────────────────────
#
# After EVERY action, check result:
#
# bd create  → expect stdout contains "Created". FAIL: bd doctor → retry 1x.
# bd update  → expect stdout contains "Updated". FAIL: bd show <id> → retry with correct state.
# bd close   → expect stdout contains "Closed".  FAIL: bd show <id> → if already closed, skip.
# bd remember → expect no error.                  FAIL: bd doctor → retry 1x.
# ChromaDB upsert → expect no error.              FAIL: check collection exists → create → retry.
# ChromaDB query  → expect results array.         FAIL: fallback to bd memories.
# Agent Mail send → expect message ID.            FAIL: warn, continue without coordination.
# git commit → expect exit code 0.                FAIL: read error → fix cause → NEW commit.
# File edit  → expect "updated successfully".     FAIL: Read file → verify content → adjust → retry.
#
# RETRY LIMIT: 2 attempts per action. After 2 failures:
#   1. bd create --type=bug --title="<error-message>" -p 1 --label auto-detected
#   2. Try completely different approach
#   3. If no alternative → send ack_required to user

# ─── 10. "beads" KEYWORD PROTOCOL ──────────────────────────
#
# When user says "beads":
# 1. STOP. Zero code. Zero file changes.
# 2. ANALYZE the task. WRITE the decomposition plan.
# 3. CREATE hierarchy:
#      EPIC:    bd create --type=epic --title="<high-level-goal>" -p <priority>
#      FEATURE: bd create --type=feature --parent=<epic-id> --title="<capability>"
#      TASK:    bd create --type=task --parent=<feature-id> --title="<work-item>"
#      SUBTASK: bd create --type=task --parent=<task-id> --title="<atomic-step>"
# 4. WIRE: bd dep <blocker-id> --blocks <blocked-id>
# 5. SHOW: bd dep tree <epic-id>
# 6. WAIT for user approval
# 7. EXECUTE via WORK_LOOP

# ─── 11. AGENT MAIL PROTOCOL ───────────────────────────────
#
# ALL Agent Mail actions are CONDITIONAL: only if Agent Mail MCP is available.
# If unavailable, skip all Agent Mail steps silently.
#
# REGISTER (session start, once):
#   register_agent(project_key=<pwd-absolute-path>,
#     program="claude-code", model="claude-opus-4-6",
#     task_description="<summary-of-session-goal>")
#
# RESERVE FILES (before editing, every task):
#   file_reservation_paths(project_key=<pwd>, agent_name=<name>,
#     paths=["<glob-for-files-to-edit>"],
#     ttl_seconds=3600, exclusive=true, reason="<bead-id>")
#
#   Glob derivation (from task type):
#     Editing files in dir X     → "X/**"
#     Editing single file F      → "F"
#     Editing all configs        → "<config-dir>/*"
#     Unknown scope              → ask user or reserve broad pattern
#
# CRITICAL DECISION (any BLOCKLIST item):
#   send_message(
#     sender=<agent-name>,
#     to=["HumanOverseer"],
#     subject="[<bead-id>] DECISION: <one-line-summary>",
#     body_md="## Context\n<what-and-why>\n## Options\n1. <A>\n2. <B>\n## Recommend\n<pick>",
#     ack_required=true, importance="high", thread_id="<bead-id>")
#   WAIT for ack. Do NOT proceed.
#
# HANDOFF (task done, unblocks another agent):
#   send_message(sender=<name>, to=["<other-agent>"],
#     subject="[<bead-id>] UNBLOCKED: <what>",
#     body_md="Completed <task>. Files released.",
#     thread_id="<bead-id>")
#
# SESSION END:
#   release_file_reservations(project_key=<pwd>, agent_name=<name>)
#   send_message(subject="Session complete", body_md="<bullet-summary>")

# ─── 12. AUTONOMY ──────────────────────────────────────────
#
# SILENT (zero prompts, zero confirmations):
#   Read, Write, Edit, Glob, Grep
#   git status, add, diff, log, commit
#   All bd commands
#   npm, node, npx, python, pytest, jest, cargo, go (test/build)
#   ChromaDB queries and upserts
#   Agent Mail messages and reservations
#   curl, which, ls, mkdir (system inspection)
#   docker compose logs, docker ps (inspection only)
#
# ASK (via ack_required or terminal):
#   Everything in BLOCKLIST (Section 2)
#
# REFUSE:
#   See NEVER list in Section 2

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART B: BUG FIX + SELF-HEALING (used when issues arise)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ─── 13. BUG CLASSIFICATION ────────────────────────────────
#
# Every bug falls into exactly ONE of these categories:
#
# SYSTEM BUG (label: system):
#   Definition: affects setup, infrastructure, tool configuration
#   Examples: ChromaDB won't start, bd command fails, MCP connection drops
#   Fix scope: setup files, docker config, tool config ONLY
#   NEVER modify project code to fix a system bug
#   Prevention: update setup procedure, add health check
#
# PROJECT BUG (label: project):
#   Definition: affects project code, business logic, tests
#   Examples: function returns wrong value, test fails, API error
#   Fix scope: project source code ONLY
#   NEVER modify system setup to fix a project bug
#   Prevention: add test, store debug Q&A in ChromaDB

# ─── 14. BUG FIX PROTOCOL ──────────────────────────────────
#
# STEP 1 — CLASSIFY:
#   Is the error about tools/infra/setup? → label: system
#   Is the error about project code/logic? → label: project
#
# STEP 2 — LOG (create bead hierarchy before fixing):
#   IF no "Bug Fixing" epic exists:
#     bd create --type=epic --title="Bug Fixing" -p 1
#   bd create --type=bug --parent=<epic-or-feature-id> \
#     --title="<error-message-first-50-chars>" -p <1-for-system, 2-for-project> \
#     --label <system|project>
#   bd create --type=task --parent=<bug-id> --title="Diagnose: reproduce and root-cause"
#   bd create --type=task --parent=<bug-id> --title="Fix: implement solution"
#   bd create --type=task --parent=<bug-id> --title="Verify: confirm fix works"
#   bd create --type=task --parent=<bug-id> --title="Prevent: add guard against recurrence"
#
# STEP 3 — DIAGNOSE:
#   bd update <diagnose-task> --status=in_progress
#   Reproduce the error. Read error output. Identify root cause.
#   bd close <diagnose-task>
#
# STEP 4 — FIX:
#   bd update <fix-task> --status=in_progress
#   IF system bug → fix in setup/config files only
#   IF project bug → fix in project source code only
#   bd close <fix-task>
#
# STEP 5 — VERIFY:
#   bd update <verify-task> --status=in_progress
#   Run the command that originally failed. Expect success.
#   IF still fails → go back to STEP 3 (re-diagnose)
#   bd close <verify-task>
#
# STEP 6 — PREVENT:
#   bd update <prevent-task> --status=in_progress
#   IF system bug:
#     bd remember "lesson:setup:<what-went-wrong>" --key lesson-setup-<nnn>
#   IF project bug:
#     Add test to catch regression
#     IF ChromaDB available:
#       chroma_add_documents(collection="<project>-qa",
#         ids=["<project>-debug-<nnn>"],
#         documents=["Q: <error scenario>?\nA: <fix steps>"],
#         metadatas=[{"project":"<name>","category":"debug","source":"auto","created":"<today>"}])
#     bd remember "lesson:<category>:<insight>" --key lesson-<cat>-<nnn>
#   bd close <prevent-task>
#   bd close <bug-id>

# ─── 15. SELF-HEALING ──────────────────────────────────────
#
# Self-healing triggers automatically. No user action needed.
#
# TRIGGER: bd prime fails OR bd memories project returns empty
#   ACTION: Enter BOOTSTRAP (Section 8). Re-scan project, re-store memories.
#   RESULT: All bd remember keys rebuilt from project scan.
#
# TRIGGER: ChromaDB query fails (connection error)
#   ACTION: Log warning. Fallback to bd memories for knowledge.
#   DO NOT: Retry indefinitely. Do not block work.
#   RESULT: Degraded mode — keyword search instead of semantic search.
#
# TRIGGER: Agent Mail unavailable
#   ACTION: Log warning. Skip all Agent Mail steps.
#   DO NOT: Retry. Do not block work.
#   RESULT: Solo mode — no coordination, critical decisions via terminal.
#
# TRIGGER: bd command fails with lock error
#   ACTION: RUN: bd doctor --fix
#   IF still fails: warn user, continue without beads for this action.
#
# TRIGGER: git commit fails (pre-commit hook)
#   ACTION: Read hook error output. Fix the issue. Create NEW commit.
#   NEVER: amend, --no-verify, or skip the hook.
#
# TRIGGER: ChromaDB collection missing
#   ACTION: chroma_create_collection(name="<project-name>-qa")
#   THEN: Re-run the failed query.
#
# PRIORITY: Work must never be blocked by tool failures.
#   Beads down → track in git commits
#   ChromaDB down → use bd memories
#   Agent Mail down → work solo
#   All down → CLAUDE.md principles still apply, work manually

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PART C: COMPONENT SETUP REFERENCE (used during bootstrap)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ─── 16. COMPONENT: BEADS ──────────────────────────────────
#
# CHECK: which bd && bd info
# IF missing binary:
#   macOS:   brew install beads
#   npm:     npm install -g @beads/bd
#   script:  curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
#   VERIFY:  bd version → expect version string
#
# IF no .beads/ in project:
#   RUN: bd init
#   VERIFY: bd info → expect "Issue Count: 0" or similar
#
# IF bd doctor shows errors:
#   RUN: bd doctor --fix
#   IF repo fingerprint mismatch → tell user to run: bd migrate --update-repo-id
#
# HEALTH CHECK: bd info → expect no error, shows Issue Count
# MEMORY POPULATION: see Bootstrap Procedure (Section 8, Step 3)

# ─── 17. COMPONENT: CHROMADB ───────────────────────────────
#
# PREREQUISITES: Docker daemon must be running.
#   CHECK: docker ps
#   FAIL: tell user "Start Docker Desktop or run: open -a Docker"
#
# SETUP DIRECTORY:
#   mkdir -p ~/.autonomous-dev/chromadb
#
# DOCKER COMPOSE FILE (~/.autonomous-dev/chromadb/docker-compose.yml):
#   Contains ChromaDB server + MCP gateway + Caddy reverse proxy.
#   Download from repo OR create with these requirements:
#     - ChromaDB image: chromadb/chroma:latest
#     - BIND MOUNT (not volume): ~/.autonomous-dev/chromadb/data:/chroma/chroma
#     - MCP gateway port: 8080
#     - ChromaDB internal port: 8000
#     - restart: unless-stopped
#     - MCP_AUTH_TOKEN from .env
#
# CRITICAL: BIND MOUNT CONFIGURATION:
#   WRONG (data lives inside Docker, lost if container removed):
#     volumes:
#       - chroma-data:/chroma/chroma
#   RIGHT (data lives on user's filesystem, survives everything):
#     volumes:
#       - ~/.autonomous-dev/chromadb/data:/chroma/chroma
#
# ENV FILE (~/.autonomous-dev/chromadb/.env):
#   MCP_AUTH_TOKEN=<generated-token>
#   CHROMA_DATA_PATH=./data
#   PORT=8080
#
# TOKEN GENERATION:
#   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
#   Save output as MCP_AUTH_TOKEN in .env
#
# START:
#   cd ~/.autonomous-dev/chromadb && docker compose up -d
#   VERIFY: curl http://localhost:8080/health → expect 200 OK
#
# CONNECT TO CLAUDE CODE:
#   claude mcp add --transport http chromadb "http://localhost:8080/mcp?apiKey=<TOKEN>"
#   VERIFY: claude mcp list → expect "chromadb" in output
#
# CREATE COLLECTION:
#   chroma_create_collection(name="<project-name>-qa")
#   VERIFY: chroma_list_collections → expect collection in list
#
# DATA PERSISTENCE GUARANTEE:
#   ~/.autonomous-dev/chromadb/data/ on filesystem.
#   Docker rm → data safe.
#   Docker uninstall → data safe.
#   System restart → data safe.
#   Only rm -rf ~/.autonomous-dev/chromadb/data/ will destroy it.

# ─── 18. COMPONENT: AGENT MAIL ─────────────────────────────
#
# PREREQUISITES: Python 3.11+, uv
#   CHECK: python3 --version && which uv
#   FAIL: tell user to install Python and uv
#
# INSTALL (one command):
#   curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/mcp_agent_mail/main/scripts/install.sh?$(date +%s)" | bash -s -- --yes
#
#   This creates:
#     - Python venv with all dependencies
#     - Bearer token (saved in config)
#     - Shell alias 'am' for starting server
#     - Beads integration
#
# START SERVER:
#   am
#   OR: uv run python -m mcp_agent_mail.http --host 127.0.0.1 --port 8765
#   VERIFY: curl http://localhost:8765/health → expect 200
#
# CONNECT TO CLAUDE CODE:
#   claude mcp add --transport http agent-mail "http://localhost:8765/mcp" \
#     --header "Authorization: Bearer <TOKEN>"
#   VERIFY: claude mcp list → expect "agent-mail" in output
#
# PRE-COMMIT GUARD (optional, for multi-agent):
#   install_precommit_guard(project_key=<abs-path>, code_repo_path=<abs-path>)
#
# DATA PERSISTENCE:
#   Messages: stored in Git repo (automatic, persistent)
#   Search index: SQLite (rebuilds from Git if lost)
#   No bind mount needed — Git IS the persistence layer.

# ─── 19. COMPONENT: CLAUDE CODE PERMISSIONS ────────────────
#
# FILE: ~/.claude/settings.json
#
# Required additions to permissions.allow array:
#   "Bash(bd *)"
#   "Bash(git status*)"
#   "Bash(git add *)"
#   "Bash(git diff*)"
#   "Bash(git log*)"
#   "Bash(git commit *)"
#   "Bash(npm *)"
#   "Bash(node *)"
#   "Bash(npx *)"
#   "Bash(python*)"
#   "Bash(pytest*)"
#   "Bash(docker compose *)"
#   "Bash(docker ps*)"
#   "Bash(curl *)"
#   "Bash(which *)"
#   "Bash(mkdir *)"
#   "Bash(ls *)"
#
# DO NOT add:
#   "Bash(git push*)"     → must require confirmation
#   "Bash(git reset*)"    → must require confirmation
#   "Bash(rm -rf*)"       → must require confirmation
#   "Bash(docker rm*)"    → must require confirmation
#
# HOOKS (already configured if bd hooks installed):
#   SessionStart: bd prime
#   PreCompact: bd prime

# ─── 20. SETUP SEQUENCE (if running full setup) ────────────
#
# This is the order. Each step depends on the previous.
#
# PHASE 0: PREREQUISITES
#   CHECK: git --version → must exist
#   CHECK: docker --version → must exist
#   CHECK: node --version → must exist
#   CHECK: python3 --version → must be 3.11+
#   CHECK: which uv → must exist
#   ANY FAIL: tell user exactly what to install. Stop.
#
# PHASE 1: BEADS (first — tracks everything else)
#   IF bd not installed → install (see Section 16)
#   IF .beads/ not in project → bd init
#   CREATE tracking epic:
#     bd create --type=epic --title="System Bootstrap" -p 0
#   CREATE tasks for remaining phases:
#     bd create --type=task --parent=<epic> --title="Setup ChromaDB" -p 1
#     bd create --type=task --parent=<epic> --title="Setup Agent Mail" -p 1
#     bd create --type=task --parent=<epic> --title="Configure Claude permissions" -p 1
#     bd create --type=task --parent=<epic> --title="Seed project knowledge" -p 1
#     bd create --type=task --parent=<epic> --title="Verify full system" -p 0
#   NOW beads tracks its own setup.
#
# PHASE 2: CHROMADB
#   bd update <chromadb-task> --status=in_progress
#   Follow Section 17 exactly.
#   VERIFY: health check passes + collection created
#   bd close <chromadb-task>
#
# PHASE 3: AGENT MAIL
#   bd update <agentmail-task> --status=in_progress
#   Follow Section 18 exactly.
#   VERIFY: health check passes + MCP connected
#   bd close <agentmail-task>
#
# PHASE 4: CLAUDE PERMISSIONS
#   bd update <permissions-task> --status=in_progress
#   Follow Section 19 exactly.
#   VERIFY: claude mcp list shows both servers
#   bd close <permissions-task>
#
# PHASE 5: SEED KNOWLEDGE
#   bd update <seed-task> --status=in_progress
#   Execute Bootstrap Procedure (Section 8)
#   VERIFY: bd memories project → has output
#   VERIFY: chroma_query_documents → returns results
#   bd close <seed-task>
#
# PHASE 6: VERIFY FULL SYSTEM
#   bd update <verify-task> --status=in_progress
#   CHECK 1: bd info → no error
#   CHECK 2: bd memories project → has output
#   CHECK 3: curl http://localhost:8080/health → 200
#   CHECK 4: curl http://localhost:8765/health → 200
#   CHECK 5: claude mcp list → shows chromadb + agent-mail
#   CHECK 6: chroma_query_documents test query → returns results
#   CHECK 7: bd prime → outputs context
#   ALL PASS: bd close <verify-task> → bd close <epic>
#   ANY FAIL: diagnose using Bug Fix Protocol (Section 14)
#
# RESUMABILITY:
#   If setup fails at Phase 3, phases 1-2 are done.
#   RUN: bd list --status=open --parent=<epic>
#   Shows remaining tasks. Resume from first open task.

# ─── END OF PROTOCOL ───────────────────────────────────────
