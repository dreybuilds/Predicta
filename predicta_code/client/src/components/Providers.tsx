'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { hedera } from 'viem/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        // 1. Login methods
        loginMethods: ['email', 'wallet'],
        
        // 2. Appearance settings
        appearance: {
          theme: '#01013e',
          accentColor: '#4F46E5',
          showWalletLoginFirst: true,
          walletList: ['wallet_connect'], // Only show HashPack
          walletChainType: "ethereum-only",
          
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          showWalletUIs: true,
          waitForTransactionConfirmation: true,
        },
        defaultChain: hedera,
        supportedChains: [hedera],
        

        // Required WalletConnect config
        walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

        
      }}
    >
      {children}
    </PrivyProvider>
  );
}