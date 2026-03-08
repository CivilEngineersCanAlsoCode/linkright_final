# PLAN-08d: End-to-End Data Flow Pipeline for Release 3

**Date**: 2026-03-07
**Scope**: Complete data flow pipeline specification for Linkright Release 3 enhancements
**Depends On**:
- `PLAN-08-07b-INTEGRATION-ARCHITECTURE-SPECS.md` (PLAN-08a/08c/07b)
- `PLAN-08b-WORKFLOW-DEFINITIONS.md` (workflow steps, schemas, interconnections)
- `PLAN-03d-04cd-SLIDES-COVERLETTER-DESIGN.md` (data pipeline, JSON schemas)
- `PLAN-06cde-THEMING-DESIGN.md` (preset format, CSS variable injection)
**Related Beads**: `sync-rrd3` (PLAN-07b), `sync-7n7q` (PLAN-08)

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Master Data Flow Diagram](#2-master-data-flow-diagram)
3. [Pipeline Stage Specifications](#3-pipeline-stage-specifications)
4. [File Artifact Registry](#4-file-artifact-registry)
5. [Cross-Workflow Data Handoff Specification](#5-cross-workflow-data-handoff-specification)
6. [Data Validation Checkpoints](#6-data-validation-checkpoints)
7. [Complete JSON/YAML File Index](#7-complete-jsonyaml-file-index)
8. [Error and Fallback Behavior Matrix](#8-error-and-fallback-behavior-matrix)
9. [Data Lifecycle and Cleanup](#9-data-lifecycle-and-cleanup)
10. [Implementation Checklist](#10-implementation-checklist)

---

## 1. Executive Summary

The Release 3 data flow pipeline transforms a raw job description into a fully deployed, company-branded portfolio with resume, slide deck, cover letter, and "Beyond the Papers" personal narrative. The pipeline spans three workflows (`jd-optimize`, `outbound-campaign`, `portfolio-deploy`) and involves 10 agents producing 27 distinct data artifacts across 8 logical stages.

**Pipeline at a glance:**

```
JD Posting --> Signal Extraction --> Company Research --> Strategic Fit -->
Slide Compilation --> Cover Letter --> Portfolio Assembly --> Brand Adapt --> Deploy
```

**Key design principles:**

- **Single source of truth**: Each data artifact has exactly one producer and one canonical location.
- **Explicit contracts**: Every cross-workflow handoff uses a versioned schema with a file header declaring its producer.
- **Graceful degradation**: Every upstream dependency has a documented fallback behavior.
- **Validation gates**: Three validation checkpoints (style, cover letter, portfolio) must pass before deployment.

---

## 2. Master Data Flow Diagram

### 2.1 Full Pipeline ASCII Diagram

```
                    RAW INPUT
                    =========
    jd-raw.md                      recruiter.pdf (user)
       |                                |
       v                                |
 =====================================================================
 |                 STAGE 1: JD SIGNAL EXTRACTION                      |
 |                 Workflow: jd-optimize                               |
 |                 Steps: 01 --> 06                                    |
 |                                                                    |
 |  step-03-keyword-extraction  (sync-parser / Orion)                 |
 |       |                                                            |
 |       v                                                            |
 |  step-04-competitive-moat    (sync-linker / Atlas)                 |
 |       |                                                            |
 |       v                                                            |
 |  step-05-adversarial-review  (sync-refiner / Veda)                 |
 |       |                                                            |
 |       v                                                            |
 |  step-06-final-output        (sync-refiner / Veda)                 |
 |       |                                                            |
 |       +--> [A] jd-profile.yaml                                     |
 |       |                                                            |
 |  step-08 --> step-33: Signal/content pipeline (existing)           |
 |       |                                                            |
 |       +--> [B] jd_signals_extracted.json (intermediate)            |
 |       |                                                            |
 =====================================================================
       |
       v
 =====================================================================
 |                 STAGE 2: COMPANY RESEARCH + BRAND                  |
 |                 Workflow: jd-optimize                               |
 |                 Step: 06b (NEW)                                     |
 |                                                                    |
 |  step-06b-export-data-contract  (sync-scout / Lyra + lr-tracker)   |
 |       |                                                            |
 |       +--> [A] _lr/sync/shared-data/jd-profile.yaml  (export)     |
 |       |                                                            |
 |       +--> [C] _lr/sync/shared-data/company_brief.yaml            |
 |       |         brand.color_primary, brand.color_secondary         |
 |       |         tone_descriptor, pm_culture, brand_values[]        |
 |       |                                                            |
 =====================================================================
       |
       +-----------------------------+----------------------------+
       |                             |                            |
       v                             v                            v
 ==================     ======================     ====================
 | STAGE 3:       |     | STAGE 5:           |     | STAGE 6:         |
 | RESUME THEMING |     | SLIDES COMPILE     |     | PORTFOLIO        |
 | jd-optimize    |     | portfolio-deploy   |     | CONTENT          |
 | Steps: 34-36   |     | Steps: port-01,    |     | portfolio-deploy |
 |                |     |   port-01b, port-01c|     | Steps: port-02,  |
 |  Reads:        |     |                    |     |   port-02b,      |
 |  [C]           |     |  Reads:            |     |   port-02c       |
 |  company_brief |     |  [C] company_brief |     |                  |
 |                |     |  MongoDB lr-signals |     |  Reads:          |
 |  Writes:       |     |                    |     |  projects-source  |
 |  [D] theme-    |     |  Writes:           |     |    .yaml (user)  |
 |   override.css |     |  [E] slides_       |     |  MongoDB signals  |
 |  [F] jd-{uuid} |     |   content.json     |     |                  |
 |   -draft.html  |     |  [G] selected_     |     |  Writes:         |
 |  [H] style-val |     |   style.json       |     |  [I] portfolio_  |
 |   -report.json |     |  [J] slides_       |     |   content.json   |
 |                |     |   deck.html        |     |  [K] life_       |
 ==================     ======================     |   journey.html   |
                             |                     |  [L] portfolio_  |
                             |                     |   validation.json|
                             |                     ====================
                             |                            |
       +---------------------+                            |
       |                                                  |
       v                                                  v
 =====================================================================
 |                 STAGE 4: STRATEGIC FIT (COVER LETTER)              |
 |                 Workflow: outbound-campaign                         |
 |                 Steps: 01, out-01, out-02, out-03, out-03b, out-03c|
 |                                                                    |
 |  step-01-load-session-context   (System)                           |
 |       |                                                            |
 |       +--> reads [A] jd-profile.yaml from shared-data              |
 |       +--> reads [C] company_brief.yaml from shared-data           |
 |       |                                                            |
 |  step-out-01-ingest   (sync-parser / Orion)                        |
 |       |                                                            |
 |       +--> reads recruiter.pdf (user-provided)                     |
 |       +--> [M] recruiter_profile.json                              |
 |       |                                                            |
 |  step-out-02-strategy   (sync-publicist / Lyric)                   |
 |       |                                                            |
 |       +--> reads [M] recruiter_profile.json                        |
 |       +--> reads [A] jd-profile.yaml                               |
 |       +--> reads [C] company_brief.yaml                            |
 |       +--> [N] outreach_strategy.json                              |
 |       |         selected_tone, the_bridge, brand_values[]          |
 |       |                                                            |
 |  step-out-03-cover-letter   (sync-publicist / Lyric)               |
 |       |                                                            |
 |       +--> reads [N] outreach_strategy.json                        |
 |       +--> reads [A] jd-profile.yaml                               |
 |       +--> reads [E] slides_content.json (Bridge signal)           |
 |       +--> reads [M] recruiter_profile.json                        |
 |       +--> [O] cover_letter.md                                     |
 |       +--> [P] cover_letter_payload.json                           |
 |       |                                                            |
 |  step-out-03b-cover-letter-variants   (sync-publicist / Lyric)     |
 |       |                                                            |
 |       +--> reads [O] cover_letter.md                               |
 |       +--> [Q] cover_letter_variants.json                          |
 |       |                                                            |
 |  step-out-03c-cover-letter-validation   (sync-publicist / Lyric)   |
 |       |                                                            |
 |       +--> reads selected variant from [Q]                         |
 |       +--> [R] cover_letter_final.md                               |
 |       +--> [S] cover_letter_validation.json                        |
 |       |                                                            |
 =====================================================================
       |
       v
 =====================================================================
 |                 STAGE 7: BRAND ADAPT (CSS PRESET)                  |
 |                 Workflow: portfolio-deploy                          |
 |                 Step: port-03 (within deploy)                       |
 |                                                                    |
 |  Reads:                                                            |
 |    [C] company_brief.yaml --> brand_id lookup                      |
 |    presets/{brand_id}.preset.json --> CSS generation                |
 |    brand-preset.v1.schema.json --> validation                      |
 |                                                                    |
 |  Applies:                                                          |
 |    generateBrandCSS(preset) --> CSS custom properties              |
 |    Contrast validation (WCAG AA)                                   |
 |    Identity Horizon gradient/segment injection                     |
 |    Font override injection (if custom fonts specified)             |
 |                                                                    |
 |  Writes:                                                           |
 |    [T] Generated CSS block (inline in final HTML)                  |
 |    [U] contrast-report.json                                        |
 |                                                                    |
 =====================================================================
       |
       v
 =====================================================================
 |                 STAGE 8: PORTFOLIO DEPLOY (FINAL HTML)             |
 |                 Workflow: portfolio-deploy                          |
 |                 Step: port-03                                       |
 |                                                                    |
 |  step-port-03-deploy   (lr-tracker / Navi)                         |
 |       |                                                            |
 |       +--> reads [E] slides_content.json                           |
 |       +--> reads [J] slides_deck.html                              |
 |       +--> reads [I] portfolio_content.json                        |
 |       +--> reads [K] life_journey.html                             |
 |       +--> reads [G] selected_style.json                           |
 |       +--> reads [P] cover_letter_payload.json                     |
 |       +--> reads [C] company_brief.yaml (brand accent)             |
 |       +--> reads {brand_id}.preset.json (CSS tokens)               |
 |       |                                                            |
 |       | Injection Map:                                             |
 |       |   [E] --> <!-- SLOT:SLIDES_DATA -->                        |
 |       |   [J] --> <!-- SLOT:SLIDES_DECK -->                        |
 |       |   [I] --> <!-- SLOT:PORTFOLIO_DATA -->                     |
 |       |   [K] --> <!-- SLOT:LIFE_JOURNEY -->                       |
 |       |   [G] --> <!-- SLOT:STYLE_TOKENS -->                       |
 |       |   [P] --> cover letter view data-field injection           |
 |       |   [T] --> <!-- BRAND_PRESET_INJECTION_POINT -->            |
 |       |                                                            |
 |       +--> [V] dist/index.html (assembled portfolio)               |
 |       +--> [W] dist/slides.html (standalone slide deck)            |
 |       +--> git push to gh-pages branch                             |
 |       +--> Live Portfolio URL                                      |
 |                                                                    |
 =====================================================================
```

### 2.2 Simplified Linear Flow

```
jd-raw.md
  |
  v
[STAGE 1] jd-optimize (steps 01-06, 08-33)
  |  Agents: sync-parser, sync-linker, sync-refiner
  |  Output: jd-profile.yaml, jd_signals_extracted.json
  |
  v
[STAGE 2] jd-optimize (step 06b) -- sync-scout + lr-tracker
  |  Output: shared-data/jd-profile.yaml, shared-data/company_brief.yaml
  |
  +-------> [STAGE 3] jd-optimize (steps 34-36) -- sync-styler
  |            Output: theme-override.css, jd-{uuid}-draft.html,
  |                    style-validation-report.json
  |
  +-------> [STAGE 4] outbound-campaign (steps 01, out-01 to out-03c)
  |            Agents: sync-parser, sync-publicist, sync-linker
  |            Output: recruiter_profile.json, outreach_strategy.json,
  |                    cover_letter.md, cover_letter_payload.json,
  |                    cover_letter_variants.json, cover_letter_final.md,
  |                    cover_letter_validation.json
  |
  +-------> [STAGE 5] portfolio-deploy (steps port-01 to port-01c)
  |            Agents: sync-linker, sync-styler
  |            Output: slides_content.json, selected_style.json,
  |                    slides_deck.html
  |
  +-------> [STAGE 6] portfolio-deploy (steps port-02 to port-02c)
  |            Agent: sync-styler
  |            Output: portfolio_content.json, life_journey.html,
  |                    portfolio_validation.json
  |
  v
[STAGE 7] portfolio-deploy (step port-03, CSS generation)
  |  Agent: sync-styler (CSS), lr-tracker (injection)
  |  Input: {brand_id}.preset.json, company_brief.yaml
  |  Output: Generated CSS block, contrast-report.json
  |
  v
[STAGE 8] portfolio-deploy (step port-03, final assembly)
     Agent: lr-tracker / Navi
     Input: ALL artifacts from stages 3-7
     Output: dist/index.html, dist/slides.html
     Action: git push gh-pages --> Live URL
```

---

## 3. Pipeline Stage Specifications

### STAGE 1: JD Signal Extraction

| Property | Value |
|----------|-------|
| **Workflow** | `jd-optimize` |
| **Steps** | `step-01` through `step-06`, `step-08` through `step-33` |
| **Executing Agents** | sync-parser (Orion), sync-linker (Atlas), sync-refiner (Veda), sync-inquisitor (Sia), sync-sizer (Kael) |
| **Dependencies** | None (pipeline entry point) |

**Input Data Format:**

| File | Format | Location | Source |
|------|--------|----------|--------|
| `jd-raw.md` | Markdown | `jd-optimize/data/jd-raw.md` | User-provided (copy-pasted JD text) |
| `signals-*.yaml` | YAML | `jd-optimize/data/signals-*.yaml` | User career signals (pre-existing) |
| `reference/*.yaml` | YAML | `jd-optimize/data/reference/*.yaml` | Static reference data |

**Output Data Format:**

| File | Format | Schema | Location |
|------|--------|--------|----------|
| `jd-profile.yaml` | YAML v1.0 | `jd_profile` schema (see Section 7) | `jd-optimize/artifacts/` (internal) |
| `jd_signals_extracted.json` | JSON | `LinkrightJDSignalsExtracted` schema | `jd-optimize/artifacts/` |
| `optimized-jd.md` | Markdown | Template-based | `jd-optimize/artifacts/` |

**Error/Fallback:**

| Condition | Behavior |
|-----------|----------|
| `jd-raw.md` missing | STOP. Instruct user to provide JD text. Pipeline cannot proceed. |
| No career signals in MongoDB | WARN. Continue with reduced signal set. Flag `signal_count: 0` in profile. |
| Parsing failure (malformed JD) | Retry with sync-parser's fallback heuristics. If still fails, ask user to manually extract key sections. |

---

### STAGE 2: Company Research + Brand Export

| Property | Value |
|----------|-------|
| **Workflow** | `jd-optimize` |
| **Step** | `step-06b-export-data-contract` (NEW) |
| **Executing Agents** | sync-scout (Lyra) for company research, lr-tracker (Navi) for file writing |
| **Dependencies** | Stage 1 must complete (`step-06-final-output` done) |

**Input Data Format:**

| File | Format | Source |
|------|--------|--------|
| In-memory JD profile data | From steps 01-06 | Stage 1 output |
| Company website / public data | Web research | sync-scout live research |

**Output Data Format:**

| File | Format | Schema Version | Location |
|------|--------|---------------|----------|
| `jd-profile.yaml` | YAML | 1.0 | `_lr/sync/shared-data/jd-profile.yaml` |
| `company_brief.yaml` | YAML | 1.0 | `_lr/sync/shared-data/company_brief.yaml` |

**`company_brief.yaml` Schema (Canonical):**

```yaml
# Producer: jd-optimize (step-06b-export-data-contract)
# Generated: {ISO timestamp}
# Schema version: 1.0

company_brief:
  id: "cb-{uuid}"
  company_name: "{COMPANY_NAME}"
  company_stage: "startup|scale-up|enterprise|faang"
  industry: "{industry_vertical}"
  team_name: "{team or org}"
  role_title: "{TARGET_JOB_TITLE}"
  brand:
    color_primary: "#RRGGBB"
    color_secondary: "#RRGGBB"
    logo_url: "{url_if_available}"
  tone_descriptor: "formal|conversational|technical|vision-driven"
  pm_culture: "data-driven|design-led|engineering-first|customer-obsessed"
  brand_values:
    - "{value_1}"
    - "{value_2}"
  cautions:
    - "{thing_to_avoid}"
  source_url: "{company_website_or_jd_url}"
  researched_at: "{ISO timestamp}"
  researched_by: "sync-scout"
```

**`jd-profile.yaml` Export Schema:**

```yaml
# Producer: jd-optimize (step-06b-export-data-contract)
# Generated: {ISO timestamp}
# Schema version: 1.0

jd_profile:
  id: "jd-{uuid}"
  parsed_at: "{ISO}"
  company: "{COMPANY_NAME}"
  role_title: "{ROLE_TITLE}"
  seniority: "junior|mid|senior|staff|principal"
  team: "{TEAM}"
  location: "{LOCATION}"
  requirements:
    hard:
      - text: "{requirement_text}"
        signal_type: "{type}"
        weight: "critical|high|medium"
    soft:
      - text: "{soft_skill}"
        signal_type: "{type}"
    cultural:
      - text: "{cultural_value}"
        value_signal: "{signal}"
  keywords_ats: ["{keyword_1}", "{keyword_2}"]
  skills_technical: ["{skill_1}", "{skill_2}"]
  skills_pm_core: ["{skill_1}", "{skill_2}"]
  ownership_signals: ["{signal_1}", "{signal_2}"]
  company_stage: "startup|scale-up|enterprise|faang"
  persona_fit_primary: "{persona}"
  persona_fit_secondary: "{persona}"
  persona_scores:
    tech_pm: 0
    growth_pm: 0
    strategy_pm: 0
    product_pm: 0
  company_brief_id: "cb-{uuid}"
  alignment_score_baseline: 0
  alignment_score_final: 0
  uplift: 0
```

**Storage location**: `_lr/sync/shared-data/` (new directory, created by this step)

**Cross-reference validation**: `jd_profile.company_brief_id` MUST match `company_brief.id`.

**Error/Fallback:**

| Condition | Behavior |
|-----------|----------|
| sync-scout not invoked | Set `brand.color_primary` to `null`, `tone_descriptor` to `"formal"`, mark `researched_by: "inferred"` |
| Company website unreachable | Infer `company_stage` from JD language. Set brand colors to `null`. Log warning. |
| Existing shared-data files | Prompt user: "[O]verwrite or [K]eep current?" |
| No company name in JD | Set `company_name` to `"Target Company"`. Flag for user correction. |

---

### STAGE 3: Resume Theming (Brand Adapt for Resume)

| Property | Value |
|----------|-------|
| **Workflow** | `jd-optimize` |
| **Steps** | `step-34-style-theming`, `step-35-style-compile`, `step-36-style-validation` (all REWRITE) |
| **Executing Agent** | sync-styler (Cora) |
| **Dependencies** | Stage 2 must complete (company_brief.yaml available in shared-data) |

**Input Data Format:**

| File | Format | Source |
|------|--------|--------|
| `company_brief.yaml` | YAML | `_lr/sync/shared-data/` (from Stage 2) |
| Layout-verified content | In-memory | Steps 27-33 of jd-optimize |
| Resume template HTML | HTML | `jd-optimize/templates/resume-templates/{template}.html` |

**Output Data Format:**

| File | Format | Location | Content |
|------|--------|----------|---------|
| `theme-override.css` | CSS | `jd-optimize/artifacts/` | CSS variable overrides for brand accent |
| `jd-{uuid}-draft.html` | HTML | `jd-optimize/artifacts/` | Complete resume with injected content and theme |
| `style-validation-report.json` | JSON | `jd-optimize/artifacts/` | 6-check validation results |

**Template Selection Matrix (step-34):**

| `company_stage` | `pm_culture` | Selected Template |
|-----------------|-------------|-------------------|
| `faang` | any | `modern-minimal.html` |
| `enterprise` | any | `modern-minimal.html` |
| `scale-up` | `data-driven` | `modern-clean.html` |
| `scale-up` | `design-led` | `modern-visual.html` |
| `scale-up` | `engineering-first` | `modern-clean.html` |
| `scale-up` | `customer-obsessed` | `modern-clean.html` |
| `startup` | `design-led` | `modern-visual.html` |
| `startup` | any other | `modern-clean.html` |
| default | default | `modern-minimal.html` |

**CSS Output (theme-override.css):**

```css
:root {
  --accent-color: {computed_accent};
  --accent-color-secondary: {computed_secondary_or_inherit};
  --accent-color-muted: {accent_at_30_percent_opacity};
}
.resume-header .name { color: var(--accent-color); }
.section-divider { border-bottom: 1px solid var(--accent-color-muted); }
body, p, li, .bullet { color: #1a1a1a !important; }
.section-background { background: transparent !important; }
```

**Template Slot Markers (step-35):**

```html
<!-- SLOT:THEME_CSS -->    --> theme-override.css contents
<!-- SLOT:HEADER -->       --> header_html
<!-- SLOT:SUMMARY -->      --> summary_html
<!-- SLOT:EXPERIENCE -->   --> experience_html
<!-- SLOT:SKILLS -->       --> skills_html
<!-- SLOT:EDUCATION -->    --> education_html
```

**Style Validation Report Schema (step-36):**

```json
{
  "jd_id": "jd-{uuid}",
  "template_used": "{template_name}",
  "accent_color": "{hex}",
  "accent_color_adjusted": "{hex_or_null}",
  "contrast_ratio": 0.0,
  "checks": [
    { "id": 1, "name": "sections_populated", "result": "PASS|FAIL" },
    { "id": 2, "name": "accent_applied", "result": "PASS|FAIL" },
    { "id": 3, "name": "forbidden_overrides", "result": "PASS|FAIL" },
    { "id": 4, "name": "print_css", "result": "PASS|FAIL" },
    { "id": 5, "name": "one_page_estimate", "result": "PASS|WARN|FAIL" },
    { "id": 6, "name": "contrast_ratio", "result": "PASS|FAIL" }
  ],
  "overall": "PASS|FAIL",
  "validated_at": "{ISO timestamp}"
}
```

**Error/Fallback:**

| Condition | Behavior |
|-----------|----------|
| `company_brief.yaml` missing | Default accent: `#0E9E8E` (Sync teal). Default template: `modern-minimal.html`. |
| Brand color fails contrast check | Darken by 10% increments (up to 3x). If still fails, fall back to Sync teal. |
| Content exceeds one page | WARN user: "Content may exceed one page. Consider shortening experience by {N} lines." |
| Template file missing | STOP. Log error. Instruct user to verify template directory. |

---

### STAGE 4: Strategic Fit (Cover Letter Generation)

| Property | Value |
|----------|-------|
| **Workflow** | `outbound-campaign` |
| **Steps** | `step-01`, `step-out-01`, `step-out-02`, `step-out-03`, `step-out-03b`, `step-out-03c` |
| **Executing Agents** | sync-parser (Orion) for recruiter parsing, sync-publicist (Lyric) for cover letter, sync-linker (Atlas) for Bridge signal |
| **Dependencies** | Stage 2 must complete (jd-profile.yaml + company_brief.yaml in shared-data) |

**Input Data Format:**

| File | Format | Source |
|------|--------|--------|
| `jd-profile.yaml` | YAML | `_lr/sync/shared-data/` (from Stage 2) |
| `company_brief.yaml` | YAML | `_lr/sync/shared-data/` (from Stage 2) |
| Recruiter PDF/profile | PDF/text | User-provided |
| `slides_content.json` | JSON | `portfolio-deploy/artifacts/` (from Stage 5, for Bridge cross-reference) |
| `lr-config.yaml` | YAML | `_lr/_config/` (session context) |

**Output Data Format:**

| File | Format | Location | Producer Step |
|------|--------|----------|-------------|
| `recruiter_profile.json` | JSON | `outbound-campaign/artifacts/` | step-out-01 |
| `outreach_strategy.json` | JSON | `outbound-campaign/artifacts/` | step-out-02 |
| `cover_letter.md` | Markdown | `outbound-campaign/artifacts/` | step-out-03 |
| `cover_letter_payload.json` | JSON | `outbound-campaign/artifacts/` | step-out-03 |
| `cover_letter_variants.json` | JSON | `outbound-campaign/artifacts/` | step-out-03b |
| `cover_letter_final.md` | Markdown | `outbound-campaign/artifacts/` | step-out-03c |
| `cover_letter_validation.json` | JSON | `outbound-campaign/artifacts/` | step-out-03c |

**`outreach_strategy.json` Enhanced Schema:**

```json
{
  "selected_tone": "Formal|Conversational|Technical|Vision-Driven",
  "tone_source": "company_brief|recruiter_profile|default",
  "the_bridge": {
    "signal_id": "sig-{uuid}",
    "title": "{achievement_title}",
    "xyz_metric": "{primary_metric}",
    "persona_relevance": "{persona_tag}"
  },
  "golden_signals": ["sig-...", "sig-...", "sig-..."],
  "brand_values": ["{value_1}", "{value_2}"],
  "cautions": ["{caution_1}"]
}
```

**`cover_letter_payload.json` Schema (for HTML injection):**

```json
{
  "meta": {
    "candidate_name": "{name}",
    "target_role": "{role}",
    "company_name": "{company}",
    "date": "{ISO date}",
    "addressee": {
      "name": "{recruiter_name_or_null}",
      "title": "{recruiter_title_or_null}",
      "company": "{company}"
    },
    "candidate_email": "{email}",
    "candidate_phone": "{phone}"
  },
  "letter": {
    "hook": "{paragraph_1_text (80-120 words)}",
    "why_me": "{paragraph_2_text (100-150 words)}",
    "why_them": "{paragraph_3_text (80-120 words)}",
    "closing": "{optional_cta (15-30 words)}"
  },
  "signature": {
    "sign_off": "Warm regards,",
    "name": "{candidate_name}",
    "portfolio_url": "{url}"
  },
  "quality": {
    "word_count": 0,
    "tone": "{selected_tone}",
    "bridge_signal_id": "sig-{uuid}",
    "ats_keywords_embedded": ["{kw1}", "{kw2}"],
    "validation_status": "PASS"
  }
}
```

**Tone Resolution Priority Order (step-out-02):**

```
1. company_brief.tone_descriptor  (highest -- explicit research)
2. recruiter_profile.recruiter_tone_indicators[]  (inferred from parsing)
3. Default: "formal"
```

**Three-Paragraph Structure (step-out-03):**

| Paragraph | Class | Word Target | Content Source |
|-----------|-------|-------------|---------------|
| 1: "The Hook" | `lr-cv-hook` | 80-120 | Company research, recruiter pain_points, brand_values[] |
| 2: "The Bridge" | `lr-cv-bridge` | 100-150 | Bridge signal from outreach_strategy.json, XYZ metric, slides[0] mirror |
| 3: "The Value Prop" | `lr-cv-value-prop` | 80-120 | Internal motivations, cultural requirements, gap mitigation |
| (opt): Closing | `lr-cv-closing` | 15-30 | Soft CTA specific to role |

**Cross-Artifact Consistency Rules:**

| Rule | Enforcement |
|------|-------------|
| Bridge signal in cover letter MUST match `slides_content.json.slides[0]` | Compare `outreach_strategy.json.bridge_signal` with `slides_content.json.metadata.bridge_signal_id` |
| Primary metric in cover letter MUST appear verbatim in slide deck | String match `slides[0].sections.the_metric` in `letter.why_me` |
| Company name in cover letter MUST match `--lr-target-company-name` | Compare `cover_letter_payload.json.meta.company_name` with CSS variable |
| Cover letter tone MUST match slide content tone | Compare `outreach_strategy.json.tone` with `slides_content.json.metadata.tone` |

**Error/Fallback:**

| Condition | Behavior |
|-----------|----------|
| No recruiter profile | Omit addressee block. Salutation: "Dear Hiring Manager,". Hook uses company-only research. |
| company_brief.yaml missing | Default tone: "formal". No brand_values for hook. |
| Word count < 300 | Expand "Why Them" paragraph with company-specific detail. |
| Word count > 400 | Compress "Why Me" paragraph by removing weakest signal reference. |
| slides_content.json not yet generated | Defer cross-reference validation. Use Bridge from outreach_strategy only. |
| Validation FAIL | Auto-fix if possible (word count, phrase replacement). If not, return to step-out-03 for manual edit. |

---

### STAGE 5: Slide Compilation + Rendering

| Property | Value |
|----------|-------|
| **Workflow** | `portfolio-deploy` |
| **Steps** | `step-port-01-compile` (MODIFY), `step-port-01b-style-selection` (NEW), `step-port-01c-render-slides-html` (NEW) |
| **Executing Agents** | sync-linker (Atlas) for signal query, sync-styler (Cora) for compilation and rendering |
| **Dependencies** | Stage 2 must complete (company_brief.yaml optional for theming overlay) |

**Input Data Format:**

| File | Format | Source |
|------|--------|--------|
| MongoDB `lr-signals` collection | 1536-dim embeddings | Existing career signals database |
| `lr-config.yaml` | YAML | Session context (user_name, strategic_gravity) |
| `company_brief.yaml` | YAML | `_lr/sync/shared-data/` (optional, for accent overlay) |
| Sync design tokens | CSS variables | `SYNC-DESIGN-AND-TECHNICAL-SPECS.md` |

**Output Data Format:**

| File | Format | Location | Producer Step |
|------|--------|----------|-------------|
| `slides_content.json` | JSON | `portfolio-deploy/artifacts/` | step-port-01 |
| `selected_style.json` | JSON | `portfolio-deploy/artifacts/` | step-port-01b |
| `slides_deck.html` | HTML (self-contained) | `portfolio-deploy/artifacts/` | step-port-01c |

**`slides_content.json` Complete Schema:**

```json
{
  "slides": [
    {
      "signal_id": "sig-{uuid}",
      "title": "{achievement_title (max 60 chars)}",
      "subtitle": "{company | team | year_range (max 80 chars)}",
      "sections": {
        "the_problem": "{50-250 chars}",
        "the_process": "{60-300 chars}",
        "the_metric": "{20-150 chars}",
        "the_legacy": "{40-200 chars}"
      },
      "role_alignment": "{strategic_gravity_tag}",
      "impact_rank": 1,
      "jd_requirement_match": "{verbatim P0 requirement}",
      "ats_keywords_embedded": ["{kw1}", "{kw2}"]
    }
  ],
  "metadata": {
    "user_name": "{USER_NAME}",
    "target_role": "{TARGET_JOB_TITLE}",
    "target_company": "{COMPANY_NAME}",
    "generated_at": "{ISO timestamp}",
    "signal_count": 5,
    "top_gravity": "{Role Identity}",
    "bridge_signal_id": "sig-{uuid}",
    "tone": "formal|casual|technical",
    "source_jd_id": "jd-{uuid}|null"
  },
  "style": {
    "preset": "abyssal-depth",
    "brand_override": "{brand_id}|null",
    "emotional_tone": "impressed|excited|calm|professional|bold"
  }
}
```

**Signal Ranking Algorithm (step-port-01):**

```
composite_score = (
  0.40 * max(cosine_similarities to P0 requirements)  +
  0.25 * persona_alignment                              +
  0.20 * metric_density                                 +
  0.15 * ownership_match
)
rank by composite_score DESC --> select top 5
```

**Constraint**: Bridge signal from `outreach_strategy.json` is force-ranked #1 regardless of composite score.

**`selected_style.json` Schema (step-port-01b):**

```json
{
  "preset_name": "Abyssal Depth",
  "base_theme": "dark",
  "tokens": {
    "bg_base": "#091614",
    "bg_surface": "#0F1F1C",
    "bg_elevated": "#122520",
    "color_primary": "#0E9E8E",
    "color_accent": "#D9705A",
    "color_achievement": "#C8973A",
    "color_text_primary": "#E8E8E8",
    "color_text_secondary": "#A8BFC0",
    "color_border": "#A8BFC0"
  },
  "company_overlay": {
    "enabled": true,
    "accent_color": "#RRGGBB|null",
    "source": "company_brief|default"
  },
  "typography": {
    "font_heading": "'Inter', sans-serif",
    "font_body": "'Inter', sans-serif",
    "font_size_title": "2.5rem",
    "font_size_body": "1.1rem",
    "line_height": "1.6"
  },
  "animation": {
    "slide_transition": "fade",
    "entrance_delay": "0.3s",
    "exit_delay": "0.2s"
  },
  "generated_at": "{ISO timestamp}"
}
```

**Dual-Layer Theming Rules (step-port-01b):**

- **Base layer**: Always Sync ocean theme (Abyssal Depth).
- **Overlay layer** (optional): Company accent from `company_brief.brand.color_primary`.
  - Applied to: links, hover states, CTA buttons, slide transition accent lines.
  - NEVER overrides: Sync background colors, Sync text colors.
  - Accessibility: company accent vs. `--sync-bg-base` must be >= 4.5:1.
- **No company brief**: Use `--sync-coral-core` (#D9705A) as accent overlay.

**`slides_deck.html` Requirements (step-port-01c):**

- Single HTML file with ALL CSS and JS inline.
- Zero external dependencies (no `<link>`, no `<script src>`, no `@import`, no external `url()`).
- Viewport-responsive: desktop (>=1024px), tablet (768-1023px), mobile (<768px).
- Keyboard navigation (arrow keys, space), click/tap, touch swipe.
- File size target: < 500KB.

**Error/Fallback:**

| Condition | Behavior |
|-----------|----------|
| Fewer than 5 signals in MongoDB | Reduce to available count (minimum 3). Flag in metadata. |
| All signals below 0.6 similarity | WARN. Include best available with quality flag. |
| company_brief.yaml missing | Use `--sync-coral-core` (#D9705A) for accent. No company overlay. |
| Company accent fails contrast | Adjust or fall back to Sync coral. |
| slides_deck.html > 500KB | WARN user. Suggest optimizing embedded content. |

---

### STAGE 6: Portfolio Content (Beyond the Papers)

| Property | Value |
|----------|-------|
| **Workflow** | `portfolio-deploy` |
| **Steps** | `step-port-02-beyond-the-papers` (REWRITE), `step-port-02b-life-narrative-video` (NEW), `step-port-02c-portfolio-validation` (NEW) |
| **Executing Agent** | sync-styler (Cora) |
| **Dependencies** | Stage 5 must complete (`slides_deck.html` exists). Independent of Stage 4. |

**Input Data Format:**

| File | Format | Source |
|------|--------|--------|
| `projects-source.yaml` | YAML | `portfolio-deploy/data/` (user-provided, optional) |
| User conversation input | Interactive | Fallback if no source file |
| Career signals | MongoDB | For enriching project impact summaries |

**Output Data Format:**

| File | Format | Location | Producer Step |
|------|--------|----------|-------------|
| `portfolio_content.json` | JSON | `portfolio-deploy/artifacts/` | step-port-02 |
| `life_journey.html` | HTML | `portfolio-deploy/artifacts/` | step-port-02b |
| `portfolio_validation.json` | JSON | `portfolio-deploy/artifacts/` | step-port-02c |

**`portfolio_content.json` Schema:**

```json
{
  "projects": [
    {
      "id": "proj-{uuid}",
      "title": "Project Name",
      "description": "One-liner impact summary",
      "thumbnail_url": "path/to/thumbnail.png",
      "external_link": "https://...",
      "tech_stack": ["React", "Node.js"],
      "impact_summary": "XYZ format metric",
      "display_order": 1
    }
  ],
  "hobbies": [
    {
      "category": "Photography",
      "narrative_hook": "Finding patterns in chaos",
      "icon": "camera"
    }
  ],
  "life_journey": [
    {
      "year": 2020,
      "milestone": "Led migration to microservices at Company X",
      "type": "career|personal|education"
    }
  ],
  "video_placeholder": {
    "enabled": false,
    "label": "Life Narrative - Coming Soon"
  }
}
```

**Portfolio Validation Checks (step-port-02c):**

| # | Check | PASS Condition |
|---|-------|---------------|
| PF-1 | Project card count | `projects.length >= 3` |
| PF-2 | Hobby card count | `hobbies.length >= 1` |
| PF-3 | Timeline entry count | `life_journey.length >= 3` |
| PF-4 | Timeline type diversity | >= 2 distinct `type` values |
| PF-5 | External links valid | All URLs match URL regex |
| PF-6 | Slides deck exists | `slides_deck.html` file size > 0 |
| PF-7 | Slides self-contained | No external `<link>` or `<script src>` |
| PF-8 | Life journey HTML | `life_journey.html` file size > 0 |

**Error/Fallback:**

| Condition | Behavior |
|-----------|----------|
| `projects-source.yaml` missing | Prompt user for project/hobby data interactively. |
| Fewer than 3 projects provided | Prompt user to add more. Do not proceed with fewer than 3. |
| No hobby/interest provided | Prompt user for at least 1. |
| Timeline < 3 entries | Prompt user for additional milestones. |
| Validation FAIL | Return to relevant step for remediation. Do not proceed to deploy. |

---

### STAGE 7: Brand Adapt (CSS Preset Application)

| Property | Value |
|----------|-------|
| **Workflow** | `portfolio-deploy` |
| **Step** | Part of `step-port-03-deploy` (CSS generation phase) |
| **Executing Agent** | sync-styler (Cora) for CSS, lr-tracker (Navi) for injection |
| **Dependencies** | company_brief.yaml from Stage 2 (optional). Preset files must exist. |

**Input Data Format:**

| File | Format | Source |
|------|--------|--------|
| `company_brief.yaml` | YAML | `_lr/sync/shared-data/` (brand_id for preset lookup) |
| `{brand_id}.preset.json` | JSON v1.0 | `portfolio-deploy/data/presets/` |
| `_default.preset.json` | JSON v1.0 | `portfolio-deploy/data/presets/` |
| `brand-preset.v1.schema.json` | JSON Schema | `portfolio-deploy/data/presets/_schema/` |

**Output Data Format:**

| File | Format | Location | Content |
|------|--------|----------|---------|
| Generated CSS block | CSS (inline) | Injected at `<!-- BRAND_PRESET_INJECTION_POINT -->` | `html[data-brand="..."] { ... }` |
| `contrast-report.json` | JSON | `portfolio-deploy/artifacts/` | WCAG AA validation results |

**Preset Discovery Algorithm:**

```
1. Read brand_id from company_brief.yaml (or user selection)
2. Look for: presets/{brand_id}.preset.json
3. If not found: use presets/_default.preset.json
4. Validate against brand-preset.v1.schema.json
5. If validation fails: ABORT with field-level error list
```

**CSS Generation Algorithm (from PLAN-06c):**

```
generateBrandCSS(preset) -> CSS text containing:
  - --lr-target-company-name: "{brand_name}"
  - --lr-brand-primary through --lr-brand-quaternary
  - --lr-brand-accent, --lr-brand-neutral
  - Semantic color overrides (nav, footer, page, sidebar, body backgrounds)
  - Identity Horizon variables (segments or gradient mode)
  - Gradient overrides (name, story, timeline, qualities)
  - Font overrides (if specified)
  - Font size scaling (if size_scale_factor != 1.0)
```

**Contrast Validation (from PLAN-06d):**

10 text/background pairs validated at WCAG AA level:
- P1: brand-primary on page-bg (3.0:1 for large text)
- P2: text-primary on page-bg (4.5:1)
- P3: text-secondary on page-bg (4.5:1)
- P4: text-muted on page-bg (4.5:1)
- P5: text-inverse on brand-primary (4.5:1)
- P6: nav-active-text on nav-active-bg (4.5:1)
- P7: brand-primary on sidebar-bg (3.0:1)
- P8: text-inverse on footer-bg (4.5:1)
- P9: text-primary on card-bg (4.5:1)
- P10: brand-primary on canvas-bg (3.0:1)

**Contrast modes**: `warn` (log only) or `auto-fix` (adjust lightness, deploy with fixed colors).

**Error/Fallback:**

| Condition | Behavior |
|-----------|----------|
| No preset file for brand_id | Use `_default.preset.json`. |
| Preset fails schema validation | ABORT. List invalid fields. |
| Contrast pair fails WCAG AA | `auto-fix` mode: adjust text color lightness. `warn` mode: log and proceed. |
| Contrast impossible to achieve | Fall back to Sync teal (#0E9E8E) for that pair. Manual review flag. |
| Custom font URL unreachable | Fall back to default font stack. |

---

### STAGE 8: Portfolio Deploy (Final HTML Assembly)

| Property | Value |
|----------|-------|
| **Workflow** | `portfolio-deploy` |
| **Step** | `step-port-03-deploy` (MODIFY) |
| **Executing Agent** | lr-tracker (Navi) |
| **Dependencies** | ALL prior stages must complete. All validation gates PASS. |

**Input Data Format (ALL artifacts consumed):**

| File | Source Stage | Injection Target |
|------|-------------|-----------------|
| `slides_content.json` | Stage 5 | `<!-- SLOT:SLIDES_DATA -->` |
| `slides_deck.html` | Stage 5 | `<!-- SLOT:SLIDES_DECK -->` |
| `portfolio_content.json` | Stage 6 | `<!-- SLOT:PORTFOLIO_DATA -->` |
| `life_journey.html` | Stage 6 | `<!-- SLOT:LIFE_JOURNEY -->` |
| `selected_style.json` | Stage 5 | `<!-- SLOT:STYLE_TOKENS -->` |
| `cover_letter_payload.json` | Stage 4 | `data-field` attribute injection |
| Generated CSS block | Stage 7 | `<!-- BRAND_PRESET_INJECTION_POINT -->` |
| `company_brief.yaml` | Stage 2 | `--lr-target-company-name` CSS variable |
| `{brand_id}.preset.json` | Stage 7 | `data-brand` HTML attribute |

**Output Data Format:**

| File | Format | Location | Description |
|------|--------|----------|-------------|
| `dist/index.html` | HTML | `portfolio-deploy/dist/` | Fully assembled portfolio page |
| `dist/slides.html` | HTML | `portfolio-deploy/dist/` | Standalone slide deck (copy of slides_deck.html) |
| `dist/assets/style.css` | CSS | `portfolio-deploy/dist/assets/` | Compiled from Sync tokens + brand preset |
| `dist/assets/thumbnails/` | Images | `portfolio-deploy/dist/assets/` | Project card images |

**Cover Letter Injection (data-field mapping):**

| `data-field` | Source JSON Path | HTML Element |
|---|---|---|
| `candidate_name` | `meta.candidate_name` | `.name` |
| `target_role` | `meta.target_role` | `.role` |
| `letter_date` | `meta.date` (formatted) | `.lr-cv-date` |
| `addressee_name` | `meta.addressee.name` | `.lr-cv-addressee-name` |
| `addressee_title` | `meta.addressee.title` | `.lr-cv-addressee-title` |
| `addressee_company` | `meta.addressee.company` | `.lr-cv-addressee-company` |
| `salutation` | Computed from addressee | `.lr-cv-salutation` |
| `letter_hook` | `letter.hook` | `.lr-cv-hook` |
| `letter_bridge` | `letter.why_me` | `.lr-cv-bridge` |
| `letter_value_prop` | `letter.why_them` | `.lr-cv-value-prop` |
| `letter_closing` | `letter.closing` | `.lr-cv-closing` |
| `sign_off` | `signature.sign_off` | `.lr-cv-sign-off` |
| `signer_name` | `signature.name` | `.lr-cv-signer-name` |
| `portfolio_url` | `signature.portfolio_url` | `.lr-cv-portfolio-link a` |

**Deployment Actions:**

1. Assemble `dist/` directory structure.
2. Inject all artifacts into HTML template slots.
3. Set `<html data-brand="{brand_id}">`.
4. Replace Google Fonts `<link>` if preset specifies custom fonts.
5. Set `--lr-target-company-name` CSS variable from `company_brief.company_name`.
6. Git commit to `gh-pages` branch.
7. Report live URL to user.

**Error/Fallback:**

| Condition | Behavior |
|-----------|----------|
| Any validation gate FAIL | STOP. Do not deploy. Return to failing stage. |
| cover_letter_payload.json missing | Deploy without cover letter view. Hide `#whygoogle-view` nav item. |
| slides_deck.html missing | Deploy without slides view. Hide `#slides-view` nav item. |
| Git push fails | Retry once. If still fails, save `dist/` locally and report error. |
| gh-pages branch missing | Create branch automatically. |

---

## 4. File Artifact Registry

Every file created or modified in the Release 3 pipeline, with its complete lifecycle.

### 4.1 Shared Data Files

| # | File | Format | Location | Producer | Producer Step | Consumer(s) | Lifecycle |
|---|------|--------|----------|----------|-------------|-------------|-----------|
| 1 | `jd-profile.yaml` | YAML v1.0 | `_lr/sync/shared-data/` | jd-optimize | step-06b | outbound-campaign (steps 01, out-02, out-03), portfolio-deploy (step-port-01) | Overwritten per JD run. User-confirmed overwrite if existing. |
| 2 | `company_brief.yaml` | YAML v1.0 | `_lr/sync/shared-data/` | jd-optimize | step-06b | outbound-campaign (steps 01, out-02, out-03), portfolio-deploy (step-port-01b, port-03), jd-optimize (step-34) | Overwritten per JD run. User-confirmed overwrite if existing. |
| 3 | `active-signals.json` | JSON v1.0 | `_lr/sync/shared-data/` | signal-capture | step-02-extract | portfolio-deploy (step-port-01) | Updated when signals change. Future use. |

### 4.2 jd-optimize Artifacts

| # | File | Format | Location | Producer Step | Consumer(s) | Lifecycle |
|---|------|--------|----------|-------------|-------------|-----------|
| 4 | `jd_signals_extracted.json` | JSON | `jd-optimize/artifacts/` | step-16 | outbound-campaign (steps out-02, out-02b, out-03) | Per-JD run. Overwritten. |
| 5 | `theme-override.css` | CSS | `jd-optimize/artifacts/` | step-34 | step-35 (same workflow) | Per-JD run. Internal to jd-optimize. |
| 6 | `jd-{uuid}-draft.html` | HTML | `jd-optimize/artifacts/` | step-35 | step-36 (validation), user download | Per-JD run. UUID from jd_profile.id. |
| 7 | `style-validation-report.json` | JSON | `jd-optimize/artifacts/` | step-36 | User review, lr-tracker logging | Per-JD run. |
| 8 | `optimized-jd.md` | Markdown | `jd-optimize/artifacts/` | step-06 | Reference only | Per-JD run. |

### 4.3 outbound-campaign Artifacts

| # | File | Format | Location | Producer Step | Consumer(s) | Lifecycle |
|---|------|--------|----------|-------------|-------------|-----------|
| 9 | `recruiter_profile.json` | JSON | `outbound-campaign/artifacts/` | step-out-01 | step-out-02, step-out-03 | Per campaign run. |
| 10 | `outreach_strategy.json` | JSON | `outbound-campaign/artifacts/` | step-out-02 | step-out-03, step-out-03b, step-out-03c | Per campaign run. |
| 11 | `cover_letter.md` | Markdown | `outbound-campaign/artifacts/` | step-out-03 | step-out-03b (variant base), user review | Per campaign run. |
| 12 | `cover_letter_payload.json` | JSON | `outbound-campaign/artifacts/` | step-out-03 | portfolio-deploy (step-port-03) for HTML injection | Per campaign run. Key cross-workflow artifact. |
| 13 | `cover_letter_variants.json` | JSON | `outbound-campaign/artifacts/` | step-out-03b | step-out-03c (user selection) | Per campaign run. |
| 14 | `cover_letter_final.md` | Markdown | `outbound-campaign/artifacts/` | step-out-03c | Final deliverable, user export | Per campaign run. |
| 15 | `cover_letter_validation.json` | JSON | `outbound-campaign/artifacts/` | step-out-03c | Quality gate, lr-tracker logging | Per campaign run. |

### 4.4 portfolio-deploy Artifacts

| # | File | Format | Location | Producer Step | Consumer(s) | Lifecycle |
|---|------|--------|----------|-------------|-------------|-----------|
| 16 | `slides_content.json` | JSON | `portfolio-deploy/artifacts/` | step-port-01 | step-port-01c, step-port-03, outbound-campaign (step-out-03 cross-ref) | Per deploy run. |
| 17 | `selected_style.json` | JSON | `portfolio-deploy/artifacts/` | step-port-01b | step-port-01c, step-port-03 | Per deploy run. |
| 18 | `slides_deck.html` | HTML | `portfolio-deploy/artifacts/` | step-port-01c | step-port-02c (validation), step-port-03 (injection) | Per deploy run. Self-contained. |
| 19 | `portfolio_content.json` | JSON | `portfolio-deploy/artifacts/` | step-port-02 | step-port-02b, step-port-02c, step-port-03 | Per deploy run. |
| 20 | `life_journey.html` | HTML | `portfolio-deploy/artifacts/` | step-port-02b | step-port-02c (validation), step-port-03 (injection) | Per deploy run. |
| 21 | `portfolio_validation.json` | JSON | `portfolio-deploy/artifacts/` | step-port-02c | Quality gate, lr-tracker logging | Per deploy run. |
| 22 | `contrast-report.json` | JSON | `portfolio-deploy/artifacts/` | step-port-03 (CSS gen) | User review, accessibility audit | Per deploy run. |

### 4.5 Static/Template Files (Not Overwritten Per Run)

| # | File | Format | Location | Purpose |
|---|------|--------|----------|---------|
| 23 | `modern-minimal.html` | HTML | `jd-optimize/templates/resume-templates/` | FAANG/enterprise resume template |
| 24 | `modern-clean.html` | HTML | `jd-optimize/templates/resume-templates/` | Scale-up/startup resume template |
| 25 | `modern-visual.html` | HTML | `jd-optimize/templates/resume-templates/` | Creative/design-led resume template |
| 26 | `cover_letter.template.md` | Markdown | `outbound-campaign/templates/` | Cover letter output template |
| 27 | `abyssal-depth.preset.css` | CSS | `portfolio-deploy/data/` | Sync ocean design tokens |
| 28 | `portfolio-content.schema.json` | JSON Schema | `portfolio-deploy/data/` | Validation schema for portfolio_content.json |
| 29 | `projects-source.yaml` | YAML | `portfolio-deploy/data/` | Empty template for user project data |
| 30 | `_default.preset.json` | JSON v1.0 | `portfolio-deploy/data/presets/` | Default brand preset (no company) |
| 31 | `google.preset.json` | JSON v1.0 | `portfolio-deploy/data/presets/` | Google brand preset example |
| 32 | `amazon.preset.json` | JSON v1.0 | `portfolio-deploy/data/presets/` | Amazon brand preset example |
| 33 | `microsoft.preset.json` | JSON v1.0 | `portfolio-deploy/data/presets/` | Microsoft brand preset example |
| 34 | `spotify.preset.json` | JSON v1.0 | `portfolio-deploy/data/presets/` | Spotify brand preset example |
| 35 | `sync.preset.json` | JSON v1.0 | `portfolio-deploy/data/presets/` | Sync internal brand preset |
| 36 | `brand-preset.v1.schema.json` | JSON Schema | `portfolio-deploy/data/presets/_schema/` | Validation schema for preset files |

### 4.6 Deployment Outputs

| # | File | Format | Location | Purpose |
|---|------|--------|----------|---------|
| 37 | `index.html` | HTML | `portfolio-deploy/dist/` | Assembled portfolio page (committed to gh-pages) |
| 38 | `slides.html` | HTML | `portfolio-deploy/dist/` | Standalone slide deck |
| 39 | `style.css` | CSS | `portfolio-deploy/dist/assets/` | Compiled stylesheet |
| 40 | `thumbnails/*` | Images | `portfolio-deploy/dist/assets/thumbnails/` | Project card images |

---

## 5. Cross-Workflow Data Handoff Specification

### 5.1 Handoff H-01: jd-optimize --> outbound-campaign

| Property | Value |
|----------|-------|
| **Trigger** | jd-optimize `step-06b` completes |
| **Mechanism** | File write to `_lr/sync/shared-data/` |
| **Files Transferred** | `jd-profile.yaml`, `company_brief.yaml` |
| **Format** | YAML v1.0 with schema version header |
| **Validation** | Consumer (outbound-campaign step-01) validates required fields exist |

**Required Fields Validation (outbound-campaign step-01):**

```
jd_profile.company         --> non-empty string (REQUIRED)
jd_profile.role_title      --> non-empty string (REQUIRED)
jd_profile.requirements.hard  --> array with >= 1 entry (REQUIRED)
jd_profile.persona_fit_primary --> non-empty string (REQUIRED)
```

If validation fails: STOP. Instruct user to run jd-optimize first.

### 5.2 Handoff H-02: jd-optimize --> portfolio-deploy

| Property | Value |
|----------|-------|
| **Trigger** | jd-optimize `step-06b` completes |
| **Mechanism** | File write to `_lr/sync/shared-data/` |
| **Files Transferred** | `company_brief.yaml` (optional consumption) |
| **Format** | YAML v1.0 with schema version header |
| **Validation** | Consumer reads optionally; missing file triggers default behavior |

### 5.3 Handoff H-03: outbound-campaign --> portfolio-deploy

| Property | Value |
|----------|-------|
| **Trigger** | outbound-campaign `step-out-03c` completes |
| **Mechanism** | portfolio-deploy step-port-03 reads from outbound-campaign artifacts directory |
| **Files Transferred** | `cover_letter_payload.json` |
| **Format** | JSON conforming to `LinkrightCoverLetterPayload` schema |
| **Validation** | step-port-03 validates JSON structure before injection |

**Read path**: `outbound-campaign/artifacts/cover_letter_payload.json`

### 5.4 Handoff H-04: portfolio-deploy internal (slides --> cover letter cross-reference)

| Property | Value |
|----------|-------|
| **Trigger** | step-port-01 completes |
| **Mechanism** | outbound-campaign step-out-03 reads slides_content.json for Bridge signal consistency |
| **Files Transferred** | `slides_content.json` (read by outbound-campaign) |
| **Format** | JSON conforming to `LinkrightSlidesContentPayload` schema |
| **Validation** | Bridge signal ID in cover letter matches slides[0].signal_id |

**Note**: This handoff creates a bidirectional dependency between outbound-campaign and portfolio-deploy. Resolution: slides compilation in portfolio-deploy (step-port-01) runs first; cover letter generation (step-out-03) reads the slides artifact. If slides are not yet generated, cover letter defers cross-reference validation.

### 5.5 Handoff Summary Table

| # | From Workflow | To Workflow | File(s) | Via | Optional? |
|---|--------------|------------|---------|-----|-----------|
| H-01 | jd-optimize | outbound-campaign | `jd-profile.yaml` | `shared-data/` | No (required) |
| H-02 | jd-optimize | outbound-campaign | `company_brief.yaml` | `shared-data/` | Yes |
| H-03 | jd-optimize | portfolio-deploy | `company_brief.yaml` | `shared-data/` | Yes |
| H-04 | jd-optimize | jd-optimize (internal) | `company_brief.yaml` | `shared-data/` | Yes (step-34) |
| H-05 | outbound-campaign | portfolio-deploy | `cover_letter_payload.json` | `artifacts/` direct read | Yes (deploy without cover letter) |
| H-06 | portfolio-deploy | outbound-campaign | `slides_content.json` | `artifacts/` direct read | Yes (defer cross-ref) |

### 5.6 File Header Convention

All cross-workflow files MUST include a header comment declaring provenance:

```yaml
# Producer: {workflow_name} ({step_file_name})
# Generated: {ISO 8601 timestamp}
# Schema version: {version}
```

For JSON files, include equivalent metadata in a top-level `_meta` field:

```json
{
  "_meta": {
    "producer": "outbound-campaign/step-out-03",
    "generated_at": "2026-03-07T14:30:00Z",
    "schema_version": "1.0"
  }
}
```

---

## 6. Data Validation Checkpoints

Three mandatory validation gates exist in the pipeline. Deployment MUST NOT proceed if any gate is FAIL.

### 6.1 Gate 1: Resume Style Validation (Stage 3)

**Location**: jd-optimize, step-36-style-validation
**Agent**: sync-styler (Cora)
**Output**: `style-validation-report.json`

| # | Check ID | Check | Threshold | Required? |
|---|----------|-------|-----------|-----------|
| 1 | RS-1 | Sections populated | All 5 slots filled (no empty `<!-- SLOT:* -->` markers) | Yes |
| 2 | RS-2 | Accent color applied | `--accent-color` CSS variable set in `.resume-header .name` | Yes |
| 3 | RS-3 | Forbidden overrides | No `color:` rules on `body/p/li` except `#1a1a1a` | Yes |
| 4 | RS-4 | Print CSS present | `@media print` block found in `<style>` | Yes |
| 5 | RS-5 | One-page estimate | Estimated lines <= 58 | Warn only |
| 6 | RS-6 | Contrast ratio | Accent vs. white >= 4.5:1 | Yes |

**On FAIL**: Present failing checks to user. Propose fix. Ask "Fix and re-validate, or proceed with warnings?"

### 6.2 Gate 2: Cover Letter Validation (Stage 4)

**Location**: outbound-campaign, step-out-03c-cover-letter-validation
**Agent**: sync-publicist (Lyric)
**Output**: `cover_letter_validation.json`

| # | Check ID | Check | Threshold | Required? |
|---|----------|-------|-----------|-----------|
| 1 | CL-1 | Word count | 300 <= count <= 400 | Yes |
| 2 | CL-2 | XYZ metric presence | >= 1 quantitative metric in paragraph 2 | Yes |
| 3 | CL-3 | Bridge reference | `the_bridge.title` substring found in text | Yes |
| 4 | CL-4 | Company name mentions | `jd_profile.company` appears >= 2 times | Yes |
| 5 | CL-5 | Tone consistency | Each paragraph's tone matches `selected_tone` | Warn only |
| 6 | CL-6 | Generic phrase absence | 0 matches from forbidden list | Yes |
| 7 | CL-7 | Caution topics absence | 0 matches from `company_brief.cautions[]` | Yes |

**On FAIL**: Auto-fix if possible (word count adjustment, phrase replacement). If not fixable, return to step-out-03.

### 6.3 Gate 3: Portfolio Validation (Stage 6)

**Location**: portfolio-deploy, step-port-02c-portfolio-validation
**Agent**: sync-styler (Cora)
**Output**: `portfolio_validation.json`

| # | Check ID | Check | Threshold | Required? |
|---|----------|-------|-----------|-----------|
| 1 | PF-1 | Project card count | >= 3 | Yes |
| 2 | PF-2 | Hobby card count | >= 1 | Yes |
| 3 | PF-3 | Timeline entry count | >= 3 | Yes |
| 4 | PF-4 | Timeline type diversity | >= 2 distinct types | Yes |
| 5 | PF-5 | External links valid | All match URL pattern | Yes |
| 6 | PF-6 | Slides deck exists | File size > 0 | Yes |
| 7 | PF-7 | Slides self-contained | No external `<link>` or `<script src>` | Yes |
| 8 | PF-8 | Life journey HTML exists | File size > 0 | Yes |

**On FAIL**: Provide specific remediation instruction per failing check. Return to relevant step.

### 6.4 Validation Gate Flow Diagram

```
Stage 3                    Stage 4                    Stage 6
(jd-optimize)              (outbound-campaign)        (portfolio-deploy)
     |                          |                          |
     v                          v                          v
+-----------+             +-----------+             +-----------+
| GATE 1:   |             | GATE 2:   |             | GATE 3:   |
| Resume    |             | Cover     |             | Portfolio |
| Style     |             | Letter    |             | Content   |
| 6 checks  |             | 7 checks  |             | 8 checks  |
+-----------+             +-----------+             +-----------+
     |                          |                          |
  PASS?                      PASS?                      PASS?
   / \                        / \                        / \
  Y   N                      Y   N                      Y   N
  |   |                      |   |                      |   |
  v   v                      v   v                      v   v
 OK  Fix                    OK  Fix                    OK  Fix
  |  & retry                 |  & retry                 |  & retry
  |                          |                          |
  +----------+---------------+----------+---------------+
             |                          |
             v                          v
        Stage 7 (Brand Adapt)     Stage 8 (Deploy)
             |                          |
             v                          v
        Contrast                  Final Assembly
        Validation                & gh-pages push
        (informational)                 |
                                        v
                                   Live URL
```

---

## 7. Complete JSON/YAML File Index

### 7.1 All Data Files in the Pipeline

| # | File Name | Format | Schema | Producer | Consumer(s) | Stage |
|---|-----------|--------|--------|----------|-------------|-------|
| 1 | `jd-raw.md` | MD | N/A | User | jd-optimize (step-01) | Input |
| 2 | `signals-*.yaml` | YAML | N/A | User (pre-existing) | jd-optimize | Input |
| 3 | `lr-config.yaml` | YAML | N/A | System | All workflows | Config |
| 4 | `jd-profile.yaml` | YAML | `jd_profile` v1.0 | jd-optimize (step-06b) | outbound-campaign, portfolio-deploy | 2 |
| 5 | `company_brief.yaml` | YAML | `company_brief` v1.0 | jd-optimize (step-06b) | outbound-campaign, portfolio-deploy, jd-optimize (step-34) | 2 |
| 6 | `jd_signals_extracted.json` | JSON | `LinkrightJDSignalsExtracted` | jd-optimize (step-16) | outbound-campaign (steps 02, 02b, 03) | 1 |
| 7 | `theme-override.css` | CSS | N/A | jd-optimize (step-34) | jd-optimize (step-35) | 3 |
| 8 | `jd-{uuid}-draft.html` | HTML | Template-based | jd-optimize (step-35) | jd-optimize (step-36), user | 3 |
| 9 | `style-validation-report.json` | JSON | Validation report | jd-optimize (step-36) | User, lr-tracker | 3 |
| 10 | `recruiter_profile.json` | JSON | Agent-defined | outbound-campaign (step-out-01) | outbound-campaign (steps out-02, out-03) | 4 |
| 11 | `outreach_strategy.json` | JSON | Strategy schema | outbound-campaign (step-out-02) | outbound-campaign (steps out-03, out-03b, out-03c) | 4 |
| 12 | `cover_letter.md` | MD | Template | outbound-campaign (step-out-03) | outbound-campaign (step-out-03b), user | 4 |
| 13 | `cover_letter_payload.json` | JSON | `LinkrightCoverLetterPayload` | outbound-campaign (step-out-03) | portfolio-deploy (step-port-03) | 4 |
| 14 | `cover_letter_variants.json` | JSON | Variants array | outbound-campaign (step-out-03b) | outbound-campaign (step-out-03c) | 4 |
| 15 | `cover_letter_final.md` | MD | Template | outbound-campaign (step-out-03c) | User deliverable | 4 |
| 16 | `cover_letter_validation.json` | JSON | Validation report | outbound-campaign (step-out-03c) | Quality gate, lr-tracker | 4 |
| 17 | `slides_content.json` | JSON | `LinkrightSlidesContentPayload` | portfolio-deploy (step-port-01) | portfolio-deploy (steps port-01c, port-03), outbound-campaign (step-out-03) | 5 |
| 18 | `selected_style.json` | JSON | Style config | portfolio-deploy (step-port-01b) | portfolio-deploy (steps port-01c, port-03) | 5 |
| 19 | `slides_deck.html` | HTML | Self-contained | portfolio-deploy (step-port-01c) | portfolio-deploy (steps port-02c, port-03) | 5 |
| 20 | `portfolio_content.json` | JSON | Portfolio schema | portfolio-deploy (step-port-02) | portfolio-deploy (steps port-02b, port-02c, port-03) | 6 |
| 21 | `life_journey.html` | HTML | Self-contained | portfolio-deploy (step-port-02b) | portfolio-deploy (steps port-02c, port-03) | 6 |
| 22 | `portfolio_validation.json` | JSON | Validation report | portfolio-deploy (step-port-02c) | Quality gate, lr-tracker | 6 |
| 23 | `{brand_id}.preset.json` | JSON | `LinkrightBrandPreset` v1.0 | Static (pre-authored) | portfolio-deploy (step-port-03) | 7 |
| 24 | `contrast-report.json` | JSON | Contrast report | portfolio-deploy (step-port-03) | User, accessibility audit | 7 |
| 25 | `dist/index.html` | HTML | Final assembly | portfolio-deploy (step-port-03) | gh-pages, end user | 8 |
| 26 | `dist/slides.html` | HTML | Standalone deck | portfolio-deploy (step-port-03) | gh-pages, end user | 8 |
| 27 | `projects-source.yaml` | YAML | Projects schema | User-provided | portfolio-deploy (step-port-02) | Input |

---

## 8. Error and Fallback Behavior Matrix

### 8.1 Upstream Data Missing -- Cascading Fallback Rules

| Missing Data | Affected Stage(s) | Fallback Behavior | Pipeline Can Continue? |
|-------------|-------------------|-------------------|----------------------|
| `jd-raw.md` | ALL | Pipeline cannot start. Instruct user to provide JD. | NO |
| `jd-profile.yaml` (in shared-data) | 3, 4, 5 | Outbound-campaign: STOP, require jd-optimize. Portfolio-deploy: proceed without JD targeting (role-general mode). | Partial |
| `company_brief.yaml` | 3, 4, 5, 7 | Resume: Sync teal accent, modern-minimal template. Cover letter: formal tone, no brand_values. Slides: coral accent, no overlay. Deploy: default preset. | YES (degraded) |
| `company_brief.brand.color_primary` = null | 3, 5, 7 | Resume: `#0E9E8E`. Slides: `#D9705A`. Portfolio: `_default.preset.json`. | YES |
| `company_brief.tone_descriptor` missing | 4 | Default to "formal". | YES |
| `recruiter_profile.json` | 4 | Omit addressee block. Salutation: "Dear Hiring Manager,". Hook uses company-only research. | YES (degraded) |
| `slides_content.json` | 4, 8 | Cover letter: defer Bridge cross-reference. Deploy: hide slides view nav item. | YES (degraded) |
| `cover_letter_payload.json` | 8 | Deploy without cover letter view. Hide `#whygoogle-view` nav item. | YES (degraded) |
| `portfolio_content.json` | 8 | Deploy without Beyond Papers content. Hide `#whoami-view` nav item. | YES (degraded) |
| `life_journey.html` | 8 | Deploy without timeline. Portfolio validation fails PF-8 (must fix). | NO (until fixed) |
| `{brand_id}.preset.json` | 7 | Use `_default.preset.json`. | YES |
| MongoDB `lr-signals` empty | 1, 5 | JD-optimize: `signal_count: 0`. Slides: cannot compile. | Partial (no slides) |
| Career signals < 5 | 5 | Reduce slide count to available (minimum 3). Flag in metadata. | YES (degraded) |
| Career signals < 3 | 5 | Cannot generate slides. Skip slides entirely. | YES (no slides) |

### 8.2 Validation Failure Recovery Paths

| Gate | Failure | Recovery Path |
|------|---------|---------------|
| Gate 1 (Resume Style) | RS-1: Empty slot | Return to step-35, verify content sections from steps 27-33 |
| Gate 1 (Resume Style) | RS-6: Contrast fail | Darken accent by 10% increments. Max 3 attempts, then Sync teal fallback |
| Gate 2 (Cover Letter) | CL-1: Word count out of range | Auto-expand "Why Them" (if <300) or compress "Why Me" (if >400) |
| Gate 2 (Cover Letter) | CL-6: Generic phrase found | Auto-replace with synonyms. Re-validate. |
| Gate 2 (Cover Letter) | CL-7: Caution topic found | Flag for user. Return to step-out-03 for manual edit. |
| Gate 3 (Portfolio) | PF-1: < 3 projects | Prompt user to add more projects. Return to step-port-02. |
| Gate 3 (Portfolio) | PF-7: External deps in slides | Re-render slides with self-containment verification. Return to step-port-01c. |

---

## 9. Data Lifecycle and Cleanup

### 9.1 Artifact Retention Policy

| Category | Retention | Cleanup Trigger |
|----------|-----------|-----------------|
| `_lr/sync/shared-data/*` | Persistent until next JD run | User confirms overwrite in step-06b |
| `*/artifacts/*` (all workflows) | Persistent per session | Manual cleanup or next workflow run |
| `*/dist/*` | Persistent (deployed content) | Next deployment overwrites |
| `*/data/presets/*` | Permanent (static files) | Manual curation only |
| `*/templates/*` | Permanent (static files) | Version updates only |

### 9.2 File Dependency Graph (Deletion Safety)

Deleting a file without checking its consumers can break the pipeline. The following table shows which files are safe to delete independently and which have cascading effects.

| File | Safe to Delete? | Cascading Effect |
|------|----------------|-----------------|
| `jd-profile.yaml` (shared-data) | NO | Breaks outbound-campaign, portfolio-deploy targeting |
| `company_brief.yaml` (shared-data) | YES (with degradation) | Triggers fallback to defaults in stages 3, 4, 5, 7 |
| `slides_content.json` | YES (with degradation) | No slides view in portfolio. Cover letter loses cross-ref. |
| `cover_letter_payload.json` | YES (with degradation) | No cover letter view in portfolio |
| `slides_deck.html` | NO (if deploying) | Portfolio validation PF-6 fails |
| `portfolio_content.json` | NO (if deploying) | Portfolio validation fails, no Beyond Papers content |
| `{brand_id}.preset.json` | YES | Falls back to `_default.preset.json` |
| Validation report JSONs | YES | Informational only, no downstream consumers |

---

## 10. Implementation Checklist

### 10.1 Infrastructure Setup (Prerequisites)

- [ ] Create `_lr/sync/shared-data/` directory
- [ ] Create `portfolio-deploy/data/presets/` directory with `_schema/` subdirectory
- [ ] Create `jd-optimize/templates/resume-templates/` directory
- [ ] Create resume template files: `modern-minimal.html`, `modern-clean.html`, `modern-visual.html` (with 6 slot markers each)
- [ ] Create `_default.preset.json` and example presets (google, amazon, microsoft, spotify, sync)
- [ ] Create `brand-preset.v1.schema.json` schema file
- [ ] Create `portfolio-content.schema.json` schema file
- [ ] Create `cover_letter.template.md` template file
- [ ] Create `abyssal-depth.preset.css` with Sync design tokens
- [ ] Create `projects-source.yaml` empty template

### 10.2 Implementation Order (Dependency-Sorted)

| Phase | Order | Enhancement | Action | Files |
|-------|-------|-------------|--------|-------|
| **1** | 1 | Theming | Rewrite step-34 (style theming) | `jd-optimize/steps-c/step-34-style-theming.md` |
| **1** | 2 | Theming | Rewrite step-35 (style compile) | `jd-optimize/steps-c/step-35-style-compile.md` |
| **1** | 3 | Theming | Rewrite step-36 (style validation) | `jd-optimize/steps-c/step-36-style-validation.md` |
| **2** | 4 | Data Export | Create step-06b (export data contract) | `jd-optimize/steps-c/step-06b-export-data-contract.md` |
| **2** | 5 | Data Export | Update jd-optimize workflow.yaml (output_contracts) | `jd-optimize/workflow.yaml` |
| **3** | 6 | Cover Letter | Modify step-01 (load session context) | `outbound-campaign/steps-c/step-01-load-session-context.md` |
| **3** | 7 | Cover Letter | Modify step-out-01 (ingest) | `outbound-campaign/steps-c/step-out-01-ingest.md` |
| **3** | 8 | Cover Letter | Modify step-out-02 (strategy) | `outbound-campaign/steps-c/step-out-02-strategy.md` |
| **3** | 9 | Cover Letter | Rewrite step-out-03 (cover letter) | `outbound-campaign/steps-c/step-out-03-cover-letter.md` |
| **3** | 10 | Cover Letter | Create step-out-03b (variants) | `outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md` |
| **3** | 11 | Cover Letter | Create step-out-03c (validation) | `outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md` |
| **3** | 12 | Cover Letter | Modify step-01-validate | `outbound-campaign/steps-v/step-01-validate.md` |
| **3** | 13 | Cover Letter | Update outbound-campaign workflow.yaml, checklist.md, instructions.md | 3 files |
| **4a** | 14 | Slides | Modify step-port-01 (compile) | `portfolio-deploy/steps-c/step-port-01-compile.md` |
| **4a** | 15 | Slides | Create step-port-01b (style selection) | `portfolio-deploy/steps-c/step-port-01b-style-selection.md` |
| **4a** | 16 | Slides | Create step-port-01c (render HTML) | `portfolio-deploy/steps-c/step-port-01c-render-slides-html.md` |
| **4b** | 17 | Beyond Papers | Rewrite step-port-02 (beyond the papers) | `portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` |
| **4b** | 18 | Beyond Papers | Create step-port-02b (life narrative) | `portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md` |
| **4b** | 19 | Beyond Papers | Create step-port-02c (portfolio validation) | `portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md` |
| **5** | 20 | Deploy | Modify step-port-03 (deploy) | `portfolio-deploy/steps-c/step-port-03-deploy.md` |
| **5** | 21 | Deploy | Update portfolio-deploy workflow.yaml, checklist.md, instructions.md | 3 files |

### 10.3 Sidecar Memory Updates (Post-Implementation)

| Agent | File | Additions |
|-------|------|-----------|
| sync-publicist | `instructions.md` | Cover Letter Protocol, Variant Protocol, Word Count Guardrail |
| sync-publicist | `memories.md` | Tone mapping patterns (formal/conversational/technical/vision-driven) |
| sync-styler | `instructions.md` | Slide Compilation Protocol, Slide Rendering Protocol, Brand Injection Protocol, Dual-Layer Theming Protocol |
| sync-styler | `memories.md` | Abyssal Depth preset definition, Template Selection Matrix |
| sync-scout | `instructions.md` | Brand Research Protocol (color + tone extraction) |
| sync-linker | `memories.md` | Bridge Selection refinement criteria |

---

*Document generated: 2026-03-07*
*Pipeline specification: 8 stages, 27 data artifacts, 3 validation gates, 10 agents*
*Total files in pipeline: 40 (27 runtime artifacts + 13 static/template files)*
*Next steps: Begin Phase 1 implementation (Theming -- steps 34/35/36 rewrite)*
