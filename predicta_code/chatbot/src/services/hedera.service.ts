import { 
  Client, 
  TopicCreateTransaction, 
  TopicMessageSubmitTransaction, 
  TopicInfoQuery, 
  TopicMessageQuery, 
  AccountBalanceQuery, 
  TokenCreateTransaction, 
  TokenType, 
  TokenSupplyType,
  TopicMessage
} from "@hashgraph/sdk";
import { HEDERA_ACCOUNT_ID, HEDERA_NETWORK, HEDERA_PRIVATE_KEY,
         HEDERA_MARKET_DATA_TOPIC_ID, HEDERA_PREDICTION_TOPIC_ID,
         PREDICTA_TOKEN_ID } from '../config.js';

/**
 * Service class for handling Hedera network interactions 
 */
export class HederaService {
  private client: Client;
  private topicIds: {
    marketData: string;
    prediction: string;
  };
  
  /**
   * Initialize the Hedera service with account credentials
   */
  constructor() {
    // Set up client based on network
    if (HEDERA_NETWORK === 'testnet') {
      this.client = Client.forTestnet();
    } else if (HEDERA_NETWORK === 'mainnet') {
      this.client = Client.forMainnet();
    } else {
      this.client = Client.forPreviewnet();
    }
    
    // Configure operator
    this.client.setOperator(HEDERA_ACCOUNT_ID, HEDERA_PRIVATE_KEY);
    
    // Store topic IDs
    this.topicIds = {
      marketData: HEDERA_MARKET_DATA_TOPIC_ID,
      prediction: HEDERA_PREDICTION_TOPIC_ID
    };
  }

  /**
   * Get the Hedera client instance
   */
  getClient(): Client {
    return this.client;
  }

  /**
   * Ensure a topic exists - creates one if needed
   * @param topicType Type of topic (marketData or prediction)
   * @param memo Optional memo for the topic
   */
  async ensureTopicExists(topicType: 'marketData' | 'prediction', memo: string): Promise<string> {
    if (this.topicIds[topicType] !== '') {
      return this.topicIds[topicType];
    }
    
    // Create a new topic
    const topicId = await this.createTopic(memo);
    this.topicIds[topicType] = topicId;
    
    console.log(`Created new ${topicType} topic with ID: ${topicId}`);
    return topicId;
  }

  /**
   * Create a new topic on the Hedera network
   * @param memo Optional memo for the topic
   */
  async createTopic(memo: string = 'Predicta Topic'): Promise<string> {
    try {
      // Create the transaction
      const transaction = new TopicCreateTransaction()
        .setTopicMemo(memo)
        .setSubmitKey(this.client.operatorPublicKey);
      
      // Sign and execute the transaction
      const txResponse = await transaction.execute(this.client);
      
      // Request the receipt of the transaction
      const receipt = await txResponse.getReceipt(this.client);
      
      // Get the topic ID
      const newTopicId = receipt.topicId?.toString() || '';
      
      return newTopicId;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }

  /**
   * Post market data to Hedera Consensus Service
   * @param data Market data to be posted
   */
  async postMarketData(data: any): Promise<string> {
    try {
      // Ensure market data topic exists
      const topicId = await this.ensureTopicExists('marketData', 'Predicta Market Data');
      
      // Convert data to string
      const messageData = JSON.stringify(data);
      
      // Create the transaction
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(messageData);
      
      // Sign and execute the transaction
      const txResponse = await transaction.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      // Return the transaction ID as a string
      return txResponse.transactionId.toString();
    } catch (error) {
      console.error('Error posting market data to Hedera:', error);
      throw error;
    }
  }

  /**
   * Post prediction data to Hedera Consensus Service
   * @param prediction Prediction data to be posted
   */
  async postPrediction(prediction: any): Promise<string> {
    try {
      // Ensure prediction topic exists
      const topicId = await this.ensureTopicExists('prediction', 'Predicta Predictions');
      
      // Convert data to string
      const messageData = JSON.stringify(prediction);
      
      // Create the transaction
      const transaction = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(messageData);
      
      // Sign and execute the transaction
      const txResponse = await transaction.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      // Return the transaction ID as a string
      return txResponse.transactionId.toString();
    } catch (error) {
      console.error('Error posting prediction to Hedera:', error);
      throw error;
    }
  }

  /**
   * Get the latest market data from Hedera Consensus Service
   */
  async getMarketData(limit: number = 10): Promise<any[]> {
    try {
      // Ensure market data topic exists
      const topicId = await this.ensureTopicExists('marketData', 'Predicta Market Data');
      
      // Create the query
      const query = new TopicMessageQuery()
        .setTopicId(topicId)
        .setLimit(limit);
      
      // Execute the query
      const messages = await query.execute(this.client);
      
      // Parse the messages
      return messages.map((message: TopicMessage) => {
        try {
          return JSON.parse(Buffer.from(message.contents).toString());
        } catch (e) {
          return { raw: Buffer.from(message.contents).toString() };
        }
      });
    } catch (error) {
      console.error('Error getting market data from Hedera:', error);
      throw error;
    }
  }

  /**
   * Get the latest predictions from Hedera Consensus Service
   */
  async getPredictions(limit: number = 10): Promise<any[]> {
    try {
      // Ensure prediction topic exists
      const topicId = await this.ensureTopicExists('prediction', 'Predicta Predictions');
      
      // Create the query
      const query = new TopicMessageQuery()
        .setTopicId(topicId)
        .setLimit(limit);
      
      // Execute the query
      const messages = await query.execute(this.client);
      
      // Parse the messages
      return messages.map((message: TopicMessage) => {
        try {
          return JSON.parse(Buffer.from(message.contents).toString());
        } catch (e) {
          return { raw: Buffer.from(message.contents).toString() };
        }
      });
    } catch (error) {
      console.error('Error getting predictions from Hedera:', error);
      throw error;
    }
  }

  /**
   * Get HBAR balance for an account
   * @param accountId Optional account ID (defaults to service account)
   */
  async getAccountBalance(accountId: string = HEDERA_ACCOUNT_ID): Promise<string> {
    try {
      // Create the query
      const query = new AccountBalanceQuery()
        .setAccountId(accountId);
      
      // Execute the query
      const balance = await query.execute(this.client);
      
      // Return the balance as a string
      return balance.hbars.toString();
    } catch (error) {
      console.error('Error getting account balance:', error);
      throw error;
    }
  }

  /**
   * Create a fungible token for the Predicta platform
   * @param name Token name
   * @param symbol Token symbol
   * @param decimals Number of decimal places
   * @param initialSupply Initial token supply
   */
  async createToken(
    name: string,
    symbol: string,
    decimals: number = 2,
    initialSupply: number = 1000000
  ): Promise<string> {
    try {
      // Create the transaction
      const transaction = new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setDecimals(decimals)
        .setInitialSupply(initialSupply)
        .setTokenType(TokenType.FungibleCommon)
        .setSupplyType(TokenSupplyType.Infinite)
        .setTreasuryAccountId(HEDERA_ACCOUNT_ID);
      
      // Sign and execute the transaction
      const txResponse = await transaction.execute(this.client);
      
      // Get the receipt
      const receipt = await txResponse.getReceipt(this.client);
      
      // Get the token ID
      const tokenId = receipt.tokenId?.toString() || '';
      
      return tokenId;
    } catch (error) {
      console.error('Error creating token:', error);
      throw error;
    }
  }

  /**
   * Get the balance of Predicta tokens for an account
   * @param accountId Account ID to check which defaults to service account
   */
  async getTokenBalance(accountId: string = HEDERA_ACCOUNT_ID): Promise<string> {
    try {
      if (!PREDICTA_TOKEN_ID) {
        throw new Error('PREDICTA_TOKEN_ID not configured');
      }
      
      // This is a placeholder - the actual implementation depends on the Hedera SDK version
      // For now, we'll return a mock value
      return "0";
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }
} 