# Linkright Quality Mission — Beads Hierarchy Breakdown

**Date:** 2026-03-09
**PM:** Phoenix (lr-project-manager)
**Format:** Complete epic → feature → story → task → subtask tree
**Total Issues:** 33 (1 epic, 11 features, ~21 stories+tasks)

---

## Root Epic: sync-9b9

**Title:** Linkright Quality Mission: B-MAD Alignment & Excellence
**Priority:** P0
**Status:** Open (Ready)
**Description:** Comprehensive quality improvement mission to bring Linkright to exceed B-MAD standards. Covers critical fixes (P0), major improvements (P1), and enhancement opportunities (P2).

**Time Estimate:** 69 hours total (29h P0 + 40h P1)
**Critical Path:** P0-1 → P0-4 → P1-6

---

## P0 Critical Fixes (Must ship with Release 4)

### Feature: sync-9b9.1 — P0-1: Populate workflow-manifest.csv
**Priority:** P0
**Assigned to:** Hephaestus (Engineer 2)
**Time:** 2h
**Status:** Open (Ready to start)
**Depends on:** Nothing
**Blocks:** P0-4

**Description:** Create comprehensive registry of all 17 Linkright workflows. Currently workflow-manifest.csv is empty (header only, 0 rows), breaking IDE integrations.

#### Success Criteria
- ✅ All 17 workflows listed with accurate metadata
- ✅ No duplicate entries
- ✅ All file_path values exist and readable
- ✅ phase_coverage matches implementation (c|e|v)
- ✅ step_count accurate
- ✅ Status column: "active" vs "stub"
- ✅ Validation script passes

#### Tasks (estimated 2 stories, 3-4 tasks each)

**Story 1.1:** Audit existing workflows and collect metadata
- Task 1.1.1: Scan all 17 workflow directories
- Task 1.1.2: Extract phase coverage (which have steps-c, steps-e, steps-v)
- Task 1.1.3: Count steps in each workflow

**Story 1.2:** Populate CSV and validate
- Task 1.2.1: Create workflow-manifest.csv with all 17 rows
- Task 1.2.2: Add status column ("active" vs "stub")
- Task 1.2.3: Run validation script (no missing files, no duplicates)
- Task 1.2.4: Test IDE command palette integration

---

### Feature: sync-9b9.2 — P0-2: Delete/Populate Zero-Byte Files
**Priority:** P0
**Assigned to:** Vulcan (Engineer 1)
**Time:** 1h
**Status:** Open (Ready to start)
**Depends on:** Nothing
**Blocks:** P1-5

**Description:** Eliminate 8 zero-byte files and populate 2 critical YAML config files (mongodb-config.yaml, chromadb-config.yaml).

#### Success Criteria
- ✅ All 8 zero-byte files deleted or populated
- ✅ No zero-byte files remain
- ✅ YAML configs are valid syntax
- ✅ mongodb-config.yaml has all required sections
- ✅ chromadb-config.yaml has all required sections
- ✅ Agent activation step 2 (config load) succeeds
- ✅ Manifest validation passes

#### Tasks (2 stories, 3-4 tasks each)

**Story 2.1:** Delete 8 zero-byte stub files
- Task 2.1.1: Delete flex workflow stubs (twitter, linkedin, instagram)
- Task 2.1.2: Delete squick workflow stubs (release, qa)
- Task 2.1.3: Delete TEA KB stub

**Story 2.2:** Populate config YAML files
- Task 2.2.1: Create mongodb-config.yaml (collections, indexes, TTL)
- Task 2.2.2: Create chromadb-config.yaml (embeddings, fallback)
- Task 2.2.3: Test agent activation step 2 (config load succeeds)
- Task 2.2.4: Verify manifest validation passes

---

### Feature: sync-9b9.3 — P0-3: Evidence Collection Pattern for Beads
**Priority:** P0
**Assigned to:** Hephaestus (Engineer 2)
**Time:** 3h
**Status:** Open (Ready to start)
**Depends on:** Nothing
**Blocks:** P0-4

**Description:** Implement mandatory evidence capture for all closed Beads issues. Add EVIDENCE COLLECTION section to all step templates and create pre-commit hook.

#### Success Criteria
- ✅ All step files have EVIDENCE COLLECTION section
- ✅ Pre-commit hook prevents bd close without evidence
- ✅ Evidence template documented in CLAUDE.md
- ✅ Past 173 closed issues unchanged (historical)
- ✅ All future closes include evidence

#### Tasks (3 stories, 3-4 tasks each)

**Story 3.1:** Add EVIDENCE COLLECTION section to step templates
- Task 3.1.1: Update all P0/P1 step templates with EVIDENCE section
- Task 3.1.2: Document evidence template (INPUT/OUTPUT/METRICS/FILES)
- Task 3.1.3: Test evidence format with sample Beads close

**Story 3.2:** Create and wire pre-commit hook
- Task 3.2.1: Create verify-beads-evidence.sh hook
- Task 3.2.2: Wire hook to Beads config
- Task 3.2.3: Test hook prevents bd close without evidence

**Story 3.3:** Document evidence requirements
- Task 3.3.1: Update CLAUDE.md with evidence policy
- Task 3.3.2: Provide 3+ example evidence entries
- Task 3.3.3: Clarify historical vs. future issue handling

---

### Feature: sync-9b9.4 — P0-4: Beads-Wired Workflow Pattern
**Priority:** P0
**Assigned to:** Hephaestus (Engineer 2)
**Time:** 4h
**Status:** Open (Blocked by P0-1, P0-3)
**Depends on:** P0-1, P0-3
**Blocks:** P1-6, P1-4

**Description:** Implement step-01b-resume-if-interrupted.md in all 17 workflows with Beads integration. Workflows resume via Beads issue tracking.

#### Success Criteria
- ✅ All 17 workflows have step-01b-resume-if-interrupted.md
- ✅ Resumption logic queries Beads (bd list --status=in_progress)
- ✅ Checkpoint saving tested
- ✅ Resume from last step tested
- ✅ No syntax errors

#### Tasks (3 stories, 4-5 tasks each)

**Story 4.1:** Design Beads-wired resumption template
- Task 4.1.1: Finalize step-01b template (parametrized for all workflows)
- Task 4.1.2: Document Beads query format and checkpoint structure
- Task 4.1.3: Create checkpoint schema (YAML format)

**Story 4.2:** Implement step-01b in all 17 workflows
- Task 4.2.1: Create step-01b for sync module (5 workflows)
- Task 4.2.2: Create step-01b for flex module (4 workflows)
- Task 4.2.3: Create step-01b for squick module (3 workflows)
- Task 4.2.4: Create step-01b for core module (5 workflows)
- Task 4.2.5: Verify all step-01b files exist and are syntactically valid

**Story 4.3:** Test resumption flow end-to-end
- Task 4.3.1: Test normal flow (no interruption)
- Task 4.3.2: Test resume after interruption (Beads check succeeds)
- Task 4.3.3: Test resume failure (no prior issue, continue normal)
- Task 4.3.4: Verify checkpoint data integrity

---

## P1 Major Improvements (Should complete in Release 4 timeline)

### Feature: sync-9b9.5 — P1-1: Atomicity Violations — Split Multi-Op Steps
**Priority:** P1
**Assigned to:** Vulcan (Engineer 1)
**Time:** 8h
**Status:** Open (Ready to start)
**Depends on:** Nothing
**Blocks:** P1-7

**Description:** Refactor 14 atomicity violations across sync/flex/squick. Split multi-operation steps into single-cognitive-operation steps. Add output schemas.

#### Success Criteria
- ✅ All 14 violations identified and refactored
- ✅ 25+ new atomic steps created
- ✅ Output schemas defined between splits
- ✅ Step chaining updated (nextStepFile)
- ✅ Tests pass for each refactored step
- ✅ Backward-compatibility maintained

#### Tasks (3 stories, 4-5 tasks each)

**Story 5.1:** Map and plan refactoring
- Task 5.1.1: List all 14 violations with module/step locations
- Task 5.1.2: Design split strategy for each (1→2 or 1→3 steps)
- Task 5.1.3: Define output schema for each split point
- Task 5.1.4: Create refactoring checklist

**Story 5.2:** Execute atomicity refactoring
- Task 5.2.1: Refactor sync module violations (6 violations)
- Task 5.2.2: Refactor flex module violations (5 violations)
- Task 5.2.3: Refactor squick module violations (3 violations)
- Task 5.2.4: Update step chaining (nextStepFile references)
- Task 5.2.5: Verify all new steps are properly named (step-[N]-[name])

**Story 5.3:** Test and validate
- Task 5.3.1: Write tests for each new atomic step
- Task 5.3.2: Verify step input/output schemas match
- Task 5.3.3: Test backward-compatibility (old workflows still work)
- Task 5.3.4: Document refactoring in commit message

---

### Feature: sync-9b9.6 — P1-2: ADR Creation — 9 Architecture Decisions
**Priority:** P1
**Assigned to:** Hephaestus (Engineer 2)
**Time:** 4h
**Status:** Open (Ready to start)
**Depends on:** Nothing
**Blocks:** Nothing

**Description:** Document 9 major architectural decisions (Beads, ChromaDB, MongoDB, Agent Mail, JIT loading, 3-phase structure, atomic steps, unified manifest, Beads-aware workflows).

#### Success Criteria
- ✅ All 9 ADRs written and complete
- ✅ Context clear for each decision
- ✅ Alternatives considered for each
- ✅ Consequences documented
- ✅ Decision Maker identified
- ✅ Files in `/context/linkright/docs/adrs/`

#### Tasks (2 stories, 4-5 tasks each)

**Story 6.1:** Write first batch of ADRs (1-5)
- Task 6.1.1: ADR-001 — Beads for Task Persistence
- Task 6.1.2: ADR-002 — ChromaDB for Semantic Memory
- Task 6.1.3: ADR-003 — Agent Mail for Multi-Agent Coordination
- Task 6.1.4: ADR-004 — MongoDB for Career Signals
- Task 6.1.5: ADR-005 — Unified IDE Manifest

**Story 6.2:** Write second batch of ADRs (6-9)
- Task 6.2.1: ADR-006 — Atomic Steps (vs monolithic)
- Task 6.2.2: ADR-007 — 3-Phase Workflow Structure
- Task 6.2.3: ADR-008 — JIT Loading (vs preload)
- Task 6.2.4: ADR-009 — Beads-Aware Workflows

---

### Feature: sync-9b9.7 — P1-3: Agent XML Expansion to 40+ Lines
**Priority:** P1
**Assigned to:** Vulcan (Engineer 1)
**Time:** 3h
**Status:** Open (Ready to start)
**Depends on:** Nothing
**Blocks:** Nothing

**Description:** Expand 7 FLEX agents and 1 SQUICK agent from 30-35 lines to 40+ lines with complete XML sections, rich personas, and rules.

#### Success Criteria
- ✅ All 7 agents 40+ lines
- ✅ All have complete <agent> XML structure
- ✅ All have rich persona sections (role, identity, communication_style, principles)
- ✅ All have 4+ menu items with distinct workflows
- ✅ All have 4+ rules with nuance

#### Agents to Expand

1. flex-content-creator (35→45 lines)
2. flex-amplifier (32→42 lines)
3. flex-monitor (36→46 lines)
4. flex-scheduler (28→40 lines)
5. flex-analytics (31→42 lines)
6. flex-brand-manager (38→48 lines)
7. squick-infra-engineer (35→45 lines)

#### Tasks (2 stories, 3-4 tasks each)

**Story 7.1:** Expand FLEX agents (1-6)
- Task 7.1.1: Expand flex-content-creator to 45+ lines
- Task 7.1.2: Expand flex-amplifier to 42+ lines
- Task 7.1.3: Expand flex-monitor to 46+ lines
- Task 7.1.4: Expand flex-scheduler to 40+ lines
- Task 7.1.5: Expand flex-analytics to 42+ lines
- Task 7.1.6: Expand flex-brand-manager to 48+ lines

**Story 7.2:** Expand SQUICK agent and validate all
- Task 7.2.1: Expand squick-infra-engineer to 45+ lines
- Task 7.2.2: Validate all 7 agents have complete XML
- Task 7.2.3: Verify all have 4+ menu items and 4+ rules

---

### Feature: sync-9b9.8 — P1-4: Manifest Cross-Reference Validation
**Priority:** P1
**Assigned to:** Hephaestus (Engineer 2)
**Time:** 2h
**Status:** Open (Blocked by P0-4)
**Depends on:** P0-4
**Blocks:** Nothing

**Description:** Audit all 5 CSV manifests for broken references, duplicates, and zero-byte files. Create validation script.

#### Success Criteria
- ✅ No duplicate entries in any manifest
- ✅ All file_path references exist and readable
- ✅ No zero-byte files referenced
- ✅ Validation script runs without errors
- ✅ CI/CD includes manifest validation

#### Manifests to Audit

1. agent-manifest.csv (29 agents)
2. workflow-manifest.csv (17 workflows)
3. task-manifest.csv (12 tasks)
4. files-manifest.csv (526 files)
5. lr-help.csv (34 help topics)

#### Tasks (2 stories, 3-4 tasks each)

**Story 8.1:** Create validation script
- Task 8.1.1: Create scripts/validate-manifests.sh
- Task 8.1.2: Implement duplicate detection
- Task 8.1.3: Implement broken reference detection
- Task 8.1.4: Implement zero-byte file detection

**Story 8.2:** Audit and repair manifests
- Task 8.2.1: Audit all 5 manifests for issues
- Task 8.2.2: Repair any broken references
- Task 8.2.3: Remove any duplicates
- Task 8.2.4: Run final validation (0 errors)

---

### Feature: sync-9b9.9 — P1-5: TEA Knowledge Base Population
**Priority:** P1
**Assigned to:** Hephaestus (Engineer 2)
**Time:** 6h
**Status:** Open (Blocked by P0-2)
**Depends on:** P0-2
**Blocks:** Nothing

**Description:** Create TEA module knowledge base (currently empty) with testing patterns, QA checklists, targets, common bugs, and methodology.

#### Success Criteria
- ✅ All 5 KB files created and populated
- ✅ testing-patterns.csv with 20+ patterns
- ✅ qa-checklists.yaml with module-specific checklists
- ✅ qa-targets.yaml with test coverage and performance targets
- ✅ common-bugs.md with 20+ bug patterns
- ✅ qa-methodology.md with testing philosophy

#### Files to Create

1. `tea/data/testing-patterns.csv`
2. `tea/data/qa-checklists.yaml`
3. `tea/data/qa-targets.yaml`
4. `tea/data/common-bugs.md`
5. `tea/data/qa-methodology.md`

#### Tasks (3 stories, 4-5 tasks each)

**Story 9.1:** Create testing patterns and methodology
- Task 9.1.1: Create testing-patterns.csv (golden-path, edge-case, error-recovery, etc.)
- Task 9.1.2: Create qa-methodology.md (testing philosophy, approach)
- Task 9.1.3: Document 20+ patterns with applicability matrix

**Story 9.2:** Create QA checklists and targets
- Task 9.2.1: Create qa-checklists.yaml (per-module pre-release checklists)
- Task 9.2.2: Create qa-targets.yaml (coverage % and performance benchmarks)
- Task 9.2.3: Set targets: core 95%, sync 90%, flex 75%

**Story 9.3:** Create common bugs catalog
- Task 9.3.1: Create common-bugs.md
- Task 9.3.2: Document 20+ bug patterns (type, symptom, root cause, fix)
- Task 9.3.3: Categorize by module (sync, flex, squick, core)

---

### Feature: sync-9b9.10 — P1-6: Quality Gates for All 17 Workflows
**Priority:** P1
**Assigned to:** Hephaestus (Engineer 2)
**Time:** 6h
**Status:** Open (Blocked by P0-4)
**Depends on:** P0-4
**Blocks:** Nothing

**Description:** Implement pre/post/fail gates in all 17 workflows. Pre-gate validates inputs, post-gate validates outputs, fail-gate defines recovery.

#### Success Criteria
- ✅ All 17 workflows have pre/post/fail gates
- ✅ Pre-gates prevent invalid inputs
- ✅ Post-gates verify output schemas
- ✅ Fail-gates define recovery actions
- ✅ Gates executable without error
- ✅ Gates tested (pass and fail scenarios)

#### Gate Files per Step

- `[module]/workflows/[workflow]/steps/step-[N]-[name]/pre-gate.sh`
- `[module]/workflows/[workflow]/steps/step-[N]-[name]/post-gate.sh`
- `[module]/workflows/[workflow]/steps/step-[N]-[name]/fail-gate.sh`

#### Tasks (3 stories, 5-6 tasks each)

**Story 10.1:** Design gate templates and policies
- Task 10.1.1: Create pre-gate template (input validation)
- Task 10.1.2: Create post-gate template (output validation)
- Task 10.1.3: Create fail-gate template (recovery actions)
- Task 10.1.4: Define gate failure conditions

**Story 10.2:** Implement gates for core workflows
- Task 10.2.1: Add gates to sync module workflows (5 workflows)
- Task 10.2.2: Add gates to flex module workflows (4 workflows)
- Task 10.2.3: Add gates to squick module workflows (3 workflows)
- Task 10.2.4: Add gates to core module workflows (5 workflows)

**Story 10.3:** Test and validate gates
- Task 10.3.1: Test pre-gates with invalid inputs (should block)
- Task 10.3.2: Test post-gates with valid outputs (should pass)
- Task 10.3.3: Test fail-gates with error scenarios
- Task 10.3.4: Verify gates don't break normal workflow execution

---

### Feature: sync-9b9.11 — P1-7: Template Variable Consistency
**Priority:** P1
**Assigned to:** Vulcan (Engineer 1)
**Time:** 3h
**Status:** Open (Blocked by P1-1)
**Depends on:** P1-1
**Blocks:** Nothing

**Description:** Replace all template variable formats with single standard `{{VAR}}` across all 400+ step files. Currently mixing `{{VAR}}`, `${VAR}`, and `$VAR`.

#### Success Criteria
- ✅ All template variables use `{{VAR}}` format
- ✅ Zero `${VAR}` or `$VAR` references remain
- ✅ Step files still valid after replacement
- ✅ No orphaned variable references
- ✅ Bulk replacement tested on sample files first

#### Tasks (2 stories, 4-5 tasks each)

**Story 11.1:** Map and prepare bulk replacement
- Task 11.1.1: Scan all 400+ step files for variable usage patterns
- Task 11.1.2: Create sed/awk scripts for bulk replacement
- Task 11.1.3: Test replacement on 10 sample files (verify still valid)

**Story 11.2:** Execute standardization
- Task 11.2.1: Replace `${VAR}` → `{{VAR}}` across all step files
- Task 11.2.2: Replace `$VAR` → `{{VAR}}` across all step files
- Task 11.2.3: Scan for any remaining `${}` or `$` references (manual cleanup)
- Task 11.2.4: Verify all step files still valid YAML/Markdown

---

## Engineer Assignment Summary

### Vulcan (Engineer 1) — Odd-Numbered Epics

| Feature | Title | Hours | Status |
|---------|-------|-------|--------|
| sync-9b9.2 | P0-2: Zero-byte files | 1h | Ready |
| sync-9b9.5 | P1-1: Atomicity violations | 8h | Ready |
| sync-9b9.7 | P1-3: Agent XML expansion | 3h | Ready |
| sync-9b9.11 | P1-7: Template variables | 3h | Blocked (P1-1) |
| **TOTAL** | | **15h** | |

**Specialization:** System files, agent XML, step file refactoring, variable standardization

### Hephaestus (Engineer 2) — Even-Numbered Epics

| Feature | Title | Hours | Status |
|---------|-------|-------|--------|
| sync-9b9.1 | P0-1: Workflow manifest | 2h | Ready |
| sync-9b9.3 | P0-3: Evidence pattern | 3h | Ready |
| sync-9b9.4 | P0-4: Beads-wired workflows | 4h | Blocked (P0-1, P0-3) |
| sync-9b9.6 | P1-2: ADR creation | 4h | Ready |
| sync-9b9.8 | P1-4: Manifest validation | 2h | Blocked (P0-4) |
| sync-9b9.9 | P1-5: TEA knowledge base | 6h | Blocked (P0-2) |
| sync-9b9.10 | P1-6: Quality gates | 6h | Blocked (P0-4) |
| **TOTAL** | | **27h** | |

**Specialization:** Workflow design, documentation, QA patterns, manifest management

---

## Dependency Graph Summary

```
P0-1 ──┐
P0-3 ──┤─→ P0-4 ──┬─→ P1-6 (Quality Gates)
        │         │
        │         └─→ P1-4 (Manifest Validation)
        │
P0-2 ──────→ P1-5 (TEA KB)

P1-1 ──────→ P1-7 (Template Variables)

P1-2: ADR Creation (no dependencies)
P1-3: Agent XML Expansion (no dependencies)
```

**Critical Path:** P0-1 → P0-4 → P1-6 (13 hours minimum)

---

## Execution Readiness Checklist

- [x] All 11 features created in Beads
- [x] All 6 dependencies wired
- [x] Dependency DAG verified (acyclic)
- [x] Engineer assignments finalized (Vulcan odd, Hephaestus even)
- [x] Implementation plan documented
- [x] Beads breakdown completed
- [ ] Satvik clarifies 3 open questions (Phases D-M, TEA targets, gate thresholds)
- [ ] Phase 4 handoff briefs sent to both engineers

**Status:** ✅ READY FOR PHASE 4 EXECUTION

---

## Legend

- **Priority:** P0 (blocking Release 4), P1 (major, should complete), P2 (enhancement, defer)
- **Status:** Open (not started), In Progress (work started), Blocked (waiting for dependency), Done (complete)
- **Assigned to:** Vulcan (Engineer 1, odd epics), Hephaestus (Engineer 2, even epics)
- **Time Estimate:** Best estimate in hours (actual may vary)
- **Depends on:** Which issue must complete before this one starts
- **Blocks:** Which issues are waiting for this one to complete
