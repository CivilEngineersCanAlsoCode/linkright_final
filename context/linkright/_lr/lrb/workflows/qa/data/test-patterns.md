# Test Patterns: Linkright Builder

This document provides standardized code patterns for implementing tests in the Linkright ecosystem.

---

## 🧪 Unit Test Pattern (Vitest)

```javascript
import { describe, it, expect, vi } from "vitest";
import { someFunction } from "../src/logic";

describe("someFunction", () => {
  it("should process valid input correctly", () => {
    const input = { key: "value" };
    const result = someFunction(input);
    expect(result).toEqual({ processed: true });
  });

  it("should throw error on invalid input", () => {
    expect(() => someFunction(null)).toThrow("Invalid input");
  });
});
```

---

## 🔗 Integration Test Pattern

Focus on mocking the `_lr` filesystem structure.

```javascript
import { vi } from "vitest";

// Mocking the Linkright filesystem
vi.mock("fs/promises", () => ({
  readFile: vi.fn().mockResolvedValue("module_content"),
  writeFile: vi.fn(),
}));
```

---

## 🎭 E2E Test Pattern (Playwright)

```javascript
import { test, expect } from "@playwright/test";

test("Full Workflow: Create Module from Brief", async ({ page }) => {
  // 1. Initialize Sandbox
  // 2. Trigger workflow-create-module.md
  // 3. Verify directory structure generation
  // 4. Verify module.yaml content
});
```

---

## 🧹 Cleanup Rules

- **Sandboxing**: Always use a unique temporary prefix for output folders.
- **Teardown**: Ensure all temporary files are deleted after test suites complete.
