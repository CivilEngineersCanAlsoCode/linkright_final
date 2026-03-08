# Workflow Orchestration

> For setup instructions, see [setup/setup.md](setup/setup.md)

---

## 1. Plan Mode Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity
- Use beads for task tracking and memory management by reading file - `.agents/workflows/sync-beads.md`

## 2. Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

## 3. Self-Improvement Loop

- After ANY correction from the user: `bd remember "lesson:<category>:<insight>" --key lesson-<cat>-<nnn>`
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

## 4. Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

## 5. Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

## 6. Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

---

## Task Management

> Full setup & workflow details: [setup/setup.md](setup/setup.md)

1. **Plan First**: Decompose into beads hierarchy (`bd create --type=epic/feature/task`)
2. **Verify Plan**: `bd dep tree <epic>` — review before starting
3. **Track Progress**: `bd update <id> --status=in_progress` → `bd close <id>`
4. **Evidence Required**: Every `bd close` MUST include documented evidence (see Section 6.5)
5. **Explain Changes**: High-level summary at each step
6. **Document Results**: `bd remember` key insights for future sessions
7. **Capture Lessons**: `bd remember` after corrections (see [setup/setup.md](setup/setup.md) Section 7)

---

## 6. Evidence Collection — Mandatory for All Beads Closures

**Rule:** Every `bd close` MUST include comprehensive EVIDENCE section. No exceptions.

### Why?
- ✅ **Auditability**: Months later, understand what was actually done and why
- ✅ **Reproducibility**: Can verify changes or undo if needed
- ✅ **Quality**: Prevents premature/incomplete closures
- ✅ **Traceability**: Links Beads issues to actual code changes

### Evidence Structure (Mandatory Fields)
```
EVIDENCE:
- Input: [Original state before work]
- Operation: [Exact steps taken]
- Output: [Where results stored]
- Metrics: [Success criteria satisfied — list them explicitly]
- Files modified: [Exact file paths changed]
- Test results: [If applicable, test output]
```

### Example (Correct)
```bash
bd close sync-qm-p0-1 --reason="✅ P0-1 COMPLETE: Workflow-manifest.csv populated

EVIDENCE:
- Input: 22 workflows in _lr/ directories, manifest header-only (0 rows)
- Operation: Scanned all workflows, extracted phase coverage, counted steps
- Operation: Enhanced CSV with 6 new columns, populated all 22 rows
- Output: /context/linkright/_lr/_config/workflow-manifest.csv (23 lines)
- Metrics satisfied:
  ✅ All 22 workflows listed
  ✅ No duplicates (verified with awk)
  ✅ All paths exist and readable
  ✅ Phase coverage accurate
- Files modified: workflow-manifest.csv
- Test results: CSV validation passed, all paths verified"
```

### Shortcut (Verbosity Matters — No Brevity Here)
❌ DON'T DO THIS:
```bash
bd close sync-qm-p0-1 --reason="Done"
```

✅ ALWAYS DO THIS:
```bash
bd close sync-qm-p0-1 --reason="✅ [Task Name] COMPLETE

EVIDENCE:
- Input: [be specific]
- Operation: [step by step]
- Output: [exact paths]
- Metrics satisfied: [list each one]
- Files modified: [paths]
- Test results: [proof]"
```

### Full Template
See `.agents/workflows/EVIDENCE-TEMPLATE.md` for:
- Detailed field definitions
- Examples by issue type
- Common mistakes to avoid
- When to close vs. defer

### Pre-Commit Hook
Hook at `.agents/workflows/verify-beads-evidence.sh` enforces this automatically. Will reject `bd close` without EVIDENCE section.

---

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

---

## Critical Rules

- **Language**: Communicate with user in Romanized Hindi (Hinglish) unless they switch to English.
- **Stop and pivot**: If you get stuck on an operation and fail repeatedly (2-3 attempts), do NOT push through or brute-force it. Stop immediately, explain what's failing and why, and suggest an alternative approach. Ask the user before continuing.
- **Context directory**: `context/` is READ-ONLY. Never modify files inside it.
