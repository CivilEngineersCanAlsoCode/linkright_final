---
description: 'Phase K: Step 17a — Auditing the resume draft for line overflows and widow words to ensure professional spacing'
stepsCompleted: [13, 14, 15, 16]
nextStepFile: './step-17b-sizer-page-budget-check.md'
---

# Step 17a: Sizer Line Overflow Check

## 🎯 OBJECTIVE
Audit the `optimized-resume.md` for any bullet points that exceed 2 lines or have "widow" words, ensuring the content fits perfectly within professional layout constraints.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- All bullet points are within the 170-character limit (estimated 2 lines).
- Zero widow words (single words on a new line) are detected in the draft.
- Output schema `layout_overflow_report.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Bullets that will obviously overflow in the target template are passed without flags.
- Widow detection fails to account for varying character widths.
- Character counts are not documented for flagged violations.

## 📥 INPUT
- `optimized-resume.md`: The confirmed draft content.
- `sync-layout-constraints.yaml`: Character and line limits.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the draft `optimized-resume.md`.
2. **[SCAN]** For each bullet point:
   - Calculate character count.
   - Flag any bullet point > 170 characters.
   - Flag any bullet point where the last line contains only 1 word.
3. **[IDENTIFY]** List all `overflow_bullets[]` and `widow_bullets[]`.
4. **[QUANTIFY]** Record the character count for each flagged item.

## 📤 OUTPUT SCHEMA (`layout_overflow_report.yaml`)
```yaml
overflow_audit:
  status: "PASS|FAIL"
  violations:
    - section: string
      bullet_index: int
      raw_text: string
      character_count: int
      violation_type: "OVERFLOW|WIDOW"
  total_violation_count: int
```

## 🔗 DEPENDENCIES
- Requires: Phase J (`step-30`) output.
- Blocks: `step-17b-sizer-page-budget-check.md`.
