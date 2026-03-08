/**
 * Portfolio Slides Integration
 *
 * Embeds generated HTML slideshows into portfolio View 2:
 * - Injects iframe references
 * - Validates responsive layout
 * - Manages asset paths
 * - Ensures accessibility
 *
 * Part of E2 v2: Portfolio Workflow Integration
 * Release 3, 2026-03-09
 */

/**
 * Slide embedding configuration
 */
export interface SlideEmbedConfig {
  profileId: string;
  slideFileName: string;            // e.g., "slides-profile-abc123-2026-03-09.html"
  slidePath: string;                // Relative path in portfolio
  containerSelector: string;        // CSS selector for embed container
  title?: string;                   // Optional deck title
  width?: string;                   // Default: "100%"
  height?: string;                  // Default: "600px"
  responsive?: boolean;             // Default: true
}

/**
 * Embed result metadata
 */
export interface EmbedResult {
  success: boolean;
  htmlInjected: string;            // Generated iframe HTML
  containerElement: string;        // Container selector used
  responsiveEnabled: boolean;
  accessibilityFeatures: string[];
  validationIssues: string[];
}

// ============================================================================
// Iframe Generation
// ============================================================================

/**
 * Generate iframe HTML for slide embedding
 */
export function generateSlideIframe(config: SlideEmbedConfig): string {
  const {
    slideFileName,
    slidePath,
    title = 'Professional Slides',
    width = '100%',
    height = '600px',
    responsive = true,
  } = config;

  const iframeId = `slides-${config.profileId}`;
  const ariaLabel = `${title} - Interactive slide presentation`;

  return `
<!-- Slides Deck Embed (${slideFileName}) -->
<div id="${iframeId}-container" class="slides-container" role="region" aria-label="${ariaLabel}">
  <iframe
    id="${iframeId}"
    src="${slidePath}"
    title="${title}"
    width="${width}"
    height="${height}"
    frameborder="0"
    allow="fullscreen"
    ${responsive ? 'class="slides-iframe-responsive"' : ''}
    loading="lazy"
    aria-label="${ariaLabel}"
    tabindex="0"
  ></iframe>
</div>

<!-- Fallback for iframe-unsupported browsers -->
<noscript>
  <p class="slides-fallback">
    Interactive slides not available.
    <a href="${slidePath}" target="_blank" rel="noopener noreferrer">
      View slides in new window →
    </a>
  </p>
</noscript>
`;
}

/**
 * Generate accompanying CSS for responsive embedding
 */
export function generateSlidesCss(): string {
  return `
/* Portfolio Slides Embedding Styles */

.slides-container {
  position: relative;
  width: 100%;
  margin: 2rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.slides-iframe-responsive {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: 1px solid #ddd;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .slides-container {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  .slides-iframe-responsive {
    border-color: #444;
  }
}

/* Accessibility: focus visible */
.slides-iframe-responsive:focus-visible {
  outline: 3px solid #4a8f8f;
  outline-offset: 2px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .slides-container {
    margin: 1.5rem 0;
  }

  .slides-iframe-responsive {
    aspect-ratio: 16 / 10;
    min-height: 400px;
  }
}

/* Fallback text */
.slides-fallback {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  color: #666;
}

.slides-fallback a {
  color: #4a8f8f;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.slides-fallback a:hover {
  color: #2d5a5a;
  text-decoration: underline;
}

@media (prefers-color-scheme: dark) {
  .slides-fallback {
    background: #1a1a1a;
    border-color: #444;
    color: #aaa;
  }

  .slides-fallback a {
    color: #6db3b3;
  }

  .slides-fallback a:hover {
    color: #a0d5d5;
  }
}
`;
}

// ============================================================================
// Portfolio HTML Injection
// ============================================================================

/**
 * Inject slides into portfolio HTML document
 */
export function injectSlidesIntoPortfolio(
  portfolioHtml: string,
  config: SlideEmbedConfig
): {
  html: string;
  injected: boolean;
  location: string;
} {
  // Find insertion point (after header/intro, before footer)
  // Look for common portfolio section markers
  const markers = [
    /<section[^>]*id="projects"[^>]*>/i,
    /<section[^>]*id="work"[^>]*>/i,
    /<section[^>]*class="[^"]*projects[^"]*"[^>]*>/i,
    /<main[^>]*>/i,
    /<article[^>]*>/i,
  ];

  let insertionPoint = -1;
  let location = '';

  for (const marker of markers) {
    const match = portfolioHtml.match(marker);
    if (match && match.index) {
      insertionPoint = match.index + match[0].length;
      location = match[0];
      break;
    }
  }

  // Fallback: insert before </main> or </article>
  if (insertionPoint === -1) {
    const endTags = [/<\/main>/i, /<\/article>/i, /<\/body>/i];
    for (const tag of endTags) {
      const match = portfolioHtml.match(tag);
      if (match && match.index) {
        insertionPoint = match.index;
        location = 'before ' + match[0];
        break;
      }
    }
  }

  if (insertionPoint === -1) {
    return {
      html: portfolioHtml,
      injected: false,
      location: 'NO_SUITABLE_INSERTION_POINT',
    };
  }

  const iframeHtml = generateSlideIframe(config);
  const newHtml = portfolioHtml.slice(0, insertionPoint) + iframeHtml + portfolioHtml.slice(insertionPoint);

  return {
    html: newHtml,
    injected: true,
    location,
  };
}

/**
 * Inject CSS into portfolio HTML <head>
 */
export function injectSlidesStylesheet(portfolioHtml: string): {
  html: string;
  injected: boolean;
} {
  const headMatch = portfolioHtml.match(/<head[^>]*>/i);
  if (!headMatch || !headMatch.index) {
    return { html: portfolioHtml, injected: false };
  }

  const insertionPoint = headMatch.index + headMatch[0].length;
  const css = `\n  <style>${generateSlidesCss()}\n  </style>\n  `;

  const newHtml = portfolioHtml.slice(0, insertionPoint) + css + portfolioHtml.slice(insertionPoint);

  return {
    html: newHtml,
    injected: true,
  };
}

// ============================================================================
// Validation & Verification
// ============================================================================

/**
 * Validate responsive layout constraints
 */
export function validateResponsiveLayout(htmlContent: string): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check viewport meta tag
  if (!htmlContent.includes('viewport')) {
    issues.push('Missing viewport meta tag for mobile responsiveness');
  }

  // Check for fixed dimensions that might break responsiveness
  const fixedWidths = htmlContent.match(/width:\s*\d+px/gi) || [];
  if (fixedWidths.length > 3) {
    issues.push(`Found ${fixedWidths.length} fixed-width elements - may break responsive layout`);
  }

  // Check for media queries
  if (!htmlContent.includes('@media')) {
    issues.push('No media queries found - consider adding mobile breakpoints');
  }

  // Check for aspect-ratio support (fallback to height calculation)
  if (!htmlContent.includes('aspect-ratio') && !htmlContent.includes('height')) {
    issues.push('Consider adding aspect-ratio or height for consistent layout');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Validate accessibility compliance
 */
export function validateAccessibility(htmlContent: string): {
  compliant: boolean;
  features: string[];
  issues: string[];
} {
  const features: string[] = [];
  const issues: string[] = [];

  // Check for ARIA labels
  if (htmlContent.includes('aria-label')) {
    features.push('aria-label attributes present');
  } else {
    issues.push('Missing aria-label on interactive elements');
  }

  // Check for role attributes
  if (htmlContent.includes('role="region"')) {
    features.push('Semantic region roles defined');
  }

  // Check for keyboard navigation
  if (htmlContent.includes('tabindex')) {
    features.push('Keyboard navigation support (tabindex)');
  }

  // Check for focus styles
  if (htmlContent.includes('focus-visible') || htmlContent.includes(':focus')) {
    features.push('Focus styles defined');
  } else {
    issues.push('Missing focus styles for keyboard users');
  }

  // Check for alt text (if images present)
  const imgTags = htmlContent.match(/<img[^>]*>/gi) || [];
  const imgWithoutAlt = imgTags.filter(tag => !tag.includes('alt='));
  if (imgWithoutAlt.length > 0) {
    issues.push(`${imgWithoutAlt.length} images missing alt text`);
  }

  // Check for color contrast (can't fully verify, but check for intentional contrast)
  if (htmlContent.includes('#e8f0f0') && htmlContent.includes('#0f1f1f')) {
    features.push('High-contrast color scheme (Abyssal Depth)');
  }

  return {
    compliant: issues.length === 0,
    features,
    issues,
  };
}

// ============================================================================
// Integration Pipeline
// ============================================================================

/**
 * Complete portfolio integration with validation
 */
export function integrateSlicesIntoPortfolio(
  portfolioHtml: string,
  config: SlideEmbedConfig
): EmbedResult {
  const issues: string[] = [];

  // Inject CSS
  const cssResult = injectSlidesStylesheet(portfolioHtml);
  let workingHtml = cssResult.html;
  if (!cssResult.injected) {
    issues.push('CSS injection failed - styling may not apply');
  }

  // Inject iframe
  const iframeResult = injectSlidesIntoPortfolio(workingHtml, config);
  workingHtml = iframeResult.html;
  if (!iframeResult.injected) {
    throw new Error(`Failed to inject slides: ${iframeResult.location}`);
  }

  // Validate responsive layout
  const responsiveValidation = validateResponsiveLayout(workingHtml);
  if (!responsiveValidation.valid) {
    issues.push(...responsiveValidation.issues);
  }

  // Validate accessibility
  const a11yValidation = validateAccessibility(workingHtml);
  if (!a11yValidation.compliant) {
    issues.push(...a11yValidation.issues);
  }

  return {
    success: iframeResult.injected,
    htmlInjected: generateSlideIframe(config),
    containerElement: config.containerSelector,
    responsiveEnabled: config.responsive !== false,
    accessibilityFeatures: a11yValidation.features,
    validationIssues: issues,
  };
}

// ============================================================================
// Asset Management
// ============================================================================

/**
 * Verify slide file exists and is accessible
 */
export async function verifySlidesAsset(filePath: string): Promise<{
  exists: boolean;
  sizeBytes?: number;
  isValid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  try {
    const fs = await import('fs/promises');
    const stats = await fs.stat(filePath);

    if (!stats.isFile()) {
      issues.push('Not a regular file');
      return { exists: false, isValid: false, issues };
    }

    // Check file size constraints
    if (stats.size === 0) {
      issues.push('File is empty (0 bytes)');
    }
    if (stats.size > 200 * 1024) {
      // 200KB limit
      issues.push(`File size exceeds 200KB limit (${(stats.size / 1024).toFixed(1)}KB)`);
    }

    // Try to read and validate HTML
    const content = await fs.readFile(filePath, 'utf-8');
    if (!content.includes('<!DOCTYPE html')) {
      issues.push('Not a valid HTML document (missing DOCTYPE)');
    }
    if (!content.includes('</html>')) {
      issues.push('Incomplete HTML (missing closing tag)');
    }

    return {
      exists: true,
      sizeBytes: stats.size,
      isValid: issues.length === 0,
      issues,
    };
  } catch (error) {
    issues.push((error as Error).message);
    return {
      exists: false,
      isValid: false,
      issues,
    };
  }
}

/**
 * Generate asset manifest for portfolio deployment
 */
export interface AssetManifest {
  profileId: string;
  slideFile: {
    name: string;
    path: string;
    sizeBytes: number;
  };
  portfolio: {
    injectionPoint: string;
    cssInjected: boolean;
    responsiveEnabled: boolean;
  };
  timestamp: string;
  verified: boolean;
}

export function generateAssetManifest(
  config: SlideEmbedConfig,
  sizeBytes: number,
  injectionPoint: string
): AssetManifest {
  return {
    profileId: config.profileId,
    slideFile: {
      name: config.slideFileName,
      path: config.slidePath,
      sizeBytes,
    },
    portfolio: {
      injectionPoint,
      cssInjected: true,
      responsiveEnabled: config.responsive !== false,
    },
    timestamp: new Date().toISOString(),
    verified: true,
  };
}
