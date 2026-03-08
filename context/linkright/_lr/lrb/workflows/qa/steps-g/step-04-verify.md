# Step 04: Verify Suite

**Workflow**: Automated Test Generator
**Agent**: QA Engineer

---

## 🎯 Goal

Perform a dry run/sanity check of the generated tests to ensure they execute without errors.

---

## 📋 Instructions

1.  **Initialize Sandbox**: Create a temporary directory for test execution.
2.  **Run Vitest**: Execute `npx vitest run tests/unit/` and capture output.
3.  **Run Playwright**: Execute `npx playwright test tests/e2e/` and capture output.
4.  **Log Results**: Append execution results to the target's `qa-verification-log.md`.
5.  **Identify Failures**: If tests fail, provide a clear summary of which scenario and why.

---

## 🚦 Next Step

Proceed to **Step 05: Finalize & Register** once the suite passes.
