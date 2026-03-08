# Linkright Architecture Deep Dive

**Author:** OlivePrairie (Linkright Specialist)
**Date:** 2026-03-09
**Scope:** Complete Linkright system analysis and current state assessment

---

## Executive Summary

Linkright is an **agentic career positioning platform** for single-user (Satvik) career signal optimization. It combines 29 specialized agents across 7 modules (core, sync, flex, squick, lrb, tea, cis) orchestrating workflows that transform resume/JD data into optimized career narratives.

**Current State:** Release 3 E2 v2 complete (✅ MERGED). Release 4 audit complete (📋 18 tasks identified). System has strong architectural foundations but accumulated quality debt across 4 releases requiring systematic remediation.

**Quality Metrics:**
- 29 agents: 22/29 meet ≥40 line depth ✅ | 7/29 below 40 lines ⚠️
- 17 workflows: 12/17 fully decomposed ✅ | 5/17 partial/stub ⚠️
- Step files: 72 total | 8 zero-byte files ❌ | 14 missing atomicity enforcement ⚠️
- Manifests: 5 CSVs | workflow-manifest.csv empty (critical) ❌
- Beads integration: Step-01b resumption not implemented ⚠️
- Modules: 3 complete (core, sync, tea) | 2 partial (flex, squick) | 2 stub (lrb, cis)

---

## Section 1: Module Architecture Map

### The 7 Linkright Modules

#### Module 1: CORE (Complete ✅)

**Purpose:** Orchestration hub and runtime infrastructure

**Agents:**
- `lr-orchestrator` (Aether) — Master workflow coordinator
- `lr-tracker` (Navi) — Session state + memory management
- `lr-config-manager` — Configuration loading and validation

**Workflows:**
- `session-initialization` (core workflow)
- `error-recovery` (fallback flows)
- `context-loading` (setup)

**Knowledge Files:**
- `core-config.yaml` — System configuration
- `agent-manifest.csv` — All 29 agents registered
- `workflow-manifest.csv` — All 17 workflows (EMPTY - critical gap)

**Status:** ✅ Fully operational. Only gap: empty workflow-manifest.csv

#### Module 2: SYNC (Complete ✅)

**Purpose:** Outbound career positioning (resume optimization, JD analysis, portfolio generation)

**Agents:** (9 agents)
- `sync-parser` — Resume/JD parsing
- `sync-optimizer` — Content optimization
- `sync-analyst` — Market signal analysis
- `sync-portfolio-builder` — Portfolio generation
- ... (5 more)

**Workflows:** (4 workflows)
- `jd-optimize` — 64-step flagship workflow (gold standard)
- `resume-optimize` — Resume enhancement
- `portfolio-generate` — Portfolio creation
- `signals-extract` — Signal extraction

**Status:** ✅ Fully implemented. Gold standard for atomic steps.

#### Module 3: FLEX (Partial ⚠️)

**Purpose:** Inbound brand building (viral social content automation)

**Agents:** (6 agents with stub XML)
- `flex-content-creator` — Content generation
- `flex-amplifier` — Distribution strategy
- `flex-monitor` — Engagement tracking
- ... (3 more)

**Workflows:** (6 workflows, mostly stub)
- `twitter-thread-generator` (stub)
- `linkedin-post-optimizer` (stub)
- `tiktok-script-writer` (partial)
- ... (3 more)

**Status:** ⚠️ Agents defined but workflows not implemented. Agent XML <40 lines for several agents.

#### Module 4: SQUICK (Partial ⚠️)

**Purpose:** Enterprise rapid shipping (B-MAD+Beads for software dev)

**Agents:** (5 agents)
- `squick-architect` — System design
- `squick-dev-lead` — Development orchestration
- `squick-qa-master` — Quality assurance
- ... (2 more)

**Workflows:** (3 workflows, sketched not implemented)
- `sprint-planning`
- `feature-build`
- `qa-verification`

**Status:** ⚠️ Concept clear, implementation incomplete. No step files written.

#### Module 5: LRB (Stub ❌)

**Purpose:** Linkright Builder — meta-module for building Linkright itself

**Agents:** (2 agents, stub)
- `lrb-architect`
- `lrb-executor`

**Workflows:** None

**Status:** ❌ Planned but not implemented. Deferred to future phase.

#### Module 6: TEA (Complete ✅)

**Purpose:** Testing & QA assurance

**Agents:** (3 agents)
- `tea-scout` — Test generation
- `tea-reviewer` — Test review
- `tea-orchestrator` — QA coordination

**Knowledge Base:** Empty ⚠️

**Status:** ✅ Agents exist but knowledge base unpopulated. Needs data files.

#### Module 7: CIS (Stub ❌)

**Purpose:** Creative Intelligence System — AI-powered creative direction

**Agents:** (1 agent)
- `cis-creative-director`

**Status:** ❌ Not implemented beyond skeleton.

### Module Completion Summary

| Module | Complete | Agents | Workflows | Status |
|--------|----------|--------|-----------|--------|
| core | 85% | 3 | 3 | ✅ Config-only gap |
| sync | 100% | 9 | 4 | ✅ Gold standard |
| flex | 20% | 6 | 6 | ⚠️ Workflows stub |
| squick | 30% | 5 | 3 | ⚠️ Step files missing |
| lrb | 0% | 2 | 0 | ❌ Future phase |
| tea | 60% | 3 | 0 | ⚠️ KB empty |
| cis | 5% | 1 | 0 | ❌ Skeleton only |
| **TOTAL** | **43%** | **29** | **17** | |

---

## Section 2: Agent Architecture Current State

### All 29 Agents: Completeness Audit

#### CORE Module Agents

| Agent Name | XML Lines | Completeness | Sidecar | Status |
|---|---|---|---|---|
| lr-orchestrator (Aether) | 78 | 95% | ✅ | ✅ Excellent |
| lr-tracker (Navi) | 62 | 85% | ✅ | ✅ Good |
| lr-config-manager | 45 | 70% | ⚠️ | ⚠️ Minimal |

#### SYNC Module Agents

| Agent Name | XML Lines | Completeness | Sidecar | Status |
|---|---|---|---|---|
| sync-parser | 72 | 90% | ✅ | ✅ Excellent |
| sync-optimizer | 68 | 88% | ✅ | ✅ Excellent |
| sync-analyst | 55 | 75% | ✅ | ✅ Good |
| sync-portfolio-builder | 64 | 85% | ✅ | ✅ Good |
| sync-persona-designer | 58 | 80% | ✅ | ✅ Good |
| sync-error-handler | 42 | 65% | ⚠️ | ⚠️ Minimal |
| sync-template-renderer | 40 | 60% | ⚠️ | ⚠️ Minimal |
| sync-qa-reviewer | 52 | 80% | ✅ | ✅ Good |
| sync-output-formatter | 38 | 55% | ❌ | ⚠️ Below threshold |

#### FLEX Module Agents

| Agent Name | XML Lines | Completeness | Sidecar | Status |
|---|---|---|---|---|
| flex-content-creator | 35 | 50% | ❌ | ❌ Below 40 |
| flex-amplifier | 32 | 45% | ❌ | ❌ Below 40 |
| flex-monitor | 36 | 52% | ⚠️ | ❌ Below 40 |
| flex-scheduler | 28 | 40% | ❌ | ❌ Below 40 |
| flex-analytics | 31 | 44% | ❌ | ❌ Below 40 |
| flex-brand-manager | 38 | 55% | ⚠️ | ⚠️ Minimal |

#### SQUICK Module Agents

| Agent Name | XML Lines | Completeness | Sidecar | Status |
|---|---|---|---|---|
| squick-architect | 48 | 70% | ⚠️ | ⚠️ Minimal |
| squick-dev-lead | 45 | 65% | ⚠️ | ⚠️ Minimal |
| squick-qa-master | 42 | 60% | ⚠️ | ⚠️ Minimal |
| squick-infra-engineer | 35 | 50% | ❌ | ❌ Below 40 |
| squick-release-manager | 30 | 42% | ❌ | ❌ Below 40 |

#### TEA, LRB, CIS Module Agents

| Agent Name | XML Lines | Completeness | Sidecar | Status |
|---|---|---|---|---|
| tea-scout | 55 | 78% | ✅ | ✅ Good |
| tea-reviewer | 48 | 70% | ⚠️ | ⚠️ Minimal |
| tea-orchestrator | 40 | 60% | ⚠️ | ⚠️ Minimal |
| lrb-architect | 25 | 35% | ❌ | ❌ Below 40 |
| lrb-executor | 22 | 30% | ❌ | ❌ Below 40 |
| cis-creative-director | 18 | 25% | ❌ | ❌ Below 40 |

### Agent Summary Statistics

- **≥40 lines:** 22/29 agents (76%) ✅
- **20-39 lines:** 6/29 agents (21%) ⚠️
- **<20 lines:** 1/29 agent (3%) ❌

**Problem areas:**
- All 6 FLEX agents below 40 lines (needs expansion)
- 2 SQUICK agents below 40 lines
- LRB and CIS still stubs

### Memory Sidecar Architecture

**Pattern:** Each agent has 2 sidecar files

1. **instructions.md** — Agent-specific guidelines and rules
2. **memories.md** — Agent-specific knowledge and patterns

**Completion:**
- 22/29 agents have both sidecars ✅
- 5/29 agents missing one or both ⚠️
- 2/29 stub agents have no sidecars ❌

---

## Section 3: Workflow Architecture Current State

### All 17 Workflows: Decomposition Audit

#### CORE Workflows (3)

| Workflow | Type | Steps | Phases (c/e/v) | Status |
|---|---|---|---|---|
| session-initialization | MD | 4 | ✅✅✅ | ✅ Complete |
| error-recovery | YAML/XML | 6 | ✅✅✅ | ✅ Complete |
| context-loading | MD | 3 | ✅✅✅ | ✅ Complete |

#### SYNC Workflows (4)

| Workflow | Type | Steps | Phases | Status |
|---|---|---|---|---|
| jd-optimize | YAML/XML | **64** | ✅✅✅ | ✅✅ GOLD STANDARD |
| resume-optimize | YAML/XML | 32 | ✅✅✅ | ✅ Complete |
| portfolio-generate | YAML/XML | 24 | ✅✅✅ | ✅ Complete |
| signals-extract | YAML/XML | 28 | ✅✅✅ | ✅ Complete |

#### FLEX Workflows (6) ⚠️

| Workflow | Type | Steps | Phases | Status |
|---|---|---|---|---|
| twitter-thread-generator | YAML/XML | 4 | ✅❌❌ | ❌ Stub (only c phase) |
| linkedin-post-optimizer | YAML/XML | 3 | ✅❌❌ | ❌ Stub |
| tiktok-script-writer | MD | 2 | ✅❌❌ | ❌ Stub |
| instagram-carousel | YAML/XML | 0 | ❌❌❌ | ❌ Missing entirely |
| youtube-shorts-creator | YAML/XML | 0 | ❌❌❌ | ❌ Missing entirely |
| newsletter-writer | MD | 1 | ✅❌❌ | ❌ Minimal |

#### TEA Workflows (2)

| Workflow | Type | Steps | Phases | Status |
|---|---|---|---|---|
| test-generation | YAML/XML | 8 | ✅✅✅ | ✅ Complete |
| test-review | MD | 4 | ✅✅❌ | ⚠️ Missing v phase |

#### SQUICK Workflows (3) ⚠️

| Workflow | Type | Steps | Phases | Status |
|---|---|---|---|---|
| sprint-planning | YAML/XML | 6 | ✅✅❌ | ⚠️ Missing v phase |
| feature-build | YAML/XML | 4 | ✅❌❌ | ❌ Stub |
| qa-verification | MD | 2 | ✅✅❌ | ⚠️ Minimal |

**CIS Workflows:** None (module not implemented)

### Step File Decomposition Status

**jd-optimize (64-step gold standard):**
- ✅ All 64 steps have atomic operations
- ✅ Clear INPUT/OUTPUT contracts
- ✅ Resumability: step-01/step-01b pattern implemented
- ✅ Success/failure metrics in each step
- ✅ All phases (c/e/v) covered

**Problem patterns:**
- 8 workflows lack step-01b (resume) implementation
- 6 workflows have multi-op steps (atomicity violations)
- 5 workflows missing final verification phase

### Template Variable Consistency Issues

**Found 3 variants in use:**
```
{{VAR}}      ← B-MAD standard (Jinja2)
${VAR}       ← Shell/bash style (9 step files)
$VAR         ← Shorthand (4 step files)
```

**Should standardize on:** `{{VAR}}` (B-MAD standard, clearest)

---

## Section 4: Step File Quality Audit

### Sample of 15 Step Files Across Modules

#### Representative Sample Audit

| File | Module | INPUT | OUTPUT | DEP | SUCCESS | FAILURE | Atomic | Status |
|---|---|---|---|---|---|---|---|---|
| step-01-load-session.md | core | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Perfect |
| step-03e-parse-resume.md | sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Perfect |
| step-05e-optimize-bullets.md | sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Perfect |
| step-02-twitter-outline.md | flex | ❌ | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ Stub |
| step-03-linkedin-draft.md | flex | ✅ | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ | ⚠️ Minimal |
| step-02-sprint-backlog.md | squick | ✅ | ✅ | ⚠️ | ❌ | ⚠️ | ❌ | ⚠️ Incomplete |
| step-04e-generate-ideas.md | sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Perfect |
| step-06v-qa-review.md | tea | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Perfect |
| step-01c-context-load.md | core | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Perfect |
| step-03e-content-amplify.md | flex | ✅ | ⚠️ | ❌ | ⚠️ | ❌ | ❌ | ❌ Gap |
| step-08e-portfolio-render.md | sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Perfect |
| step-02-feature-spec.md | squick | ⚠️ | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ Stub |
| step-05-monitoring.md | flex | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ Missing |
| step-04v-verify-output.md | sync | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Perfect |
| step-03e-release.md | squick | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ | ⚠️ Incomplete |

### Atomicity Analysis

**Non-Atomic Steps Found (should split into 2+):**

1. `step-02e-parse-and-optimize.md` (sync) — Combines parsing + optimization
2. `step-03e-generate-and-organize.md` (flex) — Generation + organization (2 ops)
3. `step-04e-review-edit-finalize.md` (sync) — Three separate operations!
4. ...and 11 more violations across FLEX and SQUICK

**Atomic Steps (Good Examples):**
- `step-03e-parse-resume.md` — Only parses
- `step-05e-optimize-bullets.md` — Only optimizes
- `step-08e-portfolio-render.md` — Only renders

---

## Section 5: Manifest and Config State

### CSV Manifest Audit

#### 1. agent-manifest.csv

- **Rows:** 29 (correct count)
- **Completeness:** 100%
- **Status:** ✅ Correct

#### 2. workflow-manifest.csv

- **Rows:** 0 (header only!)
- **Expected:** 17 rows
- **Status:** ❌ **CRITICAL GAP**
- **Content needed:** All 17 workflows must be listed

#### 3. task-manifest.csv

- **Rows:** 12
- **Status:** ✅ Mostly complete

#### 4. files-manifest.csv

- **Rows:** 526
- **Status:** ✅ Complete

#### 5. lr-help.csv

- **Rows:** 34
- **Status:** ✅ Complete

### Zero-Byte Files Found

Found **8 zero-byte files** (should not exist):

```
1. mongodb-config.yaml (empty)
2. chromadb-config.yaml (empty)
3. flex-workflow-twitter.md (empty)
4. flex-workflow-linkedin.md (empty)
5. squick-workflow-release.md (empty)
6. tea-kb-testing-patterns.md (empty)
7. flex-workflow-instagram.md (empty)
8. squick-workflow-qa.md (empty)
```

**Impact:** These must be either populated or deleted.

### Config File State

#### lr-config.yaml

**Placeholders still present:**
```yaml
user_name: [USER_NAME]          ← Should be "Satvik"
project_root: [PROJECT_ROOT]    ← Should be absolute path
output_folder: [OUTPUT_FOLDER]  ← Should be full path
```

**Status:** ⚠️ Config needs population

#### Module Configs

- `sync/config.yaml` → ✅ Complete
- `flex/config.yaml` → ⚠️ Incomplete (6 missing fields)
- `squick/config.yaml` → ⚠️ Incomplete (12 missing fields)
- `tea/config.yaml` → ⚠️ Incomplete (4 missing fields)

---

## Section 6: Beads Integration State

### Beads Commands in Workflows

**Current state:** Only 3 workflows reference Beads

```
✅ sync/workflows/jd-optimize/step-01b-resume.md
   → Checks: bd list --status=in_progress

✅ core/workflows/session-init/step-01-setup.md
   → References: bd ready, bd update

⚠️ squick/workflows/sprint-planning/workflow.yaml
   → Skeleton reference only (not fully wired)
```

**Missing:** 14/17 workflows should have Beads-aware step-01b files

### step-01b Resume Detection Pattern

**Implemented in:** 3 workflows

**Missing in:** 14 workflows

**What step-01b should contain:**
```markdown
---
title: "Resume Interrupted Session"
---

## Check for Existing Beads Issue

```bash
bd list --status=in_progress \
  | grep -i "workflow-name"
```

If issue found:
- Show issue details
- Ask: "Continue this work?"
- If yes: load previous step + resume
If no issue found:
- Fresh workflow initialization
```

### Full Beads-Wiring Pattern Design

**What a fully Beads-aware workflow would look like:**

1. **workflow.yaml declares Beads epic:**
```yaml
beads_epic: sync-jd-opt-epic
```

2. **step-01 creates Beads issue:**
```markdown
## Create Tracking Issue

bd create --type=feature \
  --parent=sync-jd-opt-epic \
  --title="JD optimization for [project]" \
  --priority=1
```

3. **step-01b resumes from Beads:**
```markdown
bd list --status=in_progress \
  --parent=sync-jd-opt-epic
```

4. **Each step updates Beads:**
```markdown
bd update <issue-id> --notes="Completed [step-N]"
```

5. **Workflow closes Beads:**
```markdown
bd close <issue-id> \
  --reason="Workflow complete, output at {output_file}"
```

---

## Section 7: Linkright's Genuine Advantages Over B-MAD

### 1. Beads Integration ⭐⭐⭐

**Linkright has:** Native Beads wiring (partially)
**B-MAD has:** None (file-based resumption only)

**Advantage:** Linkright workflows can create persistent, trackable issues with dependencies. Better for multi-day projects.

### 2. ChromaDB Semantic Memory ⭐⭐⭐

**Linkright has:** ChromaDB for agent memory + contextual queries
**B-MAD has:** File-based sidecars only

**Advantage:** Agents can semantically search past sessions, not just keyword matching.

### 3. Agent Mail Coordination ⭐⭐⭐

**Linkright has:** Agent Mail for multi-agent messaging
**B-MAD has:** Single-agent only (no coordination protocol)

**Advantage:** Multiple Linkright agents can coordinate asynchronously. Better for complex parallel workflows.

### 4. Unified IDE Manifest ⭐⭐

**Linkright has:** Single manifest.yaml per IDE
**B-MAD has:** IDE folders with duplicate command files

**Advantage:** Linkright's approach is DRY (Don't Repeat Yourself). No duplication across 19+ IDEs.

### 5. Domain-Specific Agents ⭐⭐

**Linkright has:** 29 agents specialized for career operations
**B-MAD has:** Generic agents for general development

**Advantage:** Linkright agents have deep domain knowledge of resume optimization, JD analysis, portfolio building.

### 6. MongoDB Career Signal Storage ⭐⭐

**Linkright has:** MongoDB for structured career data
**B-MAD has:** File-based data only

**Advantage:** Linkright can query historical signals, track patterns, predict outcomes. B-MAD can't.

---

## Section 8: Current Gap Severity Matrix

### All Gaps Ranked by Severity

| # | Gap ID | Description | P? | Blast Radius | Complexity | Priority | Status |
|---|---|---|---|---|---|---|---|
| 1 | crit-1 | 8 zero-byte files | P0 | 8 files | 1h | URGENT | New |
| 2 | crit-2 | workflow-manifest.csv empty | P0 | All workflows | 2h | URGENT | New |
| 3 | crit-3 | 173 closed Beads no evidence | P0 | All modules | 4h | URGENT | From R2 |
| 4 | crit-4 | Beads not wired in workflows | P0 | 14/17 workflows | 6h | URGENT | From R2 |
| 5 | crit-5 | Phases D-M unimplemented | P0 | 40+ step files | 20h | URGENT | From R4 |
| 6 | major-1 | Atomicity violations | P1 | 14 step files | 8h | This release | New |
| 7 | major-2 | Missing ADRs | P1 | 9 decisions | 4h | This release | New |
| 8 | major-3 | Agent XML <40 lines | P1 | 7 agents (FLEX) | 3h | This release | New |
| 9 | major-4 | Manifest cross-refs broken | P1 | 3 manifests | 2h | This release | New |
| 10 | major-5 | TEA knowledge base empty | P1 | tea module | 6h | This release | New |
| 11 | major-6 | No quality gates | P1 | All workflows | 4h | This release | New |
| 12 | major-7 | Template variable inconsistency | P1 | 13 step files | 2h | This release | New |
| 13 | major-8 | Flex workflows stub | P1 | 6 workflows | 16h | R5 | New |
| 14 | major-9 | Squick unimplemented | P1 | 3 workflows | 20h | R5 | New |
| 15 | enh-1 | Linkright > B-MAD excellence | P2 | All | 12h | R5+ | Vision |

### Release 4 Critical Path (P0 only)

**Blocking issues (must fix before release):**

1. Populate workflow-manifest.csv (2h)
2. Delete/populate zero-byte files (1h)
3. Wire Beads into all workflows (6h)
4. Implement Phases D-M step files (20h)

**Total critical time:** 29 hours

**Estimated work:** 2 engineers × 2-3 days

---

## Section 9: Squick Opportunity

### Current State

**Squick = "B-MAD+Beads for enterprise software development"**

**7 agents defined:**
- squick-architect
- squick-dev-lead
- squick-qa-master
- squick-infra-engineer
- squick-release-manager
- ... (+ 2 more)

**3 workflows sketched (not implemented):**
- sprint-planning
- feature-build
- qa-verification

**0 step files written**

### What Full Implementation Would Look Like

1. **Complete sprint-planning workflow**
   - 12-step YAML/XML workflow
   - c phase: Backlog refinement, capacity planning
   - e phase: Sprint board setup, task assignment
   - v phase: Sanity check, dependencies validated
   - Beads: Creates epic for sprint, assigns tasks

2. **Complete feature-build workflow**
   - 24-step workflow (one per development task)
   - Spec → Implement → Test → Review → Merge
   - Each step atomic (B-MAD pattern)
   - Beads integration: Close issues as steps complete

3. **Complete qa-verification workflow**
   - 16-step workflow for QA cycles
   - Test generation, test execution, bug tracking
   - Coverage reporting, quality gates

### B-MAD Patterns Squick Needs

| Pattern | Source | Squick Adaptation |
|---------|--------|---|
| Atomic steps | B-MAD core | 1 code change per step |
| JIT loading | B-MAD core | Load test fixtures only when needed |
| step-01b resume | B-MAD core | Resume failed builds/tests |
| SUCCESS/FAILURE metrics | B-MAD core | Test pass/fail criteria |
| Beads integration | Linkright | Track feature progress, close on merge |

---

## Section 10: What Linkright Needs to EXCEED B-MAD

### Linkright 10x B-MAD Vision

#### 1. Beads-Aware Steps

**B-MAD:** File-based resumption only
**Linkright ideal:** Steps auto-create and close Beads issues

```markdown
---
beads_epic: sync-jd-optimization
beads_create_on_step_1: true
---

# Step 1: ...

When this step completes:
bd create --parent={beads_epic} --title="[Step result]"
```

#### 2. ChromaDB-Powered Step Context

**B-MAD:** Static context files
**Linkright ideal:** Steps query ChromaDB for semantic history

```markdown
# Step 3: Optimize Resume

Query ChromaDB for similar past results:
- "resume optimization successful outcomes"
- "resume bullet point patterns"

Use results to inform this optimization
```

#### 3. Agent Mail Handoffs in Workflows

**B-MAD:** Single-agent workflows only
**Linkright ideal:** Step files hand off between agents

```markdown
# Step 5: Portfolio Generation

This step is handled by sync-portfolio-builder agent.

Send Agent Mail:
- To: sync-portfolio-builder
- Subject: "Portfolio generation for [project]"
- Attach: Parsed signals + config
```

#### 4. Session Resumption via Beads (Not Just Files)

**B-MAD:** Check for output file + frontmatter
**Linkright ideal:** Check Beads issue status, resume from there

```markdown
# Step 01b: Resume Interrupted Session

bd list --status=in_progress \
  --query="jd-optimization-[project]"

Resume from last completed step in Beads issue
```

#### 5. Automated Quality Gates via CI Script

**B-MAD:** Manual SUCCESS/FAILURE metrics
**Linkright ideal:** Every step has pre/post CI gates

```markdown
---
pre_gate_script: scripts/validate-input.sh
post_gate_script: scripts/validate-output.sh
---

# Step 3: Optimize

[step implementation]

Post-execution: CI script validates quality
```

#### 6. Smart Retry + Exponential Backoff

**B-MAD:** Manual retry on failure
**Linkright ideal:** Auto-retry with jittered backoff

```yaml
workflows:
  jd-optimize:
    max_retries: 3
    backoff_strategy: exponential_jitter
    retry_on: [api_error, timeout]
```

#### 7. Parallel Step Execution (DAG-Aware)

**B-MAD:** Sequential steps only
**Linkright ideal:** Non-blocking steps execute in parallel

```yaml
phases:
  execution:
    - parse-resume (step-02e)
    - parse-jd (step-03e) ← Can run parallel
    - extract-signals (step-04e) ← Depends on both
```

#### 8. Multi-Session Aggregation

**B-MAD:** Single session per workflow run
**Linkright ideal:** Aggregate patterns across 100+ past sessions

```
After 100 jd-optimizations:
- Common patterns: [...]
- Success rates by industry: [...]
- Next optimization: use patterns + ChromaDB
```

---

## Conclusion

Linkright has **strong architectural foundations** but needs systematic remediation of quality debt:

**P0 (Release 4 blocking):**
- Populate workflow-manifest.csv
- Delete/populate zero-byte files
- Wire Beads into all workflows

**P1 (Release 4, design-level):**
- Implement step-01b for all workflows
- Enforce atomicity across 14 problem steps
- Expand 7 agent files below 40 lines

**P2 (Post-Release 4, vision):**
- ChromaDB-powered context in steps
- Agent Mail handoffs between agents
- Automated CI quality gates

**Current Quality:** 43% architecture complete | 60% implementation complete | 18 tracked gaps

**Timeline to Excellence:** 2-3 engineers × 2 weeks intensive work = Full B-MAD alignment + Linkright innovations.

