'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        // Login configuration
        loginMethods: ['email', 'wallet'],
        
        // Appearance settings (keeping your custom colors)
        appearance: {
          theme: '#01013e',
          accentColor: '#4F46E5',
          showWalletLoginFirst: true,
          walletList: ['wallet_connect'],
          walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
          additionalWallets: [{
            id: 'a29498d225fa4b13468ff4d6cf4ae0ea4adcbd95f07ce8a843a1dee10b632f3f',
            name: 'HashPack',
            links: {
              native: 'hashpack://',
              universal: 'https://www.hashpack.app'
            }
          }],
        },

        
        // // Wallet configuration
        // wallets: {
        //   // WalletConnect configuration for HashPack
        //   walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
          
        //   // Explicitly configure HashPack
        //   additionalWallets: [{
        //     id: 'hashpack',
        //     name: 'HashPack',
        //     links: {
        //       native: 'hashpack://',
        //       universal: 'https://www.hashpack.app'
        //     }
        //   }],
        //   walletConnect: {
        //     enabled: true,
        //   },
          
        //   // Disable other wallets (keeping your preferences)
        //   embeddedWallets: {
        //     enabled: false
        //   },
        //   metamask: {
        //     enabled: false
        //   },
        //   coinbase: {
        //     enabled: false
        //   },
        //   phantom: {
        //     enabled: false
        //   },

          
        //   // Explicit privyWallet config to prevent errors
        //   privyWallet: {
        //     enabled: false,
        //     override: {
        //       enabled: false
        //     }
        //   }
        // },
      }}
    >
      {children}
    </PrivyProvider>
  );
}