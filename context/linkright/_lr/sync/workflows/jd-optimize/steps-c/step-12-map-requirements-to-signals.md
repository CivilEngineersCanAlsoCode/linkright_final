---
description: 'Phase I: Step 12 — Mapping job requirements to user signals to create the logical skeleton of the resume'
stepsCompleted: [11]
nextStepFile: './step-13a-plan-summary-positioning.md'
---

# Step 12: Map Requirements to Signals

## 🎯 OBJECTIVE
Map each P0/P1 JD requirement to the single best signal from the updated `top_signals[]` pool, ensuring that every mandatory JD expectation is met with specific evidence.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- Every P0 requirement has at least one associated signal with a match score > 85%.
- Signal selection prioritizes the `persona_fit_primary` chosen in Phase D.
- Output schema `requirement_signal_map.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- A P0 requirement is left "Unmapped" without a critical gap flag.
- Signals are misaligned with the requirement's technical or product context.
- The same signal is overused (more than 3 times) across different requirements, reducing narrative diversity.

## 📥 INPUT
- `jd_profile.requirements.hard[]`: Mandatory requirements.
- `top_signals[]`: The pool of user evidence (including new signals from Phase H).

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load all `top_signals[]` and JD requirements.
2. **[MATCH]** For each P0 requirement, perform semantic matching to find the top signal.
   - Priority 1: High `composite_score`.
   - Priority 2: Matches `persona_fit_primary`.
   - Priority 3: Matches `company_brief.pm_culture`.
3. **[ALLOCATE]** Assign the best signal to the requirement.
4. **[MAP]** Build the `requirement_signal_map`.
5. **[LOG]** Surface the match rate and identify any remaining "High-Risk" requirements.

## 📤 OUTPUT SCHEMA (`requirement_signal_map.yaml`)
```yaml
requirement_mappings:
  - requirement_id: string
    requirement_text: string
    assigned_signal_id: string
    match_justification: string
    persona_alignment: "High|Medium|Low"
    match_score: float
```

## 🔗 DEPENDENCIES
- Requires: Phase H (`step-11b`) output.
- Blocks: `step-13a-plan-summary-positioning.md`.
