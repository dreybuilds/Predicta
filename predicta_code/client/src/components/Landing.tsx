'use client';

import { Brain, LineChart, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

export default function Landing() {
  const { login, authenticated } = usePrivy();

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI-Powered Stock Market Predictions
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Get precise market insights powered by AI analysis of real-time news and market data. 
            Trade with confidence using our lightning-fast settlement system.
          </p>
          <div className="flex justify-center space-x-6">
            {authenticated ? (
              <Link 
                href="/dashboard"
                className="px-8 py-3 bg-white text-[#01013e] rounded-lg font-semibold hover:bg-white/90 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={() => login()}
                className="px-8 py-3 bg-white text-[#01013e] rounded-lg font-semibold hover:bg-white/90 transition"
              >
                Get Started
              </button>
            )}
            <Link
              href="/learn"
              className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
            <Brain className="h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-white/70">
              Advanced machine learning models analyze market news and trends in real-time.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
            <LineChart className="h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
            <p className="text-white/70">
              Get detailed market sentiment analysis and trading recommendations.
            </p>
          </div>
          <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10">
            <Zap className="h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast Settlement</h3>
            <p className="text-white/70">
              Experience rapid and secure investment processing through our platform.
            </p>
          </div>
        </div>

        <div className="py-20">
          <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Sign Up',
                  description: 'Create your account in seconds',
                },
                {
                  step: '02',
                  title: 'Analyze',
                  description: 'Get AI-powered market insights',
                },
                {
                  step: '03',
                  title: 'Invest',
                  description: 'Execute trades with confidence',
                },
                {
                  step: '04',
                  title: 'Track',
                  description: 'Monitor your investment progress',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="text-4xl font-bold text-indigo-400 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}