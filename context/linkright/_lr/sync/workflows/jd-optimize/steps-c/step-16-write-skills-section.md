---
description: 'Phase J: Step 16 — Generation of the categorized skills section based on the confirmed narrative plan'
stepsCompleted: [13, 14, 15]
nextStepFile: './step-30-content-review.md'
---

# Step 16: Write Skills Section

## 🎯 OBJECTIVE
Generate the finalized skills section, organized into 3 prioritized categories, ensuring maximum keyword density and logical flow for human readers and ATS systems.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Skills are organized into 3 distinct categories: Core Technical, Domain/Strategic, and Tools/Methodologies.
- Every "Must-Have" technical keyword from Phase C is present in the list.
- Output schema `skills_section.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Duplicate keywords exist across different categories.
- Skills list is unsorted (lack of prioritization).
- Critical keywords from the `company_brief` are missing.

## 📥 INPUT
- `sync-narrative-plan.md`: Specifically the skills ordering plan.
- `jd_profile`: List of target keywords.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the Skills section plan.
2. **[WRITE]** Generate the 3-category skills list.
3. **[ATS]** Format all keywords for maximum readability (comma-separated).
4. **[CHECK]** Verify that the skills list includes the user's "Verified Skills" from `lr-config.yaml`.
5. **[APPEND]** Add the section to the `optimized-resume.md`.

## 📤 OUTPUT SCHEMA (`skills_section.yaml`)
```yaml
skills_content:
  category_1_technical: [string]
  category_2_domain: [string]
  category_3_tools: [string]
  keyword_coverage_rate: float
  ats_readability_pass: boolean
```

## 🔗 DEPENDENCIES
- Requires: `step-15c` output.
- Blocks: `step-30-content-review.md`.
