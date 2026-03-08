# port-01c: Slide Rendering (Signals → HTML)

**Workflow Step:** portfolio-deploy
**Sequence:** 01c (after 01b: signal ranking)
**Owner:** Flex → Tea bridge
**Duration:** ~10 min per profile (includes Claude API call)
**Status:** EXECUTABLE

---

## Objective

Transform ranked signals into production HTML slideshows using frontend-slides skill.

**Input:** SyncSignal (from port-01b)
**Output:** HTML file (self-contained, ~60-150KB)
**Error Handling:** Retry logic + fallback HTML generation

---

## Dependencies

- Port-01b signal ranking complete
- `SignalToSlidesTransformer` from `flex/lib/signal-to-slides-transformer.ts`
- `convertSignalsToSlides()` wrapper from `flex/lib/frontend-slides-wrapper.ts`
- Abyssal Depth theme config

---

## Execution Protocol

### Step 1: Transform Signal to Slide Content

```typescript
import { SignalToSlidesTransformer } from '@linkright/flex/lib/signal-to-slides-transformer';

const transformer = new SignalToSlidesTransformer({
  maxSlides: 5,
  style: 'dark-botanical',
  tone: 'professional, inspiring',
  includeVisuals: true,
});

const transformResult = transformer.transform(signal);
// Returns: {
//   deck: SlideDeck,
//   signalDensity: Record<string, number>,
//   avgDensity: number,
//   recommendations: string[]
// }

console.log(`Transformed ${transformResult.deck.slides.length} slides`);
console.log(`Average signal density: ${transformResult.avgDensity}/100`);
```

### Step 2: Validate Transformation Quality

```typescript
import { validateDeck } from '@linkright/flex/lib/slide-content-schema';

const validation = validateDeck(transformResult.deck);

if (!validation.valid) {
  validation.errors.forEach(err => {
    console.error(`[ERROR] ${err.field}: ${err.message}`);
  });
  throw new Error('Deck validation failed');
}

validation.warnings.forEach(warn => {
  console.warn(`[WARN] ${warn.field}: ${warn.message}`);
});
```

### Step 3: Generate Slide Content for Prompt

```typescript
const slideContent = transformResult.deck.slides
  .map((slide, i) => {
    return `Slide ${i + 1}: ${slide.title}
${slide.content.main}
${slide.content.bullets?.map(b => `• ${b}`).join('\n') || ''}`;
  })
  .join('\n\n---\n\n');
```

### Step 4: Call Claude API (Frontend-Slides Wrapper)

```typescript
import { convertSignalsToSlides } from '@linkright/flex/lib/frontend-slides-wrapper';
import { retryWithBackoff } from '@linkright/flex/lib/frontend-slides-errors';

const slideConfig = {
  profileId: signal.profileId,
  signals: signal,
  customization: {
    style: 'dark-botanical',
    tone: 'professional, inspiring',
    colors: [
      '#1a3a3a',  // Abyssal core
      '#4a8f8f',  // Abyssal accent
      '#e8f0f0',  // Text
    ],
  },
  targetDeckSize: 5,
};

let result;
try {
  result = await retryWithBackoff(
    () => convertSignalsToSlides(slideConfig),
    {
      profileId: signal.profileId,
      operationName: 'slide-generation',
      policy: {
        maxAttempts: 3,
        baseDelayMs: 1000,
        maxDelayMs: 30000,
        backoffMultiplier: 2,
        jitterFactor: 0.2,
      },
      onRetry: (err, attempt, delayMs) => {
        console.warn(`[RETRY ${attempt}] Slide generation failed: ${err.message}. Retrying in ${delayMs}ms`);
      },
      onSuccess: (attempt) => {
        console.log(`✓ Slides generated on attempt ${attempt}`);
      },
    }
  );
} catch (error) {
  console.error(`✗ Slide generation failed after retries: ${error.message}`);
  // Fall back to minimal HTML
  result = {
    success: false,
    html: generateFallbackHTML(slideConfig),
    fileName: `slides-fallback-${signal.profileId}.html`,
    metadata: {
      profileId: signal.profileId,
      sizeBytes: generateFallbackHTML(slideConfig).length,
      slideCount: 5,
      styleUsed: 'dark-botanical',
      renderTime: 0,
      generatedAt: new Date().toISOString(),
    },
  };
}
```

### Step 5: Validate HTML Output

```typescript
if (!result.success) {
  console.warn(`⚠ Using fallback HTML (generation failed)`);
} else {
  // Basic HTML structure validation
  if (!result.html.includes('<!DOCTYPE html')) {
    throw new Error('Invalid HTML: missing DOCTYPE');
  }
  if (!result.html.includes('</html>')) {
    throw new Error('Invalid HTML: missing closing tag');
  }
}

console.log(`HTML size: ${(result.metadata.sizeBytes / 1024).toFixed(1)}KB`);
console.log(`Generation time: ${result.metadata.renderTime}ms`);
```

### Step 6: Store HTML File

```typescript
import fs from 'fs/promises';
import path from 'path';

const outputDir = path.join(
  process.env.PROJECT_ROOT || '.',
  'portfolio',
  'artifacts',
  'slides'
);

// Ensure directory exists
await fs.mkdir(outputDir, { recursive: true });

const filePath = path.join(outputDir, result.fileName);
await fs.writeFile(filePath, result.html, 'utf-8');

console.log(`✓ Slides saved to: ${filePath}`);
```

### Step 7: Update Workflow Context

```typescript
workflowContext.slides = {
  fileName: result.fileName,
  filePath: `portfolio/artifacts/slides/${result.fileName}`,
  sizeBytes: result.metadata.sizeBytes,
  slideCount: result.metadata.slideCount,
  styleUsed: result.metadata.styleUsed,
  renderTime: result.metadata.renderTime,
  success: result.success,
  fallback: !result.success,
  generatedAt: result.metadata.generatedAt,
};

workflowContext.status = 'slides_rendered';
```

---

## Output Contract

```typescript
interface SlidesArtifact {
  fileName: string;                 // e.g., "slides-profile-abc123-2026-03-09.html"
  filePath: string;                 // Relative path in portfolio
  sizeBytes: number;
  slideCount: number;
  styleUsed: string;               // "dark-botanical"
  renderTime: number;              // ms
  success: boolean;
  fallback: boolean;               // true if fallback HTML used
  generatedAt: string;             // ISO 8601
}
```

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Generation time | <15s | Includes Claude API call |
| HTML size | <150KB | Self-contained, no external deps |
| Retry attempts | ≤2 (usually succeeds on first try) | Exponential backoff |
| Fallback rate | <5% | Monitor for systemic issues |

---

## Error Handling

| Error | Detection | Recovery |
|-------|-----------|----------|
| API timeout (>30s) | Timeout error | Retry with backoff |
| Rate limit (429) | 429 response | Exponential backoff |
| Invalid HTML | Missing DOCTYPE | Use fallback HTML |
| Malformed input | Validation error | Use schema defaults |
| Network error | Connection refused | Retry circuit breaker |

---

## Logging & Monitoring

Log events:
- `slides.generated` - Success with metrics
- `slides.retried` - Retry attempt
- `slides.fallback` - Using fallback HTML
- `slides.error` - Generation failed

---

## Next Step

→ **port-02:** Embed HTML in Portfolio View 2

---

*Step Definition: 2026-03-09 | Part of E2 v2 Portfolio Integration*
