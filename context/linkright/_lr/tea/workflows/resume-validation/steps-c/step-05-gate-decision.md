# Step 5: Gate Decision & Final Report

> **Aggregate scores, decide PASS/CONCERNS/FAIL, generate validation report**

---

## Dependencies

- ✓ Steps 1–4 must all complete before this step
- Inputs:
  - `steps-v/step-02-validate.md` (ATS score)
  - `steps-v/step-03-validate.md` (signal score)
  - `steps-v/step-04-validate.md` (coherence score)
- Output templates: `templates/validation-report.template.md`

---

## Mandatory Execution Rules

1. **Load all validation results** from steps 2–4
2. **Calculate aggregate score** (weighted average)
3. **Apply gate matrix** (PASS / CONCERNS / FAIL decision)
4. **Generate validation-report.md** from template with findings
5. **Create gate-decision.yaml** with structured metadata

---

## Execution Protocols

### Protocol A: Aggregate Scoring (30 points)
```
RETRIEVE scores:
  - ATS Score (step 2): 0–100, weight 25%
  - Signal Score (step 3): 0–100, weight 35%
  - Coherence Score (step 4): 0–100, weight 40%

CALCULATE:
  aggregate_score = (ATS × 0.25) + (Signal × 0.35) + (Coherence × 0.40)

  Example:
    ATS: 82, Signal: 75, Coherence: 88
    = (82 × 0.25) + (75 × 0.35) + (88 × 0.40)
    = 20.5 + 26.25 + 35.2
    = 81.95 ≈ 82 (aggregate)
```

### Protocol B: Gate Matrix (Vera's Decision)
```
APPLY gate matrix:

┌──────────────────────────────────────────────────────┐
│ Aggregate Score  │ P0 Blockers?  │  Decision         │
├──────────────────────────────────────────────────────┤
│ ≥80              │ None          │  PASS ✓           │
│ 70–79            │ None          │  CONCERNS ⚠       │
│ <70              │ Any           │  FAIL ✗           │
│ ANY              │ Yes (P0)      │  FAIL ✗           │
└──────────────────────────────────────────────────────┘

P0 BLOCKERS (automatic FAIL):
  - Resume unparseable by ATS (prevents application submission)
  - Critical misalignment with role (e.g., "QA role" but all backend eng experience)
  - Severe gaps in required skills (e.g., JD requires Python, resume shows only Java)
  - Narrative red flags (disorganized, dishonest claims, or incomprehensible)
```

### Protocol C: Evidence Collection
```
GATHER evidence from all steps:
  - Top 3 strengths (best findings from steps 2–4)
  - Top 3 weaknesses (biggest gaps/concerns)
  - Blocking issues (if any; triggers FAIL)
  - Quick wins (easy fixes to improve score by 5–10 points)

SCORE BREAKDOWN:
  - ATS: [X/100] - strength/weakness
  - Signal: [Y/100] - strength/weakness
  - Coherence: [Z/100] - strength/weakness
  - AGGREGATE: [weighted average] ← FINAL SCORE
```

### Protocol D: Remediation Plan (if CONCERNS)
```
IF decision = CONCERNS:
  - List 3–5 specific improvements (with priority)
  - Estimate effort to implement (e.g., "5 bullet rewrites, 30 min work")
  - Expected score improvement (e.g., "Should reach 80+ with these changes")
  - Recommend timeline (e.g., "Can resubmit in 1 week")
```

---

## Output Contract

### Output 1: Validation Report (`validation-report.md`)

Generated from `templates/validation-report.template.md`, includes:
- Frontmatter (date, type, decision, aggregate score)
- Executive Summary (1 paragraph, decision rationale)
- Detailed Findings (ATS, Signal, Coherence scores + top strengths/weaknesses)
- Gate Decision (PASS/CONCERNS/FAIL)
- Remediation Plan (if applicable)
- Sign-Off (timestamp, validator name)

### Output 2: Gate Decision (`gate-decision.yaml`)

```yaml
workflow: resume-validation
candidate: string (candidate name or ID)
submission_date: ISO-8601
decision: PASS | CONCERNS | FAIL
aggregate_score: integer (0–100)
score_breakdown:
  ats_readiness: integer (0–100)
  signal_quality: integer (0–100)
  narrative_coherence: integer (0–100)
p0_blockers: list of string (if any)
validator: string (agent name: Vera)
remediation_plan: string (if CONCERNS; otherwise empty)
sign_off_timestamp: ISO-8601
```

---

## Example Output

**Validation Report (summary)**:
```
DECISION: PASS ✓
Aggregate Score: 82/100

ATS Readiness: 82/100 (Strong)
  - Formatting clean, no ATS-hostile elements
  - 85% keyword coverage vs JD
  - Name/date/contact clear

Signal Quality: 75/100 (Solid)
  - 3 of 5 roles directly relevant
  - Clear growth trajectory (IC → Senior IC)
  - 1 unexplained 8-month gap (minor)
  - 7 quantified achievements (good)

Narrative Coherence: 88/100 (Excellent)
  - Summary specific and well-aligned
  - Clear narrative arc (scaling QA function over time)
  - 72% of bullets impact-framed (business outcomes)
  - Compelling voice, easy to engage

STRENGTHS:
  1. Strong technical depth + mentorship experience
  2. Clear progression; candidate is stable and growing
  3. Impact-focused achievements; hiring manager wants to talk to this person

NEXT STEPS:
  ✓ Approved for submission
  ✓ Expected to be competitive candidate
```

---

## Success Criteria

- ✓ All 4 prior steps executed and validated
- ✓ Aggregate score calculated correctly
- ✓ Gate decision applied per matrix (no exceptions)
- ✓ validation-report.md generated with all sections
- ✓ gate-decision.yaml created with structured metadata
- ✓ Report signed off with timestamp

---

**Last Updated**: 2026-03-08
