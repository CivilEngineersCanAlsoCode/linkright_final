# PLAN-08e: File Locations and `_lr/` Structure Additions

**Date**: 2026-03-07
**Scope**: Comprehensive file location registry for Release 3 enhancements (Cover Letter, Slides, Beyond the Papers, Theming)
**Depends On**:
- `PLAN-08b-WORKFLOW-DEFINITIONS.md` (workflow step definitions)
- `PLAN-08d-DATA-FLOW-PIPELINE.md` (data flow pipeline, artifact registry)
- `PLAN-08-07b-INTEGRATION-ARCHITECTURE-SPECS.md` (integration architecture, 08a/08c/07b)
- `PLAN-06cde-THEMING-DESIGN.md` (theming system, preset format, accessibility)
- `PLAN-03d-04cd-SLIDES-COVERLETTER-DESIGN.md` (slides content gen, cover letter view)
- `PLAN-05-BEYOND-PAPERS-VIEW-DESIGN.md` (BTP view design)
**Related Beads**: `sync-rrd3` (PLAN-07b), `sync-7n7q` (PLAN-08)

---

## TABLE OF CONTENTS

1. [Current `_lr/` Directory Tree (As-Is Snapshot)](#1-current-_lr-directory-tree-as-is-snapshot)
2. [New Directories to Create](#2-new-directories-to-create)
3. [New Files Registry (by Enhancement)](#3-new-files-registry-by-enhancement)
4. [Modified Files Registry](#4-modified-files-registry)
5. [Shared Data Infrastructure](#5-shared-data-infrastructure)
6. [File Naming Conventions](#6-file-naming-conventions)
7. [Appendix: Complete Proposed `_lr/` Tree (Future State)](#7-appendix-complete-proposed-_lr-tree-future-state)

---

## 1. Current `_lr/` Directory Tree (As-Is Snapshot)

Captured 2026-03-07. Only Release 3-relevant directories expanded in full. Non-relevant modules (`cis/`, `tea/`, `squick/`, `lrb/`, `flex/`, `core/`) summarized.

```
linkright/_lr/
├── _config/                              # IDE configs, manifest
│   └── ides/                             # 20 YAML config files
│       ├── claude-code.yaml
│       ├── cursor.yaml
│       ├── windsurf.yaml
│       └── ... (17 more)
│   └── manifest.yaml                     # 34 IDE entries (to be trimmed per PLAN-07b)
├── _memory/                              # Agent sidecar memory directories
│   ├── config.yaml
│   ├── bond-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── core-sidecar/
│   │   ├── core-signals.json
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── flex-publicist-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── lr-orchestrator-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── lr-tracker-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── sync-inquisitor-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── sync-linker-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── sync-parser-sidecar/
│   │   ├── instructions.md
│   │   ├── memories.md
│   │   └── (additional file)
│   ├── sync-publicist-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── sync-refiner-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── sync-scout-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── sync-sizer-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   ├── sync-styler-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md
│   └── ... (14 more sidecars: m, morgan, q, qa, resume-versions,
│           squick-analyst, squick-architect, squick-pm, squick-qa,
│           squick-sm, squick-tech-writer, squick-ux, wendy,
│           insights)
├── _output/                              # Runtime output directory
├── agent-manifest.csv                    # 31 agent entries
├── files-manifest.csv                    # Full file registry
├── index.md                              # Module index
├── lr-config.yaml                        # Session configuration
├── workflow-manifest.csv                 # 28 workflow entries
├── cis/                                  # Creative & Innovation module (not R3)
├── core/                                 # Core module (not R3)
├── flex/                                 # Flex module (not R3)
├── lrb/                                  # Linkright Build module (not R3)
├── squick/                               # Squick module (not R3)
├── tea/                                  # Testing module (not R3)
└── sync/                                 # Sync module (PRIMARY R3 TARGET)
    ├── agents/
    │   ├── sync-inquisitor.md
    │   ├── sync-inquisitor.customize.yaml
    │   ├── sync-linker.md
    │   ├── sync-linker.customize.yaml
    │   ├── sync-narrator.md
    │   ├── sync-narrator.customize.yaml
    │   ├── sync-parser.md
    │   ├── sync-parser.customize.yaml
    │   ├── sync-publicist.md
    │   ├── sync-publicist.customize.yaml
    │   ├── sync-refiner.md
    │   ├── sync-refiner.customize.yaml
    │   ├── sync-scout.md
    │   ├── sync-scout.customize.yaml
    │   ├── sync-sizer.md
    │   ├── sync-sizer.customize.yaml
    │   ├── sync-styler.md
    │   ├── sync-styler.customize.yaml
    │   ├── sync-tracker.md
    │   └── sync-tracker.customize.yaml
    ├── config.yaml
    ├── docs/
    │   ├── SYNC-DESIGN-AND-TECHNICAL-SPECS.md
    │   └── SYNC-PRODUCT-AND-STRATEGY.md
    ├── knowledge/
    │   ├── patterns/
    │   │   ├── alignment-patterns.md
    │   │   └── recruiter-psychology.md
    │   └── recruiter-intelligence/
    ├── module-help.csv
    ├── teams/
    │   └── (2 files)
    ├── templates/                         # Currently EMPTY
    └── workflows/
        ├── application-track/
        │   ├── instructions.md
        │   ├── workflow.yaml
        │   ├── steps-c/                   # 3 step files
        │   ├── steps-e/                   # 2 step files
        │   ├── steps-v/                   # 7 step files
        │   └── templates/                 # 1 template
        ├── jd-optimize/                   # R3 TARGET
        │   ├── checklist.md
        │   ├── instructions.md
        │   ├── workflow.md
        │   ├── workflow.yaml
        │   ├── data/
        │   │   └── reference/             # 13 YAML reference files
        │   ├── steps-c/                   # 39 step files (step-01 through step-40)
        │   ├── steps-e/                   # 9 step files
        │   ├── steps-v/                   # 10 step files
        │   └── templates/
        │       └── optimized-jd.template.md
        ├── outbound-campaign/             # R3 TARGET
        │   ├── checklist.md
        │   ├── instructions.md
        │   ├── workflow.md
        │   ├── workflow.yaml
        │   ├── data/
        │   │   └── reference/
        │   │       └── jd-example.md
        │   ├── steps-b/                   # EMPTY directory
        │   ├── steps-c/                   # 8 step files
        │   ├── steps-e/                   # 2 step files
        │   ├── steps-v/                   # 1 step file
        │   └── templates/
        │       └── campaign.template.md
        ├── portfolio-deploy/              # R3 TARGET
        │   ├── checklist.md
        │   ├── instructions.md
        │   ├── workflow.md
        │   ├── workflow.yaml
        │   ├── data/                      # EMPTY directory
        │   ├── steps-c/                   # 5 step files
        │   ├── steps-e/                   # 2 step files
        │   ├── steps-v/                   # 1 step file
        │   └── templates/
        │       └── portfolio.template.md
        ├── quick-optimize/
        │   └── (standard workflow structure)
        └── signal-capture/
            └── (standard workflow structure)
```

**Key observations about current state:**

- `portfolio-deploy/data/` is an empty directory -- no static data files exist yet
- `sync/templates/` is empty -- module-level templates unused
- No `shared-data/` directory exists anywhere in `_lr/sync/`
- `jd-optimize/templates/` has only `optimized-jd.template.md` -- no resume HTML templates
- `outbound-campaign/templates/` has only `campaign.template.md` -- no cover letter template
- Steps 34/35/36 in jd-optimize are 13-line stubs (316-322 bytes each)
- `step-out-03-cover-letter.md` in outbound-campaign is 1310 bytes (incomplete 3-element structure)
- `step-port-02-beyond-the-papers.md` is 875 bytes (minimal, 34 lines)

---

## 2. New Directories to Create

### 2.1 Directory Creation Registry

| # | Path | Purpose | Rationale | Created By |
|---|------|---------|-----------|------------|
| D-01 | `_lr/sync/shared-data/` | Cross-workflow data exchange | Formal handoff location for `jd-profile.yaml` and `company_brief.yaml` between jd-optimize, outbound-campaign, and portfolio-deploy. Eliminates ad-hoc artifact cross-reading. (PLAN-08b Section 3.1, PLAN-08d Section 5) | `step-06b-export-data-contract.md` (first run) |
| D-02 | `jd-optimize/templates/resume-templates/` | Resume HTML templates | Houses `modern-minimal.html`, `modern-clean.html`, `modern-visual.html` for theming step-34 template selection matrix. (PLAN-08b Section 4.4) | Static creation during implementation |
| D-03 | `portfolio-deploy/data/presets/` | Brand preset JSON files | Houses `_default.preset.json` and company-specific presets (google, amazon, microsoft, spotify, sync). (PLAN-06c Section 1.4) | Static creation during implementation |
| D-04 | `portfolio-deploy/data/presets/_schema/` | Preset validation schemas | Houses `brand-preset.v1.schema.json` for validating preset file structure. (PLAN-06c Section 1.4) | Static creation during implementation |
| D-05 | `portfolio-deploy/artifacts/` | Runtime output artifacts | Currently implicit (no directory exists). Houses `slides_content.json`, `selected_style.json`, `slides_deck.html`, `portfolio_content.json`, `life_journey.html`, `portfolio_validation.json`, `contrast-report.json`. (PLAN-08d Section 4.4) | Created at first workflow run |
| D-06 | `portfolio-deploy/dist/` | Final deployment output | Assembled portfolio HTML for gh-pages push. Houses `index.html`, `slides.html`. (PLAN-08d Section 4.6) | `step-port-03-deploy.md` |
| D-07 | `portfolio-deploy/dist/assets/` | Deployment static assets | Compiled CSS and images. Houses `style.css`, `thumbnails/`. (PLAN-08d Section 4.6) | `step-port-03-deploy.md` |
| D-08 | `portfolio-deploy/dist/assets/thumbnails/` | Project card images | Thumbnail images for Beyond the Papers project cards. (PLAN-08d Section 4.6) | `step-port-03-deploy.md` |
| D-09 | `jd-optimize/artifacts/` | Runtime output artifacts | Currently implicit. Houses `theme-override.css`, `jd-{uuid}-draft.html`, `style-validation-report.json`. (PLAN-08d Section 4.2) | Created at first workflow run |
| D-10 | `outbound-campaign/artifacts/` | Runtime output artifacts | Currently implicit. Houses cover letter artifacts. (PLAN-08d Section 4.3) | Created at first workflow run |

**Note on `artifacts/` directories:** These directories are runtime-created and should be added to `.gitignore` since they contain per-run outputs. The `dist/` directory is the exception -- its contents are committed to the `gh-pages` branch (not `main`).

### 2.2 Directory Depth Map

```
Depth 0: linkright/_lr/
Depth 1:   sync/
Depth 2:     shared-data/                      [D-01] NEW
Depth 2:     workflows/
Depth 3:       jd-optimize/
Depth 4:         artifacts/                    [D-09] NEW (runtime)
Depth 4:         templates/
Depth 5:           resume-templates/           [D-02] NEW
Depth 3:       outbound-campaign/
Depth 4:         artifacts/                    [D-10] NEW (runtime)
Depth 3:       portfolio-deploy/
Depth 4:         artifacts/                    [D-05] NEW (runtime)
Depth 4:         data/
Depth 5:           presets/                    [D-03] NEW
Depth 6:             _schema/                  [D-04] NEW
Depth 4:         dist/                         [D-06] NEW (deployment)
Depth 5:           assets/                     [D-07] NEW
Depth 6:             thumbnails/               [D-08] NEW
```

---

## 3. New Files Registry (by Enhancement)

### 3.1 Enhancement Legend

| Code | Enhancement | Primary Workflow |
|------|------------|-----------------|
| **E1** | Cover Letter | `outbound-campaign` |
| **E2** | Slides | `portfolio-deploy` |
| **E3** | Beyond the Papers | `portfolio-deploy` |
| **E4** | Theming | `jd-optimize` + `portfolio-deploy` |

### 3.2 New Step Files

| # | File | Full Path (relative to `linkright/_lr/sync/workflows/`) | Enhancement | Type | Size Est. | Created By |
|---|------|--------------------------------------------------------|-------------|------|-----------|------------|
| S-01 | `step-06b-export-data-contract.md` | `jd-optimize/steps-c/step-06b-export-data-contract.md` | E1 + E4 | Step | ~4.5 KB | Implementation (PLAN-08b Section 4.2.1) |
| S-02 | `step-out-03b-cover-letter-variants.md` | `outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md` | E1 | Step | ~3.5 KB | Implementation (PLAN-08b Section 5.1.5) |
| S-03 | `step-out-03c-cover-letter-validation.md` | `outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md` | E1 | Step | ~4.0 KB | Implementation (PLAN-08b Section 5.1.6) |
| S-04 | `step-port-01b-style-selection.md` | `portfolio-deploy/steps-c/step-port-01b-style-selection.md` | E2 + E4 | Step | ~4.5 KB | Implementation (PLAN-08b Section 6.1.2) |
| S-05 | `step-port-01c-render-slides-html.md` | `portfolio-deploy/steps-c/step-port-01c-render-slides-html.md` | E2 | Step | ~5.0 KB | Implementation (PLAN-08b Section 6.1.3) |
| S-06 | `step-port-02b-life-narrative-video.md` | `portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md` | E3 | Step | ~3.5 KB | Implementation (PLAN-08b Section 6.2.2) |
| S-07 | `step-port-02c-portfolio-validation.md` | `portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md` | E3 | Step | ~3.5 KB | Implementation (PLAN-08b Section 6.2.3) |

**Totals: 7 new step files. Distribution: E1 = 3, E2 = 2, E3 = 2, E4 = 0 (shared with E1/E2)**

### 3.3 New Template Files

| # | File | Full Path (relative to `linkright/_lr/sync/workflows/`) | Enhancement | Type | Size Est. | Created By |
|---|------|--------------------------------------------------------|-------------|------|-----------|------------|
| T-01 | `cover_letter.template.md` | `outbound-campaign/templates/cover_letter.template.md` | E1 | Template | ~0.5 KB | Static (PLAN-08b Section 5.5) |
| T-02 | `modern-minimal.html` | `jd-optimize/templates/resume-templates/modern-minimal.html` | E4 | Template | ~8.0 KB | Static (PLAN-08b Section 4.4) |
| T-03 | `modern-clean.html` | `jd-optimize/templates/resume-templates/modern-clean.html` | E4 | Template | ~8.5 KB | Static (PLAN-08b Section 4.4) |
| T-04 | `modern-visual.html` | `jd-optimize/templates/resume-templates/modern-visual.html` | E4 | Template | ~9.0 KB | Static (PLAN-08b Section 4.4) |

**Totals: 4 new template files. Distribution: E1 = 1, E4 = 3**

### 3.4 New Data Files (Static Reference / Schemas)

| # | File | Full Path (relative to `linkright/_lr/sync/workflows/`) | Enhancement | Type | Size Est. | Created By |
|---|------|--------------------------------------------------------|-------------|------|-----------|------------|
| DF-01 | `abyssal-depth.preset.css` | `portfolio-deploy/data/abyssal-depth.preset.css` | E2 + E4 | Data (CSS) | ~1.5 KB | Static (Sync design tokens, PLAN-08b Section 6.1.2) |
| DF-02 | `portfolio-content.schema.json` | `portfolio-deploy/data/portfolio-content.schema.json` | E3 | Schema | ~2.0 KB | Static (PLAN-08-07b Section Enhancement 3) |
| DF-03 | `projects-source.yaml` | `portfolio-deploy/data/projects-source.yaml` | E3 | Data (YAML) | ~0.5 KB | User-provided (empty template, PLAN-08-07b Section Enhancement 3) |
| DF-04 | `_default.preset.json` | `portfolio-deploy/data/presets/_default.preset.json` | E4 | Data (JSON) | ~0.8 KB | Static (PLAN-06c Section 1.5) |
| DF-05 | `google.preset.json` | `portfolio-deploy/data/presets/google.preset.json` | E4 | Data (JSON) | ~1.2 KB | Static (PLAN-06c Section 1.6) |
| DF-06 | `amazon.preset.json` | `portfolio-deploy/data/presets/amazon.preset.json` | E4 | Data (JSON) | ~1.2 KB | Static (PLAN-06c Section 1.6) |
| DF-07 | `microsoft.preset.json` | `portfolio-deploy/data/presets/microsoft.preset.json` | E4 | Data (JSON) | ~1.2 KB | Static (PLAN-06c Section 1.6) |
| DF-08 | `spotify.preset.json` | `portfolio-deploy/data/presets/spotify.preset.json` | E4 | Data (JSON) | ~1.0 KB | Static (PLAN-06c Section 1.6) |
| DF-09 | `sync.preset.json` | `portfolio-deploy/data/presets/sync.preset.json` | E4 | Data (JSON) | ~1.0 KB | Static (PLAN-06c Section 1.6) |
| DF-10 | `brand-preset.v1.schema.json` | `portfolio-deploy/data/presets/_schema/brand-preset.v1.schema.json` | E4 | Schema | ~4.0 KB | Static (PLAN-06c Section 1.2) |

**Totals: 10 new data files. Distribution: E2 = 1 (shared E4), E3 = 2, E4 = 8 (including shared)**

### 3.5 New Shared Data Files (Cross-Workflow)

| # | File | Full Path (relative to `linkright/_lr/`) | Enhancement | Type | Size Est. | Created By |
|---|------|------------------------------------------|-------------|------|-----------|------------|
| SD-01 | `jd-profile.yaml` | `sync/shared-data/jd-profile.yaml` | E1 | Data (YAML) | ~2.0 KB | `jd-optimize/step-06b` (sync-scout + lr-tracker) |
| SD-02 | `company_brief.yaml` | `sync/shared-data/company_brief.yaml` | E1 + E4 | Data (YAML) | ~1.5 KB | `jd-optimize/step-06b` (sync-scout + lr-tracker) |
| SD-03 | `active-signals.json` | `sync/shared-data/active-signals.json` | E2 | Data (JSON) | ~1.0 KB | `signal-capture/step-02-extract` (future use) |

**Totals: 3 new shared data files. These are runtime-generated (overwritten per JD run).**

### 3.6 New Runtime Artifact Files (Not Committed to Git)

These files are produced during workflow execution. Listed here for completeness of the file registry.

| # | File | Full Path (relative to `linkright/_lr/sync/workflows/`) | Enhancement | Type | Producer Step | Size Est. |
|---|------|--------------------------------------------------------|-------------|------|-------------|-----------|
| A-01 | `theme-override.css` | `jd-optimize/artifacts/theme-override.css` | E4 | Artifact (CSS) | step-34-style-theming | ~0.5 KB |
| A-02 | `jd-{uuid}-draft.html` | `jd-optimize/artifacts/jd-{uuid}-draft.html` | E4 | Artifact (HTML) | step-35-style-compile | ~15.0 KB |
| A-03 | `style-validation-report.json` | `jd-optimize/artifacts/style-validation-report.json` | E4 | Artifact (JSON) | step-36-style-validation | ~1.0 KB |
| A-04 | `recruiter_profile.json` | `outbound-campaign/artifacts/recruiter_profile.json` | E1 | Artifact (JSON) | step-out-01-ingest | ~2.0 KB |
| A-05 | `outreach_strategy.json` | `outbound-campaign/artifacts/outreach_strategy.json` | E1 | Artifact (JSON) | step-out-02-strategy | ~2.5 KB |
| A-06 | `cover_letter.md` | `outbound-campaign/artifacts/cover_letter.md` | E1 | Artifact (MD) | step-out-03-cover-letter | ~2.0 KB |
| A-07 | `cover_letter_payload.json` | `outbound-campaign/artifacts/cover_letter_payload.json` | E1 | Artifact (JSON) | step-out-03-cover-letter | ~3.0 KB |
| A-08 | `cover_letter_variants.json` | `outbound-campaign/artifacts/cover_letter_variants.json` | E1 | Artifact (JSON) | step-out-03b | ~6.0 KB |
| A-09 | `cover_letter_final.md` | `outbound-campaign/artifacts/cover_letter_final.md` | E1 | Artifact (MD) | step-out-03c | ~2.0 KB |
| A-10 | `cover_letter_validation.json` | `outbound-campaign/artifacts/cover_letter_validation.json` | E1 | Artifact (JSON) | step-out-03c | ~1.5 KB |
| A-11 | `slides_content.json` | `portfolio-deploy/artifacts/slides_content.json` | E2 | Artifact (JSON) | step-port-01-compile | ~5.0 KB |
| A-12 | `selected_style.json` | `portfolio-deploy/artifacts/selected_style.json` | E2 + E4 | Artifact (JSON) | step-port-01b-style-selection | ~2.0 KB |
| A-13 | `slides_deck.html` | `portfolio-deploy/artifacts/slides_deck.html` | E2 | Artifact (HTML) | step-port-01c-render-slides-html | ~300.0 KB |
| A-14 | `portfolio_content.json` | `portfolio-deploy/artifacts/portfolio_content.json` | E3 | Artifact (JSON) | step-port-02-beyond-the-papers | ~4.0 KB |
| A-15 | `life_journey.html` | `portfolio-deploy/artifacts/life_journey.html` | E3 | Artifact (HTML) | step-port-02b-life-narrative-video | ~8.0 KB |
| A-16 | `portfolio_validation.json` | `portfolio-deploy/artifacts/portfolio_validation.json` | E3 | Artifact (JSON) | step-port-02c-portfolio-validation | ~1.5 KB |
| A-17 | `contrast-report.json` | `portfolio-deploy/artifacts/contrast-report.json` | E4 | Artifact (JSON) | step-port-03-deploy (CSS gen phase) | ~2.0 KB |

**Totals: 17 runtime artifact files. Distribution: E1 = 7, E2 = 3, E3 = 3, E4 = 4**

### 3.7 Deployment Output Files

| # | File | Full Path (relative to `linkright/_lr/sync/workflows/`) | Enhancement | Type | Producer Step | Size Est. |
|---|------|--------------------------------------------------------|-------------|------|-------------|-----------|
| DO-01 | `index.html` | `portfolio-deploy/dist/index.html` | All | Deploy output | step-port-03-deploy | ~150.0 KB |
| DO-02 | `slides.html` | `portfolio-deploy/dist/slides.html` | E2 | Deploy output | step-port-03-deploy | ~300.0 KB |
| DO-03 | `style.css` | `portfolio-deploy/dist/assets/style.css` | E4 | Deploy output | step-port-03-deploy | ~20.0 KB |

**Totals: 3 deployment output files (plus project thumbnails in `dist/assets/thumbnails/`).**

### 3.8 Consolidated New Files Summary

| Category | Count | Enhancement Distribution |
|----------|-------|------------------------|
| Step files | 7 | E1: 3, E2: 2, E3: 2 |
| Template files | 4 | E1: 1, E4: 3 |
| Data/Schema files | 10 | E2: 1, E3: 2, E4: 8 |
| Shared data files | 3 | E1: 1, E1+E4: 1, E2: 1 |
| Runtime artifacts | 17 | E1: 7, E2: 3, E3: 3, E4: 4 |
| Deployment outputs | 3 | All: 1, E2: 1, E4: 1 |
| **Total new files** | **44** | |

---

## 4. Modified Files Registry

### 4.1 Step Files to REWRITE (Full Replacement)

These files exist as stubs or incomplete implementations and require complete replacement with fully specified content.

| # | File | Full Path | Current Size | Target Size | Enhancement | Lines/Sections Affected | Source Spec |
|---|------|-----------|-------------|-------------|-------------|----------------------|-------------|
| R-01 | `step-34-style-theming.md` | `jd-optimize/steps-c/step-34-style-theming.md` | 316 bytes (13 lines) | ~4.5 KB | E4 | ALL lines replaced. New: 5 numbered sections (Load Brand Data, Template Selection Logic, Accessibility Contrast Check, Generate CSS Override, User Confirmation). | PLAN-08b Section 4.1.1 |
| R-02 | `step-35-style-compile.md` | `jd-optimize/steps-c/step-35-style-compile.md` | 316 bytes (13 lines) | ~4.0 KB | E4 | ALL lines replaced. New: 5 numbered sections (Load Template, Typography and Layout Variables, Print CSS Block, Assembly and Output, One-Page Verification). | PLAN-08b Section 4.1.2 |
| R-03 | `step-36-style-validation.md` | `jd-optimize/steps-c/step-36-style-validation.md` | 322 bytes (13 lines) | ~3.5 KB | E4 | ALL lines replaced. New: 3 numbered sections (Validation Checks [6-item table], Report Generation [JSON schema], User Presentation). | PLAN-08b Section 4.1.3 |
| R-04 | `step-out-03-cover-letter.md` | `outbound-campaign/steps-c/step-out-03-cover-letter.md` | 1310 bytes (~50 lines) | ~5.0 KB | E1 + E4 | ALL lines replaced. New: 5 numbered sections (Tone Injection, Three-Paragraph Structure [Hook/WhyMe/WhyThem], Constraint Enforcement, Guardrail Check, User Review). | PLAN-08b Section 5.1.4 |
| R-05 | `step-port-02-beyond-the-papers.md` | `portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` | 875 bytes (~34 lines) | ~5.0 KB | E3 | ALL lines replaced. New: structured data ingestion with project card schema, hobby card schema, Life Journey timeline entries. | PLAN-08b Section 6.2.1 |

**Totals: 5 files to REWRITE. Distribution: E1 = 1, E3 = 1, E4 = 3**

### 4.2 Step Files to MODIFY (Partial Changes)

These files require additions to existing content while preserving the current structure.

| # | File | Full Path | Enhancement | Modification Type | Sections Affected | What Changes |
|---|------|-----------|-------------|-------------------|-------------------|-------------|
| M-01 | `step-01-load-session-context.md` | `outbound-campaign/steps-c/step-01-load-session-context.md` | E1 | APPEND | After EXECUTION PROTOCOLS section | Add "ADDITIONAL CONTEXT LOADING (Release 3)" section: load `company_brief.yaml` from shared-data, validate `jd-profile.yaml` required fields (company, role_title, requirements.hard, persona_fit_primary), set 6 session variables. ~15 new lines. (PLAN-08b Section 5.1.1) |
| M-02 | `step-out-01-ingest.md` | `outbound-campaign/steps-c/step-out-01-ingest.md` | E1 | APPEND | Section "2. Preliminary Parsing", OUTPUT CONTRACT section | Add Tone Indicators extraction (4 patterns: formal, conversational, technical, vision-driven). Add Company Stage Signals extraction. Add `recruiter_tone_indicators[]` and `company_stage_inferred` to output contract. ~20 new lines. (PLAN-08b Section 5.1.2) |
| M-03 | `step-out-02-strategy.md` | `outbound-campaign/steps-c/step-out-02-strategy.md` | E1 + E4 | APPEND | Section "3. Define Tone", new Section 4 | Add tone resolution priority order (company_brief > recruiter_profile > default). Add tone-to-label mapping table. Add new Section "4. Company Brief Integration" (load brand_values, cautions). Update OUTPUT CONTRACT with `selected_tone`, `tone_source`, `brand_values[]`, `cautions[]`, `the_bridge` object. ~30 new lines. (PLAN-08b Section 5.1.3) |
| M-04 | `step-01-validate.md` | `outbound-campaign/steps-v/step-01-validate.md` | E1 | APPEND | After existing content | Add "COVER LETTER VALIDATION CRITERIA (Release 3)" section with 7 verification checks (word count, XYZ metric, bridge reference, tone match, generic phrases, company mentions, caution topics). Add artifact existence checks. ~15 new lines. (PLAN-08b Section 5.1.7) |
| M-05 | `step-06-final-output.md` | `jd-optimize/steps-c/step-06-final-output.md` | E1 | MODIFY | OUTPUT CONTRACT section | Add explicit reference to shared-data export path. Add note: "After final output, proceed to step-06b for cross-workflow data export." ~5 new lines. (PLAN-08-07b Section Enhancement 1) |
| M-06 | `step-port-01-compile.md` | `portfolio-deploy/steps-c/step-port-01-compile.md` | E2 | MODIFY (substantial) | EXECUTION PROTOCOLS, sections 1-5 | Replace basic signal query with full cosine similarity ranking algorithm (40% requirement relevance + 25% persona alignment + 20% metric density + 15% ownership match). Add explicit `slides_content.json` schema validation with 6-point checklist. Add user approval gate. Add Bridge signal force-ranking logic. ~80 new lines (effectively a near-rewrite but preserving the core structure). (PLAN-08b Section 6.1.1) |
| M-07 | `step-port-03-deploy.md` | `portfolio-deploy/steps-c/step-port-03-deploy.md` | E2 + E3 + E4 | MODIFY | Injection map, deployment actions | Add 7 injection points: `<!-- SLOT:SLIDES_DATA -->`, `<!-- SLOT:SLIDES_DECK -->`, `<!-- SLOT:PORTFOLIO_DATA -->`, `<!-- SLOT:LIFE_JOURNEY -->`, `<!-- SLOT:STYLE_TOKENS -->`, `<!-- BRAND_PRESET_INJECTION_POINT -->`, cover letter `data-field` injection. Add brand preset discovery algorithm. Add contrast validation phase. Add `dist/` assembly logic. Update commit message format. Add post-deploy URL verification. ~60 new lines. (PLAN-08b Section 6.3, PLAN-08d Stages 7-8) |

**Totals: 7 files to MODIFY. Distribution: E1 = 4, E2 = 2, E3 = 1, E4 = 3 (overlapping)**

### 4.3 Workflow Configuration Files to MODIFY

| # | File | Full Path | Enhancement | What Changes |
|---|------|-----------|-------------|-------------|
| W-01 | `workflow.yaml` | `jd-optimize/workflow.yaml` | E1 + E4 | Add `output_contracts` block declaring `jd_profile`, `company_brief`, `resume_html`, `theme_override` with paths and schema versions. Update description to include "with theming and data export". (PLAN-08b Section 4.3) |
| W-02 | `workflow.yaml` | `outbound-campaign/workflow.yaml` | E1 | Add `company_brief` to `input_file_patterns` (FULL_LOAD, optional, sourced from shared-data). Add `jd_profile` source path. Add `dependencies` block declaring jd-optimize as provider and flex-publicist as cross-module dependency. (PLAN-08b Section 5.2) |
| W-03 | `workflow.yaml` | `portfolio-deploy/workflow.yaml` | E2 + E3 + E4 | Add `projects_source` to `input_file_patterns` (FULL_LOAD). Add `company_brief` as optional input from shared-data. Add `output_contracts` for deployment artifacts. Add `dependencies` block. (PLAN-08-07b Section workflow.yaml updates) |

### 4.4 Checklist and Instructions Files to MODIFY

| # | File | Full Path | Enhancement | What Changes |
|---|------|-----------|-------------|-------------|
| C-01 | `checklist.md` | `outbound-campaign/checklist.md` | E1 | Add "1b. Cover Letter Phase (Release 3)" section: 7 validation items (3-para structure, word count, XYZ metric, bridge reference, tone match, generic absence, variants + final validated). (PLAN-08b Section 5.3) |
| C-02 | `checklist.md` | `jd-optimize/checklist.md` | E4 | Add theming validation section: template selection confirmed, brand color contrast checked, CSS override generated, all slots populated, print CSS present. |
| C-03 | `checklist.md` | `portfolio-deploy/checklist.md` | E2 + E3 + E4 | Add slides compilation section, Beyond the Papers validation section, brand preset application section, deployment verification section. |
| I-01 | `instructions.md` | `outbound-campaign/instructions.md` | E1 | Add "Cover Letter Protocol (Release 3)" section: 3-paragraph structure rules, word count guardrail, tone integration, variant generation rules. (PLAN-08b Section 5.4) |
| I-02 | `instructions.md` | `portfolio-deploy/instructions.md` | E2 + E3 + E4 | Add slides compilation protocol, Beyond the Papers data ingestion rules, dual-layer theming protocol, brand preset application rules. |

### 4.5 Sidecar Memory Files to MODIFY

| # | File | Full Path | Enhancement | What Changes |
|---|------|-----------|-------------|-------------|
| SM-01 | `instructions.md` | `_lr/_memory/sync-publicist-sidecar/instructions.md` | E1 | Add: Cover Letter Protocol (3-para structure), Variant Protocol (factual invariance rule), Word Count Guardrail (300-400 strict). (PLAN-08-07b Section Agent Responsibility) |
| SM-02 | `memories.md` | `_lr/_memory/sync-publicist-sidecar/memories.md` | E1 | Add: Tone mapping patterns for formal/conversational/technical/vision-driven. |
| SM-03 | `instructions.md` | `_lr/_memory/sync-styler-sidecar/instructions.md` | E2 + E4 | Add: Slide Compilation Protocol, Slide Rendering Protocol (zero-dependency HTML), Brand Injection Protocol (contrast check + accent rules), Dual-Layer Theming Protocol (Sync base + company overlay). |
| SM-04 | `memories.md` | `_lr/_memory/sync-styler-sidecar/memories.md` | E2 + E4 | Add: Abyssal Depth preset definition (6 brand tokens, 3 background tokens), Template Selection Matrix (company_stage x pm_culture). |
| SM-05 | `instructions.md` | `_lr/_memory/sync-scout-sidecar/instructions.md` | E4 | Add: Brand Research Protocol (extract brand_color_primary hex, brand_color_secondary hex, tone_descriptor from company website). |
| SM-06 | `memories.md` | `_lr/_memory/sync-linker-sidecar/memories.md` | E1 + E2 | Add: Bridge Selection refinement criteria (prioritize signals with both high impact_rank AND high persona_relevance). |

### 4.6 Consolidated Modification Summary

| Category | REWRITE | MODIFY | Total |
|----------|---------|--------|-------|
| Step files | 5 | 7 | 12 |
| Workflow YAML | 0 | 3 | 3 |
| Checklists | 0 | 3 | 3 |
| Instructions | 0 | 2 | 2 |
| Sidecar memory | 0 | 6 | 6 |
| **Total** | **5** | **21** | **26** |

---

## 5. Shared Data Infrastructure

### 5.1 `_lr/sync/shared-data/` Directory Structure

```
linkright/_lr/sync/shared-data/
├── jd-profile.yaml              [SD-01] Runtime, overwritten per JD run
├── company_brief.yaml           [SD-02] Runtime, overwritten per JD run
└── active-signals.json          [SD-03] Runtime, future use
```

### 5.2 File Provenance and Lifecycle

| File | Schema Version | Producer Workflow | Producer Step | Producer Agent(s) | Consumer Workflows | Lifecycle | Overwrite Policy |
|------|---------------|-------------------|---------------|-------------------|-------------------|-----------|-----------------|
| `jd-profile.yaml` | 1.0 | `jd-optimize` | `step-06b-export-data-contract` | sync-scout (Lyra), lr-tracker (Navi) | `outbound-campaign` (steps 01, out-02, out-03), `portfolio-deploy` (step-port-01) | Per JD run | User-confirmed overwrite if existing |
| `company_brief.yaml` | 1.0 | `jd-optimize` | `step-06b-export-data-contract` | sync-scout (Lyra), lr-tracker (Navi) | `outbound-campaign` (steps 01, out-02, out-03), `portfolio-deploy` (step-port-01b, port-03), `jd-optimize` (step-34) | Per JD run | User-confirmed overwrite if existing |
| `active-signals.json` | 1.0 | `signal-capture` | `step-02-extract` | (TBD) | `portfolio-deploy` (step-port-01) | Updated when signals change | Automatic (future) |

### 5.3 Cross-Workflow Handoff Map

```
                          jd-optimize
                         /    |    \
                        /     |     \
               (H-01)  /  (H-04) \  (H-02)
              /        |          \
             v         v           v
  outbound-campaign  jd-optimize  portfolio-deploy
  (steps 01,out-02,  (step-34,    (step-01b,
   out-03)           internal)     port-03)

  Handoff Files:
  H-01: jd-profile.yaml     (jd-optimize --> outbound-campaign, REQUIRED)
  H-02: company_brief.yaml  (jd-optimize --> portfolio-deploy, OPTIONAL)
  H-03: company_brief.yaml  (jd-optimize --> outbound-campaign, OPTIONAL)
  H-04: company_brief.yaml  (jd-optimize --> jd-optimize/step-34, OPTIONAL)
  H-05: cover_letter_payload.json  (outbound-campaign --> portfolio-deploy, OPTIONAL)
  H-06: slides_content.json (portfolio-deploy --> outbound-campaign, OPTIONAL cross-ref)
```

### 5.4 File Header Convention

All files in `shared-data/` MUST include a provenance header:

**YAML files:**
```yaml
# Producer: {workflow_name} ({step_file_name})
# Generated: {ISO 8601 timestamp}
# Schema version: {version}
```

**JSON files:**
```json
{
  "_meta": {
    "producer": "{workflow_name}/{step_file_name}",
    "generated_at": "{ISO 8601 timestamp}",
    "schema_version": "{version}"
  }
}
```

### 5.5 Fallback Behavior Matrix

| Consumer Step | Required File | If Missing |
|--------------|--------------|------------|
| `outbound-campaign/step-01` | `jd-profile.yaml` | STOP. Instruct user to run jd-optimize first. |
| `outbound-campaign/step-01` | `company_brief.yaml` | WARN. Continue with default tone ("formal"), no company personalization. |
| `jd-optimize/step-34` | `company_brief.yaml` | Default accent: `#0E9E8E` (Sync teal). Default template: `modern-minimal.html`. |
| `portfolio-deploy/step-port-01b` | `company_brief.yaml` | Use `--sync-coral-core` (#D9705A) as accent. No company overlay. |
| `portfolio-deploy/step-port-03` | `company_brief.yaml` | Use `_default.preset.json`. No company branding. |
| `outbound-campaign/step-out-03` | `slides_content.json` (from portfolio-deploy) | Defer cross-reference validation. Use Bridge from outreach_strategy only. |
| `portfolio-deploy/step-port-03` | `cover_letter_payload.json` (from outbound-campaign) | Deploy without cover letter view. Hide `#whygoogle-view` nav item. |

---

## 6. File Naming Conventions

### 6.1 Step File Naming

**Pattern:** `step-{prefix}{NN}{suffix}-{descriptive-name}.md`

| Component | Rule | Examples |
|-----------|------|---------|
| `{prefix}` | Workflow-specific prefix (empty for shared steps). `out-` for outbound-campaign. `port-` for portfolio-deploy. | `step-out-03-cover-letter.md`, `step-port-01-compile.md` |
| `{NN}` | Two-digit sequential number within the workflow. | `01`, `06`, `34` |
| `{suffix}` | Lowercase letter for sub-steps inserted between existing steps. | `step-06b-...`, `step-01b-...`, `step-03c-...` |
| `{descriptive-name}` | Kebab-case description of the step action. | `export-data-contract`, `style-theming`, `cover-letter-variants` |

**Examples of new step files following this convention:**

```
step-06b-export-data-contract.md          # jd-optimize, between step-06 and step-08
step-out-03b-cover-letter-variants.md     # outbound-campaign, after step-out-03
step-out-03c-cover-letter-validation.md   # outbound-campaign, after step-out-03b
step-port-01b-style-selection.md          # portfolio-deploy, after step-port-01
step-port-01c-render-slides-html.md       # portfolio-deploy, after step-port-01b
step-port-02b-life-narrative-video.md     # portfolio-deploy, after step-port-02
step-port-02c-portfolio-validation.md     # portfolio-deploy, after step-port-02b
```

### 6.2 Data File Naming

| Type | Pattern | Examples |
|------|---------|---------|
| Reference data | `{descriptive-name}.yaml` | `jd-ontology.yaml`, `ats-keyword-weights.yaml` |
| User-provided input | `{descriptive-name}.yaml` | `projects-source.yaml`, `jd-raw.md` |
| Schema files | `{name}.schema.json` | `portfolio-content.schema.json`, `brand-preset.v1.schema.json` |
| CSS preset data | `{name}.preset.css` | `abyssal-depth.preset.css` |

### 6.3 Brand Preset File Naming

**Pattern:** `{brand_id}.preset.json`

| Rule | Description |
|------|-------------|
| Filename stem MUST match the `brand_id` field inside the file | `google.preset.json` contains `"brand_id": "google"` |
| `brand_id` format | Kebab-case, 2-40 chars, `^[a-z0-9][a-z0-9-]*[a-z0-9]$` |
| Default preset | `_default.preset.json` (underscore prefix = system file) |
| Schema file | `brand-preset.v1.schema.json` (versioned, in `_schema/` subdirectory) |

**Examples:**
```
_default.preset.json     # System default (no company)
google.preset.json       # Google brand
amazon.preset.json       # Amazon brand
microsoft.preset.json    # Microsoft brand
spotify.preset.json      # Spotify brand
sync.preset.json         # Sync internal brand
stripe.preset.json       # Stripe brand (future)
```

### 6.4 Template File Naming

| Type | Pattern | Examples |
|------|---------|---------|
| Workflow output template | `{output-name}.template.md` | `optimized-jd.template.md`, `cover_letter.template.md`, `campaign.template.md` |
| Resume HTML template | `{style-name}.html` | `modern-minimal.html`, `modern-clean.html`, `modern-visual.html` |
| Portfolio HTML template | `portfolio.template.md` | (existing) |

### 6.5 Runtime Artifact File Naming

| Type | Pattern | Examples |
|------|---------|---------|
| JSON data artifacts | `{snake_case_name}.json` | `slides_content.json`, `selected_style.json`, `cover_letter_payload.json`, `outreach_strategy.json` |
| HTML output artifacts | `{descriptive_name}.html` | `slides_deck.html`, `life_journey.html` |
| UUID-stamped artifacts | `{type}-{uuid}-{stage}.{ext}` | `jd-a1b2c3d4-draft.html` |
| CSS artifacts | `{descriptive-name}.css` | `theme-override.css` |
| Markdown artifacts | `{snake_case_name}.md` | `cover_letter.md`, `cover_letter_final.md` |
| Validation reports | `{name}_validation.json` or `{name}-report.json` | `cover_letter_validation.json`, `style-validation-report.json`, `portfolio_validation.json`, `contrast-report.json` |

### 6.6 Shared Data File Naming

| Rule | Description |
|------|-------------|
| YAML for structured config data | `jd-profile.yaml`, `company_brief.yaml` |
| JSON for signal/event data | `active-signals.json` |
| Underscores for multi-word names | `company_brief.yaml`, not `company-brief.yaml` |
| Kebab-case for filenames with dashes | `jd-profile.yaml` |
| Schema version in file header, NOT in filename | Header: `# Schema version: 1.0` |

---

## 7. Appendix: Complete Proposed `_lr/` Tree (Future State)

Items marked `[NEW]` are additions from Release 3. Items marked `[REWRITE]` are existing files that require full replacement. Items marked `[MODIFY]` require partial changes. Items marked `[RUNTIME]` are created during workflow execution. Unmarked items are unchanged.

```
linkright/_lr/
├── _config/
│   └── ides/                              # (unchanged, 20 files)
│   └── manifest.yaml
├── _memory/
│   ├── config.yaml
│   ├── sync-publicist-sidecar/
│   │   ├── instructions.md                [MODIFY] Add Cover Letter Protocol, Variant Protocol, Word Count Guardrail
│   │   └── memories.md                    [MODIFY] Add tone mapping patterns
│   ├── sync-styler-sidecar/
│   │   ├── instructions.md                [MODIFY] Add Slide/Render/Brand/Dual-Layer protocols
│   │   └── memories.md                    [MODIFY] Add Abyssal Depth preset, Template Selection Matrix
│   ├── sync-scout-sidecar/
│   │   ├── instructions.md                [MODIFY] Add Brand Research Protocol
│   │   └── memories.md
│   ├── sync-linker-sidecar/
│   │   ├── instructions.md
│   │   └── memories.md                    [MODIFY] Add Bridge Selection refinement criteria
│   ├── sync-parser-sidecar/               # (unchanged)
│   ├── sync-refiner-sidecar/              # (unchanged)
│   ├── sync-inquisitor-sidecar/           # (unchanged)
│   ├── sync-sizer-sidecar/               # (unchanged)
│   ├── lr-tracker-sidecar/               # (unchanged)
│   ├── lr-orchestrator-sidecar/          # (unchanged)
│   ├── flex-publicist-sidecar/           # (unchanged)
│   └── ... (remaining sidecars unchanged)
├── _output/
├── agent-manifest.csv
├── files-manifest.csv                     [MODIFY] Add new file entries
├── index.md
├── lr-config.yaml
├── workflow-manifest.csv
├── cis/                                   # (unchanged)
├── core/                                  # (unchanged)
├── flex/                                  # (unchanged)
├── lrb/                                   # (unchanged)
├── squick/                                # (unchanged)
├── tea/                                   # (unchanged)
└── sync/
    ├── agents/                            # (unchanged -- no new agents needed)
    │   ├── sync-inquisitor.md
    │   ├── sync-inquisitor.customize.yaml
    │   ├── sync-linker.md
    │   ├── sync-linker.customize.yaml
    │   ├── sync-narrator.md
    │   ├── sync-narrator.customize.yaml
    │   ├── sync-parser.md
    │   ├── sync-parser.customize.yaml
    │   ├── sync-publicist.md
    │   ├── sync-publicist.customize.yaml
    │   ├── sync-refiner.md
    │   ├── sync-refiner.customize.yaml
    │   ├── sync-scout.md
    │   ├── sync-scout.customize.yaml
    │   ├── sync-sizer.md
    │   ├── sync-sizer.customize.yaml
    │   ├── sync-styler.md
    │   ├── sync-styler.customize.yaml
    │   ├── sync-tracker.md
    │   └── sync-tracker.customize.yaml
    ├── config.yaml
    ├── docs/
    │   ├── SYNC-DESIGN-AND-TECHNICAL-SPECS.md
    │   └── SYNC-PRODUCT-AND-STRATEGY.md
    ├── knowledge/
    │   ├── patterns/
    │   │   ├── alignment-patterns.md
    │   │   └── recruiter-psychology.md
    │   └── recruiter-intelligence/
    ├── module-help.csv
    ├── shared-data/                       [NEW] Cross-workflow data exchange directory
    │   ├── jd-profile.yaml                [NEW][RUNTIME] Producer: jd-optimize/step-06b
    │   ├── company_brief.yaml             [NEW][RUNTIME] Producer: jd-optimize/step-06b
    │   └── active-signals.json            [NEW][RUNTIME] Producer: signal-capture/step-02 (future)
    ├── teams/
    ├── templates/                          # (remains empty -- module-level templates unused)
    └── workflows/
        ├── application-track/             # (unchanged)
        ├── jd-optimize/
        │   ├── checklist.md               [MODIFY] Add theming validation section
        │   ├── instructions.md
        │   ├── workflow.md
        │   ├── workflow.yaml              [MODIFY] Add output_contracts block
        │   ├── artifacts/                 [NEW][RUNTIME] Created at first run
        │   │   ├── theme-override.css     [NEW][RUNTIME] Producer: step-34
        │   │   ├── jd-{uuid}-draft.html   [NEW][RUNTIME] Producer: step-35
        │   │   ├── style-validation-report.json  [NEW][RUNTIME] Producer: step-36
        │   │   └── optimized-jd.md        [RUNTIME] (existing artifact, unchanged)
        │   ├── data/
        │   │   └── reference/             # 13 YAML files (unchanged)
        │   │       ├── ats-keyword-weights.yaml
        │   │       ├── branded-vocabulary.yaml
        │   │       ├── compensation-bands.yaml
        │   │       ├── cultural-tokens.yaml
        │   │       ├── follow-up-cadence.yaml
        │   │       ├── industry-signals.yaml
        │   │       ├── interview-patterns.yaml
        │   │       ├── jd-ontology.yaml
        │   │       ├── metric-patterns.yaml
        │   │       ├── networking-hooks.yaml
        │   │       ├── resume-formatting.yaml
        │   │       ├── role-taxonomy.yaml
        │   │       └── seniority-markers.yaml
        │   ├── steps-c/
        │   │   ├── step-01-load-session-context.md
        │   │   ├── step-01b-resume-if-interrupted.md
        │   │   ├── step-03-keyword-extraction.md
        │   │   ├── step-04-competitive-moat.md
        │   │   ├── step-05-adversarial-review.md
        │   │   ├── step-06-final-output.md         [MODIFY] Add shared-data export reference
        │   │   ├── step-06b-export-data-contract.md [NEW] E1+E4: Cross-workflow data export
        │   │   ├── step-08-persona-score.md
        │   │   ├── step-09-persona-weighting.md
        │   │   ├── step-10-persona-validation.md
        │   │   ├── step-11-signal-query.md
        │   │   ├── step-12-signal-retrieval.md
        │   │   ├── step-13-signal-ranking.md
        │   │   ├── step-14-baseline-metrics.md
        │   │   ├── step-15-baseline-ownership.md
        │   │   ├── step-16-baseline-compilation.md
        │   │   ├── step-17-gap-identification.md
        │   │   ├── step-18-gap-taxonomy.md
        │   │   ├── step-19-gap-prioritization.md
        │   │   ├── step-20-inquisitor-prompt.md
        │   │   ├── step-21-inquisitor-dialogue.md
        │   │   ├── step-22-inquisitor-capture.md
        │   │   ├── step-23-inquisitor-verification.md
        │   │   ├── step-24-narrative-arc.md
        │   │   ├── step-25-narrative-mapping.md
        │   │   ├── step-26-narrative-validation.md
        │   │   ├── step-27-content-drafting.md
        │   │   ├── step-28-content-refining.md
        │   │   ├── step-29-content-xyz-format.md
        │   │   ├── step-30-content-review.md
        │   │   ├── step-31-layout-budget.md
        │   │   ├── step-32-layout-sizing.md
        │   │   ├── step-33-layout-onepage-check.md
        │   │   ├── step-34-style-theming.md         [REWRITE] E4: Full theming implementation
        │   │   ├── step-35-style-compile.md          [REWRITE] E4: HTML/CSS assembly
        │   │   ├── step-36-style-validation.md       [REWRITE] E4: Visual/structural QA
        │   │   ├── step-37-final-scoring.md
        │   │   ├── step-38-final-tracker-update.md
        │   │   ├── step-39-final-storage.md
        │   │   └── step-40-final-export.md
        │   ├── steps-e/                   # 9 files (unchanged)
        │   ├── steps-v/                   # 10 files (unchanged)
        │   └── templates/
        │       ├── optimized-jd.template.md
        │       └── resume-templates/      [NEW] Resume HTML templates directory
        │           ├── modern-minimal.html [NEW] E4: FAANG/enterprise template
        │           ├── modern-clean.html   [NEW] E4: Scale-up/startup template
        │           └── modern-visual.html  [NEW] E4: Creative/design-led template
        ├── outbound-campaign/
        │   ├── checklist.md               [MODIFY] Add cover letter validation section
        │   ├── instructions.md            [MODIFY] Add Cover Letter Protocol
        │   ├── workflow.md
        │   ├── workflow.yaml              [MODIFY] Add company_brief input, dependencies
        │   ├── artifacts/                 [NEW][RUNTIME] Created at first run
        │   │   ├── recruiter_profile.json [NEW][RUNTIME] Producer: step-out-01
        │   │   ├── outreach_strategy.json [NEW][RUNTIME] Producer: step-out-02
        │   │   ├── cover_letter.md        [NEW][RUNTIME] Producer: step-out-03
        │   │   ├── cover_letter_payload.json [NEW][RUNTIME] Producer: step-out-03
        │   │   ├── cover_letter_variants.json [NEW][RUNTIME] Producer: step-out-03b
        │   │   ├── cover_letter_final.md  [NEW][RUNTIME] Producer: step-out-03c
        │   │   └── cover_letter_validation.json [NEW][RUNTIME] Producer: step-out-03c
        │   ├── data/
        │   │   └── reference/
        │   │       └── jd-example.md
        │   ├── steps-b/                   # (empty, unchanged)
        │   ├── steps-c/
        │   │   ├── step-01-load-session-context.md  [MODIFY] E1: Add shared-data loading
        │   │   ├── step-01b-resume-if-interrupted.md
        │   │   ├── step-out-01-ingest.md            [MODIFY] E1: Add tone/stage extraction
        │   │   ├── step-out-02-strategy.md          [MODIFY] E1+E4: Add tone resolution, company brief
        │   │   ├── step-out-03-cover-letter.md      [REWRITE] E1+E4: Full 3-paragraph structure
        │   │   ├── step-out-03b-cover-letter-variants.md [NEW] E1: Tone variant generation
        │   │   ├── step-out-03c-cover-letter-validation.md [NEW] E1: Automated validation
        │   │   ├── step-out-04-in-mail.md
        │   │   ├── step-out-05-connect-invite.md
        │   │   └── step-out-06-profile-updates.md
        │   ├── steps-e/                   # 2 files (unchanged)
        │   ├── steps-v/
        │   │   └── step-01-validate.md    [MODIFY] E1: Add cover letter criteria
        │   └── templates/
        │       ├── campaign.template.md
        │       └── cover_letter.template.md [NEW] E1: Cover letter output template
        ├── portfolio-deploy/
        │   ├── checklist.md               [MODIFY] Add slides/BTP/theming sections
        │   ├── instructions.md            [MODIFY] Add slides/BTP/theming protocols
        │   ├── workflow.md
        │   ├── workflow.yaml              [MODIFY] Add projects_source, company_brief, deps
        │   ├── artifacts/                 [NEW][RUNTIME] Created at first run
        │   │   ├── slides_content.json    [NEW][RUNTIME] Producer: step-port-01
        │   │   ├── selected_style.json    [NEW][RUNTIME] Producer: step-port-01b
        │   │   ├── slides_deck.html       [NEW][RUNTIME] Producer: step-port-01c
        │   │   ├── portfolio_content.json [NEW][RUNTIME] Producer: step-port-02
        │   │   ├── life_journey.html      [NEW][RUNTIME] Producer: step-port-02b
        │   │   ├── portfolio_validation.json [NEW][RUNTIME] Producer: step-port-02c
        │   │   └── contrast-report.json   [NEW][RUNTIME] Producer: step-port-03 (CSS gen)
        │   ├── data/
        │   │   ├── abyssal-depth.preset.css [NEW] E2+E4: Sync ocean design tokens
        │   │   ├── portfolio-content.schema.json [NEW] E3: Validation schema
        │   │   ├── projects-source.yaml   [NEW] E3: User project data template
        │   │   └── presets/               [NEW] E4: Brand preset directory
        │   │       ├── _default.preset.json [NEW] E4: Default (no company) preset
        │   │       ├── google.preset.json   [NEW] E4: Google brand preset
        │   │       ├── amazon.preset.json   [NEW] E4: Amazon brand preset
        │   │       ├── microsoft.preset.json [NEW] E4: Microsoft brand preset
        │   │       ├── spotify.preset.json  [NEW] E4: Spotify brand preset
        │   │       ├── sync.preset.json     [NEW] E4: Sync internal brand preset
        │   │       └── _schema/             [NEW] E4: Schema validation directory
        │   │           └── brand-preset.v1.schema.json [NEW] E4: Preset JSON Schema
        │   ├── dist/                      [NEW][RUNTIME] Deployment output directory
        │   │   ├── index.html             [NEW][RUNTIME] Assembled portfolio page
        │   │   ├── slides.html            [NEW][RUNTIME] Standalone slide deck
        │   │   └── assets/                [NEW][RUNTIME]
        │   │       ├── style.css          [NEW][RUNTIME] Compiled CSS
        │   │       └── thumbnails/        [NEW][RUNTIME] Project card images
        │   ├── steps-c/
        │   │   ├── step-01-load-session-context.md
        │   │   ├── step-01b-resume-if-interrupted.md
        │   │   ├── step-port-01-compile.md          [MODIFY] E2: Full ranking algorithm
        │   │   ├── step-port-01b-style-selection.md  [NEW] E2+E4: Slide style + dual-layer theming
        │   │   ├── step-port-01c-render-slides-html.md [NEW] E2: Self-contained HTML rendering
        │   │   ├── step-port-02-beyond-the-papers.md [REWRITE] E3: Structured data ingestion
        │   │   ├── step-port-02b-life-narrative-video.md [NEW] E3: Timeline visualization
        │   │   ├── step-port-02c-portfolio-validation.md [NEW] E3: Schema validation
        │   │   └── step-port-03-deploy.md           [MODIFY] E2+E3+E4: Full injection map
        │   ├── steps-e/                   # 2 files (unchanged)
        │   ├── steps-v/
        │   │   └── step-01-validate.md    # (may need minor update)
        │   └── templates/
        │       └── portfolio.template.md
        ├── quick-optimize/                # (unchanged)
        └── signal-capture/                # (unchanged)
```

### File Count Delta Summary

| Directory | Current Files | New Files | Total After R3 |
|-----------|:------------:|:---------:|:--------------:|
| `_lr/sync/shared-data/` | 0 (dir does not exist) | 3 | 3 |
| `jd-optimize/steps-c/` | 39 | 1 | 40 |
| `jd-optimize/templates/` | 1 | 3 (in new subdir) | 4 |
| `jd-optimize/artifacts/` | 0 (dir does not exist) | 3 (runtime) | 3 |
| `outbound-campaign/steps-c/` | 8 | 2 | 10 |
| `outbound-campaign/templates/` | 1 | 1 | 2 |
| `outbound-campaign/artifacts/` | 0 (dir does not exist) | 7 (runtime) | 7 |
| `portfolio-deploy/steps-c/` | 5 | 4 | 9 |
| `portfolio-deploy/data/` | 0 | 10 (3 files + 7 in presets/) | 10 |
| `portfolio-deploy/artifacts/` | 0 (dir does not exist) | 7 (runtime) | 7 |
| `portfolio-deploy/dist/` | 0 (dir does not exist) | 3+ (deployment) | 3+ |
| `_memory/` (sidecars) | existing | 0 new files, 6 modified | (unchanged count) |
| **Total static/committed files** | | **24** | |
| **Total runtime artifacts** | | **20** | |
| **Total all new files** | | **44** | |

### Operation Totals (PLAN-08b Reconciliation)

| Operation | PLAN-08b Claimed | This Registry Count | Notes |
|-----------|:----------------:|:-------------------:|-------|
| New step files | 7 | 7 | Exact match (S-01 through S-07) |
| Modified step files | 6 | 7 | +1: step-port-01-compile is now substantial MODIFY (near-rewrite) |
| Rewritten step files | 5 | 5 | Exact match (R-01 through R-05) |
| Total step file ops | 18 | 19 | +1 from MODIFY reclassification |
| New shared-data dir | 1 | 1 | Exact match (D-01) |
| workflow.yaml updates | 3 | 3 | Exact match (W-01 through W-03) |
| checklist.md updates | 3 | 3 | Exact match (C-01 through C-03) |
| instructions.md updates | 2 | 2 | Exact match (I-01 through I-02) |
| New data/template files | 14 | 14 | Exact match (4 templates + 10 data files) |

---

*End of PLAN-08e: File Locations and `_lr/` Structure Additions*
