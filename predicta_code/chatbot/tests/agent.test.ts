// @ts-check
import { describe, expect, it, jest } from '@jest/globals';

// Mock environment variables before importing modules
process.env.OPENAI_API_KEY = 'mock-api-key';
process.env.HEDERA_NETWORK = 'testnet';
process.env.HEDERA_ACCOUNT_ID = '0.0.12345';
process.env.HEDERA_PRIVATE_KEY = 'mock-private-key';

// Mock Hedera SDK
jest.mock('@hashgraph/sdk', () => {
  const mockClient = {
    setOperator: jest.fn(),
    operatorPublicKey: 'mock-public-key'
  };
  
  return {
    Client: {
      forTestnet: jest.fn().mockReturnValue(mockClient),
      forMainnet: jest.fn().mockReturnValue(mockClient),
      forPreviewnet: jest.fn().mockReturnValue(mockClient)
    },
    TopicCreateTransaction: jest.fn().mockImplementation(() => {
      return {
        setTopicMemo: jest.fn().mockReturnThis(),
        setSubmitKey: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          getReceipt: jest.fn().mockResolvedValue({
            topicId: { toString: jest.fn().mockReturnValue('0.0.12345') }
          })
        })
      };
    }),
    TopicMessageSubmitTransaction: jest.fn().mockImplementation(() => {
      return {
        setTopicId: jest.fn().mockReturnThis(),
        setMessage: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          transactionId: { toString: jest.fn().mockReturnValue('mock-tx-id') },
          getReceipt: jest.fn().mockResolvedValue({})
        })
      };
    }),
    TopicMessageQuery: jest.fn().mockImplementation(() => {
      return {
        setTopicId: jest.fn().mockReturnThis(),
        setLimit: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue([
          { contents: Buffer.from('{"data":"test data"}') }
        ])
      };
    }),
    AccountBalanceQuery: jest.fn().mockImplementation(() => {
      return {
        setAccountId: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          hbars: { toString: jest.fn().mockReturnValue('100 HBAR') }
        })
      };
    }),
    TokenCreateTransaction: jest.fn().mockImplementation(() => {
      return {
        setTokenName: jest.fn().mockReturnThis(),
        setTokenSymbol: jest.fn().mockReturnThis(),
        setDecimals: jest.fn().mockReturnThis(),
        setInitialSupply: jest.fn().mockReturnThis(),
        setTokenType: jest.fn().mockReturnThis(),
        setSupplyType: jest.fn().mockReturnThis(),
        setTreasuryAccountId: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          getReceipt: jest.fn().mockResolvedValue({
            tokenId: { toString: jest.fn().mockReturnValue('0.0.12345') }
          })
        })
      };
    }),
    TokenType: {
      FungibleCommon: 'FungibleCommon'
    },
    TokenSupplyType: {
      Infinite: 'Infinite'
    }
  };
});

// Mock OpenAI module
jest.mock('@langchain/openai', () => {
  return {
    ChatOpenAI: jest.fn().mockImplementation(() => {
      return {
        invoke: jest.fn().mockResolvedValue({
          content: 'This is a mock response from the AI model'
        })
      };
    })
  };
});

// Import services after mocking
import { HederaService } from '../src/services/hedera.service.js';
import { AgentService } from '../src/services/agent.service.js';

describe('HederaService', () => {
  it('should initialize with Hedera SDK', async () => {
    const service = new HederaService();
    expect(service).toBeDefined();
    expect(service.getClient).toBeDefined();
  });

  it('should create a topic if one does not exist', async () => {
    const service = new HederaService();
    const topicId = await service.createTopic('Test Topic');
    expect(topicId).toBe('0.0.12345');
  });

  it('should post market data to HCS', async () => {
    const service = new HederaService();
    const result = await service.postMarketData({ symbol: 'AAPL', price: 182.34 });
    expect(result).toBe('mock-tx-id');
  });

  it('should get market data from HCS', async () => {
    const service = new HederaService();
    const result = await service.getMarketData();
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('data');
  });
});

describe('AgentService', () => {
  it('should initialize with OpenAI model and tools', () => {
    const service = new AgentService();
    expect(service).toBeDefined();
  });

  it('should handle a query about Hedera', async () => {
    const service = new AgentService();
    const response = await service.handleQuery('Tell me about Hedera Token Service');
    expect(response).toBe('This is a mock response from the AI model');
  });

  it('should handle a query about stocks', async () => {
    const service = new AgentService();
    const response = await service.handleQuery('What is the current price of AAPL stock?');
    expect(response).toBe('This is a mock response from the AI model');
  });

  it('should handle a query about Predicta', async () => {
    const service = new AgentService();
    const response = await service.handleQuery('What is Predicta platform?');
    expect(response).toBe('This is a mock response from the AI model');
  });
}); 