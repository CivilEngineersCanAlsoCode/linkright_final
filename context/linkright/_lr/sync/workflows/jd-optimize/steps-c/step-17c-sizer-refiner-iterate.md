---
description: 'Phase K: Step 17c — Targeted reframing of flagged bullets to resolve layout violations while preserving impact'
stepsCompleted: [13, 14, 15, 16, 17, 17.5]
nextStepFile: './step-18-select-resume-template.md'
---

# Step 17c: Sizer-Refiner Iterate

## 🎯 OBJECTIVE
Execute targeted reframing of flagged bullets to resolve line overflows and widows while maintaining the original semantic strength and confirmed metrics.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- All violations flagged in `step-17a` are resolved (0 overflows, 0 widows remaining).
- The original metric (%, $, or scale) is preserved in 100% of reframed bullets.
- Output schema `reframing_report.yaml` documents the transformation of each bullet.

### ❌ SYSTEM FAILURE:
- Reframing process removes the quantitative proof from the bullet.
- Meaning is distorted (e.g., "Led team of 10" becomes "Worked with team").
- The reframed bullet still exceeds the 170-character threshold.

## 📥 INPUT
- `layout_overflow_report.yaml`: List of violations.
- `optimized-resume.md`: The draft to be updated.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the violations from Step 17a.
2. **[REFRAME]** For each flagged bullet:
   - Identify redundant qualifiers (e.g., "Successfully", "Responsible for").
   - Re-draft to fit constraints using active voice.
   - **Formula:** `[Active Verb] + [Core Task] + [Preserved Metric]`.
3. **[UPDATE]** Inject reframed text into the `.md` artifact.
4. **[VALIDATE]** Re-run the character count check on the specific updated lines.
5. **[LOG]** Finalize the `optimized-resume.md` layout.

## 📤 OUTPUT SCHEMA (`reframing_report.yaml`)
```yaml
reframing_audit:
  total_resolved: int
  changes:
    - section: string
      old_text: string
      new_text: string
      new_character_count: int
      metric_preserved: boolean
  final_layout_status: "PASS"
```

## 🔗 DEPENDENCIES
- Requires: `step-17a` and `step-17b` output.
- Blocks: `step-18-select-resume-template.md` (Phase L).
