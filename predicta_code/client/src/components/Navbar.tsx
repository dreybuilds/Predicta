'use client';

import { Brain, TrendingUp, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Wallet connection logic will be implemented later
    setTimeout(() => setIsConnecting(false), 1000);
  };

  return (
    <nav className="border-b border-white/10 bg-[#01013e]/95 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <Brain className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold">Predicta</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Markets
            </Link>
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition disabled:opacity-50"
            >
              <Wallet className="h-5 w-5 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}