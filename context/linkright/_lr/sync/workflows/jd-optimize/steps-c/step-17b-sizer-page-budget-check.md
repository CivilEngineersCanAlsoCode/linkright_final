---
description: 'Phase K: Step 17b — Auditing the resume draft for total page length and section balance against target budget'
stepsCompleted: [13, 14, 15, 16, 17]
nextStepFile: './step-17c-sizer-refiner-iterate.md'
---

# Step 17b: Sizer Page Budget Check

## 🎯 OBJECTIVE
Audit the `optimized-resume.md` for total page length and section balance, ensuring the user's career story is told within the 1-page target with proper structural proportions.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Total word count is within the 450-500 range (target for 1-page A4).
- Section balance follows the [10/80/10] rule (Summary/Experience/Skills).
- Output schema `page_budget_report.yaml` is fully populated with percentage breakdowns.

### ❌ SYSTEM FAILURE:
- The resume pushes to a 2nd page with less than 10 years of experience (unless justified).
- One section (e.g., Summary) dominates more than 20% of the page.
- Total word count exceeds 600 words without a "Multi-Page" flag being set.

## 📥 INPUT
- `optimized-resume.md`: The confirmed draft content.
- `sync-layout-constraints.yaml`: Page and section limits.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the draft `optimized-resume.md`.
2. **[CALCULATE]** Estimate total page count and word count per section.
3. **[EVALUATE]** Check section balance against targets:
   - **Summary:** Max 10% of total lines.
   - **Experience:** 70-80% of total lines.
   - **Skills/Education:** 10-20% of total lines.
4. **[IDENTIFY]** Flag sections that are "bloated" or "thin".
5. **[SCORE]** Calculate a "Structural Balance Score" [0-1.0].

## 📤 OUTPUT SCHEMA (`page_budget_report.yaml`)
```yaml
budget_audit:
  total_word_count: int
  estimated_pages: float
  section_metrics:
    summary_percent: float
    experience_percent: float
    skills_percent: float
  balance_score: float
  status: "OPTIMIZED|OVERFLOW|UNDERSIZED"
```

## 🔗 DEPENDENCIES
- Requires: `step-17a` output.
- Blocks: `step-17c-sizer-refiner-iterate.md`.
