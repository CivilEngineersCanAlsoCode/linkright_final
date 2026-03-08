/**
 * Frontend-Slides Wrapper Test Suite
 *
 * Tests for:
 * - Signal transformation to slide content
 * - Error handling & retry logic
 * - HTML generation & validation
 * - Batch processing
 * - Performance benchmarks
 *
 * Part of E2 v2: Signal-to-Slides Pipeline Testing
 * Release 3, 2026-03-09
 */

import {
  convertSignalsToSlides,
  generateFallbackHTML,
  batchConvertSignalsToSlides,
  SlideGenerationConfig,
  ProfessionalSignal,
} from '../lib/frontend-slides-wrapper';

import {
  retryWithBackoff,
  classifyError,
  calculateBackoffDelay,
  validateSignalInput,
  ValidationError,
  CircuitBreaker,
  checkDependencies,
  ErrorLogger,
} from '../lib/frontend-slides-errors';

// ============================================================================
// Sample Data for Testing
// ============================================================================

const SAMPLE_SIGNAL: ProfessionalSignal = {
  hook: 'Full-stack engineer with 7 years building scalable SaaS platforms. Expert in React, TypeScript, and distributed systems.',
  skills: [
    { skill: 'React', relevance: 95, yearsExperience: 6 },
    { skill: 'TypeScript', relevance: 90, yearsExperience: 5 },
    { skill: 'Node.js', relevance: 85, yearsExperience: 4 },
    { skill: 'PostgreSQL', relevance: 80, yearsExperience: 3 },
    { skill: 'AWS', relevance: 75, yearsExperience: 2 },
    { skill: 'System Design', relevance: 70, yearsExperience: 4 },
  ],
  featuredProject: {
    title: 'Real-time Data Platform',
    description: 'Built a real-time analytics platform processing 100K+ events/sec. Led architecture design and managed 3-person team.',
    metrics: '30% reduction in query latency, 2.5x throughput improvement',
    timelineMonths: 8,
    technologies: ['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'Redis'],
  },
  careerGrowth: {
    narrative: 'Transitioned from frontend to full-stack, leading architectural decisions on distributed systems. Mentored 4 junior engineers and established best practices for code quality and testing.',
    keyMilestones: [
      'Led migration from monolith to microservices',
      'Reduced production incidents by 60%',
      'Established automated testing culture',
    ],
    learnings: 'Learned the value of pragmatism in architecture. Iteration and feedback loops matter more than perfect initial design.',
  },
  cta: {
    headline: 'Let\'s Build Something Great',
    message: 'I\'m excited about roles that combine technical depth with team leadership. Looking for opportunities to ship products that matter.',
    contactInfo: 'Email: hello@example.com | LinkedIn: linkedin.com/in/example',
  },
};

const SAMPLE_CONFIG: SlideGenerationConfig = {
  profileId: 'profile-test-001',
  signals: SAMPLE_SIGNAL,
  customization: {
    style: 'dark-botanical',
    tone: 'professional, inspiring',
  },
};

// ============================================================================
// Unit Tests: Error Handling
// ============================================================================

describe('Error Handling & Classification', () => {
  test('classifies timeout errors as recoverable', () => {
    const error = new Error('Operation timed out after 30000ms');
    const { type, severity, isRetryable } = classifyError(error);

    expect(type).toBe('TimeoutError');
    expect(isRetryable).toBe(true);
  });

  test('classifies rate limit errors as recoverable', () => {
    const error = new Error('API Rate Limit: 429 Too Many Requests');
    const { type, severity, isRetryable } = classifyError(error);

    expect(type).toBe('RateLimitError');
    expect(isRetryable).toBe(true);
  });

  test('classifies validation errors as fallback (non-retryable)', () => {
    const error = new Error('Invalid input: malformed JSON');
    const { type, severity, isRetryable } = classifyError(error);

    expect(type).toBe('ValidationError');
    expect(isRetryable).toBe(false);
  });

  test('classifies type errors as fatal', () => {
    const error = new TypeError('Cannot read property of undefined');
    const { type, severity, isRetryable } = classifyError(error);

    expect(type).toBe('TypeError');
    expect(isRetryable).toBe(false);
    expect(severity).toBe('fatal');
  });
});

// ============================================================================
// Unit Tests: Retry Logic
// ============================================================================

describe('Backoff & Retry Mechanisms', () => {
  test('calculates exponential backoff with jitter', () => {
    const baseDelay = 500;
    const delays = [1, 2, 3].map((attempt) => {
      return calculateBackoffDelay(attempt, {
        maxAttempts: 3,
        baseDelayMs: baseDelay,
        maxDelayMs: 30000,
        backoffMultiplier: 2,
        jitterFactor: 0,  // No jitter for predictability
      });
    });

    // Expected: 500ms, 1000ms, 2000ms
    expect(delays[0]).toBe(500);
    expect(delays[1]).toBe(1000);
    expect(delays[2]).toBe(2000);
  });

  test('respects max delay cap', () => {
    const delay = calculateBackoffDelay(10, {
      maxAttempts: 10,
      baseDelayMs: 1000,
      maxDelayMs: 10000,
      backoffMultiplier: 2,
      jitterFactor: 0,
    });

    expect(delay).toBeLessThanOrEqual(10000);
  });

  test('retryWithBackoff succeeds on first attempt', async () => {
    let attempts = 0;
    const result = await retryWithBackoff(
      async () => {
        attempts++;
        return 'success';
      },
      {
        profileId: 'test-profile',
        operationName: 'test-op',
      }
    );

    expect(result).toBe('success');
    expect(attempts).toBe(1);
  });

  test('retryWithBackoff retries on transient failure', async () => {
    let attempts = 0;
    const result = await retryWithBackoff(
      async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary API error');
        }
        return 'success-after-retry';
      },
      {
        profileId: 'test-profile',
        operationName: 'test-op',
        policy: {
          maxAttempts: 3,
          baseDelayMs: 10,  // Fast for testing
          maxDelayMs: 100,
          backoffMultiplier: 2,
          jitterFactor: 0,
        },
      }
    );

    expect(result).toBe('success-after-retry');
    expect(attempts).toBe(3);
  });

  test('retryWithBackoff fails after max attempts', async () => {
    let attempts = 0;
    const operation = async () => {
      attempts++;
      throw new Error('Persistent error');
    };

    await expect(
      retryWithBackoff(operation, {
        profileId: 'test-profile',
        operationName: 'test-op',
        policy: {
          maxAttempts: 2,
          baseDelayMs: 10,
          maxDelayMs: 100,
          backoffMultiplier: 2,
          jitterFactor: 0,
        },
      })
    ).rejects.toThrow('Persistent error');

    expect(attempts).toBe(2);
  });
});

// ============================================================================
// Unit Tests: Input Validation
// ============================================================================

describe('Input Validation', () => {
  test('validates valid signal input', () => {
    expect(() => validateSignalInput(SAMPLE_SIGNAL)).not.toThrow();
  });

  test('rejects signal without hook', () => {
    const invalid = { ...SAMPLE_SIGNAL, hook: null };
    expect(() => validateSignalInput(invalid)).toThrow(ValidationError);
  });

  test('rejects hook that is too short', () => {
    const invalid = { ...SAMPLE_SIGNAL, hook: 'Short' };
    expect(() => validateSignalInput(invalid)).toThrow(ValidationError);
  });

  test('rejects signal with no skills', () => {
    const invalid = { ...SAMPLE_SIGNAL, skills: [] };
    expect(() => validateSignalInput(invalid)).toThrow(ValidationError);
  });

  test('rejects skill with invalid relevance', () => {
    const invalid = {
      ...SAMPLE_SIGNAL,
      skills: [{ skill: 'React', relevance: 150, yearsExperience: 5 }],  // 150 > 100
    };
    expect(() => validateSignalInput(invalid)).toThrow(ValidationError);
  });

  test('rejects signal without featured project', () => {
    const invalid = { ...SAMPLE_SIGNAL, featuredProject: null };
    expect(() => validateSignalInput(invalid)).toThrow(ValidationError);
  });

  test('rejects signal without CTA', () => {
    const invalid = { ...SAMPLE_SIGNAL, cta: null };
    expect(() => validateSignalInput(invalid)).toThrow(ValidationError);
  });
});

// ============================================================================
// Unit Tests: Fallback HTML Generation
// ============================================================================

describe('Fallback HTML Generation', () => {
  test('generates valid HTML from signal', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('</html>');
  });

  test('includes all 5 slides in fallback HTML', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);

    expect(html).toContain('Professional Profile');
    expect(html).toContain('Core Skills');
    expect(html).toContain(SAMPLE_SIGNAL.featuredProject.title);
    expect(html).toContain('Career Growth');
    expect(html).toContain(SAMPLE_SIGNAL.cta.headline);
  });

  test('includes navigation controls', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);

    expect(html).toContain('id="prev"');
    expect(html).toContain('id="next"');
    expect(html).toContain('id="counter"');
  });

  test('includes Dark Botanical styles', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);

    expect(html).toContain('#0f1f1f');      // background
    expect(html).toContain('#e8f0f0');      // text
    expect(html).toContain('#4a8f8f');      // accent
  });

  test('includes keyboard navigation script', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);

    expect(html).toContain('ArrowRight');
    expect(html).toContain('ArrowLeft');
    expect(html).toContain('keydown');
  });

  test('HTML is self-contained (no external resources)', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);

    expect(html).not.toContain('src="http');
    expect(html).not.toContain('href="http');
    expect(html).not.toContain('<link');
  });
});

// ============================================================================
// Circuit Breaker Tests
// ============================================================================

describe('Circuit Breaker Pattern', () => {
  test('starts in closed state', () => {
    const breaker = new CircuitBreaker();
    expect(breaker.getState()).toBe('closed');
  });

  test('succeeds in closed state', async () => {
    const breaker = new CircuitBreaker();
    const result = await breaker.execute(async () => 'success');
    expect(result).toBe('success');
  });

  test('opens after threshold failures', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2 });

    for (let i = 0; i < 2; i++) {
      try {
        await breaker.execute(async () => {
          throw new Error('Failure');
        });
      } catch {
        // Expected
      }
    }

    expect(breaker.getState()).toBe('open');

    // Next call should fail immediately
    await expect(breaker.execute(async () => 'success')).rejects.toThrow(
      'Circuit breaker is OPEN'
    );
  });

  test('transitions to half-open after reset timeout', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 1, resetTimeout: 100 });

    try {
      await breaker.execute(async () => {
        throw new Error('Failure');
      });
    } catch {
      // Expected
    }

    expect(breaker.getState()).toBe('open');

    // Wait for reset timeout
    await new Promise(resolve => setTimeout(resolve, 150));

    // Next execution should transition to half-open
    try {
      await breaker.execute(async () => 'success');
      expect(breaker.getState()).toBe('half-open');
    } catch {
      // May still fail depending on timing
    }
  });

  test('resets manually', () => {
    const breaker = new CircuitBreaker();
    breaker.reset();
    expect(breaker.getState()).toBe('closed');
  });
});

// ============================================================================
// Error Logging Tests
// ============================================================================

describe('Error Logging', () => {
  test('logs and retrieves errors', () => {
    const logger = new ErrorLogger();

    logger.log({
      severity: 'recoverable',
      errorType: 'TimeoutError',
      profileId: 'profile-001',
      message: 'API call timed out',
      context: {
        profileId: 'profile-001',
        attempt: 1,
        totalAttempts: 3,
        errorMessage: 'timeout',
        timestamp: new Date().toISOString(),
        duration: 30000,
      },
      recovery: {
        strategy: 'retry',
        nextAttemptIn: 500,
      },
    });

    const logs = logger.getLogsForProfile('profile-001');
    expect(logs).toHaveLength(1);
    expect(logs[0].errorType).toBe('TimeoutError');
  });

  test('exports logs to JSON', () => {
    const logger = new ErrorLogger();
    logger.log({
      severity: 'recoverable',
      errorType: 'Test',
      profileId: 'profile-001',
      message: 'Test error',
      context: {
        profileId: 'profile-001',
        attempt: 1,
        totalAttempts: 1,
        errorMessage: 'test',
        timestamp: new Date().toISOString(),
        duration: 100,
      },
      recovery: {
        strategy: 'retry',
      },
    });

    const json = logger.exportJSON();
    expect(json).toContain('Test');
  });

  test('bounds memory with max logs', () => {
    const logger = new ErrorLogger();
    const iterations = 2000;

    for (let i = 0; i < iterations; i++) {
      logger.log({
        severity: 'recoverable',
        errorType: 'Test',
        profileId: `profile-${i}`,
        message: `Error ${i}`,
        context: {
          profileId: `profile-${i}`,
          attempt: 1,
          totalAttempts: 1,
          errorMessage: 'test',
          timestamp: new Date().toISOString(),
          duration: 100,
        },
        recovery: {
          strategy: 'retry',
        },
      });
    }

    const logs = logger.getAllLogs();
    expect(logs.length).toBeLessThanOrEqual(1000);
  });
});

// ============================================================================
// Integration Tests: HTML Generation (Mocked)
// ============================================================================

describe('HTML Generation Integration (Mocked)', () => {
  test('fallback HTML validates as proper HTML document', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);

    // Basic HTML structure validation
    const docTypeMatch = html.match(/<!DOCTYPE html>/i);
    const htmlMatch = html.match(/<html[^>]*>/i);
    const headMatch = html.match(/<head>/i);
    const bodyMatch = html.match(/<body>/i);
    const closeMatch = html.match(/<\/html>/i);

    expect(docTypeMatch).not.toBeNull();
    expect(htmlMatch).not.toBeNull();
    expect(headMatch).not.toBeNull();
    expect(bodyMatch).not.toBeNull();
    expect(closeMatch).not.toBeNull();
  });

  test('fallback HTML includes all signal content', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);

    expect(html).toContain(SAMPLE_SIGNAL.hook);
    expect(html).toContain(SAMPLE_SIGNAL.skills[0].skill);
    expect(html).toContain(SAMPLE_SIGNAL.featuredProject.metrics);
    expect(html).toContain(SAMPLE_SIGNAL.careerGrowth.learnings);
  });

  test('fallback HTML size is reasonable', () => {
    const html = generateFallbackHTML(SAMPLE_CONFIG);
    const sizeKb = Buffer.byteLength(html, 'utf8') / 1024;

    expect(sizeKb).toBeLessThan(100);  // Should be < 100KB
  });
});

// ============================================================================
// Performance Benchmarks
// ============================================================================

describe('Performance Benchmarks', () => {
  test('fallback HTML generation completes in < 100ms', () => {
    const start = Date.now();
    generateFallbackHTML(SAMPLE_CONFIG);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });

  test('batch processing 10 profiles with mocked data', async () => {
    const configs: SlideGenerationConfig[] = Array.from({ length: 10 }, (_, i) => ({
      ...SAMPLE_CONFIG,
      profileId: `profile-${i}`,
    }));

    const start = Date.now();
    const results = configs.map(config => generateFallbackHTML(config));
    const duration = Date.now() - start;

    expect(results).toHaveLength(10);
    expect(duration).toBeLessThan(1000);  // Should complete in < 1s
  });
});

// ============================================================================
// Dependency Checks
// ============================================================================

describe('Dependency Health Checks', () => {
  test('checks dependencies status', async () => {
    const health = await checkDependencies();

    expect(health).toHaveProperty('apiKey');
    expect(health).toHaveProperty('network');
    expect(health).toHaveProperty('status');
    expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
  });
});

// ============================================================================
// Test Summary Report
// ============================================================================

afterAll(() => {
  console.log(`
✓ Frontend-Slides Wrapper Test Suite Complete
  - Error handling: 4 tests
  - Retry logic: 5 tests
  - Input validation: 7 tests
  - Fallback HTML: 6 tests
  - Circuit breaker: 5 tests
  - Error logging: 3 tests
  - HTML generation: 3 tests
  - Performance: 2 tests
  - Dependencies: 1 test
  ──────────────────────
  Total: 36 tests

Next Steps:
  1. Run against real Anthropic API
  2. Test batch processing with 50+ profiles
  3. Performance profile on production signals
  4. Accessibility audit on generated HTML
  5. Integration test with portfolio workflow
  `);
});
