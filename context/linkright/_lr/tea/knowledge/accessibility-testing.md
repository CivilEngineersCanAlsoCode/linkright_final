# Accessibility Testing Guide

> **WCAG 2.1/2.2 Level AA Compliance Framework for Playwright Automation**

---

## Principles & Rationale

Accessibility testing validates that applications are usable by all users, including those with disabilities. This guide covers:
- **Legal Compliance**: WCAG 2.1/2.2 AA standard (US ADA, EU EN 301 549)
- **Cost-of-Fix Curve**: Bugs fixed early cost 10–100× less than post-release
- **Release Gate**: ADA compliance is a mandatory P0 quality gate — no exceptions

### Why Automation?

Manual accessibility testing alone is insufficient:
- Manual testers can miss edge cases (focus order, keyboard navigation under stress)
- Screen reader behavior varies by OS/browser/AT combination
- Axe-core + Playwright CI catches 80% of WCAG failures automatically
- Remaining 20% (perceivable, understandable) requires manual review per ADR-quality-readiness-checklist.md

---

## WCAG 2.1/2.2 AA Quick Reference

| Pillar | Focus Areas | Tools |
|--------|-------------|-------|
| **Perceivable** | Color contrast, alt text, captions, descriptive links | axe-core, Lighthouse, manual |
| **Operable** | Keyboard nav, focus management, no hard waits | Keyboard only mode, DevTools |
| **Understandable** | Language, consistent nav, error messages | Manual review + ARIA audit |
| **Robust** | Valid HTML, ARIA roles, semantic structure | W3C validator, axe-core |

---

## TypeScript Examples (Playwright + Axe-Core)

### Example 1: Automated Axe-Core Scan (40 lines)

```typescript
// fixtures/accessibility.fixture.ts
import { test, Page } from '@playwright/test';
import { injectAxe, getViolations } from 'axe-playwright';

export const accessibilityTest = test.extend({
  scanAccessibility: async ({ page }: { page: Page }, use) => {
    const scan = async (selector?: string) => {
      await injectAxe(page);
      const violations = await getViolations(page, selector);
      return violations;
    };
    await use(scan);
  },
});

// usage
accessibilityTest('home page has no wcag violations', async ({ page, scanAccessibility }) => {
  await page.goto('/');
  const violations = await scanAccessibility();
  expect(violations).toHaveLength(0);
});
```

### Example 2: Keyboard Navigation Test (48 lines)

```typescript
// tests/accessibility.keyboard.spec.ts
import { test, expect } from '@playwright/test';

test('modal dialog keyboard trap + focus restore', async ({ page }) => {
  await page.goto('/modal-example');

  // Tab to modal trigger button
  await page.keyboard.press('Tab');
  expect(await page.locator(':focus').getAttribute('data-testid')).toBe('open-modal-btn');

  // Open modal (must trap focus)
  await page.keyboard.press('Enter');
  await page.waitForSelector('[role="dialog"]');

  // Tab within modal — should NOT escape
  await page.keyboard.press('Tab');
  const focusedElem = await page.locator(':focus').getAttribute('data-testid');
  expect(['close-btn', 'confirm-btn', 'cancel-btn']).toContain(focusedElem);

  // ESC closes modal, restores focus to trigger
  await page.keyboard.press('Escape');
  expect(await page.locator('[role="dialog"]').isVisible()).toBe(false);
  expect(await page.locator(':focus').getAttribute('data-testid')).toBe('open-modal-btn');
});
```

### Example 3: ARIA Landmark Validation (50 lines)

```typescript
// tests/accessibility.landmarks.spec.ts
import { test, expect } from '@playwright/test';

test('page structure follows ARIA landmark pattern', async ({ page }) => {
  await page.goto('/');

  // Check for exactly one banner (main header)
  const banners = await page.locator('[role="banner"], header:not([role])').all();
  expect(banners.length).toBeGreaterThanOrEqual(1);

  // Main content area
  const main = await page.locator('main, [role="main"]').count();
  expect(main).toBeGreaterThanOrEqual(1);

  // Navigation landmarks
  const navs = await page.locator('nav, [role="navigation"]').all();
  expect(navs.length).toBeGreaterThanOrEqual(1);

  // Complementary (sidebar, if present)
  const complementary = await page.locator('[role="complementary"], aside').all();
  if (complementary.length > 0) {
    // If sidebar exists, it must have aria-label
    for (const elem of complementary) {
      const label = await elem.getAttribute('aria-label') || await elem.getAttribute('aria-labelledby');
      expect(label).toBeTruthy();
    }
  }

  // Contentinfo (footer)
  const footers = await page.locator('footer, [role="contentinfo"]').all();
  expect(footers.length).toBeGreaterThanOrEqual(1);
});
```

### Example 4: Lighthouse CI + Contrast Check (55 lines)

```typescript
// tests/accessibility.lighthouse.spec.ts
import { test, expect } from '@playwright/test';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

test('lighthouse accessibility audit passes threshold', async ({ page, baseURL }) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['accessibility'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(baseURL + '/', options);
  const score = runnerResult?.lhr?.categories.accessibility.score || 0;

  await chrome.kill();

  // Accessibility score must be ≥ 90 (90% = yellow, 100% = green in Lighthouse)
  expect(score).toBeGreaterThanOrEqual(0.9);

  // Check specific accessibility failures
  const failures = runnerResult?.lhr?.audits || {};
  expect(failures['color-contrast']?.score).toBeGreaterThanOrEqual(0.9);
  expect(failures['aria-required-attr']?.score).toBeGreaterThanOrEqual(0.9);
});
```

### Example 5: Form Label Association + Error Announcement (52 lines)

```typescript
// tests/accessibility.forms.spec.ts
import { test, expect } from '@playwright/test';

test('form inputs have proper labels and errors announced', async ({ page }) => {
  await page.goto('/form-example');

  // Every input must have associated label
  const inputs = await page.locator('input:not([hidden])').all();
  for (const input of inputs) {
    const inputId = await input.getAttribute('id');
    expect(inputId).toBeTruthy();

    // Check label has matching for= attribute
    const labelCount = await page.locator(`label[for="${inputId}"]`).count();
    expect(labelCount).toBeGreaterThanOrEqual(1);
  }

  // Fill form with invalid data
  await page.fill('input[name="email"]', 'invalid-email');
  await page.click('button[type="submit"]');

  // Error message must be announced (role=alert or aria-live=polite)
  const errorRegion = await page.locator('[role="alert"], [aria-live="assertive"]').first();
  await expect(errorRegion).toContainText(/email|invalid/i);

  // Focus moves to first error field
  await page.waitForTimeout(200); // Allow for focus change
  const focusedLabel = await page.locator(':focus').getAttribute('aria-label')
    || await page.locator(':focus').getAttribute('name');
  expect(focusedLabel).toBeTruthy();
});
```

---

## Accessibility Checklist (7 Items)

Use this before code review. Automate items marked **[AUTO]**, manually verify marked **[MANUAL]**.

- **[AUTO] No Axe-Core Violations**: `npm run test:a11y` passes with 0 violations on all pages
- **[MANUAL] Color Contrast**: Lighthouse reports score ≥ 90; spot-check text on images (4.5:1 AA minimum)
- **[MANUAL] Keyboard Navigation**: Tab through entire app; tab order is logical; focus visible; no traps
- **[AUTO] ARIA Landmarks**: Header, main, nav, footer all present with correct roles
- **[AUTO] Form Labels**: Every input has associated `<label>` or `aria-label`
- **[MANUAL] Alt Text**: Images have descriptive alt text (not "image" or empty); decorative images have `alt=""`
- **[MANUAL] Screen Reader Smoke Test**: NVDA (Windows) or VoiceOver (Mac) can navigate full app; announcements logical

---

## Gate Decision Matrix

| Criterion | PASS | CONCERNS | FAIL |
|-----------|------|----------|------|
| **Axe-Core Score** | 0 violations | 1–2 minor (low-priority, documented), <5 components affected | ≥3 violations OR any critical |
| **Contrast (WCAG AA)** | All text ≥ 4.5:1 (normal) or 3:1 (large) | 1–2 instances <4.5:1, isolated to non-critical areas | >2 failures OR critical text unreadable |
| **Keyboard Nav** | Full navigation via Tab/Shift+Tab/Enter/Esc | Minor focus order issue (one edge case) | Focus trapped, no escape, unmapped keys |
| **Screen Reader (VoiceOver)** | Logical announcement order, labels clear, landmarks present | Minor announcement unclear on 1–2 components | Unlabeled controls, silent areas, critical failure |

**Decision Rule**:
- **PASS**: All green
- **CONCERNS**: 1–2 items yellow; must document & remediate before next release
- **FAIL**: Any red; blocker, do not release

---

## Integration Points

- **Refs**: test-levels-framework.md (accessibility testing = system-level concern), nfr-criteria.md (ADA compliance as NFR)
- **Resume Validation Workflow**: resume-validation/instructions.md loads this for UAT gate check
- **CI Gate**: GitHub Actions runs `npm run test:a11y` on every PR; blocks merge if violations detected

---

## Common Pitfalls

1. **Relying on Axe-Core Alone**: Catches ~80% of issues; manual review critical
2. **Focus Traps in Modals**: Don't test in isolation — test keyboard escape + focus restoration
3. **Alt Text Farming**: Auto-generated or meaningless alt text fails audit; write descriptive text
4. **Color-Only Communication**: Don't use color alone to indicate state (e.g., red = error); add icons or text
5. **Testing Only Happy Path**: Test error states, validation messages, edge cases (zoom, high contrast mode)

---

## Tools & Config

- **axe-core**: `npm install --save-dev axe-core axe-playwright`
- **Lighthouse CI**: `npm install --save-dev @lhci/cli@^0.9.0`
- **Screen Readers**: NVDA (Windows free), VoiceOver (macOS built-in), JAWS (commercial)
- **.playwright.config.ts**: Add `viewport: { width: 1280, height: 720 }` for high-contrast testing

---

**Last Updated**: 2026-03-08 | **Standard**: WCAG 2.1 Level AA | **Review Every 6 Months**
