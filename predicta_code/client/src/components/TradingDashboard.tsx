'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { DollarSign, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';

export default function TradingDashboard() {
  const { authenticated, user } = usePrivy();
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [amount, setAmount] = useState('');

  const mockStocks = [
    { symbol: 'AAPL', price: 182.34, change: 2.4 },
    { symbol: 'TSLA', price: 248.50, change: -1.2 },
    { symbol: 'MSFT', price: 328.79, change: 1.8 },
    { symbol: 'GOOGL', price: 142.56, change: 0.9 },
  ];

  const mockTransactions = [
    { id: 1, type: 'BUY', symbol: 'AAPL', amount: 5000, status: 'Settled', date: '2024-02-28' },
    { id: 2, type: 'SELL', symbol: 'TSLA', amount: 3000, status: 'Processing', date: '2024-02-27' },
  ];

  if (!authenticated) {
    return (
      <div className="pt-24 text-center">
        <p className="text-xl">Please connect your wallet to access trading features.</p>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-6">Trading Dashboard</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {mockStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock.symbol)}
                    className={`p-4 rounded-lg border ${
                      selectedStock === stock.symbol
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{stock.symbol}</span>
                      {stock.change >= 0 ? (
                        <div className="flex items-center text-green-400">
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="ml-1">{stock.change}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400">
                          <ArrowDownRight className="h-4 w-4" />
                          <span className="ml-1">{Math.abs(stock.change)}%</span>
                        </div>
                      )}
                    </div>
                    <div className="text-2xl font-bold">${stock.price}</div>
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Investment Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-white/40" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition">
                    Buy {selectedStock}
                  </button>
                  <button className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition">
                    Sell {selectedStock}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-6">
                <History className="h-5 w-5 text-indigo-400 mr-2" />
                <h2 className="text-xl font-semibold">Recent Settlements</h2>
              </div>
              <div className="space-y-4">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="flex items-center">
                        <span className={`text-sm ${tx.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type}
                        </span>
                        <span className="mx-2 text-white/40">•</span>
                        <span className="text-sm text-white/70">{tx.symbol}</span>
                      </div>
                      <div className="text-lg font-semibold">${tx.amount}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70">{tx.date}</div>
                      <div className="text-sm font-medium text-indigo-400">{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 h-fit">
            <h2 className="text-xl font-semibold mb-6">Portfolio Overview</h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-white/70 mb-1">Total Value</div>
                <div className="text-3xl font-bold">$24,500.00</div>
              </div>
              <div>
                <div className="text-sm text-white/70 mb-1">Available Balance</div>
                <div className="text-2xl font-semibold">$5,230.45</div>
              </div>
              <div>
                <div className="text-sm text-white/70 mb-1">Pending Settlements</div>
                <div className="text-2xl font-semibold">$1,800.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}