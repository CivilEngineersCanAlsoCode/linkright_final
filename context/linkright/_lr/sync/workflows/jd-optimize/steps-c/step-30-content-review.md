---
description: 'Phase J: Step 30 — Final review of formatted content against quality gates and alignment criteria'
stepsCompleted: [13, 14, 15, 16]
nextStepFile: './step-17a-sizer-line-overflow-check.md'
---

# Step 30: Content Review

## 🎯 OBJECTIVE
Perform a comprehensive quality review of the generated resume content to ensure it is error-free, highly aligned with the JD, and ready for layout validation.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Content passes all 5 checklist items: Quantification, Action Verbs, Keyword Density, Brevity, and Alignment.
- User provides a final "PASS" on the draft.
- Output schema `content_review.yaml` records the final sign-off.

### ❌ SYSTEM FAILURE:
- Grammar or spelling errors are detected in the final draft.
- Content fails to explicitly remediate the "Must-Win" gaps identified in Phase G.
- The summary section exceeds the 5-line limit.

## 📥 INPUT
- `optimized-resume.md`: The draft resume artifact.
- `jd_profile`: Target requirements and keywords.

## ⚙️ EXECUTION PROTOCOLS
1. **[REVIEW]** Evaluate the resume draft against the **Quality Gate Checklist**:
   - **Quantification:** Is there at least one hard metric per role?
   - **Action Verbs:** Are they diverse and high-impact?
   - **Keyword Density:** Are top keywords used naturally?
   - **Brevity:** Are bullets concise (1-2 lines each)?
   - **Alignment:** Does the narrative build momentum for the target role?
2. **[PREVIEW]** Display the full resume draft to the user.
3. **[REVISE]** Incorporate any user-requested minor edits.
4. **[SIGN-OFF]** Request final user confirmation.

## 📤 OUTPUT SCHEMA (`content_review.yaml`)
```yaml
review_results:
  overall_status: "PASS|FAIL"
  checklist_results:
    quantification: boolean
    action_verbs: boolean
    keyword_density: boolean
    brevity: boolean
    alignment: boolean
  user_confirmed: boolean
  readiness_for_layout: boolean
```

## 🔗 DEPENDENCIES
- Requires: `step-16` output.
- Blocks: `step-17a-sizer-line-overflow-check.md` (Phase K).
