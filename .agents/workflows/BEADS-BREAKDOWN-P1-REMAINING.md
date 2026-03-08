# Beads Hierarchy Breakdown: P1 Remaining Features

**Date:** 2026-03-09
**Quality Standard:** Ultrathink - Complete atomic breakdown before execution
**Total Issues to Create:** ~40-50 (4 features × stories × tasks × subtasks)

---

## P1-1: Atomicity Violations — Split Multi-Op Steps (8h)

### Story 1.1: Analyze & Plan Refactoring (1.5h)

**Narrative:** As an engineer, I need to understand all atomicity violations and design refactoring strategy so that I can execute splits without losing functionality.

#### Task 1.1.1: Scan All Step Files for Multi-Op Violations (0.5h)
- Subtask 1.1.1a: Find all step files across sync/flex/squick modules
- Subtask 1.1.1b: Parse each step file for multiple operations (detect "AND", "THEN", multiple <processing> blocks)
- Subtask 1.1.1c: Document violations with module/path/line numbers

#### Task 1.1.2: Catalog All 14 Violations with Split Strategy (0.75h)
- Subtask 1.1.2a: List sync module violations (6 violations) with split strategy
  - step-03e: Parse + Optimize → 2 steps (split point: after parse completes)
  - step-04e: Review + Edit + Finalize → 3 steps (split at: after edit)
  - (4 more)
- Subtask 1.1.2b: List flex module violations (5 violations)
  - step-02e: Generate + Organize → 2 steps
  - (4 more)
- Subtask 1.1.2c: List squick module violations (3 violations)
  - (Document all 3)

#### Task 1.1.3: Design Output Schemas Between Splits (0.25h)
- Subtask 1.1.3a: For each split point, define output contract
  - Example: step-03e-parse outputs: { jd_parsed, requirements_extracted, key_terms[] }
  - Next step (step-03f-optimize) expects: { jd_parsed, requirements_extracted, key_terms[] }
- Subtask 1.1.3b: Document schema for ALL 25+ new steps
- Subtask 1.1.3c: Verify no schema mismatches (output of step N = input of step N+1)

---

### Story 1.2: Execute Refactoring (5h)

**Narrative:** As an engineer, I need to refactor each violation into atomic steps so that workflows are testable and resumable.

#### Task 1.2.1: Refactor Sync Module Violations (1.75h)
- Subtask 1.2.1a: Refactor step-03e-parse-and-optimize → step-03e-parse + step-03f-optimize
  - Create step-03e-parse.md (parse JD only, output schema A)
  - Create step-03f-optimize.md (optimize based on parsed JD, input schema A)
  - Update step chaining: step-03d → step-03e → step-03f → step-03g
  - Create tests for both new steps
- Subtask 1.2.1b: Refactor step-04e-review-edit-finalize → 3 steps
  - step-04e-review.md (review resume, output schema)
  - step-04f-edit.md (make edits, output schema)
  - step-04g-finalize.md (final checks, output schema)
  - Update chaining + create tests
- (Subtasks 1.2.1c through 1.2.1f: Handle remaining 4 sync violations)

#### Task 1.2.2: Refactor Flex Module Violations (1.5h)
- Subtask 1.2.2a: Refactor step-02e-generate-and-organize → 2 steps
  - (Detail refactoring)
- (Subtasks 1.2.2b through 1.2.2e: Handle remaining flex violations)

#### Task 1.2.3: Refactor Squick Module Violations (1h)
- Subtask 1.2.3a through 1.2.3c: (Handle 3 squick violations)

#### Task 1.2.4: Update Step Chaining & NextStepFile References (0.5h)
- Subtask 1.2.4a: Update all workflows' step chaining (nextStepFile in frontmatter)
  - Example: Old: step-03d → step-04a (skipped step-03e-f)
  - New: step-03d → step-03e → step-03f → step-03g → step-04a
- Subtask 1.2.4b: Verify no skipped steps (complete chains)
- Subtask 1.2.4c: Test resumption from each new step (step-01b works)

#### Task 1.2.5: Name & Organize All New Steps (0.25h)
- Subtask 1.2.5a: Verify naming convention: step-[N]-[name].md (all new steps follow this)
- Subtask 1.2.5b: No duplicate step numbers (each step has unique N)
- Subtask 1.2.5c: Verify all new steps are in correct directory (steps-c/e/v)

---

### Story 1.3: Test & Validate (1.5h)

**Narrative:** As QA, I need to verify that refactored steps are atomic, testable, and don't break existing workflows.

#### Task 1.3.1: Write Unit Tests for All New Steps (0.75h)
- Subtask 1.3.1a: For each new step, write test file
  - Input validation test (step rejects invalid inputs)
  - Output validation test (step produces correct schema)
  - Idempotency test (running twice produces same result)
- Subtask 1.3.1b: Create test data fixtures for each step
- Subtask 1.3.1c: Run all tests, verify 100% pass

#### Task 1.3.2: Verify Input/Output Schemas Match Between Steps (0.5h)
- Subtask 1.3.2a: For each step pair (step-03e → step-03f), verify:
  - Output of step-03e matches input expected by step-03f
  - No missing fields, no extra fields
  - Types match (string vs array vs object)

#### Task 1.3.3: Test Backward-Compatibility (0.25h)
- Subtask 1.3.3a: Verify old step files (if any) still work alongside new ones
- Subtask 1.3.3b: Test workflows that reference old multi-op steps (should still work)

#### Task 1.3.4: Document Refactoring in Commit Message (0h - happens during bd close)
- Subtask 1.3.4a: Evidence capture: list all 14 violations refactored
- Subtask 1.3.4b: Evidence capture: list all 25+ new steps created
- Subtask 1.3.4c: Evidence capture: test results

---

## P1-5: TEA Knowledge Base Population (6h)

### Story 5.1: Design & Structure TEA KB (1h)

**Narrative:** As a QA architect, I need to design the TEA knowledge base structure so that all modules have clear testing guidance.

#### Task 5.1.1: Create Testing Patterns CSV (0.3h)
- Subtask 5.1.1a: Design schema for testing-patterns.csv
  - Columns: pattern_name, description, applicability, example, module, seniority_level
- Subtask 5.1.1b: Document 5-10 pattern templates (golden-path, edge-case, error-recovery, concurrency, performance)
- Subtask 5.1.1c: Create file with header + 3 example rows (complete)

#### Task 5.1.2: Create QA Methodology Document (0.4h)
- Subtask 5.1.2a: Write TEA testing philosophy section
- Subtask 5.1.2b: Write test case generation strategy (how QA creates new tests)
- Subtask 5.1.2c: Write coverage targets per module (core 95%, sync 90%, flex 75%)

#### Task 5.1.3: Design Common Bugs Catalog Structure (0.3h)
- Subtask 5.1.3a: Design schema for common-bugs.md (bug-type, symptom, root-cause, fix, example)
- Subtask 5.1.3b: Create 3 example bug entries from Linkright history

---

### Story 5.2: Populate All 5 KB Files (4h)

**Narrative:** As QA engineer, I need to populate the TEA knowledge base with patterns, checklists, and targets so modules have actionable testing guidance.

#### Task 5.2.1: Populate testing-patterns.csv (1h)
- Subtask 5.2.1a: Add 20+ testing patterns with full details
  - Golden-path: "happy path with valid inputs"
  - Edge-case: "boundary values, empty inputs"
  - Error-recovery: "graceful degradation, fallbacks"
  - Concurrency: "race conditions, deadlocks" (if applicable)
  - Performance: "response time under load"
  - Security: "auth bypass, SQL injection" (if applicable)
- Subtask 5.2.1b: Cross-reference patterns to modules (which patterns apply to sync/flex/core)
- Subtask 5.2.1c: Add 5+ examples per pattern

#### Task 5.2.2: Populate qa-checklists.yaml (1.5h)
- Subtask 5.2.2a: Create module-specific checklists
  - sync-module: 15+ checklist items (JD parsing, signal retrieval, scoring)
  - flex-module: 10+ checklist items (content generation, engagement)
  - core-module: 20+ checklist items (orchestration, state management)
  - tea-module: 10+ checklist items (test execution, reporting)
- Subtask 5.2.2b: Create phase-specific checklists
  - Pre-release: Core functionality tests
  - Pre-deployment: Performance + integration tests
  - Post-release: Monitoring + alerting
- Subtask 5.2.2c: Format as YAML (valid syntax, all fields present)

#### Task 5.2.3: Populate qa-targets.yaml (0.75h)
- Subtask 5.2.3a: Set test coverage targets per module
  - core: 95% (infrastructure critical)
  - sync: 90% (core feature, high trust)
  - flex: 75% (creative/variable workflows)
  - tea: 80% (QA itself must be tested)
- Subtask 5.2.3b: Set performance targets per module
  - core operations: <100ms
  - sync workflows: <5s per step
  - flex content generation: <2s
- Subtask 5.2.3c: Set uptime/reliability targets (99.9% for core)

#### Task 5.2.4: Populate common-bugs.md (0.75h)
- Subtask 5.2.4a: Document 20+ bug patterns from Linkright history
  - Type: "Off-by-one in metric calculation"
    - Symptom: "Score is always 1 point lower than expected"
    - Root-cause: "Loop uses <= instead of <"
    - Fix: "Change loop condition to <"
    - Example: "jd-optimize phase F scoring bug"
  - (19 more patterns)
- Subtask 5.2.4b: Categorize by module + seniority (easy to find relevant patterns)
- Subtask 5.2.4c: Include test case that would catch each bug

---

### Story 5.3: Validate & Integrate (1h)

**Narrative:** As QA lead, I need to validate that TEA KB is complete and useful, and that it's properly integrated into Linkright workflows.

#### Task 5.3.1: Validate All Files (0.5h)
- Subtask 5.3.1a: Validate testing-patterns.csv (20+ rows, no duplicates, all columns present)
- Subtask 5.3.1b: Validate qa-checklists.yaml (valid YAML, all modules present)
- Subtask 5.3.1c: Validate qa-targets.yaml (realistic targets, all modules covered)
- Subtask 5.3.1d: Validate common-bugs.md (20+ patterns, clear format)

#### Task 5.3.2: Document KB Usage (0.25h)
- Subtask 5.3.2a: Add comments to each file explaining how to use it
- Subtask 5.3.2b: Create README in tea/data/ with overview

#### Task 5.3.3: Wire KB into Workflows (0.25h)
- Subtask 5.3.3a: Add references to testing-patterns in TEA step files
- Subtask 5.3.3b: Add references to qa-checklists in release workflows
- Subtask 5.3.3c: Verify at least 5 workflows reference the KB

---

## P1-6: Quality Gates for All 17+ Workflows (6h)

### Story 6.1: Design Gate System (1h)

**Narrative:** As architect, I need to design the 3-tier quality gate system so that all workflows have consistent validation.

#### Task 6.1.1: Design Pre-Gate Template (0.3h)
- Subtask 6.1.1a: Define pre-gate purpose: "Validate inputs before step runs"
- Subtask 6.1.1b: Create bash script template for pre-gate
  - Check: input files exist (non-empty)
  - Check: input schema valid (JSON/CSV syntax)
  - Check: required fields present
  - Action on failure: BLOCK step execution
- Subtask 6.1.1c: Define success exit code (0) vs failure (1)

#### Task 6.1.2: Design Post-Gate Template (0.3h)
- Subtask 6.1.2a: Define post-gate purpose: "Validate outputs after step completes"
- Subtask 6.1.2b: Create bash script template
  - Check: output schema matches expected (fields, types)
  - Check: output metrics meet targets (success criteria)
  - Action on failure: WARN (don't block, but flag)
- Subtask 6.1.2c: Define success exit code (0) vs warning (2)

#### Task 6.1.3: Design Fail-Gate Template (0.2h)
- Subtask 6.1.3a: Define fail-gate purpose: "Define recovery when gates fail"
- Subtask 6.1.3b: Create bash script template
  - Action options: ROLLBACK, SKIP_STEP, MANUAL_INTERVENTION
  - Logging: detailed error + recovery action taken
- Subtask 6.1.3c: Document decision criteria (which action for which failure type)

#### Task 6.1.4: Document Gate Failure Conditions (0.2h)
- Subtask 6.1.4a: List common pre-gate failures (missing input, bad schema)
- Subtask 6.1.4b: List common post-gate failures (output metrics below target)
- Subtask 6.1.4c: Define threshold for each metric (when to warn vs fail)

---

### Story 6.2: Implement Gates for All Workflows (4h)

**Narrative:** As engineer, I need to implement pre/post/fail gates for all workflows so that quality is enforced at runtime.

#### Task 6.2.1: Implement Gates for Sync Module (1.25h)
- Subtask 6.2.1a: jd-optimize workflow
  - Create pre-gate for phase C (input validation)
  - Create post-gate for phase M (final score validation)
  - Create fail-gate (define recovery strategy)
  - Test gates with valid + invalid inputs
- Subtask 6.2.1b: outbound-campaign workflow (similar)
- Subtask 6.2.1c: signal-capture workflow (similar)
- Subtask 6.2.1d: (2 more sync workflows)

#### Task 6.2.2: Implement Gates for Core Module (1h)
- Subtask 6.2.2a: party-mode workflow
- Subtask 6.2.2b: brainstorming workflow
- (Subtasks for 3 more core workflows)

#### Task 6.2.3: Implement Gates for Flex/Squick/Tea/CIS (1.25h)
- Subtask 6.2.3a: flex (content-automation workflow)
- Subtask 6.2.3b: squick (4 workflows: 1-analysis, 2-plan, 3-solutioning, 4-implementation)
- Subtask 6.2.3c: tea (resume-validation workflow)
- Subtask 6.2.3d: cis (narrative-craft workflow)

#### Task 6.2.4: Create Gate Files Directory Structure (0.25h)
- Subtask 6.2.4a: Ensure all workflows have steps/[step-name]/pre-gate.sh
- Subtask 6.2.4b: Ensure all workflows have steps/[step-name]/post-gate.sh
- Subtask 6.2.4c: Ensure all workflows have steps/[step-name]/fail-gate.sh

#### Task 6.2.5: Make All Gate Scripts Executable (0.25h)
- Subtask 6.2.5a: chmod +x on all pre-gate.sh files
- Subtask 6.2.5b: chmod +x on all post-gate.sh files
- Subtask 6.2.5c: chmod +x on all fail-gate.sh files
- Subtask 6.2.5d: Verify all scripts are executable (ls -la check)

---

### Story 6.3: Test & Validate Gates (1h)

**Narrative:** As QA, I need to test the gate system to ensure gates catch failures and don't break normal workflows.

#### Task 6.3.1: Test Pre-Gates (0.3h)
- Subtask 6.3.1a: Run pre-gate with valid inputs (should PASS)
- Subtask 6.3.1b: Run pre-gate with missing inputs (should FAIL)
- Subtask 6.3.1c: Run pre-gate with malformed inputs (should FAIL)
- Subtask 6.3.1d: Verify gate doesn't block valid data

#### Task 6.3.2: Test Post-Gates (0.3h)
- Subtask 6.3.2a: Run post-gate with valid outputs (should PASS)
- Subtask 6.3.2b: Run post-gate with incomplete outputs (should WARN)
- Subtask 6.3.2c: Run post-gate with metrics below target (should WARN)
- Subtask 6.3.2d: Verify gate logs warnings without blocking

#### Task 6.3.3: Test Fail-Gates (0.2h)
- Subtask 6.3.3a: Trigger pre-gate failure, verify fail-gate handles it
- Subtask 6.3.3b: Trigger post-gate warning, verify recovery action
- Subtask 6.3.3c: Test different recovery actions (ROLLBACK, SKIP, MANUAL)

#### Task 6.3.4: Integration Test (0.2h)
- Subtask 6.3.4a: Run complete workflow with all gates enabled
- Subtask 6.3.4b: Verify gates don't slow down execution significantly (<100ms overhead)
- Subtask 6.3.4c: Verify gate logs are clear and actionable

---

## P1-7: Template Variable Consistency (3h) — **BLOCKED BY P1-1**

### Story 7.1: Map & Plan Standardization (0.5h)

#### Task 7.1.1: Find All Variable Usage Patterns (0.25h)
- Subtask 7.1.1a: Scan all 400+ step files for variables
- Subtask 7.1.1b: Count usage of {{VAR}} vs ${VAR} vs $VAR
- Subtask 7.1.1c: Document which modules use which format

#### Task 7.1.2: Design Bulk Replacement Scripts (0.25h)
- Subtask 7.1.2a: Create sed script: ${VAR} → {{VAR}}
- Subtask 7.1.2b: Create sed script: $VAR → {{VAR}}
- Subtask 7.1.2c: Test scripts on 10 sample files (manual verification)

---

### Story 7.2: Execute Standardization (2h)

#### Task 7.2.1: Replace ${VAR} Format (0.5h)
- Subtask 7.2.1a: Run sed script across all step files
- Subtask 7.2.1b: Verify no formatting errors
- Subtask 7.2.1c: Spot-check 10 files manually

#### Task 7.2.2: Replace $VAR Format (0.5h)
- Similar subtasks

#### Task 7.2.3: Cleanup & Verification (1h)
- Subtask 7.2.3a: Scan for any remaining ${ or $ followed by alphabetic (manual patterns)
- Subtask 7.2.3b: Verify all step files still parse correctly (YAML/Markdown syntax)
- Subtask 7.2.3c: Run git diff to review all changes before commit

---

## Total Beads Issues to Create

**P1-1:** 1 feature + 3 stories + 12 tasks + 25 subtasks = **41 issues**
**P1-5:** 1 feature + 3 stories + 12 tasks + 0 subtasks = **16 issues**
**P1-6:** 1 feature + 3 stories + 12 tasks + 0 subtasks = **16 issues**
**P1-7:** 1 feature + 2 stories + 5 tasks + 0 subtasks = **8 issues**

**GRAND TOTAL: ~81 Beads issues**

---

## Dependency Graph

```
P1-1 (Atomicity)
  ├─ Story 1.1 (Analysis) → Story 1.2 (Execution) → Story 1.3 (Testing)
  │   └─ All tasks must complete in order within story
  │
  └─ P1-7 (Template Variables) DEPENDS ON THIS

P1-5 (TEA KB)
  ├─ Story 5.1 (Design) → Story 5.2 (Population) → Story 5.3 (Validation)
  │   └─ All tasks can run in parallel within a story
  │
  └─ No dependencies

P1-6 (Quality Gates)
  ├─ Story 6.1 (Design) → Story 6.2 (Implementation) → Story 6.3 (Testing)
  │   └─ All tasks can run in parallel within a story
  │
  └─ No dependencies

P1-7 (Template Variables) — BLOCKED
  ├─ DEPENDS ON: P1-1 (all subtasks of Story 1.2 must complete)
  └─ Story 7.1 (Planning) → Story 7.2 (Execution)
```

