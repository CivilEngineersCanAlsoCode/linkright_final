I now have all the data needed to produce the comprehensive audit. Here is the full report.

---

# COMPREHENSIVE TECHNICAL AUDIT: Satvik Jain - Portfolio & CV HTML Template

**Audit File:** `/Users/satvikjain/Downloads/sync/Satvik Jain - Portfolio & CV_files/Satvik Jain - Portfolio & CV.html`
**External CSS:** `/Users/satvikjain/Downloads/sync/Satvik Jain - Portfolio & CV_files/css2`
**Template Reference:** `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/templates/portfolio.template.md`
**Total HTML file size:** 637 KB (538 lines, ~620 KB of which is a single base64 profile image on line 308)

---

## PLAN-01a: HTML DOM Hierarchy and Section Structure

### Complete DOM Tree (Section Level)

```
<!DOCTYPE html>
<html lang="en">
  <head>                                          [Line 3]
    <meta charset="UTF-8">                        [Line 3]
    <meta name="viewport">                        [Line 5]
    <title>                                       [Line 6]
    <link href="css2" rel="stylesheet">           [Line 7]   -- Google Fonts (Roboto)
    <style>                                       [Lines 8-301]  -- ALL inline CSS
  </head>
  <body>                                          [Line 303]
    <aside class="sidebar">                       [Line 305]  -- FIXED LEFT SIDEBAR
      <div class="profile-photo">                 [Line 306]
        <img src="data:image/png;base64,...">     [Line 308]  -- 620KB base64 PNG
      </div>
      <nav class="nav-list">                      [Line 310]
        <div class="nav-item" id="nav-resume">    [Line 311]
          <div class="nav-label">Resume</div>
          <div class="nav-subtext">The Evidence</div>
        </div>
        <div class="nav-item" id="nav-whyme">     [Line 315]
          <div class="nav-label">Value Prop</div>
          <div class="nav-subtext">The "Why Me"</div>
        </div>
        <div class="nav-item" id="nav-whygoogle"> [Line 319]
          <div class="nav-label">Strategic Fit</div>
          <div class="nav-subtext">Why <span class="company-name"></span>?</div>
        </div>
        <div class="nav-item active" id="nav-whoami"> [Line 323]
          <div class="nav-label">Beyond the Papers</div>
          <div class="nav-subtext">Personal Narrative</div>
        </div>
      </nav>
      <button class="btn-download">DOWNLOAD</button>  [Line 328]
    </aside>

    <main class="main-content">                   [Line 331]
      <!-- VIEW 1: RESUME -->
      <div id="resume-view" class="view-container">    [Line 334]
        <div class="page">                             [Line 335]
          <div class="identity-horizon">               [Line 336]
            <div class="color-1">, .color-2, .color-3, .color-4  [Line 337]
          </div>
          <div class="header">                         [Line 340]
            <div class="header-top">                   [Line 341]
              <div class="name">FULL NAME</div>        [Line 342]
              <div class="role">TARGET ROLE NAME</div> [Line 343]
            </div>
            <div class="contact-info">                 [Line 345]
              <span>Phone, Email, LinkedIn, Portfolio</span>
            </div>
          </div>
          <!-- Section: Professional Experience -->
          <div class="section">                        [Line 354]
            <div class="section-title">                [Line 355]
              Professional Experience
              <div class="section-divider"></div>
            </div>
            <div class="entry">                        [Line 357] -- Company 1 (3 projects)
              <div class="entry-header">               [Line 358]
              <div class="entry-subhead">              [Line 359]
              <div class="project-title">              [Lines 360, 365, 370]
              <ul><li><span class="li-content">        [bullet items]
            </div>
            <div class="entry">                        [Line 377] -- Company 2 (2 projects)
              ...
            </div>
          </div>
          <!-- Section: Awards & Recognitions -->
          <div class="section">                        [Line 394]
          <!-- Section: Voluntary Experience -->
          <div class="section">                        [Line 404]
          <!-- Section: Academic Achievements -->
          <div class="section">                        [Line 414]
            <div class="entry">                        [Line 416] -- University
          </div>
          <!-- Section: Core Competencies & Skills -->
          <div class="section">                        [Line 428]
            <span class="edge-to-edge-line">           [Line 430]
          </div>
          <!-- Section: Additional Interests -->
          <div class="section" style="margin-top:auto"> [Line 434]
            <span class="edge-to-edge-line">           [Line 436]
          </div>
        </div>
      </div>

      <!-- VIEW 2: VALUE PROP ("Why Me") -->
      <div id="whyme-view" class="view-container">     [Line 442]
        <div class="page">
          <div class="identity-horizon">
          <div class="header"> (name, role, contact-info)
          <div class="section">
            <div class="section-title">Value Proposition</div>
            <img src="data:image/png;base64,..." (1px placeholder)
            <p>The "Why Me" presentation slides go here.</p>
          </div>
        </div>
      </div>

      <!-- VIEW 3: STRATEGIC FIT ("Why Google") -->
      <div id="whygoogle-view" class="view-container">  [Line 469]
        <div class="page">
          <div class="identity-horizon">
          <div class="header"> (name, role, contact-info)
          <div class="section">
            <div class="section-title">Strategic Fit</div>
            <img src="data:image/png;base64,..." (1px placeholder)
            <p>The "Why <span class="company-name"></span>" cover letter goes here.</p>
          </div>
        </div>
      </div>

      <!-- VIEW 4: BEYOND THE PAPERS ("Who Am I") -->
      <div id="whoami-view" class="view-container active"> [Line 496]
        <div class="page">
          <div class="identity-horizon">
          <div class="header"> (name, role, contact-info)
          <div class="section">
            <div class="section-title">Beyond the Papers</div>
            <img src="data:image/png;base64,..." (1px placeholder)
            <p>The "Personal Narrative" media goes here.</p>
          </div>
        </div>
      </div>
    </main>

    <script>                                       [Line 525]
      function switchView(viewId) { ... }          [Lines 526-534]
    </script>
  </body>
</html>
```

### The 4 Navigation Views

| Nav ID | View Container ID | Label | Subtext | Default State |
|--------|-------------------|-------|---------|--------------|
| `nav-resume` | `resume-view` | Resume | The Evidence | Inactive |
| `nav-whyme` | `whyme-view` | Value Prop | The "Why Me" | Inactive |
| `nav-whygoogle` | `whygoogle-view` | Strategic Fit | Why `<span class="company-name"></span>`? | Inactive |
| `nav-whoami` | `whoami-view` | Beyond the Papers | Personal Narrative | **Active** (default) |

### View-Switching Mechanism

The system uses a CSS class toggle approach:
- Each view is a `<div>` with class `view-container`. Base rule (line 221): `display: none;`
- The active view gets class `active`, which triggers (line 222): `display: block;`
- An `onclick` attribute on each `.nav-item` calls `switchView('viewId')` (lines 311, 315, 319, 323)
- The `.nav-item` pills also gain/lose the `active` class for visual state

### Navbar Structure

The navbar is implemented as a fixed `<aside class="sidebar">` (line 305), 300px wide, `position: fixed`, `height: 100vh`, `z-index: 1000`. It contains:
1. A circular `.profile-photo` container (130x130px, `border-radius: 50%`) with a base64-embedded `<img>` tag
2. A `<nav class="nav-list">` (flexbox column, 6px gap) containing 4 `.nav-item` divs (not anchor tags)
3. A `<button class="btn-download">` pushed to the bottom via `margin-top: auto`

### Identity Horizon Brand Bar

Each of the 4 views contains an identical `.identity-horizon` bar (line 261):
- `position: absolute; top: 0; left: 0; width: 100%; height: 3pt; display: flex;`
- Contains 4 child divs: `.color-1` through `.color-4`, each `flex: 1`
- Colors mapped to: `--brand-blue`, `--brand-red`, `--brand-yellow`, `--brand-green`
- This creates a 4-segment colored stripe at the very top of each A4 page

---

## PLAN-01b: CSS Variable System and Material Design 3 Tokens

### All CSS Custom Properties Defined (`:root`, lines 91-120)

#### Category 1: Personalization (1 variable)
| Variable | Value | Line | Purpose |
|----------|-------|------|---------|
| `--target-company-name` | `"Google"` | 93 | Dynamic company name injected via CSS `content` property |

#### Category 2: Material Design 3 System Color Tokens (8 variables)
| Variable | Value | Line | MD3 Role |
|----------|-------|------|----------|
| `--md-sys-color-primary` | `#4285F4` | 96 | Primary action color (download button, photo border, hover) |
| `--md-sys-color-surface` | `#F8F9FA` | 97 | Sidebar background |
| `--md-sys-color-surface-container` | `#F1F3F4` | 98 | Main canvas background (behind the page) |
| `--md-sys-color-on-surface` | `#1F1F1F` | 99 | Primary text color on surfaces |
| `--md-sys-color-on-surface-variant` | `#444746` | 100 | Secondary/muted text (inactive nav items) |
| `--md-sys-color-outline` | `#C4C7C5` | 101 | Sidebar right border |
| `--md-sys-color-secondary-container` | `#D3E3FD` | 102 | Active nav pill background |
| `--md-sys-color-on-secondary-container` | `#041E49` | 103 | Active nav pill text |

#### Category 3: Resume Brand Colors (4 variables)
| Variable | Value | Line | Usage |
|----------|-------|------|-------|
| `--brand-blue` | `#4285F4` | 106 | Section titles, bullet points, contact links, Identity Horizon segment 1, section divider segment 1 |
| `--brand-red` | `#EA4335` | 107 | Identity Horizon segment 2, section divider segment 2 |
| `--brand-yellow` | `#FBBC05` | 108 | Identity Horizon segment 3, section divider segment 3 |
| `--brand-green` | `#34A853` | 109 | Identity Horizon segment 4, section divider segment 4 |

#### Category 4: Typography Tokens (5 variables)
| Variable | Value | Line | Used By |
|----------|-------|------|---------|
| `--font-size-name` | `20pt` | 112 | `.name` and `.role` classes (header hero text) |
| `--font-size-header` | `13pt` | 113 | `.section-title` (section headings) |
| `--font-size-subhead` | `10.5pt` | 114 | `.entry-header`, `.entry-subhead` (company/degree names) |
| `--font-size-body` | `9.5pt` | 115 | `.li-content`, `.project-title`, `.edge-to-edge-line` (bullet text) |
| `--font-size-contact` | `9pt` | 116 | `.contact-info` (contact bar) |

#### Category 5: Page Calibration (2 variables)
| Variable | Value | Line | Purpose |
|----------|-------|------|---------|
| `--page-width` | `210mm` | 118 | A4 page width, used by `.page` and `.placeholder-view` |
| `--page-height` | `297mm` | 119 | A4 page height, used by `.page` |

### Material Design 3 Token Naming Pattern

The template follows the MD3 Design Token naming convention: `--md-sys-color-{role}`. The prefix hierarchy is:
- `--md-` = Material Design namespace
- `sys-` = System-level (not component-level)
- `color-` = Color property category

This maps to 5 of the 6 MD3 color roles: `primary`, `surface`, `surface-container`, `on-surface`, `on-surface-variant`, `outline`, `secondary-container`, `on-secondary-container`. Missing roles include: `error`, `tertiary`, `inverse-*`, etc. -- these are not needed for this template's scope.

### Theme/Brand Adaptation Points

The CSS comment block (lines 9-89) serves as an exhaustive customization guide organized into 5 numbered sections, with a Decision Tree for brand color mapping:
- **Scenario A**: Multi-chromatic brands (Google, Slack) -- map each `--brand-*` to a different brand color
- **Scenario B**: Monochromatic brands (Spotify, Netflix) -- set all 4 to the same color, or create a fade
- **Scenario C**: Dual-tone brands (Uber, Amazon) -- alternate primary/accent across the 4 slots

### CSS Architecture

- **External file:** `css2` (lines 1-360) -- Google Fonts `Roboto` at weights 300, 400, 500, 700. Contains only `@font-face` declarations with `font-display: swap` and subsetting by unicode-range (cyrillic-ext, cyrillic, greek-ext, greek, math, symbols, vietnamese, latin-ext, latin).
- **Inline `<style>` block:** Lines 8-301 -- ALL layout, component, and print CSS. Single block, no imports, no layers, no CSS-in-JS.
- **Specificity approach:** Flat and low. Nearly all rules use single-class selectors (`.sidebar`, `.nav-item`, `.page`). The only `!important` declarations are in the `@media print` block (lines 250-258). No ID selectors in CSS. No BEM naming.
- **Reset:** Line 122 -- `* { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; }`

### Hardcoded Colors Not in Variables

The following colors are used directly (not via variables):
- `#E0E0E0` (line 157) -- profile photo placeholder background
- `#202124` (line 269) -- `.name` text color
- `#5F6368` (lines 270, 274, 292) -- `.role` text, `.contact-info`, `.entry-subhead`
- `#DADCE0` (lines 277-278) -- contact-info borders
- `rgba(66, 133, 244, 0.08)` (line 184) -- nav-item hover (hardcoded Google Blue with alpha)
- `white` / `#FFFFFF` (lines 195, 232) -- button text, page background

---

## PLAN-01c: JavaScript View-Switching and Interactivity

### Script Blocks

There is exactly **1 script block**, inline, at lines 525-535:

```javascript
<script>
    function switchView(viewId) {
        // Update navigation pills
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.getElementById('nav-' + viewId).classList.add('active');

        // Update content views
        document.querySelectorAll('.view-container').forEach(view => view.classList.remove('active'));
        document.getElementById(viewId + '-view').classList.add('active');
    }
</script>
```

There are **no external JavaScript files** loaded. No `<script src=...>` tags exist.

### Function Inventory

| Function | Line | Purpose |
|----------|------|---------|
| `switchView(viewId)` | 526-534 | The single JS function. Toggles active states on both nav pills and view containers. |

### Event Listeners and Interactive Behaviors

All event listeners are **inline `onclick` attributes** (no `addEventListener` calls):

| Element | Line | Handler | Action |
|---------|------|---------|--------|
| `#nav-resume` | 311 | `onclick="switchView('resume')"` | Show resume-view |
| `#nav-whyme` | 315 | `onclick="switchView('whyme')"` | Show whyme-view |
| `#nav-whygoogle` | 319 | `onclick="switchView('whygoogle')"` | Show whygoogle-view |
| `#nav-whoami` | 323 | `onclick="switchView('whoami')"` | Show whoami-view |
| `.btn-download` | 328 | `onclick="window.print()"` | Trigger browser print dialog |

Total interactive elements: **5** (4 nav items + 1 button).

### switchView Logic Detail

1. Remove `.active` class from ALL `.nav-item` elements (deactivates all nav pills)
2. Add `.active` class to `#nav-{viewId}` (activates the clicked pill)
3. Remove `.active` class from ALL `.view-container` elements (hides all views)
4. Add `.active` class to `#{viewId}-view` (shows the target view)

The naming convention requires that each nav item's ID is `nav-{viewId}` and each view container's ID is `{viewId}-view`. The mapping is:

| viewId | Nav Element ID | View Container ID |
|--------|---------------|-------------------|
| `resume` | `nav-resume` | `resume-view` |
| `whyme` | `nav-whyme` | `whyme-view` |
| `whygoogle` | `nav-whygoogle` | `whygoogle-view` |
| `whoami` | `nav-whoami` | `whoami-view` |

### Company Name Injection (CSS-driven, not JS)

The company name is injected purely through CSS, not JavaScript:
- Line 190: `.company-name::after { content: var(--target-company-name); }`
- Line 93: `--target-company-name: "Google";`
- The `<span class="company-name"></span>` elements are empty in the HTML (lines 321, 490)
- The CSS `::after` pseudo-element fills in the company name from the CSS variable

This is a significant design choice: no JavaScript DOM manipulation is needed for company name changes -- only the CSS variable value needs to change.

### Animation/Transition JS

There is no JavaScript-driven animation. All transitions are CSS-based:
- Line 180: `.nav-item { transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1); }` -- Material Design standard easing on nav hover/active
- Lines 224-227: `@keyframes fadeIn` -- opacity 0 to 1 with 5px translateY, 0.3s ease. Applied to `.view-container` (line 221), but note: the animation triggers every time the element gets `display: block` via the `.active` class

---

## PLAN-01d: Print-to-PDF Pipeline and @media Print Styles

### All @media Print Rules (Lines 250-258)

```css
@media print {
    body { background: none; padding: 0; }
    .sidebar { display: none !important; }
    .main-content { margin-left: 0; padding: 0; }
    .page { margin: 0; box-shadow: none; border: none; }
    .view-container { display: none !important; }
    #resume-view { display: block !important; }
    @page { size: A4; margin: 0; }
}
```

### What Gets Hidden for Print

| Element | Print Behavior | Mechanism |
|---------|---------------|-----------|
| `.sidebar` (entire left nav) | **HIDDEN** | `display: none !important` |
| ALL `.view-container` elements | **HIDDEN** | `display: none !important` |
| `#resume-view` only | **SHOWN** | `display: block !important` (overrides the blanket hide) |

**Critical finding:** Regardless of which view the user is currently looking at, **only the Resume view (#resume-view) ever prints.** The Value Prop, Strategic Fit, and Beyond the Papers views are explicitly excluded from print output.

### What Gets Shown for Print

Only the resume page content, including:
- The Identity Horizon brand bar (4-color stripe)
- Full name & role header
- Contact information
- All 6 resume sections (Professional Experience, Awards, Voluntary, Academics, Skills, Interests)

### Page-Break Rules

- `@page { size: A4; margin: 0; }` -- Sets physical page size to A4 (210mm x 297mm) with zero margins
- The `.page` div is pre-sized to exactly `210mm x 297mm` (via `--page-width` and `--page-height` variables) with `overflow: hidden` -- this **clips** any content that exceeds the page height rather than reflowing
- There are **no explicit `page-break-before`, `page-break-after`, or `page-break-inside` rules** -- the design enforces a single-page resume by sizing the container to exactly one A4 page

### Print-Specific Layout Adjustments

| Property | Screen Value | Print Value |
|----------|-------------|-------------|
| `body background` | `var(--md-sys-color-surface-container)` | `none` |
| `body padding` | (inherited) | `0` |
| `.main-content margin-left` | `300px` (sidebar width) | `0` |
| `.main-content padding` | `40px 20px` | `0` |
| `.page margin` | (auto-centered) | `0` |
| `.page box-shadow` | Complex shadow | `none` |
| `.page border` | (none set) | `none` (explicit override) |

### Color Preservation

Line 122: `-webkit-print-color-adjust: exact;` is applied to ALL elements via the `*` selector. This forces Chrome/WebKit to print background colors and images, which is essential for:
- The Identity Horizon colored bar
- The section divider gradient
- The `--brand-blue` colored bullet points and section titles

### Print-to-PDF Pipeline Flow

1. User clicks "DOWNLOAD" button (`.btn-download`, line 328)
2. `onclick="window.print()"` triggers browser print dialog
3. `@media print` rules activate:
   - Sidebar disappears
   - All views hidden except `#resume-view`
   - Main content loses its 300px left margin
   - Page loses its shadow/border
   - `@page` sets A4 dimensions with no margins
4. The `.page` div fills exactly one A4 page (210mm x 297mm)
5. `-webkit-print-color-adjust: exact` preserves brand colors
6. User selects "Save as PDF" in the browser print dialog
7. Result: a single-page A4 PDF with the resume only

### Print Pipeline Limitations

- **No multi-page support:** `overflow: hidden` on `.page` clips content. If content exceeds one A4 page, it is silently truncated
- **Only Resume prints:** The other 3 views (Value Prop, Strategic Fit, Beyond the Papers) are force-hidden during print. There is no mechanism to print those views
- **Browser-dependent:** The `@page { size: A4; }` directive is well-supported in Chrome but may behave differently in Firefox/Safari
- **The "Additional Interests" section** uses `margin-top: auto` (line 434) to push itself to the bottom of the page -- this is a flex-based technique that works because `.page` uses `display: flex; flex-direction: column`

---

## PLAN-01e: Customization Injection Points

### 1. CSS Variable Injection Points (Zero Code Changes Required)

These can be changed by editing ONLY the `:root` block (lines 91-120):

| Variable | Current Value | Customization Type |
|----------|--------------|-------------------|
| `--target-company-name` | `"Google"` | Target company name (quoted CSS string) |
| `--md-sys-color-primary` | `#4285F4` | UI primary accent |
| `--md-sys-color-surface` | `#F8F9FA` | Sidebar background |
| `--md-sys-color-surface-container` | `#F1F3F4` | Canvas background |
| `--md-sys-color-on-surface` | `#1F1F1F` | UI primary text |
| `--md-sys-color-on-surface-variant` | `#444746` | UI muted text |
| `--md-sys-color-outline` | `#C4C7C5` | UI borders |
| `--md-sys-color-secondary-container` | `#D3E3FD` | Active pill background |
| `--md-sys-color-on-secondary-container` | `#041E49` | Active pill text |
| `--brand-blue` | `#4285F4` | Resume accent primary |
| `--brand-red` | `#EA4335` | Resume accent 2 |
| `--brand-yellow` | `#FBBC05` | Resume accent 3 |
| `--brand-green` | `#34A853` | Resume accent 4 |
| `--font-size-name` | `20pt` | Name/role font size |
| `--font-size-header` | `13pt` | Section header size |
| `--font-size-subhead` | `10.5pt` | Entry header size |
| `--font-size-body` | `9.5pt` | Body text size |
| `--font-size-contact` | `9pt` | Contact bar size |
| `--page-width` | `210mm` | Page width |
| `--page-height` | `297mm` | Page height |

### 2. Dynamic Text Injection Points (CSS-driven)

| Mechanism | Source | Targets | Lines |
|-----------|--------|---------|-------|
| `.company-name::after` | `--target-company-name` CSS variable | Nav subtext "Why ___?", "Why ___" in cover letter view | 190 (CSS rule), 321, 490 (HTML spans) |

### 3. Hardcoded Content That Must Be Edited in HTML

#### Personal Identity (appears in ALL 4 views):
| Content | Placeholder Text | Lines (repeated in 4 views) |
|---------|-----------------|---------------------------|
| Full Name | `FULL NAME` | 342, 449, 476, 503 |
| Target Role | `TARGET ROLE NAME` | 343, 450, 477, 504 |
| Phone | `+91-XXXXXXXXXX` | 346, 453, 480, 507 |
| Email href | `mailto:placeholder@google.com` | 347, 454, 481, 508 |
| Email link text | `Email Me` | 347, 454, 481, 508 |
| LinkedIn href | `https://linkedin.com/in/username` | 348, 455, 482, 509 |
| LinkedIn link text | `LinkedIn` | 348, 455, 482, 509 |
| Portfolio href | `https://portfolio.me/` | 349, 456, 483, 510 |
| Portfolio link text | `Portfolio` | 349, 456, 483, 510 |

**Critical observation:** The contact header block is **duplicated verbatim across all 4 views**. Any update to personal info requires editing 4 separate locations. This is a significant maintenance risk.

#### Resume Content (View 1 only):
| Content Block | Lines | Placeholder |
|--------------|-------|-------------|
| Company 1 name | 358 | `Organization Name One` |
| Company 1 location/dates | 358 | `Location \| Jan 2024 - Present` |
| Company 1 role | 359 | `Senior Product Manager` |
| Company 1 department | 359 | `Team/Department` |
| Project titles | 360, 365, 370 | `Top Project One/Two/Three` |
| Bullet points (12 total for Co. 1) | 362-373 | `A quick brown fox...` |
| Company 2 name | 378 | `Organization Name Two` |
| Company 2 location/dates | 378 | `Location \| Jun 2021 - Dec 2023` |
| Company 2 role | 379 | `Product Manager` |
| Company 2 department | 379 | `Team/Department` |
| Project titles | 380, 385 | `Previous Success Project One/Two` |
| Bullet points (8 total for Co. 2) | 382-388 | `A quick brown fox...` |
| Awards bullets (3) | 397-399 | `A quick brown fox...` |
| Voluntary bullets (3) | 407-409 | `A quick brown fox...` |
| University name | 417 | `University / Institute Name` |
| Graduation year | 417 | `Class of 2021` |
| Degree name | 418 | `Degree Name / Specialization` |
| GPA | 418 | `GPA: 9.5 / 10.0` |
| Academic bullets (3) | 420-422 | `A quick brown fox...` |
| Skills line | 430 | `Skill One, Skill Two, ...` |
| Interests line | 436 | `Interest One, Interest Two, ...` |

### 4. Image/Asset References

| Asset | Type | Location | Line | Size/Notes |
|-------|------|----------|------|-----------|
| Profile photo | base64 PNG inline | `.profile-photo img` | 308 | ~620KB data URI. Self-contained. |
| Value Prop placeholder | base64 PNG inline | `#whyme-view img` | 462 | 1x1px transparent PNG (`iVBORw0KGgo...`) |
| Strategic Fit placeholder | base64 PNG inline | `#whygoogle-view img` | 489 | 1x1px transparent PNG (identical) |
| Beyond Papers placeholder | base64 PNG inline | `#whoami-view img` | 516 | 1x1px transparent PNG (identical) |
| Roboto font (300/400/500/700) | External URL | `css2` file | 1-360 | Google Fonts CDN (`fonts.gstatic.com`) |
| CSS file | Relative path | `<link>` | 7 | `./Satvik Jain - Portfolio & CV_files/css2` |

**No other external assets are loaded.** The template is almost fully self-contained -- the only external dependency is the Google Fonts CDN for Roboto.

### 5. Configuration Points Without Code Modification

| What | How to Change | Effort |
|------|--------------|--------|
| Target company name | Edit `--target-company-name` value in `:root` | Trivial |
| UI color scheme | Edit 8 `--md-sys-color-*` variables in `:root` | Trivial |
| Resume brand colors | Edit 4 `--brand-*` variables in `:root` | Trivial |
| Font sizes | Edit 5 `--font-size-*` variables in `:root` | Trivial |
| Profile photo | Replace base64 string on line 308 | Medium (encode new image) |
| Default active view | Move `active` class from `#nav-whoami`/`#whoami-view` to another pair | Trivial |

### 6. Values That SHOULD Be Parameterized But Are Currently Hardcoded

| Value | Current Location | Recommendation |
|-------|-----------------|----------------|
| `#202124` (name text color) | Line 269 | Should be `var(--md-sys-color-on-surface)` or a new `--color-name` variable |
| `#5F6368` (role/subhead color) | Lines 270, 274, 292 | Should be `var(--md-sys-color-on-surface-variant)` or `--color-secondary-text` |
| `#DADCE0` (contact border color) | Lines 277-278 | Should be `var(--md-sys-color-outline)` |
| `#E0E0E0` (photo placeholder bg) | Line 157 | Should be a CSS variable |
| `rgba(66, 133, 244, 0.08)` (nav hover) | Line 184 | Hardcodes Google Blue with alpha; should derive from `--md-sys-color-primary` |
| `300px` sidebar width | Lines 140, 215 | Should be a `--sidebar-width` variable (used in both `.sidebar` and `.main-content`) |
| `130px` photo dimensions | Lines 154-155 | Should be a variable for customizable photo sizing |
| `12.7mm` page padding | Line 233 | Should be a `--page-padding` variable |
| `40px 16px` sidebar padding | Line 146 | Should be a variable |
| `white` page background | Line 232 | Should reference a variable (may need to stay white for print) |
| Contact info block (4 copies) | Lines 345-350, 452-457, 479-484, 506-511 | Should be a single template/component, not duplicated 4 times |
| Identity Horizon (4 copies) | Lines 336-338, 444-446, 471-473, 498-500 | Same structure duplicated 4 times |
| Header block (4 copies) | Lines 340-350, 447-457, 474-484, 501-511 | Full name+role+contact duplicated 4 times |
| View ID naming (`whygoogle`) | Lines 319, 469, 529 | Hardcoded to "google" rather than being generic (e.g., `whycompany`) |

### 7. Template Reference Comparison

The template file at `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/workflows/portfolio-deploy/templates/portfolio.template.md` is minimal (12 lines), containing only:
```
# Career Portfolio Template
# [User Name] - Portfolio
## Featured Slides
...
## Evidence Signals
...
```

This template is a high-level structural outline that maps to the view architecture:
- `[User Name]` = the `FULL NAME` placeholder
- `Featured Slides` = likely corresponds to the 3 non-resume views (Value Prop, Strategic Fit, Beyond Papers)
- `Evidence Signals` = likely corresponds to the Resume view

The template does not contain granular field mappings -- the HTML file itself serves as the primary template.

---

## Summary of Key Findings

1. **Architecture:** Single-file SPA with 4 views, CSS-only view switching, one 14-line JS function, zero external JS dependencies. Highly portable.

2. **Critical maintenance risk:** The header block (name, role, contact info) and Identity Horizon bar are duplicated 4 times. Any personal info change requires 4 edits.

3. **File size concern:** The 620KB base64 profile photo on line 308 dominates the file size (97% of the HTML). This prevents standard text editors from handling the file efficiently.

4. **Print pipeline is robust but rigid:** Only the Resume view prints; the design is locked to single-page A4 with no overflow/pagination support.

5. **CSS variable system is well-designed** for brand customization (20 variables covering colors, typography, and page dimensions), but several hardcoded hex values in the resume body styles break the variable abstraction.

6. **Company name injection** is elegantly implemented via CSS `content` + `::after` on `.company-name` spans, avoiding JS DOM manipulation entirely. However, the nav item ID `nav-whygoogle` and view container ID `whygoogle-view` are hardcoded to "google" regardless of what `--target-company-name` is set to.

7. **The 3 non-resume views** are scaffold/placeholder state -- they each contain only a 1px transparent placeholder image and a paragraph of instructions. These are ready for content injection.