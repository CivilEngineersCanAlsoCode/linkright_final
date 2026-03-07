# Step 03: Determine Result

**Workflow**: Quality Gate Orchestrator
**Agent**: QA Engineer

---

## 🎯 Goal

Parse the raw test results and determine the overall compliance status.

---

## 📋 Instructions

1.  **Load Results**: READ `_lr/lrb/workflows/qa/data/raw-results.json`.
2.  **Apply Standards**: Check results against `_lr/lrb/workflows/qa/data/coverage-rules.md`.
3.  **Evaluate Coverage**: Verify if 90% logic coverage and 100% path coverage targets are met.
4.  **Identify Failures**: Flag any Priority 1 or 2 issues.
5.  **Calculate Final Score**: Generate a quality score (0-100) and status (PASS/WARNING/FAIL).

---

## 🚦 Next Step

Proceed to **Step 04: Generate Badge** once the status is determined.
