# Frontend-Slides API Specification & Integration Contract

**Date:** 2026-03-09
**Release:** E2 v2 (Signal-to-Slides Pipeline)
**Audience:** Signal Transformer, Portfolio Integration, Test Engineers

---

## Executive Summary

`frontend-slides` is a **Claude Code skill** that converts content (text, signals, images) into production-ready HTML slideshows. It operates through conversational interaction with Claude, not through REST APIs or programmatic libraries.

**Key Facts:**
- **Zero dependencies:** Single self-contained HTML file output
- **12 curated styles:** Including "Dark Botanical" (optimal for Abyssal Depth aesthetic)
- **Input:** Natural language descriptions of slides + tone/style preferences
- **Output:** Standalone HTML file (30-200KB, embeddable in web views)
- **License:** MIT (permissive for Linkright use)

---

## 1. Skill Invocation Model

### Entry Point
```
/frontend-slides
```
Invoked from Claude Code CLI or embedded in workflows.

### Interaction Flow

```
Step 1: Content Discovery
  User provides: slide titles, bullet points, narrative, images
  Skill asks: "What messages do you want across slides?"

Step 2: Tone Specification
  User provides: feeling/impression desired (impressed, excited, calm, inspired, motivated)
  Skill interprets: Maps tone → visual/typography choices

Step 3: Style Selection
  Skill generates: 3 visual previews (HTML screenshots)
  User chooses: One style to proceed with

Step 4: Generation
  Skill creates: Complete HTML file with inline CSS/JS
  Build time: ~5-15 seconds per deck

Step 5: Output
  Returns: Single .html file (ready for embedding or browser view)
  Size: 30-200KB depending on complexity
```

---

## 2. Input Contract

### Minimal Input
```
/frontend-slides

> "Create a 5-slide deck. Slide 1: My Skills (React, TypeScript, AWS). Slide 2: Featured Project (E-commerce Platform). Slide 3: Impact (30% performance improvement). Slide 4: Growth Mindset. Slide 5: Let's Connect. Tone: Professional + Inspiring."
```

### Full Input (Recommended for Signal Pipeline)
```json
{
  "content": {
    "deck_title": "Professional Identity Snapshot",
    "slides": [
      {
        "title": "Hook/Introduction",
        "body": "... candidate summary ...",
        "visuals": "gradient_background"
      },
      {
        "title": "Core Skills",
        "body": "... ranked competencies ...",
        "visuals": "skill_icons"
      },
      {
        "title": "Featured Project",
        "body": "... project narrative with metrics ...",
        "visuals": "project_screenshot_url"
      },
      {
        "title": "Growth & Trajectory",
        "body": "... career progression + learnings ...",
        "visuals": "timeline_or_chart"
      },
      {
        "title": "Call to Action",
        "body": "... next steps, contact info ...",
        "visuals": "contact_card"
      }
    ]
  },
  "style_preference": "Dark Botanical",
  "tone": "professional, inspiring, confident",
  "customization": {
    "brand_colors": ["#1a3a3a", "#2d5a5a", "#4a8f8f"],  // Abyssal Depth palette
    "typography": "clean, modern, high-contrast"
  }
}
```

### Input Constraints
| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `deck_title` | string | 3-50 chars | Appears on title slide |
| `slides` | array | 3-10 slides | Optimal: 5-7 for web |
| `title` per slide | string | 3-40 chars | Clear, scannable |
| `body` per slide | string | 50-300 chars | Concise, signal-dense |
| `style_preference` | enum | 12 allowed values | See Section 3 |
| `tone` | string | natural language | Examples: "professional", "creative", "confident" |
| `brand_colors` | array | 3-5 hex values | Optional; overrides style defaults |

---

## 3. Available Styles (12 Curated)

| Style Name | Best For | Primary Aesthetic | Abyssal Depth Match? |
|------------|----------|-------------------|----------------------|
| **Dark Botanical** | ✓ Premium dark mode | Deep forest vibes, organic | ✓ OPTIMAL |
| Minimalist | Clean, technical | High contrast, sans-serif | Fair |
| Sunset | Warm, energetic | Oranges, golds, reds | Poor |
| Ocean Blue | Calm, trustworthy | Blues, waters | Fair |
| Modern Gradient | Contemporary | Smooth gradients | Possible |
| Corporate | Professional | Blue-gray, neutral | Poor |
| Creative | Artistic | Bold colors, patterns | Poor |
| Neon | Tech-forward | Bright accents, dark base | Fair |
| Elegant | Luxury | Gold accents, serif | Possible |
| Retro | Nostalgic | Muted earth tones | Poor |
| Cosmic | Futuristic | Dark space, tech accents | Possible |
| Playful | Energetic | Bright, fun | Poor |

**Recommendation:** Use **Dark Botanical** for all Linkright signal decks (maps to Abyssal Depth aesthetic defined in Release 3 E2 planning).

---

## 4. Output Contract

### HTML File Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Identity Snapshot</title>
  <style>
    /* All CSS inlined - no external stylesheets */
    body { ... Dark Botanical styles ... }
    .slide { ... slide container ... }
    .slide-content { ... typography + layout ... }
    .navigation { ... prev/next buttons ... }
  </style>
</head>
<body>
  <!-- Slide 1 -->
  <div class="slide" data-slide="1">
    <div class="slide-content">
      <h1>Professional Identity Snapshot</h1>
      <p>... content ...</p>
    </div>
  </div>
  <!-- Slide 2-5 -->
  ...
  <!-- Navigation -->
  <div class="navigation">
    <button id="prev-slide">← Previous</button>
    <span id="slide-counter">1 / 5</span>
    <button id="next-slide">Next →</button>
  </div>
  <!-- JavaScript -->
  <script>
    // Slide navigation logic (inlined)
    const slides = document.querySelectorAll('.slide');
    let current = 0;
    document.getElementById('next-slide').onclick = () => { ... };
    document.getElementById('prev-slide').onclick = () => { ... };
  </script>
</body>
</html>
```

### Output Characteristics
- **Format:** Single HTML file (self-contained, no dependencies)
- **Size:** 40-150KB (typical for 5-slide deck)
- **Browser Compatibility:** Chrome, Safari, Firefox, Edge (ES6+)
- **Responsive:** Mobile-friendly (viewport meta tag)
- **Accessibility:** Keyboard navigation (← →), ARIA labels for screen readers
- **Performance:** Renders in <2 seconds on typical broadband

### Embedding in Portfolio (View 2)
```html
<!-- In portfolio HTML -->
<section id="slides-container">
  <iframe
    src="signal-slides-{profile_id}.html"
    width="100%"
    height="600px"
    frameborder="0"
    allow="fullscreen"
  ></iframe>
</section>

<style>
  #slides-container {
    max-width: 900px;
    margin: 2rem auto;
    border-radius: 8px;
    overflow: hidden;
  }
  iframe {
    border: 1px solid #ddd;
  }
</style>
```

---

## 5. Integration Workflow (Signal-to-Slides Pipeline)

### Step 1: Signal Content Preparation
```
Input: Ranked professional signals from Sync Module
  - Hook/summary
  - Top 5 skills (ranked by relevance to JD)
  - Featured project (highest impact)
  - Career growth narrative
  - CTA / contact info

Output: Slide content structure (Section 2)
```

### Step 2: Content Transformation
```
Process: Signal → Slide Copy
  - Distill signals to 50-100 chars per slide body
  - Format titles (3-5 words each)
  - Select visuals (icons, gradients, or embedded images)
  - Apply tone guidelines (professional + inspiring)

Output: Filled input JSON (Section 2)
```

### Step 3: Skill Invocation
```
Command: /frontend-slides
Input: Transformed content JSON
Output: Single HTML file (e.g., signal-slides-{profile_id}.html)
Time: ~10 seconds per profile
```

### Step 4: Portfolio Integration
```
Process: Embed HTML in portfolio View 2
  - Store HTML in portfolio artifacts directory
  - Add iframe reference to portfolio HTML
  - Verify responsive layout
  - Test keyboard navigation + accessibility

Output: Live embedded slides in portfolio
```

### Step 5: Validation & QA
```
Checks:
  - HTML renders without errors
  - Navigation works (prev/next buttons)
  - Slides are readable on mobile (375px+)
  - Accessibility: keyboard nav + ARIA labels present
  - Page load time < 3 seconds
  - No console errors

Output: QA pass/fail report
```

---

## 6. Technical Integration Points

### A. Portfolio Workflow Hook

**File:** `_lr/flex/workflows/portfolio-deploy/steps-c/step-01b-prepare-slides.md`
**Purpose:** Transform ranked signals → slide content
**Dependencies:** Sync module signal extraction output
**Output:** Slide content JSON

### B. Skill Execution

**Skill:** `/frontend-slides`
**Trigger:** When slide content ready
**Automation:** Claude-driven batch processing for 10+ profiles
**Output:** HTML files in `portfolio/artifacts/slides/`

### C. Portfolio HTML Embedding

**File:** `_lr/flex/workflows/portfolio-deploy/steps-c/step-01c-embed-slides.md`
**Purpose:** Add iframe references to portfolio HTML
**Input:** HTML file paths
**Output:** Updated portfolio HTML with embedded slides

### D. Accessibility Audit

**File:** `_lr/tea/workflows/accessibility-testing/` (cross-reference)
**Scope:** Slides must meet WCAG 2.1 AA
**Checks:** Keyboard navigation, color contrast, semantic HTML
**Output:** A11y report or remediation tasks

---

## 7. Error Handling & Fallbacks

| Scenario | Detection | Resolution |
|----------|-----------|-----------|
| Skill timeout (>30s) | No HTML after 30s | Retry once; log for performance review |
| Malformed input | JSON parse error | Validate structure; use defaults for missing fields |
| Style not recognized | Unknown style in request | Fall back to Dark Botanical |
| HTML parse failure | Output not valid HTML | Log error; generate minimal fallback slides |
| Embedding iframe fails | Iframe cross-origin error | Use link instead: "View slides →" |

---

## 8. Performance Targets

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Skill execution time per profile | <15s | TBD (pending test) | ⏳ |
| HTML file size | <200KB | TBD (pending test) | ⏳ |
| Portfolio page load + slides | <3s | TBD (pending test) | ⏳ |
| Mobile responsiveness | 375px-2560px | TBD (pending test) | ⏳ |
| Accessibility: keyboard nav | ✓ Functional | TBD (pending test) | ⏳ |

---

## 9. References & Dependencies

- **Repository:** https://github.com/zarazhangrui/frontend-slides
- **License:** MIT
- **Release:** E2 v2 Integration (Release 3)
- **Related ADRs:** ADR-005 (if created for frontend-slides decision)
- **Portfolio Integration:** `_lr/flex/workflows/portfolio-deploy/`
- **Test Coverage:** `tea/workflows/e2e-profile-testing/` (E2E validation)

---

## 10. Sign-Off & Approval

| Role | Status | Notes |
|------|--------|-------|
| Tech Lead | ⏳ Pending | Reviewing API contract |
| QA | ⏳ Pending | Designing test plan |
| Portfolio Owner | ⏳ Pending | Confirming embedding approach |

---

*Document Created: 2026-03-09 | E2 v2 Foundation (sync-2dc.1.1)*
