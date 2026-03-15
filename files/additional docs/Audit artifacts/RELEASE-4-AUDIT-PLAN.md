# Release 4: Comprehensive Quality Audit Plan

**Goal:** Ensure Linkright quality >= BMAD-method across ALL dimensions
**Date:** March 8, 2026
**Scope:** Full-stack audit of System X (Linkright) against System Y (BMAD-method) + Context Z specs
**Prior Art:** Release 1 (231 fixes), Release 2 (10-item backlog), Release 3 (5 enhancements)

---

## Audit Philosophy

Previous audits (R1-R3) focused on **structural parity** — do the folders/files exist? This audit shifts to **quality parity** — is the _content_ inside those files at BMAD-grade or better? A file that exists but contains shallow instructions is worse than no file at all, because it creates false confidence.

**Quality Definition:** A Linkright file meets BMAD-grade when:

1. An AI agent reading it can execute without ambiguity
2. Edge cases and error paths are addressed
3. Naming, structure, and cross-references are consistent
4. The file serves its declared purpose completely (no stubs, no TODOs)

---

# THE AUDIT: 12 DIMENSIONS, 87 VALIDATION POINTS

---

## DIMENSION 1: Zero-Byte & Stub File Elimination

**Why:** R2 found 6 zero-byte files. Stubs are worse than missing files — they signal "done" when work remains.

| #   | Validation Point                                                                                   | Method                                        |
| --- | -------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1.1 | Zero-byte file scan — every file in `_lr/` has >0 bytes                                            | `find _lr/ -type f -size 0`                   |
| 1.2 | Stub detection — no file contains only a heading with no body content                              | Grep for files with <5 non-blank lines        |
| 1.3 | TODO/PLACEHOLDER scan — no file contains `TODO`, `PLACEHOLDER`, `TBD`, `FIXME` in production paths | Grep across all `.md` and `.yaml`             |
| 1.4 | `.gitkeep` audit — gitkeeps only exist in truly empty directories, not alongside real files        | Verify no gitkeep coexists with content files |
| 1.5 | Empty YAML scan — no `.yaml` file is unparseable or contains only comments                         | Parse all YAML files for valid content        |

---

## DIMENSION 2: Agent File Quality

**Why:** BMAD agents have deep XML activation blocks, menu handlers, persona definitions, halting conditions, and rules. R1 found Linkright agents vary from 60-line robust to 15-line stubs.

| #    | Validation Point                                                                                                                   | Method                                                                   |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 2.1  | All agents have `<agent>` XML wrapper with `id`, `name`, `module` attributes                                                       | Parse every agent `.md` for XML structure                                |
| 2.2  | All agents have `<persona>` block with name, role, tone, style                                                                     | Check each persona block has all 4 fields                                |
| 2.3  | All agents have `<activation>` block with proper initialization sequence                                                           | Verify activation exists and is non-trivial                              |
| 2.4  | All agents have `<menu-handlers>` with `exec=`, `data=`, `workflow=` parsing                                                       | Compare handler richness to BMAD reference agents                        |
| 2.5  | All agents have `<rules>` with halting conditions ("NEVER break character")                                                        | Check for strictness parameters                                          |
| 2.6  | Agent depth normalization — no agent has <20 lines of operational content                                                          | Count non-blank lines per agent                                          |
| 2.7  | Agent-to-workflow linkage — every agent referenced in a workflow actually exists as a file                                         | Cross-reference workflow.yaml agent fields against `agents/` directories |
| 2.8  | Agent-to-manifest linkage — every agent file is registered in `agent-manifest.csv`                                                 | Cross-reference file list against CSV                                    |
| 2.9  | No BMAD identity leakage — zero references to `bmad`, `bmm`, `gds`, `cis`, `tea` as identity (architectural pattern references OK) | Grep for identity leaks                                                  |
| 2.10 | Customize YAML coverage — every agent has a corresponding `.customize.yaml` in `_lr/_config/agents/`                               | File existence check                                                     |

---

## DIMENSION 3: Workflow Structural Completeness

**Why:** BMAD has 41 workflows with 364 step files. R2 found Linkright at 17 workflows / 173 steps. Every declared workflow must be fully implemented.

| #    | Validation Point                                                                                | Method                                  |
| ---- | ----------------------------------------------------------------------------------------------- | --------------------------------------- |
| 3.1  | Every workflow directory contains `workflow.yaml` with valid, populated content                 | Read all workflow.yaml files            |
| 3.2  | Every workflow directory contains `workflow.md` (or `instructions.md`) with execution narrative | File existence + content check          |
| 3.3  | Every workflow has `steps-c/` with >=2 step files (not stubs)                                   | Directory + content audit               |
| 3.4  | Every workflow has `steps-e/` with >=2 step files (not stubs)                                   | Directory + content audit               |
| 3.5  | Every workflow has `steps-v/` with >=2 step files (not stubs)                                   | Directory + content audit               |
| 3.6  | Every workflow has `data/` directory (even if only reference/)                                  | Directory existence                     |
| 3.7  | Every workflow has `templates/` directory with >=1 output template                              | Directory + file check                  |
| 3.8  | `workflow-manifest.csv` is populated and lists ALL workflows with correct paths                 | CSV content validation                  |
| 3.9  | No empty workflow directories — every declared workflow in manifests/docs has real content      | Cross-reference declared vs implemented |
| 3.10 | Workflow chaining — cross-workflow data flows (shared-data/) are documented and paths resolve   | Verify shared-data references           |

---

## DIMENSION 4: Step File Quality (The Critical Dimension)

**Why:** This is where BMAD truly excels. BMAD step files are atomic, richly instructed, and self-contained. R1/R2 found Linkright steps are often high-level proxies (3 steps covering 53 operations).

| #    | Validation Point                                                                                                        | Method                                         |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| 4.1  | Atomic step principle — each step file performs ONE cognitive operation by ONE agent                                    | Read each step, flag multi-operation steps     |
| 4.2  | Session continuity — every workflow starts with `step-01-load-session-context.md` + `step-01b-resume-if-interrupted.md` | File existence in every steps-c/               |
| 4.3  | `## DEPENDENCIES` section present in every step file                                                                    | Grep all step files                            |
| 4.4  | Agent assignment — every step file names which agent executes it                                                        | Grep for agent reference in step headers       |
| 4.5  | Input/Output contract — every step declares what it reads and what it produces                                          | Check for explicit I/O sections                |
| 4.6  | Error handling — steps that can fail have explicit failure paths                                                        | Read steps that interact with external data    |
| 4.7  | Context Z 13-Phase coverage (A-M) — all 53 steps from Master Orchestration have corresponding step files in jd-optimize | Map Context Z phases against actual step files |
| 4.8  | Step naming convention — all follow `step-NN-verb-noun.md` pattern                                                      | Regex validation on filenames                  |
| 4.9  | Sub-step splitting — complex operations use `step-04a`, `step-04b` pattern (not monolithic)                             | Check for appropriate granularity              |
| 4.10 | Validation steps — every `steps-v/` validates ONE dimension per file (`v-02a-validate-X.md`)                            | Filename + content check                       |
| 4.11 | Edit steps — every `steps-e/` follows load-target -> select-edit -> apply -> review pattern                             | Structure check                                |
| 4.12 | No deprecated `steps/` folders coexisting with modern `steps-c/e/v/`                                                    | Find legacy folders                            |

---

## DIMENSION 5: Data & Reference File Completeness

**Why:** BMAD workflows are powered by rich reference data (schemas, standards docs, CSVs). R1 found Linkright's jd-optimize data/ is missing 13 Context Z reference files.

| #   | Validation Point                                                                                          | Method                                    |
| --- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 5.1 | Context Z 13 reference files present in jd-optimize/data/reference/                                       | File existence check against spec         |
| 5.2 | All data files have substantive content (not placeholder headings)                                        | Content depth audit                       |
| 5.3 | Signal taxonomy file is complete with all signal types from Context Z                                     | Compare against SYNC-PRODUCT-AND-STRATEGY |
| 5.4 | Branded vocabulary file exists and contains Linkright-specific terms                                      | Content check                             |
| 5.5 | Constraints taxonomy covers all JD optimization constraints                                               | Compare against Master Orchestration spec |
| 5.6 | CSV manifest files all parse correctly with valid headers and rows                                        | CSV parse validation                      |
| 5.7 | data/ vs templates/ separation maintained — no output templates in data/, no reference docs in templates/ | Cross-check file purposes                 |
| 5.8 | Knowledge files in `core/knowledge/` are substantive guides, not stubs                                    | Content depth audit                       |

---

## DIMENSION 6: Template Quality

**Why:** BMAD has 49 templates vs Linkright's 21. Templates must be structural shells with clear injection points.

| #   | Validation Point                                                                         | Method                                        |
| --- | ---------------------------------------------------------------------------------------- | --------------------------------------------- |
| 6.1 | Every template uses consistent variable syntax (`{{VARIABLE}}` or equivalent)            | Grep for injection patterns                   |
| 6.2 | Every template variable referenced in a step file has a source (data origin traced)      | Cross-reference step outputs to template vars |
| 6.3 | Templates match their declared output format (markdown template produces markdown, etc.) | Content type validation                       |
| 6.4 | Cover letter template (E1) has all 14 injection points from Release 3 spec               | Variable count check                          |
| 6.5 | Resume/CV templates support theming system (E4) CSS custom properties                    | Check for `--lr-*` tokens                     |
| 6.6 | No hardcoded personal data in templates (names, emails should be variables)              | Grep for literal PII                          |
| 6.7 | Template count per workflow — no workflow has 0 templates                                | Cross-reference                               |

---

## DIMENSION 7: Configuration & Manifest Integrity

**Why:** BMAD has 5 key CSV manifests + manifest.yaml + per-module config.yaml + per-agent customize.yaml. These form the system's routing backbone.

| #    | Validation Point                                                                           | Method                                    |
| ---- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| 7.1  | `agent-manifest.csv` lists ALL agents across ALL modules with correct paths                | File count match                          |
| 7.2  | `workflow-manifest.csv` lists ALL workflows with correct module assignments                | Compare vs directory listing              |
| 7.3  | `files-manifest.csv` is populated (not empty)                                              | Content check                             |
| 7.4  | `task-manifest.csv` is populated (not empty)                                               | Content check                             |
| 7.5  | `tool-manifest.csv` is populated (not empty)                                               | Content check                             |
| 7.6  | `lr-help.csv` contains help entries for every user-facing command                          | Compare vs .lr-commands/                  |
| 7.7  | Per-module `config.yaml` files have valid, meaningful configuration                        | Content depth check                       |
| 7.8  | No duplicate manifest locations — single source of truth per manifest type                 | Check no `_config/manifests/` duplication |
| 7.9  | `manifest.yaml` (system-level) is either populated OR explicitly documented as unnecessary | Status check                              |
| 7.10 | IDE config files (`_config/ides/`) contain valid, parseable YAML                           | YAML parse check                          |

---

## DIMENSION 8: Memory & Sidecar Architecture

**Why:** R1 found all agents declared `hasSidecar="false"`. R2 recommended enabling sidecars for iterative agents. BMAD has 2 sidecars with rich content.

| #   | Validation Point                                                                      | Method            |
| --- | ------------------------------------------------------------------------------------- | ----------------- |
| 8.1 | `_lr/_memory/` directory exists with valid structure                                  | Directory check   |
| 8.2 | Memory config.yaml defines sidecar initialization rules                               | Content check     |
| 8.3 | Iterative agents (sync-linker, sync-refiner, flex-publicist) have `hasSidecar="true"` | Agent file grep   |
| 8.4 | Each sidecar directory has at least one initialized `.md` or `.json` file             | Content existence |
| 8.5 | Sidecar files are referenced in workflow step-01 load context steps                   | Cross-reference   |
| 8.6 | core-signals.json (if present) has valid JSON structure                               | JSON parse check  |

---

## DIMENSION 9: Cross-Reference & Linkage Integrity

**Why:** A system is only as good as its internal consistency. Broken references = broken workflows.

| #   | Validation Point                                                                                    | Method                           |
| --- | --------------------------------------------------------------------------------------------------- | -------------------------------- |
| 9.1 | Every agent referenced in any step file exists as `agents/[name].md`                                | Cross-reference scan             |
| 9.2 | Every workflow referenced in any agent menu-handler exists as a directory                           | Path resolution check            |
| 9.3 | Every data file referenced in any step file exists at the declared path                             | Path resolution check            |
| 9.4 | Every template referenced in any step file exists at the declared path                              | Path resolution check            |
| 9.5 | No orphan files — every file in `_lr/` is referenced by at least one other file or manifest         | Reverse reference scan           |
| 9.6 | Module boundaries respected — sync agents don't reference flex data, etc. (unless via shared-data/) | Cross-module reference audit     |
| 9.7 | All internal paths use `_lr/` prefix (no residual `_bmad/` paths)                                   | Grep for `_bmad` path references |

---

## DIMENSION 10: Content Quality & Instruction Depth

**Why:** This is the qualitative dimension. A file can exist, have structure, and still be shallow. BMAD files have extreme instruction density.

| #    | Validation Point                                                                                                         | Method                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| 10.1 | Instruction strictness — agent files use imperative language ("MUST", "NEVER", "ALWAYS")                                 | Grep for strictness markers      |
| 10.2 | Conditional logic — step files handle branching scenarios ("IF X THEN Y, ELSE Z")                                        | Sample read of 20+ step files    |
| 10.3 | No vague instructions — zero instances of "do something appropriate" or "handle as needed"                               | Grep for vague language patterns |
| 10.4 | Persona consistency — each agent maintains distinct voice/personality across all its step files                          | Sample comparison                |
| 10.5 | Grammatical precision — no broken sentences, incomplete thoughts, or copy-paste artifacts                                | Manual review of sample files    |
| 10.6 | BMAD-grade instruction density benchmark — Linkright step files average >=30 lines of operational content (BMAD average) | Line count comparison            |
| 10.7 | Workflow.md files provide clear execution narrative, not just file listings                                              | Content quality review           |

---

## DIMENSION 11: Release 3 Enhancement Verification

**Why:** Release 3 specifies 5 enhancements (E1-E5). These must be properly scaffolded or implemented.

| #     | Validation Point                                                                      | Method                         |
| ----- | ------------------------------------------------------------------------------------- | ------------------------------ |
| 11.1  | E1 (Cover Letter) — outbound-campaign has steps out-03/03b/03c                        | Step file existence            |
| 11.2  | E1 — `cover_letter.template.md` exists with 14 injection points                       | Template content check         |
| 11.3  | E1 — `cover_letter_payload.json` schema documented                                    | Schema file check              |
| 11.4  | E3 (Beyond the Papers) — portfolio-deploy has steps port-02/02b/02c                   | Step file existence            |
| 11.5  | E4 (Theming) — jd-optimize has steps 34-36 for theming                                | Step file existence            |
| 11.6  | E4 — `--lr-*` CSS namespace defined (not `--md-sys-color-*`)                          | Grep templates for token usage |
| 11.7  | E4 — Company brand preset JSON structure defined                                      | File existence in shared-data/ |
| 11.8  | E5 (Dynamic Bullet Width) — sync-sizer and sync-refiner have width-aware steps        | Step content check             |
| 11.9  | E5 — No hardcoded 88-character budget in step files                                   | Grep for hardcoded values      |
| 11.10 | shared-data/ directory exists with `jd-profile.yaml` and `company_brief.yaml` schemas | File + schema check            |

---

## DIMENSION 12: Identity, Branding & Documentation

**Why:** Linkright must have ZERO BMAD identity leakage while maintaining its own brand consistency.

| #    | Validation Point                                                                 | Method                                           |
| ---- | -------------------------------------------------------------------------------- | ------------------------------------------------ |
| 12.1 | Zero BMAD identity in any user-facing file (agent names, module names, personas) | Grep `_lr/` for `bmad` identity references       |
| 12.2 | Root-level docs present: LR-SYSTEM-ONBOARDING.md, LR-MASTER-ORCHESTRATION.md     | File existence in `linkright/artifacts/` or root |
| 12.3 | CLAUDE.md exists and is comprehensive (not minimal)                              | Content depth check                              |
| 12.4 | All agent persona names are Linkright-branded (Orion, Lyra, Atlas, etc.)         | Agent file audit                                 |
| 12.5 | Design system tokens use `--sync-*` or `--lr-*` prefix (not `--md-*`)            | Token audit                                      |
| 12.6 | Installer package is functional and documented                                   | `installer/` directory audit                     |
| 12.7 | `.claude/commands/` has CLI tools for all major workflows                        | File count + content check                       |
| 12.8 | `.lr-commands/` registry is populated and matches available workflows            | Cross-reference                                  |

---

# EXECUTION PLAN

## Phase 1: Automated Scans (Dimensions 1, 7, 9, 12.1)

Scripted checks: zero-byte files, grep scans, CSV parsing, path resolution, identity leaks.
**Estimated items:** 25 validation points
**Output:** Machine-verifiable PASS/FAIL per item

## Phase 2: Structural Audit (Dimensions 2, 3, 6, 8)

Semi-automated: file existence + header parsing + structure checks.
**Estimated items:** 30 validation points
**Output:** Structural compliance report

## Phase 3: Content Quality Audit (Dimensions 4, 5, 10)

Manual deep-read: step file quality, instruction density, data completeness.
**Estimated items:** 22 validation points
**Output:** Quality scorecard with per-file grades

## Phase 4: Enhancement Verification (Dimension 11)

Release 3 specific: verify E1-E5 scaffolding/implementation.
**Estimated items:** 10 validation points
**Output:** Enhancement readiness matrix

---

# SCORING RUBRIC

Each validation point scored:

| Score       | Meaning                                                                        |
| ----------- | ------------------------------------------------------------------------------ |
| **PASS**    | Meets or exceeds BMAD-grade quality                                            |
| **PARTIAL** | File exists but content is shallow/incomplete                                  |
| **FAIL**    | Missing, empty, broken, or below minimum quality                               |
| **N/A**     | Not applicable to Linkright's architecture (documented justification required) |

**Target:** 0 FAIL, <=5 PARTIAL, remainder PASS/N/A

---

# SUMMARY: 87 VALIDATION POINTS ACROSS 12 DIMENSIONS

| Dimension                               | Points | Focus                               |
| --------------------------------------- | ------ | ----------------------------------- |
| 1. Zero-Byte & Stub Elimination         | 5      | No empty/fake files                 |
| 2. Agent File Quality                   | 10     | Deep agent parity with BMAD         |
| 3. Workflow Structural Completeness     | 10     | Every workflow fully implemented    |
| 4. Step File Quality                    | 12     | Atomic, richly instructed steps     |
| 5. Data & Reference Completeness        | 8      | Context Z reference files present   |
| 6. Template Quality                     | 7      | Injection points, no hardcoded data |
| 7. Config & Manifest Integrity          | 10     | All manifests populated, valid      |
| 8. Memory & Sidecar Architecture        | 6      | Sidecar enablement for key agents   |
| 9. Cross-Reference & Linkage            | 7      | Zero broken internal references     |
| 10. Content Quality & Instruction Depth | 7      | BMAD-grade instruction density      |
| 11. Release 3 Enhancement Verification  | 10     | E1-E5 properly scaffolded           |
| 12. Identity, Branding & Documentation  | 8      | Zero BMAD leakage, full LR brand    |
| **TOTAL**                               | **87** |                                     |

---

# CURRENT STATE SNAPSHOT (Pre-Audit)

_Updated with confirmed data from deep exploration of both systems._

| Metric                           | Linkright                                            | BMAD                              | Gap         | Notes                          |
| -------------------------------- | ---------------------------------------------------- | --------------------------------- | ----------- | ------------------------------ |
| Total files                      | 650                                                  | 897                               | -247        | LR is leaner by design         |
| Directories                      | 102                                                  | ~120                              | -18         | Comparable structure           |
| Agents (registered)              | 32                                                   | 29                                | +3          | LR ahead                       |
| Workflows (in manifest)          | 35                                                   | 76                                | -41         | Significant gap                |
| Modules                          | 7 (core, sync, flex, squick, lrb, cis, tea)          | 6 (core, bmm, bmb, cis, gds, tea) | +1          | LR has extra builder module    |
| Markdown files                   | ~320                                                 | ~728                              | -408        | BMAD 2x+ content density       |
| YAML files                       | ~130                                                 | ~117                              | +13         | LR ahead (config-driven)       |
| CSV files                        | 18                                                   | 35                                | -17         | BMAD has richer data manifests |
| Templates                        | ~10+                                                 | ~49                               | -39         | Major gap                      |
| Knowledge files                  | ~15                                                  | ~60+ (43 TEA + 17 GDS)            | -45         | Major gap                      |
| Sidecar directories              | 27                                                   | 2                                 | +25         | LR far ahead                   |
| IDE configs                      | 24                                                   | 19                                | +5          | LR ahead                       |
| IDE command dirs (.lr-commands/) | 37 (630 files)                                       | 19 (~380 files)                   | +18         | LR ahead                       |
| Customize YAMLs                  | 18                                                   | 28                                | -10         | Minor gap                      |
| Zero-byte files                  | 15 (.gitkeep only)                                   | 0                                 | -15         | Gitkeeps acceptable            |
| CSV Manifests                    | 6+ (some sparse)                                     | 6 (populated)                     | Quality gap | Content depth issue            |
| Prior releases                   | R1 (231 fixes), R2 (10 backlog), R3 (5 enhancements) | N/A                               | —           |                                |

### Key Takeaways from Deep Exploration

**Where Linkright LEADS BMAD:**

- Memory/sidecar architecture (27 vs 2) with governance config
- IDE distribution (37 IDEs, 630 command stubs vs 19 IDEs, ~380 stubs)
- Database integration (MongoDB + ChromaDB vs none)
- Tool registry (5 tools vs 0)
- Hub config pattern (DRY) vs BMAD's replicated configs

**Where Linkright TRAILS BMAD:**

- Workflow count (35 vs 76) — LR has ~46% of BMAD's workflow coverage
- Markdown content volume (320 vs 728) — LR has ~44% of BMAD's documentation mass
- Knowledge base depth (15 files vs 60+) — LR has ~25% of BMAD's knowledge
- Template count (10+ vs 49) — LR has ~20% of BMAD's templates
- CSV data richness (18 vs 35) — LR has ~51% of BMAD's structured data
- Step file depth — BMAD steps are 100-192 lines; LR steps are 15-50 lines

**Critical Quality Gaps (Predicted):**

1. Step file instruction density — LR steps likely PARTIAL across Dimension 4
2. Knowledge base emptiness — CIS and TEA modules have stub agents, no knowledge
3. Template coverage — workflows missing output templates
4. Workflow-manifest content — LR lists 35 but many may be stubs
5. .claude/commands/ — all 19 commands are descriptive stubs without execution logic
