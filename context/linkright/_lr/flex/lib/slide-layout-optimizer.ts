/**
 * Slide Layout Optimizer
 *
 * Optimizes slide layout and visual presentation based on content:
 * - Selects optimal layout (default, two-column, metrics, timeline, hero)
 * - Calculates visual balance (text vs whitespace ratio)
 * - Recommends visual elements (gradient, icon, chart)
 * - Validates readability constraints
 * - Generates styling hints
 *
 * Part of E2 v2: Signal-to-Slides Content Transformer
 * Release 3, 2026-03-09
 */

import { Slide, SlideLayout, VisualElement } from './slide-content-schema';

/**
 * Content characteristics for layout decisions
 */
export interface ContentCharacteristics {
  textLength: number;                // Main text character count
  bulletCount: number;               // Number of bullets
  metricCount: number;               // Number of metrics
  keyPhraseCount: number;            // Number of key phrases
  hasNumbers: boolean;               // Contains quantified data
  hasCode: boolean;                  // Contains code snippet
  density: number;                   // Signal density 0-100
}

/**
 * Layout recommendation with rationale
 */
export interface LayoutRecommendation {
  layout: SlideLayout;
  rationale: string;
  visualSuggestions: VisualElement[];
  balanceScore: number;              // 0-100 (balance of content/whitespace)
  readabilityScore: number;          // 0-100
  confidence: number;                // 0-1.0 (recommendation confidence)
}

/**
 * Visual balance analysis
 */
export interface VisualBalance {
  contentArea: number;               // % of slide with content
  whitespaceRatio: number;           // % whitespace
  balanceScore: number;              // 0-100 optimal ~40-60 content
  suggestions: string[];             // Optimization suggestions
}

// ============================================================================
// Layout Selection Logic
// ============================================================================

/**
 * Analyze content and extract characteristics
 */
export function analyzeContent(slide: Slide): ContentCharacteristics {
  const text = slide.content.main;
  const hasNumbers = /\d+/.test(text);
  const hasCode = slide.content.codeSnippet !== undefined;

  return {
    textLength: text.length,
    bulletCount: slide.content.bullets?.length || 0,
    metricCount: slide.content.metrics?.length || 0,
    keyPhraseCount: 0,  // Would come from extraction
    hasNumbers,
    hasCode,
    density: 0,  // Would be calculated elsewhere
  };
}

/**
 * Recommend optimal layout based on content
 */
export function recommendLayout(
  characteristics: ContentCharacteristics,
  slide?: Slide
): LayoutRecommendation {
  const recommendations: Array<{
    layout: SlideLayout;
    score: number;
    rationale: string;
  }> = [];

  // Default layout (title + content)
  if (characteristics.textLength < 200 && characteristics.bulletCount <= 3) {
    recommendations.push({
      layout: 'default',
      score: 85,
      rationale: 'Concise content fits default layout well',
    });
  } else {
    recommendations.push({
      layout: 'default',
      score: 60,
      rationale: 'Default layout versatile but may feel crowded',
    });
  }

  // Title-only layout (minimal text with visual focus)
  if (characteristics.textLength < 100 && characteristics.bulletCount === 0) {
    recommendations.push({
      layout: 'title-only',
      score: 80,
      rationale: 'Minimal content ideal for title-only with hero visual',
    });
  }

  // Two-column layout (balanced content distribution)
  if (characteristics.textLength > 150 && characteristics.textLength < 300 && characteristics.bulletCount >= 2) {
    recommendations.push({
      layout: 'two-column',
      score: 90,
      rationale: 'Two-column balances text and visual space effectively',
    });
  }

  // Metrics layout (highlighted key numbers)
  if (characteristics.metricCount >= 2) {
    recommendations.push({
      layout: 'metrics',
      score: 95,
      rationale: 'Multiple metrics benefit from card-based metrics layout',
    });
  }

  // Timeline layout (career/progress narrative)
  if (slide && slide.section && slide.section === 'growth') {
    recommendations.push({
      layout: 'timeline',
      score: 90,
      rationale: 'Growth narrative suits timeline visualization',
    });
  }

  // Hero layout (CTA, intro, or minimal content)
  if (slide && slide.section && (slide.section === 'cta' || slide.section === 'hook')) {
    recommendations.push({
      layout: 'hero',
      score: 85,
      rationale: 'CTA and intro sections benefit from full-bleed visual impact',
    });
  }

  // Select best recommendation
  const best = recommendations.sort((a, b) => b.score - a.score)[0];

  return {
    layout: best.layout,
    rationale: best.rationale,
    visualSuggestions: recommendVisuals(characteristics, best.layout),
    balanceScore: calculateBalanceScore(characteristics),
    readabilityScore: calculateReadabilityScore(characteristics),
    confidence: best.score / 100,
  };
}

/**
 * Recommend visual elements for slide
 */
export function recommendVisuals(
  characteristics: ContentCharacteristics,
  layout: SlideLayout
): VisualElement[] {
  const visuals: VisualElement[] = [];

  // Gradient background (always good for contrast)
  visuals.push({
    type: 'gradient',
    gradient: {
      direction: 'diagonal',
      colors: ['#1a3a3a', '#4a8f8f'],  // Dark Botanical
    },
  });

  // Icon for skill-based content
  if (characteristics.bulletCount >= 3) {
    visuals.push({
      type: 'icon',
      icon: {
        name: 'code',
        size: 'medium',
      },
    });
  }

  // Chart for metrics
  if (characteristics.metricCount >= 2 || characteristics.hasNumbers) {
    visuals.push({
      type: 'chart',
      chart: {
        type: characteristics.metricCount >= 3 ? 'bar' : 'line',
        data: {},  // Would be populated from actual metrics
      },
    });
  }

  // Code block if present
  if (characteristics.hasCode) {
    visuals.push({
      type: 'code-block',
      codeBlock: {
        language: 'typescript',
        code: '',  // Would be populated
        highlighted: true,
      },
    });
  }

  return visuals.slice(0, 2);  // Max 2 visuals per slide
}

/**
 * Calculate visual balance score (0-100)
 * Optimal: 40-60% content, 40-60% whitespace
 */
export function calculateBalanceScore(
  characteristics: ContentCharacteristics
): number {
  // Estimate content area percentage
  const textArea = Math.min(40, (characteristics.textLength / 500) * 30);
  const bulletArea = Math.min(30, characteristics.bulletCount * 8);
  const metricArea = Math.min(20, characteristics.metricCount * 8);

  const totalContentArea = textArea + bulletArea + metricArea;
  const optimalRange = 50;  // Optimal 50% content

  // Distance from optimal (lower = better)
  const distance = Math.abs(totalContentArea - optimalRange);
  const balanceScore = Math.max(20, 100 - distance * 2);

  return Math.round(balanceScore);
}

/**
 * Calculate readability score (0-100)
 */
export function calculateReadabilityScore(
  characteristics: ContentCharacteristics
): number {
  let score = 80;  // Start with good baseline

  // Text length is too short (less readable)
  if (characteristics.textLength < 30) {
    score -= 20;
  }

  // Text length is too long (harder to read quickly)
  if (characteristics.textLength > 300) {
    score -= 15;
  }

  // Bullet points improve readability
  if (characteristics.bulletCount >= 2 && characteristics.bulletCount <= 5) {
    score += 15;
  } else if (characteristics.bulletCount > 5) {
    score -= 10;  // Too many bullets
  }

  // Metrics with numbers aid comprehension
  if (characteristics.hasNumbers && characteristics.metricCount >= 1) {
    score += 10;
  }

  // Code snippets can reduce readability on slides
  if (characteristics.hasCode) {
    score -= 5;
  }

  // High density content is harder to read on slide
  if (characteristics.density > 80) {
    score -= 10;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Analyze visual balance
 */
export function analyzeVisualBalance(
  characteristics: ContentCharacteristics
): VisualBalance {
  const contentArea = calculateBalanceScore(characteristics);
  const whitespaceRatio = 100 - contentArea;

  const suggestions: string[] = [];

  if (contentArea > 65) {
    suggestions.push('Consider removing non-essential content to add breathing room');
  }

  if (contentArea < 30) {
    suggestions.push('Content area sparse - consider adding more detail or visual elements');
  }

  if (characteristics.bulletCount === 0 && characteristics.textLength > 150) {
    suggestions.push('Consider breaking main text into bullet points for better scanning');
  }

  if (characteristics.metricCount > 5) {
    suggestions.push('Too many metrics - prioritize top 2-3 for impact');
  }

  return {
    contentArea,
    whitespaceRatio,
    balanceScore: contentArea >= 35 && contentArea <= 65 ? 95 : Math.max(50, 100 - Math.abs(contentArea - 50) * 2),
    suggestions,
  };
}

// ============================================================================
// Styling Recommendations
// ============================================================================

/**
 * CSS styling hints for optimal presentation
 */
export interface StylingHints {
  fontSize: {
    title: string;
    body: string;
    bullets: string;
  };
  lineHeight: number;
  spacing: {
    titleBottom: string;
    contentTop: string;
    bulletGap: string;
  };
  colors: {
    text: string;
    accent: string;
  };
}

/**
 * Generate styling recommendations
 */
export function recommendStyling(
  characteristics: ContentCharacteristics
): StylingHints {
  let titleSize = '2.5rem';
  let bodySize = '1.125rem';
  let bulletSize = '1rem';
  let lineHeight = 1.6;

  // Dense content: smaller fonts, tighter spacing
  if (characteristics.density > 75) {
    titleSize = '2rem';
    bodySize = '1rem';
    bulletSize = '0.95rem';
    lineHeight = 1.4;
  }

  // Sparse content: larger fonts for impact
  if (characteristics.density < 30) {
    titleSize = '3rem';
    bodySize = '1.5rem';
    bulletSize = '1.25rem';
    lineHeight = 1.8;
  }

  return {
    fontSize: {
      title: titleSize,
      body: bodySize,
      bullets: bulletSize,
    },
    lineHeight,
    spacing: {
      titleBottom: characteristics.density > 75 ? '1rem' : '1.5rem',
      contentTop: characteristics.density > 75 ? '1rem' : '2rem',
      bulletGap: characteristics.bulletCount > 4 ? '0.5rem' : '0.75rem',
    },
    colors: {
      text: '#e8f0f0',      // Light cream
      accent: '#4a8f8f',    // Abyssal accent
    },
  };
}

// ============================================================================
// Optimization Pipeline
// ============================================================================

/**
 * Complete slide layout optimization
 */
export function optimizeSlideLayout(slide: Slide): {
  optimized: Slide;
  recommendation: LayoutRecommendation;
  balance: VisualBalance;
  styling: StylingHints;
  issues: string[];
} {
  const characteristics = analyzeContent(slide);
  const recommendation = recommendLayout(characteristics, slide);
  const balance = analyzeVisualBalance(characteristics);
  const styling = recommendStyling(characteristics);

  // Collect any issues
  const issues: string[] = [];
  if (recommendation.readabilityScore < 50) {
    issues.push('Readability score below threshold - consider revising content');
  }
  if (balance.balanceScore < 60) {
    issues.push(...balance.suggestions);
  }

  // Apply recommendations to slide
  const optimized: Slide = {
    ...slide,
    layout: recommendation.layout as SlideLayout,
    visual: recommendation.visualSuggestions[0],  // Use first suggestion
  };

  return {
    optimized,
    recommendation,
    balance,
    styling,
    issues,
  };
}

/**
 * Batch optimize all slides
 */
export function optimizeDeckLayout(slides: Slide[]): Array<{
  slide: Slide;
  optimization: ReturnType<typeof optimizeSlideLayout>;
}> {
  return slides.map(slide => ({
    slide,
    optimization: optimizeSlideLayout(slide),
  }));
}

// ============================================================================
// Validation & Constraints
// ============================================================================

/**
 * Validate slide against readability constraints
 */
export function validateSlideReadability(
  slide: Slide,
  constraints?: {
    minReadability?: number;
    minBalance?: number;
  }
): {
  valid: boolean;
  readability: number;
  balance: number;
  issues: string[];
} {
  const c = {
    minReadability: constraints?.minReadability || 50,
    minBalance: constraints?.minBalance || 60,
  };

  const characteristics = analyzeContent(slide);
  const readability = calculateReadabilityScore(characteristics);
  const balance = calculateBalanceScore(characteristics);

  const issues: string[] = [];

  if (readability < c.minReadability) {
    issues.push(`Readability too low (${readability}/${c.minReadability})`);
  }

  if (balance < c.minBalance) {
    issues.push(`Visual balance score too low (${balance}/${c.minBalance})`);
  }

  return {
    valid: issues.length === 0,
    readability,
    balance,
    issues,
  };
}
