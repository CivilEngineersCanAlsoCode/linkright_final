/**
 * Content Extraction Logic
 *
 * Parses signals and extracts signal-dense content for slide presentation:
 * - Summarization: Reduce text while preserving meaning
 * - Extraction: Pull key phrases and metrics
 * - Validation: Ensure content fits constraints
 * - Scoring: Rank content by signal density
 *
 * Part of E2 v2: Signal-to-Slides Content Transformer
 * Release 3, 2026-03-09
 */

/**
 * Extracted content unit
 */
export interface ExtractedContent {
  section: string;                   // E.g., "hook", "skills", "project"
  text: string;                      // Main text (20-300 chars)
  bullets: string[];                 // 2-5 bullet points (20-100 chars each)
  metrics: Array<{
    label: string;
    value: string;
  }>;
  keyPhrases: string[];              // Important terms
  signalDensity: number;             // Score 0-100
  confidence: number;                // Extraction confidence 0-1.0
}

/**
 * Summarization configuration
 */
export interface SummarizationOptions {
  maxLength: number;                 // Target character count
  minLength: number;                 // Minimum to retain meaning
  preserveNumbers: boolean;          // Keep quantified metrics
  preserveNames: boolean;            // Keep entity names
  style: 'aggressive' | 'balanced' | 'conservative';
}

/**
 * Default summarization preset
 */
const SUMMARIZATION_PRESETS = {
  aggressive: {
    maxLength: 100,
    minLength: 30,
    preserveNumbers: true,
    preserveNames: true,
    style: 'aggressive' as const,
  },
  balanced: {
    maxLength: 150,
    minLength: 50,
    preserveNumbers: true,
    preserveNames: true,
    style: 'balanced' as const,
  },
  conservative: {
    maxLength: 250,
    minLength: 80,
    preserveNumbers: true,
    preserveNames: true,
    style: 'conservative' as const,
  },
};

// ============================================================================
// Content Extraction
// ============================================================================

/**
 * Extract key phrases from text using NLP heuristics
 */
export function extractKeyPhrases(text: string, limit: number = 5): string[] {
  if (!text || text.length < 10) return [];

  // Tokenize on whitespace and punctuation
  const tokens = text
    .split(/[\s,;\.\!\?]+/)
    .filter(t => t.length > 3)
    .map(t => t.toLowerCase());

  // Filter out common stop words
  const stopWords = new Set([
    'the', 'and', 'or', 'but', 'a', 'an', 'as', 'at', 'be', 'by',
    'for', 'from', 'in', 'is', 'it', 'of', 'on', 'to', 'with', 'was',
    'are', 'were', 'been', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what',
    'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
  ]);

  // Calculate frequency
  const frequency = new Map<string, number>();
  tokens.forEach(token => {
    if (!stopWords.has(token) && token.length > 3) {
      frequency.set(token, (frequency.get(token) || 0) + 1);
    }
  });

  // Sort by frequency, return top N
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([phrase]) => phrase);
}

/**
 * Extract metrics from text
 * Pattern: "[number]% [word]" or "[number] [word]"
 */
export function extractMetrics(text: string): Array<{ label: string; value: string }> {
  const metrics: Array<{ label: string; value: string }> = [];

  // Pattern: "30% improvement"
  const percentPattern = /(\d+)%\s+(\w+[^,\.]*)/gi;
  let match;
  while ((match = percentPattern.exec(text)) !== null) {
    const value = match[1] + '%';
    const label = match[2].trim();
    if (label.length > 2) {
      metrics.push({ label, value });
    }
  }

  // Pattern: "2.5x faster" or "10x more"
  const multiplierPattern = /(\d+\.?\d*)\s*x\s+(\w+[^,\.]*)/gi;
  while ((match = multiplierPattern.exec(text)) !== null) {
    const value = match[1] + 'x';
    const label = match[2].trim();
    if (label.length > 2) {
      metrics.push({ label, value });
    }
  }

  // Pattern: "$50k saved"
  const currencyPattern = /\$(\d+[km]?)\s+(\w+[^,\.]*)/gi;
  while ((match = currencyPattern.exec(text)) !== null) {
    const value = '$' + match[1];
    const label = match[2].trim();
    if (label.length > 2) {
      metrics.push({ label, value });
    }
  }

  return metrics;
}

/**
 * Summarize text to target length while preserving meaning
 */
export function summarizeText(
  text: string,
  options: Partial<SummarizationOptions> = {}
): string {
  const opts = { ...SUMMARIZATION_PRESETS.balanced, ...options };

  if (text.length <= opts.maxLength) {
    return text;
  }

  // For conservative mode, return text truncated at sentence boundary
  if (opts.style === 'conservative') {
    const truncated = text.substring(0, opts.maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    if (lastPeriod > opts.minLength) {
      return truncated.substring(0, lastPeriod + 1);
    }
    return truncated + '...';
  }

  // For balanced/aggressive, extract sentences with highest information density
  const sentences = text.split(/[.\!\?]+/).filter(s => s.trim().length > 0);

  if (sentences.length === 1) {
    // Single sentence: truncate at word boundary
    return text.substring(0, opts.maxLength).split(' ').slice(0, -1).join(' ') + '...';
  }

  // Score sentences by information density
  const scoredSentences = sentences.map(sentence => {
    const trimmed = sentence.trim();
    const metrics = extractMetrics(trimmed);
    const numbers = (trimmed.match(/\d+/g) || []).length;
    const length = trimmed.length;

    // Information density = (metrics + numbers) / length
    const density = (metrics.length * 10 + numbers * 2) / Math.max(1, length / 10);

    return { sentence: trimmed, density, length };
  });

  // Select sentences with highest density until we hit target length
  const selected: string[] = [];
  let currentLength = 0;

  scoredSentences
    .sort((a, b) => b.density - a.density)
    .forEach(({ sentence, length: sentenceLength }) => {
      if (currentLength + sentenceLength + 2 <= opts.maxLength && selected.length < 3) {
        selected.push(sentence);
        currentLength += sentenceLength + 2;
      }
    });

  // Sort back to original order
  const result = sentences
    .filter(s => selected.includes(s.trim()))
    .join('. ')
    .trim();

  if (result.length > opts.maxLength) {
    return result.substring(0, opts.maxLength).split(' ').slice(0, -1).join(' ') + '...';
  }

  return result + (selected.length > 0 && !result.endsWith('.') ? '.' : '');
}

/**
 * Extract bullets from paragraph
 * Heuristic: conjunctions, list markers, or sentence breaks
 */
export function extractBullets(text: string, count: number = 3): string[] {
  if (!text || text.length < 50) return [];

  const bullets: string[] = [];

  // Split on common conjunction markers
  const parts = text.split(/\s+(?:and|or|also|additionally|furthermore)\s+/i);

  parts.forEach(part => {
    const cleaned = part.trim();
    if (cleaned.length > 15 && cleaned.length < 150) {
      bullets.push(cleaned);
    }
  });

  if (bullets.length > 0) {
    return bullets.slice(0, count);
  }

  // Fallback: split on periods
  const sentences = text.split(/[.\!\?]+/).filter(s => s.trim().length > 15 && s.trim().length < 150);
  return sentences.slice(0, count);
}

/**
 * Calculate signal density of content
 */
export function calculateSignalDensity(content: {
  text: string;
  bullets?: string[];
  metrics?: Array<{ label: string; value: string }>;
  keyPhrases?: string[];
}): number {
  let score = 0;

  // Text density (up to 30 points)
  const textLength = content.text.length;
  if (textLength >= 50 && textLength <= 300) {
    score += 30;
  } else if (textLength >= 20 && textLength < 50) {
    score += 15;
  } else if (textLength > 300) {
    score += 10;
  }

  // Bullets (up to 30 points)
  const bulletCount = content.bullets?.length || 0;
  if (bulletCount >= 2 && bulletCount <= 5) {
    score += 30;
  } else if (bulletCount === 1) {
    score += 10;
  }

  // Metrics (up to 20 points)
  const metricCount = content.metrics?.length || 0;
  score += Math.min(20, metricCount * 7);

  // Key phrases (up to 20 points)
  const phraseCount = content.keyPhrases?.length || 0;
  score += Math.min(20, phraseCount * 4);

  return Math.min(100, score);
}

/**
 * Extract complete structured content from signal section
 */
export function extractStructuredContent(
  sectionText: string,
  sectionName: string,
  options?: {
    maxTextLength?: number;
    includeMetrics?: boolean;
    includePhrases?: boolean;
  }
): ExtractedContent {
  const opts = {
    maxTextLength: 250,
    includeMetrics: true,
    includePhrases: true,
    ...options,
  };

  // Main text
  const summary = summarizeText(sectionText, {
    maxLength: opts.maxTextLength,
    style: 'balanced',
  });

  // Bullets
  const bullets = extractBullets(sectionText, 4);

  // Metrics
  const metrics = opts.includeMetrics ? extractMetrics(sectionText) : [];

  // Key phrases
  const keyPhrases = opts.includePhrases ? extractKeyPhrases(sectionText, 5) : [];

  // Signal density
  const density = calculateSignalDensity({
    text: summary,
    bullets,
    metrics,
    keyPhrases,
  });

  // Confidence: based on content quality
  let confidence = 0.5;
  if (summary.length > 50) confidence += 0.2;
  if (bullets.length >= 2) confidence += 0.15;
  if (metrics.length >= 1) confidence += 0.15;

  return {
    section: sectionName,
    text: summary,
    bullets,
    metrics,
    keyPhrases,
    signalDensity: density,
    confidence: Math.min(1.0, confidence),
  };
}

/**
 * Batch extract content from multiple sections
 */
export function extractBatchContent(
  sections: Record<string, string>,
  options?: Parameters<typeof extractStructuredContent>[2]
): ExtractedContent[] {
  return Object.entries(sections).map(([sectionName, text]) =>
    extractStructuredContent(text, sectionName, options)
  );
}

// ============================================================================
// Content Validation
// ============================================================================

/**
 * Validate extracted content fits slide constraints
 */
export interface ContentConstraints {
  maxTextLength: number;
  maxBulletCount: number;
  maxMetrics: number;
  minDensity: number;
}

export const DEFAULT_CONSTRAINTS: ContentConstraints = {
  maxTextLength: 300,
  maxBulletCount: 5,
  maxMetrics: 3,
  minDensity: 20,
};

export function validateExtractedContent(
  content: ExtractedContent,
  constraints: Partial<ContentConstraints> = {}
): {
  valid: boolean;
  issues: string[];
} {
  const c = { ...DEFAULT_CONSTRAINTS, ...constraints };
  const issues: string[] = [];

  if (content.text.length > c.maxTextLength) {
    issues.push(`Text too long: ${content.text.length}/${c.maxTextLength} chars`);
  }

  if (content.bullets.length > c.maxBulletCount) {
    issues.push(`Too many bullets: ${content.bullets.length}/${c.maxBulletCount}`);
  }

  if (content.metrics.length > c.maxMetrics) {
    issues.push(`Too many metrics: ${content.metrics.length}/${c.maxMetrics}`);
  }

  if (content.signalDensity < c.minDensity) {
    issues.push(`Signal density too low: ${content.signalDensity}/${c.minDensity}`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

// ============================================================================
// Content Ranking
// ============================================================================

/**
 * Rank extracted content sections by importance
 */
export function rankContentByDensity(
  contents: ExtractedContent[]
): ExtractedContent[] {
  return [...contents].sort((a, b) => {
    // Primary: signal density
    if (b.signalDensity !== a.signalDensity) {
      return b.signalDensity - a.signalDensity;
    }
    // Secondary: confidence
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    // Tertiary: metrics count (more metrics = more concrete)
    return b.metrics.length - a.metrics.length;
  });
}

/**
 * Select top N contents by quality
 */
export function selectTopContents(
  contents: ExtractedContent[],
  count: number = 3
): ExtractedContent[] {
  return rankContentByDensity(contents).slice(0, count);
}
