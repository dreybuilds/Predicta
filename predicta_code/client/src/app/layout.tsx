import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Predicta - AI-Powered Stock Market Predictions',
  description: 'Get precise market insights powered by AI analysis of real-time news and market data.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-[#01013e] to-[#02024a] text-white`}>
        <Providers>
          <Navbar />
          {children}
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}