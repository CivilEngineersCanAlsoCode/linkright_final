---
name: "step-07-complete"
description: "Finalize build, generate help registry"

buildTrackingFile: "{bmb_creations_output_folder}/modules/module-build-{module_code}.md"
targetLocation: "{build_tracking_targetLocation}"
moduleHelpGenerateWorkflow: "../module-help-generate.md"
validationWorkflow: "../steps-v/step-01-validate.md"
---

# Step 7: Complete

## STEP GOAL:

Finalize the module build, update tracking, and offer to run validation.

---

## MANDATORY SEQUENCE

### 1. Generate module-help.csv

"**🎯 Generating module-help.csv...**"
Load and execute `{moduleHelpGenerateWorkflow}` to scan and register all agents/workflows.

### 2. Final Build Summary

"**🎉 Module structure build complete!**"
Show a table of created agent specs, workflow specs, configuration, and documentation.

### 3. Update Build Tracking

Set status to `COMPLETE` and add the completion timestamp to `{buildTrackingFile}`.

### 4. Next Steps

Explain how to proceed:

- Build agents using `agent-builder`.
- Build workflows using `workflow-builder`.
- Test installation with `bmad install`.

### 5. Offer Validation

"**Would you like to run validation on the module structure?**"
checks for file compliance, YAML correctness, and installation readiness.

### 6. Present MENU OPTIONS

[V] Validate Module [D] Done

---

## Success Metrics

- `module-help.csv` generated.
- Build tracking marked `COMPLETE`.
- Summary presented.
