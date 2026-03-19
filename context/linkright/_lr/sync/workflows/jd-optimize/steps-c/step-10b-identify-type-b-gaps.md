---
description: 'Phase G: Step 10b — Identification of Type B Gaps (Alignment Gaps) where skills exist but context differs'
stepsCompleted: [9, 10]
nextStepFile: './step-10c-identify-type-c-gaps.md'
---

# Step 10b: Identify Type B Gaps

## 🎯 OBJECTIVE
Identify requirements where the user has relevant skills but the industry context, scale, or product type differs from the JD (Alignment Gaps).

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- All partial matches (similarity 50-85%) are evaluated for contextual alignment.
- Type B Gaps are documented with specific "Context Mismatches" (e.g., "B2B vs B2C").
- Output schema `type_b_gaps.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Contextual differences are ignored, leading to weak positioning.
- Skills are marked as "full match" despite major industry or scale differences.
- No remediation strategy is suggested for the identified alignment gap.

## 📥 INPUT
- `jd_profile`: Specifically the requirements and company brief.
- `top_signals[]`: Retrieved user signals.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load `top_signals[]` and `jd_profile`.
2. **[EVALUATE]** For each signal that semantically matches a JD requirement:
   - Compare `industry`, `product_type`, and `scale_metric` between the signal and the JD.
3. **[IDENTIFY]** If the core skill matches but the context differs significantly, categorize as a **Type B Gap** (Alignment Gap).
4. **[ASSEMBLE]** Build the `type_b_gaps[]` array.

## 📤 OUTPUT SCHEMA (`type_b_gaps.yaml`)
```yaml
type_b_gaps:
  - requirement_id: string
    requirement_text: string
    user_signal_id: string
    context_mismatch: string
    remediation_approach: "Reframe|Bridge|Pivot"
    status: "ALIGNMENT_GAP"
```

## 🔗 DEPENDENCIES
- Requires: `step-10a` output.
- Blocks: `step-10c-identify-type-c-gaps.md`.
