# PLAN-09: Cross-Cutting Concerns Audit for Release 3 Enhancements

**Date**: 2026-03-07
**Scope**: CSS namespace conflicts, performance/accessibility, Release 3 finding integration, and risk assessment for all 4 planned enhancements
**Dependencies**: PLAN-01 (CV Template Audit), PLAN-02 (Beyond the Papers Audit), Release_3.md (52 findings)

---

## PLAN-09a: CSS Namespace Conflicts and JS Scope Isolation

### 1. Complete Class Collision Inventory

The CV template and Beyond the Papers template share **8 direct class name collisions**. These are classes that appear in both templates with conflicting CSS rules:

| Class Name | CV Template Usage | Beyond Papers Usage | Collision Severity |
|------------|-------------------|--------------------|--------------------|
| `.section` | Resume content sections (margin-bottom: 4mm, no padding) | Full-width page sections (padding: 60px top/bottom, background-color: #fff) | **CRITICAL** -- completely different layout semantics |
| `.header` | Resume header block (margin-top: 1mm, margin-bottom: 4mm, flex) | Not directly used, but `.heading` is -- low risk | **LOW** |
| `.container` | Not used in CV template | Webflow `.container.w-container` (max-width: 940px/1200px, centered) | **MEDIUM** -- CV could adopt this class in integration |
| `.nav-link` | Not used in CV template | `.nav-link.w-nav-link` (padding, color: #000) | **LOW** -- CV uses `.nav-item` |
| `.form` | Not used in CV template | `.form` (flex column) | **LOW** -- CV has no form |
| `.grid` | Not used in CV template | Webflow grid component | **LOW** |
| `.button` | Not used (CV uses `.btn-download`) | `.nav-link.button` (border-radius: 5px, bg: #6057c3) | **LOW** |
| `.body` | Used in universal reset only (`*`) | `.body` class (background: hsla(0,0%,100%,0.87), color: #333) | **MEDIUM** |

### 2. The `.section` Collision -- Detailed Analysis

This is the most dangerous collision. Both templates use `.section` extensively but with completely incompatible semantics:

**CV Template `.section` (line 283):**
```css
.section {
    margin-bottom: 4mm;
    /* Used within .page (A4-sized container) */
    /* Contains .section-title + .entry elements */
    /* Print-calibrated using millimeter units */
}
```
- Used 9 times in the CV (6 resume sections + 3 non-resume view sections)
- Always a child of `.page` (210mm x 297mm fixed container)
- Uses mm units, designed for print fidelity

**Beyond the Papers `.section` (Webflow CSS):**
```css
.section {
    padding-top: 60px;
    padding-bottom: 60px;
    /* Full-width page sections */
    /* Contains .container.w-container children */
}
.section.hero { padding-bottom: 10px; background-color: #fff; }
.section.main { /* 3D image grid host */ }
```
- Used 5+ times as full-width page layout sections
- Contains `.container.w-container` children
- Uses px units, designed for responsive web layout
- Has compound selectors: `.section.hero`, `.section.main`

**Impact if combined without namespacing:** Every CV `.section` element would inherit Beyond Papers' 60px padding, destroying the millimeter-precision print layout. Every Beyond Papers `.section` would inherit the 4mm margin-bottom, which is negligible but would lose its own padding. The `.section.hero` compound selector would not match CV elements (no `.hero` class), but the base `.section` rules would cascade destructively in both directions depending on stylesheet load order.

### 3. Additional Semantic Conflicts (Not Direct Name Collisions)

| Pattern | CV Template | Beyond Papers | Risk |
|---------|-------------|---------------|------|
| Universal reset | `* { margin: 0; padding: 0; box-sizing: border-box; }` | Webflow normalize (different reset philosophy) | **HIGH** -- two competing resets |
| Font stack | Roboto (Google Fonts via `<link>`) | Inter + DM Serif Display + Aubrey (via WebFont.load()) | **MEDIUM** -- two font loading mechanisms |
| Color variables | 20 CSS custom properties (`--md-sys-color-*`, `--brand-*`) | Zero CSS custom properties (all hardcoded) | **STRATEGIC** -- theming system must reconcile |
| Layout model | Fixed sidebar + A4 page containers | Full-width sections + Webflow grid | **HIGH** -- fundamentally different layout paradigms |
| Z-index usage | `.sidebar { z-index: 1000 }` | `.navbar { z-index: 1000 }` (Webflow base) | **CRITICAL** -- z-index collision at same value |
| Animation | CSS `@keyframes fadeIn` on `.view-container` | Webflow IX2 runtime with inline `transform` styles | **MEDIUM** -- different animation systems |

### 4. JavaScript Scope Analysis

**CV Template JS:**
- Single global function: `switchView(viewId)` (14 lines)
- Called via inline `onclick` attributes
- Queries `.nav-item` and `.view-container` classes
- No module system, no IIFE, no closures
- `window.print()` call on download button

**Beyond the Papers JS Requirements (after Webflow stripping):**
- IntersectionObserver for scroll-triggered timeline color changes (replaces IX2)
- CSS `@keyframes` or GSAP for infinite carousel (replaces IX2)
- CSS `:hover` transitions for project card glow (replaces IX2)
- Custom hamburger menu toggle (replaces Webflow nav component)
- Lottie-web for success animation playback
- Optional: scroll-driven 3D parallax for image grid

**Scope Conflicts:**
| Risk | Description |
|------|-------------|
| `switchView` global pollution | `switchView` is on `window` scope. Beyond Papers JS would add more globals unless modularized. |
| `.nav-item` selector collision | `switchView` uses `document.querySelectorAll('.nav-item')` -- if Beyond Papers has `.nav-item` elements in its navbar, they would be incorrectly toggled. |
| jQuery dependency | Beyond Papers currently uses jQuery 3.5.1. CV template has zero jQuery. Adding jQuery for one section bloats the bundle. |
| `will-change` property overuse | Beyond Papers applies `will-change: transform` to 15+ elements inline. Combined with CV's animations, this could exhaust GPU compositor layers. |

### 5. Recommended Namespacing Strategy

**Recommendation: Prefix Convention (not BEM, not CSS Modules)**

Rationale: BEM is verbose and would require rewriting both templates. CSS Modules require a build step that this project does not have (single-file HTML SPA). A prefix convention is the lowest-friction approach.

**Prefix Scheme:**
```
CV template classes:        lr-cv-*     (e.g., lr-cv-section, lr-cv-header, lr-cv-page)
Beyond Papers classes:      lr-btp-*    (e.g., lr-btp-section, lr-btp-hero, lr-btp-qualities)
Shared/global classes:      lr-*        (e.g., lr-container, lr-nav, lr-theme)
Theming system variables:   --lr-*      (e.g., --lr-color-primary, --lr-font-heading)
```

**Implementation Steps:**
1. Wrap each template in a scoped container:
   - CV: `<div class="lr-cv-scope">` wraps all CV content
   - Beyond Papers: `<div class="lr-btp-scope">` wraps all BTP content
2. Use descendant selectors for scoping without renaming every class:
   - `.lr-cv-scope .section { margin-bottom: 4mm; }` (CV rules)
   - `.lr-btp-scope .section { padding: 60px 0; }` (BTP rules)
3. Extract shared tokens to `--lr-*` CSS custom properties
4. Wrap all JS in an IIFE or ES module to prevent global pollution:
   ```javascript
   const LinkrightCV = (() => {
       function switchView(viewId) { /* ... */ }
       return { switchView };
   })();
   ```

**CSS Specificity Budget:**
| Layer | Specificity | Purpose |
|-------|-------------|---------|
| Reset | `* {}` (0,0,0) | Box-sizing, margin reset |
| Tokens | `:root {}` (0,1,0) | CSS custom properties |
| Scoped layout | `.lr-cv-scope .section` (0,2,0) | Template-specific rules |
| Component | `.lr-cv-scope .section-title` (0,2,0) | Component-level rules |
| State | `.lr-cv-scope .nav-item.active` (0,3,0) | Interactive states |
| Print override | `@media print { ... !important }` | Print-only overrides |

This keeps all non-print rules at specificity 0,2,0 or 0,3,0, avoiding escalation wars.

---

## PLAN-09b: Performance, Accessibility, and Mobile Responsiveness

### 1. Combined Template Size Estimate

| Asset | CV Template | Beyond Papers | Combined |
|-------|-------------|---------------|----------|
| HTML structure | ~17 KB | ~25 KB | ~42 KB |
| Inline CSS | ~12 KB (lines 8-301) | N/A (external) | ~12 KB |
| External CSS | ~45 KB (Google Fonts declarations) | ~85 KB (Webflow CSS) + ~45 KB (Google Fonts) | ~175 KB |
| Base64 profile photo | ~620 KB | N/A | ~620 KB |
| External images | 0 | 6 images (~200-400 KB each, estimated ~1.8 MB total) | ~1.8 MB |
| GIF animation | 0 | 1 hero GIF (estimated ~500 KB-2 MB) | ~1 MB |
| JavaScript | 0.5 KB (switchView) | ~90 KB (jQuery) + ~150 KB (Webflow runtime) + ~80 KB (lottie-web) | ~320 KB JS |
| Lottie JSON | 0 | ~50 KB (success animation) | ~50 KB |
| **Subtotal** | **~695 KB** | **~2.4 MB** | **~3.0 MB** |

**Total estimated combined template size: ~3.0 MB** (before optimization)

### 2. Core Web Vitals Impact Assessment

#### Largest Contentful Paint (LCP)
| Factor | Impact | Severity |
|--------|--------|----------|
| 620 KB base64 profile photo | Blocks initial render (inline in HTML, decoded synchronously) | **CRITICAL** |
| Hero GIF (~1 MB) from Beyond Papers | Large LCP candidate if visible in viewport | **HIGH** |
| No lazy loading on any images | All 6+ Beyond Papers images load eagerly | **MEDIUM** |
| Google Fonts blocking render | Both templates load fonts synchronously | **MEDIUM** |
| **Estimated LCP**: 3.5-5.0 seconds on 4G | Target: < 2.5s | **FAILING** |

**Recommendations:**
1. Convert base64 profile photo to external WebP file (~50 KB at quality 85) -- saves ~570 KB and enables browser caching
2. Add `loading="lazy"` to all below-fold images
3. Preload the LCP image: `<link rel="preload" as="image" href="profile.webp">`
4. Convert hero GIF to WebM video with `<video autoplay muted loop>` (typically 80% smaller)
5. Use `font-display: swap` (already present in CV template Google Fonts CSS, verify for Beyond Papers)

#### Cumulative Layout Shift (CLS)
| Factor | Impact | Severity |
|--------|--------|----------|
| CV template: fixed layout (A4 page) | No shift risk within CV views | **NONE** |
| Beyond Papers: images without dimensions | `.image-17.astar` has explicit width/height -- low risk | **LOW** |
| Font loading (3 families) | FOUT flash when DM Serif Display, Inter, Aubrey load | **MEDIUM** |
| Webflow IX2 transform animations | Inline transforms set initial state, preventing shift | **LOW** |
| View switching (display: none/block) | Content reflow on view change (no transition) | **LOW** |
| **Estimated CLS**: 0.05-0.15 | Target: < 0.1 | **BORDERLINE** |

**Recommendations:**
1. Add `font-display: optional` for decorative font (Aubrey) to prevent late swap
2. Reserve space for hero GIF with explicit `width`/`height` or `aspect-ratio`
3. Add `contain: layout` to `.view-container` to isolate reflow

#### First Input Delay / Interaction to Next Paint (FID/INP)
| Factor | Impact | Severity |
|--------|--------|----------|
| CV template JS: 14 lines, no heavy computation | Near-zero blocking | **NONE** |
| jQuery: ~90 KB parse + execute | Blocks main thread 50-100ms on mobile | **MEDIUM** |
| Webflow runtime: ~150 KB parse + execute | Blocks main thread 80-150ms on mobile | **HIGH** |
| IntersectionObserver (replacement for IX2) | Non-blocking, async | **NONE** |
| **Estimated INP**: 150-300ms with jQuery+Webflow, <100ms without | Target: < 200ms | **AT RISK** |

**Recommendations:**
1. Eliminate jQuery entirely -- replace with vanilla JS (document.querySelector, classList, fetch)
2. Replace Webflow runtime with lightweight IntersectionObserver + CSS animations
3. Defer all non-critical JS: `<script defer>`
4. Target JS budget: < 50 KB total (switchView + IntersectionObserver + carousel + hamburger)

### 3. Accessibility Audit

#### CV Template
| Check | Status | Detail |
|-------|--------|--------|
| `lang` attribute | YES | `<html lang="en">` |
| ARIA landmarks | **NO** | `<aside>` is implicit complementary, `<main>` is implicit main, but `<nav>` wraps non-anchor divs |
| Focus management | **NO** | `.nav-item` divs have `onclick` but no `tabindex`, `role="button"`, or keyboard handlers |
| Color contrast | **PARTIAL** | `--brand-blue` (#4285F4) on white: 3.26:1 ratio (FAILS WCAG AA for normal text, passes for large text) |
| Skip navigation | **NO** | No skip link to main content |
| Print accessibility | N/A | Print is visual medium |
| Semantic headings | **NO** | No `<h1>`-`<h6>` in CV template (all `<div>` with class names) |
| Alt text for images | **NO** | Profile photo `<img>` has no `alt` attribute |

#### Beyond the Papers Template
| Check | Status | Detail |
|-------|--------|--------|
| `lang` attribute | YES | Inherited from `<html>` |
| ARIA landmarks | **YES** | `role="banner"` on navbar, `role="navigation"` on nav, `role="button"` on menu button, `aria-label` on brand link |
| Focus management | **PARTIAL** | Menu button has `tabindex="0"`, `aria-controls`, `aria-haspopup`, `aria-expanded` |
| Color contrast | **FAILING** | `.qualities` gradient text on white: unverifiable (gradient background-clip text). `.text-block` rgba(0,0,0,0.7) on white: ~4.3:1 (passes AA for normal text) |
| Skip navigation | **NO** | No skip link |
| Semantic headings | **YES** | Uses `<h1>`, `<h2>`, `<h3>` appropriately |
| Alt text for images | **NO** | Hero GIF, project images, company logos lack meaningful alt text |
| Form labels | **YES** | All form inputs have associated `<label>` elements with `for` attributes |

#### Combined Accessibility Recommendations

| Priority | Fix | Effort |
|----------|-----|--------|
| P0 | Add `alt` attributes to all images (profile photo, hero GIF, project screenshots, company logos) | Low |
| P0 | Add `tabindex="0"`, `role="button"`, and `onkeydown` (Enter/Space) to CV `.nav-item` elements | Low |
| P1 | Add skip navigation link: `<a href="#main-content" class="skip-link">Skip to content</a>` | Low |
| P1 | Fix color contrast: `--brand-blue` needs to darken to #2A6CC7 (~4.6:1) or use on dark backgrounds only | Low |
| P1 | Add semantic heading hierarchy to CV template (h1 for name, h2 for section titles) | Medium |
| P2 | Add `aria-current="page"` to active nav items | Low |
| P2 | Add `prefers-reduced-motion` media query to disable carousel and 3D transforms | Low |

### 4. Mobile Responsiveness Strategy

#### Current State

**CV Template: Desktop-Only**
- Fixed 300px sidebar (`position: fixed, height: 100vh`)
- A4 page container (210mm x 297mm) with `overflow: hidden`
- No `@media` queries except `@media print`
- No responsive breakpoints whatsoever
- On mobile: sidebar covers entire viewport, page scrolls horizontally

**Beyond the Papers: Fully Responsive**
- 4 breakpoints: 1920px+, 991px, 767px, 479px
- Hamburger nav at 991px
- Grid layouts collapse to single column at 479px
- Font sizes scale down at each breakpoint
- `.selected-projects-list` switches from `grid` to `block` at 479px

#### Recommended Combined Responsive Strategy

**Option A (Recommended): Progressive Disclosure with Breakpoint Alignment**

The combined template should use 4 breakpoints aligned with Beyond Papers' Webflow defaults:

| Breakpoint | CV Behavior | Beyond Papers Behavior |
|------------|-------------|----------------------|
| >= 1200px (Desktop) | Full sidebar + A4 page view (current behavior) | Desktop grid layouts, full animations |
| 992px-1199px (Tablet Landscape) | Sidebar collapses to icon-only rail (60px) | Nav hamburger activates |
| 768px-991px (Tablet Portrait) | Sidebar becomes top horizontal nav bar | Reduced padding, smaller fonts |
| <= 767px (Mobile) | Bottom tab bar navigation (4 icons) | Single column, minimal animations |

**Key responsive adaptations for CV template:**
```css
/* Tablet: sidebar becomes icon rail */
@media (max-width: 1199px) {
    .lr-cv-scope .sidebar {
        width: 60px;
        padding: 10px;
    }
    .lr-cv-scope .nav-label,
    .lr-cv-scope .nav-subtext { display: none; }
    .lr-cv-scope .main-content { margin-left: 60px; }
}

/* Mobile: sidebar becomes bottom tab bar */
@media (max-width: 767px) {
    .lr-cv-scope .sidebar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: auto;
        width: 100%;
        flex-direction: row;
        z-index: 1000;
    }
    .lr-cv-scope .nav-list { flex-direction: row; }
    .lr-cv-scope .main-content { margin-left: 0; margin-bottom: 60px; }
    .lr-cv-scope .page {
        width: 100vw;
        height: auto;
        overflow: visible;
    }
}
```

**A4 Page Handling on Mobile:**
The A4 fixed-dimension page (210mm x 297mm) is fundamentally incompatible with mobile viewports. Options:
1. **Pinch-to-zoom (simplest):** Keep A4 page, allow user to zoom. Add `<meta name="viewport" content="width=device-width, initial-scale=0.5">` for the resume view.
2. **Reflow (best UX):** On mobile, remove fixed dimensions and let content reflow naturally. Preserve A4 layout only for print.
3. **Hybrid (recommended):** Show a reflowed "mobile resume" view on small screens, but the print/download button always produces the A4 PDF version.

### 5. Performance Optimization Summary

| Optimization | Size Saved | Effort |
|-------------|-----------|--------|
| Base64 photo to external WebP | ~570 KB | Low |
| Hero GIF to WebM video | ~500 KB-1.5 MB | Low |
| Strip jQuery + Webflow runtime | ~240 KB JS | Medium (requires vanilla JS rewrites) |
| Lazy-load below-fold images | ~1.2 MB deferred | Low |
| Consolidate Google Fonts to single `<link>` | ~20 KB | Low |
| Tree-shake Webflow CSS (remove hidden timelines, utility pages) | ~30 KB | Medium |
| **Total potential savings** | **~2.5 MB (83% reduction)** | |
| **Optimized combined size** | **~500 KB initial, ~1.5 MB total** | |

---

## PLAN-09c: Integration Map with 52 Release 3 Audit Findings

### 1. Findings Directly Addressed by the 4 Enhancements

The 4 enhancements are:
- **E1**: Cover Letter (populate View 3 "Strategic Fit / Why Company?")
- **E2**: Slides Integration (populate View 2 "Value Prop / Why Me?" with frontend-slides skill output)
- **E3**: Beyond the Papers (populate View 4 "Beyond the Papers" with the BTP template content)
- **E4**: Theming System (parameterize all colors, fonts, and brand tokens)

| Finding | Description | Enhancement | How Addressed |
|---------|-------------|-------------|---------------|
| F-08 | sync-publicist missing rules section | **E1** | Cover letter enhancement requires defining publicist rules for cover letter generation |
| F-19 | 2 stub templates (social-post, shipment) | **E1** (indirect) | Cover letter work establishes template quality standards that expose stub templates |
| F-21 | BMAD branding in test-design-handoff template | **E4** | Theming system work would audit all brand references |
| F-35 | Agent display names collide across files | **E4** (indirect) | Theming/branding audit naturally surfaces naming inconsistencies |
| F-39 | Memory sidecar instructions use original names | **E4** (indirect) | Same as F-35 |

### 2. Findings That Become MORE Critical with Enhancements

| Finding | Severity | Why It Escalates | Affected Enhancement |
|---------|----------|------------------|---------------------|
| **F-09** (P0) | **ESCALATES** | Phantom `_bmad` paths in 60+ files will break any new workflow that references templates or instructions. The portfolio-deploy workflow (which hosts these enhancements) may reference `_bmad` paths. | ALL |
| **F-10** (P0) | **ESCALATES** | Missing workflow.xml execution engine. If portfolio-deploy workflow needs the engine for template population steps, its absence blocks all 4 enhancements. | ALL |
| **F-17** (P2) | **ESCALATES to P1** | content-automation template name mismatch. If the cover letter or slides integration uses content-automation workflow for generation, the template reference will fail. | E1, E2 |
| **F-16** (P2) | **ESCALATES to P1** | resume-validation broken template reference. Enhancements add more content that needs validation (cover letter, slides, BTP). The broken validation workflow cannot validate any of it. | E1, E2, E3 |
| **F-30** (P2) | **ESCALATES** | All command stubs reference non-existent `antigravity` CLI. If new enhancement workflows need CLI invocation (e.g., `antigravity run portfolio-deploy`), nothing works. | ALL |
| **F-32** (P2) | **ESCALATES** | installer/sync.js is non-functional. If enhancements need sync capabilities to pull slide decks or BTP content, the sync pipeline stub blocks this. | E2, E3 |
| **F-01/F-02** (P0) | **UNCHANGED** but relevant | CIS/TEA stub agents. The "Beyond the Papers" section (E3) could benefit from CIS narrative-craft capabilities. If CIS agents are stubs, the narrative quality suffers. | E3 |
| **F-22/F-23** (P1) | **UNCHANGED** but relevant | CIS/TEA missing from manifests. Even if CIS narrative-craft is used for E3, the module is unregistered and would not be discoverable. | E3 |

### 3. Findings That Conflict with Enhancements

| Finding | Enhancement | Conflict Description |
|---------|-------------|---------------------|
| F-09 (phantom paths) | ALL | New template files created for enhancements must use `_lr/` paths. But if existing workflows they depend on still use `_bmad/` paths, the integration chain is broken. **F-09 MUST be resolved before enhancement work begins.** |
| F-35 (name collisions) | E4 (Theming) | The theming system needs to reference agents consistently. If "Cora" in one file is "Stella" in another, the theme configuration cannot reliably target agent-specific branding. |
| F-20 (template naming) | E1, E2, E3 | New templates created for enhancements should use `.template.md` convention. But 7 existing templates use `-template.md`. Enhancement work will create inconsistency unless F-20 is resolved first or enhancement templates deliberately follow the correct convention. |

### 4. Findings That Are Independent of Enhancements

The following findings are unaffected by the 4 enhancements and can be prioritized independently:

- F-03 (sync-narrator persona), F-04 (missing sidecars), F-05 (Atlas/Ledger desync)
- F-06/F-07 (squick agent rules/menu items)
- F-11 (advanced-elicitation), F-12 (workflow builder), F-13 (TEA workflows), F-14 (sprint lifecycle)
- F-15 (squick/2-plan instructions), F-18 (brain-methods.csv)
- F-24-F-28 (memory/config issues)
- F-29, F-31, F-33, F-34 (IDE/installer issues)
- F-36, F-37, F-38, F-40 (help/task issues)

### 5. Recommended Resolution Order

```
PHASE 0 (Prerequisites -- resolve BEFORE enhancement work):
  F-09  Global _bmad → _lr path rewrite
  F-10  Port workflow.xml execution engine
  F-20  Standardize template naming to .template.md

PHASE 1 (Enhancement E1 -- Cover Letter):
  F-08  Add rules to sync-publicist (needed for cover letter generation)
  F-17  Fix content-automation template reference

PHASE 2 (Enhancement E2 -- Slides Integration):
  No direct finding dependencies, but F-09/F-10 must be done.

PHASE 3 (Enhancement E3 -- Beyond the Papers):
  F-22  Register CIS in manifest (narrative-craft workflow is used)
  F-01  Replace CIS stub agents (optional: improves narrative quality)

PHASE 4 (Enhancement E4 -- Theming System):
  F-35  Unify agent display names (theming needs consistent naming)
  F-21  Remove BMAD branding from templates
  F-39  Update sidecar instruction names

PARALLEL (Independent, do anytime):
  All other findings per existing priority.
```

---

## PLAN-09d: Risk Assessment for Each Enhancement

### Enhancement 1: Cover Letter (View 3 -- "Strategic Fit / Why Company?")

**Description:** Populate the currently-placeholder View 3 with a dynamically generated cover letter, personalized per target company using the `--target-company-name` CSS variable and sync-publicist agent output.

#### Technical Risk: LOW
| Factor | Assessment |
|--------|-----------|
| Complexity | Low -- the view container and header already exist, only body content needs injection |
| Unknowns | Minimal -- the injection pattern is identical to existing resume content |
| HTML structure | Simple: replace 1px placeholder image and paragraph with formatted cover letter text |
| CSS requirements | Reuse existing `.section`, `.section-title` classes. May need new `.cover-letter-body` class for letter-specific typography (salutation, body, closing) |
| Print impact | Moderate -- currently only resume prints. Cover letter needs its own print route (`#whygoogle-view { display: block !important }` when user requests cover letter PDF) |

#### Integration Risk: LOW-MEDIUM
| Factor | Assessment |
|--------|-----------|
| sync-publicist dependency | **F-08 (P2)**: publicist has no rules section. Cover letter generation quality depends on having outreach/cover letter rules. **Must fix F-08 first.** |
| Template format | The cover letter needs a `.template.md` file in the portfolio-deploy workflow templates directory |
| Company name injection | Already works via CSS `var(--target-company-name)` on `.company-name::after` pseudo-elements. The mechanism is proven. |
| View ID hardcoding | The view ID is `whygoogle-view` and nav ID is `nav-whygoogle` -- both hardcoded to "google". For company-agnostic naming, these should become `whycompany-view` and `nav-whycompany`. |

#### Dependency Risk: LOW
| Factor | Assessment |
|--------|-----------|
| External dependencies | None. Cover letter is text content injected into existing HTML structure. |
| Agent dependencies | sync-publicist agent must be functional with proper rules (F-08) |
| Workflow dependencies | portfolio-deploy workflow is complete (Release 3 audit confirms this) |

#### Scope Risk: MEDIUM
| Factor | Assessment |
|--------|-----------|
| Feature creep vectors | Multiple cover letter versions per company; A/B testing of cover letter variants; PDF attachment generation; mail-merge integration |
| Containment strategy | Fix scope to: one cover letter per deployment, text-only (no images), uses existing CSS typography, single-page A4 print format |

#### Risk Mitigations
1. Fix F-08 (sync-publicist rules) before starting
2. Rename `whygoogle` to `whycompany` in HTML IDs as part of this enhancement
3. Define cover letter template schema upfront (salutation, 3-4 paragraphs, closing, signature)
4. Add `@media print` rule for cover letter view (separate from resume print)

---

### Enhancement 2: Slides Integration (View 2 -- "Value Prop / Why Me?")

**Description:** Populate View 2 with output from the `frontend-slides` skill, embedding presentation slides that make the "Why Me?" value proposition case.

#### Technical Risk: HIGH
| Factor | Assessment |
|--------|-----------|
| Complexity | High -- slides are a fundamentally different content type than text. Embedding a slide deck in an HTML view requires either an iframe, a JS slide renderer, or static image snapshots. |
| Unknowns | **Critical**: What is the output format of `frontend-slides`? If it produces standalone HTML, it needs iframe isolation. If it produces images, they need a carousel. If it produces reveal.js/impress.js slides, the entire runtime must be embedded. |
| HTML structure | The view container exists but is designed for single-page A4-like content, not widescreen slides. Aspect ratio mismatch (A4 is 1:1.414 portrait, slides are typically 16:9 landscape). |
| CSS requirements | New slide container class with forced 16:9 aspect ratio. Potentially `.slide-embed { aspect-ratio: 16/9; width: 100%; }` with navigation controls (prev/next). |
| Print impact | Slides are inherently multi-page. Printing all slides would require one slide per page, breaking the single-page paradigm. |

#### Integration Risk: HIGH
| Factor | Assessment |
|--------|-----------|
| View container mismatch | The `.page` container is 210mm x 297mm (A4 portrait). Slides are landscape. Either the page must rotate, or the slide must be letterboxed within the portrait container. |
| Navigation conflict | If slides have their own prev/next navigation, it conflicts with the sidebar nav concept. The user would have two navigation systems (sidebar for views, slide controls for slides within a view). |
| Iframe isolation | If slides are embedded via iframe, they cannot share CSS variables with the host template. Theming (E4) would not penetrate the iframe boundary. |
| `switchView` impact | The function hides all views and shows one. If the slide view has its own internal state (current slide number), switching away and back would reset it unless state is preserved. |

#### Dependency Risk: CRITICAL
| Factor | Assessment |
|--------|-----------|
| `frontend-slides` skill | **External dependency with undefined interface.** No documentation exists in the audited files about the output format, API, or integration contract of this skill. This is the single largest risk across all enhancements. |
| Slide renderer | If slides need a runtime (reveal.js ~300KB, impress.js ~100KB), this significantly impacts the performance budget. |
| Content pipeline | How are slides generated? Does the user author them? Does an agent generate them? Is there a workflow? None of this is defined. |

#### Scope Risk: CRITICAL
| Factor | Assessment |
|--------|-----------|
| Feature creep vectors | Slide editing within the portfolio; animation/transition customization; speaker notes; slide thumbnails in sidebar; auto-play mode; export to PowerPoint |
| Containment strategy | Fix scope to: static embed of pre-generated slides (no editing), max 10 slides, image-based rendering (not live HTML slides), simple prev/next controls |

#### Risk Mitigations
1. **Define the `frontend-slides` output contract first.** Before any implementation, document: output format (HTML/images/PDF), file location, naming convention, metadata schema.
2. Prefer image-based slide embedding (screenshot each slide as WebP) over live HTML embedding. This eliminates iframe/CSS isolation issues and keeps the performance budget intact.
3. Build a simple slide carousel component:
   ```html
   <div class="lr-cv-slide-carousel">
       <img class="lr-cv-slide active" src="slide-01.webp" alt="Slide 1">
       <img class="lr-cv-slide" src="slide-02.webp" alt="Slide 2">
       <div class="lr-cv-slide-controls">
           <button class="lr-cv-slide-prev">Previous</button>
           <span class="lr-cv-slide-counter">1 / 5</span>
           <button class="lr-cv-slide-next">Next</button>
       </div>
   </div>
   ```
4. For print: render all slides as a vertical stack (one per page) using `@media print` with `page-break-after: always`.
5. Do NOT embed a slide runtime (reveal.js, etc.). The performance cost is not justified for a portfolio view.

---

### Enhancement 3: Beyond the Papers (View 4 -- Personal Narrative)

**Description:** Populate View 4 with content adapted from the "Beyond the Papers" Webflow template, including the hero section, rotating qualities carousel, 3D image grid, animated timeline, project cards, and experience section.

#### Technical Risk: HIGH
| Factor | Assessment |
|--------|-----------|
| Complexity | High -- the BTP template has 6 distinct visual components, each with complex CSS (3D transforms, gradients, scroll-driven animations). Extracting and integrating these into the CV template's A4 page container is a major undertaking. |
| Unknowns | Webflow IX2 animation behavior after stripping: will IntersectionObserver replacements match the visual quality? Will 3D perspective transforms work inside a constrained container? |
| HTML structure | The BTP template is a full-page scrolling site. The CV template's View 4 is a single `<div class="page">` (210mm x 297mm). **The BTP content cannot fit in a single A4 page.** This is a fundamental architectural mismatch. |
| CSS requirements | All BTP CSS must be namespaced (see PLAN-09a). The `.section` collision is particularly dangerous here since both templates use it extensively. |
| Animation requirements | 4 separate animation systems to reimplement: carousel infinite scroll, 3D parallax image grid, timeline scroll-triggered color changes, project card hover glow. |

#### Integration Risk: CRITICAL
| Factor | Assessment |
|--------|-----------|
| **A4 page constraint** | The CV template confines each view to a 210mm x 297mm `overflow: hidden` container. The BTP template is a scrolling website with 2000+ px of content height. Either the page constraint must be removed for View 4, or the BTP content must be radically condensed. |
| Scroll behavior | The CV template has no scroll within views (each view is exactly one A4 page). BTP's timeline and project sections depend on scroll. If View 4 allows scrolling, it breaks the one-page-per-view paradigm. |
| Font loading | BTP requires 3 font families (Inter, DM Serif Display, Aubrey). CV uses Roboto. Combined: 4 families, ~8 weights. This adds significant font loading time. |
| jQuery dependency | BTP currently requires jQuery. Removing it requires rewriting Webflow nav and form handling in vanilla JS. |
| CSS variable gap | BTP has zero CSS custom properties. CV has 20. The theming system (E4) must reconcile this gap before BTP content can be themed. |

#### Dependency Risk: MEDIUM
| Factor | Assessment |
|--------|-----------|
| Webflow stripping | Must strip Webflow runtime, jQuery, reCAPTCHA, GTM, and all `data-w-id` attributes. This is a one-time but error-prone process. |
| Image assets | BTP's 6 images + 1 GIF need to be hosted. Currently they reference Webflow CDN URLs that may become unavailable. |
| Lottie-web | ~80 KB library for the success animation. May not be worth including if the contact form is stripped. |
| CIS narrative-craft | If the BTP personal narrative is generated by the CIS module, F-01 (CIS stub agents) and F-22 (CIS unregistered) must be resolved first. |

#### Scope Risk: CRITICAL
| Factor | Assessment |
|--------|-----------|
| Feature creep vectors | Full BTP website as a sub-app within the portfolio; contact form with backend; dynamic project loading from a CMS; blog integration; social media feeds |
| Containment strategy | **Strip to essentials:** hero heading + qualities carousel + 3-4 static project cards + timeline (static, no scroll animation). Remove: contact form, hidden timelines, password page, Lottie animation, 3D image grid parallax. |

#### Risk Mitigations
1. **Do NOT attempt to embed the full BTP template in an A4 page.** Instead, design a "Beyond the Papers" experience specifically for the portfolio view:
   - Short hero statement (name + rotating qualities)
   - 3-4 project highlight cards (static grid, no hover glow)
   - Condensed timeline (3-5 key milestones, no scroll animation)
2. **Remove the A4 page constraint for View 4.** Make it a scrollable view with `overflow-y: auto` instead of `overflow: hidden`. This breaks the single-page paradigm but is necessary for BTP content.
3. **Implement BTP CSS under `.lr-btp-scope` namespace** to prevent all `.section` collisions (see PLAN-09a).
4. **Self-host all images** and convert to WebP format. Do not rely on Webflow CDN URLs.
5. **Skip Lottie** -- the success animation is for a contact form that should be a simple `mailto:` link in the portfolio context.
6. **Skip jQuery** -- rewrite the hamburger menu (not needed in portfolio context since CV has its own sidebar nav) and form handling (contact form removed) in vanilla JS.

---

### Enhancement 4: Theming System (CSS Variable Parameterization)

**Description:** Create a comprehensive CSS custom property system that allows brand-specific theming of the entire combined template through a single `:root` configuration block.

#### Technical Risk: MEDIUM
| Factor | Assessment |
|--------|-----------|
| Complexity | Medium -- the CV template already has 20 CSS custom properties with a well-designed token hierarchy. The work is extending this to cover BTP's hardcoded colors and adding new tokens. |
| Unknowns | How many of BTP's ~50 unique color values (see PLAN-02f) can be mapped to a reasonable number of tokens? The CV uses a 4-color brand system; BTP uses gradients with 3+ color stops each. |
| CSS architecture | The CV's Material Design 3 token naming (`--md-sys-color-*`) is a good foundation but may need extension for BTP's decorative gradients and accent colors. |
| Gradient theming | BTP uses 6 distinct gradient definitions. Theming gradients via CSS variables requires `--gradient-start`, `--gradient-end` variable pairs, which multiplies the variable count. |

#### Integration Risk: MEDIUM
| Factor | Assessment |
|--------|-----------|
| CV hardcoded colors | PLAN-01 identified 6 hardcoded hex values that bypass the variable system (#202124, #5F6368, #DADCE0, #E0E0E0, rgba(66,133,244,0.08), white). These must be converted to variables. |
| BTP has zero variables | Every single color in BTP is hardcoded. Full variable extraction is needed: ~50 color values to map to ~20-25 semantic tokens. |
| Print color preservation | The `* { -webkit-print-color-adjust: exact; }` rule must continue to work with variable-defined colors. |
| Dark mode potential | If the theming system is designed well, it enables dark mode as a future feature. But this adds complexity to the initial implementation. |

#### Dependency Risk: LOW
| Factor | Assessment |
|--------|-----------|
| External dependencies | None. Pure CSS work with no external libraries. |
| Enhancement dependencies | **E4 should be done LAST** (or at least after E3). The theming system needs to know the full scope of what it's theming -- if E3 adds BTP content, those colors need to be in the variable system too. |
| BMAD dependency | None. Theming is entirely within the portfolio template scope. |

#### Scope Risk: HIGH
| Factor | Assessment |
|--------|-----------|
| Feature creep vectors | Theme editor UI; multiple preset themes; dark/light mode toggle; per-section color overrides; user-selectable accent colors; theme export/import; CSS-in-JS migration |
| Containment strategy | Fix scope to: one `:root` block with ~30-35 variables covering colors (12), typography (8), spacing (5), gradients (6), page dimensions (4). No runtime theme switching. No UI. No dark mode. |

#### Risk Mitigations
1. **Design the token taxonomy before implementation.** Proposed structure:
   ```css
   :root {
       /* Identity */
       --lr-company-name: "Company";

       /* Brand Colors (4-slot system from CV) */
       --lr-brand-1: #4285F4;
       --lr-brand-2: #EA4335;
       --lr-brand-3: #FBBC05;
       --lr-brand-4: #34A853;

       /* Semantic Colors (MD3-inspired) */
       --lr-color-primary: var(--lr-brand-1);
       --lr-color-surface: #F8F9FA;
       --lr-color-surface-dim: #F1F3F4;
       --lr-color-on-surface: #1F1F1F;
       --lr-color-on-surface-muted: #444746;
       --lr-color-outline: #C4C7C5;
       --lr-color-accent-bg: #D3E3FD;
       --lr-color-accent-text: #041E49;
       --lr-color-page-bg: #FFFFFF;

       /* BTP-specific */
       --lr-btp-accent: #6057c3;
       --lr-btp-gradient-start: #ff512f;
       --lr-btp-gradient-end: #dd2476;
       --lr-btp-timeline-start: #833ab4;
       --lr-btp-timeline-mid: #fd1d1d;
       --lr-btp-timeline-end: #fcb045;

       /* Typography */
       --lr-font-heading: 'Roboto', sans-serif;
       --lr-font-body: 'Inter', sans-serif;
       --lr-font-display: 'DM Serif Display', serif;
       --lr-font-accent: 'Aubrey', sans-serif;
       --lr-font-size-hero: 48px;
       --lr-font-size-name: 20pt;
       --lr-font-size-heading: 13pt;
       --lr-font-size-body: 9.5pt;
       --lr-font-size-small: 9pt;

       /* Spacing */
       --lr-sidebar-width: 300px;
       --lr-page-width: 210mm;
       --lr-page-height: 297mm;
       --lr-page-padding: 12.7mm;
       --lr-section-padding: 60px;
   }
   ```
2. **Convert CV hardcoded colors first** (6 values, low risk, immediate benefit).
3. **Convert BTP colors second** (50 values, higher risk, requires careful mapping).
4. **Test print output at each stage** -- print CSS is the most fragile part.
5. **Do NOT implement dark mode in this enhancement.** Design tokens to support it later, but do not build it now.

---

## Summary Risk Matrix

| Enhancement | Technical | Integration | Dependency | Scope | Overall | Recommended Order |
|------------|-----------|-------------|-----------|-------|---------|-------------------|
| E1: Cover Letter | LOW | LOW-MEDIUM | LOW | MEDIUM | **LOW** | 1st |
| E4: Theming System | MEDIUM | MEDIUM | LOW | HIGH | **MEDIUM** | 2nd |
| E3: Beyond the Papers | HIGH | CRITICAL | MEDIUM | CRITICAL | **HIGH** | 3rd |
| E2: Slides Integration | HIGH | HIGH | CRITICAL | CRITICAL | **CRITICAL** | 4th (or defer) |

### Prerequisites Before ANY Enhancement Work

1. **Resolve F-09** (phantom `_bmad` paths) -- blocks all enhancements
2. **Resolve F-10** (missing workflow.xml) -- blocks workflow-dependent enhancements
3. **Resolve F-20** (template naming convention) -- prevents new inconsistencies
4. **Establish CSS namespace convention** (PLAN-09a recommendation) -- prevents class collisions

### Go/No-Go Recommendation

| Enhancement | Recommendation |
|------------|----------------|
| E1: Cover Letter | **GO** -- Low risk, high value, minimal prerequisites beyond F-08/F-09 |
| E4: Theming System | **GO** -- Medium risk, foundational for all other enhancements, pure CSS work |
| E3: Beyond the Papers | **GO WITH REDUCED SCOPE** -- Strip to hero + project cards + condensed timeline. Full BTP template integration is too risky for a single release. |
| E2: Slides Integration | **DEFER** -- The `frontend-slides` skill output contract is undefined. Without knowing the output format, any implementation is speculative. Define the interface contract first, then implement in Release 4. |

---

## Appendix: Quick Reference -- All CSS Class Collisions

| Class | CV Definition | BTP Definition | Resolution |
|-------|---------------|----------------|------------|
| `.section` | `margin-bottom: 4mm` | `padding: 60px 0; background: #fff` | Scope: `.lr-cv-scope .section` / `.lr-btp-scope .section` |
| `.body` (universal reset `*`) | `margin: 0; padding: 0; box-sizing: border-box` | `.body { background: hsla(0,0%,100%,0.87); color: #333 }` | CV uses `*` selector (no `.body` class); BTP's `.body` class is fine if not applied to CV container |
| `.container` | Not used | `max-width: 940px; margin: auto` | No conflict (CV never uses this class) |
| `.heading` | Not used | `font-family: DM Serif Display; font-size: 38px` | No conflict (CV uses `.name`, `.role`) |
| `.form` | Not used | `display: flex; flex-direction: column` | No conflict (CV has no form; BTP form may be stripped) |
| `.grid` | Not used | Webflow grid component | No conflict (CV uses custom grid structure) |
| `.button` | Not used directly (`.btn-download`) | `.nav-link.button { bg: #6057c3 }` | No conflict (different class patterns) |
| `.nav-link` | Not used (CV uses `.nav-item`) | Webflow nav link | No conflict, but verify after BTP nav stripping |
| `z-index: 1000` | `.sidebar` | `.w-nav` (Webflow base) | Conflict if both navs coexist. CV sidebar: `z-index: 1001`; BTP nav: stripped (use CV sidebar instead) |
