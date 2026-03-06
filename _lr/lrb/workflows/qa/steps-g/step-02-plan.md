# Step 02: Plan Scenarios

**Workflow**: Automated Test Generator
**Agent**: QA Engineer

---

## 🎯 Goal

Define specific test cases and scenarios based on the analysis from Step 01.

---

## 📋 Instructions

1.  **Load Analysis**: READ `_lr/lrb/workflows/qa/data/current-analysis.json`.
2.  **Define Happy Path**: For each endpoint, define at least one successful execution scenario.
3.  **Define Edge Cases**: Identify boundaries, empty inputs, and invalid formats.
4.  **Define Integration Cases**: Map interactions between this module and other Linkright components.
5.  **Output Plan**: Generate a `test-plan-{timestamp}.md` using the standard template and save it to the target module's `tests/` directory.

---

## 🚦 Next Step

Proceed to **Step 03: Generate Tests** once the test plan is reviewed and approved.
