/**
 * Frontend-Slides Wrapper
 *
 * Converts ranked professional signals into production-ready HTML slideshows
 * by invoking the /frontend-slides Claude Code skill.
 *
 * Part of E2 v2: Signal-to-Slides Pipeline Integration
 * Release 3, 2026-03-09
 */

import Anthropic from '@anthropic-ai/sdk';

/**
 * Signal structure from Sync module (output of signal extraction/ranking)
 */
export interface ProfessionalSignal {
  hook: string;                    // 1-2 sentence professional summary
  skills: Array<{
    skill: string;                 // Skill name (React, TypeScript, etc)
    relevance: number;             // 0-100 (relevance to JD)
    yearsExperience: number;       // Years in this skill
  }>;
  featuredProject: {
    title: string;                 // Project name
    description: string;           // What it was, what you did
    metrics: string;               // Quantified impact (30% improvement, etc)
    timelineMonths: number;        // Duration
    technologies: string[];        // Tech stack used
  };
  careerGrowth: {
    narrative: string;             // Career arc narrative (3-4 sentences)
    keyMilestones: string[];       // Major achievements
    learnings: string;             // Key learnings & growth mindset
  };
  cta: {
    headline: string;              // "Let's Connect" or similar
    message: string;               // Why this role is interesting
    contactInfo: string;           // Email, LinkedIn URL, etc
  };
}

/**
 * Configuration for slide generation
 */
export interface SlideGenerationConfig {
  profileId: string;
  signals: ProfessionalSignal;
  customization?: {
    style?: 'dark-botanical' | 'minimalist' | 'ocean-blue';  // Default: dark-botanical
    tone?: string;                 // e.g., "professional, inspiring, confident"
    colors?: string[];             // 3-5 hex color overrides
  };
  targetDeckSize?: number;         // Default: 5 slides (hook, skills, project, growth, cta)
}

/**
 * Output from slide generation
 */
export interface SlideGenerationResult {
  success: boolean;
  html: string;                    // Complete self-contained HTML
  fileName: string;                // e.g., "slides-profile-abc123-2026-03-09.html"
  metadata: {
    profileId: string;
    sizeBytes: number;
    slideCount: number;
    styleUsed: string;
    renderTime: number;            // ms
    generatedAt: string;           // ISO 8601
  };
  errors?: string[];
}

/**
 * Transform professional signals into slide content structure
 */
function transformSignalsToSlideContent(
  signals: ProfessionalSignal,
  deckSize: number = 5
): Record<string, string> {
  // Top N skills by relevance
  const topSkills = signals.skills
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5)
    .map(s => `${s.skill} (${s.yearsExperience}y)`)
    .join(', ');

  const slides = [
    {
      title: 'Professional Profile',
      body: signals.hook,
    },
    {
      title: 'Core Competencies',
      body: `Key skills: ${topSkills}`,
    },
    {
      title: signals.featuredProject.title,
      body: `${signals.featuredProject.description}\n\nImpact: ${signals.featuredProject.metrics}\nTech: ${signals.featuredProject.technologies.join(', ')}`,
    },
    {
      title: 'Career Growth',
      body: signals.careerGrowth.narrative,
    },
    {
      title: signals.cta.headline,
      body: `${signals.cta.message}\n\n${signals.cta.contactInfo}`,
    },
  ].slice(0, deckSize);

  return {
    slideCount: slides.length.toString(),
    slideContent: slides.map((s, i) => `Slide ${i + 1}: ${s.title}\n${s.body}`).join('\n\n---\n\n'),
  };
}

/**
 * Generate structured prompt for Claude to create slides via /frontend-slides
 */
function generateSlidePrompt(
  config: SlideGenerationConfig,
  slideContent: Record<string, string>
): string {
  const style = config.customization?.style || 'dark-botanical';
  const tone = config.customization?.tone || 'professional, inspiring';
  const colors = config.customization?.colors || [];

  const colorNote = colors.length > 0
    ? `\nPrefer colors in this palette: ${colors.join(', ')}`
    : '';

  return `Create a professional HTML slideshow with these requirements:

DECK STRUCTURE:
${slideContent.slideContent}

STYLE & AESTHETICS:
- Use the "${style}" style/theme
- Tone: ${tone}
- Make it visually polished and premium${colorNote}
- Include smooth navigation (prev/next buttons)
- Responsive design (works on mobile and desktop)

OUTPUT REQUIREMENTS:
- Single self-contained HTML file (no external stylesheets)
- Inline all CSS and JavaScript
- Include keyboard navigation (arrow keys)
- Dark mode optimized
- Professional typography
- Self-documenting code structure

TECHNICAL CONSTRAINTS:
- Zero external dependencies
- File size: < 150KB
- Load time: < 2 seconds
- Keyboard accessible
- WCAG 2.1 AA minimum contrast

Create the HTML now. Output only the complete HTML file with no markdown or explanation.`;
}

/**
 * Main wrapper function: Convert signals to slides
 */
export async function convertSignalsToSlides(
  config: SlideGenerationConfig,
  anthropicApiKey?: string
): Promise<SlideGenerationResult> {
  const startTime = Date.now();

  try {
    // Initialize Anthropic client
    const client = new Anthropic({
      apiKey: anthropicApiKey || process.env.ANTHROPIC_API_KEY,
    });

    // Transform signals to slide content
    const slideContent = transformSignalsToSlideContent(
      config.signals,
      config.targetDeckSize || 5
    );

    // Generate prompt for Claude
    const prompt = generateSlidePrompt(config, slideContent);

    // Call Claude API with high token limit for HTML generation
    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract HTML from response
    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    const html = content.text.trim();

    // Validate HTML structure (basic check)
    if (!html.includes('<!DOCTYPE html') && !html.includes('<html')) {
      throw new Error('Invalid HTML structure in response');
    }

    // Generate output metadata
    const fileName = `slides-profile-${config.profileId}-${new Date().toISOString().split('T')[0]}.html`;
    const sizeBytes = Buffer.byteLength(html, 'utf8');
    const renderTime = Date.now() - startTime;

    return {
      success: true,
      html,
      fileName,
      metadata: {
        profileId: config.profileId,
        sizeBytes,
        slideCount: parseInt(slideContent.slideCount),
        styleUsed: config.customization?.style || 'dark-botanical',
        renderTime,
        generatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    const renderTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      success: false,
      html: '',
      fileName: '',
      metadata: {
        profileId: config.profileId,
        sizeBytes: 0,
        slideCount: 0,
        styleUsed: config.customization?.style || 'dark-botanical',
        renderTime,
        generatedAt: new Date().toISOString(),
      },
      errors: [
        `Slide generation failed: ${errorMessage}`,
        'Falling back to minimal HTML template',
      ],
    };
  }
}

/**
 * Generate minimal fallback HTML for error scenarios
 */
export function generateFallbackHTML(config: SlideGenerationConfig): string {
  const signals = config.signals;
  const timestamp = new Date().toISOString().split('T')[0];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Profile - ${signals.hook}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      background: #0f1f1f;
      color: #e8f0f0;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }
    .slide {
      display: none;
      min-height: 600px;
      padding: 3rem;
      background: linear-gradient(135deg, #1a3a3a 0%, #2d5a5a 100%);
      border-radius: 8px;
      margin: 2rem 0;
    }
    .slide.active {
      display: block;
      animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      color: #4a8f8f;
    }
    p {
      font-size: 1.125rem;
      margin: 1rem 0;
    }
    .nav {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-top: 2rem;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: #4a8f8f;
      color: #e8f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s ease;
    }
    button:hover {
      background: #2d5a5a;
    }
    .counter {
      text-align: center;
      margin-top: 1rem;
      color: #2d5a5a;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="slide active">
      <h1>Professional Profile</h1>
      <p>${signals.hook}</p>
    </div>
    <div class="slide">
      <h1>Core Skills</h1>
      <p>${signals.skills.map(s => s.skill).join(', ')}</p>
    </div>
    <div class="slide">
      <h1>${signals.featuredProject.title}</h1>
      <p>${signals.featuredProject.description}</p>
      <p><strong>Impact:</strong> ${signals.featuredProject.metrics}</p>
    </div>
    <div class="slide">
      <h1>Career Growth</h1>
      <p>${signals.careerGrowth.narrative}</p>
    </div>
    <div class="slide">
      <h1>${signals.cta.headline}</h1>
      <p>${signals.cta.message}</p>
      <p>${signals.cta.contactInfo}</p>
    </div>

    <div class="nav">
      <button id="prev">← Previous</button>
      <button id="next">Next →</button>
    </div>
    <div class="counter">
      <span id="counter">1 / 5</span>
    </div>
  </div>

  <script>
    const slides = document.querySelectorAll('.slide');
    let current = 0;

    function show(index) {
      slides.forEach(s => s.classList.remove('active'));
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      document.getElementById('counter').textContent = \`\${current + 1} / \${slides.length}\`;
    }

    document.getElementById('next').addEventListener('click', () => show(current + 1));
    document.getElementById('prev').addEventListener('click', () => show(current - 1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
  </script>
</body>
</html>`;
}

/**
 * Batch process multiple profiles
 */
export async function batchConvertSignalsToSlides(
  configs: SlideGenerationConfig[],
  options?: {
    maxConcurrent?: number;
    apiKey?: string;
  }
): Promise<SlideGenerationResult[]> {
  const maxConcurrent = options?.maxConcurrent || 3;
  const results: SlideGenerationResult[] = [];
  const queue = [...configs];

  const processQueue = async () => {
    while (queue.length > 0) {
      const config = queue.shift();
      if (!config) break;

      try {
        const result = await convertSignalsToSlides(config, options?.apiKey);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          html: '',
          fileName: '',
          metadata: {
            profileId: config.profileId,
            sizeBytes: 0,
            slideCount: 0,
            styleUsed: 'dark-botanical',
            renderTime: 0,
            generatedAt: new Date().toISOString(),
          },
          errors: [error instanceof Error ? error.message : 'Unknown batch error'],
        });
      }
    }
  };

  // Run multiple workers concurrently
  const workers = Array(Math.min(maxConcurrent, configs.length))
    .fill(null)
    .map(() => processQueue());

  await Promise.all(workers);
  return results;
}
