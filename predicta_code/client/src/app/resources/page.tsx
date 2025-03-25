'use client';

import { Building2, Globe2, Twitter, Github, Linkedin } from 'lucide-react';

export default function Resources() {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Resources & Links</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore our partner platforms and connect with us on social media.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <a 
            href="https://nse.co.ke/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition group"
          >
            <Building2 className="h-12 w-12 text-indigo-400 mb-6 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold mb-4">Nairobi Stock Exchange</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Access real-time market data and trading information from the Nairobi Securities Exchange.
            </p>
            <span className="text-indigo-400 font-medium">Visit NSE →</span>
          </a>
          
          <a 
            href="https://hedera.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition group"
          >
            <Globe2 className="h-12 w-12 text-indigo-400 mb-6 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-bold mb-4">Hedera</h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Learn more about the secure, fast, and low-cost public network powering our settlement system.
            </p>
            <span className="text-indigo-400 font-medium">Visit Hedera →</span>
          </a>
        </div>

        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-12 border border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-center">Connect With Us</h2>
          <div className="flex justify-center items-center space-x-8">
            <a 
              href="https://twitter.com/predicta" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-white/10 transition">
                <Twitter className="h-8 w-8 text-indigo-400 group-hover:scale-110 transition" />
              </div>
              <p className="text-center mt-2 text-white/70">Twitter</p>
            </a>
            
            <a 
              href="https://github.com/predicta" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-white/10 transition">
                <Github className="h-8 w-8 text-indigo-400 group-hover:scale-110 transition" />
              </div>
              <p className="text-center mt-2 text-white/70">GitHub</p>
            </a>
            
            <a 
              href="https://linkedin.com/company/predicta" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white/5 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-white/10 transition">
                <Linkedin className="h-8 w-8 text-indigo-400 group-hover:scale-110 transition" />
              </div>
              <p className="text-center mt-2 text-white/70">LinkedIn</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}