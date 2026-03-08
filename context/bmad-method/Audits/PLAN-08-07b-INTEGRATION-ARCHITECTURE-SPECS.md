# PLAN-08a / PLAN-08c / PLAN-07b: Integration Architecture Specifications

**Date**: 2026-03-07
**Scope**: Release 3 Enhancement Integration Architecture for Linkright v4.0
**Related Beads**: `sync-rrd3` (PLAN-07b), `sync-x1si` (PLAN-07a, CLOSED), `sync-7n7q` (PLAN-08)
**Source Files Analyzed**:
- `linkright/LR-MASTER-ORCHESTRATION.md` (2900+ lines)
- `linkright/_lr/sync/workflows/jd-optimize/workflow.yaml` + 40 step files
- `linkright/_lr/sync/workflows/outbound-campaign/workflow.yaml` + 11 step files
- `linkright/_lr/sync/workflows/portfolio-deploy/workflow.yaml` + 8 step files
- `linkright/_lr/agent-manifest.csv` (31 agents)
- `linkright/_lr/workflow-manifest.csv` (28 workflows)
- `linkright/_lr/_config/ides/*.yaml` (20 configs)
- `linkright/.lr-commands/` (35 IDE directories)
- `linkright/_lr/_config/manifest.yaml` (34 IDE entries)
- `context/bmad-method/_bmad/_config/manifest.yaml` (19 IDE entries)
- `context/PLAN-03-04-SLIDES-PUBLICIST-AUDIT.md` (full gap analysis)
- `context/Release_3.md` (52 audit findings)
- All 10 sync agent files, 2 core agent files

---

## TABLE OF CONTENTS

1. [PLAN-08a: Workflow Modifications Map](#plan-08a-workflow-modifications-map)
2. [PLAN-08c: Agent Responsibility Matrix](#plan-08c-agent-responsibility-matrix)
3. [PLAN-07b: BMAD-Linkright IDE Decision Matrix](#plan-07b-bmad-linkright-ide-decision-matrix)

---

# PLAN-08a: Workflow Modifications Map

## Enhancement Overview

The four Release 3 enhancements and their primary workflow intersections:

| Enhancement | Primary Workflow | Secondary Workflow(s) | New Workflow Needed? |
|-------------|-----------------|----------------------|---------------------|
| **Cover Letter** | `outbound-campaign` | `jd-optimize` (data source) | No |
| **Slides** | `portfolio-deploy` | `jd-optimize` (signal source) | No |
| **Beyond the Papers** | `portfolio-deploy` | `signal-capture` (signal source) | No |
| **Theming** | `jd-optimize` | `portfolio-deploy`, `outbound-campaign` | No |

---

## Enhancement 1: Cover Letter

### Current State

The outbound-campaign workflow already contains `step-out-03-cover-letter.md` at:
`/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/outbound-campaign/steps-c/step-out-03-cover-letter.md`

Current step defines only 3 structural elements (Hook, Bridge, Synergy) and lacks:
- The 3-paragraph structure from master orchestration (Hook / Why Me / Why Them)
- A cover letter output template
- Explicit data contract from jd-optimize
- Company brief context integration

### Workflow: `outbound-campaign` -- Modifications Required

| Step File | Current Path | Modification Type | Details |
|-----------|-------------|-------------------|---------|
| `step-01-load-session-context.md` | `steps-c/` | **MODIFY** | Add loading of `company_brief.yaml` alongside `lr-config.yaml`. Add validation that `jd-profile.yaml` exists with required fields. |
| `step-out-01-ingest.md` | `steps-c/` | **MODIFY** | Add extraction of recruiter `tone_descriptor` and `company_stage` from ingest to feed into cover letter tone selection. |
| `step-out-02-strategy.md` | `steps-c/` | **MODIFY** | Add explicit output of `selected_tone` (Formal/Casual/Technical) to `outreach_strategy.json`. Add `company_brief` consumption for brand values. |
| `step-out-03-cover-letter.md` | `steps-c/` | **REWRITE** | Full rewrite to 3-paragraph structure: (1) "The Hook" with company/recruiter research reference, (2) "The Why Me?" with Bridge signal + XYZ metrics, (3) "The Why Them?" with internal motivations. Add 300-400 word constraint. Add tone injection from strategy step. |
| *NEW*: `step-out-03b-cover-letter-variants.md` | `steps-c/` | **CREATE** | Generate 2 tone variants (e.g., Technical + Conversational) for user selection. Pattern: same content, different voice. |
| *NEW*: `step-out-03c-cover-letter-validation.md` | `steps-c/` | **CREATE** | Automated validation: word count (300-400), signal presence check (at least 1 XYZ metric), tone consistency, no generic phrases. |
| `step-01-validate.md` | `steps-v/` | **MODIFY** | Add cover-letter-specific validation criteria: word count, signal density, Bridge reference, tone match. |

### New Input/Output Files

| File | Type | Location | Producer | Consumer |
|------|------|----------|----------|----------|
| `company_brief.yaml` | Input | `outbound-campaign/data/` | `jd-optimize` step-05 (via sync-scout) | `step-out-02-strategy.md`, `step-out-03-cover-letter.md` |
| `cover_letter.template.md` | Template | `outbound-campaign/templates/` | N/A (static) | `step-out-03-cover-letter.md` |
| `cover_letter_variants.json` | Output | `outbound-campaign/artifacts/` | `step-out-03b` | User selection |
| `cover_letter_final.md` | Output | `outbound-campaign/artifacts/` | `step-out-03c` | Final deliverable |

### Workflow: `jd-optimize` -- Modifications Required

| Step File | Current Path | Modification Type | Details |
|-----------|-------------|-------------------|---------|
| `step-06-final-output.md` | `steps-c/` | **MODIFY** | Add explicit export of `jd-profile.yaml` to a shared location (`_lr/sync/shared-data/`) or ensure artifact path is discoverable by outbound-campaign. |
| *NEW*: `step-06b-export-data-contract.md` | `steps-c/` | **CREATE** | Formal data handoff step that writes `jd-profile.yaml` and `company_brief.yaml` to the outbound-campaign `data/` directory. Closes GAP-02 from PLAN-04a audit. |

### Data Flow Dependencies

```
jd-optimize                          outbound-campaign
============                         ==================

step-03-keyword-extraction
    |
    v
step-04-competitive-moat
    |                                step-01-load-session-context
    v                                    |
step-05-adversarial-review               v
    |                                step-out-01-ingest
    v                                    |
step-06-final-output                     v
    |                                step-out-02-strategy
    +---> jd-profile.yaml --------+      |  (consumes jd-profile + company_brief)
    |                             |      v
    +---> company_brief.yaml -----+  step-out-03-cover-letter [REWRITE]
                                         |
                                         v
                                     step-out-03b-cover-letter-variants [NEW]
                                         |
                                         v
                                     step-out-03c-cover-letter-validation [NEW]
                                         |
                                         v
                                     step-out-04-in-mail (existing)
```

---

## Enhancement 2: Slides (Frontend Slides)

### Current State

The portfolio-deploy workflow contains `step-port-01-compile.md` at:
`/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01-compile.md`

Current step generates `slides_content.json` from MongoDB career signals in Problem/Process/Metric/Legacy format. The gap identified in PLAN-03 is that `zarazhangrui/frontend-slides` expects conversational input, not structured JSON.

### Workflow: `portfolio-deploy` -- Modifications Required

| Step File | Current Path | Modification Type | Details |
|-----------|-------------|-------------------|---------|
| `step-port-01-compile.md` | `steps-c/` | **MODIFY** | Add explicit `slides_content.json` schema validation. Add top-5 signal selection with cosine similarity scoring against Strategic Gravity. Add `role_alignment` and `impact_rank` fields to each slide object. |
| *NEW*: `step-port-01b-style-selection.md` | `steps-c/` | **CREATE** | Style constrain step. Load Sync design tokens from `SYNC-DESIGN-AND-TECHNICAL-SPECS.md`. Either (a) bypass frontend-slides Phase 2 with pre-defined "Abyssal Depth" preset, or (b) constrain selection to compatible presets. Output: `selected_style.json`. |
| *NEW*: `step-port-01c-render-slides-html.md` | `steps-c/` | **CREATE** | Invoke frontend-slides rendering pipeline with `slides_content.json` + `selected_style.json`. Generate self-contained HTML file with inline CSS/JS. Apply Sync ocean-themed design tokens. Output: `slides_deck.html`. |
| `step-port-02-beyond-the-papers.md` | `steps-c/` | **MODIFY** | Separate concern -- this step now only handles project cards and Life Journey. Remove any slide compilation that may overlap with step-01 series. Add explicit reference to `slides_deck.html` for injection point in portfolio template. |
| `step-port-03-deploy.md` | `steps-c/` | **MODIFY** | Add injection of `slides_deck.html` into the portfolio template alongside `portfolio_content.json`. Update commit message format. Add post-deploy URL verification. |

### New Input/Output Files

| File | Type | Location | Producer | Consumer |
|------|------|----------|----------|----------|
| `slides_content.json` | Output | `portfolio-deploy/artifacts/` | `step-port-01-compile.md` | `step-port-01c-render-slides-html.md` |
| `selected_style.json` | Output | `portfolio-deploy/artifacts/` | `step-port-01b-style-selection.md` | `step-port-01c-render-slides-html.md` |
| `slides_deck.html` | Output | `portfolio-deploy/artifacts/` | `step-port-01c-render-slides-html.md` | `step-port-03-deploy.md` |
| `abyssal-depth.preset.css` | Data | `portfolio-deploy/data/` | N/A (static, Sync design tokens) | `step-port-01c-render-slides-html.md` |

### `slides_content.json` Schema (Canonical)

```json
{
  "slides": [
    {
      "signal_id": "sig-[uuid]",
      "title": "[Project/Achievement Name]",
      "sections": {
        "the_problem": "What was broken?",
        "the_process": "How did you fix it?",
        "the_metric": "$5M revenue growth / 40% latency reduction",
        "the_legacy": "What remains now that you are gone?"
      },
      "role_alignment": "[Strategic Gravity tag]",
      "impact_rank": 1
    }
  ],
  "metadata": {
    "user_name": "[USER_NAME]",
    "target_role": "[TARGET_JOB_TITLE]",
    "generated_at": "[ISO timestamp]",
    "signal_count": 5,
    "top_gravity": "[Role Identity]"
  }
}
```

### Data Flow Dependencies

```
MongoDB (career_signals collection)
    |
    | cosine similarity (1536-dim, lr-signals)
    v
step-port-01-compile [MODIFY]
    |
    +--> slides_content.json
    |
    v
step-port-01b-style-selection [NEW]
    |
    +--> selected_style.json + abyssal-depth.preset.css
    |
    v
step-port-01c-render-slides-html [NEW]
    |
    +--> slides_deck.html (self-contained, zero dependencies)
    |
    v
step-port-02-beyond-the-papers [MODIFY]
    |
    +--> portfolio_content.json
    |
    v
step-port-03-deploy [MODIFY]
    |
    +--> injects slides_deck.html + portfolio_content.json --> gh-pages push
    |
    v
Live URL
```

---

## Enhancement 3: Beyond the Papers

### Current State

`step-port-02-beyond-the-papers.md` at:
`/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md`

Current step maps hobbies/projects to UI cards and includes a "Life Narrative" movie placeholder. Output is `portfolio_content.json`. The step is minimal (34 lines) and lacks structured data ingestion.

### Workflow: `portfolio-deploy` -- Modifications Required

| Step File | Current Path | Modification Type | Details |
|-----------|-------------|-------------------|---------|
| `step-port-02-beyond-the-papers.md` | `steps-c/` | **REWRITE** | Full rewrite with structured data ingestion. Add: (1) Project card schema with `title`, `description`, `thumbnail_url`, `external_link`, `tech_stack[]`, `impact_summary`. (2) Hobby/interest cards with `category`, `narrative_hook`. (3) "Life Journey" timeline entries with `year`, `milestone`, `type` (career/personal/education). |
| *NEW*: `step-port-02b-life-narrative-video.md` | `steps-c/` | **CREATE** | Placeholder step for future video integration. For now: generate a static "Life Journey" timeline visualization from timeline entries. Output: `life_journey.html` section. |
| *NEW*: `step-port-02c-portfolio-validation.md` | `steps-c/` | **CREATE** | Validate `portfolio_content.json` against schema: minimum 3 project cards, at least 1 hobby card, all URLs valid, thumbnail dimensions specified. |

### New Input/Output Files

| File | Type | Location | Producer | Consumer |
|------|------|----------|----------|----------|
| `portfolio_content.json` | Output | `portfolio-deploy/artifacts/` | `step-port-02-beyond-the-papers.md` | `step-port-03-deploy.md` |
| `life_journey.html` | Output | `portfolio-deploy/artifacts/` | `step-port-02b-life-narrative-video.md` | `step-port-03-deploy.md` |
| `portfolio-content.schema.json` | Data | `portfolio-deploy/data/` | N/A (static) | `step-port-02c-portfolio-validation.md` |
| `projects-source.yaml` | Input | `portfolio-deploy/data/` | User-provided | `step-port-02-beyond-the-papers.md` |

### `portfolio_content.json` Schema (Canonical)

```json
{
  "projects": [
    {
      "id": "proj-[uuid]",
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
      "type": "career"
    }
  ],
  "video_placeholder": {
    "enabled": false,
    "label": "Life Narrative - Coming Soon"
  }
}
```

---

## Enhancement 4: Theming (Company Brand Integration)

### Current State

The jd-optimize workflow has theming-related steps defined in the master orchestration:
- `step-19-inject-company-branding.md` (line 2361): Injects `brand_color_primary` as CSS accent
- `step-18-select-template.md` (line 2341): Template selection based on `company_stage` and `pm_culture`

In the implemented steps at `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/jd-optimize/steps-c/`:
- `step-34-style-theming.md` exists but is a **stub** (13 lines, generic placeholder)
- `step-35-style-compile.md` exists but is a **stub** (13 lines, generic placeholder)
- `step-36-style-validation.md` exists but is a **stub**

### Workflow: `jd-optimize` -- Modifications Required

| Step File | Current Path | Modification Type | Details |
|-----------|-------------|-------------------|---------|
| `step-34-style-theming.md` | `steps-c/` | **REWRITE** | Replace stub with full implementation from master orchestration step-18/step-19. (1) Load `company_brief.brand_color_primary` and `brand_color_secondary`. (2) Template selection logic: FAANG -> Modern-Minimal, product-led + scale-up -> Modern-Clean, creative industry -> Modern-Visual, default -> Modern-Minimal. (3) Accessibility check (contrast >= 4.5:1). (4) CSS variable injection: `--accent-color`. (5) Rules: no background fills, no bullet colors, monochrome body text. Output: `selected_template_path` + CSS overrides. |
| `step-35-style-compile.md` | `steps-c/` | **REWRITE** | Replace stub with full HTML/CSS assembly. Inject all content sections (header, summary, experience, skills). Apply typography variables (9.5pt font, 1.35 line-height, 0.5in margins). Add `@media print` CSS. Output: `jd-[uuid]-draft.html`. |
| `step-36-style-validation.md` | `steps-c/` | **REWRITE** | Replace stub with visual validation: all sections populated, accent color applied correctly, print rendering check, one-page constraint verification. |

### Workflow: `portfolio-deploy` -- Theming Propagation

| Step File | Modification Type | Details |
|-----------|-------------------|---------|
| `step-port-01b-style-selection.md` (NEW, from Slides) | **DESIGN** | Must consume the same `company_brief.brand_color_primary` that jd-optimize uses. When targeting a specific company, the portfolio slides should echo that company's brand accent alongside the Sync ocean theme. Dual-layer theming: Sync base + company accent overlay. |
| `step-port-03-deploy.md` | **MODIFY** | Inject company-specific accent into portfolio HTML if a target company is active. Fallback to Sync default teal (`#0E9E8E`). |

### Workflow: `outbound-campaign` -- Theming Propagation

| Step File | Modification Type | Details |
|-----------|-------------------|---------|
| `step-out-03-cover-letter.md` (REWRITE, from Cover Letter) | **DESIGN** | Cover letter tone should match company `tone_descriptor` from `company_brief.yaml`. Not visual theming, but tonal theming. Map: `formal` -> executive language, `conversational` -> personal tone, `technical` -> engineering-first language, `vision-driven` -> mission-oriented language. |

### New Input/Output Files for Theming

| File | Type | Location | Producer | Consumer |
|------|------|----------|----------|----------|
| `company_brief.yaml` | Shared Data | `_lr/sync/shared-data/` | `jd-optimize` (via sync-scout) | `jd-optimize` step-34, `outbound-campaign` step-02/03, `portfolio-deploy` step-01b |
| `resume-templates/modern-minimal.html` | Template | `jd-optimize/templates/` | N/A (static) | `step-35-style-compile.md` |
| `resume-templates/modern-clean.html` | Template | `jd-optimize/templates/` | N/A (static) | `step-35-style-compile.md` |
| `resume-templates/modern-visual.html` | Template | `jd-optimize/templates/` | N/A (static) | `step-35-style-compile.md` |
| `theme-override.css` | Output | `jd-optimize/artifacts/` | `step-34-style-theming.md` | `step-35-style-compile.md` |

### Cross-Workflow Theming Data Flow

```
sync-scout (company research)
    |
    +--> company_brief.yaml
         |
         +-------> jd-optimize/step-34 (resume accent color)
         |             |
         |             +--> CSS accent injection --> resume HTML
         |
         +-------> outbound-campaign/step-02 (tonal theming)
         |             |
         |             +--> tone_descriptor --> cover letter voice
         |
         +-------> portfolio-deploy/step-01b (slide theming)
                       |
                       +--> dual-layer: Sync base + company accent overlay
```

---

## Consolidated Modification Summary

### Files to MODIFY (Existing)

| # | File | Workflow | Enhancement |
|---|------|----------|-------------|
| 1 | `outbound-campaign/steps-c/step-01-load-session-context.md` | outbound-campaign | Cover Letter |
| 2 | `outbound-campaign/steps-c/step-out-01-ingest.md` | outbound-campaign | Cover Letter |
| 3 | `outbound-campaign/steps-c/step-out-02-strategy.md` | outbound-campaign | Cover Letter + Theming |
| 4 | `outbound-campaign/steps-v/step-01-validate.md` | outbound-campaign | Cover Letter |
| 5 | `jd-optimize/steps-c/step-06-final-output.md` | jd-optimize | Cover Letter (data handoff) |
| 6 | `portfolio-deploy/steps-c/step-port-01-compile.md` | portfolio-deploy | Slides |
| 7 | `portfolio-deploy/steps-c/step-port-03-deploy.md` | portfolio-deploy | Slides + Beyond Papers + Theming |

### Files to REWRITE (Existing, Stub/Incomplete)

| # | File | Workflow | Enhancement |
|---|------|----------|-------------|
| 8 | `outbound-campaign/steps-c/step-out-03-cover-letter.md` | outbound-campaign | Cover Letter + Theming |
| 9 | `portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md` | portfolio-deploy | Beyond the Papers |
| 10 | `jd-optimize/steps-c/step-34-style-theming.md` | jd-optimize | Theming |
| 11 | `jd-optimize/steps-c/step-35-style-compile.md` | jd-optimize | Theming |
| 12 | `jd-optimize/steps-c/step-36-style-validation.md` | jd-optimize | Theming |

### Files to CREATE (New)

| # | File | Workflow | Enhancement |
|---|------|----------|-------------|
| 13 | `outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md` | outbound-campaign | Cover Letter |
| 14 | `outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md` | outbound-campaign | Cover Letter |
| 15 | `outbound-campaign/templates/cover_letter.template.md` | outbound-campaign | Cover Letter |
| 16 | `jd-optimize/steps-c/step-06b-export-data-contract.md` | jd-optimize | Cover Letter |
| 17 | `portfolio-deploy/steps-c/step-port-01b-style-selection.md` | portfolio-deploy | Slides + Theming |
| 18 | `portfolio-deploy/steps-c/step-port-01c-render-slides-html.md` | portfolio-deploy | Slides |
| 19 | `portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md` | portfolio-deploy | Beyond Papers |
| 20 | `portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md` | portfolio-deploy | Beyond Papers |
| 21 | `portfolio-deploy/data/abyssal-depth.preset.css` | portfolio-deploy | Slides + Theming |
| 22 | `portfolio-deploy/data/portfolio-content.schema.json` | portfolio-deploy | Beyond Papers |
| 23 | `jd-optimize/templates/resume-templates/modern-minimal.html` | jd-optimize | Theming |
| 24 | `jd-optimize/templates/resume-templates/modern-clean.html` | jd-optimize | Theming |
| 25 | `jd-optimize/templates/resume-templates/modern-visual.html` | jd-optimize | Theming |
| 26 | `_lr/sync/shared-data/company_brief.yaml` | Shared | Theming |

**Total: 7 MODIFY + 5 REWRITE + 14 CREATE = 26 file operations**

### `workflow.yaml` Updates Required

| Workflow | Current `input_file_patterns` | Addition Needed |
|----------|------------------------------|-----------------|
| `outbound-campaign` | `jd-profile.yaml`, `contacts.csv` | Add `company_brief.yaml` (FULL_LOAD) |
| `portfolio-deploy` | `signals.yaml`, `scout-*.json` | Add `projects-source.yaml` (FULL_LOAD) |
| `jd-optimize` | `signals-*.yaml`, `jd-raw.md`, `reference/*.yaml` | No change (already has company data path) |

---

# PLAN-08c: Agent Responsibility Matrix

## Current Agent Inventory (Sync Module)

| Agent ID | Persona | Title | Current Capabilities | Sidecar |
|----------|---------|-------|---------------------|---------|
| `sync-parser` | Orion | Lead Signal Engineer | JD ingestion, signal extraction, recruiter profiling | Yes |
| `sync-scout` | Lyra | Field Intelligence Agent | Company research, stakeholder profiling | Yes |
| `sync-linker` | Atlas | Matching Architect | Semantic mapping, alignment scoring, gap analysis | Yes |
| `sync-refiner` | Veda | The Sculptor | Bullet sculpting, summary refinement, keyword injection | Yes |
| `sync-inquisitor` | Sia | The Probing Interviewer | Gap interview, signal discovery | Yes |
| `sync-sizer` | Kael | The Strict Gatekeeper | Seniority/scale alignment, one-page enforcement | Yes |
| `sync-styler` | Cora | Visual Craftsman | Design system integration, branding, typography | Yes |
| `sync-publicist` | Lyric | Outreach Engineer | Cover letter drafting, outreach messaging, profile optimization | Yes |
| `sync-narrator` | Mnemosyne | Memory Synthesizer | Session persistence, context synthesis | Yes (missing dir) |
| `sync-tracker` | Ledger | Success Officer | Success tracking, metrics | Yes (missing dir) |

### Core Agents Used by Sync Workflows

| Agent ID | Persona | Title | Role in Sync Workflows |
|----------|---------|-------|----------------------|
| `lr-tracker` | Navi | Governance & Memory Manager | MongoDB management, deployment orchestration, Beads |
| `lr-orchestrator` | Aether | Central Brain | Cross-module routing |
| `flex-publicist` | Echo | Social Brand Strategist | Profile optimization (step-out-06 of outbound-campaign) |

---

## Enhancement-to-Agent Assignment Matrix

### RACI Matrix (R=Responsible, A=Accountable, C=Consulted, I=Informed)

| Step / Task | sync-parser (Orion) | sync-scout (Lyra) | sync-linker (Atlas) | sync-refiner (Veda) | sync-styler (Cora) | sync-publicist (Lyric) | lr-tracker (Navi) | flex-publicist (Echo) |
|-------------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **COVER LETTER** | | | | | | | | |
| Recruiter PDF parsing | **R** | | | | | | | |
| Company research for hook | | **R** | | | | C | | |
| Signal alignment for Bridge | | | **R** | | | C | | |
| Cover letter draft (3-para) | | | | | | **R/A** | | |
| Cover letter variants | | | | | | **R** | | |
| Cover letter validation | | | | C | | **A** | I | |
| **SLIDES** | | | | | | | | |
| MongoDB signal query (top-5) | | | **R** | | C | | I | |
| slides_content.json compile | | | | | **R/A** | | | |
| Style selection / preset | | | | | **R/A** | | | |
| HTML slide rendering | | | | | **R/A** | | | |
| **BEYOND THE PAPERS** | | | | | | | | |
| Project card data mapping | | | | | **R/A** | | | |
| Life Journey timeline | | | | | **R** | | I | |
| Portfolio content validation | | | | | **A** | | I | |
| **THEMING** | | | | | | | | |
| Company brand color extraction | | **R** | | | C | | | |
| Resume template selection | | | | | **R/A** | | | |
| CSS accent injection | | | | | **R/A** | | | |
| HTML/CSS assembly | | | | | **R/A** | | | |
| Tonal theming (cover letter) | | C | | | | **R/A** | | |
| Dual-layer portfolio theming | | | | | **R/A** | | | |
| **DEPLOYMENT** | | | | | | | | |
| gh-pages push | | | | | | | **R/A** | |
| Artifact storage (MongoDB) | | | | | | | **R/A** | |
| Profile updates suggestion | | | | | | C | | **R** |

---

## New Capabilities Required Per Agent

### sync-publicist (Lyric) -- Cover Letter Enhancement

| New Capability | Description | Sidecar Memory Addition |
|---------------|-------------|----------------------|
| **3-paragraph structure engine** | Ability to produce Hook/WhyMe/WhyThem paragraphs with strict structural adherence | Add to `instructions.md`: "Cover Letter Protocol: Always follow the 3-paragraph structure. Paragraph 1 = Hook (company/recruiter specific). Paragraph 2 = Why Me (Bridge signal + XYZ metric). Paragraph 3 = Why Them (internal motivations not on resume)." |
| **Tone injection from company_brief** | Consume `tone_descriptor` to adjust writing voice | Add to `memories.md`: tone mapping patterns for formal/conversational/technical/vision-driven |
| **Variant generation** | Produce multiple tone variants of the same content | Add to `instructions.md`: "Variant Protocol: When generating variants, keep factual content identical. Only modify voice, sentence structure, and connective language." |
| **Word count enforcement** | Strict 300-400 word constraint with automatic truncation/expansion | Add to `instructions.md`: "Word Count Guardrail: STRICT 300-400 words. If draft exceeds, compress sentences. If under, expand 'Why Them' paragraph." |
| **Company brief consumption** | Read and integrate `brand_values[]`, `cautions[]` from company brief | No sidecar change needed -- add to step file |

### sync-styler (Cora) -- Slides + Theming Enhancement

| New Capability | Description | Sidecar Memory Addition |
|---------------|-------------|----------------------|
| **slides_content.json compilation** | Transform MongoDB career signals into structured JSON payload | Add to `instructions.md`: "Slide Compilation Protocol: Query top-5 signals by cosine similarity to Strategic Gravity. Structure each as Problem/Process/Metric/Legacy. Include signal_id and impact_rank." |
| **Abyssal Depth preset rendering** | Apply Sync ocean-themed design tokens to frontend-slides output | Add to `memories.md`: "Custom preset 'Abyssal Depth' created for Sync identity. Primary: #0E9E8E teal. Accent: #D9705A coral. Gold: #C8973A. Backgrounds: #091614 (base), #0F1F1C (surface), #122520 (elevated)." |
| **HTML self-contained rendering** | Generate zero-dependency HTML with inline CSS/JS for slides | Add to `instructions.md`: "Slide Rendering Protocol: Output must be a single HTML file with all CSS and JS inline. Zero external dependencies. Use viewport-base responsive design." |
| **Company brand accent injection** | Apply `brand_color_primary` as CSS accent with accessibility check | Add to `instructions.md`: "Brand Injection Protocol: Check contrast ratio >= 4.5:1. Apply accent to section dividers (1px) and header name only. Fallback: Sync teal #0E9E8E." |
| **Resume template selection logic** | Choose template based on company_stage + pm_culture matrix | Add to `memories.md`: "Template Selection Matrix: FAANG->Modern-Minimal, product-led+scale-up->Modern-Clean, product-led+creative->Modern-Visual, default->Modern-Minimal." |
| **Portfolio content structuring** | Map user projects/hobbies to structured JSON cards | No sidecar change needed -- add to step file |
| **Dual-layer theming** | Apply Sync base theme + company accent overlay simultaneously | Add to `instructions.md`: "Dual-Layer Theming: Sync ocean tokens form the base layer. Company accent overlays on interactive elements only (links, hover states, CTA buttons). Never override Sync backgrounds." |

### sync-scout (Lyra) -- Theming Support

| New Capability | Description | Sidecar Memory Addition |
|---------------|-------------|----------------------|
| **Brand color extraction** | Extract primary and secondary brand colors from company website/materials | Add to `instructions.md`: "Brand Research Protocol: When researching a company, always extract brand_color_primary (hex), brand_color_secondary (hex), and tone_descriptor." |

### sync-linker (Atlas) -- Cover Letter + Slides Support

| New Capability | Description | Sidecar Memory Addition |
|---------------|-------------|----------------------|
| **"The Bridge" selection** | Identify the single most powerful signal that connects user to target | Already exists in current capability set. Add to `memories.md`: "Bridge Selection refinement: prioritize signals with both high impact_rank AND high persona_relevance for the target JD." |
| **Top-5 signal ranking for slides** | Rank signals by cosine similarity for slide compilation | Already exists (semantic mapping). No new capability needed. |

---

## Cross-Agent Handoff Points

| Handoff # | From Agent | To Agent | Trigger | Data Passed | Workflow |
|-----------|-----------|----------|---------|-------------|----------|
| H-01 | sync-parser (Orion) | sync-publicist (Lyric) | Recruiter PDF parsed | `recruiter_profile.json` | outbound-campaign |
| H-02 | sync-linker (Atlas) | sync-publicist (Lyric) | Bridge signal selected | `outreach_strategy.json` (enriched) | outbound-campaign |
| H-03 | sync-scout (Lyra) | sync-styler (Cora) | Company researched | `company_brief.yaml` (brand colors, tone) | jd-optimize |
| H-04 | sync-scout (Lyra) | sync-publicist (Lyric) | Company researched | `company_brief.yaml` (tone_descriptor, brand_values) | outbound-campaign |
| H-05 | sync-linker (Atlas) | sync-styler (Cora) | Signals ranked | Top-5 signal IDs + scores | portfolio-deploy |
| H-06 | sync-styler (Cora) | lr-tracker (Navi) | Slides + portfolio compiled | `slides_deck.html` + `portfolio_content.json` | portfolio-deploy |
| H-07 | sync-publicist (Lyric) | flex-publicist (Echo) | Campaign artifacts done | All campaign artifacts | outbound-campaign |
| H-08 | sync-styler (Cora) | sync-styler (Cora) | Resume themed | `theme-override.css` -> HTML assembly | jd-optimize (internal) |

---

## New Agent Assessment

| Question | Answer |
|----------|--------|
| Are new agents needed? | **No.** All four enhancements map cleanly to existing agents. |
| Why not a new "slides" agent? | sync-styler (Cora) already owns "design system integration, branding, typography" which encompasses slide rendering. A separate agent would fragment the visual design responsibility. |
| Why not a new "theming" agent? | Theming is a cross-cutting concern that touches sync-styler (visual) and sync-scout (research). Adding a theming agent would create unnecessary coordination overhead. sync-styler handles visual theming; sync-scout handles brand data extraction. |
| Why not a new "cover letter" agent? | sync-publicist (Lyric) already has "cover letter drafting" as an explicit capability. The enhancement extends existing capability, not adding a new domain. |
| Cross-module dependency? | `flex-publicist` (Echo) is used in outbound-campaign step-06. This cross-module dependency should be formally declared in `outbound-campaign/workflow.yaml` as a dependency. |

---

## Sidecar Memory Additions Summary

| Agent | Sidecar Path | File | Additions |
|-------|-------------|------|-----------|
| sync-publicist | `_lr/_memory/sync-publicist-sidecar/` | `instructions.md` | Cover Letter Protocol (3-para structure), Variant Protocol, Word Count Guardrail |
| sync-publicist | `_lr/_memory/sync-publicist-sidecar/` | `memories.md` | Tone mapping patterns (formal/conversational/technical/vision-driven) |
| sync-styler | `_lr/_memory/sync-styler-sidecar/` | `instructions.md` | Slide Compilation Protocol, Slide Rendering Protocol, Brand Injection Protocol, Dual-Layer Theming Protocol |
| sync-styler | `_lr/_memory/sync-styler-sidecar/` | `memories.md` | Abyssal Depth preset definition, Template Selection Matrix |
| sync-scout | `_lr/_memory/sync-scout-sidecar/` | `instructions.md` | Brand Research Protocol (color + tone extraction) |
| sync-linker | `_lr/_memory/sync-linker-sidecar/` | `memories.md` | Bridge Selection refinement criteria |

---

# PLAN-07b: BMAD-Linkright IDE Decision Matrix

## Source Data Summary

### BMAD IDE Footprint (from PLAN-07a, `sync-x1si` CLOSED)

BMAD v6.0.4 lists **19 IDEs** in its manifest (`context/bmad-method/_bmad/_config/manifest.yaml`):

```
claude-code, cursor, auggie, cline, codebuddy, codex, crush, gemini,
github-copilot, antigravity, iflow, kilo, kiro, opencode, qwen, roo,
rovo-dev, trae, windsurf
```

PLAN-07a finding: "Only 7 truly unique formats exist among 19 BMAD configs."

### Linkright IDE Footprint

**Three layers with mismatches:**

| Layer | Location | Count | Notes |
|-------|----------|-------|-------|
| `_config/ides/*.yaml` | `/Users/satvikjain/Downloads/sync/linkright/_lr/_config/ides/` | **20 files** | Actual config files on disk |
| `manifest.yaml` ides list | `/Users/satvikjain/Downloads/sync/linkright/_lr/_config/manifest.yaml` | **34 entries** | Declared in manifest |
| `.lr-commands/` directories | `/Users/satvikjain/Downloads/sync/linkright/.lr-commands/` | **35 directories** | Shell command stubs (includes 1 spurious `name:` directory) |

### Mismatch Analysis

**14 IDEs in manifest but missing `_config/ides/*.yaml`:**

| # | IDE | In Manifest | Has Config File | Has .lr-commands/ Dir | Status |
|---|-----|:-----------:|:---------------:|:--------------------:|--------|
| 1 | emacs | YES | NO | YES | Ghost entry |
| 2 | github-codespaces | YES | NO | YES | Ghost entry |
| 3 | gitpod | YES | NO | YES | Ghost entry |
| 4 | intellij | YES | NO | YES | Ghost entry |
| 5 | jupyter | YES | NO | YES | Ghost entry |
| 6 | neovim | YES | NO | YES | Ghost entry |
| 7 | pycharm | YES | NO | YES | Ghost entry |
| 8 | replit | YES | NO | YES | Ghost entry |
| 9 | sublime | YES | NO | YES | Ghost entry |
| 10 | terminal | YES | NO | YES | Ghost entry |
| 11 | tmux | YES | NO | YES | Ghost entry |
| 12 | vim | YES | NO | YES | Ghost entry |
| 13 | webstorm | YES | NO | YES | Ghost entry |
| 14 | zed | YES | NO | YES | Ghost entry |

**1 spurious `.lr-commands/` directory:**

| Dir | Notes |
|-----|-------|
| `name:` | Directory literally named `name:` -- artifact of a script bug during generation. Contains 18 shell stubs identical to other IDE dirs. |

---

## Config Format Analysis

### Format Type A: Full Startup Config (5 files)

These files define `startup.load`, `startup.agent`, and `startup.greeting`:

| File | Content Pattern |
|------|----------------|
| `claude-code.yaml` | `name: claude-code` + startup block |
| `cursor.yaml` | `name: cursor` + startup block |
| `windsurf.yaml` | `name: windsurf` + startup block |
| `antigravity.yaml` | `name: antigravity` + startup block |
| `gemini.yaml` | `name: gemini` + startup block |

All 5 have **identical content** except for the `name:` field. They all load `[lr-config.yaml, manifest.yaml]`, route to `lr-orchestrator`, and display `"Linkright ready. Type [M] for menu."`.

### Format Type B: Legacy Capabilities Config (1 file)

| File | Content Pattern |
|------|----------------|
| `vscode.yaml` | `ide_id: vscode` + `capabilities` list + `rules` list |

This is a different format from all others -- likely an earlier schema version.

### Format Type C: No-Config Stub (14 files)

These files contain only:
```yaml
ide: [name]
configured_date: 2026-03-04T14:44:16.XXX
last_updated: 2026-03-04T14:44:16.XXX
configuration:
  _noConfigNeeded: true
```

Files: `auggie`, `cline`, `codebuddy`, `codex`, `crush`, `github-copilot`, `iflow`, `kilo`, `kiro`, `opencode`, `qwen`, `roo`, `rovo-dev`, `trae`

All 14 were generated at the same timestamp (2026-03-04T14:44:16), indicating batch auto-generation.

### `.lr-commands/` Directory Analysis

Every IDE directory under `.lr-commands/` contains the **exact same 18 shell scripts**:

```
bond.sh, create-module.sh, generate-tests.sh, jd-optimize.sh,
lr-orchestrator.sh, lr-tracker.sh, module-brief.sh, morgan.sh,
outbound-campaign.sh, party-mode.sh, qa.sh, quality-gate.sh,
squick-architect.sh, sync-inquisitor.sh, sync-parser.sh,
sync-publicist.sh, validate-module.sh, wendy.sh
```

Each script is a 3-line stub:
```bash
#!/bin/bash
echo "Activating Linkright Agent: [agent] in [ide]..."
antigravity activate [agent] --ide [ide]
```

The only difference between IDE directories is the `--ide` flag value. All 35 directories (including `name:`) have identical file counts and structures.

---

## BMAD-to-Linkright Cross-Reference

| # | IDE | BMAD Manifest (19) | LR Config File (20) | LR Manifest (34) | LR .lr-commands (35) | Format |
|---|-----|:---:|:---:|:---:|:---:|--------|
| 1 | **antigravity** | YES | YES | YES | YES | Type A |
| 2 | **auggie** | YES | YES | YES | YES | Type C |
| 3 | **claude-code** | YES | YES | YES | YES | Type A |
| 4 | **cline** | YES | YES | YES | YES | Type C |
| 5 | **codebuddy** | YES | YES | YES | YES | Type C |
| 6 | **codex** | YES | YES | YES | YES | Type C |
| 7 | **crush** | YES | YES | YES | YES | Type C |
| 8 | **cursor** | YES (not in BMAD manifest but in ecosystem) | YES | YES | YES | Type A |
| 9 | **gemini** | YES | YES | YES | YES | Type A |
| 10 | **github-copilot** | YES | YES | YES | YES | Type C |
| 11 | **iflow** | YES | YES | YES | YES | Type C |
| 12 | **kilo** | YES | YES | YES | YES | Type C |
| 13 | **kiro** | YES | YES | YES | YES | Type C |
| 14 | **opencode** | YES | YES | YES | YES | Type C |
| 15 | **qwen** | YES | YES | YES | YES | Type C |
| 16 | **roo** | YES | YES | YES | YES | Type C |
| 17 | **rovo-dev** | YES | YES | YES | YES | Type C |
| 18 | **trae** | YES | YES | YES | YES | Type C |
| 19 | **vscode** | NO | YES | YES | YES | Type B |
| 20 | **windsurf** | YES | YES | YES | YES | Type A |
| 21 | emacs | NO | NO | YES | YES | N/A |
| 22 | github-codespaces | NO | NO | YES | YES | N/A |
| 23 | gitpod | NO | NO | YES | YES | N/A |
| 24 | intellij | NO | NO | YES | YES | N/A |
| 25 | jupyter | NO | NO | YES | YES | N/A |
| 26 | neovim | NO | NO | YES | YES | N/A |
| 27 | pycharm | NO | NO | YES | YES | N/A |
| 28 | replit | NO | NO | YES | YES | N/A |
| 29 | sublime | NO | NO | YES | YES | N/A |
| 30 | terminal | NO | NO | YES | YES | N/A |
| 31 | tmux | NO | NO | YES | YES | N/A |
| 32 | vim | NO | NO | YES | YES | N/A |
| 33 | webstorm | NO | NO | YES | YES | N/A |
| 34 | zed | NO | NO | YES | YES | N/A |
| 35 | **name:** (spurious) | NO | NO | NO | YES | Bug artifact |

---

## Decision Matrix

### Tier 1: KEEP (Active, Tested, Differentiated)

These are IDEs that Linkright is actually tested and run on:

| IDE | Decision | Rationale | Action |
|-----|----------|-----------|--------|
| **claude-code** | **KEEP** | Primary development IDE. All workflows tested here. Has Type A config. | Maintain as reference implementation. |
| **cursor** | **KEEP** | Active AI coding IDE with large user base. Has Type A config. | Maintain. |

### Tier 2: KEEP (Strategic, Has BMAD Parity)

These have BMAD equivalents and represent major AI coding platforms worth supporting:

| IDE | Decision | Rationale | Action |
|-----|----------|-----------|--------|
| **windsurf** | **KEEP** | Codeium's IDE with significant adoption. Has Type A config. | Maintain. |
| **cline** | **KEEP** | Popular open-source AI coding assistant. Has BMAD parity. | Upgrade from Type C to Type A config. |
| **roo** | **KEEP** | Active fork of Cline with growing user base. Has BMAD parity. | Upgrade from Type C to Type A config. |
| **gemini** | **KEEP** | Google's AI offering. Strategic platform. Has Type A config. | Maintain. |
| **codex** | **KEEP** | OpenAI CLI agent. Strategic relevance. | Upgrade from Type C to Type A config. |
| **kiro** | **KEEP** | AWS AI IDE. Enterprise relevance. | Upgrade from Type C to Type A config. |

### Tier 3: CONSOLIDATE (Redundant Format, Low Differentiation)

These are in both BMAD and Linkright but add no unique value and have identical configs:

| IDE | Decision | Rationale | Action |
|-----|----------|-----------|--------|
| **antigravity** | **CONSOLIDATE** | Linkright-internal tool. Keep config but merge .lr-commands into a shared template. | Keep config, template commands. |
| **auggie** | **CONSOLIDATE** | Augment Code. Type C stub. | Keep config, template commands. |
| **codebuddy** | **CONSOLIDATE** | Baidu's AI IDE. Limited Western adoption. Type C stub. | Keep config, template commands. |
| **github-copilot** | **CONSOLIDATE** | Major platform but Linkright interacts via CLI, not Copilot extension. Type C stub. | Keep config, evaluate if Copilot-specific integration is planned. |
| **opencode** | **CONSOLIDATE** | Open source terminal AI coding. Type C stub. | Keep config, template commands. |

### Tier 4: REVIEW (Uncertain Market Position)

| IDE | Decision | Rationale | Action |
|-----|----------|-----------|--------|
| **vscode** | **REVIEW** | Has unique Type B config format (capabilities-based). Not an AI IDE itself -- it is the platform others run on. May need different integration pattern. | Decide: is this config for VS Code extensions or VS Code itself? If extensions, consolidate under github-copilot/cline/roo. |
| **crush** | **REVIEW** | Minimal market presence. Type C stub. | Research current status. If abandoned, REMOVE. |
| **iflow** | **REVIEW** | Limited information available. Type C stub. | Research current status. If abandoned, REMOVE. |
| **kilo** | **REVIEW** | KiloCode. Limited adoption signals. Type C stub. | Research current status. If abandoned, REMOVE. |
| **qwen** | **REVIEW** | Alibaba's AI. Significant in Asia. Type C stub. | Keep if international expansion planned, else REMOVE. |
| **trae** | **REVIEW** | ByteDance AI IDE. Active development. Type C stub. | Keep if international expansion planned, else REMOVE. |
| **rovo-dev** | **REVIEW** | Atlassian's AI dev tool. Enterprise relevance possible. Type C stub. | Research current status and enterprise adoption. |

### Tier 5: REMOVE (Ghost Entries, No Config, No BMAD Parity)

These exist only in the manifest and `.lr-commands/` but have no config files and no BMAD equivalents:

| IDE | Decision | Rationale | Action |
|-----|----------|-----------|--------|
| **emacs** | **REMOVE** | No AI agent integration. Traditional editor. No config file. | Remove from manifest + delete `.lr-commands/emacs/`. |
| **neovim** | **REMOVE** | No AI agent integration at Linkright level. No config file. | Remove from manifest + delete `.lr-commands/neovim/`. |
| **vim** | **REMOVE** | No AI agent integration. No config file. | Remove from manifest + delete `.lr-commands/vim/`. |
| **sublime** | **REMOVE** | No AI agent integration. No config file. | Remove from manifest + delete `.lr-commands/sublime/`. |
| **intellij** | **REMOVE** | JetBrains IDE without AI agent layer. No config file. | Remove from manifest + delete `.lr-commands/intellij/`. |
| **pycharm** | **REMOVE** | JetBrains IDE (subset of IntelliJ). No config file. | Remove from manifest + delete `.lr-commands/pycharm/`. |
| **webstorm** | **REMOVE** | JetBrains IDE (subset of IntelliJ). No config file. | Remove from manifest + delete `.lr-commands/webstorm/`. |
| **jupyter** | **REMOVE** | Notebook environment, not an IDE with agent support. No config file. | Remove from manifest + delete `.lr-commands/jupyter/`. |
| **replit** | **REMOVE** | Cloud IDE. No local agent integration. No config file. | Remove from manifest + delete `.lr-commands/replit/`. |
| **github-codespaces** | **REMOVE** | Cloud VS Code. Would use VS Code/Copilot config. No config file. | Remove from manifest + delete `.lr-commands/github-codespaces/`. |
| **gitpod** | **REMOVE** | Cloud IDE. No local agent integration. No config file. | Remove from manifest + delete `.lr-commands/gitpod/`. |
| **terminal** | **REMOVE** | Not an IDE. Linkright already works via terminal through claude-code. No config file. | Remove from manifest + delete `.lr-commands/terminal/`. |
| **tmux** | **REMOVE** | Terminal multiplexer, not an IDE. No config file. | Remove from manifest + delete `.lr-commands/tmux/`. |
| **zed** | **REMOVE** | Has AI features but no agentic IDE integration yet. No config file. | Remove from manifest + delete `.lr-commands/zed/`. |
| **name:** (spurious) | **REMOVE** | Bug artifact from script generation. | Delete `.lr-commands/name:/`. |

---

## Cleanup Plan Summary

| Action | Count | Details |
|--------|-------|---------|
| **KEEP as-is** | 2 | claude-code, cursor |
| **KEEP (strategic)** | 6 | windsurf, cline, roo, gemini, codex, kiro |
| **CONSOLIDATE** | 5 | antigravity, auggie, codebuddy, github-copilot, opencode |
| **REVIEW** | 7 | vscode, crush, iflow, kilo, qwen, trae, rovo-dev |
| **REMOVE** | 15 | emacs, neovim, vim, sublime, intellij, pycharm, webstorm, jupyter, replit, github-codespaces, gitpod, terminal, tmux, zed, `name:` |
| **Total** | 35 | |

### Immediate Actions

1. **Delete 15 `.lr-commands/` directories** (14 ghost IDEs + 1 spurious `name:`)
2. **Remove 14 ghost entries from `manifest.yaml`** ides list (reduce from 34 to 20)
3. **Upgrade 4 Type C configs to Type A** (cline, roo, codex, kiro) -- add startup block
4. **Standardize vscode.yaml** from Type B to Type A format
5. **Template `.lr-commands/`** -- replace 18 identical scripts per IDE with a single `_lr/core/bin/lr-activate.sh` that takes `--agent` and `--ide` flags. Each IDE directory then needs only a symlink or a 1-line wrapper.

### Post-Cleanup State

```
manifest.yaml ides: 20 entries (down from 34)
_config/ides/*.yaml: 20 files (unchanged, all standardized to Type A)
.lr-commands/: 20 directories (down from 35)
  Each with: symlink to _lr/core/bin/lr-activate.sh OR 1-line wrapper
Total shell scripts: 20 wrappers (down from 630 = 35 dirs x 18 scripts)
```

### File Savings

| Before | After | Reduction |
|--------|-------|-----------|
| 35 directories | 20 directories | -15 dirs |
| 630 shell scripts (35 x 18) | 20 wrapper scripts + 1 shared script | -609 files |
| 34 manifest entries | 20 manifest entries | -14 entries |
| 3 config formats | 1 config format (Type A) | Standardized |

---

## Appendix A: Shared Data Directory Proposal

To support cross-workflow data flow (especially for the Theming enhancement), create a shared data exchange directory:

```
_lr/sync/shared-data/
    company_brief.yaml        <-- Written by jd-optimize, read by outbound-campaign + portfolio-deploy
    jd-profile.yaml           <-- Written by jd-optimize, read by outbound-campaign
    active-signals.json       <-- Written by signal-capture, read by portfolio-deploy
```

Each file should include a header comment with the producing workflow and timestamp:

```yaml
# Producer: jd-optimize (step-06b-export-data-contract)
# Generated: 2026-03-07T10:30:00Z
# Schema version: 1.0
```

## Appendix B: Enhancement Implementation Order

Based on dependency analysis, the recommended implementation order is:

| Order | Enhancement | Reason |
|-------|-------------|--------|
| 1 | **Theming** | Foundation layer. Company brief data structure is consumed by all other enhancements. The 3 stub step files (34/35/36) in jd-optimize need to be rewritten first. |
| 2 | **Cover Letter** | Depends on Theming (company_brief + tone_descriptor). Rewrite of step-out-03 + 2 new steps. |
| 3 | **Slides** | Depends on Theming (Abyssal Depth preset + company accent). 1 modify + 2 new steps. |
| 4 | **Beyond the Papers** | Independent of other enhancements. 1 rewrite + 2 new steps. Can be parallelized with Slides. |

## Appendix C: Workflow YAML Updates

### outbound-campaign/workflow.yaml (Updated)

```yaml
name: outbound-campaign
description: "Cold outreach campaign scaling engine"
config_source: "{project-root}/_lr/_config/manifest.yaml"
installed_path: "{project-root}/_lr/sync/workflows/outbound-campaign"
instructions: "{installed_path}/instructions.md"
validation: "{installed_path}/checklist.md"
template: "{installed_path}/templates/campaign.template.md"
input_file_patterns:
  jd_profile:
    pattern: "data/jd-profile.yaml"
    strategy: FULL_LOAD
  contacts:
    pattern: "data/contacts.csv"
    strategy: FULL_LOAD
  company_brief:                          # NEW
    pattern: "data/company_brief.yaml"    # NEW
    strategy: FULL_LOAD                   # NEW
dependencies:                             # NEW
  - workflow: jd-optimize                 # NEW
    provides: [jd-profile.yaml, company_brief.yaml]  # NEW
  - agent: flex-publicist                 # NEW (cross-module)
    step: step-out-06-profile-updates     # NEW
```

### portfolio-deploy/workflow.yaml (Updated)

```yaml
name: portfolio-deploy
description: "Portfolio case study assembly and deployment"
config_source: "{project-root}/_lr/_config/manifest.yaml"
installed_path: "{project-root}/_lr/sync/workflows/portfolio-deploy"
instructions: "{installed_path}/instructions.md"
validation: "{installed_path}/checklist.md"
template: "{installed_path}/templates/portfolio.template.md"
input_file_patterns:
  signals:
    pattern: "data/signals.yaml"
    strategy: FULL_LOAD
  scout_data:
    pattern: "data/scout-*.json"
    strategy: SELECTIVE_LOAD
  projects_source:                          # NEW
    pattern: "data/projects-source.yaml"    # NEW
    strategy: FULL_LOAD                     # NEW
  company_brief:                            # NEW
    pattern: "data/company_brief.yaml"      # NEW
    strategy: SELECTIVE_LOAD                # NEW (optional for theming)
```
