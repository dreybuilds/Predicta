'use client';

import { BrainCog, LineChart, Zap, ShieldCheck, Coins, TrendingUp, Wallet } from 'lucide-react';

export default function LearnMore() {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">How Predicta Works</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Learn how our AI-powered platform helps you make smarter investment decisions with real-time market analysis and secure settlements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <BrainCog className="h-12 w-12 text-indigo-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">AI-Powered Analysis</h2>
            <p className="text-white/70 leading-relaxed">
              Our advanced machine learning models analyze thousands of market signals, news articles, and trading patterns in real-time to provide accurate market predictions and insights.
            </p>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <LineChart className="h-12 w-12 text-indigo-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Market Intelligence</h2>
            <p className="text-white/70 leading-relaxed">
              Get comprehensive market data across multiple exchanges and countries. Filter and analyze stocks based on your investment preferences and strategy.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <ShieldCheck className="h-12 w-12 text-indigo-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Secure Trading</h2>
            <p className="text-white/70 leading-relaxed">
              Trade with confidence using our secure wallet integration. All transactions are protected and verified on the Hedera network.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <Coins className="h-12 w-12 text-indigo-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Investment Settlement</h2>
            <p className="text-white/70 leading-relaxed">
              Experience fast and secure investment settlements through our platform. Track your portfolio and manage your investments in real-time.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-12 border border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-center">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-white/70">Link your wallet to start trading securely on our platform</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Markets</h3>
              <p className="text-white/70">Use our AI tools to analyze markets and find opportunities</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trade & Settle</h3>
              <p className="text-white/70">Execute trades and track your investment settlements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}