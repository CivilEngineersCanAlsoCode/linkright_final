# Step 01: Integrity Check

> **Is this resume structurally sound and P0-signal complete?**

---

## Dependencies

- ✓ Input: `data/optimized-resume.md` (user-provided or pre-optimized)
- ✓ Reference: `data/jd-profile.yaml` (P0/P1 requirements extracted)
- ✓ No prior step required (this is entry point for resume-validation workflow)

---

## Mandatory Execution Rules

1. **Structural Validation First**: Check format integrity BEFORE content analysis
2. **P0 Completeness Required**: All P0 signals must be present or explicitly flagged as "MISSING"
3. **Document All Gaps**: Every missing P0 requirement gets logged with severity
4. **No Assumptions**: If signal presence is ambiguous, flag it as UNCLEAR — don't guess

---

## Execution Protocols

### Protocol A: Structural Validation (5 points)

```
1. [READ] Load optimized-resume.md
2. [CHECK] File format:
   - ✅ Is Markdown valid (no syntax errors)?
   - ✅ Does it have clear sections (Contact, Summary, Skills, Experience, Projects)?
   - ❌ Are there broken links, unmatched brackets, or encoding issues?
3. [VALIDATE] Encoding and encoding edge cases (special chars, Unicode)
4. [SCORE] Structural integrity: 0–5 points
```

### Protocol B: P0 Signal Completeness (10 points)

```
1. [EXTRACT] P0 requirements from jd-profile.yaml
   - Example: ["React", "TypeScript", "5+ years experience", "System Design"]
2. [SCAN] Resume for each P0 signal:
   - Look in: Summary, Skills section, Experience bullets, Featured project
   - Explicit match: "React" appears in text = FOUND
   - Implicit match: "JavaScript framework" with context = FOUND
   - Missing: No reference at all = MISSING
3. [SCORE] P0 Coverage:
   - 100%: All P0 signals present = 10 points
   - 75%: 3 of 4 P0 signals = 7 points
   - 50%: 2 of 4 P0 signals = 5 points
   - <50%: Major gaps = 0 points
```

### Protocol C: Mandatory Signals Check (PASS/FAIL)

```
1. [VALIDATE] Contact information present:
   - Email or phone number = PASS
   - LinkedIn URL or portfolio = supplementary (nice-to-have)
   - No contact info = FAIL (blocker)
2. [VALIDATE] Professional summary/hook present:
   - 1-3 sentences describing role + experience level = PASS
   - Generic or missing = FAIL (blocker)
3. [VALIDATE] Experience bullets present:
   - At least 2 roles with 2+ bullet points each = PASS
   - Sparse or vague bullets = CONCERNS (remediate before proceeding)
```

---

## Output Contract

```json
{
  "step": "integrity-check",
  "verdict": "PASS | CONCERNS | FAIL",
  "scores": {
    "structural": 0-5,
    "p0_coverage": 0-10,
    "overall": 0-15
  },
  "findings": {
    "structural_issues": ["..."],
    "missing_p0_signals": ["React", "System Design"],
    "incomplete_sections": ["Experience bullets sparse"],
    "blockers": ["No contact information"]
  },
  "recommendations": [
    "Add contact info to top of resume",
    "Expand experience bullet points",
    "Explicitly mention React expertise"
  ]
}
```

---

## Example Findings

**Resume 1 (PASS):**
- Structural: 5/5 ✅
- P0 Coverage: 10/10 ✅
- Blockers: None
- Verdict: **PASS → Proceed to step 02**

**Resume 2 (CONCERNS):**
- Structural: 5/5 ✅
- P0 Coverage: 7/10 ⚠️
- Missing: "System Design" experience
- Blockers: None (can remediate)
- Verdict: **CONCERNS → Recommend adding project demonstrating system design**

**Resume 3 (FAIL):**
- Structural: 3/5 ❌
- P0 Coverage: 4/10 ❌
- Blockers: ["No contact info", "No professional summary"]
- Verdict: **FAIL → Return to user for major revisions**

---

## Next Step

→ **step-02:** ATS Readiness Check (if PASS or CONCERNS with remediations)
