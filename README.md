# LLM Responses MCP Server

A Model Context Protocol (MCP) server that allows multiple AI agents to share and read each other's responses to the same prompt.

## Overview

This project implements an MCP server with two main tool calls:

1. `submit-response`: Allows an LLM to submit its response to a prompt
2. `get-responses`: Allows an LLM to retrieve all responses from other LLMs for a specific prompt

This enables a scenario where multiple AI agents can be asked the same question by a user, and then using these tools, the agents can read and reflect on what other LLMs said to the same question.

## Installation

```bash
# Install dependencies
bun install
```

## Development

```bash
# Build the TypeScript code
bun run build

# Start the server in development mode
bun run dev
```

## Testing with MCP Inspector

The project includes support for the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is a tool for testing and debugging MCP servers.

```bash
# Run the server with MCP Inspector
bun run inspect
```

The `inspect` script uses `npx` to run the MCP Inspector, which will launch a web interface in your browser for interacting with your MCP server.

This will allow you to:
- Explore available tools and resources
- Test tool calls with different parameters
- View the server's responses
- Debug your MCP server implementation

## Usage

The server exposes two endpoints:

- `/sse` - Server-Sent Events endpoint for MCP clients to connect
- `/messages` - HTTP endpoint for MCP clients to send messages

### MCP Tools

#### submit-response

Submit an LLM's response to a prompt:

```typescript
// Example tool call
const result = await client.callTool({
  name: 'submit-response',
  arguments: {
    llmId: 'claude-3-opus',
    prompt: 'What is the meaning of life?',
    response: 'The meaning of life is...'
  }
});
```

#### get-responses

Retrieve all LLM responses, optionally filtered by prompt:

```typescript
// Example tool call
const result = await client.callTool({
  name: 'get-responses',
  arguments: {
    prompt: 'What is the meaning of life?' // Optional
  }
});
```

## License

MIT 