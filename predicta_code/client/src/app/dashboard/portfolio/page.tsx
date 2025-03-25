'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Activity, Filter } from 'lucide-react';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

const mockPortfolioData = {
  totalValue: 24500,
  totalGain: 3200,
  gainPercentage: 15.2,
  assets: [
    { name: 'Stocks', value: 12500 },
    { name: 'Crypto', value: 6000 },
    { name: 'Bonds', value: 4000 },
    { name: 'Cash', value: 2000 },
  ],
  performanceData: [
    { date: 'Jan', value: 20000 },
    { date: 'Feb', value: 21500 },
    { date: 'Mar', value: 22800 },
    { date: 'Apr', value: 21900 },
    { date: 'May', value: 23400 },
    { date: 'Jun', value: 24500 },
  ],
  holdings: [
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 25, value: 4558.50, change: 2.4 },
    { symbol: 'TSLA', name: 'Tesla Inc.', shares: 10, value: 2485.00, change: -1.2 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 15, value: 4931.85, change: 1.8 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 8, value: 1140.48, change: 0.9 },
  ],
};

export default function PortfolioDashboard() {
  const { authenticated } = usePrivy();
  const [timeRange, setTimeRange] = useState('1M');

  if (!authenticated) {
    return (
      <div className="pt-24 text-center">
        <p className="text-xl">Please connect your wallet to view your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-6 w-6 text-indigo-400" />
              <span className="text-white/70">Total Value</span>
            </div>
            <div className="text-3xl font-bold">${mockPortfolioData.totalValue.toLocaleString()}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-6 w-6 text-green-400" />
              <span className="text-white/70">Total Gain/Loss</span>
            </div>
            <div className="text-3xl font-bold text-green-400">+${mockPortfolioData.totalGain.toLocaleString()}</div>
            <div className="text-sm text-green-400">+{mockPortfolioData.gainPercentage}%</div>
          </div>

          <div className="lg:col-span-2 bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Asset Allocation</h2>
              <div className="flex space-x-2">
                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      timeRange === range
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockPortfolioData.assets}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockPortfolioData.assets.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {mockPortfolioData.assets.map((asset, index) => (
                <div key={asset.name} className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm text-white/70">{asset.name}</span>
                  </div>
                  <div className="text-lg font-semibold">${asset.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-lg font-semibold mb-6">Portfolio Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockPortfolioData.performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#01013e',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ fill: '#4F46E5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Holdings</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-white/70" />
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Assets</option>
                <option>Stocks</option>
                <option>Crypto</option>
                <option>Bonds</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white/70 border-b border-white/10">
                  <th className="text-left py-3">Symbol</th>
                  <th className="text-left py-3">Name</th>
                  <th className="text-right py-3">Shares</th>
                  <th className="text-right py-3">Value</th>
                  <th className="text-right py-3">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {mockPortfolioData.holdings.map((holding) => (
                  <tr key={holding.symbol} className="border-b border-white/5">
                    <td className="py-4 text-indigo-400 font-medium">{holding.symbol}</td>
                    <td className="py-4">{holding.name}</td>
                    <td className="py-4 text-right">{holding.shares}</td>
                    <td className="py-4 text-right">${holding.value.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end">
                        {holding.change >= 0 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                            <span className="text-green-400">+{holding.change}%</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                            <span className="text-red-400">{holding.change}%</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}