import { DynamicTool } from '@langchain/core/tools';

/**
 * Educational tools for teaching users about Hedera
 */

// General Hedera information
const getHederaInfo = new DynamicTool({
  name: 'get-hedera-info',
  description: 'Get general information about Hedera and its main features',
  func: async () => {
    try {
      const hederaInfo = {
        name: 'Hedera',
        description: 'Hedera is a public distributed ledger for building and deploying decentralized applications and services',
        consensus: 'Hashgraph consensus algorithm (aBFT)',
        governance: 'Hedera Governing Council (39 term-limited organizations)',
        features: [
          'High throughput (~10,000 TPS for cryptocurrency transactions)',
          'Low, predictable fees',
          'Fair transaction ordering',
          'Carbon-negative network operations',
          'Finality in seconds, not minutes or hours'
        ],
        services: [
          'Hedera Token Service (HTS)',
          'Hedera Consensus Service (HCS)',
          'Hedera Smart Contract Service',
          'Hedera File Service'
        ],
        token: {
          name: 'HBAR',
          purpose: 'Used for network fees, staking, and payments'
        },
        website: 'https://hedera.com'
      };
      
      return JSON.stringify(hederaInfo);
    } catch (error) {
      console.error('Error in getHederaInfo tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve Hedera information' });
    }
  }
});

// Hedera Token Service (HTS) information
const getHtsInfo = new DynamicTool({
  name: 'get-hts-info',
  description: 'Get information about Hedera Token Service (HTS) and its capabilities',
  func: async () => {
    try {
      const htsInfo = {
        name: 'Hedera Token Service (HTS)',
        description: 'A service enabling the creation and management of fungible and non-fungible tokens on the Hedera network',
        features: [
          'Native token issuance without smart contracts',
          'Support for fungible and non-fungible tokens',
          'Configurable token features and permissions',
          'Fast and low-cost token transfers',
          'Built-in compliance features'
        ],
        tokenTypes: [
          'Fungible tokens (like cryptocurrencies)',
          'Non-fungible tokens (NFTs)',
          'Fungible tokens with KYC requirements'
        ],
        operations: [
          'Token creation',
          'Token minting/burning',
          'Token transfers',
          'Account association/dissociation',
          'Token freezing/unfreezing',
          'Token KYC management'
        ],
        benefits: [
          'Lower cost than smart contract tokens',
          'Improved security',
          'Faster transaction settlement',
          'Simplified compliance'
        ],
        documentation: 'https://docs.hedera.com/hedera/sdks-and-apis/sdks/readme-1/hedera-token-service'
      };
      
      return JSON.stringify(htsInfo);
    } catch (error) {
      console.error('Error in getHtsInfo tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve HTS information' });
    }
  }
});

// Hedera Consensus Service (HCS) information
const getHcsInfo = new DynamicTool({
  name: 'get-hcs-info',
  description: 'Get information about Hedera Consensus Service (HCS) and its capabilities',
  func: async () => {
    try {
      const hcsInfo = {
        name: 'Hedera Consensus Service (HCS)',
        description: 'A service providing a verifiable timestamp and ordering of events for any application',
        features: [
          'Fair and verifiable transaction ordering',
          'Transparent log of messages',
          'High throughput message processing',
          'Low and predictable fees'
        ],
        useCases: [
          'Audit logs',
          'Supply chain tracking',
          'Financial markets',
          'Document verification',
          'Decentralized exchanges',
          'Healthcare records'
        ],
        concepts: [
          'Topics: Partitions for different message streams',
          'Consensus timestamps: Verifiable proof of time and order',
          'Sequenced messages: Guaranteed order of operations'
        ],
        operations: [
          'Create topic',
          'Update topic',
          'Delete topic',
          'Submit messages to topic',
          'Subscribe to topic'
        ],
        documentation: 'https://docs.hedera.com/hedera/sdks-and-apis/sdks/readme-1/hedera-consensus-service'
      };
      
      return JSON.stringify(hcsInfo);
    } catch (error) {
      console.error('Error in getHcsInfo tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve HCS information' });
    }
  }
});

// Hedera Agent Kit information
const getAgentKitInfo = new DynamicTool({
  name: 'get-agent-kit-info',
  description: 'Get information about Hedera Agent Kit and its capabilities',
  func: async () => {
    try {
      const agentKitInfo = {
        name: 'Hedera Agent Kit',
        description: 'A toolkit for integrating AI agents with the Hedera network',
        features: [
          'LangChain-compatible tools',
          'Easy Hedera network interactions',
          'Token creation and management',
          'Consensus message handling',
          'Airdrop functionality'
        ],
        capabilities: [
          'Create fungible tokens with minimal parameters',
          'Mint additional tokens to existing accounts',
          'Transfer tokens between accounts',
          'Associate/dissociate tokens with accounts',
          'Get account balances',
          'Create and manage topics',
          'Submit messages to topics',
          'Retrieve messages from topics'
        ],
        integration: {
          note: 'Designed to integrate with LangChain, LangGraph, and other AI agent frameworks',
          usage: 'Import the kit, initialize with Hedera credentials, and use the provided tools in your agent'
        },
        repository: 'https://github.com/hedera-dev/hedera-agent-kit',
        documentation: 'https://docs.hedera.com/hedera/open-source-solutions/ai-tools-for-developers/hedera-ai-agent-kit'
      };
      
      return JSON.stringify(agentKitInfo);
    } catch (error) {
      console.error('Error in getAgentKitInfo tool:', error);
      return JSON.stringify({ error: 'Failed to retrieve Agent Kit information' });
    }
  }
});

// Export all Hedera info tools
export const hederaInfoTools = [
  getHederaInfo,
  getHtsInfo,
  getHcsInfo,
  getAgentKitInfo
]; 