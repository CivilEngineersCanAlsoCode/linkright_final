# Release 3 Design Specifications: Linkright Portfolio Platform

**Spec Version:** 1.0
**Date:** 2026-03-07
**Scope:** PLAN-06a, PLAN-06b, PLAN-03c, PLAN-04b
**Depends On:** PLAN-01 (CV Template Audit), PLAN-02 (Beyond the Papers Audit), PLAN-03/04 (Slides & Publicist Audit), SYNC-DESIGN-AND-TECHNICAL-SPECS v1.1

---

## Table of Contents

1. [PLAN-06a: CSS Custom Property Taxonomy for Brand Adaptation](#plan-06a)
2. [PLAN-06b: Typography Variable System](#plan-06b)
3. [PLAN-03c: Slide Embedding as 5th Sidebar View](#plan-03c)
4. [PLAN-04b: Cover Letter Template Variable System](#plan-04b)

---

<a id="plan-06a"></a>
## 1. PLAN-06a: CSS Custom Property Taxonomy for Brand Adaptation

### 1.1 Design Goals

The CV template (PLAN-01b audit) uses 20 CSS custom properties across 5 categories: 1 personalization var, 8 Material Design 3 tokens, 4 brand colors, 5 typography tokens, and 2 page calibration vars. The Beyond the Papers template (PLAN-02f audit) uses **zero** CSS custom properties -- all 60+ colors are hardcoded inline or in the Webflow CSS file.

This specification unifies both templates under a single CSS custom property taxonomy that:

- Preserves the CV template's MD3 token pattern while extending it
- Absorbs all hardcoded colors from both templates into variables
- Enables full brand adaptation by changing a single "brand preset" block
- Maps cleanly to the Sync "Signal from the Deep" design system tokens

### 1.2 Naming Convention

```
--lr-{category}-{role}[-{modifier}]

Categories:
  brand    = Company-specific brand identity colors
  color    = Semantic application colors (surface, text, interactive)
  space    = Spacing scale tokens
  shadow   = Elevation shadow tokens
  border   = Border width, style, and color tokens
  radius   = Border-radius tokens
  font     = Typography tokens (see PLAN-06b)
  page     = Page geometry tokens
  anim     = Animation timing and easing tokens
  ui       = UI component dimension tokens

Roles: Describe the semantic purpose, not the visual value.
Modifiers: -hover, -active, -subtle, -muted, -inverse, -print
```

**Rationale:** The `--lr-` prefix namespaces all Linkright tokens and avoids collision with Material Design's `--md-` or Sync's `--sync-` prefixes. The CV template's existing `--md-sys-color-*` tokens are mapped to `--lr-color-*` equivalents (see Migration Map below).

### 1.3 Complete :root Block -- Organized by Category

```css
:root {
  /* ============================================================
     LINKRIGHT DESIGN TOKEN SYSTEM v1.0
     Brand Adaptation Layer for Portfolio & CV Templates

     USAGE:
     1. To target a new company, replace the BRAND PRESET block.
     2. All semantic tokens derive from brand tokens automatically.
     3. Both CV template and Beyond the Papers template consume
        the same token set.
     ============================================================ */

  /* ------------------------------------------------------------
     CATEGORY 1: PERSONALIZATION
     ------------------------------------------------------------ */
  --lr-target-company-name:     "Google";
  --lr-target-company-short:    "Google";    /* For tight spaces */
  --lr-candidate-name:          "Satvik Jain";
  --lr-target-role:             "Senior Product Manager";

  /* ------------------------------------------------------------
     CATEGORY 2: BRAND PRESET — COMPANY IDENTITY COLORS

     Change this block to adapt the entire portfolio.
     See Section 1.6 for preset examples (Google, Amazon, etc.)
     ------------------------------------------------------------ */

  /* Primary: The dominant brand hue. Used for CTAs, active
     states, section titles, links, identity bar segment 1. */
  --lr-brand-primary:           #4285F4;

  /* Secondary through Quaternary: Supporting brand hues.
     Used for the 4-segment Identity Horizon bar and section
     dividers. For monochromatic brands, set all four to the
     same value or use lightness variants. */
  --lr-brand-secondary:         #EA4335;
  --lr-brand-tertiary:          #FBBC05;
  --lr-brand-quaternary:        #34A853;

  /* Brand accent: A high-energy variant for emphasis and CTAs.
     Often the same as primary, or a warmer/brighter variant. */
  --lr-brand-accent:            #4285F4;

  /* Brand neutral: A desaturated tone from the brand palette
     for backgrounds, borders, and muted text that still feels
     "on-brand." */
  --lr-brand-neutral:           #5F6368;

  /* ------------------------------------------------------------
     CATEGORY 3: SEMANTIC COLORS — SURFACES
     Derived from brand preset. Override per-brand if needed.
     ------------------------------------------------------------ */

  /* Page and content area backgrounds */
  --lr-color-page-bg:           #FFFFFF;
  --lr-color-canvas-bg:         #F1F3F4;  /* Behind the page (screen only) */
  --lr-color-sidebar-bg:        #F8F9FA;
  --lr-color-card-bg:           #FFFFFF;
  --lr-color-overlay-bg:        rgba(0, 0, 0, 0.55);

  /* Beyond the Papers specific surfaces */
  --lr-color-section-bg:        #FFFFFF;
  --lr-color-hero-bg:           #FFFFFF;
  --lr-color-footer-bg:         #6057c3;  /* Overridden by brand preset */
  --lr-color-form-bg:           #FFFFFF;
  --lr-color-body-bg:           #1d1b1b;  /* Dark body behind light sections */

  /* ------------------------------------------------------------
     CATEGORY 4: SEMANTIC COLORS — TEXT
     ------------------------------------------------------------ */
  --lr-color-text-primary:      #1F1F1F;  /* Headings, body text on light */
  --lr-color-text-secondary:    #5F6368;  /* Subheadings, metadata */
  --lr-color-text-muted:        #444746;  /* Captions, inactive labels */
  --lr-color-text-inverse:      #FFFFFF;  /* Text on dark/brand backgrounds */
  --lr-color-text-name:         #202124;  /* Candidate name (hero weight) */
  --lr-color-text-link:         var(--lr-brand-primary);

  /* Beyond the Papers text colors */
  --lr-color-text-paragraph:    rgba(0, 0, 0, 0.66);
  --lr-color-text-subtle:       rgba(0, 0, 0, 0.7);
  --lr-color-text-on-dark:      hsla(0, 0%, 100%, 0.87);

  /* ------------------------------------------------------------
     CATEGORY 5: SEMANTIC COLORS — INTERACTIVE (UI CHROME)
     ------------------------------------------------------------ */
  --lr-color-nav-active-bg:     #D3E3FD;
  --lr-color-nav-active-text:   #041E49;
  --lr-color-nav-hover-bg:      rgba(from var(--lr-brand-primary) r g b / 0.08);
  --lr-color-btn-primary-bg:    var(--lr-brand-primary);
  --lr-color-btn-primary-text:  #FFFFFF;
  --lr-color-btn-primary-hover: var(--lr-brand-accent);
  --lr-color-focus-ring:        var(--lr-brand-primary);
  --lr-color-selection:         rgba(from var(--lr-brand-primary) r g b / 0.15);

  /* ------------------------------------------------------------
     CATEGORY 6: SEMANTIC COLORS — BORDERS & DIVIDERS
     ------------------------------------------------------------ */
  --lr-color-border-default:    #C4C7C5;
  --lr-color-border-subtle:     #DADCE0;
  --lr-color-border-strong:     #5F6368;
  --lr-color-border-brand:      var(--lr-brand-primary);

  /* ------------------------------------------------------------
     CATEGORY 7: SEMANTIC COLORS — FEEDBACK
     ------------------------------------------------------------ */
  --lr-color-success:           #34A853;
  --lr-color-warning:           #FBBC05;
  --lr-color-error:             #EA4335;
  --lr-color-info:              var(--lr-brand-primary);

  /* ------------------------------------------------------------
     CATEGORY 8: IDENTITY HORIZON BAR
     Maps directly to the 4 brand color slots.
     ------------------------------------------------------------ */
  --lr-horizon-1:               var(--lr-brand-primary);
  --lr-horizon-2:               var(--lr-brand-secondary);
  --lr-horizon-3:               var(--lr-brand-tertiary);
  --lr-horizon-4:               var(--lr-brand-quaternary);

  /* ------------------------------------------------------------
     CATEGORY 9: BEYOND THE PAPERS — GRADIENT SYSTEM
     Extracted from PLAN-02f audit. All were hardcoded.
     ------------------------------------------------------------ */
  --lr-gradient-name:           linear-gradient(90deg, #ff512f, #dd2476);
  --lr-gradient-story:          linear-gradient(90deg, #833ab4, #fd1d1d 48%, #fcb045);
  --lr-gradient-timeline:       linear-gradient(180deg, #833ab4, #fd1d1d 51%, #fcb045);
  --lr-gradient-qualities:      linear-gradient(90deg, #16222a, #3a6073);
  --lr-gradient-image-card:     linear-gradient(98deg, #de6262, rgba(255, 184, 140, 0.5));

  /* ------------------------------------------------------------
     CATEGORY 10: SPACING SCALE
     8px base, geometric progression. Used by both templates.
     ------------------------------------------------------------ */
  --lr-space-unit:              8px;
  --lr-space-0:                 0px;
  --lr-space-1:                 4px;     /* 0.5 units */
  --lr-space-2:                 8px;     /* 1 unit */
  --lr-space-3:                 12px;    /* 1.5 units */
  --lr-space-4:                 16px;    /* 2 units */
  --lr-space-5:                 20px;    /* 2.5 units */
  --lr-space-6:                 24px;    /* 3 units */
  --lr-space-8:                 32px;    /* 4 units */
  --lr-space-10:                40px;    /* 5 units */
  --lr-space-12:                48px;    /* 6 units */
  --lr-space-16:                64px;    /* 8 units */
  --lr-space-20:                80px;    /* 10 units */
  --lr-space-section:           60px;    /* Section padding (Beyond Papers) */
  --lr-space-section-lg:        100px;   /* Section padding at 1920px+ */

  /* ------------------------------------------------------------
     CATEGORY 11: SHADOW SYSTEM
     Elevation levels matching Material Design 3 scale.
     ------------------------------------------------------------ */
  --lr-shadow-none:             none;
  --lr-shadow-sm:               0 1px 2px rgba(0, 0, 0, 0.05);
  --lr-shadow-md:               0 2px 4px rgba(0, 0, 0, 0.08),
                                0 4px 8px rgba(0, 0, 0, 0.06);
  --lr-shadow-lg:               0 4px 8px rgba(0, 0, 0, 0.08),
                                0 8px 24px rgba(0, 0, 0, 0.10);
  --lr-shadow-page:             0 1px 3px rgba(0, 0, 0, 0.12),
                                0 1px 2px rgba(0, 0, 0, 0.24);
  --lr-shadow-navbar:           1px 1px 75px 0 rgba(0, 0, 0, 0.1);
  --lr-shadow-form:             28px 28px 150px 0 rgba(0, 0, 0, 0.15);
  --lr-shadow-hero-image:       1px 1px 44px 0 rgba(0, 0, 0, 0.1);

  /* ------------------------------------------------------------
     CATEGORY 12: BORDER RADIUS
     ------------------------------------------------------------ */
  --lr-radius-none:             0px;
  --lr-radius-sm:               4px;
  --lr-radius-md:               8px;
  --lr-radius-lg:               12px;
  --lr-radius-xl:               16px;
  --lr-radius-full:             50%;     /* Circular (profile photo) */
  --lr-radius-btn:              5px;     /* Beyond Papers buttons */
  --lr-radius-pill:             24px;    /* CV nav pills */

  /* ------------------------------------------------------------
     CATEGORY 13: UI COMPONENT DIMENSIONS
     ------------------------------------------------------------ */
  --lr-ui-sidebar-width:        300px;
  --lr-ui-sidebar-padding:      40px 16px;
  --lr-ui-photo-size:           130px;
  --lr-ui-nav-gap:              6px;
  --lr-ui-container-max:        1200px;  /* Beyond Papers */
  --lr-ui-container-lg:         1600px;  /* Beyond Papers at 1920px+ */

  /* ------------------------------------------------------------
     CATEGORY 14: PAGE GEOMETRY (CV TEMPLATE)
     ------------------------------------------------------------ */
  --lr-page-width:              210mm;
  --lr-page-height:             297mm;
  --lr-page-padding:            12.7mm;
  --lr-page-format:             A4;

  /* ------------------------------------------------------------
     CATEGORY 15: ANIMATION TOKENS
     ------------------------------------------------------------ */
  --lr-anim-duration-fast:      180ms;
  --lr-anim-duration-normal:    300ms;
  --lr-anim-duration-slow:      400ms;
  --lr-anim-easing-standard:    cubic-bezier(0.4, 0, 0.2, 1);  /* MD3 standard */
  --lr-anim-easing-decelerate:  cubic-bezier(0, 0, 0.2, 1);
  --lr-anim-easing-overshoot:   cubic-bezier(0.34, 1.56, 0.64, 1);

  /* ------------------------------------------------------------
     CATEGORY 16: BEYOND THE PAPERS — PROJECT CARD PALETTE
     Inline HSLA values from PLAN-02d, now tokenized.
     ------------------------------------------------------------ */
  --lr-project-color-1:         hsla(349.87, 73.45%, 44.31%, 1);  /* Deep red */
  --lr-project-color-2:         hsla(339, 73.46%, 56.94%, 1);     /* Pink */
  --lr-project-color-3:         hsla(240, 100%, 65.10%, 1);       /* Blue-violet */
  --lr-project-color-4:         hsla(261, 59.47%, 55.49%, 1);     /* Purple */

  /* ------------------------------------------------------------
     CATEGORY 17: PRINT OVERRIDES
     Values used only within @media print rules.
     ------------------------------------------------------------ */
  --lr-print-bg:                none;
  --lr-print-page-margin:       0;
  --lr-print-shadow:            none;
}
```

### 1.4 Migration Map: Existing Tokens to New Taxonomy

#### CV Template (PLAN-01b) Migration

| Old Token | New Token | Notes |
|-----------|-----------|-------|
| `--target-company-name` | `--lr-target-company-name` | Identical behavior |
| `--md-sys-color-primary` | `--lr-brand-primary` | Semantic shift: brand, not MD3 |
| `--md-sys-color-surface` | `--lr-color-sidebar-bg` | More specific name |
| `--md-sys-color-surface-container` | `--lr-color-canvas-bg` | More specific name |
| `--md-sys-color-on-surface` | `--lr-color-text-primary` | Semantic text role |
| `--md-sys-color-on-surface-variant` | `--lr-color-text-muted` | Semantic text role |
| `--md-sys-color-outline` | `--lr-color-border-default` | Semantic border role |
| `--md-sys-color-secondary-container` | `--lr-color-nav-active-bg` | UI-specific |
| `--md-sys-color-on-secondary-container` | `--lr-color-nav-active-text` | UI-specific |
| `--brand-blue` | `--lr-brand-primary` | Unified brand slot |
| `--brand-red` | `--lr-brand-secondary` | Unified brand slot |
| `--brand-yellow` | `--lr-brand-tertiary` | Unified brand slot |
| `--brand-green` | `--lr-brand-quaternary` | Unified brand slot |
| `--font-size-name` | `--lr-font-size-hero` | See PLAN-06b |
| `--font-size-header` | `--lr-font-size-section` | See PLAN-06b |
| `--font-size-subhead` | `--lr-font-size-subhead` | See PLAN-06b |
| `--font-size-body` | `--lr-font-size-body` | See PLAN-06b |
| `--font-size-contact` | `--lr-font-size-caption` | See PLAN-06b |
| `--page-width` | `--lr-page-width` | Prefixed only |
| `--page-height` | `--lr-page-height` | Prefixed only |

#### CV Template -- Hardcoded Colors Now Tokenized

From PLAN-01e audit, "Values That SHOULD Be Parameterized":

| Hardcoded Value | Replacement | CV Template Line |
|----------------|-------------|-----------------|
| `#202124` (name text) | `var(--lr-color-text-name)` | Line 269 |
| `#5F6368` (role/subhead) | `var(--lr-color-text-secondary)` | Lines 270, 274, 292 |
| `#DADCE0` (contact border) | `var(--lr-color-border-subtle)` | Lines 277-278 |
| `#E0E0E0` (photo placeholder) | `var(--lr-color-border-default)` | Line 157 |
| `rgba(66,133,244,0.08)` (nav hover) | `var(--lr-color-nav-hover-bg)` | Line 184 |
| `300px` (sidebar width) | `var(--lr-ui-sidebar-width)` | Lines 140, 215 |
| `130px` (photo size) | `var(--lr-ui-photo-size)` | Lines 154-155 |
| `12.7mm` (page padding) | `var(--lr-page-padding)` | Line 233 |
| `white` (page background) | `var(--lr-color-page-bg)` | Line 232 |

#### Beyond the Papers -- Key Colors Now Tokenized

From PLAN-02f audit, all previously hardcoded:

| Hardcoded Value | Replacement |
|----------------|-------------|
| `#6057c3` (purple accent) | `var(--lr-color-footer-bg)` / `var(--lr-brand-accent)` |
| `#1d1b1b` (body background) | `var(--lr-color-body-bg)` |
| `#000` (nav link text) | `var(--lr-color-text-primary)` |
| `rgba(0,0,0,0.66)` (paragraph) | `var(--lr-color-text-paragraph)` |
| `rgba(0,0,0,0.7)` (welcome) | `var(--lr-color-text-subtle)` |
| `hsla(0,0%,100%,0.87)` (on-dark) | `var(--lr-color-text-on-dark)` |
| `#a1a1a1` (timeline gray) | `var(--lr-color-text-muted)` |
| `linear-gradient(90deg, #ff512f, #dd2476)` | `var(--lr-gradient-name)` |
| `linear-gradient(90deg, #833ab4, ...)` | `var(--lr-gradient-story)` |
| `linear-gradient(90deg, #16222a, #3a6073)` | `var(--lr-gradient-qualities)` |

### 1.5 How the Same Token System Works for Both Templates

The unified token system serves both templates through **category layering**:

```
LAYER 1: Brand Preset (Categories 1-2, 8)
  |  Defines --lr-brand-primary through --lr-brand-quaternary
  |  Defines --lr-target-company-name
  |  Defines --lr-horizon-* (identity bar colors)
  |
LAYER 2: Semantic Mapping (Categories 3-7)
  |  CV Template consumes:
  |    --lr-color-sidebar-bg, --lr-color-canvas-bg,
  |    --lr-color-nav-active-bg, --lr-color-text-primary,
  |    --lr-color-border-default, --lr-color-page-bg
  |  Beyond the Papers consumes:
  |    --lr-color-section-bg, --lr-color-hero-bg,
  |    --lr-color-footer-bg, --lr-color-text-paragraph,
  |    --lr-gradient-name, --lr-gradient-story
  |
LAYER 3: Component Dimensions (Categories 10-16)
  |  CV Template consumes:
  |    --lr-page-width, --lr-page-height, --lr-ui-sidebar-width,
  |    --lr-shadow-page
  |  Beyond the Papers consumes:
  |    --lr-space-section, --lr-ui-container-max,
  |    --lr-shadow-navbar, --lr-shadow-form,
  |    --lr-radius-btn, --lr-project-color-*
  |
LAYER 4: Animation (Category 15)
  Both templates share the same timing tokens.
```

**Shared consumption example:**

```css
/* CV Template: .section-title uses brand-primary for color */
.section-title {
  color: var(--lr-brand-primary);
  font-size: var(--lr-font-size-section);
}

/* Beyond Papers: .secondary-heading uses brand-primary */
.secondary-heading {
  color: var(--lr-color-text-primary);
  font-family: var(--lr-font-family-display);
  font-size: var(--lr-font-size-display-sm);
}

/* Both: Identity Horizon bar in CV, could become hero accent in Beyond Papers */
.color-1 { background: var(--lr-horizon-1); }
.color-2 { background: var(--lr-horizon-2); }
.color-3 { background: var(--lr-horizon-3); }
.color-4 { background: var(--lr-horizon-4); }
```

### 1.6 Brand Preset Pattern

Brand presets are implemented as CSS class selectors on the `<html>` element. Changing the class swaps the entire color scheme.

```css
/* === DEFAULT PRESET: GOOGLE === */
:root,
html[data-brand="google"] {
  --lr-brand-primary:           #4285F4;
  --lr-brand-secondary:         #EA4335;
  --lr-brand-tertiary:          #FBBC05;
  --lr-brand-quaternary:        #34A853;
  --lr-brand-accent:            #4285F4;
  --lr-brand-neutral:           #5F6368;
  --lr-color-nav-active-bg:     #D3E3FD;
  --lr-color-nav-active-text:   #041E49;
  --lr-color-footer-bg:         #4285F4;
  --lr-gradient-name:           linear-gradient(90deg, #4285F4, #34A853);
}

/* === PRESET: AMAZON === */
html[data-brand="amazon"] {
  --lr-brand-primary:           #FF9900;
  --lr-brand-secondary:         #FF9900;
  --lr-brand-tertiary:          #232F3E;
  --lr-brand-quaternary:        #FF9900;
  --lr-brand-accent:            #FF9900;
  --lr-brand-neutral:           #232F3E;
  --lr-color-nav-active-bg:     #FFF3E0;
  --lr-color-nav-active-text:   #232F3E;
  --lr-color-footer-bg:         #232F3E;
  --lr-gradient-name:           linear-gradient(90deg, #FF9900, #E88600);
}

/* === PRESET: MICROSOFT === */
html[data-brand="microsoft"] {
  --lr-brand-primary:           #00A4EF;
  --lr-brand-secondary:         #F25022;
  --lr-brand-tertiary:          #FFB900;
  --lr-brand-quaternary:        #7FBA00;
  --lr-brand-accent:            #00A4EF;
  --lr-brand-neutral:           #505050;
  --lr-color-nav-active-bg:     #E0F2FE;
  --lr-color-nav-active-text:   #002050;
  --lr-color-footer-bg:         #00A4EF;
  --lr-gradient-name:           linear-gradient(90deg, #00A4EF, #7FBA00);
}

/* === PRESET: SPOTIFY (Monochromatic) === */
html[data-brand="spotify"] {
  --lr-brand-primary:           #1DB954;
  --lr-brand-secondary:         #1DB954;
  --lr-brand-tertiary:          #1ED760;
  --lr-brand-quaternary:        #169C46;
  --lr-brand-accent:            #1ED760;
  --lr-brand-neutral:           #191414;
  --lr-color-nav-active-bg:     #D4F5E0;
  --lr-color-nav-active-text:   #0A2E14;
  --lr-color-footer-bg:         #191414;
  --lr-gradient-name:           linear-gradient(90deg, #1DB954, #1ED760);
}

/* === PRESET: SYNC (Ocean-Themed, from SYNC-DESIGN-AND-TECHNICAL-SPECS) === */
html[data-brand="sync"] {
  --lr-brand-primary:           #0E9E8E;
  --lr-brand-secondary:         #D9705A;
  --lr-brand-tertiary:          #C8973A;
  --lr-brand-quaternary:        #E8A882;
  --lr-brand-accent:            #D9705A;
  --lr-brand-neutral:           #A8BFC0;
  --lr-color-nav-active-bg:     #CEEAE7;
  --lr-color-nav-active-text:   #091614;
  --lr-color-footer-bg:         #0E9E8E;
  --lr-gradient-name:           linear-gradient(135deg, #0E9E8E 0%, #E8A882 60%, #D9705A 100%);
  --lr-gradient-story:          linear-gradient(135deg, #0E9E8E 0%, #E8A882 60%, #D9705A 100%);
  --lr-gradient-qualities:      linear-gradient(90deg, #091614, #0E9E8E);
  --lr-gradient-timeline:       linear-gradient(180deg, #0E9E8E, #D9705A 51%, #C8973A);
}
```

**Application via data attribute:**

```html
<!-- Set brand at deploy time -->
<html lang="en" data-brand="google">
```

**Switching brands programmatically (for the portfolio-deploy workflow):**

```javascript
function setBrandPreset(brandId) {
  document.documentElement.setAttribute('data-brand', brandId);
}
```

### 1.7 Brand Preset JSON Schema

For the portfolio-deploy workflow to generate presets dynamically:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "LinkrightBrandPreset",
  "type": "object",
  "required": ["brand_id", "brand_name", "colors"],
  "properties": {
    "brand_id": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "description": "Kebab-case identifier used in data-brand attribute"
    },
    "brand_name": {
      "type": "string",
      "description": "Display name of the target company"
    },
    "brand_scenario": {
      "type": "string",
      "enum": ["multi-chromatic", "monochromatic", "dual-tone"],
      "description": "Maps to CV template Decision Tree scenarios A/B/C"
    },
    "colors": {
      "type": "object",
      "required": ["primary", "secondary", "tertiary", "quaternary"],
      "properties": {
        "primary":    { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "secondary":  { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "tertiary":   { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "quaternary": { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "accent":     { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" },
        "neutral":    { "type": "string", "pattern": "^#[0-9A-Fa-f]{6}$" }
      }
    },
    "nav_active": {
      "type": "object",
      "properties": {
        "bg":   { "type": "string" },
        "text": { "type": "string" }
      }
    },
    "gradients": {
      "type": "object",
      "properties": {
        "name":      { "type": "string", "description": "CSS gradient value for name heading" },
        "story":     { "type": "string", "description": "CSS gradient value for story heading" },
        "timeline":  { "type": "string", "description": "CSS gradient value for timeline bar" },
        "qualities": { "type": "string", "description": "CSS gradient value for carousel text" }
      }
    }
  }
}
```

---

<a id="plan-06b"></a>
## 2. PLAN-06b: Typography Variable System

### 2.1 Design Goals

**CV Template typography (PLAN-01b):** 5 font-size variables (`--font-size-name` through `--font-size-contact`) using `pt` units. Single font family: Roboto (Google Fonts, weights 300/400/500/700).

**Beyond the Papers typography (PLAN-02f):** Zero font-size variables. All sizes hardcoded in `px` with responsive overrides at 4 breakpoints. Three font families: DM Serif Display (display headings), Inter (body), Aubrey (decorative accents).

This specification defines a unified type scale that:

- Covers all size needs of both templates in one token set
- Uses `rem` as the base unit for responsive scaling
- Provides font-family tokens per semantic role (not per template)
- Supports context-aware switching: formal resume (Roboto) vs. creative portfolio (DM Serif Display + Inter)
- Maps responsive breakpoints from Beyond the Papers into the scale

### 2.2 Font Family Variables

```css
:root {
  /* ------------------------------------------------------------
     FONT FAMILIES — Semantic Role Assignments
     ------------------------------------------------------------ */

  /* Resume/formal context: Roboto throughout */
  --lr-font-family-resume:      'Roboto', sans-serif;

  /* Portfolio/creative context: Display + Body + Accent */
  --lr-font-family-display:     'DM Serif Display', serif;
  --lr-font-family-body:        'Inter', sans-serif;
  --lr-font-family-accent:      'Aubrey', sans-serif;

  /* Contextual aliases — set per view */
  --lr-font-family-heading:     var(--lr-font-family-resume);
  --lr-font-family-text:        var(--lr-font-family-resume);
  --lr-font-family-decorative:  var(--lr-font-family-resume);

  /* ------------------------------------------------------------
     FONT WEIGHTS
     ------------------------------------------------------------ */
  --lr-font-weight-light:       300;
  --lr-font-weight-regular:     400;
  --lr-font-weight-medium:      500;
  --lr-font-weight-semibold:    600;
  --lr-font-weight-bold:        700;
}

/* Context switching: resume views use Roboto */
#resume-view,
#whyme-view,
#whygoogle-view {
  --lr-font-family-heading:     var(--lr-font-family-resume);
  --lr-font-family-text:        var(--lr-font-family-resume);
  --lr-font-family-decorative:  var(--lr-font-family-resume);
}

/* Context switching: Beyond the Papers uses DM Serif + Inter + Aubrey */
#whoami-view,
.beyond-the-papers {
  --lr-font-family-heading:     var(--lr-font-family-display);
  --lr-font-family-text:        var(--lr-font-family-body);
  --lr-font-family-decorative:  var(--lr-font-family-accent);
}

/* Slides view inherits from brand preset or uses display fonts */
#slides-view {
  --lr-font-family-heading:     var(--lr-font-family-display);
  --lr-font-family-text:        var(--lr-font-family-body);
  --lr-font-family-decorative:  var(--lr-font-family-accent);
}
```

### 2.3 Unified Font-Size Scale

The scale merges the CV template's 5 `pt`-based sizes with Beyond the Papers' `px`-based sizes into a single `rem`-based system (base: `1rem = 16px` at default browser settings).

```css
:root {
  /* ------------------------------------------------------------
     FONT SIZE SCALE — Unified Across Templates

     Naming: Semantic roles, not abstract sizes.
     Unit: rem for responsive scaling. Comments show px equivalent.

     CV template mapped sizes (pt -> rem):
       20pt  = ~26.67px = 1.667rem -> --lr-font-size-hero
       13pt  = ~17.33px = 1.083rem -> --lr-font-size-section
       10.5pt = ~14px   = 0.875rem -> --lr-font-size-subhead
       9.5pt = ~12.67px = 0.792rem -> --lr-font-size-body
       9pt   = ~12px    = 0.75rem  -> --lr-font-size-caption

     Beyond Papers mapped sizes (px -> rem):
       48px  = 3rem     -> --lr-font-size-display-lg
       40px  = 2.5rem   -> --lr-font-size-display-sm
       28px  = 1.75rem  -> --lr-font-size-heading-lg
       20px  = 1.25rem  -> --lr-font-size-heading-sm
       19px  = 1.188rem -> --lr-font-size-accent
       14px  = 0.875rem -> --lr-font-size-body (shared!)
       12px  = 0.75rem  -> --lr-font-size-caption (shared!)
       11px  = 0.688rem -> --lr-font-size-label
     ------------------------------------------------------------ */

  /* Display tier: Hero names, primary headings */
  --lr-font-size-display-lg:    3rem;       /* 48px -- Beyond Papers .heading.name */
  --lr-font-size-display-sm:    2.5rem;     /* 40px -- Beyond Papers .heading-5, .datetext */

  /* Heading tier: Section headings, secondary headings */
  --lr-font-size-heading-lg:    1.75rem;    /* 28px -- Beyond Papers .secondary-heading */
  --lr-font-size-heading-sm:    1.25rem;    /* 20px -- Beyond Papers .project-name-preview */

  /* Resume-specific tier (formal document sizes) */
  --lr-font-size-hero:          1.667rem;   /* ~26.67px / 20pt -- CV .name, .role */
  --lr-font-size-section:       1.083rem;   /* ~17.33px / 13pt -- CV .section-title */
  --lr-font-size-subhead:       0.875rem;   /* ~14px / 10.5pt -- CV .entry-header */

  /* Shared body/text tier */
  --lr-font-size-body:          0.875rem;   /* 14px -- Body text (both templates) */
  --lr-font-size-body-sm:       0.792rem;   /* ~12.67px / 9.5pt -- CV .li-content */

  /* Small text tier */
  --lr-font-size-caption:       0.75rem;    /* 12px / 9pt -- CV .contact-info, labels */
  --lr-font-size-label:         0.688rem;   /* 11px -- Beyond Papers .field-label */

  /* Decorative tier */
  --lr-font-size-accent:        1.188rem;   /* 19px -- Beyond Papers .qualities */
}
```

### 2.4 Line-Height and Letter-Spacing Tokens

```css
:root {
  /* ------------------------------------------------------------
     LINE HEIGHT SCALE
     ------------------------------------------------------------ */
  --lr-line-height-tight:       1.0;   /* Display text, 404 page */
  --lr-line-height-snug:        1.1;   /* Large headings */
  --lr-line-height-normal:      1.2;   /* Headings, accent text */
  --lr-line-height-relaxed:     1.4;   /* Body text, paragraphs */
  --lr-line-height-loose:       1.6;   /* Long-form reading (cover letter) */

  /* Resume-specific (inherited from CV template, tight for print) */
  --lr-line-height-resume:      1.3;

  /* ------------------------------------------------------------
     LETTER SPACING SCALE
     ------------------------------------------------------------ */
  --lr-letter-spacing-tight:    -0.02em;  /* Large display text */
  --lr-letter-spacing-normal:   0em;      /* Body text */
  --lr-letter-spacing-wide:     0.06em;   /* 1px at 16px -- .heading from BTP */
  --lr-letter-spacing-wider:    0.125em;  /* 2px at 16px -- .text-block, .field-label */
  --lr-letter-spacing-widest:   0.15em;   /* Uppercase labels */
}
```

### 2.5 Responsive Font Scaling Strategy

The Beyond the Papers template uses 4 breakpoints (1920px+, 991px, 767px, 479px). The CV template uses none (fixed `pt` sizes for print fidelity). The strategy:

1. **CV views (resume, whyme, whygoogle):** Fixed sizes using `pt` internally. No responsive scaling. These views target A4 print output where consistent sizing is critical.

2. **Beyond the Papers view (whoami) and Slides view:** Responsive scaling using `clamp()` for fluid typography between breakpoints.

3. **Cover letter view (whygoogle):** Hybrid. Uses CV-style fixed layout for print, but the cover letter content area uses slightly larger body text for readability.

```css
/* ------------------------------------------------------------
   RESPONSIVE FONT OVERRIDES — Beyond the Papers & Slides Views
   Applied via view-scoped custom properties
   ------------------------------------------------------------ */

/* Base (default / desktop) */
#whoami-view,
#slides-view {
  --lr-font-size-display-lg:    clamp(1.25rem, 2.5vw + 0.5rem, 3rem);
  --lr-font-size-display-sm:    clamp(1.625rem, 2vw + 0.5rem, 2.5rem);
  --lr-font-size-heading-lg:    clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem);
  --lr-font-size-heading-sm:    clamp(1rem, 1vw + 0.5rem, 1.25rem);
  --lr-font-size-accent:        clamp(0.5rem, 1vw + 0.25rem, 1.188rem);
}

/* Large Desktop (1920px+): Upscale */
@media screen and (min-width: 1920px) {
  #whoami-view,
  #slides-view {
    --lr-font-size-display-lg:  3.75rem;    /* 60px */
    --lr-font-size-display-sm:  2.5rem;     /* 40px */
    --lr-font-size-heading-lg:  2.5rem;     /* 40px */
    --lr-font-size-heading-sm:  1.75rem;    /* 28px */
    --lr-font-size-body:        1.125rem;   /* 18px */
  }
}
```

### 2.6 Typography Adaptation Per View

| Token | Resume View | Value Prop | Strategic Fit | Beyond Papers | Slides |
|-------|------------|------------|---------------|---------------|--------|
| `--lr-font-family-heading` | Roboto | Roboto | Roboto | DM Serif Display | DM Serif Display |
| `--lr-font-family-text` | Roboto | Roboto | Roboto | Inter | Inter |
| `--lr-font-family-decorative` | Roboto | Roboto | Roboto | Aubrey | Aubrey |
| Primary heading size | `--lr-font-size-hero` (20pt) | `--lr-font-size-hero` | `--lr-font-size-hero` | `--lr-font-size-display-lg` | `--lr-font-size-display-sm` |
| Section heading size | `--lr-font-size-section` (13pt) | `--lr-font-size-section` | `--lr-font-size-section` | `--lr-font-size-heading-lg` | `--lr-font-size-heading-sm` |
| Body text size | `--lr-font-size-body-sm` (9.5pt) | `--lr-font-size-body` | `--lr-font-size-body` | `--lr-font-size-body` (14px) | `--lr-font-size-body` |
| Line height | `--lr-line-height-resume` (1.3) | `--lr-line-height-relaxed` | `--lr-line-height-loose` | `--lr-line-height-relaxed` (1.4) | `--lr-line-height-normal` |

### 2.7 Google Fonts Loading

Both templates should share a single font loading block:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=DM+Serif+Display&family=Inter:wght@400;600&family=Aubrey&display=swap" rel="stylesheet">
```

This replaces:
- CV template's separate `css2` file (Roboto only)
- Beyond the Papers' `WebFont.load()` call (DM Serif Display, Inter, Aubrey)

---

<a id="plan-03c"></a>
## 3. PLAN-03c: Slide Embedding as 5th Sidebar View

### 3.1 Design Goals

The CV template currently has 4 navigation views (PLAN-01a audit):

| # | Nav ID | View ID | Label | Subtext |
|---|--------|---------|-------|---------|
| 1 | `nav-resume` | `resume-view` | Resume | The Evidence |
| 2 | `nav-whyme` | `whyme-view` | Value Prop | The "Why Me" |
| 3 | `nav-whygoogle` | `whygoogle-view` | Strategic Fit | Why `<company>`? |
| 4 | `nav-whoami` | `whoami-view` | Beyond the Papers | Personal Narrative |

The `frontend-slides` skill (PLAN-03a/03b audit) generates a self-contained HTML file with inline CSS and JS (zero external dependencies). This file contains the "Why Me" slide deck with 5 career signals structured as Problem/Process/Metric/Legacy slides.

**This spec adds a 5th view** that embeds the generated slide deck HTML within the CV template's navigation architecture.

### 3.2 New Navigation Item Structure

```html
<!-- NEW: 5th nav item, inserted between "Value Prop" and "Strategic Fit" -->
<div class="nav-item" id="nav-slides" onclick="switchView('slides')">
  <div class="nav-label">Slide Deck</div>
  <div class="nav-subtext">Career Signals</div>
</div>
```

**Updated navigation order:**

| # | Nav ID | View ID | Label | Subtext | State |
|---|--------|---------|-------|---------|-------|
| 1 | `nav-resume` | `resume-view` | Resume | The Evidence | Inactive |
| 2 | `nav-whyme` | `whyme-view` | Value Prop | The "Why Me" | Inactive |
| 3 | `nav-slides` | `slides-view` | Slide Deck | Career Signals | Inactive |
| 4 | `nav-whygoogle` | `whygoogle-view` | Strategic Fit | Why `<company>`? | Inactive |
| 5 | `nav-whoami` | `whoami-view` | Beyond the Papers | Personal Narrative | **Active** (default) |

**Rationale for position:** The Slide Deck sits between Value Prop ("Why Me") and Strategic Fit ("Why Company") because it is the visual proof layer -- career signals rendered as presentation slides. It bridges the abstract value proposition and the company-specific argument.

### 3.3 View Container Design

```html
<!-- NEW: Slides view container -->
<div id="slides-view" class="view-container">
  <div class="slides-wrapper">
    <iframe
      id="slides-iframe"
      class="slides-embed"
      src=""
      data-src="slides/career-signals.html"
      title="Career Signals Slide Deck"
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
      aria-label="Interactive career signals presentation"
    ></iframe>
  </div>
</div>
```

**Key design decisions:**

1. **iframe, not inline HTML:** The frontend-slides output is a complete HTML document with its own `<html>`, `<head>`, `<style>`, and `<script>` tags. Inlining it would create DOM conflicts (duplicate `<html>`, CSS collisions, JS scope pollution). An iframe provides clean encapsulation.

2. **Lazy loading via `data-src`:** The iframe `src` is empty by default. The actual URL is stored in `data-src` and loaded on first view activation. This prevents the slide deck from blocking initial page load.

3. **Sandbox attribute:** `allow-scripts` enables the slide deck's navigation JS. `allow-same-origin` is required for the slide deck to read its own inline styles. No `allow-popups` or `allow-forms` needed.

4. **No `.page` wrapper:** Unlike the other 4 views which use `<div class="page">` (sized to A4), the slides view does NOT use the A4 page container. Slides are presentation-format, not document-format.

### 3.4 CSS for the Slides View

```css
/* ------------------------------------------------------------
   SLIDES VIEW — Embedded Presentation
   ------------------------------------------------------------ */
.slides-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - var(--lr-space-10));  /* Full viewport minus top padding */
  padding: var(--lr-space-5);
  background: var(--lr-color-canvas-bg);
}

.slides-embed {
  width: 100%;
  max-width: 960px;              /* 16:9 at reasonable desktop width */
  height: 0;
  padding-bottom: 56.25%;        /* 16:9 aspect ratio */
  border: none;
  border-radius: var(--lr-radius-md);
  box-shadow: var(--lr-shadow-lg);
  background: var(--lr-color-page-bg);
}

/* Responsive: full-width on smaller screens */
@media screen and (max-width: 991px) {
  .slides-embed {
    max-width: 100%;
  }
}

/* Alternative: fixed-height approach for when aspect ratio
   causes issues with very tall/short viewports */
@media screen and (min-height: 800px) {
  .slides-embed {
    height: calc(100vh - 120px);
    padding-bottom: 0;
  }
}
```

### 3.5 Integration with switchView() Function

**Current function (PLAN-01c audit):**

```javascript
function switchView(viewId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('nav-' + viewId).classList.add('active');
    document.querySelectorAll('.view-container').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId + '-view').classList.add('active');
}
```

**Updated function with lazy-load support for slides:**

```javascript
function switchView(viewId) {
    // 1. Update navigation pills
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('nav-' + viewId).classList.add('active');

    // 2. Update content views
    document.querySelectorAll('.view-container').forEach(view => view.classList.remove('active'));
    document.getElementById(viewId + '-view').classList.add('active');

    // 3. Lazy-load slides iframe on first activation
    if (viewId === 'slides') {
        const iframe = document.getElementById('slides-iframe');
        if (iframe && !iframe.src && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
        }
    }
}
```

**Changes from current implementation:**
- Lines 1-2 and 4-5: Identical to existing logic. No structural change.
- Lines 7-11: New block. Checks if the activated view is `slides` and if the iframe has not yet been loaded (empty `src`). If so, copies `data-src` to `src` to trigger the load.
- The naming convention `nav-slides` / `slides-view` follows the existing pattern (`nav-{viewId}` / `{viewId}-view`).

### 3.6 Slide Content Source and Embedding Flow

```
[step-port-01-compile.md]
    |
    v
slides_content.json (Problem/Process/Metric/Legacy x 5 signals)
    |
    v
[frontend-slides skill / Phase 3]
    |
    v
career-signals.html (self-contained HTML, inline CSS+JS)
    |
    v
[step-port-03-deploy.md]
    |
    v
Deploy as: /slides/career-signals.html (relative to portfolio root)
    |
    v
Referenced by: <iframe data-src="slides/career-signals.html">
```

**File structure on gh-pages:**

```
/index.html                      (main CV template with 5 views)
/slides/career-signals.html      (standalone slide deck)
/assets/profile-photo.png        (externalized profile photo)
```

### 3.7 Print Behavior for Slides View

The slides view should NOT print by default (consistent with the current behavior where only the resume prints). The updated `@media print` rules:

```css
@media print {
    body { background: none; padding: 0; }
    .sidebar { display: none !important; }
    .main-content { margin-left: 0; padding: 0; }
    .page { margin: 0; box-shadow: none; border: none; }
    .view-container { display: none !important; }
    #resume-view { display: block !important; }
    /* Slides view explicitly hidden (consistent with other non-resume views) */
    #slides-view { display: none !important; }
    @page { size: A4; margin: 0; }
}
```

**Future enhancement:** A dedicated "Print Slides" button inside the slides view could trigger `window.frames['slides-iframe'].print()` to print just the slide deck using the iframe's own print styles.

### 3.8 Accessibility Considerations

```html
<div id="slides-view" class="view-container" role="region" aria-label="Career signals presentation">
  <div class="slides-wrapper">
    <iframe
      id="slides-iframe"
      class="slides-embed"
      src=""
      data-src="slides/career-signals.html"
      title="Career Signals Slide Deck — 5 career achievements presented as an interactive slideshow"
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
      aria-label="Interactive career signals presentation"
      tabindex="0"
    ></iframe>
    <!-- Fallback for iframes blocked or unsupported -->
    <noscript>
      <p>
        <a href="slides/career-signals.html" target="_blank" rel="noopener">
          Open the Career Signals slide deck in a new tab
        </a>
      </p>
    </noscript>
  </div>
</div>
```

### 3.9 Complete HTML Diff: Sidebar Navigation

```html
<!-- BEFORE: 4 nav items -->
<nav class="nav-list">
  <div class="nav-item" id="nav-resume" onclick="switchView('resume')">
    <div class="nav-label">Resume</div>
    <div class="nav-subtext">The Evidence</div>
  </div>
  <div class="nav-item" id="nav-whyme" onclick="switchView('whyme')">
    <div class="nav-label">Value Prop</div>
    <div class="nav-subtext">The "Why Me"</div>
  </div>
  <div class="nav-item" id="nav-whygoogle" onclick="switchView('whygoogle')">
    <div class="nav-label">Strategic Fit</div>
    <div class="nav-subtext">Why <span class="company-name"></span>?</div>
  </div>
  <div class="nav-item active" id="nav-whoami" onclick="switchView('whoami')">
    <div class="nav-label">Beyond the Papers</div>
    <div class="nav-subtext">Personal Narrative</div>
  </div>
</nav>

<!-- AFTER: 5 nav items -->
<nav class="nav-list">
  <div class="nav-item" id="nav-resume" onclick="switchView('resume')">
    <div class="nav-label">Resume</div>
    <div class="nav-subtext">The Evidence</div>
  </div>
  <div class="nav-item" id="nav-whyme" onclick="switchView('whyme')">
    <div class="nav-label">Value Prop</div>
    <div class="nav-subtext">The "Why Me"</div>
  </div>
  <!-- NEW -->
  <div class="nav-item" id="nav-slides" onclick="switchView('slides')">
    <div class="nav-label">Slide Deck</div>
    <div class="nav-subtext">Career Signals</div>
  </div>
  <!-- END NEW -->
  <div class="nav-item" id="nav-whygoogle" onclick="switchView('whygoogle')">
    <div class="nav-label">Strategic Fit</div>
    <div class="nav-subtext">Why <span class="company-name"></span>?</div>
  </div>
  <div class="nav-item active" id="nav-whoami" onclick="switchView('whoami')">
    <div class="nav-label">Beyond the Papers</div>
    <div class="nav-subtext">Personal Narrative</div>
  </div>
</nav>
```

---

<a id="plan-04b"></a>
## 4. PLAN-04b: Cover Letter Template Variable System

### 4.1 Design Goals

The Strategic Fit view (`#whygoogle-view`, PLAN-01a audit line 469) is currently a scaffold with a 1px transparent placeholder image and a paragraph: `"The 'Why <span class="company-name"></span>' cover letter goes here."` This spec defines:

- The template variable schema for cover letter content
- How outbound-campaign workflow output (`cover_letter.md`) maps to HTML
- The HTML structure for the cover letter within the existing view
- CSS styling for cover letter content
- Print behavior

### 4.2 Template Variable Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "LinkrightCoverLetterPayload",
  "type": "object",
  "required": ["meta", "letter"],
  "properties": {
    "meta": {
      "type": "object",
      "required": ["company_name", "target_role", "candidate_name"],
      "properties": {
        "company_name": {
          "type": "string",
          "description": "Target company name. Maps to --lr-target-company-name and all .company-name spans."
        },
        "company_short": {
          "type": "string",
          "description": "Short company name for nav subtext. E.g., 'Google' for 'Alphabet Inc.'"
        },
        "target_role": {
          "type": "string",
          "description": "The role being applied for. Displayed in letter header."
        },
        "candidate_name": {
          "type": "string",
          "description": "Full name of the candidate."
        },
        "candidate_email": {
          "type": "string",
          "format": "email"
        },
        "candidate_phone": {
          "type": "string"
        },
        "date": {
          "type": "string",
          "format": "date",
          "description": "Letter date in ISO format. Rendered as human-readable."
        },
        "addressee": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Recruiter or hiring manager name. From recruiter_profile.json."
            },
            "title": {
              "type": "string",
              "description": "Addressee's job title."
            },
            "company": {
              "type": "string",
              "description": "Company name (may differ from target if agency recruiter)."
            }
          }
        },
        "tone": {
          "type": "string",
          "enum": ["formal", "casual", "technical"],
          "description": "Tone from outreach_strategy.json step-out-02."
        },
        "bridge_signal": {
          "type": "string",
          "description": "The single most relevant achievement (from 'The Bridge' in strategy step)."
        }
      }
    },
    "letter": {
      "type": "object",
      "required": ["hook", "why_me", "why_them"],
      "description": "Three-paragraph cover letter following the master orchestration structure from step-out-03-draft-cover-letter.md.",
      "properties": {
        "hook": {
          "type": "string",
          "description": "Paragraph 1: 'The Hook'. Specific reference to company/recruiter research. Opens with a genuine connection point, not a generic opener. 80-120 words."
        },
        "why_me": {
          "type": "string",
          "description": "Paragraph 2: 'The Why Me?' / 'The Bridge'. User's most relevant achievement with quantitative metrics. Maps to bridge_signal. 100-150 words."
        },
        "why_them": {
          "type": "string",
          "description": "Paragraph 3: 'The Why Them?'. Internal deep motivations not found on resume. Why THIS company specifically. 80-120 words."
        },
        "closing": {
          "type": "string",
          "description": "Optional closing line before signature. E.g., 'I would welcome the opportunity to discuss how my experience aligns with your team's goals.'"
        }
      }
    },
    "signature": {
      "type": "object",
      "properties": {
        "sign_off": {
          "type": "string",
          "default": "Warm regards,",
          "description": "Closing salutation."
        },
        "name": {
          "type": "string",
          "description": "Candidate name in signature block."
        },
        "portfolio_url": {
          "type": "string",
          "format": "uri",
          "description": "Link back to this portfolio."
        }
      }
    }
  }
}
```

### 4.3 Data Flow: Outbound-Campaign Workflow to HTML

```
[step-out-02-strategy.md]
    |  Output: outreach_strategy.json
    |    Contains: tone, bridge_signal, golden_signals
    |
    v
[step-out-03-draft-cover-letter.md]
    |  Output: cover_letter.md
    |    Contains: Hook / Why Me / Why Them paragraphs (300-400 words total)
    |
    v
[cover_letter_payload.json]
    |  Structured extraction from cover_letter.md + outreach_strategy.json
    |  + recruiter_profile.json + jd_profile.yaml
    |
    v
[step-port-03-deploy.md]
    |  Template injection: Reads cover_letter_payload.json
    |  Replaces placeholder content in #whygoogle-view
    |
    v
[Deployed HTML]
    |  #whygoogle-view now contains formatted cover letter
    |  .company-name spans populated via --lr-target-company-name
```

**Example `cover_letter_payload.json`:**

```json
{
  "meta": {
    "company_name": "Google",
    "company_short": "Google",
    "target_role": "Senior Product Manager, Search",
    "candidate_name": "Satvik Jain",
    "candidate_email": "satvik@example.com",
    "candidate_phone": "+91-XXXXXXXXXX",
    "date": "2026-03-07",
    "addressee": {
      "name": "Priya Sharma",
      "title": "Technical Recruiter",
      "company": "Google"
    },
    "tone": "formal",
    "bridge_signal": "Led cross-functional team of 12 to deliver real-time analytics dashboard, reducing decision latency by 40% and generating $5M incremental revenue."
  },
  "letter": {
    "hook": "Your recent keynote at ProductCon Bangalore on 'building for the next billion users' resonated deeply with my own experience scaling consumer products across India's diverse market landscape. Having spent three years solving exactly the kind of low-connectivity, high-diversity challenges your Search team faces in emerging markets, I believe my signal aligns precisely with what you are building next.",
    "why_me": "At Organization One, I led a cross-functional team of 12 engineers and designers to build a real-time analytics dashboard that reduced executive decision latency by 40%. This was not a feature launch — it was an operating model shift. The dashboard now processes 2.3M daily events and directly contributed to $5M in incremental revenue within its first year. More importantly, it changed how the entire product org makes decisions, embedding data-driven culture into sprint planning and roadmap reviews.",
    "why_them": "What draws me to Google Search specifically is the unsolved problem of intent understanding in multilingual contexts. Having grown up navigating three languages daily, I understand viscerally that search is not just a technology problem — it is a cultural translation challenge. I want to bring my experience in building products that respect linguistic nuance to a team that operates at the scale where such nuances affect billions of daily queries.",
    "closing": "I would welcome the opportunity to discuss how my experience in real-time systems and multilingual product design aligns with your team's mission."
  },
  "signature": {
    "sign_off": "Warm regards,",
    "name": "Satvik Jain",
    "portfolio_url": "https://satvikjain.github.io"
  }
}
```

### 4.4 HTML Structure for Cover Letter Content

This replaces the current placeholder content inside `#whygoogle-view`:

```html
<!-- VIEW 3: STRATEGIC FIT (Cover Letter) -->
<div id="whygoogle-view" class="view-container">
  <div class="page">
    <div class="identity-horizon">
      <div class="color-1"></div>
      <div class="color-2"></div>
      <div class="color-3"></div>
      <div class="color-4"></div>
    </div>
    <div class="header">
      <div class="header-top">
        <div class="name">{{candidate_name}}</div>
        <div class="role">{{target_role}}</div>
      </div>
      <div class="contact-info">
        <!-- Same contact-info structure as other views -->
      </div>
    </div>
    <div class="section cover-letter-section">
      <div class="section-title">
        Strategic Fit
        <div class="section-divider"></div>
      </div>

      <!-- Cover Letter Content Area -->
      <div class="cover-letter">
        <!-- Date and Addressee Block -->
        <div class="cl-date">{{date_formatted}}</div>
        <div class="cl-addressee">
          <div class="cl-addressee-name">{{addressee.name}}</div>
          <div class="cl-addressee-title">{{addressee.title}}</div>
          <div class="cl-addressee-company">{{addressee.company}}</div>
        </div>

        <!-- Salutation -->
        <div class="cl-salutation">Dear {{addressee.name}},</div>

        <!-- Three-Paragraph Body -->
        <div class="cl-body">
          <p class="cl-paragraph cl-hook">{{letter.hook}}</p>
          <p class="cl-paragraph cl-why-me">{{letter.why_me}}</p>
          <p class="cl-paragraph cl-why-them">{{letter.why_them}}</p>
          <p class="cl-paragraph cl-closing">{{letter.closing}}</p>
        </div>

        <!-- Signature Block -->
        <div class="cl-signature">
          <div class="cl-sign-off">{{signature.sign_off}}</div>
          <div class="cl-signer-name">{{signature.name}}</div>
          <div class="cl-portfolio-link">
            <a href="{{signature.portfolio_url}}" target="_blank">
              {{signature.portfolio_url}}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 4.5 CSS Styling for Cover Letter Content

```css
/* ------------------------------------------------------------
   COVER LETTER — Strategic Fit View
   Formal letter styling within the A4 page container.
   ------------------------------------------------------------ */

.cover-letter {
  margin-top: var(--lr-space-6);     /* 24px below section title */
  font-family: var(--lr-font-family-heading);  /* Roboto in resume context */
  font-size: var(--lr-font-size-body);          /* 14px / 0.875rem */
  line-height: var(--lr-line-height-loose);      /* 1.6 for letter readability */
  color: var(--lr-color-text-primary);
}

/* Date */
.cl-date {
  font-size: var(--lr-font-size-caption);
  color: var(--lr-color-text-secondary);
  margin-bottom: var(--lr-space-4);  /* 16px */
}

/* Addressee Block */
.cl-addressee {
  margin-bottom: var(--lr-space-6);  /* 24px */
  font-size: var(--lr-font-size-body-sm);
  line-height: var(--lr-line-height-relaxed);
  color: var(--lr-color-text-secondary);
}

.cl-addressee-name {
  font-weight: var(--lr-font-weight-medium);
  color: var(--lr-color-text-primary);
}

/* Salutation */
.cl-salutation {
  margin-bottom: var(--lr-space-4);  /* 16px */
  font-weight: var(--lr-font-weight-medium);
  color: var(--lr-color-text-primary);
}

/* Body Paragraphs */
.cl-body {
  margin-bottom: var(--lr-space-6);  /* 24px before signature */
}

.cl-paragraph {
  margin-bottom: var(--lr-space-4);  /* 16px between paragraphs */
  text-align: left;
}

.cl-paragraph:last-child {
  margin-bottom: 0;
}

/* Optional: Subtle left-border accent on "The Bridge" paragraph */
.cl-why-me {
  border-left: 2px solid var(--lr-brand-primary);
  padding-left: var(--lr-space-3);  /* 12px */
  margin-left: 0;
}

/* Closing line (if present) */
.cl-closing {
  font-style: italic;
  color: var(--lr-color-text-secondary);
}

/* Signature Block */
.cl-signature {
  margin-top: var(--lr-space-8);  /* 32px */
  padding-top: var(--lr-space-4); /* 16px */
}

.cl-sign-off {
  margin-bottom: var(--lr-space-2);  /* 8px */
  font-style: italic;
  color: var(--lr-color-text-secondary);
}

.cl-signer-name {
  font-weight: var(--lr-font-weight-bold);
  font-size: var(--lr-font-size-subhead);
  color: var(--lr-color-text-name);
}

.cl-portfolio-link {
  margin-top: var(--lr-space-1);  /* 4px */
  font-size: var(--lr-font-size-caption);
}

.cl-portfolio-link a {
  color: var(--lr-brand-primary);
  text-decoration: none;
}

.cl-portfolio-link a:hover {
  text-decoration: underline;
}
```

### 4.6 Print Behavior for the Cover Letter View

The current `@media print` rules force-hide ALL views except `#resume-view`. For cover letter printing, we add a mechanism to print the cover letter as a second page:

```css
@media print {
  body { background: none; padding: 0; }
  .sidebar { display: none !important; }
  .main-content { margin-left: 0; padding: 0; }
  .page { margin: 0; box-shadow: none; border: none; }

  /* Default: hide all views */
  .view-container { display: none !important; }

  /* Always show resume as page 1 */
  #resume-view { display: block !important; }

  /* Conditionally show cover letter as page 2 */
  body.print-with-cover-letter #whygoogle-view {
    display: block !important;
    page-break-before: always;
  }

  /* Slides view: never print */
  #slides-view { display: none !important; }

  @page { size: A4; margin: 0; }
}
```

**Activation:** The download button behavior is extended:

```javascript
function printPortfolio(includeCoverLetter) {
  if (includeCoverLetter) {
    document.body.classList.add('print-with-cover-letter');
  }
  window.print();
  // Clean up after print dialog closes
  window.addEventListener('afterprint', function cleanup() {
    document.body.classList.remove('print-with-cover-letter');
    window.removeEventListener('afterprint', cleanup);
  });
}
```

**Updated download button (optional enhancement):**

```html
<button class="btn-download" onclick="printPortfolio(false)">DOWNLOAD RESUME</button>
<button class="btn-download btn-download-secondary" onclick="printPortfolio(true)">+ COVER LETTER</button>
```

### 4.7 Template Variable Injection Points

Summary of all injection points in the cover letter view:

| Template Variable | HTML Target | Source JSON Path |
|------------------|-------------|-----------------|
| `{{candidate_name}}` | `.name` text content | `meta.candidate_name` |
| `{{target_role}}` | `.role` text content | `meta.target_role` |
| `{{date_formatted}}` | `.cl-date` text content | `meta.date` (formatted) |
| `{{addressee.name}}` | `.cl-addressee-name`, `.cl-salutation` | `meta.addressee.name` |
| `{{addressee.title}}` | `.cl-addressee-title` | `meta.addressee.title` |
| `{{addressee.company}}` | `.cl-addressee-company` | `meta.addressee.company` |
| `{{letter.hook}}` | `.cl-hook` text content | `letter.hook` |
| `{{letter.why_me}}` | `.cl-why-me` text content | `letter.why_me` |
| `{{letter.why_them}}` | `.cl-why-them` text content | `letter.why_them` |
| `{{letter.closing}}` | `.cl-closing` text content | `letter.closing` |
| `{{signature.sign_off}}` | `.cl-sign-off` text content | `signature.sign_off` |
| `{{signature.name}}` | `.cl-signer-name` text content | `signature.name` |
| `{{signature.portfolio_url}}` | `.cl-portfolio-link a` href + text | `signature.portfolio_url` |
| `<span class="company-name">` | CSS `::after` pseudo-element | `meta.company_name` via `--lr-target-company-name` |

### 4.8 Integration Notes and Gap Resolution

This spec addresses the following gaps identified in the PLAN-03/04 audit:

| Gap ID | Description | Resolution |
|--------|-------------|------------|
| **GAP-04** | No template for cover letter output | Resolved: Full HTML template structure defined in Section 4.4 |
| **GAP-05** | Cover letter structure incomplete in step file | Resolved: Three-paragraph structure (Hook/Why Me/Why Them) plus closing and signature explicitly mapped in JSON schema |
| **GAP-10** | Missing company_brief integration | Partially resolved: `meta.tone` field captures the tone selection from strategy step; `company_brief` context should inform the tone selection in step-out-02 |

---

## Appendix A: Cross-Reference Matrix

| Audit Finding | This Spec Section | Action |
|--------------|-------------------|--------|
| PLAN-01b: 20 CSS custom properties | PLAN-06a Section 1.4 | All 20 migrated to `--lr-` namespace |
| PLAN-01b: 9 hardcoded hex colors | PLAN-06a Section 1.4 | All 9 tokenized as `--lr-color-*` variables |
| PLAN-01e: 12 values should be parameterized | PLAN-06a Section 1.4 | All 12 now have CSS custom properties |
| PLAN-02f: 0 CSS custom properties | PLAN-06a Section 1.4 | 60+ Beyond Papers colors mapped to unified tokens |
| PLAN-02f: No formal spacing scale | PLAN-06a Category 10 | 8px-base spacing scale defined |
| PLAN-01b: 5 font-size variables (pt) | PLAN-06b Section 2.3 | Mapped to `--lr-font-size-*` (rem) |
| PLAN-02f: 15+ hardcoded font sizes (px) | PLAN-06b Section 2.3 | Mapped to unified scale |
| PLAN-02f: 3 font families (no variables) | PLAN-06b Section 2.2 | Tokenized as `--lr-font-family-*` |
| PLAN-01c: switchView() handles 4 views | PLAN-03c Section 3.5 | Extended with lazy-load for 5th view |
| PLAN-01d: Only resume prints | PLAN-03c Section 3.7 / PLAN-04b Section 4.6 | Slides excluded; cover letter optionally included |
| PLAN-01a: 4 nav items | PLAN-03c Section 3.2 | 5th nav item added |
| PLAN-03a: frontend-slides outputs HTML | PLAN-03c Section 3.3 | Embedded via sandboxed iframe |
| PLAN-03b: slides_content.json schema | PLAN-03c Section 3.6 | Data flow from compile step to iframe src |
| PLAN-04a: step-out-03 cover letter | PLAN-04b Section 4.2 | Full JSON schema for cover letter payload |
| PLAN-04a: outreach_strategy.json | PLAN-04b Section 4.3 | Data flow mapped from strategy to HTML |
| PLAN-04a: GAP-04 no template | PLAN-04b Section 4.4 | HTML template with 14 injection points |
| PLAN-04a: GAP-05 incomplete structure | PLAN-04b Section 4.2 | Hook/Why Me/Why Them/Closing/Signature schema |

## Appendix B: Implementation Order

1. **Phase 1 (Foundation):** Implement PLAN-06a `:root` block and brand preset system in the CV template. Migrate all 20 existing custom properties to `--lr-` namespace. Tokenize the 9 hardcoded hex colors.

2. **Phase 2 (Typography):** Implement PLAN-06b font family variables and size scale. Update Google Fonts loading to single combined `<link>`. Add per-view font-family context switching.

3. **Phase 3 (Cover Letter):** Implement PLAN-04b cover letter HTML structure and CSS. Define the `cover_letter_payload.json` injection mechanism in `step-port-03-deploy.md`. Add print-with-cover-letter support.

4. **Phase 4 (Slides View):** Implement PLAN-03c 5th nav item and slides view container. Update `switchView()` with lazy-load logic. Deploy `career-signals.html` as a sibling file.

5. **Phase 5 (Beyond Papers):** Apply PLAN-06a/06b tokens to the Beyond the Papers template (stripping Webflow dependencies per PLAN-02e). This is the largest effort and depends on all prior phases.

---

*End of Release 3 Design Specifications.*
