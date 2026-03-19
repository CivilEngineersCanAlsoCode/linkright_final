---
description: 'Phase L: Step 20 — Compilation of the finalized resume into production-ready HTML/CSS artifacts'
stepsCompleted: [13, 14, 15, 16, 17, 18, 19]
nextStepFile: './step-21a-score-keyword-coverage-final.md'
---

# Step 20: Compile HTML/CSS

## 🎯 OBJECTIVE
Compile the finalized resume content, template, and branding configuration into high-fidelity HTML/CSS artifacts, ready for final scoring and distribution.

## 🚨 SYSTEM SUCCESS/FAILURE METRICS
### ✅ SUCCESS:
- The compiler generates a valid HTML5 document without syntax errors.
- The CSS output includes all overridden brand variables from `step-19`.
- Output schema `compilation_report.yaml` is fully populated with file paths and hash values.

### ❌ SYSTEM FAILURE:
- Sections are missing from the HTML output (injection failure).
- CSS variables fail to propagate, resulting in default styling.
- The artifact is stored in a temporary location that is not accessible to the next phase.

## 📥 INPUT
- `optimized-resume.md`: Finalized layout.
- `branding_config.yaml`: Finalized styles.
- `template_selection.yaml`: Finalized structure.

## ⚙️ EXECUTION PROTOCOLS
1. **[READ]** Load the content, styles, and template parameters.
2. **[COMPILE]** Run the HTML/CSS generation engine:
   - Map Markdown sections to template DOM nodes.
   - Inject CSS variables into the global style block.
   - Post-process for asset paths (images, fonts).
3. **[VALIDATE]** Perform an automated DOM check to ensure all 4 views are present.
4. **[SAVE]** Write the artifacts to the session's `/export/` directory.
5. **[LOG]** Generate the file hashes for integrity tracking.

## 📤 OUTPUT SCHEMA (`compilation_report.yaml`)
```yaml
compilation_audit:
  html_path: string
  css_path: string
  file_hash: string
  view_count: int
  brand_active: boolean
  status: "COMPILED"
```

## 🔗 DEPENDENCIES
- Requires: `step-19` output.
- Blocks: `step-21a-score-keyword-coverage-final.md` (Phase M).
