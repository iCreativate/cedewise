import { 
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command 
} from '@aws-sdk/client-s3';
import { 
  LexRuntimeV2Client, 
  RecognizeTextCommand,
  RecognizeUtteranceCommand
} from '@aws-sdk/client-lex-runtime-v2';
import { 
  CloudWatchClient,
  PutMetricDataCommand,
  StandardUnit
} from '@aws-sdk/client-cloudwatch';
import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs';
import {
  TranslateClient,
  TranslateTextCommand
} from '@aws-sdk/client-translate';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Reinsurer, reinsurers } from '@/app/utils/reinsurers';
import { logger } from './logger';

// AWS region management for multi-region deployment
const PRIMARY_REGION = process.env.AWS_PRIMARY_REGION || 'us-east-1';
const SECONDARY_REGION = process.env.AWS_SECONDARY_REGION || 'eu-west-1';
const CURRENT_REGION = process.env.AWS_CURRENT_REGION || PRIMARY_REGION;

// Determine which region to use based on user location or configuration
export const getRegion = () => {
  // This could be enhanced with logic to determine closest region
  return CURRENT_REGION;
};

// S3 Client for document storage
export const s3Client = new S3Client({ 
  region: getRegion(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

// Lex Client for chatbot functionality
export const lexClient = new LexRuntimeV2Client({ 
  region: getRegion(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

// CloudWatch Client for monitoring
export const cloudWatchClient = new CloudWatchClient({ 
  region: getRegion(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

// SQS Client for message queuing
export const sqsClient = new SQSClient({ 
  region: getRegion(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

// Translate Client for multi-language support
export const translateClient = new TranslateClient({ 
  region: getRegion(),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

// In-memory response cache
const messageCache: Record<string, any> = {};

// Check if running in development mode
const isDev = process.env.NODE_ENV === 'development';

// Create a mock response for development mode
const createMockResponse = (userInput: string) => {
  const mockResponses: Record<string, string> = {
    'hello': 'Hello! How can I help with your reinsurance needs today?',
    'hi': 'Hi there! What can I assist you with regarding your facultative submission?',
    'help': 'I can help with information about proportional, non-proportional, and auto facultative reinsurance. What would you like to know?',
    'what is facultative': 'Facultative reinsurance is case-by-case coverage for individual risks. Unlike treaty reinsurance which covers entire portfolios, facultative allows you to reinsure specific risks.',
    'difference between proportional and non-proportional': 'In proportional reinsurance, losses are shared according to a fixed percentage. In non-proportional, the reinsurer pays losses exceeding a specified retention amount.',
    'auto-fac': 'Auto facultative (Auto-Fac) is an automatic facultative arrangement where risks meeting pre-defined criteria are automatically ceded without individual underwriting.',
  };
  
  // Default response
  let response = 'I understand. How else can I assist with your reinsurance needs?';
  
  // Check for matching phrases
  const lowercaseInput = userInput.toLowerCase();
  for (const [key, value] of Object.entries(mockResponses)) {
    if (lowercaseInput.includes(key)) {
      response = value;
      break;
    }
  }
  
  return {
    messages: [
      {
        content: response,
        contentType: 'PlainText'
      }
    ],
    sessionState: {
      intent: {
        name: 'MockIntent',
        state: 'Fulfilled'
      }
    }
  };
};

/**
 * Send a message to Amazon Lex and get a response
 * Optimized with caching and better error handling
 */
export const sendMessageToLex = async (
  botId: string,
  botAliasId: string,
  localeId: string,
  message: string
) => {
  // Generate a cache key
  const cacheKey = `${botId}:${botAliasId}:${message}`;
  
  // Return cached response if available
  if (messageCache[cacheKey]) {
    logger.debug('Using cached Lex response', { cacheKey });
    return messageCache[cacheKey];
  }
  
  // In development mode with placeholder IDs, return mock responses
  if (isDev && (botId === 'TSTALIASID' || botAliasId === 'TSTAUTHID')) {
    logger.debug('Using mock Lex response in development mode');
    const mockResponse = createMockResponse(message);
    // Cache the mock response
    messageCache[cacheKey] = mockResponse;
    return mockResponse;
  }
  
  try {
    // Check AWS credentials before making the API call
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      logger.warn('Missing AWS credentials for Lex', { 
        hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
      });
      
      if (isDev) {
        // In development, return a friendly message about missing credentials
        const errorResponse = {
          messages: [
            {
              content: "I'm in development mode and AWS credentials are missing. Please check your environment variables.",
              contentType: 'PlainText'
            }
          ],
          sessionState: {
            intent: {
              name: 'ErrorIntent',
              state: 'Failed'
            }
          }
        };
        return errorResponse;
      }
      
      throw new Error('AWS credentials not configured');
    }
    
    // Set up the Lex client
    const client = new LexRuntimeV2Client({
      region: process.env.AWS_PRIMARY_REGION || 'us-east-1',
    });
    
    // Generate a unique session ID for this conversation
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Set up the Lex command
    const input = {
      botId,
      botAliasId,
      localeId,
      sessionId,
      text: message,
    };
    
    const command = new RecognizeTextCommand(input);
    
    // Send the command to Lex
    const response = await client.send(command);
    
    // Cache the response for future use
    messageCache[cacheKey] = response;
    
    // Limit cache size to prevent memory leaks (keep last 100 messages)
    const cacheKeys = Object.keys(messageCache);
    if (cacheKeys.length > 100) {
      delete messageCache[cacheKeys[0]];
    }
    
    return response;
  } catch (error) {
    logger.error('Error sending message to Lex', { error, botId, message });
    
    // Return a friendly error message
    if (isDev) {
      return {
        messages: [
          {
            content: "I'm running in development mode. There was an error connecting to AWS Lex. Check your credentials and configuration.",
            contentType: 'PlainText'
          }
        ],
        sessionState: {
          intent: {
            name: 'ErrorIntent',
            state: 'Failed'
          }
        }
      };
    }
    
    // In production, throw the error to be handled by the component
    throw error;
  }
};

// S3 helper functions
export const uploadFileToS3 = async (
  bucketName: string,
  key: string,
  file: Buffer,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType
  });

  try {
    const response = await s3Client.send(command);
    return {
      success: true,
      url: `https://${bucketName}.s3.${getRegion()}.amazonaws.com/${key}`,
      data: response
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return {
      success: false,
      error
    };
  }
};

export const getFileFromS3 = async (bucketName: string, key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  try {
    const response = await s3Client.send(command);
    return {
      success: true,
      data: response.Body,
      metadata: response.Metadata
    };
  } catch (error) {
    console.error('Error getting file from S3:', error);
    return {
      success: false,
      error
    };
  }
};

export const getSignedS3Url = async (bucketName: string, key: string, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return {
      success: true,
      url: signedUrl
    };
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return {
      success: false,
      error
    };
  }
};

// CloudWatch metrics helper
export const logMetric = async (
  namespace: string,
  metricName: string,
  value: number,
  unit: StandardUnit,
  dimensions: Array<{ Name: string; Value: string }> = []
): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const client = new CloudWatchClient({ 
        region: getRegion(),
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
      });
      
  const command = new PutMetricDataCommand({
    Namespace: namespace,
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Dimensions: dimensions,
        Timestamp: new Date()
      }
    ]
  });

      await client.send(command);
    } else {
      // Skip CloudWatch in non-production environments
      console.debug(
        `[CloudWatch Mock] Metric logged - ${namespace}:${metricName} = ${value} ${unit}`,
        dimensions
      );
    }
  } catch (error) {
    // Safely handle errors - don't crash the application
    if (process.env.NODE_ENV === 'production') {
      console.error('[CloudWatch] Error logging metric:', error);
    } else {
      console.debug('[CloudWatch] Skipped in development due to error:', error);
    }
  }
};

// SQS helper functions
export const sendMessageToQueue = async (queueUrl: string, messageBody: string, messageAttributes: any = {}) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: messageBody,
    MessageAttributes: messageAttributes
  });

  try {
    const response = await sqsClient.send(command);
    return {
      success: true,
      messageId: response.MessageId
    };
  } catch (error) {
    console.error('Error sending message to SQS queue:', error);
    return {
      success: false,
      error
    };
  }
};

export const receiveMessagesFromQueue = async (queueUrl: string, maxMessages = 10, waitTimeSeconds = 20) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    MaxNumberOfMessages: maxMessages,
    WaitTimeSeconds: waitTimeSeconds,
    MessageAttributeNames: ['All']
  });

  try {
    const response = await sqsClient.send(command);
    return {
      success: true,
      messages: response.Messages || []
    };
  } catch (error) {
    console.error('Error receiving messages from SQS queue:', error);
    return {
      success: false,
      error
    };
  }
};

export const deleteMessageFromQueue = async (queueUrl: string, receiptHandle: string) => {
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle
  });

  try {
    await sqsClient.send(command);
    return { success: true };
  } catch (error) {
    console.error('Error deleting message from SQS queue:', error);
    return {
      success: false,
      error
    };
  }
};

// Translate helper function
export const translateText = async (text: string, sourceLanguage: string, targetLanguage: string) => {
  const command = new TranslateTextCommand({
    Text: text,
    SourceLanguageCode: sourceLanguage,
    TargetLanguageCode: targetLanguage
  });

  try {
    const response = await translateClient.send(command);
    return {
      success: true,
      translatedText: response.TranslatedText
    };
  } catch (error) {
    console.error('Error translating text:', error);
    return {
      success: false,
      error
    };
  }
}; 