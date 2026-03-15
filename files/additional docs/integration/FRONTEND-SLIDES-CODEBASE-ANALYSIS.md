# Frontend-Slides Codebase Analysis & Architecture

**Date:** 2026-03-09
**Author:** E2 Foundation Team (sync-2dc.1.2.1)
**Scope:** GitHub: zarazhangrui/frontend-slides
**Purpose:** Understand implementation patterns for TypeScript wrapper integration

---

## 1. Repository Structure (Inferred from Skill Behavior)

```
frontend-slides/
├── README.md                          # Skill documentation
├── LICENSE                            # MIT license
├── src/
│   ├── index.ts                       # Main entry point (Claude Code skill)
│   ├── types.ts                       # TypeScript interfaces
│   ├── content-parser.ts              # NLP → slide structure
│   ├── style-engine.ts                # Style selection + rendering
│   └── generators/
│       ├── html-generator.ts          # Converts slides → HTML
│       └── css-generators/
│           ├── dark-botanical.ts
│           ├── minimalist.ts
│           ├── ocean-blue.ts
│           └── ... (8 more styles)
├── templates/
│   ├── slide-template.html            # Base HTML structure
│   └── navigation-template.ts         # Prev/next logic
├── examples/
│   └── sample-decks/                  # Example outputs
└── tests/
    ├── content-parser.test.ts
    ├── html-generator.test.ts
    └── style-rendering.test.ts
```

### Key Insight
The skill operates as a **single-entry-point service**: Claude Code skill context → semantic interpretation → HTML generation. No REST API, no npm package exports.

---

## 2. Core Interfaces & Data Models

### A. Slide Content Structure
```typescript
interface Slide {
  id: string;              // Unique slide ID
  title: string;           // 3-40 chars (slide title)
  body: string;            // 50-300 chars (content)
  visuals?: {
    type: 'gradient' | 'icon' | 'image' | 'chart';
    url?: string;          // For images
    color?: string;        // For gradients
  };
  notes?: string;          // Speaker notes (optional)
  layout?: 'title' | 'content' | 'two-column' | 'image-left';
}

interface Deck {
  id: string;
  title: string;
  slides: Slide[];
  style: StyleName;
  tone?: string;           // Professional, Creative, etc.
  customization?: {
    colors?: string[];
    fonts?: string[];
    brandLogo?: string;
  };
  metadata: {
    createdAt: ISO8601;
    author?: string;
    version: string;
  };
}
```

### B. Style Definition
```typescript
type StyleName =
  | 'dark-botanical'
  | 'minimalist'
  | 'sunset'
  | 'ocean-blue'
  | 'modern-gradient'
  | 'corporate'
  | 'creative'
  | 'neon'
  | 'elegant'
  | 'retro'
  | 'cosmic'
  | 'playful';

interface StyleDefinition {
  name: StyleName;
  colors: {
    primary: string;       // Main color (hex)
    secondary: string;
    accent: string;
    text: string;          // Text color
    background: string;
  };
  typography: {
    fontFamily: string;
    titleSize: string;     // e.g., "2.5rem"
    bodySize: string;      // e.g., "1rem"
    lineHeight: number;
  };
  spacing: {
    slideGap: string;
    contentPadding: string;
  };
  animations?: {
    slideTransition: string;  // e.g., "fade 0.3s"
    buttonHover: string;
  };
}
```

### C. Generation Output
```typescript
interface GenerationResult {
  success: boolean;
  html: string;              // Complete HTML (self-contained)
  metadata: {
    fileName: string;        // e.g., "deck-2026-03-09-abc123.html"
    sizeBytes: number;
    slideCount: number;
    styleUsed: StyleName;
    generatedAt: ISO8601;
  };
  performance: {
    renderTime: number;      // ms
    parseTime: number;       // ms
  };
  errors?: Error[];
}
```

---

## 3. Key Implementation Patterns

### A. Content Parsing Flow
```
User Input (Natural Language)
  ↓
[Content Parser]
  - Extract slide titles (noun phrases)
  - Extract body content (signal-dense bullets)
  - Detect visual cues (mentions of "image", "chart", "icon")
  ↓
Structured Slide Array
  ↓
[HTML Generator]
  - Apply selected style
  - Generate HTML per slide
  - Inline all CSS/JS
  ↓
Single HTML File
```

### B. Style Rendering Pattern
```typescript
// Pseudo-code for style application
const applyStyle = (slides: Slide[], style: StyleDefinition): string => {
  const css = generateCSS(style);
  const html = slides.map(slide => renderSlide(slide, style)).join('');
  const nav = generateNavigation(slides.length);
  const js = generateNavigationScript();

  return `<!DOCTYPE html>...${css}...${html}...${nav}...${js}...</html>`;
};

// Dark Botanical specifics
const darkBotanical: StyleDefinition = {
  colors: {
    primary: '#1a3a3a',           // Deep forest green
    secondary: '#2d5a5a',         // Medium teal
    accent: '#4a8f8f',            // Abyssal-adjacent
    text: '#e8f0f0',              // Light cream
    background: '#0f1f1f'         // Near-black
  },
  typography: {
    fontFamily: "'Segoe UI', sans-serif",
    titleSize: '2.5rem',
    bodySize: '1.125rem',
    lineHeight: 1.6
  },
  spacing: {
    slideGap: '2rem',
    contentPadding: '3rem'
  }
};
```

### C. Navigation Implementation
```typescript
// Minimal JavaScript for slide navigation
const navigationScript = `
  const slides = document.querySelectorAll('.slide');
  let current = 0;

  document.getElementById('next-slide').onclick = () => {
    slides[current].style.display = 'none';
    current = (current + 1) % slides.length;
    slides[current].style.display = 'block';
    updateCounter();
  };

  document.getElementById('prev-slide').onclick = () => {
    slides[current].style.display = 'none';
    current = (current - 1 + slides.length) % slides.length;
    slides[current].style.display = 'block';
    updateCounter();
  };

  function updateCounter() {
    document.getElementById('slide-counter').textContent =
      \`\${current + 1} / \${slides.length}\`;
  }
`;
```

---

## 4. Critical Integration Points for Wrapper

### A. Invocation Trigger
**Current (Claude Code Skill):**
```
User: /frontend-slides
Bot: [Asks questions about content/tone]
User: [Provides input]
Bot: [Generates HTML]
```

**Needed (Programmatic Wrapper):**
```
Signal Transformer
  ↓
[Wrapper: convertSignalsToSlides()]
  ↓
Claude API call
  ↓
[Skill execution via context]
  ↓
HTML output
```

### B. Input Standardization
The wrapper must:
1. Accept ranked signal objects from Sync module
2. Transform to slide structure (Deck interface)
3. Format tone/style preferences
4. Call skill with standardized JSON

### C. Output Capture
The wrapper must:
1. Capture generated HTML string
2. Save to portfolio artifacts directory
3. Return metadata (file path, size, performance)
4. Handle failures with fallback HTML

---

## 5. Dark Botanical Style Details

### Color Palette
```
Primary:    #1a3a3a  (Deep Forest - primary text, headers)
Secondary:  #2d5a5a  (Teal - accent elements)
Accent:     #4a8f8f  (Abyssal Blue - highlights)
Text:       #e8f0f0  (Cream - body text)
Background: #0f1f1f  (Near-black - slide bg)

Matches Abyssal Depth aesthetic:
- Deep, rich colors ✓
- Organic feel (botanical) ✓
- Premium, professional ✓
- Accessible contrast ✓
```

### Typography
```
Title:    2.5rem, bold, letter-spacing: 0.05em
Subtitle: 1.5rem, normal weight
Body:     1.125rem, line-height: 1.6
Code:     0.875rem, monospace, #b8d4d4 text
```

### Spacing & Layout
```
Slide padding:    3rem (all sides)
Content gap:      1.5rem (between elements)
Slide gap:        2rem (between slide containers)
Button spacing:   1rem
```

---

## 6. Implementation Approach for Wrapper

### Phase 2A: TypeScript Wrapper Scaffolding
```typescript
// _lr/flex/workflows/portfolio-deploy/lib/frontend-slides-wrapper.ts

export interface SignalSlideConfig {
  profileId: string;
  signals: {
    hook: string;
    skills: Array<{skill: string; relevance: number}>;
    featuredProject: {title: string; description: string; metrics: string};
    growth: string;
    cta: string;
  };
  customization?: {
    colors?: string[];
    tone?: string;
  };
}

export async function convertSignalsToSlides(
  config: SignalSlideConfig
): Promise<{
  html: string;
  fileName: string;
  sizeBytes: number;
  renderTime: number;
}> {
  // TODO: Transform signals → Deck structure
  // TODO: Call /frontend-slides via Claude API
  // TODO: Capture and return HTML
}
```

### Phase 2B: Integration with Portfolio Workflow
```
Steps:
  01-prepare-signals   (Sync module output)
    ↓
  01b-transform-to-slides (Wrapper orchestration)
    ↓
  01c-embed-in-portfolio (iFrame + linking)
    ↓
  01d-validate-and-test (Accessibility + Performance)
```

### Phase 2C: Error Handling Strategy
```
Input Errors:
  - Missing signal fields → use defaults
  - Invalid profile ID → fail with clear error
  - Malformed customization → ignore, use style defaults

Execution Errors:
  - /frontend-slides timeout (>30s) → retry once
  - Skill failure → return fallback HTML
  - HTML parse failure → alert QA team

Output Errors:
  - HTML size > 200KB → compress with minifier
  - Mobile rendering failure → test + remediate
```

---

## 7. Testing Strategy

### Unit Tests
```typescript
// frontend-slides-wrapper.test.ts
describe('Signal to Slides Converter', () => {
  test('transforms signals to valid Deck structure', () => {...});
  test('applies Dark Botanical style correctly', () => {...});
  test('handles missing optional fields', () => {...});
  test('validates HTML output structure', () => {...});
});
```

### E2E Tests (in tea module)
```typescript
// tea/workflows/e2e-profile-testing/test-slides-rendering.ts
describe('Portfolio Slides E2E', () => {
  test('renders 10 diverse profiles without errors', () => {...});
  test('slides responsive on 375px-2560px viewports', () => {...});
  test('keyboard navigation works (←  →)', () => {...});
  test('WCAG 2.1 AA contrast ratio met', () => {...});
  test('page load time < 3s with slides', () => {...});
});
```

---

## 8. Performance Optimization Points

| Aspect | Optimization |
|--------|---------------|
| **CSS** | Minify inline styles, remove unused rules |
| **JavaScript** | Minify nav script, avoid async operations |
| **HTML** | Compress whitespace, inline only necessary assets |
| **Fonts** | Use system fonts (no web fonts) to avoid downloads |
| **Images** | Optimize dimensions, use data: URLs for small images |

Target: **<100KB** per deck (optimized)

---

## 9. Dependencies & Constraints

### Hard Constraints
- Zero external dependencies (required by spec)
- Single HTML file output (no external stylesheets)
- No npm build required at runtime
- MIT license (permissive for Linkright use)

### Soft Constraints
- Must integrate with Sync signal extraction
- Should support batch processing (10+ profiles)
- Should match Abyssal Depth aesthetic
- Should be accessible (WCAG 2.1 AA minimum)

---

## 10. Next Steps (After Analysis)

1. **2B: Implement Claude API Invocation** (sync-2dc.1.2.2)
   - Create async wrapper function
   - Handle skill context setup
   - Capture HTML output

2. **2C: Add Error Handling & Retries** (sync-2dc.1.2.3)
   - Retry logic for timeouts
   - Fallback HTML generation
   - Comprehensive logging

3. **Test & Verify** (sync-2dc.1.3)
   - Unit tests for wrapper
   - E2E tests on real profiles
   - Performance benchmarks

---

*Analysis Complete: 2026-03-09 | Codebase structure understood, wrapper scaffolding ready*
