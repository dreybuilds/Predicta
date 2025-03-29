import { DynamicTool } from '@langchain/core/tools';
import { HederaService } from '../hedera.service.js';

/**
 * Tools specifically for Predicta platform interactions
 */

const hederaService = new HederaService();

// Get AI predictions for specific stocks
const getStockPrediction = new DynamicTool({
  name: 'get-stock-prediction',
  description: 'Get AI-generated prediction for a specific stock by its symbol',
  func: async (symbol: string) => {
    try {
      // In production, this would pull data from a prediction model or Hedera messages
      // For now, using mock data
      const mockPredictions: Record<string, any> = {
        'AAPL': { 
          symbol: 'AAPL',
          currentPrice: '182.34',
          predictedPrice: '195.20',
          timeFrame: '3 months',
          confidence: 0.78,
          direction: 'up',
          reasoning: 'Strong product lineup, services growth, and favorable market conditions',
          lastUpdated: new Date().toISOString()
        },
        'TSLA': { 
          symbol: 'TSLA',
          currentPrice: '248.50',
          predictedPrice: '230.15',
          timeFrame: '3 months',
          confidence: 0.65,
          direction: 'down',
          reasoning: 'Increasing competition, margin pressure, and market saturation concerns',
          lastUpdated: new Date().toISOString()
        },
        'MSFT': { 
          symbol: 'MSFT',
          currentPrice: '329.06',
          predictedPrice: '355.80',
          timeFrame: '3 months',
          confidence: 0.82,
          direction: 'up',
          reasoning: 'Cloud growth, AI integration, and strong enterprise demand',
          lastUpdated: new Date().toISOString()
        }
      };

      const stockSymbol = symbol.toUpperCase().trim();
      
      if (mockPredictions[stockSymbol]) {
        // For real implementation, we would store this prediction on Hedera
        try {
          // Only post to Hedera if we have a valid topic ID
          await hederaService.postPrediction({
            ...mockPredictions[stockSymbol],
            timestamp: new Date().toISOString()
          });
          console.log(`Posted prediction for ${stockSymbol} to Hedera`);
        } catch (e) {
          console.warn('Could not post prediction to Hedera:', e);
        }
        
        return JSON.stringify(mockPredictions[stockSymbol]);
      } else {
        return JSON.stringify({ error: `Prediction for symbol ${stockSymbol} not available` });
      }
    } catch (error) {
      console.error('Error in getStockPrediction tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve stock prediction' });
    }
  }
});

// Get Predicta platform information
const getPredictaInfo = new DynamicTool({
  name: 'get-predicta-info',
  description: 'Get information about the Predicta platform and its features',
  func: async () => {
    try {
      const platformInfo = {
        name: 'Predicta',
        description: 'AI-powered stock market prediction platform using Hedera blockchain for secure, transparent predictions',
        features: [
          'AI Analysis of market news and trends in real-time',
          'Market insights with detailed sentiment analysis and trading recommendations',
          'Fast settlement through Hedera blockchain',
          'Secure and transparent prediction storage',
          'Token-based economy for incentivizing accurate predictions'
        ],
        blockchain: {
          name: 'Hedera',
          features: [
            'High throughput and low fees',
            'Carbon-negative footprint',
            'Enterprise-grade security',
            'Governance by leading organizations'
          ]
        },
        website: 'https://predicta.onrender.com',
        launched: '2024'
      };
      
      return JSON.stringify(platformInfo);
    } catch (error) {
      console.error('Error in getPredictaInfo tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve Predicta information' });
    }
  }
});

// Retrieve the latest market insights
const getLatestInsights = new DynamicTool({
  name: 'get-latest-insights',
  description: 'Get the latest market insights from the Predicta platform',
  func: async () => {
    try {
      // Try to get insights from Hedera
      try {
        const insights = await hederaService.getMarketData(5);
        if (insights && insights.length > 0) {
          return JSON.stringify(insights);
        }
      } catch (e) {
        console.warn('Could not retrieve insights from Hedera:', e);
      }
      
      // Fall back to mock data if no insights are available from Hedera
      const mockInsights = [
        {
          id: 'insight-001',
          title: 'Tech Sector Outlook Positive',
          summary: 'The technology sector is showing strong growth potential due to AI advancements and cloud computing demand.',
          stocks: ['MSFT', 'GOOGL', 'AMZN'],
          sentiment: 'bullish',
          confidence: 0.81,
          timestamp: '2024-03-28T12:34:56Z'
        },
        {
          id: 'insight-002',
          title: 'Healthcare Facing Regulatory Hurdles',
          summary: 'Increased regulatory scrutiny may impact healthcare stocks in the short term.',
          stocks: ['JNJ', 'PFE', 'MRK'],
          sentiment: 'bearish',
          confidence: 0.67,
          timestamp: '2024-03-27T15:22:10Z'
        },
        {
          id: 'insight-003',
          title: 'Renewable Energy Investments Surging',
          summary: 'Renewable energy companies seeing increased investment due to favorable policy changes.',
          stocks: ['ENPH', 'SEDG', 'NEE'],
          sentiment: 'very bullish',
          confidence: 0.85,
          timestamp: '2024-03-26T09:15:33Z'
        }
      ];
      
      // Store mock insights to Hedera for future retrieval
      try {
        for (const insight of mockInsights) {
          await hederaService.postMarketData(insight);
        }
        console.log('Posted mock insights to Hedera');
      } catch (e) {
        console.warn('Could not post mock insights to Hedera:', e);
      }
      
      return JSON.stringify(mockInsights);
    } catch (error) {
      console.error('Error in getLatestInsights tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve latest insights' });
    }
  }
});

// Export all Predicta tools
export const predictaTools = [
  getStockPrediction,
  getPredictaInfo,
  getLatestInsights
]; 