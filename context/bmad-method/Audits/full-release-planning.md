# Full Release Planning — Linkright v4.0 Deep Structural & Capability Audit

You are an expert systems auditor, principal architect, and staff-level product engineer performing a **comprehensive structural, architectural, and capability audit** of the **Linkright v4.0** system. Your mandate is surgical precision: every file read, every gap catalogued, every recommendation traceable to a concrete finding.

---

## System Identification

Three conceptual systems exist inside this repository:

| Label | Name | Location | Role |
|-------|------|----------|------|
| **System X** | Linkright | `linkright/` | Production implementation (audit target) |
| **System Y** | BMAD Method | `bmad-method/` | Reference architecture (inspiration only) |
| **System Z** | Product Context | `context/` | Capability requirements and specifications |

### Critical Identity Rule

System Y branding (`BMAD`, `bmad`, `bmm`, `gds`, `bmb`) must **never** appear inside System X. System Y is a structural reference — its patterns may inspire but its identity must not leak. Any BMAD branding found inside X is a **P0 bug**.

---

## Release History and Regression Protocol

### Prior Release

A previous audit was completed and saved in:

```
Release_1.md
```

That document contains **3 epics**, **24 tasks**, and **49 subtasks** covering forward audit, reverse audit, and quality/restructuring findings. All identified issues were addressed in a subsequent fix cycle.

### Current Release

This audit cycle produces a **new** document:

```
Release_2.md
```

### Immutable Rules

- `Release_1.md` must **never** be modified, renamed, moved, or deleted
- All new findings go **exclusively** into `Release_2.md`
- Every finding in Release_1 must be **regression-checked** — if a previously-fixed issue has regressed, it is classified as a **BUG** (see Bug Detection Protocol below)

---

## Bug Detection Protocol

During this audit, you must actively check whether issues identified in Release_1 were actually resolved. For each Release_1 finding, verify the fix by reading the actual file.

### Release_1 Findings to Regression-Check

These are the specific findings from Release_1 that must be verified:

| Release_1 ID | Finding | Expected Fix |
|--------------|---------|-------------|
| Finding 1.1 | Missing root files (`LR-SYSTEM-ONBOARDING.md`, `LR-MASTER-ORCHESTRATION.md`, etc.) | Files should exist at `linkright/` root |
| Finding 1.2 | Missing `_lr-output/` and `docs/` directories | Directories should exist at `linkright/` root |
| Finding 2.1 | Duplicate manifest architecture (`_lr/_config/manifests/` subfolder) | Subfolder should be deleted; CSVs at `_lr/_config/` only |
| Finding 2.2 | Missing 24 agent `.customize.yaml` files | All 29 agents should have a corresponding `.customize.yaml` in `_lr/_config/agents/` |
| Finding 3.1 | Missing `_lr/_memory/` sidecar architecture | `_memory/` directory should exist with per-agent sidecar folders |
| Finding 4.1 | Externalized `.spec.md` files (maintenance overhead) | `.spec.md` contents should be absorbed into primary agent `.md` files; `.spec.md` files should not exist |
| Finding 4.2 | Missing `<menu-handlers>` in agents | Every agent XML block should contain `<menu-handlers>` with `exec`, `data`, `workflow`, `action` handlers |
| Finding 5.1 | Empty `signal-capture/` and `application-track/` workflow directories | Should contain workflow skeleton files |
| Finding 5.2 | Legacy `steps/` folder in `jd-optimize` alongside `steps-c/e/v` | Legacy `steps/` should be removed |
| Finding 6.1 | Missing 13 reference data files for `jd-optimize` | `data/reference/` should contain the 13 schemas from Context Z |
| Finding 7.1 | Missing cross-IDE onboarding configs at root | `.claude/commands/`, IDE configs should exist |
| Finding 8.1 | Instruction strictness and persona drift | Agents should have strict `<rules>` with conditional error handling |
| Finding 8.2 | Missing web-research tool manifest entries | `tool-manifest.csv` should register web-research capabilities |
| FQ-1.1 | `lr-orchestrator` menu-handlers incomplete (only `exec` and `action`) | Should have `exec`, `data`, `workflow`, `action` handlers |
| FQ-1.1b | `lr-orchestrator` references `workflow.md` but actual file is `workflow.yaml` | `exec=` path should match actual filename |
| FQ-1.2 | Sync agents missing `<menu-handlers>` blocks | All sync agents should have `<menu-handlers>` |
| FQ-1.3a | `squick-analyst` has no `<rules>` or `<menu-handlers>` | All squick agents should have both |
| FQ-1.3b | `flex-publicist` references non-existent sidecar path | Sidecar directory should exist OR `hasSidecar="false"` |
| FQ-1.3c | LRB agents use fictional character names (`bond.md`, `q.md`, etc.) | Should be renamed to functional names (`lr-builder.md`, `lr-qa.md`) |
| FQ-2 | 4 of 6 `workflow.yaml` files are 0 bytes | All `workflow.yaml` files should be populated with BMAD-parity schema |
| FQ-3 | Step files lack mandatory execution protocols | Steps should have `## MANDATORY EXECUTION RULES`, `## EXECUTION PROTOCOLS`, `## CONTEXT BOUNDARIES`, `## INPUT/OUTPUT`, `## FORBIDDEN` |
| FQ-4a | Templates are decorative stubs with `...` placeholders | Templates should have YAML frontmatter, structured fields, merge variables |
| FQ-4b | Missing workflow support files (instructions.md, checklist.md per workflow) | Every workflow should have complete support file set |
| FQ-5a | Step files have no explicit dependency metadata | Steps should have `## DEPENDENCIES` section |
| FQ-5b | No session continuity mechanism (`step-01-load-session-context.md`) | First two steps of every workflow should be session load + resume |

### Bug Classification Format

If a regression is found:

```markdown
### BUG-[NNN]: [Short title]

- **Release_1 Reference:** [Finding ID from table above]
- **Expected State:** [What the fix should have produced]
- **Actual State:** [What was found during this audit — include file path and line number]
- **Root Cause:** [Why the fix didn't stick — was it never applied? Partially applied? Overwritten?]
- **Severity:** P0 | P1 | P2
- **Recommended Fix:** [Specific action with exact file paths]
```

All bugs go under:

```
Epic: Bugs and Miscellaneous Work
  └── Feature: Release_1 Regression Bugs
       └── User Story → Atomic Tasks (one per bug)
```

---

## Read-Only Audit Contract

### Allowed Actions

- Read any file in `linkright/`, `bmad-method/`, `context/`
- Analyse structure, syntax, architecture, content quality
- Compare files across systems
- Write recommendations and findings

### Forbidden Actions

- Editing, creating, renaming, moving, or deleting **any** file in the repository
- Modifying git state
- Running build or install commands

### Output Destination

All analysis results are written **exclusively** into:

```
Release_2.md
```

This is the **only** file that may be created or written to.

---

## Exhaustive Read Protocol

You must read **every file** in these three directories recursively:

```
linkright/          → System X (29 agents, 22 workflows, 7 modules)
bmad-method/        → System Y (27 agents, 26 workflows, 6 modules)
context/            → System Z (5 specification documents)
```

### Mandatory File Inventory to Read

#### System X — Linkright (`linkright/`)

**Root-level files (4):**
- `LINKRIGHT-BMAD-AUDIT.md`, `LR-MASTER-ORCHESTRATION.md`, `LR-SYSTEM-ONBOARDING.md`
- `SYNC-DESIGN-AND-TECHNICAL-SPECS.md`, `SYNC-PRODUCT-AND-STRATEGY.md`

**Configuration hub (`_lr/_config/`) — verify:**
- `manifest.yaml` — check version, module list, IDE list (note: `vscode` and `windsurf` are duplicated in current manifest)
- `agent-manifest.csv` — verify all 29 agents registered
- `workflow-manifest.csv` — verify all 22 workflows registered
- `tool-manifest.csv` — verify web-research tools registered (Finding 8.2 regression check)
- `files-manifest.csv`, `task-manifest.csv`, `lr-help.csv`
- All 26+ files in `agents/` subdirectory (one `.customize.yaml` per agent)
- `custom/config.yaml`, `custom/agent-overrides.yaml`, `custom/persistent-memories.yaml`

**Memory system (`_lr/_memory/`) — verify:**
- `config.yaml`
- All 27 sidecar directories (each should contain `instructions.md` + `memories.md`)
- Special: `sync-parser-sidecar/core-signals.json`, `core-sidecar/core-signals.json`

**Core module (`_lr/core/`) — read every file:**
- Agents: `lr-orchestrator.md`, `lr-tracker.md` + any `.customize.yaml`
- Config: `chromadb-config.yaml`, `installer.yaml`, `mongodb-config.yaml`
- Knowledge: all 8 files (`command-syntax.md`, `global-constraints.md`, `lr-principles.md`, `persona-properties.md`, `quick-start.md`, `signal-taxonomy.json`, `signal-taxonomy.md`, `system-definitions.md`)
- Tasks: `adversarial-review.md`, `editorial-review.md`, `help.md`, `shard-doc.md`
- Workflows: `brainstorming/`, `context-gen/`, `document-system/`, `lr-discuss/`, `party-mode/` — every file in every subdirectory

**CIS module (`_lr/cis/`) — read every file:**
- Agents: `cis-architect.md`, `cis-engineer.md` + customize yamls
- Workflows: `narrative-craft/` — every file

**Flex module (`_lr/flex/`) — read every file:**
- `config.yaml`, `module-help.csv`
- Agent: `flex-publicist.md` + customize yaml
- Knowledge: `viral-mechanics/mechanics-v1.md`
- Workflows: `content-automation/` — every file including `steps-c/` (5 steps), `data/reference/`, `templates/`

**LRB module (`_lr/lrb/`) — read every file:**
- Agents: `lr-agent-builder.md`, `lr-analyst.md`, `lr-module-builder.md`, `lr-qa.md`, `lr-test-engineer.md`, `lr-workflow-builder.md` + customize yamls
- Scripts: `install-stubs.sh`
- Workflows: `agent/` (3 workflow variants + extensive `data/` + `steps-c/e/v` + `templates/`), `module/` (4 workflow variants + `data/` + `steps-b/c/e/v`), `qa/` (2 workflows + `data/` + `steps-g/o`)

**Squick module (`_lr/squick/`) — read every file:**
- `config.yaml`, `module-help.csv`
- Agents: all 7 (`squick-analyst`, `squick-architect`, `squick-pm`, `squick-qa`, `squick-sm`, `squick-tech-writer`, `squick-ux`) + customize yamls
- Teams: `default-party.csv`
- Workflows: `1-analysis/`, `2-plan/`, `3-solutioning/`, `4-implementation/`, `enterprise-ship/` — every file

**Sync module (`_lr/sync/`) — read every file:**
- `config.yaml`, `module-help.csv`
- Agents: all 9 (`sync-inquisitor`, `sync-linker`, `sync-narrator`, `sync-parser`, `sync-publicist`, `sync-refiner`, `sync-scout`, `sync-sizer`, `sync-styler`) + customize yamls
- Knowledge: `patterns/alignment-patterns.md`, `patterns/recruiter-psychology.md`, `recruiter-intelligence/patterns-v1.md`
- Teams: `default-party.csv`
- Workflows: `application-track/`, `jd-optimize/`, `outbound-campaign/`, `portfolio-deploy/`, `quick-optimize/`, `signal-capture/` — every file including all `steps-c/e/v`, `data/`, `templates/`
- Special attention: `jd-optimize/` has 15+ reference YAML files — read ALL of them

**TEA module (`_lr/tea/`) — read every file:**
- Agents: `tea-scout.md`, `tea-validator.md` + customize yamls
- Workflows: `resume-validation/` — every file

**Output directories:**
- `_lr-output/` — check subdirectory structure (`docs/`, `flex-artifacts/`, `squick-artifacts/`, `sync-artifacts/`)
- `_lr/_output/` — check for any signal templates

**IDE integration:**
- `.claude/commands/` — read all command files
- `.lr-commands/` — sample 2-3 IDE directories to verify consistency
- `.claude/settings.local.json`, `.gemini/settings.json`

**Installer:**
- `installer/package.json`, `installer/sync.js`

#### System Y — BMAD Method (`bmad-method/`)

Read every file in:
- `_bmad/_config/` — all manifests, all 28 customize yamls
- `_bmad/_memory/` — both sidecar directories
- `_bmad/core/` — `bmad-master.md`, all workflows, all tasks
- `_bmad/bmb/` — all 3 agents, all 3 workflow families (agent/module/workflow), all data, steps, templates
- `_bmad/bmm/` — all 8+ agents, all workflows across `1-analysis/`, `2-plan-workflows/`, `3-solutioning/`, `4-implementation/`, `bmad-quick-flow/`, `document-project/`, `generate-project-context/`, `qa-generate-e2e-tests/`
- `_bmad/cis/` — all 6 agents, all 4 workflows
- `_bmad/gds/` — all 7 agents, all workflows across 4 production phases + support workflows
- `_bmad/tea/` — `tea.md` agent, all 4 testarch workflows (`e2e/`, `integration/`, `trace/`, `unit/`)

#### System Z — Context (`context/`)

Read all 5 documents completely:
- `LINKRIGHT-BMAD-AUDIT.md` (~196 KB)
- `LR-MASTER-ORCHESTRATION.md` (~91 KB)
- `LR-SYSTEM-ONBOARDING.md` (~23 KB)
- `SYNC-DESIGN-AND-TECHNICAL-SPECS.md` (~56 KB)
- `SYNC-PRODUCT-AND-STRATEGY.md` (~45 KB)

---

## Phase 1 — Audit Plan Construction

Before beginning any analysis, construct a **detailed audit plan** with exactly **12 audit tasks**. Each task must be decomposed into **atomic subtasks** with explicit dependencies.

### Required Audit Tasks

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| 1 | **Release_1 Regression Sweep** | Verify every Release_1 finding was resolved. Produce regression pass/fail matrix. | None |
| 2 | **Directory Structure Comparison** | Compare complete folder trees of X vs Y. Identify missing directories, extra directories, structural misalignments. | None |
| 3 | **Module Architecture Comparison** | Compare each X module against its Y counterpart: `core↔core`, `sync↔bmm`, `flex↔cis`, `squick↔bmm`, `lrb↔bmb`, `tea↔tea`. Evaluate module `config.yaml` completeness, `module-help.csv` coverage, team definitions. | Task 2 |
| 4 | **Agent Architecture Comparison** | For every agent in X (29) and Y (27): compare XML structure, activation steps, persona depth, menu completeness, handler coverage, rules strictness, sidecar configuration. | Task 3 |
| 5 | **Workflow Architecture Comparison** | For every workflow in X (22) and Y (26): compare `workflow.yaml` schema completeness, `workflow.md` instruction quality, step granularity, data file coverage, template richness, checklist thoroughness. | Task 3 |
| 6 | **Step File Quality Deep-Dive** | Read every `step-*.md` file across both systems. Compare: execution protocol presence, input/output contracts, context boundaries, forbidden actions, dependency declarations, session continuity hooks. | Task 5 |
| 7 | **Template and Checklist Audit** | Read every `*.template.md` and `checklist.md` across both systems. Compare: YAML frontmatter, merge variable syntax, conditional sections, validation rules, field completeness. | Task 5 |
| 8 | **Data and Reference File Audit** | Read every YAML, JSON, and CSV reference file across both systems. Compare: schema richness, ontology coverage, data quality, reference completeness against Context Z specifications. | Task 5 |
| 9 | **Context Z Capability Mapping** | For each capability described in the 5 Context Z documents, trace whether X has: (a) the agent, (b) the workflow, (c) the steps, (d) the data, (e) the templates to support it. Produce a capability coverage matrix. | Tasks 4-8 |
| 10 | **Reverse Comparison (Y → X)** | Identify components present in Y but absent in X. For each, classify as: Required (directly supports Z capabilities), Optional (improves quality but not required by Z), or Irrelevant (domain-specific to Y, e.g., GDS game dev workflows). | Tasks 4-8 |
| 11 | **Architecture Improvement Proposals** | Based on all findings, propose concrete architectural improvements for X covering: module structure, agent design patterns, workflow skeleton standards, template standards, dependency management, session recovery, output routing. | Tasks 1-10 |
| 12 | **Backlog Construction with WSJF Prioritization** | Convert all findings into a structured Epic → Feature → User Story → Atomic Task hierarchy with WSJF scoring and Fibonacci effort estimates. | Task 11 |

### Subtask Decomposition Requirements

Each task above must be broken into atomic subtasks. Examples:

**Task 1 subtasks:**
- 1.1: Read Release_1.md and extract all finding IDs
- 1.2: For each finding, identify the specific file(s) that should have been modified
- 1.3: Read those files and verify the fix was applied
- 1.4: Produce regression pass/fail matrix
- 1.5: For each failure, create a BUG entry

**Task 4 subtasks (per agent):**
- 4.1: Read X agent file, extract XML structure
- 4.2: Read corresponding Y agent file (if exists), extract XML structure
- 4.3: Compare: `<activation>` step count and quality
- 4.4: Compare: `<menu-handlers>` handler types and patterns
- 4.5: Compare: `<rules>` count, strictness level, error handling
- 4.6: Compare: `<persona>` depth (role, identity, communication_style, principles)
- 4.7: Compare: `<menu>` item count, `cmd=` triggers, `exec=`/`workflow=` path accuracy
- 4.8: Verify: all `exec=` and `workflow=` paths point to files that actually exist
- 4.9: Verify: `hasSidecar` flag matches actual sidecar directory existence
- 4.10: Verify: no BMAD branding in X agent files

---

## Phase 2 — Forward Comparison (X vs Y)

Systematically compare System X against System Y across every structural dimension.

### 2.1 Directory Structure Comparison

Produce a side-by-side directory tree showing:

```
X Directory                          Y Equivalent                    Status
─────────────────────────────────    ─────────────────────────────    ──────
linkright/_lr/core/                  _bmad/core/                     ✅ Match
linkright/_lr/sync/                  _bmad/bmm/                      ⚠️ Partial
linkright/_lr/cis/                   _bmad/cis/                      [evaluate]
linkright/_lr/tea/                   _bmad/tea/                      [evaluate]
...                                  _bmad/gds/                      N/A (game-specific)
```

For every directory in Y, determine whether X has an equivalent. For every directory in X, determine whether Y has an equivalent.

### 2.2 Module-Level Comparison Matrix

For each module pair, produce:

| Dimension | X Value | Y Value | Gap |
|-----------|---------|---------|-----|
| Agent count | ? | ? | ? |
| Workflow count | ? | ? | ? |
| `config.yaml` field count | ? | ? | ? |
| `config.yaml` has `output_folder` | ? | ? | ? |
| `module-help.csv` row count | ? | ? | ? |
| `teams/*.yaml` count | ? | ? | ? |
| `default-party.csv` exists | ? | ? | ? |
| Knowledge base file count | ? | ? | ? |

### 2.3 Agent-Level Comparison Matrix

For every agent in X, produce a quality scorecard:

| Agent | Has `<activation>`? | Steps Count | Has `<menu-handlers>`? | Handler Types | Has `<rules>`? | Rule Count | Has `<persona>`? | Persona Fields | Has `<menu>`? | Menu Items | `hasSidecar` | Sidecar Exists? | Broken Refs? |
|-------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|

Do the same for every agent in Y. Then highlight where X agents fall below Y agent quality standards.

### 2.4 Workflow-Level Comparison Matrix

For every workflow in X, produce:

| Workflow | `workflow.yaml` populated? | `workflow.yaml` field count | `workflow.md` exists? | `instructions.md` exists? | `checklist.md` exists? | `steps-c/` count | `steps-e/` count | `steps-v/` count | `data/` file count | `templates/` count |
|----------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|

Do the same for every workflow in Y. Flag any X workflow that has fewer support files than its Y counterpart.

### 2.5 Specific Structural Checks

1. **Manifest integrity:** Does `agent-manifest.csv` list exactly the agents that exist on disk? Are there phantom entries or missing entries?
2. **Workflow manifest integrity:** Does `workflow-manifest.csv` list all workflows on disk?
3. **Path accuracy:** For every `exec=`, `workflow=`, `data=` attribute in every agent's `<menu>`, verify the referenced file exists at the exact path specified.
4. **Config cross-references:** Does `lr-config.yaml` reference modules that actually exist? Does it list modules (`cis`, `tea`) that aren't in the modules list?
5. **Duplicate detection:** Are there duplicate entries in `manifest.yaml` (e.g., `vscode` appears twice, `windsurf` appears twice in IDE list)?

---

## Phase 3 — Reverse Comparison (Y → X)

For every component in Y that has no equivalent in X, classify it:

### Classification Framework

| Classification | Criteria | Action |
|---------------|----------|--------|
| **Required** | Directly supports a capability in Context Z | Must be implemented |
| **Strongly Recommended** | Significantly improves system quality/reliability | Should be implemented |
| **Optional** | Nice-to-have improvement not in Z | Recommend but deprioritize |
| **Irrelevant** | Domain-specific to Y (e.g., GDS game workflows) | Skip |

### Specific Y Components to Evaluate

1. **`_bmad/bmm/workflows/1-analysis/research/`** — 3 specialized research workflows (market, domain, technical). Does X need pre-optimization research workflows?
2. **`_bmad/bmm/workflows/2-plan-workflows/create-prd/`** — PRD creation with validate + edit variants. Does Squick need this?
3. **`_bmad/bmm/workflows/2-plan-workflows/create-technical-design/`** — Technical design docs. Does Squick need this?
4. **`_bmad/bmm/workflows/2-plan-workflows/create-work-breakdown/`** — Work breakdown structure. Does Squick need this?
5. **`_bmad/bmm/workflows/3-solutioning/create-architecture/`** — Architecture decisions. Does Squick need this?
6. **`_bmad/bmm/workflows/4-implementation/implement-features/`** — Feature implementation. Does Squick need this?
7. **`_bmad/bmm/workflows/4-implementation/review-code/`** — Code review with `instructions.xml`. Does Squick need this?
8. **`_bmad/bmm/workflows/bmad-quick-flow/`** — Accelerated workflow paths. Does Sync have `quick-optimize/`?
9. **`_bmad/bmm/workflows/document-project/`** — Self-documentation. Does Core have `document-system/`?
10. **`_bmad/bmm/workflows/generate-project-context/`** — Auto context generation. Does Core have `context-gen/`?
11. **`_bmad/bmm/workflows/qa-generate-e2e-tests/`** — E2E test generation. Does TEA have equivalent?
12. **`_bmad/cis/` (6 agents, 4 workflows)** — Creative intelligence. Does CIS module cover this?
13. **`_bmad/tea/` (1 agent, 4 workflow families)** — Test architecture with unit/integration/e2e/trace. Does TEA module cover this?
14. **`_bmad/bmm/teams/team-fullstack.yaml`** — Team bundle definitions. Do X modules have team yamls beyond `default-party.csv`?
15. **`_bmad/core/workflows/advanced-elicitation/`** — Advanced elicitation techniques. Does Core have this?
16. **`_bmad/bmb/workflows/workflow/`** — Workflow builder (create/edit/validate). Does LRB have this?

For each item above, read the actual files in Y to understand what they contain, then check whether X has an equivalent (even if named differently).

---

## Phase 4 — Context Z Capability Audit

### 4.1 Document-by-Document Capability Extraction

For each Context Z document, extract **every capability claim** and trace it to X:

#### `LR-MASTER-ORCHESTRATION.md` (~91 KB)

Extract and verify:
- All agent definitions (name, role, capabilities) — do they match X's actual agents?
- All workflow specifications (step counts, file lists) — do they match X's actual workflows?
- Signal capture workflow (38-file spec) — does `signal-capture/` have all files?
- JD optimization (53-step spec across 13 phases A-M) — does `jd-optimize/steps-c/` have all steps?
- Application tracking (34-file spec) — does `application-track/` have all files?
- Installer specification (7 source files) — does `installer/` have all files?
- Slash command registry (13 commands) — does `.claude/commands/` have all?
- `lr-output/` structure specification — does `_lr-output/` match?
- Tool manifest requirements (web-research, etc.) — does `tool-manifest.csv` have them?

#### `LR-SYSTEM-ONBOARDING.md` (~23 KB)

Extract and verify:
- IDE setup instructions — do `.claude/`, `.gemini/` configs exist?
- Agent loading sequences — do they match actual agent activation steps?
- Module routing rules — does `lr-orchestrator` implement them?

#### `SYNC-DESIGN-AND-TECHNICAL-SPECS.md` (~56 KB)

Extract and verify:
- Data schemas (signal blocks, JD profiles, company briefs) — do YAML reference files match?
- Scoring algorithms (keyword coverage, ownership match, metric density, persona alignment, scope match) — are they implemented in step files?
- Template specifications — do templates match?
- Integration requirements (MongoDB, ChromaDB, Airtable, Postiz) — are configs present?

#### `SYNC-PRODUCT-AND-STRATEGY.md` (~45 KB)

Extract and verify:
- User journeys — are they supported by workflows?
- Feature specifications — are they implemented?
- Competitive differentiators — are they reflected in agent capabilities?

#### `LINKRIGHT-BMAD-AUDIT.md` (~196 KB)

Extract and verify:
- This is the original audit document — check if its recommendations were followed
- Cross-reference with Release_1 findings

### 4.2 Capability Coverage Matrix

Produce a matrix for every capability:

```
Capability                          Agent(s)     Workflow(s)    Steps    Data    Templates    Status
──────────────────────────────────  ──────────   ──────────    ─────    ────    ─────────    ──────
JD Ingestion & Parsing              sync-parser  jd-optimize   ?/53     ?/13   ?/5          [eval]
Career Signal Capture               [who?]       signal-cap    ?/38     ?/?    ?/?          [eval]
Resume Generation & Optimization    sync-refiner jd-optimize   ?        ?      ?            [eval]
Company Research & Profiling        sync-scout   [which?]      ?        ?      ?            [eval]
Application Tracking                [who?]       app-track     ?/34     ?/?    ?/?          [eval]
Outbound Campaign Orchestration     sync-pub     outbound      ?        ?      ?            [eval]
Portfolio Deployment                [who?]       portfolio     ?        ?      ?            [eval]
Content Automation (Social)         flex-pub     content-auto  ?/5      ?      ?            [eval]
Enterprise Feature Shipping         squick-*     enterprise    ?        ?      ?            [eval]
Career Narrative Crafting           sync-narr?   narrative?    ?        ?      ?            [eval]
Resume Quality Validation           tea-*        resume-val    ?        ?      ?            [eval]
Multi-Agent Collaboration           lr-orch      party-mode    ?        ?      ?            [eval]
System Self-Documentation           [who?]       doc-system    ?        ?      ?            [eval]
Context Auto-Generation             [who?]       context-gen   ?        ?      ?            [eval]
Session Recovery & Continuity       [who?]       [which?]      ?        ?      ?            [eval]
```

---

## Phase 5 — Deep Quality Audit

### 5.1 Agent XML Quality Standards

For every agent file, check against this rubric:

| Quality Check | Standard | Severity if Missing |
|--------------|----------|-------------------|
| YAML frontmatter (`name`, `description`) | Required | P2 |
| Character lock statement ("NEVER break character") | Required | P1 |
| `<agent>` tag with `id`, `name`, `title`, `icon`, `capabilities` | Required | P0 |
| `<activation critical="MANDATORY">` | Required | P0 |
| Step 1: Load persona | Required | P1 |
| Step 2: Load config.yaml with variable storage | Required | P0 |
| Step 2: VERIFY clause (stop if config fails) | Required | P1 |
| Greeting step with persona name + title | Required | P2 |
| STOP and WAIT step | Required | P1 |
| `<menu-handlers>` with 4 handler types (`exec`, `data`, `workflow`, `action`) | Required | P0 |
| Handler type `workflow` loads `workflow.xml` or equivalent OS | Required if module has workflows | P0 |
| `<rules>` block with 3+ rules | Required | P1 |
| Rules include communication language enforcement | Recommended | P2 |
| Rules include file loading constraint | Recommended | P2 |
| `<persona>` with `<role>`, `<identity>`, `<communication_style>`, `<principles>` | Required | P1 |
| `<menu>` with `[MH]` help item | Required | P2 |
| `<menu>` with `[DA]` dismiss item | Required | P2 |
| All `exec=` paths point to existing files | Required | P0 |
| All `workflow=` paths point to existing files | Required | P0 |
| `hasSidecar` flag matches sidecar directory existence | Required | P1 |
| No BMAD branding in any text | Required | P0 |

### 5.2 Workflow YAML Quality Standards

For every `workflow.yaml`, check:

| Field | Required? | Standard |
|-------|-----------|----------|
| `name` | Yes | Must match directory name |
| `description` | Yes | Non-empty, descriptive |
| `config_source` | Yes | Valid path to module config.yaml |
| `installed_path` | Yes | Valid path to workflow directory |
| `instructions` | Yes | Points to existing `instructions.md` |
| `validation` | Yes | Points to existing `checklist.md` |
| `template` | Yes | Points to existing template file |
| `input_file_patterns` | Recommended | At least one pattern with strategy |
| `load_strategy` values | Recommended | `FULL_LOAD` or `SELECTIVE_LOAD` |

### 5.3 Step File Quality Standards

For every `step-*.md`, check:

| Section | Required? | Standard |
|---------|-----------|----------|
| `## MANDATORY EXECUTION RULES` | Yes | Must be first section with icon-based rules |
| `## YOUR TASK` | Yes | Clear, atomic goal statement |
| `## INPUT` | Yes | Explicit list of required inputs |
| `## OUTPUT` | Yes | Explicit list of expected outputs |
| `## EXECUTION PROTOCOLS` | Recommended | Read/analyze/save sequence |
| `## CONTEXT BOUNDARIES` | Recommended | Available variables listed |
| `## FORBIDDEN` | Recommended | Explicit list of prohibited actions |
| `## DEPENDENCIES` | Recommended | Prior steps, data files, templates listed |
| Session continuity hooks (steps 01/01b) | Required for first steps | Load/resume pattern |

### 5.4 Template Quality Standards

For every `*.template.md`, check:

| Quality Check | Standard |
|--------------|----------|
| YAML frontmatter present | `created_at`, `version`, `workflow`, `agent` fields |
| Merge variables use `{variable}` syntax | Not `...` or `[placeholder]` |
| Sections are structurally complete | Not empty or stub |
| Conditional sections documented | `<!-- IF condition -->` comments where applicable |
| Validation comments present | `<!-- REQUIRED: criteria -->` |
| Minimum line count > 30 | Templates should be substantive |

### 5.5 Reference Data Quality Standards

For every `.yaml`, `.json`, `.csv` reference file:

| Quality Check | Standard |
|--------------|----------|
| Valid syntax (parseable) | YAML/JSON/CSV loads without errors |
| Non-empty content | > 5 lines of meaningful content |
| Schema matches usage context | Fields match what agents/steps reference |
| Context Z alignment | Contains fields specified in Z |

### 5.6 Cross-System Consistency Checks

1. **Agent ↔ Manifest alignment:** Every agent `.md` file has a row in `agent-manifest.csv` and vice versa
2. **Workflow ↔ Manifest alignment:** Every workflow directory has a row in `workflow-manifest.csv` and vice versa
3. **Config ↔ Module alignment:** `lr-config.yaml` modules list matches actual module directories
4. **Sidecar ↔ Agent alignment:** Every `hasSidecar="true"` agent has a corresponding `_memory/*-sidecar/` directory
5. **Customize ↔ Agent alignment:** Every agent has a corresponding `.customize.yaml` in `_lr/_config/agents/`
6. **IDE ↔ Commands alignment:** `.lr-commands/` IDE directories match `manifest.yaml` IDE list
7. **Template ↔ Step references:** Templates referenced in step files actually exist
8. **Data ↔ Step references:** Data files referenced in step files actually exist

---

## Phase 6 — Architecture Improvement Proposals

Based on all findings, propose improvements in these categories:

### 6.1 Module Architecture

- Should any modules be merged, split, or restructured?
- Are there missing modules that Context Z requires?
- Is the module boundary clean (no cross-contamination)?

### 6.2 Agent Design Patterns

- Propose a **standard agent template** that all agents should follow
- Identify the highest-quality agent in X and use it as the gold standard
- Identify the lowest-quality agent and specify exactly what needs to change

### 6.3 Workflow Design Patterns

- Propose a **standard workflow skeleton** (mandatory files per workflow)
- Define minimum `workflow.yaml` schema
- Define minimum step file structure

### 6.4 Template Standards

- Propose a **standard template format** with frontmatter, merge variables, validation
- Identify which templates from Context Z are still missing

### 6.5 Dependency and Session Management

- Propose session recovery pattern for all workflows
- Propose inter-step dependency declaration format
- Propose cross-workflow data passing mechanism

### 6.6 Output and Artifact Management

- Verify `_lr-output/` structure matches Context Z specification
- Propose artifact versioning scheme
- Propose output routing configuration in module `config.yaml` files

---

## Phase 7 — Backlog Construction

### Epic Structure

Create exactly **4 epics**:

```
Epic 1: Forward Audit Fixes (X deficient vs Y)
Epic 2: Reverse Audit Fixes (Y components X should adopt)
Epic 3: Quality & Restructuring Fixes (deep quality issues)
Epic 4: Bugs & Miscellaneous Work (regressions from Release_1 + new bugs)
```

### Hierarchy Rules

```
Epic
  └── Feature (logical grouping of related changes)
       └── User Story (one user-facing behavior change)
            └── Atomic Task (one specific file edit or creation)
```

### Target Scale

Aim for approximately:
- **4** Epics
- **20-30** Features
- **50-70** User Stories
- **100-150** Atomic Tasks

Each atomic task must represent **exactly one file change** (edit one file, create one file, or delete one file).

### User Story Format

Every user story must follow this exact format:

```markdown
### US-[Epic#]-[Feature#]-[Story#]: [Short Title]

**User Story:**
As a [role — be specific: "career professional using Sync", "system administrator", "AI agent executing jd-optimize workflow"]
I want [specific capability or fix]
So that [measurable outcome or quality improvement]

**Acceptance Criteria:**
Given [precondition — reference specific file paths]
When [action — reference specific agent or workflow]
Then [expected result — measurable, verifiable]
And [additional criteria if needed]

**Affected Files:**
- `[exact file path]` — [action: create | edit | delete] — [what changes]

**Dependencies:**
- Depends on: US-[x]-[y]-[z]
- Blocks: US-[x]-[y]-[z]
```

### Atomic Task Format

```markdown
#### AT-[Story#]-[Task#]: [Action verb] [target]

- **Action:** Create | Edit | Delete
- **File:** `[exact path]`
- **Change Description:** [1-2 sentences describing the specific edit]
- **Verification:** [How to verify the task is complete]
```

---

## Phase 8 — WSJF Prioritization

### Scoring Dimensions

For every **Feature** (not individual tasks), calculate:

| Dimension | Scale | Description |
|-----------|-------|-------------|
| **Business Value (BV)** | 1-13 (Fibonacci) | How much does this improve end-user capability? |
| **Time Criticality (TC)** | 1-13 (Fibonacci) | How much does delay cost? (P0 fixes = 13, nice-to-haves = 1) |
| **Risk Reduction (RR)** | 1-13 (Fibonacci) | How much does this reduce system fragility? |
| **Job Size (JS)** | 1-21 (Fibonacci) | Estimated implementation effort |

### WSJF Formula

```
WSJF = (BV + TC + RR) / JS
```

Higher WSJF = implement first.

### Effort Estimation Rules

Use **Fibonacci scale only**: `1, 2, 3, 5, 8, 13, 21`

| Effort | Meaning |
|--------|---------|
| 1 | Single file, < 10 lines changed |
| 2 | Single file, 10-50 lines changed |
| 3 | 2-3 files, straightforward changes |
| 5 | 3-5 files, moderate complexity |
| 8 | 5-10 files, significant new content |
| 13 | 10+ files, complex new workflow or module feature |
| 21 | Full module build-out or major architectural change |

### Priority Tiers (based on WSJF)

| Tier | WSJF Range | Release Target |
|------|-----------|----------------|
| **P0 — Ship-blocking** | > 5.0 | Immediate (this sprint) |
| **P1 — High value** | 3.0 - 5.0 | Next sprint |
| **P2 — Medium value** | 1.5 - 3.0 | Backlog (prioritized) |
| **P3 — Low priority** | < 1.5 | Backlog (deprioritized) |

---

## Phase 9 — Final Deliverable Structure

All output must be written into `Release_2.md` with this exact structure:

```markdown
# Release 2 — Linkright v4.0 Full Audit Report

## 1. Executive Summary
- Total findings count
- Critical issues count
- Regression bugs count
- Estimated total effort (sum of Fibonacci points)

## 2. Release_1 Regression Matrix
- Pass/fail table for every Release_1 finding
- BUG entries for any regressions

## 3. Audit Plan
- 12 tasks with subtask decomposition
- Dependency graph

## 4. Forward Comparison (X vs Y)
- Directory structure comparison
- Module comparison matrix
- Agent comparison matrix (all 29 X agents scored)
- Workflow comparison matrix (all 22 X workflows scored)
- Path accuracy audit results
- Manifest integrity audit results

## 5. Reverse Comparison (Y → X)
- Classification of all Y-only components
- Required adoptions
- Recommended adoptions
- Irrelevant exclusions

## 6. Context Z Capability Coverage
- Capability coverage matrix
- Per-document capability trace results
- Gap analysis

## 7. Deep Quality Audit
- Agent XML quality scorecard (29 agents)
- Workflow YAML quality scorecard (22 workflows)
- Step file quality scorecard
- Template quality scorecard
- Reference data quality scorecard
- Cross-system consistency check results

## 8. Architecture Improvement Proposals
- Module restructuring
- Agent template standard
- Workflow skeleton standard
- Template standard
- Dependency management
- Output routing

## 9. Prioritized Backlog
### Epic 1: Forward Audit Fixes
  [Features → User Stories → Atomic Tasks]
### Epic 2: Reverse Audit Fixes
  [Features → User Stories → Atomic Tasks]
### Epic 3: Quality & Restructuring
  [Features → User Stories → Atomic Tasks]
### Epic 4: Bugs & Miscellaneous
  [Features → User Stories → Atomic Tasks]

## 10. WSJF Scoring Table
- Every Feature with BV, TC, RR, JS, WSJF score
- Sorted by WSJF descending
- Priority tier assignment

## 11. Effort Summary
- Total Fibonacci points per epic
- Total Fibonacci points per priority tier
- Recommended sprint allocation

## 12. Appendices
- A: Complete file inventory (X)
- B: Complete file inventory (Y)
- C: Complete file inventory (Z)
- D: Agent quality detail tables
- E: Workflow quality detail tables
```

---

## Confirmation Step

Before starting the audit you must:

1. Confirm you understand the **three-system architecture** (X = Linkright production, Y = BMAD reference, Z = Context requirements)
2. Confirm you will **read every file** in all three systems without skipping any
3. Confirm you will **not modify any existing files** — only create `Release_2.md`
4. Confirm you will **regression-check every Release_1 finding** before proceeding to new analysis
5. Confirm you understand the **Bug Detection Protocol** for regressions
6. Confirm all output will be written **exclusively** to `Release_2.md`
7. List the **12 audit tasks** you plan to execute and their dependencies
8. **Wait for user approval** before beginning analysis

Do not begin any file reading or analysis until the user explicitly approves.
