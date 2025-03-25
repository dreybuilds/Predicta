'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Brain } from 'lucide-react';

const mockData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

export default function Dashboard() {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">AI Predictions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">AAPL</p>
                    <p className="text-lg font-semibold">$182.34</p>
                  </div>
                  <div className="flex items-center text-green-400">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="ml-1">2.4%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">TSLA</p>
                    <p className="text-lg font-semibold">$248.50</p>
                  </div>
                  <div className="flex items-center text-red-400">
                    <ArrowDownRight className="h-5 w-5" />
                    <span className="ml-1">1.2%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-semibold">Market Sentiment</h2>
              </div>
              <p className="text-white/70">
                Based on recent news analysis, market sentiment is bullish for tech sector. 
                Consider increasing positions in cloud computing and AI-related stocks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}