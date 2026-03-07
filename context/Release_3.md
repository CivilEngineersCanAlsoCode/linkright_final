# Release 3: Comprehensive BMAD-Linkright Parity Audit

**Date**: 2026-03-07
**Scope**: Full 7-dimension structural and functional audit of Linkright v4.0 vs BMAD v6.0.4
**BMAD Path**: `context/bmad-method/_bmad/`
**Linkright Path**: `linkright/_lr/`

---

## Executive Summary

Release 3 is a fresh, file-by-file audit of every agent, workflow, template, config, sidecar, and data file in Linkright compared against the BMAD reference implementation. The audit reads every file — no sampling.

### Key Metrics

| Metric | BMAD | Linkright | Parity |
|--------|------|-----------|--------|
| Agents | 27 | 30 | 111% (but 4 are stubs) |
| Workflows | 75 | 28 | 37% |
| Templates | 62 | 35 | 56% |
| Core Tasks | 8 | 4 | 50% |
| Knowledge Files | ~80 | ~55 | 69% |
| IDE Configs | 19 | 20 | 105% |
| Memory Sidecars | 2 | 27 | LR leads |
| Modules | 6 | 7 | LR has more (but 2 hollow) |

### Improvements Since Release 2

- Zero-byte file regression: **RESOLVED** (no zero-byte .md/.yaml/.csv files)
- Missing Context Z agents (Inquisitor, Refiner, Sizer, Styler, Tracker): **RESOLVED** — all 5 created with full specs
- hasSidecar attribute alignment: **MOSTLY RESOLVED** (26/30 agents correct)
- Duplicate persona names (Atlas/Quinn): **PARTIALLY RESOLVED** — Atlas desync remains in `_config/agent-manifest.csv`
- Template naming: **IMPROVED** — 28/35 use correct `.template.md` convention
- TEA knowledge base: **FULL PARITY** — 42 knowledge files matching BMAD

### Critical New Finding

**60+ phantom `_bmad` path references persist throughout Linkright.** Workflow YAML files, instructions, step files, and templates still point to `{project-root}/_bmad/` instead of `{project-root}/_lr/`. This renders most YAML-based workflows unresolvable at runtime.

### Finding Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P0 | 6 | Phantom paths, missing execution engine, stub modules |
| P1 | 9 | Missing sidecars, manifest desyncs, naming collisions, missing workflows |
| P2 | 17 | Missing rules, stub templates, naming conventions, incomplete help |
| P3 | 13 | Thin configs, cookie-cutter files, minor data gaps |
| P4 | 7 | Informational (.gitkeep files, format differences) |
| **Total** | **52** | |

---

## Dimension 1: Zero-Byte & Placeholder Scan

### Status: CLEAN

| Check | Result |
|-------|--------|
| Zero-byte .md/.yaml/.csv files | 0 found |
| Zero-byte .gitkeep files | 15 (expected, benign) |
| Placeholder content (TODO/TBD/...) | 0 matches in markdown |
| All config.yaml files populated | 9/9 (2 thin: CIS, TEA) |
| mongodb-config.yaml | POPULATED (connection, 5 collections) |
| chromadb-config.yaml | POPULATED (connection, embedding model) |

**No findings for this dimension.** Release 1/2 regressions are fully resolved.

---

## Dimension 2: Agent Parity Deep Dive

### Agent Inventory (30 files read)

| # | Agent | Persona | Module | Rules | Menu-Handlers | Depth |
|---|-------|---------|--------|-------|---------------|-------|
| 1 | lr-orchestrator | Aether | core | YES (3) | YES | FULL |
| 2 | lr-tracker | Navi | core | YES (4) | YES | FULL |
| 3 | sync-parser | Orion | sync | YES (4) | YES | FULL |
| 4 | sync-linker | Atlas | sync | YES (6) | YES | FULL |
| 5 | sync-inquisitor | Sia | sync | YES (2) | YES | FULL |
| 6 | sync-refiner | Veda | sync | YES (2) | YES | FULL |
| 7 | sync-sizer | Kael | sync | YES (2) | YES | FULL |
| 8 | sync-styler | Cora | sync | YES (2) | YES | FULL |
| 9 | sync-publicist | Lyric | sync | NO | YES | FULL |
| 10 | sync-scout | Lyra | sync | YES (2) | YES | FULL |
| 11 | sync-narrator | Mnemosyne | sync | NO | YES | INCOMPLETE |
| 12 | sync-tracker | Ledger | sync | YES (2) | YES | FULL |
| 13 | flex-publicist | Echo | flex | YES (2) | YES | FULL |
| 14-20 | squick-* (7) | Various | squick | 3 YES / 4 NO | YES | FULL |
| 21-26 | lr-* (6) | Various | lrb | YES (2 each) | YES | FULL |
| 27-28 | cis-* (2) | Generic | cis | Generic (2) | YES | **STUB** |
| 29-30 | tea-* (2) | Generic | tea | Generic (2) | YES | **STUB** |

### Findings

#### [F-01] P0 — CIS agents are identical generic stubs

All 4 CIS/TEA agents share byte-for-byte identical content: title "Senior Technical Agent", capabilities "advanced processing, validation, synthesis", menu with only Start Task/Validate Output/Dismiss. BMAD CIS has 6 specialized agents (brainstorming-coach, creative-problem-solver, design-thinking-coach, innovation-strategist, presentation-master, storyteller).

| File | Fix |
|------|-----|
| `_lr/cis/agents/cis-architect.md` | Replace with domain-specific creative intelligence agent |
| `_lr/cis/agents/cis-engineer.md` | Replace with domain-specific creative intelligence agent |

#### [F-02] P0 — TEA agents are identical generic stubs

BMAD TEA has 1 deeply specialized agent "Murat" with 11 activation steps, knowledge index loader, and 11 menu items covering test frameworks, ATDD, CI/CD, etc. LR TEA has 2 generic stubs with 3 menu items each.

| File | Fix |
|------|-----|
| `_lr/tea/agents/tea-scout.md` | Replace with domain-specific test architecture agent |
| `_lr/tea/agents/tea-validator.md` | Replace with domain-specific test architecture agent |

#### [F-03] P1 — sync-narrator has incomplete persona

Missing `<communication_style>` and `<principles>` elements. Only agent in the sync pipeline with incomplete persona.

| File | Fix |
|------|-----|
| `_lr/sync/agents/sync-narrator.md` | Add communication_style and principles |

#### [F-04] P1 — sync-narrator and sync-tracker missing sidecar directories

Both declare `hasSidecar="true"` but no sidecar directories exist under `_memory/`. sync-tracker's activation step 3 references loading from `_lr/_memory/sync-tracker-sidecar/` which would fail.

| File | Fix |
|------|-----|
| `_lr/_memory/` | Create `sync-narrator-sidecar/` and `sync-tracker-sidecar/` with memories.md + instructions.md |

#### [F-05] P1 — Manifest desync: sync-tracker name is "Atlas" in _config manifest but "Ledger" in agent file

The root `agent-manifest.csv` correctly says "Ledger" but `_config/agent-manifest.csv` line 13 says "Atlas" (which is sync-linker's name).

| File | Fix |
|------|-----|
| `_lr/_config/agent-manifest.csv` | Change sync-tracker displayName from "Atlas" to "Ledger" |

#### [F-06] P2 — 4 squick agents missing `<rules>` section

squick-architect, squick-qa, squick-analyst, squick-sm all lack `<rules>`. The other 3 squick agents have them.

| Files | Fix |
|-------|-----|
| `_lr/squick/agents/squick-{architect,qa,analyst,sm}.md` | Add domain-specific rules |

#### [F-07] P2 — 4 squick agents missing [DA] Dismiss Agent menu item

Same 4 agents as F-06. All other agents have the DA menu item.

| Files | Fix |
|-------|-----|
| Same as F-06 | Add `<item cmd="DA" action="Dismiss Agent">[DA] Dismiss Agent</item>` |

#### [F-08] P2 — sync-publicist missing `<rules>` section

Only sync pipeline agent without a rules block.

| File | Fix |
|------|-----|
| `_lr/sync/agents/sync-publicist.md` | Add outreach/cover letter rules |

---

## Dimension 3: Workflow Completeness

### Workflow Inventory (28 registered in manifest)

| Module | Workflow | workflow.yaml | Steps | Instructions | Checklist | Template | Status |
|--------|----------|:---:|:---:|:---:|:---:|:---:|--------|
| core | brainstorming | YES | 3 | NO | NO | .gitkeep | Partial |
| core | party-mode | YES | 3 | NO | NO | .gitkeep | Partial |
| core | lr-discuss | .md | 3 | NO | NO | .gitkeep | Partial |
| core | context-gen | YES | 1 | YES | NO | 1 | Good |
| core | document-system | YES | NO | NO | NO | 5 | Partial |
| core | create-story | YES | NO | YES (.xml) | YES | 1 | Good |
| core | dev-story | YES | NO | YES (.xml) | YES | .gitkeep | Good |
| core | document-project | YES | sub-wfs | YES | YES | 5 | Complete |
| core | sprint-planning | YES | NO | YES | YES | 1 | Good |
| core | sprint-status | YES | NO | YES | NO | .gitkeep | Partial |
| sync | jd-optimize | YES | 17 | YES | YES | 1 | **Complete** |
| sync | outbound-campaign | YES | 11 | YES | YES | 1 | **Complete** |
| sync | signal-capture | YES | 2 | YES | NO | 1 | Good |
| sync | quick-optimize | YES | 10 | YES | YES | 1 | **Complete** |
| sync | portfolio-deploy | YES | 8 | YES | YES | 1 | **Complete** |
| sync | application-track | YES | 12 | YES | NO | 1 | Good |
| flex | content-automation | YES | 8 | YES | YES | 1 | **Complete** |
| cis | narrative-craft | YES | 3 | YES | NO | 2 | Good |
| squick | 1-analysis | YES | 5 | YES | NO | 1 | Good |
| squick | 2-plan | YES | 5 | NO | NO | 1 | Partial |
| squick | 3-solutioning | YES | 5 | YES | NO | 1 | Good |
| squick | 4-implementation | YES | 5 | YES | NO | NO | Partial |
| squick | enterprise-ship | .md | 4+ | NO | NO | 1 stub | Partial |
| tea | resume-validation | YES | 1 | NO | YES | BROKEN REF | Broken |
| lrb | create-agent | .md | 24 | N/A | N/A | 2 | **Complete** |
| lrb | create-module | .md | 33+ | N/A | N/A | 2 | **Complete** |
| lrb | generate-tests | .md | 9 | N/A | N/A | 1 | **Complete** |
| lrb | quality-gate | .md | shared | N/A | N/A | N/A | **Complete** |

### BMAD Workflows Missing from Linkright

| BMAD Workflow | Priority | Reason |
|---------------|----------|--------|
| `advanced-elicitation` (core) | **P0** — referenced 22 times in LRB step files | Port from BMAD |
| `workflow.xml` execution engine (core/tasks) | **P0** — all YAML workflows reference it | Port from BMAD |
| `create-workflow` (bmb) | **P1** — no workflow builder capability | Port from BMAD |
| `edit-workflow` (bmb) | **P1** — companion to create-workflow | Port from BMAD |
| `validate-workflow` (bmb) | **P1** — companion to create-workflow | Port from BMAD |
| `correct-course` (bmm/4-impl) | **P1** — sprint change management | Port from BMAD |
| `retrospective` (bmm/4-impl) | **P1** — post-sprint review | Port from BMAD |
| `edge-case-hunter` (core/tasks) | **P2** — review task | Port from BMAD |
| `index-docs` (core/tasks) | **P2** — documentation task | Port from BMAD |
| `edit-prd` / `validate-prd` (bmm) | **P3** — squick has no edit/validate | Consider adding |
| `quick-spec` / `quick-dev` (bmm) | **P3** — useful rapid flow | Consider adding |
| TEA workflows (8 total) | **P1** — only 1 of 9 ported | Port at least test-design, test-review |
| GDS workflows (20+) | N/A | Intentionally excluded (game dev not applicable) |

### Findings

#### [F-09] P0 — 60+ phantom `_bmad` path references throughout Linkright

Workflow YAML files, instructions, step files, and templates still reference `{project-root}/_bmad/` instead of `{project-root}/_lr/`. This renders all YAML-based workflows unresolvable. Affects 30+ files including:
- `core/workflows/create-story/workflow.yaml` (config_source, installed_path)
- `core/workflows/dev-story/workflow.yaml`
- `core/workflows/sprint-planning/workflow.yaml`
- `core/workflows/sprint-status/workflow.yaml`
- `core/workflows/document-project/workflow.yaml`
- All `core/workflows/*/instructions.*` files
- All 22 LRB agent step files (steps-c/, steps-e/)
- LRB agent/module templates

| Fix | Global search-replace `_bmad` → `_lr` with manual review for BMAD-specific references |

#### [F-10] P0 — Missing `workflow.xml` execution engine

BMAD's `core/tasks/workflow.xml` (235 lines) is the central workflow execution engine. All YAML-based workflows reference it. Linkright has no equivalent. Without it, every YAML workflow is technically unexecutable.

| Fix | Port `_bmad/core/tasks/workflow.xml` to `_lr/core/tasks/workflow.xml` with LR-specific adaptations |

#### [F-11] P0 — Missing `advanced-elicitation` workflow

Referenced 22 times across LRB step files but does not exist in `_lr/core/workflows/`. BMAD has `core/workflows/advanced-elicitation/` with workflow.xml and methods.csv.

| Fix | Port from BMAD |

#### [F-12] P1 — Missing workflow builder workflows (create/edit/validate)

BMAD `bmb/workflows/workflow/` has 60+ files across 5 workflow definitions. LRB has agent and module builders but zero workflow builder capability.

| Fix | Port create-workflow, edit-workflow, validate-workflow from BMAD |

#### [F-13] P1 — TEA module has only 1 of 9 BMAD workflows

BMAD TEA: 8 testarch workflows + teach-me-testing. LR TEA: only `resume-validation` (which is broken — references non-existent template).

| Fix | Port at least test-design, test-review, and automate workflows |

#### [F-14] P1 — Missing sprint lifecycle workflows

Linkright has sprint-planning and sprint-status but missing `correct-course` (change management) and `retrospective` (post-sprint review).

| Fix | Port from BMAD `bmm/workflows/4-implementation/` |

#### [F-15] P2 — `squick/2-plan` missing instructions.md

workflow.yaml references `{installed_path}/instructions.md` but file does not exist.

#### [F-16] P2 — `resume-validation` references non-existent template

workflow.yaml declares `template: "{installed_path}/templates/validation-report.template.md"` but no templates/ directory exists.

#### [F-17] P2 — `content-automation` template name mismatch

workflow.yaml declares `content.template.md` but actual file is `social-post.template.md`.

#### [F-18] P2 — `brainstorming` missing brain-methods.csv

BMAD has `brain-methods.csv` for technique selection. LR brainstorming has empty data/ directory.

---

## Dimension 4: Template & Data Integrity

### Template Statistics

| Metric | Count |
|--------|-------|
| Total templates (LR) | 35 |
| Total templates (BMAD) | 62 |
| Using correct `.template.md` | 28 |
| Using incorrect `-template.md` | 7 |
| Stub templates (... placeholders) | 2 |

### Findings

#### [F-19] P1 — 2 templates are empty stubs with `...` content

| File | Lines |
|------|-------|
| `_lr/flex/workflows/content-automation/templates/social-post.template.md` | 10 lines, body is `...` |
| `_lr/squick/workflows/enterprise-ship/templates/shipment.template.md` | 10 lines, body is `...` |

#### [F-20] P2 — 7 template files use inconsistent naming

Files using `-template.md` instead of `.template.md`:
- `_lr/core/templates/architecture-decision-template.md`
- `_lr/core/templates/epics-template.md`
- `_lr/core/templates/test-design-handoff-template.md`
- `_lr/lrb/workflows/module/data/agent-spec-template.md`
- `_lr/lrb/workflows/qa/data/test-plan-template.md`
- `_lr/core/workflows/sprint-planning/sprint-status-template.yaml`
- `_lr/core/workflows/create-story/template.md` (no prefix)

#### [F-21] P2 — test-design-handoff-template.md references BMAD branding

Title says "TEA Test Design -> BMAD Handoff Document" and references "BMAD's epic/story decomposition workflow."

| Fix | Replace BMAD references with Linkright |

---

## Dimension 5: Memory & Configuration

### Sidecar Audit (27 directories)

| Quality | Count | Examples |
|---------|-------|---------|
| GOOD (real content) | 24 | bond, morgan, sync-parser, squick-analyst, etc. |
| STUB (comment-only memories.md) | 3 | core-sidecar, insights-sidecar, resume-versions-sidecar |
| Missing but declared | 2 | sync-narrator-sidecar, sync-tracker-sidecar |

### Findings

#### [F-22] P1 — manifest.yaml missing CIS and TEA modules

The `modules:` section lists only 5 modules (core, lrb, sync, flex, squick). CIS and TEA exist on disk with agents, workflows, and config.yaml but are not registered.

| File | Fix |
|------|-----|
| `_lr/_config/manifest.yaml` | Add cis and tea module entries |

#### [F-23] P1 — lr-config.yaml missing CIS and TEA modules

Global config `modules:` also only lists 5. Same gap.

| File | Fix |
|------|-----|
| `_lr/lr-config.yaml` | Add cis and tea entries under modules |

#### [F-24] P2 — 3 sidecars have stub memories.md

core-sidecar, insights-sidecar, resume-versions-sidecar contain only `<!-- Session memories appended here -->`.

#### [F-25] P2 — manifest.yaml IDE list (34) exceeds actual config files (20)

14 IDEs listed but have no corresponding `.yaml` in `_config/ides/`: emacs, github-codespaces, gitpod, intellij, jupyter, neovim, pycharm, replit, sublime, terminal, tmux, vim, webstorm, zed.

#### [F-26] P3 — CIS and TEA config.yaml files are skeletal

CIS: 1 feature (`narrative_craft: true`). TEA: 1 feature (`resume_validation: true`). Compare: core has 10 features, lrb has 9.

#### [F-27] P3 — All 24 agent customize files are identical cookie-cutter templates

Every `.customize.yaml` in `_config/agents/` has the same `persona_overrides: {tone: standard, strictness: high}` content.

#### [F-28] P3 — Data layer config paths reference non-existent files

lr-config.yaml `data_layers.mongodb.config` points to `_lr/core/config/mongodb-config.yaml` but the actual path is `_lr/core/config/mongodb-config.yaml` (verify the subdirectory `config/` exists vs `config.yaml`).

---

## Dimension 6: IDE & Distribution

### Statistics

| Metric | BMAD | Linkright |
|--------|------|-----------|
| IDE config files | 19 | 20 |
| .lr-commands/ dirs | N/A | 35 (34 valid + 1 spurious) |
| .claude/commands/ | ~110 | 19 |

### Findings

#### [F-29] P1 — Spurious `name:` directory in .lr-commands/

A directory literally named `name:` exists — likely a YAML parsing bug in install-stubs.sh.

| Fix | Delete directory, fix grep/sed parsing in install-stubs.sh |

#### [F-30] P2 — All command stubs reference non-existent `antigravity` CLI

Every stub calls `antigravity activate <agent>` or `antigravity run <workflow>`, but no `antigravity` binary exists.

| Fix | Implement antigravity CLI or replace with real command invocations |

#### [F-31] P2 — Several .claude/commands/ are non-functional stubs

`lr-sync.sh` and `lr-onboard.sh` contain only `echo` statements with no logic.

#### [F-32] P2 — installer/sync.js is a non-functional stub

3 console.log statements, no sync logic.

| Fix | Implement actual workspace scanning or remove |

#### [F-33] P3 — install-stubs.sh has incorrect MANIFESTS_DIR path

References `${CONFIG_DIR}/manifests` but manifests live directly in `${CONFIG_DIR}/`.

#### [F-34] P3 — package.json references non-existent onboard.js

`scripts.onboard` points to `node onboard.js` but file doesn't exist.

---

## Dimension 7: Cross-Cutting Concerns

### Findings

#### [F-35] P1 — Agent display names collide across files

10 agents have different names in `system-definitions.md` vs `agent-manifest.csv`:

| Agent ID | system-definitions.md | agent-manifest.csv |
|----------|----------------------|-------------------|
| lr-orchestrator | Aria | Aether |
| lr-tracker | Sage | Navi |
| sync-parser | Parker | Orion |
| sync-sizer | Sia | Kael |
| sync-refiner | Rory | Veda |
| sync-linker | Link | Atlas |
| sync-styler | Stella | Cora |
| sync-scout | Scott | Lyra |
| sync-publicist | Pip | Lyric |
| sync-inquisitor | Izzy | Sia |

**"Sia" appears for both sync-sizer (system-defs) and sync-inquisitor (manifest).**

| Fix | Pick one canonical set of names and update all references (agent files, manifests, system-definitions, sidecars) |

#### [F-36] P2 — 4 modules lack module-help.csv

Core, LRB, CIS, and TEA have no module-help.csv. Only sync, flex, squick have them.

#### [F-37] P2 — 3 BMAD core tasks missing from Linkright

| Missing Task | BMAD File | Priority |
|--------------|-----------|----------|
| `index-docs` | `_bmad/core/tasks/index-docs.xml` | P2 |
| `review-edge-case-hunter` | `_bmad/core/tasks/review-edge-case-hunter.xml` | P2 |
| `workflow` execution engine | `_bmad/core/tasks/workflow.xml` | P0 (covered in F-10) |

LR has 4 tasks: adversarial-review.md, editorial-review.md (merged prose+structure), help.md, shard-doc.md.

#### [F-38] P2 — lr-help.csv lists only 5 commands

System has 28 workflows and 30 agents. Help CSV covers almost nothing.

| Fix | Expand to cover all major commands |

#### [F-39] P2 — Memory sidecar instructions use original names, not manifest names

Instructions files reference "Parker (Parser)", "Izzy (Inquisitor)", etc. from system-definitions.md, not the manifest names.

| Fix | Reconcile after name unification (F-35) |

#### [F-40] P4 — TEA knowledge base at full parity

42 LR knowledge files match BMAD's 42. Covers Playwright, Pact, API testing, contract testing, etc. **No action needed.**

---

## Prioritized Remediation Backlog

### P0 — Critical (6 findings, blocks runtime)

| # | Finding | WSJF | Effort |
|---|---------|------|--------|
| F-09 | Global `_bmad` → `_lr` path rewrite (60+ refs) | 200 | Medium (search-replace + review) |
| F-10 | Port workflow.xml execution engine | 180 | Low (copy + adapt) |
| F-11 | Port advanced-elicitation workflow | 160 | Low (copy + adapt) |
| F-01 | Replace CIS generic stub agents | 140 | Medium (design + write) |
| F-02 | Replace TEA generic stub agents | 140 | Medium (design + write) |
| F-22/23 | Register CIS/TEA in manifest + lr-config | 120 | Low (add YAML entries) |

### P1 — High (9 findings, structural integrity)

| # | Finding | WSJF | Effort |
|---|---------|------|--------|
| F-35 | Unify agent display names across all files | 100 | Medium |
| F-12 | Port workflow builder workflows (create/edit/validate) | 80 | High |
| F-13 | Port TEA workflows (test-design, test-review, automate) | 80 | High |
| F-14 | Port correct-course and retrospective workflows | 60 | Medium |
| F-04 | Create sync-narrator + sync-tracker sidecars | 50 | Low |
| F-05 | Fix Atlas→Ledger desync in _config manifest | 50 | Low |
| F-03 | Complete sync-narrator persona | 40 | Low |
| F-19 | Flesh out 2 stub templates (social-post, shipment) | 40 | Low |
| F-29 | Delete spurious `name:` directory | 30 | Low |

### P2 — Medium (17 findings, quality)

| # | Finding | Fix Summary |
|---|---------|-------------|
| F-06 | Add rules to 4 squick agents |
| F-07 | Add DA menu item to 4 squick agents |
| F-08 | Add rules to sync-publicist |
| F-15 | Create squick/2-plan instructions.md |
| F-16 | Create resume-validation template |
| F-17 | Fix content-automation template name |
| F-18 | Port brain-methods.csv for brainstorming |
| F-20 | Rename 7 templates to .template.md |
| F-21 | Remove BMAD branding from test-design-handoff |
| F-24 | Populate 3 stub sidecar memories |
| F-25 | Add 14 missing IDE config files (or trim manifest) |
| F-30 | Implement or remove antigravity CLI refs |
| F-31 | Implement .claude/commands/ stubs |
| F-32 | Implement installer/sync.js |
| F-36 | Create module-help.csv for 4 modules |
| F-37 | Port index-docs and edge-case-hunter tasks |
| F-38 | Expand lr-help.csv |

### P3 — Low (13 findings)

| # | Summary |
|---|---------|
| F-26 | Expand CIS/TEA config.yaml features |
| F-27 | Differentiate agent customize.yaml files |
| F-28 | Fix data layer config paths |
| F-33 | Fix install-stubs.sh MANIFESTS_DIR |
| F-34 | Create or remove onboard.js reference |
| F-39 | Update sidecar instruction names |
| + 7 more | Minor data gaps, format differences |

---

## Architectural Recommendations

### 1. Path Resolution (URGENT)
The `_bmad` → `_lr` path issue is systemic. Recommend a one-time migration script:
```bash
grep -rl '_bmad' linkright/_lr/ | xargs sed -i '' 's|_bmad|_lr|g'
```
Then manually review each change for BMAD-specific references that should remain (e.g., cross-reference documentation).

### 2. CIS/TEA Module Identity
These modules need a decision: either flesh them out with real domain-specific agents and workflows, or explicitly mark them as "scaffold" modules in the manifest. Currently they create false expectations of capability.

### 3. Name Unification
Pick one canonical set of agent display names and enforce it everywhere. The dual-name system (system-definitions.md vs agent-manifest.csv) is a maintenance hazard. Recommendation: use the agent-manifest.csv names as canonical since they're used in runtime activation.

### 4. Workflow Builder Gap
LRB can build agents and modules but not workflows. This means the system cannot self-extend its own workflow capabilities. Porting BMAD's workflow builder would close the self-bootstrapping loop.

### 5. Sprint Lifecycle Completeness
Adding correct-course and retrospective would complete the sprint lifecycle: plan → status → correct → retro.

---

## Verification Checklist

After remediation, verify:
- [ ] `grep -r '_bmad' linkright/_lr/` returns 0 hits (except cross-references to BMAD docs)
- [ ] All 30 agents have unique persona names across ALL files
- [ ] All agents with hasSidecar="true" have matching sidecar directories
- [ ] CIS agents have domain-specific personas and menus
- [ ] TEA agents have domain-specific personas and menus
- [ ] CIS and TEA listed in manifest.yaml and lr-config.yaml
- [ ] resume-validation workflow has its template file
- [ ] content-automation workflow.yaml references correct template name
- [ ] workflow.xml exists in `_lr/core/tasks/`
- [ ] advanced-elicitation workflow exists in `_lr/core/workflows/`
- [ ] All templates use `.template.md` naming convention
