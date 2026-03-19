---
description: 'Phase F: Step 09a — Baseline scoring of keyword coverage dimension relative to ATS requirements'
stepsCompleted: [8]
nextStepFile: './step-09b-score-ownership-match.md'
---

# Step 09a: Score Keyword Coverage

## 🎯 OBJECTIVE
Score the keyword coverage dimension (max 20 points) for the current signal library relative to the JD's ATS requirements, establishing the first baseline metric.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Every keyword from `jd_profile.keywords_ats[]` is checked against the consolidated signal text.
- The `count_covered` accurately reflects unique keyword matches.
- The score is correctly normalized to a 20-point scale.
- Output schema `keyword_score.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Keywords are miscounted due to case-sensitivity or partial word matches.
- The score exceeds 20 points.
- Zero matches are recorded despite evidence being present in the consolidated text.

## 📥 INPUT
- `jd_profile.keywords_ats[]`: List of target keywords.
- `top_signals[]`: The evidence pool from Phase E.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the keywords and signals.
2. **[CONSOLIDATE]** Create a single text block from all top signals.
3. **[MATCH]** For each keyword, perform a case-insensitive check for presence in the block.
4. **[CALCULATE]** Apply formula: `score = (count_covered / total_keywords) * 20`.
5. **[LOG]** Record the match rate and rationale.

## 📤 OUTPUT SCHEMA (`keyword_score.yaml`)
```yaml
keyword_baseline:
  total_keywords: int
  covered_count: int
  missed_keywords: [string]
  dimension_score: float
  status: "SCORED"
```

## 🔗 DEPENDENCIES
- Requires: Phase E (`step-08c`) output.
- Blocks: `step-09b-score-ownership-match.md`.
