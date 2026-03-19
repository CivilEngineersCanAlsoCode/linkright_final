---
description: 'Phase L: Step 19 — Injection of target company branding (colors, typography) into the selected template'
stepsCompleted: [13, 14, 15, 16, 17, 18]
nextStepFile: './step-20-compile-html-css.md'
---

# Step 19: Inject Company Branding

## 🎯 OBJECTIVE
Apply the target company's visual identity (colors, tone) to the selected resume template, signaling cultural alignment through subtle design cues.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- The `--brand-primary` CSS variable matches the company's verified Hex code.
- Contrast accessibility check (WCAG AA) passes for the selected brand color.
- Output schema `branding_config.yaml` is fully populated.

### ❌ SYSTEM FAILURE:
- Brand color is applied without contrast validation (unreadable text).
- Font choice contradicts the company's `tone_descriptor` (e.g., using playful fonts for a formal law firm).
- Branding signals are missing from the `company_brief` and no default is applied.

## 📥 INPUT
- `target_template_id`: From Step 18.
- `company_brief`: Branding signals from Phase C.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the company branding signals.
2. **[APPLY]** Update CSS variables:
   - **Primary Color:** Set `--brand-primary` to the hex code.
   - **Tone Styling:** Select font families based on the `tone_descriptor`.
3. **[VALIDATE]** Perform a contrast check:
   - If contrast < 4.5:1, adjust luminosity of the brand color until compliant.
4. **[ASSEMBLE]** Generate the `branding_config.yaml` for the HTML/CSS compiler.
5. **[LOG]** Record the final color and font selection.

## 📤 OUTPUT SCHEMA (`branding_config.yaml`)
```yaml
branding_audit:
  company_name: string
  primary_color_hex: string
  contrast_ratio: float
  accessibility_pass: boolean
  typography_set: string
  status: "BRANDED"
```

## 🔗 DEPENDENCIES
- Requires: `step-18` output.
- Blocks: `step-20-compile-html-css.md`.
