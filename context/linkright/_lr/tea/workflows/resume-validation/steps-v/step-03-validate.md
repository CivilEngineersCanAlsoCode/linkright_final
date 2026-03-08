# Step 3 Validation: Signal Quality Results

> **Validate that Step 3 (Signal Quality) output is complete and accurate**

---

## Validation Protocol

### READ step-03-signal-quality.md execution results:
- Role alignment score (0–30) ✓
- Growth trajectory score (0–25) ✓
- Career gaps/pivots score (0–20) ✓
- Achievement strength score (0–25) ✓
- Signal quality aggregate (0–100) ✓

### VALIDATE scores:
```
PASS:
  - Signal score ≥75
  - Alignment ≥20 (3+ relevant roles)
  - Achievement strength ≥15 (quantified results)

CONCERNS:
  - Signal score 60–74 (some fit gaps)
  - Alignment 10–20 (limited direct role matches)
  - Achievement strength 10–15 (mostly vague bullets)

FAIL:
  - Signal score <60 (poor role fit)
  - Alignment <10 (very few relevant experiences)
  - Multiple unexplained career gaps
```

---

## Output

```yaml
step: 03-validate
status: PASS | CONCERNS | FAIL
signal_quality_score: integer (0–100)
role_fit: STRONG | MODERATE | WEAK
achievement_strength: STRONG | MODERATE | WEAK
timestamp: ISO-8601
```

**Gate**: If PASS → Proceed to Step 4. If CONCERNS/FAIL → Document, note role-fit concerns.

---

**Last Updated**: 2026-03-08
