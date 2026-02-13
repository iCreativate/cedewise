import { logMetric } from './aws';

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  userId?: string;
  sessionId?: string;
}

// Environment types for Node.js
type NodeEnv = 'development' | 'production' | 'test';

// Get environment with proper type checking
const getNodeEnv = (): NodeEnv => {
  const env = process.env.NODE_ENV;
  if (env === 'production' || env === 'test') {
    return env;
  }
  return 'development'; // Default to development
};

// CloudWatch configuration
const CLOUDWATCH_NAMESPACE = 'Cedewise/Production';
export const CLOUDWATCH_METRICS = {
  API_LATENCY: 'APILatency',
  ERROR_COUNT: 'ErrorCount',
  USER_ACTIONS: 'UserActions',
  DOCUMENT_UPLOADS: 'DocumentUploads',
  FORM_SUBMISSIONS: 'FormSubmissions',
  REINSURANCE_QUOTES: 'ReinsuranceQuotes'
};

// Default logger configuration
const config = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  sendToCloudWatch: process.env.NODE_ENV === 'production',
  consoleOutput: true
};

/**
 * Format log entry for console output
 */
const formatLogEntry = (entry: LogEntry): string => {
  const { timestamp, level, message, context, data } = entry;
  let formattedMessage = `[${timestamp}] [${level}]`;
  
  if (context) {
    formattedMessage += ` [${context}]`;
  }
  
  formattedMessage += `: ${message}`;
  
  if (data) {
    try {
      formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
    } catch (e) {
      formattedMessage += '\n[Unable to stringify data]';
    }
  }
  
  return formattedMessage;
};

/**
 * Send log entry to CloudWatch
 */
const sendToCloudWatch = async (entry: LogEntry) => {
  if (!config.sendToCloudWatch) {
    return;
  }
  
  const dimensions: { Name: string; Value: string }[] = [
    { Name: 'Environment', Value: getNodeEnv() }
  ];
  
  if (entry.context) {
    dimensions.push({ Name: 'Context', Value: entry.context });
  }
  
  // For errors, increment error count metric
  if (entry.level === LogLevel.ERROR) {
    await logMetric(
      CLOUDWATCH_NAMESPACE,
      CLOUDWATCH_METRICS.ERROR_COUNT,
      1,
      'Count',
      dimensions
    );
  }
  
  // Additional custom metrics based on context could be added here
};

/**
 * Core logging function
 */
const log = async (level: LogLevel, message: string, options?: {
  context?: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  sendToCloudWatch?: boolean;
}): Promise<void> => {
  // Skip if below minimum level
  if (Object.values(LogLevel).indexOf(level) < Object.values(LogLevel).indexOf(config.minLevel)) {
    return;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...options
  };

  // Console output
  if (config.consoleOutput) {
    const formattedMessage = formatLogEntry(entry);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  // CloudWatch logging
  if (options?.sendToCloudWatch !== false && config.sendToCloudWatch) {
    await sendToCloudWatch(entry);
  }
};

// Export convenience methods for each log level
export const logger = {
  debug: (message: string, options?: Omit<Parameters<typeof log>[2], 'level'>) => 
    log(LogLevel.DEBUG, message, options),
  
  info: (message: string, options?: Omit<Parameters<typeof log>[2], 'level'>) => 
    log(LogLevel.INFO, message, options),
  
  warn: (message: string, options?: Omit<Parameters<typeof log>[2], 'level'>) => 
    log(LogLevel.WARN, message, options),
  
  error: (message: string, options?: Omit<Parameters<typeof log>[2], 'level'>) => 
    log(LogLevel.ERROR, message, options),
  
  // Track API endpoint performance
  trackApiLatency: async (endpoint: string, latencyMs: number) => {
    await logMetric(
      CLOUDWATCH_NAMESPACE,
      CLOUDWATCH_METRICS.API_LATENCY,
      latencyMs,
      'Milliseconds',
      [
        { Name: 'Endpoint', Value: endpoint },
        { Name: 'Environment', Value: getNodeEnv() }
      ]
    );
    
    log(
      LogLevel.DEBUG, 
      `API Latency: ${endpoint} - ${latencyMs}ms`, 
      { context: 'API_PERFORMANCE' }
    );
  },
  
  // Track user actions for analytics
  trackUserAction: async (action: string, userId?: string, details?: any) => {
    try {
      if (config.sendToCloudWatch) {
    await logMetric(
      CLOUDWATCH_NAMESPACE,
      CLOUDWATCH_METRICS.USER_ACTIONS,
      1,
      'Count',
      [
        { Name: 'Action', Value: action },
        { Name: 'Environment', Value: getNodeEnv() }
      ]
    );
      }
    } catch (error) {
      // In development, silently ignore CloudWatch errors
      if (getNodeEnv() !== 'development') {
        console.error('[Logger] Failed to send metrics to CloudWatch:', error);
      }
    }
    
    log(
      LogLevel.INFO,
      `User Action: ${action}`,
      { 
        context: 'USER_ACTIVITY',
        userId,
        data: details,
        // Don't try to send to CloudWatch again
        sendToCloudWatch: false
      }
    );
  },
  
  // Configure logger options
  configure: (options: Partial<typeof config>) => {
    Object.assign(config, options);
  }
};

export default logger; 