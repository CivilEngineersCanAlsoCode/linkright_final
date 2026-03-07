# QA Standards: Linkright Builder

This document defines the Linkright testing philosophy and quality standards for all generated modules and agents.

---

## 🏗 Testing Hierarchy

### 1. Unit Testing (Vitest)

- **Scope**: Individual functions, utility methods, and small logic blocks.
- **Rule**: Must be isolated (no filesystem or network dependencies).
- **Goal**: 90%+ logic branch coverage.

### 2. Integration Testing (Playwright/Node)

- **Scope**: Interaction between multiple steps in a workflow or between an agent and a tool.
- **Rule**: Can use mock filesystems and local environment variables.
- **Goal**: Verify state transitions and data passing between steps.

### 3. End-to-End (E2E) Testing (Playwright)

- **Scope**: Full lifecycle of a module (Brief -> Create -> Edit -> Validate).
- **Rule**: Runs in a sandbox directory; performs actual filesystem operations.
- **Goal**: Verify the "Happy Path" from user trigger to final output.

---

## ✅ Quality Definitions

- **PASS**: All automated tests pass; no Priority 1 (Critical) issues.
- **WARNINGS**: All critical tests pass; minor non-breaking issues identified in validation.
- **FAIL**: Any critical test fails or architectural standard is breached.

---

## 🛠 Required Tools

- **Runner**: Vitest (for unit/integration)
- **Browser/Environment**: Playwright
- **Assertions**: `expect` syntax
- **Mocking**: `vi.mock` for external dependencies
