# Step 02: Run Suite

**Workflow**: Quality Gate Orchestrator
**Agent**: QA Engineer

---

## 🎯 Goal

Execute all collected tests in the target environment.

---

## 📋 Instructions

1.  **Initialize Environment**: Ensure all required environment variables and mocks are active.
2.  **Execute Unit Tests**: Run `npx vitest run` for all files in the manifest.
3.  **Execute E2E Tests**: Run `npx playwright test` for all full-workflow files.
4.  **Capture Raw Data**: Save the raw JSON/JUnit results to `_lr/lrb/workflows/qa/data/raw-results.json`.

---

## 🚦 Next Step

Proceed to **Step 03: Determine Result** once execution is complete.
