import { DynamicTool } from '@langchain/core/tools';

/**
 * Tools for interacting with stock market data
 */

// Stock symbol lookup tool
const getStockInfo = new DynamicTool({
  name: 'get-stock-info',
  description: 'Get information about a specific stock by its symbol',
  func: async (symbol: string) => {
    try {
      // Note: In a production environment, you would integrate with a real stock API
      // This is a placeholder to simulate the functionality
      const mockStockData: Record<string, any> = {
        'AAPL': { 
          name: 'Apple Inc.', 
          price: '182.34', 
          change: '+2.4%',
          marketCap: '2.87T',
          peRatio: '28.5',
          dividendYield: '0.50%'
        },
        'TSLA': { 
          name: 'Tesla, Inc.', 
          price: '248.50', 
          change: '-1.2%',
          marketCap: '789.5B',
          peRatio: '71.3',
          dividendYield: '0%'
        },
        'MSFT': { 
          name: 'Microsoft Corporation', 
          price: '329.06', 
          change: '+0.8%',
          marketCap: '2.45T',
          peRatio: '33.8',
          dividendYield: '0.74%'
        },
        'AMZN': { 
          name: 'Amazon.com, Inc.', 
          price: '178.15', 
          change: '+1.5%',
          marketCap: '1.84T',
          peRatio: '61.4',
          dividendYield: '0%'
        },
        'GOOGL': { 
          name: 'Alphabet Inc.', 
          price: '147.68', 
          change: '+0.3%',
          marketCap: '1.86T',
          peRatio: '25.3',
          dividendYield: '0.50%'
        }
      };

      const stockSymbol = symbol.toUpperCase().trim();
      
      if (mockStockData[stockSymbol]) {
        return JSON.stringify(mockStockData[stockSymbol]);
      } else {
        return JSON.stringify({ error: `Stock with symbol ${stockSymbol} not found` });
      }
    } catch (error) {
      console.error('Error in getStockInfo tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve stock information' });
    }
  }
});

// Market sentiment analysis tool
const getMarketSentiment = new DynamicTool({
  name: 'get-market-sentiment',
  description: 'Get current market sentiment analysis based on recent news and trends',
  func: async () => {
    try {
      // This would integrate with a real sentiment analysis service in production
      const mockSentimentData = {
        overall: 'bullish',
        confidence: 0.72,
        sectors: {
          technology: { sentiment: 'very bullish', confidence: 0.84 },
          healthcare: { sentiment: 'neutral', confidence: 0.51 },
          finance: { sentiment: 'bearish', confidence: 0.68 },
          energy: { sentiment: 'bullish', confidence: 0.63 },
          consumerGoods: { sentiment: 'neutral', confidence: 0.55 }
        },
        analysis: 'Market sentiment is bullish for tech sector. Consider increasing positions in cloud computing and AI-related stocks.',
        lastUpdated: new Date().toISOString()
      };
      
      return JSON.stringify(mockSentimentData);
    } catch (error) {
      console.error('Error in getMarketSentiment tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve market sentiment data' });
    }
  }
});

// Export all market tools
export const stockExchangeTools = [
  getStockInfo,
  getMarketSentiment
];