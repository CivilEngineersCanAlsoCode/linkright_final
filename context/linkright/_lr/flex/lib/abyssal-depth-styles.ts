/**
 * Abyssal Depth Style Mapping & Customization
 *
 * Maps Abyssal Depth aesthetic (deep, mysterious, premium) to frontend-slides styles:
 * - Analyzes 12 available styles
 * - Recommends Dark Botanical as primary match
 * - Provides CSS overrides for exact color matching
 * - Generates theme configuration
 *
 * Part of E2 v2: Abyssal Depth Style Integration
 * Release 3, 2026-03-09
 */

/**
 * Abyssal Depth color palette (target aesthetic)
 */
export const ABYSSAL_DEPTH_PALETTE = {
  // Core colors
  darkest: '#0a1810',           // Near-black with depth
  deep: '#0f1f1f',              // Very dark teal
  core: '#1a3a3a',              // Deep forest green (primary)
  teal: '#2d5a5a',              // Medium teal
  accent: '#4a8f8f',            // Abyssal blue accent
  light: '#6db3b3',             // Light teal (highlights)

  // Text & accents
  text: '#e8f0f0',              // Light cream (text)
  textMuted: '#b8d4d4',         // Muted light teal
  highlight: '#a0d5d5',         // Highlight color

  // Opacity variants
  overlay: 'rgba(10, 24, 16, 0.8)',
  glassEffect: 'rgba(29, 58, 58, 0.4)',
};

/**
 * Style analysis result
 */
export interface StyleAnalysis {
  styleName: string;
  matchPercentage: number;        // 0-100
  colorDistance: number;          // Lab color space distance
  adjustmentNeeded: 'minimal' | 'moderate' | 'significant';
  recommendations: string[];
  cssOverrides: Record<string, string>;
  verdict: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Frontend-slides style definitions (from repository analysis)
 */
const FRONTEND_SLIDES_STYLES = {
  'dark-botanical': {
    primary: '#1a3a3a',
    secondary: '#2d5a5a',
    accent: '#4a8f8f',
    text: '#e8f0f0',
    background: '#0f1f1f',
    description: 'Deep forest vibes with organic feel',
  },
  'minimalist': {
    primary: '#2c3e50',
    secondary: '#34495e',
    accent: '#3498db',
    text: '#ecf0f1',
    background: '#ffffff',
    description: 'Clean, high-contrast sans-serif',
  },
  'ocean-blue': {
    primary: '#1e3a5f',
    secondary: '#2d5a8c',
    accent: '#3b82f6',
    text: '#f0f4f8',
    background: '#0f172a',
    description: 'Blues and waters, calm',
  },
  'sunset': {
    primary: '#cc6600',
    secondary: '#ff8c00',
    accent: '#ffaa00',
    text: '#ffeecc',
    background: '#664400',
    description: 'Oranges, golds, reds - warm',
  },
  'neon': {
    primary: '#1a1a1a',
    secondary: '#333333',
    accent: '#00ff00',
    text: '#ffffff',
    background: '#0a0a0a',
    description: 'Bright neon accents on dark base',
  },
  'corporate': {
    primary: '#003366',
    secondary: '#004488',
    accent: '#0055cc',
    text: '#f5f5f5',
    background: '#f0f0f0',
    description: 'Professional blue-gray, neutral',
  },
  'elegant': {
    primary: '#1a1a1a',
    secondary: '#333333',
    accent: '#d4af37',
    text: '#f5f1de',
    background: '#2a2a2a',
    description: 'Gold accents, serif fonts, luxury',
  },
  'cosmic': {
    primary: '#0a0e27',
    secondary: '#1a1f3a',
    accent: '#7c3aed',
    text: '#e0e7ff',
    background: '#05051a',
    description: 'Dark space, tech accents, futuristic',
  },
  'creative': {
    primary: '#6b21a8',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    text: '#faf5ff',
    background: '#3b1d5e',
    description: 'Bold colors, patterns - artistic',
  },
  'retro': {
    primary: '#8b6f47',
    secondary: '#a0826d',
    accent: '#c89058',
    text: '#ede3d3',
    background: '#4a3d2a',
    description: 'Muted earth tones, nostalgic',
  },
  'playful': {
    primary: '#ff6b6b',
    secondary: '#ee5a6f',
    accent: '#f06c5c',
    text: '#ffffff',
    background: '#2d3436',
    description: 'Bright, fun - energetic',
  },
  'modern-gradient': {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    text: '#ffffff',
    background: '#1a1a2e',
    description: 'Smooth gradients, contemporary',
  },
};

// ============================================================================
// Style Matching Algorithm
// ============================================================================

/**
 * Simple RGB color distance calculation
 */
function colorDistance(rgb1: string, rgb2: string): number {
  // Parse hex to RGB
  const parseHex = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  };

  const [r1, g1, b1] = parseHex(rgb1);
  const [r2, g2, b2] = parseHex(rgb2);

  // Euclidean distance
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

/**
 * Analyze single style match
 */
function analyzeStyle(styleName: string): StyleAnalysis {
  const style = FRONTEND_SLIDES_STYLES[styleName as keyof typeof FRONTEND_SLIDES_STYLES];
  if (!style) {
    throw new Error(`Style not found: ${styleName}`);
  }

  // Calculate color distances
  const primaryDistance = colorDistance(style.primary, ABYSSAL_DEPTH_PALETTE.core);
  const textDistance = colorDistance(style.text, ABYSSAL_DEPTH_PALETTE.text);
  const backgroundDistance = colorDistance(style.background, ABYSSAL_DEPTH_PALETTE.deep);

  // Weighted average
  const avgDistance = (primaryDistance * 0.4 + textDistance * 0.4 + backgroundDistance * 0.2) / 255;
  const matchPercentage = Math.round((1 - avgDistance) * 100);

  // Determine adjustment level
  let adjustmentNeeded: 'minimal' | 'moderate' | 'significant' = 'significant';
  if (matchPercentage > 80) adjustmentNeeded = 'minimal';
  else if (matchPercentage > 60) adjustmentNeeded = 'moderate';

  // Verdict
  let verdict: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
  if (matchPercentage > 85) verdict = 'excellent';
  else if (matchPercentage > 70) verdict = 'good';
  else if (matchPercentage > 50) verdict = 'fair';

  // Recommendations
  const recommendations: string[] = [];
  if (primaryDistance > 50) {
    recommendations.push(`Primary color needs adjustment (${primaryDistance.toFixed(0)} distance)`);
  }
  if (textDistance > 30) {
    recommendations.push('Text color may need brightening for contrast');
  }
  if (backgroundDistance > 50) {
    recommendations.push('Background should be darker for Abyssal Depth effect');
  }

  // CSS overrides
  const cssOverrides: Record<string, string> = {};
  if (adjustmentNeeded === 'minimal' || adjustmentNeeded === 'moderate') {
    cssOverrides['--color-primary'] = ABYSSAL_DEPTH_PALETTE.core;
    cssOverrides['--color-text'] = ABYSSAL_DEPTH_PALETTE.text;
    cssOverrides['--color-background'] = ABYSSAL_DEPTH_PALETTE.deep;
    cssOverrides['--color-accent'] = ABYSSAL_DEPTH_PALETTE.accent;
  }

  return {
    styleName,
    matchPercentage,
    colorDistance: avgDistance,
    adjustmentNeeded,
    recommendations,
    cssOverrides,
    verdict,
  };
}

/**
 * Analyze all styles and rank by match
 */
export function analyzeAllStyles(): StyleAnalysis[] {
  const styleNames = Object.keys(FRONTEND_SLIDES_STYLES);
  const analyses = styleNames.map(name => analyzeStyle(name));
  return analyses.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// ============================================================================
// CSS Overrides & Theming
// ============================================================================

/**
 * CSS variable overrides for Abyssal Depth
 */
export const ABYSSAL_DEPTH_CSS_OVERRIDES = `
/* Abyssal Depth Color Variables */
:root {
  /* Primary colors */
  --abyssal-darkest: ${ABYSSAL_DEPTH_PALETTE.darkest};
  --abyssal-deep: ${ABYSSAL_DEPTH_PALETTE.deep};
  --abyssal-core: ${ABYSSAL_DEPTH_PALETTE.core};
  --abyssal-teal: ${ABYSSAL_DEPTH_PALETTE.teal};
  --abyssal-accent: ${ABYSSAL_DEPTH_PALETTE.accent};
  --abyssal-light: ${ABYSSAL_DEPTH_PALETTE.light};

  /* Text colors */
  --abyssal-text: ${ABYSSAL_DEPTH_PALETTE.text};
  --abyssal-text-muted: ${ABYSSAL_DEPTH_PALETTE.textMuted};
  --abyssal-highlight: ${ABYSSAL_DEPTH_PALETTE.highlight};

  /* Effects */
  --abyssal-overlay: ${ABYSSAL_DEPTH_PALETTE.overlay};
  --abyssal-glass: ${ABYSSAL_DEPTH_PALETTE.glassEffect};
}

/* Dark Botanical Base (Best Match) */
body {
  background-color: var(--abyssal-deep);
  color: var(--abyssal-text);
}

/* Slide container */
.slide,
.slide-container {
  background: linear-gradient(135deg, var(--abyssal-deep) 0%, var(--abyssal-core) 100%);
  color: var(--abyssal-text);
}

/* Title styling */
h1, h2, h3 {
  color: var(--abyssal-accent);
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* Body text */
p, body {
  color: var(--abyssal-text);
  line-height: 1.6;
  font-size: 1.125rem;
}

/* Accent elements */
.accent, .highlight, strong {
  color: var(--abyssal-accent);
}

/* Muted text */
.muted, .subtitle {
  color: var(--abyssal-text-muted);
}

/* Navigation elements */
button, a {
  color: var(--abyssal-text);
  background-color: var(--abyssal-teal);
  border: 2px solid var(--abyssal-accent);
  transition: all 0.3s ease;
}

button:hover, a:hover {
  background-color: var(--abyssal-accent);
  transform: translateY(-2px);
}

/* Glass morphism effect (optional) */
.glass {
  background: var(--abyssal-glass);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

/* Code blocks */
code, pre {
  background-color: var(--abyssal-core);
  color: var(--abyssal-light);
  border-left: 3px solid var(--abyssal-accent);
  padding: 0.5rem;
}

/* Metrics/Cards */
.metric, .card {
  background-color: var(--abyssal-core);
  border: 1px solid var(--abyssal-teal);
  padding: 1rem;
  border-radius: 8px;
}

.metric-value {
  font-size: 2rem;
  color: var(--abyssal-accent);
  font-weight: bold;
}

.metric-label {
  color: var(--abyssal-text-muted);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Dividers & separators */
hr, .divider {
  border-color: var(--abyssal-teal);
}

/* Gradients */
.gradient-bg {
  background: linear-gradient(135deg, var(--abyssal-deep) 0%, var(--abyssal-core) 50%, var(--abyssal-teal) 100%);
}

.gradient-text {
  background: linear-gradient(135deg, var(--abyssal-light) 0%, var(--abyssal-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Animations */
@keyframes fadeInAbyssal {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInAbyssal 0.6s ease-out;
}

@keyframes glowAbyssal {
  0%, 100% {
    box-shadow: 0 0 10px var(--abyssal-accent);
  }
  50% {
    box-shadow: 0 0 20px var(--abyssal-accent);
  }
}

.glow {
  animation: glowAbyssal 2s ease-in-out infinite;
}
`;

/**
 * Configuration object for frontend-slides
 */
export interface AbyssalDepthThemeConfig {
  style: 'dark-botanical';
  tone: 'professional, inspiring';
  customization: {
    cssVariables: Record<string, string>;
    gradients: Record<string, string>;
    typography: {
      fontFamily: string;
      titleSize: string;
      bodySize: string;
      lineHeight: number;
    };
    spacing: {
      padding: string;
      margin: string;
      gap: string;
    };
  };
}

/**
 * Generate complete theme configuration
 */
export function generateAbyssalDepthTheme(): AbyssalDepthThemeConfig {
  return {
    style: 'dark-botanical',
    tone: 'professional, inspiring',
    customization: {
      cssVariables: {
        '--primary': ABYSSAL_DEPTH_PALETTE.core,
        '--secondary': ABYSSAL_DEPTH_PALETTE.teal,
        '--accent': ABYSSAL_DEPTH_PALETTE.accent,
        '--text': ABYSSAL_DEPTH_PALETTE.text,
        '--background': ABYSSAL_DEPTH_PALETTE.deep,
      },
      gradients: {
        'primary-to-accent': `linear-gradient(135deg, ${ABYSSAL_DEPTH_PALETTE.core}, ${ABYSSAL_DEPTH_PALETTE.accent})`,
        'deep-to-core': `linear-gradient(180deg, ${ABYSSAL_DEPTH_PALETTE.deep}, ${ABYSSAL_DEPTH_PALETTE.core})`,
        'subtle': `linear-gradient(135deg, rgba(26, 58, 58, 0.8), rgba(45, 90, 90, 0.8))`,
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', sans-serif',
        titleSize: '2.5rem',
        bodySize: '1.125rem',
        lineHeight: 1.6,
      },
      spacing: {
        padding: '3rem',
        margin: '2rem',
        gap: '1.5rem',
      },
    },
  };
}

/**
 * Export all style analysis to JSON
 */
export function exportStyleAnalysisReport(): {
  recommended: StyleAnalysis;
  alternatives: StyleAnalysis[];
  allAnalyses: StyleAnalysis[];
  report: string;
} {
  const allAnalyses = analyzeAllStyles();
  const [recommended, ...alternatives] = allAnalyses.slice(0, 3);

  const report = `
# Abyssal Depth Style Matching Report

## Recommended Style: ${recommended.styleName}
- Match: ${recommended.matchPercentage}%
- Verdict: ${recommended.verdict.toUpperCase()}
- Adjustment: ${recommended.adjustmentNeeded}

${recommended.recommendations.map(r => `- ${r}`).join('\n')}

## Alternative Styles
${alternatives
  .map(
    alt => `
### ${alt.styleName}
- Match: ${alt.matchPercentage}%
- Verdict: ${alt.verdict}
`
  )
  .join('\n')}

## Top 5 Rankings
${allAnalyses
  .slice(0, 5)
  .map((style, i) => `${i + 1}. ${style.styleName}: ${style.matchPercentage}% (${style.verdict})`)
  .join('\n')}
`;

  return {
    recommended,
    alternatives,
    allAnalyses,
    report,
  };
}
