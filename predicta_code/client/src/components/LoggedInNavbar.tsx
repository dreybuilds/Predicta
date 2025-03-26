'use client';

import { Brain, LayoutDashboard, LineChart, Wallet, Settings, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

export default function LoggedInNavbar() {
  const { logout } = usePrivy();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-white/10 bg-[#01013e]/95 backdrop-blur-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <Brain className="h-8 w-8 text-indigo-400" />
            <span className="ml-2 text-xl font-bold">Predicta</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link 
              href="/"
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                isActive('/')
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20'
              }`}
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Home</span>
            </Link>

            <Link 
              href="/dashboard"
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                isActive('/dashboard')
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              <span>Dashboard</span>
            </Link>

            <Link 
              href="/dashboard/trading"
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                isActive('/dashboard/trading')
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20'
              }`}
            >
              <LineChart className="h-5 w-5 mr-2" />
              <span>Trading</span>
            </Link>

            <Link 
              href="/dashboard/portfolio"
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                isActive('/dashboard/portfolio')
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20'
              }`}
            >
              <Wallet className="h-5 w-5 mr-2" />
              <span>Portfolio</span>
            </Link>

            <Link 
              href="/dashboard/settings"
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                isActive('/dashboard/settings')
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20'
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              <span>Settings</span>
            </Link>

            <button 
              onClick={() => logout()}
              className="flex items-center px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition ml-2"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}