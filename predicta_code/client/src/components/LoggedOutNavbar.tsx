'use client';

import { Brain, BookOpen, HelpCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { usePathname } from 'next/navigation';

export default function LoggedOutNavbar() {
  const { login } = usePrivy();
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
              href="/learn"
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                isActive('/learn')
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20'
              }`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              <span>About</span>
            </Link>

            <Link
              href="/resources"
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                isActive('/resources')
                  ? 'bg-indigo-500 text-white'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20'
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              <span>Resources</span>
            </Link>

            <button 
              onClick={() => login()}
              className="flex items-center px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition ml-2"
            >
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}