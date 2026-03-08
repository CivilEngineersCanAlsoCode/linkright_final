# Phase D: Persona Scoring — Your Fit Analysis

**Date:** 2026-03-09
**Phase:** D (Step 1 of 13)
**Purpose:** Analyze your persona against the job requirements
**Input:** Obsidian Vault context + Company/JD from Phase A
**Output:** persona_score.json (your fit breakdown)
**Output Location:** `/sync-artifacts/[Company]/[Date]/phase-d-persona-score.json`

---

## What is Phase D?

**Phase D = Analysis Engine**

```
Input:
  "Who are you?" (Obsidian Vault: 12 projects, 47 achievements, 34 skills)
  "What company?" (Google, Senior Backend Engineer)
  "What do they want?" (Job description requirements)

Phase D asks:
  "How well do you fit?"

Output:
  Detailed breakdown of your fit:
    - Core skill match: 95%
    - Experience level match: 85%
    - Domain expertise: 90%
    - Leadership fit: 80%
    - Overall fit: 87.5%
```

---

## Phase D: Input Schema

**What Phase D receives from Phase A:**

```yaml
Input from session-preferences.yaml:

vault_context:
  projects:
    - name: "Spotify Signal Curation System"
      technologies: ["Python", "Kafka", "Spark", "MLflow"]
      impact: "Increased engagement 23%, reduced latency 40%"
      role: "Senior ML Engineer"
      years: 1

    - name: "Google Cloud Dataflow Optimization"
      technologies: ["Go", "Dataflow", "BigQuery", "Pub/Sub"]
      impact: "Reduced costs $2.1M annually"
      role: "Backend Engineer"
      years: 1.5

    # ... (12 projects total)

  achievements:
    - title: "Led Platform Reliability Surge"
      quantified_result: "99.98% uptime (up from 99.94%), saved 3 outages"
      context: "Spotify backend infrastructure"

    # ... (47 achievements total)

  skills:
    - name: "Backend Engineering"
      proficiency: "expert"
      years: 8
      domains: ["Go", "Python", "Rust", "Distributed Systems"]

    # ... (34 skills total)

preferences:
  company_name: "Google"
  job_title: "Senior Backend Engineer"

jd_analysis:
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

  skills_mentioned: ["Go", "C++", "distributed systems", "databases", "networking"]
```

---

## Phase D: What It Does (Logic)

**Phase D runs analysis on 5 dimensions:**

### Dimension 1: Core Skills Match

```
JD Requirements: Go, C++, Distributed Systems
Your Skills: Go (6 years expert), Python (8 years), Rust (2 years)

Analysis:
  - Go match: ✅ STRONG (you have it at expert level)
  - C++ match: ⚠️ NOT PRESENT (you don't have C++)
  - Distributed Systems: ✅ STRONG (8 Spotify projects)

Core Skills Score: 85/100
  Why not 100? Missing C++ (but have equivalent Go expertise)
```

### Dimension 2: Experience Level Match

```
JD Requirement: 10+ years backend engineering
Your Experience: 8 years (Spotify 1yr, Google 1.5yr, previous 5.5yr)

Analysis:
  - Years: 8 vs 10 required (2 year gap)
  - But: Your 8 years > typical backend (more senior projects)
  - Spotify: Senior ML Engineer (leadership)
  - Google: Backend/Infrastructure (scale)

Experience Level Score: 85/100
  Why not 100? 2 years short, but quality > quantity
```

### Dimension 3: Domain Expertise Match

```
JD Emphasis: Large-scale distributed systems, performance optimization
Your Expertise:
  - Spotify: ML pipeline optimization (Kafka, Spark)
  - Google: Dataflow, BigQuery, cloud infrastructure
  - 8 projects involving scale, latency, reliability

Domain Expertise Score: 90/100
  Why? Direct match on distributed systems and optimization
```

### Dimension 4: Leadership Experience

```
JD Requirement: "Leadership experience (team size 5+)"
Your Experience:
  - Spotify: "Mentored 3 engineers in ML best practices"
  - Spotify: "Led RFC review process for 8+ infrastructure changes"
  - No explicit large team management

Leadership Score: 75/100
  Why? Some leadership, but not team-of-5+ management
```

### Dimension 5: "Nice to Have" Match

```
Nice to have requirements:
  ✅ Published papers: Yes (2 papers on recommendation algorithms)
  ✅ Open source: Yes (2.3K GitHub stars on validation framework)
  ⚠️ GCP experience: Limited (focused on core systems, not cloud specifics)

Nice-to-Have Score: 80/100
  Why? Strong on first two, medium on GCP
```

---

## Phase D: Output Schema

**persona_score.json structure:**

```json
{
  "phase": "D",
  "company": "Google",
  "job_title": "Senior Backend Engineer",
  "date": "2026-03-09",

  "persona_analysis": {
    "core_skills_match": {
      "score": 85,
      "details": {
        "go_proficiency": {
          "required": "proficient",
          "your_level": "expert",
          "match": "STRONG"
        },
        "cpp_proficiency": {
          "required": "proficient",
          "your_level": "none",
          "match": "MISSING",
          "note": "but Go expertise compensates"
        },
        "distributed_systems": {
          "required": "expert",
          "your_level": "expert",
          "match": "STRONG"
        }
      }
    },

    "experience_level_match": {
      "score": 85,
      "details": {
        "years_required": 10,
        "years_you_have": 8,
        "gap": -2,
        "quality_assessment": "Your 8 years is high-quality backend work"
      }
    },

    "domain_expertise_match": {
      "score": 90,
      "details": {
        "distributed_systems": "STRONG",
        "performance_optimization": "STRONG",
        "scale_experience": "STRONG",
        "infrastructure": "STRONG"
      }
    },

    "leadership_experience": {
      "score": 75,
      "details": {
        "required": "team_size_5_plus",
        "your_experience": "mentored_3_engineers, led_rfcs",
        "gap": "no_large_team_management"
      }
    },

    "nice_to_have_match": {
      "score": 80,
      "details": {
        "published_papers": {
          "required": "optional",
          "your_status": "yes_2_papers",
          "match": "STRONG"
        },
        "open_source": {
          "required": "optional",
          "your_status": "yes_2.3k_stars",
          "match": "STRONG"
        },
        "gcp_experience": {
          "required": "optional",
          "your_status": "limited",
          "match": "WEAK"
        }
      }
    }
  },

  "overall_fit": {
    "weighted_score": 87.5,
    "breakdown": {
      "core_skills": { "weight": 0.30, "score": 85, "contribution": 25.5 },
      "experience": { "weight": 0.25, "score": 85, "contribution": 21.25 },
      "domain": { "weight": 0.25, "score": 90, "contribution": 22.5 },
      "leadership": { "weight": 0.15, "score": 75, "contribution": 11.25 },
      "nice_to_have": { "weight": 0.05, "score": 80, "contribution": 4.0 }
    }
  },

  "fit_assessment": {
    "level": "STRONG_FIT",
    "meaning": "87.5% match indicates excellent fit for this role",
    "strengths": [
      "Expert in Go programming language (exact match)",
      "Deep distributed systems expertise (8+ years)",
      "Performance optimization proven at scale (Spotify, Google)",
      "Published research on relevant topics",
      "Open source contributions showing depth"
    ],
    "gaps": [
      "Missing 2 years of required experience (8 vs 10)",
      "No C++ experience (though Go compensates)",
      "Limited Google Cloud Platform specific experience",
      "No large-scale team management (3-person mentoring vs 5+)"
    ],
    "strengths_outweigh_gaps": true
  },

  "signals_to_emphasize": [
    "Go expertise and 6+ years of proven experience",
    "Distributed systems work at Spotify and Google scale",
    "Performance optimization results ($2.1M saved, 40% latency reduction)",
    "Published research and open source contributions",
    "Leadership through mentoring and RFC review process"
  ],

  "signals_to_downplay": [
    "C++ gap (instead emphasize Go expertise as equivalent/better)",
    "Leadership gap (instead emphasize mentoring and technical leadership)"
  ],

  "next_phase_input": {
    "fit_score": 87.5,
    "level": "STRONG_FIT",
    "signals_to_emphasize": ["go_expertise", "distributed_systems", "performance_optimization", "published_research"],
    "gaps_to_address": ["experience_years", "cpp_knowledge", "gcp_experience", "team_leadership"]
  }
}
```

---

## Phase D: Real Example with Satvik's Data

**Input to Phase D:**

```yaml
You:
  Years Backend: 8
  Go: Expert (6 years)
  C++: None
  Distributed Systems: Expert (8 projects)
  Leadership: Mentored 3, led RFCs
  Published Papers: Yes (2)
  Open Source: Yes (2.3K stars)

Google Job:
  Required:
    - 10+ years backend
    - Go or C++ proficiency
    - Distributed systems expert
    - Leadership (team 5+)
  Nice to have:
    - Published papers
    - Open source
    - GCP experience
```

**What Phase D Calculates:**

```
Core Skills: 85% (Go strong, no C++, distributed systems strong)
Experience: 85% (8 vs 10 years, but high quality)
Domain: 90% (perfect match on distributed systems)
Leadership: 75% (some leadership, not team-of-5)
Nice to have: 80% (papers + open source strong, GCP weak)

OVERALL: 87.5% fit
ASSESSMENT: "You're an excellent fit, gaps are minor"
```

**What Phase D Recommends:**

```json
{
  "strategy": "EMPHASIZE_STRENGTHS_MINIMIZE_GAPS",
  "emphasize": [
    "Go expertise is equal/better than C++",
    "8 years of high-impact work > 10 years ordinary work",
    "Distributed systems track record",
    "Leadership through technical influence"
  ],
  "minimize": [
    "Years gap (address with quality narrative)",
    "C++ gap (mention Go as superior choice)",
    "Team leadership gap (emphasize technical leadership)"
  ],
  "phase_e_focus": "Pull signals that prove distributed systems + optimization expertise"
}
```

---

## Phase D Output Saved

**File created automatically:**

```
/sync-artifacts/Google/2026-03-09/phase-d-persona-score.json
(Exactly as shown above)

File is readable:
  - Phase E reads this
  - Resume builder uses scores to emphasize strengths
  - Shows you the fit analysis
```

---

## Phase D ↔ Phase E Connection

```
Phase D Output (persona_score.json):
  {
    "overall_fit": 87.5,
    "signals_to_emphasize": ["go_expertise", "distributed_systems", ...],
    "gaps_to_address": ["cpp_knowledge", "team_leadership", ...]
  }

                    ↓

Phase E Input:
  "Phase D says emphasize these signals"
  "Pull the best achievements that match these themes"

Phase E Output:
  selected_signals.json (best achievements matching the fit)
```

---

## Summary: Phase D Complete

**Phase D = Analysis**

Input: You + Company/JD
Process: Compare on 5 dimensions
Output: persona_score.json (87.5% fit with recommendations)
Next: Phase E uses this to select best signals

**Your Score: 87.5% (STRONG FIT)**

Strengths: Go expertise, distributed systems, optimization
Gaps: C++ (minor), leadership (minor), GCP (minor)

---

## Ready for Phase E?

Ab Phase D ka structure clear ho gaya?

Next: **Phase E - Signal Retrieval** (Pull your best achievements)

Bolna when ready! 🚀
