# Linkright Quality Mission Implementation Plan

**Date:** 2026-03-09
**PM:** Phoenix (lr-project-manager)
**Status:** Ready for Phase 4 Execution
**Scope:** 11 features, 33 total Beads issues, 69 estimated hours

---

## Executive Overview

This implementation plan orchestrates the systematic execution of the Linkright Quality Mission, bringing the platform to exceed B-MAD's architectural standards while preserving its unique advantages (Beads, ChromaDB, Agent Mail).

**Core Principle:** Execute P0 critical fixes first (blocking Release 4), run P1 improvements in parallel with P0, deliver fully Beads-tracked implementation with zero manual task tracking.

**Success Definition:**
- ✅ All 4 P0 features complete before Release 4 ships (~29 hours)
- ✅ All 7 P1 features complete within Release 4 timeline (~40 hours)
- ✅ Zero zero-byte files in codebase
- ✅ Workflow-manifest.csv populated (all 17 workflows)
- ✅ All 173+ past Beads issues reviewed for evidence
- ✅ All 17 workflows have step-01b-resume.md with Beads integration
- ✅ Every step file tagged with EVIDENCE COLLECTION section
- ✅ All 7 manifest files validated (no broken references)
- ✅ 7 agents expanded to 40+ line depth
- ✅ 9 ADRs written and committed
- ✅ TEA knowledge base populated (5 files, 20+ patterns)
- ✅ 17 workflows have pre/post/fail gates
- ✅ All template variables standardized to {{VAR}} format

---

## Phase Overview: P0 Critical Fixes

### P0-1: Populate workflow-manifest.csv
**Assigned to:** Hephaestus (Engineer 2)
**Depends on:** Nothing
**Blocks:** P0-4
**Time:** 2h

**What:** Create comprehensive CSV registry of all 17 Linkright workflows.

**Why Critical:** The workflow-manifest is the authoritative registry for IDE integrations, command palettes, and workflow discovery. Currently empty header (0 rows), breaking IDE support.

**Success Criteria:**
- All 17 workflows listed with accurate metadata
- No duplicates, all file_path values readable
- Phase coverage (c/e/v) matches implementation
- Step count accurate
- Added `status` column: "active" vs "stub"

---

### P0-2: Delete/Populate Zero-Byte Files
**Assigned to:** Vulcan (Engineer 1)
**Depends on:** Nothing
**Blocks:** P1-5
**Time:** 1h

**What:** Remove 8 zero-byte stub files, populate 2 critical YAML configs.

**Why Critical:** Zero-byte files block agent activation (step 2: config load). Empty config files break MongoDB and ChromaDB initialization.

**Delete:**
```bash
rm -f context/linkright/_lr/core/config/flex-workflow-twitter.md
rm -f context/linkright/_lr/core/config/flex-workflow-linkedin.md
rm -f context/linkright/_lr/core/config/flex-workflow-instagram.md
rm -f context/linkright/_lr/core/config/squick-workflow-release.md
rm -f context/linkright/_lr/core/config/squick-workflow-qa.md
rm -f context/linkright/_lr/core/config/tea-kb-testing-patterns.md
```

**Populate:**
- `mongodb-config.yaml` — collections, indexes, TTL
- `chromadb-config.yaml` — embeddings, fallback modes

**Success Criteria:**
- Zero zero-byte files remain
- YAML configs valid syntax
- Agent activation step 2 succeeds
- Manifest validation passes

---

### P0-3: Evidence Collection Pattern for Beads
**Assigned to:** Hephaestus (Engineer 2)
**Depends on:** Nothing
**Blocks:** P0-4
**Time:** 3h

**What:** Implement mandatory evidence capture for all closed Beads issues.

**Why Critical:** 173 issues closed in past with zero evidence = audit debt. Future issues must have mandatory evidence (input/output/metrics/files) when closed.

**Steps:**
1. Add `## EVIDENCE COLLECTION` section to all step templates
2. Create `.agents/workflows/verify-beads-evidence.sh` hook
3. Wire hook to Beads config
4. Document in CLAUDE.md

**Success Criteria:**
- All step files have EVIDENCE COLLECTION section
- Pre-commit hook prevents `bd close` without evidence
- Documentation complete
- Past issues unchanged (historical record preserved)

---

### P0-4: Beads-Wired Workflow Pattern
**Assigned to:** Hephaestus (Engineer 2)
**Depends on:** P0-1, P0-3
**Blocks:** P1-6, P1-4
**Time:** 4h

**What:** Implement step-01b-resume-if-interrupted.md in all 17 workflows with Beads integration.

**Why Critical:** Workflows need deterministic resumption via Beads issue tracking. If workflow interrupted, step-01b checks `bd list --status=in_progress` for this workflow's issue. If found, resume from last checkpoint.

**Template (parametrized):**
```markdown
# step-01b-resume-if-interrupted.md

## Resumption Logic

Check if workflow was interrupted:
bd list --project=[workflow-name] --status=in_progress

If issue found:
  - Load last checkpoint from bd show <issue-id>
  - Resume from --last-step=<N>

If no issue found:
  - Continue to step-01c (normal flow)

## Evidence
- Checkpoint saved: <file>
- Resumed from: step-<N>
- Time elapsed: <minutes>
```

**Success Criteria:**
- All 17 workflows have step-01b-resume-if-interrupted.md
- Beads integration tested (resume flow works)
- No syntax errors in resumption logic

---

## Phase Overview: P1 Major Improvements

### P1-1: Atomicity Violations — Split Multi-Op Steps
**Assigned to:** Vulcan (Engineer 1)
**Depends on:** Nothing
**Blocks:** P1-7
**Time:** 8h

**What:** Refactor 14 atomic violations across sync/flex/squick modules.

**Why Important:** B-MAD principle: one cognitive operation per step. Current violations include steps doing parse+optimize (2 ops), review+edit+finalize (3 ops), etc. Splitting improves testability, resumption, and observability.

**Steps:**
1. Map all 14 violations (audit already identified them)
2. Design atomic split for each (1→2-3 steps)
3. Define output schemas between splits
4. Update step chaining (nextStepFile)
5. Test each refactored step

**Refactoring Examples:**
| Violation | Split | Hours |
|-----------|-------|-------|
| sync/step-03e | Parse + Optimize | 0.5 |
| sync/step-04e | 3 ops → 3 steps | 1.0 |
| flex/step-02e | 2 ops → 2 steps | 0.5 |
| (11 more) | | 5.5 |

**Success Criteria:**
- All 14 violations refactored into 25+ atomic steps
- Output schemas defined between steps
- Tests pass for each refactored step
- Backward-compatibility maintained

---

### P1-2: ADR Creation — 9 Architecture Decisions
**Assigned to:** Hephaestus (Engineer 2)
**Depends on:** Nothing
**Blocks:** Nothing
**Time:** 4h

**What:** Document 9 major architectural decisions.

**Why Important:** ADRs provide decision context (why, alternatives, consequences) for future maintainers. Currently undocumented.

**ADRs to Write:**
1. ADR-001: Beads for Task Persistence (vs alternatives)
2. ADR-002: ChromaDB for Semantic Memory (vs file-based)
3. ADR-003: Agent Mail for Multi-Agent Coordination
4. ADR-004: MongoDB for Career Signals (vs flat files)
5. ADR-005: Unified IDE Manifest (vs per-IDE duplication)
6. ADR-006: Atomic Steps (vs monolithic workflows)
7. ADR-007: 3-Phase Workflow Structure (c/e/v)
8. ADR-008: JIT Loading (vs preload)
9. ADR-009: Beads-Aware Workflows (vs plain resumption)

**Template:** Context → Decision → Alternatives → Rationale → Consequences → Decision Maker Notes

**Success Criteria:**
- All 9 ADRs written, complete, and honest
- Files in `/context/linkright/docs/adrs/`
- Alternatives considered for each
- Consequences documented

---

### P1-3: Agent XML Expansion to 40+ Lines
**Assigned to:** Vulcan (Engineer 1)
**Depends on:** Nothing
**Blocks:** Nothing
**Time:** 3h

**What:** Expand 7 FLEX agents and 1 SQUICK agent from 30-35 lines to 40+ lines.

**Agents:**
1. flex-content-creator (35→45 lines)
2. flex-amplifier (32→42 lines)
3. flex-monitor (36→46 lines)
4. flex-scheduler (28→40 lines)
5. flex-analytics (31→42 lines)
6. flex-brand-manager (38→48 lines)
7. squick-infra-engineer (35→45 lines)

**Quality Bar (not arbitrary line count):**
- ✅ Complete <agent> block with all subsections
- ✅ 8+ activation steps with condition checks
- ✅ 4+ menu items with distinct workflows
- ✅ Rich persona section (role, identity, communication_style, principles)
- ✅ 4+ rules with nuance

**Success Criteria:**
- All 7 agents 40+ lines
- All have complete XML structure
- All have rich persona descriptions
- All have 4+ meaningful menu items
- All have 4+ rules

---

### P1-4: Manifest Cross-Reference Validation
**Assigned to:** Hephaestus (Engineer 2)
**Depends on:** P0-4
**Blocks:** Nothing
**Time:** 2h

**What:** Audit all 5 CSV manifests for broken references, duplicates, zero-byte files.

**Manifests:**
1. agent-manifest.csv (29 agents)
2. workflow-manifest.csv (17 workflows)
3. task-manifest.csv (12 tasks)
4. files-manifest.csv (526 files)
5. lr-help.csv (34 help topics)

**Script:** `scripts/validate-manifests.sh` (checks duplicates, missing files, zero-byte refs)

**Success Criteria:**
- No duplicate entries in any manifest
- All file_path references exist and readable
- No zero-byte files referenced
- Validation script runs without errors
- CI/CD includes manifest validation

---

### P1-5: TEA Knowledge Base Population
**Assigned to:** Hephaestus (Engineer 2)
**Depends on:** P0-2
**Blocks:** Nothing
**Time:** 6h

**What:** Create TEA module knowledge base (currently empty).

**Files to Create:**
1. `tea/data/testing-patterns.csv` — 20+ patterns (golden-path, edge-case, error-recovery)
2. `tea/data/qa-checklists.yaml` — module-specific checklists (pre-release, deployment)
3. `tea/data/qa-targets.yaml` — test coverage + performance targets per module
4. `tea/data/common-bugs.md` — 20+ bug patterns from Linkright history
5. `tea/data/qa-methodology.md` — TEA testing philosophy and strategy

**Content Examples:**
- sync: 90% test coverage, <5s per workflow step
- flex: 75% test coverage (creative workflows), <2s per operation
- core: 95% test coverage, <100ms per operation

**Success Criteria:**
- All 5 KB files created and populated
- At least 20+ testing patterns documented
- Module-specific QA targets set
- Common bugs catalog documented

---

### P1-6: Quality Gates for All 17 Workflows
**Assigned to:** Hephaestus (Engineer 2)
**Depends on:** P0-4
**Blocks:** Nothing
**Time:** 6h

**What:** Implement pre/post/fail gates in all 17 workflows.

**Three-Tier Gate System:**

**Pre-Gate:** Validates inputs exist and are well-formed. Blocks step if invalid.

**Post-Gate:** Validates outputs match expected schema. Warns (doesn't block) if below target.

**Fail-Gate:** Defines recovery action (rollback, skip, manual intervention).

**Template:**
- `[module]/workflows/[workflow]/steps/step-[N]-[name]/pre-gate.sh`
- `[module]/workflows/[workflow]/steps/step-[N]-[name]/post-gate.sh`
- `[module]/workflows/[workflow]/steps/step-[N]-[name]/fail-gate.sh`

**Success Criteria:**
- All 17 workflows have gates
- Pre-gates prevent invalid inputs
- Post-gates verify output schemas
- Fail-gates define recovery
- Gates executable without error

---

### P1-7: Template Variable Consistency
**Assigned to:** Vulcan (Engineer 1)
**Depends on:** P1-1
**Blocks:** Nothing
**Time:** 3h

**What:** Replace all template variable formats with single standard `{{VAR}}` across all 400+ step files.

**Current Chaos:**
- `{{VAR}}` — correct format
- `${VAR}` — config format
- `$VAR` — shell variable format
- Mixed usage: same variable written 3 ways

**Standardization:** All → `{{VAR}}` format

**Process:**
1. Map all variable usage patterns
2. Create sed/awk scripts for bulk replacement
3. Test each replacement (verify step files still valid)
4. Verify no residual ${} or $VAR references

**Success Criteria:**
- All template variables use `{{VAR}}` format
- Zero `${VAR}` or `$VAR` remaining
- Step files still valid after replacement
- No orphaned variable references

---

## Engineer Assignment Strategy

### Vulcan (Engineer 1) — Odd-Numbered Epics
**Role:** System files & atomicity specialist

**Assigned Features:**
- P0-2: Delete/Populate zero-byte files (Odd Epic 1)
- P1-1: Atomicity violations (Odd Epic 3)
- P1-3: Agent XML expansion (Odd Epic 5)
- P1-7: Template variable consistency (Odd Epic 7)

**Time:** 14 hours total
**Specialization:** Agent XML, YAML configs, step file refactoring

### Hephaestus (Engineer 2) — Even-Numbered Epics
**Role:** Workflow design & quality specialist

**Assigned Features:**
- P0-1: Populate workflow-manifest.csv (Even Epic 2)
- P0-3: Evidence collection pattern (Even Epic 4)
- P0-4: Beads-wired workflow pattern (Even Epic 6)
- P1-2: ADR creation (Even Epic 8)
- P1-4: Manifest cross-reference validation (Even Epic 10)
- P1-5: TEA knowledge base (Even Epic 12)
- P1-6: Quality gates (Even Epic 14)

**Time:** 27 hours total
**Specialization:** Workflow design, documentation, QA patterns

---

## Conflict Resolution Protocol

If both engineers need the same file:

1. **Detection:** When claiming a Beads issue, run:
   ```bash
   bd update <task-id> --status=in_progress
   file_reservation_paths(project_key=/Users/satvikjain/Downloads/sync,
     agent_name=<engineer>, paths=["path/to/file/**"],
     exclusive=true, reason="<task-id>")
   ```

2. **If conflict detected:** One engineer sends Agent Mail:
   ```
   Subject: FILE-CONFLICT: [file-path]
   Body: I'm working on <task-id>. Please wait until I release reservation.
   ```

3. **Resolution:** Waiting engineer blocks on dependency or works alternate task

---

## Quality Standards for All Work

Every file created or modified must:

1. **Follow final-solutions.md standards** (exact schemas, templates, formats)
2. **Pass success criteria** for its gap
3. **Not break other files** that reference it
4. **Be syntactically valid** (YAML, Markdown, Bash)
5. **Include evidence** when closing Beads issue

---

## Daily Cadence (Phase 4)

### Morning Standup (conceptual)
- `bd ready` — review blocked/available issues
- Claim next 1-2 features
- Reserve files

### Afternoon Checkpoint
- `bd update <task-id> --status=in_progress` — if starting new task
- Complete current tasks, close via `bd close <id>`
- Write one-line log: `[timestamp] <id> DONE: [what] → [file]`

### Evening Handoff
- Release file reservations for shared files
- Send Agent Mail if blocking peer
- Prepare next day's tasks

---

## Success Definition

**Phase 4 is complete when:**

✅ `bd stats` shows 0 open critical/major issues under sync-9b9
✅ `find . -size 0 -type f` returns 0 results (no zero-byte files)
✅ `wc -l workflow-manifest.csv` > 5 (populated)
✅ All 7 manifests validate without errors
✅ All step files have `{{VAR}}` format exclusively
✅ All agents 40+ lines (or meet quality bar)
✅ All 9 ADRs written and committed
✅ TEA KB fully populated (5 files, 20+ patterns)
✅ All 17 workflows have step-01b-resume.md
✅ All 17 workflows have pre/post/fail gates

---

## Open Questions for Satvik

Before Phase 4 starts, clarify:

1. **Phases D-M Specification** — What are the exact step definitions for Release 4 phases D through M (40+ steps each)? Currently outlined in Release_4.md but need full specifications.

2. **TEA QA Targets** — What are the acceptable test coverage % and performance benchmarks per module? Current proposal:
   - core: 95% coverage, <100ms
   - sync: 90% coverage, <5s per step
   - flex: 75% coverage, <2s per op

   Are these targets correct?

3. **Quality Gate Thresholds** — What metrics trigger gate failures? Examples:
   - Pre-gate: fail if input file >1MB?
   - Post-gate: fail if output schema missing required fields?
   - Fail-gate: rollback or manual intervention?

---

## Timeline

**Phase 4 Execution:** 2-3 weeks intensive

- **Week 1:** P0 fixes (4 features, 29 hours) + parallel P1 start
- **Week 2:** P1 improvements (7 features, 40 hours)
- **Week 3:** Verification, fixes, final commit

**Critical Path:** P0-1 → P0-4 must complete before P1-6 (quality gates)

---

## Handoff Protocol

Once this plan is approved by Satlik and all Beads issues created:

1. ✅ Send Vulcan his epic assignments via Agent Mail
2. ✅ Send Hephaestus his epic assignments via Agent Mail
3. ✅ Provide both engineers with:
   - List of assigned Beads issue IDs
   - Link to final-solutions.md (specifications)
   - Link to this implementation-plan.md (strategy)
   - Conflict resolution protocol

4. ✅ Monitor `bd ready` for newly unblocked issues
5. ✅ Respond to Agent Mail messages from engineers (blockers, questions)
6. ✅ Close Beads issues as engineers complete them
7. ✅ Generate beads-breakdown.md (complete hierarchy tree)

**GO/NO-GO Decision:** Ready for Phase 4 execution ✅
