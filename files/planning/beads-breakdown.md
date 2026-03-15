# Beads Hierarchy: Linkright Quality Mission
## Complete 5-Level Breakdown — PHASE 3 COMPLETE

**Authors:** Phoenix (RoseGlacier) with Orchestrator (WindyHawk)
**Date:** 2026-03-09
**Phase 3 Status:** COMPLETE — All 173 issues created in Beads
**Root Epic:** sync-zas (LR Quality Mission: B-MAD Alignment & Excellence)

---

## PHASE 3 RESULTS

### Issue Count by Level
| Level | Count | Notes |
|-------|-------|-------|
| Epic (Level 1) | 1 | sync-zas |
| Feature (Level 2) | 12 | 5 P0 + 7 P1 |
| User Story (Level 3) | 30 | 2-3 per feature |
| Task (Level 4) | 77 | 2-4 per story |
| Subtask/Bug (Level 5) | 53 | 1-3 per task + 1 bug per feature |
| **TOTAL** | **173** | All created and linked |

### Dependency Graph (Feature Level)
```
sync-zas.1 (P0-1) ──┐
sync-zas.3 (P0-3) ──┤──→ sync-zas.4 (P0-4) ──┬──→ sync-zas.11 (P1-6)
                                                └──→ sync-zas.9 (P1-4)
sync-zas.2 (P0-2) ──────→ sync-zas.10 (P1-5)
sync-zas.6 (P1-1) ──────→ sync-zas.12 (P1-7)
```
Critical Path: P0-1 → P0-4 → P1-6 (minimum 10 hours)

### Open Questions for Satvik
1. **Q1 (CRITICAL):** Phases D-M specifications — blocks P0-5 entirely
2. **Q2:** TEA QA targets (coverage %, performance) — informs P1-5
3. **Q3:** Gate thresholds (good output criteria) — informs P1-6

---


**Source:** gap-analysis.md + final-solutions.md
**Purpose:** Reference document showing PLANNED 5-level hierarchy before Beads issues are created
**Status:** PLANNING ONLY — Implementation NOT authorized yet

> **Note:** Actual Beads IDs (sync-xxx) will be assigned when Phoenix creates the issues.
> This document is the blueprint. Engineer execution is a separate phase.

---

## Overview

| Level | Count | Description |
|-------|-------|-------------|
| Epic | 1 | LR Quality Mission root |
| Feature | 12 | 5 P0 (Critical) + 7 P1 (Major) |
| User Story | 28 | 2–3 per Feature |
| Task | 64 | 2–4 per User Story |
| Subtask / Bug | 126 | 1–3 per Task |
| **TOTAL** | **231** | All levels combined |

**Engineer Assignments:**
- **Vulcan** (Engineer 1): F2, F4, F6, F8, F11
- **Hephaestus** (Engineer 2): F1, F3, F5, F7, F9, F10, F12

---

## ROOT EPIC

```
EPIC [sync-qm-root]
  Title: LR Quality Mission — B-MAD Alignment & Excellence
  Type: epic
  Priority: P0
  Description:
    Comprehensive quality improvement mission to bring Linkright to B-MAD parity
    and beyond. Covers 5 critical (P0) blocking gaps and 7 major (P1) improvements
    identified by 4-agent multi-specialist audit+architecture team.
    Total scope: 12 features, 28 stories, 64 tasks, 126 subtasks = 231 issues.
    P0 must complete before Release 4 ships (13h estimate).
    P1 can parallel P0, complete pre-Phase-4 execution (29h estimate).
  Assignee: WindyHawk (Orchestrator)
```

---

## P0 FEATURES (Critical — Release 4 Blocking)

---

### F1 — P0-1: Populate workflow-manifest.csv

```
FEATURE [sync-qm-f1]
  Title: P0-1: Populate workflow-manifest.csv with all 17 workflows
  Type: feature
  Priority: P0
  Parent: sync-qm-root
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 2 hours
  Description:
    workflow-manifest.csv is header-only (0 workflows listed). IDE command palettes
    can't find any workflows. Users can't discover what workflows exist. Fix: populate
    all 17 workflows into the CSV with extended schema including status column.
  Acceptance:
    ✅ All 17 workflows listed
    ✅ No duplicate entries
    ✅ All file_path values exist and are readable
    ✅ phase_coverage matches actual implementation (c|e|v)
    ✅ step_count matches directory scan
    ✅ Validation script runs without errors
```

#### Story 1.1: Audit Existing Manifest State

```
USER STORY [sync-qm-f1-s1]
  Title: As a system maintainer, I want to know the exact current state of
         workflow-manifest.csv so I can plan the population work correctly
  Parent: sync-qm-f1

  TASK [sync-qm-f1-s1-t1]: Read workflow-manifest.csv header schema
    Description: Open _config/workflow-manifest.csv, document all column names
                 and data types, identify gaps vs needed schema
    SUBTASK [sync-qm-f1-s1-t1-st1]: Read file, count columns, note order
    SUBTASK [sync-qm-f1-s1-t1-st2]: Compare to agent-manifest.csv schema (reference)
    SUBTASK [sync-qm-f1-s1-t1-st3]: Document missing columns needed (status, step_count)

  TASK [sync-qm-f1-s1-t2]: Scan all 17 workflow directories
    Description: Find all workflow.yaml or workflow.md files in _lr/ tree,
                 build authoritative list of 17 workflows with their actual paths
    SUBTASK [sync-qm-f1-s1-t2-st1]: Run glob on _lr/ for workflow.yaml files
    SUBTASK [sync-qm-f1-s1-t2-st2]: Run glob on _lr/ for workflow.md files
    SUBTASK [sync-qm-f1-s1-t2-st3]: De-duplicate, count steps per workflow dir
    SUBTASK [sync-qm-f1-s1-t2-st4]: Mark each workflow: active vs stub status
```

#### Story 1.2: Define Extended CSV Schema

```
USER STORY [sync-qm-f1-s2]
  Title: As a maintainer, I want a clear CSV schema with status column
         so I can distinguish complete vs stub workflows at a glance
  Parent: sync-qm-f1

  TASK [sync-qm-f1-s2-t1]: Write final schema definition
    Description: Design 8-column schema: workflow_name, module, file_path,
                 type, phase_coverage, step_count, description, status
    SUBTASK [sync-qm-f1-s2-t1-st1]: Define column names + types
    SUBTASK [sync-qm-f1-s2-t1-st2]: Define status values: "active" | "stub"
    SUBTASK [sync-qm-f1-s2-t1-st3]: Write schema documentation block (comment in CSV)

  TASK [sync-qm-f1-s2-t2]: Write validation script template
    Description: Create shell script that validates every row in manifest CSV:
                 file exists, path resolves, no duplicates
    SUBTASK [sync-qm-f1-s2-t2-st1]: Script: check file_path exists for each row
    SUBTASK [sync-qm-f1-s2-t2-st2]: Script: check no duplicate workflow_name
    SUBTASK [sync-qm-f1-s2-t2-st3]: Script: print PASS/FAIL per row
```

#### Story 1.3: Populate CSV and Validate

```
USER STORY [sync-qm-f1-s3]
  Title: As a user, I want workflow-manifest.csv to list all 17 workflows
         so IDE command palettes can discover and launch them
  Parent: sync-qm-f1

  TASK [sync-qm-f1-s3-t1]: Write all 17 workflow rows to CSV
    Description: Using audit findings, write one CSV row per workflow with
                 all 8 columns populated accurately
    SUBTASK [sync-qm-f1-s3-t1-st1]: Write rows for sync module workflows
    SUBTASK [sync-qm-f1-s3-t1-st2]: Write rows for core module workflows
    SUBTASK [sync-qm-f1-s3-t1-st3]: Write rows for flex, squick, lrb module workflows
    SUBTASK [sync-qm-f1-s3-t1-st4]: Write rows for tea, cis module workflows

  TASK [sync-qm-f1-s3-t2]: Run validation and fix errors
    Description: Execute validation script against populated CSV, fix all failures
    SUBTASK [sync-qm-f1-s3-t2-st1]: Run validate-manifest.sh
    SUBTASK [sync-qm-f1-s3-t2-st2]: Fix any path errors found
    SUBTASK [sync-qm-f1-s3-t2-st3]: Fix any duplicate entries found
    SUBTASK [sync-qm-f1-s3-t2-st4]: Final pass — confirm 17 rows, 0 errors
```

---

### F2 — P0-2: Eliminate 8 Zero-Byte Files

```
FEATURE [sync-qm-f2]
  Title: P0-2: Delete or populate 8 zero-byte files
  Type: feature
  Priority: P0
  Parent: sync-qm-root
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 1 hour
  Description:
    8 files exist but are empty (0 bytes): mongodb-config.yaml, chromadb-config.yaml,
    and 6 stub workflow files. Config load fails. Manifests point to ghost files.
    Fix: delete the 6 stub workflows (recreate in P1), populate the 2 config files.
  Acceptance:
    ✅ No zero-byte files remain in system
    ✅ mongodb-config.yaml has valid schema with fallback_mode
    ✅ chromadb-config.yaml has valid schema with fallback_mode
    ✅ 6 stub files deleted
    ✅ No manifest rows reference the deleted files
```

#### Story 2.1: Populate Config Files

```
USER STORY [sync-qm-f2-s1]
  Title: As an agent, I want mongodb-config.yaml and chromadb-config.yaml
         populated so I don't fail on config load during activation
  Parent: sync-qm-f2

  TASK [sync-qm-f2-s1-t1]: Populate mongodb-config.yaml
    Description: Write valid YAML with database name, host, fallback_mode,
                 collections schema (career_signals, workflow_history)
    SUBTASK [sync-qm-f2-s1-t1-st1]: Write database: section (name, host, fallback_mode)
    SUBTASK [sync-qm-f2-s1-t1-st2]: Write collections: career_signals, workflow_history
    SUBTASK [sync-qm-f2-s1-t1-st3]: Verify YAML parses without error

  TASK [sync-qm-f2-s1-t2]: Populate chromadb-config.yaml
    Description: Write valid YAML with database name, host, fallback_mode,
                 collections list (career-patterns, optimization-results, qa-patterns)
    SUBTASK [sync-qm-f2-s1-t2-st1]: Write database: section with HTTP fallback
    SUBTASK [sync-qm-f2-s1-t2-st2]: Write collections list
    SUBTASK [sync-qm-f2-s1-t2-st3]: Verify YAML parses without error
```

#### Story 2.2: Delete Stub Workflow Files

```
USER STORY [sync-qm-f2-s2]
  Title: As a maintainer, I want the 6 empty stub workflow files removed
         so manifests don't reference ghost files
  Parent: sync-qm-f2

  TASK [sync-qm-f2-s2-t1]: Delete the 6 zero-byte stub files
    Description: Delete all 6 empty stub files (they will be recreated properly in P1)
    BUG [sync-qm-f2-s2-b1]: flex-workflow-twitter.md — 0 bytes, blocks manifest integrity
    BUG [sync-qm-f2-s2-b2]: flex-workflow-linkedin.md — 0 bytes, blocks manifest integrity
    BUG [sync-qm-f2-s2-b3]: flex-workflow-instagram.md — 0 bytes, blocks manifest integrity
    BUG [sync-qm-f2-s2-b4]: squick-workflow-release.md — 0 bytes, blocks manifest integrity
    BUG [sync-qm-f2-s2-b5]: squick-workflow-qa.md — 0 bytes, blocks manifest integrity
    BUG [sync-qm-f2-s2-b6]: tea-kb-testing-patterns.md — 0 bytes, blocks manifest integrity

  TASK [sync-qm-f2-s2-t2]: Remove deleted file references from manifests
    Description: After deletion, update any CSV manifests that reference these files
    SUBTASK [sync-qm-f2-s2-t2-st1]: Search all CSV manifests for deleted filenames
    SUBTASK [sync-qm-f2-s2-t2-st2]: Remove or mark-as-deleted each row found
    SUBTASK [sync-qm-f2-s2-t2-st3]: Run validation: confirm no broken refs remain
```

---

### F3 — P0-3: Evidence Collection Pattern for Beads

```
FEATURE [sync-qm-f3]
  Title: P0-3: Create mandatory evidence collection pattern for all bd close calls
  Type: feature
  Priority: P0
  Parent: sync-qm-root
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 4 hours
  Description:
    173 past Beads issues closed without evidence. No traceability, no way to verify
    what was actually done. Fix: create evidence template, add SUCCESS/FAILURE checklists
    to step files, install pre-commit hook rejecting bd close without EVIDENCE section.
  Acceptance:
    ✅ EVIDENCE-TEMPLATE.md written with mandatory fields
    ✅ Pre-commit hook installed and tested (rejects bare bd close)
    ✅ 3 reference step files updated with SUCCESS/FAILURE checklists
    ✅ All future bd close calls must include EVIDENCE section
```

#### Story 3.1: Design Evidence Standard

```
USER STORY [sync-qm-f3-s1]
  Title: As a maintainer, I want a clear evidence template so every Beads
         closure has documented proof of what was actually done
  Parent: sync-qm-f3

  TASK [sync-qm-f3-s1-t1]: Write EVIDENCE-TEMPLATE.md
    Description: Create .agents/workflows/EVIDENCE-TEMPLATE.md with mandatory fields:
                 Input, Operation, Output, Metrics, Files modified, Test results
    SUBTASK [sync-qm-f3-s1-t1-st1]: Write mandatory fields with definitions
    SUBTASK [sync-qm-f3-s1-t1-st2]: Write 3 worked examples (feature, bug, task)
    SUBTASK [sync-qm-f3-s1-t1-st3]: Write "What NOT to do" anti-patterns

  TASK [sync-qm-f3-s1-t2]: Write SUCCESS/FAILURE section standard for step files
    Description: Define mandatory SUCCESS and FAILURE checklist format that every
                 Linkright step file must include in frontmatter/body
    SUBTASK [sync-qm-f3-s1-t2-st1]: Define SUCCESS metrics format (checklist not prose)
    SUBTASK [sync-qm-f3-s1-t2-st2]: Define FAILURE anti-metrics format
    SUBTASK [sync-qm-f3-s1-t2-st3]: Write reference step file showing both sections
```

#### Story 3.2: Enforce via Pre-Commit Hook

```
USER STORY [sync-qm-f3-s2]
  Title: As an engineer, I want the system to reject bd close without evidence
         so the standard is impossible to accidentally skip
  Parent: sync-qm-f3

  TASK [sync-qm-f3-s2-t1]: Write verify-beads-evidence.sh
    Description: Shell script that validates --reason string contains EVIDENCE: section
                 with minimum sub-fields: Input, Operation, Output, Metrics
    SUBTASK [sync-qm-f3-s2-t1-st1]: Parse --reason argument, check for EVIDENCE: header
    SUBTASK [sync-qm-f3-s2-t1-st2]: Check mandatory sub-fields present
    SUBTASK [sync-qm-f3-s2-t1-st3]: Return exit code 1 if validation fails
    SUBTASK [sync-qm-f3-s2-t1-st4]: Return exit code 0 if validation passes

  TASK [sync-qm-f3-s2-t2]: Install and test pre-commit hook
    Description: Install as Beads pre-close hook, test 4 scenarios
    SUBTASK [sync-qm-f3-s2-t2-st1]: Install hook in .agents/workflows/
    SUBTASK [sync-qm-f3-s2-t2-st2]: Test: bd close no reason → rejected
    SUBTASK [sync-qm-f3-s2-t2-st3]: Test: bd close bare reason → rejected
    SUBTASK [sync-qm-f3-s2-t2-st4]: Test: bd close full EVIDENCE section → accepted
```

#### Story 3.3: Backfill Pattern Into 3 Reference Steps

```
USER STORY [sync-qm-f3-s3]
  Title: As a step file author, I want 3 reference examples so I know
         exactly what format to use when writing new steps
  Parent: sync-qm-f3

  TASK [sync-qm-f3-s3-t1]: Update 3 jd-optimize step files with SUCCESS/FAILURE
    Description: Pick 3 representative steps, add properly formatted SUCCESS and
                 FAILURE sections — these become canonical reference examples
    SUBTASK [sync-qm-f3-s3-t1-st1]: Update step-01-load-session-context.md
    SUBTASK [sync-qm-f3-s3-t1-st2]: Update step-02-clarify-requirements.md
    SUBTASK [sync-qm-f3-s3-t1-st3]: Update step-03-extract-signals.md
    SUBTASK [sync-qm-f3-s3-t1-st4]: Document as "canonical reference examples"
```

---

### F4 — P0-4: Beads Wiring in All 17 Workflows

```
FEATURE [sync-qm-f4]
  Title: P0-4: Wire step-01b-resume pattern into all 17 workflows
  Type: feature
  Priority: P0
  Parent: sync-qm-root
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 6 hours
  Description:
    Only 3/17 workflows have Beads step-01b resume detection. 14 workflows lose
    all context when interrupted. Fix: create canonical step-01b template, pilot on
    jd-optimize, then deploy to all 14 missing workflows.
  Acceptance:
    ✅ step-01b template written (canonical form)
    ✅ All 17 workflows have step-01b in steps-c/ directory
    ✅ Each step-01b checks bd list --status=in_progress for workflow issue
    ✅ step-01 in each workflow has NEXT STEP → step-01b reference
    ✅ step-01b correctly chains to step-02 when no resume needed
```

#### Story 4.1: Create Canonical step-01b Template

```
USER STORY [sync-qm-f4-s1]
  Title: As a workflow author, I want a canonical step-01b template
         so I can wire Beads resume into any workflow by copy-paste
  Parent: sync-qm-f4

  TASK [sync-qm-f4-s1-t1]: Write master step-01b-resume-if-interrupted.md
    Description: Full logic: check bd list, show existing issue if found,
                 ask user "resume?", branch to last step or fresh start
    SUBTASK [sync-qm-f4-s1-t1-st1]: Write YAML frontmatter (dependencies, phase)
    SUBTASK [sync-qm-f4-s1-t1-st2]: Write IF/ELSE resume detection logic
    SUBTASK [sync-qm-f4-s1-t1-st3]: Write "show last status" display section
    SUBTASK [sync-qm-f4-s1-t1-st4]: Write NEXT STEP links (step-02 or resume point)
    SUBTASK [sync-qm-f4-s1-t1-st5]: Write SUCCESS criteria: "Session context restored"

  TASK [sync-qm-f4-s1-t2]: Pilot template with jd-optimize (already has Beads)
    Description: Deploy to jd-optimize, verify logic works before mass deployment
    SUBTASK [sync-qm-f4-s1-t2-st1]: Copy template to jd-optimize/steps-c/
    SUBTASK [sync-qm-f4-s1-t2-st2]: Verify step-01 references step-01b as NEXT STEP
    SUBTASK [sync-qm-f4-s1-t2-st3]: Document any issues found during pilot
```

#### Story 4.2: Audit 14 Missing Workflows

```
USER STORY [sync-qm-f4-s2]
  Title: As a maintainer, I want a complete list of which 14 workflows need
         step-01b so Vulcan can deploy systematically
  Parent: sync-qm-f4

  TASK [sync-qm-f4-s2-t1]: Audit all 17 workflows for step-01b presence
    SUBTASK [sync-qm-f4-s2-t1-st1]: Check sync module workflows
    SUBTASK [sync-qm-f4-s2-t1-st2]: Check core, lrb module workflows
    SUBTASK [sync-qm-f4-s2-t1-st3]: Check flex, squick module workflows
    SUBTASK [sync-qm-f4-s2-t1-st4]: Check tea, cis module workflows
    SUBTASK [sync-qm-f4-s2-t1-st5]: Output: 3 have step-01b, 14 missing — list them
```

#### Story 4.3: Deploy step-01b to 14 Workflows

```
USER STORY [sync-qm-f4-s3]
  Title: As a user, I want all 17 workflows to support resume detection
         so interrupted multi-day work is never lost
  Parent: sync-qm-f4

  TASK [sync-qm-f4-s3-t1]: Deploy to sync module missing workflows
    SUBTASK [sync-qm-f4-s3-t1-st1]: Deploy to sync workflow batch 1 (customize tag)
    SUBTASK [sync-qm-f4-s3-t1-st2]: Deploy to sync workflow batch 2
    SUBTASK [sync-qm-f4-s3-t1-st3]: Deploy to remaining sync workflows

  TASK [sync-qm-f4-s3-t2]: Deploy to flex, squick, lrb, core, tea modules
    SUBTASK [sync-qm-f4-s3-t2-st1]: Deploy to flex module workflows
    SUBTASK [sync-qm-f4-s3-t2-st2]: Deploy to squick module workflows
    SUBTASK [sync-qm-f4-s3-t2-st3]: Deploy to core, lrb, tea module workflows

  TASK [sync-qm-f4-s3-t3]: Verify all 17 step-01 files reference step-01b
    SUBTASK [sync-qm-f4-s3-t3-st1]: Check + update step-01 for each of 14 workflows
    SUBTASK [sync-qm-f4-s3-t3-st2]: Final count: confirm 17/17 workflows wired
```

---

### F5 — P0-5: Phases D-M Implementation (BLOCKED)

```
FEATURE [sync-qm-f5]
  Title: P0-5: Implement Phases D-M step files — BLOCKED pending Satvik decision
  Type: feature
  Priority: P0
  Parent: sync-qm-root
  Assignee: UNASSIGNED
  Status: BLOCKED
  Time Estimate: 20h (initial design, after unblock)
  Description:
    40+ step files needed for Phases D-M of jd-optimize and other workflows don't exist.
    Only Phase C steps exist. Full pipeline (signal retrieval → gap analysis → content
    drafting → layout → delivery) is absent.
    DEPENDS ON: P1-1 (atomicity standard) + P1-6 (quality gates) + Satvik decision.
  Blocker: Satvik must clarify which workflows get Phases D-M first.
```

#### Story 5.1: Clarification Required (BLOCKED)

```
USER STORY [sync-qm-f5-s1] — BLOCKED
  Title: As Satvik, I want to decide scope of Phases D-M implementation
         so the team doesn't build the wrong workflows
  Parent: sync-qm-f5

  TASK [sync-qm-f5-s1-t1]: BLOCKED — Present options to Satvik
    SUBTASK: (a) jd-optimize only, (b) all sync workflows, (c) all 17
    SUBTASK: Present time estimate per option
    SUBTASK: Record decision + unblock F5
```

#### Story 5.2: Phase D-M Design (After Unblock)

```
USER STORY [sync-qm-f5-s2] — BLOCKED
  Title: As an engineer, I want a step plan for D-M so I can implement
         systematically without guessing the right architecture
  Parent: sync-qm-f5

  TASK [sync-qm-f5-s2-t1]: BLOCKED — Design Phase D steps
  TASK [sync-qm-f5-s2-t2]: BLOCKED — Design Phases E-H steps
  TASK [sync-qm-f5-s2-t3]: BLOCKED — Design Phases I-M steps
  TASK [sync-qm-f5-s2-t4]: BLOCKED — Create atomicity-compliant files
```

---

## P1 FEATURES (Major — Release 4 Timeline)

---

### F6 — P1-1: Fix 14 Atomicity Violations

```
FEATURE [sync-qm-f6]
  Title: P1-1: Refactor 14 non-atomic step files into 25+ atomic steps
  Type: feature
  Priority: P1
  Parent: sync-qm-root
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 8 hours
  Description:
    14 step files do multiple cognitive operations in one step. B-MAD rule: one
    cognitive operation per step = clear success/failure. Examples: step-02e-parse-and-optimize.md
    does parse + extract + optimize (should be 3 steps).
    Fix: split each into 2-3+ focused atomic steps.
  Acceptance:
    ✅ No step file name contains "-and-" (indicator of multi-op)
    ✅ All 14 violations refactored into 25+ new atomic steps
    ✅ Each new step has exactly one cognitive operation
    ✅ New step sequence produces same output as original
    ✅ ATOMICITY-STANDARD.md written as reference
```

#### Story 6.1: Define Atomicity Standard

```
USER STORY [sync-qm-f6-s1]
  Title: As a step author, I want a definitive atomicity reference
         so I can judge whether a proposed step is atomic
  Parent: sync-qm-f6

  TASK [sync-qm-f6-s1-t1]: Write ATOMICITY-STANDARD.md
    SUBTASK [sync-qm-f6-s1-t1-st1]: Define "cognitive operation" clearly
    SUBTASK [sync-qm-f6-s1-t1-st2]: Write 3 anti-pattern examples with wrong step names
    SUBTASK [sync-qm-f6-s1-t1-st3]: Write correct refactored version of each example
    SUBTASK [sync-qm-f6-s1-t1-st4]: Write decision tree: "Is this step atomic?"
```

#### Story 6.2: Audit and Catalog Violations

```
USER STORY [sync-qm-f6-s2]
  Title: As a maintainer, I want a complete list of all 14 violations
         so refactoring can be tracked systematically
  Parent: sync-qm-f6

  TASK [sync-qm-f6-s2-t1]: Find all "-and-" step file names
    SUBTASK [sync-qm-f6-s2-t1-st1]: Grep _lr/ for "-and-" in .md filenames
    SUBTASK [sync-qm-f6-s2-t1-st2]: Review content for multi-operation steps
    SUBTASK [sync-qm-f6-s2-t1-st3]: Check for "-then-" or compound gerund names

  TASK [sync-qm-f6-s2-t2]: Produce refactoring plan per violation
    SUBTASK [sync-qm-f6-s2-t2-st1]: Plan splits for jd-optimize violations
    SUBTASK [sync-qm-f6-s2-t2-st2]: Plan splits for other workflow violations
```

#### Story 6.3: Execute Refactoring

```
USER STORY [sync-qm-f6-s3]
  Title: As a user, I want all step files to be atomic so workflow
         failures are isolated and resumable at any point
  Parent: sync-qm-f6

  TASK [sync-qm-f6-s3-t1]: Refactor jd-optimize violations (highest priority)
    SUBTASK [sync-qm-f6-s3-t1-st1]: Split step-02e into: parse / extract / optimize
    SUBTASK [sync-qm-f6-s3-t1-st2]: Split step-03e into: generate / organize
    SUBTASK [sync-qm-f6-s3-t1-st3]: Split step-04e into: review / edit / finalize
    SUBTASK [sync-qm-f6-s3-t1-st4]: Update step chain NEXT STEP references

  TASK [sync-qm-f6-s3-t2]: Refactor remaining violations
    SUBTASK [sync-qm-f6-s3-t2-st1]: Refactor violations in other sync workflows
    SUBTASK [sync-qm-f6-s3-t2-st2]: Refactor violations in flex/core workflows
    SUBTASK [sync-qm-f6-s3-t2-st3]: Final verify: grep for remaining "-and-" names
```

---

### F7 — P1-2: Write 9 Architecture Decision Records

```
FEATURE [sync-qm-f7]
  Title: P1-2: Create ADRs directory with 9 documented architecture decisions
  Type: feature
  Priority: P1
  Parent: sync-qm-root
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 4 hours
  Description:
    9 major architectural decisions have no documented rationale. Future maintainers
    risk undoing good decisions. Fix: create ADRs/ directory + write 9 ADRs.
    Note: B-MAD doesn't have ADRs — this is Linkright EXCEEDING B-MAD.
  Acceptance:
    ✅ ADRs/ directory exists
    ✅ 9 ADR files written with: Status, Context, Decision, Rationale, Consequences, Alternatives
    ✅ ADR-INDEX.md listing all 9
```

#### Story 7.1: ADR Infrastructure

```
USER STORY [sync-qm-f7-s1]
  Title: As a maintainer, I want an ADRs directory with a standard template
         so all ADRs are written consistently
  Parent: sync-qm-f7

  TASK [sync-qm-f7-s1-t1]: Create directory and template
    SUBTASK [sync-qm-f7-s1-t1-st1]: Create _lr/docs/ADRs/ directory
    SUBTASK [sync-qm-f7-s1-t1-st2]: Write ADR-000-template.md with required sections
    SUBTASK [sync-qm-f7-s1-t1-st3]: Write ADR-INDEX.md listing all 9 planned decisions
```

#### Story 7.2: Infrastructure ADRs (ADR-001 to 005)

```
USER STORY [sync-qm-f7-s2]
  Title: As a future engineer, I want infrastructure decisions documented
         so I understand why Beads, ChromaDB, and Agent Mail were chosen
  Parent: sync-qm-f7

  TASK [sync-qm-f7-s2-t1]: Write ADR-001: Beads for Task Persistence
    SUBTASK: Context: need persistent tracking across sessions
    SUBTASK: Decision + Rationale: Dolt-backed, dependency graphs, audit trail
    SUBTASK: Alternatives: file state, Redis, relational database

  TASK [sync-qm-f7-s2-t2]: Write ADR-002: ChromaDB vs MongoDB separation
    SUBTASK: ChromaDB = semantic/vector, MongoDB = structured signals
    SUBTASK: Why not unified database for both

  TASK [sync-qm-f7-s2-t3]: Write ADR-003: Agent Mail for Coordination
    SUBTASK: Why not shared state, message queue, or direct agent calls

  TASK [sync-qm-f7-s2-t4]: Write ADR-004: 3-Phase Workflow Structure (c/e/v)
    SUBTASK: Clarify / Execute / Verify phase rationale

  TASK [sync-qm-f7-s2-t5]: Write ADR-005: Unified IDE Manifest
    SUBTASK: Why unified over per-IDE manifests (19 B-MAD vs 33 Linkright)
```

#### Story 7.3: Methodology ADRs (ADR-006 to 009)

```
USER STORY [sync-qm-f7-s3]
  Title: As a step file author, I want methodology decisions documented
         so I know why atomic steps, YAML/XML, and {{VAR}} syntax were chosen
  Parent: sync-qm-f7

  TASK [sync-qm-f7-s3-t1]: Write ADR-006: Jinja2 Template Syntax ({{VAR}})
    SUBTASK: Why {{VAR}} over ${VAR} — links to P1-7 fix rationale

  TASK [sync-qm-f7-s3-t2]: Write ADR-007: MongoDB for Career Signals
    SUBTASK: Document store vs relational for career signal data

  TASK [sync-qm-f7-s3-t3]: Write ADR-008: Atomic Steps Principle
    SUBTASK: Cost-benefit of one-cognitive-operation rule

  TASK [sync-qm-f7-s3-t4]: Write ADR-009: YAML/XML vs Markdown-only Workflows
    SUBTASK: When to use workflow.yaml+engine vs direct markdown execution
```

---

### F8 — P1-3: Expand 7 FLEX Agent Files to ≥40 Lines

```
FEATURE [sync-qm-f8]
  Title: P1-3: Expand 7 FLEX agent files to ≥40 lines with complete XML
  Type: feature
  Priority: P1
  Parent: sync-qm-root
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 3 hours
  Description:
    7 FLEX agents below 40-line minimum: flex-content-creator (35), flex-amplifier (32),
    flex-monitor (36), flex-scheduler (28), flex-analytics (31) + 2 others.
    Fix: expand each to ≥40 lines per Agent XML Standard.
  Acceptance:
    ✅ All 29 agents ≥40 lines
    ✅ All 7 FLEX agents have 8-step activation sequence
    ✅ All 7 have full persona (role, identity, communication_style, principles)
    ✅ All 7 have complete menu with ≥4 items + dismiss
```

#### Story 8.1: Write Agent XML Standard

```
USER STORY [sync-qm-f8-s1]
  Title: As an agent author, I want a minimum-viable agent XML template
         so I know exactly what 40+ lines must contain
  Parent: sync-qm-f8

  TASK [sync-qm-f8-s1-t1]: Write AGENT-XML-STANDARD.md
    SUBTASK [sync-qm-f8-s1-t1-st1]: Write complete 48-line reference agent XML
    SUBTASK [sync-qm-f8-s1-t1-st2]: Annotate each section (what goes where + why)
    SUBTASK [sync-qm-f8-s1-t1-st3]: List 8 mandatory activation steps with descriptions
```

#### Story 8.2: Audit 7 Short FLEX Agents

```
USER STORY [sync-qm-f8-s2]
  Title: As a maintainer, I want to know line counts and missing sections
         for each of the 7 agents so expansion can be targeted
  Parent: sync-qm-f8

  TASK [sync-qm-f8-s2-t1]: Audit FLEX agent files
    SUBTASK [sync-qm-f8-s2-t1-st1]: Count lines: flex-content-creator, flex-amplifier, flex-monitor
    SUBTASK [sync-qm-f8-s2-t1-st2]: Count lines: flex-scheduler, flex-analytics + 2 others
    SUBTASK [sync-qm-f8-s2-t1-st3]: Note missing sections per agent
```

#### Story 8.3: Expand All 7 Agents

```
USER STORY [sync-qm-f8-s3]
  Title: As a FLEX module user, I want all flex agents fully functional
         so content creation workflows work properly
  Parent: sync-qm-f8

  TASK [sync-qm-f8-s3-t1]: Expand flex-content-creator, flex-amplifier, flex-monitor
    SUBTASK [sync-qm-f8-s3-t1-st1]: Expand flex-content-creator to ≥40 lines
    SUBTASK [sync-qm-f8-s3-t1-st2]: Expand flex-amplifier to ≥40 lines
    SUBTASK [sync-qm-f8-s3-t1-st3]: Expand flex-monitor to ≥40 lines

  TASK [sync-qm-f8-s3-t2]: Expand flex-scheduler, flex-analytics + remaining 2
    SUBTASK [sync-qm-f8-s3-t2-st1]: Expand flex-scheduler to ≥40 lines
    SUBTASK [sync-qm-f8-s3-t2-st2]: Expand flex-analytics to ≥40 lines
    SUBTASK [sync-qm-f8-s3-t2-st3]: Expand remaining 2 FLEX agents to ≥40 lines
    SUBTASK [sync-qm-f8-s3-t2-st4]: Final check: all 29 agents ≥40 lines (grep count)
```

---

### F9 — P1-4: Repair Manifest Cross-References

```
FEATURE [sync-qm-f9]
  Title: P1-4: Audit and repair all 5 CSV manifest cross-references
  Type: feature
  Priority: P1
  Parent: sync-qm-root
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 2 hours
  Description:
    3 of 5 manifests have broken references: workflow-manifest refs zero-byte file,
    agent-manifest lists 2 missing agent files, task-manifest refs nonexistent configs.
    DEPENDS ON: F2 (zero-byte files deleted first).
  Acceptance:
    ✅ All manifest cross-references validate successfully
    ✅ No manifest row references a zero-byte file
    ✅ No manifest row references a nonexistent file path
    ✅ All 29 agents in agent-manifest.csv (2 missing = fixed)
```

#### Story 9.1: Audit All 5 Manifests

```
USER STORY [sync-qm-f9-s1]
  Title: As a maintainer, I want a row-by-row audit of all 5 manifests
         so I know exactly which references are broken
  Parent: sync-qm-f9

  TASK [sync-qm-f9-s1-t1]: Audit workflow-manifest.csv
    SUBTASK [sync-qm-f9-s1-t1-st1]: Check every file_path — file exists and not zero-byte
    SUBTASK [sync-qm-f9-s1-t1-st2]: Identify flex-workflow-instagram.md (known broken)
    SUBTASK [sync-qm-f9-s1-t1-st3]: Find any other broken paths

  TASK [sync-qm-f9-s1-t2]: Audit agent-manifest.csv and task-manifest.csv
    SUBTASK [sync-qm-f9-s1-t2-st1]: agent-manifest: find 2 missing agent files
    SUBTASK [sync-qm-f9-s1-t2-st2]: task-manifest: find nonexistent config sources

  TASK [sync-qm-f9-s1-t3]: Audit remaining 2 manifests
    SUBTASK [sync-qm-f9-s1-t3-st1]: Audit files manifest and IDE manifest
    SUBTASK [sync-qm-f9-s1-t3-st2]: Document all broken references found
```

#### Story 9.2: Repair Broken References

```
USER STORY [sync-qm-f9-s2]
  Title: As a user, I want all manifests accurate so IDE command palettes
         find the right files every time without errors
  Parent: sync-qm-f9

  TASK [sync-qm-f9-s2-t1]: Repair workflow-manifest.csv
    BUG [sync-qm-f9-s2-b1]: workflow-manifest.csv row: flex-workflow-instagram.md → zero-byte

  TASK [sync-qm-f9-s2-t2]: Repair agent-manifest.csv
    BUG [sync-qm-f9-s2-b2]: agent-manifest.csv: 2 agent files listed but don't exist

  TASK [sync-qm-f9-s2-t3]: Repair task-manifest.csv + remaining
    SUBTASK [sync-qm-f9-s2-t3-st1]: Fix nonexistent config source references
    SUBTASK [sync-qm-f9-s2-t3-st2]: Run final validation across all 5 manifests
```

---

### F10 — P1-5: Populate TEA Knowledge Base

```
FEATURE [sync-qm-f10]
  Title: P1-5: Create TEA module knowledge base (5+ data files)
  Type: feature
  Priority: P1
  Parent: sync-qm-root
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 6 hours
  Description:
    TEA module has 3 agents but zero knowledge base. No testing patterns, no QA checklists,
    no bug categories. Agents make no data-driven decisions.
    Fix: create tea/data/ directory with 5 knowledge files.
  Acceptance:
    ✅ tea/data/ directory created
    ✅ testing-patterns.csv (12+ patterns)
    ✅ qa-checklists.yaml (5+ checklists)
    ✅ common-bugs.md (20+ bug categories)
    ✅ coverage-targets.yaml (targets by module)
    ✅ qa-methodology.md (TEA approach document)
    ✅ TEA step files can JIT-load and reference these files
```

#### Story 10.1: Design KB Structure

```
USER STORY [sync-qm-f10-s1]
  Title: As a TEA agent, I want a structured knowledge base so I know
         where to find testing patterns at JIT load time
  Parent: sync-qm-f10

  TASK [sync-qm-f10-s1-t1]: Design tea/data/ structure and schemas
    SUBTASK [sync-qm-f10-s1-t1-st1]: Define CSV schema for testing-patterns.csv
    SUBTASK [sync-qm-f10-s1-t1-st2]: Define YAML schema for qa-checklists.yaml
    SUBTASK [sync-qm-f10-s1-t1-st3]: Define structure for common-bugs.md
    SUBTASK [sync-qm-f10-s1-t1-st4]: Define schema for coverage-targets.yaml
```

#### Story 10.2: Write KB Files

```
USER STORY [sync-qm-f10-s2]
  Title: As a QA engineer using TEA agents, I want testing patterns and
         checklists available so agents give data-driven guidance
  Parent: sync-qm-f10

  TASK [sync-qm-f10-s2-t1]: Write testing-patterns.csv (12+ rows)
    SUBTASK [sync-qm-f10-s2-t1-st1]: Research 12+ agentic system testing patterns
    SUBTASK [sync-qm-f10-s2-t1-st2]: Write CSV: pattern_name, category, when_to_use

  TASK [sync-qm-f10-s2-t2]: Write qa-checklists.yaml (5+ checklists)
    SUBTASK [sync-qm-f10-s2-t2-st1]: Pre-release checklist
    SUBTASK [sync-qm-f10-s2-t2-st2]: Agent activation checklist
    SUBTASK [sync-qm-f10-s2-t2-st3]: Step file quality checklist
    SUBTASK [sync-qm-f10-s2-t2-st4]: Manifest integrity checklist
    SUBTASK [sync-qm-f10-s2-t2-st5]: Beads closure evidence checklist

  TASK [sync-qm-f10-s2-t3]: Write common-bugs.md and coverage-targets.yaml
    SUBTASK [sync-qm-f10-s2-t3-st1]: 20+ bug categories (type, symptoms, fix pattern)
    SUBTASK [sync-qm-f10-s2-t3-st2]: Coverage targets by module (sync, flex, squick, etc.)

  TASK [sync-qm-f10-s2-t4]: Write qa-methodology.md
    SUBTASK [sync-qm-f10-s2-t4-st1]: TEA's philosophy for agentic QA
    SUBTASK [sync-qm-f10-s2-t4-st2]: Three-tier testing: step / workflow / system
    SUBTASK [sync-qm-f10-s2-t4-st3]: Evidence collection requirements for QA
```

---

### F11 — P1-6: Implement Three-Tier Quality Gates

```
FEATURE [sync-qm-f11]
  Title: P1-6: Design and deploy three-tier quality gates to all workflows
  Type: feature
  Priority: P1
  Parent: sync-qm-root
  Assignee: Vulcan (Engineer 1)
  Time Estimate: 4 hours
  Description:
    No pre/post validation in any workflow step. Bad data passes silently, errors cascade.
    Fix: design PRE_GATE / POST_GATE / FAIL_GATE system as YAML frontmatter + scripts.
    New steps from F5 (Phases D-M) will use this standard.
  Acceptance:
    ✅ Three-tier gate standard defined in QUALITY-GATES-STANDARD.md
    ✅ Gate YAML schema documented
    ✅ 3 reference step files updated with all 3 gates
    ✅ Validation script templates written
    ✅ All new step files (from F5) will follow this standard
```

#### Story 11.1: Design Gate System

```
USER STORY [sync-qm-f11-s1]
  Title: As a step author, I want a clear quality gate standard
         so I can add validation to any step without guessing
  Parent: sync-qm-f11

  TASK [sync-qm-f11-s1-t1]: Write QUALITY-GATES-STANDARD.md
    SUBTASK [sync-qm-f11-s1-t1-st1]: Define PRE_GATE: validate inputs before step runs
    SUBTASK [sync-qm-f11-s1-t1-st2]: Define POST_GATE: validate outputs after step
    SUBTASK [sync-qm-f11-s1-t1-st3]: Define FAIL_GATE: rollback or flag-for-human
    SUBTASK [sync-qm-f11-s1-t1-st4]: Write complete example step file with all 3 gates

  TASK [sync-qm-f11-s1-t2]: Write validation script templates
    SUBTASK [sync-qm-f11-s1-t2-st1]: validate-step-input.sh.template
    SUBTASK [sync-qm-f11-s1-t2-st2]: validate-step-output.sh.template
    SUBTASK [sync-qm-f11-s1-t2-st3]: rollback-step.sh.template
```

#### Story 11.2: Deploy Gates to 3 Reference Steps

```
USER STORY [sync-qm-f11-s2]
  Title: As an engineer, I want 3 working gated step examples
         so I can verify the standard works before full deployment
  Parent: sync-qm-f11

  TASK [sync-qm-f11-s2-t1]: Apply gates to 3 jd-optimize step files
    SUBTASK [sync-qm-f11-s2-t1-st1]: Gate: step-01 (input: session context valid?)
    SUBTASK [sync-qm-f11-s2-t1-st2]: Gate: step-02 (output: requirements documented?)
    SUBTASK [sync-qm-f11-s2-t1-st3]: Gate: step-03 (fail gate: rollback on bad signals)
    SUBTASK [sync-qm-f11-s2-t1-st4]: Document: "these 3 are canonical gate examples"
```

---

### F12 — P1-7: Standardize Template Variables to {{VAR}}

```
FEATURE [sync-qm-f12]
  Title: P1-7: Replace ${VAR} and bare $VAR with {{VAR}} across all step files
  Type: feature
  Priority: P1
  Parent: sync-qm-root
  Assignee: Hephaestus (Engineer 2)
  Time Estimate: 2 hours
  Description:
    Three variable syntaxes in use: {{VAR}} (B-MAD standard), ${VAR} (9 files),
    $VAR (4 files). Template engine confusion. Fix: standardize to {{VAR}} everywhere.
    SOFT DEPENDENCY: ADR-006 (from F7) should document this as canonical standard first.
  Acceptance:
    ✅ 0 instances of ${VAR} template vars in any .md file under _lr/
    ✅ 0 instances of bare $VAR meant as template vars
    ✅ All template variables use {{VAR}} consistently
```

#### Story 12.1: Audit Variable Usage

```
USER STORY [sync-qm-f12-s1]
  Title: As a maintainer, I want to know exactly how many files use each
         variable syntax so refactor scope is clear
  Parent: sync-qm-f12

  TASK [sync-qm-f12-s1-t1]: Grep for all three variable syntaxes
    SUBTASK [sync-qm-f12-s1-t1-st1]: Grep _lr/ for \$\{[A-Z] — find ~9 files
    SUBTASK [sync-qm-f12-s1-t1-st2]: Grep _lr/ for bare \$[A-Z_]+ — find ~4 files
    SUBTASK [sync-qm-f12-s1-t1-st3]: Grep _lr/ for \{\{[A-Z] — note current correct count
    SUBTASK [sync-qm-f12-s1-t1-st4]: Produce: full list of files needing update
```

#### Story 12.2: Execute Find-Replace

```
USER STORY [sync-qm-f12-s2]
  Title: As a step author, I want consistent {{VAR}} syntax everywhere
         so the template engine resolves variables correctly every time
  Parent: sync-qm-f12

  TASK [sync-qm-f12-s2-t1]: Replace ${VAR} → {{VAR}} in 9 files
    SUBTASK [sync-qm-f12-s2-t1-st1]: Run sed replacement across identified files
    SUBTASK [sync-qm-f12-s2-t1-st2]: Verify replacement didn't break any shell scripts
    SUBTASK [sync-qm-f12-s2-t1-st3]: Manual spot-check 3 files

  TASK [sync-qm-f12-s2-t2]: Replace bare $VAR → {{VAR}} in 4 files
    SUBTASK [sync-qm-f12-s2-t2-st1]: Identify which $VAR are templates vs shell vars
    SUBTASK [sync-qm-f12-s2-t2-st2]: Replace only template-intent instances
    SUBTASK [sync-qm-f12-s2-t2-st3]: Final grep: confirm 0 remaining ${VAR} or bare $VAR
```

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY ORDER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  IMMEDIATE START (no blockers):                                       │
│    F3 (evidence pattern)      → start Day 1                          │
│    F4 (Beads wiring)          → start Day 1                          │
│    F6 (atomicity)             → start Day 1                          │
│    F7 (ADRs)                  → start Day 1                          │
│    F8 (agent XML)             → start Day 1                          │
│    F10 (TEA KB)               → start Day 1                          │
│    F11 (quality gates)        → start Day 1                          │
│                                                                       │
│  AFTER F2 COMPLETE:                                                   │
│    F1 (manifest) → needs F2 (zero-byte deleted first)                │
│    F9 (manifest cross-refs) → needs F2 (zero-byte deleted first)     │
│                                                                       │
│  AFTER F7 COMPLETE (soft):                                           │
│    F12 (variables) → ADR-006 documents standard first                │
│                                                                       │
│  BLOCKED UNTIL SATVIK + F6 + F11:                                    │
│    F5 (Phases D-M) → needs atomicity standard + quality gates        │
│                    + Satvik scope decision                            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

Critical Path for Release 4:
  F2 (1h) → F1 (2h) → F9 (2h) = 5h manifest chain
  F3 (4h) parallel
  F4 (6h) parallel (longest P0 item)
  All P1 parallel after P0
```

---

## Engineer Assignment Summary

| Feature | Gap | Engineer | Hours | Priority |
|---------|-----|----------|-------|----------|
| F1 | P0-1: workflow-manifest.csv | Hephaestus | 2h | P0 |
| F2 | P0-2: zero-byte files | Vulcan | 1h | P0 |
| F3 | P0-3: evidence pattern | Hephaestus | 4h | P0 |
| F4 | P0-4: Beads wiring | Vulcan | 6h | P0 |
| F5 | P0-5: Phases D-M | **BLOCKED** | — | P0 |
| F6 | P1-1: atomicity violations | Vulcan | 8h | P1 |
| F7 | P1-2: ADRs (9 decisions) | Hephaestus | 4h | P1 |
| F8 | P1-3: agent XML depth | Vulcan | 3h | P1 |
| F9 | P1-4: manifest cross-refs | Hephaestus | 2h | P1 |
| F10 | P1-5: TEA knowledge base | Hephaestus | 6h | P1 |
| F11 | P1-6: quality gates | Vulcan | 4h | P1 |
| F12 | P1-7: template variables | Hephaestus | 2h | P1 |

**Vulcan total:** 1+6+8+3+4 = **22 hours**
**Hephaestus total:** 2+4+4+2+6+2 = **20 hours**
**Grand total:** 42 hours (excludes blocked F5)

---

## Issue Count by Level

| Feature | Stories | Tasks | Subtasks/Bugs | Subtotal |
|---------|---------|-------|----------------|----------|
| F1 | 3 | 6 | 16 | **25** |
| F2 | 2 | 4 | 12 (incl 6 bugs) | **18** |
| F3 | 3 | 5 | 14 | **22** |
| F4 | 3 | 6 | 17 | **26** |
| F5 | 2 | 4 | 5 (blocked) | **11** |
| F6 | 3 | 5 | 12 | **20** |
| F7 | 3 | 9 | 18 | **30** |
| F8 | 3 | 4 | 10 | **17** |
| F9 | 2 | 5 | 7 (incl 2 bugs) | **14** |
| F10 | 2 | 4 | 13 | **19** |
| F11 | 2 | 4 | 10 | **16** |
| F12 | 2 | 4 | 6 | **12** |
| **1 Epic + 12 Features** | **28** | **60** | **140** | **241** |

---

## Notes for Phoenix (When Creating Actual Beads Issues)

```
1. HIERARCHY ORDER: Create all levels before engineers start
   Epic first → Features → Stories → Tasks → Subtasks/Bugs
   Full tree MUST exist before any engineer claims work

2. DEPENDENCIES: Wire with bd dep add AFTER all issues created
   F1 depends on F2 (manifest → zero-byte deleted)
   F9 depends on F2
   F5 depends on F6 + F11 + Satvik decision

3. BLOCKED ISSUES: Create F5 issues with status=blocked immediately
   Add blocker comment: "Awaiting Satvik scope decision"

4. BUG ISSUES: Create as type=bug priority=0
   - 6 bugs in F2 (zero-byte files)
   - 2 bugs in F9 (broken manifest rows)

5. EVIDENCE HOOK: Install F3's pre-commit hook BEFORE engineers start
   Engineers cannot begin until evidence enforcement is live

6. DAG VERIFICATION: Run bd dep tree sync-qm-root before handing off
   Must be acyclic. If cycles found, fix before proceeding.

7. DESCRIPTIONS: No one-line descriptions allowed
   Every issue needs: Why it exists + what needs to be done

8. ASSIGNMENTS:
   Vulcan (lr-engineer-1): F2, F4, F6, F8, F11
   Hephaestus (lr-engineer-2): F1, F3, F7, F9, F10, F12
   F5: UNASSIGNED (blocked)
```

---

*Document created: 2026-03-09*
*Source: gap-analysis.md + final-solutions.md*
*Phoenix creates actual Beads issues matching this blueprint as next step*
