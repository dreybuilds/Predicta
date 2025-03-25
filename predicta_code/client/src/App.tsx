import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { Brain, TrendingUp, Wallet } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';

function App() {
  return (
    <PrivyProvider
      appId="YOUR_PRIVY_APP_ID"
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: '#01013e',
          accentColor: '#01013e',
        },
      }}
    >
      <div className="min-h-screen bg-[#01013e] text-white">
        <nav className="border-b border-white/10 bg-[#01013e]/95 backdrop-blur-sm fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold">Predicta</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Markets
                </button>
                <button className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
                  <Wallet className="h-5 w-5 mr-2" />
                  Connect
                </button>
              </div>
            </div>
          </div>
        </nav>
        <Landing />
      </div>
    </PrivyProvider>
  );
}

export default App;