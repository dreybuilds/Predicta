# Predicta AI Chatbot

An AI-powered chatbot for the Predicta platform that integrates with the Hedera network using the Hedera JavaScript SDK.

## Overview

This chatbot provides users with:

- Information about the Hedera ecosystem
- Stock market insights and predictions
- Details about the Predicta platform

The chatbot leverages the Hedera JavaScript SDK to interact with the Hedera network, allowing it to:

- Store and retrieve data using Hedera Consensus Service (HCS)
- Create and manage tokens using Hedera Token Service (HTS)
- Query balances and ledger data

## Prerequisites

- Node.js v18 or higher
- Hedera testnet or mainnet account with HBAR for transaction fees
- OpenAI API key for GPT model access

## Installation

1. Clone the repository
2. Navigate to the chatbot directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example` with your API keys and Hedera account details:

```
# OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here

# Hedera network configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.12345
HEDERA_PRIVATE_KEY=your_private_key_here

# Optional: Topic IDs for Hedera Consensus Service
# If not provided, topics will be created automatically on startup
HEDERA_MARKET_DATA_TOPIC_ID=
HEDERA_PREDICTION_TOPIC_ID=

# Optional: Token ID for Predicta token
# If not provided, you can create a token using the API
PREDICTA_TOKEN_ID=

# Server configuration
PORT=3001
HOST=127.0.0.1

# AI model to use (defaults to gpt-4)
AI_MODEL=gpt-4
```

## Usage

### Development

Run the chatbot in development mode:

```bash
npm run dev
```

### Production

Build and start the chatbot:

```bash
npm run build
npm start
```

### API Endpoints

- `POST /api/chat` - Send a query to the chatbot
  - Request body: `{ "query": "Your question here" }`
  - Response: `{ "response": "AI-generated response" }`

- `GET /health` - Check if the server is running
  - Response: `{ "status": "healthy" }`

## Architecture

### Components

1. **Config Module** (`src/config.ts`)
   - Environment variable handling
   - Configuration validation

2. **Hedera Service** (`src/services/hedera.service.ts`)
   - Direct integration with Hedera SDK
   - Methods for interacting with the Hedera network
   - Topic creation and management

3. **Agent Service** (`src/services/agent.service.ts`)
   - Language model integration (OpenAI)
   - Query categorization and routing
   - Tools management

4. **Custom Tools**
   - Hedera tools (`src/services/tools/hedera.tools.ts`)
   - Market tools (`src/services/tools/market.tools.ts`)
   - Predicta platform tools (`src/services/tools/predicta.tools.ts`)
   - Hedera educational tools (`src/services/tools/hederaInfo.tools.ts`)

5. **HTTP Server** (`src/index.ts`)
   - REST API endpoints
   - Request handling

## Hedera Integration

The chatbot uses the Hedera JavaScript SDK to:

1. **Create and Manage Topics**
   - Automatically create topics if not provided
   - Post messages to topics
   - Query messages from topics

2. **Store and Retrieve Data**
   - Market data on HCS topics
   - AI predictions and analytics

3. **Token Management**
   - Create and manage tokens
   - Query token balances

## Future Enhancements

- Add authentication and user session management
- Implement WebSocket for real-time updates
- Create a frontend interface for the chatbot
- Integrate with real market data APIs
- Expand prediction capabilities with more advanced ML models

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for bugs and feature requests.

## License

[License details here] 