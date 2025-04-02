import http from 'http';
import dotenv from 'dotenv';
import { validateConfig, PORT, HOST } from './config.js';
import { AgentService } from './services/agent.service.js';

// Load environment variables first
dotenv.config();

// Validate environment configuration
validateConfig();

// Initialize agent service
const agentService = new AgentService();

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Handle API requests
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { query } = JSON.parse(body);
        
        if (!query) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Query is required' }));
          return;
        }
        
        console.log(`Received query: ${query}`);
        
        // Process the query with the agent
        const response = await agentService.handleQuery(query);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ response }));
      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });
  } 
  // Health check endpoint
  else if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy' }));
  }
  // Root endpoint - display basic info
  else if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head>
          <title>Predicta AI Chatbot</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #4F46E5; }
            p { line-height: 1.6; }
            code { background: #f4f4f8; padding: 2px 4px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>Predicta AI Chatbot</h1>
          <p>This server provides the AI chatbot backend for the Predicta platform.</p>
          <p>Use the <code>POST /api/chat</code> endpoint to interact with the chatbot.</p>
          <p>Example request:</p>
          <pre>
            {
              "query": "Tell me about Hedera Token Service"
            }
          </pre>
        </body>
      </html>
    `);
  }
  // Not found
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Start the server
server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log(`Health check: http://${HOST}:${PORT}/health`);
}); 