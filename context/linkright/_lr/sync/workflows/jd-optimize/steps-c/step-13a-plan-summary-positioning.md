---
description: 'Phase I: Step 13a — Formulation of the one-line positioning statement and summary strategy'
stepsCompleted: [11, 12]
nextStepFile: './step-13b-plan-role1-bullet-strategy.md'
---

# Step 13a: Plan Summary Positioning

## 🎯 OBJECTIVE
Draft the high-impact one-line positioning statement and summary strategy that will anchor the resume header and define the user's professional "tilt".

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- The positioning statement is exactly one line and follows the [Persona] + [Core Signal] + [Context] formula.
- The summary strategy explicitly addresses the top 2 P0 requirements identified in Phase B.
- Output schema `summary_positioning.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Positioning statement is generic or multi-line.
- Strategy fails to incorporate keywords from the `company_brief.industry_terms[]`.
- The "Tilt" selected in Step 06e is not visible in the summary draft.

## 📥 INPUT
- `persona_fit_primary`: The selected persona from Phase D.
- `company_brief`: Context about the target company from Phase C.
- `requirement_signal_map.yaml`: The logical skeleton from Step 12.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load `persona_fit_primary` and `company_brief`.
2. **[FORMULATE]** Draft the `one-line-positioning` statement.
3. **[FORMULATE]** Draft the `summary_approach`:
   - Highlight the top-2 P0 requirements and their corresponding signals.
   - Use language from `company_brief.industry_terms[]`.
4. **[INITIALIZE]** Create the structured summary block for the `narrative-plan.md`.

## 📤 OUTPUT SCHEMA (`summary_positioning.yaml`)
```yaml
summary_positioning:
  one_line_hook: string
  primary_tilt: string
  target_p0_requirements: [string]
  industry_keywords_used: [string]
  summary_narrative_strategy: string
```

## 🔗 DEPENDENCIES
- Requires: `step-12` output.
- Blocks: `step-13b-plan-role1-bullet-strategy.md`.
