---

# PLAN-05: "Beyond the Papers" View Design Specification

**Release:** 3 -- Enhancement Planning Phase
**Status:** Design Complete -- Ready for Implementation
**Depends on:** PLAN-01 (Portfolio & CV Audit), PLAN-02 (Beyond the Papers Webflow Audit)
**Integration target:** `#whoami-view` in `/Users/satvikjain/Downloads/sync/Satvik Jain - Portfolio & CV_files/Satvik Jain - Portfolio & CV.html`

---

## Architectural Overview

The "Beyond the Papers" view is the 4th view (`#whoami-view`) in the existing Portfolio & CV single-page application. Currently it contains only a 1px transparent placeholder image and the text "The Personal Narrative media goes here" (lines 513-518 of the portfolio HTML).

This design specification replaces that placeholder with a full vertical storytelling experience adapted from the Webflow "Beyond the Papers" template (PLAN-02 audit). The implementation is constrained to:

1. **Zero external JS libraries** -- no jQuery, no GSAP, no Webflow runtime
2. **Vanilla CSS + vanilla JS only** -- matching the portfolio's existing zero-dependency architecture
3. **Integration with the existing `switchView()` mechanism** -- the Beyond the Papers content must activate/deactivate via the same `display: none` / `display: block` class toggle
4. **Sync design system tokens** where applicable for the web UI chrome, while the resume-page sections (Identity Horizon, header) retain their existing Material Design 3 tokens

### Critical Architectural Decision: Breaking Out of the A4 Page

The existing three views (Resume, Value Prop, Strategic Fit) all render inside a `<div class="page">` container that is locked to `210mm x 297mm` with `overflow: hidden`. This is correct for those views -- they are print-oriented A4 documents.

The Beyond the Papers view is fundamentally different. It is a **scrollable web experience**, not a printable document. Therefore:

- The `#whoami-view` container must **NOT** use the `.page` class
- Instead, it uses a new `.btp-view` class (Beyond the Papers) that allows natural content flow with vertical scrolling
- The `.main-content` container already has `overflow-y: scroll` on the body, so the scrollable content works naturally
- The `@media print` rules already force-hide all views except `#resume-view`, so there is no print conflict

### Section Stack Order (Top to Bottom)

```
#whoami-view.view-container
  └── .btp-view                          (replaces .page; no fixed height)
      ├── .btp-hero                      (PLAN-05c: Hero + rotating qualities)
      ├── .btp-timeline                  (PLAN-05a: Vertical storytelling timeline)
      ├── .btp-projects                  (PLAN-05b: Project showcase cards)
      ├── .btp-experience                (PLAN-05d: Experience section)
      ├── .btp-hobbies                   (PLAN-05d: Hobbies/interests)
      ├── .btp-contact                   (PLAN-05d: Contact section)
      └── .btp-footer                    (PLAN-05d: Footer with social links)
```

---

## CSS Variable Extensions

The Beyond the Papers view introduces new CSS custom properties that extend the existing `:root` block. These are scoped with a `--btp-` prefix to avoid collision with the existing `--md-sys-color-*` and `--brand-*` variables.

```css
:root {
    /* === EXISTING VARIABLES (unchanged) === */
    /* --target-company-name, --md-sys-color-*, --brand-*, --font-size-*, --page-* */

    /* === BEYOND THE PAPERS: Layout === */
    --btp-max-width: 900px;
    --btp-section-padding-y: 60px;
    --btp-section-padding-x: 40px;

    /* === BEYOND THE PAPERS: Typography === */
    --btp-font-display: 'DM Serif Display', Georgia, serif;
    --btp-font-body: 'Inter', 'Roboto', sans-serif;
    --btp-font-accent: 'Inter', sans-serif;
    --btp-font-size-hero: 48px;
    --btp-font-size-h2: 28px;
    --btp-font-size-h3: 20px;
    --btp-font-size-body: 16px;
    --btp-font-size-small: 14px;
    --btp-font-size-caption: 12px;
    --btp-line-height-body: 1.6;

    /* === BEYOND THE PAPERS: Colors (derived from Sync brand) === */
    --btp-bg-primary: #FFFFFF;
    --btp-bg-section-alt: var(--md-sys-color-surface-container);
    --btp-text-primary: #1F1F1F;
    --btp-text-secondary: rgba(0, 0, 0, 0.66);
    --btp-text-muted: rgba(0, 0, 0, 0.44);

    /* Gradient: adapted from Webflow template, harmonized with Sync palette */
    --btp-gradient-name: linear-gradient(90deg, #0E9E8E, #D9705A);
    --btp-gradient-timeline: linear-gradient(180deg, #0E9E8E, #D9705A 51%, #C8973A);
    --btp-gradient-qualities: linear-gradient(90deg, #162826, #38645E);

    /* Timeline */
    --btp-timeline-line-color: #C4C7C5;
    --btp-timeline-dot-size: 15px;
    --btp-timeline-dot-active: var(--md-sys-color-primary);
    --btp-timeline-dot-inactive: #A1A1A1;
    --btp-timeline-center-width: 120px;

    /* Cards */
    --btp-card-radius: 12px;
    --btp-card-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    --btp-card-shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.15);

    /* Animation */
    --btp-transition-fast: 200ms;
    --btp-transition-medium: 400ms;
    --btp-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
    --btp-easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
}
```

### Responsive Overrides

```css
@media screen and (max-width: 991px) {
    :root {
        --btp-font-size-hero: 40px;
        --btp-font-size-h2: 24px;
        --btp-section-padding-y: 40px;
        --btp-section-padding-x: 30px;
        --btp-timeline-center-width: 90px;
    }
}

@media screen and (max-width: 767px) {
    :root {
        --btp-font-size-hero: 36px;
        --btp-font-size-h2: 20px;
        --btp-font-size-h3: 18px;
        --btp-section-padding-y: 30px;
        --btp-section-padding-x: 20px;
        --btp-timeline-center-width: 60px;
    }
}

@media screen and (max-width: 479px) {
    :root {
        --btp-font-size-hero: 28px;
        --btp-font-size-h2: 18px;
        --btp-font-size-h3: 16px;
        --btp-font-size-body: 14px;
        --btp-section-padding-y: 24px;
        --btp-section-padding-x: 16px;
        --btp-timeline-center-width: 40px;
        --btp-timeline-dot-size: 12px;
    }
}
```

### Font Loading

The existing portfolio loads only Roboto via Google Fonts. The Beyond the Papers view requires two additional typefaces from the Webflow template:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

This `<link>` tag must be added to the `<head>`. Note: `family=Roboto` can be combined into the same request. The `display=swap` ensures text remains visible during font loading.

---

## PLAN-05a: Vertical Storytelling Timeline

### Source Reference

The Webflow template's active timeline (PLAN-02c) uses a 3-column CSS Grid (`1fr 160px 1fr`) with 9 timeline items, sticky date text at `top: 50vh`, sticky circle indicators, and a fixed gradient progress bar. The scroll-color-change behavior is driven by Webflow IX2.

### Adapted Design

#### HTML Structure

The existing `#whoami-view` placeholder content (lines 513-518) is replaced entirely. The new structure:

```html
<div id="whoami-view" class="view-container">
    <div class="btp-view">

        <!-- ... hero section (PLAN-05c) above ... -->

        <section class="btp-section btp-timeline" id="btp-timeline">
            <div class="btp-container">
                <h2 class="btp-section-heading">My Story</h2>

                <div class="btp-timeline-wrapper">
                    <!-- The gray background line (full height) -->
                    <div class="btp-timeline-line"></div>
                    <!-- The gradient progress fill (JS-controlled height) -->
                    <div class="btp-timeline-progress"></div>

                    <!-- Timeline Item 1 -->
                    <div class="btp-timeline-item" data-btp-animate="fade-up">
                        <div class="btp-timeline-date">
                            <span class="btp-timeline-datetext">January 2012</span>
                        </div>
                        <div class="btp-timeline-dot">
                            <div class="btp-timeline-circle"></div>
                        </div>
                        <div class="btp-timeline-content">
                            <p class="btp-timeline-description">
                                Started my journey at IIT Madras...
                            </p>
                            <!-- Optional: image within timeline entry -->
                            <img class="btp-timeline-image" src="..." alt="..." loading="lazy">
                        </div>
                    </div>

                    <!-- Timeline Item 2 ... N -->
                    <!-- Repeat .btp-timeline-item blocks -->

                </div>
            </div>
        </section>

        <!-- ... projects section (PLAN-05b) below ... -->

    </div>
</div>
```

#### CSS Layout Specification

```css
/* === TIMELINE SECTION === */
.btp-timeline {
    background-color: var(--btp-bg-primary);
    padding: var(--btp-section-padding-y) 0;
}

.btp-container {
    max-width: var(--btp-max-width);
    margin: 0 auto;
    padding: 0 var(--btp-section-padding-x);
}

.btp-section-heading {
    font-family: var(--btp-font-display);
    font-size: var(--btp-font-size-h2);
    font-weight: 400;
    color: var(--btp-text-primary);
    margin-bottom: 48px;
    text-align: center;
}

/* --- Timeline Wrapper (relative container for the line) --- */
.btp-timeline-wrapper {
    position: relative;
    /* The line and progress bar are positioned absolutely within this */
}

/* --- Vertical Connecting Line (gray background) --- */
.btp-timeline-line {
    position: absolute;
    left: calc(50% - 1px);       /* Centered in the wrapper */
    top: 0;
    width: 3px;
    height: 100%;
    background-color: var(--btp-timeline-line-color);
    z-index: 0;
}

/* --- Gradient Progress Fill (tracks scroll) --- */
.btp-timeline-progress {
    position: absolute;
    left: calc(50% - 1px);
    top: 0;
    width: 3px;
    height: 0%;                  /* Controlled by JS; starts at 0 */
    background-image: var(--btp-gradient-timeline);
    z-index: 1;
    transition: height 100ms linear;
}

/* --- Each Timeline Item (3-column grid) --- */
.btp-timeline-item {
    display: grid;
    grid-template-columns: 1fr var(--btp-timeline-center-width) 1fr;
    grid-column-gap: 0;
    width: 100%;
    margin-top: 60px;
    margin-bottom: 60px;
    position: relative;
    z-index: 2;
}

.btp-timeline-item:first-child {
    margin-top: 0;
}

/* --- Date Column (left) --- */
.btp-timeline-date {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding-right: 24px;
}

.btp-timeline-datetext {
    position: sticky;
    top: 50vh;
    font-family: var(--btp-font-body);
    font-size: 32px;
    font-weight: 400;
    line-height: 1.4;
    text-align: right;
    color: var(--btp-text-muted);
    transition: color var(--btp-transition-medium) var(--btp-easing-standard);
}

.btp-timeline-datetext.active {
    color: var(--btp-text-primary);
}

/* --- Center Column (dot) --- */
.btp-timeline-dot {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.btp-timeline-circle {
    position: sticky;
    top: 50vh;
    width: var(--btp-timeline-dot-size);
    height: var(--btp-timeline-dot-size);
    border-radius: 50%;
    background-color: var(--btp-timeline-dot-inactive);
    transition: background-color var(--btp-transition-medium) var(--btp-easing-standard);
    z-index: 3;
}

.btp-timeline-circle.active {
    background-color: var(--btp-timeline-dot-active);
}

/* --- Content Column (right) --- */
.btp-timeline-content {
    padding-left: 24px;
}

.btp-timeline-description {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-body);
    line-height: var(--btp-line-height-body);
    color: var(--btp-text-muted);
    transition: color var(--btp-transition-medium) var(--btp-easing-standard);
}

.btp-timeline-description.active {
    color: var(--btp-text-primary);
}

.btp-timeline-image {
    width: 100%;
    max-width: 300px;
    margin-top: 16px;
    border-radius: 8px;
    box-shadow: var(--btp-card-shadow);
}
```

#### Responsive Behavior

```css
@media screen and (max-width: 991px) {
    .btp-timeline-datetext {
        font-size: 24px;
    }
}

@media screen and (max-width: 767px) {
    .btp-timeline-datetext {
        font-size: 20px;
    }
    .btp-timeline-item {
        margin-top: 40px;
        margin-bottom: 40px;
    }
}

@media screen and (max-width: 479px) {
    /* Collapse to single column: dot left, content right, date above content */
    .btp-timeline-item {
        grid-template-columns: var(--btp-timeline-dot-size) 1fr;
        grid-template-rows: auto auto;
        gap: 0 12px;
        margin-top: 32px;
        margin-bottom: 32px;
    }

    .btp-timeline-line,
    .btp-timeline-progress {
        left: calc(var(--btp-timeline-dot-size) / 2 - 1px);
    }

    .btp-timeline-date {
        grid-column: 2;
        grid-row: 1;
        justify-content: flex-start;
        padding-right: 0;
        margin-bottom: 4px;
    }

    .btp-timeline-datetext {
        position: static;
        font-size: 14px;
        font-weight: 600;
        text-align: left;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .btp-timeline-dot {
        grid-column: 1;
        grid-row: 1 / span 2;
        align-items: flex-start;
        padding-top: 4px;
    }

    .btp-timeline-circle {
        position: static;
    }

    .btp-timeline-content {
        grid-column: 2;
        grid-row: 2;
        padding-left: 0;
    }
}
```

#### Timeline Data Schema

Each timeline entry is rendered from this JSON structure. The data can be embedded as a `<script type="application/json">` block or inlined in HTML data attributes.

```json
{
    "timelineEntries": [
        {
            "id": "entry-1",
            "date": "January 2012",
            "sortOrder": 1,
            "description": "Started my journey at IIT Madras, pursuing a degree in Mechanical Engineering. This was where the analytical foundations were built.",
            "image": {
                "src": "assets/iit-madras.jpg",
                "alt": "IIT Madras campus",
                "width": 300,
                "height": 200
            }
        },
        {
            "id": "entry-2",
            "date": "June 2016",
            "sortOrder": 2,
            "description": "First role as a Production Engineer at Vedanta Resources. Learned the discipline of operations at scale.",
            "image": null
        }
    ]
}
```

**Schema definition:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier, used for `data-entry-id` attribute |
| `date` | string | Yes | Display date string (e.g., "January 2012", "Present") |
| `sortOrder` | integer | Yes | Chronological order (ascending) |
| `description` | string | Yes | Narrative text for this timeline entry |
| `image` | object or null | No | Optional image associated with this entry |
| `image.src` | string | Yes (if image) | Image file path |
| `image.alt` | string | Yes (if image) | Accessible alt text |
| `image.width` | integer | No | Intrinsic width for aspect ratio |
| `image.height` | integer | No | Intrinsic height for aspect ratio |

#### Integration with Sidebar Nav and View-Switching

The timeline lives inside `#whoami-view`. When `switchView('whoami')` is called:

1. The `#whoami-view` container gets `display: block` via the `.active` class
2. The `fadeIn` keyframe animation (lines 224-227 of existing CSS) fires, fading the entire view in with a 5px translateY over 300ms
3. The Intersection Observer for timeline items (PLAN-05e) is initialized on first view activation, not on page load, to avoid observing hidden elements
4. A `MutationObserver` or a patched `switchView()` function detects when `#whoami-view` gains the `.active` class and triggers observer initialization

The sidebar nav item for "Beyond the Papers" (`#nav-whoami`) remains unchanged. Its existing `onclick="switchView('whoami')"` handler requires no modification.

---

## PLAN-05b: Project Showcase Cards System

### Source Reference

The Webflow template's project cards (PLAN-02d) use a 2-column grid with saturated blur glow on hover (the `.selected-projects-effect` image with `filter: saturate(200%) blur(40px)`). Each card has an inline HSLA background color, thumbnail image, project type, project name, description, and a "View / Client / project" call-to-action.

### Adapted Design

The glow effect is reimplemented in pure CSS (no duplicate image required) using a `box-shadow` with large spread and the card's own accent color, plus a CSS `filter` transition.

#### HTML Structure

```html
<section class="btp-section btp-projects" id="btp-projects">
    <div class="btp-container">
        <h2 class="btp-section-heading">Selected Projects</h2>

        <div class="btp-projects-grid">
            <!-- Project Card 1 -->
            <a href="#" class="btp-project-card" data-btp-animate="fade-up"
               style="--card-accent: hsla(170, 84%, 34%, 1);">
                <div class="btp-project-thumbnail">
                    <img src="assets/project-1.jpg" alt="Project Name"
                         loading="lazy" width="600" height="400">
                </div>
                <div class="btp-project-details">
                    <span class="btp-project-type">Product Strategy</span>
                    <h3 class="btp-project-name">Project Title Here</h3>
                    <p class="btp-project-description">
                        A short description of the project, what the challenge was,
                        and the impact delivered.
                    </p>
                    <span class="btp-project-cta">View Project &rarr;</span>
                </div>
            </a>

            <!-- Project Card 2 ... N -->

        </div>
    </div>
</section>
```

#### CSS Layout Specification

```css
/* === PROJECTS SECTION === */
.btp-projects {
    background-color: var(--btp-bg-section-alt);
    padding: var(--btp-section-padding-y) 0;
}

/* --- Grid --- */
.btp-projects-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
}

/* --- Card (anchor element) --- */
.btp-project-card {
    position: relative;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    border-radius: var(--btp-card-radius);
    overflow: hidden;
    background-color: var(--btp-bg-primary);
    box-shadow: var(--btp-card-shadow);
    transition:
        box-shadow var(--btp-transition-medium) var(--btp-easing-standard),
        transform var(--btp-transition-medium) var(--btp-easing-standard);
}

.btp-project-card:hover {
    transform: translateY(-4px);
    box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.1),
        0 0 60px -10px var(--card-accent, rgba(0, 0, 0, 0.15));
    /* The var(--card-accent) creates the colored glow, replacing
       the Webflow saturated-blur duplicate image technique.
       Each card sets --card-accent via inline style. */
}

/* --- Thumbnail --- */
.btp-project-thumbnail {
    width: 100%;
    aspect-ratio: 3 / 2;
    overflow: hidden;
}

.btp-project-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--btp-transition-medium) var(--btp-easing-decelerate);
}

.btp-project-card:hover .btp-project-thumbnail img {
    transform: scale(1.04);
}

/* --- Details Panel --- */
.btp-project-details {
    display: flex;
    flex-direction: column;
    padding: 24px;
    flex-grow: 1;
    background-color: var(--card-accent, var(--md-sys-color-primary));
    color: #FFFFFF;
}

.btp-project-type {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-caption);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    opacity: 0.85;
    margin-bottom: 8px;
}

.btp-project-name {
    font-family: var(--btp-font-display);
    font-size: var(--btp-font-size-h3);
    font-weight: 400;
    margin-bottom: 8px;
    line-height: 1.3;
}

.btp-project-description {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-small);
    line-height: var(--btp-line-height-body);
    opacity: 0.85;
    margin-bottom: 16px;
    flex-grow: 1;
}

.btp-project-cta {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-small);
    font-weight: 600;
    align-self: flex-start;
    opacity: 0.7;
    transition: opacity var(--btp-transition-fast) var(--btp-easing-standard);
}

.btp-project-card:hover .btp-project-cta {
    opacity: 1;
}
```

#### Responsive Behavior

```css
@media screen and (max-width: 767px) {
    .btp-projects-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

@media screen and (max-width: 479px) {
    .btp-project-details {
        padding: 16px;
    }
    .btp-project-name {
        font-size: 16px;
    }
}

@media screen and (min-width: 1920px) {
    .btp-project-name {
        font-size: 28px;
    }
    .btp-project-description {
        font-size: 16px;
    }
}
```

#### Project Data Schema (JSON)

```json
{
    "projects": [
        {
            "id": "proj-1",
            "title": "YouTube User Experience",
            "type": "Prototyping and UX Design",
            "description": "Redesigned the YouTube mobile experience to improve content discovery for users in emerging markets.",
            "thumbnail": {
                "src": "assets/project-youtube.jpg",
                "alt": "YouTube UX project thumbnail"
            },
            "accentColor": "hsla(170, 84%, 34%, 1)",
            "href": "https://example.com/project-1",
            "openInNewTab": true,
            "sortOrder": 1
        },
        {
            "id": "proj-2",
            "title": "Marketplace Growth Strategy",
            "type": "Product Strategy",
            "description": "Led marketplace supply-side growth from 0 to 10K vendors in 6 months.",
            "thumbnail": {
                "src": "assets/project-marketplace.jpg",
                "alt": "Marketplace growth project"
            },
            "accentColor": "hsla(349, 73%, 44%, 1)",
            "href": null,
            "openInNewTab": false,
            "sortOrder": 2
        }
    ]
}
```

**Schema definition:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `title` | string | Yes | Project display title |
| `type` | string | Yes | Category/type label (e.g., "UX Design", "Product Strategy") |
| `description` | string | Yes | 1-2 sentence description |
| `thumbnail.src` | string | Yes | Thumbnail image path |
| `thumbnail.alt` | string | Yes | Alt text |
| `accentColor` | string (CSS color) | Yes | HSLA/hex color for the details panel background and hover glow |
| `href` | string or null | No | Link URL. If null, card is not clickable |
| `openInNewTab` | boolean | No | If true, `target="_blank" rel="noopener"` |
| `sortOrder` | integer | Yes | Display order |

#### Glow Effect: Webflow Extraction vs. Vanilla CSS Approach

**Webflow original (PLAN-02d):** Uses a duplicate `<img>` element positioned absolutely behind the card with `opacity: 0; filter: saturate(200%) blur(40px); transform: translate(0px, 24px)`. On hover, Webflow IX2 animates opacity to 1. This requires a real duplicate image element and the IX2 runtime.

**Linkright adaptation:** Uses `box-shadow` with the card's `--card-accent` CSS custom property:

```css
box-shadow: 0 0 60px -10px var(--card-accent);
```

This produces a similar colored glow without any duplicate image or JS interaction engine. The `60px` blur and `-10px` spread approximate the Webflow `blur(40px)` effect. The color is derived from the same HSLA accent that colors the details panel, ensuring visual consistency. The `saturate(200%)` amplification from Webflow is not needed because the glow color is already at full saturation.

Performance advantage: no duplicate image compositing, no JS hover listeners, pure CSS `:hover` state.

---

## PLAN-05c: Hero Section with Rotating Qualities

### Source Reference

The Webflow hero (PLAN-02a) uses a 2-column CSS Grid (`4fr 1fr`) with "Welcome!" subtext, "I am" heading, a gradient-text name, and an IX2-powered infinite horizontal scroll carousel. The carousel uses `translate3d` animations on the `.loop-content` div, with duplicate `.content-container` blocks for seamless looping.

### Adapted Design

The hero section is the first thing visible in the Beyond the Papers view. It replaces the Webflow hero's 2-column layout with a centered layout that better fits the single-column scrolling context of the portfolio view.

#### HTML Structure

```html
<section class="btp-section btp-hero" id="btp-hero">
    <div class="btp-container">
        <div class="btp-hero-content">
            <span class="btp-hero-welcome">Beyond the Papers</span>
            <h1 class="btp-hero-heading">
                I am
                <span class="btp-hero-name">Satvik Jain</span>
            </h1>

            <!-- Rotating Qualities Carousel -->
            <div class="btp-carousel-wrapper" aria-label="Personal qualities">
                <div class="btp-carousel-track">
                    <!-- Set 1 (original) -->
                    <div class="btp-carousel-set">
                        <span class="btp-quality">Product Manager</span>
                        <span class="btp-quality">Signal Engineer</span>
                        <span class="btp-quality">Systems Thinker</span>
                        <span class="btp-quality">Storyteller</span>
                    </div>
                    <!-- Set 2 (duplicate for seamless loop) -->
                    <div class="btp-carousel-set">
                        <span class="btp-quality">Product Manager</span>
                        <span class="btp-quality">Signal Engineer</span>
                        <span class="btp-quality">Systems Thinker</span>
                        <span class="btp-quality">Storyteller</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Optional: hero image/avatar -->
        <div class="btp-hero-image">
            <img src="assets/hero-avatar.png" alt="Personal photo"
                 loading="eager" width="280" height="280">
        </div>
    </div>
</section>
```

#### CSS Specification

```css
/* === HERO SECTION === */
.btp-hero {
    background-color: var(--btp-bg-primary);
    padding: 80px 0 60px 0;
}

.btp-hero .btp-container {
    display: flex;
    align-items: center;
    gap: 40px;
}

.btp-hero-content {
    flex: 1;
}

.btp-hero-welcome {
    display: block;
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-caption);
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--btp-text-secondary);
    margin-bottom: 12px;
}

.btp-hero-heading {
    font-family: var(--btp-font-display);
    font-size: var(--btp-font-size-hero);
    font-weight: 400;
    line-height: 1.2;
    color: var(--btp-text-primary);
    margin-bottom: 4px;
}

.btp-hero-name {
    display: block;
    background-image: var(--btp-gradient-name);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: calc(var(--btp-font-size-hero) * 1.1);
    line-height: 1.2;
}

/* --- Hero Image (Optional Avatar) --- */
.btp-hero-image {
    flex-shrink: 0;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.btp-hero-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

#### Rotating Qualities Carousel -- CSS Keyframe Implementation

The Webflow IX2 infinite scroll is replaced with a pure CSS `@keyframes` animation. No JavaScript is required for the animation itself.

**Mechanism:** The `.btp-carousel-track` contains two identical `.btp-carousel-set` blocks laid out in a horizontal flex row. The track is animated to translate left by exactly 50% (the width of one set), then resets. Because both sets have identical content, the reset is visually seamless.

```css
/* --- Carousel Wrapper (viewport) --- */
.btp-carousel-wrapper {
    overflow: hidden;
    width: 60%;
    margin-top: 24px;
}

/* --- Carousel Track (animated container) --- */
.btp-carousel-track {
    display: flex;
    width: max-content;
    animation: btp-carousel-scroll 20s linear infinite;
}

@keyframes btp-carousel-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
    /* -50% = slides exactly one .btp-carousel-set width,
       then resets seamlessly because set 2 is identical to set 1 */
}

/* Pause animation on hover for readability */
.btp-carousel-wrapper:hover .btp-carousel-track {
    animation-play-state: paused;
}

/* Pause when user prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
    .btp-carousel-track {
        animation: none;
    }
    /* Show items statically when motion is reduced */
    .btp-carousel-set:last-child {
        display: none;
    }
    .btp-carousel-wrapper {
        width: 100%;
    }
}

/* --- Carousel Set (group of items, duplicated for loop) --- */
.btp-carousel-set {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

/* --- Individual Quality Label --- */
.btp-quality {
    margin-right: 30px;
    font-family: var(--btp-font-accent);
    font-size: 18px;
    font-style: italic;
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    background-image: var(--btp-gradient-qualities);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

#### Responsive Behavior

```css
@media screen and (max-width: 991px) {
    .btp-hero .btp-container {
        flex-direction: column;
        text-align: center;
    }

    .btp-hero-image {
        width: 200px;
        height: 200px;
        order: -1;  /* Image above text on tablet */
    }

    .btp-carousel-wrapper {
        width: 80%;
        margin-left: auto;
        margin-right: auto;
    }

    .btp-quality {
        font-size: 15px;
    }
}

@media screen and (max-width: 479px) {
    .btp-hero {
        padding: 40px 0 32px 0;
    }

    .btp-hero-image {
        width: 160px;
        height: 160px;
    }

    .btp-carousel-wrapper {
        width: 100%;
    }

    .btp-quality {
        font-size: 12px;
        margin-right: 20px;
    }
}
```

#### Content Structure for Qualities

The qualities list is simple inline HTML. No separate data file is needed. The content must be duplicated exactly between the two `.btp-carousel-set` blocks. If the content is generated programmatically, the duplication can be done with a single JS `cloneNode(true)`:

```javascript
// One-time initialization (not animation)
const originalSet = document.querySelector('.btp-carousel-set');
const clone = originalSet.cloneNode(true);
originalSet.parentNode.appendChild(clone);
```

#### Webflow IX2 vs. CSS Keyframe -- Behavioral Difference

| Aspect | Webflow IX2 (original) | CSS @keyframes (Linkright) |
|--------|----------------------|---------------------------|
| Engine | JS runtime updating `translate3d` inline | Browser compositing layer |
| Performance | Main thread JS, `will-change: transform` | GPU-composited, no JS |
| Speed control | Fixed via IX2 config | `animation-duration` (20s default) |
| Pause behavior | Not built in | `:hover` pauses via `animation-play-state` |
| Accessibility | No reduced-motion support | `prefers-reduced-motion` query disables |
| Dependencies | webflow.js (~150KB) | Zero |

---

## PLAN-05d: Experience, Hobbies, Contact, and Footer Sections

### Source Reference

The Webflow template (PLAN-02d) has an Experience section with a 2-column grid (`grid-8`), company logos, role titles, and descriptions. The contact section uses a Webflow form. The footer uses a purple background (`#6057c3`) with social links.

### Adapted Design

The contact section is redesigned as inline contact information (not a form), matching the portfolio's lightweight approach. The footer uses the existing `--md-sys-color-primary` as the accent.

#### 1. Experience Section

```html
<section class="btp-section btp-experience" id="btp-experience">
    <div class="btp-container">
        <h2 class="btp-section-heading">Experience</h2>

        <div class="btp-experience-grid">
            <!-- Experience Item 1 -->
            <div class="btp-experience-item" data-btp-animate="fade-up">
                <div class="btp-experience-logo">
                    <img src="assets/company-logo.png" alt="Company Name"
                         loading="lazy" width="80" height="80">
                </div>
                <h3 class="btp-experience-company">Company Name</h3>
                <span class="btp-experience-role">Product Manager</span>
                <p class="btp-experience-description">
                    Brief narrative about the role, key contributions,
                    and what made this experience meaningful.
                </p>
            </div>

            <!-- Experience Item 2 -->
            <div class="btp-experience-item" data-btp-animate="fade-up">
                <!-- Same structure -->
            </div>
        </div>
    </div>
</section>
```

```css
/* === EXPERIENCE SECTION === */
.btp-experience {
    background-color: var(--btp-bg-primary);
    padding: var(--btp-section-padding-y) 0;
}

.btp-experience-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}

.btp-experience-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 24px;
}

.btp-experience-logo {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btp-experience-logo img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.btp-experience-company {
    font-family: var(--btp-font-display);
    font-size: var(--btp-font-size-h3);
    font-weight: 400;
    color: var(--btp-text-primary);
    margin-bottom: 4px;
}

.btp-experience-role {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-small);
    font-weight: 400;
    color: var(--btp-text-secondary);
    margin-bottom: 12px;
}

.btp-experience-description {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-body);
    line-height: var(--btp-line-height-body);
    color: var(--btp-text-secondary);
    max-width: 360px;
}

@media screen and (max-width: 767px) {
    .btp-experience-grid {
        grid-template-columns: 1fr;
        gap: 32px;
    }
}
```

**Experience Data Schema:**

```json
{
    "experience": [
        {
            "id": "exp-1",
            "company": "Company Name",
            "role": "Product Manager",
            "description": "Brief narrative about this role.",
            "logo": {
                "src": "assets/company-logo.png",
                "alt": "Company Name logo"
            },
            "sortOrder": 1
        }
    ]
}
```

#### 2. Hobbies/Interests Section

```html
<section class="btp-section btp-hobbies" id="btp-hobbies">
    <div class="btp-container">
        <h2 class="btp-section-heading">When I'm Not Working</h2>

        <div class="btp-hobbies-grid">
            <div class="btp-hobby-item" data-btp-animate="fade-up">
                <span class="btp-hobby-emoji" aria-hidden="true">&#127941;</span>
                <h3 class="btp-hobby-title">Gaming</h3>
                <p class="btp-hobby-description">
                    Competitive FPS player and strategy game enthusiast.
                </p>
            </div>

            <div class="btp-hobby-item" data-btp-animate="fade-up">
                <span class="btp-hobby-emoji" aria-hidden="true">&#128218;</span>
                <h3 class="btp-hobby-title">Reading</h3>
                <p class="btp-hobby-description">
                    Non-fiction, systems thinking, and behavioral economics.
                </p>
            </div>

            <!-- More hobby items -->
        </div>
    </div>
</section>
```

```css
/* === HOBBIES SECTION === */
.btp-hobbies {
    background-color: var(--btp-bg-section-alt);
    padding: var(--btp-section-padding-y) 0;
}

.btp-hobbies-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.btp-hobby-item {
    text-align: center;
    padding: 32px 20px;
    border-radius: var(--btp-card-radius);
    background-color: var(--btp-bg-primary);
    box-shadow: var(--btp-card-shadow);
    transition: transform var(--btp-transition-fast) var(--btp-easing-standard);
}

.btp-hobby-item:hover {
    transform: translateY(-2px);
}

.btp-hobby-emoji {
    font-size: 40px;
    display: block;
    margin-bottom: 12px;
}

.btp-hobby-title {
    font-family: var(--btp-font-display);
    font-size: var(--btp-font-size-h3);
    font-weight: 400;
    color: var(--btp-text-primary);
    margin-bottom: 8px;
}

.btp-hobby-description {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-small);
    line-height: var(--btp-line-height-body);
    color: var(--btp-text-secondary);
}

@media screen and (max-width: 767px) {
    .btp-hobbies-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media screen and (max-width: 479px) {
    .btp-hobbies-grid {
        grid-template-columns: 1fr;
    }
}
```

#### 3. Contact Section (Inline, Not Form-Based)

The Webflow template uses a full contact form with Webflow form handling and reCAPTCHA. This is replaced with a simple inline contact block that reuses the contact information from the existing resume header, avoiding a duplicate data-maintenance burden.

```html
<section class="btp-section btp-contact" id="btp-contact">
    <div class="btp-container">
        <h2 class="btp-section-heading">Let's Connect</h2>
        <p class="btp-contact-description">
            Interested in working together or just want to say hello?
            Reach out through any of these channels.
        </p>

        <div class="btp-contact-grid">
            <a href="mailto:placeholder@google.com" class="btp-contact-item">
                <span class="btp-contact-icon" aria-hidden="true">&#9993;</span>
                <span class="btp-contact-label">Email</span>
                <span class="btp-contact-value">placeholder@google.com</span>
            </a>

            <a href="https://linkedin.com/in/username" target="_blank"
               rel="noopener" class="btp-contact-item">
                <span class="btp-contact-icon" aria-hidden="true">&#128279;</span>
                <span class="btp-contact-label">LinkedIn</span>
                <span class="btp-contact-value">linkedin.com/in/username</span>
            </a>

            <a href="https://portfolio.me/" target="_blank"
               rel="noopener" class="btp-contact-item">
                <span class="btp-contact-icon" aria-hidden="true">&#127760;</span>
                <span class="btp-contact-label">Portfolio</span>
                <span class="btp-contact-value">portfolio.me</span>
            </a>
        </div>
    </div>
</section>
```

```css
/* === CONTACT SECTION === */
.btp-contact {
    background-color: var(--btp-bg-primary);
    padding: var(--btp-section-padding-y) 0;
    text-align: center;
}

.btp-contact-description {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-body);
    line-height: var(--btp-line-height-body);
    color: var(--btp-text-secondary);
    max-width: 500px;
    margin: 0 auto 32px auto;
}

.btp-contact-grid {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
}

.btp-contact-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--btp-text-primary);
    padding: 24px 32px;
    border-radius: var(--btp-card-radius);
    border: 1px solid var(--md-sys-color-outline);
    transition:
        border-color var(--btp-transition-fast) var(--btp-easing-standard),
        box-shadow var(--btp-transition-fast) var(--btp-easing-standard);
    min-width: 200px;
}

.btp-contact-item:hover {
    border-color: var(--md-sys-color-primary);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.btp-contact-icon {
    font-size: 28px;
    margin-bottom: 8px;
}

.btp-contact-label {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-caption);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--btp-text-muted);
    margin-bottom: 4px;
}

.btp-contact-value {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-small);
    color: var(--md-sys-color-primary);
    font-weight: 500;
}

@media screen and (max-width: 479px) {
    .btp-contact-grid {
        flex-direction: column;
        align-items: center;
    }

    .btp-contact-item {
        width: 100%;
        max-width: 300px;
    }
}
```

#### 4. Footer Design

```html
<footer class="btp-footer" id="btp-footer">
    <div class="btp-container">
        <div class="btp-footer-content">
            <span class="btp-footer-name">Satvik Jain</span>
            <p class="btp-footer-tagline">
                Signal over noise. Always.
            </p>
            <div class="btp-footer-social">
                <a href="https://linkedin.com/in/username"
                   target="_blank" rel="noopener"
                   class="btp-social-link" aria-label="LinkedIn">
                    <!-- Inline SVG icon: LinkedIn -->
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
                <a href="https://github.com/username"
                   target="_blank" rel="noopener"
                   class="btp-social-link" aria-label="GitHub">
                    <!-- Inline SVG icon: GitHub -->
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                </a>
                <!-- Add more social links as needed -->
            </div>
        </div>
    </div>
</footer>
```

```css
/* === FOOTER === */
.btp-footer {
    background-color: var(--md-sys-color-primary);
    padding: 40px 0;
    text-align: center;
}

.btp-footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.btp-footer-name {
    font-family: var(--btp-font-display);
    font-size: var(--btp-font-size-h3);
    font-weight: 400;
    color: #FFFFFF;
}

.btp-footer-tagline {
    font-family: var(--btp-font-body);
    font-size: var(--btp-font-size-small);
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 16px;
}

.btp-footer-social {
    display: flex;
    gap: 16px;
    align-items: center;
}

.btp-social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.8);
    transition:
        color var(--btp-transition-fast) var(--btp-easing-standard),
        background-color var(--btp-transition-fast) var(--btp-easing-standard);
}

.btp-social-link:hover {
    color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.15);
}
```

#### Section Stacking Within the View

All sections stack vertically within `.btp-view` with no gaps between them. Alternating `background-color` values create visual separation:

| Section | Background | Rationale |
|---------|-----------|-----------|
| `.btp-hero` | `#FFFFFF` (white) | Clean opening |
| `.btp-timeline` | `#FFFFFF` (white) | Seamless continuation from hero |
| `.btp-projects` | `var(--md-sys-color-surface-container)` | Subtle contrast shift |
| `.btp-experience` | `#FFFFFF` (white) | Back to white |
| `.btp-hobbies` | `var(--md-sys-color-surface-container)` | Alternating |
| `.btp-contact` | `#FFFFFF` (white) | Clean pre-footer |
| `.btp-footer` | `var(--md-sys-color-primary)` | Bold brand closure |

---

## PLAN-05e: Animation System for Beyond the Papers

### Design Principles

1. **Zero external animation libraries** -- all animations use the Intersection Observer API and CSS transitions/keyframes
2. **Mobile-first performance** -- all animated properties are `opacity` and `transform` only (GPU-composited, no layout triggers)
3. **Respect `prefers-reduced-motion`** -- all scroll-triggered animations and the carousel are disabled
4. **Lazy initialization** -- observers are only created when `#whoami-view` becomes active

### 1. Intersection Observer -- Scroll-Triggered Fade Animations

Any element with the `data-btp-animate` attribute will be observed and animated when it enters the viewport.

#### Supported Animation Types

| `data-btp-animate` value | Initial State | Visible State | Description |
|--------------------------|--------------|---------------|-------------|
| `fade-up` | `opacity: 0; translateY(24px)` | `opacity: 1; translateY(0)` | Standard content reveal |
| `fade-in` | `opacity: 0` | `opacity: 1` | Subtle appear (for images) |

#### CSS Classes

```css
/* === SCROLL ANIMATION INITIAL STATES === */
[data-btp-animate] {
    opacity: 0;
    transition:
        opacity 600ms var(--btp-easing-decelerate),
        transform 600ms var(--btp-easing-decelerate);
}

[data-btp-animate="fade-up"] {
    transform: translateY(24px);
}

[data-btp-animate="fade-in"] {
    /* opacity: 0 is already set above */
}

/* === VISIBLE STATE (class added by IntersectionObserver) === */
[data-btp-animate].btp-visible {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* === REDUCED MOTION: skip animations, show everything immediately === */
@media (prefers-reduced-motion: reduce) {
    [data-btp-animate] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
    }
}
```

#### JavaScript Implementation

```javascript
/**
 * Beyond the Papers -- Animation Controller
 * Zero dependencies. Uses IntersectionObserver API.
 */
(function btpAnimations() {
    'use strict';

    // === CONFIG ===
    const SCROLL_THRESHOLD = 0.15;         // Trigger when 15% of element is visible
    const TIMELINE_ACTIVE_OFFSET = 0.45;   // Timeline items activate at 45% viewport height
    const STAGGER_DELAY_MS = 80;           // Stagger delay between sibling elements

    let observerInitialized = false;
    let scrollAnimObserver = null;
    let timelineObserver = null;

    // === 1. SCROLL-TRIGGERED FADE ANIMATIONS ===

    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show everything immediately
            document.querySelectorAll('[data-btp-animate]').forEach(el => {
                el.classList.add('btp-visible');
            });
            return;
        }

        scrollAnimObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add stagger delay for sibling elements
                    const parent = entry.target.parentElement;
                    const siblings = parent.querySelectorAll('[data-btp-animate]');
                    const index = Array.from(siblings).indexOf(entry.target);
                    const delay = index * STAGGER_DELAY_MS;

                    setTimeout(() => {
                        entry.target.classList.add('btp-visible');
                    }, delay);

                    // Stop observing once animated (one-shot)
                    scrollAnimObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: SCROLL_THRESHOLD,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('[data-btp-animate]').forEach(el => {
            scrollAnimObserver.observe(el);
        });
    }

    // === 2. TIMELINE SCROLL TRACKING ===

    function initTimelineTracking() {
        const wrapper = document.querySelector('.btp-timeline-wrapper');
        const progress = document.querySelector('.btp-timeline-progress');
        const items = document.querySelectorAll('.btp-timeline-item');

        if (!wrapper || !progress || items.length === 0) return;

        // 2a. Progress bar height tracking
        function updateProgressBar() {
            const wrapperRect = wrapper.getBoundingClientRect();
            const wrapperTop = wrapperRect.top;
            const wrapperHeight = wrapperRect.height;
            const viewportMid = window.innerHeight * TIMELINE_ACTIVE_OFFSET;

            // How far the viewport midpoint has traveled through the wrapper
            const scrolled = viewportMid - wrapperTop;
            const pct = Math.max(0, Math.min(1, scrolled / wrapperHeight));

            progress.style.height = (pct * 100) + '%';
        }

        // 2b. Timeline item activation (color change)
        if ('IntersectionObserver' in window) {
            timelineObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const circle = entry.target.querySelector('.btp-timeline-circle');
                    const datetext = entry.target.querySelector('.btp-timeline-datetext');
                    const desc = entry.target.querySelector('.btp-timeline-description');

                    if (entry.isIntersecting) {
                        circle?.classList.add('active');
                        datetext?.classList.add('active');
                        desc?.classList.add('active');
                    }
                    // Note: we do NOT remove 'active' when scrolling past.
                    // Items stay activated (like the Webflow original).
                });
            }, {
                // rootMargin: trigger when item reaches ~45% of viewport height
                rootMargin: '-45% 0px -45% 0px'
            });

            items.forEach(item => timelineObserver.observe(item));
        }

        // 2c. Scroll listener for progress bar (throttled via rAF)
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgressBar();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial calculation
        updateProgressBar();
    }

    // === 3. VIEW ACTIVATION HOOK ===
    // Only initialize when #whoami-view becomes visible

    function initOnViewActivation() {
        if (observerInitialized) return;

        const whoamiView = document.getElementById('whoami-view');
        if (!whoamiView) return;

        // Check if already active (default state in template)
        if (whoamiView.classList.contains('active')) {
            bootstrap();
            return;
        }

        // Otherwise, watch for class changes
        const viewObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    whoamiView.classList.contains('active')) {
                    bootstrap();
                    viewObserver.disconnect();
                    break;
                }
            }
        });

        viewObserver.observe(whoamiView, { attributes: true });
    }

    function bootstrap() {
        if (observerInitialized) return;
        observerInitialized = true;

        // Small delay to allow CSS transitions to not fight
        // with the fadeIn animation on .view-container
        setTimeout(() => {
            initScrollAnimations();
            initTimelineTracking();
        }, 350); // 350ms > the 300ms fadeIn on .view-container
    }

    // === 4. INITIALIZATION ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnViewActivation);
    } else {
        initOnViewActivation();
    }

})();
```

### 2. CSS-Only Hover Transitions

All hover effects use CSS transitions only. No JavaScript hover listeners.

```css
/* === HOVER STATES (CSS-only, no JS) === */

/* Project card lift + glow */
.btp-project-card:hover {
    transform: translateY(-4px);
    box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.1),
        0 0 60px -10px var(--card-accent, rgba(0, 0, 0, 0.15));
}

/* Project thumbnail zoom */
.btp-project-card:hover .btp-project-thumbnail img {
    transform: scale(1.04);
}

/* Hobby card micro-lift */
.btp-hobby-item:hover {
    transform: translateY(-2px);
}

/* Contact item border highlight */
.btp-contact-item:hover {
    border-color: var(--md-sys-color-primary);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* Social link background fill */
.btp-social-link:hover {
    color: #FFFFFF;
    background-color: rgba(255, 255, 255, 0.15);
}

/* Carousel pause on hover */
.btp-carousel-wrapper:hover .btp-carousel-track {
    animation-play-state: paused;
}

/* All hover transitions respect reduced motion */
@media (prefers-reduced-motion: reduce) {
    .btp-project-card,
    .btp-hobby-item,
    .btp-contact-item,
    .btp-social-link {
        transition: none !important;
    }
}
```

### 3. Timeline Progress Bar Implementation Detail

The progress bar in the Webflow template (PLAN-02c) uses two elements:

1. **`.progress_animated`** -- a `position: absolute; width: 3px; height: 100%` gray line
2. **`.div-block-18`** -- a `position: fixed; bottom: 50vh; height: 50vh` gradient fill that appears to track scroll

The Webflow approach uses `position: fixed` on the gradient fill, which makes it always visible at viewport center regardless of scroll position. This is a clever visual trick but causes rendering issues when the timeline section is not in view.

**Linkright approach:** Use a single absolutely-positioned gradient bar whose `height` is dynamically set by JavaScript via `requestAnimationFrame`-throttled scroll tracking. This is more accurate, performs better, and has no z-index stacking issues outside the timeline section.

```
Scroll position          Progress bar height
==================       ==================
Before timeline          0%
Enter timeline           0% → growing
Mid-timeline             ~50%
End of timeline          100%
After timeline           100% (capped)
```

The gradient itself uses the Sync-harmonized palette:

```css
.btp-timeline-progress {
    background-image: linear-gradient(180deg,
        #0E9E8E,      /* Sync teal -- top */
        #D9705A 51%,   /* Sync coral -- middle */
        #C8973A        /* Sync gold -- bottom */
    );
}
```

This replaces the Webflow original's `linear-gradient(180deg, #833ab4, #fd1d1d 51%, #fcb045)` (purple-red-orange) with Sync brand colors while maintaining the same visual rhythm of a 3-stop vertical gradient.

### 4. 3D Image Grid / Parallax Decision

The Webflow template's 3D image grid (PLAN-02b) uses `perspective: 1000px`, `rotateX(26deg)`, `rotateZ(9.5deg)`, and per-image scroll-driven `translate3d` animations. This is the most computationally expensive element in the template.

**Decision: OMIT the 3D image grid.**

Rationale:
1. The 3D grid is a visual showcase piece designed for a standalone portfolio site. In the Linkright context, the Beyond the Papers view is one of four views in an application-like SPA -- a 3D parallax section would feel out of place.
2. The scroll-driven parallax requires either GSAP ScrollTrigger (external dependency) or a custom rAF-based scroll handler applying inline transforms to 6+ images, which is expensive on mobile.
3. The hero section with the rotating carousel and the timeline section already provide sufficient visual interest.
4. If a visual showcase is needed, the project cards grid (PLAN-05b) serves that purpose with static images and hover effects.

If parallax is desired in the future, a lightweight single-image parallax can be achieved with:

```css
.btp-parallax-image {
    background-image: url('...');
    background-attachment: fixed;    /* Simple CSS parallax */
    background-position: center;
    background-size: cover;
    height: 300px;
}

/* Disable on mobile where background-attachment: fixed has issues */
@media screen and (max-width: 991px) {
    .btp-parallax-image {
        background-attachment: scroll;
    }
}
```

### 5. Performance Considerations

#### Mobile Performance Guardrails

| Concern | Mitigation |
|---------|-----------|
| Scroll jank from timeline tracking | `requestAnimationFrame` throttling with `passive: true` scroll listener |
| Too many Intersection Observers | Two observers total (scroll-anim + timeline), not per-element |
| Image loading blocking render | `loading="lazy"` on all below-fold images; `loading="eager"` only on hero |
| CSS animation compositing | All animated properties are `opacity` and `transform` only -- no `width`, `height`, `top`, `left`, or `box-shadow` during scroll |
| Carousel CPU usage | CSS `@keyframes` animation uses compositor thread; no JS polling |
| Hover glow `box-shadow` | `box-shadow` transitions only on `:hover` (user-initiated, not scroll-driven) -- acceptable |
| Font loading flash | `font-display: swap` on all Google Fonts links |
| Observer memory leaks | `unobserve()` after one-shot animations; disconnect observers if view deactivates |

#### Paint Metrics Target

| Metric | Target | How |
|--------|--------|-----|
| Largest Contentful Paint | < 2.5s | Hero image is `loading="eager"`, all else is lazy |
| Cumulative Layout Shift | < 0.1 | All images have explicit `width`/`height`; no dynamic content injection |
| Interaction to Next Paint | < 200ms | No JS blocks main thread during scroll |

#### Reduced Motion Compliance

All motion is gated behind `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
    /* Carousel: stop animation */
    .btp-carousel-track { animation: none; }

    /* Scroll reveals: show immediately */
    [data-btp-animate] {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
    }

    /* Hover effects: instant, no transition */
    .btp-project-card,
    .btp-hobby-item,
    .btp-contact-item,
    .btp-social-link {
        transition: none !important;
    }

    /* Timeline: show all items as active */
    .btp-timeline-circle { background-color: var(--btp-timeline-dot-active); }
    .btp-timeline-datetext { color: var(--btp-text-primary); }
    .btp-timeline-description { color: var(--btp-text-primary); }
}
```

---

## Integration Summary: How This Fits Into the Existing Portfolio

### Modified Files

**1. Portfolio HTML** (`Satvik Jain - Portfolio & CV.html`)

Changes required:
- **`<head>`**: Add Google Fonts link for DM Serif Display and Inter
- **`:root` block** (lines 91-120): Add all `--btp-*` CSS custom properties
- **`<style>` block**: Add all `.btp-*` CSS rules after the existing resume styles (after line 301)
- **`#whoami-view` content** (lines 496-521): Replace the existing `.page` wrapper and placeholder with the `.btp-view` container and all section HTML
- **`<script>` block** (lines 525-535): Add the animation controller IIFE after the existing `switchView()` function

### Unchanged Architecture

| Component | Status | Notes |
|-----------|--------|-------|
| Sidebar (`<aside class="sidebar">`) | **Unchanged** | All 4 nav items remain |
| `switchView()` function | **Unchanged** | Still toggles `.active` class |
| `#resume-view` | **Unchanged** | Resume A4 page unaffected |
| `#whyme-view` | **Unchanged** | Value Prop placeholder unaffected |
| `#whygoogle-view` | **Unchanged** | Strategic Fit placeholder unaffected |
| `@media print` rules | **Unchanged** | Still hides all views except resume |
| CSS variable system | **Extended** | New `--btp-*` vars added; existing vars untouched |

### The `.btp-view` Container (replaces `.page` for View 4)

```css
.btp-view {
    width: 100%;
    max-width: 100%;
    background: var(--btp-bg-primary);
    /* No fixed height -- scrolls naturally */
    /* No overflow: hidden -- content flows */
    /* No A4 dimensions -- this is a web view, not a print view */
}
```

This is the critical structural difference from the other three views. The Resume, Value Prop, and Strategic Fit views all use `<div class="page">` which is locked to `210mm x 297mm` with `overflow: hidden`. The Beyond the Papers view breaks out of this constraint because it is a scrollable web experience, not a printable document.

### Sidebar Scroll Behavior Note

The sidebar is `position: fixed; height: 100vh`. The main content area (`.main-content`) already has `margin-left: 300px` and the body has `overflow-y: scroll`. This means the Beyond the Papers scrollable content will scroll naturally within the main content area while the sidebar remains fixed. No changes to the sidebar or main-content layout are needed.

### Data Flow Summary

All content for the Beyond the Papers view can be either:

1. **Hardcoded in HTML** (simplest, matching the existing approach where resume content is hardcoded in the template), or
2. **Injected from a JSON data source** using the schemas defined in each sub-task, rendered at build time by the Sync deployment pipeline

The recommended approach for Release 3 is option 1 (hardcoded HTML), with the JSON schemas documented here as the contract for future programmatic generation.

---

## Appendix A: Complete HTML Skeleton

For quick reference, this is the complete replacement content for `#whoami-view`:

```html
<div id="whoami-view" class="view-container">
    <div class="btp-view">
        <!-- PLAN-05c: Hero -->
        <section class="btp-section btp-hero" id="btp-hero">...</section>

        <!-- PLAN-05a: Timeline -->
        <section class="btp-section btp-timeline" id="btp-timeline">...</section>

        <!-- PLAN-05b: Projects -->
        <section class="btp-section btp-projects" id="btp-projects">...</section>

        <!-- PLAN-05d: Experience -->
        <section class="btp-section btp-experience" id="btp-experience">...</section>

        <!-- PLAN-05d: Hobbies -->
        <section class="btp-section btp-hobbies" id="btp-hobbies">...</section>

        <!-- PLAN-05d: Contact -->
        <section class="btp-section btp-contact" id="btp-contact">...</section>

        <!-- PLAN-05d: Footer -->
        <footer class="btp-footer" id="btp-footer">...</footer>
    </div>
</div>
```

## Appendix B: Webflow-to-Linkright Class Mapping

| Webflow Class (PLAN-02) | Linkright Class (PLAN-05) | Notes |
|--------------------------|---------------------------|-------|
| `.section.hero` | `.btp-hero` | Centered layout vs. 2-column |
| `.heading.name` | `.btp-hero-name` | Same gradient text technique |
| `.wrapper` (carousel) | `.btp-carousel-wrapper` | CSS keyframes vs. IX2 |
| `.qualities` | `.btp-quality` | Same gradient text, different colors |
| `.animated_timeline` | `.btp-timeline` | Same 3-col grid structure |
| `.items` | `.btp-timeline-item` | Same grid-template-columns pattern |
| `.ani_leftdate` | `.btp-timeline-date` | Same sticky positioning |
| `.circle-timeline` | `.btp-timeline-circle` | Same sticky + color transition |
| `.ani_rightdesc` | `.btp-timeline-content` | Same layout |
| `.progress_animated` | `.btp-timeline-line` | Absolute line, JS-controlled fill |
| `.div-block-18` | `.btp-timeline-progress` | Absolute vs. fixed positioning |
| `.selected-projects-list` | `.btp-projects-grid` | Same 2-col grid |
| `.collection-item` | `.btp-project-card` | Anchor-based card |
| `.selected-projects-effect` | (CSS box-shadow on hover) | No duplicate image needed |
| `.grid-8` | `.btp-experience-grid` | Same 2-col pattern |
| `.form-block` | `.btp-contact` | Inline links vs. form |
| `.w-nav` | (existing sidebar) | Sidebar nav, not top navbar |

## Appendix C: Dependencies Introduced

| Dependency | Type | Size | Purpose |
|------------|------|------|---------|
| DM Serif Display (Google Fonts) | External CSS/font | ~20KB WOFF2 | Display headings |
| Inter (Google Fonts) | External CSS/font | ~50KB WOFF2 | Body text, UI labels |
| Intersection Observer API | Browser API | 0KB | Scroll-triggered animations |
| MutationObserver API | Browser API | 0KB | View activation detection |

No JavaScript libraries, no CSS frameworks, no build tools. Total additional payload: ~70KB (fonts, cached after first load).
