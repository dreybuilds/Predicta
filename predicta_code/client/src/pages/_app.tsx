import { PrivyProvider } from '@privy-io/react-auth';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
} 