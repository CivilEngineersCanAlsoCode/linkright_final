# PLAN-08b: Workflow Definitions for Release 3 Enhancements

**Date**: 2026-03-07
**Scope**: Detailed workflow step specifications for Linkright Release 3 (Cover Letter, Slides, Beyond the Papers, Theming)
**Depends On**: `PLAN-08-07b-INTEGRATION-ARCHITECTURE-SPECS.md` (PLAN-08a, PLAN-08c, PLAN-07b)
**Depends On**: `PLAN-03-04-SLIDES-PUBLICIST-AUDIT.md` (gap analysis, current state)
**Related Beads**: `sync-rrd3` (PLAN-07b), `sync-7n7q` (PLAN-08)

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Conventions and File Layout](#2-conventions-and-file-layout)
3. [Shared Data Infrastructure](#3-shared-data-infrastructure)
4. [Workflow 1: jd-optimize -- Modifications](#4-workflow-1-jd-optimize----modifications)
5. [Workflow 2: outbound-campaign -- Modifications](#5-workflow-2-outbound-campaign----modifications)
6. [Workflow 3: portfolio-deploy -- Modifications](#6-workflow-3-portfolio-deploy----modifications)
7. [Workflow Interconnections](#7-workflow-interconnections)
8. [Implementation Order and Dependencies](#8-implementation-order-and-dependencies)
9. [Appendix A: Complete Step File Registry](#appendix-a-complete-step-file-registry)
10. [Appendix B: Validation Criteria Matrix](#appendix-b-validation-criteria-matrix)

---

## 1. Executive Summary

Release 3 introduces four enhancements that modify three existing workflows. No new top-level workflow directories are required. The PLAN-08a analysis confirmed that all enhancements map into the current workflow structure:

| Enhancement | Primary Workflow | New Steps | Modified Steps | Rewritten Steps |
|-------------|-----------------|-----------|---------------|-----------------|
| **Theming** | `jd-optimize` | 0 | 0 | 3 (stubs 34/35/36) |
| **Cover Letter** | `outbound-campaign` | 3 (03b, 03c, 06b) | 4 (01, out-01, out-02, V-01) | 1 (out-03) |
| **Slides** | `portfolio-deploy` | 2 (01b, 01c) | 2 (port-01, port-03) | 0 |
| **Beyond the Papers** | `portfolio-deploy` | 2 (02b, 02c) | 0 | 1 (port-02) |

**Totals**: 7 new step files, 6 modified step files, 5 rewritten step files = **18 step file operations**.

Additionally: 1 new shared data directory, 3 workflow.yaml updates, 3 checklist.md updates, 2 instructions.md updates, and 14 new data/template files.

---

## 2. Conventions and File Layout

### 2.1 Step File Naming Convention

All existing workflows follow this pattern:

```
workflows/{workflow-name}/
  workflow.yaml               # Workflow metadata and input contracts
  instructions.md             # Agent directives for the workflow
  checklist.md                # Validation criteria
  steps-c/                    # Core execution path
    step-01-load-session-context.md
    step-01b-resume-if-interrupted.md
    step-{NN}-{name}.md       # Sequential numbered steps
    step-{prefix}-{NN}-{name}.md   # Prefixed steps (out-, port-)
    step-{prefix}-{NNb}-{name}.md  # Sub-steps inserted between existing steps
  steps-e/                    # Edit path
    step-01-assess.md
    step-02-apply-edit.md
  steps-v/                    # Validation path
    step-01-validate.md
  templates/                  # Output templates
  data/                       # Input data and reference files
    reference/                # Static reference data (YAML)
  artifacts/                  # Runtime outputs (not committed to git)
```

### 2.2 Step File Internal Structure

Every step file follows this mandatory structure:

```markdown
# Step {NN}: {Title}

**Goal:** {One-sentence objective}

---

## DEPENDENCIES
- Requires: {upstream step or file}
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
{stop/go rules}

## CONTEXT BOUNDARIES
- Available configurations from parent: {variables}

## EXECUTION PROTOCOLS
1. [READ] {input action}
2. [ANALYZE] {processing action}
3. [VALIDATE] {output verification action}

## INPUT CONTRACT
- {structured description of inputs}

## OUTPUT CONTRACT
- {structured description of outputs with file names}

## {Numbered sections for specific logic}

---

## NEXT ACTION
- **[C] Continue**: Proceed to Step {next}.
- **[P] Previous**: back to {prev}.
- **[A] Abort**: Exit the workflow.
```

### 2.3 Agent Assignment Convention

Each step file identifies the executing agent with this pattern:
```
Use your internal **{Persona Name}** (`{agent-id}`) persona to {action}.
```

---

## 3. Shared Data Infrastructure

### 3.1 New Directory: `_lr/sync/shared-data/`

A shared data exchange directory for cross-workflow data handoff. This directory does not currently exist and must be created.

**Location**: `linkright/_lr/sync/shared-data/`

**Files managed in this directory**:

| File | Schema Version | Producer Workflow | Producer Step | Consumer Workflow(s) |
|------|---------------|-------------------|---------------|---------------------|
| `jd-profile.yaml` | 1.0 | `jd-optimize` | `step-06b-export-data-contract.md` | `outbound-campaign` |
| `company_brief.yaml` | 1.0 | `jd-optimize` | `step-06b-export-data-contract.md` | `outbound-campaign`, `portfolio-deploy` |
| `active-signals.json` | 1.0 | `signal-capture` | `step-02-extract.md` | `portfolio-deploy` |

### 3.2 `company_brief.yaml` Schema (Canonical)

This is the central data contract that the Theming, Cover Letter, and Slides enhancements all consume.

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

  # Brand identity (extracted by sync-scout)
  brand:
    color_primary: "#RRGGBB"       # e.g. "#1DA1F2" for Twitter
    color_secondary: "#RRGGBB"     # e.g. "#14171A"
    logo_url: "{url_if_available}"

  # Communication style
  tone_descriptor: "formal|conversational|technical|vision-driven"
  pm_culture: "data-driven|design-led|engineering-first|customer-obsessed"

  # Values for cover letter personalization
  brand_values:
    - "{value_1}"
    - "{value_2}"
    - "{value_3}"

  # Cautions for cover letter guardrails
  cautions:
    - "{thing_to_avoid_mentioning}"

  # Metadata
  source_url: "{company_website_or_jd_url}"
  researched_at: "{ISO timestamp}"
  researched_by: "sync-scout"
```

### 3.3 `jd-profile.yaml` Export Schema

Exported from jd-optimize to shared-data for outbound-campaign consumption. Schema matches the master orchestration definition (lines 720-748):

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

---

## 4. Workflow 1: jd-optimize -- Modifications

**Workflow directory**: `linkright/_lr/sync/workflows/jd-optimize/`
**Current step count**: 40 steps-c, 7 steps-e, 10 steps-v
**Post-modification step count**: 41 steps-c (+1 new), 7 steps-e, 10 steps-v

### 4.1 Enhancement: Theming (Steps 34/35/36 Rewrite)

These three steps are currently 13-line stubs with no implementation. They must be rewritten with full logic from the master orchestration.

---

#### 4.1.1 REWRITE: `step-34-style-theming.md`

**File**: `linkright/_lr/sync/workflows/jd-optimize/steps-c/step-34-style-theming.md`
**Current State**: Stub (13 lines, generic placeholder)
**Agent**: sync-styler (Cora)
**Consulted**: sync-scout (Lyra) -- for brand color data

```markdown
# Step 34: Style Theming -- Company Brand Integration

**Goal:** Select the resume template and inject company brand accent colors
with accessibility validation.

---

## DEPENDENCIES
- Requires: `step-33-layout-onepage-check` output (layout-verified content)
- Requires: `lr-config.yaml` session context
- Requires: `company_brief.yaml` from `_lr/sync/shared-data/` (if available)

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER apply brand colors without accessibility contrast check.
GO: ALWAYS fall back to Sync default teal (#0E9E8E) if no company_brief exists.
FORBIDDEN: Background fills with brand color, bullet coloring,
non-monochrome body text.

## CONTEXT BOUNDARIES
- Available configurations from parent: {system_version}, {mode}
- Available from shared-data: company_brief.yaml (optional)

## EXECUTION PROTOCOLS
1. [READ] Load company_brief.yaml from shared-data directory.
2. [ANALYZE] Select template and compute CSS accent variables.
3. [VALIDATE] Check contrast ratio and present selection to user.

## INPUT CONTRACT
- `company_brief.yaml` (optional): `brand.color_primary`, `brand.color_secondary`,
  `company_stage`, `pm_culture`
- Layout-verified content sections from step-33

## OUTPUT CONTRACT
- `selected_template_path`: Path to chosen HTML template file
- `theme-override.css`: CSS variable overrides for brand accent injection
- Written to: `jd-optimize/artifacts/theme-override.css`

---

## 1. Load Brand Data

- Use your internal **Cora** (`sync-styler`) persona to load brand context.
- Read `_lr/sync/shared-data/company_brief.yaml`.
- Extract:
  - `brand.color_primary` --> `--accent-color`
  - `brand.color_secondary` --> `--accent-color-secondary` (optional)
  - `company_stage` --> template selection input
  - `pm_culture` --> template selection input

- If `company_brief.yaml` does not exist or is empty:
  - Default `--accent-color`: `#0E9E8E` (Sync teal)
  - Default template: `modern-minimal.html`

## 2. Template Selection Logic

Apply the template selection matrix:

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
| any other | any other | `modern-minimal.html` (default) |

- Template files located at: `jd-optimize/templates/resume-templates/{template}.html`

## 3. Accessibility Contrast Check

- Compute WCAG 2.1 contrast ratio between `--accent-color` and white (#FFFFFF).
- **Minimum**: 4.5:1 for normal text, 3:1 for large text (>=18pt).
- If contrast fails:
  - Darken `--accent-color` by 10% increments until >= 4.5:1.
  - Log the adjustment: "Brand color {original} adjusted to {adjusted}
    for WCAG compliance."
- If contrast cannot be achieved within 3 adjustments:
  - Fall back to Sync teal `#0E9E8E`.

## 4. Generate CSS Override

Write `theme-override.css`:

```css
:root {
  --accent-color: {computed_accent};
  --accent-color-secondary: {computed_secondary_or_inherit};
  --accent-color-muted: {accent_at_30_percent_opacity};
}

/* Brand accent application rules */
.resume-header .name { color: var(--accent-color); }
.section-divider { border-bottom: 1px solid var(--accent-color-muted); }

/* FORBIDDEN overrides -- these must NEVER use brand color */
body, p, li, .bullet { color: #1a1a1a !important; }
.section-background { background: transparent !important; }
```

## 5. User Confirmation

Present to user:
- Selected template name
- Brand color (original and adjusted if applicable)
- Contrast ratio achieved
- Preview description

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 35: Style Compile.
- **[P] Previous**: back to Layout One-Page Check.
- **[A] Abort**: Exit the workflow.
```

---

#### 4.1.2 REWRITE: `step-35-style-compile.md`

**File**: `linkright/_lr/sync/workflows/jd-optimize/steps-c/step-35-style-compile.md`
**Current State**: Stub (13 lines, generic placeholder)
**Agent**: sync-styler (Cora)

```markdown
# Step 35: Style Compile -- HTML/CSS Assembly

**Goal:** Assemble the final resume HTML document by injecting all content
sections into the selected template with brand accent and print-ready CSS.

---

## DEPENDENCIES
- Requires: `step-34-style-theming` output (`selected_template_path`,
  `theme-override.css`)
- Requires: All content sections from steps 27-33 (header, summary,
  experience bullets, skills, education)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER compile without a valid template path from step-34.
GO: ALWAYS include @media print CSS block.
FORBIDDEN: External font imports, external CSS/JS references.

## CONTEXT BOUNDARIES
- Available configurations from parent: {system_version}, {mode},
  {user_details}

## EXECUTION PROTOCOLS
1. [READ] Load template HTML and theme-override.css.
2. [ANALYZE] Inject content sections into template slots.
3. [VALIDATE] Verify all sections populated and one-page constraint met.

## INPUT CONTRACT
- `selected_template_path`: HTML template from step-34
- `theme-override.css`: CSS overrides from step-34
- Content sections (in-memory from steps 27-33):
  - `header_html`: Name, contact, links
  - `summary_html`: Professional summary (2-3 lines)
  - `experience_html`: XYZ-format bullet points per role
  - `skills_html`: Technical skills grouped by category
  - `education_html`: Degrees, certifications

## OUTPUT CONTRACT
- `jd-{uuid}-draft.html`: Complete resume HTML file
- Written to: `jd-optimize/artifacts/jd-{uuid}-draft.html`

---

## 1. Load Template

- Use your internal **Cora** (`sync-styler`) persona.
- Read the selected template from `jd-optimize/templates/resume-templates/`.
- The template contains slot markers:
  - `<!-- SLOT:HEADER -->` --> inject `header_html`
  - `<!-- SLOT:SUMMARY -->` --> inject `summary_html`
  - `<!-- SLOT:EXPERIENCE -->` --> inject `experience_html`
  - `<!-- SLOT:SKILLS -->` --> inject `skills_html`
  - `<!-- SLOT:EDUCATION -->` --> inject `education_html`
  - `<!-- SLOT:THEME_CSS -->` --> inject `theme-override.css` contents

## 2. Typography and Layout Variables

Inject the following CSS variables into the `<style>` block:

```css
:root {
  --font-size-body: 9.5pt;
  --line-height-body: 1.35;
  --margin-page: 0.5in;
  --font-family-body: "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-family-heading: "Inter", "Helvetica Neue", Arial, sans-serif;
}
```

## 3. Print CSS Block

Append the following `@media print` block:

```css
@media print {
  @page {
    size: letter;
    margin: 0.5in;
  }
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .no-print { display: none; }
}
```

## 4. Assembly and Output

- Replace all slot markers with content.
- Inline the `theme-override.css` into the `<style>` block (no external refs).
- Write the assembled file to `jd-optimize/artifacts/jd-{uuid}-draft.html`.
- The `{uuid}` comes from `jd_profile.id` (e.g., `jd-a1b2c3d4`).

## 5. One-Page Verification

- Estimate rendered height based on content line count:
  - Maximum ~58 lines of body content at 9.5pt / 1.35 line-height on letter.
  - If estimated lines exceed 58, WARN the user:
    "Content may exceed one page. Consider shortening the experience
    section by {N} lines."

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 36: Style Validation.
- **[P] Previous**: back to Style Theming.
- **[A] Abort**: Exit the workflow.
```

---

#### 4.1.3 REWRITE: `step-36-style-validation.md`

**File**: `linkright/_lr/sync/workflows/jd-optimize/steps-c/step-36-style-validation.md`
**Current State**: Stub (13 lines, generic placeholder)
**Agent**: sync-styler (Cora)

```markdown
# Step 36: Style Validation -- Visual and Structural QA

**Goal:** Validate the compiled resume HTML for visual correctness,
brand accent application, print rendering, and one-page compliance.

---

## DEPENDENCIES
- Requires: `step-35-style-compile` output (`jd-{uuid}-draft.html`)
- Requires: `theme-override.css` from step-34
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER mark validation as PASS without checking all 6 criteria.
GO: ALWAYS present the validation report to the user before proceeding.

## EXECUTION PROTOCOLS
1. [READ] Load the compiled HTML and CSS.
2. [ANALYZE] Run all 6 validation checks.
3. [VALIDATE] Generate PASS/FAIL report with details.

## INPUT CONTRACT
- `jd-{uuid}-draft.html`: Compiled resume from step-35

## OUTPUT CONTRACT
- `style-validation-report.json`: Validation results
- Written to: `jd-optimize/artifacts/style-validation-report.json`

---

## 1. Validation Checks

Use your internal **Cora** (`sync-styler`) persona to run these checks:

| # | Check | Criterion | PASS Condition |
|---|-------|-----------|---------------|
| 1 | **Sections Populated** | All 5 slots filled | No empty `<!-- SLOT:* -->` markers remain |
| 2 | **Accent Color Applied** | `.resume-header .name` uses `--accent-color` | Color value present in inline style |
| 3 | **Forbidden Overrides** | Body text is monochrome | No `color:` rules on `body/p/li` except `#1a1a1a` |
| 4 | **Print CSS Present** | `@media print` block exists | Block found in `<style>` |
| 5 | **One-Page Estimate** | Content fits letter page | Estimated lines <= 58 |
| 6 | **Contrast Ratio** | Accent vs. white >= 4.5:1 | Computed ratio meets WCAG |

## 2. Report Generation

Write `style-validation-report.json`:

```json
{
  "jd_id": "jd-{uuid}",
  "template_used": "{template_name}",
  "accent_color": "{hex}",
  "accent_color_adjusted": "{hex_or_null}",
  "contrast_ratio": 0.0,
  "checks": [
    { "id": 1, "name": "sections_populated", "result": "PASS|FAIL", "detail": "" },
    { "id": 2, "name": "accent_applied", "result": "PASS|FAIL", "detail": "" },
    { "id": 3, "name": "forbidden_overrides", "result": "PASS|FAIL", "detail": "" },
    { "id": 4, "name": "print_css", "result": "PASS|FAIL", "detail": "" },
    { "id": 5, "name": "one_page_estimate", "result": "PASS|WARN|FAIL", "detail": "" },
    { "id": 6, "name": "contrast_ratio", "result": "PASS|FAIL", "detail": "" }
  ],
  "overall": "PASS|FAIL",
  "validated_at": "{ISO timestamp}"
}
```

## 3. User Presentation

Present the validation report as a formatted table. If any check is FAIL:
- Identify the failing check(s)
- Propose a fix for each
- Ask user: "Fix and re-validate, or proceed with warnings?"

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 37: Final Scoring.
- **[P] Previous**: back to Style Compile.
- **[A] Abort**: Exit the workflow.
```

---

### 4.2 Enhancement: Cover Letter Data Export (New Step 06b)

#### 4.2.1 CREATE: `step-06b-export-data-contract.md`

**File**: `linkright/_lr/sync/workflows/jd-optimize/steps-c/step-06b-export-data-contract.md`
**Agent**: sync-scout (Lyra) -- for company research; lr-tracker (Navi) -- for file writing
**Closes**: GAP-02 from PLAN-04a (missing data handoff contract)

```markdown
# Step 06b: Export Data Contract

**Goal:** Formally export jd-profile.yaml and company_brief.yaml to the
shared data directory for consumption by outbound-campaign and
portfolio-deploy workflows.

---

## DEPENDENCIES
- Requires: `step-06-final-output` output (completed JD optimization)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER export without step-06 completion.
GO: ALWAYS include schema version header in exported files.
FORBIDDEN: Overwriting existing shared-data files without user confirmation.

## CONTEXT BOUNDARIES
- Available configurations from parent: {system_version}, {mode}
- JD profile data from step-06 final output

## EXECUTION PROTOCOLS
1. [READ] Collect all JD profile fields and company research data.
2. [ANALYZE] Structure into canonical schemas.
3. [VALIDATE] Write to shared-data directory with headers.

## INPUT CONTRACT
- In-memory JD profile data (all fields from steps 01-06)
- Company research data from sync-scout (if available)

## OUTPUT CONTRACT
- `_lr/sync/shared-data/jd-profile.yaml`
- `_lr/sync/shared-data/company_brief.yaml`

---

## 1. Compile JD Profile Export

- Use your internal **Navi** (`lr-tracker`) persona to serialize the
  in-memory JD profile data.
- Structure per the canonical `jd_profile` schema (see master
  orchestration lines 720-748).
- Include all fields: id, company, role_title, seniority, requirements
  (hard/soft/cultural), keywords_ats, persona_scores, alignment_scores.
- Add file header:
  ```yaml
  # Producer: jd-optimize (step-06b-export-data-contract)
  # Generated: {ISO timestamp}
  # Schema version: 1.0
  ```

## 2. Compile Company Brief

- Use your internal **Lyra** (`sync-scout`) persona to compile company
  research into the canonical `company_brief` schema.
- Data sources:
  - `company_stage`: extracted from JD parsing (step-01 to step-03)
  - `brand.color_primary`: from sync-scout company website analysis
  - `brand.color_secondary`: from sync-scout company website analysis
  - `tone_descriptor`: inferred from JD language and company culture
  - `pm_culture`: from JD ownership signals and requirements
  - `brand_values[]`: from company about page / mission statement
  - `cautions[]`: from adversarial review (step-05)

- If sync-scout has not been invoked for this JD:
  - Set `brand.color_primary` to `null`
  - Set `tone_descriptor` to `"formal"` (safe default)
  - Mark `researched_by` as `"inferred"` instead of `"sync-scout"`

## 3. Write to Shared Data Directory

- Create `_lr/sync/shared-data/` directory if it does not exist.
- Check for existing files:
  - If `jd-profile.yaml` already exists, ask user:
    "[O]verwrite existing profile or [K]eep current?"
  - If `company_brief.yaml` already exists, ask user the same.
- Write both files to the shared-data directory.

## 4. Cross-Reference Validation

- Verify `jd_profile.company_brief_id` matches `company_brief.id`.
- Verify `company_brief.company_name` matches `jd_profile.company`.
- Log: "Data contract exported. Available for outbound-campaign and
  portfolio-deploy."

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 08: Persona Score.
- **[P] Previous**: back to Final Output.
- **[A] Abort**: Exit the workflow.
```

---

### 4.3 jd-optimize `workflow.yaml` Update

**File**: `linkright/_lr/sync/workflows/jd-optimize/workflow.yaml`
**Change type**: MODIFY (add output declaration)

Current:
```yaml
name: jd-optimize
description: "53-step JD optimization engine"
config_source: "{project-root}/_lr/_config/manifest.yaml"
installed_path: "{project-root}/_lr/sync/workflows/jd-optimize"
instructions: "{installed_path}/instructions.md"
validation: "{installed_path}/checklist.md"
template: "{installed_path}/templates/optimized-jd.template.md"
input_file_patterns:
  user_signals:
    pattern: "data/signals-*.yaml"
    strategy: FULL_LOAD
  jd_raw:
    pattern: "data/jd-raw.md"
    strategy: FULL_LOAD
  reference_data:
    pattern: "data/reference/*.yaml"
    strategy: SELECTIVE_LOAD
```

Updated (additions marked):
```yaml
name: jd-optimize
description: "53-step JD optimization engine with theming and data export"
config_source: "{project-root}/_lr/_config/manifest.yaml"
installed_path: "{project-root}/_lr/sync/workflows/jd-optimize"
instructions: "{installed_path}/instructions.md"
validation: "{installed_path}/checklist.md"
template: "{installed_path}/templates/optimized-jd.template.md"
input_file_patterns:
  user_signals:
    pattern: "data/signals-*.yaml"
    strategy: FULL_LOAD
  jd_raw:
    pattern: "data/jd-raw.md"
    strategy: FULL_LOAD
  reference_data:
    pattern: "data/reference/*.yaml"
    strategy: SELECTIVE_LOAD
output_contracts:                                           # NEW
  jd_profile:                                               # NEW
    path: "{project-root}/_lr/sync/shared-data/jd-profile.yaml"  # NEW
    schema_version: "1.0"                                   # NEW
  company_brief:                                            # NEW
    path: "{project-root}/_lr/sync/shared-data/company_brief.yaml"  # NEW
    schema_version: "1.0"                                   # NEW
  resume_html:                                              # NEW
    path: "{installed_path}/artifacts/jd-{uuid}-draft.html" # NEW
  theme_override:                                           # NEW
    path: "{installed_path}/artifacts/theme-override.css"    # NEW
```

### 4.4 New Static Files Required for jd-optimize

| File | Purpose | Content Description |
|------|---------|-------------------|
| `jd-optimize/templates/resume-templates/modern-minimal.html` | FAANG/enterprise resume template | Clean, sparse layout. No decorative elements. |
| `jd-optimize/templates/resume-templates/modern-clean.html` | Scale-up/startup resume template | Moderate visual interest. Subtle section dividers. |
| `jd-optimize/templates/resume-templates/modern-visual.html` | Creative/design-led resume template | Visual accent bars, iconography placeholders. |

Each template must contain the 6 slot markers:
```html
<!-- SLOT:THEME_CSS -->
<!-- SLOT:HEADER -->
<!-- SLOT:SUMMARY -->
<!-- SLOT:EXPERIENCE -->
<!-- SLOT:SKILLS -->
<!-- SLOT:EDUCATION -->
```

---

## 5. Workflow 2: outbound-campaign -- Modifications

**Workflow directory**: `linkright/_lr/sync/workflows/outbound-campaign/`
**Current step count**: 8 steps-c, 2 steps-e, 1 steps-v
**Post-modification step count**: 10 steps-c (+2 new), 2 steps-e, 1 steps-v

### 5.1 Enhancement: Cover Letter (Steps Modified + New)

---

#### 5.1.1 MODIFY: `step-01-load-session-context.md`

**File**: `linkright/_lr/sync/workflows/outbound-campaign/steps-c/step-01-load-session-context.md`
**Agent**: System
**Change**: Add loading of `company_brief.yaml` and validation of `jd-profile.yaml`

**Current content** (16 lines): Loads only `lr-config.yaml`.

**Additions** (insert after existing EXECUTION PROTOCOLS section):

```markdown
## ADDITIONAL CONTEXT LOADING (Release 3)

4. [READ] Load `{project-root}/_lr/sync/shared-data/company_brief.yaml`.
   - If file exists: store all fields as session variables.
   - If file does not exist: log warning "No company brief available.
     Cover letter will use default tone and no company personalization."
5. [READ] Load `{project-root}/_lr/sync/shared-data/jd-profile.yaml`.
   - VALIDATE that the following required fields exist:
     - `jd_profile.company` (non-empty string)
     - `jd_profile.role_title` (non-empty string)
     - `jd_profile.requirements.hard` (array with >= 1 entry)
     - `jd_profile.persona_fit_primary` (non-empty string)
   - If validation fails: STOP and instruct user to run jd-optimize first.
6. [STORE] Set session variables:
   - `{company_name}` = `jd_profile.company`
   - `{role_title}` = `jd_profile.role_title`
   - `{company_stage}` = `jd_profile.company_stage`
   - `{tone_descriptor}` = `company_brief.tone_descriptor` or "formal"
   - `{brand_values}` = `company_brief.brand_values[]` or []
   - `{cautions}` = `company_brief.cautions[]` or []
```

---

#### 5.1.2 MODIFY: `step-out-01-ingest.md`

**File**: `linkright/_lr/sync/workflows/outbound-campaign/steps-c/step-out-01-ingest.md`
**Agent**: sync-parser (Orion)
**Change**: Extract recruiter `tone_descriptor` and `company_stage` signals

**Additions** (append to section "2. Preliminary Parsing", after existing bullets):

```markdown
  - **Tone Indicators**: Language patterns from the recruiter's profile:
    - Formal indicators: "esteemed", "we seek", "distinguished candidate"
    - Conversational indicators: "we're looking for", "you'll love", "come join"
    - Technical indicators: "must have experience with", "strong background in"
    - Vision-driven indicators: "mission to", "changing the world", "disrupt"
  - **Company Stage Signals**: Extracted from company description:
    - FAANG indicators: Fortune 500, >10,000 employees, public company
    - Enterprise indicators: established brand, structured teams
    - Scale-up indicators: Series B+, rapid growth, "building the team"
    - Startup indicators: seed/Series A, small team, "wear many hats"

## OUTPUT CONTRACT UPDATE
- `recruiter_profile.json` now includes:
  - `recruiter_tone_indicators[]`: list of detected tone signals
  - `company_stage_inferred`: inferred company stage from profile
```

---

#### 5.1.3 MODIFY: `step-out-02-strategy.md`

**File**: `linkright/_lr/sync/workflows/outbound-campaign/steps-c/step-out-02-strategy.md`
**Agent**: sync-publicist (Lyric) -- R/A; sync-linker (Atlas) -- C
**Change**: Add explicit `selected_tone` output and `company_brief` consumption

**Additions** (append to section "3. Define Tone"):

```markdown
  - Resolve tone from multiple signals (priority order):
    1. `company_brief.tone_descriptor` (highest priority -- explicit research)
    2. `recruiter_profile.recruiter_tone_indicators[]` (inferred from parsing)
    3. Default: "formal"
  - Map resolved tone to output labels:
    | `tone_descriptor` | `selected_tone` Label | Writing Style |
    |-------------------|----------------------|---------------|
    | `formal` | Formal | Executive language, third-person where possible |
    | `conversational` | Conversational | Personal, first-person, warm |
    | `technical` | Technical | Engineering-first, metric-heavy |
    | `vision-driven` | Vision-Driven | Mission-oriented, impact language |

## 4. Company Brief Integration

- Load `company_brief.brand_values[]` into strategy context.
- Load `company_brief.cautions[]` as negative constraints.
- These will be passed to step-out-03 for cover letter personalization.

## OUTPUT CONTRACT UPDATE
- `outreach_strategy.json` now includes:
  - `selected_tone`: "Formal|Conversational|Technical|Vision-Driven"
  - `tone_source`: "company_brief|recruiter_profile|default"
  - `brand_values[]`: list of company values for hook construction
  - `cautions[]`: list of topics to avoid
  - `the_bridge`: { signal_id, title, xyz_metric, persona_relevance }
```

---

#### 5.1.4 REWRITE: `step-out-03-cover-letter.md`

**File**: `linkright/_lr/sync/workflows/outbound-campaign/steps-c/step-out-03-cover-letter.md`
**Current State**: 50 lines, incomplete 3-element structure (Hook/Bridge/Synergy)
**Agent**: sync-publicist (Lyric) -- R/A

```markdown
# Step 03: Draft Cover Letter

**Goal:** Generate a signal-aligned, company-personalized cover letter
using the 3-paragraph structure with strict word count constraints.

---

## DEPENDENCIES
- Requires: `step-out-02-strategy` output (`outreach_strategy.json`)
- Requires: `lr-config.yaml` session context
- Requires: `_lr/sync/shared-data/jd-profile.yaml`
- Requires: `_lr/sync/shared-data/company_brief.yaml` (optional)

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER generate a cover letter without outreach_strategy.json.
STOP: NEVER use generic opening lines ("I am writing to apply for...").
GO: ALWAYS include at least 1 XYZ-format metric in Paragraph 2.
GO: ALWAYS stay within 300-400 words.
FORBIDDEN: Mentioning salary, benefits, or compensation.
FORBIDDEN: Generic phrases: "passionate team player",
"results-driven professional", "leveraging synergies".

## CONTEXT BOUNDARIES
- Available configurations from parent: {system_version}, {mode}
- Available from strategy: {selected_tone}, {the_bridge}, {brand_values},
  {cautions}

## EXECUTION PROTOCOLS
1. [READ] Load outreach strategy and company brief.
2. [ANALYZE] Draft 3-paragraph cover letter with tone injection.
3. [VALIDATE] Word count check + signal presence check.

## INPUT CONTRACT
- `outreach_strategy.json`: selected_tone, the_bridge, brand_values[],
  cautions[]
- `jd-profile.yaml`: company, role_title, requirements.hard[],
  persona_fit_primary
- `company_brief.yaml`: tone_descriptor, brand_values[], cautions[]
- `recruiter_profile.json`: full_name, company, pain_points[]

## OUTPUT CONTRACT
- `cover_letter.md`: 300-400 word cover letter in markdown format
- Written to: `outbound-campaign/artifacts/cover_letter.md`

---

## 1. Tone Injection

- Use your internal **Lyric** (`sync-publicist`) persona.
- Apply tone from `outreach_strategy.json.selected_tone`:

  | Tone | Voice Characteristics |
  |------|----------------------|
  | Formal | Polished, measured. "I was pleased to note..." |
  | Conversational | Warm, direct. "What caught my eye was..." |
  | Technical | Precise, metric-heavy. "Having architected..." |
  | Vision-Driven | Aspirational, mission-first. "The opportunity to..." |

## 2. Three-Paragraph Structure

### Paragraph 1: "The Hook" (60-80 words)

- Open with a specific reference to the company or recruiter.
- Sources for the hook (choose the most relevant):
  - A recent company announcement, blog post, or product launch
  - A specific pain point identified in `recruiter_profile.json`
  - A shared professional background or mutual connection
  - A specific `brand_values[]` entry that resonates authentically
- End the paragraph with a natural transition to the user's relevance.

### Paragraph 2: "The Why Me?" (120-160 words)

- Lead with "The Bridge" signal from `outreach_strategy.json.the_bridge`.
- Format the Bridge signal in XYZ format:
  "Accomplished [X] as measured by [Y], by doing [Z]."
- Connect at least 2 P0 requirements from `jd_profile.requirements.hard[]`
  to specific career signals.
- Include at least 1 quantitative metric (revenue, percentage,
  user count, etc.).
- Explicitly reference the user's `persona_fit_primary` alignment.

### Paragraph 3: "The Why Them?" (100-140 words)

- Share internal motivations NOT visible on the resume:
  - Why this specific company (not just "a great company")
  - What excites the user about the team/product/mission
  - A forward-looking statement about contribution
- Reference at least 1 `brand_values[]` entry naturally (not forced).
- Close with a soft call-to-action:
  "I would welcome the opportunity to discuss how my experience
  in {domain} aligns with {company}'s goals."
- AVOID: asking for the job directly, mentioning other applications.

## 3. Constraint Enforcement

- After drafting, count words.
- If < 300 words: expand "The Why Them?" paragraph with additional
  company-specific detail.
- If > 400 words: compress "The Why Me?" paragraph by removing the
  weakest signal reference.
- Target: 340-360 words (sweet spot).

## 4. Guardrail Check

Before presenting to user, verify:
- [ ] No generic phrases from the FORBIDDEN list
- [ ] At least 1 XYZ metric present
- [ ] Company name mentioned at least twice
- [ ] Recruiter/HM name mentioned in hook (if available)
- [ ] No `cautions[]` topics referenced
- [ ] Tone is consistent throughout (no register shifts)

## 5. User Review

Present the draft to the user. Ask:
"Would you like to [C] Continue with this draft,
[V] Generate tone variants, or [E] Edit specific sections?"

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 03b: Cover Letter Variants.
- **[V] Variants**: Proceed to Step 03b: Cover Letter Variants.
- **[E] Edit**: User provides inline edits, then re-validate.
- **[P] Previous**: back to Strategy.
- **[A] Abort**: Exit the workflow.
```

---

#### 5.1.5 CREATE: `step-out-03b-cover-letter-variants.md`

**File**: `linkright/_lr/sync/workflows/outbound-campaign/steps-c/step-out-03b-cover-letter-variants.md`
**Agent**: sync-publicist (Lyric) -- R/A

```markdown
# Step 03b: Cover Letter Variants

**Goal:** Generate 2 alternative tone variants of the cover letter
for user selection, keeping factual content identical.

---

## DEPENDENCIES
- Requires: `step-out-03-cover-letter` output (`cover_letter.md`)
- Requires: `outreach_strategy.json` (selected_tone, the_bridge)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER change factual content between variants.
GO: ALWAYS produce exactly 2 variants plus the original.
FORBIDDEN: Adding new claims or metrics not in the original.

## EXECUTION PROTOCOLS
1. [READ] Load the approved cover letter draft from step-03.
2. [ANALYZE] Generate 2 tone variants.
3. [VALIDATE] Present all 3 options for user selection.

## INPUT CONTRACT
- `cover_letter.md`: Original draft from step-03
- `outreach_strategy.json`: for tone context

## OUTPUT CONTRACT
- `cover_letter_variants.json`: Array of 3 variants with metadata
- Written to: `outbound-campaign/artifacts/cover_letter_variants.json`

---

## 1. Variant Generation Rules

- Use your internal **Lyric** (`sync-publicist`) persona.
- The original draft uses tone T1 (from `selected_tone`).
- Generate Variant A using a contrasting tone from the 4 available tones.
- Generate Variant B using the remaining most-different tone.

  | Original Tone | Variant A Tone | Variant B Tone |
  |---------------|---------------|---------------|
  | Formal | Conversational | Technical |
  | Conversational | Technical | Formal |
  | Technical | Conversational | Vision-Driven |
  | Vision-Driven | Formal | Conversational |

- **Invariants across all variants** (these must NOT change):
  - The Bridge signal and XYZ metric
  - Company name and role title
  - P0 requirement references
  - Word count (must remain within 300-400)

- **What changes between variants**:
  - Sentence structure and connective language
  - Opening hook approach
  - Adjective and verb choices
  - Level of formality in the call-to-action

## 2. Output Format

```json
{
  "variants": [
    {
      "id": "original",
      "tone": "{selected_tone}",
      "content": "{full cover letter text}",
      "word_count": 0
    },
    {
      "id": "variant_a",
      "tone": "{variant_a_tone}",
      "content": "{full cover letter text}",
      "word_count": 0
    },
    {
      "id": "variant_b",
      "tone": "{variant_b_tone}",
      "content": "{full cover letter text}",
      "word_count": 0
    }
  ],
  "generated_at": "{ISO timestamp}"
}
```

## 3. User Selection

Present all 3 variants side by side (or sequentially) with tone labels.
Ask: "Select [1] Original ({tone}), [2] Variant A ({tone}),
or [3] Variant B ({tone})."

Store the selected variant as the active cover letter for validation.

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 03c: Cover Letter Validation.
- **[P] Previous**: back to Cover Letter Draft.
- **[A] Abort**: Exit the workflow.
```

---

#### 5.1.6 CREATE: `step-out-03c-cover-letter-validation.md`

**File**: `linkright/_lr/sync/workflows/outbound-campaign/steps-c/step-out-03c-cover-letter-validation.md`
**Agent**: sync-publicist (Lyric) -- A; sync-refiner (Veda) -- C

```markdown
# Step 03c: Cover Letter Validation

**Goal:** Automated validation of the selected cover letter variant
against word count, signal density, tone consistency, and guardrails.

---

## DEPENDENCIES
- Requires: `step-out-03b-cover-letter-variants` output (selected variant)
- Requires: `outreach_strategy.json`
- Requires: `jd-profile.yaml`
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER proceed to In-Mail step with a FAIL validation.
GO: ALWAYS re-draft on FAIL and re-validate.

## EXECUTION PROTOCOLS
1. [READ] Load the selected cover letter variant.
2. [ANALYZE] Run 7 automated validation checks.
3. [VALIDATE] Generate PASS/FAIL report.

## INPUT CONTRACT
- Selected cover letter text (from step-03b or step-03 if variants skipped)
- `outreach_strategy.json`
- `jd-profile.yaml`

## OUTPUT CONTRACT
- `cover_letter_final.md`: Validated final cover letter
- `cover_letter_validation.json`: Validation report
- Written to: `outbound-campaign/artifacts/`

---

## 1. Validation Checks

| # | Check | Criterion | PASS Condition |
|---|-------|-----------|---------------|
| 1 | **Word Count** | 300-400 words | `300 <= word_count <= 400` |
| 2 | **XYZ Metric Present** | At least 1 quantitative metric | Number or percentage found in Paragraph 2 |
| 3 | **Bridge Reference** | The Bridge signal is mentioned | `the_bridge.title` substring found in text |
| 4 | **Company Name** | Company mentioned at least 2x | `jd_profile.company` appears >= 2 times |
| 5 | **Tone Consistency** | No register shifts mid-letter | Tone classification of each paragraph matches `selected_tone` |
| 6 | **Generic Phrase Absence** | No forbidden phrases | None of: "passionate team player", "results-driven", "leveraging synergies", "I am writing to apply" |
| 7 | **Caution Topics** | No caution topics mentioned | None of `company_brief.cautions[]` found in text |

## 2. Validation Report

```json
{
  "cover_letter_id": "cl-{uuid}",
  "selected_variant": "original|variant_a|variant_b",
  "tone": "{tone}",
  "word_count": 0,
  "checks": [
    { "id": 1, "name": "word_count", "result": "PASS|FAIL", "value": 0 },
    { "id": 2, "name": "xyz_metric", "result": "PASS|FAIL", "detail": "" },
    { "id": 3, "name": "bridge_reference", "result": "PASS|FAIL", "detail": "" },
    { "id": 4, "name": "company_mentions", "result": "PASS|FAIL", "count": 0 },
    { "id": 5, "name": "tone_consistency", "result": "PASS|WARN|FAIL", "detail": "" },
    { "id": 6, "name": "generic_absence", "result": "PASS|FAIL", "found": [] },
    { "id": 7, "name": "caution_topics", "result": "PASS|FAIL", "found": [] }
  ],
  "overall": "PASS|FAIL",
  "validated_at": "{ISO timestamp}"
}
```

## 3. On FAIL

- If any check is FAIL:
  - Identify the specific issue
  - Auto-fix if possible (word count trim/expand, phrase replacement)
  - Re-validate after fix
  - If auto-fix not possible, return to step-out-03 for manual edit

## 4. On PASS

- Write `cover_letter_final.md` to artifacts directory.
- Inform lr-tracker (Navi) of artifact creation for session logging.
- Present: "Cover letter validated. {word_count} words, {tone} tone,
  all checks passed."

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 04: Draft In-Mail.
- **[P] Previous**: back to Cover Letter Variants.
- **[A] Abort**: Exit the workflow.
```

---

#### 5.1.7 MODIFY: `step-01-validate.md` (Validation Path)

**File**: `linkright/_lr/sync/workflows/outbound-campaign/steps-v/step-01-validate.md`
**Current State**: 7 lines, generic
**Change**: Add cover-letter-specific validation criteria

**Additions** (append to existing content):

```markdown
## COVER LETTER VALIDATION CRITERIA (Release 3)

4. [VERIFY] Cover letter specific checks:
   - Word count within 300-400 range
   - XYZ metric signal density >= 1 per cover letter
   - Bridge signal reference present
   - Tone matches selected_tone from outreach_strategy.json
   - No generic phrases from forbidden list
   - Company name mentioned >= 2 times
   - No caution topics from company_brief.cautions[]

5. [VERIFY] Cover letter variants artifact exists:
   - `cover_letter_variants.json` present in artifacts/
   - `cover_letter_final.md` present in artifacts/
   - `cover_letter_validation.json` shows overall: "PASS"
```

---

### 5.2 outbound-campaign `workflow.yaml` Update

**File**: `linkright/_lr/sync/workflows/outbound-campaign/workflow.yaml`
**Change type**: MODIFY (add company_brief input + dependencies)

Updated:
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
    source: "{project-root}/_lr/sync/shared-data/jd-profile.yaml"
  contacts:
    pattern: "data/contacts.csv"
    strategy: FULL_LOAD
  company_brief:
    pattern: "data/company_brief.yaml"
    strategy: FULL_LOAD
    source: "{project-root}/_lr/sync/shared-data/company_brief.yaml"
    optional: true
dependencies:
  - workflow: jd-optimize
    provides: [jd-profile.yaml, company_brief.yaml]
    via: "step-06b-export-data-contract"
  - agent: flex-publicist
    step: step-out-06-profile-updates
    module: flex
```

### 5.3 outbound-campaign `checklist.md` Update

**Additions** to the existing checklist:

```markdown
## 1b. Cover Letter Phase (Release 3)

- [ ] Cover letter follows 3-paragraph structure (Hook / Why Me / Why Them).
- [ ] Word count within 300-400 range.
- [ ] At least 1 XYZ-format metric included.
- [ ] Bridge signal referenced explicitly.
- [ ] Tone matches selected_tone from strategy step.
- [ ] No generic or forbidden phrases used.
- [ ] Company name mentioned at least twice.
- [ ] Tone variants generated (2 alternatives + original).
- [ ] Final variant selected and validated.
- [ ] cover_letter_validation.json shows overall: PASS.
```

### 5.4 outbound-campaign `instructions.md` Update

**Additions** to the existing instructions:

```markdown
## Cover Letter Protocol (Release 3)

4. **Three-Paragraph Structure**:
   - Paragraph 1: "The Hook" -- company/recruiter-specific opening (60-80 words)
   - Paragraph 2: "The Why Me?" -- Bridge signal with XYZ metrics (120-160 words)
   - Paragraph 3: "The Why Them?" -- internal motivations, company values (100-140 words)
5. **Word Count Guardrail**: STRICT 300-400 words. Target 340-360. If over,
   compress "Why Me" paragraph. If under, expand "Why Them" paragraph.
6. **Tone Integration**: Consume `tone_descriptor` from company_brief.yaml.
   Apply consistently across all 3 paragraphs. No register shifts.
7. **Variant Generation**: Always offer 2 tone alternatives alongside the
   primary draft. Keep factual content identical across variants.
```

### 5.5 New Static Files Required for outbound-campaign

| File | Purpose |
|------|---------|
| `outbound-campaign/templates/cover_letter.template.md` | Cover letter output template |

Template content:

```markdown
# Cover Letter: {user_name} -> {company_name} ({role_title})

**Tone**: {selected_tone}
**Generated**: {ISO timestamp}
**Bridge Signal**: {the_bridge.title}

---

{cover_letter_content}

---

*Generated by Linkright Sync v4.0 | Outbound Campaign Workflow*
*Variant: {variant_id} | Word Count: {word_count}*
```

---

## 6. Workflow 3: portfolio-deploy -- Modifications

**Workflow directory**: `linkright/_lr/sync/workflows/portfolio-deploy/`
**Current step count**: 5 steps-c (01, 01b, port-01, port-02, port-03), 2 steps-e, 1 steps-v
**Post-modification step count**: 9 steps-c (+4 new), 2 steps-e, 1 steps-v

### 6.1 Enhancement: Slides (Steps Modified + New)

---

#### 6.1.1 MODIFY: `step-port-01-compile.md`

**File**: `linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01-compile.md`
**Current State**: 36 lines, basic signal query + JSON compilation
**Agent**: sync-styler (Cora) -- R/A; sync-linker (Atlas) -- R (signal query)

**Full replacement content**:

```markdown
# Step 01: Compile Frontend Slides

**Goal:** Transform raw career signals into a validated, ranked presentation
payload for the "Why Me?" slide deck with explicit schema compliance.

---

## DEPENDENCIES
- Requires: `step-01-load-session-context` output (session variables)
- Requires: `lr-config.yaml` session context
- Requires: MongoDB connection (lr-signals collection, 1536-dim cosine)

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER compile slides without querying career signals.
GO: ALWAYS select exactly 5 signals (no more, no fewer).
GO: ALWAYS rank by cosine similarity to Strategic Gravity.
FORBIDDEN: Including signals with impact_rank below threshold (< 0.6 similarity).

## CONTEXT BOUNDARIES
- Available configurations from parent: {system_version}, {mode}
- Available from config: {user_name}, {strategic_gravity}, {role_identity}

## EXECUTION PROTOCOLS
1. [READ] Query MongoDB for career signals.
2. [ANALYZE] Rank by cosine similarity and compile JSON payload.
3. [VALIDATE] Schema-check the output and present to user.

## INPUT CONTRACT
- MongoDB `lr-signals` collection
- `lr-config.yaml`: user_name, strategic_gravity (Role Identity)
- Target role context (if available from jd-profile.yaml)

## OUTPUT CONTRACT
- `slides_content.json`: Structured slide payload
- Written to: `portfolio-deploy/artifacts/slides_content.json`

---

## 1. Signal Querying

- Use your internal **Atlas** (`sync-linker`) persona to query MongoDB.
- Query the `lr-signals` collection using cosine similarity search
  (1536-dim embeddings) against the user's primary Strategic Gravity vector.
- Retrieve the top 10 candidate signals.

## 2. Signal Selection and Ranking

- Use your internal **Cora** (`sync-styler`) persona to rank signals.
- From the top 10 candidates, select the final 5 based on:
  1. Cosine similarity score (primary sort, descending)
  2. Metric presence: prefer signals with quantitative XYZ metrics
  3. Diversity: avoid selecting 2+ signals from the same role/company
  4. Recency: prefer more recent signals for tie-breaking
- Assign `impact_rank` 1-5 (1 = highest impact).
- Assign `role_alignment` from the signal's Strategic Gravity tag.

## 3. Payload Construction

- Format each selected signal into the `slides_content.json` schema:

```json
{
  "slides": [
    {
      "signal_id": "sig-{uuid}",
      "title": "{Project/Achievement Name}",
      "sections": {
        "the_problem": "What was broken?",
        "the_process": "How did you fix it?",
        "the_metric": "$5M revenue growth / 40% latency reduction",
        "the_legacy": "What remains now that you are gone?"
      },
      "role_alignment": "{Strategic Gravity tag}",
      "impact_rank": 1
    }
  ],
  "metadata": {
    "user_name": "{USER_NAME}",
    "target_role": "{TARGET_JOB_TITLE}",
    "generated_at": "{ISO timestamp}",
    "signal_count": 5,
    "top_gravity": "{Role Identity}"
  }
}
```

## 4. Schema Validation

- Verify the JSON payload:
  - [ ] `slides` array has exactly 5 entries
  - [ ] Each slide has all 4 `sections` keys populated (non-empty strings)
  - [ ] Each slide has a valid `signal_id` (format: `sig-{uuid}`)
  - [ ] `impact_rank` values are unique integers 1-5
  - [ ] `metadata.signal_count` equals 5
  - [ ] `metadata.user_name` is non-empty

## 5. User Approval

Show the compiled payload summary to the user:
- List all 5 signals with title and impact_rank
- Show the top metric from each signal
- Ask: "Approve this selection or [S]wap any signal?"

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 01b: Style Selection.
- **[S] Swap**: User selects a signal to replace, show alternatives.
- **[A] Abort**: Exit the workflow.
```

---

#### 6.1.2 CREATE: `step-port-01b-style-selection.md`

**File**: `linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01b-style-selection.md`
**Agent**: sync-styler (Cora) -- R/A

```markdown
# Step 01b: Style Selection -- Slide Presentation Theme

**Goal:** Select and configure the visual style for the slide deck,
applying Sync ocean-themed design tokens with optional company accent overlay.

---

## DEPENDENCIES
- Requires: `step-port-01-compile` output (`slides_content.json`)
- Requires: `lr-config.yaml` session context
- Optional: `_lr/sync/shared-data/company_brief.yaml` (for company accent)

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER render slides without a confirmed style selection.
GO: ALWAYS default to "Abyssal Depth" preset if no user preference.
FORBIDDEN: Using any of the 12 stock frontend-slides presets directly
(they do not match Sync design language).

## EXECUTION PROTOCOLS
1. [READ] Load Sync design tokens and optional company brief.
2. [ANALYZE] Configure Abyssal Depth preset with company overlay.
3. [VALIDATE] Present style selection to user for confirmation.

## INPUT CONTRACT
- `slides_content.json` from step-port-01
- Sync design tokens from `SYNC-DESIGN-AND-TECHNICAL-SPECS.md`
- `company_brief.yaml` (optional): `brand.color_primary`

## OUTPUT CONTRACT
- `selected_style.json`: Style configuration for slide rendering
- Written to: `portfolio-deploy/artifacts/selected_style.json`

---

## 1. Load Design Tokens

- Use your internal **Cora** (`sync-styler`) persona.
- Load the Sync "Abyssal Depth" preset:

```css
/* Core Brand Tokens */
--sync-teal-core:    #0E9E8E   /* Deep ocean current. Primary. */
--sync-coral-core:   #D9705A   /* Breaking wave. Energy accent. */
--sync-gold-core:    #C8973A   /* Sunlight on water. Achievement. */
--sync-peach-core:   #E8A882   /* Sea at golden hour. Warmth. */
--sync-beige-core:   #D4C5A9   /* Seafloor sand. Neutral warmth. */
--sync-silver-core:  #A8BFC0   /* Sea foam. Borders & metadata. */

/* Dark Mode backgrounds */
--sync-bg-base:      #091614   /* True abyss. */
--sync-bg-surface:   #0F1F1C   /* One layer up. */
--sync-bg-elevated:  #122520   /* Cards, panels. */
```

## 2. Dual-Layer Theming

- **Base layer**: Always the Sync ocean theme (Abyssal Depth).
- **Overlay layer** (optional): Company accent color.

If `company_brief.yaml` exists and `brand.color_primary` is non-null:
  - Apply company accent to:
    - Interactive elements (links, hover states)
    - CTA buttons
    - Slide transition accent lines
  - NEVER override Sync background colors with company colors.
  - NEVER override Sync text colors with company colors.
  - Accessibility check: company accent vs. `--sync-bg-base` >= 4.5:1.

If no company brief:
  - Use `--sync-coral-core` (#D9705A) as the accent overlay.

## 3. Output Style Configuration

Write `selected_style.json`:

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
    "enabled": true|false,
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

## 4. User Confirmation

Present the style selection:
- "Using Abyssal Depth (Sync ocean theme) as base."
- If company overlay: "Company accent {color} applied to interactive elements."
- Ask: "[C]onfirm this style or [M]odify accent color?"

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 01c: Render Slides HTML.
- **[M] Modify**: User adjusts accent color, re-validate contrast.
- **[P] Previous**: back to Compile.
- **[A] Abort**: Exit the workflow.
```

---

#### 6.1.3 CREATE: `step-port-01c-render-slides-html.md`

**File**: `linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01c-render-slides-html.md`
**Agent**: sync-styler (Cora) -- R/A

```markdown
# Step 01c: Render Slides HTML

**Goal:** Generate a self-contained HTML slide deck from the compiled
content and selected style, with zero external dependencies.

---

## DEPENDENCIES
- Requires: `step-port-01-compile` output (`slides_content.json`)
- Requires: `step-port-01b-style-selection` output (`selected_style.json`)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER generate HTML with external CSS or JS references.
GO: ALWAYS inline all CSS and JS within the single HTML file.
GO: ALWAYS include viewport-responsive design.
FORBIDDEN: External font imports, CDN references, external image URLs
without fallback.

## EXECUTION PROTOCOLS
1. [READ] Load slides content and style configuration.
2. [ANALYZE] Generate complete HTML with inline CSS/JS.
3. [VALIDATE] Verify self-containment and responsiveness.

## INPUT CONTRACT
- `slides_content.json`: 5 slide objects with Problem/Process/Metric/Legacy
- `selected_style.json`: Abyssal Depth tokens + company overlay

## OUTPUT CONTRACT
- `slides_deck.html`: Self-contained HTML slide presentation
- Written to: `portfolio-deploy/artifacts/slides_deck.html`

---

## 1. HTML Generation

- Use your internal **Cora** (`sync-styler`) persona.
- Generate a single HTML file that renders 5 career signal slides.

### Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{user_name} | Career Highlights</title>
  <style>
    /* Sync Abyssal Depth tokens injected here */
    /* Company overlay tokens injected here */
    /* Typography rules injected here */
    /* Slide layout CSS injected here */
    /* Animation CSS injected here */
    /* Viewport-responsive breakpoints injected here */
  </style>
</head>
<body>
  <!-- Title slide -->
  <section class="slide slide-title">
    <h1>{user_name}</h1>
    <h2>{target_role} | Career Highlights</h2>
    <p class="gravity-tag">{top_gravity}</p>
  </section>

  <!-- Signal slides (5x) -->
  <section class="slide slide-signal" data-rank="{impact_rank}">
    <h2 class="signal-title">{title}</h2>
    <div class="signal-section problem">
      <h3>The Problem</h3>
      <p>{the_problem}</p>
    </div>
    <div class="signal-section process">
      <h3>The Process</h3>
      <p>{the_process}</p>
    </div>
    <div class="signal-section metric">
      <h3>The Metric</h3>
      <p class="metric-highlight">{the_metric}</p>
    </div>
    <div class="signal-section legacy">
      <h3>The Legacy</h3>
      <p>{the_legacy}</p>
    </div>
  </section>

  <!-- Closing slide -->
  <section class="slide slide-close">
    <h2>Let us connect.</h2>
    <p>{contact_info}</p>
  </section>

  <script>
    /* Navigation JS: arrow keys, click, swipe */
    /* Slide transition logic */
    /* Progress indicator */
  </script>
</body>
</html>
```

## 2. CSS Requirements

- All CSS variables from `selected_style.json.tokens` injected as `:root` vars.
- Slide backgrounds use `--sync-bg-base` to `--sync-bg-elevated` gradient.
- Metric highlights use `--sync-gold-core` color.
- Section dividers use `--sync-teal-core` with 1px solid border.
- Company overlay accent applied only to interactive elements.
- Responsive breakpoints:
  - Desktop: >= 1024px (full slide layout)
  - Tablet: 768px - 1023px (stacked sections)
  - Mobile: < 768px (single column, scroll)

## 3. JS Requirements

- Keyboard navigation: left/right arrows, space for next.
- Click/tap navigation: click anywhere to advance.
- Touch swipe support for mobile.
- Progress indicator bar at bottom.
- No external JS libraries. Vanilla JS only.

## 4. Self-Containment Verification

Before writing output, verify:
- [ ] No `<link rel="stylesheet">` tags with external URLs
- [ ] No `<script src="">` tags with external URLs
- [ ] No `@import` statements in CSS
- [ ] No `url()` references to external resources
- [ ] File renders correctly when opened from local filesystem

## 5. Output

- Write `slides_deck.html` to `portfolio-deploy/artifacts/`.
- Report file size to user.
- If file size > 500KB, warn: "Slide deck is {size}. Consider
  optimizing embedded content."

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 02: Beyond the Papers UI.
- **[P] Previous**: back to Style Selection.
- **[A] Abort**: Exit the workflow.
```

---

### 6.2 Enhancement: Beyond the Papers (Step Rewrite + New)

---

#### 6.2.1 REWRITE: `step-port-02-beyond-the-papers.md`

**File**: `linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md`
**Current State**: 34 lines, minimal data ingestion
**Agent**: sync-styler (Cora) -- R/A

```markdown
# Step 02: Beyond the Papers UI

**Goal:** Map the user's authentic character depth to structured project
cards, hobby cards, and a Life Journey timeline with validated schemas.

---

## DEPENDENCIES
- Requires: `step-port-01c-render-slides-html` output (`slides_deck.html`)
- Requires: `lr-config.yaml` session context
- Optional: `portfolio-deploy/data/projects-source.yaml` (user-provided)

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER generate portfolio content without user input or source data.
GO: ALWAYS include at least 3 project cards.
GO: ALWAYS include at least 1 hobby/interest card.
FORBIDDEN: Fabricating project details not provided by the user.

## CONTEXT BOUNDARIES
- Available configurations from parent: {system_version}, {mode}

## EXECUTION PROTOCOLS
1. [READ] Load project and hobby data from source file or user input.
2. [ANALYZE] Structure into portfolio_content.json schema.
3. [VALIDATE] Schema-check and present to user.

## INPUT CONTRACT
- `projects-source.yaml` (if available): User-provided project/hobby data
- User conversation input (if no source file)
- Career signals from MongoDB (for project impact summaries)

## OUTPUT CONTRACT
- `portfolio_content.json`: Structured portfolio content
- Written to: `portfolio-deploy/artifacts/portfolio_content.json`

---

## 1. Data Ingestion

- Use your internal **Cora** (`sync-styler`) persona.
- Check for `portfolio-deploy/data/projects-source.yaml`:
  - If exists: parse structured data from file.
  - If not: prompt user for project and hobby information.

### Projects Source Schema (if file-based):

```yaml
projects:
  - title: "Project Name"
    description: "One-liner impact summary"
    thumbnail_url: "path/to/thumbnail.png"
    external_link: "https://..."
    tech_stack: ["React", "Node.js"]
    impact_summary: "XYZ format metric"

hobbies:
  - category: "Photography"
    narrative_hook: "Finding patterns in chaos"
    icon: "camera"

life_journey:
  - year: 2020
    milestone: "Led migration to microservices at Company X"
    type: "career"
```

## 2. Project Card Construction

For each project, construct a card object:

```json
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
```

- If user provides minimal data, enrich from career signals:
  - Pull `impact_summary` from matching MongoDB signal
  - Infer `tech_stack` from signal metadata

## 3. Hobby/Interest Card Construction

For each hobby, construct a card object:

```json
{
  "category": "Photography",
  "narrative_hook": "Finding patterns in chaos",
  "icon": "camera"
}
```

- The `narrative_hook` should be a compelling one-liner that hints at
  character depth (not just "I like photography").
- The `icon` maps to a simple icon name for the portfolio UI.

## 4. Life Journey Timeline Construction

For each milestone:

```json
{
  "year": 2020,
  "milestone": "Led migration to microservices at Company X",
  "type": "career|personal|education"
}
```

- Sort entries by year ascending.
- Ensure at least 3 timeline entries across different `type` values.
- If user provides fewer than 3, prompt for additional milestones.

## 5. Assemble portfolio_content.json

Combine all sections:

```json
{
  "projects": [ ... ],
  "hobbies": [ ... ],
  "life_journey": [ ... ],
  "video_placeholder": {
    "enabled": false,
    "label": "Life Narrative - Coming Soon"
  }
}
```

## 6. User Review

Present the portfolio content summary:
- List project cards with titles and impact summaries
- List hobby cards with narrative hooks
- List timeline milestones chronologically
- Ask: "[C]onfirm, [E]dit a section, or [A]dd more items?"

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 02b: Life Narrative Visualization.
- **[E] Edit**: User modifies specific entries.
- **[P] Previous**: back to Render Slides HTML.
- **[A] Abort**: Exit the workflow.
```

---

#### 6.2.2 CREATE: `step-port-02b-life-narrative-video.md`

**File**: `linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02b-life-narrative-video.md`
**Agent**: sync-styler (Cora) -- R; lr-tracker (Navi) -- I

```markdown
# Step 02b: Life Narrative Visualization

**Goal:** Generate a static Life Journey timeline visualization from
timeline entries. Placeholder step for future video integration.

---

## DEPENDENCIES
- Requires: `step-port-02-beyond-the-papers` output
  (`portfolio_content.json`)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
GO: ALWAYS generate timeline HTML even if video is disabled.
FORBIDDEN: Generating actual video content in this release
(placeholder only).

## EXECUTION PROTOCOLS
1. [READ] Load life_journey entries from portfolio_content.json.
2. [ANALYZE] Generate timeline HTML visualization.
3. [VALIDATE] Verify timeline renders correctly.

## INPUT CONTRACT
- `portfolio_content.json.life_journey[]`: Array of milestone objects

## OUTPUT CONTRACT
- `life_journey.html`: Self-contained timeline HTML section
- Written to: `portfolio-deploy/artifacts/life_journey.html`

---

## 1. Timeline Generation

- Use your internal **Cora** (`sync-styler`) persona.
- Generate a vertical timeline HTML section using Sync design tokens:
  - Timeline line: `--sync-teal-core` (#0E9E8E), 2px solid
  - Milestone nodes: circles colored by type:
    - `career`: `--sync-teal-core`
    - `personal`: `--sync-coral-core`
    - `education`: `--sync-gold-core`
  - Milestone cards: `--sync-bg-elevated` background
  - Text: `--sync-silver-core` for year, white for milestone text

## 2. HTML Structure

```html
<section class="life-journey" id="life-journey">
  <h2>Life Journey</h2>
  <div class="timeline">
    <!-- Repeat for each milestone -->
    <div class="timeline-entry" data-type="{type}" data-year="{year}">
      <div class="timeline-node"></div>
      <div class="timeline-card">
        <span class="timeline-year">{year}</span>
        <p class="timeline-milestone">{milestone}</p>
        <span class="timeline-type-badge">{type}</span>
      </div>
    </div>
  </div>
  <!-- Video placeholder -->
  <div class="video-placeholder" style="display: none;">
    <p>Life Narrative - Coming Soon</p>
  </div>
</section>
```

## 3. CSS Inline

- All CSS for the timeline section must be inline within a `<style>` tag.
- Responsive: desktop shows alternating left/right, mobile shows
  single column.
- Animations: fade-in on scroll (using IntersectionObserver in JS).

## 4. Output

- Write `life_journey.html` to `portfolio-deploy/artifacts/`.
- This section will be injected into the portfolio template by
  step-port-03-deploy.

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 02c: Portfolio Validation.
- **[P] Previous**: back to Beyond the Papers.
- **[A] Abort**: Exit the workflow.
```

---

#### 6.2.3 CREATE: `step-port-02c-portfolio-validation.md`

**File**: `linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02c-portfolio-validation.md`
**Agent**: sync-styler (Cora) -- A; lr-tracker (Navi) -- I

```markdown
# Step 02c: Portfolio Content Validation

**Goal:** Validate portfolio_content.json and all portfolio artifacts
against schema requirements and content quality standards.

---

## DEPENDENCIES
- Requires: `step-port-02-beyond-the-papers` output
  (`portfolio_content.json`)
- Requires: `step-port-02b-life-narrative-video` output
  (`life_journey.html`)
- Requires: `step-port-01c-render-slides-html` output
  (`slides_deck.html`)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES (READ FIRST)
STOP: NEVER proceed to deploy with a FAIL validation.
GO: ALWAYS check all 8 criteria before passing.

## EXECUTION PROTOCOLS
1. [READ] Load all portfolio artifacts.
2. [ANALYZE] Run 8 validation checks.
3. [VALIDATE] Generate PASS/FAIL report.

## INPUT CONTRACT
- `portfolio_content.json`
- `slides_deck.html`
- `life_journey.html`
- `slides_content.json`

## OUTPUT CONTRACT
- `portfolio_validation.json`: Validation report
- Written to: `portfolio-deploy/artifacts/portfolio_validation.json`

---

## 1. Validation Checks

| # | Check | Criterion | PASS Condition |
|---|-------|-----------|---------------|
| 1 | **Project Card Count** | Minimum 3 projects | `projects.length >= 3` |
| 2 | **Hobby Card Count** | Minimum 1 hobby | `hobbies.length >= 1` |
| 3 | **Timeline Entries** | Minimum 3 milestones | `life_journey.length >= 3` |
| 4 | **Timeline Diversity** | Multiple type values | >= 2 distinct `type` values |
| 5 | **External Links Valid** | All URLs well-formed | Every `external_link` matches URL pattern |
| 6 | **Slides Deck Exists** | HTML file present | `slides_deck.html` file size > 0 |
| 7 | **Slides Self-Contained** | No external deps | No `<link>` or `<script src>` in slides_deck.html |
| 8 | **Life Journey HTML** | Timeline section present | `life_journey.html` file size > 0 |

## 2. Validation Report

```json
{
  "portfolio_id": "port-{uuid}",
  "artifacts_validated": [
    "portfolio_content.json",
    "slides_deck.html",
    "life_journey.html",
    "slides_content.json"
  ],
  "checks": [
    { "id": 1, "name": "project_count", "result": "PASS|FAIL", "count": 0 },
    { "id": 2, "name": "hobby_count", "result": "PASS|FAIL", "count": 0 },
    { "id": 3, "name": "timeline_count", "result": "PASS|FAIL", "count": 0 },
    { "id": 4, "name": "timeline_diversity", "result": "PASS|FAIL", "types": [] },
    { "id": 5, "name": "external_links", "result": "PASS|FAIL", "invalid": [] },
    { "id": 6, "name": "slides_deck", "result": "PASS|FAIL", "size_bytes": 0 },
    { "id": 7, "name": "slides_self_contained", "result": "PASS|FAIL", "violations": [] },
    { "id": 8, "name": "life_journey_html", "result": "PASS|FAIL", "size_bytes": 0 }
  ],
  "overall": "PASS|FAIL",
  "validated_at": "{ISO timestamp}"
}
```

## 3. On FAIL

- Identify failing checks.
- For each failure, provide a specific remediation instruction:
  - "Add {N} more project cards" (check 1)
  - "Add at least 1 hobby/interest card" (check 2)
  - "Fix URL format for: {url}" (check 5)
  - "Re-render slides deck" (check 6/7)
- Return to the relevant step for fixes.

## 4. On PASS

- Confirm to user: "All portfolio artifacts validated. Ready for deployment."
- Log validation result for lr-tracker session tracking.

---

## NEXT ACTION

- **[C] Continue**: Proceed to Step 03: GitHub Pages Push.
- **[P] Previous**: back to Life Narrative.
- **[A] Abort**: Exit the workflow.
```

---

#### 6.2.4 MODIFY: `step-port-03-deploy.md`

**File**: `linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-03-deploy.md`
**Current State**: 36 lines, basic gh-pages push
**Agent**: lr-tracker (Navi) -- R/A
**Change**: Add injection of `slides_deck.html`, `life_journey.html`, and company accent

**Additions** (insert into section "1. Build and Inject"):

```markdown
## 1. Build and Inject (Updated)

- Use your internal **Navi** (`lr-tracker`) persona to combine all
  artifacts with the HTML/CSS templates in `_lr/sync/templates/`.

### Artifact Injection Map

| Artifact | Template Slot | Source Step |
|----------|--------------|------------|
| `slides_content.json` | `<!-- SLOT:SLIDES_DATA -->` | step-port-01 |
| `slides_deck.html` | `<!-- SLOT:SLIDES_DECK -->` | step-port-01c |
| `portfolio_content.json` | `<!-- SLOT:PORTFOLIO_DATA -->` | step-port-02 |
| `life_journey.html` | `<!-- SLOT:LIFE_JOURNEY -->` | step-port-02b |
| `selected_style.json` | `<!-- SLOT:STYLE_TOKENS -->` | step-port-01b |

### Company Accent Injection

- If `company_brief.yaml` exists and a target company is active:
  - Inject `brand.color_primary` as `--company-accent` CSS variable
  - Apply to links, CTA buttons, and hover states only
  - Fallback: Sync default teal `#0E9E8E`
- If no company brief:
  - Use Sync default teal `#0E9E8E` for all accent elements

### Prepare dist/ folder

- Create `dist/` directory structure:
  ```
  dist/
    index.html          (main portfolio page)
    slides.html         (slides_deck.html, standalone)
    assets/
      style.css         (compiled from Sync tokens)
      thumbnails/       (project card images)
  ```
```

---

### 6.3 portfolio-deploy `workflow.yaml` Update

**File**: `linkright/_lr/sync/workflows/portfolio-deploy/workflow.yaml`
**Change type**: MODIFY

Updated:
```yaml
name: portfolio-deploy
description: "Portfolio case study assembly and deployment with slides and theming"
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
  projects_source:
    pattern: "data/projects-source.yaml"
    strategy: FULL_LOAD
    optional: true
  company_brief:
    pattern: "data/company_brief.yaml"
    strategy: SELECTIVE_LOAD
    source: "{project-root}/_lr/sync/shared-data/company_brief.yaml"
    optional: true
output_contracts:
  slides_deck:
    path: "{installed_path}/artifacts/slides_deck.html"
  portfolio_content:
    path: "{installed_path}/artifacts/portfolio_content.json"
  life_journey:
    path: "{installed_path}/artifacts/life_journey.html"
```

### 6.4 portfolio-deploy `checklist.md` Update

**Additions**:

```markdown
## 1b. Slides Phase (Release 3)

- [ ] Top 5 career signals selected by cosine similarity.
- [ ] slides_content.json validates against schema (5 slides, all sections populated).
- [ ] Abyssal Depth style preset applied with Sync design tokens.
- [ ] Company accent overlay applied (if company_brief available).
- [ ] slides_deck.html is self-contained (zero external dependencies).
- [ ] Slide deck renders on desktop, tablet, and mobile viewports.

## 1c. Beyond the Papers Phase (Release 3)

- [ ] Minimum 3 project cards with impact summaries.
- [ ] Minimum 1 hobby/interest card with narrative hook.
- [ ] Life Journey timeline has >= 3 milestones across >= 2 types.
- [ ] life_journey.html generated with Sync design tokens.
- [ ] All external links validated as well-formed URLs.
- [ ] portfolio_validation.json shows overall: PASS.
```

### 6.5 portfolio-deploy `instructions.md` Update

**Additions**:

```markdown
## Slides Protocol (Release 3)

3. **Signal Selection**: Select exactly 5 career signals by cosine
   similarity to Strategic Gravity. Rank 1-5 by impact.
4. **Style Constrained**: Always use the "Abyssal Depth" preset.
   Never use stock frontend-slides presets. Apply company accent
   as overlay only (links, CTAs, hover states).
5. **Self-Contained HTML**: The slides deck must be a single HTML file
   with all CSS and JS inline. Zero external dependencies.

## Beyond the Papers Protocol (Release 3)

6. **Structured Data**: Use projects-source.yaml when available.
   Fall back to conversational data collection if no source file.
7. **Life Journey**: Generate a vertical timeline visualization.
   Video placeholder is disabled for this release.
8. **Validation Gate**: All portfolio artifacts must pass the 8-check
   validation before proceeding to deployment.
```

### 6.6 New Static Files Required for portfolio-deploy

| File | Purpose |
|------|---------|
| `portfolio-deploy/data/abyssal-depth.preset.css` | Sync ocean design tokens as CSS variables |
| `portfolio-deploy/data/portfolio-content.schema.json` | JSON Schema for portfolio_content.json validation |
| `portfolio-deploy/data/projects-source.yaml` | Template for user-provided project data (empty) |

---

## 7. Workflow Interconnections

### 7.1 Cross-Workflow Execution Flow

```
                        PHASE 1: OPTIMIZATION
                        =====================

jd-optimize
  step-01 --> step-06: Core JD optimization (existing)
  step-06b [NEW]: Export data contract
      |
      +--> writes jd-profile.yaml -------> _lr/sync/shared-data/
      +--> writes company_brief.yaml ----> _lr/sync/shared-data/
      |
  step-08 --> step-33: Signal/content pipeline (existing)
  step-34 [REWRITE]: Style theming (reads company_brief from shared-data)
  step-35 [REWRITE]: Style compile
  step-36 [REWRITE]: Style validation


                        PHASE 2: OUTREACH
                        =================

outbound-campaign (depends on jd-optimize completion)
  step-01 [MODIFY]: Load session context
      |
      +--> reads jd-profile.yaml <------ _lr/sync/shared-data/
      +--> reads company_brief.yaml <--- _lr/sync/shared-data/
      |
  step-out-01 [MODIFY]: Ingest recruiter profile
  step-out-02 [MODIFY]: Strategy + tone resolution
      |
      +--> consumes company_brief.tone_descriptor
      +--> consumes company_brief.brand_values[]
      |
  step-out-03 [REWRITE]: Draft cover letter (3-paragraph)
  step-out-03b [NEW]: Cover letter variants
  step-out-03c [NEW]: Cover letter validation
  step-out-04: In-Mail (existing, no changes)
  step-out-05: Connect Invite (existing, no changes)
  step-out-06: Profile Updates (existing, no changes)


                        PHASE 3: PORTFOLIO
                        ==================

portfolio-deploy (can run in parallel with outbound-campaign)
  step-01: Load session context (existing)
  step-port-01 [MODIFY]: Compile slides content
      |
      +--> queries MongoDB career signals
      +--> writes slides_content.json
      |
  step-port-01b [NEW]: Style selection (Abyssal Depth)
      |
      +--> reads company_brief.yaml <--- _lr/sync/shared-data/ (optional)
      +--> writes selected_style.json
      |
  step-port-01c [NEW]: Render slides HTML
      |
      +--> reads slides_content.json + selected_style.json
      +--> writes slides_deck.html
      |
  step-port-02 [REWRITE]: Beyond the Papers UI
      |
      +--> reads projects-source.yaml (user-provided)
      +--> writes portfolio_content.json
      |
  step-port-02b [NEW]: Life Narrative visualization
      |
      +--> reads portfolio_content.json.life_journey[]
      +--> writes life_journey.html
      |
  step-port-02c [NEW]: Portfolio validation
      |
      +--> validates all artifacts
      +--> writes portfolio_validation.json
      |
  step-port-03 [MODIFY]: GitHub Pages push
      |
      +--> injects slides_deck.html + portfolio_content.json +
      |    life_journey.html into portfolio template
      +--> pushes to gh-pages branch
      +--> reports live URL
```

### 7.2 Shared Data File Dependencies

```
                    _lr/sync/shared-data/
                    =====================

    jd-profile.yaml                      company_brief.yaml
    ===============                      ==================
    Producer: jd-optimize                Producer: jd-optimize
              step-06b                             step-06b
         |                                    |         |
         |                                    |         |
         v                                    v         v
    outbound-campaign                  outbound-campaign  portfolio-deploy
    step-01 (load)                     step-01 (load)     step-port-01b
    step-out-02 (strategy)             step-out-02        (style selection)
    step-out-03 (cover letter)         step-out-03
                                       (tone injection)
```

### 7.3 Artifact File Dependencies Within Workflows

#### outbound-campaign Internal Flow

```
recruiter_profile.json --+
                         |
                         v
                   outreach_strategy.json
                         |
                         v
                   cover_letter.md
                         |
                         v
                   cover_letter_variants.json
                         |
                         v
                   cover_letter_final.md + cover_letter_validation.json
                         |
                         v
                   in_mail.md --> connection_invite.txt --> profile_updates.md
```

#### portfolio-deploy Internal Flow

```
MongoDB signals --+
                  |
                  v
            slides_content.json
                  |
                  v
            selected_style.json
                  |
                  v
            slides_deck.html ---+
                                |
projects-source.yaml --+        |
                       |        |
                       v        |
            portfolio_content.json
                       |        |
                       v        |
            life_journey.html   |
                       |        |
                       v        v
            portfolio_validation.json
                       |
                       v
            dist/ (assembled for gh-pages push)
```

#### jd-optimize Theming Internal Flow

```
company_brief.yaml --+
                     |
                     v
            selected_template_path + theme-override.css (step-34)
                     |
                     v
            jd-{uuid}-draft.html (step-35)
                     |
                     v
            style-validation-report.json (step-36)
```

### 7.4 Cross-Workflow Agent Handoffs

| # | Handoff | From | To | Data Passed | Trigger |
|---|---------|------|----|-------------|---------|
| H-01 | Recruiter parsing | sync-parser | sync-publicist | `recruiter_profile.json` | step-out-01 complete |
| H-02 | Bridge selection | sync-linker | sync-publicist | `outreach_strategy.json` | step-out-02 complete |
| H-03 | Company research | sync-scout | sync-styler | `company_brief.yaml` | step-06b complete |
| H-04 | Company research | sync-scout | sync-publicist | `company_brief.yaml` | step-01 load |
| H-05 | Signal ranking | sync-linker | sync-styler | Top-5 signal IDs | step-port-01 complete |
| H-06 | Portfolio compile | sync-styler | lr-tracker | `slides_deck.html` + `portfolio_content.json` | step-port-02c complete |
| H-07 | Campaign done | sync-publicist | flex-publicist | All campaign artifacts | step-out-05 complete |
| H-08 | Resume theming | sync-styler | sync-styler | `theme-override.css` to HTML assembly | step-34 to step-35 |

### 7.5 Execution Order Constraints

| Constraint | Reason |
|-----------|--------|
| jd-optimize MUST complete step-06b before outbound-campaign starts | outbound-campaign requires jd-profile.yaml and company_brief.yaml |
| jd-optimize MUST complete step-06b before portfolio-deploy step-port-01b | portfolio-deploy optionally consumes company_brief.yaml for theming |
| outbound-campaign and portfolio-deploy CAN run in parallel | No data dependencies between them (both read from shared-data) |
| Within portfolio-deploy: step-port-01 to 01c MUST be sequential | Each step consumes the previous step's output |
| Within portfolio-deploy: step-port-02 to 02c MUST be sequential | Each step consumes the previous step's output |
| step-port-01c MUST complete before step-port-02 starts | Current workflow convention (linear progression) |
| step-port-02c MUST complete before step-port-03 starts | Deploy requires all artifacts validated |

---

## 8. Implementation Order and Dependencies

Based on dependency analysis from PLAN-08a:

| Order | Enhancement | Workflow | Steps to Implement | Depends On |
|-------|-------------|----------|-------------------|------------|
| **1** | **Theming** | jd-optimize | Rewrite steps 34, 35, 36. Create 3 HTML templates. | None (foundation layer) |
| **2** | **Data Export** | jd-optimize | Create step-06b. Create shared-data directory. | Theming (company_brief schema) |
| **3** | **Cover Letter** | outbound-campaign | Modify steps 01, out-01, out-02, V-01. Rewrite step out-03. Create steps out-03b, out-03c. Create cover letter template. Update workflow.yaml, checklist.md, instructions.md. | Data Export (jd-profile + company_brief) |
| **4a** | **Slides** | portfolio-deploy | Modify step port-01, port-03. Create steps port-01b, port-01c. Create abyssal-depth.preset.css. Update workflow.yaml, checklist.md, instructions.md. | Data Export (company_brief, optional) |
| **4b** | **Beyond the Papers** | portfolio-deploy | Rewrite step port-02. Create steps port-02b, port-02c. Create portfolio-content.schema.json, projects-source.yaml. | None (independent, parallel with 4a) |

### Implementation Effort Estimates

| Enhancement | New Files | Modified Files | Total Effort (Step Files) |
|-------------|-----------|---------------|--------------------------|
| Theming | 3 templates | 3 rewrites | 6 |
| Data Export | 1 step + 1 directory | 0 | 2 |
| Cover Letter | 3 steps + 1 template | 5 modifications | 9 |
| Slides | 2 steps + 1 preset | 2 modifications | 5 |
| Beyond Papers | 2 steps + 2 schemas | 1 rewrite | 5 |
| **Total** | **12 new** | **11 modified** | **27** |

---

## Appendix A: Complete Step File Registry

### A.1 jd-optimize Post-Modification Step Registry

| # | File | Path | Status | Agent | Enhancement |
|---|------|------|--------|-------|-------------|
| 01 | `step-01-load-session-context.md` | `steps-c/` | Unchanged | System | -- |
| 01b | `step-01b-resume-if-interrupted.md` | `steps-c/` | Unchanged | System | -- |
| 03 | `step-03-keyword-extraction.md` | `steps-c/` | Unchanged | sync-parser | -- |
| 04 | `step-04-competitive-moat.md` | `steps-c/` | Unchanged | sync-linker | -- |
| 05 | `step-05-adversarial-review.md` | `steps-c/` | Unchanged | sync-refiner | -- |
| 06 | `step-06-final-output.md` | `steps-c/` | Unchanged | sync-refiner | -- |
| **06b** | **`step-06b-export-data-contract.md`** | `steps-c/` | **NEW** | sync-scout, lr-tracker | Cover Letter / Theming |
| 08-33 | `step-08-*` through `step-33-*` | `steps-c/` | Unchanged | Various | -- |
| **34** | **`step-34-style-theming.md`** | `steps-c/` | **REWRITE** | sync-styler | Theming |
| **35** | **`step-35-style-compile.md`** | `steps-c/` | **REWRITE** | sync-styler | Theming |
| **36** | **`step-36-style-validation.md`** | `steps-c/` | **REWRITE** | sync-styler | Theming |
| 37-40 | `step-37-*` through `step-40-*` | `steps-c/` | Unchanged | Various | -- |

### A.2 outbound-campaign Post-Modification Step Registry

| # | File | Path | Status | Agent | Enhancement |
|---|------|------|--------|-------|-------------|
| **01** | **`step-01-load-session-context.md`** | `steps-c/` | **MODIFY** | System | Cover Letter |
| 01b | `step-01b-resume-if-interrupted.md` | `steps-c/` | Unchanged | System | -- |
| **out-01** | **`step-out-01-ingest.md`** | `steps-c/` | **MODIFY** | sync-parser | Cover Letter |
| **out-02** | **`step-out-02-strategy.md`** | `steps-c/` | **MODIFY** | sync-publicist | Cover Letter + Theming |
| **out-03** | **`step-out-03-cover-letter.md`** | `steps-c/` | **REWRITE** | sync-publicist | Cover Letter + Theming |
| **out-03b** | **`step-out-03b-cover-letter-variants.md`** | `steps-c/` | **NEW** | sync-publicist | Cover Letter |
| **out-03c** | **`step-out-03c-cover-letter-validation.md`** | `steps-c/` | **NEW** | sync-publicist | Cover Letter |
| out-04 | `step-out-04-in-mail.md` | `steps-c/` | Unchanged | sync-publicist | -- |
| out-05 | `step-out-05-connect-invite.md` | `steps-c/` | Unchanged | sync-publicist | -- |
| out-06 | `step-out-06-profile-updates.md` | `steps-c/` | Unchanged | flex-publicist | -- |
| **V-01** | **`step-01-validate.md`** | `steps-v/` | **MODIFY** | System | Cover Letter |

### A.3 portfolio-deploy Post-Modification Step Registry

| # | File | Path | Status | Agent | Enhancement |
|---|------|------|--------|-------|-------------|
| 01 | `step-01-load-session-context.md` | `steps-c/` | Unchanged | System | -- |
| 01b | `step-01b-resume-if-interrupted.md` | `steps-c/` | Unchanged | System | -- |
| **port-01** | **`step-port-01-compile.md`** | `steps-c/` | **MODIFY** | sync-styler, sync-linker | Slides |
| **port-01b** | **`step-port-01b-style-selection.md`** | `steps-c/` | **NEW** | sync-styler | Slides + Theming |
| **port-01c** | **`step-port-01c-render-slides-html.md`** | `steps-c/` | **NEW** | sync-styler | Slides |
| **port-02** | **`step-port-02-beyond-the-papers.md`** | `steps-c/` | **REWRITE** | sync-styler | Beyond Papers |
| **port-02b** | **`step-port-02b-life-narrative-video.md`** | `steps-c/` | **NEW** | sync-styler | Beyond Papers |
| **port-02c** | **`step-port-02c-portfolio-validation.md`** | `steps-c/` | **NEW** | sync-styler | Beyond Papers |
| **port-03** | **`step-port-03-deploy.md`** | `steps-c/` | **MODIFY** | lr-tracker | Slides + Beyond Papers + Theming |

---

## Appendix B: Validation Criteria Matrix

Summary of all validation checks across all workflows:

### B.1 Cover Letter Validation (7 checks)

| # | Check | Type | Threshold |
|---|-------|------|-----------|
| CL-1 | Word count | Range | 300-400 |
| CL-2 | XYZ metric presence | Count | >= 1 |
| CL-3 | Bridge reference | Boolean | Present |
| CL-4 | Company name mentions | Count | >= 2 |
| CL-5 | Tone consistency | Classification | All paragraphs match |
| CL-6 | Generic phrase absence | Blocklist | 0 matches |
| CL-7 | Caution topics absence | Blocklist | 0 matches |

### B.2 Resume Style Validation (6 checks)

| # | Check | Type | Threshold |
|---|-------|------|-----------|
| RS-1 | Sections populated | Boolean | All 5 slots filled |
| RS-2 | Accent color applied | Boolean | CSS variable set |
| RS-3 | Forbidden overrides | Blocklist | No non-monochrome body |
| RS-4 | Print CSS present | Boolean | @media print block exists |
| RS-5 | One-page estimate | Count | Lines <= 58 |
| RS-6 | Contrast ratio | Numeric | >= 4.5:1 |

### B.3 Portfolio Validation (8 checks)

| # | Check | Type | Threshold |
|---|-------|------|-----------|
| PF-1 | Project card count | Count | >= 3 |
| PF-2 | Hobby card count | Count | >= 1 |
| PF-3 | Timeline entry count | Count | >= 3 |
| PF-4 | Timeline type diversity | Count | >= 2 distinct types |
| PF-5 | External links valid | Pattern | All match URL regex |
| PF-6 | Slides deck exists | File | Size > 0 |
| PF-7 | Slides self-contained | Blocklist | No external refs |
| PF-8 | Life journey HTML | File | Size > 0 |

---

*Document generated: 2026-03-07*
*Total workflow operations specified: 18 step files, 3 workflow.yaml updates, 14 supporting files*
*Next steps: PLAN-09 (Implementation) -- begin with Enhancement 1 (Theming)*
