# PLAN-10b: File-by-File Change List and Acceptance Criteria for Release 3

**Date**: 2026-03-07
**Scope**: Actionable, file-level change list for all 4 Release 3 enhancements with acceptance criteria per file
**Depends On**:
- `PLAN-10a-IMPLEMENTATION-SEQUENCE.md` (phase sequencing, dependency chains)
- `PLAN-08b-WORKFLOW-DEFINITIONS.md` (step file specifications, schemas)
- `PLAN-08d-DATA-FLOW-PIPELINE.md` (data flow, artifact registry)
- `PLAN-08-07b-INTEGRATION-ARCHITECTURE-SPECS.md` (RACI, workflow modifications map)
- `PLAN-06cde-THEMING-DESIGN.md` (preset JSON schema, CSS property mapping, Identity Horizon)
- `PLAN-03d-04cd-SLIDES-COVERLETTER-DESIGN.md` (slide content schema, cover letter data pipeline)
- `PLAN-05-BEYOND-PAPERS-VIEW-DESIGN.md` (BTP section stack, CSS variables, responsive design)
- `PLAN-09-CROSS-CUTTING-CONCERNS.md` (CSS namespace strategy, performance, accessibility)

---

## TABLE OF CONTENTS

1. [Change List Header -- Summary Counts](#1-change-list-header)
2. [Phase 0: Prerequisites](#2-phase-0-prerequisites)
3. [Phase 1: Foundation -- Brand Theming System (E4)](#3-phase-1-foundation)
4. [Phase 2A: Cover Letter (E1)](#4-phase-2a-cover-letter)
5. [Phase 2B: Beyond the Papers (E3)](#5-phase-2b-beyond-the-papers)
6. [Phase 3: Slides Integration (E2, Conditional)](#6-phase-3-slides-integration)
7. [Phase 4: Polish -- Performance, Accessibility, Fixes](#7-phase-4-polish)
8. [Acceptance Criteria Matrix](#8-acceptance-criteria-matrix)
9. [Integration Test Points Per Phase](#9-integration-test-points-per-phase)
10. [Risk Registry](#10-risk-registry)

---

## 1. Change List Header

### Total File Operation Counts

| Operation Type | Phase 0 | Phase 1 | Phase 2A | Phase 2B | Phase 3 | Phase 4 | **TOTAL** |
|----------------|---------|---------|----------|----------|---------|---------|-----------|
| **CREATE** | 2 | 14 | 4 | 5 | 4 | 0 | **29** |
| **MODIFY** | 68+ | 3 | 7 | 5 | 4 | 18 | **105+** |
| **REWRITE** | 0 | 3 | 1 | 1 | 0 | 0 | **5** |
| **DELETE** | 0 | 0 | 0 | 0 | 0 | 0 | **0** |
| **TOTAL** | **70+** | **20** | **12** | **11** | **8** | **18** | **139+** |

### Enhancement Legend

| Code | Enhancement | Risk Rating | Go/No-Go |
|------|-------------|-------------|----------|
| E1 | Cover Letter (Strategic Fit view) | LOW | GO |
| E2 | Slides Integration (Value Prop view) | CRITICAL | DEFER (conditional Phase 3) |
| E3 | Beyond the Papers (personal narrative) | HIGH | GO -- REDUCED SCOPE |
| E4 | Theming System (CSS variable parameterization) | MEDIUM | GO |

### Base Path Convention

All file paths in this document are relative to `linkright/` unless otherwise noted. The `_lr/` prefix refers to the private configuration directory at `linkright/_lr/`.

---

## 2. Phase 0: Prerequisites

**Gate**: ALL Phase 0 items must complete before ANY Phase 1+ work begins.

---

### P0-01: Global `_bmad` to `_lr` Path Rewrite

| Field | Value |
|-------|-------|
| **File Path** | 60+ files across `_lr/sync/workflows/`, `_lr/_config/`, `.lr-commands/` |
| **Operation** | MODIFY |
| **Enhancement** | ALL (E1, E2, E3, E4) |
| **Phase** | 0 |
| **Description** | Find-and-replace all `_bmad` path references to `_lr` across workflow steps, agent configs, templates, and instruction files. Resolves Finding F-09 (P0). |
| **Dependencies** | None (first operation) |
| **Estimated Effort** | L (3-8hr) -- automated replace + manual review of 60+ files |

**Acceptance Criteria:**
- `grep -r "_bmad" linkright/` returns zero matches
- All 3 existing workflows (jd-optimize, outbound-campaign, portfolio-deploy) resolve their step file paths correctly after rewrite
- All agent instruction and sidecar files reference `_lr/` paths exclusively
- No broken template references introduced by the path rewrite
- Existing workflow validation checklists pass after rewrite

---

### P0-02: Workflow Engine Port/Shim

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflow-engine/` (new directory) or shim in existing config |
| **Operation** | CREATE |
| **Enhancement** | ALL |
| **Phase** | 0 |
| **Description** | Port or shim the workflow.xml execution engine from BMAD to Linkright. If full port is too complex, create a lightweight shim that resolves workflow.yaml template paths to direct file paths. Resolves Finding F-10 (P0). |
| **Dependencies** | P0-01 (paths must be `_lr/` before engine references them) |
| **Estimated Effort** | M (1-3hr) for shim, L (3-8hr) for full port |

**Acceptance Criteria:**
- The engine/shim can resolve `{installed_path}` and `{project-root}` path variables in all 3 workflow.yaml files
- `workflow.yaml` `input_file_patterns` paths resolve to actual files
- Template references in `workflow.yaml` resolve correctly
- No runtime errors when traversing the workflow step sequence for any of the 3 workflows

---

### P0-03: Template Naming Convention Standardization

| Field | Value |
|-------|-------|
| **File Path** | 7 template files using `-template.md` naming |
| **Operation** | MODIFY (rename) |
| **Enhancement** | ALL |
| **Phase** | 0 |
| **Description** | Rename all files matching `*-template.md` to `*.template.md` (dot convention). Update all references in workflow steps, instructions, and workflow.yaml files. Resolves Finding F-20. |
| **Dependencies** | P0-01 (path rewrite must complete first so references are in `_lr/` namespace) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- `find . -name "*-template.md"` returns zero matches across the entire Linkright directory
- All `*.template.md` files are correctly referenced in their parent workflow.yaml
- No broken template references in any step file

---

### P0-04: CSS Namespace Convention Document

| Field | Value |
|-------|-------|
| **File Path** | `context/CSS-NAMESPACE-CONVENTION.md` |
| **Operation** | CREATE |
| **Enhancement** | E3, E4 |
| **Phase** | 0 |
| **Description** | Document the CSS prefix scheme from PLAN-09a: `lr-cv-*` for CV classes, `lr-btp-*` for BTP classes, `--lr-*` for shared CSS custom property tokens. Define scoping containers (`<div class="lr-cv-scope">`, `<div class="lr-btp-scope">`). Define specificity budget. |
| **Dependencies** | None (convention document, no code changes) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Document defines prefix scheme: `lr-cv-*`, `lr-btp-*`, `--lr-*`
- Document defines scoping container pattern with descendant selectors
- Document defines specificity budget (0,2,0 for scoped rules, 0,3,0 for states)
- Document is referenced by Phase 1 and Phase 2B implementors

---

## 3. Phase 1: Foundation -- Brand Theming System (E4)

**Gate**: Phase 0 complete.
**Parallel Tracks**: Track A (theming steps 34-36) and Track B (data export + shared infrastructure) can proceed simultaneously.

---

### P1-01: REWRITE `step-34-style-theming.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/jd-optimize/steps-c/step-34-style-theming.md` |
| **Operation** | REWRITE |
| **Enhancement** | E4 |
| **Phase** | 1 (Track A) |
| **Description** | Replace 13-line stub with full implementation: load `company_brief.yaml`, apply template selection matrix (FAANG->Modern-Minimal, scale-up/data-driven->Modern-Clean, design-led->Modern-Visual), WCAG contrast check (>=4.5:1 against white), CSS variable injection (`--accent-color`), forbidden override rules. Outputs: `selected_template_path` + `theme-override.css`. |
| **Dependencies** | P0-01 (path rewrite), P0-04 (CSS namespace convention) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Step file follows mandatory internal structure (DEPENDENCIES, MANDATORY EXECUTION RULES, EXECUTION PROTOCOLS, INPUT CONTRACT, OUTPUT CONTRACT, NEXT ACTION)
- Template selection matrix covers all 9 combinations of `company_stage` x `pm_culture` with correct template assignments
- WCAG contrast check logic documented: darken by 10% increments up to 3 times, fall back to Sync teal `#0E9E8E`
- Forbidden override rules explicitly listed: no background fills with brand color, no bullet coloring, monochrome body text
- Agent assignment: sync-styler (Cora) as R/A, sync-scout (Lyra) as C
- Output contract declares `selected_template_path` and `theme-override.css` artifact path

---

### P1-02: REWRITE `step-35-style-compile.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/jd-optimize/steps-c/step-35-style-compile.md` |
| **Operation** | REWRITE |
| **Enhancement** | E4 |
| **Phase** | 1 (Track A) |
| **Description** | Replace 13-line stub with full HTML/CSS assembly: load selected template, inject content via 6 slot markers (`<!-- SLOT:HEADER -->` through `<!-- SLOT:EDUCATION -->`), inject `theme-override.css`, apply typography variables (9.5pt/1.35/0.5in), add `@media print` block, output `jd-{uuid}-draft.html`. |
| **Dependencies** | P1-01 (step-34 must define template path and theme-override.css) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- All 6 slot markers documented: `<!-- SLOT:THEME_CSS -->`, `<!-- SLOT:HEADER -->`, `<!-- SLOT:SUMMARY -->`, `<!-- SLOT:EXPERIENCE -->`, `<!-- SLOT:SKILLS -->`, `<!-- SLOT:EDUCATION -->`
- Typography variables specified: `--font-size-body: 9.5pt`, `--line-height-body: 1.35`, `--margin-page: 0.5in`
- `@media print` block includes `@page { size: letter; margin: 0.5in; }` and `-webkit-print-color-adjust: exact`
- One-page verification logic: maximum ~58 lines estimate with overflow warning
- Output contract declares `jd-{uuid}-draft.html` artifact path
- FORBIDDEN: external font imports, external CSS/JS references

---

### P1-03: REWRITE `step-36-style-validation.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/jd-optimize/steps-c/step-36-style-validation.md` |
| **Operation** | REWRITE |
| **Enhancement** | E4 |
| **Phase** | 1 (Track A) |
| **Description** | Replace stub with 6-check validation: (1) sections populated, (2) accent color applied, (3) forbidden overrides absent, (4) print CSS present, (5) one-page estimate <= 58 lines, (6) contrast ratio WCAG compliant. Outputs: `style-validation-report.json`. |
| **Dependencies** | P1-02 (step-35 must produce `jd-{uuid}-draft.html`) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- All 6 validation checks specified with explicit PASS/FAIL conditions
- `style-validation-report.json` schema defined with fields: `jd_id`, `template_used`, `accent_color`, `contrast_ratio`, `checks[]` (6 items), `overall`, `validated_at`
- User presentation logic: formatted table, proposal to fix failing checks
- Agent assignment: sync-styler (Cora)
- Step gate: NEVER mark PASS without all 6 checks evaluated

---

### P1-04: CREATE `step-06b-export-data-contract.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/jd-optimize/steps-c/step-06b-export-data-contract.md` |
| **Operation** | CREATE |
| **Enhancement** | E4 + E1 |
| **Phase** | 1 (Track B) |
| **Description** | Formal data handoff step: serialize `jd-profile.yaml` and `company_brief.yaml` to `_lr/sync/shared-data/`. Closes GAP-02 from PLAN-04a. Cross-reference validation between `jd_profile.company_brief_id` and `company_brief.id`. |
| **Dependencies** | P0-01 (paths must be correct), P1-05 (shared-data directory must exist) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Step inserts into jd-optimize sequence after step-06-final-output and before step-08-persona-score
- `jd-profile.yaml` export includes all fields from master orchestration (lines 720-748): id, company, role_title, seniority, requirements (hard/soft/cultural), keywords_ats, persona_scores, alignment_scores
- `company_brief.yaml` export follows canonical schema v1.0: company_name, company_stage, brand.color_primary/secondary, tone_descriptor, pm_culture, brand_values[], cautions[]
- Both files include schema version header: `# Schema version: 1.0`
- Cross-reference validation: `jd_profile.company_brief_id` matches `company_brief.id`
- Overwrite protection: user prompted before overwriting existing shared-data files

---

### P1-05: CREATE `_lr/sync/shared-data/` Directory

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/shared-data/` |
| **Operation** | CREATE |
| **Enhancement** | E4 + E1 |
| **Phase** | 1 (Track B) |
| **Description** | New shared data exchange directory for cross-workflow data handoff. Houses `jd-profile.yaml` and `company_brief.yaml` produced by jd-optimize step-06b and consumed by outbound-campaign and portfolio-deploy. |
| **Dependencies** | P0-01 (all paths must use `_lr/`) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Directory created at `linkright/_lr/sync/shared-data/`
- Contains a `.gitkeep` or README documenting the directory's purpose
- `jd-profile.yaml` schema documented (v1.0)
- `company_brief.yaml` schema documented (v1.0)

---

### P1-06: CREATE `modern-minimal.html` Resume Template

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/jd-optimize/templates/resume-templates/modern-minimal.html` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 (Track A) |
| **Description** | FAANG/enterprise resume template. Clean, sparse layout with no decorative elements. Contains 6 slot markers for content injection. Designed for conservative corporate environments. |
| **Dependencies** | P1-01 (step-34 defines the template selection matrix referencing this file) |
| **Estimated Effort** | L (3-8hr) |

**Acceptance Criteria:**
- Contains all 6 slot markers: `<!-- SLOT:THEME_CSS -->`, `<!-- SLOT:HEADER -->`, `<!-- SLOT:SUMMARY -->`, `<!-- SLOT:EXPERIENCE -->`, `<!-- SLOT:SKILLS -->`, `<!-- SLOT:EDUCATION -->`
- Valid HTML5 document structure with `<html>`, `<head>`, `<body>`
- Inline `<style>` block with CSS custom property consumption (no external CSS references)
- Print-ready layout: letter-size page, 0.5in margins
- Clean/sparse visual style: no decorative borders, no color backgrounds, minimal visual weight
- Works with `theme-override.css` injection at `<!-- SLOT:THEME_CSS -->` position

---

### P1-07: CREATE `modern-clean.html` Resume Template

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/jd-optimize/templates/resume-templates/modern-clean.html` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 (Track A) |
| **Description** | Scale-up/startup resume template. Moderate visual interest with subtle section dividers. Used for data-driven, engineering-first, and customer-obsessed PM cultures. |
| **Dependencies** | P1-01 (template selection matrix), P1-06 (can share base structure) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Contains all 6 slot markers (same as P1-06)
- Includes subtle section dividers using `var(--accent-color-muted)` for visual separation
- Moderate visual interest: light accent color usage on section headings
- Valid HTML5, inline styles, print-ready
- Visually distinct from `modern-minimal.html`

---

### P1-08: CREATE `modern-visual.html` Resume Template

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/jd-optimize/templates/resume-templates/modern-visual.html` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 (Track A) |
| **Description** | Creative/design-led resume template. Visual accent bars, iconography placeholders. Used for design-led PM cultures at startups and scale-ups. |
| **Dependencies** | P1-01 (template selection matrix), P1-06 (can share base structure) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Contains all 6 slot markers (same as P1-06)
- Includes accent color bars (e.g., vertical sidebar accent or section header underlines using `var(--accent-color)`)
- Iconography placeholder positions for section icons
- Most visually rich of the 3 templates, while remaining print-safe
- Valid HTML5, inline styles, print-ready

---

### P1-09: MODIFY Portfolio CSS `:root` Block -- Token Migration

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS (the main portfolio template `<style>` block) |
| **Operation** | MODIFY |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | Replace 20 existing `--md-sys-color-*` and `--brand-*` tokens with unified `--lr-*` namespace (~100+ tokens across 17 categories per PLAN-06a). Convert 6 hardcoded CV hex values (#202124, #5F6368, #DADCE0, #E0E0E0, rgba(66,133,244,0.08), white) to `--lr-*` variables. |
| **Dependencies** | P0-04 (CSS namespace convention), P1-01/02/03 (theming steps define what tokens are consumed) |
| **Estimated Effort** | L (3-8hr) |

**Acceptance Criteria:**
- All 20 existing `--md-sys-color-*` tokens mapped to `--lr-*` equivalents
- All 4 `--brand-*` tokens (blue, red, yellow, green) mapped to `--lr-brand-*`
- All 6 hardcoded hex values in CSS rules converted to `var(--lr-*)` references
- No hardcoded hex values remain outside `:root {}` definitions (verify via grep)
- Print output visually identical to pre-migration reference (pixel-level comparison)
- All existing visual states (sidebar active, nav hover) unchanged after migration

---

### P1-10: CREATE Brand Preset Directory

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/presets/` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | New directory to house company-specific brand preset JSON files. Each preset maps to `--lr-*` CSS custom properties. Includes schema validation file. |
| **Dependencies** | None |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Directory created at the specified path
- Contains `_schema/brand-preset.v1.schema.json` for validation
- README or directory documentation present

---

### P1-11: CREATE `google.preset.json`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/presets/google.preset.json` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | Google brand preset: multi-chromatic scenario. Primary #4285F4 (blue), secondary #EA4335 (red), tertiary #FBBC05 (yellow), quaternary #34A853 (green). Identity Horizon: segments mode. |
| **Dependencies** | P1-10 (presets directory) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- File validates against `brand-preset.v1.schema.json`
- `brand_id` field is "google" and matches filename stem
- `brand_scenario` is "multi-chromatic"
- All 4 brand colors present and correct hex values
- `identity_horizon.mode` is "segments"
- Gradient definitions present for name, story, timeline, qualities

---

### P1-12: CREATE `amazon.preset.json`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/presets/amazon.preset.json` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | Amazon brand preset: dual-tone scenario. Primary #FF9900 (orange), neutral #232F3E (dark). Identity Horizon: gradient mode. |
| **Dependencies** | P1-10 (presets directory) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- File validates against `brand-preset.v1.schema.json`
- `brand_id` is "amazon", `brand_scenario` is "dual-tone"
- Primary color is #FF9900, neutral is #232F3E
- Identity Horizon gradient defined with start/mid/end stops

---

### P1-13: CREATE `microsoft.preset.json`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/presets/microsoft.preset.json` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | Microsoft brand preset: multi-chromatic. Primary #0078D4 (blue), secondary #7FBA00 (green), tertiary #FFB900 (yellow), quaternary #F25022 (red). |
| **Dependencies** | P1-10 (presets directory) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- File validates against `brand-preset.v1.schema.json`
- `brand_id` is "microsoft", `brand_scenario` is "multi-chromatic"
- All 4 brand colors correct

---

### P1-14: CREATE `spotify.preset.json`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/presets/spotify.preset.json` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | Spotify brand preset: monochromatic. Primary #1DB954 (green), neutral #191414 (dark). |
| **Dependencies** | P1-10 (presets directory) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- File validates against `brand-preset.v1.schema.json`
- `brand_id` is "spotify", `brand_scenario` is "monochromatic"
- Primary #1DB954, neutral #191414

---

### P1-15: CREATE `sync.preset.json`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/presets/sync.preset.json` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | Sync (internal brand) default preset. Primary #0E9E8E (teal), accent #D9705A (coral), gold #C8973A. This is the fallback preset when no company is specified. |
| **Dependencies** | P1-10 (presets directory) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- File validates against `brand-preset.v1.schema.json`
- `brand_id` is "sync"
- Teal #0E9E8E, coral #D9705A, gold #C8973A all present
- Used as the default fallback when no company_brief is available

---

### P1-16: CREATE `_default.preset.json`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/presets/_default.preset.json` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | Default/neutral preset for use when no target company is specified. Provides a professional blue-based appearance. |
| **Dependencies** | P1-10 (presets directory) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- File validates against `brand-preset.v1.schema.json`
- `brand_id` is "default"
- Primary #3B82F6 (professional blue), monochromatic scenario
- Filename uses underscore prefix to signal system file

---

### P1-17: CREATE `brand-preset.v1.schema.json`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/presets/_schema/brand-preset.v1.schema.json` |
| **Operation** | CREATE |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | JSON Schema (draft 2020-12) for validating brand preset files. Defines required fields (`preset_version`, `brand_id`, `brand_name`, `colors.primary`), optional sections (`semantic_overrides`, `identity_horizon`, `gradients`, `fonts`, `meta`). |
| **Dependencies** | P1-10 (presets directory) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Valid JSON Schema draft 2020-12
- All fields from PLAN-06cde Section 1.2 present with correct types and constraints
- `brand_id` pattern: `^[a-z0-9][a-z0-9-]*[a-z0-9]$`
- `colors.primary` is required; all other color fields are optional with documented defaults
- All 5 preset files (google, amazon, microsoft, spotify, sync) + `_default` validate successfully against this schema

---

### P1-18: MODIFY `jd-optimize/workflow.yaml`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/jd-optimize/workflow.yaml` |
| **Operation** | MODIFY |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | Add `output_contracts` section declaring `jd_profile`, `company_brief`, `resume_html`, `theme_override` paths and schema versions. Update description to include "theming and data export". |
| **Dependencies** | P1-04 (step-06b defines the shared-data export paths) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- `output_contracts` section present with 4 entries: `jd_profile`, `company_brief`, `resume_html`, `theme_override`
- Each entry includes `path` and `schema_version` fields
- Description updated to mention theming and data export
- Existing `input_file_patterns` section unchanged

---

### P1-19: MODIFY `outbound-campaign/workflow.yaml` (Prep)

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/workflow.yaml` |
| **Operation** | MODIFY |
| **Enhancement** | E4 (prep for E1) |
| **Phase** | 1 |
| **Description** | Add `company_brief.yaml` (FULL_LOAD) to `input_file_patterns`. This prepares the outbound-campaign workflow for Phase 2A cover letter consumption. |
| **Dependencies** | P1-05 (shared-data directory exists with schema) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- `company_brief` entry present in `input_file_patterns` with strategy `FULL_LOAD`
- Path references `_lr/sync/shared-data/company_brief.yaml`
- Existing input patterns unchanged

---

### P1-20: MODIFY Agent Sidecars (sync-styler, sync-scout)

| Field | Value |
|-------|-------|
| **File Path** | sync-styler `instructions.md` + `memories.md`, sync-scout `instructions.md` |
| **Operation** | MODIFY |
| **Enhancement** | E4 |
| **Phase** | 1 |
| **Description** | sync-styler: Add "Brand Injection Protocol" (contrast check >= 4.5:1, accent on header name + section dividers only, fallback to Sync teal), add "Template Selection Matrix" to memories. sync-scout: Add "Brand Research Protocol" (always extract brand_color_primary, brand_color_secondary, tone_descriptor). |
| **Dependencies** | P1-01 (step-34 defines the protocols these sidecars support) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- sync-styler `instructions.md` contains "Brand Injection Protocol" section
- sync-styler `memories.md` contains "Template Selection Matrix" with all 9 combinations
- sync-scout `instructions.md` contains "Brand Research Protocol" section
- All protocol descriptions match PLAN-08c specifications

---

## 4. Phase 2A: Cover Letter (E1)

**Gate**: Phase 1 complete (shared-data directory + company_brief.yaml schema + `--lr-*` token system).
**Parallel**: Phase 2A and Phase 2B are fully independent and can run simultaneously.

---

### P2A-01: MODIFY `step-01-load-session-context.md` (outbound-campaign)

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/steps-c/step-01-load-session-context.md` |
| **Operation** | MODIFY |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Add loading of `company_brief.yaml` + `jd-profile.yaml` from `_lr/sync/shared-data/`. Add validation of 4 required jd-profile fields. Add 6 session variable stores. |
| **Dependencies** | P1-04 (step-06b produces the shared-data files), P1-05 (shared-data directory) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Loads `company_brief.yaml` from shared-data with graceful fallback if missing (log warning, use defaults)
- Validates 4 required jd-profile fields: `company` (non-empty), `role_title` (non-empty), `requirements.hard` (>=1 entry), `persona_fit_primary` (non-empty)
- If validation fails, STOP with instruction to run jd-optimize first
- 6 session variables set: `{company_name}`, `{role_title}`, `{company_stage}`, `{tone_descriptor}`, `{brand_values}`, `{cautions}`
- Existing session context loading (lr-config.yaml) preserved unchanged

---

### P2A-02: MODIFY `step-out-01-ingest.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/steps-c/step-out-01-ingest.md` |
| **Operation** | MODIFY |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Add tone indicator extraction (formal/conversational/technical/vision-driven language patterns). Add company stage signal inference. Update output contract: `recruiter_profile.json` gains `recruiter_tone_indicators[]` and `company_stage_inferred`. |
| **Dependencies** | P2A-01 (session context must be loaded first) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Tone indicator patterns documented for all 4 types (formal, conversational, technical, vision-driven)
- Company stage signals documented for all 4 stages (FAANG, enterprise, scale-up, startup)
- Output contract updated: `recruiter_profile.json` includes `recruiter_tone_indicators[]` and `company_stage_inferred`
- Existing recruiter profile parsing logic preserved

---

### P2A-03: MODIFY `step-out-02-strategy.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/steps-c/step-out-02-strategy.md` |
| **Operation** | MODIFY |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Add tone resolution priority chain (company_brief > recruiter_profile > default "formal"). Add `brand_values[]` and `cautions[]` loading from company_brief. Add "The Bridge" signal selection integration. Update output: `outreach_strategy.json` gains `selected_tone`, `tone_source`, `brand_values[]`, `cautions[]`, `the_bridge`. |
| **Dependencies** | P2A-02 (recruiter_profile.json must include tone indicators) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Tone resolution priority documented: (1) company_brief.tone_descriptor, (2) recruiter_profile.recruiter_tone_indicators[], (3) default "formal"
- Tone-to-label mapping table: formal->Formal, conversational->Conversational, technical->Technical, vision-driven->Vision-Driven
- Output contract updated with 5 new fields: `selected_tone`, `tone_source`, `brand_values[]`, `cautions[]`, `the_bridge`
- `the_bridge` object includes: `signal_id`, `title`, `xyz_metric`, `persona_relevance`

---

### P2A-04: REWRITE `step-out-03-cover-letter.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/steps-c/step-out-03-cover-letter.md` |
| **Operation** | REWRITE |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Full rewrite from 50-line incomplete structure to ~120-line implementation. 3-paragraph structure: Hook (60-80 words), Why Me (120-160 words with Bridge signal + XYZ metric + 2 P0 requirements), Why Them (100-140 words with brand values). 300-400 word constraint. Guardrail check against FORBIDDEN phrases. |
| **Dependencies** | P2A-03 (outreach_strategy.json must include selected_tone, the_bridge, brand_values, cautions) |
| **Estimated Effort** | L (3-8hr) |

**Acceptance Criteria:**
- 3-paragraph structure fully specified: Hook (60-80 words), Why Me (120-160 words), Why Them (100-140 words)
- Tone injection table with voice characteristics for all 4 tones
- Paragraph 1 sources documented: company announcement, recruiter pain points, shared background, brand values
- Paragraph 2 requirements: >= 1 XYZ metric, Bridge signal lead, >= 2 P0 requirement connections
- Paragraph 3 requirements: internal motivations, >= 1 brand value reference, soft call-to-action
- Word count enforcement: 300-400 strict, target 340-360, expansion/compression rules
- Guardrail checklist: no generic phrases (FORBIDDEN list), company name >= 2 mentions, no cautions[] topics, no salary/benefits mentions
- Agent assignment: sync-publicist (Lyric) R/A
- Output: `cover_letter.md` + `cover_letter_payload.json`

---

### P2A-05: CREATE `step-out-03b-cover-letter-variants.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md` |
| **Operation** | CREATE |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Generate 2 tone variants of the cover letter for user selection. Same factual content, different voice. Pattern: modify sentence structure and connective language only. Output: `cover_letter_variants.json`. |
| **Dependencies** | P2A-04 (step-out-03 must produce initial cover_letter.md) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Produces exactly 2 variants (e.g., Technical + Conversational) alongside the original tone
- Factual content identical across variants (metrics, company references, signal references)
- Only voice, sentence structure, and connective language differ
- Output: `cover_letter_variants.json` with variant labels and full text
- User selection mechanism documented (present all 3, user picks one)

---

### P2A-06: CREATE `step-out-03c-cover-letter-validation.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md` |
| **Operation** | CREATE |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Automated validation of selected cover letter variant: word count (300-400), signal presence (>= 1 XYZ metric), tone consistency (no register shifts), no generic phrases, company name >= 2 mentions, no cautions[] topics. Output: `cover_letter_validation.json` + `cover_letter_final.md`. |
| **Dependencies** | P2A-05 (variant selection must be complete) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- 6 validation checks specified with PASS/FAIL conditions
- Validation report schema: `cover_letter_validation.json` with check results
- Final output: `cover_letter_final.md` (the selected and validated variant)
- Failure handling: identify failing checks, propose fixes, ask user to approve

---

### P2A-07: MODIFY `step-01-validate.md` (outbound-campaign validation path)

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/steps-v/step-01-validate.md` |
| **Operation** | MODIFY |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Add cover-letter-specific validation criteria: word count range, signal density, Bridge reference, tone match against selected_tone. |
| **Dependencies** | P2A-06 (validation step defines what criteria the V-step checks) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Cover letter validation criteria added alongside existing outreach validation
- Checks: word count 300-400, >= 1 XYZ metric, Bridge signal referenced, tone consistent
- Existing validation criteria preserved unchanged

---

### P2A-08: CREATE `cover_letter.template.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/templates/cover_letter.template.md` |
| **Operation** | CREATE |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Cover letter markdown template with 14 injection points per PLAN-04b: `{{SALUTATION}}`, `{{RECIPIENT_NAME}}`, `{{COMPANY_NAME}}`, `{{ROLE_TITLE}}`, `{{HOOK_PARAGRAPH}}`, `{{WHYME_PARAGRAPH}}`, `{{WHYTHEM_PARAGRAPH}}`, `{{CLOSING}}`, `{{USER_NAME}}`, `{{USER_TITLE}}`, `{{USER_EMAIL}}`, `{{USER_PHONE}}`, `{{LINKEDIN_URL}}`, `{{DATE}}`. |
| **Dependencies** | P0-03 (must follow `.template.md` naming convention) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Uses `.template.md` naming convention (not `-template.md`)
- All 14 injection points present with `{{VARIABLE}}` syntax
- Professional letter formatting: date, salutation, 3 body paragraphs, closing, signature block
- No hardcoded content (all content comes from injection points)

---

### P2A-09: MODIFY Portfolio HTML (View 3 -- Cover Letter Display)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (View 3 section) |
| **Operation** | MODIFY |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Rename `whygoogle-view` to `whycompany-view` and `nav-whygoogle` to `nav-whycompany`. Replace 1px placeholder image and paragraph with formatted cover letter body. Add `.cover-letter-body` class for letter-specific typography. |
| **Dependencies** | P2A-04 (cover letter generation must be defined before display template is built) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Zero instances of "whygoogle" remain in the portfolio HTML (verify via grep)
- View 3 ID is `whycompany-view`, nav item ID is `nav-whycompany`
- Cover letter content area uses `.cover-letter-body` class with appropriate typography
- `cover_letter_payload.json` consumption mechanism for dynamic content injection
- `switchView()` function works correctly with the new view ID

---

### P2A-10: MODIFY Portfolio CSS (Cover Letter Print Route)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS (style block) |
| **Operation** | MODIFY |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Add cover letter print route: `@media print` rule for `.whycompany-view` that produces a separate A4 page from the resume print route. Add `.cover-letter-body` typography styles. |
| **Dependencies** | P2A-09 (HTML structure must be defined), P1-09 (CSS token migration complete) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- `@media print` rules allow printing View 3 (cover letter) separately from View 1 (resume)
- Cover letter prints on a single A4 page with professional letter formatting
- `.cover-letter-body` styles defined: appropriate font size, line height, paragraph spacing
- Print output does not include sidebar navigation or other chrome

---

### P2A-11: MODIFY `outbound-campaign/checklist.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/outbound-campaign/checklist.md` |
| **Operation** | MODIFY |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | Add cover letter validation criteria to the workflow checklist: word count, signal presence, tone consistency, variant generation, company_brief consumption. |
| **Dependencies** | P2A-06 (validation criteria defined in step-03c) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Cover letter checklist items present alongside existing outreach checklist items
- Covers: word count 300-400, 3-paragraph structure, tone selection, variant generation, validation pass

---

### P2A-12: FIX Finding F-08 (sync-publicist Rules) + F-17 (Template Mismatch)

| Field | Value |
|-------|-------|
| **File Path** | sync-publicist agent file + content-automation template reference |
| **Operation** | MODIFY |
| **Enhancement** | E1 |
| **Phase** | 2A |
| **Description** | F-08: Add rules section to sync-publicist agent defining cover letter generation rules, tone protocols, variant generation constraints. F-17: Fix content-automation template name mismatch (escalated from P2 to P1). |
| **Dependencies** | P2A-04 (cover letter protocols must be defined before rules are written) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- sync-publicist agent file contains `rules:` section with cover letter generation constraints
- Content-automation template reference resolves correctly
- sync-publicist `instructions.md` updated with "Cover Letter Protocol" and "Variant Protocol"
- sync-linker `memories.md` updated with "Bridge Selection refinement"

---

## 5. Phase 2B: Beyond the Papers (E3)

**Gate**: Phase 1 complete (CSS token system + shared-data).
**Parallel**: Fully independent of Phase 2A.
**Scope**: REDUCED per PLAN-09d -- no contact form, no 3D parallax, no Lottie, no jQuery, no Webflow runtime.

---

### P2B-01: REWRITE `step-port-02-beyond-the-papers.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` |
| **Operation** | REWRITE |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | Full rewrite from 34-line minimal step. Add structured data ingestion: project cards (title, description, thumbnail_url, external_link, tech_stack[], impact_summary), hobby/interest cards (category, narrative_hook), life journey timeline entries (year, milestone, type). Output: `portfolio_content.json`. |
| **Dependencies** | P1-09 (CSS tokens must be in `--lr-*` namespace), P2B-04 (schema must be defined) |
| **Estimated Effort** | L (3-8hr) |

**Acceptance Criteria:**
- Structured data ingestion from `projects-source.yaml` user input
- Project card schema: title, description, thumbnail_url, external_link, tech_stack[], impact_summary, display_order
- Hobby card schema: category, narrative_hook, icon
- Timeline entry schema: year, milestone, type (career/personal/education)
- Output: `portfolio_content.json` conforming to `portfolio-content.schema.json`
- Agent assignment: sync-styler (Cora) R/A
- Minimum 3 project cards required, at least 1 hobby card

---

### P2B-02: CREATE `step-port-02b-life-narrative-video.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md` |
| **Operation** | CREATE |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | Placeholder for future video integration. For Release 3: generate static "Life Journey" timeline visualization from timeline entries. Output: `life_journey.html` section fragment with the vertical storytelling timeline from PLAN-05a. |
| **Dependencies** | P2B-01 (portfolio_content.json must include life_journey entries) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Generates `life_journey.html` section fragment
- Timeline entries rendered in chronological order
- Each entry includes year, milestone text, and type indicator
- HTML uses `.btp-timeline-*` class naming per PLAN-05a
- Video placeholder field supported (`video_placeholder.enabled: false` for Release 3)
- Fragment is injectable into portfolio View 4

---

### P2B-03: CREATE `step-port-02c-portfolio-validation.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md` |
| **Operation** | CREATE |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | Validate `portfolio_content.json` against schema: minimum 3 project cards, at least 1 hobby card, all URLs valid, thumbnail dimensions specified. Output: `portfolio_validation.json`. |
| **Dependencies** | P2B-01 (portfolio_content.json must exist), P2B-04 (schema must be defined) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Validates against `portfolio-content.schema.json`
- Checks: minimum 3 projects, >= 1 hobby, all URLs well-formed, all display_order values unique
- Validation report: `portfolio_validation.json` with per-check PASS/FAIL
- User presentation on failure with fix proposals

---

### P2B-04: CREATE `portfolio-content.schema.json`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/portfolio-content.schema.json` |
| **Operation** | CREATE |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | JSON Schema for `portfolio_content.json`: projects[] (with all fields), hobbies[] (category, narrative_hook, icon), life_journey[] (year, milestone, type), video_placeholder (enabled, label). |
| **Dependencies** | None (schema definition, no runtime dependency) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Valid JSON Schema draft 2020-12
- `projects[]`: required fields -- id, title, description, display_order; optional -- thumbnail_url, external_link, tech_stack[], impact_summary
- `hobbies[]`: required -- category, narrative_hook; optional -- icon
- `life_journey[]`: required -- year, milestone, type (enum: career, personal, education)
- Minimum items: projects >= 3

---

### P2B-05: CREATE `projects-source.yaml`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/projects-source.yaml` |
| **Operation** | CREATE |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | User-provided input template for project/hobby/timeline data. Pre-populated with field names and example entries to guide user input. |
| **Dependencies** | P2B-04 (schema defines the structure this template follows) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- YAML format with commented field descriptions
- Example entries for projects, hobbies, and life_journey
- Clear instructions for user customization
- Fields align with `portfolio-content.schema.json`

---

### P2B-06: MODIFY Portfolio HTML (View 4 -- BTP Content)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (View 4 / `#whoami-view` section) |
| **Operation** | MODIFY |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | Remove A4 page constraint for View 4 (change from `overflow: hidden` to `overflow-y: auto`). Add `.lr-btp-scope` wrapper div. Add BTP section stack: hero heading, qualities carousel, project card grid, condensed timeline. Replace 1px placeholder image and text. |
| **Dependencies** | P2B-01 (data ingestion step defines what content structure to display), P0-04 (CSS namespace convention) |
| **Estimated Effort** | L (3-8hr) |

**Acceptance Criteria:**
- `#whoami-view` uses `.btp-view` class instead of `.page` class (no fixed A4 height)
- `.lr-btp-scope` wrapper div wraps ALL BTP content
- Section stack order: `.btp-hero` > `.btp-timeline` > `.btp-projects` (per PLAN-05)
- View 4 scrollable (`overflow-y: auto`) while Views 1-3 retain `overflow: hidden`
- 1px placeholder image and "Personal Narrative media goes here" text removed
- Zero jQuery references, zero Webflow runtime references

---

### P2B-07: MODIFY Portfolio CSS (BTP Styles Under `.lr-btp-scope`)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS (style block) |
| **Operation** | MODIFY |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | Add all BTP styles under `.lr-btp-scope` descendant selector. Add ~40 new `--lr-btp-*` CSS variables (layout, typography, colors, animation). Add responsive overrides at 4 breakpoints (1920px+, 991px, 767px, 479px). Add carousel `@keyframes` animation. Scope: `.lr-btp-scope .section { padding: 60px 0; }` does NOT affect `.lr-cv-scope .section { margin-bottom: 4mm; }`. |
| **Dependencies** | P2B-06 (HTML structure must be defined), P1-09 (CSS tokens in `--lr-*` namespace), P0-04 (CSS namespace convention) |
| **Estimated Effort** | XL (8+hr) |

**Acceptance Criteria:**
- ALL BTP styles scoped under `.lr-btp-scope` descendant selector (specificity 0,2,0)
- Zero cross-contamination: `.lr-btp-scope .section` and `.lr-cv-scope .section` styles are completely isolated
- ~40 `--lr-btp-*` CSS variables defined in `:root` per PLAN-05 (layout, typography, colors, cards, animation)
- 4 responsive breakpoints with correct variable overrides per PLAN-05
- Carousel `@keyframes` animation for rotating qualities (CSS-only, no JS)
- `.lr-btp-scope .btp-hero`, `.lr-btp-scope .btp-timeline`, `.lr-btp-scope .btp-projects` all styled
- `prefers-reduced-motion` media query disables carousel animation

---

### P2B-08: MODIFY Portfolio CSS (BTP Color Tokenization)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS (style block) |
| **Operation** | MODIFY |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | Tokenize ~20-25 essential BTP color values into `--lr-btp-*` variables that reference `--lr-*` base tokens. Key mappings: `--lr-btp-accent: var(--lr-color-primary)`, `--lr-btp-gradient-start/end`, `--lr-btp-timeline-start/mid/end`. |
| **Dependencies** | P2B-07 (BTP styles must be in place), P1-09 (base `--lr-*` tokens must exist) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- ~20-25 BTP color values tokenized into `--lr-btp-*` variables
- Gradient variables: `--lr-btp-gradient-name`, `--lr-btp-gradient-timeline`, `--lr-btp-gradient-qualities`
- BTP accent references `--lr-color-primary` so theming system can override it
- No hardcoded hex values remain in BTP-scoped CSS rules (outside `:root {}`)

---

### P2B-09: MODIFY Portfolio HTML `<head>` (Font Loading)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template `<head>` section |
| **Operation** | MODIFY |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | Add Inter and DM Serif Display font families required by BTP. Consolidate with existing Roboto Google Fonts `<link>`. Use `font-display: swap` for Inter and DM Serif Display, `font-display: optional` for Aubrey (decorative). |
| **Dependencies** | P2B-07 (BTP styles reference these font families) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Single consolidated Google Fonts `<link>` tag loading Roboto + Inter + DM Serif Display
- `font-display: swap` for primary fonts (Roboto, Inter, DM Serif Display)
- `font-display: optional` for Aubrey if included (decorative, prevents late-swap CLS)
- No duplicate font loading (existing Roboto `<link>` merged, not duplicated)

---

### P2B-10: MODIFY `step-port-03-deploy.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-03-deploy.md` |
| **Operation** | MODIFY |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | Add injection of `portfolio_content.json` and `life_journey.html` into portfolio template alongside existing content. Add BTP section injection into View 4. Update commit message format. |
| **Dependencies** | P2B-01 (portfolio_content.json), P2B-02 (life_journey.html), P2B-06 (View 4 HTML structure) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Injection map includes `portfolio_content.json` -> View 4 data, `life_journey.html` -> timeline section
- Commit message format updated to include BTP content generation context
- Existing deployment logic (gh-pages push) preserved
- All BTP images self-hosted (no Webflow CDN references in deployed output)

---

### P2B-11: MODIFY `portfolio-deploy/workflow.yaml` + `checklist.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/workflow.yaml` + `checklist.md` |
| **Operation** | MODIFY |
| **Enhancement** | E3 |
| **Phase** | 2B |
| **Description** | workflow.yaml: Add `projects-source.yaml` (FULL_LOAD) to `input_file_patterns`. checklist.md: Add BTP validation criteria (project card count, timeline entries, URL validation, responsive breakpoint testing). |
| **Dependencies** | P2B-05 (projects-source.yaml template), P2B-03 (validation criteria) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- `projects-source.yaml` entry present in workflow.yaml `input_file_patterns`
- Checklist includes: >= 3 project cards, timeline entries present, all URLs valid, responsive at 4 breakpoints, zero jQuery, zero Webflow runtime

---

## 6. Phase 3: Slides Integration (E2, Conditional)

**GATE CONDITION**: Phase 3 does NOT begin unless ALL of the following are true:
1. `frontend-slides` skill output format documented (HTML, images, or PDF)
2. `frontend-slides` skill file location and naming convention defined
3. `frontend-slides` metadata schema specified
4. Working prototype of `frontend-slides` output exists
5. Phase 1 and Phase 2 are complete and stable

**If gate is NOT met**: Defer entirely to Release 4. View 2 remains placeholder.

---

### P3-01: MODIFY `step-port-01-compile.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01-compile.md` |
| **Operation** | MODIFY |
| **Enhancement** | E2 |
| **Phase** | 3 |
| **Description** | Add explicit `slides_content.json` schema validation. Add top-5 signal selection with cosine similarity scoring against Strategic Gravity. Add `role_alignment` and `impact_rank` fields per slide. |
| **Dependencies** | Gate condition met, Phase 2B complete (step-port-02 rewrite separates BTP from slides) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Signal selection algorithm documented: 40% requirement relevance, 25% persona alignment, 20% metric density, 15% ownership match
- Bridge signal force-ranked as #1 regardless of composite score
- `slides_content.json` schema validated per PLAN-03d Section 1.5
- Each slide object includes: signal_id, title, subtitle, sections (problem/process/metric/legacy), role_alignment, impact_rank, jd_requirement_match, ats_keywords_embedded

---

### P3-02: CREATE `step-port-01b-style-selection.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01b-style-selection.md` |
| **Operation** | CREATE |
| **Enhancement** | E2 |
| **Phase** | 3 |
| **Description** | Style constrain step. Load Sync design tokens. Default to "Abyssal Depth" preset. Dual-layer theming: Sync base + company accent overlay. Output: `selected_style.json`. |
| **Dependencies** | P3-01 (slides_content.json must exist), P1-11 through P1-16 (brand presets must exist) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Loads `company_brief.yaml` brand colors for accent overlay
- Default preset: Abyssal Depth (teal #0E9E8E, coral #D9705A, backgrounds #091614/#0F1F1C/#122520)
- Dual-layer theming documented: Sync ocean tokens = base layer, company accent = overlay on interactive elements only
- Output: `selected_style.json` with preset_id, brand_override, emotional_tone

---

### P3-03: CREATE `step-port-01c-render-slides-html.md`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01c-render-slides-html.md` |
| **Operation** | CREATE |
| **Enhancement** | E2 |
| **Phase** | 3 |
| **Description** | Invoke frontend-slides rendering pipeline with `slides_content.json` + `selected_style.json`. Generate self-contained HTML with inline CSS/JS. Zero external dependencies. Output: `slides_deck.html`. |
| **Dependencies** | P3-02 (selected_style.json), Gate condition (frontend-slides interface defined) |
| **Estimated Effort** | L (3-8hr) |

**Acceptance Criteria:**
- Self-contained HTML output: all CSS and JS inline, zero external dependencies
- `slides_deck.html` under 200 KB total
- Each slide renders the 4-section structure (Problem/Process/Metric/Legacy)
- Responsive design: viewport-based scaling
- Abyssal Depth preset colors applied correctly

---

### P3-04: CREATE `abyssal-depth.preset.css`

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/data/abyssal-depth.preset.css` |
| **Operation** | CREATE |
| **Enhancement** | E2 |
| **Phase** | 3 |
| **Description** | Sync ocean-themed design tokens for slides. Primary #0E9E8E teal, Accent #D9705A coral, Gold #C8973A, Backgrounds #091614/#0F1F1C/#122520. |
| **Dependencies** | None (static design token file) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- All Sync ocean-theme colors present as CSS custom properties
- Background hierarchy: base #091614, surface #0F1F1C, elevated #122520
- Text colors for light-on-dark contexts defined
- File is a valid CSS file that can be imported/inlined

---

### P3-05: MODIFY Portfolio HTML (5th Sidebar Nav Item)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (sidebar navigation) |
| **Operation** | MODIFY |
| **Enhancement** | E2 |
| **Phase** | 3 |
| **Description** | Add 5th sidebar nav item "Slide Deck" per PLAN-06 (PLAN-03c). Add slide view container with lazy-load mechanism (`data-src` attribute). |
| **Dependencies** | P3-03 (slides_deck.html must be defined as the content source) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- 5th nav item visible in sidebar with appropriate label and icon
- Slide view container present in HTML with `data-src` lazy-load attribute
- Content NOT loaded on initial page load (only on first navigation to slides view)
- Aspect ratio handling for 16:9 slides within portrait viewport

---

### P3-06: MODIFY Portfolio JS (`switchView()`)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/JS (script block) |
| **Operation** | MODIFY |
| **Enhancement** | E2 |
| **Phase** | 3 |
| **Description** | Add lazy-load logic: on first switch to slides view, copy `data-src` to `src`. Preserve slide state (current slide index) when switching away and back. |
| **Dependencies** | P3-05 (HTML structure with data-src attribute) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Lazy-load triggers only on first navigation to slides view
- Slide state (current index) preserved across view switches
- `switchView()` handles 5 views correctly (no hardcoded view count)
- Combined JS remains under 50 KB

---

### P3-07: MODIFY `step-port-03-deploy.md` (Slides Injection)

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-03-deploy.md` |
| **Operation** | MODIFY |
| **Enhancement** | E2 |
| **Phase** | 3 |
| **Description** | Add injection of `slides_deck.html` into portfolio template. Add post-deploy URL verification for slide deck. |
| **Dependencies** | P3-03 (slides_deck.html), P2B-10 (deploy step already modified for BTP) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- `slides_deck.html` injected at correct position in portfolio template
- Standalone `dist/slides.html` also generated for direct access
- Post-deploy verification confirms slide deck URL resolves

---

### P3-08: MODIFY `step-port-02-beyond-the-papers.md` (Slides Separation)

| Field | Value |
|-------|-------|
| **File Path** | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` |
| **Operation** | MODIFY |
| **Enhancement** | E2 |
| **Phase** | 3 |
| **Description** | Ensure BTP step (already rewritten in Phase 2B) has explicit separation from slide compilation. Add reference to `slides_deck.html` injection point so deploy step knows about both content sources. |
| **Dependencies** | P2B-01 (Phase 2B rewrite already complete) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- No slide compilation logic remains in step-port-02 (fully separated to step-port-01 series)
- Explicit reference to `slides_deck.html` as a parallel artifact consumed by step-port-03

---

## 7. Phase 4: Polish -- Performance, Accessibility, Fixes

**Gate**: Phase 2 complete (Phase 3 is optional).
**Three Parallel Tracks**: A (Performance), B (Accessibility), C (Finding Fixes).

---

### P4-01: MODIFY Portfolio HTML (Base64 Photo to WebP)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (profile photo) |
| **Operation** | MODIFY |
| **Enhancement** | E4 (performance) |
| **Phase** | 4 (Track A) |
| **Description** | Convert base64 inline profile photo (~620 KB) to external WebP file (~50 KB at quality 85). Add `<link rel="preload" as="image" href="profile.webp">`. |
| **Dependencies** | Phase 2 complete (final HTML structure stable) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Base64 data URI removed from HTML
- External `profile.webp` file created and referenced
- Preload hint in `<head>`: `<link rel="preload" as="image" href="profile.webp">`
- `alt` attribute added to profile image (P4-06 may overlap)
- Print output still renders the photo correctly
- Size reduction: ~570 KB saved

---

### P4-02: MODIFY Portfolio HTML (Hero GIF to WebM)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (hero animation) |
| **Operation** | MODIFY |
| **Enhancement** | E3 (performance) |
| **Phase** | 4 (Track A) |
| **Description** | Convert hero GIF to WebM video with `<video autoplay muted loop playsinline>`. Add `<img>` fallback for browsers without WebM support. |
| **Dependencies** | P2B-06 (BTP HTML structure finalized) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- GIF replaced with `<video>` element: `autoplay muted loop playsinline`
- WebM video file at ~80% size reduction from GIF
- Fallback `<img>` or poster frame for unsupported browsers
- `prefers-reduced-motion` media query pauses the video

---

### P4-03: MODIFY Portfolio HTML (Lazy Loading Images)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (all below-fold images) |
| **Operation** | MODIFY |
| **Enhancement** | E3 (performance) |
| **Phase** | 4 (Track A) |
| **Description** | Add `loading="lazy"` to all below-fold images (6+ BTP images). Self-host all images as WebP. |
| **Dependencies** | P2B-06 (BTP HTML finalized with all image references) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- All below-fold `<img>` tags include `loading="lazy"`
- All images converted to WebP format and self-hosted
- No Webflow CDN image URLs remain
- All images have explicit `width` and `height` attributes (CLS prevention)

---

### P4-04: MODIFY Portfolio HTML (Font Consolidation)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML `<head>` |
| **Operation** | MODIFY |
| **Enhancement** | E3 + E4 (performance) |
| **Phase** | 4 (Track A) |
| **Description** | Verify single consolidated Google Fonts `<link>` tag (may already be done in P2B-09). Ensure `font-display: swap` on all families. |
| **Dependencies** | P2B-09 (font loading already modified) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Single Google Fonts `<link>` tag (no duplicates)
- All font families use `font-display: swap` or `font-display: optional` (decorative)
- ~20 KB savings from consolidation

---

### P4-05: MODIFY Portfolio CSS (Tree-Shake Unused Webflow CSS)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS (style block) |
| **Operation** | MODIFY |
| **Enhancement** | E3 (performance) |
| **Phase** | 4 (Track A) |
| **Description** | Remove unused Webflow CSS: hidden timeline sections, utility pages, password page styles. These were stripped during BTP integration but may have remnants. |
| **Dependencies** | P2B-07 (BTP CSS complete, unused rules identifiable) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- No CSS rules reference classes not present in the HTML
- Password page styles removed
- Hidden timeline section styles removed
- ~30 KB savings from tree-shaking
- All existing visual behavior preserved

---

### P4-06: MODIFY Portfolio HTML (Alt Attributes)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (all images) |
| **Operation** | MODIFY |
| **Enhancement** | ALL (accessibility) |
| **Phase** | 4 (Track B) |
| **Description** | Add meaningful `alt` attributes to all images: profile photo, hero GIF/video, project screenshots, company logos. |
| **Dependencies** | Phase 2 complete (all image elements finalized) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Every `<img>` element has a non-empty `alt` attribute
- Alt text is descriptive and meaningful (not "image1.png")
- Decorative images use `alt=""` with `role="presentation"`
- `<video>` elements have `aria-label` describing the content

---

### P4-07: MODIFY Portfolio HTML (Keyboard Navigation)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (sidebar nav items) |
| **Operation** | MODIFY |
| **Enhancement** | ALL (accessibility) |
| **Phase** | 4 (Track B) |
| **Description** | Add `tabindex="0"`, `role="button"`, and `onkeydown` (Enter/Space handler) to all CV sidebar `.nav-item` elements. |
| **Dependencies** | Phase 2 complete (nav items finalized -- 4 or 5 items depending on Phase 3) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- All `.nav-item` elements include `tabindex="0"` and `role="button"`
- Enter and Space keypress triggers the same action as click
- Visible focus ring on keyboard navigation (`:focus-visible` styles)
- Tab order follows visual order (top to bottom in sidebar)

---

### P4-08: MODIFY Portfolio HTML (Skip Navigation Link)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (top of `<body>`) |
| **Operation** | MODIFY |
| **Enhancement** | ALL (accessibility) |
| **Phase** | 4 (Track B) |
| **Description** | Add `<a href="#main-content" class="skip-link">Skip to content</a>` at top of page. Style: visible only on focus, positioned above all content. |
| **Dependencies** | None |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Skip link is the first focusable element on the page
- Visible only when focused (off-screen until Tab press)
- Links to `#main-content` landmark
- Styled consistently with design system

---

### P4-09: MODIFY Portfolio CSS (Color Contrast Fix)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS (`:root` block) |
| **Operation** | MODIFY |
| **Enhancement** | E4 (accessibility) |
| **Phase** | 4 (Track B) |
| **Description** | Darken `--lr-brand-blue` from #4285F4 to #2A6CC7 (~4.6:1 ratio against white) for WCAG AA compliance on normal text. Verify all `--lr-*` color tokens pass WCAG AA. |
| **Dependencies** | P1-09 (CSS tokens must be migrated to `--lr-*` first) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- All `--lr-*` color tokens used for text pass WCAG AA (>= 4.5:1 against their background)
- `--lr-brand-blue` adjusted to meet contrast requirements
- Automated contrast check run against all text-on-background combinations

---

### P4-10: MODIFY Portfolio HTML (Semantic Heading Hierarchy)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML template (CV sections) |
| **Operation** | MODIFY |
| **Enhancement** | ALL (accessibility) |
| **Phase** | 4 (Track B) |
| **Description** | Add `<h1>` for user name, `<h2>` for section titles in CV template. Currently all content uses `<div>` with class names instead of semantic headings. |
| **Dependencies** | Phase 2 complete (all content sections finalized) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Exactly one `<h1>` (user name) per page view
- `<h2>` for each major section title (Experience, Skills, Education, etc.)
- BTP sections use `<h2>` for section headings (already in PLAN-05 design)
- CSS updated if heading tags affect spacing (class-based styles preserved)
- No visual change from heading introduction

---

### P4-11: MODIFY Portfolio JS + HTML (ARIA + Reduced Motion)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS/JS |
| **Operation** | MODIFY |
| **Enhancement** | ALL (accessibility) |
| **Phase** | 4 (Track B) |
| **Description** | Add `aria-current="page"` to active nav item in `switchView()`. Add `prefers-reduced-motion` media query to disable BTP carousel animation and any transforms. |
| **Dependencies** | P4-07 (keyboard navigation complete), P2B-07 (BTP animations complete) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- `aria-current="page"` set on the active nav item, removed from others, on every view switch
- `@media (prefers-reduced-motion: reduce)` disables: carousel animation, timeline progress animation, any CSS transforms
- All animations respect user preference

---

### P4-12: MODIFY Portfolio CSS (Mobile Responsive Breakpoints)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS |
| **Operation** | MODIFY |
| **Enhancement** | ALL (mobile) |
| **Phase** | 4 |
| **Description** | Add 4 breakpoints: >= 1200px (full sidebar + A4), 992-1199px (sidebar collapses to 60px icon rail), 768-991px (top horizontal nav bar), <= 767px (bottom tab bar). A4 page becomes reflowed content on mobile; `window.print()` always produces A4 PDF. |
| **Dependencies** | P4-05 (final CSS structure stable after tree-shaking) |
| **Estimated Effort** | L (3-8hr) |

**Acceptance Criteria:**
- 4 breakpoints implemented with correct layout behavior at each
- >= 1200px: full 300px sidebar + A4 page container (current desktop)
- 992-1199px: 60px icon-rail sidebar, nav labels hidden
- 768-991px: horizontal top nav bar, sidebar hidden
- <= 767px: bottom tab bar (4-5 icons), single-column content, readable text
- Print always produces A4 regardless of viewport size
- All views functional at all 4 breakpoints

---

### P4-13: MODIFY Portfolio CSS (A4 Hybrid Mobile Handling)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/CSS |
| **Operation** | MODIFY |
| **Enhancement** | E4 (mobile) |
| **Phase** | 4 |
| **Description** | On mobile viewports, remove A4 fixed dimensions and let resume content reflow naturally. Preserve A4 layout only for `@media print`. The print/download button always produces A4 PDF. |
| **Dependencies** | P4-12 (breakpoints must be defined) |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- Resume content reflowed on screens <= 767px (no horizontal scrolling)
- `@media print` still produces A4 layout regardless of viewport
- Download button produces correct A4 PDF
- Font sizes scaled appropriately for mobile readability

---

### P4-14: MODIFY Portfolio JS (IIFE Wrapping)

| Field | Value |
|-------|-------|
| **File Path** | Portfolio HTML/JS (script block) |
| **Operation** | MODIFY |
| **Enhancement** | ALL (code quality) |
| **Phase** | 4 |
| **Description** | Wrap all JS in IIFE: `const LinkrightCV = (() => { ... return { switchView }; })();`. Expose `switchView` on window for backward compatibility if inline `onclick` attributes are still used. |
| **Dependencies** | P3-06 (if Phase 3 executed, lazy-load logic included), P2B-06 (BTP JS complete) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- All JS wrapped in IIFE: `const LinkrightCV = (() => { ... })();`
- `switchView()` accessible via `LinkrightCV.switchView()` or `window.switchView` (backward compat)
- Zero global variables except `LinkrightCV` namespace
- IntersectionObserver for BTP scroll effects (if enabled in reduced scope) included within IIFE
- Combined JS under 50 KB

---

### P4-15: FIX Finding F-16 (Resume Validation Broken Template)

| Field | Value |
|-------|-------|
| **File Path** | resume-validation workflow template reference |
| **Operation** | MODIFY |
| **Enhancement** | ALL |
| **Phase** | 4 (Track C) |
| **Description** | Fix broken template reference in resume-validation workflow. Update validation to cover cover letter, BTP content, and slides output (if Phase 3 executed). |
| **Dependencies** | Phase 2 complete (all content types exist to validate) |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- Template reference resolves to an existing file
- Validation workflow can validate resume, cover letter, BTP content
- No runtime errors when running the validation workflow

---

### P4-16: FIX Finding F-30 (Antigravity CLI Stubs)

| Field | Value |
|-------|-------|
| **File Path** | Command stubs referencing `antigravity` CLI |
| **Operation** | MODIFY |
| **Enhancement** | ALL |
| **Phase** | 4 (Track C) |
| **Description** | Fix command stubs referencing non-existent `antigravity` CLI. Ensure `portfolio-deploy` workflow can be invoked correctly. |
| **Dependencies** | None |
| **Estimated Effort** | S (< 1hr) |

**Acceptance Criteria:**
- No references to `antigravity` CLI remain
- Workflow invocation paths resolve correctly

---

### P4-17: FIX Finding F-32 (installer/sync.js Stub)

| Field | Value |
|-------|-------|
| **File Path** | `installer/sync.js` or equivalent |
| **Operation** | MODIFY |
| **Enhancement** | E2, E3 |
| **Phase** | 4 (Track C) |
| **Description** | Fix installer/sync.js stub. Required if enhancements need sync capabilities for slide decks or BTP content. |
| **Dependencies** | None |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- `sync.js` is functional or replaced with working alternative
- Sync capabilities available for portfolio deployment pipeline

---

### P4-18: FIX Findings F-35, F-21, F-39 (Naming + Branding Cleanup)

| Field | Value |
|-------|-------|
| **File Path** | Multiple agent files, template files, sidecar memory files |
| **Operation** | MODIFY |
| **Enhancement** | E4 |
| **Phase** | 4 (Track C) |
| **Description** | F-35: Unify agent display names across all files. F-21: Remove BMAD branding from test-design-handoff template. F-39: Update memory sidecar instructions to use correct agent names. |
| **Dependencies** | None |
| **Estimated Effort** | M (1-3hr) |

**Acceptance Criteria:**
- All agent display names consistent across agent files, sidecars, and instructions
- No BMAD branding in any Linkright template
- All memory sidecar files reference correct agent persona names

---

## 8. Acceptance Criteria Matrix

| ID | File Path (relative to `_lr/`) | Op | Enh | Phase | # AC | Effort |
|----|-------------------------------|-----|-----|-------|------|--------|
| P0-01 | 60+ files (global path rewrite) | MODIFY | ALL | 0 | 5 | L |
| P0-02 | sync/workflow-engine/ (new) | CREATE | ALL | 0 | 4 | M-L |
| P0-03 | 7 template files (rename) | MODIFY | ALL | 0 | 3 | S |
| P0-04 | context/CSS-NAMESPACE-CONVENTION.md | CREATE | E3,E4 | 0 | 4 | S |
| P1-01 | sync/workflows/jd-optimize/steps-c/step-34-style-theming.md | REWRITE | E4 | 1 | 6 | M |
| P1-02 | sync/workflows/jd-optimize/steps-c/step-35-style-compile.md | REWRITE | E4 | 1 | 6 | M |
| P1-03 | sync/workflows/jd-optimize/steps-c/step-36-style-validation.md | REWRITE | E4 | 1 | 5 | M |
| P1-04 | sync/workflows/jd-optimize/steps-c/step-06b-export-data-contract.md | CREATE | E4+E1 | 1 | 6 | M |
| P1-05 | sync/shared-data/ | CREATE | E4+E1 | 1 | 4 | S |
| P1-06 | sync/workflows/jd-optimize/templates/resume-templates/modern-minimal.html | CREATE | E4 | 1 | 6 | L |
| P1-07 | sync/workflows/jd-optimize/templates/resume-templates/modern-clean.html | CREATE | E4 | 1 | 5 | M |
| P1-08 | sync/workflows/jd-optimize/templates/resume-templates/modern-visual.html | CREATE | E4 | 1 | 5 | M |
| P1-09 | Portfolio CSS :root block | MODIFY | E4 | 1 | 6 | L |
| P1-10 | sync/workflows/portfolio-deploy/data/presets/ | CREATE | E4 | 1 | 3 | S |
| P1-11 | presets/google.preset.json | CREATE | E4 | 1 | 6 | S |
| P1-12 | presets/amazon.preset.json | CREATE | E4 | 1 | 4 | S |
| P1-13 | presets/microsoft.preset.json | CREATE | E4 | 1 | 3 | S |
| P1-14 | presets/spotify.preset.json | CREATE | E4 | 1 | 3 | S |
| P1-15 | presets/sync.preset.json | CREATE | E4 | 1 | 4 | S |
| P1-16 | presets/_default.preset.json | CREATE | E4 | 1 | 4 | S |
| P1-17 | presets/_schema/brand-preset.v1.schema.json | CREATE | E4 | 1 | 5 | M |
| P1-18 | sync/workflows/jd-optimize/workflow.yaml | MODIFY | E4 | 1 | 4 | S |
| P1-19 | sync/workflows/outbound-campaign/workflow.yaml | MODIFY | E4 | 1 | 3 | S |
| P1-20 | Agent sidecars (sync-styler, sync-scout) | MODIFY | E4 | 1 | 4 | S |
| P2A-01 | outbound-campaign/steps-c/step-01-load-session-context.md | MODIFY | E1 | 2A | 5 | S |
| P2A-02 | outbound-campaign/steps-c/step-out-01-ingest.md | MODIFY | E1 | 2A | 4 | S |
| P2A-03 | outbound-campaign/steps-c/step-out-02-strategy.md | MODIFY | E1 | 2A | 4 | M |
| P2A-04 | outbound-campaign/steps-c/step-out-03-cover-letter.md | REWRITE | E1 | 2A | 8 | L |
| P2A-05 | outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md | CREATE | E1 | 2A | 5 | M |
| P2A-06 | outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md | CREATE | E1 | 2A | 4 | M |
| P2A-07 | outbound-campaign/steps-v/step-01-validate.md | MODIFY | E1 | 2A | 3 | S |
| P2A-08 | outbound-campaign/templates/cover_letter.template.md | CREATE | E1 | 2A | 4 | S |
| P2A-09 | Portfolio HTML (View 3) | MODIFY | E1 | 2A | 5 | M |
| P2A-10 | Portfolio CSS (cover letter print) | MODIFY | E1 | 2A | 4 | S |
| P2A-11 | outbound-campaign/checklist.md | MODIFY | E1 | 2A | 3 | S |
| P2A-12 | sync-publicist agent + content-automation template | MODIFY | E1 | 2A | 4 | S |
| P2B-01 | portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md | REWRITE | E3 | 2B | 6 | L |
| P2B-02 | portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md | CREATE | E3 | 2B | 5 | M |
| P2B-03 | portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md | CREATE | E3 | 2B | 4 | S |
| P2B-04 | portfolio-deploy/data/portfolio-content.schema.json | CREATE | E3 | 2B | 5 | S |
| P2B-05 | portfolio-deploy/data/projects-source.yaml | CREATE | E3 | 2B | 4 | S |
| P2B-06 | Portfolio HTML (View 4) | MODIFY | E3 | 2B | 6 | L |
| P2B-07 | Portfolio CSS (BTP styles) | MODIFY | E3 | 2B | 7 | XL |
| P2B-08 | Portfolio CSS (BTP color tokens) | MODIFY | E3 | 2B | 4 | M |
| P2B-09 | Portfolio HTML <head> (fonts) | MODIFY | E3 | 2B | 4 | S |
| P2B-10 | portfolio-deploy/steps-c/step-port-03-deploy.md | MODIFY | E3 | 2B | 4 | M |
| P2B-11 | portfolio-deploy/workflow.yaml + checklist.md | MODIFY | E3 | 2B | 3 | S |
| P3-01 | portfolio-deploy/steps-c/step-port-01-compile.md | MODIFY | E2 | 3 | 4 | M |
| P3-02 | portfolio-deploy/steps-c/step-port-01b-style-selection.md | CREATE | E2 | 3 | 4 | M |
| P3-03 | portfolio-deploy/steps-c/step-port-01c-render-slides-html.md | CREATE | E2 | 3 | 5 | L |
| P3-04 | portfolio-deploy/data/abyssal-depth.preset.css | CREATE | E2 | 3 | 4 | S |
| P3-05 | Portfolio HTML (sidebar nav 5th item) | MODIFY | E2 | 3 | 4 | M |
| P3-06 | Portfolio JS (switchView lazy-load) | MODIFY | E2 | 3 | 4 | S |
| P3-07 | portfolio-deploy/steps-c/step-port-03-deploy.md (slides) | MODIFY | E2 | 3 | 3 | S |
| P3-08 | portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md (separation) | MODIFY | E2 | 3 | 2 | S |
| P4-01 | Portfolio HTML (base64 photo) | MODIFY | E4 | 4 | 5 | S |
| P4-02 | Portfolio HTML (hero GIF) | MODIFY | E3 | 4 | 4 | S |
| P4-03 | Portfolio HTML (lazy loading) | MODIFY | E3 | 4 | 4 | S |
| P4-04 | Portfolio HTML (font consolidation) | MODIFY | E3+E4 | 4 | 3 | S |
| P4-05 | Portfolio CSS (tree-shake) | MODIFY | E3 | 4 | 5 | M |
| P4-06 | Portfolio HTML (alt attributes) | MODIFY | ALL | 4 | 4 | S |
| P4-07 | Portfolio HTML (keyboard nav) | MODIFY | ALL | 4 | 4 | S |
| P4-08 | Portfolio HTML (skip nav link) | MODIFY | ALL | 4 | 4 | S |
| P4-09 | Portfolio CSS (contrast fix) | MODIFY | E4 | 4 | 3 | S |
| P4-10 | Portfolio HTML (semantic headings) | MODIFY | ALL | 4 | 5 | M |
| P4-11 | Portfolio HTML/CSS/JS (ARIA + reduced motion) | MODIFY | ALL | 4 | 3 | S |
| P4-12 | Portfolio CSS (4 breakpoints) | MODIFY | ALL | 4 | 6 | L |
| P4-13 | Portfolio CSS (A4 hybrid mobile) | MODIFY | E4 | 4 | 4 | M |
| P4-14 | Portfolio JS (IIFE wrapping) | MODIFY | ALL | 4 | 5 | S |
| P4-15 | resume-validation template ref (F-16) | MODIFY | ALL | 4 | 3 | S |
| P4-16 | antigravity CLI stubs (F-30) | MODIFY | ALL | 4 | 2 | S |
| P4-17 | installer/sync.js (F-32) | MODIFY | E2+E3 | 4 | 2 | M |
| P4-18 | Agent naming + branding (F-35, F-21, F-39) | MODIFY | E4 | 4 | 3 | M |

**Total Acceptance Criteria: ~295 individual checks across 70 file operations**

---

## 9. Integration Test Points Per Phase

### 9.1 Phase 0 Exit Tests

| # | Test | Method | Pass Condition | Failure Indicator |
|---|------|--------|---------------|-------------------|
| 1 | Path resolution | `grep -r "_bmad" linkright/` | Zero matches | Any match = path rewrite incomplete |
| 2 | Workflow dry-run | Run jd-optimize, outbound-campaign, portfolio-deploy in dry-run mode | All step file paths resolve | FileNotFoundError on any step |
| 3 | Template naming | `find . -name "*-template.md"` | Zero matches | Any match = rename incomplete |
| 4 | Engine resolution | Invoke workflow engine with each workflow.yaml | All `{installed_path}` and `{project-root}` variables resolve | Unresolved placeholder variable |

**Expected Phase 0 Duration**: 3-5 days

---

### 9.2 Phase 1 Exit Tests

| # | Test | Method | Pass Condition | Failure Indicator |
|---|------|--------|---------------|-------------------|
| 1 | Token migration | Load portfolio HTML, inspect `:root` computed styles | All `--lr-*` variables resolve to expected values | Any `undefined` or missing variable |
| 2 | Hardcoded color elimination | `grep -E "#[0-9A-Fa-f]{6}" portfolio.css` (outside `:root {}`) | Zero matches in CSS rules | Hardcoded hex in a non-`:root` rule |
| 3 | Print fidelity | Print resume to PDF, visual diff against pre-migration reference | Visual diff within tolerance | Color shifts, layout changes, missing elements |
| 4 | Step-34 execution | Run step-34 with Google company_brief | Selects `modern-minimal.html`, computes contrast for #4285F4 | Wrong template selected or contrast check skipped |
| 5 | Step-35 compilation | Run step-35 with step-34 output | Valid HTML with all 6 slots populated | Empty slot markers remain in output |
| 6 | Step-36 validation | Run step-36 against step-35 output | All 6 checks PASS | Any check FAIL without explanation |
| 7 | Data export | Run step-06b | Valid `jd-profile.yaml` + `company_brief.yaml` in shared-data/ | Files missing or schema validation fails |
| 8 | Preset loading | Parse each of 6 preset JSON files against schema | All validate | JSON parse error or schema violation |
| 9 | Cross-reference | `jd_profile.company_brief_id` vs `company_brief.id` | Match | ID mismatch |

**Expected Phase 1 Duration**: 5-8 days

---

### 9.3 Phase 2A Exit Tests (Cover Letter)

| # | Test | Method | Pass Condition | Failure Indicator |
|---|------|--------|---------------|-------------------|
| 1 | Cover letter generation | Run outbound-campaign steps 01 -> 03c | `cover_letter.md` produced with 300-400 words | Word count outside range |
| 2 | 3-paragraph structure | Parse generated cover letter | 3 paragraphs present with correct word sub-ranges | Missing paragraph or wrong structure |
| 3 | Tone variants | Run step-03b | 2 distinct variants generated | Fewer than 2 variants or identical variants |
| 4 | Validation checks | Run step-03c | All guardrail checks PASS | Generic phrases detected, missing metrics |
| 5 | View 3 rendering | Load portfolio, navigate to View 3 | Cover letter text visible with correct formatting | Placeholder content still shown |
| 6 | Print route | Print from View 3 | Separate A4 page with cover letter | Cover letter not printed or mixed with resume |
| 7 | HTML IDs | `grep "whygoogle" portfolio.html` | Zero matches | ID rename incomplete |
| 8 | Company_brief consumption | Run with Google company_brief | Tone = formal (or as specified), brand_values referenced in Hook | company_brief data not consumed |

**Expected Phase 2A Duration**: 5-7 days

---

### 9.4 Phase 2B Exit Tests (Beyond the Papers)

| # | Test | Method | Pass Condition | Failure Indicator |
|---|------|--------|---------------|-------------------|
| 1 | CSS isolation | Inspect computed `.section` styles in both scopes | `.lr-cv-scope .section { margin-bottom: 4mm }`, `.lr-btp-scope .section { padding: 60px 0 }` | Cross-contamination of styles |
| 2 | View 4 scrolling | Navigate to View 4, scroll | Content scrolls vertically; Views 1-3 do not scroll | View 4 has `overflow: hidden` or Views 1-3 scroll |
| 3 | Project cards | Render with 3+ project cards | Grid layout, responsive at 4 breakpoints | Cards do not render or layout breaks |
| 4 | Timeline | Render with 3-5 milestones | All entries visible in chronological order | Missing entries or wrong order |
| 5 | Carousel | Hero qualities rotation | CSS animation runs without JS dependency | Animation requires JS or does not animate |
| 6 | Schema validation | Run step-02c | `portfolio_content.json` passes schema validation | Validation failure |
| 7 | Zero jQuery | `grep -i "jquery" portfolio.html` | Zero matches | jQuery dependency present |
| 8 | Zero Webflow | `grep -i "webflow" portfolio.html` | Zero matches (except comments) | Webflow runtime referenced |
| 9 | Image hosting | Check all `<img src>` values | No Webflow CDN URLs | External image dependencies |
| 10 | Font loading | Network tab analysis | Inter + DM Serif Display loaded via single `<link>` | Duplicate font requests or missing fonts |

**Expected Phase 2B Duration**: 7-10 days

---

### 9.5 Phase 3 Exit Tests (Slides, Conditional)

| # | Test | Method | Pass Condition | Failure Indicator |
|---|------|--------|---------------|-------------------|
| 1 | Gate condition | Verify frontend-slides contract | Documented output format, file location, metadata schema | Any element undefined = DEFER |
| 2 | Signal selection | Run step-port-01 | Top-5 signals selected with impact_rank | Fewer than 5 or no ranking |
| 3 | Style selection | Run step-port-01b | `selected_style.json` with Abyssal Depth tokens | Missing or invalid style file |
| 4 | Slide rendering | Run step-port-01c | `slides_deck.html` produced, self-contained, < 200 KB | External dependencies or oversized |
| 5 | 5th nav item | Load portfolio, check sidebar | "Slide Deck" nav item visible and clickable | Missing or non-functional nav item |
| 6 | Lazy loading | Navigate to slides view, check network | Content loaded only on first view switch | Slides loaded on page load |
| 7 | State preservation | Switch to slides (slide 3), switch away, switch back | Slide 3 still displayed | State lost (resets to slide 1) |
| 8 | JS budget | Measure total JS size | Under 50 KB | Exceeds budget |

**Expected Phase 3 Duration**: 5-8 days (if gate met)

---

### 9.6 Phase 4 Exit Tests

| # | Test | Method | Pass Condition | Failure Indicator |
|---|------|--------|---------------|-------------------|
| 1 | Page weight | Chrome DevTools Network, throttled 4G | Initial load < 500 KB | Exceeds 500 KB |
| 2 | LCP | Lighthouse audit | < 2.5 seconds | Exceeds threshold |
| 3 | CLS | Lighthouse audit | < 0.1 | Exceeds threshold |
| 4 | INP | Lighthouse audit | < 200 ms | Exceeds threshold |
| 5 | Keyboard navigation | Tab through entire page | All interactive elements reachable with visible focus ring | Unreachable elements or missing focus ring |
| 6 | Screen reader | VoiceOver (macOS) walkthrough | All content announced, landmarks identified, headings navigable | Silent elements or missing landmarks |
| 7 | Reduced motion | Set `prefers-reduced-motion: reduce` | Zero animations visible | Animations still running |
| 8 | Mobile 479px | Chrome responsive mode | Bottom tab bar, single-column, readable | Layout broken or text too small |
| 9 | Mobile 767px | Chrome responsive mode | Horizontal nav, collapsed sections | Sidebar still showing |
| 10 | Tablet 991px | Chrome responsive mode | Icon-rail sidebar (60px) | Full sidebar or broken layout |
| 11 | Print resume | Ctrl+P from View 1 | A4 resume with correct colors, one page | Wrong layout or colors |
| 12 | Print cover letter | Ctrl+P from View 3 | Separate A4 cover letter | Mixed with resume or not printable |
| 13 | Global scope | Check `window` for leaked variables | Only `LinkrightCV` namespace | Other globals present |
| 14 | Finding resolution | Verify F-16, F-30, F-32, F-35, F-21, F-39 | All resolved | Any finding still open |

**Expected Phase 4 Duration**: 5-8 days

---

## 10. Risk Registry

### 10.1 Files with Highest Complexity

| Rank | File/Operation | Phase | Complexity Factors | Mitigation |
|------|---------------|-------|-------------------|------------|
| 1 | **P1-09**: Portfolio CSS `:root` token migration | 1 | 20 existing tokens + 6 hardcoded hex -> ~100+ `--lr-*` tokens. Print CSS fragility. Any error breaks all visual output. | Convert in batches: first 6 hardcoded hex (lowest risk), then 20 tokens, then add new tokens. Snapshot reference PDF before each batch. |
| 2 | **P2B-07**: Portfolio CSS BTP styles under `.lr-btp-scope` | 2B | ~40 new CSS variables, 4 responsive breakpoints, carousel animation, `.section` collision management. Largest single CSS change. | Implement styles incrementally: layout first, then typography, then colors, then animation. Test CSS isolation after each section. |
| 3 | **P2A-04**: Rewrite `step-out-03-cover-letter.md` | 2A | Most complex content generation logic. 3-paragraph structure with word count constraints, tone injection, guardrail checks. ~120 lines replacing 50 lines. | Write and test each paragraph generator independently. Validate word counts with automated tooling. |
| 4 | **P2B-06**: Portfolio HTML View 4 BTP content | 2B | Breaking the A4 page paradigm. Complex section stack. Interaction with existing `switchView()`. | Test View 4 isolation first (no other views loaded). Verify Views 1-3 unaffected after View 4 changes. |
| 5 | **P4-12**: Mobile responsive breakpoints | 4 | 4 breakpoints affecting every view. Sidebar transformation (sidebar -> icon rail -> top bar -> bottom tabs). | Implement one breakpoint at a time, test all views at each breakpoint before proceeding to next. |

### 10.2 Files with Most Dependencies

| Rank | File/Operation | Phase | Dependency Count | Depends On | Depended On By |
|------|---------------|-------|-----------------|------------|----------------|
| 1 | **P0-01**: `_bmad` path rewrite | 0 | 0 upstream | None | ALL subsequent operations |
| 2 | **P1-09**: CSS `:root` token migration | 1 | 3 upstream | P0-01, P0-04, P1-01/02/03 | ALL Phase 2+ CSS work, all preset consumption |
| 3 | **P1-04**: `step-06b-export-data-contract.md` | 1 | 2 upstream | P0-01, P1-05 | P2A-01 (session context loading), all cover letter steps |
| 4 | **P1-05**: `shared-data/` directory | 1 | 1 upstream | P0-01 | P1-04, P2A-01, all data handoff operations |
| 5 | **P2B-06**: Portfolio HTML View 4 | 2B | 3 upstream | P0-04, P2B-01, P1-09 | P2B-07 (CSS), P2B-09 (fonts), P2B-10 (deploy), P4-02 (hero GIF) |

### 10.3 Suggested Review Points

| Review Point | After Operation(s) | Reviewer Focus | Blocking? |
|-------------|---------------------|----------------|-----------|
| **R1: Path Rewrite Verification** | P0-01, P0-02, P0-03 | Zero `_bmad` references, all workflows resolve, all templates correctly named | YES -- blocks all Phase 1+ work |
| **R2: Token Migration Visual Diff** | P1-09 | Side-by-side comparison of portfolio before/after token migration. Print PDF comparison. | YES -- blocks Phase 2 CSS work |
| **R3: Theming Pipeline End-to-End** | P1-01 through P1-03 + P1-06/07/08 | Run step-34 -> 35 -> 36 with each of the 5 brand presets. Verify template selection, contrast checks, HTML output. | YES -- validates the entire theming system |
| **R4: Data Export Contract** | P1-04, P1-05 | Verify shared-data schemas match documentation. Cross-reference IDs. Test with missing company_brief (fallback path). | YES -- blocks Phase 2A |
| **R5: Cover Letter Quality Review** | P2A-04, P2A-05, P2A-06 | Generate 3+ cover letters for different companies/tones. Manual quality assessment. Verify guardrails. | ADVISORY -- does not block but informs quality |
| **R6: CSS Isolation Proof** | P2B-07 | Load portfolio with both CV and BTP views. Inspect `.section` computed styles in both scopes. Verify zero cross-contamination. | YES -- blocks View 4 deployment |
| **R7: Slides Gate Check** | Before Phase 3 | Verify all 4 gate conditions for frontend-slides. If any unmet, defer Phase 3. | YES -- determines Phase 3 go/no-go |
| **R8: Performance Audit** | P4-01 through P4-05 | Lighthouse audit on all 4G throttled. Verify < 500 KB initial load, < 2.5s LCP. | ADVISORY -- informs optimization priority |
| **R9: Accessibility Audit** | P4-06 through P4-11 | Full WCAG 2.1 AA audit. VoiceOver walkthrough. Keyboard-only navigation test. | ADVISORY -- informs accessibility remediation |
| **R10: Final Integration Test** | ALL complete | Complete end-to-end: run jd-optimize with a JD, run outbound-campaign for cover letter, run portfolio-deploy with BTP content. Verify live URL. | YES -- release gate |

### 10.4 Risk Severity Summary

| Risk | Severity | Phase | Mitigation Summary |
|------|----------|-------|-------------------|
| CSS `.section` collision between CV and BTP | **CRITICAL** | 2B | All BTP styles under `.lr-btp-scope` descendant selector at specificity 0,2,0. Review point R6. |
| CSS token migration breaks print output | **HIGH** | 1 | Batch conversion with PDF snapshot between each batch. Review point R2. |
| `_bmad` path rewrite scope (60+ files) | **HIGH** | 0 | Automated find-and-replace with manual review. Review point R1. |
| `frontend-slides` undefined interface | **CRITICAL** | 3 | Gate condition prevents all Phase 3 work. Review point R7. |
| Cover letter tone quality subjective | **MEDIUM** | 2A | Guardrail checks automate quality floor. Human review at R5. |
| BTP scope creep (full features vs reduced scope) | **HIGH** | 2B | Explicit reduced scope definition. No contact form, no 3D parallax, no Lottie, no jQuery. |
| Font loading performance (4 families) | **MEDIUM** | 2B | `font-display: swap` for primary, `optional` for decorative. Consolidated `<link>`. |
| Mobile breakpoint complexity | **MEDIUM** | 4 | One breakpoint at a time. A4 hybrid approach (reflowed mobile, A4 print). |
| `company_brief.yaml` schema stability | **MEDIUM** | 1 | Fix at v1.0. Future fields additive only (backward compatible). |
| z-index collision (sidebar vs BTP nav) | **LOW** | 2B | BTP nav stripped (CV sidebar used for all views). Safety margin: z-index 1001. |

---

## Appendix A: Cross-Reference to Source Plans

| PLAN-10b Section | Source Plan(s) |
|-----------------|---------------|
| Phase 0 prerequisites | PLAN-09c (Section 5), PLAN-09d ("Prerequisites Before ANY Enhancement Work") |
| Phase 1 CSS tokens | PLAN-06a (`:root` block), PLAN-01 (20 tokens + 6 hardcoded hex), PLAN-06cde (preset format) |
| Phase 1 theming steps | PLAN-08b (Section 4.1: step-34/35/36 specifications) |
| Phase 1 data export | PLAN-08b (Section 4.2: step-06b), PLAN-08a (GAP-02 closure) |
| Phase 1 brand presets | PLAN-06cde (Sections 1.2-1.6: JSON schema, directory, examples) |
| Phase 2A cover letter steps | PLAN-08b (Section 5), PLAN-08a (Enhancement 1) |
| Phase 2A cover letter template | PLAN-03d-04cd (Section 2: PLAN-04c cover letter view) |
| Phase 2A cover letter data pipeline | PLAN-03d-04cd (Section 3: PLAN-04d data pipeline), PLAN-08d (Stage 4) |
| Phase 2B BTP view design | PLAN-05 (section stack, CSS variables, responsive design) |
| Phase 2B BTP scope reduction | PLAN-09d (E3 risk mitigation, GO WITH REDUCED SCOPE) |
| Phase 2B CSS isolation | PLAN-09a (namespace strategy, `.section` collision, specificity budget) |
| Phase 3 slides | PLAN-03d-04cd (Section 1: slide content generation), PLAN-08a (Enhancement 2) |
| Phase 3 gate condition | PLAN-09d (E2 DEFER recommendation), PLAN-10a (Section 5.1) |
| Phase 4 performance | PLAN-09b (Section 5: optimization summary), ~3 MB -> ~500 KB |
| Phase 4 accessibility | PLAN-09b (Section 3: accessibility audit) |
| Phase 4 mobile | PLAN-09b (Section 4: mobile responsiveness strategy) |
| Phase 4 finding fixes | PLAN-09c (Section 2: findings that escalate with enhancements) |
| Agent RACI assignments | PLAN-08c (Agent Responsibility Matrix) |
| Data flow pipeline | PLAN-08d (full pipeline specification, 8 stages, 27 artifacts) |
| Risk ratings | PLAN-09d (Summary Risk Matrix): E1=LOW, E4=MEDIUM, E3=HIGH, E2=CRITICAL |
