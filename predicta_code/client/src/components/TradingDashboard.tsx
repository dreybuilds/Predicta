'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  Loader2,
  Settings,
  ChevronDown,
  Wallet,
  RefreshCw,
  Info
} from 'lucide-react';
import axios from 'axios';

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  currentPriceFormatted: string;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  marketCapFormatted: string;
  sector: string;
  lastUpdated: string;
}

interface Transaction {
  id: number;
  type: 'BUY' | 'SELL';
  symbol: string;
  amount: number;
  status: 'Settled' | 'Processing';
  date: string;
}

export default function TradingDashboard() {
  const { authenticated, user } = usePrivy();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [amount, setAmount] = useState('');
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('KES');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy stocks data
        const dummyStocks: Stock[] = [
          {
            symbol: "SAFCOM.NR",
            name: "Safaricom PLC",
            currentPrice: 15.25,
            currentPriceFormatted: "KES 15.25",
            change: 0.75,
            changePercent: 5.17,
            volume: 2500000,
            marketCap: 61000000000,
            marketCapFormatted: "KES 61B",
            sector: "Telecommunications",
            lastUpdated: new Date().toISOString()
          },
          {
            symbol: "KCB.NR",
            name: "KCB Bank Group",
            currentPrice: 35.80,
            currentPriceFormatted: "KES 35.80",
            change: -0.20,
            changePercent: -0.56,
            volume: 1800000,
            marketCap: 45000000000,
            marketCapFormatted: "KES 45B",
            sector: "Banking",
            lastUpdated: new Date().toISOString()
          },
          {
            symbol: "EQTY.NR",
            name: "Equity Group Holdings",
            currentPrice: 42.15,
            currentPriceFormatted: "KES 42.15",
            change: 0.15,
            changePercent: 0.36,
            volume: 1500000,
            marketCap: 38000000000,
            marketCapFormatted: "KES 38B",
            sector: "Banking",
            lastUpdated: new Date().toISOString()
          },
          {
            symbol: "EABL.NR",
            name: "East African Breweries",
            currentPrice: 165.00,
            currentPriceFormatted: "KES 165.00",
            change: 2.50,
            changePercent: 1.54,
            volume: 800000,
            marketCap: 28000000000,
            marketCapFormatted: "KES 28B",
            sector: "Consumer Goods",
            lastUpdated: new Date().toISOString()
          },
          {
            symbol: "KPLC.NR",
            name: "Kenya Power",
            currentPrice: 2.15,
            currentPriceFormatted: "KES 2.15",
            change: -0.05,
            changePercent: -2.27,
            volume: 1200000,
            marketCap: 15000000000,
            marketCapFormatted: "KES 15B",
            sector: "Utilities",
            lastUpdated: new Date().toISOString()
          }
        ];

        // Apply filters
        let filteredStocks = dummyStocks.filter(stock => {
          const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesSector = !selectedSector || stock.sector === selectedSector;
          const matchesPriceRange = (!minPrice || stock.currentPrice >= parseFloat(minPrice)) &&
                                  (!maxPrice || stock.currentPrice <= parseFloat(maxPrice));
          return matchesSearch && matchesSector && matchesPriceRange;
        });

        // Apply sorting
        filteredStocks.sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'price':
              comparison = a.currentPrice - b.currentPrice;
              break;
            case 'change':
              comparison = a.changePercent - b.changePercent;
              break;
            case 'volume':
              comparison = a.volume - b.volume;
              break;
            case 'marketCap':
              comparison = a.marketCap - b.marketCap;
              break;
            default:
              comparison = 0;
          }
          return sortOrder === 'asc' ? comparison : -comparison;
        });

        setStocks(filteredStocks);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError('Failed to fetch stocks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (authenticated) {
      fetchStocks();
    }
  }, [authenticated, searchQuery, selectedSector, minPrice, maxPrice, sortBy, sortOrder]);

  const handleTrade = async (type: 'BUY' | 'SELL') => {
    if (!selectedStock || !amount) return;

    try {
      const newTransaction: Transaction = {
        id: transactions.length + 1,
        type,
        symbol: selectedStock.symbol,
        amount: parseFloat(amount),
        status: 'Processing',
        date: new Date().toISOString().split('T')[0]
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setAmount('');
    } catch (err) {
      console.error('Error executing trade:', err);
      setError('Failed to execute trade');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to NSE Trading</h1>
            <p className="text-xl text-gray-400">Connect your wallet to start trading</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <p className="text-sm text-gray-400">
            Please make sure you have set up your RapidAPI key in the server's .env file.
          </p>
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
                NSE Trading
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Trade</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setShowStockModal(true)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stocks..."
                    className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={selectedSector || ''}
                    onChange={(e) => setSelectedSector(e.target.value || '')}
                    className="bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Sectors</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Energy">Energy</option>
                    {/* Add more sectors as needed */}
                  </select>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={minPrice || ''}
                    onChange={(e) => setMinPrice(e.target.value || '')}
                    placeholder="Min Price"
                    className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    value={maxPrice || ''}
                    onChange={(e) => setMaxPrice(e.target.value || '')}
                    placeholder="Max Price"
                    className="flex-1 bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'change' | 'volume' | 'marketCap')}
                    className="bg-white/5 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="change">Change</option>
                    <option value="volume">Volume</option>
                    <option value="marketCap">Market Cap</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`h-5 w-5 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Stock Selection */}
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">From</span>
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      Max
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 bg-transparent text-2xl font-bold focus:outline-none"
                      placeholder="0.0"
                    />
                    <button className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                      <span className="font-semibold">KES</span>
                      <ChevronDown className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Stock Selection Dropdown */}
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-sm text-gray-400 mb-2">To</div>
                  <button 
                    className="w-full flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => {/* Add stock selection modal */}}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{selectedStock?.symbol || 'Select Stock'}</span>
                      <span className="text-sm text-gray-400">{selectedStock?.name}</span>
                    </div>
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>

                {/* Trade Details */}
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Price Impact</span>
                    <span className="text-green-400">+0.1%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Slippage Tolerance</span>
                    <span className="text-white">{slippage}%</span>
                  </div>
                </div>

                {/* Trade Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={() => handleTrade('BUY')}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  >
                    Buy {selectedStock?.symbol}
                  </button>
                  <button 
                    onClick={() => handleTrade('SELL')}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  >
                    Sell {selectedStock?.symbol}
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <History className="h-5 w-5 text-indigo-400 mr-2" />
                  <h2 className="text-xl font-semibold">Recent Transactions</h2>
                </div>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="flex items-center">
                        <span className={`text-sm ${tx.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type}
                        </span>
                        <span className="mx-2 text-white/40">•</span>
                        <span className="text-sm text-white/70">{tx.symbol}</span>
                      </div>
                      <div className="text-lg font-semibold">KES {tx.amount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70">{tx.date}</div>
                      <div className="text-sm font-medium text-indigo-400">{tx.status}</div>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-4 text-white/50">
                    No transactions yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Portfolio Overview */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-lg h-fit">
            <h2 className="text-xl font-semibold mb-6">Portfolio Overview</h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-white/70 mb-1">Total Value</div>
                <div className="text-3xl font-bold">KES 24,500.00</div>
              </div>
              <div>
                <div className="text-sm text-white/70 mb-1">Available Balance</div>
                <div className="text-2xl font-semibold">KES 5,230.45</div>
              </div>
              <div>
                <div className="text-sm text-white/70 mb-1">Pending Settlements</div>
                <div className="text-2xl font-semibold">KES 1,800.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Selection Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Select Stock</h2>
              <button
                onClick={() => setShowStockModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {stocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    setSelectedStock(stock);
                    setShowStockModal(false);
                  }}
                  className={`w-full p-4 rounded-lg border ${
                    selectedStock?.symbol === stock.symbol
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-sm text-gray-400">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">KES {stock.currentPrice.toFixed(2)}</div>
                      <div className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}