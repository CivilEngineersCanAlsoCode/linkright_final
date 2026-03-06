# Step 03: Generate Tests

**Workflow**: Automated Test Generator
**Agent**: QA Engineer

---

## 🎯 Goal

Generate actual test code (Vitest/Playwright) for the scenarios defined in Step 02.

---

## 📋 Instructions

1.  **Load Plan**: READ the `test-plan-{timestamp}.md` from the target module's `tests/` directory.
2.  **Apply Test Patterns**: Use the standardized patterns from `_lr/lrb/workflows/qa/data/test-patterns.md`.
3.  **Generate Unit Tests**: Create `*.test.js` (Vitest) files for core logic in `tests/unit/`.
4.  **Generate E2E Tests**: Create `*.spec.js` (Playwright) files for full workflows in `tests/e2e/`.
5.  **Inject Mocks**: Ensure all external dependencies are correctly mocked using `vi.mock`.

---

## 🚦 Next Step

Proceed to **Step 04: Verify Suite** once all test files are generated.
