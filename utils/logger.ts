/**
 * Logger utility for accp-web
 * 
 * In development: logs to console
 * In production: could be extended to send to logging service
 */

const isDev = process.env.NODE_ENV === 'development';

interface LogContext {
    component?: string;
    action?: string;
    [key: string]: unknown;
}

export const logger = {
    /**
     * Log an error with optional context
     */
    error: (message: string, error?: unknown, context?: LogContext) => {
        if (isDev) {
            console.error(`[ERROR] ${message}`, error, context);
        }
        // In production, could send to external logging service
        // Example: Sentry.captureException(error);
    },

    /**
     * Log a warning
     */
    warn: (message: string, context?: LogContext) => {
        if (isDev) {
            console.warn(`[WARN] ${message}`, context);
        }
    },

    /**
     * Log info (only in development)
     */
    info: (message: string, context?: LogContext) => {
        if (isDev) {
            console.info(`[INFO] ${message}`, context);
        }
    },

    /**
     * Log debug info (only in development)
     */
    debug: (message: string, context?: LogContext) => {
        if (isDev) {
            console.debug(`[DEBUG] ${message}`, context);
        }
    },
};

export default logger;
