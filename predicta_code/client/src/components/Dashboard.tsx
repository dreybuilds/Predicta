'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  Loader2,
  TrendingUp,
  DollarSign,
  Globe,
  ArrowRight,
  AlertCircle,
  MessageSquare,
  Wallet
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
  publishedAt: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedStocks?: string[];
}

export default function Dashboard() {
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState('KES');
  const [retryCount, setRetryCount] = useState(0);
  const [hbarBalance, setHbarBalance] = useState<number | null>(null);
  const maxRetries = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy predictions data
        const dummyPredictions: Prediction[] = [
          {
            symbol: "SAFCOM.NR",
            name: "Safaricom PLC",
            currentPrice: 15.25,
            currentPriceFormatted: "KES 15.25",
            prediction: {
              prediction: "BULLISH",
              confidence: 0.85,
              target_price: 16.50,
              target_price_formatted: "KES 16.50",
              analysis: "Strong mobile money growth and positive market sentiment"
            },
            sector: "Telecommunications",
            volume: 2500000,
            marketCap: 61000000000,
            marketCapFormatted: "KES 61B"
          },
          {
            symbol: "KCB.NR",
            name: "KCB Bank Group",
            currentPrice: 35.80,
            currentPriceFormatted: "KES 35.80",
            prediction: {
              prediction: "BULLISH",
              confidence: 0.75,
              target_price: 38.00,
              target_price_formatted: "KES 38.00",
              analysis: "Expanding regional presence and strong financial performance"
            },
            sector: "Banking",
            volume: 1800000,
            marketCap: 45000000000,
            marketCapFormatted: "KES 45B"
          },
          {
            symbol: "EQTY.NR",
            name: "Equity Group Holdings",
            currentPrice: 42.15,
            currentPriceFormatted: "KES 42.15",
            prediction: {
              prediction: "NEUTRAL",
              confidence: 0.60,
              target_price: 42.50,
              target_price_formatted: "KES 42.50",
              analysis: "Stable performance with moderate growth potential"
            },
            sector: "Banking",
            volume: 1500000,
            marketCap: 38000000000,
            marketCapFormatted: "KES 38B"
          }
        ];

        // Dummy news data
        const dummyNews: NewsItem[] = [
          {
            title: "Safaricom Reports Strong Q1 Growth",
            description: "Safaricom's mobile money division shows 25% growth in Q1 2024, driven by increased adoption of M-PESA services.",
            url: "https://example.com/news1",
            source: "Business Daily",
            publishedAt: "2024-03-20T10:00:00Z",
            sentiment: "positive",
            relatedStocks: ["SAFCOM.NR"]
          },
          {
            title: "KCB Bank Expands to Ethiopia",
            description: "KCB Bank Group announces successful entry into Ethiopian market with plans to open 20 branches by year-end.",
            url: "https://example.com/news2",
            source: "The Standard",
            publishedAt: "2024-03-19T15:30:00Z",
            sentiment: "positive",
            relatedStocks: ["KCB.NR"]
          },
          {
            title: "Equity Bank Launches Digital Banking Platform",
            description: "Equity Group Holdings introduces new digital banking platform to enhance customer experience and reduce operational costs.",
            url: "https://example.com/news3",
            source: "Nation",
            publishedAt: "2024-03-18T09:15:00Z",
            sentiment: "neutral",
            relatedStocks: ["EQTY.NR"]
          }
        ];

        setPredictions(dummyPredictions);
        setNews(dummyNews);
        setRetryCount(0);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000 * (retryCount + 1));
        }
      } finally {
        setLoading(false);
      }
    };

    if (authenticated) {
      fetchData();
    }
  }, [authenticated, selectedCurrency, retryCount]);

  useEffect(() => {
    const fetchHbarBalance = async () => {
      if (!authenticated || !user?.wallet?.address) return;
      
      try {
        // Get the connected wallet
        const connectedWallet = wallets.find(w => w.address === user.wallet.address);
        if (!connectedWallet) return;

        // Fetch balance using the wallet's provider
        const balance = await connectedWallet.getBalance();
        setHbarBalance(parseFloat(balance));
      } catch (error) {
        console.error('Error fetching HBAR balance:', error);
        setHbarBalance(null);
      }
    };

    fetchHbarBalance();
  }, [authenticated, user?.wallet?.address, wallets]);

  // Helper function to analyze news sentiment
  const analyzeNewsSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['surge', 'rise', 'gain', 'up', 'higher', 'positive', 'growth', 'profit', 'success'];
    const negativeWords = ['fall', 'drop', 'down', 'lower', 'negative', 'loss', 'decline', 'risk', 'concern'];
    
    const words = text.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Helper function to extract related stock symbols from news text
  const extractRelatedStocks = (text: string): string[] => {
    const stockSymbols = predictions.map(p => p.symbol);
    return stockSymbols.filter(symbol => 
      text.toLowerCase().includes(symbol.toLowerCase().replace('.NR', ''))
    );
  };

  // Helper function to get HBAR price in different currencies (replace with actual API call)
  const getHbarPrice = (currency: string): number => {
    const prices = {
      'KES': 9.5,  // Example exchange rates
      'USD': 0.07,
      'EUR': 0.065,
      'GBP': 0.056
    };
    return prices[currency as keyof typeof prices] || 0;
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Predicta</h1>
          <p className="text-xl text-gray-400">Please connect your wallet to view predictions</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => setRetryCount(0)}
            className="mt-4 px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
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
              <Link
                href="/dashboard/chat"
                className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors flex items-center group relative"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Open AI Chat
                </span>
              </Link>
              <div className="px-4 py-2 rounded-lg bg-indigo-500 flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                {hbarBalance !== null ? (
                  <span>{hbarBalance.toFixed(2)} ℏ</span>
                ) : (
                  <span>Loading...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Fixed Floating Chatbot Button (visible on scroll) */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/dashboard/chat"
          className="p-4 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors flex items-center shadow-lg group relative"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-10 right-0 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with AI Assistant
          </span>
        </Link>
      </div>

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
                  href="dashboard/trading"
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