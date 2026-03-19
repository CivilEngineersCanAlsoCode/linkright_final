---
description: 'Phase J: Step 14 — Generation of the professional summary section based on the confirmed narrative plan'
stepsCompleted: [13]
nextStepFile: './step-15a-write-role1-bullets.md'
---

# Step 14: Write Professional Summary

## 🎯 OBJECTIVE
Generate the final professional summary section that anchors the resume header, incorporating the one-line positioning and strategic impact statements.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- The `one-line-positioning` from the plan is included verbatim as the first line.
- The summary contains at least 2 hard numbers (%, $, or scale metrics) from the signal pool.
- Output schema `professional_summary.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- The summary is longer than 5 lines (violating brevity standards).
- Content fails to mention at least one key technology from the `company_brief`.
- The tone deviates from the primary persona (e.g., too technical for a strategy-tilt role).

## 📥 INPUT
- `sync-narrative-plan.md`: The confirmed strategic plan.
- `top_signals[]`: The evidence pool.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the confirmed `sync-narrative-plan.md`.
2. **[WRITE]** Generate the `Professional Summary` section:
   - **Line 1:** `one-line-positioning` statement.
   - **Bullet 1:** Impact statement for the top P0-matching signal.
   - **Bullet 2:** Impact statement for the secondary P0/P1 signal.
3. **[EVALUATE]** Check keyword density and persona alignment.
4. **[INITIALIZE]** Create the `optimized-resume.md` artifact.

## 📤 OUTPUT SCHEMA (`professional_summary.yaml`)
```yaml
summary_content:
  one_line_hook: string
  impact_bullets: [string]
  metrics_included: [string]
  keywords_landed: [string]
  persona_match_score: float
```

## 🔗 DEPENDENCIES
- Requires: `step-13f` output.
- Blocks: `step-15a-write-role1-bullets.md`.
