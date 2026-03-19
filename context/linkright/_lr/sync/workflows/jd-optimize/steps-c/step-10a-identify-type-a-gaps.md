---
description: 'Phase G: Step 10a — Systematic identification of Type A Gaps (Critical Absences) in the signal library'
stepsCompleted: [9]
nextStepFile: './step-10b-identify-type-b-gaps.md'
---

# Step 10a: Identify Type A Gaps

## 🎯 OBJECTIVE
Identify all hard requirements in the JD that have ZERO matching signals in the user's current signal library pool (Critical Absences).

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Every mandatory hard requirement from `jd_profile` is cross-referenced with the `signal_coverage_map`.
- Requirements with zero matching signals are explicitly flagged as Type A Gaps.
- Output schema `type_a_gaps.yaml` is fully populated with requirement text and weight.

### ❌ SYSTEM FAILURE:
- A mandatory requirement is marked as "covered" when no evidence exists in the signal library.
- Gaps are identified without a corresponding `requirement_id`.
- Quantitative thresholds for "Zero Match" are ignored.

## 📥 INPUT
- `jd_profile.requirements.hard[]`: List of mandatory JD requirements.
- `signal_coverage_map`: Map of existing user signals by type.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the list of mandatory hard requirements from `jd_profile`.
2. **[COMPARE]** For each hard requirement:
   - Check if the requirement's `signal_type` exists in the `signal_coverage_map`.
   - If the type exists, perform a keyword scan of the top signals' `raw_reflection` to see if the specific requirement is mentioned.
3. **[IDENTIFY]** If no match is found (by type or by content), categorize as a **Type A Gap** (Complete Gap).
4. **[ASSEMBLE]** Build the `type_a_gaps[]` array.

## 📤 OUTPUT SCHEMA (`type_a_gaps.yaml`)
```yaml
type_a_gaps:
  - requirement_id: string
    requirement_text: string
    signal_type: string
    weight: float
    status: "CRITICAL_ABSENCE"
```

## 🔗 DEPENDENCIES
- Requires: Phase E (`step-08c`) and Phase F (`step-09f`) output.
- Blocks: `step-10b-identify-type-b-gaps.md`.
