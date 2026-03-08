# E5: Dynamic Bullet Point Width Calculation — Design Specification

**Enhancement ID**: E5
**Release**: 3
**Date**: 2026-03-07
**Status**: DESIGN
**Depends On**: PLAN-01 (CV Template Audit), SYNC-DESIGN-AND-TECHNICAL-SPECS.md (Roboto hmtx tables), PLAN-09 (Cross-Cutting Concerns)
**Agents Affected**: `sync-sizer` (Kael), `sync-refiner` (Veda), `sync-styler` (Cora)
**Workflow Affected**: `jd-optimize` (steps 17a/17b/17c, 27-33)

---

## 1. Executive Summary

### Problem Statement

The current Linkright bullet-writing pipeline uses **hardcoded character counts** to determine whether a resume bullet fits on a single line. Step 17a of the jd-optimize workflow checks for a simple character count threshold (82-88 characters) and flags lines over 90 as OVERFLOW. This is fundamentally flawed for two reasons:

1. **Character count is not pixel width.** In Roboto Regular, a single `W` (1736 units = 11.302px) occupies the same space as 3.6 `i` characters (483 units = 3.145px each). A bullet with 85 characters of wide letters (`m`, `w`, `W`, `M`) will overflow, while 85 characters of narrow letters (`i`, `l`, `f`) will leave a visible gap. The ratio between the widest and narrowest characters is 3.59x -- character counting cannot account for this.

2. **The budget is template-specific, not universal.** The hardcoded budget of 88 digit-units assumes a single-column, 8.5x11-inch page with 1-inch margins. The Linkright CV template uses A4 (210mm), has 12.7mm page padding, and bullets live inside `<li>` elements with their own indent. Different templates have different sidebar widths, margins, and content area widths. A hardcoded budget is correct for exactly one template and wrong for every other.

### Solution

Enhancement E5 replaces the static budget with a **dynamic width calculation pipeline**:

1. **Read the template's CSS** to determine the exact available width for bullet text, accounting for page width, margins, sidebar, content padding, and bullet indent.
2. **Convert available pixel width to a digit-unit budget** using the Roboto hmtx advance width data (digit = 1086 units = 7.070px at 10pt/96DPI).
3. **Write bullets to exactly 95% fill** using per-character weighted width summation, with a trim/expand loop that uses synonym substitution for fine-tuning.
4. **Apply CSS `text-align: justify` and `text-align-last: justify`** to silently distribute the remaining ~5% across word spaces, producing bullets that appear to fill edge-to-edge.
5. **Group bullets in clusters of 2-3** with visual spacing between groups for readability.

### Impact

- Every bullet on every template will fill exactly one line, edge-to-edge, with no overflow and no visible gap.
- Template designers can change page dimensions, margins, or font sizes without breaking the bullet sizing pipeline -- the budget recalculates automatically.
- The sizer-refiner collaboration loop (step 17c) becomes deterministic rather than trial-and-error, reducing iterations from 3 max to typically 1.

---

## 2. Template Width Extraction Algorithm

### 2.1 CSS Property Resolution Chain

The algorithm reads the following CSS properties in order, each narrowing the available width:

```
Step 1: Page Width
  Source: CSS variable --page-width (or --lr-page-width after E4 theming)
  Current value: 210mm (A4)
  Conversion: 210mm = 793.7px at 96 DPI (1mm = 3.7795px)

Step 2: Page Padding (both sides)
  Source: CSS rule on .page { padding: Xmm }
  Current value: 12.7mm per side = 48px per side = 96px total
  Alternative: @page { margin: X } in print context

Step 3: Sidebar Width (if applicable)
  Source: CSS rule on .sidebar { width: Xpx }
  Current value: 300px (screen only; 0px in print -- sidebar is display:none)
  NOTE: For print PDF output (the primary target), sidebar = 0

Step 4: Section Content Padding
  Source: CSS rule on .section or .entry { padding-left/right: X }
  Current value: 0 (sections have no horizontal padding in the CV template)

Step 5: Bullet Indent
  Source: CSS rule on ul { padding-left: X } or li { margin-left: X }
  Current value: Estimated 15-20px (standard browser default for ul padding-left)
  Must be measured from actual template CSS

Step 6: Bullet Marker Space
  Source: CSS list-style-type and its rendered width
  Current value: Bullet character (U+2022) width + gap
  If using custom markers via ::marker, measure that width instead
```

### 2.2 Available Width Formula

For **print output** (the primary target for resume PDFs):

```
available_width_px = page_width_px
                   - (2 x page_padding_px)
                   - sidebar_width_in_print    (typically 0)
                   - (2 x section_padding_px)
                   - bullet_indent_px
                   - bullet_marker_width_px
```

For the **current CV template** at print resolution (96 DPI):

```
page_width_px     = 210mm x 3.7795 = 793.7px
page_padding_px   = 12.7mm x 3.7795 = 48.0px per side = 96.0px total
sidebar_in_print  = 0px (hidden via @media print)
section_padding   = 0px
bullet_indent     = ~18px (browser default ul padding-left)
bullet_marker     = ~10px (bullet char width + gap)

available_width_px = 793.7 - 96.0 - 0 - 0 - 18 - 10
                   = 669.7px (usable text width)
```

### 2.3 Supported Template Types

The extraction algorithm must handle these template archetypes:

| Template Type | Layout | Width Calculation Difference |
|---------------|--------|----------------------------|
| **Single-column, no sidebar** | Full-page text, standard margins | `page_width - 2*margins - indent` |
| **Single-column with sidebar** (current CV) | Sidebar hidden in print; full page for bullets | Same as above (sidebar = 0 in print) |
| **Two-column** | Left column for details, right column for content | `right_column_width - indent` |
| **Two-column with sidebar** | Three visual zones | `content_column_width - indent` |
| **US Letter (8.5x11)** | Different base page width | `215.9mm = 816px` instead of `793.7px` |

### 2.4 Fallback Defaults

If a CSS property cannot be resolved, use these safe defaults:

| Property | Fallback Value | Rationale |
|----------|---------------|-----------|
| `--page-width` | `210mm` (A4) | Most common international standard |
| Page padding | `12.7mm` (0.5 inch) | Standard resume margin |
| Sidebar width (print) | `0px` | Most templates hide sidebar in print |
| Section padding | `0px` | Conservative assumption |
| Bullet indent | `20px` | Browser default for `ul` padding-left |
| Bullet marker | `10px` | Conservative estimate for bullet char + gap |
| Font size | `9.5pt` | Current CV template body text size |

### 2.5 Template Configuration Object

The extraction algorithm produces a `TemplateWidthConfig` object that is passed downstream:

```yaml
# template-width-config.yaml
template_id: "cv-a4-sidebar"
page_format: "A4"
page_width_mm: 210
page_width_px: 793.7
page_padding_mm: 12.7
page_padding_px: 48.0
sidebar_width_print_px: 0
section_padding_px: 0
bullet_indent_px: 18
bullet_marker_px: 10
available_width_px: 669.7
font_family: "Roboto"
font_weight: 400
font_size_pt: 9.5
font_size_px: 12.667   # 9.5pt * (96/72)
dpi: 96
digit_advance_units: 1086
units_per_em: 2048
digit_width_px: 6.718   # (1086/2048) * (9.5/72) * 96
line_budget_digit_units: 99.7   # 669.7 / 6.718
target_fill_pct: 0.95
target_budget_digit_units: 94.7  # 99.7 * 0.95
target_budget_range:
  min: 89.8   # 90% of available (too short threshold)
  target: 94.7  # 95% of available (ideal)
  max: 99.7     # 100% of available (absolute max)
```

**Note on font size scaling:** The current CV template uses `9.5pt` for body text, not `10pt`. This changes the digit width from 7.070px (at 10pt) to 6.718px (at 9.5pt), and consequently increases the digit-unit budget per line because more characters fit. The formula is:

```
digit_width_px = (1086 / 2048) x (font_size_pt / 72) x DPI
               = 0.53027 x (9.5 / 72) x 96
               = 0.53027 x 0.13194 x 96
               = 6.718px

line_budget = available_width_px / digit_width_px
            = 669.7 / 6.718
            = 99.7 digit-units
```

This is notably different from the hardcoded 88 digit-unit budget (which assumes 10pt font on a 6.5-inch column). The dynamic calculation corrects this discrepancy.

---

## 3. Dynamic Budget Calculation

### 3.1 Formula Chain

The complete formula chain from template CSS to actionable budget:

```
INPUT:  Template CSS file
         |
         v
STEP 1:  Extract CSS properties --> TemplateWidthConfig (Section 2)
         |
         v
STEP 2:  Calculate available_width_px
         = page_width_px - 2*page_padding_px - sidebar_print_px
           - 2*section_padding_px - bullet_indent_px - bullet_marker_px
         |
         v
STEP 3:  Calculate digit_width_px for the template's font/size
         = (digit_advance_units / units_per_em) x (font_size_pt / 72) x DPI
         = (1086 / 2048) x (font_size_pt / 72) x 96
         |
         v
STEP 4:  Calculate raw line budget in digit-units
         = available_width_px / digit_width_px
         |
         v
STEP 5:  Apply 95% fill target
         target_budget = raw_budget x 0.95
         |
         v
STEP 6:  Define acceptable range
         min_budget = raw_budget x 0.90   (below this = too short)
         max_budget = raw_budget x 1.00   (above this = overflow)
         |
         v
OUTPUT: { target: 94.7, min: 89.8, max: 99.7 } digit-units
        (for current CV template at 9.5pt Roboto on A4)
```

### 3.2 Budget Recalculation Triggers

The budget must be recalculated when any of these change:

| Trigger | Which Step Detects It | Action |
|---------|----------------------|--------|
| Different template selected (step 18) | `sync-styler` | Full recalculation from Step 1 |
| Font size CSS variable changed | `sync-styler` | Recalculate from Step 3 |
| Page format changed (A4 to Letter) | `sync-styler` | Recalculate from Step 2 |
| Margin/padding adjusted | `sync-styler` | Recalculate from Step 2 |

### 3.3 Reference Budget Table for Common Configurations

Pre-computed budgets for common template configurations:

| Template Config | Page | Font | Available Width | Digit Width | Raw Budget | 95% Target |
|----------------|------|------|----------------|------------|------------|------------|
| CV A4 sidebar (current) | A4 210mm | 9.5pt | 669.7px | 6.718px | 99.7 | 94.7 |
| CV A4 sidebar | A4 210mm | 10pt | 669.7px | 7.070px | 94.7 | 90.0 |
| CV A4 no-sidebar | A4 210mm | 9.5pt | 669.7px | 6.718px | 99.7 | 94.7 |
| US Letter 1-inch margins | 8.5x11 | 10pt | 624.0px | 7.070px | 88.3 | 83.8 |
| US Letter 0.5-inch margins | 8.5x11 | 10pt | 720.0px | 7.070px | 101.8 | 96.7 |
| Two-column (60/40 split) | A4 210mm | 9pt | 401.8px | 6.384px | 62.9 | 59.8 |

**Key insight:** The hardcoded budget of 88 digit-units (from step-17a) only matches the "US Letter 1-inch margins at 10pt" configuration. For the actual CV template (A4, 9.5pt), the correct target is **94.7 digit-units** -- a 7.6% increase. This means the current pipeline is writing bullets that are systematically shorter than they could be, leaving visible white space on every line.

---

## 4. Bullet Writing Algorithm

### 4.1 Overview

The bullet writing algorithm is a three-phase process executed by `sync-refiner` (Veda):

```
Phase 1: DRAFT — Write bullet at approximate target length
Phase 2: MEASURE — Calculate exact weighted width
Phase 3: TUNE — Trim or expand to hit 95% fill target
```

### 4.2 Phase 1: Draft at Approximate Target

Sync-refiner writes the initial bullet using a rough character count derived from the digit-unit budget:

```
rough_char_target = target_budget_digit_units x average_weight_per_char
```

For English text, the average character weight (including spaces) is approximately **0.85 digit-units**. Therefore:

```
rough_char_target = 94.7 / 0.85 = ~111 characters
```

This is a starting point only. The exact width will be calculated in Phase 2.

**Draft rules for sync-refiner:**
- Use XYZ impact formula: "[Accomplished X] by [doing Y], [resulting in Z]"
- Front-load the action verb and the metric
- Aim for the rough character target but do not obsess over it
- Prefer concrete nouns and active verbs (which tend to have predictable widths)

### 4.3 Phase 2: Measure Exact Weighted Width

For the drafted bullet string, calculate the weighted total:

```
weighted_total = sum( weight(char) for char in bullet_string )
```

Using the Roboto Regular normalized weight table (digit = 1.000):

```
| Weight | Characters                                          |
|--------|-----------------------------------------------------|
| 0.445  | i, j, l, '                                         |
| 0.516  | I, space, . , : ; |                                 |
| 0.589  | f, !, -, (, )                                       |
| 0.657  | r, J, /, "                                          |
| 0.727  | t                                                   |
| 0.801  | *, bullet                                           |
| 0.860  | s                                                   |
| 0.930  | c, z, F, L, ?                                       |
| 1.000  | a, e, k, v, x, y, E, S, 0-9, en-dash, $            |
| 1.029  | T, Z                                                |
| 1.071  | b, d, g, h, n, o, p, q, u                           |
| 1.099  | B, C, K, P, X, Y, +, #                              |
| 1.169  | A, R, V, &                                          |
| 1.239  | D, G, H, N, U                                       |
| 1.309  | O, Q                                                |
| 1.385  | w, M, %, right-arrow                                |
| 1.599  | m, W, em-dash                                       |
| 1.740  | @                                                   |
```

**Example calculation:**

Bullet: `Drove 18% revenue growth by launching AI-powered recommendation engine`

```
D(1.239) r(0.657) o(1.071) v(1.000) e(1.000) (0.516)
1(1.000) 8(1.000) %(1.385) (0.516)
r(0.657) e(1.000) v(1.000) e(1.000) n(1.071) u(1.071) e(1.000) (0.516)
g(1.071) r(0.657) o(1.071) w(1.385) t(0.727) h(1.071) (0.516)
b(1.071) y(1.000) (0.516)
l(0.445) a(1.000) u(1.071) n(1.071) c(0.930) h(1.071) i(0.445) n(1.071) g(1.071) (0.516)
A(1.169) I(0.516) -(0.589) p(1.071) o(1.071) w(1.385) e(1.000) r(0.657) e(1.000) d(1.071) (0.516)
r(0.657) e(1.000) c(0.930) o(1.071) m(1.599) m(1.599) e(1.000) n(1.071) d(1.071) a(1.000) t(0.727) i(0.445) o(1.071) n(1.071) (0.516)
e(1.000) n(1.071) g(1.071) i(0.445) n(1.071) e(1.000)

weighted_total = 67.66 digit-units
```

Compare to target: 94.7 digit-units. This bullet is at 71.4% fill -- far too short. Needs expansion.

### 4.4 Phase 3: Tune to 95% Fill

After measuring, one of three outcomes:

| Condition | Action | Method |
|-----------|--------|--------|
| `weighted_total < min_budget` (< 90% fill) | **EXPAND** | Add context, qualifying clauses, or longer synonyms |
| `min_budget <= weighted_total <= max_budget` (90-100%) | **ACCEPT** | CSS justify handles the remaining space |
| `weighted_total > max_budget` (> 100% fill) | **TRIM** | Remove words, use shorter synonyms, compress clauses |

#### 4.4.1 Expansion Techniques (ordered by preference)

1. **Add qualifying context** — "across 3 product lines", "within Q4 2024", "serving 2M+ monthly users"
2. **Expand abbreviations** — "mgmt" to "management", "dev" to "development"
3. **Use longer synonyms** — "cut" to "reduced", "ran" to "orchestrated"
4. **Add the "so what" clause** — append outcome context like "contributing to Series B fundraise"
5. **Add methodological detail** — "using A/B testing framework" or "leveraging cross-functional sprint cadence"

#### 4.4.2 Trimming Techniques (ordered by preference)

1. **Shorter synonyms** — "orchestrated" to "led", "implementation" to "rollout"
2. **Remove filler prepositions** — "in order to" to "to", "with the goal of" to "for"
3. **Compress middle clause** — Keep verb and metric, compress the methodology
4. **Abbreviate if domain-appropriate** — "machine learning" to "ML", "customer acquisition cost" to "CAC"
5. **Replace multi-word phrases** — "was responsible for" to "managed"

#### 4.4.3 Fine-Tuning with Width-Aware Synonym Substitution

For the final 1-5 digit-units of adjustment, use targeted synonym pairs with known width deltas:

| Scenario | From | To | Width Delta (digit-units) |
|----------|------|----|--------------------------|
| Need +1.0 | "led" | "drove" | +1.85 (d+r+o+v+e vs l+e+d) |
| Need +0.5 | "cut" | "trimmed" | +3.64 |
| Need -0.5 | "development" | "dev work" | -3.2 (but adds space) |
| Need -1.0 | "across" | "over" | -1.67 |
| Need -2.0 | "implementation" | "launch" | -5.5 |
| Need +2.0 | "for" | "enabling" | +3.9 |

The refiner maintains a synonym bank organized by width delta, allowing precise tuning.

#### 4.4.4 Iteration Protocol

```
MAX_ITERATIONS = 3

for iteration in range(MAX_ITERATIONS):
    weighted_total = measure(bullet_text)
    fill_pct = weighted_total / raw_budget

    if 0.90 <= fill_pct <= 1.00:
        # ACCEPT - within tolerance, CSS justify handles the rest
        break
    elif fill_pct < 0.90:
        bullet_text = expand(bullet_text, target=target_budget)
    elif fill_pct > 1.00:
        bullet_text = trim(bullet_text, target=target_budget)

if fill_pct < 0.90 or fill_pct > 1.00:
    # FLAG for user review after 3 iterations
    add_to_manual_review_queue(bullet_text, fill_pct)
```

### 4.5 Validation Pass

After tuning, the sizer performs a final validation:

```
FOR EACH bullet in resume:
    wt = calculate_weighted_total(bullet)
    fill = wt / raw_budget

    IF fill < 0.90:
        status = "TOO_SHORT"
        action = "Flag for refiner expansion"
    ELIF fill <= 1.00:
        status = "PASS"
        gap_pct = (1.00 - fill) * 100
        justify_feasible = gap_pct <= 10  # CSS justify can handle up to ~10% gap
    ELSE:
        status = "OVERFLOW"
        action = "Flag for refiner trimming"
```

---

## 5. Bullet Grouping Strategy

### 5.1 Grouping Rules

Each experience block (company/role) contains N bullet points. These must be organized into visual groups:

| Total Bullets | Group Configuration | Visual Layout |
|--------------|--------------------|----|
| 2 | 1 group of 2 | `[2]` |
| 3 | 1 group of 3 | `[3]` |
| 4 | 1 group of 2 + 1 group of 2 | `[2] + [2]` |
| 5 | 1 group of 3 + 1 group of 2 | `[3] + [2]` |
| 6 | 2 groups of 3 | `[3] + [3]` |
| 7 | 1 group of 3 + 2 groups of 2 | `[3] + [2] + [2]` |
| 8 | 2 groups of 3 + 1 group of 2 | `[3] + [3] + [2]` |
| 9 | 3 groups of 3 | `[3] + [3] + [3]` |

**Grouping algorithm:**

```
def group_bullets(n):
    """Split n bullets into groups of 2-3, preferring 3s first."""
    groups = []
    remaining = n
    while remaining > 0:
        if remaining >= 5:
            groups.append(3)
            remaining -= 3
        elif remaining == 4:
            groups.append(2)
            groups.append(2)
            remaining = 0
        elif remaining == 3:
            groups.append(3)
            remaining = 0
        elif remaining == 2:
            groups.append(2)
            remaining = 0
        elif remaining == 1:
            # Absorb into previous group if possible
            if groups and groups[-1] == 2:
                groups[-1] = 3
            else:
                groups.append(2)  # Minimum group size; pad with spacer
            remaining = 0
    return groups
```

### 5.2 Visual Spacing

Groups are separated by a blank line (or equivalent vertical spacing):

```html
<!-- Group 1 -->
<li><span class="li-content">Bullet one fills the entire line edge to edge with justified text</span></li>
<li><span class="li-content">Bullet two fills the entire line edge to edge with justified text</span></li>
<li><span class="li-content">Bullet three fills the entire line edge to edge with justified text</span></li>

<!-- Spacer between groups -->
<li class="bullet-group-spacer" aria-hidden="true"></li>

<!-- Group 2 -->
<li><span class="li-content">Bullet four fills the entire line edge to edge with justified text</span></li>
<li><span class="li-content">Bullet five fills the entire line edge to edge with justified text</span></li>
```

CSS for the spacer:

```css
.bullet-group-spacer {
    list-style: none;
    height: 0.5em;  /* Half a line of vertical space */
    margin: 0;
    padding: 0;
}
```

### 5.3 Grouping by Signal Strength

Within each experience block, bullets should be arranged by project/theme, not randomly. The grouping follows this priority:

1. **Group by project** — Bullets about the same project stay together
2. **Within a group, order by impact** — Highest-signal bullet first
3. **Between groups, order by recency** — Most recent project group first
4. **Cross-group signal balance** — Each group should contain at least one metric-bearing bullet

---

## 6. CSS Implementation

### 6.1 Justify Formatting Rules

The core CSS that enables edge-to-edge bullet appearance:

```css
/* Apply to all bullet text containers */
.li-content,
.edge-to-edge-line {
    text-align: justify;
    text-align-last: justify;
    word-spacing: normal;
    letter-spacing: normal;
    hyphens: none;           /* Never break words with hyphens */
    overflow-wrap: normal;   /* Do not break mid-word */
}
```

**How this works:**

1. `text-align: justify` distributes extra space between words on all lines except the last.
2. `text-align-last: justify` extends this to the last line (which, for single-line bullets, is the only line).
3. When the bullet text fills 95% of the line, the remaining 5% is distributed across the ~12-18 word spaces in the bullet, adding approximately 1.5-2.5px per space. This is imperceptible to the human eye -- word spacing looks natural.
4. The result: every bullet appears to fill the full line width, edge-to-edge.

### 6.2 Critical CSS Constraints

```css
/* Prevent line wrapping -- bullets MUST be single-line */
.li-content {
    white-space: nowrap;     /* Enforce single line */
    overflow: hidden;        /* Clip any overflow as safety net */
    text-overflow: ellipsis; /* Visual indicator if overflow occurs (should never happen) */
    display: block;          /* Ensure block-level for text-align to work */
}
```

**Alternative approach (if `nowrap` conflicts with justify):**

If `white-space: nowrap` prevents `text-align: justify` from working (since justify needs line-break opportunities), use this instead:

```css
.li-content {
    display: block;
    text-align: justify;
    text-align-last: justify;
    /* No white-space: nowrap -- rely on the width calculation to prevent wrapping */
    /* Overflow hidden as safety net only */
    overflow: hidden;
    max-height: 1.4em;      /* Clip to exactly one line height */
    line-height: 1.4;
}
```

This approach relies on the bullet being sized correctly (via the width calculation) rather than forcing `nowrap`. The `max-height: 1.4em` acts as a safety net to clip a second line if it somehow wraps.

### 6.3 Template CSS Injection Points

For the current CV template (PLAN-01 audit reference), the injection points are:

| Selector | Current CSS | Addition | Line Ref |
|----------|------------|----------|----------|
| `.li-content` | `font-size: var(--font-size-body)` | Add `text-align: justify; text-align-last: justify;` | CV template inline `<style>` |
| `.edge-to-edge-line` | `font-size: var(--font-size-body)` | Add `text-align: justify; text-align-last: justify;` | CV template inline `<style>` |
| `.bullet-group-spacer` | Does not exist | Create new rule (Section 5.2) | New CSS rule |
| `@media print` | Existing print rules | Verify justify rules survive print context | Lines 250-258 |

### 6.4 Print-Specific Considerations

The justify rules must be verified in print context because:

1. Browser print rendering may use different DPI (72 DPI vs 96 DPI for screen).
2. The `@page { size: A4; margin: 0; }` rule sets the physical page, but the browser's PDF renderer may interpret widths slightly differently.
3. `text-align: justify` behavior in print is browser-dependent -- Chrome and Firefox handle it identically, but Safari may add slightly more inter-word spacing.

**Recommendation:** Always target 95% fill (not 100%) so that the justify distribution is small (0-5%) and visually indistinguishable across browsers. A bullet at 100% fill with justify turned on risks creating zero-spacing text that looks compressed.

---

## 7. Agent Modifications

### 7.1 sync-sizer (Kael) — Changes Required

The sizer agent currently checks for hardcoded character count thresholds. It must be upgraded to:

#### 7.1.1 New Capabilities

| Capability | Description |
|-----------|-------------|
| **Template width extraction** | Parse CSS variables and rules to build `TemplateWidthConfig` (Section 2.5) |
| **Dynamic budget calculation** | Convert pixel width to digit-unit budget using font-specific advance widths |
| **Weighted width validation** | Replace character count check with weighted-total check |
| **Budget communication** | Output exact budget numbers for sync-refiner to consume |

#### 7.1.2 Updated Agent Definition

The following additions should be made to `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/agents/sync-sizer.md`:

**New rules to add:**

```xml
<rules>
    <r>A bullet that overflows a single line is a critical error.</r>
    <r>Layout integrity takes precedence over word selection.</r>
    <r>NEVER use hardcoded character counts. Always calculate weighted digit-unit width.</r>
    <r>Budget must be recalculated from template CSS for every template change.</r>
    <r>The target fill is 95% of available width. CSS justify handles the remaining 5%.</r>
    <r>Communicate exact digit-unit budgets to sync-refiner, not character counts.</r>
</rules>
```

**New menu items:**

```xml
<item cmd="CB" action="Calculate template budget.">[CB] Calculate Budget: Extract template CSS and compute dynamic line budget.</item>
<item cmd="WV" action="Weighted width validation.">[WV] Weighted Validate: Check all bullets using per-character width weights.</item>
```

#### 7.1.3 Updated Validation Logic

Replace the current step-17a logic:

**Current (to be replaced):**
```
IF char_count > 90: OVERFLOW
IF char_count < 68: TOO_SHORT
Target: 82-88 characters
```

**New:**
```
1. Load TemplateWidthConfig from template CSS extraction
2. For each bullet:
   a. weighted_total = sum(weight(char) for char in bullet)
   b. fill_pct = weighted_total / raw_budget
   c. IF fill_pct > 1.00: OVERFLOW
   d. IF fill_pct < 0.90: TOO_SHORT
   e. IF 0.90 <= fill_pct <= 1.00: PASS
3. For OVERFLOW: send to Refiner with:
   "Line [N] measures [weighted_total] digit-units. Budget: [raw_budget].
    Target: [target_budget] (95% fill). Trim [excess] digit-units.
    Preserve: the metric. Preserve: the action verb.
    Compress: the middle context clause."
4. For TOO_SHORT: send to Refiner with:
   "Line [N] measures [weighted_total] digit-units. Budget: [raw_budget].
    Target: [target_budget] (95% fill). Expand by [deficit] digit-units.
    Add: qualifying context or longer synonyms."
```

### 7.2 sync-refiner (Veda) — Changes Required

The refiner agent currently sculpts bullets by "feel" using the XYZ formula. It must be upgraded to write to exact width targets.

#### 7.2.1 New Capabilities

| Capability | Description |
|-----------|-------------|
| **Width-aware drafting** | Use rough character target derived from digit-unit budget |
| **Per-character measurement** | Calculate weighted_total for any string using the weight table |
| **Synonym bank with width deltas** | Maintain a set of synonym pairs with known width differences |
| **Iterative tune loop** | Expand/trim bullets to hit the 95% target within 3 iterations |

#### 7.2.2 Updated Agent Definition

The following additions should be made to `/Users/satvikjain/Downloads/sync/linkright/_lr/sync/agents/sync-refiner.md`:

**New rules to add:**

```xml
<rules>
    <r>Use the XYZ impact formula exclusively for experience bullets.</r>
    <r>No buzzwords; every adjective must be backed by a verifiable signal.</r>
    <r>Write bullets to the exact digit-unit budget provided by sync-sizer.</r>
    <r>Target 95% fill of available line width. Never exceed 100%.</r>
    <r>Use the Roboto weight table for per-character width measurement.</r>
    <r>When trimming, prefer shorter synonyms over removing content.</r>
    <r>When expanding, prefer adding quantified context over filler words.</r>
    <r>Maximum 3 tune iterations per bullet. If still out of range, flag for user.</r>
</rules>
```

**New menu items:**

```xml
<item cmd="WS" action="Width-aware sculpt.">[WS] Width Sculpt: Sculpt bullets to exact pixel-width targets.</item>
```

#### 7.2.3 Budget Consumption Contract

Sync-refiner receives the budget from sync-sizer in this format:

```yaml
# Budget handoff from sizer to refiner
budget:
  template_id: "cv-a4-sidebar"
  font_size_pt: 9.5
  raw_budget_digit_units: 99.7
  target_budget_digit_units: 94.7
  min_budget_digit_units: 89.8
  max_budget_digit_units: 99.7
  weight_table: "roboto-regular-v3"
  fill_target_pct: 0.95
```

### 7.3 sync-styler (Cora) — Changes Required

Sync-styler is responsible for template selection (step 18) and CSS compilation (step 35). It must be upgraded to:

| Capability | Description |
|-----------|-------------|
| **Emit TemplateWidthConfig** | After selecting a template, extract its CSS properties and produce the config object |
| **Inject justify CSS** | Add `text-align: justify; text-align-last: justify;` to the compiled CSS |
| **Inject bullet group spacer CSS** | Add `.bullet-group-spacer` rule to the compiled CSS |

---

## 8. Workflow Integration

### 8.1 jd-optimize Workflow Steps Requiring Modification

The jd-optimize workflow has 40 step files organized in `steps-c/` (core), `steps-e/` (edit), and `steps-v/` (validate). The following steps need modification:

| Step | File | Current Behavior | Required Change |
|------|------|-----------------|-----------------|
| **Step 17a** | `step-17a-sizer-line-overflow-check.md` (master orch) | Checks `char_count > 90` | Replace with weighted digit-unit check against dynamic budget |
| **Step 17b** | `step-17b-sizer-page-budget-check.md` (master orch) | Uses "58 usable lines" hardcode | Keep line count check but add weighted width validation |
| **Step 17c** | `step-17c-sizer-refiner-iterate.md` (master orch) | Sizer tells refiner to "cut N lines" | Sizer tells refiner exact digit-unit budget per bullet |
| **Step 18** | `step-18-select-resume-template.md` (master orch) | Selects template path | Add: extract TemplateWidthConfig from selected template |
| **Step 27** | `step-27-content-drafting.md` | Stub: "Execute core logic" | Add: sync-refiner writes bullets using rough width target from budget |
| **Step 28** | `step-28-content-refining.md` | Stub: "Execute core logic" | Add: sync-refiner measures and tunes each bullet to 95% fill |
| **Step 31** | `step-31-layout-budget.md` | Stub: "Execute core logic" | Add: sync-sizer extracts TemplateWidthConfig, calculates dynamic budget |
| **Step 32** | `step-32-layout-sizing.md` | Stub: "Execute core logic" | Add: sync-sizer validates all bullets against dynamic budget |
| **Step 34** | `step-34-style-theming.md` | Stub: "Execute core logic" | Add: inject justify CSS rules into template |
| **Step 35** | `step-35-style-compile.md` | Stub: "Execute core logic" | Add: compile bullet group spacer CSS into final template |

### 8.2 Modified Step Execution Order

The current order places layout validation (steps 17a-17c) before template selection (step 18). With dynamic budgets, the order must change because the budget depends on the template:

**Current order:**
```
... -> step-17a (sizer line check) -> step-17b (sizer page check) ->
step-17c (sizer-refiner iterate) -> step-18 (select template) -> ...
```

**Required order:**
```
... -> step-18 (select template + extract TemplateWidthConfig) ->
step-17a (sizer weighted width check) -> step-17b (sizer page check) ->
step-17c (sizer-refiner iterate with digit-unit budgets) -> ...
```

Alternatively, if the step numbering cannot be changed, step-17a should internally trigger template selection (or consume a previously-selected template) before performing validation.

### 8.3 Data Flow Between Steps

```
step-18 (sync-styler)
  OUTPUT: template_width_config.yaml
    |
    v
step-31 (sync-sizer)
  INPUT:  template_width_config.yaml
  OUTPUT: line_budget.yaml
    {target: 94.7, min: 89.8, max: 99.7, weight_table: "roboto-regular-v3"}
    |
    v
step-27 (sync-refiner)
  INPUT:  line_budget.yaml + signal_blocks
  OUTPUT: draft_bullets[] (rough width)
    |
    v
step-28 (sync-refiner)
  INPUT:  draft_bullets[] + line_budget.yaml + weight_table
  OUTPUT: tuned_bullets[] (95% fill, measured)
    |
    v
step-32 (sync-sizer)
  INPUT:  tuned_bullets[] + line_budget.yaml
  OUTPUT: validation_report.yaml
    {passed: N, overflow: [], too_short: [], manual_review: []}
    |
    v
step-17c (sync-sizer + sync-refiner) [if needed]
  INPUT:  validation_report.yaml + tuned_bullets[]
  OUTPUT: final_bullets[] (all within budget)
```

---

## 9. Edge Cases

### 9.1 Bold Text Width Delta

When bullet text contains **bold** segments (e.g., metric callouts like **18% revenue growth**), the character widths increase. The Roboto Bold delta table shows:

- Digits gain +57 units each (+0.371px at 10pt)
- Lowercase letters gain +47 to +80 units each
- The bold version of "18%" adds **+1.361px** total (enough to overflow a near-full line)

**Handling:**

```
For each character in the bullet:
    IF character is within a <b> or <strong> tag:
        weight = bold_weight_table[char]
    ELSE:
        weight = regular_weight_table[char]
```

Bold weight adjustments (relative to Regular weights):

| Regular Weight | Bold Weight | Delta |
|---------------|-------------|-------|
| 0.445 (i,j,l) | 0.495 | +0.050 |
| 0.516 (I,space) | 0.565 | +0.049 |
| 1.000 (a,e,digits) | 1.052 | +0.052 |
| 1.071 (b,d,g,h,n,o,p,q,u) | 1.118 | +0.047 |
| 1.385 (w,M) | 1.455 | +0.070 |
| 1.599 (m,W) | 1.658 | +0.059 |

**Practical rule:** If a bullet contains N bold characters, reduce the available budget by approximately `N x 0.05` digit-units as a conservative estimate.

### 9.2 Mixed Font Templates

Some templates may use a different font for bullet text (e.g., Inter, Calibri, or Arial instead of Roboto). The weight table must be font-specific.

**Handling:**

1. The `TemplateWidthConfig` includes `font_family` and `font_weight`.
2. If the font is not Roboto, the system falls back to a generic weight table based on proportional font averages.
3. For supported fonts (Roboto, Calibri, Inter), font-specific hmtx tables are used.
4. For unsupported fonts, use the average character width assumption (all characters weight = 1.0, but with a safety margin of 90% fill instead of 95%).

### 9.3 Templates with Different Base Font Sizes

The CV template uses 9.5pt for body text, but other templates may use 9pt, 10pt, 10.5pt, or 11pt.

| Font Size | Digit Width (px) | Budget on 669.7px column | 95% Target |
|-----------|-----------------|-------------------------|------------|
| 9.0pt | 6.384px | 104.9 | 99.6 |
| 9.5pt | 6.718px | 99.7 | 94.7 |
| 10.0pt | 7.070px | 94.7 | 90.0 |
| 10.5pt | 7.424px | 90.2 | 85.7 |
| 11.0pt | 7.777px | 86.1 | 81.8 |

The dynamic calculation handles this automatically -- no special case needed.

### 9.4 Bullets with Special Characters

Characters not in the weight table (e.g., Unicode symbols, emoji, accented characters) should be treated as follows:

| Character Type | Default Weight | Rationale |
|---------------|---------------|-----------|
| Accented Latin (e, a, o, etc.) | Same weight as base character | Accented characters have identical advance widths in Roboto |
| Currency symbols (EUR, GBP, JPY) | 1.000 | Tabular width like digits |
| Mathematical symbols | 1.099 | Similar to B/C/K class |
| Emoji | 2.000 | Typically displayed at full em-width |
| Unknown | 1.000 | Safe default (digit-width baseline) |

### 9.5 Very Short or Very Long Experience Blocks

| Scenario | Handling |
|----------|---------|
| Only 1 bullet for an experience | Group rules say minimum 2. Either add a second bullet or merge this experience with an adjacent one. Flag for user review. |
| More than 9 bullets for an experience | This exceeds the one-page budget. Sizer should flag this before grouping. Reduce to max 6-8 bullets. |
| Bullet is too complex for single line | If the bullet's minimum viable content (verb + metric) already exceeds the budget, split into two bullets or restructure as a project title + sub-bullet. |

### 9.6 DPI Variance Between Screen and Print

Screen rendering typically uses 96 DPI, while print may use 72 DPI or the printer's native resolution (300/600 DPI for PDF).

**Handling:**

- The budget calculation targets **96 DPI** by default (the CSS pixel standard).
- For print, browsers normalize to CSS pixels before sending to the PDF renderer, so the 96 DPI calculation remains correct for `@media print` context.
- The `text-align: justify` CSS rule operates at the CSS pixel level, not the physical DPI level, so it is DPI-independent.
- No special DPI handling is needed beyond using 96 DPI consistently.

### 9.7 Kerning and Ligatures

Roboto supports kerning pairs (e.g., "AV", "To", "Wa") where the rendered width is slightly less than the sum of individual advance widths. The hmtx table does not account for kerning -- that is in the GPOS table.

**Handling:**

- Kerning adjustments are typically small (1-3px total per line at 10pt).
- The 95% fill target (rather than 100%) provides a 5% buffer that absorbs kerning effects.
- Do not attempt to model kerning pairs -- the complexity is not justified given the 5% buffer.
- If a font has ligatures enabled (fi, fl, ffi, ffl), these replace two characters with one glyph that is narrower than the sum. Again, the 5% buffer absorbs this.

---

## 10. Acceptance Criteria

### 10.1 Functional Criteria

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-01 | Given the CV A4 template at 9.5pt Roboto, the system calculates available_width_px within 2% of 669.7px | Unit test: extract CSS, compare output |
| AC-02 | Given the CV A4 template, the system calculates a digit-unit budget within 1% of 99.7 | Unit test: formula chain validation |
| AC-03 | For any bullet passed to sync-refiner, the returned bullet has a weighted total between 90% and 100% of the raw budget | Integration test: process 20 sample bullets |
| AC-04 | No bullet in the final resume output wraps to a second line when rendered in the template at the specified font size | Visual regression test: render HTML, screenshot, verify single-line |
| AC-05 | CSS `text-align: justify; text-align-last: justify;` is present on all `.li-content` and `.edge-to-edge-line` elements | CSS inspection test |
| AC-06 | The justify formatting produces visually uniform word spacing (no more than 4px between any two words) | Visual inspection of rendered output |
| AC-07 | Bullet groups are correctly formed (min 2, max 3 per group) with visual spacing between groups | DOM inspection: count `<li>` elements per group, verify spacer presence |
| AC-08 | When a bullet contains bold text, the weighted total accounts for the bold width delta | Unit test: compare weighted_total for same string in Regular vs with bold segments |
| AC-09 | Changing `--page-width` from `210mm` to `215.9mm` (US Letter) recalculates the budget without code changes | Integration test: modify CSS variable, verify new budget |
| AC-10 | Changing `--font-size-body` from `9.5pt` to `10pt` recalculates the budget correctly | Integration test: modify CSS variable, verify new budget |

### 10.2 Performance Criteria

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-11 | The sizer-refiner iteration loop converges within 3 iterations for at least 95% of bullets | Log analysis: count iterations per bullet across 50+ test cases |
| AC-12 | Template width extraction completes in under 100ms (no external API calls, pure CSS parsing) | Performance test: time the extraction function |

### 10.3 Compatibility Criteria

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-13 | The justify formatting renders correctly in Chrome, Firefox, and Safari when printing to PDF | Cross-browser test: print to PDF from each browser, compare output |
| AC-14 | The system produces correct budgets for at least 3 different template types (single-column, sidebar, two-column) | Template matrix test: run budget calculation against 3 template CSS files |
| AC-15 | Existing jd-optimize workflow steps that do not touch layout (steps 01-16, 18-26) are unaffected by E5 changes | Regression test: run full workflow, verify non-layout steps produce identical output |

### 10.4 Data Contract Criteria

| ID | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-16 | sync-sizer outputs a `template_width_config.yaml` conforming to the schema in Section 2.5 | Schema validation test |
| AC-17 | sync-sizer outputs a `line_budget.yaml` that sync-refiner can consume without additional parsing | Integration test: sizer produces, refiner consumes, no errors |
| AC-18 | The weighted width of every bullet is logged in the validation report for audit purposes | Log inspection: verify `validation_report.yaml` contains `{bullet_id, text, weighted_total, fill_pct, status}` for each bullet |

---

## Appendix A: Complete Roboto Regular Weight Table (Quick Reference)

Reproduced from SYNC-DESIGN-AND-TECHNICAL-SPECS.md for convenience. Digit = 1.000 baseline.

```
0.445  i  j  l  '
0.516  I  [space]  .  ,  :  ;  |
0.589  f  !  -  (  )
0.657  r  J  /  "
0.727  t
0.801  *  [bullet]
0.860  s
0.930  c  z  F  L  ?
1.000  a  e  k  v  x  y  E  S  0-9  [en-dash]  $
1.029  T  Z
1.071  b  d  g  h  n  o  p  q  u
1.099  B  C  K  P  X  Y  +  #
1.169  A  R  V  &
1.239  D  G  H  N  U
1.309  O  Q
1.385  w  M  %  [right-arrow]
1.599  m  W  [em-dash]
1.740  @
```

## Appendix B: Worked Example — Full Bullet Sizing Pipeline

**Template:** CV A4 with sidebar (current)
**Font:** Roboto Regular 9.5pt at 96 DPI
**Available width:** 669.7px
**Digit width at 9.5pt:** 6.718px
**Raw budget:** 99.7 digit-units
**Target (95%):** 94.7 digit-units
**Acceptable range:** 89.8 - 99.7 digit-units

### Iteration 1: Draft

Sync-refiner drafts:
> `Spearheaded cross-functional product launch driving $2.4M ARR within first quarter post-release`

Weighted measurement:
```
S(1.000) p(1.071) e(1.000) a(1.000) r(0.657) h(1.071) e(1.000) a(1.000) d(1.071) e(1.000) d(1.071) [sp](0.516)
c(0.930) r(0.657) o(1.071) s(0.860) s(0.860) -(0.589) f(0.589) u(1.071) n(1.071) c(0.930) t(0.727) i(0.445) o(1.071) n(1.071) a(1.000) l(0.445) [sp](0.516)
p(1.071) r(0.657) o(1.071) d(1.071) u(1.071) c(0.930) t(0.727) [sp](0.516)
l(0.445) a(1.000) u(1.071) n(1.071) c(0.930) h(1.071) [sp](0.516)
d(1.071) r(0.657) i(0.445) v(1.000) i(0.445) n(1.071) g(1.071) [sp](0.516)
$(1.000) 2(1.000) .(0.516) 4(1.000) M(1.385) [sp](0.516)
A(1.169) R(1.169) R(1.169) [sp](0.516)
w(1.385) i(0.445) t(0.727) h(1.071) i(0.445) n(1.071) [sp](0.516)
f(0.589) i(0.445) r(0.657) s(0.860) t(0.727) [sp](0.516)
q(1.071) u(1.071) a(1.000) r(0.657) t(0.727) e(1.000) r(0.657) [sp](0.516)
p(1.071) o(1.071) s(0.860) t(0.727) -(0.589) r(0.657) e(1.000) l(0.445) e(1.000) a(1.000) s(0.860) e(1.000)

weighted_total = 80.1 digit-units
fill_pct = 80.1 / 99.7 = 80.3%  --> TOO_SHORT (below 90%)
```

### Iteration 2: Expand

Sync-refiner expands with qualifying context:
> `Spearheaded cross-functional product launch for enterprise SaaS platform, driving $2.4M incremental ARR within first quarter post-release`

Recalculate: weighted_total = 104.2 digit-units
fill_pct = 104.2 / 99.7 = 104.5% --> OVERFLOW (above 100%)

### Iteration 3: Trim

Sync-refiner trims middle clause:
> `Spearheaded cross-functional product launch for enterprise platform, driving $2.4M incremental ARR within first quarter post-release`

Recalculate: weighted_total = 97.8 digit-units
fill_pct = 97.8 / 99.7 = 98.1% --> PASS (within 90-100%)

CSS `text-align-last: justify` distributes the remaining 1.9% gap (approximately 12.7px) across ~17 word spaces, adding ~0.75px per space. Imperceptible. Bullet appears edge-to-edge.

**Final bullet accepted.**

## Appendix C: Synonym Bank with Width Deltas (Starter Set)

These are width-calibrated synonym pairs for fine-tuning within 1-5 digit-units:

### Expansion Synonyms (increase width)

| From | To | Delta (digit-units) | Context |
|------|----|---------------------|---------|
| led | directed | +3.5 | leadership verbs |
| cut | reduced | +2.3 | cost/time reduction |
| ran | managed | +2.8 | program management |
| built | developed | +3.1 | engineering |
| set | established | +5.8 | strategy |
| got | acquired | +3.9 | business dev |
| for | enabling | +3.9 | impact clauses |
| via | through | +2.1 | methodology |
| by | through | +3.1 | causal connectors |

### Trimming Synonyms (decrease width)

| From | To | Delta (digit-units) | Context |
|------|----|---------------------|---------|
| implementation | launch | -5.5 | release actions |
| orchestrated | led | -5.2 | leadership verbs |
| development | dev work | -3.2 | engineering |
| approximately | about | -5.0 | qualifiers |
| across the organization | company-wide | -5.1 | scope descriptors |
| in collaboration with | with | -9.5 | team references |
| was responsible for | managed | -8.7 | ownership clauses |
| resulting in | yielding | -1.8 | impact connectors |
| contributing to | driving | -3.4 | impact verbs |

---

*This document is a design specification for Enhancement E5 of Linkright Release 3. It should be used in conjunction with the Roboto font advance width tables in SYNC-DESIGN-AND-TECHNICAL-SPECS.md and the CV template CSS audit in PLAN-01-PORTFOLIO-CV-AUDIT.md.*
