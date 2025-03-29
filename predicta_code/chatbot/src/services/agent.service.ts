import { Tool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { OPENAI_API_KEY, AI_MODEL } from '../config.js';
import { HederaService } from './hedera.service.js';

// Custom market tools for the AI agent
import { stockExchangeTools } from './tools/market.tools.js';
import { predictaTools } from './tools/predicta.tools.js';
import { hederaInfoTools } from './tools/hederaInfo.tools.js';
import { createHederaTools } from './tools/hedera.tools.js';

/**
 * Service class for managing the AI agent
 */
export class AgentService {
  private model: ChatOpenAI;
  private hederaService: HederaService;
  private hederaTools: Tool[];
  private allTools: Tool[];
  
  /**
   * Initialize the agent service with necessary models and tools
   */
  constructor() {
    // Initialize the language model
    this.model = new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: AI_MODEL,
      temperature: 0.2
    });
    
    // Initialize Hedera service
    this.hederaService = new HederaService();
    
    // Create custom Hedera tools using our service
    this.hederaTools = createHederaTools(this.hederaService);
    
    // Combine all tools for the agent
    this.allTools = [
      ...this.hederaTools,
      ...stockExchangeTools,
      ...predictaTools,
      ...hederaInfoTools
    ];
  }
  
  /**
   * Handle a user query by routing to the appropriate agent
   * @param query User's query text
   * @returns The agent's response
   */
  async handleQuery(query: string): Promise<string> {
    try {
      // Analyze the query to determine its category
      const category = await this.categorizeQuery(query);
      
      // Process the query based on its category
      let response: string;
      
      switch (category) {
        case 'hedera':
          response = await this.processHederaQuery(query);
          break;
        case 'stock_market':
          response = await this.processStockMarketQuery(query);
          break;
        case 'predicta':
          response = await this.processPredictaQuery(query);
          break;
        case 'general':
        default:
          response = await this.processGeneralQuery(query);
      }
      
      return response;
    } catch (error) {
      console.error('Error handling query:', error);
      return 'I encountered an error while processing your request. Please try again later.';
    }
  }
  
  /**
   * Categorize the user query to determine which agent should handle it
   * @param query User's query text
   * @returns Category of the query (hedera, stock_market, predicta, or general)
   */
  private async categorizeQuery(query: string): Promise<string> {
    // Simple keyword-based categorization
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('hedera') || 
        queryLower.includes('hbar') || 
        queryLower.includes('token') || 
        queryLower.includes('consensus')) {
      return 'hedera';
    }
    
    if (queryLower.includes('stock') || 
        queryLower.includes('market') || 
        queryLower.includes('trade') || 
        queryLower.includes('investment')) {
      return 'stock_market';
    }
    
    if (queryLower.includes('predicta') || 
        queryLower.includes('platform') || 
        queryLower.includes('predict')) {
      return 'predicta';
    }
    
    return 'general';
  }
  
  /**
   * Process queries related to Hedera
   * @param query User's query text
   */
  private async processHederaQuery(query: string): Promise<string> {
    try {
      // Use only Hedera-related tools
      const response = await this.model.invoke(query, {
        tools: [...this.hederaTools, ...hederaInfoTools]
      });
      
      return response.content.toString();
    } catch (error) {
      console.error('Error processing Hedera query:', error);
      throw error;
    }
  }
  
  /**
   * Process queries related to stock market
   * @param query User's query text
   */
  private async processStockMarketQuery(query: string): Promise<string> {
    try {
      // Use stock market tools
      const response = await this.model.invoke(query, {
        tools: stockExchangeTools
      });
      
      return response.content.toString();
    } catch (error) {
      console.error('Error processing stock market query:', error);
      throw error;
    }
  }
  
  /**
   * Process queries related to Predicta platform
   * @param query User's query text
   */
  private async processPredictaQuery(query: string): Promise<string> {
    try {
      // Use Predicta platform tools
      const response = await this.model.invoke(query, {
        tools: predictaTools
      });
      
      return response.content.toString();
    } catch (error) {
      console.error('Error processing Predicta query:', error);
      throw error;
    }
  }
  
  /**
   * Process general queries
   * @param query User's query text
   */
  private async processGeneralQuery(query: string): Promise<string> {
    try {
      // Use all available tools
      const response = await this.model.invoke(query, {
        tools: this.allTools
      });
      
      return response.content.toString();
    } catch (error) {
      console.error('Error processing general query:', error);
      throw error;
    }
  }
} 