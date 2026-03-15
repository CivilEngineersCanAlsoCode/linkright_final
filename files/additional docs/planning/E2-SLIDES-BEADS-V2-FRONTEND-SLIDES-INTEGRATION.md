# E2 (Slides Integration) v2 - frontend-slides Real Integration Plan

**Date:** 2026-03-09
**Epic ID:** sync-2dc (replaces sync-ajq - archived)
**Library:** frontend-slides (https://github.com/zarazhangrui/frontend-slides)
**Status:** PLANNED - Ready for execution
**Total Issues:** 30 (1 Epic, 5 Features, 18 Tasks, 8 Subtasks)
**Dependencies Wired:** 14 edges
**Estimated Effort:** 40-60 hours (realistic with existing library)

---

## What Changed from v1 → v2

| Aspect | v1 (Stub) | v2 (Real Integration) |
|--------|-----------|----------------------|
| **frontend-slides** | Non-existent, to be built | Real library, fully featured |
| **API** | Speculated | Documented (zero dependencies, 12 styles) |
| **Output** | Unknown | Single HTML file (self-contained) |
| **Styles** | Custom design needed | 12 curated options (Dark Botanical best fit) |
| **Implementation** | From scratch (~100h) | Wrapper + adapter (~40-60h) |
| **Risk** | Very High | Low (proven library) |

---

## 5-Level Beads Hierarchy

### Level E: Epic (1)

```
sync-2dc [P0 EPIC]
└─ Release 3 E2: Slides Integration v2 (frontend-slides wrapper)
   └─ Leverages real frontend-slides Claude Code skill
   └─ Zero dependencies, production-ready output
   └─ 12 curated styles (Abyssal Depth: Dark Botanical)
```

### Level F: Features (5)

```
sync-2dc.1 [P0] ─→ FOUNDATION (understand & wrap frontend-slides)
  ↓ BLOCKS
sync-2dc.2 [P0] ─→ TRANSFORMER (ranked signals → slide content)
  ↓ BLOCKS
sync-2dc.3 [P0] ─→ STYLING (select & customize Abyssal Depth)
  ↓ (all block)
sync-2dc.4 [P1] ─→ INTEGRATION (portfolio workflow + embedding)
  ↓ BLOCKS
sync-2dc.5 [P1] ─→ TESTING (E2E, performance, accessibility)
```

### Level T: Tasks/User Stories (18)

**Feature 1 (Foundation):** 3 tasks
- Document API & input contract
- Create TypeScript wrapper function
- Test wrapper with sample data

**Feature 2 (Transformer):** 4 tasks
- Design slide content schema (5-slide structure)
- Implement signal→slide transformer
- Create frontend-slides prompt generator
- Validate output on test data

**Feature 3 (Styling):** 3 tasks
- Analyze 12 frontend-slides styles vs Abyssal Depth
- Create CSS override config if needed
- Test style integration end-to-end

**Feature 4 (Integration):** 3 tasks
- Add portfolio-deploy workflow steps (port-01b/01c)
- Embed generated HTML into portfolio View 2
- Update portfolio HTML template

**Feature 5 (Testing):** 5 tasks
- E2E testing on 10 sample profiles
- Performance optimization (<2sec target)
- Accessibility & responsive audit

### Level S: Subtasks (8)

- Analyze frontend-slides repo structure (F1)
- Implement Claude API invocation (F1)
- Add error handling & retries (F1)
- Map signals to slide sections (F2)
- Implement content extraction (F2)
- Build slide layout optimizer (F2)
- Create HTML sandbox container (F4)
- Implement responsive embedding (F4)

---

## Critical Path Execution Flow

```
START
  ↓
sync-2dc.1 [FOUNDATION] ← Must complete first
  ├─ 1.1: Document API
  ├─ 1.2: Create wrapper (blocks 1.3)
  │   ├─ 1.2.1: Analyze repo
  │   ├─ 1.2.2: Claude API invocation
  │   └─ 1.2.3: Error handling
  └─ 1.3: Test wrapper
  ↓ UNBLOCKS F2 & F4
  ├─→ sync-2dc.2 [TRANSFORMER] ← Parallel with F3
  │   ├─ 2.1: Design schema
  │   ├─ 2.2: Transformer (blocks 2.3)
  │   │   ├─ 2.2.1: Signal mapping
  │   │   ├─ 2.2.2: Content extraction
  │   │   └─ 2.2.3: Layout optimizer
  │   ├─ 2.3: Prompt generator (blocks 2.4)
  │   └─ 2.4: Validate output
  │
  └─→ sync-2dc.3 [STYLING] ← Parallel with F2
      ├─ 3.1: Analyze 12 styles
      ├─ 3.2: Create CSS overrides
      └─ 3.3: Test integration
      ↓
  sync-2dc.4 [INTEGRATION] ← All F1, F2, F3 must complete
  ├─ 4.1: Add workflow steps (blocks 4.2)
  ├─ 4.2: Embed HTML (blocks 4.3)
  │   ├─ 4.2.1: Sandbox container
  │   └─ 4.2.2: Responsive embedding
  └─ 4.3: Update HTML template
  ↓
  sync-2dc.5 [TESTING] ← Final validation
  ├─ 5.1: E2E testing (10 profiles)
  ├─ 5.2: Performance optimization
  └─ 5.3: Accessibility audit
  ↓
END (Release 3 E2 COMPLETE)
```

---

## Key Design Decisions

### 1. frontend-slides Library Choice
- ✓ Zero dependencies (single HTML file)
- ✓ 12 curated styles (no generic AI aesthetics)
- ✓ Production-ready code
- ✓ Customizable CSS
- **Best match:** Dark Botanical (closest to Abyssal Depth aesthetic)

### 2. Signal→Slides Mapping
- **Slide 1 (Hook):** Resume summary + JD alignment score
- **Slide 2 (Skills):** Top 3 domain skills with expertise level
- **Slide 3 (Projects):** 2-3 key projects with impact metrics
- **Slide 4 (Growth):** Career trajectory + recent evolution
- **Slide 5 (CTA):** Call-to-action (apply, connect, learn more)

### 3. Integration Strategy
- Wrapper function around frontend-slides skill (reusable)
- Portfolio-deploy workflow orchestration
- HTML embedded in portfolio View 2 ("Value Prop")
- Self-contained (no external resources)

### 4. Customization Approach
- Minimal CSS overrides (prefer Dark Botanical as-is)
- Custom color tokens if needed (aligns with Abyssal Depth palette)
- No JavaScript modification (preserve frontend-slides stability)

---

## Effort Breakdown

| Phase | Hours | Duration |
|-------|-------|----------|
| F1: Foundation | 10-12h | 1-2 days |
| F2: Transformer | 15-20h | 2-3 days |
| F3: Styling | 5-8h | 1 day |
| F4: Integration | 12-15h | 2 days |
| F5: Testing | 8-10h | 1-2 days |
| **TOTAL** | **40-60h** | **1-2 weeks** |

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|-----------|
| frontend-slides API changes | Low | Use specific version, monitor upstream |
| Claude API rate limits | Medium | Implement caching, exponential backoff |
| Generation time >2s | Medium | Profile early, optimize prompt engineering |
| Style customization needed | Low | Dark Botanical likely sufficient |
| Portfolio HTML compatibility | Low | Test on all major browsers + mobile |

---

## Success Criteria

✓ All 18 tasks COMPLETED
✓ 10 sample profiles tested (E2E)
✓ Generation time <2 seconds average
✓ WCAG AA accessibility compliance
✓ Responsive design: 320-1920px
✓ Abyssal Depth styling applied
✓ Zero production defects (smoke test passing)

---

## Next Steps

1. **Immediate (Day 1):**
   - Start sync-2dc.1.1 (Document API)
   - Fork/clone frontend-slides repo
   - Create wrapper skeleton

2. **Week 1:**
   - Complete F1 (foundation) - unblocks F2 & F3
   - Start F2 & F3 in parallel
   - Begin workflow integration planning

3. **Week 2:**
   - Complete F2 & F3
   - Execute F4 (integration)
   - Begin F5 (testing)

4. **Release Gate:**
   - All acceptance criteria met
   - 10 profiles tested & documented
   - Performance metrics validated
   - Sign-off from stakeholders

---

**Beads Epic ID:** sync-2dc
**Previous Plan (archived):** sync-ajq
**Library:** https://github.com/zarazhangrui/frontend-slides
**View Hierarchy:** `bd list --parent=sync-2dc --limit=0`

