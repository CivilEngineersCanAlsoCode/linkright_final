---
description: 'Phase M: Step 21f — Aggregation of all final dimension scores into a conclusive post-optimization fit score'
stepsCompleted: [13, 14, 15, 16, 17, 18, 19, 20, 21]
nextStepFile: './step-21g-calculate-uplift.md'
---

# Step 21f: Aggregate Final Score

## 🎯 OBJECTIVE
Sum all 5 final dimension scores into a single post-optimization alignment score (0-100), providing the conclusive fit metric for the optimized resume.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- The `alignment_score_final` is calculated as the sum of all 5 verified dimensions from Phase M.
- The score is accurately recorded in the `jd_profile` and session metadata.
- Output schema `final_scoring_report.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- The total score is calculated with missing dimensions (incomplete audit).
- The final score is lower than the baseline score without a "Regression Alert" being triggered.
- Mathematical errors in the summation lead to scores > 100.

## 📥 INPUT
- `final_dim1` to `final_dim5`: Individual dimension scores from Phase M.
- `alignment_score_baseline`: The starting score from Phase F.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the 5 dimension scores.
2. **[SUM]** Calculate `alignment_score_final`.
3. **[COMPARE]** Compare final score to the baseline.
4. **[UPDATE]** Synchronize the score with the `jd_profile` artifact.
5. **[LOG]** Record the score and the "Uplift" percentage.

## 📤 OUTPUT SCHEMA (`final_scoring_report.yaml`)
```yaml
final_audit:
  baseline_score: float
  final_score: float
  uplift_percentage: float
  dimension_results:
    - name: string
      score: float
  readiness_status: "VERIFIED"
```

## 🔗 DEPENDENCIES
- Requires: Sub-steps 21a-21e complete.
- Blocks: `step-21g-calculate-uplift.md`.
