---
description: 'Phase L: Step 18 — Selection of the visual resume template based on company stage and persona fit'
stepsCompleted: [13, 14, 15, 16, 17]
nextStepFile: './step-19-inject-company-branding.md'
---

# Step 18: Select Resume Template

## 🎯 OBJECTIVE
Select the most appropriate visual template for the final resume, ensuring the "look and feel" matches the cultural expectations of the target company and the chosen persona tilt.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- The template choice is justified by the `company_brief.stage` (e.g., "Minimal" for Scale-up).
- The selected `template_id` exists in the verified `manifest.yaml`.
- Output schema `template_selection.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- A "Classic" template is selected for a "High-Growth Startup" without justification.
- The template library is inaccessible or empty.
- Persona alignment is ignored (e.g., selecting a "Creative" template for a "Tech-PM" role at a bank).

## 📥 INPUT
- `company_brief`: From Phase C.
- `persona_fit_primary`: From Phase D.
- `templates/manifest.yaml`: Library of available styles.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the template manifest and user context.
2. **[MATCH]** Evaluate cultural fit:
   - **Modern/Minimal:** Best for Startups, Scale-ups, and Tech-focused roles.
   - **Classic/Standard:** Best for Enterprise, Finance, and Traditional corporate roles.
   - **Creative:** Best for Design-led or Marketing-heavy organizations.
3. **[ALIGN]** Ensure the template supports the content density (1-page target) from Phase K.
4. **[SELECT]** Assign the `target_template_id`.
5. **[LOG]** Record the rationale for the selection.

## 📤 OUTPUT SCHEMA (`template_selection.yaml`)
```yaml
template_audit:
  selected_id: string
  cultural_rationale: string
  persona_alignment: string
  template_path: string
  status: "READY"
```

## 🔗 DEPENDENCIES
- Requires: Phase K (`step-17c`) output.
- Blocks: `step-19-inject-company-branding.md`.
