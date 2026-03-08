# PHASE A: Load Session Context — Complete Architecture

**Date:** 2026-03-09
**Phase:** A (Initialization & Personalization)
**Status:** Specification Complete
**Quality Standard:** 100% of user preferences captured, validated, and persisted for Phases D-M

---

## Executive Summary

**Phase A** is the initialization layer of the jd-optimize workflow. It serves three critical functions:

1. **Load Source of Truth** → Import your Obsidian Vault (projects, achievements, skills, salary history)
2. **Capture Output Preferences** → Ask user for customization choices (company, colors, template mode)
3. **Validate & Persist** → Save all context + preferences in `session-preferences.yaml` for later phases

**User Role:** You (Satvik) interact with an interactive form/wizard
**System Role:** Linkright loads your vault, stores preferences, validates before Phase D starts
**Output:** Complete, structured context file that Phases D-M read from

---

## Part 1: What Phase A Does (3-Step Flow)

### Step 1a: Load Session Context from Obsidian Vault

**Input:** Path to your Obsidian Vault (e.g., `~/Obsidian/Career/`)

**System Actions:**
```
1. Scan vault for files matching patterns:
   - /Projects/ → Load all project descriptions, outcomes, metrics
   - /Achievements/ → Load all career wins, awards, recognitions
   - /Skills/ → Load all technical skills, domains, proficiencies
   - /Salary History/ → Load compensation context (for negotiation signals)
   - /Roles/ → Load past roles, companies, tenure

2. Parse Markdown frontmatter + body for structured data:
   - Project: {name, description, impact, technologies, role}
   - Achievement: {title, date, context, quantified_result}
   - Skill: {name, proficiency_level, years_experience, endorsements}

3. Create in-memory knowledge graph:
   - Nodes: Projects, Achievements, Skills, Companies, Dates
   - Edges: "This project used this skill", "This achievement was in this role"
   - Index: Fast lookup by keyword, date range, technology

4. Validate context completeness:
   - ✅ Projects loaded: X
   - ✅ Achievements loaded: Y
   - ✅ Skills loaded: Z
   - ⚠️ Warning: Missing salary history (optional)
   - ✅ Knowledge graph built successfully
```

**Output:** In-memory context ready for Phase D (no file written yet)

---

### Step 1b: Capture Output Preferences (Interactive Form)

**User Interaction:** Linked earlier as "P1-6-OUTPUT-PREFERENCES-SYSTEM.md"

The form asks 5 questions:

**Question A: Template Mode**
```
Which format would you like to generate?
○ CV (Professional A4 Resume) ← Recommended
○ Portfolio (Interactive Material 3 UI)
○ Combined (Both views)
```

**Question B: Company & JD**
```
Which company are you applying to?
Input: [Google]

Which role are you targeting?
Input: [Senior Backend Engineer]

Provide the job description:
[Large text area for pasting JD]
```

**Question C: Brand Colors (Optional)**
```
Brand colors for this company?
[Color Picker #4285F4] ← Auto-detected as "Google Blue"

Are these correct?
○ Yes, use detected colors
○ No, let me customize

If custom:
  --brand-blue: [Picker] (must have 4.5:1 contrast)
  --brand-red: [Picker]
  --brand-yellow: [Picker]
  --brand-green: [Picker]

Select color scenario:
○ Multi-chromatic (like Google/Slack)
○ Monochromatic (like Spotify/Netflix)
○ Dual-tone (like Amazon/Uber)
```

**Question D: Layout Preference**
```
How dense should the resume be?
○ Spacious (more whitespace, ~8 bullets)
○ Compact (optimal density, ~10 bullets) ← Recommended
```

**Question E: Output Configuration**
```
Output format?
○ PDF only (print-ready)
○ HTML only (interactive portfolio)
○ Both (PDF + HTML)

Where to save?
○ Obsidian Vault (/Career/Resumes/[Company]/[Date]/)
○ Desktop (quick access)
○ Custom path: [_____________________]
```

**Output:** Preferences object (will be saved in step 1c)

---

### Step 1c: Validate & Persist Context + Preferences

**Validation Checklist:**
```yaml
Phase A Exit Validation:
  Vault Context:
    ✓ Obsidian Vault path accessible
    ✓ At least 5 projects loaded
    ✓ At least 10 achievements loaded
    ✓ At least 15 skills loaded
    ✓ Knowledge graph built without errors

  User Preferences:
    ✓ Company name provided (non-empty)
    ✓ JD loaded and parsed (contains 10+ requirements)
    ✓ Template mode selected (cv | portfolio | combined)
    ✓ Brand colors provided (primary mandatory)
    ✓ Brand colors WCAG AA compliant (≥4.5:1 contrast)
    ✓ Layout density selected
    ✓ Output format selected
    ✓ Output location accessible

  Cross-Validation:
    ✓ No conflicting preferences
    ✓ Output path has write permissions
    ✓ Template mode supports selected output format
```

**Persistence:** Write `session-preferences.yaml`

```yaml
# File: .artifacts/session-preferences.yaml
# Created by Phase A, read by Phases D-M

session_metadata:
  session_id: "satvik-jain-sync-2026-03-09-143022"
  created_at: "2026-03-09T14:30:22Z"
  user: "Satvik Jain"
  phase: "A"

# ═══════════════════════════════════════════════════════════════════
# OBSIDIAN VAULT CONTEXT (Source of Truth)
# ═══════════════════════════════════════════════════════════════════
vault_context:
  vault_path: "~/Obsidian/Career/"

  projects:
    - id: "proj-001"
      name: "Spotify Signal Curation System"
      description: "Real-time ML pipeline for personalizing discovery"
      technologies: ["Python", "Kafka", "Spark", "MLflow"]
      impact: "Increased engagement 23%, reduced recommendation latency 40%"
      role: "Senior ML Engineer"
      date_range: "2024-01-01 to 2025-12-31"

    - id: "proj-002"
      name: "Google Cloud Dataflow Optimization"
      description: "Cost optimization of batch processing pipelines"
      technologies: ["Go", "Dataflow", "BigQuery", "Pub/Sub"]
      impact: "Reduced infrastructure costs by $2.1M annually"
      role: "Backend Engineer"
      date_range: "2023-06-01 to 2024-12-31"

    # ... (total 12+ projects loaded)

  achievements:
    - id: "ach-001"
      title: "Led Platform Reliability Surge"
      context: "Spotify backend infrastructure"
      quantified_result: "99.98% uptime (up from 99.94%), saved 3 outages"
      date: "2025-03-01"

    - id: "ach-002"
      title: "Published Open Source Library"
      context: "Go-based data validation framework"
      quantified_result: "2.3K GitHub stars, 50+ companies using"
      date: "2024-11-15"

    # ... (total 47+ achievements loaded)

  skills:
    - name: "Backend Engineering"
      proficiency: "expert"
      years: 8
      domains: ["Go", "Python", "Rust", "Distributed Systems"]
      endorsements: 42

    - name: "ML/Data Pipeline"
      proficiency: "advanced"
      years: 5
      domains: ["Spark", "Kafka", "MLflow", "Feature Stores"]
      endorsements: 28

    # ... (total 34+ skills loaded)

  salary_history:
    - company: "Spotify"
      role: "Senior ML Engineer"
      salary: 310000
      equity: 80000
      bonus: 50000
      date: "2025-01-01"

# ═══════════════════════════════════════════════════════════════════
# USER OUTPUT PREFERENCES (Personalization)
# ═══════════════════════════════════════════════════════════════════
preferences:
  # Template & Company
  template_mode: "cv"                        # Options: cv | portfolio | combined
  company_name: "Google"                     # Target company
  job_title: "Senior Backend Engineer"       # Target role
  job_description_path: ".artifacts/jd-google-sre.txt"

  # Visual Customization
  brand_colors:
    primary: "#4285F4"                       # --brand-blue (Google Blue)
    accent_1: "#EA4335"                      # --brand-red (Google Red)
    accent_2: "#FBBC05"                      # --brand-yellow (Google Yellow)
    accent_3: "#34A853"                      # --brand-green (Google Green)
    color_scenario: "multi-chromatic"        # Detection: which brand style?
    wcag_compliant: true                     # Primary vs white = 5.2:1 ✓

  # Typography & Layout
  layout_density: "compact"                  # Options: spacious | compact
  font_sizes:
    --font-size-name: "20pt"                 # Your name (hero text)
    --font-size-header: "13pt"               # Section titles
    --font-size-subhead: "10.5pt"            # Company names, degrees
    --font-size-body: "9.5pt"                # Bullet points (compact)
    --font-size-contact: "9pt"               # Contact info

  # Output Configuration
  output_format: "pdf"                       # Options: pdf | html | both
  output_location: "obsidian-vault"          # Options: vault | desktop | custom
  output_base_path: "~/Obsidian/Career/Resumes/Google/2026-03-09/"

  output_files:
    cv_pdf: "Google_Satvik_Jain_Resume.pdf"
    portfolio_html: "Google_Satvik_Jain_Portfolio.html"

# ═══════════════════════════════════════════════════════════════════
# JOB DESCRIPTION ANALYSIS (Parsed in Phase A)
# ═══════════════════════════════════════════════════════════════════
jd_analysis:
  company: "Google"
  role: "Senior Backend Engineer"
  seniority_level: "senior"
  requirements_extracted:
    mandatory:
      - "10+ years backend engineering experience"
      - "Proficiency in Go or C++"
      - "Experience with large-scale distributed systems"
      - "Leadership experience (team size 5+)"

    nice_to_have:
      - "Published papers or open source contributions"
      - "Experience with Google Cloud Platform"
      - "Knowledge of ML/AI systems"

  key_terms: ["distributed systems", "performance optimization", "Go", "C++", "leadership"]
  skills_mentioned: ["Go", "C++", "distributed systems", "databases", "networking"]
  metrics_mentioned: ["10+ years", "5+ team", "millions of QPS"]

# ═══════════════════════════════════════════════════════════════════
# VALIDATION RESULTS (Phase A Exit Criteria)
# ═══════════════════════════════════════════════════════════════════
validation:
  vault_context_loaded: true
  projects_count: 12
  achievements_count: 47
  skills_count: 34

  preferences_complete: true
  company_name_provided: true
  jd_loaded: true
  jd_parsing_success: true
  colors_wcag_compliant: true
  output_location_accessible: true

  ready_for_phase_d: true
  warnings: []
  errors: []

# ═══════════════════════════════════════════════════════════════════
# SIGNAL SELECTION HINTS (For Phase E)
# ═══════════════════════════════════════════════════════════════════
signal_hints:
  primary_signals:
    - "Distributed systems expertise (8 years)"
    - "Go proficiency (6 years)"
    - "Leadership (managed 7-person team)"

  secondary_signals:
    - "Open source (2.3K GitHub stars)"
    - "Published talks (3 tech conferences)"
    - "Infrastructure optimization ($2.1M saved)"

  gap_analysis:
    - "Target requires 10+ years, you have 8 (gap: -2 years)"
    - "Target expects Go expert, you are expert (match ✓)"
    - "Target wants ML/AI knowledge, you have 5 years (match ✓)"
```

**Success Criteria:**
- ✅ All vault context loaded without errors
- ✅ All user preferences captured
- ✅ Validation passes (no blockers)
- ✅ session-preferences.yaml written to `.artifacts/`
- ✅ Ready to proceed to Phase D

---

## Part 2: Data Structures & Formats

### Input: Obsidian Vault Structure (Your Directory)

```
~/Obsidian/Career/
├── Projects/
│   ├── Spotify Signal Curation.md
│   ├── Google Cloud Dataflow.md
│   ├── Amazon Compliance Platform.md
│   └── ... (12+ projects)
│
├── Achievements/
│   ├── Led Platform Reliability Surge.md
│   ├── Published Open Source Library.md
│   ├── Negotiated 40% Salary Raise.md
│   └── ... (47+ achievements)
│
├── Skills/
│   ├── Backend Engineering.md
│   ├── ML & Data Pipelines.md
│   ├── Leadership & Mentoring.md
│   └── ... (34+ skills)
│
└── Salary History/
    ├── Spotify 2025.md
    ├── Google 2023.md
    └── ... (salary context)
```

**Format per File:**
```markdown
---
title: "Spotify Signal Curation System"
type: "project"
date: 2024-01-01
technologies: ["Python", "Kafka", "Spark"]
---

# Project Overview
Real-time ML pipeline for personalizing music discovery on Spotify.

## Metrics
- Increased engagement: +23%
- Reduced recommendation latency: 40%
- Impacted: 100M+ users

## Your Role
Senior ML Engineer on the Discovery Platform team
```

### Output: session-preferences.yaml

Described in Part 1c above. Key sections:
- `vault_context` → All loaded projects, achievements, skills
- `preferences` → User's customization choices
- `jd_analysis` → Parsed job description
- `validation` → Pass/fail checklist
- `signal_hints` → Suggestions for Phase E

---

## Part 3: Phase A Step-by-Step Execution

### Step 1: User Runs Phase A

```bash
cd /Users/satvikjain/Downloads/sync/context/linkright/_lr
./agents/core/lr-orchestrator/phase-a-load-context.sh
```

### Step 2: System Detects Obsidian Vault

```bash
# Linkright scans for vault
# Looks in: ~/Obsidian/, ~/Documents/Obsidian/, etc.
# Confirms: "Found vault at ~/Obsidian/Career/"
# Displays: "Ready to load 12 projects, 47 achievements, 34 skills"
```

### Step 3: User Interacts with Form (5 Questions)

```
═══════════════════════════════════════════════════════════════════
  LINKRIGHT PHASE A: PERSONALIZATION & OUTPUT SETUP
═══════════════════════════════════════════════════════════════════

✅ STEP 1: Obsidian Vault Loaded
  Projects: 12 ✓
  Achievements: 47 ✓
  Skills: 34 ✓

📋 STEP 2: Template Mode Selection
  Select format:
  [X] CV (Professional A4 Resume)
  [ ] Portfolio (Interactive Material 3 UI)
  [ ] Combined (Both views)

🎯 STEP 3: Company & JD Targeting
  Company: [Google_________________]
  Role: [Senior Backend Engineer_____]

  Provide JD:
  [Paste job description here...]

  [↓ Load & Parse JD ↓]

🎨 STEP 4: Brand Colors
  Detected: Google Blue (#4285F4) ✓
  Other colors auto-detected: Red, Yellow, Green ✓

  WCAG Check: ✓ 5.2:1 contrast ratio (excellent)

  [✓ Accept] [○ Customize]

📐 STEP 5: Layout Density
  [○ Spacious] [X] Compact

💾 STEP 6: Output Configuration
  Format: [X] PDF [ ] HTML [ ] Both
  Location: [X] Vault [ ] Desktop
  Path: ~/Obsidian/Career/Resumes/Google/2026-03-09/

  [✓ Confirm & Save]

═══════════════════════════════════════════════════════════════════
✅ SESSION PREFERENCES SAVED
═══════════════════════════════════════════════════════════════════

File: .artifacts/session-preferences.yaml
Size: 8.2 KB
Status: Ready for Phase D

Next: Run Phase D (Persona Scoring)
```

### Step 4: System Validates & Saves

```yaml
Validation Results:
  ✅ All vault context loaded
  ✅ User preferences complete
  ✅ Colors WCAG compliant
  ✅ Output path accessible
  ✅ Ready for Phase D: YES

Session saved to: .artifacts/session-preferences.yaml
Timestamp: 2026-03-09T14:30:22Z
```

---

## Part 4: What Phase A Enables (Phases D-M)

Every phase after A reads from `session-preferences.yaml`:

```
Phase A writes:     session-preferences.yaml
                          ↓
                    (Knowledge base for all downstream)
                          ↓
Phase D reads:      preferences.company_name = "Google"
                    vault_context.projects = [12 projects]
                    vault_context.achievements = [47 achievements]

                          ↓
Phase E reads:      signal_hints.primary_signals
                    jd_analysis.key_terms
                    vault_context.skills

                          ↓
Phase K reads:      preferences.brand_colors.*
                    preferences.font_sizes.*
                    preferences.layout_density

                          ↓
Phase M reads:      preferences.output_format
                    preferences.output_location
                    (Generates final PDF/HTML)
```

---

## Part 5: Key Architectural Decisions

**Decision 1: Why load Obsidian Vault and not resume file?**
- Resume is OUTPUT (specific to one JD)
- Vault is SOURCE OF TRUTH (comprehensive, timeless)
- Phases D-M generate custom resumes from vault context

**Decision 2: Why validate colors in Phase A?**
- WCAG compliance is non-negotiable
- Failure fast → User can correct immediately
- No wasted computation on inaccessible designs

**Decision 3: Why session-preferences.yaml (not individual files)?**
- Single source of truth for session
- Easy to inspect, debug, replay
- Atomic: entire session context in one place
- Portable: can be shared, archived, reused

**Decision 4: Why 5 preference categories?**
- Template Mode → Defines output structure
- Company/JD → Defines content strategy
- Brand Colors → Defines visual identity
- Layout → Defines typographic density
- Output → Defines delivery format
- These are orthogonal; each can be changed independently

---

## Part 6: Quality Metrics

**Phase A Success Definition:**
```yaml
Metric 1: Vault Load Rate
  Target: 100% (all files in vault loaded)
  Measurement: vault_context.projects_count + achievements_count + skills_count
  Success: ≥15 items total

Metric 2: User Preference Completeness
  Target: 100% (all 5 categories answered)
  Measurement: preferences.* fields populated
  Success: 5/5 categories filled

Metric 3: Validation Pass Rate
  Target: 100% (all validation checks pass)
  Measurement: validation.ready_for_phase_d == true
  Success: No blockers detected

Metric 4: WCAG Compliance
  Target: 100% (all colors meet AA standard)
  Measurement: validation.colors_wcag_compliant == true
  Success: Primary color ≥4.5:1 contrast vs white

Metric 5: File Persistence
  Target: 100% (session-preferences.yaml written)
  Measurement: File exists and is valid YAML
  Success: File size > 5KB, parses without errors
```

---

## Summary

**Phase A: Load Session Context** is the initialization layer that:

1. **Loads Your Obsidian Vault** → All projects, achievements, skills (source of truth)
2. **Captures Output Preferences** → Company, colors, template mode, output format
3. **Validates & Persists** → Saves everything to `session-preferences.yaml` for Phases D-M

**User Experience:** Interactive form asking 5 questions, ~5 minutes
**System Output:** Structured context file ready for intelligent resume generation
**Quality Gate:** All validation passes before Phase D can start

**Next Phase:** Phase D (Persona Scoring) uses this context to analyze your "persona" against the target company's requirements.
