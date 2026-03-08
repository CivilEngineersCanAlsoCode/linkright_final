/**
 * Error Handling & Retry Logic for Frontend-Slides Wrapper
 *
 * Provides robust error recovery mechanisms:
 * - Exponential backoff retries
 * - Timeout handling
 * - Fallback generation
 * - Comprehensive logging
 *
 * Part of E2 v2: Signal-to-Slides Pipeline
 * Release 3, 2026-03-09
 */

export enum ErrorSeverity {
  RECOVERABLE = 'recoverable',   // Can retry
  FALLBACK = 'fallback',         // Use fallback HTML
  FATAL = 'fatal',               // Cannot proceed, report to user
}

export interface ErrorContext {
  profileId: string;
  attempt: number;
  totalAttempts: number;
  errorMessage: string;
  errorStack?: string;
  timestamp: string;
  duration: number;                 // ms
}

export interface RetryPolicy {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitterFactor: number;              // 0.0-1.0
}

export interface ErrorLog {
  severity: ErrorSeverity;
  errorType: string;
  profileId: string;
  message: string;
  context: ErrorContext;
  recovery: {
    strategy: 'retry' | 'fallback' | 'fail';
    nextAttemptIn?: number;           // ms
  };
}

/**
 * Default retry policy: exponential backoff with jitter
 * - Start: 500ms
 * - Max: 30s
 * - Multiplier: 2x
 * - Jitter: ±20%
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  jitterFactor: 0.2,
};

/**
 * Classify error type and determine severity
 */
export function classifyError(error: unknown): {
  type: string;
  severity: ErrorSeverity;
  isRetryable: boolean;
} {
  if (error instanceof TypeError) {
    return {
      type: 'TypeError',
      severity: ErrorSeverity.FATAL,
      isRetryable: false,
    };
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Timeout errors - retryable
    if (message.includes('timeout') || message.includes('timed out')) {
      return {
        type: 'TimeoutError',
        severity: ErrorSeverity.RECOVERABLE,
        isRetryable: true,
      };
    }

    // Rate limit - retryable with backoff
    if (message.includes('rate limit') || message.includes('429')) {
      return {
        type: 'RateLimitError',
        severity: ErrorSeverity.RECOVERABLE,
        isRetryable: true,
      };
    }

    // API errors - may be retryable
    if (message.includes('api') || message.includes('network')) {
      return {
        type: 'APIError',
        severity: ErrorSeverity.RECOVERABLE,
        isRetryable: true,
      };
    }

    // Validation/Input errors - use fallback
    if (message.includes('invalid') || message.includes('malformed')) {
      return {
        type: 'ValidationError',
        severity: ErrorSeverity.FALLBACK,
        isRetryable: false,
      };
    }

    // HTML generation errors - use fallback
    if (message.includes('html') || message.includes('structure')) {
      return {
        type: 'GenerationError',
        severity: ErrorSeverity.FALLBACK,
        isRetryable: false,
      };
    }

    // Generic API errors
    if (message.includes('anthropic') || message.includes('claude')) {
      return {
        type: 'ClaudeAPIError',
        severity: ErrorSeverity.RECOVERABLE,
        isRetryable: true,
      };
    }
  }

  return {
    type: 'UnknownError',
    severity: ErrorSeverity.FALLBACK,
    isRetryable: false,
  };
}

/**
 * Calculate exponential backoff delay with jitter
 */
export function calculateBackoffDelay(
  attempt: number,
  policy: RetryPolicy
): number {
  const exponentialDelay = policy.baseDelayMs * Math.pow(policy.backoffMultiplier, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, policy.maxDelayMs);

  // Add jitter (±jitterFactor%)
  const jitterRange = cappedDelay * policy.jitterFactor;
  const jitter = (Math.random() - 0.5) * 2 * jitterRange;

  return Math.max(0, cappedDelay + jitter);
}

/**
 * Wrapper for retryable operations
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  context: {
    profileId: string;
    operationName: string;
    policy?: RetryPolicy;
    onRetry?: (error: Error, attempt: number, delayMs: number) => void;
    onSuccess?: (attempt: number) => void;
    onFailure?: (error: Error, attempts: number) => void;
  }
): Promise<T> {
  const policy = context.policy || DEFAULT_RETRY_POLICY;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      const result = await operation();
      if (context.onSuccess) {
        context.onSuccess(attempt);
      }
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      lastError = err;

      const { isRetryable } = classifyError(err);

      if (!isRetryable || attempt === policy.maxAttempts) {
        if (context.onFailure) {
          context.onFailure(err, attempt);
        }
        throw err;
      }

      const delayMs = calculateBackoffDelay(attempt, policy);

      if (context.onRetry) {
        context.onRetry(err, attempt, delayMs);
      }

      await delay(delayMs);
    }
  }

  throw lastError || new Error('Operation failed after all retries');
}

/**
 * Promise-based delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Timeout wrapper
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Error logging interface
 */
export class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs: number = 1000;

  log(errorLog: ErrorLog): void {
    this.logs.push(errorLog);

    // Keep memory bounded
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output (structured logging)
    console.error(
      JSON.stringify({
        timestamp: errorLog.context.timestamp,
        severity: errorLog.severity,
        type: errorLog.errorType,
        profileId: errorLog.profileId,
        message: errorLog.message,
        attempt: `${errorLog.context.attempt}/${errorLog.context.totalAttempts}`,
        recovery: errorLog.recovery.strategy,
      }, null, 2)
    );
  }

  getLogsForProfile(profileId: string): ErrorLog[] {
    return this.logs.filter(log => log.profileId === profileId);
  }

  getAllLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportJSON(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

/**
 * Input validation
 */
export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(`Validation error in ${field}: ${message}`);
    this.name = 'ValidationError';
  }
}

export function validateSignalInput(signal: any): void {
  if (!signal.hook || typeof signal.hook !== 'string' || signal.hook.length < 10) {
    throw new ValidationError('Must be 10+ characters', 'hook');
  }

  if (!Array.isArray(signal.skills) || signal.skills.length === 0) {
    throw new ValidationError('Must have at least 1 skill', 'skills');
  }

  signal.skills.forEach((skill: any, index: number) => {
    if (!skill.skill || typeof skill.skill !== 'string') {
      throw new ValidationError(`Skill ${index} missing or invalid`, `skills[${index}]`);
    }
    if (typeof skill.relevance !== 'number' || skill.relevance < 0 || skill.relevance > 100) {
      throw new ValidationError(
        'Relevance must be 0-100',
        `skills[${index}].relevance`
      );
    }
  });

  if (!signal.featuredProject?.title || !signal.featuredProject?.description) {
    throw new ValidationError('Must have title and description', 'featuredProject');
  }

  if (!signal.cta?.headline || !signal.cta?.message) {
    throw new ValidationError('Must have headline and message', 'cta');
  }
}

/**
 * Health check for external dependencies
 */
export async function checkDependencies(): Promise<{
  apiKey: boolean;
  network: boolean;
  status: 'healthy' | 'degraded' | 'unhealthy';
}> {
  const checks = {
    apiKey: !!process.env.ANTHROPIC_API_KEY,
    network: false,
  };

  try {
    // Quick DNS check for API endpoint
    const response = await Promise.race([
      fetch('https://api.anthropic.com/health', { method: 'HEAD' }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Health check timeout')), 5000)
      ),
    ]);

    checks.network = (response as Response).ok;
  } catch {
    checks.network = false;
  }

  const allHealthy = checks.apiKey && checks.network;
  const status = allHealthy ? 'healthy' : checks.apiKey ? 'degraded' : 'unhealthy';

  return { ...checks, status };
}

/**
 * Circuit breaker pattern for cascading failures
 */
export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeout: number;
  private readonly successThresholdHalfOpen: number;

  constructor(options?: {
    failureThreshold?: number;       // failures before opening
    resetTimeout?: number;           // ms before trying half-open
    successThresholdHalfOpen?: number; // successes before closing
  }) {
    this.failureThreshold = options?.failureThreshold || 5;
    this.resetTimeout = options?.resetTimeout || 30000;
    this.successThresholdHalfOpen = options?.successThresholdHalfOpen || 2;
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'half-open';
        this.failureCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
      }
    }

    try {
      const result = await operation();

      if (this.state === 'half-open') {
        this.failureCount++;
        if (this.failureCount >= this.successThresholdHalfOpen) {
          this.state = 'closed';
          this.failureCount = 0;
        }
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.failureThreshold) {
        this.state = 'open';
      }

      throw error;
    }
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state;
  }

  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}
