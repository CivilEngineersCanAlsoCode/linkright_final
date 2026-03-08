# Step 4 Validation: Narrative Coherence Results

> **Validate that Step 4 (Narrative Coherence) output is complete and accurate**

---

## Validation Protocol

### READ step-04-narrative-coherence.md execution results:
- Summary alignment score (0–25) ✓
- Narrative arc score (0–25) ✓
- Impact framing score (0–25) ✓
- Engagement/tone score (0–25) ✓
- Coherence aggregate (0–100) ✓

### VALIDATE scores:
```
PASS:
  - Coherence score ≥80
  - Summary alignment ≥20 (specific, backed by detail)
  - Impact framing ≥20 (>70% of bullets business/user outcome-focused)

CONCERNS:
  - Coherence score 65–79 (good foundation, needs polish)
  - Summary alignment 10–20 (present but generic)
  - Impact framing 10–20 (some impact language, mostly feature-focused)

FAIL:
  - Coherence score <65 (disjointed narrative)
  - Summary weak or contradicts experience
  - No impact language; all feature-focused bullets
```

---

## Output

```yaml
step: 04-validate
status: PASS | CONCERNS | FAIL
narrative_coherence_score: integer (0–100)
narrative_strength: COMPELLING | ADEQUATE | WEAK
storytelling_quality: HIGH | MODERATE | LOW
timestamp: ISO-8601
```

**Gate**: If PASS → Proceed to Step 5 (Gate Decision). If CONCERNS/FAIL → Note for final report.

---

**Last Updated**: 2026-03-08
