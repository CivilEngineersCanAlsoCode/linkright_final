# Session Variable Enumeration per Workflow Module

This document maps the session variables that must be persisted for each Linkright workflow module to ensure robust session resumption and context continuity.

---

## 1. Global Session Variables (Mandatory for all)

These variables are required for the standard checkpoint schema across all 17 workflows.

- `workflow_id`: Unique identifier for the active workflow.
- `last_completed_step`: The ID of the step most recently finished (e.g., `step-04a`).
- `timestamp`: ISO-8601 string of the last activity.
- `beads_issue_id`: The ID of the task in the Beads governance layer.
- `session_id`: Unique session UUID.

---

## 2. Sync Module (Outbound Career Positioning)

**Workflows:** `jd-optimize`, `outbound-campaign`, `portfolio-deploy`

| Category | Variable Name | Description |
| :--- | :--- | :--- |
| **Core Identifiers** | `jd_id` | Unique ID for the target Job Description. |
| | `cb_id` | Unique ID for the Company Brief (Scout output). |
| | `rv_id` | Unique ID for the specific Resume Version. |
| **Input Data** | `raw_jd_text` | Verbatim text of the pasted/fetched JD. |
| | `source_type` | `paste`, `url-fetch`, `upload`, or `manual`. |
| | `jd_file_path` | Path to the input JD file (if applicable). |
| | `resume_file_path` | Path to the base resume being optimized. |
| **Profile & Context** | `jd_profile` | Full object containing parsed metadata, requirements, and keywords. |
| | `company_brief` | Full object containing company stage, culture, and brand signals. |
| | `persona_fit_primary` | The selected primary persona tilt (Tech/Growth/Strategy/Product). |
| | `persona_fit_secondary` | The secondary persona tilt (if applicable). |
| **Scoring & Metrics** | `persona_scores` | Dictionary of scores for all 4 personas. |
| | `alignment_score_baseline` | Initial alignment score (0-100). |
| | `alignment_score_final` | Post-optimization alignment score. |
| | `uplift` | Delta between baseline and final score. |
| **Outputs** | `output_folder` | Target directory for generated artifacts. |

---

## 3. Flex Module (Inbound Brand Building)

**Workflows:** `content-automation`

| Category | Variable Name | Description |
| :--- | :--- | :--- |
| **Context** | `platform` | Target social platform (LinkedIn, Twitter, etc.). |
| | `content_type` | Type of post (Thread, Hook, Carousel, Insight). |
| | `target_audience` | The specific persona being reached. |
| **Data Inputs** | `themes` | List of selected themes from `themes.yaml`. |
| | `past_performance` | Summary metrics from `analytics.csv`. |
| | `new_signals` | Fresh career signals captured from recent activities. |
| **Narrative & Style** | `narrative_hooks` | Selected story arcs for content generation. |
| | `voice_profile` | Specific vocabulary and tone constraints from `voice-profile.md`. |
| | `style` | Formatting rules (e.g., whitespace-heavy, value-first). |
| **Artifacts** | `linkedin_draft_path` | Path to the generated draft text. |

---

## 4. Squick Module (Enterprise Rapid Shipping)

**Workflows:** `1-analysis`, `2-plan`, `3-solutioning`, `4-implementation`, `enterprise-ship`

| Category | Variable Name | Description |
| :--- | :--- | :--- |
| **Project Context** | `sprint_id` | Current sprint identifier. |
| | `velocity` | Target or historical velocity for planning. |
| | `team_size` | Number of agents/humans in the team. |
| | `project_concept` | High-level goal or problem statement. |
| | `raw_brief` | Original unparsed project brief. |
| **Requirements** | `technical_requirements` | List of architectural and functional constraints. |
| **User Identity** | `user_name` | Validated professional name. |
| | `user_bio` | Professional summary. |
| | `target_role` | Role being targeted by the project. |
| | `target_companies` | List of relevant organizations. |
| | `user_skills` | Array of verified technical/soft skills. |
| **System State** | `system_mode` | Mode of operation (development, staging, production). |
| | `system_version` | Current system version number. |

---

## 5. Deployment Checklist for Schema Implementation

When implementing the YAML checkpoint schema (`sync-zas.4.3.1`), ensure:
- [ ] `session_variables` is a top-level dictionary.
- [ ] Each module's specific variables are nested or flat-listed within `session_variables`.
- [ ] All variables have default values (e.g., `null` or empty list) to avoid parsing errors.
- [ ] Schema is validated against existing `workflow.yaml` inputs.
