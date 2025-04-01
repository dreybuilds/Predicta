import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Server configuration
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
export const HOST = process.env.HOST || '127.0.0.1';

// Hedera configuration
export const HEDERA_NETWORK = (process.env.HEDERA_NETWORK || 'testnet') as 'testnet' | 'mainnet' | 'previewnet';
export const HEDERA_ACCOUNT_ID = process.env.HEDERA_ACCOUNT_ID || '';
export const HEDERA_PRIVATE_KEY = process.env.HEDERA_PRIVATE_KEY || '';

// Topic IDs for Hedera Consensus Service
// These will be created by the app if not provided
export const HEDERA_MARKET_DATA_TOPIC_ID = process.env.HEDERA_MARKET_DATA_TOPIC_ID || '';
export const HEDERA_PREDICTION_TOPIC_ID = process.env.HEDERA_PREDICTION_TOPIC_ID || '';

// Token IDs for Hedera Token Service
export const PREDICTA_TOKEN_ID = process.env.PREDICTA_TOKEN_ID || '';

// OpenAI API configuration
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const AI_MODEL = process.env.AI_MODEL || 'gpt-4';

// Validate required environment variables
export function validateConfig() {
  const requiredVars = [
    { name: 'HEDERA_ACCOUNT_ID', value: HEDERA_ACCOUNT_ID },
    { name: 'HEDERA_PRIVATE_KEY', value: HEDERA_PRIVATE_KEY },
    { name: 'OPENAI_API_KEY', value: OPENAI_API_KEY }
  ];

  const missingVars = requiredVars.filter(v => !v.value);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.map(v => v.name).join(', ')}`);
  }
} 