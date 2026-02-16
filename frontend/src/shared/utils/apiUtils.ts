/**
 * API utility with automatic retry logic for failed requests
 */

interface RetryConfig {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    onRetry: () => { }
};

/**
 * Exponential backoff delay calculation
 */
function getRetryDelay(attempt: number, config: Required<RetryConfig>): number {
    const delay = Math.min(
        config.initialDelay * Math.pow(2, attempt),
        config.maxDelay
    );
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch with automatic retry and exponential backoff
 */
export async function fetchWithRetry(
    url: string,
    options?: RequestInit,
    retryConfig?: RetryConfig
): Promise<Response> {
    const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    let lastError: Error;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);

            // Retry on 5xx server errors or 429 (rate limit)
            if (response.status >= 500 || response.status === 429) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            return response;
        } catch (error) {
            lastError = error as Error;

            // Don't retry on last attempt
            if (attempt === config.maxRetries) {
                break;
            }

            // Calculate delay and notify
            const delay = getRetryDelay(attempt, config);
            config.onRetry(attempt + 1, lastError);

            console.warn(`Request failed (attempt ${attempt + 1}/${config.maxRetries + 1}). Retrying in ${Math.round(delay)}ms...`, lastError);

            // Wait before retrying
            await sleep(delay);
        }
    }

    throw lastError!;
}

/**
 * Typed JSON fetch with retry
 */
export async function fetchJSON<T>(
    url: string,
    options?: RequestInit,
    retryConfig?: RetryConfig
): Promise<T> {
    const response = await fetchWithRetry(url, options, retryConfig);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
}
