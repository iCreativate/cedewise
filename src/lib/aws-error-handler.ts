/**
 * AWS Error Handler
 * 
 * This module provides a wrapper around logger functions to catch AWS credential errors 
 * in development environment.
 */

import { logger } from './logger';

/**
 * A wrapper around logger.trackUserAction that catches and suppresses AWS credential errors
 */
export const safeTrackUserAction = async (action: string, userId?: string, details?: any): Promise<void> => {
  try {
    await logger.trackUserAction(action, userId, details);
  } catch (error) {
    // In development, silently ignore AWS credential errors
    if (process.env.NODE_ENV === 'production') {
      console.error('[AWS] Error sending metrics:', error);
    } else {
      console.info('[AWS] Metric logging skipped in development environment');
    }
  }
};

// Export the original logger with safe methods
export const safeLogger = {
  ...logger,
  trackUserAction: safeTrackUserAction
};

export default safeLogger; 