---

# PLAN-03 & PLAN-04: Comprehensive Audit Report

---

## SECTION 1: PLAN-03a -- Frontend Slides Skill Workflow Analysis

### 1.1 Codebase References to frontend-slides

The `frontend-slides` skill by `zarazhangrui` is referenced in the following locations:

**File: `/Users/satvikjain/Downloads/sync/linkright/LR-MASTER-ORCHESTRATION.md`**
- **Line 2758**: Step file named `step-port-01-compile-frontend-slides.md`
- **Line 2762**: `Objective: Generate JSON payload for "Why Me?" slide deck based on zarazhangrui/frontend-slides patterns.`
- **Line 2763**: `Output: slides_content.json`

**File: `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01-compile.md`**
- **Line 3**: `Transform raw signals into the presentation payload for the "Why Me?" slide deck.`
- **Line 19**: `Format data into slides_content.json.`

**File: `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/checklist.md`**
- **Line 7**: `Career signals payload (slides_content.json) generated.`

**File: `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/instructions.md`**
- **Line 17**: `Frontend Slides: Structure data into: "Problem", "Process", "Metric", "Legacy".`

### 1.2 Skill Workflow (from GitHub Repository)

The `zarazhangrui/frontend-slides` skill (fetched from `https://github.com/zarazhangrui/frontend-slides`) is a Claude Code skill that enables non-designers to create animation-rich HTML presentations. Its workflow has four phases:

**Phase 1: Content Gathering**
- Collects presentation content (slides, messaging, images)
- Gathers emotional tone preferences (impressed, excited, calm, etc.)

**Phase 2: Style Preview Generation**
- Creates three distinct visual style options for side-by-side comparison
- User selects their preferred aesthetic from the three options

**Phase 3: Presentation Rendering**
- Generates a complete, self-contained HTML file in the chosen style
- Opens the result in the browser
- The HTML file includes inline CSS and JS with zero external dependencies

**Phase 4: Optional PPT Conversion**
- Extracts text, images, and notes from PowerPoint (.pptx) files
- Confirms extracted content with user
- Converts to web-based slideshow

### 1.3 Style Presets (12 Total)

**Dark Themes:**
| Preset | Category |
|---|---|
| Bold Signal | Dark |
| Electric Studio | Dark |
| Creative Voltage | Dark |
| Dark Botanical | Dark |

**Light Themes:**
| Preset | Category |
|---|---|
| Notebook Tabs | Light |
| Pastel Geometry | Light |
| Split Pastel | Light |
| Vintage Editorial | Light |

**Specialty Themes:**
| Preset | Category |
|---|---|
| Neon Cyber | Specialty |
| Terminal Green | Specialty |
| Swiss Modern | Specialty |
| Paper & Ink | Specialty |

*Note: Detailed CSS properties for each preset could not be retrieved due to rate limiting on `STYLE_PRESETS.md`. The full definitions live in the repo file `STYLE_PRESETS.md`.*

### 1.4 How the Skill Expects to Be Invoked

**Invocation Method**: `/frontend-slides` slash command in Claude Code, followed by natural language.

**Inputs:**
- User prompts describing presentation topic and desired emotional feeling
- Optional `.pptx` files for conversion
- No structured JSON input is documented -- the skill collects content conversationally

**Outputs:**
- A single self-contained HTML file (inline CSS + inline JS, zero dependencies)
- Opened in browser automatically

**Technical Architecture (progressive disclosure):**
| File | Purpose | Size |
|---|---|---|
| `SKILL.md` | Core workflow map | ~180 lines |
| `STYLE_PRESETS.md` | Visual preset definitions | - |
| `viewport-base.css` | Responsive styling foundation | - |
| `html-template.md` | HTML/JS structure skeleton | - |
| `animation-patterns.md` | Animation reference library | - |
| `extract-pptx.py` | PowerPoint extraction utility | - |

### 1.5 Constraining Style Selection for Sync's Ocean-Inspired Design

The Sync design system (`/Users/satvikjain/Downloads/sync/linkright/SYNC-DESIGN-AND-TECHNICAL-SPECS.md`) defines an ocean-themed visual language called "Signal from the Deep." To constrain the frontend-slides skill for Sync:

**None of the 12 existing presets directly match.** The closest candidates would be:
- **Dark Botanical** (dark, organic -- but likely green, not ocean teal)
- **Swiss Modern** (clean, precise -- but neutral, not ocean-themed)

**Recommended approach -- create a custom "Abyssal Depth" preset** using Sync's design tokens:

```css
/* Core Brand Tokens */
--sync-teal-core:    #0E9E8E   /* Deep ocean current. Primary. */
--sync-coral-core:   #D9705A   /* Breaking wave. Energy accent. */
--sync-gold-core:    #C8973A   /* Sunlight on water. Achievement. */
--sync-peach-core:   #E8A882   /* Sea at golden hour. Warmth. */
--sync-beige-core:   #D4C5A9   /* Seafloor sand. Neutral warmth. */
--sync-silver-core:  #A8BFC0   /* Sea foam. Borders & metadata. */

/* Dark Mode "Abyssal Depth" backgrounds */
--sync-bg-base:      #091614   /* True abyss. */
--sync-bg-surface:   #0F1F1C   /* One layer up. */
--sync-bg-elevated:  #122520   /* Cards, panels. */
```

The frontend-slides skill would need to be extended with a 13th preset (`Ocean Signal` or `Abyssal Depth`) that maps Sync's gradient (`#0E9E8E` teal -> `#D9705A` coral) onto the slide backgrounds, text, and accent elements. Alternatively, the skill's Phase 2 (Style Preview) could be bypassed entirely by providing a pre-defined CSS override file that uses Sync's design tokens.

---

## SECTION 2: PLAN-03b -- Animation Patterns and HTML Template Structure

### 2.1 Integration Points from Portfolio-Deploy Steps

The portfolio-deploy workflow references slide content at three critical integration points:

**Step 01 -- Compile Frontend Slides** (`/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-01-compile.md`):
- **Agent**: Sync-Styler (`sync-styler`)
- **Input**: Top 5 highest-impact career signals from MongoDB, filtered by user's "Strategic Gravity" (Role Identity)
- **Output**: `slides_content.json`
- **Payload Categories** (lines 20-24):
  1. **The Problem**: What was broken?
  2. **The Process**: How did you fix it?
  3. **The Metric**: What was the quantitative result?
  4. **The Legacy**: What remains now that you are gone?

**Step 02 -- Beyond the Papers UI** (`/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-02-beyond-the-papers.md`):
- **Agent**: Sync-Styler
- **Output**: `portfolio_content.json`
- Includes at least one placeholder for "Life Narrative" movie
- Project thumbnails and external links

**Step 03 -- GitHub Pages Push** (`/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/steps-c/step-port-03-deploy.md`):
- **Agent**: Navi (`lr-tracker`)
- Combines JSON payloads with HTML/CSS templates from `_lr/sync/templates/`
- Deploys to `gh-pages` branch
- Commit message format: `"Sync-Deploy: Updated Portfolio [Timestamp]"`

### 2.2 Slide Content Embedding Map

From the master orchestration document (lines 2758-2783), the data flow is:

```
MongoDB Career Signals
    |
    v
[step-port-01-compile] --> slides_content.json
    |                          (Problem/Process/Metric/Legacy per signal)
    v
[step-port-02-beyond-the-papers] --> portfolio_content.json
    |                                    (Project cards + Life Journey)
    v
[step-port-03-deploy] --> Inject both JSON payloads into HTML/CSS templates
    |                     from _lr/sync/templates/
    v
    gh-pages branch push --> Live URL
```

The portfolio template (`/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/templates/portfolio.template.md`) is currently a skeleton:
```markdown
# [User Name] - Portfolio
## Featured Slides
...
## Evidence Signals
...
```

The frontend-slides skill would fill the "Featured Slides" section with the rendered HTML presentation, while "Evidence Signals" would be populated from `portfolio_content.json`.

### 2.3 Expected `slides_content.json` Payload Structure

Based on all the references, the expected JSON payload structure is:

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

Each slide maps to one career signal. The top 5 are selected by cosine similarity to the user's primary "Strategic Gravity" from MongoDB's `lr-signals` collection (configured in `/Users/satvikjain/Downloads/sync/linkright/_lr/_memory/config.yaml`, vector distance: cosine, 1536 dimensions).

### 2.4 Frontend-Slides Skill Integration Architecture

The integration between Sync's portfolio-deploy and the frontend-slides skill would work as follows:

1. **Content Gathering** (Phase 1): Instead of conversational collection, Sync's `step-port-01-compile.md` generates `slides_content.json` programmatically from career signals.
2. **Style Preview** (Phase 2): Bypassed or constrained -- Sync's ocean-themed design system provides the CSS tokens directly, eliminating the 3-option preview step.
3. **Presentation Rendering** (Phase 3): The skill's `html-template.md` and `animation-patterns.md` are used to generate the final self-contained HTML.
4. **Output**: A single HTML file that gets injected into the static site during `step-port-03-deploy.md`.

**Gap**: The frontend-slides skill expects conversational input (natural language). Sync needs to either:
- (a) Feed `slides_content.json` as a structured prompt to the skill, or
- (b) Build a custom rendering step that uses the skill's HTML template and animation patterns but bypasses its conversational Phase 1.

---

## SECTION 3: PLAN-04a -- Sync-Publicist Agent and Outbound Campaign Analysis

### 3.1 Full Capability Inventory of sync-publicist

**Source file**: `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/agents/sync-publicist.md`

| Property | Value |
|---|---|
| **Agent ID** | `sync-publicist.agent.md` |
| **Persona Name** | Lyric (also referred to as "Pip" in sidecar memory) |
| **Title** | Outreach Engineer |
| **Icon** | (megaphone icon) |
| **Capabilities** | cover letter drafting, outreach messaging, profile optimization, narrative design |
| **Has Sidecar** | `true` |
| **Identity Statement** | "I am the voice of the user in the professional world. I convert semantic alignment into compelling human narrative, using my mastery of Bridge methodology." |
| **Communication Style** | Persuasive, professional, and impact-driven. Speaks in themes of synergy and mutual value. |
| **Principles** | "Bridge" Methodology (Authentic connection), 300-Character Clamp (LinkedIn invites), Outcome-Focused Copy |

**Menu Items:**
| Command | Label | Action |
|---|---|---|
| `CL` | Craft Cover Letter | Generate tailored cover letter. Synergy-focused narrative design. |
| `OM` | Outreach Message | Draft In-Mails and invites with character constraints. |
| `DA` | Dismiss Agent | Exit the agent persona. |

**Activation Sequence** (5 steps):
1. Load persona from agent file
2. Load `{project-root}/_lr/lr-config.yaml` -- store ALL fields as session variables
3. **MANDATORY** sidecar loading: Load `memories.md` and `instructions.md` from `_lr/_memory/sync-publicist-sidecar/`
4. Show greeting as "Lyric | Outreach Engineer", display numbered menu
5. STOP and WAIT for user input

**Menu Handlers:**
| Type | Pattern | Action |
|---|---|---|
| exec | `*.md` | `load_system_prompt` |
| data | `*.yaml/*.json/*.csv` | `load_reference_data` |
| workflow | `*workflow.yaml` | `initialize_workflow` |
| action | `*` (catch-all) | `execute_internal_function` |

### 3.2 Customization Configuration

**Agent-level** (`/Users/satvikjain/Downloads/sync/linkright/_lr/sync/agents/sync-publicist.customize.yaml`):
```yaml
agent: sync-publicist
custom_rules: []
project_overrides: {}
```
Currently empty -- no agent-level overrides.

**Config-level** (`/Users/satvikjain/Downloads/sync/linkright/_lr/_config/agents/sync-publicist.customize.yaml`):
```yaml
persona_overrides:
  tone: "standard"
  strictness: "high"
system_overrides:
  model: "default"
  max_output_tokens: 4000
```

### 3.3 Sidecar Memory

**Memories** (`/Users/satvikjain/Downloads/sync/linkright/_lr/_memory/sync-publicist-sidecar/memories.md`):
- **Outreach Impact**:
  - Established the 300-character high-fidelity connection invite pattern
  - Outbound Campaign v4.0: automated outreach sequences bridging JD requirements to verified career signals
- **Domain Knowledge**:
  - Deep expertise in LinkedIn outreach etiquette and conversion psychology
  - Master of the "Soft Ask" engagement pattern for professional networking

**Instructions** (`/Users/satvikjain/Downloads/sync/linkright/_lr/_memory/sync-publicist-sidecar/instructions.md`):
- **Core Objective**: Execute high-converting outbound career campaigns transforming signal-aligned strategies into persuasive professional artifacts
- **Operating Protocol**:
  1. Strategy Receipt: Review Link's (Linker) alignment plan and Rory's (Refiner) narrative drafts
  2. Artifact Generation: Draft Cover Letter, Pitch Deck content, In-Mail sequences
  3. XYZ Integration: Ensure all hooks tethered to candidate's top-3 signals
  4. Character Enforcement: Maintain strict character limits (<=300 chars for connection invites)
- **Guardrails**:
  - Zero Generic Outreach -- every message MUST lead with a specific signal
  - Authenticity Only -- avoid "salesy" language, maintain "Insights Explorer" voice
  - Privacy Compliance -- never expose sensitive candidate data in public artifacts

### 3.4 Complete Outbound-Campaign Workflow Steps Map

**Workflow ID**: `outbound-campaign` (a.k.a. `sync-outbound`)
**Trigger**: jd-profile confirmed (output of jd-optimize workflow)
**Config source**: `{project-root}/_lr/_config/manifest.yaml`
**Input files**: `data/jd-profile.yaml` (FULL_LOAD), `data/contacts.csv` (FULL_LOAD)
**Template**: `templates/campaign.template.md`

#### Steps-C (Core Execution Path) -- 8 files:

| # | File | Agent | Goal | Output | Next |
|---|---|---|---|---|---|
| 0a | `step-01-load-session-context.md` | System | Load `lr-config.yaml`, resolve session vars | Config in memory | step-out-01 |
| 0b | `step-01b-resume-if-interrupted.md` | System | Check `artifacts/` for existing state, ask user [C]ontinue or [R]estart | Resume point | step-out-0X |
| 1 | `step-out-01-ingest.md` | Sync-Parser | Parse recruiter/HM profile (PDF/text/URL). Extract: Name, Company, Role, Pain Points, Shared Signals | `recruiter_profile.json` | step-out-02 |
| 2 | `step-out-02-strategy.md` | Sync-Publicist (Lyric) | Load `recruiter_profile.json` + `jd_profile.json`, query "Golden Signals" (P0 matches), identify "The Bridge", define tone (Formal/Casual/Technical) | `outreach_strategy.json` | step-out-03 |
| 3 | `step-out-03-cover-letter.md` | Sync-Publicist (Lyric) | Draft 300-400 word cover letter: The Hook (recruiter-focused) -> The Bridge (user achievement) -> The Synergy (1+1=3) | `cover_letter.md` | step-out-04 |
| 4 | `step-out-04-in-mail.md` | Sync-Publicist (Lyric) | Draft personalized LinkedIn In-Mail. Must include one high-impact quantitative metric. Soft CTA for "technical alignment chat" | `in_mail.md` | step-out-05 |
| 5 | `step-out-05-connect-invite.md` | Sync-Publicist (Lyric) | Generate 3 variants of connection invite. STRICT <=300 characters. Must reference "The Bridge" achievement | `connection_invite.txt` | step-out-06 |
| 6 | `step-out-06-profile-updates.md` | Echo (flex-publicist) | Evaluate LinkedIn presence vs. JD. Suggest headline + About section changes. Present full campaign for final confirmation | `profile_updates.md` | DONE |

**Navigation at each step**: [C] Continue, [P] Previous, [A] Abort (step-out-06 uses [S] Save & Exit instead of [C])

#### Steps-E (Edit Path) -- 2 files:

| # | File | Purpose |
|---|---|---|
| E-01 | `step-01-assess.md` | Load artifacts, identify edit scope and impact, confirm with user |
| E-02 | `step-02-apply-edit.md` | Apply approved modifications, verify output integrity post-edit |

#### Steps-V (Validation Path) -- 1 file:

| # | File | Purpose |
|---|---|---|
| V-01 | `step-01-validate.md` | Load all artifacts, run checklist against output, generate PASS/FAIL summary |

#### Master Orchestration Variant (LR-MASTER-ORCHESTRATION lines 2684-2750):

The master orchestration defines a slightly different step naming convention for the canonical design:

| Step | Agent | Objective | Output |
|---|---|---|---|
| `step-out-01-ingest-recruiter-pdf.md` | Sync-Parser | Convert Recruiter LinkedIn PDF into structured psychological profile | `recruiter_profile.json` |
| `step-out-02-extract-psychology.md` | Sync-Publicist | Determine tone and "hook"; identify "The Bridge" | `outreach_strategy.json` |
| `step-out-03-draft-cover-letter.md` | Sync-Publicist | 300-400 word synergy-focused cover letter (Hook/Why Me/Why Them) | `cover_letter.md` |
| `step-out-04-draft-in-mail.md` | Sync-Publicist | Long-form personalised In-Mail (short, direct, value-first) | `in_mail.md` |
| `step-out-05-draft-connect-invite.md` | Sync-Publicist | Personalised invite, STRICT MAX 300 CHARS | `connection_invite.txt` |
| `step-out-06-suggest-profile-updates.md` | Sync-Publicist | Time-limited LinkedIn profile adjustments | `profile_updates.md` |

### 3.5 Signal Data Available from JD-Optimize

The jd-optimize workflow (53 steps in the master design, 6 core steps currently implemented) produces the following signal data that feeds into outbound-campaign:

#### jd_profile Schema (LR-MASTER-ORCHESTRATION lines 720-748):

```yaml
jd_profile:
  id: "jd-[uuid]"
  parsed_at: "[ISO]"
  company: ""
  role_title: ""
  seniority: "junior|mid|senior|staff|principal"
  team: ""
  location: ""
  requirements:
    hard: []    # {text, signal_type, weight: critical|high|medium}
    soft: []    # {text, signal_type}
    cultural: [] # {text, value_signal}
  keywords_ats: []     # exact strings for ATS scoring
  skills_technical: []
  skills_pm_core: []
  ownership_signals: [] # "you will own", "lead", "drive"
  company_stage: "startup|scale-up|enterprise|faang"
  persona_fit_primary: ""
  persona_fit_secondary: ""
  persona_scores:
    tech_pm: 0
    growth_pm: 0
    strategy_pm: 0
    product_pm: 0
  company_brief_id: "cb-[uuid]"
  alignment_score_baseline: 0
  alignment_score_final: 0
  uplift: 0
```

#### Optimized JD Template Output (4 key sections):

From `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/jd-optimize/templates/optimized-jd.template.md`:

1. **High-Visibility Keywords (ATS Optimized)** -- `{high_visibility_keywords}`
2. **P0 Requirement Mapping** -- `{p0_requirements_mapping}`
3. **Personal Signal Integration** -- `{personal_signal_integration_bullets}`
4. **Competitive Moat Analysis** -- `{competitive_moat_markdown}`

#### JD-Optimize Steps Producing Outbound-Relevant Data:

| Step | File | Data Produced |
|---|---|---|
| Step 03 | `step-03-keyword-extraction.md` | ATS keywords ranked by frequency and placement priority |
| Step 04 | `step-04-competitive-moat.md` | Unique differentiators vs. typical applicant profile |
| Step 05 | `step-05-adversarial-review.md` | Quality review: hallucinated claims, generic phrases, missing P0 coverage |
| Step 06 | `step-06-final-output.md` | Final `optimized-jd.md` using template |

#### ATS Keyword Weights:
From `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/jd-optimize/data/reference/ats-keyword-weights.yaml`:
```yaml
ats_weights:
  p0_exact_match: 1.0
  p1_synonym_match: 0.7
  p2_contextual_match: 0.4
```

#### Networking Hooks:
From `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/jd-optimize/data/reference/networking-hooks.yaml`:
```yaml
networking_hooks:
  cold_outreach: [shared_background, mutual_connection, content_engagement]
  warm_intro: [referral, alumni, conference_meetup]
```

#### Scoring Rubric (5 Dimensions, max 100):
- **Dimension 1**: Keyword Coverage (max 20) -- `(JD ATS keywords in resume / total) x 20`
- **Dimension 2**: Ownership Match (max 20)
- **Dimension 3**: Metric Density (max 20)
- **Dimension 4**: Persona Alignment (max 20)
- **Dimension 5**: (fifth dimension, max 20)

### 3.6 Command Stubs

**sync-publicist activation** (`/Users/satvikjain/Downloads/sync/linkright/.lr-commands/claude-code/sync-publicist.sh`):
```bash
#!/bin/bash
echo "Activating Linkright Agent: sync-publicist in claude-code..."
antigravity activate sync-publicist --ide claude-code
```

**outbound-campaign execution** (`/Users/satvikjain/Downloads/sync/linkright/.lr-commands/claude-code/outbound-campaign.sh`):
```bash
#!/bin/bash
echo "Executing Linkright Workflow: outbound-campaign in claude-code..."
antigravity run outbound-campaign --ide claude-code
```

### 3.7 Outreach Messaging Generation Flow (Current)

The current end-to-end flow:

```
[JD-Optimize Workflow] ──> jd_profile.yaml (P0 requirements, ATS keywords, persona scores)
         |
         v
[User pastes recruiter PDF/text]
         |
         v
[Step 01: Ingest] ──> recruiter_profile.json
    (sync-parser: Name, Company, Role, Pain Points, Shared Signals)
         |
         v
[Step 02: Strategy] ──> outreach_strategy.json
    (sync-publicist/Lyric: "The Bridge", tone selection, Golden Signals)
         |
         v
[Step 03: Cover Letter] ──> cover_letter.md
    (sync-publicist/Lyric: Hook -> Bridge -> Synergy, 300-400 words)
         |
         v
[Step 04: In-Mail] ──> in_mail.md
    (sync-publicist/Lyric: personalized, metric-driven, soft CTA)
         |
         v
[Step 05: Connect Invite] ──> connection_invite.txt (x3 variants)
    (sync-publicist/Lyric: <=300 chars, Bridge reference)
         |
         v
[Step 06: Profile Updates] ──> profile_updates.md
    (flex-publicist/Echo: headline + About section suggestions)
```

### 3.8 Gap Analysis: What's Missing for Full Cover Letter Generation

| Gap ID | Description | Severity | Details |
|---|---|---|---|
| **GAP-01** | **No `steps-b/` directory exists** | Medium | The outbound-campaign has no `steps-b/` (build/bootstrap) path. The glob returned 0 files. Session bootstrap is handled inline by `step-01-load-session-context.md` and `step-01b-resume-if-interrupted.md`. |
| **GAP-02** | **Missing explicit data handoff contract between jd-optimize and outbound-campaign** | High | The outbound-campaign `workflow.yaml` references `data/jd-profile.yaml` as input, but there is no automated mechanism to populate this file from jd-optimize output. The `jd_profile` schema lives in the master orchestration doc but is not replicated as a schema file in the outbound-campaign directory. |
| **GAP-03** | **Missing `contacts.csv` population** | Medium | The `workflow.yaml` declares `data/contacts.csv` as a FULL_LOAD input, but no step in the workflow creates or populates this file. It is assumed to be user-provided. |
| **GAP-04** | **No template for cover letter output** | Medium | The campaign template (`campaign.template.md`) covers the overall strategy output but has no dedicated cover letter template. The master orchestration specifies output as `cover_letter.md` but the current step file only says "Draft the cover letter" without a structured template. |
| **GAP-05** | **Cover letter structure incomplete in step file** | Medium | `step-out-03-cover-letter.md` defines only 3 structure elements (Hook, Bridge, Synergy) while the master orchestration specifies a richer 3-paragraph structure: (1) "The Hook" with specific company/recruiter reference, (2) "The Why Me?" with Bridge signal + metrics, (3) "The Why Them?" with internal motivations not on resume. The current step file lacks paragraph 3 detail. |
| **GAP-06** | **No `flex-publicist` agent definition in Sync module** | Medium | Step 06 delegates to `flex-publicist` (Echo) for profile optimization, but this agent lives in the Flex module. No cross-module dependency is formally declared. |
| **GAP-07** | **Sidecar memory is minimal** | Low | The sync-publicist sidecar `memories.md` has only 4 entries. As campaigns execute, this should grow with learned patterns (what hooks worked, what CTAs converted). No mechanism to append memories after campaign completion exists. |
| **GAP-08** | **No email/follow-up sequence** | Medium | The workflow covers LinkedIn artifacts (InMail, Connect Invite) and Cover Letter, but does not generate email follow-up sequences. The `follow-up-cadence.yaml` reference data exists in jd-optimize but is not consumed by outbound-campaign. |
| **GAP-09** | **No resume version selection step** | Medium | The master orchestration (line 512-513) shows `step-02-select-jd-profile.md` and `step-03-select-resume-version.md` as part of the outbound flow, but the current implementation does not include resume version selection. |
| **GAP-10** | **Missing company_brief integration** | Medium | The `jd_profile` schema includes `company_brief_id` linking to a `company_brief` object (with `pm_culture`, `tone_descriptor`, `brand_values`, `cautions`). This rich context is not explicitly consumed in the outbound-campaign steps. |
| **GAP-11** | **Validation step is generic** | Low | The `steps-v/step-01-validate.md` has only 3 lines of protocol. No specific validation criteria (character count verification, signal presence check, tone consistency) are enumerated. The `checklist.md` has criteria but is not formally linked to the validation step. |

### 3.9 Memory Governance

From `/Users/satvikjain/Downloads/sync/linkright/_lr/_memory/config.yaml`:
```yaml
memory_id: lr-global-memory
version: 1.0.0
layers:
  - id: "sidecar-core"     # type: json, persist: true, ttl: null (permanent)
  - id: "sidecar-insights"  # type: markdown, persist: true, ttl: 90d
vector_settings:
  collection: "lr-signals"
  distance_metric: "cosine"
  dimensions: 1536
```

The `sync-publicist-sidecar/` directory contains both `memories.md` and `instructions.md`. This pattern is consistent across all 20+ agents in the `_lr/_memory/` directory. Each agent has its own sidecar folder with the same two files. The memory layer is persistent with no TTL for core data, and 90-day TTL for insights.

### 3.10 Summary of Key Data Pipelines

**Pipeline 1: JD-Optimize -> Outbound-Campaign**
```
jd-raw.md + signals-*.yaml + reference/*.yaml
    --> [53-step JD optimization]
    --> optimized-jd.md (ATS keywords, P0 mapping, signal integration, competitive moat)
    --> jd-profile.yaml (consumed by outbound-campaign)
```

**Pipeline 2: Outbound-Campaign Internal**
```
jd-profile.yaml + contacts.csv + recruiter PDF/text
    --> recruiter_profile.json
    --> outreach_strategy.json (The Bridge + tone)
    --> cover_letter.md + in_mail.md + connection_invite.txt
    --> profile_updates.md
```

**Pipeline 3: Portfolio-Deploy (slides integration)**
```
MongoDB career signals (top 5 by Strategic Gravity)
    --> slides_content.json (Problem/Process/Metric/Legacy)
    --> portfolio_content.json (project cards + Life Journey)
    --> HTML/CSS injection from templates
    --> gh-pages branch push --> Live URL
```