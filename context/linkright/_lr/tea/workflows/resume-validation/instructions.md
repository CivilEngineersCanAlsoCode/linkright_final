# Resume Validation Workflow Instructions

> **5-Step Quantitative + Qualitative Validation Pipeline**

---

## Overview

This workflow validates ATS-optimized resumes against business criteria:

| Step | Agent | Output | Gate |
|------|-------|--------|------|
| **Step 1** | Fenris + Tea-Scout | Integrity check, structure validation | PASS/FAIL |
| **Step 2** | Quinn | ATS Readiness (format, keywords, parsing) | PASS/CONCERNS/FAIL |
| **Step 3** | Quinn | Signal Quality (role match, gaps, growth) | PASS/CONCERNS/FAIL |
| **Step 4** | Vera | Narrative Coherence (storytelling, impact) | PASS/CONCERNS/FAIL |
| **Step 5** | Vera | Gate Decision & Report | FINAL APPROVAL |

---

## Execution Sequence

### Step 1: Integrity Check (Auto)
- Verify resume file format (Markdown, YAML metadata, UTF-8 encoding)
- Check for required sections (Contact, Summary, Experience, Skills, Education)
- Detect structural issues (orphaned bullets, malformed YAML)
- **Output**: Pass → proceed to Step 2; Fail → stop, request resubmission

### Step 2: ATS Readiness
- Scan for ATS-hostile formatting (tables, images, special characters)
- Verify keyword density against job description profile
- Check for common parsing errors (names split across lines, dates in non-standard format)
- **Output**: ATS score (0–100), identified issues, remediation suggestions

### Step 3: Signal Quality
- Role alignment: Does experience directly match target role?
- Career progression: Are roles getting progressively more responsible?
- Gaps & pivots: Are non-traditional transitions explained?
- **Output**: Signal quality score (0–100), strengths & weaknesses

### Step 4: Narrative Coherence
- Does the resume tell a coherent career story?
- Are achievements quantified and impact-focused?
- Is the summary compelling and relevant to target?
- **Output**: Narrative coherence score (0–100), specific feedback

### Step 5: Gate Decision
- Aggregate scores from Steps 2–4
- Apply gate matrix (PASS: all ≥75; CONCERNS: 1–2 <75; FAIL: ≥3 <75 or P0 blocker)
- Generate final validation-report.md with sign-off
- **Output**: FINAL GATE (PASS/CONCERNS/FAIL), validation-report.md, gate-decision.yaml

---

## Artifacts

### Outputs
- **validation-report.md** — Final report with scores, findings, recommendations
- **gate-decision.yaml** — Structured gate decision (PASS/CONCERNS/FAIL + metadata)

### Templates
- See `templates/validation-report.template.md` for report structure

---

## Success Criteria

- All 5 steps execute without errors
- Validation-report.md generated with all scores and recommendations
- Gate decision documented and timestamped
- Stakeholder can make informed go/no-go decision on resume

---

## Agents & Roles

- **Fenris** (tea-scout): Step 1 (integrity), risk assessment
- **Quinn** (tea-qa-engineer): Steps 2–3 (ATS + signal quality)
- **Vera** (tea-validator): Steps 4–5 (narrative + final gate)

---

**Workflow Status**: Active | **Last Updated**: 2026-03-08
