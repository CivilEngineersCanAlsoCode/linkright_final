---
description: 'Phase M: Step 23 — Generation of the comprehensive optimization report for the user'
stepsCompleted: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
nextStepFile: './step-24-delivery-package.md'
---

# Step 23: Generate Optimization Report

## 🎯 OBJECTIVE
Generate a comprehensive optimization report that summarizes the session scores, fit improvements, and strategic wins for the user.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- The report includes Baseline vs Final scores and the calculated Uplift.
- Top 3 strategic wins (remedied gaps) are explicitly highlighted.
- The report is saved in both Markdown and structured YAML formats.
- Output schema `optimization_report_audit.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Scoreboard in the report does not match the data in `final_scoring_report.yaml`.
- The recommendation ("Ready to Apply") contradicts the final fit score.
- The report artifact is missing critical session metadata (Company, Role, Date).

## 📥 INPUT
- `final_scoring_report.yaml`: Verified fit metrics.
- `jd_profile`: Company and role context.
- `verified_signals.yaml`: Remedied gaps and strategic wins.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load all session scores and evidence summaries.
2. **[POPULATE]** Inject data into the `sync-optimization-report.md` template.
3. **[HIGHLIGHT]** Select the top 3 highest-scoring Remedy signals as "Strategic Wins".
4. **[RECOMMEND]** Apply logic:
   - Final Score > 85: "EXCELLENT FIT - Ready to Apply".
   - Final Score 70-85: "GOOD FIT - Address remaining Type B/C gaps".
   - Final Score < 70: "RISK - Major gaps remain".
5. **[SAVE]** Write the report to the `/export/` directory.

## 📤 OUTPUT SCHEMA (`optimization_report_audit.yaml`)
```yaml
report_metadata:
  company: string
  role: string
  final_score: float
  uplift: float
  strategic_wins: [string]
  recommendation: string
  artifact_path: string
  status: "GENERATED"
```

## 🔗 DEPENDENCIES
- Requires: `step-21f` output.
- Blocks: `step-24-delivery-package.md`.
