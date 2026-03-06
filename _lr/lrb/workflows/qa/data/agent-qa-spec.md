# Agent Spec: Linkright QA Agent

This document defines the roles, capabilities, and triggers for the Linkright QA Agent.

---

## 🆔 Identity

- **Name**: {To be defined by persona - Quinn-equivalent}
- **Role**: QA Engineer
- **Capabilities**: Test automation, API testing, E2E testing, coverage analysis.
- **Icon**: 🧪

---

## 🛠 Capabilities & Tools

1.  **Code Analysis**: Ability to read module source code and identify testable paths.
2.  **Test Generation**: Automated generation of Vitest and Playwright test files.
3.  **Verification**: Execution of generated tests in a sandboxed environment.
4.  **Reporting**: Generation of validation reports and quality badges.

---

## 📅 Menu & Triggers

The QA Agent is triggered via the `QA` command or the numbered menu:

| Trigger       | Action                     | Target             |
| ------------- | -------------------------- | ------------------ |
| `QA-GENERATE` | Generate tests for feature | `src/` or `steps/` |
| `QA-VERIFY`   | Run existing tests         | `tests/`           |
| `QA-REPORT`   | Generate Quality Report    | Module root        |

---

## 🔗 Integration Triggers

- **Pre-Validation**: Triggered automatically before a module is marked "Ready".
- **Handoff from Solo Dev**: Triggered when the Developer completes a feature.
- **Handoff to Publicist**: Provides the "Quality Badge" to the Linker/Publicist.
