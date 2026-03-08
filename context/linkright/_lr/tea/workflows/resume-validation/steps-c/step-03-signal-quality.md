# Step 3: Signal Quality Assessment

> **Does the resume signal career fit for the target role?**

---

## Dependencies

- ✓ Step 2 (ATS Readiness) must PASS before executing this step
- Input: `data/optimized-resume.md`, `data/jd-profile.yaml`
- Reference: test-levels-framework.md (for role-fit scoring)

---

## Mandatory Execution Rules

1. **Extract experience** blocks (job titles, companies, durations, achievements)
2. **Map to target role** (alignment %, gap analysis)
3. **Assess growth** trajectory (responsibility escalation over time)
4. **Identify career pivots** (transitions between industries/roles, explain-ability)
5. **Score signal**: 0–100 (higher = better fit for target)

---

## Execution Protocols

### Protocol A: Role Alignment (30 points)
```
ANALYZE each role in resume:
  - Does title/scope match target role category?
  - Does company/industry align with JD context?

SCORING:
  - Direct match (exact role in similar context) = 10 per role
  - Adjacent match (related role, good context) = 5 per role
  - Tangential match (some skills overlap) = 2 per role
  - No match = 0 per role

MAX: 30 points (assume ≥3 relevant roles for full score)
```

### Protocol B: Growth Trajectory (25 points)
```
ANALYZE role progression (chronologically):
  - Span of time: >5 years = +10, <5 years = +5
  - Title progression: IC → Senior → Lead = +10, Lateral = +2
  - Responsibility expansion: Evidence of scope growth? = +5

SCORING:
  ✓ Clear progression over 5+ years = 25
  - Moderate progression over 3–5 years = 15
  - Limited progression or short tenure = 5
  - Declining responsibility = 0
```

### Protocol C: Career Gaps & Pivots (20 points)
```
IDENTIFY gaps/pivots:
  - Employment gaps >6 months (unexplained)?
  - Industry/function pivots (explainable vs. random)?

SCORING:
  ✓ No gaps, linear path = 20
  - 1 pivot well-explained (e.g., "Transitioned to fintech from e-comm; applied e-commerce scaling expertise") = 15
  - 1 unexplained gap or pivot = 10
  - Multiple gaps/pivots = 5
  - Inconsistent career pattern = 0
```

### Protocol D: Achievement Strength (25 points)
```
EXTRACT achievements from experience blocks:
  - Quantified results (metrics: %growth, $savings, users, latency improvement)
  - Complexity indicators (team size led, system scale, business impact)

COUNT:
  - Achievements with quantified results = 2 points each
  - Achievements with scope indicators (team, system) = 1 point each

SCORE (0–25):
  - ≥10 quantified achievements = 25
  - 7–9 quantified = 20
  - 4–6 quantified = 15
  - 1–3 quantified = 10
  - 0 quantified (vague bullets) = 5
```

---

## Output Contract

**Output file**: `steps-v/step-03-validate.md` (validation results)

```yaml
step: 03-signal-quality
status: PASS | CONCERNS | FAIL
signal_quality_score: integer (0–100)
role_alignment_score: integer (0–30)
growth_trajectory_score: integer (0–25)
gaps_pivots_score: integer (0–20)
achievement_strength_score: integer (0–25)
identified_strengths: list of string
identified_weaknesses: list of string
remediation: string (if CONCERNS/FAIL)
timestamp: ISO-8601
```

**Gate Decision**:
- **PASS**: ≥75 signal score + alignment ≥20 + achievement ≥15
- **CONCERNS**: 60–74 signal score (some alignment gaps but fixable)
- **FAIL**: <60 signal score (poor fit for target role; major rework needed)

---

## Example Findings

| Area | Finding | Type | Remediation |
|------|---------|------|-------------|
| Alignment | 3 of 5 roles directly relevant | Strength | Highlight these in summary |
| Trajectory | IC → Senior IC (no management); steady 5 years | Strength | Demonstrates stability & expertise |
| Gap | 8-month gap (2022) unexplained | Weakness | Add note in summary ("Focused on professional development") |
| Pivots | E-commerce QA → FinTech QA (explained) | Neutral | Link e-commerce scaling skills to fintech needs |
| Achievement | 5 quantified, 8 vague ("Led team", "Improved code") | Weakness | Rewrite vague bullets with metrics |

---

**Last Updated**: 2026-03-08
