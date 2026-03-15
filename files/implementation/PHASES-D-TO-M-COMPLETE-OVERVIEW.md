# Phases D-M: Complete Overview — All 13 Steps

**Date:** 2026-03-09
**Purpose:** Understand COMPLETE flow from persona scoring to final resume
**Output Location:** `/sync-artifacts/[Company]/[Date]/`
**Total Duration:** ~10-15 minutes (all phases automated)

---

## Visual Flow: All Phases

```
PHASE A (User Decision)
├─ Load Obsidian Vault
├─ Ask 5 questions (company, JD, colors, etc.)
└─ Save session-preferences.yaml

                    ↓ (Phases D-M run automatically)

PHASE D: PERSONA SCORING
├─ Input: Vault context + Company/JD
├─ Process: Analyze fit on 5 dimensions
└─ Output: persona_score.json (87.5% fit example)

                    ↓

PHASE E: SIGNAL RETRIEVAL
├─ Input: persona_score.json
├─ Process: "Which achievements match this fit?"
└─ Output: selected_signals.json (best 10-15 achievements)

                    ↓

PHASE F: BASELINE SCORING
├─ Input: selected_signals.json
├─ Process: Quantify each signal (metrics, impact)
└─ Output: baseline_scores.json (all signals with numbers)

                    ↓

PHASE G: GAP ANALYSIS
├─ Input: baseline_scores.json + JD requirements
├─ Process: "What signals are we missing?"
└─ Output: gap_analysis.json (missing signals + how to address)

                    ↓

PHASE H: INQUISITOR (Question Generation)
├─ Input: gap_analysis.json
├─ Process: "What questions should resume answer?"
└─ Output: questions.json (9-12 key questions)

                    ↓

PHASE I: NARRATIVE (Mapping)
├─ Input: questions.json + selected_signals.json
├─ Process: "Map signals to questions (story structure)"
└─ Output: narrative_mapping.json (signal→question mapping)

                    ↓

PHASE J: CONTENT (Writing)
├─ Input: narrative_mapping.json
├─ Process: "Write resume bullets from signals"
└─ Output: resume_bullets.json (7-10 polished bullets)

                    ↓

PHASE K: LAYOUT (Validation)
├─ Input: resume_bullets.json + A4 constraints
├─ Process: "Does this fit one page?"
└─ Output: layout_validation.json (fits? heights? overflow?)

                    ↓

PHASE L: STYLING (Design)
├─ Input: layout_validation.json + template + brand colors
├─ Process: "Apply CSS variables (Google blue, fonts, etc.)"
└─ Output: styled_resume.html (HTML with embedded CSS)

                    ↓

PHASE M: FINAL (Scoring & Export)
├─ Input: styled_resume.html
├─ Process: "Final validation + save to sync-artifacts"
└─ Output: [Company]_[Role]_Resume_[Date].html (SAVED)

                    ↓

DONE! Ready to use!
```

---

## Phases D-M: Details (One by One)

### PHASE D: Persona Scoring ⭐ ALREADY CREATED

```yaml
What: Analyze your fit against job
Input: Vault (12 projects, 47 achievements, 34 skills) + Company/JD
Process:
  - Core skills match: Go vs C++, distributed systems, etc.
  - Experience: 8 years vs 10 required
  - Domain: Your expertise vs job emphasis
  - Leadership: Mentoring vs team management
  - Nice-to-have: Papers, open source, GCP

Output: persona_score.json
  {
    "overall_fit": 87.5,
    "level": "STRONG_FIT",
    "strengths": ["Go expertise", "distributed systems", ...],
    "gaps": ["C++ knowledge", "team leadership", ...],
    "signals_to_emphasize": ["go_expertise", "performance_optimization", ...]
  }

Example Score: 87.5% (STRONG_FIT)
Next Phase: E reads this and selects signals
File Saved: /sync-artifacts/Google/2026-03-09/phase-d-persona-score.json
```

---

### PHASE E: Signal Retrieval 🔍 TODO

```yaml
What: Select your best achievements based on fit
Input: persona_score.json (fit analysis + recommended signals)
       Vault achievements (47 total)

Process:
  - Phase D said: "Emphasize Go expertise, distributed systems, optimization"
  - Signal Retrieval: "Find achievements matching these themes"
  - Scoring: "Which are strongest? (highest impact, quantifiable)"
  - Selection: "Pick best 10-15 signals"

Logic Example:
  Phase D says: Emphasize "Go expertise"
  → Find all achievements using Go
  → "Spotify Signal Curation" uses Kafka/Spark (related)
  → "Google Dataflow" uses Go directly ✅ STRONG SIGNAL
  → Select these

Output: selected_signals.json
  {
    "signals": [
      {
        "title": "Google Cloud Dataflow Optimization",
        "impact": "Reduced costs $2.1M annually",
        "technologies": ["Go", "Dataflow", "BigQuery"],
        "relevance_score": 95,
        "reason": "Direct match on Go + cost optimization"
      },
      {
        "title": "Spotify Signal Curation System",
        "impact": "Increased engagement 23%, latency 40%",
        "technologies": ["Python", "Kafka", "Spark"],
        "relevance_score": 85,
        "reason": "Distributed systems + performance optimization"
      },
      # ... 10-15 more signals
    ],
    "total_signals_selected": 13,
    "total_vault_signals": 47,
    "selection_ratio": "28% (best of best)"
  }

File Saved: /sync-artifacts/Google/2026-03-09/phase-e-selected-signals.json
```

---

### PHASE F: Baseline Scoring 📊 TODO

```yaml
What: Quantify impact of each signal
Input: selected_signals.json (13 signals)

Process:
  - Each signal has metrics (usually)
  - Extract numbers: "$2.1M saved", "40% latency reduction", "23% engagement"
  - Normalize scores (0-100 scale)
  - Create baseline for comparison later

Example:
  Signal: "Google Cloud Dataflow Optimization"
  Metrics Found:
    - Cost reduction: $2.1M
    - Team impact: 50+ engineers
    - Time saved: 40% query latency

  Baseline Score:
    Cost impact: 95/100 (very high)
    Scale impact: 90/100 (affects many)
    Performance impact: 95/100 (significant improvement)
    Overall signal baseline: 93/100

Output: baseline_scores.json
  {
    "signals": [
      {
        "signal": "Google Cloud Dataflow Optimization",
        "metrics": {
          "cost_saved": "$2.1M",
          "baseline_score": 93,
          "impact_area": "infrastructure_cost",
          "teams_affected": 50
        }
      },
      # ... 12 more signals with scores
    ]
  }

File Saved: /sync-artifacts/Google/2026-03-09/phase-f-baseline-scores.json
```

---

### PHASE G: Gap Analysis 🕳️ TODO

```yaml
What: Find missing signals relative to job requirements
Input: baseline_scores.json (your 13 signals)
       JD analysis (what Google wants)

Process:
  - Google JD says:
    - "10+ years backend" → You have 8 (GAP: -2 years)
    - "C++ proficiency" → You have Go only (GAP: no C++)
    - "Large-scale system design" → You have Spotify/Google (NO GAP)
    - "Leadership (team 5+)" → You mentored 3 (GAP: team management)

  - For each gap: "How can we address this?"
    - Gap: Missing 2 years → "Emphasize quality > quantity"
    - Gap: No C++ → "Emphasize Go as equivalent/superior"
    - Gap: Team leadership → "Emphasize technical leadership instead"

Output: gap_analysis.json
  {
    "gaps": [
      {
        "gap_id": "exp-001",
        "requirement": "10+ years backend engineering",
        "your_level": "8 years",
        "gap": "-2 years",
        "severity": "MEDIUM",
        "how_to_address": "Emphasize high-quality work, not just years"
      },
      {
        "gap_id": "skill-001",
        "requirement": "C++ proficiency",
        "your_level": "None (have Go instead)",
        "gap": "Missing language",
        "severity": "LOW",
        "how_to_address": "Position Go as superior choice for this work"
      },
      {
        "gap_id": "lead-001",
        "requirement": "Leadership (team 5+)",
        "your_level": "Mentored 3 engineers",
        "gap": "No formal team management",
        "severity": "MEDIUM",
        "how_to_address": "Emphasize technical leadership + influence"
      }
    ],
    "gaps_count": 3,
    "gaps_addressable": true
  }

File Saved: /sync-artifacts/Google/2026-03-09/phase-g-gap-analysis.json
```

---

### PHASE H: Inquisitor (Questions) ❓ TODO

```yaml
What: Generate questions resume must answer
Input: gap_analysis.json (what's missing)
       Selected signals (your strengths)

Process:
  - Question generator creates 9-12 key questions
  - Questions bridge gaps and highlight strengths

  Example Questions:
    1. "How does your Go expertise translate to this role?"
    2. "What's one performance optimization you're most proud of?"
    3. "How do you approach large-scale system design?"
    4. "Tell us about your leadership style"
    5. "What's your approach to distributed systems challenges?"
    # ... 7-12 more

Output: questions.json
  {
    "questions": [
      {
        "q_id": "q-001",
        "question": "What's your experience with Go in large-scale systems?",
        "why": "Address core skill requirement",
        "signal_answers": ["Google Dataflow Optimization", "Spotify Signal System"]
      },
      {
        "q_id": "q-002",
        "question": "Describe your approach to cost optimization",
        "why": "Highlight unique strength (cost savings)",
        "signal_answers": ["Google Dataflow ($2.1M saved)"]
      },
      # ... more questions
    ],
    "total_questions": 11,
    "coverage": "100% (all gaps + all strengths)"
  }

File Saved: /sync-artifacts/Google/2026-03-09/phase-h-questions.json
```

---

### PHASE I: Narrative (Mapping) 🗺️ TODO

```yaml
What: Map your signals to resume questions (story structure)
Input: questions.json (9-12 questions)
       selected_signals.json (your 13 achievements)

Process:
  - Create map: Signal → Question → Resume Section

  Example Mapping:
    Question: "Go expertise in large-scale systems?"
    Signals:
      - Google Dataflow Optimization ✅
      - Spotify Signal System ✅
    Resume Section: EXPERIENCE (Google job description)
    Narrative: "At Google, I optimized cloud data pipelines using Go..."

Output: narrative_mapping.json
  {
    "narrative_map": [
      {
        "question": "Go expertise in large-scale systems?",
        "signals": ["Google Dataflow", "Spotify Signal System"],
        "resume_section": "EXPERIENCE",
        "narrative_arc": "Technical expertise + scale impact"
      },
      {
        "question": "Cost optimization approach?",
        "signals": ["Google Dataflow ($2.1M saved)"],
        "resume_section": "PROJECTS",
        "narrative_arc": "Business impact"
      },
      # ... more mappings
    ]
  }

File Saved: /sync-artifacts/Google/2026-03-09/phase-i-narrative-mapping.json
```

---

### PHASE J: Content (Writing) ✍️ TODO

```yaml
What: Write actual resume bullet points
Input: narrative_mapping.json (structure)
       selected_signals.json (facts to use)

Process:
  - Convert signals into polished bullet points
  - Format: "Action verb + quantified impact"

  Example:
    Signal: "Google Dataflow Optimization: Reduced costs $2.1M"
    Bullet: "Designed distributed data pipeline optimization reducing infrastructure costs by $2.1M annually"

  Example:
    Signal: "Mentored 3 engineers in ML"
    Bullet: "Led technical mentoring of 3 ML engineers, establishing best practices for data pipeline design"

Output: resume_bullets.json
  {
    "bullets": [
      {
        "company": "Google",
        "role": "Backend Engineer",
        "bullets": [
          "Designed distributed data pipeline optimization reducing infrastructure costs by $2.1M annually",
          "Improved query performance by 40% through Dataflow architecture redesign",
          "Established BigQuery best practices for 50+ engineers across org"
        ]
      },
      {
        "company": "Spotify",
        "role": "Senior ML Engineer",
        "bullets": [
          "Built Kafka-based signal curation system increasing engagement by 23%",
          "Reduced recommendation latency by 40% through ML pipeline optimization",
          "Mentored 3 engineers on distributed systems best practices"
        ]
      }
    ],
    "total_bullets": 9,
    "average_length": "80 characters (ATS-friendly)"
  }

File Saved: /sync-artifacts/Google/2026-03-09/phase-j-resume-bullets.json
```

---

### PHASE K: Layout (Validation) 📏 TODO

```yaml
What: Validate resume fits on single A4 page
Input: resume_bullets.json (9 bullets)

Process:
  - Calculate heights:
    * Name header: 20pt = ~5mm
    * Section titles: 13pt each = ~8mm
    * Bullets: 9.5pt = ~25mm for 9 bullets
    * Spacing: ~20mm
    * Total needed: ~58mm (from 297mm A4)

  - Check: Does it fit? YES ✅
  - If NO: Remove lowest-impact bullets

Output: layout_validation.json
  {
    "page_constraint": "A4 (210mm × 297mm)",
    "margins": "12.7mm all sides",
    "available_height": "271.6mm",
    "content_height": "58mm",
    "fit": true,
    "whitespace_percentage": 78,
    "recommendation": "FITS_EASILY (lots of whitespace)"
  }

File Saved: /sync-artifacts/Google/2026-03-09/phase-k-layout-validation.json
```

---

### PHASE L: Styling (Design) 🎨 TODO

```yaml
What: Apply CSS variables (colors, fonts)
Input: layout_validation.json
       resume_bullets.json
       Template (Satvik Jain Portfolio & CV)
       Brand colors (Google Blue: #4285F4)

Process:
  - Inject CSS variables:
    * --target-company-name: "Google"
    * --brand-blue: "#4285F4"
    * --brand-red: "#EA4335"
    * --brand-yellow: "#FBBC05"
    * --brand-green: "#34A853"
    * --font-size-body: "9.5pt" (compact)

  - Generate styled HTML:
    * Section headers: Google Blue
    * Bullets: Google Blue bullets
    * Dividers: Multi-color (blue, red, yellow, green)
    * Layout: A4 constrained

Output: styled_resume.html
  (HTML file with embedded CSS + all bullets + company colors)

File Saved: /sync-artifacts/Google/2026-03-09/styled_resume.html
```

---

### PHASE M: Final (Scoring & Export) 🎬 FINAL STEP

```yaml
What: Final validation + save as output file
Input: styled_resume.html
       session-preferences.yaml (output location + filename)

Process:
  - Validate:
    * All CSS variables resolved ✅
    * All bullets present ✅
    * Colors applied ✅
    * Fits A4 ✅
    * No overflow ✅

  - Generate filename:
    * From preferences: Company=Google, Role=Senior Backend Engineer, Date=2026-03-09
    * Filename: Google_SeniorBackendEngineer_Resume_2026-03-09.html

  - Save location:
    * Directory: /sync-artifacts/Google/2026-03-09/ (auto-created)
    * File: Google_SeniorBackendEngineer_Resume_2026-03-09.html

Output: FINAL RESUME FILE
  {
    "file": "Google_SeniorBackendEngineer_Resume_2026-03-09.html",
    "location": "/sync-artifacts/Google/2026-03-09/",
    "full_path": "/Users/satvikjain/Downloads/sync/context/linkright/_lr/_output/sync-artifacts/Google/2026-03-09/Google_SeniorBackendEngineer_Resume_2026-03-09.html",
    "status": "READY_TO_USE"
  }

File Saved: /sync-artifacts/Google/2026-03-09/Google_SeniorBackendEngineer_Resume_2026-03-09.html
```

---

## Summary: All 13 Phases

| Phase | Name | Input | Output | Purpose |
|-------|------|-------|--------|---------|
| D | Persona Scoring | Vault + Company/JD | persona_score.json | Analyze fit (87.5%) |
| E | Signal Retrieval | Fit analysis | selected_signals.json | Pick best 13 achievements |
| F | Baseline Scoring | Signals | baseline_scores.json | Quantify impact |
| G | Gap Analysis | Scores + JD | gap_analysis.json | Find missing signals |
| H | Inquisitor | Gaps | questions.json | Generate 11 questions |
| I | Narrative | Questions + Signals | narrative_mapping.json | Map signals → questions |
| J | Content | Mapping | resume_bullets.json | Write 9 bullets |
| K | Layout | Bullets | layout_validation.json | Validate A4 fit |
| L | Styling | Layout + Template | styled_resume.html | Apply colors + fonts |
| M | Final | Styled HTML | Final resume file | Save to sync-artifacts |

---

## Complete Data Flow

```
session-preferences.yaml (Phase A output)
    ↓
PHASE D: Fit analysis → persona_score.json (87.5%)
    ↓
PHASE E: Best signals → selected_signals.json (13 signals)
    ↓
PHASE F: Quantified impact → baseline_scores.json
    ↓
PHASE G: Missing pieces → gap_analysis.json (3 gaps)
    ↓
PHASE H: Key questions → questions.json (11 questions)
    ↓
PHASE I: Signal mapping → narrative_mapping.json
    ↓
PHASE J: Polished bullets → resume_bullets.json (9 bullets)
    ↓
PHASE K: Page validation → layout_validation.json (FITS ✅)
    ↓
PHASE L: CSS styling → styled_resume.html
    ↓
PHASE M: Final export → Google_SeniorBackendEngineer_Resume_2026-03-09.html
    ↓
SAVED TO: /sync-artifacts/Google/2026-03-09/

DONE! 🎉
```

---

## Timeline

```
Phase A (Now): User answers 5 questions (~5 min)
Phases D-M (Auto): Resume generated automatically (~10 min)

Total time: ~15 minutes from start to finish
Result: Production-ready resume saved to sync-artifacts
```

---

## Key Numbers

```
Starting Point (Obsidian Vault):
  Projects: 12
  Achievements: 47
  Skills: 34

Filtering:
  Phase E: Select 13/47 achievements (28%)
  Phase H: Generate 11 key questions
  Phase J: Final 9 bullets on resume

Validation:
  Phase K: ✅ Fits A4 (58mm content / 271.6mm available)
  Phase L: ✅ Colors applied (Google blue #4285F4)
  Phase M: ✅ Ready to use

Output Location (ALL PHASES):
  /sync-artifacts/Google/2026-03-09/
```

---

Ab sare phases samajh aa gaye?

Kaunsa phase se shuru karein aagal? 👇

1. Phase E (Signal Retrieval) - Pick best achievements
2. Phase F (Baseline Scoring) - Quantify impact
3. Phase G (Gap Analysis) - Find missing signals
... ya sab detailed karte hain?

Bolna! 🚀
