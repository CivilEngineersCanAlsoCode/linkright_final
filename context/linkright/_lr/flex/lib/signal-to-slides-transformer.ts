/**
 * Signal-to-Slides Transformer
 *
 * Converts professional signals from Sync module into normalized slide content:
 * - Maps signal fields to slide sections
 * - Extracts signal-dense content
 * - Validates content constraints
 * - Optimizes for visual presentation
 *
 * Part of E2 v2: Signal-to-Slides Content Transformer
 * Release 3, 2026-03-09
 */

import {
  Slide,
  SlideDeck,
  SlideSection,
  SlideContent,
  VisualElement,
  SlideLayout,
  createHookSlide,
  createSkillsSlide,
  createProjectSlide,
  createGrowthSlide,
  createCtaSlide,
  validateDeck,
  validateSlide,
} from './slide-content-schema';

/**
 * Input signal structure from Sync module
 */
export interface SyncSignal {
  profileId: string;
  hook: string;                      // Professional summary
  yearsExperience: number;           // Total years in field
  skills: Array<{
    skill: string;
    relevance: number;               // 0-100 (relevance to JD)
    yearsExperience: number;
    proficiencyLevel?: 'beginner' | 'intermediate' | 'expert';
  }>;
  featuredProject: {
    title: string;
    description: string;             // 100-300 chars
    metrics: string;                 // Quantified impact
    timelineMonths: number;
    technologies: string[];
    teamSize?: number;
  };
  careerGrowth: {
    narrative: string;               // 150-300 chars
    keyMilestones: string[];         // 3-5 milestones
    learnings: string;               // Key learnings
  };
  cta: {
    headline: string;
    message: string;                 // 100-200 chars
    contactInfo: string;
  };
  context?: {
    targetRole?: string;
    targetCompany?: string;
    jdKeywords?: string[];
  };
}

/**
 * Transformation options
 */
export interface TransformOptions {
  maxSlides?: number;                 // Default: 5
  style?: 'dark-botanical' | 'minimalist' | 'ocean-blue';
  tone?: string;                      // Default: "professional, inspiring"
  includeVisuals?: boolean;           // Default: true
  prioritySignals?: SlideSection[];   // Order of importance
}

/**
 * Transformation result
 */
export interface TransformResult {
  deck: SlideDeck;
  signalDensity: Record<string, number>;  // Density per slide
  avgDensity: number;
  recommendations: string[];
}

// ============================================================================
// Main Transformer
// ============================================================================

export class SignalToSlidesTransformer {
  private options: Required<TransformOptions>;

  constructor(options?: TransformOptions) {
    this.options = {
      maxSlides: options?.maxSlides || 5,
      style: options?.style || 'dark-botanical',
      tone: options?.tone || 'professional, inspiring',
      includeVisuals: options?.includeVisuals !== false,
      prioritySignals: options?.prioritySignals || [
        SlideSection.HOOK,
        SlideSection.SKILLS,
        SlideSection.PROJECT,
        SlideSection.GROWTH,
        SlideSection.CTA,
      ],
    };
  }

  /**
   * Transform signal to deck
   */
  transform(signal: SyncSignal): TransformResult {
    // Create slides
    const slides = this.createSlides(signal);

    // Validate deck
    const deck: SlideDeck = {
      id: `deck-${signal.profileId}-${new Date().toISOString().split('T')[0]}`,
      title: 'Professional Identity',
      slides,
      theme: {
        style: this.options.style,
        tone: this.options.tone,
      },
      metadata: {
        profileId: signal.profileId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
      },
    };

    const validation = validateDeck(deck);
    if (!validation.valid) {
      console.warn('Deck validation warnings:', validation.warnings);
    }

    // Calculate signal density
    const signalDensity: Record<string, number> = {};
    let totalDensity = 0;

    slides.forEach((slide, i) => {
      const mainLength = slide.content.main.length;
      const bulletCount = slide.content.bullets?.length || 0;
      const metricsCount = slide.content.metrics?.length || 0;

      // Density = (main text + bullets + metrics) / slide area
      const density = mainLength + (bulletCount * 50) + (metricsCount * 30);
      signalDensity[`slide-${i + 1}`] = density;
      totalDensity += density;
    });

    const avgDensity = Math.round(totalDensity / slides.length);

    return {
      deck,
      signalDensity,
      avgDensity,
      recommendations: this.generateRecommendations(slides, avgDensity),
    };
  }

  /**
   * Create slides from signal
   */
  private createSlides(signal: SyncSignal): Slide[] {
    const slides: Slide[] = [];
    let slideOrder = 1;

    // 1. Hook slide
    const hookSlide = this.transformHookSlide(signal);
    slides.push({ ...hookSlide, order: slideOrder++ });

    // 2. Skills slide (if not at max)
    if (slideOrder < this.options.maxSlides) {
      const skillsSlide = this.transformSkillsSlide(signal);
      slides.push({ ...skillsSlide, order: slideOrder++ });
    }

    // 3. Project slide (if not at max)
    if (slideOrder < this.options.maxSlides) {
      const projectSlide = this.transformProjectSlide(signal);
      slides.push({ ...projectSlide, order: slideOrder++ });
    }

    // 4. Growth slide (if not at max)
    if (slideOrder < this.options.maxSlides) {
      const growthSlide = this.transformGrowthSlide(signal);
      slides.push({ ...growthSlide, order: slideOrder++ });
    }

    // 5. CTA slide (if not at max)
    if (slideOrder < this.options.maxSlides) {
      const ctaSlide = this.transformCtaSlide(signal);
      slides.push({ ...ctaSlide, order: slideOrder++ });
    }

    return slides;
  }

  /**
   * Transform hook/intro section
   */
  private transformHookSlide(signal: SyncSignal): Slide {
    const slide = createHookSlide(signal.hook, signal.yearsExperience);

    // Enhance with context if available
    if (signal.context?.targetRole) {
      slide.subtitle = `Seeking: ${signal.context.targetRole}`;
    }

    return {
      ...slide,
      layout: 'default' as SlideLayout,
      visual: this.options.includeVisuals
        ? {
            type: 'gradient',
            gradient: {
              direction: 'diagonal',
              colors: ['#1a3a3a', '#4a8f8f'],
            },
          }
        : undefined,
    };
  }

  /**
   * Transform skills section
   */
  private transformSkillsSlide(signal: SyncSignal): Slide {
    // Sort by relevance, take top 5
    const topSkills = signal.skills
      .filter(s => s.relevance > 0)  // Only include relevant skills
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5)
      .map(s => ({
        skill: s.skill,
        relevance: s.relevance,
        years: s.yearsExperience,
      }));

    const slide = createSkillsSlide(topSkills);

    return {
      ...slide,
      content: {
        ...slide.content,
        bullets: topSkills.map(s => `${s.skill} (${s.years}y, ${s.relevance}% relevant)`),
      },
      layout: 'metrics' as SlideLayout,
      visual: this.options.includeVisuals
        ? {
            type: 'icon',
            icon: {
              name: 'code',
              size: 'large',
            },
          }
        : undefined,
    };
  }

  /**
   * Transform project section
   */
  private transformProjectSlide(signal: SyncSignal): Slide {
    const slide = createProjectSlide(signal.featuredProject);

    // Add metrics as structured data
    const content: SlideContent = {
      main: signal.featuredProject.description,
      bullets: signal.featuredProject.technologies.slice(0, 3),
      metrics: [
        {
          label: 'Impact',
          value: signal.featuredProject.metrics,
        },
        {
          label: 'Duration',
          value: `${signal.featuredProject.timelineMonths} months`,
        },
      ],
    };

    if (signal.featuredProject.teamSize) {
      content.metrics!.push({
        label: 'Team',
        value: `${signal.featuredProject.teamSize} engineers`,
      });
    }

    return {
      ...slide,
      content,
      layout: 'two-column' as SlideLayout,
    };
  }

  /**
   * Transform growth/career section
   */
  private transformGrowthSlide(signal: SyncSignal): Slide {
    const slide = createGrowthSlide(
      signal.careerGrowth.narrative,
      signal.careerGrowth.keyMilestones
    );

    return {
      ...slide,
      content: {
        ...slide.content,
        bullets: signal.careerGrowth.keyMilestones.slice(0, 4),
      },
      layout: 'timeline' as SlideLayout,
      visual: this.options.includeVisuals
        ? {
            type: 'chart',
            chart: {
              type: 'line',
              data: {
                'Early Career': 1,
                'Mid Career': 3,
                'Senior': 5,
                'Lead': 8,
              },
            },
          }
        : undefined,
    };
  }

  /**
   * Transform CTA section
   */
  private transformCtaSlide(signal: SyncSignal): Slide {
    const slide = createCtaSlide(
      signal.cta.headline,
      signal.cta.message,
      signal.cta.contactInfo
    );

    return {
      ...slide,
      layout: 'hero' as SlideLayout,
      visual: this.options.includeVisuals
        ? {
            type: 'gradient',
            gradient: {
              direction: 'vertical',
              colors: ['#0f1f1f', '#1a3a3a'],
            },
          }
        : undefined,
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(slides: Slide[], avgDensity: number): string[] {
    const recommendations: string[] = [];

    // Check slide density
    if (avgDensity < 200) {
      recommendations.push('Slides appear sparse - consider adding more metrics or details');
    } else if (avgDensity > 400) {
      recommendations.push('Slides appear crowded - consider removing less relevant details');
    }

    // Check bullet counts
    slides.forEach((slide, i) => {
      if (slide.content.bullets && slide.content.bullets.length === 0) {
        recommendations.push(`Slide ${i + 1} has no bullet points - consider adding structure`);
      }
      if (slide.content.bullets && slide.content.bullets.length > 5) {
        recommendations.push(`Slide ${i + 1} has too many bullets (${slide.content.bullets.length}) - consider consolidating`);
      }
    });

    // Check metrics presence
    const metricsCount = slides.filter(s => s.content.metrics && s.content.metrics.length > 0).length;
    if (metricsCount < 2) {
      recommendations.push('Consider adding more quantified metrics to strengthen narrative');
    }

    return recommendations;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract key phrases from signal for vector embedding
 */
export function extractSignalKeyPhrases(signal: SyncSignal): string[] {
  const phrases: Set<string> = new Set();

  // Skills
  signal.skills.forEach(s => phrases.add(s.skill));

  // Technologies
  signal.featuredProject.technologies.forEach(t => phrases.add(t));

  // Extract nouns from narrative
  const words = signal.careerGrowth.narrative.split(/\s+/);
  const importantWords = words.filter(w => w.length > 5 && !['which', 'their', 'these'].includes(w.toLowerCase()));
  importantWords.slice(0, 5).forEach(w => phrases.add(w));

  // Keywords from context
  if (signal.context?.jdKeywords) {
    signal.context.jdKeywords.forEach(k => phrases.add(k));
  }

  return Array.from(phrases);
}

/**
 * Calculate signal-to-slides transformation fidelity (0-100)
 * Measures how well signals are represented in slides
 */
export function calculateTransformationFidelity(
  original: SyncSignal,
  result: TransformResult
): number {
  let score = 0;

  // Coverage scoring
  const slides = result.deck.slides;
  const hasSections = new Set(slides.map(s => s.section));

  // Each section should map to a slide
  const requiredSections = [SlideSection.HOOK, SlideSection.SKILLS, SlideSection.PROJECT, SlideSection.GROWTH, SlideSection.CTA];
  const coverageScore = (requiredSections.filter(s => hasSections.has(s)).length / requiredSections.length) * 40;
  score += coverageScore;

  // Content preservation
  const contentPresence = {
    hook: slides.some(s => s.content.main.includes(original.hook.substring(0, 20))) ? 10 : 0,
    skills: slides.some(s => s.content.bullets?.some(b => original.skills.some(sk => b.includes(sk.skill)))) ? 10 : 0,
    project: slides.some(s => s.content.main.includes(original.featuredProject.title)) ? 10 : 0,
    growth: slides.some(s => s.content.main.includes(original.careerGrowth.narrative.substring(0, 20))) ? 10 : 0,
    cta: slides.some(s => s.content.main.includes(original.cta.message.substring(0, 20))) ? 10 : 0,
  };
  score += Object.values(contentPresence).reduce((a, b) => a + b, 0);

  // Density optimization
  const densityScore = Math.min(20, result.avgDensity / 20);
  score += densityScore;

  return Math.round(Math.min(100, score));
}
