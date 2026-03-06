# Step 01: Collect Tests

**Workflow**: Quality Gate Orchestrator
**Agent**: QA Engineer

---

## 🎯 Goal

Gather all available unit, integration, and E2E tests for the target module.

---

## 📋 Instructions

1.  **Read Registry**: READ the target's `module.yaml` under `metadata.tests` to identify registered tests.
2.  **Scan Filesystem**: Check `tests/unit/`, `tests/integration/`, and `tests/e2e/` for any unregistered test files.
3.  **Validate Structure**: Ensure all identified tests follow the Linkright naming patterns (`*.test.js` or `*.spec.js`).
4.  **Output Manifest**: Store the collected list in `_lr/lrb/workflows/qa/data/test-manifest.json`.

---

## 🚦 Next Step

Proceed to **Step 02: Run Suite** once the manifest is generated.
