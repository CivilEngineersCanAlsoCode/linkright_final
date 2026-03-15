# Release 3: Enhancement Addendum — Linkright v4.0

**Date**: 2026-03-07
**Scope**: Complete specification for 5 Release 3 enhancements
**Status**: PLAN-10c — Final Consolidated Reference
**Compiled From**: PLAN-01 through PLAN-10b, E5 Design Spec
**Supersedes**: All prior Release 3 planning documents (as individual references)

---

## How to Use This Document

This is the **single authoritative reference** for implementing all Release 3 enhancements. It is organized in five parts:

| Part | Purpose | Audience |
|------|---------|----------|
| **I: Executive Overview** | Scope, architecture, timeline, risks | Everyone |
| **II: Enhancement Specifications** | Self-contained spec per enhancement | Feature implementors |
| **III: Implementation Plan** | Phase roadmap, file registry, data flow | Build leads |
| **IV: Cross-Cutting Concerns** | CSS, performance, accessibility, print | All implementors |
| **V: Appendices** | File tree, RACI, schemas, cross-references | Reference lookup |

For deeper detail on any topic, consult the source PLAN document listed in **Appendix E**.

---

# PART I: EXECUTIVE OVERVIEW

## 1. Release 3 Summary

Release 3 introduces five enhancements to the Linkright portfolio system. Four were identified in the original audit; the fifth (Dynamic Bullet Width) emerged from the CV template analysis.

| ID | Enhancement | Description | Risk | Decision |
|----|-------------|-------------|------|----------|
| **E1** | Cover Letter | 3-paragraph "Strategic Fit" cover letter with tone injection, variants, and automated validation | LOW | **GO** |
| **E2** | Slides Integration | Top-5 career signal slide deck via `frontend-slides` skill with Abyssal Depth theming | CRITICAL | **DEFER** (conditional Phase 3) |
| **E3** | Beyond the Papers | Personal narrative view with project cards, timeline, and qualities carousel | HIGH | **GO -- REDUCED SCOPE** |
| **E4** | Theming System | CSS custom property parameterization with company brand presets | MEDIUM | **GO** |
| **E5** | Dynamic Bullet Width | Per-character weighted width calculation replacing hardcoded character counts | LOW | **GO** |

**What each enhancement delivers:**

- **E1 (Cover Letter)**: Populates the empty portfolio View 3 ("Strategic Fit") with a company-targeted cover letter. The outbound-campaign workflow gains steps for tone-injected 3-paragraph generation (Hook/WhyMe/WhyThem), 2 tone variants, and automated validation (300-400 words, XYZ metrics, no generic phrases). The `cover_letter_payload.json` is injected into the portfolio HTML.

- **E2 (Slides)**: Populates the empty portfolio View 2 ("Value Prop") with a 5-slide career signal deck. The portfolio-deploy workflow gains steps for cosine-similarity signal ranking, Abyssal Depth style selection, and self-contained HTML rendering. **Deferred** pending `frontend-slides` output contract definition.

- **E3 (Beyond the Papers)**: Populates the placeholder portfolio View 4 with a scrollable personal narrative. Reduced scope: hero heading with rotating qualities carousel (CSS-only), 3-4 project cards in responsive grid, condensed timeline (3-5 milestones). No contact form, no 3D parallax, no Lottie, no jQuery, no Webflow runtime.

- **E4 (Theming)**: Replaces 20 `--md-sys-color-*` tokens and 6 hardcoded hex values with a unified `--lr-*` CSS namespace (~100+ tokens). Introduces company brand presets (JSON files mapping to CSS variables), a template selection matrix, and WCAG AA contrast validation. This is foundational infrastructure consumed by all other enhancements.

- **E5 (Dynamic Bullet Width)**: Replaces the hardcoded 88-character line budget with a dynamic calculation pipeline that reads template CSS, computes available pixel width, converts to digit-unit budget using Roboto hmtx advance widths, and writes bullets to 95% fill. CSS `text-align: justify` + `text-align-last: justify` distributes the remaining gap imperceptibly.

---

## 2. Architecture Overview

All five enhancements integrate into the existing Linkright workflow system. **No new top-level workflow directories are required.** Three existing workflows are modified:

```
linkright/_lr/sync/workflows/
├── jd-optimize/          <-- E4 (theming steps 34-36), E5 (sizer/refiner steps)
│                             E1+E4 (step-06b data export)
├── outbound-campaign/    <-- E1 (cover letter steps out-03/03b/03c)
└── portfolio-deploy/     <-- E2 (slides steps port-01b/01c)
                              E3 (BTP steps port-02/02b/02c)
                              E4 (brand preset application in port-03)
```

**Cross-workflow data flow** uses a new `_lr/sync/shared-data/` directory:

```
jd-optimize (step-06b)
    |
    +--> shared-data/jd-profile.yaml ---------> outbound-campaign, portfolio-deploy
    +--> shared-data/company_brief.yaml ------> outbound-campaign, portfolio-deploy,
                                                jd-optimize (step-34)
```

**10 agents** participate across the 5 enhancements. No new agents are created; existing agents gain new capabilities via sidecar memory updates:

| Agent | Persona | Enhancements | New Capabilities |
|-------|---------|-------------|-----------------|
| sync-styler | Cora | E2, E3, E4, E5 | Template selection, brand injection, BTP content structuring, slide compilation, justify CSS injection |
| sync-publicist | Lyric | E1 | 3-paragraph cover letter engine, tone injection, variant generation |
| sync-scout | Lyra | E4 | Brand color/tone extraction from company research |
| sync-linker | Atlas | E1, E2 | Bridge signal refinement, top-5 signal ranking for slides |
| sync-sizer | Kael | E5 | Template width extraction, dynamic budget calculation, weighted width validation |
| sync-refiner | Veda | E5 | Width-aware bullet drafting, per-character measurement, synonym bank tuning |
| sync-parser | Orion | E1 | Recruiter tone indicator extraction |
| lr-tracker | Navi | E1, E2, E3, E4 | File writing for shared-data export, portfolio assembly |

---

## 3. Critical Path

```
Phase 0: Prerequisites                           [3-5 days]
  _bmad->_lr path rewrite, workflow engine,
  template naming, CSS namespace convention
         |
         v
Phase 1: Foundation (E4 Theming + E5 Bullet)     [5-8 days]
  CSS token migration, theming steps 34-36,
  data export step-06b, brand presets,
  dynamic bullet width pipeline
         |
         v
Phase 2A: Cover Letter (E1)  ||  Phase 2B: BTP (E3)   [7-10 days]
  [PARALLEL -- fully independent]                       (longest branch)
         |                              |
         +----------> MERGE <-----------+
                       |
                       v
Phase 3: Slides (E2) -- CONDITIONAL               [5-8 days]
  Gate: frontend-slides contract defined?
  If NO --> DEFER to Release 4
                       |
                       v
Phase 4: Polish                                    [5-8 days]
  Performance optimization, accessibility,
  mobile responsiveness, finding fixes
```

**Total estimated duration**: 25-38 working days (without Phase 3), 30-46 days (with Phase 3)

---

## 4. Risk Summary

| # | Risk | Level | Enhancement | Mitigation |
|---|------|-------|-------------|------------|
| 1 | `.section` CSS collision between CV and BTP templates | CRITICAL | E3 | All BTP styles scoped under `.lr-btp-scope` descendant selector (specificity 0,2,0). CV styles under `.lr-cv-scope`. Zero cross-contamination. |
| 2 | `frontend-slides` output contract undefined | CRITICAL | E2 | Gate condition: Phase 3 does NOT begin unless contract is fully documented with a working prototype. If gate fails, entire phase deferred. |
| 3 | CSS token migration breaks print output | MEDIUM | E4 | Convert one batch at a time. Visual diff against reference PDF after each batch. Maintain `* { -webkit-print-color-adjust: exact; }`. |
| 4 | F-09 `_bmad` path rewrite scope (60+ files) | MEDIUM | ALL | Automated find-and-replace with manual review. Test all 3 workflows resolve paths after rewrite. |
| 5 | Font loading performance (4 families, ~8 weights) | MEDIUM | E3 | `font-display: swap` for primary fonts, `font-display: optional` for decorative (Aubrey). Single consolidated `<link>` tag. |

---

# PART II: ENHANCEMENT SPECIFICATIONS

---

## E1: Cover Letter (Strategic Fit View)

**Risk**: LOW | **Decision**: GO | **Primary Workflow**: `outbound-campaign` | **Phase**: 2A

### What It Does

Enhancement E1 transforms the empty portfolio View 3 ("Strategic Fit / Why Company?") into a formatted, company-targeted cover letter. The outbound-campaign workflow is extended with a 3-paragraph generation engine (Hook / Why Me / Why Them), tone injection from company research, 2 tone variants for user selection, and automated validation. The cover letter consumes `company_brief.yaml` and `jd-profile.yaml` from the Phase 1 shared-data directory, ensuring that tone, brand values, and caution topics are automatically integrated.

The final output is a `cover_letter_payload.json` artifact that is injected into the portfolio HTML at deployment time, populating View 3 with professionally formatted letter content. A separate `@media print` route allows printing the cover letter as a standalone A4 page, independent of the resume print route.

### Key Design Decisions

1. **3-paragraph structure** (not 5-paragraph) -- Hook (60-80 words), Why Me (120-160 words with Bridge signal + XYZ metric), Why Them (100-140 words with brand value reference). Total: 300-400 words strict.
2. **Tone injection** via priority chain: `company_brief.tone_descriptor` > `recruiter_profile.tone_indicators[]` > default "formal".
3. **HTML ID rename**: `whygoogle-view` -> `whycompany-view` to support any target company.
4. **14 template injection points** in `cover_letter.template.md` using `{{VARIABLE}}` syntax.
5. **Forbidden phrase list** enforced by automated validation in step-out-03c.

### Data Schema

**`cover_letter_payload.json`** (produced by step-out-03, consumed by portfolio-deploy step-port-03):

```json
{
  "meta": {
    "candidate_name": "string",
    "target_role": "string",
    "company_name": "string",
    "date": "ISO date",
    "addressee": { "name": "string|null", "title": "string|null", "company": "string" },
    "candidate_email": "string",
    "candidate_phone": "string"
  },
  "letter": {
    "hook": "paragraph 1 (80-120 words)",
    "why_me": "paragraph 2 (100-150 words)",
    "why_them": "paragraph 3 (80-120 words)",
    "closing": "optional CTA (15-30 words)"
  },
  "signature": { "sign_off": "Warm regards,", "name": "string", "portfolio_url": "string" },
  "quality": {
    "word_count": 0,
    "tone": "Formal|Conversational|Technical|Vision-Driven",
    "bridge_signal_id": "sig-{uuid}",
    "validation_status": "PASS|FAIL"
  }
}
```

### Agent Responsibilities

| Agent | Role | Specific Actions |
|-------|------|-----------------|
| sync-publicist (Lyric) | R/A | 3-paragraph generation, tone injection, variant generation, word count enforcement |
| sync-linker (Atlas) | C | Bridge signal selection (highest impact_rank AND persona_relevance) |
| sync-parser (Orion) | C | Recruiter tone indicator extraction from PDF |

### Workflow Step Changes

| Step | Operation | Details |
|------|-----------|---------|
| `step-01-load-session-context.md` | MODIFY | Load `company_brief.yaml` + `jd-profile.yaml` from shared-data. Validate 4 required fields. |
| `step-out-01-ingest.md` | MODIFY | Add tone indicator extraction (4 patterns). Add company stage inference. |
| `step-out-02-strategy.md` | MODIFY | Add tone resolution priority chain. Add brand_values/cautions loading. Output gains `selected_tone`, `the_bridge`. |
| `step-out-03-cover-letter.md` | REWRITE | Full 3-paragraph structure with tone injection, word count enforcement, guardrail checks. |
| `step-out-03b-cover-letter-variants.md` | CREATE | Generate 2 tone variants (same facts, different voice). |
| `step-out-03c-cover-letter-validation.md` | CREATE | 7-check automated validation. Output: `cover_letter_validation.json`. |
| `step-01-validate.md` (steps-v) | MODIFY | Add cover-letter-specific validation criteria. |

### File Operations

| File | Op | Phase |
|------|----|-------|
| `outbound-campaign/steps-c/step-out-03-cover-letter.md` | REWRITE | 2A |
| `outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md` | CREATE | 2A |
| `outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md` | CREATE | 2A |
| `outbound-campaign/templates/cover_letter.template.md` | CREATE | 2A |
| Portfolio HTML (View 3) | MODIFY | 2A |
| Portfolio CSS (cover letter print route) | MODIFY | 2A |
| `outbound-campaign/workflow.yaml` | MODIFY | 1 (prep) |
| `outbound-campaign/checklist.md` | MODIFY | 2A |

### Acceptance Criteria Summary

- 3-paragraph cover letter generated with correct structure (Hook/WhyMe/WhyThem)
- Word count within 300-400 range
- At least 1 XYZ-format metric present in Paragraph 2
- Tone injection works for all 4 tone types
- 2 tone variants generated with identical factual content
- Automated validation catches word count violations, missing signals, generic phrases
- Portfolio View 3 displays formatted cover letter (HTML ID: `whycompany-view`)
- Cover letter prints separately from resume via `@media print` route
- Zero instances of "whygoogle" remain in portfolio HTML

> **Source**: PLAN-03d-04cd (cover letter design), PLAN-08b Section 5 (step specs), PLAN-10a Phase 2A, PLAN-10b Phase 2A

---

## E2: Slides Integration (Value Prop View)

**Risk**: CRITICAL | **Decision**: DEFER (conditional Phase 3) | **Primary Workflow**: `portfolio-deploy` | **Phase**: 3

### What It Does

Enhancement E2 populates the empty portfolio View 2 ("Value Prop / Why Me?") with a 5-slide career signal deck. The portfolio-deploy workflow gains three new steps: (1) top-5 signal ranking using cosine similarity against JD requirements, (2) Abyssal Depth style selection with optional company accent overlay, and (3) self-contained HTML rendering with zero external dependencies.

The slides use the Problem/Process/Metric/Legacy framework for each career signal. The Bridge signal from the outreach strategy is force-ranked as slide #1 regardless of composite score, ensuring consistency between the slide deck and cover letter.

### Gate Condition

**Phase 3 does NOT begin unless ALL of the following are true:**
1. `frontend-slides` skill output format is documented (HTML, images, or PDF)
2. `frontend-slides` skill file location and naming convention is defined
3. `frontend-slides` metadata schema is specified
4. A working prototype of `frontend-slides` output exists
5. Phases 1 and 2 are complete and stable

If the gate condition is not met, Phase 3 is deferred entirely to Release 4.

### Key Design Decisions

1. **Image-based carousel preferred** over iframe embedding (per PLAN-09d risk mitigation) -- eliminates CSS isolation issues and keeps performance budget.
2. **Dual-layer theming**: Sync ocean base (Abyssal Depth) + company accent overlay. Company accent NEVER overrides Sync background or text colors.
3. **Self-contained HTML**: Zero `<link>`, zero `<script src>`, zero `@import`, zero external `url()`.
4. **Lazy loading**: Slide content loaded only on first view switch via `data-src` attribute.
5. **Signal ranking**: `0.40 * requirement_relevance + 0.25 * persona_alignment + 0.20 * metric_density + 0.15 * ownership_match`.

### Data Schema

**`slides_content.json`** (produced by step-port-01):

```json
{
  "slides": [{
    "signal_id": "sig-{uuid}",
    "title": "Achievement (max 60 chars)",
    "subtitle": "Company | Team | Year",
    "sections": {
      "the_problem": "50-250 chars",
      "the_process": "60-300 chars",
      "the_metric": "20-150 chars",
      "the_legacy": "40-200 chars"
    },
    "role_alignment": "strategic_gravity_tag",
    "impact_rank": 1,
    "jd_requirement_match": "verbatim P0 requirement"
  }],
  "metadata": {
    "user_name": "string", "target_role": "string", "target_company": "string",
    "signal_count": 5, "bridge_signal_id": "sig-{uuid}", "tone": "formal|casual|technical"
  },
  "style": { "preset": "abyssal-depth", "brand_override": "brand_id|null" }
}
```

**Abyssal Depth tokens**: Primary #0E9E8E (teal), Accent #D9705A (coral), Gold #C8973A, Backgrounds #091614 / #0F1F1C / #122520.

### Workflow Step Changes

| Step | Operation | Details |
|------|-----------|---------|
| `step-port-01-compile.md` | MODIFY | Add cosine similarity ranking, `slides_content.json` schema validation, user approval gate |
| `step-port-01b-style-selection.md` | CREATE | Load Sync design tokens, apply Abyssal Depth preset, optional company overlay |
| `step-port-01c-render-slides-html.md` | CREATE | Invoke rendering pipeline, generate self-contained HTML |
| `step-port-03-deploy.md` | MODIFY | Add `slides_deck.html` injection, 5th nav item, lazy load logic |

### Acceptance Criteria Summary

- Gate condition met: `frontend-slides` output contract fully defined
- Top-5 signals selected by cosine similarity and compiled into `slides_content.json`
- Self-contained `slides_deck.html` generated with zero external dependencies
- 5th sidebar nav item ("Slide Deck") visible and functional
- Slide view lazy-loads on first navigation
- Combined JS remains under 50 KB
- No performance regression: LCP remains under 2.5s on 4G

> **Source**: PLAN-03d-04cd (slide content generation), PLAN-08b Section 6.1 (step specs), PLAN-10a Phase 3

---

## E3: Beyond the Papers (Personal Narrative View)

**Risk**: HIGH | **Decision**: GO -- REDUCED SCOPE | **Primary Workflow**: `portfolio-deploy` | **Phase**: 2B

### What It Does

Enhancement E3 replaces the 1px placeholder image in portfolio View 4 ("Beyond the Papers") with a scrollable personal narrative experience. The reduced scope delivers a hero heading with rotating qualities carousel (CSS `@keyframes`, no jQuery), 3-4 project highlight cards in a responsive grid, and a condensed timeline of 3-5 key milestones.

The view breaks out of the A4 page constraint -- View 4 uses `overflow-y: auto` for natural scrolling while Views 1-3 retain `overflow: hidden`. All BTP styles are scoped under a `.lr-btp-scope` descendant selector to prevent the critical `.section` CSS collision identified in PLAN-09a.

### Scope Reduction (per PLAN-09d)

| INCLUDED | EXCLUDED (deferred to Release 4) |
|----------|----------------------------------|
| Hero heading + qualities carousel (CSS-only) | Contact form (replaced with `mailto:` link) |
| 3-4 static project cards (grid layout) | 3D parallax image grid |
| Condensed timeline (3-5 milestones, static) | Lottie success animation (~80 KB savings) |
| `.lr-btp-scope` CSS namespace wrapping | jQuery dependency (~90 KB savings) |
| Inter + DM Serif Display fonts | Webflow runtime (~150 KB savings) |
| | Hidden timeline sections / password page |
| | Full scroll-triggered animation system |

### Key Design Decisions

1. **`.lr-btp-scope` CSS namespace** prevents the critical `.section` collision (CV uses `margin-bottom: 4mm`, BTP uses `padding: 60px 0`).
2. **No `.page` class on View 4** -- uses `.btp-view` class instead, allowing natural content flow.
3. **~40 new `--lr-btp-*` CSS variables** for layout, typography, colors, cards, and animation.
4. **4 responsive breakpoints**: 1920px+ (full), 991px (tablet), 767px (mobile landscape), 479px (mobile portrait).
5. **`prefers-reduced-motion`** media query disables carousel animation.

### Data Schema

**`portfolio_content.json`** (produced by step-port-02):

```json
{
  "projects": [{
    "id": "proj-{uuid}", "title": "string", "description": "one-liner",
    "thumbnail_url": "path", "external_link": "url",
    "tech_stack": ["React", "Node.js"], "impact_summary": "XYZ metric",
    "display_order": 1
  }],
  "hobbies": [{
    "category": "Photography", "narrative_hook": "Finding patterns in chaos", "icon": "camera"
  }],
  "life_journey": [{
    "year": 2020, "milestone": "Led migration to microservices", "type": "career|personal|education"
  }],
  "video_placeholder": { "enabled": false, "label": "Life Narrative - Coming Soon" }
}
```

### Section Stack Order

```
#whoami-view.view-container
  └── .btp-view                    (replaces .page; no fixed height)
      ├── .btp-hero                (hero heading + rotating qualities carousel)
      ├── .btp-timeline            (condensed 3-5 milestone timeline)
      └── .btp-projects            (project card responsive grid)
```

### Workflow Step Changes

| Step | Operation | Details |
|------|-----------|---------|
| `step-port-02-beyond-the-papers.md` | REWRITE | Structured data ingestion from `projects-source.yaml`. Output: `portfolio_content.json`. |
| `step-port-02b-life-narrative-video.md` | CREATE | Static "Life Journey" timeline visualization. Output: `life_journey.html` fragment. |
| `step-port-02c-portfolio-validation.md` | CREATE | Schema validation (min 3 projects, 1 hobby, valid URLs). Output: `portfolio_validation.json`. |
| `step-port-03-deploy.md` | MODIFY | Add BTP section injection into View 4. |

### Acceptance Criteria Summary

- Portfolio View 4 displays BTP content with `.lr-btp-scope` CSS namespace
- No CSS class collisions between CV and BTP styles (verify `.section` isolation)
- Hero heading renders with rotating qualities carousel (CSS-only animation)
- 3-4 project cards render in responsive grid (single column at 479px)
- Condensed timeline renders 3-5 milestones
- View 4 scrollable while Views 1-3 remain fixed
- Zero jQuery, zero Webflow runtime in final output
- All BTP images self-hosted (no Webflow CDN references)

> **Source**: PLAN-05 (BTP view design), PLAN-02 (BTP template audit), PLAN-09a (CSS collisions), PLAN-10a Phase 2B

---

## E4: Theming System (CSS Variable Parameterization)

**Risk**: MEDIUM | **Decision**: GO | **Primary Workflow**: `jd-optimize` | **Phase**: 1

### What It Does

Enhancement E4 replaces the ad-hoc CSS custom property system with a unified `--lr-*` namespace. The existing 20 `--md-sys-color-*` tokens and 4 `--brand-*` tokens are migrated, and 6 hardcoded hex values (#202124, #5F6368, #DADCE0, #E0E0E0, rgba(66,133,244,0.08), white) are converted to CSS variables. A company brand preset system (JSON files) maps target company colors to CSS properties, with WCAG AA contrast validation and automatic adjustment.

Three 13-line stub steps in jd-optimize (34/35/36) are rewritten into full implementations: template selection, HTML/CSS assembly, and style validation. A new data export step (06b) serializes `jd-profile.yaml` and `company_brief.yaml` to a shared-data directory for cross-workflow consumption.

### Key Design Decisions

1. **Template selection matrix**: `company_stage` x `pm_culture` -> template (FAANG/enterprise -> Modern-Minimal, scale-up/data-driven -> Modern-Clean, design-led -> Modern-Visual).
2. **6 slot markers** in resume templates: `<!-- SLOT:THEME_CSS -->`, `<!-- SLOT:HEADER -->`, `<!-- SLOT:SUMMARY -->`, `<!-- SLOT:EXPERIENCE -->`, `<!-- SLOT:SKILLS -->`, `<!-- SLOT:EDUCATION -->`.
3. **Forbidden overrides**: No background fills with brand color, no bullet coloring, monochrome body text (`#1a1a1a !important`).
4. **WCAG contrast check**: >= 4.5:1 ratio. Auto-darken by 10% increments (3x max), then fall back to Sync teal `#0E9E8E`.
5. **Brand preset format**: JSON with `brand_id`, `brand_name`, `brand_scenario` (multi-chromatic / dual-tone / monochromatic), `colors`, `semantic_overrides`, `identity_horizon`, `gradients`, `fonts`.

### Brand Preset JSON Schema (condensed)

```json
{
  "preset_version": "1.0",
  "brand_id": "google",
  "brand_name": "Google",
  "brand_scenario": "multi-chromatic",
  "colors": {
    "primary": "#4285F4",
    "secondary": "#EA4335",
    "tertiary": "#FBBC05",
    "quaternary": "#34A853",
    "accent": "#4285F4",
    "neutral": "#5F6368"
  },
  "semantic_overrides": { "nav_active_bg": "string", "footer_bg": "string" },
  "identity_horizon": { "mode": "segments|gradient", "gradient_start": "#hex", "gradient_end": "#hex" },
  "gradients": { "name": "linear-gradient(...)", "timeline": "linear-gradient(...)" },
  "fonts": { "heading_family": "string", "body_family": "string" }
}
```

### CSS Token Migration Summary

| Category | Before | After |
|----------|--------|-------|
| Material Design tokens | `--md-sys-color-primary`, etc. (20) | `--lr-color-primary`, etc. |
| Brand tokens | `--brand-blue/red/yellow/green` (4) | `--lr-brand-primary/secondary/tertiary/quaternary` |
| Hardcoded hex in rules | 6 values (#202124, etc.) | `var(--lr-text-primary)`, etc. |
| BTP colors (Phase 2B) | ~50 hardcoded values | `--lr-btp-*` referencing `--lr-*` base tokens |
| Total new tokens | -- | ~100+ across 17 categories |

### Preset Files Included

| File | Brand | Scenario | Primary Color |
|------|-------|----------|---------------|
| `_default.preset.json` | Default (no company) | monochromatic | #3B82F6 |
| `google.preset.json` | Google | multi-chromatic | #4285F4 |
| `amazon.preset.json` | Amazon | dual-tone | #FF9900 |
| `microsoft.preset.json` | Microsoft | multi-chromatic | #0078D4 |
| `spotify.preset.json` | Spotify | monochromatic | #1DB954 |
| `sync.preset.json` | Sync (internal) | multi-chromatic | #0E9E8E |

### Workflow Step Changes

| Step | Operation | Details |
|------|-----------|---------|
| `step-34-style-theming.md` | REWRITE | Template selection matrix, WCAG contrast check, CSS variable injection |
| `step-35-style-compile.md` | REWRITE | HTML/CSS assembly with 6 slot markers, `@media print` block |
| `step-36-style-validation.md` | REWRITE | 6-check validation, output `style-validation-report.json` |
| `step-06b-export-data-contract.md` | CREATE | Serialize jd-profile.yaml + company_brief.yaml to shared-data |

### Acceptance Criteria Summary

- All 3 stub steps replaced with full implementations
- All 20 existing CSS custom properties migrated to `--lr-*` namespace
- All 6 hardcoded hex values converted to variables
- 3 resume HTML templates created with 6 slot markers each
- 5+1 brand preset JSON files validate against schema
- WCAG AA contrast passes for all preset primary colors
- Print output unchanged after token migration (visual diff against reference PDF)

> **Source**: PLAN-06cde (theming design), PLAN-01 (CV audit), PLAN-08b Section 4 (step specs), PLAN-10a Phase 1

---

## E5: Dynamic Bullet Point Width Calculation

**Risk**: LOW | **Decision**: GO | **Primary Workflow**: `jd-optimize` | **Phase**: 1 (integrated with theming)

### What It Does

Enhancement E5 replaces the hardcoded character count thresholds in the jd-optimize bullet-writing pipeline with a dynamic width calculation system. The current step-17a checks for 82-88 characters and flags lines over 90 as OVERFLOW. This is fundamentally flawed because character count is not pixel width -- in Roboto Regular, a `W` (1736 units) occupies 3.6x the space of an `i` (483 units).

The new pipeline: (1) reads the template CSS to determine exact available width for bullet text, (2) converts pixel width to a digit-unit budget using Roboto hmtx advance width data, (3) writes bullets to exactly 95% fill using per-character weighted width summation, and (4) applies CSS `text-align: justify` + `text-align-last: justify` to distribute the remaining ~5% imperceptibly across word spaces.

### Key Design Decisions

1. **95% fill target** (not 100%) -- CSS justify distributes 0-5% across ~15 word spaces (~1.5-2.5px per space), which is imperceptible.
2. **Dynamic budget from template CSS** -- available width = page_width - 2*padding - sidebar(print) - bullet_indent - marker_width.
3. **Per-character weight table** based on Roboto Regular hmtx (digit = 1.000 baseline). Range: 0.445 (`i`,`l`) to 1.740 (`@`).
4. **3-iteration convergence limit** -- if bullet still out of range after 3 tune passes, flag for user review.
5. **Bullet grouping** in clusters of 2-3 with visual spacing between groups.
6. **Step reordering**: Template selection (step 18) must precede layout validation (steps 17a-17c) because budget depends on template.

### Template Width Config (for current CV template)

```yaml
template_id: "cv-a4-sidebar"
page_width_px: 793.7        # 210mm A4 at 96 DPI
page_padding_px: 48.0       # 12.7mm per side
sidebar_width_print_px: 0   # Hidden in print
bullet_indent_px: 18        # Browser default ul padding-left
bullet_marker_px: 10        # Bullet char + gap
available_width_px: 669.7
font_size_pt: 9.5
digit_width_px: 6.718       # (1086/2048) * (9.5/72) * 96
line_budget_digit_units: 99.7
target_fill_pct: 0.95
target_budget: 94.7          # 99.7 * 0.95
```

**Key insight**: The hardcoded budget of 88 digit-units only matches US Letter at 10pt. For the actual CV template (A4, 9.5pt), the correct target is **94.7** -- a 7.6% increase. Current bullets are systematically shorter than they could be.

### Roboto Regular Weight Table (condensed)

```
0.445  i j l '           |  1.000  a e k v x y E S 0-9 $ [en-dash]
0.516  I [space] . , : ;  |  1.029  T Z
0.589  f ! - ( )          |  1.071  b d g h n o p q u
0.657  r J / "            |  1.099  B C K P X Y + #
0.727  t                  |  1.169  A R V &
0.801  * [bullet]         |  1.239  D G H N U
0.860  s                  |  1.309  O Q
0.930  c z F L ?          |  1.385  w M % [right-arrow]
                          |  1.599  m W [em-dash]
                          |  1.740  @
```

### CSS Implementation

```css
.li-content, .edge-to-edge-line {
    text-align: justify;
    text-align-last: justify;
    display: block;
    overflow: hidden;
    max-height: 1.4em;     /* Safety net: clip to one line height */
    line-height: 1.4;
}
.bullet-group-spacer {
    list-style: none;
    height: 0.5em;
    margin: 0; padding: 0;
}
```

### Workflow Step Changes

| Step | Operation | Details |
|------|-----------|---------|
| `step-17a-sizer-line-overflow-check.md` | MODIFY | Replace char_count with weighted digit-unit check against dynamic budget |
| `step-17c-sizer-refiner-iterate.md` | MODIFY | Sizer sends exact digit-unit budget per bullet to refiner |
| `step-18-select-resume-template.md` | MODIFY | Add TemplateWidthConfig extraction after template selection |
| `step-27-content-drafting.md` | MODIFY | Refiner uses rough width target from budget |
| `step-28-content-refining.md` | MODIFY | Refiner measures and tunes each bullet to 95% fill |
| `step-31-layout-budget.md` | MODIFY | Sizer extracts TemplateWidthConfig, calculates dynamic budget |
| `step-32-layout-sizing.md` | MODIFY | Sizer validates all bullets against dynamic budget |
| `step-34-style-theming.md` | MODIFY | Inject justify CSS rules into template |
| `step-35-style-compile.md` | MODIFY | Compile bullet group spacer CSS into final template |

### Agent Updates

| Agent | New Capabilities |
|-------|-----------------|
| sync-sizer (Kael) | Template width extraction, dynamic budget calculation, weighted width validation |
| sync-refiner (Veda) | Width-aware drafting, per-character measurement, synonym bank with width deltas, iterative tune loop |
| sync-styler (Cora) | Emit TemplateWidthConfig after template selection, inject justify CSS |

### Acceptance Criteria Summary

- System calculates available_width_px within 2% of 669.7px for CV A4 template
- Digit-unit budget within 1% of 99.7 for CV A4 at 9.5pt
- All returned bullets have weighted total between 90-100% of raw budget
- No bullet wraps to a second line in rendered output
- CSS justify rules present on all `.li-content` elements
- Bullet groups correctly formed (min 2, max 3 per group)
- Bold text width delta accounted for
- Budget recalculates automatically when template, font size, or margins change
- Sizer-refiner loop converges within 3 iterations for >= 95% of bullets

> **Source**: E5-DYNAMIC-BULLET-WIDTH-DESIGN.md, PLAN-01 (CV template CSS audit)

---

# PART III: IMPLEMENTATION PLAN

## 1. Phase Roadmap

### Phase 0: Prerequisites (3-5 days)

**Gate**: ALL must complete before ANY Phase 1+ work.

| ID | Operation | File(s) | Effort | Details |
|----|-----------|---------|--------|---------|
| P0-1 | MODIFY | 60+ files with `_bmad` references | L | Global `_bmad` -> `_lr` path rewrite. Finding F-09. |
| P0-2 | CREATE | `workflow-engine/` or shim | M | Port workflow.xml engine. Finding F-10. |
| P0-3 | RENAME | 7 template files | S | `-template.md` -> `.template.md`. Finding F-20. |
| P0-4 | CREATE | `CSS-NAMESPACE-CONVENTION.md` | S | Define `lr-cv-*`, `lr-btp-*`, `--lr-*` prefix scheme. |

**Exit test**: `grep -r "_bmad" linkright/` returns zero. All 3 workflows resolve paths in dry-run.

### Phase 1: Foundation -- Theming + Bullet Width (5-8 days)

**Gate**: Phase 0 complete. Two parallel tracks.

| ID | Op | File | Enh | Track |
|----|----|------|-----|-------|
| P1-01 | REWRITE | `step-34-style-theming.md` | E4 | A |
| P1-02 | REWRITE | `step-35-style-compile.md` | E4 | A |
| P1-03 | REWRITE | `step-36-style-validation.md` | E4 | A |
| P1-04 | CREATE | `step-06b-export-data-contract.md` | E4+E1 | B |
| P1-05 | CREATE | `_lr/sync/shared-data/` directory | E4+E1 | B |
| P1-06 | CREATE | `modern-minimal.html` | E4 | A |
| P1-07 | CREATE | `modern-clean.html` | E4 | A |
| P1-08 | CREATE | `modern-visual.html` | E4 | A |
| P1-09 | MODIFY | Portfolio CSS `:root` token migration | E4 | -- |
| P1-10 | CREATE | `presets/` directory + 6 preset files | E4 | B |
| P1-11 | CREATE | `brand-preset.v1.schema.json` | E4 | B |
| P1-12 | MODIFY | `jd-optimize/workflow.yaml` | E4 | B |
| P1-13 | MODIFY | `outbound-campaign/workflow.yaml` (prep) | E4 | B |
| P1-14 | MODIFY | Agent sidecars (sync-styler, sync-scout) | E4 | -- |
| P1-15 | MODIFY | Steps 17a/17c/18/27/28/31/32 (E5 integration) | E5 | A |
| P1-16 | MODIFY | Agent sidecars (sync-sizer, sync-refiner) for E5 | E5 | A |

**Exit test**: All `--lr-*` variables resolve. Print output matches reference. Step-34/35/36 produce valid themed HTML. Dynamic bullet budget calculates correctly for A4 9.5pt template.

### Phase 2A: Cover Letter (5-7 days) -- Parallel with 2B

| ID | Op | File | Enh |
|----|----|------|-----|
| P2A-01 | MODIFY | `step-01-load-session-context.md` | E1 |
| P2A-02 | MODIFY | `step-out-01-ingest.md` | E1 |
| P2A-03 | MODIFY | `step-out-02-strategy.md` | E1 |
| P2A-04 | REWRITE | `step-out-03-cover-letter.md` | E1 |
| P2A-05 | CREATE | `step-out-03b-cover-letter-variants.md` | E1 |
| P2A-06 | CREATE | `step-out-03c-cover-letter-validation.md` | E1 |
| P2A-07 | MODIFY | `step-01-validate.md` (steps-v) | E1 |
| P2A-08 | CREATE | `cover_letter.template.md` | E1 |
| P2A-09 | MODIFY | Portfolio HTML (View 3 whycompany) | E1 |
| P2A-10 | MODIFY | Portfolio CSS (CL print route) | E1 |
| P2A-11 | MODIFY | `outbound-campaign/checklist.md` | E1 |
| P2A-12 | FIX | F-08 (publicist rules) + F-17 (template mismatch) | E1 |

### Phase 2B: Beyond the Papers (7-10 days) -- Parallel with 2A

| ID | Op | File | Enh |
|----|----|------|-----|
| P2B-01 | REWRITE | `step-port-02-beyond-the-papers.md` | E3 |
| P2B-02 | CREATE | `step-port-02b-life-narrative-video.md` | E3 |
| P2B-03 | CREATE | `step-port-02c-portfolio-validation.md` | E3 |
| P2B-04 | CREATE | `portfolio-content.schema.json` | E3 |
| P2B-05 | CREATE | `projects-source.yaml` | E3 |
| P2B-06 | MODIFY | Portfolio HTML (View 4 BTP content) | E3 |
| P2B-07 | MODIFY | Portfolio CSS (BTP styles under `.lr-btp-scope`) | E3 |
| P2B-08 | MODIFY | Portfolio CSS (BTP color tokenization) | E3 |
| P2B-09 | MODIFY | Portfolio HTML `<head>` (font loading) | E3 |
| P2B-10 | MODIFY | `step-port-03-deploy.md` | E3 |
| P2B-11 | MODIFY | `portfolio-deploy/workflow.yaml` + `checklist.md` | E3 |

### Phase 3: Slides -- CONDITIONAL (5-8 days)

Gate check required. If gate fails, defer entirely.

| ID | Op | File | Enh |
|----|----|------|-----|
| P3-01 | MODIFY | `step-port-01-compile.md` | E2 |
| P3-02 | CREATE | `step-port-01b-style-selection.md` | E2 |
| P3-03 | CREATE | `step-port-01c-render-slides-html.md` | E2 |
| P3-04 | CREATE | `abyssal-depth.preset.css` | E2 |
| P3-05 | MODIFY | Portfolio HTML (5th nav item, slide view) | E2 |
| P3-06 | MODIFY | Portfolio JS (lazy load, state preservation) | E2 |
| P3-07 | MODIFY | `step-port-02-beyond-the-papers.md` (separate concern) | E2 |
| P3-08 | MODIFY | `step-port-03-deploy.md` (slides injection) | E2 |

### Phase 4: Polish (5-8 days)

Three parallel tracks: Performance, Accessibility, Finding Fixes.

| Track | Operations | Key Items |
|-------|-----------|-----------|
| **A: Performance** | 5 MODIFY | Base64 -> WebP photo (-570KB), GIF -> WebM (-500KB+), lazy load images, font consolidation, CSS tree-shake |
| **B: Accessibility** | 7 MODIFY | Alt attributes (P0), keyboard nav (P0), skip link (P1), contrast fix (P1), semantic headings (P1), ARIA (P2), `prefers-reduced-motion` (P2) |
| **C: Finding Fixes** | 6 FIX | F-16 (resume-validation ref), F-30 (antigravity CLI), F-32 (installer/sync.js), F-35 (display names), F-21 (BMAD branding), F-39 (memory sidecars) |
| **D: Integration** | 3 MODIFY | Mobile responsiveness (4 breakpoints), JS IIFE wrapping, final integration test |

**Performance target**: Initial load < 500 KB (from ~3.0 MB), LCP < 2.5s, CLS < 0.1, INP < 200ms.

---

## 2. File Operations Registry

### Consolidated Table (All Phases)

| # | File Path (relative to `_lr/sync/`) | Op | Enh | Phase |
|---|--------------------------------------|----|-----|-------|
| 1 | `workflows/jd-optimize/steps-c/step-34-style-theming.md` | REWRITE | E4 | 1 |
| 2 | `workflows/jd-optimize/steps-c/step-35-style-compile.md` | REWRITE | E4 | 1 |
| 3 | `workflows/jd-optimize/steps-c/step-36-style-validation.md` | REWRITE | E4 | 1 |
| 4 | `workflows/jd-optimize/steps-c/step-06b-export-data-contract.md` | CREATE | E4+E1 | 1 |
| 5 | `shared-data/` (directory) | CREATE | E4+E1 | 1 |
| 6 | `workflows/jd-optimize/templates/resume-templates/modern-minimal.html` | CREATE | E4 | 1 |
| 7 | `workflows/jd-optimize/templates/resume-templates/modern-clean.html` | CREATE | E4 | 1 |
| 8 | `workflows/jd-optimize/templates/resume-templates/modern-visual.html` | CREATE | E4 | 1 |
| 9 | `workflows/portfolio-deploy/data/presets/_default.preset.json` | CREATE | E4 | 1 |
| 10 | `workflows/portfolio-deploy/data/presets/google.preset.json` | CREATE | E4 | 1 |
| 11 | `workflows/portfolio-deploy/data/presets/amazon.preset.json` | CREATE | E4 | 1 |
| 12 | `workflows/portfolio-deploy/data/presets/microsoft.preset.json` | CREATE | E4 | 1 |
| 13 | `workflows/portfolio-deploy/data/presets/spotify.preset.json` | CREATE | E4 | 1 |
| 14 | `workflows/portfolio-deploy/data/presets/sync.preset.json` | CREATE | E4 | 1 |
| 15 | `workflows/portfolio-deploy/data/presets/_schema/brand-preset.v1.schema.json` | CREATE | E4 | 1 |
| 16 | `workflows/jd-optimize/workflow.yaml` | MODIFY | E4 | 1 |
| 17 | `workflows/outbound-campaign/workflow.yaml` | MODIFY | E4 | 1 |
| 18 | Portfolio CSS `:root` block | MODIFY | E4 | 1 |
| 19 | `workflows/outbound-campaign/steps-c/step-01-load-session-context.md` | MODIFY | E1 | 2A |
| 20 | `workflows/outbound-campaign/steps-c/step-out-01-ingest.md` | MODIFY | E1 | 2A |
| 21 | `workflows/outbound-campaign/steps-c/step-out-02-strategy.md` | MODIFY | E1 | 2A |
| 22 | `workflows/outbound-campaign/steps-c/step-out-03-cover-letter.md` | REWRITE | E1 | 2A |
| 23 | `workflows/outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md` | CREATE | E1 | 2A |
| 24 | `workflows/outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md` | CREATE | E1 | 2A |
| 25 | `workflows/outbound-campaign/templates/cover_letter.template.md` | CREATE | E1 | 2A |
| 26 | `workflows/outbound-campaign/steps-v/step-01-validate.md` | MODIFY | E1 | 2A |
| 27 | `workflows/portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` | REWRITE | E3 | 2B |
| 28 | `workflows/portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md` | CREATE | E3 | 2B |
| 29 | `workflows/portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md` | CREATE | E3 | 2B |
| 30 | `workflows/portfolio-deploy/data/portfolio-content.schema.json` | CREATE | E3 | 2B |
| 31 | `workflows/portfolio-deploy/data/projects-source.yaml` | CREATE | E3 | 2B |
| 32 | `workflows/portfolio-deploy/steps-c/step-port-01b-style-selection.md` | CREATE | E2 | 3 |
| 33 | `workflows/portfolio-deploy/steps-c/step-port-01c-render-slides-html.md` | CREATE | E2 | 3 |
| 34 | `workflows/portfolio-deploy/data/abyssal-depth.preset.css` | CREATE | E2 | 3 |
| 35 | `workflows/portfolio-deploy/steps-c/step-port-01-compile.md` | MODIFY | E2 | 3 |
| 36 | `workflows/portfolio-deploy/steps-c/step-port-03-deploy.md` | MODIFY | E2+E3+E4 | 2B/3 |
| 37 | `workflows/portfolio-deploy/workflow.yaml` | MODIFY | E2+E3+E4 | 2B |
| 38 | `workflows/portfolio-deploy/checklist.md` | MODIFY | E2+E3+E4 | 2B |

**Step file operations per workflow:**

| Workflow | New | Modified | Rewritten | Total |
|----------|-----|----------|-----------|-------|
| `jd-optimize` | 1 | 7 (E5) | 3 | 11 |
| `outbound-campaign` | 2 | 4 | 1 | 7 |
| `portfolio-deploy` | 4 | 3 | 1 | 8 |
| **Total** | **7** | **14** | **5** | **26** |

---

## 3. Data Flow Pipeline

The Release 3 pipeline spans 8 logical stages across 3 workflows, producing 27 distinct data artifacts.

```
STAGE 1: JD Signal Extraction          jd-optimize (steps 01-06, 08-33)
    |    Agents: sync-parser, sync-linker, sync-refiner, sync-sizer(E5)
    |    Output: jd-profile.yaml, jd_signals_extracted.json
    v
STAGE 2: Company Research + Export     jd-optimize (step 06b) [NEW]
    |    Agent: sync-scout, lr-tracker
    |    Output: shared-data/jd-profile.yaml, shared-data/company_brief.yaml
    |
    +-------> STAGE 3: Resume Theming     jd-optimize (steps 34-36) [REWRITE]
    |            Agent: sync-styler
    |            Output: theme-override.css, jd-{uuid}-draft.html
    |
    +-------> STAGE 4: Cover Letter       outbound-campaign (steps 01->03c)
    |            Agents: sync-parser, sync-publicist, sync-linker
    |            Output: cover_letter_payload.json (7 artifacts total)
    |
    +-------> STAGE 5: Slides Compile     portfolio-deploy (steps port-01->01c)
    |            Agents: sync-linker, sync-styler
    |            Output: slides_content.json, slides_deck.html
    |
    +-------> STAGE 6: BTP Content        portfolio-deploy (steps port-02->02c)
    |            Agent: sync-styler
    |            Output: portfolio_content.json, life_journey.html
    |
    v
STAGE 7: Brand Adapt (CSS Preset)     portfolio-deploy (port-03, CSS gen)
    |    Agent: sync-styler, lr-tracker
    |    Input: {brand_id}.preset.json
    |    Output: Generated CSS block, contrast-report.json
    v
STAGE 8: Portfolio Deploy              portfolio-deploy (port-03, assembly)
         Agent: lr-tracker
         Input: ALL artifacts from stages 3-7
         Output: dist/index.html -> gh-pages -> Live URL
```

**Cross-workflow handoffs:**

| # | From | To | File | Via | Required? |
|---|------|----|------|-----|-----------|
| H-01 | jd-optimize | outbound-campaign | `jd-profile.yaml` | shared-data/ | Yes |
| H-02 | jd-optimize | outbound-campaign | `company_brief.yaml` | shared-data/ | No (graceful degradation) |
| H-03 | jd-optimize | portfolio-deploy | `company_brief.yaml` | shared-data/ | No |
| H-04 | outbound-campaign | portfolio-deploy | `cover_letter_payload.json` | artifacts/ direct | No (deploy without CL) |
| H-05 | portfolio-deploy | outbound-campaign | `slides_content.json` | artifacts/ direct | No (defer cross-ref) |

---

## 4. Validation Gates

Three mandatory validation gates exist. Deployment MUST NOT proceed if any gate is FAIL.

### Gate 1: Resume Style Validation (Stage 3)

| Check | Threshold | Required? |
|-------|-----------|-----------|
| RS-1: Sections populated | All 5 slots filled | Yes |
| RS-2: Accent color applied | `--accent-color` set | Yes |
| RS-3: Forbidden overrides absent | No `color:` on body/p/li except #1a1a1a | Yes |
| RS-4: Print CSS present | `@media print` block found | Yes |
| RS-5: One-page estimate | <= 58 lines | Warn only |
| RS-6: Contrast ratio | >= 4.5:1 vs white | Yes |

### Gate 2: Cover Letter Validation (Stage 4)

| Check | Threshold | Required? |
|-------|-----------|-----------|
| CL-1: Word count | 300-400 | Yes |
| CL-2: XYZ metric | >= 1 in paragraph 2 | Yes |
| CL-3: Bridge reference | Substring found | Yes |
| CL-4: Company name | >= 2 mentions | Yes |
| CL-5: Tone consistency | Matches selected_tone | Warn only |
| CL-6: Generic phrases | 0 matches from forbidden list | Yes |
| CL-7: Caution topics | 0 matches from cautions[] | Yes |

### Gate 3: Portfolio Validation (Stage 6)

| Check | Threshold | Required? |
|-------|-----------|-----------|
| PF-1: Project cards | >= 3 | Yes |
| PF-2: Hobby cards | >= 1 | Yes |
| PF-3: Timeline entries | >= 3 | Yes |
| PF-4: Timeline diversity | >= 2 distinct types | Yes |
| PF-5: External links | All match URL regex | Yes |
| PF-6: Slides deck exists | File size > 0 | Yes |
| PF-7: Slides self-contained | No external deps | Yes |
| PF-8: Life journey HTML | File size > 0 | Yes |

---

# PART IV: CROSS-CUTTING CONCERNS

## 1. CSS Namespace Strategy

**Convention**: Prefix-based scoping (not BEM, not CSS Modules).

| Scope | Prefix | Example | Specificity |
|-------|--------|---------|-------------|
| CV template classes | `lr-cv-*` | `.lr-cv-scope .section` | 0,2,0 |
| BTP template classes | `lr-btp-*` | `.lr-btp-scope .section` | 0,2,0 |
| Shared CSS custom properties | `--lr-*` | `--lr-color-primary` | N/A (variables) |
| BTP-specific CSS variables | `--lr-btp-*` | `--lr-btp-gradient-name` | N/A (variables) |
| State selectors | -- | `.lr-btp-scope .btp-card:hover` | 0,3,0 |

**Scoping containers:**
```html
<div id="resume-view" class="view-container">
  <div class="lr-cv-scope">...</div>
</div>
<div id="whoami-view" class="view-container">
  <div class="lr-btp-scope">...</div>
</div>
```

**Critical collision prevention**: `.lr-cv-scope .section { margin-bottom: 4mm; }` and `.lr-btp-scope .section { padding: 60px 0; }` are completely isolated at specificity 0,2,0. No cross-contamination possible.

> **Source**: PLAN-09a (CSS namespace conflicts)

## 2. Performance Budget

| Metric | Target | Current | Savings |
|--------|--------|---------|---------|
| Initial page load | < 500 KB | ~3.0 MB | ~2.5 MB (83%) |
| Total page weight (lazy) | < 1.5 MB | ~3.0 MB | ~1.5 MB |
| LCP (4G) | < 2.5s | -- | -- |
| CLS | < 0.1 | -- | -- |
| INP | < 200ms | -- | -- |
| Combined JS | < 50 KB | ~14 lines | On target |

**Major savings:**
- Base64 profile photo -> external WebP: **-570 KB**
- Hero GIF -> WebM `<video>`: **-500 KB to -1.5 MB**
- Lazy-load below-fold images: **-1.2 MB deferred**
- Tree-shake unused Webflow CSS: **-30 KB**
- Font consolidation: **-20 KB**
- Eliminated dependencies: jQuery (-90 KB), Webflow runtime (-150 KB), Lottie (-80 KB)

> **Source**: PLAN-09b Section 5

## 3. Accessibility (WCAG AA)

| Priority | Fix | Effort |
|----------|-----|--------|
| P0 | Alt attributes on all images | Low |
| P0 | Keyboard navigation for `.nav-item` (tabindex, Enter/Space) | Low |
| P1 | Skip navigation link | Low |
| P1 | Color contrast fix (darken brand blue to ~4.6:1) | Low |
| P1 | Semantic heading hierarchy (`<h1>` name, `<h2>` sections) | Medium |
| P2 | `aria-current="page"` on active nav | Low |
| P2 | `prefers-reduced-motion` media query | Low |

**Theming system contribution**: The WCAG contrast check in step-34 (>= 4.5:1 for accent vs white) ensures all brand presets meet AA by default. Auto-darkening by 10% increments (3x max) handles edge cases.

> **Source**: PLAN-09b Section 3

## 4. Print Compatibility

The portfolio has two distinct print routes:

| Route | Content | Trigger | CSS |
|-------|---------|---------|-----|
| Resume | View 1 (CV) | `window.print()` from View 1 | `@media print { @page { size: letter; margin: 0.5in; } }` |
| Cover Letter | View 3 (Strategic Fit) | `window.print()` from View 3 | Separate `@media print` rule for `.whycompany-view` |

**Print rules**:
- Sidebar is `display: none` in print
- Only the active view prints (others are `display: none`)
- `* { -webkit-print-color-adjust: exact; }` preserves variable-defined colors
- CSS `text-align: justify` renders identically across Chrome and Firefox print; Safari may add slightly more inter-word spacing (hence 95% fill target, not 100%)

## 5. Font Loading Strategy

| Family | Source | Views | `font-display` | Size Impact |
|--------|--------|-------|-----------------|-------------|
| Roboto (400, 500, 700) | Google Fonts | CV (Views 1-3) | `swap` | Existing |
| Inter (400, 500, 600, 700) | Google Fonts | BTP (View 4), Slides (View 5) | `swap` | +15 KB |
| DM Serif Display (400) | Google Fonts | BTP hero headings | `swap` | +8 KB |
| Aubrey | Custom | BTP decorative | `optional` | +2 KB |

All fonts consolidated into a single Google Fonts `<link>` tag. `font-display: optional` on Aubrey prevents late-swap CLS for a decorative font that is acceptable to miss.

---

# PART V: APPENDICES

## Appendix A: Complete Proposed `_lr/` File Tree

Items marked `[NEW]` are Release 3 additions. `[RW]` = REWRITE. `[MOD]` = MODIFY.

```
linkright/_lr/
├── _config/
│   └── ides/                               # (20 YAML configs, unchanged)
│   └── manifest.yaml
├── _memory/
│   ├── sync-publicist-sidecar/
│   │   ├── instructions.md                 [MOD] Cover Letter Protocol, Variant Protocol
│   │   └── memories.md                     [MOD] Tone mapping patterns
│   ├── sync-styler-sidecar/
│   │   ├── instructions.md                 [MOD] Brand/Slide/Render/Dual-Layer protocols
│   │   └── memories.md                     [MOD] Abyssal Depth preset, Template Matrix
│   ├── sync-scout-sidecar/
│   │   └── instructions.md                 [MOD] Brand Research Protocol
│   ├── sync-linker-sidecar/
│   │   └── memories.md                     [MOD] Bridge Selection refinement
│   ├── sync-sizer-sidecar/
│   │   └── instructions.md                 [MOD] E5: Dynamic budget rules
│   ├── sync-refiner-sidecar/
│   │   └── instructions.md                 [MOD] E5: Width-aware sculpting rules
│   └── ... (remaining sidecars unchanged)
├── sync/
│   ├── agents/                             # (unchanged -- no new agents)
│   ├── shared-data/                        [NEW] Cross-workflow data exchange
│   │   ├── jd-profile.yaml                 [NEW][RUNTIME]
│   │   ├── company_brief.yaml              [NEW][RUNTIME]
│   │   └── active-signals.json             [NEW][RUNTIME] (future)
│   └── workflows/
│       ├── jd-optimize/
│       │   ├── workflow.yaml               [MOD] output_contracts
│       │   ├── checklist.md                [MOD] theming validation
│       │   ├── steps-c/
│       │   │   ├── step-06b-export-data-contract.md   [NEW] E4+E1
│       │   │   ├── step-34-style-theming.md           [RW]  E4
│       │   │   ├── step-35-style-compile.md            [RW]  E4
│       │   │   ├── step-36-style-validation.md         [RW]  E4
│       │   │   ├── step-17a-sizer-line-overflow-check.md [MOD] E5
│       │   │   ├── step-17c-sizer-refiner-iterate.md    [MOD] E5
│       │   │   ├── step-18-select-resume-template.md    [MOD] E5
│       │   │   ├── step-27-content-drafting.md          [MOD] E5
│       │   │   ├── step-28-content-refining.md          [MOD] E5
│       │   │   ├── step-31-layout-budget.md             [MOD] E5
│       │   │   ├── step-32-layout-sizing.md             [MOD] E5
│       │   │   └── ... (remaining steps unchanged)
│       │   ├── templates/
│       │   │   ├── optimized-jd.template.md
│       │   │   └── resume-templates/       [NEW]
│       │   │       ├── modern-minimal.html  [NEW] E4
│       │   │       ├── modern-clean.html    [NEW] E4
│       │   │       └── modern-visual.html   [NEW] E4
│       │   └── artifacts/                  [NEW][RUNTIME]
│       ├── outbound-campaign/
│       │   ├── workflow.yaml               [MOD] company_brief input
│       │   ├── checklist.md                [MOD] cover letter validation
│       │   ├── instructions.md             [MOD] Cover Letter Protocol
│       │   ├── steps-c/
│       │   │   ├── step-01-load-session-context.md    [MOD] E1
│       │   │   ├── step-out-01-ingest.md              [MOD] E1
│       │   │   ├── step-out-02-strategy.md            [MOD] E1
│       │   │   ├── step-out-03-cover-letter.md        [RW]  E1
│       │   │   ├── step-out-03b-cover-letter-variants.md [NEW] E1
│       │   │   ├── step-out-03c-cover-letter-validation.md [NEW] E1
│       │   │   └── ... (remaining steps unchanged)
│       │   ├── templates/
│       │   │   ├── campaign.template.md
│       │   │   └── cover_letter.template.md [NEW] E1
│       │   └── artifacts/                  [NEW][RUNTIME]
│       └── portfolio-deploy/
│           ├── workflow.yaml               [MOD] projects_source, deps
│           ├── checklist.md                [MOD] slides/BTP/theming sections
│           ├── instructions.md             [MOD] protocols
│           ├── steps-c/
│           │   ├── step-port-01-compile.md             [MOD] E2
│           │   ├── step-port-01b-style-selection.md    [NEW] E2+E4
│           │   ├── step-port-01c-render-slides-html.md [NEW] E2
│           │   ├── step-port-02-beyond-the-papers.md   [RW]  E3
│           │   ├── step-port-02b-life-narrative-video.md [NEW] E3
│           │   ├── step-port-02c-portfolio-validation.md [NEW] E3
│           │   └── step-port-03-deploy.md              [MOD] E2+E3+E4
│           ├── data/
│           │   ├── abyssal-depth.preset.css [NEW] E2+E4
│           │   ├── portfolio-content.schema.json [NEW] E3
│           │   ├── projects-source.yaml     [NEW] E3
│           │   └── presets/                 [NEW] E4
│           │       ├── _default.preset.json  [NEW]
│           │       ├── google.preset.json    [NEW]
│           │       ├── amazon.preset.json    [NEW]
│           │       ├── microsoft.preset.json [NEW]
│           │       ├── spotify.preset.json   [NEW]
│           │       ├── sync.preset.json      [NEW]
│           │       └── _schema/
│           │           └── brand-preset.v1.schema.json [NEW]
│           ├── artifacts/                  [NEW][RUNTIME]
│           └── dist/                       [NEW][RUNTIME]
```

---

## Appendix B: Agent RACI Matrix

| Step/Activity | sync-styler (Cora) | sync-publicist (Lyric) | sync-scout (Lyra) | sync-linker (Atlas) | sync-sizer (Kael) | sync-refiner (Veda) | sync-parser (Orion) | lr-tracker (Navi) |
|--------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **E4: Theming** | | | | | | | | |
| step-34 template selection | R/A | | C | | | | | |
| step-35 HTML/CSS assembly | R/A | | | | | | | |
| step-36 style validation | R/A | | | | | | | |
| step-06b data export | | | R | | | | | A |
| Brand preset application | R | | | | | | | A |
| **E1: Cover Letter** | | | | | | | | |
| step-out-01 recruiter ingest | | | | | | | R/A | |
| step-out-02 strategy + tone | | R/A | | C | | | | |
| step-out-03 cover letter gen | | R/A | | C | | | | |
| step-out-03b variants | | R/A | | | | | | |
| step-out-03c validation | | R/A | | | | | | |
| **E2: Slides** | | | | | | | | |
| step-port-01 signal ranking | | | | R | | | | |
| step-port-01b style select | R/A | | | | | | | |
| step-port-01c render HTML | R/A | | | | | | | |
| **E3: Beyond the Papers** | | | | | | | | |
| step-port-02 data ingestion | R/A | | | | | | | |
| step-port-02b timeline gen | R/A | | | | | | | |
| step-port-02c validation | R/A | | | | | | | |
| **E5: Bullet Width** | | | | | | | | |
| Template width extraction | C | | | | R/A | | | |
| Dynamic budget calculation | | | | | R/A | | | |
| Width-aware bullet writing | | | | | C | R/A | | |
| Justify CSS injection | R/A | | | | | | | |
| **Deploy** | | | | | | | | |
| step-port-03 final assembly | C | | | | | | | R/A |

R = Responsible, A = Accountable, C = Consulted

---

## Appendix C: Roboto Character Width Reference (Condensed)

Normalized to digit width = 1.000. Font: Roboto Regular, 2048 units/em, digit advance = 1086 units.

| Weight | Characters |
|--------|-----------|
| 0.445 | `i j l '` |
| 0.516 | `I [space] . , : ; \|` |
| 0.589 | `f ! - ( )` |
| 0.657 | `r J / "` |
| 0.727 | `t` |
| 0.801 | `* [bullet]` |
| 0.860 | `s` |
| 0.930 | `c z F L ?` |
| 1.000 | `a e k v x y E S 0-9 [en-dash] $` |
| 1.029 | `T Z` |
| 1.071 | `b d g h n o p q u` |
| 1.099 | `B C K P X Y + #` |
| 1.169 | `A R V &` |
| 1.239 | `D G H N U` |
| 1.309 | `O Q` |
| 1.385 | `w M % [right-arrow]` |
| 1.599 | `m W [em-dash]` |
| 1.740 | `@` |

**Bold delta**: Add ~0.050 per character when inside `<b>`/`<strong>` tags.

**Common configurations** (pre-computed budgets):

| Template | Page | Font | Available Width | 95% Target |
|----------|------|------|-----------------|------------|
| CV A4 sidebar (current) | A4 | 9.5pt | 669.7px | **94.7** |
| CV A4 sidebar | A4 | 10pt | 669.7px | 90.0 |
| US Letter 1" margins | Letter | 10pt | 624.0px | 83.8 |
| US Letter 0.5" margins | Letter | 10pt | 720.0px | 96.7 |
| Two-column (60/40) | A4 | 9pt | 401.8px | 59.8 |

---

## Appendix D: Brand Preset JSON Schema (Full)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://linkright.dev/schemas/brand-preset.v1.json",
  "title": "LinkrightBrandPreset",
  "type": "object",
  "required": ["preset_version", "brand_id", "brand_name", "colors"],
  "properties": {
    "preset_version": { "type": "string", "const": "1.0" },
    "brand_id": {
      "type": "string",
      "pattern": "^[a-z0-9][a-z0-9-]*[a-z0-9]$",
      "minLength": 2, "maxLength": 40
    },
    "brand_name": { "type": "string", "minLength": 1, "maxLength": 100 },
    "brand_name_short": { "type": "string", "maxLength": 20 },
    "brand_scenario": {
      "type": "string",
      "enum": ["multi-chromatic", "dual-tone", "monochromatic"]
    },
    "logo": {
      "type": "object",
      "properties": {
        "url": { "type": "string", "format": "uri" },
        "favicon_url": { "type": "string", "format": "uri" },
        "usage_note": { "type": "string" }
      }
    },
    "colors": {
      "type": "object",
      "required": ["primary"],
      "properties": {
        "primary": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "secondary": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "tertiary": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "quaternary": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "accent": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "neutral": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" }
      }
    },
    "semantic_overrides": {
      "type": "object",
      "properties": {
        "nav_active_bg": { "type": "string" },
        "nav_active_text": { "type": "string" },
        "footer_bg": { "type": "string" },
        "page_bg": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "sidebar_bg": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "body_bg": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" }
      }
    },
    "identity_horizon": {
      "type": "object",
      "properties": {
        "mode": { "type": "string", "enum": ["segments", "gradient"], "default": "segments" },
        "gradient_start": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "gradient_mid": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "gradient_end": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "gradient_angle": { "type": "number", "minimum": 0, "maximum": 360, "default": 90 }
      }
    },
    "gradients": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "story": { "type": "string" },
        "timeline": { "type": "string" },
        "qualities": { "type": "string" }
      }
    },
    "fonts": {
      "type": "object",
      "properties": {
        "heading_family": { "type": "string" },
        "body_family": { "type": "string" },
        "heading_weight": { "type": "string", "default": "700" },
        "body_weight": { "type": "string", "default": "400" },
        "google_fonts_url": { "type": "string", "format": "uri" },
        "size_scale_factor": { "type": "number", "minimum": 0.8, "maximum": 1.2, "default": 1.0 }
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "source_url": { "type": "string", "format": "uri" },
        "created_at": { "type": "string", "format": "date-time" },
        "created_by": { "type": "string" },
        "notes": { "type": "string" }
      }
    }
  }
}
```

---

## Appendix E: Cross-Reference Index

Where to find deeper detail on any topic.

| Topic | Source Document(s) |
|-------|-------------------|
| CV template DOM, CSS variables, JS, print pipeline | `PLAN-01-PORTFOLIO-CV-AUDIT.md` |
| BTP template, Webflow dependencies, colors, typography | `PLAN-02-BEYOND-PAPERS-AUDIT.md` |
| frontend-slides skill, outbound-campaign, gap analysis | `PLAN-03-04-SLIDES-PUBLICIST-AUDIT.md` |
| Slide content generation, signal-to-slide mapping | `PLAN-03d-04cd-SLIDES-COVERLETTER-DESIGN.md` (Section 1) |
| Cover letter HTML view, data pipeline, injection points | `PLAN-03d-04cd-SLIDES-COVERLETTER-DESIGN.md` (Sections 2-3) |
| BTP view architecture, section stack, CSS variables | `PLAN-05-BEYOND-PAPERS-VIEW-DESIGN.md` |
| CSS custom property taxonomy, typography, cover letter template | `PLAN-06-DESIGN-SPECIFICATIONS.md` |
| Company preset file format, JSON schema | `PLAN-06cde-THEMING-DESIGN.md` (Section 1: PLAN-06c) |
| Accessibility, contrast system, WCAG AA validation | `PLAN-06cde-THEMING-DESIGN.md` (Section 2: PLAN-06d) |
| Identity Horizon brand bar auto-adaptation | `PLAN-06cde-THEMING-DESIGN.md` (Section 3: PLAN-06e) |
| Workflow modifications map, RACI, IDE decision matrix | `PLAN-08-07b-INTEGRATION-ARCHITECTURE-SPECS.md` |
| Workflow step definitions, schemas, step file specs | `PLAN-08b-WORKFLOW-DEFINITIONS.md` |
| End-to-end data flow pipeline, artifact registry | `PLAN-08d-DATA-FLOW-PIPELINE.md` |
| File locations, `_lr/` structure, naming conventions | `PLAN-08e-FILE-LOCATIONS.md` |
| CSS namespace conflicts, performance, accessibility, risk | `PLAN-09-CROSS-CUTTING-CONCERNS.md` |
| Implementation phases, critical path, rollback strategies | `PLAN-10a-IMPLEMENTATION-SEQUENCE.md` |
| File-by-file change list, acceptance criteria per file | `PLAN-10b-CHANGE-LIST.md` |
| Dynamic bullet width design, Roboto hmtx tables | `E5-DYNAMIC-BULLET-WIDTH-DESIGN.md` |
| Release 2 audit (baseline for Release 3) | `Release_2.md` |

---

## Appendix F: Rollback Strategy Summary

Each phase is independently reversible:

| Phase | Rollback Scope | Key Action |
|-------|---------------|------------|
| Phase 0 | Infrastructure only, no user-facing changes | Git revert path rewrite commit |
| Phase 1 | Entirely additive (new files/tokens) | Revert `:root` to original tokens; revert steps to 13-line stubs |
| Phase 2A | outbound-campaign backward-compatible | Revert View 3 HTML changes; outbound-campaign mods can remain |
| Phase 2B | All BTP scoped within `.lr-btp-scope` | Remove scope container, restore placeholder View 4 |
| Phase 3 | Most isolated phase | Remove 5th nav item, revert step mods, delete steps 01b/01c |
| Phase 4 | Independent optimizations | Each optimization individually revertible |

---

## Appendix G: Total Effort Summary

### File Counts by Phase

| Phase | CREATE | MODIFY | REWRITE | Total |
|-------|--------|--------|---------|-------|
| Phase 0 | 2 | 68+ | 0 | 70+ |
| Phase 1 | 14 | 10 | 3 | 27 |
| Phase 2A | 4 | 7 | 1 | 12 |
| Phase 2B | 5 | 5 | 1 | 11 |
| Phase 3 (conditional) | 4 | 4 | 0 | 8 |
| Phase 4 | 0 | 18 | 0 | 18 |
| **TOTAL** | **29** | **112+** | **5** | **146+** |

### Timeline Summary

| Phase | Duration | Parallelizable? |
|-------|----------|-----------------|
| Phase 0 | 3-5 days | Partially |
| Phase 1 | 5-8 days | Yes (Track A + Track B) |
| Phase 2A + 2B | 7-10 days | Yes (fully independent) |
| Phase 3 | 5-8 days | No (gated) |
| Phase 4 | 5-8 days | Partially (3 parallel tracks) |
| **Total (without Phase 3)** | **25-38 days** | |
| **Total (with Phase 3)** | **30-46 days** | |

### Enhancement-to-Phase Quick Reference

| Enhancement | Risk | Decision | Primary Phase | Dependencies |
|-------------|------|----------|---------------|-------------|
| E1: Cover Letter | LOW | GO | Phase 2A | Phase 1 (shared-data) |
| E2: Slides | CRITICAL | DEFER | Phase 3 (conditional) | Phase 2 + gate |
| E3: Beyond the Papers | HIGH | GO-REDUCED | Phase 2B | Phase 1 (CSS tokens) |
| E4: Theming | MEDIUM | GO | Phase 1 | Phase 0 |
| E5: Dynamic Bullet Width | LOW | GO | Phase 1 | Phase 0, E4 (template system) |

---

*End of Release 3 Enhancement Addendum (PLAN-10c)*
*Compiled: 2026-03-07*
*Scope: 5 enhancements, 8 pipeline stages, 27 data artifacts, 3 validation gates, 10 agents*
*Total file operations: ~146+ across 5 phases*
