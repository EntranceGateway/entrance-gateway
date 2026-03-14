/**
 * Logger utility for silent error logging
 * Logs errors only in development mode, silent in production
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  error: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.error(message, ...args)
    }
    // In production, errors are silent but could be sent to error tracking service
    // Example: Sentry.captureException(args[0])
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(message, ...args)
    }
  },
  
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(message, ...args)
    }
  },
  
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(message, ...args)
    }
  },
}
