'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is not defined');
  }

  return (
    <PrivyProvider
      appId={appId}
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