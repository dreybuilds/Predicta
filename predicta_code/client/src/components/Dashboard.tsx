'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  Loader2,
  TrendingUp,
  DollarSign,
  Globe,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';

interface Prediction {
  symbol: string;
  name: string;
  currentPrice: number;
  currentPriceFormatted: string;
  prediction: {
    prediction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    confidence: number;
    target_price: number;
    target_price_formatted: string;
    analysis: string;
  };
  sector: string;
  volume: number;
  marketCap: number;
  marketCapFormatted: string;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedStocks?: string[];
}

export default function Dashboard() {
  const { authenticated, user } = usePrivy();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('KES');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch predictions and news in parallel
        const [predictionsResponse, newsResponse] = await Promise.all([
          axios.get(`/api/v1/top-predictions?currency=${selectedCurrency}`),
          axios.get('/api/v1/news?exchange=NSE&country=ke')
        ]);

        // Process predictions
        const processedPredictions = predictionsResponse.data.map((pred: Prediction) => ({
          ...pred,
          prediction: {
            ...pred.prediction,
            // Ensure prediction is one of the valid values
            prediction: ['BULLISH', 'BEARISH', 'NEUTRAL'].includes(pred.prediction.prediction)
              ? pred.prediction.prediction
              : 'NEUTRAL'
          }
        }));

        // Process news and extract stock symbols
        const processedNews = newsResponse.data.map((item: any) => {
          // Extract stock symbols from title and description
          const stockSymbols = extractStockSymbols(item.title + ' ' + item.description);
          return {
            title: item.title,
            description: item.description,
            url: item.url,
            source: item.source.name,
            sentiment: analyzeSentiment(item.title + ' ' + item.description),
            relatedStocks: stockSymbols
          };
        });

        setPredictions(processedPredictions);
        setNews(processedNews);
        setRetryCount(0); // Reset retry count on success
      } catch (err) {
        console.error('Error fetching data:', err);
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.detail || err.message;
          setError(`Failed to fetch data: ${errorMessage}`);
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
        
        // Implement retry logic
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000 * (retryCount + 1)); // Exponential backoff
        }
      } finally {
        setLoading(false);
      }
    };

    if (authenticated) {
      fetchData();
    }
  }, [authenticated, selectedCurrency, retryCount]);

  // Helper function to extract stock symbols from text
  const extractStockSymbols = (text: string): string[] => {
    const symbols = predictions.map(p => p.symbol.replace('.NR', ''));
    return symbols.filter(symbol => 
      text.toUpperCase().includes(symbol)
    );
  };

  // Helper function to analyze sentiment
  const analyzeSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['surge', 'rise', 'gain', 'up', 'positive', 'growth', 'profit', 'success'];
    const negativeWords = ['fall', 'drop', 'down', 'negative', 'loss', 'decline', 'risk', 'concern'];
    
    const words = text.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Predicta</h1>
          <p className="text-gray-400">Please connect your wallet to view predictions</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading predictions and news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => setRetryCount(0)}
            className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Top Navigation Bar */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Predicta
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="KES">KES</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
              <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Predictions */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-indigo-400 mr-2" />
                  <h2 className="text-xl font-semibold">Top 10 AI Predictions</h2>
                </div>
                <Link 
                  href="/trading"
                  className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors flex items-center"
                >
                  Trade Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div 
                    key={prediction.symbol}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{prediction.symbol}</div>
                        <div className="text-sm text-gray-400">{prediction.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {prediction.currentPriceFormatted}
                        </div>
                        <div className={`text-sm ${
                          prediction.prediction.prediction === 'BULLISH' 
                            ? 'text-green-400' 
                            : prediction.prediction.prediction === 'BEARISH'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                        }`}>
                          {prediction.prediction.prediction} ({Math.round(prediction.prediction.confidence * 100)}% confidence)
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      {prediction.prediction.analysis}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-400">Target: {prediction.prediction.target_price_formatted}</span>
                      <span className="text-gray-400">Volume: {prediction.volume.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {predictions.length === 0 && !loading && (
                  <div className="text-center py-4 text-gray-400">
                    No predictions available at the moment
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* News Feed */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-lg">
            <h2 className="text-xl font-semibold mb-6">Latest News</h2>
            <div className="space-y-4">
              {news.map((item, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">{item.source}</div>
                    <div className={`text-sm ${
                      item.sentiment === 'positive' ? 'text-green-400' :
                      item.sentiment === 'negative' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {item.sentiment?.toUpperCase()}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Read More
                    </a>
                    {item.relatedStocks && item.relatedStocks.length > 0 && (
                      <Link 
                        href={`/trading?symbol=${item.relatedStocks[0]}`}
                        className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center"
                      >
                        Trade {item.relatedStocks[0]}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {news.length === 0 && !loading && (
                <div className="text-center py-4 text-gray-400">
                  No news available at the moment
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}