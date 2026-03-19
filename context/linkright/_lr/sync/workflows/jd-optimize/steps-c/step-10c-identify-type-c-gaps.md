---
description: 'Phase G: Step 10c — Identification of Type C Gaps (Metric Gaps) where evidence exists but metrics are missing'
stepsCompleted: [9, 10, 10.5]
nextStepFile: './step-11-inquisitor-type-a-questions.md'
---

# Step 10c: Identify Type C Gaps

## 🎯 OBJECTIVE
Identify all retrieved signals where the core experience exists but specific metrics or quantifiable outcomes are missing (Metric Gaps).

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Every signal in `top_signals[]` is evaluated for the presence of confirmed `impact_metrics`.
- Signals with "unconfirmed" or "estimated" metrics are explicitly flagged as Type C Gaps.
- Output schema `type_c_gaps.yaml` is fully populated with missing metric types.

### ❌ SYSTEM FAILURE:
- Signals with vague descriptions ("Experienced in X") are marked as full matches without metrics.
- The distinction between "estimated" and "verified" metrics is ignored.
- No guidance is provided for the Inquisitor on what specific numbers are missing.

## 📥 INPUT
- `top_signals[]`: Retrieved user signals from Phase E.
- `sync-signal-gap-taxonomy.md`: Taxonomy for gap classification.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the `top_signals[]` array.
2. **[EVALUATE]** For each signal, check the following criteria:
   - **Metric Gap (Type C):** Signal experience clearly matches a JD requirement, but `impact_metrics[]` is empty OR all existing metrics are marked as `unconfirmed` or `estimated`.
3. **[IDENTIFY]** Flag signals where the "story" is good but the "proof" (numbers) is missing.
4. **[ASSEMBLE]** Build the `type_c_gaps[]` array.

## 📤 OUTPUT SCHEMA (`type_c_gaps.yaml`)
```yaml
type_c_gaps:
  - signal_id: string
    requirement_name: string
    missing_metric_types: [string]
    inquisitor_hook: string
    status: "METRIC_GAP"
```

## 🔗 DEPENDENCIES
- Requires: `step-10b` output.
- Blocks: `step-11-inquisitor-type-a-questions.md` (Phase H).
