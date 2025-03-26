'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Brain, Globe2, Building2, Filter } from 'lucide-react';
import { useState } from 'react';

const mockData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const countries = ['USA', 'UK', 'Japan', 'Germany', 'China'];
const exchanges = ['NYSE', 'NASDAQ', 'LSE', 'TSE', 'SSE'];

export default function Dashboard() {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedExchange, setSelectedExchange] = useState('All');

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Market Overview</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <Globe2 className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400" />
              <select
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Exchanges</option>
                {exchanges.map(exchange => (
                  <option key={exchange} value={exchange}>{exchange}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#ffffff80" />
                    <YAxis stroke="#ffffff80" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#01013e', 
                        border: '1px solid rgba(255,255,255,0.1)' 
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
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4">AI Predictions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm text-indigo-400">AAPL</p>
                    <p className="text-lg font-semibold">$182.34</p>
                  </div>
                  <div className="flex items-center text-green-400">
                    <ArrowUpRight className="h-5 w-5" />
                    <span className="ml-1">2.4%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-sm text-indigo-400">TSLA</p>
                    <p className="text-lg font-semibold">$248.50</p>
                  </div>
                  <div className="flex items-center text-red-400">
                    <ArrowDownRight className="h-5 w-5" />
                    <span className="ml-1">1.2%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-indigo-400 mr-2" />
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