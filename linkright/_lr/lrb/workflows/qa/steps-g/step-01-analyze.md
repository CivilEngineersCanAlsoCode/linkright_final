# Step 01: Analyze Target

**Workflow**: Automated Test Generator
**Agent**: QA Engineer

---

## 🎯 Goal

Analyze the target module or feature to identify testable endpoints, core logic, and critical paths.

---

## 📋 Instructions

1.  **Load Target**: READ the `module.yaml` and directory structure of the target module.
2.  **Identify Endpoints**: Scan `src/`, `steps/`, or `api/` for public functions and interfaces.
3.  **Map Logic**: Identify conditional branching and complex data transformations.
4.  **Security Scan**: Check for hardcoded credentials or sensitive data in testable areas.
5.  **Output Analysis**: Store identified test targets in `_lr/lrb/workflows/qa/data/current-analysis.json`.

---

## 🚦 Next Step

Proceed to **Step 02: Plan Scenarios** once the analysis is stored.
