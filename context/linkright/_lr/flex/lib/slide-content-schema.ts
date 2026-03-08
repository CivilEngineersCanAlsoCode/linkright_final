/**
 * Slide Content Schema & Transformers
 *
 * Data structures for signal-to-slides transformation:
 * - Defines normalized slide content structure
 * - Maps signals to slide sections
 * - Validates content constraints (character limits, section ratios)
 * - Provides factory functions for common slide patterns
 *
 * Part of E2 v2: Signal-to-Slides Content Transformer
 * Release 3, 2026-03-09
 */

/**
 * Individual slide unit
 */
export interface Slide {
  id: string;                        // e.g., "slide-1", "hook"
  section: SlideSection;             // Semantic type
  title: string;                     // 3-50 characters
  subtitle?: string;                 // Optional, 5-80 characters
  content: SlideContent;             // Main content block
  visual?: VisualElement;            // Optional visual component
  layout?: SlideLayout;              // Default: 'default'
  order: number;                     // 1-based slide position
}

/**
 * Semantic slide section
 */
export enum SlideSection {
  HOOK = 'hook',                     // Professional summary
  SKILLS = 'skills',                // Core competencies
  PROJECT = 'project',              // Featured project/case study
  GROWTH = 'growth',                // Career narrative
  CTA = 'cta',                       // Call to action / Contact
}

/**
 * Main content block with signal density
 */
export interface SlideContent {
  main: string;                      // Primary content (50-300 chars)
  bullets?: string[];                // 2-5 bullet points (30-100 chars each)
  metrics?: {
    label: string;                   // e.g., "Performance Improvement"
    value: string;                   // e.g., "30%"
    context?: string;                // e.g., "Query latency"
  }[];
  codeSnippet?: {
    language: string;                // e.g., "typescript", "sql"
    code: string;                    // <200 chars
  };
}

/**
 * Layout options
 */
export type SlideLayout =
  | 'default'                         // Title + Content + Optional Visual
  | 'title-only'                      // Title + large whitespace
  | 'two-column'                      // Title + Left/Right content
  | 'metrics'                         // Title + Metric cards
  | 'timeline'                        // Title + Timeline items
  | 'hero';                          // Full-bleed visual + small text overlay

/**
 * Visual component options
 */
export interface VisualElement {
  type: 'gradient' | 'icon' | 'image' | 'chart' | 'code-block';
  gradient?: {
    direction: 'vertical' | 'horizontal' | 'diagonal';
    colors: [string, string];        // [from, to] hex colors
  };
  icon?: {
    name: string;                    // e.g., "code", "chart", "team"
    size: 'small' | 'medium' | 'large';
  };
  image?: {
    url: string;
    alt: string;
    aspectRatio: number;             // e.g., 16/9
  };
  chart?: {
    type: 'bar' | 'line' | 'pie';
    data: Record<string, number>;
  };
  codeBlock?: {
    language: string;
    code: string;
    highlighted: boolean;
  };
}

/**
 * Complete slide deck structure
 */
export interface SlideDeck {
  id: string;                         // e.g., "deck-profile-abc123-2026-03-09"
  title: string;                      // Deck title
  slides: Slide[];                    // 3-10 slides
  theme: {
    style: 'dark-botanical' | 'minimalist' | 'ocean-blue';
    tone: string;                     // e.g., "professional, inspiring"
  };
  metadata: {
    profileId: string;
    createdAt: string;               // ISO 8601
    updatedAt: string;               // ISO 8601
    author?: string;
    version: string;                 // e.g., "1.0.0"
  };
  constraints?: {
    maxCharsPerSlide: number;        // Default: 500
    minSlides: number;               // Default: 3
    maxSlides: number;               // Default: 10
    requiredSections: SlideSection[];
  };
}

/**
 * Content validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning' | 'info';
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate slide content
 */
export function validateSlide(slide: Slide): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Title validation
  if (!slide.title || slide.title.length < 3 || slide.title.length > 50) {
    errors.push({
      field: 'title',
      message: 'Title must be 3-50 characters',
      severity: 'error',
    });
  }

  // Content main text validation
  if (!slide.content.main || slide.content.main.length < 20 || slide.content.main.length > 300) {
    errors.push({
      field: 'content.main',
      message: 'Main content must be 20-300 characters',
      severity: 'error',
    });
  }

  // Bullets validation
  if (slide.content.bullets) {
    if (slide.content.bullets.length < 2 || slide.content.bullets.length > 5) {
      warnings.push({
        field: 'content.bullets',
        message: 'Optimal: 2-5 bullet points',
        severity: 'warning',
      });
    }

    slide.content.bullets.forEach((bullet, i) => {
      if (bullet.length < 20 || bullet.length > 100) {
        warnings.push({
          field: `content.bullets[${i}]`,
          message: 'Bullet should be 20-100 characters for readability',
          severity: 'info',
        });
      }
    });
  }

  // Metrics validation
  if (slide.content.metrics) {
    if (slide.content.metrics.length > 3) {
      warnings.push({
        field: 'content.metrics',
        message: 'More than 3 metrics may clutter the slide',
        severity: 'warning',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate complete deck
 */
export function validateDeck(deck: SlideDeck): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Slide count validation
  const minSlides = deck.constraints?.minSlides || 3;
  const maxSlides = deck.constraints?.maxSlides || 10;

  if (deck.slides.length < minSlides) {
    errors.push({
      field: 'slides',
      message: `Must have at least ${minSlides} slides`,
      severity: 'error',
    });
  }

  if (deck.slides.length > maxSlides) {
    errors.push({
      field: 'slides',
      message: `Must have at most ${maxSlides} slides`,
      severity: 'error',
    });
  }

  // Validate each slide
  deck.slides.forEach((slide, index) => {
    const slideValidation = validateSlide(slide);
    slideValidation.errors.forEach(error => {
      errors.push({
        field: `slides[${index}].${error.field}`,
        message: error.message,
        severity: error.severity,
      });
    });
    slideValidation.warnings.forEach(warning => {
      warnings.push({
        field: `slides[${index}].${warning.field}`,
        message: warning.message,
        severity: warning.severity,
      });
    });
  });

  // Required sections check
  if (deck.constraints?.requiredSections) {
    const presentSections = new Set(deck.slides.map(s => s.section));
    deck.constraints.requiredSections.forEach(required => {
      if (!presentSections.has(required)) {
        errors.push({
          field: 'slides',
          message: `Missing required section: ${required}`,
          severity: 'error',
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create hook/intro slide
 */
export function createHookSlide(summary: string, yearsExperience: number): Slide {
  return {
    id: 'slide-hook',
    section: SlideSection.HOOK,
    title: 'Professional Profile',
    content: {
      main: summary,
      bullets: [
        `${yearsExperience}+ years building scalable systems`,
        'Expert in full-stack development',
        'Mentor and technical leader',
      ],
    },
    order: 1,
    layout: 'default',
    visual: {
      type: 'gradient',
      gradient: {
        direction: 'diagonal',
        colors: ['#1a3a3a', '#4a8f8f'],
      },
    },
  };
}

/**
 * Create skills slide
 */
export function createSkillsSlide(
  skills: Array<{ skill: string; relevance: number; years: number }>
): Slide {
  const topSkills = skills
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  return {
    id: 'slide-skills',
    section: SlideSection.SKILLS,
    title: 'Core Competencies',
    content: {
      main: 'Deep expertise in modern development practices',
      bullets: topSkills.map(s => `${s.skill} (${s.years}y, ${s.relevance}% relevant)`),
    },
    order: 2,
    layout: 'default',
    visual: {
      type: 'icon',
      icon: {
        name: 'code',
        size: 'large',
      },
    },
  };
}

/**
 * Create project slide
 */
export function createProjectSlide(project: {
  title: string;
  description: string;
  metrics: string;
  technologies: string[];
}): Slide {
  return {
    id: 'slide-project',
    section: SlideSection.PROJECT,
    title: project.title,
    content: {
      main: project.description,
      bullets: [
        `Technologies: ${project.technologies.slice(0, 3).join(', ')}`,
        `Impact: ${project.metrics}`,
      ],
    },
    order: 3,
    layout: 'default',
  };
}

/**
 * Create growth/career narrative slide
 */
export function createGrowthSlide(narrative: string, milestones: string[]): Slide {
  return {
    id: 'slide-growth',
    section: SlideSection.GROWTH,
    title: 'Career Growth & Impact',
    content: {
      main: narrative,
      bullets: milestones.slice(0, 4),
    },
    order: 4,
    layout: 'default',
    visual: {
      type: 'chart',
      chart: {
        type: 'line',
        data: {
          'Year 1': 1,
          'Year 3': 3,
          'Year 5': 6,
          'Year 7': 10,
        },
      },
    },
  };
}

/**
 * Create CTA slide
 */
export function createCtaSlide(headline: string, message: string, contact: string): Slide {
  return {
    id: 'slide-cta',
    section: SlideSection.CTA,
    title: headline,
    content: {
      main: message,
      bullets: [
        `💼 ${contact}`,
        'Let\'s build something great together',
      ],
    },
    order: 5,
    layout: 'default',
  };
}

/**
 * Create complete deck from signals
 */
export function createDeckFromSignals(signals: {
  profileId: string;
  hook: string;
  yearsExperience: number;
  skills: Array<{ skill: string; relevance: number; years: number }>;
  project: {
    title: string;
    description: string;
    metrics: string;
    technologies: string[];
  };
  growth: {
    narrative: string;
    milestones: string[];
  };
  cta: {
    headline: string;
    message: string;
    contact: string;
  };
}): SlideDeck {
  const slides = [
    createHookSlide(signals.hook, signals.yearsExperience),
    createSkillsSlide(signals.skills),
    createProjectSlide(signals.project),
    createGrowthSlide(signals.growth.narrative, signals.growth.milestones),
    createCtaSlide(signals.cta.headline, signals.cta.message, signals.cta.contact),
  ];

  return {
    id: `deck-${signals.profileId}-${new Date().toISOString().split('T')[0]}`,
    title: 'Professional Identity',
    slides,
    theme: {
      style: 'dark-botanical',
      tone: 'professional, inspiring',
    },
    metadata: {
      profileId: signals.profileId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
    },
    constraints: {
      maxCharsPerSlide: 500,
      minSlides: 3,
      maxSlides: 10,
      requiredSections: [
        SlideSection.HOOK,
        SlideSection.SKILLS,
        SlideSection.PROJECT,
        SlideSection.GROWTH,
        SlideSection.CTA,
      ],
    },
  };
}

/**
 * Calculate content density score (0-100)
 * Higher = more signal-dense
 */
export function calculateContentDensity(slide: Slide): number {
  let score = 0;

  // Main content length (optimally 150-200 chars)
  const mainLength = slide.content.main.length;
  score += Math.min(20, Math.abs(175 - mainLength) / 10);

  // Bullet count (optimally 2-4)
  if (slide.content.bullets && slide.content.bullets.length >= 2 && slide.content.bullets.length <= 4) {
    score += 30;
  } else if (slide.content.bullets && slide.content.bullets.length > 0) {
    score += 15;
  }

  // Metrics presence (adds 20 points)
  if (slide.content.metrics && slide.content.metrics.length > 0) {
    score += 20;
  }

  // Visual element presence (adds 20 points)
  if (slide.visual) {
    score += 20;
  }

  // Title quality (3-10 words optimal)
  const titleWords = slide.title.split(/\s+/).length;
  if (titleWords >= 3 && titleWords <= 10) {
    score += 10;
  }

  return Math.min(100, Math.round(score));
}

/**
 * Export slide content to Markdown
 */
export function exportSlideToMarkdown(slide: Slide): string {
  let md = `## ${slide.title}\n\n`;

  if (slide.subtitle) {
    md += `_${slide.subtitle}_\n\n`;
  }

  md += slide.content.main + '\n\n';

  if (slide.content.bullets && slide.content.bullets.length > 0) {
    slide.content.bullets.forEach(bullet => {
      md += `- ${bullet}\n`;
    });
    md += '\n';
  }

  if (slide.content.metrics && slide.content.metrics.length > 0) {
    md += '**Metrics:**\n';
    slide.content.metrics.forEach(m => {
      md += `- ${m.label}: ${m.value}`;
      if (m.context) md += ` (${m.context})`;
      md += '\n';
    });
  }

  return md;
}

/**
 * Export entire deck to Markdown
 */
export function exportDeckToMarkdown(deck: SlideDeck): string {
  let md = `# ${deck.title}\n\n`;
  md += `**Profile:** ${deck.metadata.profileId}\n`;
  md += `**Created:** ${deck.metadata.createdAt}\n\n`;

  deck.slides.forEach((slide, i) => {
    md += `---\n\n`;
    md += exportSlideToMarkdown(slide);
  });

  return md;
}
