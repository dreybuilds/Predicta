'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cm8p1ihc7009p23akq2ysqlbu"
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: '#01013e',
          accentColor: '#4F46E5',
          showWalletLoginFirst: true,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}