# User Acceptance Testing (UAT) Framework

> **Stakeholder-Driven Validation of Business Value, Not Just Technical Correctness**

---

## Principles & Rationale

User Acceptance Testing (UAT) validates that delivered features satisfy business requirements and deliver expected user value. UAT is **fundamentally different from** unit/integration/E2E testing:

| Aspect | Unit/Integration | E2E | **UAT** |
|--------|------------------|-----|--------|
| **Who Tests** | Developers, QA | QA Engineers | Business Stakeholders, SMEs |
| **What's Tested** | Code behavior, happy path + errors | User journeys, workflows | Business scenarios, value delivery, edge cases unique to domain |
| **Success Criteria** | Code works as designed | App flow works end-to-end | **User/business goal achieved** |
| **Environment** | Dev, staging | Staging (production-like) | **Production or production-replica** |
| **Timeline** | Continuous (CI/CD) | Pre-release (gates) | **Pre-go-live (final stakeholder approval)** |

### Cost-of-Fix Curve

- Bug found in UAT: $5–50k (hotfix, rollback, lost revenue)
- Bug found post-release: $50k–500k+ (customer impact, reputation, support costs)
- UAT is the **last defense** before live production

---

## UAT vs. Other Test Levels

```
┌─────────────────────────────────────────────────────────────────┐
│ Development Cycle                                               │
├─────────────────────────────────────────────────────────────────┤
│ Unit/Component → Integration → System (E2E) → **Acceptance** → Release
│   (Developer)    (QA)          (QA)           (Stakeholder)
│   ✓ Fast        ✓ Medium      ✓ Slow        ⚠ Very Slow
│   ✓ Isolated    ✓ Modules     ✓ Full Flow   ✓ Real Data/Env
│                                             ⚠ Subjective Pass/Fail
└─────────────────────────────────────────────────────────────────┘
```

---

## UAT Execution Models

### Model 1: ATDD-Style UAT with Gherkin (50 lines)

**Principle**: Business writes acceptance criteria in plain language; QA + Dev implement as executable scenarios.

```gherkin
# features/checkout-flow.feature
Feature: Checkout Process Delivers Expected Payment & Confirmation

  Background:
    Given I am logged in as a standard customer
    And my cart contains:
      | SKU       | Qty | Price |
      | SHIRT-001 | 2   | $25   |
      | SOCK-005  | 3   | $5    |
    And I have a valid Visa ending in 4242 on file

  Scenario: Complete checkout with valid payment
    When I navigate to /checkout
    Then I see order summary matching my cart ($65 total)
    And I see shipping options: Standard (5-7 days), Express (1-2 days), Overnight

    When I select "Standard" shipping
    And I confirm my billing address
    And I click "Place Order"

    Then payment processes successfully
    And I receive order confirmation email within 2 minutes
    And I see order number on confirmation page
    And my account shows new order with correct total

  Scenario: Customer rejects high-value charges (fraud prevention)
    When I navigate to /checkout
    And I see total is $65
    And I notice shipping address is wrong (different state, 30% higher tax)

    Then I am able to edit shipping address
    And new tax is recalculated correctly
    And I can cancel order without charge

  Scenario: Inventory depletes during checkout (race condition)
    # Two users, simultaneous checkout
    When User A has SHIRT-001 qty:2 in cart
    And User B has SHIRT-001 qty:3 in cart
    And only 4 units available

    When both users complete checkout simultaneously
    Then one succeeds, one sees "Out of Stock" error
    And inventory remains consistent (4 total sold, 0 remaining)
```

**Implementation (Playwright)**: (~45 lines)
```typescript
import { test, expect } from '@playwright/test';

test.describe('UAT: Checkout Flow', () => {
  test('complete checkout with valid payment', async ({ page }) => {
    await page.goto('/checkout');

    // Verify order summary
    const summary = await page.locator('[data-testid="order-summary"]').textContent();
    expect(summary).toContain('$65');

    // Select shipping
    await page.click('text=Standard Shipping');
    await page.fill('[data-testid="confirm-address"]', 'verified');

    // Place order
    await page.click('button:has-text("Place Order")');

    // Wait for confirmation
    await page.waitForURL('/order-confirmation');
    const orderNum = await page.locator('[data-testid="order-number"]').textContent();
    expect(orderNum).toMatch(/^ORD-\d{8}$/);

    // Email sent verification (mock backend call)
    expect(await page.request.get('/api/emails/latest')).toResolve();
  });
});
```

### Model 2: UAT Plan Template (40 lines)

Use this for formal UAT sessions with business stakeholders.

```markdown
# UAT Plan: Retail Checkout v2.0

## Scope
- Payment processing (Visa, Mastercard, PayPal)
- Shipping address validation & tax recalculation
- Order confirmation & email delivery
- Inventory sync during concurrent checkouts
- Fraud detection (high-value holds, velocity checks)

## Stakeholders & Roles
- **Business Owner**: Jane (VP Product) — final sign-off
- **SME (Finance)**: John (Director, AR) — payment reconciliation, PCI compliance
- **SME (Ops)**: Sarah (Head, Fulfillment) — inventory, shipping rules
- **QA Lead**: Michael — test coordination

## Test Environment
- **Baseline**: Production replica (mock payment processor)
- **Data**: 100 test customers, 500 SKUs, full tax tables
- **Duration**: 3 days (Monday–Wednesday, 6h each)

## Success Criteria (Gate)
- Zero P0 bugs (critical path failures)
- ≤3 P1 bugs (non-blocking, can hotfix post-release)
- Payment processor reconciliation passes (0 orphaned transactions)
- Stakeholder sign-off documented

## Test Cases (Sample)
1. **Happy Path**: [PASS/FAIL checkbox] Complete valid checkout
2. **Invalid Card**: [PASS/FAIL] Decline message shown; no charge
3. **Inventory Race**: [PASS/FAIL] Two simultaneous orders; only one succeeds
4. **Tax Recalc**: [PASS/FAIL] Address change updates tax correctly
5. **Email Delivery**: [PASS/FAIL] Confirmation email sent within 2 min

## Issues Found
| ID | Severity | Title | Status |
|----|----------|-------|--------|
| UAT-001 | P0 | Payment declined not shown to user | **BLOCKED** |
| UAT-002 | P1 | Shipping tax off by $0.02 on CA orders | In Progress |

## Sign-Off
- [ ] Jane (VP Product): _______________ Date: ___
- [ ] John (Finance SME): _______________ Date: ___
- [ ] Sarah (Ops SME): _______________ Date: ___
```

### Model 3: Stakeholder Observer Protocol (35 lines)

Bring stakeholders into test environment WITHOUT disrupting QA flow.

```markdown
# UAT Observer Session: Checkout Flow

## Pre-Session (30 min before)
1. QA prepares test environment; verifies baseline data
2. Stakeholders join Zoom; screen-share to QA workstation
3. QA briefs observers: "We'll walk through 5 scenarios; you watch & ask questions"

## During Session
- **Observer Questions**: "Why does X happen?" / "What if Y?" → QA documents & tests
- **Silent Observation**: Observers note issues on shared Google Sheet (not interrupting)
- **Live Reproduction**: "Can you show that again?" → QA reruns scenario

## Example Interaction
```
QA: [Runs scenario 1: valid checkout] Order placed successfully.
Observer (Jane): When would the customer NOT receive their email?
QA: Good question. [Checks email logs] If email service is down, customer sees notice.
     Let me test that. [Stops email service, reruns] ...yes, "Email delivery delayed" shown.
Observer: [Adds to sign-off notes] ✓ Email failure handling works.
```

## Post-Session (30 min)
- QA summarizes issues found
- Observers vote: Go/No-Go for release
- Document in UAT sign-off sheet
```

### Model 4: Beta Testing + Feature Flags (40 lines)

Roll out feature to subset of real users; collect feedback before full release.

```typescript
// Schema: beta_feature_flags table
interface BetaFeature {
  feature_id: string;         // e.g., "checkout-v2"
  rollout_percentage: number; // 5%, 25%, 50%, 100%
  user_segments: string[];    // ["vip_customers", "new_users"]
  start_date: Date;
  end_date: Date;
  metrics: {
    users_exposed: number;
    conversion_impact: number; // +/- %
    error_rate: number;
    support_tickets: number;
  };
}

// Usage: Rollout schedule
// Day 1: 5% (50 VIP customers) → Monitor error logs for 24h
// Day 2: 25% (500 customers) if no P0 bugs
// Day 3: 50% (2000 customers) if <1% error rate
// Day 4: 100% if metrics green
```

### Model 5: Operational Acceptance Test (OAT) Checklist (30 lines)

Run this AFTER UAT passes, before go-live. Verifies production readiness, not feature correctness.

```markdown
# OAT Checklist (Pre-Go-Live, 2h)

Infrastructure & Monitoring
- [ ] Alerts configured: Payment processor downtime, error rate >5%, latency >2s
- [ ] Logs aggregated (DataDog/Splunk) and searchable
- [ ] Database backups tested & restorable
- [ ] CDN/cache warmed; static assets pre-loaded

Performance Baseline
- [ ] Load test: 1000 concurrent checkouts; p95 latency <1s
- [ ] Peak traffic simulation (Black Friday 2x load); system stable
- [ ] Rollback plan documented & tested (0 data loss)

Data Integrity
- [ ] Order totals audit: sample 100 orders, match invoice → receipt
- [ ] Inventory sync: warehouse system reflects live counts
- [ ] Payment reconciliation: all transactions reconcile within 4h
- [ ] Customer accounts: no duplicate orders, refunds processed correctly

Security & Compliance
- [ ] PCI DSS: no credit card stored in logs, cards processed by Stripe/Adyen
- [ ] SSL certificate valid & pinned correctly
- [ ] Rate limiting on payment endpoint (prevent brute-force)
- [ ] CSRF tokens on forms

Go/No-Go Decision
- [ ] All checks pass: **GO LIVE** ✓
- [ ] 1–2 items yellow: **GO LIVE** with on-call support ready
- [ ] Any red items: **HALT** — fix before releasing
```

---

## UAT Sign-Off Checklist (6 Items)

Use this before releasing to production. Requires explicit stakeholder sign-off.

- **[MANUAL] Business Scenario Coverage**: All critical user journeys tested (checkout, refund, customer support flow, etc.); documented in UAT Plan
- **[MANUAL] Edge Cases Validated**: High-value orders, inventory races, payment holds, international customers all tested; results recorded
- **[MANUAL] Data Integrity Verified**: Order totals, inventory counts, customer accounts audited; no orphaned records
- **[MANUAL] Error Handling Observed**: Payment failures, service outages, timeout scenarios all show appropriate user messaging; no silent failures
- **[MANUAL] Stakeholder Sign-Off**: VP Product, Finance, Ops, Customer Support all approve release; signatures on UAT report
- **[OAT] Production Ready**: Monitoring, backups, rollback plan confirmed by DevOps; OAT checklist 100% green

---

## UAT Gate Decision Matrix

| Criterion | PASS | CONCERNS | FAIL |
|-----------|------|----------|------|
| **P0 Bugs** | 0 critical blockers | 0 | ≥1 critical blocker (payment silent failure, inventory corruption) |
| **P1 Bugs** | ≤3 non-blocking | 4–5, with mitigation plan | ≥6 or no mitigation plan |
| **Stakeholder Coverage** | All decision-makers tested & signed off | 1 person missing | Key stakeholder (VP Product, Finance) didn't participate |
| **Data Integrity** | Sample audit passes 100% | ≤2% discrepancies (< $100 impact) | ≥3% discrepancies OR orphaned transactions |
| **Performance** | p95 latency <1s under peak load | 1–2s (acceptable w/ alert) | >2s (system struggles under load) |

**Decision Rule**:
- **PASS**: All green → Release immediately
- **CONCERNS**: 1–2 yellow → Release with on-call engineer & monitoring
- **FAIL**: Any red → Halt, remediate, re-test UAT

---

## Integration Points

- **Refs**: test-levels-framework.md (UAT as system acceptance), risk-governance.md (UAT as risk mitigation gate)
- **Resume Validation Workflow**: resume-validation/step-04-narrative-coherence.md uses UAT principles for stakeholder review
- **Release Gate**: ADR-quality-readiness-checklist.md requires UAT sign-off before go-live approval

---

## Common Pitfalls

1. **Insufficient Stakeholder Involvement**: QA tests alone ≠ UAT; must include business owner, finance, ops
2. **Testing Only Happy Path**: Edge cases (refunds, bulk orders, fraud scenarios) often break in production
3. **Inadequate Time**: Squeezing UAT into 2 hours before release → 80% of issues missed
4. **No OAT**: Passing UAT doesn't guarantee production readiness (monitoring, backups, runbooks not verified)
5. **Ignoring UAT Findings**: Documenting issues but not prioritizing fixes before release → repeat failures
6. **Offline UAT**: Using test data only; real-world traffic patterns & data volumes often expose issues missed in sanitized environments

---

## Tools & Setup

- **Gherkin/BDD**: Cucumber.js, Playwright BDD
- **UAT Management**: TestRail, Zephyr, Azure Test Plans
- **Environment**: Production replica (masked PII, mock payment processor, production data snapshot)
- **Monitoring**: New Relic, DataDog, CloudWatch alerts during UAT
- **Sign-Off**: UAT Report spreadsheet + formal stakeholder emails

---

## Timeline Recommendations

| Phase | Duration | Participants |
|-------|----------|---------------|
| **UAT Planning** | 5 days | Product, Dev, QA, Finance, Ops |
| **UAT Execution** | 3–5 days | QA, Business Stakeholders, DevOps |
| **Issue Remediation** | 2–5 days | Dev, QA (for regression) |
| **OAT** | 2 hours | QA, DevOps |
| **Go-Live** | 1 hour | Product, DevOps, Support on-call |

**Total**: 2–3 weeks from UAT start to production release.

---

**Last Updated**: 2026-03-08 | **Standard**: ITIL v3 Acceptance Testing | **Review Every 6 Months**
