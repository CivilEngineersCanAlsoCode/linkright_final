# Step 4: Narrative Coherence Assessment

> **Does the resume tell a compelling, coherent career story?**

---

## Dependencies

- ✓ Step 3 (Signal Quality) must PASS before executing this step
- Input: `data/optimized-resume.md`
- Reference: user-acceptance-testing.md (stakeholder narrative review model)

---

## Mandatory Execution Rules

1. **Read full resume** as a prospective hiring manager would (top-down)
2. **Assess narrative arc**: Does it tell a story? Is it coherent?
3. **Evaluate summary** alignment with experience details
4. **Check impact framing**: Are achievements tied to business/user outcomes?
5. **Score coherence**: 0–100 (higher = more compelling narrative)

---

## Execution Protocols

### Protocol A: Summary Alignment (25 points)
```
READ summary section (if present):
  - Is it specific to target role/industry?
  - Does it summarize key achievements from experience?
  - Does it create expectation for what follows?

COMPARE summary vs. experience details:
  - Claims in summary backed by experience? (e.g., "5+ years leadership" → verify in roles)
  - Tone matches style of achievements? (e.g., "data-driven" → quantified results present?)

SCORING:
  ✓ Summary strong, relevant, backed by detail = 25
  - Summary present but generic or partially backed = 15
  - Summary weak or contradicts experience = 5
  - No summary = 10 (not ideal, but not blocker)
```

### Protocol B: Narrative Coherence (25 points)
```
TRACE career story chronologically:
  - Is progression logical (not random job-hopping)?
  - Do role transitions make sense?
  - Are themes repeated (e.g., "scaled teams", "built infra", "mentored engineers")?

SCORING:
  ✓ Clear narrative arc; themes consistent across roles = 25
  - Mostly coherent; 1–2 transitions feel sudden = 15
  - Some coherence but multiple unexplained shifts = 10
  - Disjointed; appears to be random jobs = 5
```

### Protocol C: Impact Framing (25 points)
```
SCAN achievement bullets for impact language:
  - Business outcome language (revenue, user growth, cost savings, time-to-market)
  - User/customer outcome language (satisfaction, usability, reliability)
  - Team/org outcome language (mentorship, process improvement, cultural impact)

QUANTIFY impact framing:
  - % of bullets with clear business/user/team outcome

SCORING:
  - ≥70% impact-framed = 25
  - 50–70% = 15
  - 30–50% = 10
  - <30% (mostly feature-focused, not outcome-focused) = 5
```

### Protocol D: Engagement & Tone (25 points)
```
READ achievements as hiring manager:
  - Do they make you want to hire this person?
  - Is the voice active/confident (not passive)?
  - Are there "wow" moments or just competence?

SUBJECTIVE SCORING:
  ✓ Compelling narrative; clear why candidate is great = 25
  - Solid narrative; competent but not compelling = 15
  - Competent but dry; doesn't stand out = 10
  - Difficult to engage; passive voice or vague = 5
```

---

## Output Contract

**Output file**: `steps-v/step-04-validate.md` (validation results)

```yaml
step: 04-narrative-coherence
status: PASS | CONCERNS | FAIL
narrative_coherence_score: integer (0–100)
summary_alignment_score: integer (0–25)
narrative_arc_score: integer (0–25)
impact_framing_score: integer (0–25)
engagement_tone_score: integer (0–25)
key_strengths: list of string
storytelling_gaps: list of string
remediation: string (if CONCERNS/FAIL)
timestamp: ISO-8601
```

**Gate Decision**:
- **PASS**: ≥80 coherence score + impact framing ≥20
- **CONCERNS**: 65–79 coherence score (good foundation, polish needed)
- **FAIL**: <65 coherence score (narrative needs major restructuring)

---

## Example Findings

| Area | Finding | Type | Remediation |
|------|---------|------|-------------|
| Summary | "QA Engineer with 5 years experience" (generic) | Weakness | Rewrite: "QA leader who scaled testing from manual to 80% automation while mentoring 3 engineers" |
| Arc | IC → IC → IC (no growth arc visible) | Weakness | Restructure bullets to show increasing scope/mentorship |
| Impact | "Fixed bugs", "Wrote tests", "Improved performance" (no numbers) | Weakness | Add metrics: "Improved test execution time by 40% (12 min → 7 min)" |
| Tone | Achievement bullets use passive ("Code was written", "System was improved") | Weakness | Rewrite active: "Rewrote deployment pipeline, reducing release time 40%" |
| Engagement | 3 memorable achievements with clear business impact | Strength | Emphasize these in summary and top bullet of each role |

---

**Last Updated**: 2026-03-08
