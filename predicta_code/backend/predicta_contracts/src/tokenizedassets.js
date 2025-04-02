// Hedera Token Creation Script for Node.js
require('dotenv').config();
const { Client, TokenCreateTransaction, PrivateKey, TokenType, TokenSupplyType } = require("@hashgraph/sdk");

async function createHederaToken() {
    try {
        // Validate environment variables
        if (!process.env.ACCOUNT_ID || !process.env.PRIVATE_KEY) {
            throw new Error("Missing ACCOUNT_ID or PRIVATE_KEY in .env file");
        }

        // Configure your testnet account
        const operatorId = process.env.ACCOUNT_ID;
        const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY.trim()); // Add .trim() to remove whitespace
        
        const client = Client.forTestnet();
        client.setOperator(operatorId, operatorKey);
        
        // Create the token
        const tokenCreateTx = await new TokenCreateTransaction()
            .setTokenName("KPLC Shares")
            .setTokenSymbol("KPLC")
            .setTokenType(TokenType.FungibleCommon)
            .setDecimals(8)
            .setInitialSupply(1000000)
            .setTreasuryAccountId(operatorId)
            .setSupplyType(TokenSupplyType.Infinite)
            .setAdminKey(operatorKey)
            .setSupplyKey(operatorKey)
            .freezeWith(client) // Freeze first before signing
            .sign(operatorKey);
        
        const tokenCreateSubmit = await tokenCreateTx.execute(client);
        const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
        const tokenId = tokenCreateRx.tokenId;
        
        console.log("✅ Token created successfully!");
        console.log("Token ID:", tokenId.toString());
        
        return tokenId;
    } catch (error) {
        console.error("❌ Error creating token:", error.message);
        process.exit(1);
    }
}

createHederaToken();