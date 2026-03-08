# PLAN-10a: Prioritized Implementation Sequence for Release 3 Enhancements

**Date**: 2026-03-07
**Scope**: Phased implementation roadmap for all 4 Linkright Release 3 enhancements
**Depends On**:
- `PLAN-01-PORTFOLIO-CV-AUDIT.md` (CV template DOM, CSS variables, JS, print pipeline)
- `PLAN-02-BEYOND-PAPERS-AUDIT.md` (BTP template, Webflow dependencies, colors, typography)
- `PLAN-03-04-SLIDES-PUBLICIST-AUDIT.md` (frontend-slides skill, outbound-campaign, gap analysis)
- `PLAN-05-BEYOND-PAPERS-VIEW-DESIGN.md` (BTP view architecture, section stack, animation system)
- `PLAN-06-DESIGN-SPECIFICATIONS.md` (CSS custom property taxonomy, typography, slides as 5th view, cover letter template)
- `PLAN-06cde-THEMING-DESIGN.md` (preset file format, accessibility/contrast, identity horizon)
- `PLAN-08-07b-INTEGRATION-ARCHITECTURE-SPECS.md` (workflow modifications map, RACI, IDE decision matrix)
- `PLAN-08b-WORKFLOW-DEFINITIONS.md` (step file specs, shared data infrastructure, workflow updates)
- `PLAN-03d-04cd-SLIDES-COVERLETTER-DESIGN.md` (slide content generation, signal mapping, cover letter schema)
- `PLAN-09-CROSS-CUTTING-CONCERNS.md` (CSS namespace conflicts, performance, accessibility, risk assessment)

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Prerequisites (Phase 0)](#2-prerequisites-phase-0)
3. [Phase 1: Foundation -- Brand Theming System](#3-phase-1-foundation----brand-theming-system)
4. [Phase 2: Views -- Cover Letter and Beyond the Papers](#4-phase-2-views----cover-letter-and-beyond-the-papers)
5. [Phase 3: Advanced -- Slides Integration](#5-phase-3-advanced----slides-integration)
6. [Phase 4: Polish -- IDE Cleanup, Cross-Cutting Fixes, Testing](#6-phase-4-polish----ide-cleanup-cross-cutting-fixes-testing)
7. [Critical Path Analysis](#7-critical-path-analysis)
8. [Phase Ordering Justification](#8-phase-ordering-justification)
9. [Integration Test Points](#9-integration-test-points)
10. [Rollback Strategy Per Phase](#10-rollback-strategy-per-phase)
11. [Total Effort Summary](#11-total-effort-summary)

---

## 1. Executive Summary

Release 3 introduces four enhancements to the Linkright portfolio system:

| ID | Enhancement | PLAN-09 Risk | Go/No-Go |
|----|-------------|-------------|----------|
| E1 | Cover Letter (Strategic Fit view) | **LOW** | **GO** |
| E4 | Theming System (CSS variable parameterization) | **MEDIUM** | **GO** |
| E3 | Beyond the Papers (personal narrative view) | **HIGH** | **GO -- REDUCED SCOPE** |
| E2 | Slides Integration (Value Prop view) | **CRITICAL** | **DEFER** |

These enhancements modify **3 existing workflows** (jd-optimize, outbound-campaign, portfolio-deploy) with no new top-level workflow directories required. The consolidated scope from PLAN-08a is:

- **7 MODIFY** + **5 REWRITE** + **14 CREATE** = **26 file operations** (step files + data + templates)
- **18 step file operations** across 3 workflows
- **3 workflow.yaml updates** + **3 checklist.md updates** + **2 instructions.md updates**
- ~100+ CSS custom property tokens across 17 categories
- 5 brand preset JSON files

This document sequences these operations into 4 phases with explicit dependency chains, acceptance criteria, risk mitigations, and rollback strategies.

---

## 2. Prerequisites (Phase 0)

**CRITICAL: These must be resolved BEFORE any enhancement work begins.**

Phase 0 addresses three escalating audit findings (PLAN-09c) and one architectural convention that, if unresolved, would break all enhancement work.

### 2.1 Files to Create/Modify

| # | File | Operation | Details |
|---|------|-----------|---------|
| P0-1 | 60+ files with `_bmad` path references | **MODIFY** | Global `_bmad` to `_lr` path rewrite (F-09, P0). Phantom paths in workflow steps, agent configs, and templates will break any new workflow that references templates or instructions. |
| P0-2 | `workflow.xml` execution engine | **CREATE/PORT** | Port workflow.xml engine from BMAD to Linkright (F-10, P0). If portfolio-deploy needs the engine for template population steps, its absence blocks all 4 enhancements. |
| P0-3 | 7 template files using `-template.md` convention | **RENAME** | Standardize to `.template.md` convention (F-20, P2 escalated). New enhancement templates must follow the correct convention; existing inconsistency breeds confusion. |
| P0-4 | CSS namespace convention document | **CREATE** | Establish the prefix scheme from PLAN-09a: `lr-cv-*` for CV, `lr-btp-*` for BTP, `--lr-*` for shared tokens. Add scoping containers: `<div class="lr-cv-scope">` and `<div class="lr-btp-scope">`. |

### 2.2 Agents to Update

None. Phase 0 is infrastructure work.

### 2.3 Workflows to Add/Modify

| Workflow | Change |
|----------|--------|
| All workflows referencing `_bmad/` paths | Global path rewrite |

### 2.4 Dependency Chain

```
F-09 (_bmad path rewrite)  ─┐
                             ├──> ALL Phase 1+ work
F-10 (workflow.xml engine)  ─┤
                             │
F-20 (template naming)      ─┤
                             │
CSS namespace convention    ─┘
```

F-09 is the critical blocker. F-10, F-20, and CSS namespace can proceed in parallel with F-09 but must all complete before Phase 1 begins.

### 2.5 Risk Level and Mitigation

| Risk Factor | Level | Mitigation |
|-------------|-------|------------|
| F-09 scope (60+ files) | **HIGH** | Automated find-and-replace with manual review. Test that all existing workflows still resolve their template/instruction paths after rewrite. |
| F-10 complexity (engine port) | **MEDIUM** | If the engine is too complex to port, use a shim that converts workflow.yaml references to direct file paths. |
| F-20 naming changes | **LOW** | Simple rename with grep verification. |
| CSS namespace adoption | **LOW** | Convention document only; actual CSS changes happen in Phase 1. |

### 2.6 Acceptance Criteria

- [ ] Zero `_bmad` path references remain in any Linkright file (verify: `grep -r "_bmad" linkright/`)
- [ ] `workflow.xml` engine (or shim) can resolve template paths for all 3 workflows
- [ ] All template files use `.template.md` naming convention
- [ ] CSS namespace convention document exists and is referenced by PLAN-06
- [ ] All existing workflows pass their validation checklists after path rewrite

---

## 3. Phase 1: Foundation -- Brand Theming System

**Enhancement**: E4 (Theming)
**PLAN-09 Risk**: MEDIUM / GO
**Rationale**: Theming is foundational infrastructure. All subsequent enhancements (cover letter tone, BTP colors, slide styling) consume the CSS custom property system and `company_brief.yaml` data contract. Building theming first prevents rework.

### 3.1 Files to Create/Modify

#### 3.1.1 Step Files (jd-optimize workflow)

| # | File | Operation | Enhancement | Details |
|---|------|-----------|-------------|---------|
| 1 | `jd-optimize/steps-c/step-34-style-theming.md` | **REWRITE** | E4 | Replace 13-line stub with full implementation: load `company_brief.yaml`, template selection matrix (FAANG->Modern-Minimal, etc.), WCAG contrast check (>=4.5:1), CSS variable injection (`--accent-color`), forbidden override rules (no background fills, no bullet colors). Output: `selected_template_path` + `theme-override.css`. |
| 2 | `jd-optimize/steps-c/step-35-style-compile.md` | **REWRITE** | E4 | Replace 13-line stub with full HTML/CSS assembly: load template, inject content via 6 slot markers (`<!-- SLOT:HEADER -->` through `<!-- SLOT:EDUCATION -->`), inject `theme-override.css`, apply typography variables (9.5pt/1.35/0.5in), add `@media print` block, output `jd-{uuid}-draft.html`. |
| 3 | `jd-optimize/steps-c/step-36-style-validation.md` | **REWRITE** | E4 | Replace stub with 6-check validation: sections populated, accent color applied, forbidden overrides absent, print CSS present, one-page estimate (<=58 lines), contrast ratio WCAG compliant. Output: `style-validation-report.json`. |

#### 3.1.2 Step Files (jd-optimize -- Data Export)

| # | File | Operation | Enhancement | Details |
|---|------|-----------|-------------|---------|
| 4 | `jd-optimize/steps-c/step-06b-export-data-contract.md` | **CREATE** | E4+E1 | Formal data handoff step: serialize `jd-profile.yaml` and `company_brief.yaml` to `_lr/sync/shared-data/`. Closes GAP-02 from PLAN-04a. Cross-reference validation between `jd_profile.company_brief_id` and `company_brief.id`. |

#### 3.1.3 Template Files

| # | File | Operation | Details |
|---|------|-----------|---------|
| 5 | `jd-optimize/templates/resume-templates/modern-minimal.html` | **CREATE** | FAANG/enterprise template. Clean, sparse layout. Contains 6 slot markers. |
| 6 | `jd-optimize/templates/resume-templates/modern-clean.html` | **CREATE** | Scale-up/startup template. Moderate visual interest, subtle section dividers. Contains 6 slot markers. |
| 7 | `jd-optimize/templates/resume-templates/modern-visual.html` | **CREATE** | Creative/design-led template. Visual accent bars, iconography placeholders. Contains 6 slot markers. |

#### 3.1.4 Data Files

| # | File | Operation | Details |
|---|------|-----------|---------|
| 8 | `_lr/sync/shared-data/` directory | **CREATE** | New shared data exchange directory for cross-workflow data handoff. |
| 9 | `_lr/sync/shared-data/company_brief.yaml` | **CREATE** (runtime) | Canonical company brief schema v1.0. Fields: `company_name`, `company_stage`, `brand.color_primary/secondary`, `tone_descriptor`, `pm_culture`, `brand_values[]`, `cautions[]`. |
| 10 | `_lr/sync/shared-data/jd-profile.yaml` | **CREATE** (runtime) | Canonical JD profile export schema v1.0. All fields from master orchestration lines 720-748. |

#### 3.1.5 CSS Foundation

| # | File | Operation | Details |
|---|------|-----------|---------|
| 11 | Portfolio template `:root` block | **MODIFY** | Replace 20 existing `--md-sys-color-*` and `--brand-*` tokens with unified `--lr-*` namespace (~100+ tokens across 17 categories per PLAN-06a). Convert 6 hardcoded CV hex values (#202124, #5F6368, #DADCE0, #E0E0E0, rgba(66,133,244,0.08), white) to `--lr-*` variables. |
| 12 | Brand preset files directory | **CREATE** | `_lr/sync/workflows/portfolio-deploy/data/presets/` directory |
| 13 | `google.preset.json` | **CREATE** | Google brand preset: blue #4285F4, red #EA4335, yellow #FBBC05, green #34A853 |
| 14 | `amazon.preset.json` | **CREATE** | Amazon brand preset: orange #FF9900, dark #232F3E |
| 15 | `microsoft.preset.json` | **CREATE** | Microsoft brand preset: blue #0078D4, green #7FBA00, yellow #FFB900, red #F25022 |
| 16 | `spotify.preset.json` | **CREATE** | Spotify brand preset: green #1DB954, dark #191414 |
| 17 | `sync.preset.json` | **CREATE** | Sync default preset: teal #0E9E8E, coral #D9705A, gold #C8973A |

#### 3.1.6 Workflow Configuration

| # | File | Operation | Details |
|---|------|-----------|---------|
| 18 | `jd-optimize/workflow.yaml` | **MODIFY** | Add `output_contracts` section declaring `jd_profile`, `company_brief`, `resume_html`, `theme_override` paths and schema versions. Update description to include "theming and data export". |

### 3.2 Agents to Update

| Agent | Persona | New Capabilities | Sidecar Changes |
|-------|---------|-------------------|-----------------|
| `sync-styler` | Cora | Resume template selection logic (company_stage + pm_culture matrix), CSS accent injection with accessibility check, company brand accent extraction support | `instructions.md`: Add "Brand Injection Protocol" (contrast check >=4.5:1, accent on header name + section dividers only, fallback to Sync teal). Add "Template Selection Matrix" to `memories.md`. |
| `sync-scout` | Lyra | Brand color extraction from company website/materials | `instructions.md`: Add "Brand Research Protocol" (always extract brand_color_primary hex, brand_color_secondary hex, tone_descriptor). |

### 3.3 Workflows to Add/Modify

| Workflow | Change Type | Details |
|----------|-------------|---------|
| `jd-optimize` | **MODIFY** | workflow.yaml: add output_contracts. checklist.md: add theming validation criteria (accent contrast, template selection, forbidden overrides). Add step-06b to step sequence after step-06. |
| `outbound-campaign` | **MODIFY** (prep) | workflow.yaml: add `company_brief.yaml` (FULL_LOAD) to `input_file_patterns`. This prepares the workflow for Phase 2 consumption. |

### 3.4 Dependency Chain

```
Phase 0 (all prerequisites)
    |
    v
[PARALLEL TRACK A]                    [PARALLEL TRACK B]
step-34 rewrite (template selection)   step-06b create (data export)
    |                                      |
    v                                      v
step-35 rewrite (HTML/CSS assembly)    shared-data/ directory + schemas
    |                                      |
    v                                      v
step-36 rewrite (style validation)     workflow.yaml updates
    |                                      |
    +----------> MERGE <------------------+
                   |
                   v
CSS :root token migration (--lr-* namespace)
                   |
                   v
Brand preset files (5 presets)
                   |
                   v
Agent sidecar updates (sync-styler, sync-scout)
```

Track A (theming steps 34-36) and Track B (data export + shared infrastructure) can proceed in parallel. The CSS token migration depends on both tracks completing to validate that the theming system works end-to-end.

### 3.5 Risk Level and Mitigation

| Risk Factor | Level | Mitigation |
|-------------|-------|------------|
| CSS token migration (20 existing + 6 hardcoded -> ~100+ `--lr-*` tokens) | **MEDIUM** | Convert CV hardcoded colors first (6 values, low risk). Test print output after each batch of token conversions. |
| Print CSS fragility | **MEDIUM** | Verify `* { -webkit-print-color-adjust: exact; }` works with variable-defined colors at each conversion step. Maintain a reference PDF snapshot before migration. |
| Gradient theming complexity (~6 BTP gradients with 3+ color stops) | **LOW** (deferred) | BTP gradient tokenization happens in Phase 2 when BTP content is integrated. Phase 1 only tokenizes CV template values. |
| Template selection matrix edge cases | **LOW** | Default fallback to `modern-minimal.html` for any unmapped company_stage/pm_culture combination. |
| `company_brief.yaml` schema stability | **MEDIUM** | Fix schema at v1.0 with all known fields. Future fields are additive only (backward compatible). |

### 3.6 Acceptance Criteria

- [ ] All 3 stub steps (34/35/36) replaced with full implementations per PLAN-08b specifications
- [ ] `step-06b-export-data-contract.md` created and integrated into jd-optimize step sequence
- [ ] `_lr/sync/shared-data/` directory exists with canonical schemas documented
- [ ] All 20 existing CV CSS custom properties migrated to `--lr-*` namespace
- [ ] All 6 hardcoded CV hex values converted to `--lr-*` variables
- [ ] 3 resume HTML templates created with 6 slot markers each
- [ ] 5 brand preset JSON files created with correct color values
- [ ] Template selection matrix produces correct template for each company_stage/pm_culture combination
- [ ] WCAG AA contrast validation passes for all 5 preset primary colors against white (#FFFFFF)
- [ ] Print output unchanged after token migration (visual diff against reference PDF)
- [ ] jd-optimize workflow.yaml updated with output_contracts section
- [ ] sync-styler and sync-scout sidecar files updated with new capability protocols

---

## 4. Phase 2: Views -- Cover Letter and Beyond the Papers

**Enhancements**: E1 (Cover Letter) + E3 (Beyond the Papers, reduced scope)
**PLAN-09 Risk**: E1=LOW/GO, E3=HIGH/GO-REDUCED-SCOPE
**Rationale**: Both enhancements populate empty portfolio views and can proceed in parallel once Phase 1 theming infrastructure is in place. E1 consumes the `company_brief.yaml` and `jd-profile.yaml` from Phase 1. E3 consumes the `--lr-*` CSS token system from Phase 1.

### 4.1 Sub-Phase 2A: Cover Letter (E1)

#### 4.1.1 Files to Create/Modify

##### Step Files (outbound-campaign workflow)

| # | File | Operation | Details |
|---|------|-----------|---------|
| 1 | `outbound-campaign/steps-c/step-01-load-session-context.md` | **MODIFY** | Add loading of `company_brief.yaml` + `jd-profile.yaml` from `_lr/sync/shared-data/`. Add validation of 4 required jd-profile fields (company, role_title, requirements.hard, persona_fit_primary). Add 6 session variable stores. |
| 2 | `outbound-campaign/steps-c/step-out-01-ingest.md` | **MODIFY** | Add tone indicator extraction (formal/conversational/technical/vision-driven language patterns). Add company stage signal inference. Update output contract: `recruiter_profile.json` gains `recruiter_tone_indicators[]` and `company_stage_inferred`. |
| 3 | `outbound-campaign/steps-c/step-out-02-strategy.md` | **MODIFY** | Add tone resolution (priority: company_brief > recruiter_profile > default). Add `brand_values[]` and `cautions[]` loading. Update output contract: `outreach_strategy.json` gains `selected_tone`, `tone_source`, `brand_values[]`, `cautions[]`, `the_bridge`. |
| 4 | `outbound-campaign/steps-c/step-out-03-cover-letter.md` | **REWRITE** | Full rewrite from 50-line incomplete structure to ~120-line implementation. 3-paragraph structure: Hook (60-80 words, company-specific reference), Why Me (120-160 words, Bridge signal + XYZ metric + 2 P0 requirements), Why Them (100-140 words, internal motivations + brand value reference). 300-400 word constraint with expansion/compression rules. Guardrail check against FORBIDDEN phrases. |
| 5 | `outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md` | **CREATE** | Generate 2 tone variants (e.g., Technical + Conversational) for user selection. Same factual content, different voice. Pattern: modify sentence structure and connective language only. |
| 6 | `outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md` | **CREATE** | Automated validation: word count (300-400), signal presence (>=1 XYZ metric), tone consistency (no register shifts), no generic phrases, company name >=2 mentions, no `cautions[]` topics. |
| 7 | `outbound-campaign/steps-v/step-01-validate.md` | **MODIFY** | Add cover-letter-specific validation criteria: word count range, signal density, Bridge reference, tone match against selected_tone. |

##### Template and Data Files

| # | File | Operation | Details |
|---|------|-----------|---------|
| 8 | `outbound-campaign/templates/cover_letter.template.md` | **CREATE** | Cover letter markdown template with 14 injection points per PLAN-06 (PLAN-04b). Variables: `{{SALUTATION}}`, `{{RECIPIENT_NAME}}`, `{{COMPANY_NAME}}`, `{{ROLE_TITLE}}`, `{{HOOK_PARAGRAPH}}`, `{{WHYME_PARAGRAPH}}`, `{{WHYTHEM_PARAGRAPH}}`, `{{CLOSING}}`, `{{USER_NAME}}`, `{{USER_TITLE}}`, `{{USER_EMAIL}}`, `{{USER_PHONE}}`, `{{LINKEDIN_URL}}`, `{{DATE}}`. |

##### Portfolio Template Changes

| # | File | Operation | Details |
|---|------|-----------|---------|
| 9 | Portfolio HTML (View 3) | **MODIFY** | Rename `whygoogle-view` to `whycompany-view` and `nav-whygoogle` to `nav-whycompany`. Replace 1px placeholder image and paragraph with formatted cover letter body. Add `.cover-letter-body` class for letter-specific typography (salutation, body, closing). |
| 10 | Portfolio CSS | **MODIFY** | Add cover letter print route: `@media print` rule for `.whycompany-view` (separate from resume print). Add `cover_letter_payload.json` consumption for dynamic content injection per PLAN-04b. |

##### Workflow Configuration

| # | File | Operation | Details |
|---|------|-----------|---------|
| 11 | `outbound-campaign/workflow.yaml` | **MODIFY** | Add `company_brief` input pattern (FULL_LOAD from shared-data). |
| 12 | `outbound-campaign/checklist.md` | **MODIFY** | Add cover letter validation criteria. |

##### Finding Fixes

| # | Finding | Operation | Details |
|---|---------|-----------|---------|
| 13 | F-08 | **FIX** | Add rules section to sync-publicist agent. Cover letter generation quality depends on having outreach/cover letter rules. |
| 14 | F-17 | **FIX** | Fix content-automation template name mismatch (escalated from P2 to P1). |

#### 4.1.2 Agents to Update (Cover Letter)

| Agent | Persona | New Capabilities | Sidecar Changes |
|-------|---------|-------------------|-----------------|
| `sync-publicist` | Lyric | 3-paragraph structure engine (Hook/WhyMe/WhyThem), tone injection from company_brief, variant generation (same facts, different voice), word count enforcement (300-400 strict), company brief consumption | `instructions.md`: Add "Cover Letter Protocol" (3-paragraph structure, word count guardrail 300-400). Add "Variant Protocol" (factual content identical, only voice/sentence structure change). |
| `sync-linker` | Atlas | "The Bridge" selection refinement | `memories.md`: Add "Bridge Selection refinement: prioritize signals with both high impact_rank AND high persona_relevance." |

#### 4.1.3 Workflows to Add/Modify (Cover Letter)

| Workflow | Change Type | Details |
|----------|-------------|---------|
| `outbound-campaign` | **MODIFY** | Add 2 new steps (03b, 03c) after existing step-out-03. Modify 4 existing steps (01, out-01, out-02, V-01). Rewrite 1 step (out-03). Update workflow.yaml input patterns. Update checklist.md. |

### 4.2 Sub-Phase 2B: Beyond the Papers (E3, Reduced Scope)

#### 4.2.1 Scope Reduction

Per PLAN-09d recommendation, the full BTP template integration is too risky for a single release. The reduced scope strips to essentials:

**INCLUDED:**
- Hero heading with rotating qualities carousel (CSS `@keyframes`, no jQuery)
- 3-4 static project highlight cards (grid layout, no hover glow animation)
- Condensed timeline (3-5 key milestones, static, no scroll animation)
- `.lr-btp-scope` CSS namespace wrapping

**EXCLUDED (deferred to Release 4):**
- Contact form (replaced with `mailto:` link)
- 3D parallax image grid
- Lottie success animation (~80 KB savings)
- jQuery dependency (~90 KB savings)
- Webflow runtime (~150 KB savings)
- Hidden timeline sections and password page
- Full scroll-triggered animation system

#### 4.2.2 Files to Create/Modify

##### Step Files (portfolio-deploy workflow)

| # | File | Operation | Details |
|---|------|-----------|---------|
| 1 | `portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` | **REWRITE** | Full rewrite from 34-line minimal step. Add structured data ingestion: project cards (title, description, thumbnail_url, external_link, tech_stack[], impact_summary), hobby/interest cards (category, narrative_hook), life journey timeline entries (year, milestone, type). Output: `portfolio_content.json`. |
| 2 | `portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md` | **CREATE** | Placeholder for future video integration. For now: generate static "Life Journey" timeline visualization from timeline entries. Output: `life_journey.html` section fragment. |
| 3 | `portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md` | **CREATE** | Validate `portfolio_content.json` against schema: minimum 3 project cards, at least 1 hobby card, all URLs valid, thumbnail dimensions specified. |
| 4 | `portfolio-deploy/steps-c/step-port-03-deploy.md` | **MODIFY** | Add injection of `portfolio_content.json` into portfolio template alongside existing content. Add BTP section injection into View 4. Update commit message format. |

##### Data and Schema Files

| # | File | Operation | Details |
|---|------|-----------|---------|
| 5 | `portfolio-deploy/data/portfolio-content.schema.json` | **CREATE** | JSON Schema for `portfolio_content.json`: projects[] (id, title, description, thumbnail_url, external_link, tech_stack[], impact_summary, display_order), hobbies[] (category, narrative_hook, icon), life_journey[] (year, milestone, type), video_placeholder (enabled, label). |
| 6 | `portfolio-deploy/data/projects-source.yaml` | **CREATE** (template) | User-provided input template for project/hobby/timeline data. |

##### Portfolio Template Changes

| # | File | Operation | Details |
|---|------|-----------|---------|
| 7 | Portfolio HTML (View 4) | **MODIFY** | Remove A4 page constraint for View 4 (change from `overflow: hidden` to `overflow-y: auto`). Add `.lr-btp-scope` wrapper div. Add BTP section stack: hero heading, qualities carousel, project card grid, condensed timeline. |
| 8 | Portfolio CSS | **MODIFY** | Add all BTP styles under `.lr-btp-scope` descendant selector to prevent `.section` collision. Add ~40 new `--lr-btp-*` CSS variables with responsive overrides at 4 breakpoints (1920px+, 991px, 767px, 479px). Add carousel `@keyframes` animation. Scope: `.lr-btp-scope .section { padding: 60px 0; }` (does not affect `.lr-cv-scope .section { margin-bottom: 4mm; }`). |
| 9 | Portfolio CSS (BTP colors) | **MODIFY** | Tokenize ~20-25 essential BTP color values (from ~50 total) into `--lr-btp-*` variables that reference the `--lr-*` base tokens. Key mappings: `--lr-btp-accent: #6057c3` -> `var(--lr-color-primary)`, `--lr-btp-gradient-start/end`, `--lr-btp-timeline-start/mid/end`. |

##### Font Loading

| # | File | Operation | Details |
|---|------|-----------|---------|
| 10 | Portfolio HTML `<head>` | **MODIFY** | Add Inter and DM Serif Display font families (BTP requirement). Use `font-display: swap` for Inter and DM Serif Display. Use `font-display: optional` for Aubrey (decorative, prevents late swap CLS). Consolidate with existing Roboto Google Fonts `<link>`. |

##### Workflow Configuration

| # | File | Operation | Details |
|---|------|-----------|---------|
| 11 | `portfolio-deploy/workflow.yaml` | **MODIFY** | Add `projects-source.yaml` (FULL_LOAD) to `input_file_patterns`. |
| 12 | `portfolio-deploy/checklist.md` | **MODIFY** | Add BTP validation criteria: project card count, timeline entry count, URL validation, responsive breakpoint testing. |

#### 4.2.3 Agents to Update (Beyond the Papers)

| Agent | Persona | New Capabilities | Sidecar Changes |
|-------|---------|-------------------|-----------------|
| `sync-styler` | Cora | Portfolio content structuring (map user projects/hobbies to structured JSON cards), life journey timeline generation, BTP CSS namespace management | `instructions.md`: Add "Portfolio Content Protocol" (minimum 3 project cards, structured data ingestion). |

#### 4.2.4 Workflows to Add/Modify (Beyond the Papers)

| Workflow | Change Type | Details |
|----------|-------------|---------|
| `portfolio-deploy` | **MODIFY** | Rewrite 1 step (port-02). Create 2 new steps (02b, 02c). Modify 1 step (port-03). Update workflow.yaml. Update checklist.md. |

### 4.3 Phase 2 Dependency Chain

```
Phase 1 (Theming complete)
    |
    +─────────────────────────────────────+
    |                                     |
    v                                     v
[SUB-PHASE 2A: Cover Letter]        [SUB-PHASE 2B: Beyond the Papers]

F-08 fix (publicist rules)           BTP CSS namespace implementation
    |                                     |
    v                                     v
step-01 modify (session context)     step-port-02 rewrite (data ingestion)
    |                                     |
    v                                     v
step-out-01 modify (tone extract)    step-port-02b create (timeline)
    |                                     |
    v                                     v
step-out-02 modify (strategy+tone)   step-port-02c create (validation)
    |                                     |
    v                                     v
step-out-03 rewrite (3-para CL)      Portfolio HTML/CSS (View 4 BTP)
    |                                     |
    v                                     v
step-out-03b create (variants)       Font loading consolidation
    |                                     |
    v                                     v
step-out-03c create (validation)     step-port-03 modify (deploy + BTP)
    |                                     |
    v                                     v
Portfolio HTML (View 3 CL inject)    portfolio-deploy workflow.yaml update
    |                                     |
    v                                     v
outbound-campaign workflow.yaml      Agent sidecar update (sync-styler)
    |
    v
Agent sidecar updates
(sync-publicist, sync-linker)
```

Sub-phases 2A and 2B are **fully independent** and can be developed in parallel. Neither depends on the other. Both depend on Phase 1 completion (theming tokens + shared data directory + company_brief.yaml schema).

### 4.4 Phase 2 Risk Level and Mitigation

| Risk Factor | Level | Enhancement | Mitigation |
|-------------|-------|-------------|------------|
| Cover letter quality without sync-scout research | **LOW** | E1 | Default to `tone_descriptor: "formal"` and skip brand values. Cover letter still works with generic company reference. |
| `whygoogle` -> `whycompany` HTML ID rename | **LOW** | E1 | Search-and-replace across portfolio HTML + JS. `switchView()` function references view IDs by parameter. |
| `.section` CSS collision during BTP integration | **CRITICAL** | E3 | All BTP styles scoped under `.lr-btp-scope .section {}`. CV styles scoped under `.lr-cv-scope .section {}`. Zero cross-contamination at specificity 0,2,0. |
| A4 page constraint removal for View 4 | **MEDIUM** | E3 | Only View 4 changes to `overflow-y: auto`. Views 1-3 retain `overflow: hidden`. View 4 breaks the one-page-per-view paradigm but this is architecturally necessary (PLAN-09d). |
| Font loading (4 families, ~8 weights) | **MEDIUM** | E3 | `font-display: swap` for primary fonts, `font-display: optional` for decorative (Aubrey). Consolidated `<link>` tag. Total font CSS increase: ~25 KB. |
| z-index collision (sidebar z:1000 vs BTP nav z:1000) | **LOW** | E3 | BTP nav is stripped (CV sidebar used for all views). No coexisting nav. Set CV sidebar to z-index: 1001 as safety margin. |
| Scope creep (full BTP features) | **HIGH** | E3 | Reduced scope is explicitly defined. No contact form, no 3D parallax, no Lottie, no jQuery. Review checkpoint after project cards + timeline are working. |

### 4.5 Phase 2 Acceptance Criteria

**Cover Letter (E1):**
- [ ] 3-paragraph cover letter generated with correct structure (Hook/WhyMe/WhyThem)
- [ ] Word count within 300-400 range for generated cover letters
- [ ] At least 1 XYZ-format metric present in Paragraph 2
- [ ] Tone injection works for all 4 tone types (Formal/Conversational/Technical/Vision-Driven)
- [ ] 2 tone variants generated in step-out-03b
- [ ] Automated validation catches: word count violations, missing signals, generic phrases
- [ ] Portfolio View 3 displays formatted cover letter (HTML ID: `whycompany-view`)
- [ ] Cover letter prints separately from resume via `@media print` route
- [ ] `company_brief.yaml` consumed correctly from shared-data directory

**Beyond the Papers (E3):**
- [ ] Portfolio View 4 displays BTP content with `.lr-btp-scope` CSS namespace
- [ ] No CSS class collisions between CV and BTP styles (verify `.section` isolation)
- [ ] Hero heading renders with rotating qualities carousel (CSS-only animation)
- [ ] 3-4 project cards render in responsive grid (collapses to single column at 479px)
- [ ] Condensed timeline renders 3-5 milestones (static, no scroll dependency)
- [ ] `portfolio_content.json` validates against schema (min 3 projects, 1 hobby)
- [ ] View 4 scrollable (`overflow-y: auto`) while Views 1-3 remain fixed
- [ ] All BTP images self-hosted (no Webflow CDN references)
- [ ] Zero jQuery, zero Webflow runtime in final output

---

## 5. Phase 3: Advanced -- Slides Integration

**Enhancement**: E2 (Slides)
**PLAN-09 Risk**: CRITICAL / DEFER
**Status**: This phase is **conditionally included**. Per PLAN-09d, E2 is recommended for deferral to Release 4. Phase 3 proceeds ONLY if the `frontend-slides` output contract is fully defined before Phase 3 begins.

### 5.1 Gate Condition

**Phase 3 does NOT begin unless ALL of the following are true:**

1. `frontend-slides` skill output format is documented (HTML, images, or PDF)
2. `frontend-slides` skill file location and naming convention is defined
3. `frontend-slides` metadata schema is specified (slide count, dimensions, aspect ratio)
4. A working prototype of `frontend-slides` output exists and can be manually inspected
5. Phase 1 and Phase 2 are complete and stable

If the gate condition is not met, Phase 3 is deferred entirely to Release 4. The portfolio View 2 ("Value Prop / Why Me?") remains in its current placeholder state.

### 5.2 Files to Create/Modify (Conditional)

##### Step Files (portfolio-deploy workflow)

| # | File | Operation | Details |
|---|------|-----------|---------|
| 1 | `portfolio-deploy/steps-c/step-port-01-compile.md` | **MODIFY** | Add explicit `slides_content.json` schema validation. Add top-5 signal selection with cosine similarity scoring against Strategic Gravity. Add `role_alignment` and `impact_rank` fields per slide. |
| 2 | `portfolio-deploy/steps-c/step-port-01b-style-selection.md` | **CREATE** | Style constrain step. Load Sync design tokens. Either bypass frontend-slides Phase 2 with pre-defined "Abyssal Depth" preset or constrain to compatible presets. Output: `selected_style.json`. Dual-layer theming: Sync base + company accent overlay. |
| 3 | `portfolio-deploy/steps-c/step-port-01c-render-slides-html.md` | **CREATE** | Invoke frontend-slides rendering pipeline with `slides_content.json` + `selected_style.json`. Generate self-contained HTML with inline CSS/JS. Apply Sync ocean-themed tokens. Output: `slides_deck.html`. |
| 4 | `portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` | **MODIFY** | Separate BTP concern from any slide compilation overlap. Add explicit reference to `slides_deck.html` injection point. |
| 5 | `portfolio-deploy/steps-c/step-port-03-deploy.md` | **MODIFY** | Add injection of `slides_deck.html` into portfolio template. Add post-deploy URL verification for slide deck. |

##### Data and Artifact Files

| # | File | Operation | Details |
|---|------|-----------|---------|
| 6 | `portfolio-deploy/data/abyssal-depth.preset.css` | **CREATE** | Sync ocean-themed design tokens for slides: Primary #0E9E8E teal, Accent #D9705A coral, Gold #C8973A, Backgrounds #091614/#0F1F1C/#122520. |
| 7 | `slides_content.json` | **CREATE** (runtime) | Per-deployment artifact: 5 slides with signal_id, title, sections (problem/process/metric/legacy), role_alignment, impact_rank, metadata (user_name, target_role, generated_at, signal_count, top_gravity). |
| 8 | `selected_style.json` | **CREATE** (runtime) | Style selection artifact from step-port-01b. |
| 9 | `slides_deck.html` | **CREATE** (runtime) | Self-contained HTML slide deck from step-port-01c. Zero external dependencies. |

##### Portfolio Template Changes

| # | File | Operation | Details |
|---|------|-----------|---------|
| 10 | Portfolio HTML (sidebar nav) | **MODIFY** | Add 5th sidebar nav item "Slide Deck" per PLAN-06 (PLAN-03c). |
| 11 | Portfolio HTML (View 2 / new View 5) | **MODIFY** | Add iframe-embedded slide deck with lazy loading (`data-src` attribute, loaded on view switch). Or: image-based carousel with WebP slide snapshots (preferred per PLAN-09d risk mitigation). |
| 12 | Portfolio JS (`switchView()`) | **MODIFY** | Add lazy-load logic: on first switch to slides view, copy `data-src` to `src` on iframe (or load slide images). Preserve slide state (current slide index) when switching away and back. |

### 5.3 Agents to Update (Slides)

| Agent | Persona | New Capabilities | Sidecar Changes |
|-------|---------|-------------------|-----------------|
| `sync-styler` | Cora | `slides_content.json` compilation (top-5 signals by cosine similarity), Abyssal Depth preset rendering, HTML self-contained rendering (zero-dependency output), dual-layer theming (Sync base + company accent) | `instructions.md`: Add "Slide Compilation Protocol", "Slide Rendering Protocol", "Dual-Layer Theming Protocol". `memories.md`: Add Abyssal Depth preset color values. |
| `sync-linker` | Atlas | Top-5 signal ranking for slides | No new capability needed (already has semantic mapping). |

### 5.4 Workflows to Add/Modify (Slides)

| Workflow | Change Type | Details |
|----------|-------------|---------|
| `portfolio-deploy` | **MODIFY** | Create 2 new steps (01b, 01c). Modify 3 existing steps (port-01, port-02, port-03). |

### 5.5 Phase 3 Dependency Chain

```
Phase 2 (both sub-phases complete)
    |
    v
GATE CHECK: frontend-slides contract defined?
    |
    [YES]                    [NO]
    |                         |
    v                         v
step-port-01 modify          DEFER TO RELEASE 4
    |                         (View 2 remains placeholder)
    v
step-port-01b create (style selection)
    |
    v
step-port-01c create (render HTML)
    |
    v
Portfolio HTML/JS (5th nav item + iframe/carousel)
    |
    v
step-port-02 modify (separate BTP from slides)
    |
    v
step-port-03 modify (inject slides_deck.html)
    |
    v
Agent sidecar updates (sync-styler slide protocols)
```

### 5.6 Phase 3 Risk Level and Mitigation

| Risk Factor | Level | Mitigation |
|-------------|-------|------------|
| `frontend-slides` undefined interface | **CRITICAL** | Gate condition prevents work without defined contract. If gate fails, entire phase is deferred. |
| Slide renderer size (reveal.js ~300KB, impress.js ~100KB) | **HIGH** | Do NOT embed a slide runtime. Use image-based rendering (screenshot each slide as WebP) per PLAN-09d. This eliminates iframe/CSS isolation issues and keeps performance budget. |
| Iframe CSS isolation (theming cannot penetrate iframe) | **HIGH** | Prefer image-based carousel over iframe. If iframe is required, pass brand colors via URL parameters or postMessage API. |
| A4 portrait vs 16:9 landscape aspect ratio mismatch | **MEDIUM** | Letterbox slides within the view container: `.slide-embed { aspect-ratio: 16/9; width: 100%; max-width: 100%; }`. |
| `switchView()` state preservation for slide index | **LOW** | Store `currentSlideIndex` in a closure variable. Restore on view re-entry. |
| Slide print behavior (multi-page vs single-page) | **MEDIUM** | Print slides as vertical stack with `page-break-after: always` per slide. Separate from resume print route. |
| Combined JS budget (target <50KB total) | **MEDIUM** | Slide carousel controller: ~2KB. Image lazy-loader: ~1KB. Well within budget if no runtime framework is used. |

### 5.7 Phase 3 Acceptance Criteria

- [ ] Gate condition met: `frontend-slides` output contract fully defined
- [ ] Top-5 signals selected by cosine similarity and compiled into `slides_content.json`
- [ ] Abyssal Depth preset applied to slide rendering
- [ ] Self-contained `slides_deck.html` generated with zero external dependencies
- [ ] 5th sidebar nav item ("Slide Deck") visible and functional
- [ ] Slide view lazy-loads on first navigation (not on initial page load)
- [ ] Slide index state preserved when switching between views
- [ ] Dual-layer theming works: Sync base colors + company accent overlay
- [ ] Combined JS remains under 50 KB
- [ ] Slides printable as vertical stack (one per page)
- [ ] No performance regression: LCP remains under 2.5s on 4G

---

## 6. Phase 4: Polish -- IDE Cleanup, Cross-Cutting Fixes, Testing

**Scope**: All remaining cross-cutting concerns from PLAN-09, accessibility fixes, performance optimization, and final integration testing.
**Risk**: LOW-MEDIUM (all high-risk work completed in Phases 1-3)

### 6.1 Files to Create/Modify

#### 6.1.1 Performance Optimization

| # | File | Operation | Details | Size Impact |
|---|------|-----------|---------|-------------|
| 1 | Portfolio HTML (profile photo) | **MODIFY** | Convert base64 profile photo to external WebP file (~50 KB at quality 85). Add `<link rel="preload" as="image" href="profile.webp">`. | **-570 KB** |
| 2 | Portfolio HTML (hero GIF) | **MODIFY** | Convert hero GIF to WebM video with `<video autoplay muted loop>`. | **-500 KB to -1.5 MB** |
| 3 | Portfolio HTML (images) | **MODIFY** | Add `loading="lazy"` to all below-fold images (6+ BTP images). Self-host all images as WebP. | **-1.2 MB deferred** |
| 4 | Portfolio HTML (fonts) | **MODIFY** | Consolidate all Google Fonts to single `<link>` tag. Verify `font-display: swap` for all families. | **-20 KB** |
| 5 | Portfolio CSS | **MODIFY** | Tree-shake unused Webflow CSS (hidden timelines, utility pages, password page styles). | **-30 KB** |

**Total performance savings: ~2.5 MB (83% reduction from ~3.0 MB to ~500 KB initial load)**

#### 6.1.2 Accessibility Fixes

| # | Fix | Priority | Effort | Details |
|---|-----|----------|--------|---------|
| 6 | Alt attributes on all images | P0 | Low | Profile photo, hero GIF/video, project screenshots, company logos. |
| 7 | Keyboard navigation for `.nav-item` | P0 | Low | Add `tabindex="0"`, `role="button"`, `onkeydown` (Enter/Space handler) to CV sidebar nav items. |
| 8 | Skip navigation link | P1 | Low | `<a href="#main-content" class="skip-link">Skip to content</a>` at top of page. |
| 9 | Color contrast fix | P1 | Low | `--lr-brand-blue` needs darkening to #2A6CC7 (~4.6:1 ratio) for WCAG AA compliance on white. (Note: the theming system from Phase 1 may already handle this via the WCAG contrast check in step-34.) |
| 10 | Semantic heading hierarchy | P1 | Medium | Add `<h1>` for user name, `<h2>` for section titles in CV template (currently all `<div>` with class names). |
| 11 | `aria-current="page"` on active nav | P2 | Low | Add to the active `.nav-item` in `switchView()`. |
| 12 | `prefers-reduced-motion` | P2 | Low | Media query to disable BTP carousel animation and any 3D transforms for users who prefer reduced motion. |

#### 6.1.3 Mobile Responsiveness

| # | File | Operation | Details |
|---|------|-----------|---------|
| 13 | Portfolio CSS | **MODIFY** | Add 4 breakpoints aligned with BTP: >=1200px (full sidebar + A4), 992-1199px (sidebar collapses to 60px icon rail), 768-991px (top horizontal nav bar), <=767px (bottom tab bar). |
| 14 | Portfolio CSS | **MODIFY** | A4 page hybrid handling: reflowed "mobile resume" on small screens, `window.print()` always produces A4 PDF. |

#### 6.1.4 Cross-Cutting Finding Fixes

| # | Finding | Priority | Details |
|---|---------|----------|---------|
| 15 | F-16 | P1 (escalated) | Fix resume-validation broken template reference. Validation workflow must validate cover letter, BTP content, and slides output. |
| 16 | F-30 | P2 (escalated) | Fix command stubs referencing non-existent `antigravity` CLI. Ensure `portfolio-deploy` workflow can be invoked. |
| 17 | F-32 | P2 (escalated) | Fix installer/sync.js stub. Required if enhancements need sync capabilities for slide decks or BTP content. |
| 18 | F-35 | P2 | Unify agent display names across all files (theming system needs consistent naming). |
| 19 | F-21 | P2 | Remove BMAD branding from test-design-handoff template and any other templates. |
| 20 | F-39 | P2 | Update memory sidecar instructions to use correct agent names. |

#### 6.1.5 JS Modularization

| # | File | Operation | Details |
|---|------|-----------|---------|
| 21 | Portfolio JS | **MODIFY** | Wrap all JS in IIFE to prevent global pollution: `const LinkrightCV = (() => { function switchView(viewId) { ... } return { switchView }; })();`. Add IntersectionObserver for BTP scroll-triggered animations (if any enabled in reduced scope). |

### 6.2 Agents to Update

| Agent | Change | Details |
|-------|--------|---------|
| All agents with name inconsistencies (F-35) | **FIX** | Unify display names across agent files, sidecar memories, and instructions. |
| `sync-narrator` (F-03) | **FIX** | Correct persona references if affected by naming inconsistencies. |

### 6.3 Workflows to Add/Modify

| Workflow | Change Type | Details |
|----------|-------------|---------|
| `resume-validation` | **FIX** | Fix broken template reference (F-16). Add validation for cover letter, BTP, and slides outputs. |
| All workflows with `antigravity` references | **FIX** | Update CLI references (F-30). |

### 6.4 Phase 4 Dependency Chain

```
Phase 2 complete (Phase 3 optional)
    |
    v
[PARALLEL TRACK A]           [PARALLEL TRACK B]           [PARALLEL TRACK C]
Performance optimization      Accessibility fixes           Finding fixes
(images, fonts, CSS)          (alt text, keyboard,          (F-16, F-30, F-32,
                               skip nav, contrast,           F-35, F-21, F-39)
                               headings, ARIA)
    |                              |                              |
    +──────────> MERGE <──────────+──────────────────────────────+
                   |
                   v
Mobile responsiveness (4 breakpoints)
                   |
                   v
JS modularization (IIFE wrapping)
                   |
                   v
Final integration testing
```

All three tracks are independent and can proceed in parallel. Mobile responsiveness depends on performance optimization completion (final CSS structure needed). JS modularization is the final step before integration testing.

### 6.5 Phase 4 Risk Level and Mitigation

| Risk Factor | Level | Mitigation |
|-------------|-------|------------|
| Base64 to WebP conversion (profile photo) | **LOW** | One-time conversion. Verify print output still renders the photo. |
| GIF to WebM conversion | **LOW** | Use `ffmpeg -i hero.gif -c:v libvpx-vp2 -b:v 1M hero.webm`. Add `<img>` fallback for Safari (WebM support varies). |
| Mobile breakpoint integration | **MEDIUM** | The A4 page model is fundamentally incompatible with mobile. Use hybrid approach (reflowed mobile, A4 for print). Test all 4 breakpoints. |
| Finding fixes (F-16, F-30, F-32) | **LOW** | These are isolated fixes with no cascade risk. |
| IIFE JS wrapping | **LOW** | No behavioral change. Only scope containment. Test `switchView()` still works via `LinkrightCV.switchView()` or by exposing on window for backward compatibility. |

### 6.6 Phase 4 Acceptance Criteria

- [ ] Initial page load under 500 KB (from ~3.0 MB)
- [ ] Total page weight under 1.5 MB (with lazy-loaded images)
- [ ] LCP under 2.5 seconds on simulated 4G connection
- [ ] CLS under 0.1
- [ ] INP under 200ms (no jQuery, no Webflow runtime)
- [ ] All images have meaningful `alt` attributes
- [ ] Keyboard navigation works: Tab through all nav items, Enter/Space to activate
- [ ] Skip navigation link visible on focus and functional
- [ ] All `--lr-*` color tokens pass WCAG AA contrast (>=4.5:1 for normal text)
- [ ] Semantic heading hierarchy: `<h1>` for name, `<h2>` for section titles
- [ ] `prefers-reduced-motion` disables all animations
- [ ] Portfolio renders correctly at all 4 breakpoints (1200px+, 992-1199px, 768-991px, <=767px)
- [ ] Mobile bottom tab bar navigation functional at <=767px
- [ ] Print output (resume) unchanged after all optimizations (visual diff against reference)
- [ ] Cover letter print route produces separate A4 PDF
- [ ] All JS wrapped in IIFE with zero global pollution (except intentional exports)
- [ ] F-16, F-30, F-32, F-35, F-21, F-39 resolved
- [ ] All existing workflow validation checklists pass

---

## 7. Critical Path Analysis

The critical path identifies the longest sequence of dependent tasks that determines the minimum total project duration.

```
CRITICAL PATH (sequential, cannot be parallelized):

F-09 (_bmad path rewrite)                          Phase 0    [2-3 days]
    |
    v
CSS :root token migration (--lr-* namespace)        Phase 1    [2-3 days]
    |
    v
step-34/35/36 rewrite (theming pipeline)            Phase 1    [3-4 days]
    |
    v
step-06b create (data export to shared-data)        Phase 1    [1 day]
    |
    v
company_brief.yaml + jd-profile.yaml schemas        Phase 1    [1 day]
    |
    v
[FORK: Phase 2A and 2B can proceed in parallel]
    |
    ├──> Cover Letter pipeline (steps 01→03c)       Phase 2A   [4-5 days]
    |    |
    |    v
    |    Portfolio View 3 injection                  Phase 2A   [1-2 days]
    |
    └──> BTP CSS namespace + View 4 content         Phase 2B   [5-7 days]
         |
         v
         Portfolio View 4 rendering                 Phase 2B   [2-3 days]
    |
    v
[MERGE: Both 2A and 2B complete]
    |
    v
Performance optimization                            Phase 4    [2-3 days]
    |
    v
Mobile responsiveness                               Phase 4    [3-4 days]
    |
    v
Final integration testing                           Phase 4    [2-3 days]
```

**Critical path duration**: ~23-33 working days (Phase 2B is the longer parallel branch at 7-10 days)

**Off-critical-path items** (can be done in parallel without extending timeline):
- Brand preset files (Phase 1, can be done anytime after :root migration)
- Resume template HTML files (Phase 1, can be done anytime after step-34 is specified)
- Agent sidecar updates (all phases, can be done as each step file is completed)
- Accessibility fixes (Phase 4, independent of performance)
- Finding fixes F-16, F-30, F-32, F-35, F-21, F-39 (Phase 4, independent)
- Phase 3 (Slides) -- entirely off critical path due to DEFER status

---

## 8. Phase Ordering Justification

### Why Phase 1 (Theming) before Phase 2 (Views)?

1. **Theming is foundational infrastructure.** The `--lr-*` CSS custom property system is consumed by:
   - Cover letter (View 3): inherits typography and color tokens
   - Beyond the Papers (View 4): all ~50 BTP colors must map to `--lr-*` tokens
   - Slides (View 5, deferred): Abyssal Depth preset references `--lr-*` base tokens
   - Resume (View 1): existing `--md-sys-color-*` tokens must be migrated before they diverge further

2. **`company_brief.yaml` is a shared dependency.** Both E1 (cover letter tone) and E4 (resume accent color) consume this schema. Creating it once in Phase 1 prevents duplicate definitions.

3. **Risk ordering: lowest risk first.** PLAN-09d rates E4 as MEDIUM risk. Starting with a medium-risk foundation that enables all subsequent work is safer than starting with E1 (LOW risk) but having to retrofit theming tokens later.

4. **The data export step (06b) is a pure prerequisite.** Phase 2A (cover letter) cannot function without `jd-profile.yaml` and `company_brief.yaml` in the shared-data directory. Creating this step in Phase 1 prevents Phase 2A from being blocked.

### Why Phase 2A (Cover Letter) and Phase 2B (BTP) together?

1. **They are independent.** E1 modifies the outbound-campaign workflow. E3 modifies the portfolio-deploy workflow. No shared step files, no shared data beyond the Phase 1 shared-data directory.

2. **They populate complementary views.** E1 fills View 3 ("Strategic Fit"), E3 fills View 4 ("Beyond the Papers"). Developing both in parallel delivers two visible portfolio improvements simultaneously.

3. **E1 is LOW risk, E3 is HIGH risk (reduced scope).** If E3 encounters problems, E1 can still ship independently. The parallel structure means E3 delays do not block E1.

### Why Phase 3 (Slides) after Phase 2?

1. **CRITICAL risk with undefined dependency.** The `frontend-slides` skill output contract is undefined. Any implementation before the contract exists is speculative.

2. **Gate condition.** Phase 3 has an explicit go/no-go gate. If the gate is not met, Phase 3 is deferred with zero impact on Phases 1, 2, and 4.

3. **Portfolio-deploy workflow contention.** Both E2 (slides) and E3 (BTP) modify `step-port-02` and `step-port-03`. Separating them into sequential phases prevents merge conflicts and simplifies code review.

### Why Phase 4 (Polish) last?

1. **Optimization requires stable code.** Performance optimization (image conversion, CSS tree-shaking, JS modularization) should only happen after the feature set is frozen. Optimizing a moving target wastes effort.

2. **Accessibility fixes compound.** Each phase adds new content (cover letter text, BTP images, slide controls). The accessibility audit is most efficient when run once against the complete template.

3. **Mobile responsiveness depends on final layout.** Breakpoint CSS depends on knowing all view containers, all font families, and all content sections. Phase 4 is the first point where this is fully known.

---

## 9. Integration Test Points

Integration tests should be run at the end of each phase AND at the key merge points within phases.

### 9.1 Phase 0 Exit Test

| Test | Method | Pass Condition |
|------|--------|---------------|
| Path resolution | `grep -r "_bmad" linkright/` | Zero matches |
| Workflow execution | Run each of the 3 workflows in dry-run mode | All step file paths resolve correctly |
| Template naming | `find . -name "*-template.md"` | Zero matches (all renamed to `.template.md`) |

### 9.2 Phase 1 Exit Test

| Test | Method | Pass Condition |
|------|--------|---------------|
| Token migration | Load portfolio HTML, inspect computed styles | All `--lr-*` variables resolve to expected values |
| Hardcoded color elimination | `grep -E "#[0-9A-Fa-f]{6}" portfolio.css` | Only values within `:root {}` definitions (no inline hardcoded hex in rules) |
| Print fidelity | Print resume to PDF, compare against pre-migration reference | Visual diff within tolerance (no color shifts, no layout changes) |
| Step-34 theming | Run step-34 with Google preset | Selects `modern-minimal.html`, accent color #4285F4, contrast ratio 3.26:1 FAILS -> auto-adjusts, logged |
| Step-35 compile | Run step-35 with step-34 output | Produces valid HTML with all 6 slots populated |
| Step-36 validation | Run step-36 against step-35 output | All 6 checks PASS |
| Data export | Run step-06b | Produces valid `jd-profile.yaml` + `company_brief.yaml` in shared-data/ |
| Preset loading | Load each of 5 preset JSON files | All parse without error, all color values valid hex |

### 9.3 Phase 2A Exit Test (Cover Letter)

| Test | Method | Pass Condition |
|------|--------|---------------|
| Cover letter generation | Run outbound-campaign steps 01 -> 03c | Produces `cover_letter.md` with 300-400 words |
| 3-paragraph structure | Parse generated cover letter | 3 paragraphs present, each within word count sub-ranges |
| Tone variants | Run step-03b | 2 distinct variants generated, same factual content |
| Validation | Run step-03c | All guardrail checks pass (word count, signals, no generics) |
| View 3 rendering | Load portfolio, switch to View 3 | Cover letter text visible, formatted correctly |
| Print route | Print View 3 | Separate A4 page with cover letter content |
| HTML IDs | `grep "whygoogle" portfolio.html` | Zero matches (all renamed to `whycompany`) |

### 9.4 Phase 2B Exit Test (Beyond the Papers)

| Test | Method | Pass Condition |
|------|--------|---------------|
| CSS isolation | Load portfolio, inspect computed `.section` styles | `.lr-cv-scope .section { margin-bottom: 4mm }` (CV), `.lr-btp-scope .section { padding: 60px 0 }` (BTP). No cross-contamination. |
| View 4 scrolling | Navigate to View 4, scroll | Content scrolls vertically. Views 1-3 do not scroll. |
| Project cards | Render with 3+ project cards | Grid layout, responsive at all 4 breakpoints |
| Timeline | Render with 3-5 milestones | All entries visible, correct chronological order |
| Carousel | Hero qualities rotation | CSS animation runs without JS dependency |
| Validation | Run step-02c | `portfolio_content.json` passes schema validation |
| Zero jQuery | `grep "jquery" portfolio.html` | Zero matches |
| Zero Webflow | `grep "webflow" portfolio.html` | Zero matches (except possible comments) |
| Image hosting | Check all `<img src>` values | No Webflow CDN URLs |

### 9.5 Phase 3 Exit Test (Slides, Conditional)

| Test | Method | Pass Condition |
|------|--------|---------------|
| Signal selection | Run step-port-01 | Top-5 signals selected, impact_rank assigned |
| Style selection | Run step-port-01b | `selected_style.json` produced with Abyssal Depth tokens |
| Slide rendering | Run step-port-01c | `slides_deck.html` produced, self-contained, <200 KB |
| 5th nav item | Load portfolio, check sidebar | "Slide Deck" nav item visible |
| Lazy loading | Navigate to slides view, check network tab | Slide content loaded only on first view switch |
| State preservation | Switch to slides, advance to slide 3, switch away, switch back | Slide 3 still displayed |
| Combined JS size | `wc -c portfolio.js` | Under 50 KB |

### 9.6 Phase 4 Exit Test

| Test | Method | Pass Condition |
|------|--------|---------------|
| Page weight | Chrome DevTools Network tab, throttled 4G | Initial load < 500 KB |
| LCP | Lighthouse audit | < 2.5 seconds |
| CLS | Lighthouse audit | < 0.1 |
| INP | Lighthouse audit | < 200 ms |
| Keyboard navigation | Tab through entire page | All interactive elements reachable, visible focus ring |
| Screen reader | VoiceOver (macOS) walkthrough | All content announced, landmarks identified, headings navigable |
| Reduced motion | Set `prefers-reduced-motion: reduce` | Zero animations visible |
| Mobile 479px | Chrome DevTools responsive mode | Bottom tab bar, single-column layout, readable text |
| Mobile 767px | Chrome DevTools responsive mode | Horizontal nav bar, collapsed sections |
| Tablet 991px | Chrome DevTools responsive mode | Icon-rail sidebar (60px) |
| Print resume | Ctrl+P from View 1 | A4 resume, correct colors, one page |
| Print cover letter | Ctrl+P from View 3 | A4 cover letter, separate from resume |
| Global scope | `Object.keys(window).filter(k => k.includes('Linkright'))` | Only `LinkrightCV` namespace exposed |
| Finding resolution | Verify each finding fix | F-16, F-30, F-32, F-35, F-21, F-39 all resolved |

---

## 10. Rollback Strategy Per Phase

Each phase is designed to be independently reversible without affecting other phases.

### 10.1 Phase 0 Rollback

| Risk | Rollback Action |
|------|-----------------|
| F-09 path rewrite breaks existing workflows | Git revert the path rewrite commit. All changes are in tracked files. |
| F-10 workflow.xml engine has bugs | Remove the engine/shim. Existing workflows did not use it, so they are unaffected. |
| F-20 template renames break references | Git revert rename commit. Update any new references to use old names. |

**Rollback scope**: Isolated to infrastructure. No user-facing changes in Phase 0.

### 10.2 Phase 1 Rollback

| Risk | Rollback Action |
|------|-----------------|
| CSS token migration breaks visual output | Revert `:root` block to original `--md-sys-color-*` and `--brand-*` tokens. The old token names are documented in PLAN-01. |
| step-34/35/36 rewrites introduce bugs | Revert to 13-line stubs. Theming reverts to no-op (manual CSS editing). |
| step-06b data export corrupts shared-data | Delete `_lr/sync/shared-data/` directory. Existing workflows never reference it. |
| Brand presets have wrong colors | Delete preset files. Theming falls back to Sync default teal (#0E9E8E). |

**Rollback scope**: Phase 1 is entirely additive (new files, new tokens, new step content). Reverting removes the additions. Portfolio reverts to Release 2 appearance.

### 10.3 Phase 2A Rollback (Cover Letter)

| Risk | Rollback Action |
|------|-----------------|
| Cover letter generation quality is poor | Disable cover letter view in portfolio (revert View 3 HTML changes). outbound-campaign modifications are backward-compatible and can remain. |
| step-out-03 rewrite breaks existing outreach | Revert to the original 50-line step-out-03. Remove step-out-03b and 03c files. |
| HTML ID rename (`whygoogle` -> `whycompany`) breaks `switchView()` | Revert HTML IDs. Update `switchView()` parameter in nav onclick attributes. |

**Rollback scope**: outbound-campaign workflow changes are backward-compatible (added fields to output contracts, not removed). Portfolio View 3 changes are isolated.

### 10.4 Phase 2B Rollback (Beyond the Papers)

| Risk | Rollback Action |
|------|-----------------|
| CSS collision despite namespacing | Remove all `.lr-btp-scope` styles from portfolio CSS. Revert View 4 HTML to placeholder state. |
| BTP content overflow/layout issues | Revert View 4 to `overflow: hidden` (A4 constraint). Remove BTP section stack. |
| Font loading performance regression | Remove Inter, DM Serif Display, Aubrey font imports. BTP view will use fallback system fonts until fixed. |
| `portfolio_content.json` schema issues | step-port-02 rewrite is isolated to View 4 content generation. Revert to original 34-line step. Remove steps 02b and 02c. |

**Rollback scope**: All BTP changes are scoped within `.lr-btp-scope` and View 4 HTML. Reverting removes the scope container and restores the placeholder view.

### 10.5 Phase 3 Rollback (Slides)

| Risk | Rollback Action |
|------|-----------------|
| `frontend-slides` integration fails | Remove 5th sidebar nav item. Revert step-port-01/02/03 modifications. Delete steps 01b and 01c. View 2 remains in placeholder state. |
| Performance budget exceeded | Remove slide deck from portfolio. Delete `slides_deck.html` artifact. Slide content is still available as `slides_content.json` for future use. |
| Iframe/carousel rendering issues | Remove slide embed entirely. Replace with static "Coming Soon" placeholder in View 2. |

**Rollback scope**: Phase 3 is the most isolated phase. All slide-related changes are additive and can be fully reverted without affecting any other phase.

### 10.6 Phase 4 Rollback

| Risk | Rollback Action |
|------|-----------------|
| Image conversion (base64 -> WebP) breaks older browsers | Revert to base64 inline image. Add `<picture>` element with WebP + JPEG fallback for future attempt. |
| Mobile breakpoint CSS conflicts | Remove responsive CSS. Portfolio reverts to desktop-only (current state). |
| JS IIFE wrapping breaks `switchView()` calls | Expose `switchView` on `window` scope as backward-compatible shim: `window.switchView = LinkrightCV.switchView;`. |
| Accessibility changes break visual layout | Semantic headings (`<h1>`/`<h2>`) may affect spacing if CSS targets `<div>` tags specifically. Add heading-specific CSS rules to preserve appearance. |

**Rollback scope**: Phase 4 changes are all independent optimizations. Each can be individually reverted without affecting others.

---

## 11. Total Effort Summary

### 11.1 Files Per Phase

| Phase | New Files | Modified Files | Rewritten Files | Deleted Files | Total Operations |
|-------|-----------|----------------|-----------------|---------------|-----------------|
| **Phase 0** | 1 (CSS namespace doc) | 60+ (path rewrite) + 7 (template rename) | 0 | 0 | ~68 |
| **Phase 1** | 10 (step-06b, 3 templates, 5 presets, shared-data dir) | 2 (workflow.yaml, :root CSS) | 3 (steps 34/35/36) | 0 | 15 |
| **Phase 2A** | 4 (steps 03b/03c, template, cover_letter_payload.json) | 6 (steps 01/out-01/out-02/V-01, workflow.yaml, checklist.md) | 1 (step out-03) | 0 | 11 |
| **Phase 2B** | 4 (steps 02b/02c, schema, projects-source.yaml) | 4 (step port-03, View 4 HTML, CSS x2) | 1 (step port-02) | 0 | 9 |
| **Phase 3** (conditional) | 4 (steps 01b/01c, preset CSS, schema) | 4 (steps port-01/port-02/port-03, sidebar nav) | 0 | 0 | 8 |
| **Phase 4** | 0 | 15+ (images, fonts, CSS, JS, finding fixes) | 0 | 0 | ~15 |
| **TOTAL** | **~23** | **~91+** | **5** | **0** | **~126** |

### 11.2 Step File Operations Per Workflow

| Workflow | New Steps | Modified Steps | Rewritten Steps | Total |
|----------|-----------|----------------|-----------------|-------|
| `jd-optimize` | 1 (06b) | 0 | 3 (34/35/36) | 4 |
| `outbound-campaign` | 2 (03b, 03c) | 4 (01, out-01, out-02, V-01) | 1 (out-03) | 7 |
| `portfolio-deploy` | 4 (01b, 01c, 02b, 02c) | 3 (port-01, port-02, port-03) | 1 (port-02) | 8 |
| **TOTAL** | **7** | **7** | **5** | **19** |

Note: `step-port-02` appears in both MODIFY (Phase 3, E2) and REWRITE (Phase 2B, E3). The rewrite in Phase 2B happens first; the modify in Phase 3 adjusts the rewritten version. Net: 18 unique step files touched, 19 operations.

### 11.3 Agent Updates

| Agent | Phase | Changes |
|-------|-------|---------|
| `sync-styler` (Cora) | 1, 2B, 3 | 7 new capabilities, 3 sidecar updates (instructions.md + memories.md) |
| `sync-scout` (Lyra) | 1 | 1 new capability (brand color extraction), 1 sidecar update |
| `sync-publicist` (Lyric) | 2A | 5 new capabilities, 2 sidecar updates |
| `sync-linker` (Atlas) | 2A | 1 refinement, 1 sidecar update |
| All agents with name issues (F-35) | 4 | Display name unification |

### 11.4 Estimated Timeline

| Phase | Duration | Dependencies | Parallelizable? |
|-------|----------|--------------|-----------------|
| Phase 0 (Prerequisites) | 3-5 days | None | Partially (F-09 blocks, F-10/F-20/CSS namespace can parallel) |
| Phase 1 (Theming) | 5-8 days | Phase 0 complete | Yes (Track A: steps 34-36, Track B: data export + presets) |
| Phase 2A (Cover Letter) | 5-7 days | Phase 1 complete | Yes (parallel with 2B) |
| Phase 2B (Beyond Papers) | 7-10 days | Phase 1 complete | Yes (parallel with 2A) |
| Phase 3 (Slides) | 5-8 days | Phase 2 + gate condition | No (blocked on gate) |
| Phase 4 (Polish) | 5-8 days | Phase 2 (or 3 if executed) | Partially (3 parallel tracks) |
| **Total (without Phase 3)** | **25-38 days** | | |
| **Total (with Phase 3)** | **30-46 days** | | |

### 11.5 Risk Summary by Phase

| Phase | Overall Risk | Key Risk Factor |
|-------|-------------|-----------------|
| Phase 0 | **MEDIUM** | F-09 scope (60+ files to rewrite) |
| Phase 1 | **MEDIUM** | CSS token migration + print fidelity |
| Phase 2A | **LOW** | Minimal technical complexity |
| Phase 2B | **HIGH** | CSS collision management, A4 constraint removal |
| Phase 3 | **CRITICAL** | Undefined external dependency (`frontend-slides`) |
| Phase 4 | **LOW** | All changes are isolated optimizations |

### 11.6 Enhancement-to-Phase Mapping (Quick Reference)

| Enhancement | Risk Rating | Go/No-Go | Primary Phase | Secondary Phase |
|-------------|-------------|----------|---------------|-----------------|
| E1: Cover Letter | LOW | GO | Phase 2A | -- |
| E4: Theming | MEDIUM | GO | Phase 1 | Phase 4 (polish) |
| E3: Beyond the Papers | HIGH | GO-REDUCED | Phase 2B | Phase 4 (performance) |
| E2: Slides | CRITICAL | DEFER | Phase 3 (conditional) | -- |

---

## Appendix A: Complete File Registry

### A.1 Files Created Across All Phases

| # | Phase | File Path (relative to `linkright/`) | Type |
|---|-------|--------------------------------------|------|
| 1 | 0 | `context/CSS-NAMESPACE-CONVENTION.md` | Convention doc |
| 2 | 1 | `_lr/sync/shared-data/` (directory) | Infrastructure |
| 3 | 1 | `_lr/sync/workflows/jd-optimize/steps-c/step-06b-export-data-contract.md` | Step file |
| 4 | 1 | `_lr/sync/workflows/jd-optimize/templates/resume-templates/modern-minimal.html` | Template |
| 5 | 1 | `_lr/sync/workflows/jd-optimize/templates/resume-templates/modern-clean.html` | Template |
| 6 | 1 | `_lr/sync/workflows/jd-optimize/templates/resume-templates/modern-visual.html` | Template |
| 7 | 1 | `_lr/sync/workflows/portfolio-deploy/data/presets/google.preset.json` | Data |
| 8 | 1 | `_lr/sync/workflows/portfolio-deploy/data/presets/amazon.preset.json` | Data |
| 9 | 1 | `_lr/sync/workflows/portfolio-deploy/data/presets/microsoft.preset.json` | Data |
| 10 | 1 | `_lr/sync/workflows/portfolio-deploy/data/presets/spotify.preset.json` | Data |
| 11 | 1 | `_lr/sync/workflows/portfolio-deploy/data/presets/sync.preset.json` | Data |
| 12 | 2A | `_lr/sync/workflows/outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md` | Step file |
| 13 | 2A | `_lr/sync/workflows/outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md` | Step file |
| 14 | 2A | `_lr/sync/workflows/outbound-campaign/templates/cover_letter.template.md` | Template |
| 15 | 2B | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md` | Step file |
| 16 | 2B | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md` | Step file |
| 17 | 2B | `_lr/sync/workflows/portfolio-deploy/data/portfolio-content.schema.json` | Schema |
| 18 | 2B | `_lr/sync/workflows/portfolio-deploy/data/projects-source.yaml` | Data template |
| 19 | 3 | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01b-style-selection.md` | Step file |
| 20 | 3 | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01c-render-slides-html.md` | Step file |
| 21 | 3 | `_lr/sync/workflows/portfolio-deploy/data/abyssal-depth.preset.css` | Data |

### A.2 Files Rewritten Across All Phases

| # | Phase | File Path | Current State |
|---|-------|-----------|---------------|
| 1 | 1 | `_lr/sync/workflows/jd-optimize/steps-c/step-34-style-theming.md` | 13-line stub |
| 2 | 1 | `_lr/sync/workflows/jd-optimize/steps-c/step-35-style-compile.md` | 13-line stub |
| 3 | 1 | `_lr/sync/workflows/jd-optimize/steps-c/step-36-style-validation.md` | 13-line stub |
| 4 | 2A | `_lr/sync/workflows/outbound-campaign/steps-c/step-out-03-cover-letter.md` | 50-line incomplete |
| 5 | 2B | `_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` | 34-line minimal |

---

## Appendix B: Cross-Reference to Source Plans

| Section in PLAN-10a | Source Plan(s) |
|---------------------|---------------|
| Phase 0 prerequisites | PLAN-09c (Section 5 "Recommended Resolution Order"), PLAN-09d ("Prerequisites Before ANY Enhancement Work") |
| Phase 1 CSS tokens | PLAN-06a (`:root` block), PLAN-01 (20 existing tokens + 6 hardcoded hex), PLAN-06cde (preset format) |
| Phase 1 theming steps | PLAN-08b (Section 4.1: step-34/35/36 rewrite specifications) |
| Phase 1 data export | PLAN-08b (Section 4.2: step-06b), PLAN-08a (GAP-02 closure) |
| Phase 1 brand presets | PLAN-06cde (preset JSON schema, directory structure, build pipeline) |
| Phase 2A cover letter | PLAN-08a (Enhancement 1), PLAN-08b (Section 5), PLAN-03d-04cd (cover letter design) |
| Phase 2A template | PLAN-06 PLAN-04b (14 injection points, `cover_letter_payload.json`) |
| Phase 2B BTP integration | PLAN-05 (BTP view architecture), PLAN-02 (Webflow audit), PLAN-09a (CSS collisions) |
| Phase 2B reduced scope | PLAN-09d E3 ("Risk Mitigations" section, "GO WITH REDUCED SCOPE") |
| Phase 3 slides | PLAN-08a (Enhancement 2), PLAN-03d-04cd (slide content generation), PLAN-06 PLAN-03c (5th nav item) |
| Phase 3 gate condition | PLAN-09d E2 ("DEFER" recommendation, undefined `frontend-slides` contract) |
| Phase 4 performance | PLAN-09b (Section 5 "Performance Optimization Summary"), combined template ~3 MB -> ~500 KB |
| Phase 4 accessibility | PLAN-09b (Section 3 "Accessibility Audit"), P0/P1/P2 fixes |
| Phase 4 mobile | PLAN-09b (Section 4 "Mobile Responsiveness Strategy") |
| RACI assignments | PLAN-08c (Agent Responsibility Matrix) |
| Risk ratings | PLAN-09d (Summary Risk Matrix): E1=LOW, E4=MEDIUM, E3=HIGH, E2=CRITICAL |
