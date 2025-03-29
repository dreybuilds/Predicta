import { DynamicTool } from '@langchain/core/tools';
import { HederaService } from '../hedera.service.js';

/**
 * Create custom tools for interacting with the Hedera network
 */
export function createHederaTools(hederaService: HederaService) {
  // Create a new topic
  const createTopic = new DynamicTool({
    name: 'create-topic',
    description: 'Create a new topic on the Hedera network for storing data',
    func: async (memo: string) => {
      try {
        const topicId = await hederaService.createTopic(memo);
        return JSON.stringify({ topicId });
      } catch (error) {
        console.error('Error in create-topic tool:', error);
        return JSON.stringify({ error: 'Failed to create topic' });
      }
    }
  });

  // Submit a message to a topic
  const submitMessage = new DynamicTool({
    name: 'submit-topic-message',
    description: 'Submit a message to a topic on the Hedera network',
    func: async (input: string) => {
      try {
        // Parse input - expecting JSON with topicType and message
        const { topicType, message } = JSON.parse(input);
        
        if (topicType === 'market') {
          const txId = await hederaService.postMarketData(message);
          return JSON.stringify({ transactionId: txId });
        } else if (topicType === 'prediction') {
          const txId = await hederaService.postPrediction(message);
          return JSON.stringify({ transactionId: txId });
        } else {
          return JSON.stringify({ error: 'Invalid topic type. Use "market" or "prediction".' });
        }
      } catch (error) {
        console.error('Error in submit-topic-message tool:', error);
        return JSON.stringify({ error: 'Failed to submit message to topic' });
      }
    }
  });

  // Get messages from a topic
  const getMessages = new DynamicTool({
    name: 'get-topic-messages',
    description: 'Get messages from a topic on the Hedera network',
    func: async (input: string) => {
      try {
        // Parse input - expecting JSON with topicType and limit
        const { topicType, limit = 10 } = JSON.parse(input);
        
        if (topicType === 'market') {
          const messages = await hederaService.getMarketData(limit);
          return JSON.stringify(messages);
        } else if (topicType === 'prediction') {
          const messages = await hederaService.getPredictions(limit);
          return JSON.stringify(messages);
        } else {
          return JSON.stringify({ error: 'Invalid topic type. Use "market" or "prediction".' });
        }
      } catch (error) {
        console.error('Error in get-topic-messages tool:', error);
        return JSON.stringify({ error: 'Failed to get messages from topic' });
      }
    }
  });

  // Get account balance
  const getBalance = new DynamicTool({
    name: 'get-account-balance',
    description: 'Get the HBAR balance of an account',
    func: async (accountId: string) => {
      try {
        const balance = await hederaService.getAccountBalance(accountId || undefined);
        return JSON.stringify({ balance });
      } catch (error) {
        console.error('Error in get-account-balance tool:', error);
        return JSON.stringify({ error: 'Failed to get account balance' });
      }
    }
  });

  // Create a token
  const createToken = new DynamicTool({
    name: 'create-token',
    description: 'Create a new fungible token on the Hedera network',
    func: async (input: string) => {
      try {
        // Parse input - expecting JSON with token details
        const { name, symbol, decimals, initialSupply } = JSON.parse(input);
        
        const tokenId = await hederaService.createToken(
          name,
          symbol,
          decimals || 2,
          initialSupply || 1000000
        );
        
        return JSON.stringify({ tokenId });
      } catch (error) {
        console.error('Error in create-token tool:', error);
        return JSON.stringify({ error: 'Failed to create token' });
      }
    }
  });

  // Return array of tools
  return [
    createTopic,
    submitMessage,
    getMessages,
    getBalance,
    createToken
  ];
} 