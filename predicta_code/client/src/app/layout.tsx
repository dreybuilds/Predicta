import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
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
      <body className={`${inter.className} min-h-screen bg-[#01013e] text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}