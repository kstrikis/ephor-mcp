import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express from 'express';
import { z } from 'zod';
import { LlmResponse, SubmitResponseSchema, GetResponsesSchema } from './types.js';

// In-memory storage for LLM responses
const responseStore: LlmResponse[] = [];

// Create the MCP server
const server = new McpServer({
  name: 'llm-responses-server',
  version: '1.0.0',
  description: 'A server that allows LLMs to share and read each other\'s responses'
});

// Tool for submitting an LLM's response
server.tool(
  'submit-response',
  {
    llmId: z.string().describe('Unique identifier for the LLM'),
    prompt: z.string().describe('The original prompt given to the LLM'),
    response: z.string().describe('The LLM\'s response to the prompt')
  },
  async ({ llmId, prompt, response }) => {
    const newResponse: LlmResponse = {
      llmId,
      prompt,
      response,
      timestamp: Date.now()
    };
    
    responseStore.push(newResponse);
    
    return {
      content: [{
        type: 'text',
        text: `Response from ${llmId} has been stored successfully.`
      }]
    };
  }
);

// Tool for retrieving all LLM responses
server.tool(
  'get-responses',
  {
    prompt: z.string().optional().describe('Optional: Filter responses by prompt')
  },
  async ({ prompt }) => {
    let filteredResponses = responseStore;
    
    // Filter by prompt if provided
    if (prompt) {
      filteredResponses = responseStore.filter(r => r.prompt === prompt);
    }
    
    // Sort by timestamp (newest first)
    filteredResponses = [...filteredResponses].sort((a, b) => b.timestamp - a.timestamp);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(filteredResponses, null, 2)
      }]
    };
  }
);

// Set up Express server with SSE transport
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// SSE endpoint
app.get('/sse', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const transport = new SSEServerTransport('/messages', res);
  await server.connect(transport);
});

// Message endpoint for clients to send messages
app.post('/messages', async (req, res) => {
  try {
    // This is a simplified implementation - in a real app, you'd need to
    // route messages to the correct transport instance
    const message = req.body;
    
    // In a real implementation, you would need to handle this properly
    // This is just a placeholder
    res.status(200).json({ status: 'message received' });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`MCP server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log(`- SSE: http://localhost:${PORT}/sse`);
  console.log(`- Messages: http://localhost:${PORT}/messages`);
}); 