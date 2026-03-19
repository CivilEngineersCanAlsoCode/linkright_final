# Final Architectural Solutions: Linkright B-MAD Alignment

**Architects:** BrightTower (B-MAD) + CloudyCave (Linkright)
**Date:** 2026-03-09
**Status:** ✅ APPROVED FOR PHASE 3-4 EXECUTION

---

## Executive Summary

**Agreement:** All P0 and P1 solutions are APPROVED for implementation with documented adaptations. P2 enhancements deferred to post-Release-4 phase.

**Implementation Timeline:** 2-3 weeks intensive (29 hours P0 + 40 hours P1 = 69 hours total)

**Success Criterion:** Linkright achieves B-MAD parity while maintaining unique advantages (Beads, ChromaDB, Agent Mail).

**Critical Path:** P0 must complete before Release 4 ships. P1 can proceed in parallel with P0 but should complete before Phase 4 (engineer execution).

---

## Part 1: Agreed Solutions (P0) — Critical Blocking Fixes

**These MUST be completed before Release 4 ships.**

### P0-1: Populate workflow-manifest.csv ✅

**What:** Create comprehensive registry of all 17 Linkright workflows

**How:**
- File: `/Users/satvikjain/Downloads/sync/context/linkright/_lr/_config/workflow-manifest.csv`
- Schema: workflow_name, module, file_path, type, phase_coverage, step_count, description, **status** (added)
- Rows: 17 (all existing workflows)
- Status column values: "active" (fully implemented) or "stub" (skeleton)

**Adaptation Applied:**
- Added `status` column to distinguish complete vs partial workflows
- Allows users to filter manifest by implementation level

**Success Criteria:**
- ✅ All 17 workflows listed
- ✅ No duplicate entries
- ✅ All file_path values exist and are readable
- ✅ phase_coverage matches actual implementation (c|e|v)
- ✅ step_count matches directory scan
- ✅ Validation script runs without errors

**Assigned to:** Engineer 2 (Hephaestus)
**Time estimate:** 2 hours
**Beads epic:** sync-qm-p0-1 (Quality Mission - P0-1)

---

### P0-2: Delete/Populate Zero-Byte Files ✅

**What:** Eliminate 8 zero-byte files, populate critical configs

**How:**

**Delete these stub files** (will be recreated properly in P1):
```bash
rm -f context/linkright/_lr/core/config/flex-workflow-twitter.md
rm -f context/linkright/_lr/core/config/flex-workflow-linkedin.md
rm -f context/linkright/_lr/core/config/flex-workflow-instagram.md
rm -f context/linkright/_lr/core/config/squick-workflow-release.md
rm -f context/linkright/_lr/core/config/squick-workflow-qa.md
rm -f context/linkright/_lr/core/config/tea-kb-testing-patterns.md
```

**Populate these config files:**

File: `context/linkright/_lr/core/config/mongodb-config.yaml`
```yaml
database:
  name: "linkright-signals"
  host: "${MONGODB_HOST:-mongodb://localhost:27017}"
  fallback_mode: "memory"  # Use in-memory if unavailable

collections:
  career_signals:
    indexes:
      - field: "user_id"
      - field: "signal_type"

  workflow_history:
    ttl: 86400  # 24h retention
```

File: `context/linkright/_lr/core/config/chromadb-config.yaml`
```yaml
database:
  name: "linkright-patterns"
  host: "${CHROMADB_HOST:-http://localhost:8000}"
  fallback_mode: "file-based"  # Use local client library if HTTP fails

collections:
  - name: "career-patterns"
    embedding_model: "default"
  - name: "optimization-results"
    embedding_model: "default"
  - name: "qa-patterns"
    embedding_model: "default"
```

**Adaptation Applied:**
- Added environment variable support (`${VAR:-default}`)
- Added fallback modes for offline scenarios
- Supports Docker, cloud deployment, local dev

**Success Criteria:**
- ✅ All 8 zero-byte files deleted or populated
- ✅ No zero-byte files remain in system
- ✅ YAML files are valid syntax
- ✅ Agent activation step 2 (config load) succeeds
- ✅ Manifest validation passes

**Assigned to:** Engineer 1 (ChartreuseSpring)
**Time estimate:** 1 hour
**Beads epic:** sync-qm-p0-2

---

### P0-3: Evidence Collection Pattern for Beads ✅

**What:** Implement mandatory evidence capture for all closed Beads issues

**How:**

**Step 1: Add to all step file templates**

Every step-[N]-[name].md gets new section:

```markdown
## EVIDENCE COLLECTION & CHECKPOINT

When closing this step via Beads, provide evidence and save the checkpoint metadata:

bd update <step-id> --notes="
EVIDENCE:
- Input: [describe input verification]
- Operation: [what was done in this step]
- Output: [where output file(s) stored]
- Metrics: [success metrics satisfied: list them]
- Files modified: [list file paths]
- Test results: [if applicable, paste results]

CHECKPOINT:
  last_completed_step: [current-step-id]
" \
--set-metadata last_completed_step=[current-step-id] \
--set-metadata session_variables='[JSON_STRING]'
```

**Step 2: Add pre-commit hook to enforce mandatory evidence**

File: `.agents/workflows/verify-beads-evidence.sh`

```bash
#!/bin/bash
# Enforce EVIDENCE in bd close calls

if [[ "$*" == *"bd close"* ]]; then
  if ! grep -q "EVIDENCE:" <<< "$*"; then
    echo "❌ ERROR: bd close requires EVIDENCE section"
    echo "Usage: bd update <id> --notes='EVIDENCE: [details]' && bd close <id>"
    exit 1
  fi
fi

exit 0
```

Add to Beads config to run on all close operations.

**Step 3: Document evidence template in CLAUDE.md**

Add section explaining evidence requirement + examples.

**Adaptation Applied:**
- Made evidence MANDATORY (not optional)
- Automated enforcement via hook
- Clear, consistent template

**Success Criteria:**
- ✅ All step files have EVIDENCE COLLECTION section
- ✅ Pre-commit hook prevents bd close without evidence
- ✅ Documentation clarifies evidence expectations
- ✅ Past 173 closed issues remain unchanged (historical record)
- ✅ All future closes include evidence

**Assigned to:** Engineer 2 (Hephaestus)
**Time estimate:** 3 hours (hook + template + testing)
**Beads epic:** sync-qm-p0-3

---

### P0-4: Beads-Wired Workflow Pattern ✅

**What:** Implement step-01b-resume.md in all 17 workflows with Beads integration

**How:**

**Template file** (same for all workflows, parametrized):

File: `[module]/workflows/[workflow]/steps/step-01b-resume-if-interrupted.md`

```markdown
---
stepNumber: "01b"
title: "Resume Interrupted Session"
phase: "c"
depends_on: "Beads epic must exist"
---

# Step 01b: Resume Interrupted Session

**ONE SENTENCE:** Check Beads for interrupted workflow and resume or start fresh.

## MANDATORY EXECUTION RULES

- 🛑 NEVER start fresh if session in progress
- ✅ ALWAYS check Beads first
- 💾 Load previous state from Beads if resuming
- 📋 YOU ARE RESUMING, not initializing new

## INPUT

- Workflow epic ID: `[WORKFLOW-EPIC-ID]`
- Workflow name: `[workflow-name]`
- User decision: continue or fresh start

## PROCESSING

### 1. Check for Existing Beads Issue

```bash
bd list --status=in_progress \
  --parent=[WORKFLOW-EPIC-ID] \
  --query="[workflow-name]" \
  --limit=1
```

**If issue found:**
- Display: issue ID, title, completed steps, last update time
- Ask user: "Continue this session [1] or start fresh [2]?"

**If user [1] - Continue:**
- Load: `bd show <issue-id>` to get metadata
- Extract: `last_completed_step` from metadata
- Load: `step-[N+1]-[name].md` (next step)
- Load: `session_state` from metadata (context variables)
- Proceed with next step

**If user [2] - Start Fresh:**
- Create new Beads feature (in step-01-setup.md)
- Load: `step-01-session-setup.md`
- Fresh initialization

**If no issue found:**
- Load: `step-01-session-setup.md`
- Fresh initialization

## OUTPUT

- Decision: continue existing or start fresh
- Session state loaded (if continuing)
- Next step file loaded and ready

## DEPENDENCIES

- Depends on: Beads epic exists + `bd list` works
- Blocks: All subsequent steps

## SUCCESS METRICS

✅ Correctly identified if issue exists
✅ Retrieved metadata from Beads
✅ User confirmed continue or fresh
✅ Loaded correct next step

## FAILURE ANTI-METRICS

❌ Beads list command failed
❌ No decision from user
❌ Step file failed to load

## NEXT STEPS

- If continuing: Load `step-[N+1]`
- If fresh: Load `step-01-setup`
- If error: Load error recovery
```

**Per-Workflow Customization:**

Create this file for each workflow, substituting:
- `[WORKFLOW-EPIC-ID]`: Epic created in Phase 3
- `[workflow-name]`: sync-jd-opt, flex-content, squick-sprint, etc.
- `[N+1]`: Next step number

**Adaptation Applied:**
- Templates are identical (DRY principle)
- Only parameter substitution changes
- Ensures consistency across all 17 workflows

**Success Criteria:**
- ✅ All 17 workflows have step-01b-resume file
- ✅ Each has correct epic ID and workflow name
- ✅ `bd list --parent=[EPIC-ID]` finds active issues
- ✅ Session state correctly loads on resume
- ✅ Tests confirm resume from various step points

**Assigned to:** Engineer 1 (ChartreuseSpring)
**Time estimate:** 4 hours (template + 17 customizations + testing)
**Beads epic:** sync-qm-p0-4

---

### P0-5: Implement Phases D-M Step Files ⚠️ DEFERRED

**Status:** Awaiting clarification from Satvik

**Blockers:**
- Release_4.md references phases D-M but doesn't specify them
- Need: What does phase D accomplish? Which workflows?
- Need: Phase input/output contracts
- Need: Rough step decompositions per phase

**Question for Satvik:**
"Phases D through M (12 phases total) are mentioned in Release_4.md but not detailed. Before Phase 4 engineers start, can you clarify:
- Phase D (Persona Scoring): what workflows, what are expected outputs?
- Phase E (Signal Retrieval): similar details
- ... through Phase M

Once clarified, engineers can decompose into 40+ atomic step files following the atomicity standard."

**Timeline:** Awaits human decision → Can start Phase 4 only after clarification

**Placeholder for Phase 3 PM:**
```bash
# Create epic for Phases D-M
bd create --type=epic \
  --title="Phases D-M: [Phase descriptions from Satvik]" \
  --parent=sync-release-4-epic \
  --status=blocked \
  --blocked_by="satvik-phase-d-m-clarification"
```

---

## Part 2: Agreed Solutions (P1) — Design-Level Improvements

**These should complete in parallel with P0, before Phase 4 engineer handoff.**

### P1-1: Atomicity Standard + Refactoring ✅

**What:** Define "atomic step" and refactor 14 violations into 25+ atomic steps

**Standard Definition:**

An atomic step performs exactly ONE cognitive operation producing clear, verifiable output that's independent of subsequent steps.

**Test:** Can you split this into two independent steps without losing logic? If yes, it's non-atomic.

**Template:** All atomic steps follow this structure:

```markdown
---
stepNumber: N
title: "[Specific, single-operation description]"
phase: "c|e|v"
depends_on: "[step-(N-1)]"
---

# Step [N]: [Title]

**ONE SENTENCE:** What this step does

## MANDATORY EXECUTION RULES

- 🛑 NEVER do multiple operations
- ✅ ALWAYS validate input before processing

## INPUT

[What this step receives]

## PROCESSING

[ONE operation only - no branching]

## OUTPUT

[Clear, verifiable result]

## SUCCESS METRICS

✅ [Specific criterion 1]
✅ [Specific criterion 2]
✅ [Specific criterion 3]

## FAILURE ANTI-METRICS

❌ [Failure condition 1]
❌ [Failure condition 2]
```

**Refactoring 14 Violations:**

| Step | Issue | Split Into | Time |
|---|---|---|---|
| sync/step-03e-parse-and-optimize | Parse + Optimize | 2 steps | 0.5h |
| sync/step-04e-review-edit-finalize | 3 ops | 3 steps | 1h |
| flex/step-02e-generate-and-organize | 2 ops | 2 steps | 0.5h |
| ... (11 more) | | | 5.5h |

**Adaptation Applied:**
- Added output schema validation between steps
- State handoff documented (input/output schemas)
- Maintains backward-compatibility (old steps can still work)

**Success Criteria:**
- ✅ All 14 violations refactored
- ✅ No multi-op steps remain
- ✅ New 25+ atomic steps created
- ✅ Output schemas defined
- ✅ Tests pass for each refactored step

**Assigned to:** Engineer 1 (ChartreuseSpring) - odd epics
**Time estimate:** 8 hours (refactor + schema definition + testing)
**Beads epic:** sync-qm-p1-1

---

### P1-2: ADR Creation ✅

**What:** Document 9 major architectural decisions

**Decisions to Document:**
1. ADR-001: Beads for Task Persistence (vs alternatives)
2. ADR-002: ChromaDB for Semantic Memory (vs file-based)
3. ADR-003: Agent Mail for Multi-Agent Coordination
4. ADR-004: MongoDB for Career Signals (vs flat files)
5. ADR-005: Unified IDE Manifest (vs per-IDE duplication)
6. ADR-006: Atomic Steps (vs monolithic workflows)
7. ADR-007: 3-Phase Workflow Structure (c/e/v)
8. ADR-008: JIT Loading (vs preload)
9. ADR-009: Beads-Aware Workflows (vs plain resumption)

**Template:** (Honest about decision rationale)

```markdown
# ADR-001: Beads for Task Persistence

**Status:** Accepted

**Decision Maker:** Satvik (single-user, prefers Git-backed tools)

**Context:**
Need persistent task tracking across agent sessions, multi-day workflows, dependency management.

**Decision:**
Use Beads (Dolt-backed, GitHub-style task tracking) for workflow state.

**Alternatives Considered:**
1. Pure file-based state (YAML in output folder)
   - Pro: Simple, no external dependency
   - Con: No dependency tracking, no multi-agent coordination

2. Redis (in-memory, fast)
   - Pro: Performance
   - Con: Volatile, requires setup, loses history

3. Database (PostgreSQL, etc.)
   - Pro: Structured, ACID
   - Con: Heavyweight, licensing complexity

**Rationale:**
Satvik prefers Git-backed tooling (Beads ↔ Dolt). Beads provides dependency tracking + Git audit trail. Aligns with Satvik's workflow.

**Consequences:**
+ Clear task dependencies (can block/unblock)
+ Git audit trail
+ Multi-agent coordination possible
+ Persistent state across days/weeks
- Added complexity (Dolt setup)
- Learning curve for Beads commands

**Decision Maker Notes:**
This is a subjective choice reflecting Satvik's tool preferences, not an objective "best" solution.
```

**Adaptation Applied:**
- ADRs include "Decision Maker" field (honest attribution)
- Acknowledges subjective decisions vs. objective ones
- No pretense of perfect evaluation

**Success Criteria:**
- ✅ All 9 ADRs written and complete
- ✅ Context clear for each decision
- ✅ Alternatives considered for each
- ✅ Consequences documented
- ✅ Files in `/context/linkright/docs/adrs/`

**Assigned to:** Engineer 2 (Hephaestus)
**Time estimate:** 4 hours (1 hour per ADR, minimal research)
**Beads epic:** sync-qm-p1-2

---

### P1-3: Agent XML Expansion to 40+ Lines ✅

**What:** Expand 7 FLEX agents from 30-35 lines to 40+

**Agents:**
- flex-content-creator (35→45 lines)
- flex-amplifier (32→42 lines)
- flex-monitor (36→46 lines)
- flex-scheduler (28→40 lines)
- flex-analytics (31→42 lines)
- flex-brand-manager (38→48 lines)
- squick-infra-engineer (35→45 lines)

**Quality Metrics** (not arbitrary line count):
- ✅ Complete <agent> block with all subsections
- ✅ 8+ activation steps with condition checks
- ✅ 4+ menu items with distinct workflows
- ✅ Rich persona section (role, identity, communication_style, principles)
- ✅ 4+ rules with nuance

**Template:** (Minimum viable 40-line agent)

See bmad-proposals.md Special Section B for exact template.

**Adaptation Applied:**
- Flexible minimum (35-40 lines) with quality-based verification
- Not arbitrary line count, but substantive depth
- Allows truly minimal agents if they meet quality bar

**Success Criteria:**
- ✅ All 7 agents 40+ lines (or 35+ with quality verification)
- ✅ All have complete XML structure
- ✅ All have rich persona descriptions
- ✅ All have 4+ meaningful menu items
- ✅ All have 4+ rules

**Assigned to:** Engineer 1 (ChartreuseSpring)
**Time estimate:** 3 hours (20-30 min per agent)
**Beads epic:** sync-qm-p1-3

---

### P1-4: Manifest Cross-Reference Validation ✅

**What:** Audit and repair all 5 CSV manifests for broken references

**Manifests:**
1. agent-manifest.csv (29 agents)
2. workflow-manifest.csv (17 workflows)
3. task-manifest.csv (12 tasks)
4. files-manifest.csv (526 files)
5. lr-help.csv (34 help topics)

**Validation Script:**

File: `scripts/validate-manifests.sh`

```bash
#!/bin/bash

for manifest in agent-manifest.csv workflow-manifest.csv task-manifest.csv; do
  echo "Validating $manifest..."

  # Check for duplicates
  awk -F, '{print $1}' "$manifest" | tail -n +2 | sort | uniq -d | while read dup; do
    echo "❌ Duplicate: $dup"
  done

  # Check for broken references
  awk -F, '{print $3}' "$manifest" | tail -n +2 | while read path; do
    full_path="{project-root}/$path"
    if [ ! -f "$full_path" ]; then
      echo "❌ Missing: $path"
    elif [ ! -s "$full_path" ]; then
      echo "❌ Zero-byte: $path"
    fi
  done
done

echo "✅ Manifest validation complete"
```

Run during Phase 4 as part of engineer checklist.

**Success Criteria:**
- ✅ No duplicate entries in any manifest
- ✅ All file_path references exist and are readable
- ✅ No zero-byte files referenced
- ✅ Validation script runs without errors
- ✅ CI/CD includes manifest validation pre-release

**Assigned to:** Engineer 2 (Hephaestus)
**Time estimate:** 2 hours (script + testing)
**Beads epic:** sync-qm-p1-4

---

### P1-5: TEA Knowledge Base Population ✅

**What:** Create TEA module knowledge base (currently empty)

**Files to Create:**

File: `tea/data/testing-patterns.csv`
```
pattern_name,description,applicability,example
golden-path,Happy path testing,all_modules,"test jd-optimize with standard resume"
edge-case,Boundary testing,sync,"test with empty resume, single-bullet resume"
error-recovery,Failure handling,all_modules,"test error messages, recovery options"
...
```

File: `tea/data/qa-checklists.yaml`
```yaml
checklists:
  sync-module:
    pre-release:
      - "Run 10 sample resumes through jd-optimize"
      - "Verify all bullet points fit within 80 chars"
      - "Check output against template schema"
      - "Validate metadata completeness"

  flex-module:
    pre-release:
      - "Generate 5 Twitter threads"
      - "Verify thread coherence"
      - "Check character limits per tweet"
```

File: `tea/data/qa-targets.yaml`
```yaml
modules:
  core:
    test_coverage: "95%"
    performance: "<100ms per operation"

  sync:
    test_coverage: "90%"
    performance: "<5s per workflow step"

  flex:
    test_coverage: "75%"  # Creative workflows, lower bar
    performance: "<2s per operation"
```

File: `tea/data/common-bugs.md`
- Document 20+ bug patterns from Linkright history
- Include: bug type, symptom, root cause, fix

File: `tea/data/qa-methodology.md`
- TEA approach to testing Linkright
- Testing philosophy
- Test case generation strategy
- Coverage targets per module

**Adaptation Applied:**
- Satvik provides initial targets + patterns
- TEA agents populate KB with domain knowledge
- Knowledge base is editable (can grow over time)

**Success Criteria:**
- ✅ All 5 KB files created + populated
- ✅ TEA steps can reference KB files
- ✅ At least 20+ testing patterns documented
- ✅ Module-specific QA targets set
- ✅ Common bugs catalog populated

**Assigned to:** Engineer 2 (Hephaestus)
**Time estimate:** 6 hours (research + documentation)
**Beads epic:** sync-qm-p1-5

---

### P1-6: Quality Gates for All Workflows ✅

**What:** Implement pre/post execution validation gates in all 17 workflows

**Three-Tier Gate System:**

**Pre-Gate** (before step runs):
- Validates inputs exist and are well-formed
- Blocks step if inputs invalid

**Post-Gate** (after step completes):
- Validates outputs match expected schema
- Warns (doesn't block) if metrics below target

**Fail-Gate** (if gates fail):
- Defines recovery action (rollback, skip, manual intervention)

**Template:** (bash scripts per step)

File: `[module]/workflows/[workflow]/steps/step-[N]-[name]/pre-gate.sh`
File: `[module]/workflows/[workflow]/steps/step-[N]-[name]/post-gate.sh`

**Example for jd-optimize:**

```bash
# pre-gate.sh
if [ ! -f "$INPUT_RESUME" ]; then exit 1; fi
if [ ! -f "$INPUT_JD" ]; then exit 1; fi
echo "✅ Pre-gate passed"
```

```bash
# post-gate.sh
if [ ! -f "$OUTPUT_FILE" ]; then exit 1; fi
SECTION_COUNT=$(grep -c "^##" "$OUTPUT_FILE" || echo 0)
if [ $SECTION_COUNT -lt 5 ]; then echo "⚠️ WARNING: Low section count"; fi
echo "✅ Post-gate passed"
```

**Adaptation Applied:**
- Conservative gates (avoid false positives)
- Support "warning" level in addition to "error"
- Adjustable post-release based on real-world results

**Success Criteria:**
- ✅ All 17 workflows have pre-gate + post-gate scripts
- ✅ Pre-gates block invalid inputs (error)
- ✅ Post-gates warn on quality issues (warning)
- ✅ Fail-gates define recovery action
- ✅ Tests verify gates catch real errors

**Assigned to:** Engineer 2 (Hephaestus)
**Time estimate:** 4 hours (design + script templates + testing)
**Beads epic:** sync-qm-p1-6

---

### P1-7: Template Variable Standardization ✅

**What:** Standardize variable syntax across all step files (fix 13 inconsistencies)

**Current State:**
- `{{VAR}}` — B-MAD standard (Jinja2)
- `${VAR}` — Shell style (9 files)
- `$VAR` — Shorthand (4 files)

**Standard:** `{{VAR}}` (B-MAD compatible)

**Find and Replace:**

```bash
find . -name "*.md" -type f -exec \
  sed -i 's/\${VAR}/{{VAR}}/g; s/\$VAR/{{VAR}}/g' {} \;
```

Manual review for edge cases (variables in code blocks, etc.).

**Success Criteria:**
- ✅ All step files use `{{VAR}}` only
- ✅ No `${VAR}` or `$VAR` remain (except in literal examples)
- ✅ Template rendering works correctly
- ✅ Variable resolution unchanged

**Assigned to:** Engineer 1 (ChartreuseSpring)
**Time estimate:** 2 hours (find-replace + testing)
**Beads epic:** sync-qm-p1-7

---

## Part 3: Enhancement Roadmap (P2) — Post-Release-4 Vision

**These are high-value but deferred to Phase 5+ (after Release 4 ships).**

### P2-1: ChromaDB-Powered Step Context

Load semantic history into steps to inform optimization.

**Estimated effort:** 8 hours | **Payoff:** 30% faster optimization

### P2-2: Agent Mail Handoffs in Workflows

Steps hand off work between specialized agents asynchronously.

**Estimated effort:** 6 hours | **Payoff:** Parallel workflows, clearer agent boundaries

### P2-3: Session Resumption via Beads (Not Files)

Workflows resume by querying Beads issue status, single source of truth.

**Estimated effort:** 4 hours | **Payoff:** Eliminates dual state (Beads + file)

### P2-4: Automated CI Quality Gates

Pre/post gates enforced via CI/CD, impossible to pass bad data.

**Estimated effort:** 6 hours | **Payoff:** Guaranteed quality, no manual enforcement

### P2-5: Smart Retry + Exponential Backoff

Failed steps auto-retry with jittered backoff.

**Estimated effort:** 3 hours | **Payoff:** Handles transients automatically

### P2-6: Parallel Step Execution (DAG-Aware)

Non-blocking steps run in parallel using Beads dependencies.

**Estimated effort:** 8 hours | **Payoff:** 40% faster workflow execution

---

## Part 4: Rejected Proposals & Rationale

**None.** All B-MAD proposals are compatible with Linkright.

---

## Part 5: Open Questions for Satvik

**Critical:** These must be answered before Phase 4 starts.

### Q1: Phases D-M Specification

**Question:**
Phases D through M are mentioned in Release_4.md but not detailed. What does each phase accomplish?

**Impact:**
Blocks P0-5 and all Phase 4 engineer work. Cannot create step files without knowing phase purpose.

**Required answer:**
For each of Phases D through M:
- Name/description (1-2 sentences)
- Input/output (what starts phase, what ends phase)
- Associated workflows (3-5 workflows per phase)
- Rough step count (5-20 steps per workflow)

### Q2: TEA QA Targets

**Question:**
What are your quality targets per module?

**Options:**
- Coverage %: Core (95%) | Sync (90%) | Flex (75%)?
- Performance: Latency targets per step?
- Completeness: Required test case categories?

**Impact:**
Informs P1-5 (TEA KB population) and P1-6 (quality gates)

### Q3: Gate Thresholds

**Question:**
What constitutes "good" output for each workflow?

**Examples:**
- Resume optimization: minimum bullets? max length per bullet?
- Portfolio: required sections? visual coherence score?
- Signals: required fields? data completeness %?

**Impact:**
Informs P1-6 (quality gates design)

---

## Implementation Timeline

**Phase 3 (Planning):** 1 day
- PM creates Beads hierarchy (63 issues)
- Epics + features + tasks + subtasks
- All dependencies wired
- Assigns epics to engineers

**Phase 4A (P0 execution):** 3 days
- Engineers work in parallel
- Total 29 hours across 2 engineers
- Completes before Release 4 ships

**Phase 4B (P1 execution):** 5 days
- Parallel with Phase 4A or sequential after
- Total 40 hours across 2 engineers
- Can defer non-critical P1 work to Phase 5

**Total Duration:** 2 weeks intensive (assuming full-time engineers)

---

## Success Metrics

**Release 4 Shipping Criteria:**

- ✅ All P0 gaps closed
- ✅ workflow-manifest.csv populated (17 rows)
- ✅ Zero zero-byte files
- ✅ Beads-aware step-01b in all 17 workflows
- ✅ Evidence collection enforced
- ✅ Tests passing
- ✅ Documentation updated

**Quality Metrics:**

- ✅ B-MAD parity achieved (atomicity, JIT loading, resumability)
- ✅ Linkright unique advantages maintained (Beads, ChromaDB, Agent Mail)
- ✅ 0 architectural regressions
- ✅ All P1 gaps designed (ready for execution)

---

## Conclusion

Linkright can achieve **B-MAD alignment AND exceed B-MAD capabilities** by:

1. **Adopting** 7 core B-MAD patterns (atomic steps, JIT loading, resumability, quality gates, etc.)
2. **Adapting** 2 patterns to Linkright domain (agents, configs)
3. **Inventing** 3 new patterns (ADRs, Beads wiring, ChromaDB integration)
4. **Amplifying** 3 Linkright-original advantages (Beads, ChromaDB, Agent Mail)

**Result:** Linkright Release 4 = B-MAD quality + career-ops domain specialization + enhanced coordination.

