# Release 3 Design Specifications: Slide Content Generation, Cover Letter View & Data Pipeline

**Spec Version:** 1.0
**Date:** 2026-03-07
**Scope:** PLAN-03d, PLAN-04c, PLAN-04d
**Depends On:** PLAN-03/04 (Slides & Publicist Audit), PLAN-06 (CSS/Typography Design Specifications), PLAN-01 (Portfolio CV Audit), SYNC-DESIGN-AND-TECHNICAL-SPECS v1.1
**Supersedes:** None (new specifications)

---

## Table of Contents

1. [PLAN-03d: Slide Content Generation Workflow](#plan-03d)
2. [PLAN-04c: Strategic Fit HTML View for Cover Letter Display](#plan-04c)
3. [PLAN-04d: JD Signal to Cover Letter Data Pipeline](#plan-04d)
4. [Appendix A: Gap Resolution Matrix](#appendix-a)
5. [Appendix B: Cross-Workflow Dependency Map](#appendix-b)
6. [Appendix C: Implementation Order](#appendix-c)

---

<a id="plan-03d"></a>
## 1. PLAN-03d: Slide Content Generation Workflow

### 1.1 Design Goals

The portfolio-deploy workflow's `step-port-01-compile.md` currently defines a high-level instruction to "query MongoDB for the top 5 highest-impact career signals" and "format data into `slides_content.json`" using the Problem/Process/Metric/Legacy framework. However, there is no specification for:

- How JD-specific signals (from `jd-profile.yaml`) are selected and ranked for slides
- The exact mapping from JD signal types to the 4-section slide structure
- Which agents are responsible at each phase of content generation
- Where in the outbound-campaign workflow this generation is triggered
- How the frontend-slides skill receives structured input instead of conversational prompts

This specification fills all five gaps and addresses GAPs 01-11 from the PLAN-03/04 audit.

### 1.2 Workflow Trigger Point

The slide content generation is triggered at two distinct points depending on the context:

**Context A: Portfolio-Deploy (Role-General Slides)**

```
[portfolio-deploy workflow]
  step-01-load-session-context.md
    |
    v
  step-port-01-compile.md  <-- TRIGGER: Generate slides_content.json
    |                          Input: MongoDB career signals (top 5 by Strategic Gravity)
    v                          Agent: sync-styler
  step-port-02-beyond-the-papers.md
    |
    v
  step-port-03-deploy.md  <-- Injects slides_content.json into HTML via frontend-slides
```

**Context B: Outbound-Campaign (JD-Targeted Slides)**

```
[jd-optimize workflow]
  step-06-final-output.md
    |
    v  Output: jd-profile.yaml (P0 requirements, persona scores, ATS keywords)
    |
[outbound-campaign workflow]
  step-out-01-ingest.md
    |
    v
  step-out-02-strategy.md
    |  Output: outreach_strategy.json (The Bridge, tone, Golden Signals)
    |
    v
  step-out-02b-compile-slides.md  <-- NEW STEP (inserted)
    |  Input: jd-profile.yaml + outreach_strategy.json + career signals
    |  Output: slides_content.json (JD-targeted version)
    |  Agent: sync-styler (compilation), sync-publicist (content strategy)
    |
    v
  step-out-03-cover-letter.md
    |
    v  (remaining steps unchanged)
```

**Rationale for insertion point:** The slide compilation step (`step-out-02b`) is placed after strategy extraction (`step-out-02`) because it needs the identified Bridge signal and Golden Signals to prioritize which career achievements to feature. It precedes the cover letter step because both slides and cover letter draw from the same signal pool, and the slide compilation may surface additional narrative angles that strengthen the cover letter.

### 1.3 Agent Responsibility Map

| Phase | Agent | Persona | Responsibility |
|-------|-------|---------|---------------|
| Signal Selection | sync-linker | Link | Query career signals from MongoDB. Rank by cosine similarity to JD requirements. Select top 5 P0/P1 matches. |
| Content Strategy | sync-publicist | Lyric | Determine the narrative arc across 5 slides. Ensure the Bridge signal is featured as slide #1. Apply Bridge Methodology to shape each slide's "Legacy" section. |
| Payload Compilation | sync-styler | Styler | Transform raw signal data into the `slides_content.json` format. Apply Problem/Process/Metric/Legacy structure. Validate JSON schema compliance. |
| Visual Rendering | frontend-slides skill | (external) | Consume `slides_content.json` to generate self-contained HTML. Apply "Abyssal Depth" or brand-matched preset. Output: `career-signals.html`. |
| Deployment | lr-tracker | Navi | Place `career-signals.html` in `/slides/` directory. Update iframe `data-src` reference. Push to gh-pages. |

### 1.4 Signal-to-Slide Mapping Specification

#### 1.4.1 Input: JD Signal Extraction

From `jd-profile.yaml`, the following fields feed into slide selection:

```yaml
# Fields consumed from jd-profile.yaml for slide generation
requirements:
  hard:
    - text: "Led cross-functional product teams"
      signal_type: "ownership"
      weight: "critical"      # P0
    - text: "Experience with ML-powered products"
      signal_type: "technical"
      weight: "high"           # P1
  soft:
    - text: "Strong stakeholder communication"
      signal_type: "leadership"
  cultural:
    - text: "Data-driven decision making"
      value_signal: "analytical"

ownership_signals: ["you will own", "lead", "drive"]
persona_fit_primary: "tech_pm"
persona_scores:
  tech_pm: 85
  growth_pm: 40
  strategy_pm: 60
  product_pm: 70
```

#### 1.4.2 Signal Ranking Algorithm

```
For each career_signal in MongoDB(lr-signals):
  1. Compute cosine_similarity(signal.embedding, jd_requirement.embedding) for all P0 requirements
  2. Compute persona_alignment = signal.persona_tags INTERSECT jd_profile.persona_fit_primary
  3. Compute metric_density = count(quantitative_metrics in signal.description) / signal.word_count
  4. Compute ownership_match = signal.action_verbs INTERSECT jd_profile.ownership_signals

  composite_score = (
    0.40 * max(cosine_similarities)  +  # Requirement relevance
    0.25 * persona_alignment         +  # Persona fit
    0.20 * metric_density            +  # Evidence strength
    0.15 * ownership_match              # Leadership signal
  )

  rank by composite_score DESC
  select top 5
```

**Constraint:** The Bridge signal identified in `outreach_strategy.json` MUST be ranked #1 (impact_rank: 1) regardless of composite score. If it falls outside top 5 by score, it replaces the 5th-ranked signal.

#### 1.4.3 Per-Signal Section Mapping

Each of the top 5 signals is decomposed into the 4-section slide structure:

| Section | Source Data | Content Generation Rule | Word Target |
|---------|-----------|------------------------|-------------|
| **The Problem** | `signal.context` + `jd_requirement.text` | Describe the organizational challenge or technical problem. Frame it using language from the JD requirement this signal matches. Avoid generic descriptions. | 25-40 words |
| **The Process** | `signal.actions` + `signal.methodology` | Describe the specific approach taken. Emphasize transferable methodologies. Include team size, tools, and frameworks. | 30-50 words |
| **The Metric** | `signal.metrics[]` + `signal.outcomes` | Lead with the primary quantitative metric (dollar amount, percentage, time saved). Include at most 2 supporting metrics. Format: "$5M revenue growth / 40% latency reduction". | 15-30 words |
| **The Legacy** | `signal.lasting_impact` + `signal.cultural_shift` | What systemic change persists after the individual left? Focus on: new processes adopted, teams created, platforms still running, cultural shifts embedded. | 20-35 words |

**Content tone rule:** Sync-publicist applies the same tone selected in `outreach_strategy.json` (formal/casual/technical) to the slide copy. The slides and cover letter MUST feel like they were written by the same voice.

### 1.5 `slides_content.json` Schema (Complete)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "LinkrightSlidesContentPayload",
  "type": "object",
  "required": ["slides", "metadata", "style"],
  "properties": {
    "slides": {
      "type": "array",
      "minItems": 3,
      "maxItems": 7,
      "items": {
        "type": "object",
        "required": ["signal_id", "title", "sections", "role_alignment", "impact_rank"],
        "properties": {
          "signal_id": {
            "type": "string",
            "pattern": "^sig-[a-f0-9-]+$",
            "description": "UUID reference to the career signal in MongoDB lr-signals collection."
          },
          "title": {
            "type": "string",
            "maxLength": 60,
            "description": "Concise achievement title. E.g., 'Real-Time Analytics Dashboard' or 'Multilingual Search Expansion'."
          },
          "subtitle": {
            "type": "string",
            "maxLength": 80,
            "description": "Context line: company, team, or initiative scope. E.g., 'Organization One | Product Engineering | 2023-2024'."
          },
          "sections": {
            "type": "object",
            "required": ["the_problem", "the_process", "the_metric", "the_legacy"],
            "properties": {
              "the_problem": {
                "type": "string",
                "minLength": 50,
                "maxLength": 250,
                "description": "What was broken or missing? Framed to echo JD requirement language."
              },
              "the_process": {
                "type": "string",
                "minLength": 60,
                "maxLength": 300,
                "description": "How was it fixed? Emphasize transferable methodology and team dynamics."
              },
              "the_metric": {
                "type": "string",
                "minLength": 20,
                "maxLength": 150,
                "description": "Quantitative results. Format: primary metric / supporting metric."
              },
              "the_legacy": {
                "type": "string",
                "minLength": 40,
                "maxLength": 200,
                "description": "Systemic change that persists. Focus on cultural or structural permanence."
              }
            }
          },
          "role_alignment": {
            "type": "string",
            "description": "The Strategic Gravity tag this signal aligns to. E.g., 'tech_pm', 'growth_pm'."
          },
          "impact_rank": {
            "type": "integer",
            "minimum": 1,
            "maximum": 7,
            "description": "Rank by composite relevance score. 1 = highest impact (Bridge signal)."
          },
          "jd_requirement_match": {
            "type": "string",
            "description": "The specific P0/P1 JD requirement this signal addresses. Verbatim from jd-profile.yaml."
          },
          "ats_keywords_embedded": {
            "type": "array",
            "items": { "type": "string" },
            "description": "ATS keywords from jd-profile.yaml that are naturally embedded in this slide's content."
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "required": ["user_name", "target_role", "target_company", "generated_at", "signal_count"],
      "properties": {
        "user_name": { "type": "string" },
        "target_role": { "type": "string" },
        "target_company": { "type": "string" },
        "generated_at": {
          "type": "string",
          "format": "date-time"
        },
        "signal_count": {
          "type": "integer",
          "minimum": 3,
          "maximum": 7
        },
        "top_gravity": {
          "type": "string",
          "description": "Primary persona fit from jd-profile.yaml."
        },
        "bridge_signal_id": {
          "type": "string",
          "description": "The signal_id of the Bridge signal (always impact_rank: 1)."
        },
        "tone": {
          "type": "string",
          "enum": ["formal", "casual", "technical"]
        },
        "source_jd_id": {
          "type": "string",
          "pattern": "^jd-[a-f0-9-]+$",
          "description": "UUID of the jd-profile this payload was generated from. Null for role-general slides."
        }
      }
    },
    "style": {
      "type": "object",
      "properties": {
        "preset": {
          "type": "string",
          "default": "abyssal-depth",
          "description": "Frontend-slides style preset ID. Default is Sync's ocean-themed preset."
        },
        "brand_override": {
          "type": "string",
          "description": "Brand preset ID from PLAN-06a (e.g., 'google', 'amazon'). If set, overrides the default preset."
        },
        "emotional_tone": {
          "type": "string",
          "enum": ["impressed", "excited", "calm", "professional", "bold"],
          "default": "professional",
          "description": "Maps to frontend-slides Phase 1 emotional tone."
        }
      }
    }
  }
}
```

### 1.6 Example `slides_content.json` Instance

```json
{
  "slides": [
    {
      "signal_id": "sig-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "title": "Real-Time Analytics Dashboard",
      "subtitle": "Organization One | Product Engineering | 2023-2024",
      "sections": {
        "the_problem": "Executive decisions were delayed by 48+ hours due to batch-processed reports. The product org lacked real-time visibility into feature adoption, revenue attribution, and user engagement patterns.",
        "the_process": "Led a cross-functional team of 12 engineers and designers through a 16-week build sprint. Architected a streaming data pipeline using Kafka and Flink, with a React dashboard consuming real-time WebSocket feeds. Introduced data-driven sprint planning rituals.",
        "the_metric": "$5M incremental revenue in first year / 40% reduction in decision latency / 2.3M daily events processed",
        "the_legacy": "The dashboard became the default operating view for the entire product org. Data-driven sprint planning is now embedded in team culture. Three derivative dashboards were built by other teams using the same architecture."
      },
      "role_alignment": "tech_pm",
      "impact_rank": 1,
      "jd_requirement_match": "Led cross-functional product teams to deliver data-driven products at scale",
      "ats_keywords_embedded": ["cross-functional", "data-driven", "real-time", "analytics", "revenue growth"]
    },
    {
      "signal_id": "sig-b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "title": "Multilingual Search Expansion",
      "subtitle": "Organization One | Search & Discovery | 2024",
      "sections": {
        "the_problem": "Search relevance dropped 35% for non-English queries across 12 Indian language markets. Existing NLP pipeline was English-first with bolted-on translation layers that lost semantic nuance.",
        "the_process": "Designed a multilingual intent classification system using fine-tuned mBERT models. Ran parallel A/B tests across 4 language cohorts. Partnered with linguistics team to build evaluation rubrics for cultural context preservation.",
        "the_metric": "28% improvement in multilingual search relevance / 15% increase in DAU for non-English users",
        "the_legacy": "The multilingual evaluation framework became the standard for all search quality reviews. Three additional language markets were onboarded using the same pipeline without engineering re-work."
      },
      "role_alignment": "tech_pm",
      "impact_rank": 2,
      "jd_requirement_match": "Experience with ML-powered products and search systems",
      "ats_keywords_embedded": ["ML", "NLP", "search", "A/B testing", "multilingual"]
    }
  ],
  "metadata": {
    "user_name": "Satvik Jain",
    "target_role": "Senior Product Manager, Search",
    "target_company": "Google",
    "generated_at": "2026-03-07T14:30:00Z",
    "signal_count": 5,
    "top_gravity": "tech_pm",
    "bridge_signal_id": "sig-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "tone": "formal",
    "source_jd_id": "jd-d4e5f6a7-b8c9-0123-defg-h45678901234"
  },
  "style": {
    "preset": "abyssal-depth",
    "brand_override": "google",
    "emotional_tone": "professional"
  }
}
```

### 1.7 New Step File: `step-out-02b-compile-slides.md`

```markdown
# Step 02b: Compile JD-Targeted Slide Deck

**Goal:** Generate a signal-aligned presentation payload targeting the specific JD.

---

## DEPENDENCIES
- Requires: `outreach_strategy.json` (from step-out-02)
- Requires: `jd-profile.yaml` (from jd-optimize workflow)
- Requires: `lr-config.yaml` session context
- Requires: MongoDB `lr-signals` collection access

## MANDATORY EXECUTION RULES (READ FIRST)
- NEVER include signals without quantitative metrics
- ALWAYS ensure the Bridge signal is ranked #1
- FORBIDDEN to proceed without user approval of the payload

## 1. Signal Selection

- Use your internal **Link** (`sync-linker`) persona to query MongoDB for career signals.
- Rank signals using the composite scoring algorithm:
  - 40% requirement relevance (cosine similarity to P0 requirements)
  - 25% persona alignment (signal tags vs. persona_fit_primary)
  - 20% metric density (quantitative evidence per word)
  - 15% ownership match (action verbs vs. ownership_signals)
- Force-rank the Bridge signal from `outreach_strategy.json` as #1.
- Select top 5 signals.

## 2. Content Generation

- Use your internal **Lyric** (`sync-publicist`) persona to author slide content.
- For each signal, generate 4 sections:
  - **The Problem**: Frame using JD requirement language (25-40 words)
  - **The Process**: Emphasize transferable methodology (30-50 words)
  - **The Metric**: Lead with primary quantitative result (15-30 words)
  - **The Legacy**: Describe systemic permanence (20-35 words)
- Apply the tone from `outreach_strategy.json` (formal/casual/technical).
- Embed ATS keywords naturally -- do not force-insert.

## 3. Payload Compilation

- Use your internal **Styler** (`sync-styler`) persona to compile the final JSON.
- Format data into `slides_content.json` conforming to LinkrightSlidesContentPayload schema.
- Set `style.brand_override` to match the target company brand preset.
- Validate: all required fields present, character limits respected, signal_count matches array length.

## 4. User Validation

Present the compiled payload to the user:
- Show each slide's title and 4 sections in a readable summary
- Highlight which JD requirement each slide addresses
- Show total ATS keyword coverage percentage
- Wait for approval before proceeding.

---

## OUTPUT
- `slides_content.json` (written to `artifacts/` directory)

## NEXT ACTION
- **[C] Continue**: Proceed to Step 03: Draft Cover Letter.
- **[P] Previous**: back to Strategy.
- **[A] Abort**: Exit the workflow.
```

### 1.8 Frontend-Slides Skill Integration Protocol

The frontend-slides skill expects conversational input. To bridge structured JSON input to the skill's Phase 1 (Content Gathering), the following protocol is used:

**Option A (Recommended): Structured Prompt Injection**

Instead of interactive Phase 1, feed `slides_content.json` as a system prompt to the frontend-slides skill:

```
/frontend-slides

I have a pre-structured presentation with {signal_count} slides. Each slide has 4 sections: Problem, Process, Metric, Legacy.

Here is the JSON payload:
{slides_content.json contents}

Style preset: {style.preset}
Emotional tone: {style.emotional_tone}
Brand colors: primary={lr-brand-primary}, secondary={lr-brand-secondary}

Please generate a self-contained HTML presentation using these exact slide contents.
Skip the style preview phase -- use the specified preset directly.
```

**Option B (Fallback): Bypass Phase 1 and Phase 2**

If the skill cannot accept structured input:

1. Extract the HTML template structure from the skill's `html-template.md`
2. Extract animation patterns from `animation-patterns.md`
3. Have sync-styler manually construct the HTML file using Sync's "Abyssal Depth" CSS tokens
4. Output: `career-signals.html` with inline CSS and JS, zero external dependencies

**Recommendation:** Option A for initial implementation. Option B as a fallback if the skill's conversational interface cannot be reliably automated.

### 1.9 Updated Portfolio-Deploy Checklist

```markdown
# Portfolio Deploy Checklist (Updated for Slide Content Generation)

## 1. Preparation Phase

- [ ] JD-targeted career signals selected (top 5 by composite score).
- [ ] Bridge signal confirmed as impact_rank #1.
- [ ] Career signals payload (`slides_content.json`) generated and schema-validated.
- [ ] "Beyond the Papers" cards (`portfolio_content.json`) mapped.
- [ ] Asset links (project thumbnails, hobby media) verified.
- [ ] Slide deck HTML (`career-signals.html`) generated via frontend-slides skill.

## 2. Validation Phase

- [ ] HTML/CSS templates injected with correct style tokens.
- [ ] Slide deck renders correctly in iframe sandbox.
- [ ] ATS keyword coverage >= 60% of P0 keywords.
- [ ] Mobile/Desktop layout checked for visual excellence.
- [ ] NFR check: Page load time and accessibility standards met.

## 3. Deployment Phase

- [ ] Git branch `gh-pages` initialized or updated.
- [ ] `slides/career-signals.html` placed in correct directory.
- [ ] Deployment commit message follows standard format.
- [ ] Live URL verified and shared with the user.
```

### 1.10 Gap Resolution Summary (GAPs 01-11)

| Gap ID | Description | Resolution in This Spec |
|--------|-------------|------------------------|
| **GAP-01** | No `steps-b/` directory exists | Addressed: Bootstrap handled by `step-01-load-session-context.md`. No `steps-b/` needed. Session context loading is adequate. |
| **GAP-02** | Missing data handoff contract between jd-optimize and outbound-campaign | **Resolved:** Section 1.2 defines explicit trigger points. `jd-profile.yaml` is the formal handoff artifact. Schema defined in PLAN-03/04 audit Section 3.5. The new `step-out-02b` explicitly declares `jd-profile.yaml` as a dependency. |
| **GAP-03** | Missing `contacts.csv` population | Addressed: `contacts.csv` remains user-provided. The slide workflow does not depend on it. Cover letter workflow (PLAN-04d) does not depend on it either -- it uses `recruiter_profile.json` from step-out-01. |
| **GAP-04** | No template for cover letter output | **Resolved:** See PLAN-04c Section 2.4 (HTML template) and PLAN-04b in PLAN-06 (JSON schema). |
| **GAP-05** | Cover letter structure incomplete in step file | **Resolved:** See PLAN-04d Section 3.5 (3-paragraph Bridge Methodology mapping). |
| **GAP-06** | No `flex-publicist` agent definition in Sync module | Acknowledged: `flex-publicist` (Echo) is a cross-module dependency for step-out-06 only. Not in scope for slides or cover letter. Recommend: Add `flex-publicist` reference to Sync module manifest in a future release. |
| **GAP-07** | Sidecar memory is minimal | **Partially resolved:** Section 1.4.3 defines structured content generation rules that can be persisted as sidecar instructions. Recommend: After each campaign execution, append slide performance data to `sync-publicist-sidecar/memories.md`. |
| **GAP-08** | No email/follow-up sequence | Not in scope for slides/cover letter specs. Recommend: Future PLAN-05 to consume `follow-up-cadence.yaml`. |
| **GAP-09** | No resume version selection step | **Partially resolved:** The slide compilation step (`step-out-02b`) implicitly selects the "resume version" by choosing which career signals to feature. The 5-slide payload IS the targeted resume narrative. |
| **GAP-10** | Missing company_brief integration | **Resolved:** Section 1.4.3 specifies that `jd_profile.company_brief_id` feeds `company_brief.pm_culture` and `company_brief.tone_descriptor` into the tone selection (step-out-02). The `slides_content.json` metadata captures the resolved tone. See also PLAN-04d Section 3.6 (template variable resolution order). |
| **GAP-11** | Validation step is generic | **Resolved:** Section 1.9 defines specific validation criteria: schema compliance, Bridge signal ranking, ATS keyword coverage threshold (>= 60%), iframe rendering check. |

---

<a id="plan-04c"></a>
## 2. PLAN-04c: Strategic Fit HTML View for Cover Letter Display

### 2.1 Design Goals

The Strategic Fit view (`#whygoogle-view`, currently view #3 in the 4-view SPA) is a scaffold containing a 1px transparent placeholder image and the text: `The "Why <span class="company-name"></span>" cover letter goes here.`

With the addition of the Slide Deck as a 5th view (PLAN-03c), the updated navigation order becomes:

| # | Nav ID | View ID | Label | Subtext |
|---|--------|---------|-------|---------|
| 1 | `nav-resume` | `resume-view` | Resume | The Evidence |
| 2 | `nav-whyme` | `whyme-view` | Value Prop | The "Why Me" |
| 3 | `nav-slides` | `slides-view` | Slide Deck | Career Signals |
| 4 | `nav-whygoogle` | `whygoogle-view` | Strategic Fit | Why `<company>`? |
| 5 | `nav-whoami` | `whoami-view` | Beyond the Papers | Personal Narrative |

This specification designs the interior HTML structure of view #4 (`whygoogle-view`) as a formal cover letter display, replacing the placeholder scaffold.

**Note on naming:** The view ID `whygoogle-view` is hardcoded to "google" in the existing template (PLAN-01e finding). This spec retains the existing ID for backward compatibility but designs the content to be fully company-agnostic via the `--lr-target-company-name` CSS variable. A future refactor may rename to `whycompany-view` or `strategic-fit-view`.

### 2.2 HTML Structure

The cover letter view uses `lr-cv-*` prefixed CSS classes to namespace all cover-letter-specific styling, avoiding collision with the existing `.cl-*` classes defined in PLAN-04b (PLAN-06 Design Specifications). The `lr-cv-` prefix is chosen because the cover letter lives within the CV template's page container and should use the same class naming family.

```html
<!-- VIEW 4: STRATEGIC FIT (Cover Letter) -->
<div id="whygoogle-view" class="view-container">
  <div class="page">
    <!-- Identity Horizon Brand Bar (same as all views) -->
    <div class="identity-horizon">
      <div class="color-1"></div>
      <div class="color-2"></div>
      <div class="color-3"></div>
      <div class="color-4"></div>
    </div>

    <!-- Header (same structure as resume view for visual consistency) -->
    <div class="header">
      <div class="header-top">
        <div class="name" data-field="candidate_name">FULL NAME</div>
        <div class="role" data-field="target_role">TARGET ROLE NAME</div>
      </div>
      <div class="contact-info">
        <span data-field="phone">+91-XXXXXXXXXX</span>
        <span class="divider">|</span>
        <span><a href="mailto:placeholder@email.com" data-field="email">Email Me</a></span>
        <span class="divider">|</span>
        <span><a href="https://linkedin.com/in/username" data-field="linkedin">LinkedIn</a></span>
        <span class="divider">|</span>
        <span><a href="https://portfolio.me/" data-field="portfolio">Portfolio</a></span>
      </div>
    </div>

    <!-- Cover Letter Content Section -->
    <div class="section lr-cv-cover-letter-section">
      <div class="section-title">
        Strategic Fit: Why <span class="company-name"></span>
        <div class="section-divider"></div>
      </div>

      <div class="lr-cv-cover-letter">
        <!-- Date -->
        <div class="lr-cv-date" data-field="letter_date"></div>

        <!-- Addressee Block -->
        <div class="lr-cv-addressee">
          <div class="lr-cv-addressee-name" data-field="addressee_name"></div>
          <div class="lr-cv-addressee-title" data-field="addressee_title"></div>
          <div class="lr-cv-addressee-company" data-field="addressee_company"></div>
        </div>

        <!-- Salutation -->
        <div class="lr-cv-salutation" data-field="salutation">Dear Hiring Manager,</div>

        <!-- Three-Paragraph Body -->
        <div class="lr-cv-body">
          <!-- Paragraph 1: The Hook (Company-Specific Opener) -->
          <p class="lr-cv-paragraph lr-cv-hook" data-field="letter_hook">
            <!-- Populated from cover_letter_payload.json letter.hook -->
          </p>

          <!-- Paragraph 2: The Bridge (Methodology Body) -->
          <p class="lr-cv-paragraph lr-cv-bridge" data-field="letter_bridge">
            <!-- Populated from cover_letter_payload.json letter.why_me -->
          </p>

          <!-- Paragraph 3: The Value Proposition (Close) -->
          <p class="lr-cv-paragraph lr-cv-value-prop" data-field="letter_value_prop">
            <!-- Populated from cover_letter_payload.json letter.why_them -->
          </p>

          <!-- Optional Closing Line -->
          <p class="lr-cv-paragraph lr-cv-closing" data-field="letter_closing">
            <!-- Populated from cover_letter_payload.json letter.closing -->
          </p>
        </div>

        <!-- Signature Block -->
        <div class="lr-cv-signature">
          <div class="lr-cv-sign-off" data-field="sign_off">Warm regards,</div>
          <div class="lr-cv-signer-name" data-field="signer_name">FULL NAME</div>
          <div class="lr-cv-portfolio-link">
            <a href="" data-field="portfolio_url" target="_blank" rel="noopener"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 2.3 CSS Styling with `lr-cv-*` Classes

```css
/* ============================================================
   COVER LETTER VIEW — Strategic Fit
   Namespace: lr-cv-* (Linkright CV cover letter)
   Renders the 3-paragraph cover letter within the A4 page.
   ============================================================ */

/* --- Cover Letter Container --- */
.lr-cv-cover-letter {
  margin-top: var(--lr-space-6);              /* 24px below section title */
  font-family: var(--lr-font-family-heading); /* Roboto in resume context */
  font-size: var(--lr-font-size-body);        /* 14px / 0.875rem */
  line-height: var(--lr-line-height-loose);   /* 1.6 for letter readability */
  color: var(--lr-color-text-primary);
}

/* --- Date --- */
.lr-cv-date {
  font-size: var(--lr-font-size-caption);     /* 12px */
  color: var(--lr-color-text-secondary);
  margin-bottom: var(--lr-space-4);           /* 16px */
}

/* --- Addressee Block --- */
.lr-cv-addressee {
  margin-bottom: var(--lr-space-6);           /* 24px */
  font-size: var(--lr-font-size-body-sm);     /* ~12.67px */
  line-height: var(--lr-line-height-relaxed); /* 1.4 */
  color: var(--lr-color-text-secondary);
}

.lr-cv-addressee-name {
  font-weight: var(--lr-font-weight-medium);  /* 500 */
  color: var(--lr-color-text-primary);
}

/* --- Salutation --- */
.lr-cv-salutation {
  margin-bottom: var(--lr-space-4);           /* 16px */
  font-weight: var(--lr-font-weight-medium);
  color: var(--lr-color-text-primary);
}

/* --- Body Paragraphs --- */
.lr-cv-body {
  margin-bottom: var(--lr-space-6);           /* 24px before signature */
}

.lr-cv-paragraph {
  margin-bottom: var(--lr-space-4);           /* 16px between paragraphs */
  text-align: left;
}

.lr-cv-paragraph:last-child {
  margin-bottom: 0;
}

/* The Bridge paragraph: subtle left-border accent to draw the eye
   to the key achievement. Uses brand-primary for visual continuity
   with the Identity Horizon bar and section dividers. */
.lr-cv-bridge {
  border-left: 2px solid var(--lr-brand-primary);
  padding-left: var(--lr-space-3);            /* 12px */
  margin-left: 0;
}

/* Closing line: italic, secondary color to differentiate from body */
.lr-cv-closing {
  font-style: italic;
  color: var(--lr-color-text-secondary);
}

/* --- Signature Block --- */
.lr-cv-signature {
  margin-top: var(--lr-space-8);              /* 32px */
  padding-top: var(--lr-space-4);             /* 16px */
}

.lr-cv-sign-off {
  margin-bottom: var(--lr-space-2);           /* 8px */
  font-style: italic;
  color: var(--lr-color-text-secondary);
}

.lr-cv-signer-name {
  font-weight: var(--lr-font-weight-bold);    /* 700 */
  font-size: var(--lr-font-size-subhead);     /* ~14px */
  color: var(--lr-color-text-name);
}

.lr-cv-portfolio-link {
  margin-top: var(--lr-space-1);              /* 4px */
  font-size: var(--lr-font-size-caption);     /* 12px */
}

.lr-cv-portfolio-link a {
  color: var(--lr-brand-primary);
  text-decoration: none;
}

.lr-cv-portfolio-link a:hover {
  text-decoration: underline;
}
```

### 2.4 3-Paragraph Structure Specification

The cover letter body follows sync-publicist's Bridge Methodology, mapped to 3 semantic paragraphs:

| # | Class | Label | Content Source | Purpose | Word Target |
|---|-------|-------|---------------|---------|-------------|
| 1 | `lr-cv-hook` | Company-Specific Opener | `letter.hook` from `cover_letter_payload.json` | Open with a genuine connection point to the company/recruiter. Reference specific company news, research, product, or the recruiter's public content. NEVER use generic openers like "I am excited to apply." | 80-120 words |
| 2 | `lr-cv-bridge` | Bridge Methodology Body | `letter.why_me` from `cover_letter_payload.json` | The candidate's single most relevant achievement with quantitative proof. Maps directly to the Bridge signal (impact_rank #1 from `slides_content.json`). Includes the primary metric and its organizational impact. This is the "Why Me" argument. | 100-150 words |
| 3 | `lr-cv-value-prop` | Value Proposition Close | `letter.why_them` from `cover_letter_payload.json` | Internal motivations NOT found on the resume. Why THIS company specifically, from a deeply personal angle. Demonstrates cultural fit and genuine interest. This is the "Why Them" argument. | 80-120 words |
| (opt) | `lr-cv-closing` | Closing Line | `letter.closing` from `cover_letter_payload.json` | Single-sentence call to action. Soft, professional, specific to the role. E.g., "I would welcome the opportunity to discuss how my experience in real-time systems aligns with your team's mission." | 15-30 words |

**Total word target:** 275-420 words (aligning with the 300-400 word target from the master orchestration).

### 2.5 Company Name Injection

The cover letter view reuses the existing CSS-driven company name injection mechanism:

**Existing mechanism (from PLAN-01c audit):**
```css
/* CSS rule (existing) */
.company-name::after {
  content: var(--target-company-name);
}

/* New PLAN-06a taxonomy mapping */
.company-name::after {
  content: var(--lr-target-company-name);
}
```

**Usage in the cover letter view:**

1. **Section title:** `Strategic Fit: Why <span class="company-name"></span>` -- renders as "Strategic Fit: Why Google"
2. **Nav subtext:** `Why <span class="company-name"></span>?` -- renders as "Why Google?"
3. **Letter body:** The cover letter paragraphs themselves do NOT use `<span class="company-name"></span>` because the company name appears naturally in the prose (injected at content generation time by sync-publicist, not at render time). This avoids awkward CSS-injected text mid-sentence.

**Variable resolution:** When `step-port-03-deploy.md` builds the final HTML, it:
1. Reads `company_name` from `cover_letter_payload.json` (or `jd-profile.yaml`)
2. Sets `--lr-target-company-name: "Google";` in the `:root` block
3. All `.company-name` spans across all views are automatically populated

### 2.6 Print Stylesheet Integration

The cover letter view integrates with the existing `@media print` system using a body class toggle for optional inclusion:

```css
@media print {
  /* --- Base print rules (unchanged) --- */
  body { background: none; padding: 0; }
  .sidebar { display: none !important; }
  .main-content { margin-left: 0; padding: 0; }
  .page { margin: 0; box-shadow: none; border: none; }

  /* --- Default: hide all views --- */
  .view-container { display: none !important; }

  /* --- Always show resume as page 1 --- */
  #resume-view { display: block !important; }

  /* --- Conditionally show cover letter as page 2 --- */
  body.lr-print-cover-letter #whygoogle-view {
    display: block !important;
    page-break-before: always;
  }

  /* --- Cover letter print-specific adjustments --- */
  body.lr-print-cover-letter .lr-cv-cover-letter {
    font-size: 10.5pt;                 /* Slightly smaller for A4 fit */
    line-height: 1.5;                  /* Tighter than screen */
  }

  body.lr-print-cover-letter .lr-cv-bridge {
    border-left-color: var(--lr-brand-primary);
    -webkit-print-color-adjust: exact; /* Preserve brand border in print */
  }

  /* --- Slides view: never print --- */
  #slides-view { display: none !important; }

  /* --- Page geometry --- */
  @page { size: A4; margin: 0; }
}
```

**Activation mechanism:**

```javascript
/**
 * Extended print function with cover letter option.
 * Called by download button(s) in the sidebar.
 *
 * @param {boolean} includeCoverLetter - If true, appends cover letter as page 2
 */
function printPortfolio(includeCoverLetter) {
  if (includeCoverLetter) {
    document.body.classList.add('lr-print-cover-letter');
  }
  window.print();
  // Clean up after print dialog closes
  window.addEventListener('afterprint', function cleanup() {
    document.body.classList.remove('lr-print-cover-letter');
    window.removeEventListener('afterprint', cleanup);
  });
}
```

**Download button update:**

```html
<!-- Updated sidebar download section -->
<div class="download-section">
  <button class="btn-download" onclick="printPortfolio(false)">DOWNLOAD RESUME</button>
  <button class="btn-download btn-download-alt" onclick="printPortfolio(true)">
    RESUME + COVER LETTER
  </button>
</div>
```

```css
/* Secondary download button styling */
.btn-download-alt {
  background: transparent;
  color: var(--lr-brand-primary);
  border: 1px solid var(--lr-brand-primary);
  font-size: var(--lr-font-size-caption);
  margin-top: var(--lr-space-2);
  padding: var(--lr-space-2) var(--lr-space-4);
  border-radius: var(--lr-radius-pill);
  cursor: pointer;
  transition: var(--lr-anim-duration-normal) var(--lr-anim-easing-standard);
}

.btn-download-alt:hover {
  background: var(--lr-brand-primary);
  color: var(--lr-color-text-inverse);
}
```

### 2.7 Content Injection Mechanism

The cover letter content is injected into the HTML at build time during `step-port-03-deploy.md`. The injection uses `data-field` attributes as stable selectors:

```javascript
/**
 * Injects cover_letter_payload.json into the cover letter view.
 * Called by the Navi (lr-tracker) agent during step-port-03-deploy.
 *
 * @param {Object} payload - The LinkrightCoverLetterPayload object
 */
function injectCoverLetter(payload) {
  const fieldMap = {
    // Meta fields
    'candidate_name':     payload.meta.candidate_name,
    'target_role':        payload.meta.target_role,
    'letter_date':        formatDate(payload.meta.date),
    'addressee_name':     payload.meta.addressee?.name || '',
    'addressee_title':    payload.meta.addressee?.title || '',
    'addressee_company':  payload.meta.addressee?.company || payload.meta.company_name,
    'salutation':         payload.meta.addressee?.name
                            ? `Dear ${payload.meta.addressee.name},`
                            : 'Dear Hiring Manager,',

    // Letter body
    'letter_hook':        payload.letter.hook,
    'letter_bridge':      payload.letter.why_me,
    'letter_value_prop':  payload.letter.why_them,
    'letter_closing':     payload.letter.closing || '',

    // Signature
    'sign_off':           payload.signature?.sign_off || 'Warm regards,',
    'signer_name':        payload.signature?.name || payload.meta.candidate_name,
    'portfolio_url':      payload.signature?.portfolio_url || ''
  };

  // Inject text content
  for (const [field, value] of Object.entries(fieldMap)) {
    const el = document.querySelector(`[data-field="${field}"]`);
    if (el) {
      if (el.tagName === 'A') {
        el.href = value;
        el.textContent = value;
      } else {
        el.textContent = value;
      }
    }
  }

  // Set CSS variable for company name
  document.documentElement.style.setProperty(
    '--lr-target-company-name',
    `"${payload.meta.company_name}"`
  );
}

/**
 * Formats ISO date string to formal letter date.
 * "2026-03-07" -> "March 7, 2026"
 */
function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
}
```

**Build-time vs. runtime:** In the current architecture, the portfolio is a static HTML file deployed to GitHub Pages. Content injection happens at **build time** (during `step-port-03-deploy.md`) by the Navi agent, which replaces template placeholders with actual content before committing to gh-pages. The JavaScript injection function above is used by Navi to generate the final static HTML -- it is NOT a runtime client-side script.

### 2.8 Accessibility

```html
<div id="whygoogle-view"
     class="view-container"
     role="article"
     aria-label="Cover letter for application to target company">
  <div class="page">
    <!-- ... -->
    <div class="lr-cv-cover-letter"
         role="document"
         aria-label="Formal cover letter">
      <div class="lr-cv-body" role="region" aria-label="Letter content">
        <p class="lr-cv-paragraph lr-cv-hook"
           aria-label="Opening paragraph: connection to company">
        </p>
        <p class="lr-cv-paragraph lr-cv-bridge"
           aria-label="Core paragraph: key achievement and evidence">
        </p>
        <p class="lr-cv-paragraph lr-cv-value-prop"
           aria-label="Closing paragraph: personal motivation and cultural fit">
        </p>
      </div>
    </div>
  </div>
</div>
```

### 2.9 Responsive Behavior

The cover letter view inherits the resume view's A4-constrained layout. On screens narrower than the sidebar + A4 page width (300px + 210mm = ~1093px):

```css
/* Responsive: cover letter within the view system */
@media screen and (max-width: 991px) {
  .lr-cv-cover-letter {
    font-size: var(--lr-font-size-body-sm);   /* Scale down slightly */
    padding: var(--lr-space-2);
  }

  .lr-cv-bridge {
    padding-left: var(--lr-space-2);          /* Tighter indent */
  }
}
```

### 2.10 Template Variable Injection Point Summary

| `data-field` | HTML Element | Source JSON Path | Fallback |
|---|---|---|---|
| `candidate_name` | `.name` | `meta.candidate_name` | (required) |
| `target_role` | `.role` | `meta.target_role` | (required) |
| `phone` | `.contact-info span` | `meta.candidate_phone` | (required) |
| `email` | `.contact-info a` | `meta.candidate_email` | (required) |
| `letter_date` | `.lr-cv-date` | `meta.date` (formatted) | Current date |
| `addressee_name` | `.lr-cv-addressee-name` | `meta.addressee.name` | (empty) |
| `addressee_title` | `.lr-cv-addressee-title` | `meta.addressee.title` | (empty) |
| `addressee_company` | `.lr-cv-addressee-company` | `meta.addressee.company` | `meta.company_name` |
| `salutation` | `.lr-cv-salutation` | Computed from `meta.addressee.name` | "Dear Hiring Manager," |
| `letter_hook` | `.lr-cv-hook` | `letter.hook` | (required) |
| `letter_bridge` | `.lr-cv-bridge` | `letter.why_me` | (required) |
| `letter_value_prop` | `.lr-cv-value-prop` | `letter.why_them` | (required) |
| `letter_closing` | `.lr-cv-closing` | `letter.closing` | (empty, paragraph hidden) |
| `sign_off` | `.lr-cv-sign-off` | `signature.sign_off` | "Warm regards," |
| `signer_name` | `.lr-cv-signer-name` | `signature.name` | `meta.candidate_name` |
| `portfolio_url` | `.lr-cv-portfolio-link a` | `signature.portfolio_url` | (empty, link hidden) |
| (CSS variable) | All `.company-name` spans | `meta.company_name` via `--lr-target-company-name` | (required) |

---

<a id="plan-04d"></a>
## 3. PLAN-04d: JD Signal to Cover Letter Data Pipeline

### 3.1 Design Goals

This section specifies the complete data pipeline from raw JD text to a rendered cover letter in the portfolio HTML. It connects three workflows:

1. **jd-optimize** (signal extraction) -- produces `jd-profile.yaml`
2. **outbound-campaign** (content generation) -- produces `cover_letter_payload.json`
3. **portfolio-deploy** (HTML rendering) -- injects payload into `#whygoogle-view`

### 3.2 End-to-End Data Flow

```
                    ┌─────────────────────────────────────────┐
                    │           JD-OPTIMIZE WORKFLOW           │
                    │                                         │
  Raw JD Text ────> │  step-03: Keyword Extraction            │
  (jd-raw.md)       │  step-04: Competitive Moat              │
                    │  step-05: Adversarial Review             │
                    │  step-06: Final Output                   │
                    │  step-08-10: Persona Scoring             │
                    │  step-11-13: Signal Query & Ranking      │
                    │  step-14-16: Baseline Compilation        │
                    │  step-17-19: Gap Identification          │
                    │                                         │
                    │  OUTPUT: jd-profile.yaml                 │
                    │          optimized-jd.md                  │
                    └──────────────┬──────────────────────────┘
                                   │
                    ┌──────────────v──────────────────────────┐
                    │       OUTBOUND-CAMPAIGN WORKFLOW         │
                    │                                         │
  Recruiter PDF ──> │  step-out-01: Ingest Target             │
  (user-provided)   │    OUTPUT: recruiter_profile.json        │
                    │                                         │
                    │  step-out-02: Strategy & Hook            │
                    │    INPUT: recruiter_profile.json          │
                    │           jd-profile.yaml                │
                    │    OUTPUT: outreach_strategy.json         │
                    │                                         │
                    │  step-out-02b: Compile Slides (NEW)      │
                    │    INPUT: outreach_strategy.json          │
                    │           jd-profile.yaml                │
                    │           MongoDB lr-signals             │
                    │    OUTPUT: slides_content.json            │
                    │                                         │
                    │  step-out-03: Draft Cover Letter          │
                    │    INPUT: outreach_strategy.json          │
                    │           jd-profile.yaml                │
                    │           slides_content.json (Bridge)   │
                    │    OUTPUT: cover_letter.md                │
                    │            cover_letter_payload.json      │
                    │                                         │
                    │  step-out-04: Draft In-Mail               │
                    │  step-out-05: Draft Connect Invite        │
                    │  step-out-06: Profile Updates             │
                    └──────────────┬──────────────────────────┘
                                   │
                    ┌──────────────v──────────────────────────┐
                    │       PORTFOLIO-DEPLOY WORKFLOW          │
                    │                                         │
                    │  step-port-01: Compile Frontend Slides   │
                    │    INPUT: slides_content.json             │
                    │    OUTPUT: career-signals.html            │
                    │                                         │
                    │  step-port-02: Beyond the Papers UI       │
                    │    OUTPUT: portfolio_content.json         │
                    │                                         │
                    │  step-port-03: Deploy to GitHub Pages     │
                    │    INPUT: career-signals.html             │
                    │           cover_letter_payload.json       │
                    │           portfolio_content.json          │
                    │    ACTION: Inject all payloads into HTML  │
                    │            Push to gh-pages branch        │
                    │    OUTPUT: Live portfolio URL             │
                    └─────────────────────────────────────────┘
```

### 3.3 Intermediate Signal Format: `jd_signals_extracted.json`

Between the jd-optimize workflow's signal extraction steps (steps 11-16) and the outbound-campaign's content generation, an intermediate signal format captures the parsed and ranked signals:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "LinkrightJDSignalsExtracted",
  "description": "Intermediate format capturing parsed JD signals with user career signal matches. Produced by jd-optimize steps 11-16. Consumed by outbound-campaign steps 02, 02b, and 03.",
  "type": "object",
  "required": ["jd_id", "extracted_at", "requirements", "matched_signals", "gaps"],
  "properties": {
    "jd_id": {
      "type": "string",
      "pattern": "^jd-[a-f0-9-]+$"
    },
    "extracted_at": {
      "type": "string",
      "format": "date-time"
    },
    "company": {
      "type": "string"
    },
    "role_title": {
      "type": "string"
    },
    "requirements": {
      "type": "object",
      "properties": {
        "p0_critical": {
          "type": "array",
          "description": "Must-have requirements. Cover letter must address at least 2.",
          "items": {
            "type": "object",
            "required": ["id", "text", "signal_type", "ats_keywords"],
            "properties": {
              "id": {
                "type": "string",
                "pattern": "^req-[0-9]+$"
              },
              "text": {
                "type": "string",
                "description": "Verbatim requirement text from the JD."
              },
              "signal_type": {
                "type": "string",
                "enum": ["technical", "ownership", "leadership", "domain", "methodology", "cultural"],
                "description": "Semantic category of the requirement."
              },
              "ats_keywords": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Exact ATS-matchable keywords extracted from this requirement."
              },
              "ats_weight": {
                "type": "number",
                "minimum": 0,
                "maximum": 1,
                "description": "ATS scoring weight: 1.0 (exact match), 0.7 (synonym), 0.4 (contextual)."
              }
            }
          }
        },
        "p1_preferred": {
          "type": "array",
          "items": { "$ref": "#/properties/requirements/properties/p0_critical/items" }
        },
        "p2_bonus": {
          "type": "array",
          "items": { "$ref": "#/properties/requirements/properties/p0_critical/items" }
        }
      }
    },
    "matched_signals": {
      "type": "array",
      "description": "User career signals matched to JD requirements, ranked by composite score.",
      "items": {
        "type": "object",
        "required": ["signal_id", "signal_title", "matched_requirement_id", "scores"],
        "properties": {
          "signal_id": {
            "type": "string",
            "pattern": "^sig-[a-f0-9-]+$"
          },
          "signal_title": {
            "type": "string"
          },
          "signal_summary": {
            "type": "string",
            "maxLength": 200,
            "description": "One-sentence summary of the achievement."
          },
          "primary_metric": {
            "type": "string",
            "description": "The single most impactful quantitative result. E.g., '$5M revenue growth'."
          },
          "supporting_metrics": {
            "type": "array",
            "items": { "type": "string" },
            "maxItems": 3
          },
          "matched_requirement_id": {
            "type": "string",
            "description": "The requirement ID (req-XX) this signal best addresses."
          },
          "matched_requirement_text": {
            "type": "string"
          },
          "scores": {
            "type": "object",
            "properties": {
              "cosine_similarity": { "type": "number", "minimum": 0, "maximum": 1 },
              "persona_alignment": { "type": "number", "minimum": 0, "maximum": 1 },
              "metric_density": { "type": "number", "minimum": 0, "maximum": 1 },
              "ownership_match": { "type": "number", "minimum": 0, "maximum": 1 },
              "composite": { "type": "number", "minimum": 0, "maximum": 1 }
            }
          },
          "action_verbs": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Leadership/ownership verbs found in this signal: 'led', 'drove', 'owned', etc."
          },
          "persona_tags": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Which persona archetypes this signal supports: 'tech_pm', 'growth_pm', etc."
          }
        }
      }
    },
    "gaps": {
      "type": "array",
      "description": "P0 requirements with no strong signal match (composite < 0.4).",
      "items": {
        "type": "object",
        "properties": {
          "requirement_id": { "type": "string" },
          "requirement_text": { "type": "string" },
          "gap_severity": {
            "type": "string",
            "enum": ["hard_gap", "soft_gap", "addressable"],
            "description": "hard_gap: no relevant experience. soft_gap: tangential experience only. addressable: can be framed with narrative bridging."
          },
          "mitigation_strategy": {
            "type": "string",
            "description": "How the cover letter should address this gap (e.g., 'frame as learning opportunity', 'highlight transferable skill', 'acknowledge and pivot')."
          }
        }
      }
    },
    "competitive_moat": {
      "type": "object",
      "properties": {
        "unique_differentiators": {
          "type": "array",
          "items": { "type": "string" },
          "description": "What makes this candidate different from the typical applicant. From step-04-competitive-moat."
        },
        "moat_narrative": {
          "type": "string",
          "description": "One-paragraph narrative of the candidate's competitive advantage."
        }
      }
    }
  }
}
```

### 3.4 Signal Extraction Integration Point in JD-Optimize

The jd-optimize workflow currently has steps 11-16 as stubs (generic "execute core logic" instructions). This specification defines what those steps should produce to feed the cover letter pipeline:

| Step | Purpose | Input | Output Field in `jd_signals_extracted.json` |
|------|---------|-------|---------------------------------------------|
| step-11-signal-query | Construct vector query from P0 requirements | P0 requirements text, persona_fit_primary | Query embeddings |
| step-12-signal-retrieval | Execute MongoDB vector search | Query embeddings, lr-signals collection | Raw matched signals (unranked) |
| step-13-signal-ranking | Rank signals by composite score | Raw matched signals, JD requirements | `matched_signals[]` (ranked) |
| step-14-baseline-metrics | Extract quantitative metrics from matched signals | Ranked signals | `matched_signals[].primary_metric`, `matched_signals[].supporting_metrics` |
| step-15-baseline-ownership | Extract ownership/leadership evidence | Ranked signals, `ownership_signals` from JD | `matched_signals[].action_verbs`, `matched_signals[].scores.ownership_match` |
| step-16-baseline-compilation | Compile complete intermediate format | All prior step outputs | Complete `jd_signals_extracted.json` written to `artifacts/` |

**New artifact:** `jd_signals_extracted.json` is written to `{workflow_root}/artifacts/jd_signals_extracted.json` at the end of step-16. This file is then consumed by the outbound-campaign workflow via the `data/jd-profile.yaml` handoff (which should reference or embed the extracted signals).

### 3.5 Bridge Methodology Mapping to 3-Paragraph Structure

Sync-publicist (Lyric) uses the "Bridge Methodology" to generate cover letter content. Here is how the methodology maps to the 3-paragraph structure defined in the `LinkrightCoverLetterPayload`:

```
BRIDGE METHODOLOGY                 COVER LETTER PARAGRAPHS
==================                 =======================

1. THE HOOK                   -->  letter.hook (lr-cv-hook)
   "Why should they care?"         Company-Specific Opener

   Source data:                     Content rules:
   - company_brief.brand_values    - Reference specific company news, product,
   - recruiter_profile.json          or recruiter's public content
     .pain_points                  - Demonstrate research depth
     .shared_signals               - Avoid generic openers
   - jd_profile.company_stage     - Name the recruiter if known
   - company_brief.pm_culture      - 80-120 words

2. THE BRIDGE                 -->  letter.why_me (lr-cv-bridge)
   "Why me specifically?"          Bridge Methodology Body

   Source data:                     Content rules:
   - outreach_strategy.json        - Lead with the Bridge signal
     .bridge_signal                  (impact_rank #1 from slides)
   - matched_signals[0]            - Include primary quantitative metric
     .primary_metric               - Show HOW it was achieved (methodology)
     .signal_summary               - Connect achievement to JD P0 requirement
   - slides_content.json           - Mirror the "Process" and "Metric" sections
     .slides[0].sections             from the first slide
                                   - 100-150 words

3. THE SYNERGY                -->  letter.why_them (lr-cv-value-prop)
   "Why 1+1=3?"                    Value Proposition Close

   Source data:                     Content rules:
   - jd_profile.requirements       - Reveal motivations NOT on the resume
     .cultural[]                   - Address company-specific challenges
   - company_brief                 - Show cultural alignment
     .pm_culture                   - Use "insight" language, not "feature" language
     .tone_descriptor              - Connect personal values to company mission
   - gaps[].mitigation_strategy    - If gaps exist, subtly address the
                                     strongest addressable gap
                                   - 80-120 words
```

**Cross-referencing with slides:** The cover letter's Bridge paragraph (`letter.why_me`) MUST reference the same achievement as `slides_content.json.slides[0]` (the Bridge signal at impact_rank 1). This creates narrative consistency: the most prominent slide in the deck and the core argument in the cover letter are the same story, told in two formats (visual presentation vs. written narrative).

### 3.6 Template Variable Resolution Order

When generating cover letter content, variables are resolved in a strict priority order. Higher-priority sources override lower-priority ones:

```
PRIORITY 1 (Highest): JD-Specific Signals
  Source: jd-profile.yaml + jd_signals_extracted.json
  Provides:
    - company_name, role_title, seniority
    - P0 requirements (for Hook framing)
    - matched_signals (for Bridge content)
    - persona_fit_primary (for tone selection)
    - ats_keywords (for natural keyword embedding)
    - gaps (for mitigation in Why Them paragraph)

PRIORITY 2: Recruiter/Target Profile
  Source: recruiter_profile.json (from step-out-01)
  Provides:
    - addressee.name, addressee.title
    - pain_points (for Hook personalization)
    - shared_signals (for connection points)
    - company context (for cultural fit)

PRIORITY 3: Outreach Strategy
  Source: outreach_strategy.json (from step-out-02)
  Provides:
    - bridge_signal (THE single achievement to lead with)
    - tone (formal/casual/technical)
    - golden_signals (top 3 P0 matches)

PRIORITY 4: User Profile (Defaults)
  Source: lr-config.yaml + user's sidecar memories
  Provides:
    - candidate_name, candidate_email, candidate_phone
    - portfolio_url
    - default sign_off preference
    - voice/writing style guidelines

PRIORITY 5 (Lowest): System Defaults
  Provides:
    - date: current date in ISO format
    - sign_off: "Warm regards,"
    - tone: "formal" (if not set by strategy)
    - salutation: "Dear Hiring Manager," (if no addressee)
```

**Resolution example:**

```
Variable: company_name
  Check jd-profile.yaml.company       -> "Google" (FOUND, use this)
  Check recruiter_profile.json.company -> "Google" (would be fallback)
  Check lr-config.yaml.target_company  -> "" (system default, not used)

Variable: addressee.name
  Check recruiter_profile.json.name    -> "Priya Sharma" (FOUND)
  Check jd-profile.yaml               -> (no addressee field)
  System default                       -> "" (salutation becomes "Dear Hiring Manager,")

Variable: bridge_signal
  Check outreach_strategy.json.bridge_signal -> "sig-a1b2..." (FOUND)
  Check slides_content.json.slides[0]       -> (would be fallback)
  Check matched_signals[0]                  -> (would be second fallback)
```

### 3.7 Updated `step-out-03-cover-letter.md` (Enhanced)

The existing step file is sparse (3 structure elements: Hook/Bridge/Synergy). This enhanced version formalizes the data pipeline:

```markdown
# Step 03: Draft Cover Letter

**Goal:** Generate a signal-aligned, persuasive cover letter using the Bridge Methodology.

---

## DEPENDENCIES
- Requires: `outreach_strategy.json` (from step-out-02)
- Requires: `jd-profile.yaml` (from jd-optimize workflow)
- Requires: `slides_content.json` (from step-out-02b)
- Requires: `recruiter_profile.json` (from step-out-01)
- Requires: `lr-config.yaml` session context

## MANDATORY EXECUTION RULES
- NEVER generate content without user validation
- ALWAYS use the Bridge signal (slides[0]) as the core of paragraph 2
- FORBIDDEN to use generic openers ("I am excited to apply...")
- NEVER exceed 420 words total (300-400 target)
- ALWAYS embed at least 3 ATS keywords naturally

## 1. Resolve Template Variables

Load data in priority order:
1. `jd-profile.yaml` -> company_name, role_title, P0 requirements, persona_fit
2. `recruiter_profile.json` -> addressee details, pain_points, shared_signals
3. `outreach_strategy.json` -> bridge_signal, tone, golden_signals
4. `lr-config.yaml` -> candidate details, portfolio_url, voice preferences
5. System defaults -> date, sign_off

## 2. Generate Cover Letter Body

Use your internal **Lyric** (`sync-publicist`) persona to draft 3 paragraphs:

### Paragraph 1: The Hook (80-120 words)
- Reference: recruiter's pain_points OR company news OR recruiter's public content
- Tone: Match the tone from outreach_strategy.json
- Rule: Must mention the company by name within the first 2 sentences
- Rule: Must NOT be interchangeable with any other company

### Paragraph 2: The Bridge (100-150 words)
- Lead with: The Bridge signal from outreach_strategy.json
- MUST include: The primary quantitative metric from slides_content.json.slides[0]
- MUST echo: The same story told in slide #1 (Problem/Process/Metric)
- Connect: Achievement to the specific P0 requirement it addresses
- Rule: Reader should feel "this person has already done what we need"

### Paragraph 3: The Value Proposition (80-120 words)
- Reveal: Motivations NOT found on the resume
- Address: Company-specific challenges from jd-profile.yaml.requirements.cultural
- If gaps exist: Subtly address the strongest addressable gap
- Connect: Personal values to company mission
- Rule: Reader should feel "this person genuinely wants to be HERE"

### Closing Line (15-30 words, optional)
- Soft CTA: Specific to the role, not generic
- Example: "I would welcome the opportunity to discuss how my experience
  in [specific domain] aligns with [specific team]'s roadmap."

## 3. Compile Payload

Format the output as `cover_letter_payload.json` conforming to the
LinkrightCoverLetterPayload schema (see PLAN-04b in PLAN-06).

Write BOTH:
- `artifacts/cover_letter.md` (human-readable markdown version)
- `artifacts/cover_letter_payload.json` (machine-readable for HTML injection)

## 4. Validation

Present to the user:
- Full cover letter text with paragraph labels
- Word count per paragraph and total
- ATS keywords embedded (list with count)
- Bridge signal connection (which slide it mirrors)
- Tone consistency check (matches outreach_strategy.json.tone)

Wait for user approval before proceeding.

---

## OUTPUT
- `cover_letter.md` (written to `artifacts/`)
- `cover_letter_payload.json` (written to `artifacts/`)

## NEXT ACTION
- **[C] Continue**: Proceed to Step 04: Draft In-Mail.
- **[P] Previous**: back to Compile Slides.
- **[A] Abort**: Exit the workflow.
```

### 3.8 Cross-Artifact Consistency Rules

The cover letter, slide deck, and resume must maintain narrative consistency. These rules are enforced during generation:

| Rule | Enforcement Point | Validation |
|------|-------------------|------------|
| The Bridge signal in the cover letter (`letter.why_me`) MUST reference the same achievement as `slides_content.json.slides[0]` | step-out-03 (generation) | Compare `outreach_strategy.json.bridge_signal` with `slides_content.json.metadata.bridge_signal_id` |
| The primary metric cited in the cover letter MUST appear verbatim in the slide deck | step-out-03 (generation) | String match `slides_content.json.slides[0].sections.the_metric` substring in `letter.why_me` |
| The company name in the cover letter MUST match the `--lr-target-company-name` CSS variable | step-port-03 (deployment) | Compare `cover_letter_payload.json.meta.company_name` with `slides_content.json.metadata.target_company` |
| The tone of the cover letter MUST match the tone of the slide content | step-out-03 (generation) | Compare `outreach_strategy.json.tone` with `slides_content.json.metadata.tone` |
| ATS keywords embedded in the cover letter SHOULD overlap with those in the slides | step-out-03 (validation) | Compute intersection of `cover_letter ATS keywords` and `slides_content.json.slides[*].ats_keywords_embedded` |

### 3.9 Cover Letter Payload Generation Sequence Diagram

```
sync-publicist (Lyric)                sync-styler                 lr-tracker (Navi)
       |                                    |                           |
       |  1. Load jd-profile.yaml          |                           |
       |  2. Load recruiter_profile.json    |                           |
       |  3. Load outreach_strategy.json    |                           |
       |  4. Load slides_content.json       |                           |
       |                                    |                           |
       |  5. Resolve template variables     |                           |
       |     (Priority 1-5 cascade)         |                           |
       |                                    |                           |
       |  6. Draft letter.hook              |                           |
       |     (from recruiter pain_points    |                           |
       |      + company research)           |                           |
       |                                    |                           |
       |  7. Draft letter.why_me            |                           |
       |     (from Bridge signal + metric   |                           |
       |      mirroring slides[0])          |                           |
       |                                    |                           |
       |  8. Draft letter.why_them          |                           |
       |     (from cultural requirements    |                           |
       |      + gap mitigation)             |                           |
       |                                    |                           |
       |  9. Draft letter.closing           |                           |
       |     (soft CTA)                     |                           |
       |                                    |                           |
       |  10. Output: cover_letter.md ------>                           |
       |                                    |                           |
       |                               11. Compile JSON payload         |
       |                                   (cover_letter_payload.json)  |
       |                                    |                           |
       |                               12. Schema validation            |
       |                                    |                           |
       |                                    |                           |
       |  <-- 13. Present to user --------->                            |
       |      (user reviews and approves)   |                           |
       |                                    |                           |
       |                                    |  14. Inject payload       |
       |                                    |      into HTML template   |
       |                                    |                           |
       |                                    |  15. Set CSS variable     |
       |                                    |      --lr-target-company  |
       |                                    |                           |
       |                                    |  16. Push to gh-pages     |
       |                                    |           |               |
       |                                    |           v               |
       |                                    |      Live Portfolio URL   |
```

### 3.10 Error Handling and Edge Cases

| Scenario | Handling |
|----------|----------|
| No recruiter profile available (cold application) | Omit addressee block. Set `salutation` to "Dear Hiring Manager,". Reduce Hook paragraph to company-only research (no recruiter-specific references). |
| Fewer than 3 career signals in MongoDB | Reduce slide count to available signals. Cover letter Bridge paragraph uses the single strongest signal. Mark as "Limited Signal" in metadata for user awareness. |
| No quantitative metrics in matched signals | Use qualitative impact descriptions. Flag as validation warning. Recommend user add metrics before proceeding. |
| JD is for a different persona than user's primary gravity | Include a "Persona Stretch" note in the Hook paragraph. Frame the gap as breadth-of-experience. Adjust persona scores in metadata. |
| Company brief not available | Fall back to JD text for company culture signals. Set `company_brief_id` to null. Generate tone from JD language analysis (formal if corporate JD, casual if startup-style). |
| Addressable gaps identified in `jd_signals_extracted.json` | Address the top 1 addressable gap in the Value Proposition paragraph (paragraph 3). Frame as "learning opportunity" or "transferable skill." Never address more than 1 gap -- keep the narrative positive. |

---

<a id="appendix-a"></a>
## Appendix A: Gap Resolution Matrix

Complete mapping of all 11 gaps from the PLAN-03/04 audit to their resolution across PLAN-03d, PLAN-04c, and PLAN-04d:

| Gap ID | Gap Description | Resolved By | Spec Section | Status |
|--------|----------------|-------------|-------------|--------|
| GAP-01 | No `steps-b/` directory exists | PLAN-03d | 1.10 | Closed (by design) |
| GAP-02 | Missing data handoff contract jd-optimize -> outbound-campaign | PLAN-04d | 3.2, 3.4 | **Resolved** |
| GAP-03 | Missing `contacts.csv` population | PLAN-03d | 1.10 | Closed (user-provided) |
| GAP-04 | No template for cover letter output | PLAN-04c | 2.2, 2.3 | **Resolved** |
| GAP-05 | Cover letter structure incomplete in step file | PLAN-04d | 3.5, 3.7 | **Resolved** |
| GAP-06 | No `flex-publicist` agent in Sync module | -- | 1.10 | Deferred (cross-module) |
| GAP-07 | Sidecar memory is minimal | PLAN-03d | 1.10 | Partially resolved |
| GAP-08 | No email/follow-up sequence | -- | 1.10 | Deferred (future PLAN) |
| GAP-09 | No resume version selection step | PLAN-03d | 1.10 | Partially resolved |
| GAP-10 | Missing company_brief integration | PLAN-04d | 3.5, 3.6 | **Resolved** |
| GAP-11 | Validation step is generic | PLAN-03d | 1.9 | **Resolved** |

---

<a id="appendix-b"></a>
## Appendix B: Cross-Workflow Dependency Map

```
┌──────────────┐     jd-profile.yaml      ┌──────────────────┐
│              │ ───────────────────────>  │                  │
│  jd-optimize │     jd_signals_           │ outbound-campaign│
│              │     extracted.json        │                  │
│              │ ───────────────────────>  │                  │
└──────────────┘                          └────────┬─────────┘
                                                   │
                    slides_content.json             │
                    cover_letter_payload.json       │
                    portfolio_content.json          │
                                                   │
                                          ┌────────v─────────┐
                                          │                  │
                                          │ portfolio-deploy │
                                          │                  │
                                          └────────┬─────────┘
                                                   │
                                                   v
                                          GitHub Pages
                                          (Live Portfolio)
```

**Artifact dependency chain:**

```
jd-raw.md
  └─> jd-profile.yaml
       ├─> jd_signals_extracted.json
       │    ├─> outreach_strategy.json
       │    │    ├─> slides_content.json
       │    │    │    └─> career-signals.html
       │    │    └─> cover_letter_payload.json
       │    │         └─> (injected into #whygoogle-view)
       │    └─> (feeds both slides and cover letter)
       └─> (feeds brand preset selection)
```

---

<a id="appendix-c"></a>
## Appendix C: Implementation Order

### Phase 1: Data Pipeline Foundation
1. Define `jd_signals_extracted.json` schema and validate against existing jd-optimize output
2. Implement signal extraction in jd-optimize steps 11-16 (currently stubs)
3. Establish the `jd-profile.yaml` handoff contract between workflows

### Phase 2: Slide Content Generation
4. Create `step-out-02b-compile-slides.md` in outbound-campaign
5. Implement the `slides_content.json` schema and compilation logic
6. Integrate with frontend-slides skill (Option A: structured prompt injection)
7. Update portfolio-deploy `step-port-01-compile.md` to consume the new schema

### Phase 3: Cover Letter Pipeline
8. Enhance `step-out-03-cover-letter.md` with the Bridge Methodology mapping
9. Implement `cover_letter_payload.json` generation
10. Implement template variable resolution order (Priority 1-5 cascade)

### Phase 4: HTML View Implementation
11. Build the `#whygoogle-view` HTML structure with `lr-cv-*` classes
12. Implement CSS styling (Section 2.3)
13. Implement content injection mechanism (Section 2.7)
14. Add print stylesheet with `lr-print-cover-letter` body class toggle
15. Add secondary download button ("RESUME + COVER LETTER")

### Phase 5: Integration Testing
16. End-to-end test: raw JD -> slides + cover letter -> deployed portfolio
17. Validate cross-artifact consistency rules (Section 3.8)
18. Validate ATS keyword coverage >= 60% of P0 keywords
19. Print-to-PDF testing: resume only, resume + cover letter

---

*End of Release 3 Design Specifications: PLAN-03d, PLAN-04c, PLAN-04d.*
