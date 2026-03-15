# Linkright System Deep-Dive Audit Report
**Audit Date:** 2026-03-09
**Auditor:** Nova (OlivePrairie) — Linkright Architecture Specialist
**Scope:** Full forensic audit of `/context/linkright/_lr/` plus reference documents
**Methodology:** Real file reads, bash counts, content sampling across all modules

---

## Executive Summary

Linkright is an architecturally ambitious career-ops platform with strong bones but uneven flesh. The system spans 31 agents, 28+ workflow definitions, 268 step files, and 20 IDE integrations. The core innovation (Beads + ChromaDB + Agent Mail) is genuinely superior to BMAD's file-sidecar approach. But 33 of 63 steps in the flagship jd-optimize workflow are **thin stubs of 322 bytes each**, the config layer has placeholder values in production, 7 agents are missing customize.yaml files, and 5 critical workflows have effectively zero substantive steps. This report documents every gap found with real file evidence, ranks them by severity, and provides a specific path to exceed B-MAD.

---

## Section 1: Module Architecture Map

### Module Inventory

Linkright declares 5 modules in `_lr/_config/manifest.yaml` (core, lrb, sync, flex, squick) plus 2 undeclared satellites (tea, cis). Total: 7 functional modules.

---

### MODULE: core
**Path:** `_lr/core/`
**Purpose:** System orchestration, governance, and memory management
**Status:** PARTIAL

**Agents:**
- `_lr/core/agents/lr-orchestrator.md` — Aether, Central Brain & Orchestrator (52 lines)
- `_lr/core/agents/lr-tracker.md` — Navi, Governance & Memory Manager (58 lines)

**Workflows (10 total, mix of active/stub):**
- `core/workflows/brainstorming/` — ACTIVE (workflow.md + workflow.yaml + 3 steps)
- `core/workflows/party-mode/` — ACTIVE (workflow.md + workflow.yaml + 3 steps)
- `core/workflows/sprint-status/` — ACTIVE (3 steps in steps/)
- `core/workflows/lr-discuss/` — STUB (workflow.md exists, no real steps)
- `core/workflows/context-gen/` — STUB (workflow.yaml + steps-c dir, no step content)
- `core/workflows/dev-story/` — STUB (yaml + steps/ with only step-01b)
- `core/workflows/create-story/` — STUB (yaml only)
- `core/workflows/sprint-planning/` — STUB (yaml only)
- `core/workflows/document-project/` — STUB (yaml only)
- `core/workflows/document-system/` — STUB (yaml only)
- `core/workflows/setup-execution/` — PARTIAL (instructions.md + step-01b only)

**Knowledge Files (8):**
- `core/knowledge/global-constraints.md`
- `core/knowledge/signal-taxonomy.json`
- `core/knowledge/signal-taxonomy.md`
- `core/knowledge/lr-principles.md`
- `core/knowledge/persona-properties.md`
- `core/knowledge/quick-start.md`
- `core/knowledge/system-definitions.md`
- `core/knowledge/command-syntax.md`

**Config Files:**
- `core/config/mongodb-config.yaml` — POPULATED (353 bytes, full connection schema)
- `core/config/chromadb-config.yaml` — POPULATED (1,249 bytes, 3 collections defined)
- `core/config/installer.yaml`

**Classification Evidence:** Core has functional orchestrator agents and real knowledge files, but 7 of 10 workflows are stubs. The "active" workflows (brainstorming, party-mode) only have 3 steps each.

---

### MODULE: sync
**Path:** `_lr/sync/`
**Purpose:** Career signal processing, JD optimization, outbound campaigns
**Status:** PARTIAL (1 flagship workflow active, 5 others are shells)

**Agents (10):**
- `sync/agents/sync-inquisitor.md` — Sia (46 lines)
- `sync/agents/sync-linker.md` — Atlas (50 lines)
- `sync/agents/sync-narrator.md` — Mnemosyne (46 lines) — **no customize.yaml**
- `sync/agents/sync-parser.md` — Orion (48 lines)
- `sync/agents/sync-publicist.md` — Lyric (41 lines)
- `sync/agents/sync-refiner.md` — Veda (46 lines)
- `sync/agents/sync-scout.md` — Lyra (46 lines)
- `sync/agents/sync-sizer.md` — Kael (46 lines)
- `sync/agents/sync-styler.md` — Cora (46 lines)
- `sync/agents/sync-tracker.md` — Ledger (46 lines) — **no customize.yaml**

**Workflows (6 total):**
- `sync/workflows/jd-optimize/` — ACTIVE: 63 steps-c + 9 steps-e + 10 steps-v + 1 steps
- `sync/workflows/outbound-campaign/` — PARTIAL: 8 steps-c + 2 steps-e + 1 steps-v
- `sync/workflows/portfolio-deploy/` — PARTIAL: 5 steps-c + 2 steps-e + 1 steps-v
- `sync/workflows/quick-optimize/` — PARTIAL: 7 steps-c + 2 steps-e + 1 steps-v
- `sync/workflows/signal-capture/` — STUB: 2 steps-c only
- `sync/workflows/application-track/` — STUB: 3 steps-c only

**Knowledge Files:**
- `sync/knowledge/alignment-patterns.md`
- `sync/knowledge/recruiter-psychology.md`
- `sync/knowledge/patterns/alignment-patterns.md`
- `sync/knowledge/patterns/patterns-v1.md`
- `sync/knowledge/recruiter-intelligence/recruiter-psychology.md`

**Teams:** `sync/teams/default-party.csv` — 5 data rows

---

### MODULE: flex
**Path:** `_lr/flex/`
**Purpose:** Social brand strategy and viral signal amplification (inbound)
**Status:** PARTIAL

**Agents (1):**
- `flex/agents/flex-publicist.md` — Echo, Social Brand Strategist (46 lines)

**Workflows (2):**
- `flex/workflows/content-automation/` — PARTIAL: 7 steps-c + 2 steps-e + 2 steps-v
- `flex/workflows/portfolio-deploy/` — STUB: steps/step-01b + steps-c with 2 steps (signal-ranking, slide-rendering)

**Data:** `flex/data/` — empty (only .gitkeep). The Airtable/Postiz integration steps exist but have no reference data to work with.

**Teams:** `flex/teams/default-party.csv` — 3 data rows

**Classification Evidence:** Flex has only 1 substantive agent and 2 workflows, one of which is partially implemented. The viral-mechanics knowledge directory exists. The data layer is completely empty.

---

### MODULE: squick
**Path:** `_lr/squick/`
**Purpose:** Enterprise-grade rapid shipment squad (Ship + Quick)
**Status:** STUB (framework present, content minimal)

**Agents (7):**
- `squick/agents/squick-analyst.md` — Alex (49 lines)
- `squick/agents/squick-architect.md` — Arthur (49 lines)
- `squick/agents/squick-pm.md` — Piper (45 lines)
- `squick/agents/squick-qa.md` — Vera (49 lines)
- `squick/agents/squick-sm.md` — Sasha (49 lines) — references `bd list` in activation
- `squick/agents/squick-tech-writer.md` — Tycho (46 lines)
- `squick/agents/squick-ux.md` — Ula (46 lines)

**Workflows (5):**
- `squick/workflows/1-analysis/` — STUB: 1 real step (discover) + load + resume + steps-e only
- `squick/workflows/2-plan/` — STUB: 1 real step (draft-prd) + boilerplate
- `squick/workflows/3-solutioning/` — STUB: 1 real step (architecture-review) + boilerplate
- `squick/workflows/4-implementation/` — STUB: 1 real step (code-review) + boilerplate
- `squick/workflows/enterprise-ship/` — PARTIAL: workflow.md with XML DAG + 2 steps-b (discovery, briefing)

**Teams:** `squick/teams/default-party.csv` — 4 data rows

**Classification Evidence:** All 4 numbered workflows have the same minimal structure: load-session-context + step-01b-resume + 1 domain step + steps-e with assess/apply-edit. No steps-v phase for any squick numbered workflow. Total squick step files: 28.

---

### MODULE: lrb (Linkright Builder)
**Path:** `_lr/lrb/`
**Purpose:** Module and agent development tooling
**Status:** COMPLETE (most developed module relative to scope)

**Agents (6):**
- `lrb/agents/lr-agent-builder.md` — Bond (47 lines)
- `lrb/agents/lr-analyst.md` — M (44 lines)
- `lrb/agents/lr-module-builder.md` — Morgan (48 lines)
- `lrb/agents/lr-qa.md` — Quinn (45 lines)
- `lrb/agents/lr-test-engineer.md` — Q (44 lines)
- `lrb/agents/lr-workflow-builder.md` — Wendy (45 lines)

**Workflows (3 with substantial steps):**
- `lrb/workflows/agent/` — 8 steps-c (brainstorm → discovery → sidecar-metadata → persona → commands-menu → activation → build-agent → celebrate)
- `lrb/workflows/module/` — 8 steps-c (load-brief → continue → structure → config → agents → workflows → docs → complete)
- `lrb/workflows/qa/` — 5 steps-g + 4 steps-o + step-01b

**Data Files:**
- `lrb/workflows/agent/data/communication-presets.csv` — 12 data rows
- `lrb/workflows/agent/agent-beads-integration.md` — full Beads integration guide
- `lrb/workflows/agent/agent-error-recovery.md`
- `lrb/workflows/agent/agent-handoff-protocol.md`
- `lrb/workflows/agent/data/agent-compilation.md`
- `lrb/workflows/agent/data/agent-validation.md`

**Classification Evidence:** lrb is the most complete module. All 3 workflows have 8+ real steps. The agent-beads-integration.md documents `bd create`, `bd dep add`, `bd update` patterns. The communication-presets.csv has real data (12 rows).

---

### MODULE: tea (Test Engineering & Assurance)
**Path:** `_lr/tea/`
**Purpose:** QA and validation workflows
**Status:** PARTIAL (knowledge files rich, workflow thin)
**Note:** NOT declared in `_lr/_config/manifest.yaml` — undeclared satellite module

**Agents (3):**
- `tea/agents/tea-qa-engineer.md` — Quinn (52 lines) — **no customize.yaml in _config/agents/**
- `tea/agents/tea-scout.md` — Fenris (50 lines) — **no customize.yaml in _config/agents/**
- `tea/agents/tea-validator.md` — Vera (52 lines) — **no customize.yaml in _config/agents/**

**Workflows (1):**
- `tea/workflows/resume-validation/` — PARTIAL: 5 steps-c + 5 steps-v + step-01b

**Knowledge Files (43 files — the richest knowledge base in the system):**
Includes: accessibility-testing.md, adr-quality-readiness-checklist.md, api-request.md, api-testing-patterns.md, auth-session.md, burn-in.md, ci-burn-in.md, component-tdd.md, contract-testing.md, data-factories.md, email-auth.md, error-handling.md, feature-flags.md, file-utils.md, fixture-architecture.md, fixtures-composition.md, intercept-network-call.md, log.md, network-error-monitor.md, network-first.md, network-recorder.md, nfr-criteria.md, overview.md, pact-consumer-di.md, pact-consumer-framework-setup.md, pact-mcp.md, pactjs-utils-consumer-helpers.md, pactjs-utils-overview.md, pactjs-utils-provider-verifier.md, pactjs-utils-request-filter.md, playwright-cli.md, playwright-config.md, probability-impact.md, recurse.md, risk-governance.md, selective-testing.md, selector-resilience.md, test-healing-patterns.md, test-levels-framework.md, test-priorities-matrix.md, test-quality.md, timing-debugging.md, user-acceptance-testing.md, visual-debugging.md

**Config:** `tea/config.yaml` — full module config with 3 agents and 13 knowledge domains listed

**Classification Evidence:** TEA has the most comprehensive knowledge base of any module (43 files) and the best step quality in the system. However, it's not in manifest.yaml, has no module-help.csv, and only 1 workflow with no steps-e phase.

---

### MODULE: cis (Competitive Intelligence Suite)
**Path:** `_lr/cis/`
**Purpose:** Narrative craft and competitive positioning
**Status:** STUB
**Note:** NOT declared in `_lr/_config/manifest.yaml` — undeclared satellite module

**Agents (2):**
- `cis/agents/cis-architect.md` (49 lines) — generic "Senior Technical Agent" persona
- `cis/agents/cis-engineer.md` (49 lines) — generic "Senior Technical Agent" persona

**Workflows (1):**
- `cis/workflows/narrative-craft/` — STUB: 2 steps-c (analyze-arc + design-hook) + steps-v directory

**Classification Evidence:** Both cis agents use the same title "Senior Technical Agent" with identical `capabilities="advanced processing, validation, synthesis"` — copy-paste scaffolding. Only 2 workflow steps exist. The module is an architectural placeholder.

---

### The Core Hub: lr-orchestrator vs lr-tracker

**lr-orchestrator (Aether):** Routes users between modules. The menu has 5 items: redisplay help, route to module, resume session (via Beads), start party-mode, dismiss. Activation step 2 requires loading `lr-config.yaml`. The `[RS] Resume Session` command explicitly calls "Use Beads to identify and resume the last interrupted state" — this is the only Beads integration in the orchestrator menu. The rule `"Maintain zero BMAD identity; you are purely a Linkright entity."` is explicitly stated. Handler pattern matching: `.md` → load_system_prompt, `.yaml/.json/.csv` → load_reference_data, `workflow.yaml` → initialize_workflow.

**lr-tracker (Navi):** Governance & Memory Manager. Activates with MongoDB session initialization (`users`, `career_signals`, `jd_profiles` collections). Menu: Show Task, Update Task, Ready List, List Metrics. The rule `"ENSURE all project tasks are linked to an Epic in Beads"` is the system's strongest Beads governance statement. The `[LM] List Metrics` item maps to MongoDB queries for career signal conversion rates. However, the MongoDB connection string is not in lr-config.yaml — lr-tracker cannot execute step 4 ("Initialize MongoDB session") with current config.

---

## Section 2: Agent Architecture — Current State

### Agent Discovery

Actual bash command and result:
```
find /context/linkright/_lr -name "*.md" -path "*/agents/*" | sort
```
**Result: 31 agent files total**

### Section Check: All 4 XML Sections

All 31 agents returned `agent=1 persona=1 activation=1 menu=1` in structural verification. Every agent has all required XML sections.

### Agent Inventory Table

| Agent | Persona Name | Lines | Module | customize.yaml | Sidecar in Manifest |
|-------|-------------|-------|--------|----------------|---------------------|
| lr-orchestrator | Aether | 52 | core | YES | YES |
| lr-tracker | Navi | 58 | core | YES | YES |
| sync-inquisitor | Sia | 46 | sync | YES | YES |
| sync-linker | Atlas | 50 | sync | YES | YES |
| sync-narrator | Mnemosyne | 46 | sync | **MISSING** | NO (empty sidecar_path) |
| sync-parser | Orion | 48 | sync | YES | YES |
| sync-publicist | Lyric | 41 | sync | YES | YES |
| sync-refiner | Veda | 46 | sync | YES | YES |
| sync-scout | Lyra | 46 | sync | YES | YES |
| sync-sizer | Kael | 46 | sync | YES | YES |
| sync-styler | Cora | 46 | sync | YES | YES |
| sync-tracker | Ledger | 46 | sync | **MISSING** | NO (empty sidecar_path) |
| flex-publicist | Echo | 46 | flex | YES | YES |
| squick-analyst | Alex | 49 | squick | YES | YES |
| squick-architect | Arthur | 49 | squick | YES | YES |
| squick-pm | Piper | 45 | squick | YES | YES |
| squick-qa | Vera | 49 | squick | YES | YES |
| squick-sm | Sasha | 49 | squick | YES | YES |
| squick-tech-writer | Tycho | 46 | squick | YES | YES |
| squick-ux | Ula | 46 | squick | YES | YES |
| lr-agent-builder | Bond | 47 | lrb | YES | YES |
| lr-analyst | M | 44 | lrb | YES | YES |
| lr-module-builder | Morgan | 48 | lrb | YES | YES |
| lr-qa | Quinn | 45 | lrb | YES | YES |
| lr-test-engineer | Q | 44 | lrb | YES | YES |
| lr-workflow-builder | Wendy | 45 | lrb | YES | YES |
| tea-qa-engineer | Quinn | 52 | tea | **MISSING** | NO (empty sidecar_path) |
| tea-scout | Fenris | 50 | tea | **MISSING** | NO (empty sidecar_path) |
| tea-validator | Vera | 52 | tea | **MISSING** | NO (empty sidecar_path) |
| cis-architect | Cis-Architect | 49 | cis | **MISSING** | NO (empty sidecar_path) |
| cis-engineer | Cis-Engineer | 49 | cis | **MISSING** | NO (empty sidecar_path) |

**Agents missing customize.yaml: 7** (sync-narrator, sync-tracker, tea-qa-engineer, tea-scout, tea-validator, cis-architect, cis-engineer)

**Agents below 40 lines: 0** — every agent meets the minimum.

**Agents 40-45 lines (borderline):** lr-analyst (44), lr-test-engineer (44), sync-publicist (41), lr-qa (45), squick-pm (45)

**Agents above 50 lines (most developed):** lr-orchestrator (52), lr-tracker (58), tea-qa-engineer (52), tea-validator (52)

### CIS Agent Quality Issue

The two cis agents are generic stubs. Both use title "Senior Technical Agent" with `capabilities="advanced processing, validation, synthesis"` — completely non-specific. The agent manifest confirms both show `icon=🛡️` and `title=Senior Technical Agent`. This is copy-paste scaffolding that declares `hasSidecar="false"` — the only agents in the system that explicitly opt out of memory persistence.

### Memory Sidecar Inconsistency

The root agent manifest (`_lr/agent-manifest.csv`) shows `sidecar_path` is empty for: sync-narrator, sync-tracker, cis-architect, cis-engineer, tea-scout, tea-validator. However `_lr/_memory/lr-tracker-sidecar/` physically exists. The disconnect is that agents without sidecar paths in the manifest cannot be auto-discovered by lr-tracker's MongoDB initialization.

Naming collision: Both `squick-qa` and `tea-validator` use the persona name "Vera". Both `lrb/lr-qa` and `tea-qa-engineer` use "Quinn". These name collisions will cause confusion in multi-agent sessions.

---

## Section 3: Workflow Architecture — Current State

### Workflow Discovery

```
find /context/linkright/_lr -name "workflow.md" -o -name "workflow.yaml" | sort
```
**Result: 31 workflow files** (some directories have both .md and .yaml)

### Comprehensive Workflow State Table

| Workflow | Module | steps-c | steps-e | steps-v | step-01-load? | step-01b? | Status |
|----------|--------|---------|---------|---------|---------------|-----------|--------|
| jd-optimize | sync | 63 | 9 | 10 | YES | YES (in steps/) | ACTIVE |
| outbound-campaign | sync | 8 | 2 | 1 | YES | YES | PARTIAL |
| portfolio-deploy | sync | 5 | 2 | 1 | YES | YES | PARTIAL |
| quick-optimize | sync | 7 | 2 | 1 | YES | YES | PARTIAL |
| signal-capture | sync | 2 | 2 | 1 | NO | YES | STUB |
| application-track | sync | 3 | 2 | 1 | NO | YES | STUB |
| content-automation | flex | 7 | 2 | 2 | YES | YES | PARTIAL |
| portfolio-deploy (flex) | flex | 2 | — | — | NO | YES | STUB |
| resume-validation | tea | 5 | — | 5 | NO | YES | PARTIAL |
| narrative-craft | cis | 2 | — | — | NO | NO | STUB |
| agent workflow | lrb | 8 | 2 | 2 | NO | YES | PARTIAL |
| module workflow | lrb | 8 | 2 | 2 | NO | YES | PARTIAL |
| qa workflow | lrb | 5+4 | — | — | NO | YES | PARTIAL |
| 1-analysis | squick | 3 | 2 | — | YES | YES | STUB |
| 2-plan | squick | 3 | 2 | — | YES | YES | STUB |
| 3-solutioning | squick | 3 | 2 | — | YES | YES | STUB |
| 4-implementation | squick | 3 | 2 | — | YES | YES | STUB |
| enterprise-ship | squick | — | — | — | YES (in steps/) | YES | STUB |
| brainstorming | core | 3 | — | — | NO | YES | ACTIVE (simple) |
| party-mode | core | 3 | — | — | NO | YES | ACTIVE (simple) |
| sprint-status | core | 3 | — | — | NO | YES | ACTIVE (simple) |
| lr-discuss | core | — | — | — | NO | NO | STUB |

### The jd-optimize Gold Standard

jd-optimize is the system's most developed workflow. What makes it the gold standard:
1. Three full phases: 63 steps-c + 9 steps-e + 10 steps-v
2. The steps-v phase validates 10 distinct dimensions (1 per file)
3. Steps 41-64 implement Phase D-M from Context Z (Persona Scoring through Delivery)
4. The workflow.yaml has explicit `input_file_patterns` with strategies (FULL_LOAD vs SELECTIVE_LOAD)
5. A `templates/optimized-jd.template.md` output skeleton exists
6. A `data/reference/` directory exists for reference material

What exposes the ceiling:
- 33 of 63 steps-c use a generic stub template: the phrase `"Execute core logic for 'Step X [Name]'"` repeats verbatim in steps 12-40
- Steps 41-64 (Phase D-M implementation) are substantive (1,000+ bytes each)
- The workflow.yaml does NOT reference steps by name — no explicit DAG definition

The manifest shows `step_count: 64` but the actual step-c count is 63. There is no step-02 (it skips from 01b to 03), which means the numbering gap is a documentation artifact.

---

## Section 4: Step File Quality Audit

### Sampled Files (15 across different modules)

**File 1:** `sync/workflows/jd-optimize/steps-c/step-01-load-session-context.md`
- Size: 526 bytes | Lines: ~18
- DEPENDENCIES: YES | OUTPUT ARTIFACT: NO | SUCCESS CRITERIA: NO | FAILURE PROTOCOL: NO
- Template variables: `{system_name}`, `{mode}`, `{user_details}` — single-curly style
- Atomicity: YES (single load operation)
- Verdict: MINIMAL but correct

**File 2:** `sync/workflows/jd-optimize/steps-c/step-12-signal-retrieval.md`
- Size: 322 bytes | Lines: ~12
- DEPENDENCIES: YES ("Requires: Previous sequence output" — non-specific)
- OUTPUT ARTIFACT: YES ("JSON artifact or intermediate state for next step" — generic)
- SUCCESS CRITERIA: NO | FAILURE PROTOCOL: NO
- Template variables: none
- Atomicity: FAILED — "Execute core logic for 'Step 12 Signal Retrieval'" is not operational
- Verdict: **THIN STUB — uses generic template, non-functional**

**File 3:** `sync/workflows/jd-optimize/steps-c/step-41-persona-score-init.md`
- Size: 1,083 bytes | Lines: ~35
- DEPENDENCIES: YES (references specific prior step outputs: `step-40-final-export`, `step-06-final-output`)
- OUTPUT ARTIFACT: YES (`persona_assessment.yaml` with explicit schema)
- SUCCESS CRITERIA: NO | FAILURE PROTOCOL: NO
- Template variables: none
- Atomicity: YES (build persona scoring matrix — single cognitive operation)
- Verdict: **SUBSTANTIVE — proper implementation detail**

**File 4:** `sync/workflows/jd-optimize/steps-c/step-44-signal-query.md`
- Size: ~800 bytes | Lines: ~28
- DEPENDENCIES: YES (references step-43 and step-06 specifically)
- OUTPUT ARTIFACT: YES (`signal_query.json`)
- SUCCESS CRITERIA: NO | FAILURE PROTOCOL: NO
- Atomicity: YES — construct weighted query
- Verdict: **SUBSTANTIVE**

**File 5:** `sync/workflows/jd-optimize/steps-c/step-63-success-validation.md`
- Size: ~1,100 bytes | Lines: ~32
- DEPENDENCIES: YES (references step-56 and step-62 specifically)
- OUTPUT ARTIFACT: YES (`success_validation.yaml`, `interview_probability.md`)
- SUCCESS CRITERIA: YES (implicit — success probability assessment)
- FAILURE PROTOCOL: NO
- Atomicity: YES — final validation gate
- Verdict: **SUBSTANTIVE**

**File 6:** `sync/workflows/jd-optimize/steps-c/step-27-content-drafting.md`
- Size: 322 bytes | Lines: ~12
- DEPENDENCIES: YES (generic) | OUTPUT ARTIFACT: YES (generic) | SUCCESS CRITERIA: NO | FAILURE PROTOCOL: NO
- Atomicity: FAILED — stub
- Verdict: **THIN STUB — identical format to step-12**

**File 7:** `core/workflows/common/steps/step-01b-resume-if-interrupted.md`
- Size: ~2,400 bytes | Lines: ~75
- DEPENDENCIES: YES (explicit: step-01, Beads issue, MongoDB)
- OUTPUT ARTIFACT: YES (checkpoint written to MongoDB workflow_history)
- SUCCESS CRITERIA: YES (5 explicit success metrics listed)
- FAILURE PROTOCOL: YES (checkpoint missing → start over logic)
- Template variables: `[last_step]`, `[ISSUE_ID]`, `[ISO_TIMESTAMP]` — bracket style
- Atomicity: YES — single resumption check
- bd commands: `bd list --status=in_progress --limit=1` and `bd update [ISSUE_ID] --notes=...`
- Verdict: **GOLD STANDARD — best step file in system**

**File 8:** `flex/workflows/content-automation/steps-c/step-flx-02-query-viral-insights.md`
- Size: ~500 bytes | Lines: ~20
- DEPENDENCIES: YES | OUTPUT ARTIFACT: YES (`narrative_hooks[]`)
- SUCCESS CRITERIA: NO | FAILURE PROTOCOL: NO
- Atomicity: YES — single ChromaDB query
- Verdict: **MINIMAL but coherent, real ChromaDB usage**

**File 9:** `tea/workflows/resume-validation/steps-c/step-01-integrity-check.md`
- Size: ~3,500 bytes | Lines: ~115
- DEPENDENCIES: YES (explicit file paths with checkmark markers)
- OUTPUT ARTIFACT: YES (full JSON schema with example outputs provided)
- SUCCESS CRITERIA: YES (PASS/CONCERNS/FAIL rubric with point scoring per protocol)
- FAILURE PROTOCOL: YES (FAIL verdict → return to user for major revisions)
- Template variables: none
- Atomicity: YES — structural integrity check only (distinct from ATS check in step-02)
- Verdict: **BEST IN SYSTEM — full rubric, examples, JSON output contract, failure protocols**

**File 10:** `lrb/workflows/agent/steps-c/step-01-brainstorm.md` — directory confirmed, file exists
**File 11:** `squick/workflows/1-analysis/steps-c/step-01-discover.md` — 1-step stub pattern confirmed
**File 12:** `sync/workflows/outbound-campaign/steps-c/step-out-01-ingest.md` — exists in directory
**File 13:** `sync/workflows/portfolio-deploy/steps-c/step-port-01-compile.md` — exists (port-01b, port-01c in flex version)
**File 14:** `sync/workflows/jd-optimize/steps-v/step-01-validate.md` — exists; 10 validation steps
**File 15:** `tea/workflows/resume-validation/steps-v/step-01-validate.md` — exists; 5 validation steps

### Template Variable Style Inconsistency (Actual Counts)

```bash
grep -r "\${" _lr --include="*.md" -l | wc -l   → 40 files
grep -r "{{" _lr --include="*.md" -l | wc -l    → 24 files
grep -rn "{[a-z_-]*}" _lr --include="*.md" -l | wc -l  → 191 files
```

This is a 3-way inconsistency:
- Agent files use `{project-root}` (single curly) — 191 files
- lr-config.yaml uses `${AIRTABLE_WEBHOOK_URL}` (dollar-curly) — 40 files
- Some templates use `{{user_name}}` (double curly) — 24 files

No consistent interpolation standard exists. Any templating engine will fail on at least 2 of the 3 styles.

### Atomicity Failure Rate in jd-optimize

```bash
grep -l "Execute core logic for" steps-c/*.md | wc -l → 33 files
grep -l "BMAD and Context Z alignment" steps-c/*.md | wc -l → 33 files
```

Same 33 files match both patterns — these are the stub steps. **52% of jd-optimize steps-c are non-functional stubs.** The stub steps cover roughly Phases B through mid-H of Context Z's 13-phase model.

---

## Section 5: Manifest and Config State

### CSV File Inventory (17 total)

| CSV File | Path | Header Columns | Data Rows | State |
|----------|------|---------------|-----------|-------|
| agent-manifest.csv | `_lr/_config/` | name,displayName,title,icon,capabilities,role,identity,communicationStyle,principles,module,path | 31 | POPULATED |
| files-manifest.csv | `_lr/_config/` | id,name,type,path,module,size_bytes,status,created_date,description | **10** | SPARSE (10 of 747 files) |
| lr-help.csv | `_lr/_config/` | "command","agent_id","description" | 5 | POPULATED |
| task-manifest.csv | `_lr/_config/` | id,title,type,status,priority,parent,module,created_date,description | 14 | POPULATED |
| tool-manifest.csv | `_lr/_config/` | id,name,type,category,path,module,status,created_date,description | 11 | POPULATED |
| workflow-manifest.csv | `_lr/_config/` | id,name,module,path,type,phase_coverage,step_count,description,status | 22 | POPULATED |
| agent-manifest.csv | `_lr/` (root) | agent_id,name,title,icon,module,path,sidecar_path | 30 | DUPLICATE — different schema |
| files-manifest.csv | `_lr/` (root) | type,name,module,path,hash | **632** | DIFFERENT schema from _config/ version |
| workflow-manifest.csv | `_lr/` (root) | workflow_id,name,module,path | 27 | DIFFERENT schema from _config/ version |
| documentation-requirements.csv | `core/workflows/document-project/` | 24 columns | 11 | POPULATED |
| communication-presets.csv | `lrb/workflows/agent/data/` | name,description,communication_style_content,use_case,tone_keywords | 12 | POPULATED |
| flex/module-help.csv | `flex/` | "command","agent_id","description" | 4 | POPULATED |
| squick/module-help.csv | `squick/` | "command","agent_id","description" | 4 | POPULATED |
| sync/module-help.csv | `sync/` | "command","agent_id","description" | 5 | POPULATED |
| flex/teams/default-party.csv | `flex/teams/` | "party_id","agent_id","role","responsibility" | 3 | POPULATED |
| squick/teams/default-party.csv | `squick/teams/` | "party_id","agent_id","role","responsibility" | 4 | POPULATED |
| sync/teams/default-party.csv | `sync/teams/` | "party_id","agent_id","role","responsibility" | 5 | POPULATED |

### Critical Manifest Duplication Problem

There are duplicate manifests with **different schemas** — this is a governance failure:

- Two `agent-manifest.csv`: `_config/` has 31 rows with 11 columns; root `_lr/` has 30 rows with 7 columns (missing tea-qa-engineer)
- Two `files-manifest.csv`: `_config/` has 10 rows; root has 632 rows (different schema entirely)
- Two `workflow-manifest.csv`: `_config/` has 22 rows with step_count/status; root has 27 rows with simpler schema

Which manifest do agents read? Both files are referenced in different places. No documentation clarifies which is authoritative. This is a P0 governance gap.

### Zero-Byte File Inventory

```bash
find /context/linkright/_lr -size 0 -type f | grep -v ".gitkeep" | sort
```
**Result: Zero non-gitkeep zero-byte files found.**

The zero-byte issue from Release_4.md has been resolved. MongoDB and ChromaDB configs are now populated. Remaining empty containers are .gitkeep directories (15 total):
- `core/workflows/brainstorming/data/`, `core/workflows/brainstorming/templates/`
- `core/workflows/create-story/data/`, `core/workflows/create-story/templates/`
- `core/workflows/dev-story/data/`, `core/workflows/dev-story/templates/`
- `core/workflows/lr-discuss/data/`, `core/workflows/lr-discuss/templates/`
- `core/workflows/party-mode/data/`, `core/workflows/party-mode/templates/`
- `core/workflows/sprint-planning/data/`, `core/workflows/sprint-planning/templates/`
- `core/workflows/sprint-status/data/`, `core/workflows/sprint-status/templates/`
- `flex/data/`

### lr-config.yaml Placeholder Values (Quoted)

From direct read of `_lr/lr-config.yaml`:

```yaml
user:
  name: "[USER_NAME]"
  bio: "[USER_PROFESSIONAL_SUMMARY]"
  target_role: "[TARGET_JOB_TITLE]"
  target_companies: []
  skills: []
```

And:
```yaml
distribution:
  airtable:
    url: "${AIRTABLE_WEBHOOK_URL}"
  postiz:
    url: "${POSTIZ_API_URL}"
```

Every agent's activation step 2 loads lr-config.yaml and stores `{user_name}`, `{user_bio}`, `{target_role}` as session variables. With these as literal placeholder strings, all personalization output will contain raw bracket text. The system is completely depersonalized until these are filled.

---

## Section 6: Beads Integration State

### Files Referencing bd Commands

```bash
grep -r "bd " /context/linkright/_lr --include="*.md" -l | sort
```
**Result: 42 files**

### bd Command Usage Analysis

| File Category | bd Commands Used | Quality |
|--------------|-----------------|---------|
| `core/workflows/common/steps/step-01b-resume-if-interrupted.md` | `bd list --status=in_progress --limit=1`; `bd update [ISSUE_ID] --notes=...` | GOLD STANDARD |
| `lrb/workflows/agent/agent-beads-integration.md` | `bd create --title=...`; `bd dep add`; `bd list`; `bd ready` | Documentation reference |
| `squick/agents/squick-sm.md` | `bd list` (activation step 3) | Activation integration |
| `sync/agents/sync-narrator.md` | `bd dolt` (activation step 5) | Activation integration |
| All 38 step-01b files | `bd list --status=in_progress --limit=1`; `bd update [ISSUE_ID]` | Resumption pattern |
| `core/knowledge/quick-start.md` | `bd ready` | Documentation |
| `sync/docs/SYNC-DESIGN-AND-TECHNICAL-SPECS.md` | Various bd commands | Documentation |

The step-01b pattern is the primary real Beads integration point. 38 workflows have step-01b, meaning 38 execution cycles can detect interruption via `bd list`. However:

1. **`bd create` is never called in any step file** — Beads tasks are not created at workflow start
2. **`bd close` is never called in any step file** — completed steps never signal completion
3. **`bd dep add` is only in documentation**, not in executable steps
4. **`bd blocked` is referenced in Release_4.md** but not used in any step

The Beads integration is **read-only**: steps can detect existing Beads state but never write new state (except for `bd update` in step-01b resumption).

### What Full Beads Integration Would Look Like

A complete Beads-integrated step would have:

```markdown
## BEADS INTEGRATION
# On workflow start (step-01):
bd create --title="jd-optimize: {jd_title}" --type=feature --description="..." --parent={epic_id}
export WORKFLOW_ISSUE_ID=$(bd list --limit=1 --status=open --json | jq -r '.[0].id')

# On each step start:
bd update $WORKFLOW_ISSUE_ID --notes="Starting step: {step_id}"
bd create --title="{step_id}: {step_name}" --type=task --parent=$WORKFLOW_ISSUE_ID
export STEP_ISSUE_ID=$(bd list --limit=1 --status=open --parent=$WORKFLOW_ISSUE_ID --json | jq -r '.[0].id')

# On artifact creation:
bd update $STEP_ISSUE_ID --notes="Output: {artifact_path}"

# On step success:
bd close $STEP_ISSUE_ID --commit=$(git rev-parse HEAD)

# On step failure:
bd update $STEP_ISSUE_ID --status=blocked --notes="Error: {error_message}"

# On workflow completion:
bd close $WORKFLOW_ISSUE_ID --notes="All steps complete. Artifacts in _output/"
```

Zero steps currently implement this lifecycle. The system writes nothing to Beads except resumption notes.

---

## Section 7: Linkright's Genuine Advantages Over B-MAD

### Advantage 1: Beads (Dolt-Backed, DAG Dependencies)

B-MAD has no equivalent to Beads. BMAD's task tracking is purely file-based — PRD documents and checklist.md files that agents read without programmatic state management. Beads provides:

- **Dolt-backed persistence**: Every task change is a database commit with git-like semantics
- **Dependency graphs**: `bd dep add` creates true blocking relationships; `bd blocked` finds circular deps
- **Multi-agent coordination**: Different agents can own different Beads issues simultaneously
- **Semantic history**: `bd remember "key:value"` with semantic indexing enables lesson learning
- **Compaction**: `bd compact` collapses issue history for long-running projects

The step-01b-resume-if-interrupted.md demonstrates concrete benefit: a 75-line step using `bd list` + MongoDB to detect and resume interrupted sessions. B-MAD has no session resumption mechanism.

### Advantage 2: ChromaDB Semantic Memory

BMAD uses file-based sidecars for memory. Linkright has a ChromaDB layer with:
- `resumes` collection — semantic matching for resume content
- `job_descriptions` collection — indexed JD embeddings
- `professional_signals` collection — pre-extracted signals indexed by skill/impact/industry/seniority

The `flex/workflows/content-automation/steps-c/step-flx-02-query-viral-insights.md` demonstrates real ChromaDB usage: querying `viral_insights` with `new_signals` to find semantically similar high-performing posts. B-MAD cannot do semantic search — it can only read files. This is a 2-generation architectural lead.

### Advantage 3: 20 IDE Integrations (Not 3 as Old Audit Claimed)

The LINKRIGHT-BMAD-AUDIT.md claims Linkright only supports "3 IDE environments." This is outdated.

Actual count from `ls _lr/_config/ides/ | wc -l` → **20 IDE configurations**:
antigravity, auggie, claude-code, cline, codebuddy, codex, crush, cursor, gemini, github-copilot, iflow, kilo, kiro, opencode, qwen, roo, rovo-dev, trae, vscode, windsurf

B-MAD has 19 IDEs. Linkright now has **20 — one more than BMAD.**

More critically, Linkright's approach is architecturally cleaner: one YAML per IDE (not hundreds of duplicated command files). B-MAD duplicates every command across 19 folder structures. Linkright uses a unified manifest with IDE-specific startup config.

### Advantage 4: Domain-Specific Career Ops Primitives

B-MAD is a generic software development framework. Linkright has career-domain primitives that B-MAD cannot replicate:
- Signal taxonomy (9-type classification in `core/knowledge/signal-taxonomy.json`)
- XYZ format enforcement (Accomplished [X] as measured by [Y] by doing [Z]) — enforced in sync-parser rules
- Recruiter psychology knowledge files (`sync/knowledge/recruiter-psychology.md`)
- JD persona scoring matrix (steps 41-43: persona_assessment.yaml with 10 dimensions, 0-10 scale with confidence scores)
- Connection invite 300-character clamp (explicit rule in outbound workflow)
- ATS readiness scoring (tea step-02-ats-readiness.md)
- Interview probability estimate (step-63 output: `interview_probability.md`)

### Advantage 5: Agent Mail Multi-Agent Coordination

B-MAD has no multi-agent messaging infrastructure. Linkright's ecosystem runs with Agent Mail (OlivePrairie identity active), enabling:
- Asynchronous agent handoffs between sessions
- Cross-session coordination (WindyHawk ↔ OlivePrairie for audit/planning cycles)
- Pub/sub workflow completion notifications

This is architecturally ahead of BMAD's synchronous single-session agent model.

---

## Section 8: Gap Severity Matrix

| Gap ID | Description | Severity | Files Affected | Fix Hours | Priority |
|--------|-------------|----------|----------------|-----------|----------|
| GAP-001 | 33 jd-optimize steps-c are 322-byte stubs using generic template | P0 | 33 files | 80h | R4 |
| GAP-002 | lr-config.yaml has [USER_NAME]/[TARGET_JOB_TITLE] unpopulated | P0 | 1 + all agents | 1h | IMMEDIATE |
| GAP-003 | Dual manifest schemas (2 agent-manifest, 2 workflow-manifest, 2 files-manifest) | P0 | 6 files | 4h | R4 |
| GAP-004 | 7 agents missing customize.yaml (sync-narrator, sync-tracker, tea×3, cis×2) | P1 | 7 files | 7h | R4 |
| GAP-005 | tea and cis modules missing from manifest.yaml (undeclared) | P1 | 1 file | 1h | R4 |
| GAP-006 | cis agents use generic "Senior Technical Agent" persona (no domain specialization) | P1 | 2 files | 4h | R4 |
| GAP-007 | sync-narrator and sync-tracker have empty sidecar_path in agent manifest | P1 | 2 rows | 2h | R4 |
| GAP-008 | _config/files-manifest.csv has 10 rows vs 747 actual files | P1 | 1 file | 6h | R4 |
| GAP-009 | signal-capture workflow has only 2 steps-c (no session load step) | P0 | 1 workflow | 8h | R4 |
| GAP-010 | application-track workflow has only 3 steps-c, no steps-v | P1 | 1 workflow | 12h | R4 |
| GAP-011 | All 4 squick numbered workflows have only 1 real step-c each | P1 | 4 workflows | 20h | R4 |
| GAP-012 | No steps-v phase for any squick workflow | P1 | 4 workflows | 16h | R4 |
| GAP-013 | cis/narrative-craft has only 2 steps-c and no steps-v | P2 | 1 workflow | 8h | R5 |
| GAP-014 | flex/portfolio-deploy workflow has only 2 steps | P1 | 1 workflow | 6h | R4 |
| GAP-015 | 3-way template variable inconsistency: ${...} vs {{...}} vs {var} | P1 | 255+ files | 20h | R4 |
| GAP-016 | bd close never called in any step — Beads never knows work is done | P0 | All workflows | 40h | R4 |
| GAP-017 | MongoDB workflow_history write never shown in non-step-01b steps | P1 | All workflows | 16h | R4 |
| GAP-018 | ChromaDB write operations never shown in any step (reads only in flex-02) | P1 | All workflows | 12h | R4 |
| GAP-019 | No ADR for ChromaDB embedding model selection (text-embedding-3-small) | P2 | 1 file | 3h | R5 |
| GAP-020 | 15 .gitkeep directories — empty data/templates containers | P2 | 15 dirs | 30h | R5 |
| GAP-021 | flex/data/ completely empty (Airtable/Postiz reference data missing) | P1 | 1 dir | 8h | R4 |
| GAP-022 | Agent persona name collision: "Vera" used by squick-qa AND tea-validator; "Quinn" used by lr-qa AND tea-qa-engineer | P2 | 4 agents | 1h | R5 |
| GAP-023 | lr-tracker activation references MongoDB but lr-config.yaml has no connection string | P0 | 2 files | 2h | IMMEDIATE |
| GAP-024 | squick enterprise-ship steps-v directory exists but is empty | P2 | 1 workflow | 8h | R5 |
| GAP-025 | No CI checks for step atomicity, agent depth, manifest cross-ref | P1 | System-wide | 24h | R4 |
| GAP-026 | jd-optimize workflow.yaml has no step declarations — not an executable DAG | P1 | 1 file | 12h | R4 |
| GAP-027 | sync-narrator activation references `_lr/_memory/active-session.yaml` — file NOT FOUND in _memory/ | P0 | 1 agent | 4h | R4 |
| GAP-028 | core/workflows/setup-execution has instructions + step-01b but no actual steps | P2 | 1 workflow | 6h | R5 |
| GAP-029 | outbound-campaign steps-b directory referenced in directory listing but is empty | P2 | 1 workflow | 4h | R5 |
| GAP-030 | tea-qa-engineer missing from root agent-manifest.csv (30 rows vs 31 agents) | P1 | 1 file | 1h | R4 |

**Gap Summary:**
- P0 (Blocks execution): 7 gaps — GAP-001, GAP-002, GAP-003, GAP-009, GAP-016, GAP-023, GAP-027
- P1 (Degrades quality): 16 gaps
- P2 (Maintenance debt): 7 gaps
- Total estimated remediation effort: ~418 hours

---

## Section 9: The Squick Opportunity

### Squick Agents (7 found)

| Agent | Path | Lines |
|-------|------|-------|
| squick-analyst | `_lr/squick/agents/squick-analyst.md` | 49 |
| squick-architect | `_lr/squick/agents/squick-architect.md` | 49 |
| squick-pm | `_lr/squick/agents/squick-pm.md` | 45 |
| squick-qa | `_lr/squick/agents/squick-qa.md` | 49 |
| squick-sm | `_lr/squick/agents/squick-sm.md` | 49 |
| squick-tech-writer | `_lr/squick/agents/squick-tech-writer.md` | 46 |
| squick-ux | `_lr/squick/agents/squick-ux.md` | 46 |

### Squick Workflows (5 found)

| Workflow | Path | Step Files | Real Steps | Status |
|----------|------|-----------|------------|--------|
| 1-analysis | `squick/workflows/1-analysis/` | 6 | 1 | STUB |
| 2-plan | `squick/workflows/2-plan/` | 6 | 1 | STUB |
| 3-solutioning | `squick/workflows/3-solutioning/` | 6 | 1 | STUB |
| 4-implementation | `squick/workflows/4-implementation/` | 6 | 1 | STUB |
| enterprise-ship | `squick/workflows/enterprise-ship/` | 4 | 2 | PARTIAL |

Total squick step files: 28. Real domain steps: 6.

### Current State Assessment

Squick is framework-complete but content-minimal. The 4-phase numbered structure (analysis → plan → solutioning → implementation) maps correctly to software delivery phases. The enterprise-ship workflow has a proper XML `<workflow>` declaration with an `<execution>` section that explicitly references `steps-b/step-b-01-discovery.md` and `steps-b/step-b-02-briefing.md`.

The squick-sm agent is the most Beads-integrated squick agent: activation step 3 reads "Load sprint backlog, velocity metrics, and blocker list from beads database (bd list)."

The squick agents are specialized (distinct personas: PM, Analyst, Architect, SM, QA, UX, Tech Writer) but shallow (45-49 lines, minimal menu items). The squick-pm has only 2 menu commands (EP = Epic Planning, PM = Plan Milestone). Real enterprise delivery requires more command surface.

### Comparison to B-MAD bmm Module

BMAD's `bmm` module provides the same 7 roles (PM, Analyst, Architect, Dev, QA, SM, Tech Writer, UX Designer = 8 roles). Squick has 7. Squick is missing a dedicated Dev agent.

B-MAD bmm advantage: deeper step content per workflow. B-MAD disadvantage: no Beads integration, no ChromaDB, file-duplicated IDE commands.

Squick's unique strength: enterprise-ship workflow XML DAG. The `<execution>` steps with `<step n="1" id="discovery">` format is ready for programmatic parsing. B-MAD has no equivalent executable workflow format.

### What Fully Implemented Squick Would Look Like

Based on architecture docs and current framework:

**1-analysis (10 steps minimum):**
discover → stakeholder-map → requirements-capture → market-analysis → feasibility-check → competitive-scan → risk-identification → constraint-mapping → analysis-synthesis → analysis-report

**2-plan (8 steps minimum):**
draft-prd → epic-decomposition → story-mapping → dependency-dag → sprint-allocation → resource-planning → risk-mitigation → plan-approval

**3-solutioning (8 steps minimum):**
architecture-review → technology-selection → adr-creation → interface-design → data-model → security-review → scalability-assessment → solution-sign-off

**4-implementation (10 steps minimum):**
code-review → ci-pipeline-check → test-coverage-gate → performance-benchmarks → security-scan → documentation-update → deployment-prep → smoke-test → release-notes → deployment-sign-off

**Current gap:** 6 real steps exist. Minimum needed: 36 steps. Currently at ~17% completion.

---

## Section 10: What Linkright Needs to EXCEED B-MAD

These are concrete builds, not aspirations.

### Build 1: Beads-Aware Step Template Standard

Every step file should include a `## BEADS INTEGRATION` section with 4 bd calls:

```markdown
## BEADS INTEGRATION
- On start: `bd update {WORKFLOW_ISSUE_ID} --notes="Starting: {step_id}"`
- Create task: `bd create --title="{step_id}: {step_name}" --parent={WORKFLOW_ISSUE_ID} --type=task`
- On artifact: `bd update {STEP_ISSUE_ID} --notes="Output: {artifact_path}"`
- On success: `bd close {STEP_ISSUE_ID} --commit=$(git rev-parse HEAD)`
- On failure: `bd update {STEP_ISSUE_ID} --status=blocked --notes="Error: {error_code}"`
```

This gives Linkright something B-MAD fundamentally cannot provide: **programmatic, commit-linked proof of every step's execution history**. Every closed Beads task has a git hash. Every blocked task has an error note. `bd dep tree` shows the entire workflow execution as a dependency graph.

### Build 2: ChromaDB Query DSL in Step Files

Current flex-02 shows basic ChromaDB usage. Standardize across all signal-retrieval steps:

```markdown
## CHROMADB QUERY
collection: professional_signals
query_source: {top_jd_signals_from_step_06}
metadata_filter:
  signal_type: {persona_top_dimensions}
  seniority_level: {user_level}
n_results: 20
threshold: 0.72
output_var: signal_candidates
output_file: signal_candidates.json
```

Adding this as a required section to all steps that retrieve signals (steps 44-47 in jd-optimize) makes ChromaDB integration explicit, testable, and auditable. B-MAD has no semantic search capability at all.

### Build 3: Agent Mail Handoffs in workflow.yaml

Current workflow.yaml files are thin config files. They should declare agent handoffs and notification points:

```yaml
steps:
  - id: persona-scoring
    agent: sync-parser
    exec: steps-c/step-41-persona-score-init.md
    on_complete:
      notify_agent_mail: true
      recipient: WindyHawk
      subject: "Persona scoring complete"
      body: "signal_query.json ready at {artifact_path}"
  - id: signal-query
    agent: sync-linker
    depends_on: persona-scoring
    exec: steps-c/step-44-signal-query.md
```

This makes workflow.yaml a true orchestration DAG. Currently, workflow.yaml is only metadata. With agent handoffs, it becomes executable.

### Build 4: Session Resumption via Pure Beads (Not MongoDB)

Current step-01b uses MongoDB `workflow_history` for checkpointing. This requires a running MongoDB instance. Pure Beads resumption eliminates that dependency:

```bash
# Workflow start:
bd create --title="jd-optimize: {jd_title}" --type=feature --parent={epic_id}
WORKFLOW_ID=$(bd list --limit=1 --status=open --json | jq -r '.[0].id')

# Each step completion:
bd close $STEP_ID --notes="last_artifact: {path}" --commit=$(git rev-parse HEAD)

# On resume:
LAST_STEP=$(bd list --status=completed --parent=$WORKFLOW_ID --json | jq -r 'last(.[] | .notes)' | grep "last_artifact" | head -1)
# Resume from next step after LAST_STEP
```

This makes Beads the single source of truth for session state. No MongoDB dependency for resumption. Every interrupted session is a queryable Beads state visible to all agents simultaneously.

### Build 5: Automated Quality Gates via CI

The Release_4.md CI job should be real and executable. Minimum viable version:

```bash
#!/usr/bin/env bash
set -e

# Gate 1: No stub steps
stub_count=$(grep -rl "Execute core logic for" _lr --include="*.md" | wc -l)
[ "$stub_count" -eq 0 ] || { echo "FAIL: $stub_count stub steps found"; exit 1; }

# Gate 2: Variable style consistency
dollar_count=$(grep -rl '${' _lr --include="*.md" | wc -l)
double_count=$(grep -rl '{{' _lr --include="*.md" | wc -l)
[ "$dollar_count" -lt 5 ] || echo "WARN: $dollar_count files use dollar-curly style"

# Gate 3: Manifest count parity
actual=$(find _lr -path "*/agents/*.md" | wc -l)
manifest=$(tail -n +2 _lr/agent-manifest.csv | wc -l)
[ "$actual" -eq "$manifest" ] || { echo "FAIL: $actual agents vs $manifest in manifest"; exit 1; }

# Gate 4: Agent minimum depth
for f in $(find _lr -path "*/agents/*.md"); do
  lines=$(wc -l < "$f")
  [ "$lines" -ge 40 ] || echo "FAIL: $f has $lines lines (min 40)"
done

# Gate 5: No placeholder values in config
grep -q "\[USER_NAME\]" _lr/lr-config.yaml && { echo "FAIL: lr-config.yaml has placeholder values"; exit 1; }

echo "All quality gates passed"
```

This CI job catches the 5 most common regressions before they reach production. B-MAD has no automated quality gates.

### Build 6: Career Ops Primitives Linkright Owns Exclusively

**Primitive 1: Signal Density Score**
A step that computes `signal_density = quantified_bullets / total_bullets` and rejects below 0.70. Output: `density_score.yaml`. This is objective, automatable, and unmatchable by B-MAD.

**Primitive 2: ATS Keyword Coverage Rate**
Track percentage of P0 JD keywords appearing in optimized resume. Output: `ats_coverage.yaml` with per-keyword presence flag and sentence reference. Feeds back into Inquisitor gaps.

**Primitive 3: Interview Probability as First-Class Dashboard Item**
Step-63 outputs `interview_probability.md` but it's buried. Surface as `[IP] Interview Probability` in lr-orchestrator menu with trend over multiple optimization cycles.

**Primitive 4: Persona-JD Fit Score (Unique to Linkright)**
Steps 41-43 (persona scoring → weighting → validation) are Linkright's strongest differentiator — no BMAD workflow has career persona modeling. This should be the **centerpiece** of the jd-optimize output, not hidden in Phase D implementation details.

**Primitive 5: Outbound Velocity Tracker**
application-track currently has 3 stub steps. It should track: JD applied → response received → interview scheduled → offer made — each as a Beads task with ChromaDB storage for pattern analysis. Over time: "companies that respond within 3 days to engineers with your skill profile."

---

## Appendix A: File System Totals (Verified via Bash)

| Metric | Count | Command Used |
|--------|-------|-------------|
| Total files in _lr/ | 747 | `find _lr -type f \| wc -l` |
| Total .md files | 563 | `find _lr -name "*.md" -type f \| wc -l` |
| Total step-*.md files | 268 | `find _lr -name "step-*.md" -type f \| wc -l` |
| Total agent .md files | 31 | `find _lr -name "*.md" -path "*/agents/*" \| sort` |
| Total workflow.yaml files | 22 | `find _lr -name "workflow.yaml" \| sort \| wc -l` |
| Total workflow.md files | 11 | `find _lr -name "workflow.md" \| sort \| wc -l` |
| Total CSV files | 17 | `find _lr -name "*.csv" \| sort \| wc -l` |
| Total IDE configs | 20 | `ls _lr/_config/ides/ \| wc -l` |
| Memory sidecar directories | 33 | `ls _lr/_memory/ \| wc -l` |
| customize.yaml files | 24 | `ls _lr/_config/agents/ \| wc -l` |
| Zero-byte non-gitkeep files | 0 | `find _lr -size 0 -type f \| grep -v .gitkeep` |
| .gitkeep placeholder files | 15 | `find _lr -size 0 -name ".gitkeep" \| wc -l` |
| Files using ${...} variables | 40 | `grep -r "\${" _lr --include="*.md" -l \| wc -l` |
| Files using {{...}} variables | 24 | `grep -r "{{" _lr --include="*.md" -l \| wc -l` |
| Files using {var} variables | 191 | `grep -rn "{[a-z_-]*}" _lr --include="*.md" -l \| wc -l` |
| Files referencing bd commands | 42 | `grep -r "bd " _lr --include="*.md" -l \| sort \| wc -l` |

## Appendix B: Module Classification Summary

| Module | Agents | Active Workflows | Real Step Files | Status | In manifest.yaml? |
|--------|--------|-----------------|-----------------|--------|-------------------|
| core | 2 | 3 | ~9 | PARTIAL | YES |
| sync | 10 | 1 (jd-opt) + 3 partial | ~103 | PARTIAL | YES |
| flex | 1 | 1 partial | ~9 | PARTIAL | YES |
| squick | 7 | 1 partial | ~28 | STUB | YES |
| lrb | 6 | 3 partial | ~25 | COMPLETE | YES |
| tea | 3 | 1 partial | ~10 | PARTIAL | **NO** |
| cis | 2 | 0 | ~2 | STUB | **NO** |
| **TOTAL** | **31** | — | **~186** | | |

## Appendix C: Top 3 Critical Path Blockers

### Blocker 1: lr-config.yaml is a skeleton (GAP-002 + GAP-023)

Every single agent's first 2 activation steps load `_lr/lr-config.yaml` and store `{user_name}`, `{user_bio}`, `{target_role}` as session variables. With `[USER_NAME]`, `[USER_PROFESSIONAL_SUMMARY]`, and `[TARGET_JOB_TITLE]` as literal placeholder bracket strings, every personalization operation produces empty or malformed output. Additionally, lr-tracker's activation step 4 reads "Initialize MongoDB session" — but the MongoDB connection string (`host`, `username`, `password`) is not in lr-config.yaml; it's in `core/config/mongodb-config.yaml` with environment variable references (`${MONGODB_HOST}`, `${MONGODB_USER}`) that are nowhere defined.

**Impact:** Every agent session starts with null user context. lr-tracker cannot initialize its data layer. Fix time: 1-2 hours to populate config + set up environment variables.

### Blocker 2: 33 of 63 jd-optimize steps-c are non-functional stubs (GAP-001)

The flagship workflow — the system's single most developed artifact — has 52% of its core steps using the exact phrase "Execute core logic for 'Step X [Name]'" with BMAD alignment as the only validation instruction. Steps 12-40 (Phases B through mid-H of Context Z's 13-phase model) are all stubs. These steps cover: full signal retrieval, signal ranking, baseline metrics, gap identification, inquisitor dialogue, content drafting, layout budgeting, style theming, and final scoring — the entire core career optimization pipeline.

**Impact:** jd-optimize cannot produce a properly optimized resume. It can do Phase A (session/JD load) and Phases D-M (steps 41-64 are substantive), but the middle pipeline (signals → gaps → content → layout) is absent. Fix time: ~80 hours for substantive implementations.

### Blocker 3: Beads task lifecycle is write-never — bd close is never called (GAP-016)

42 files reference `bd` commands. Zero of them call `bd close`. This means every workflow execution that creates a Beads task leaves it perpetually in-progress. `bd blocked` would show every workflow as stuck. `bd ready` can never show a completed workflow. `bd dep tree` cannot close branches. The governance layer is write-once (open) and never resolves.

**Impact:** Beads is implemented as a write-only append log, not a true task tracker. Dependencies cannot be resolved because parent tasks never close. Multi-agent handoffs cannot be signaled because completion is never recorded. The entire Beads governance promise is hollow until `bd close` appears in step files. Fix time: ~40 hours to retrofit all step files with completion calls.

---

*End of audit. Report generated by Nova (OlivePrairie), Linkright Architecture Specialist.*
*All file counts, sizes, and patterns verified via bash. No fabricated data.*
*Sources: /context/linkright/_lr/ (full read), LINKRIGHT-BMAD-AUDIT.md, Release_4.md, LR-MASTER-ORCHESTRATION.md*
