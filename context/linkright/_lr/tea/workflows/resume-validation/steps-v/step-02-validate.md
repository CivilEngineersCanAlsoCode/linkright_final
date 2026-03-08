# Step 2 Validation: ATS Readiness Results

> **Validate that Step 2 (ATS Readiness) output is complete and accurate**

---

## Validation Protocol

### READ step-02-ats-readiness.md execution results:
- Format score (0–30) ✓
- Keyword score (0–70) ✓
- ATS aggregate (0–100) ✓
- Missing keywords identified ✓

### VALIDATE scores:
```
PASS:
  - ATS score ≥75
  - Format score ≥20 (no critical ATS-hostile elements)
  - Keyword coverage ≥60%

CONCERNS:
  - ATS score 60–74 (some issues but fixable)
  - Format score 10–20 (minor formatting issues)
  - Keyword coverage 40–60% (some key terms missing)

FAIL:
  - ATS score <60 (critical parsing issues)
  - Format score <10 (major formatting problems)
  - Keyword coverage <40% (many critical keywords missing)
```

---

## Output

```yaml
step: 02-validate
status: PASS | CONCERNS | FAIL
ats_score: integer (0–100)
format_issue_count: integer
remediation_priority: HIGH | MEDIUM | LOW
timestamp: ISO-8601
```

**Gate**: If PASS → Proceed to Step 3. If CONCERNS/FAIL → Document, continue to Step 3 for context.

---

**Last Updated**: 2026-03-08
