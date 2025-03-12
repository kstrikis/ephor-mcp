import { z } from 'zod';

// Define the schema for an LLM response
export const LlmResponseSchema = z.object({
  llmId: z.string().describe('Unique identifier for the LLM'),
  prompt: z.string().describe('The original prompt given to the LLM'),
  response: z.string().describe('The LLM\'s response to the prompt'),
  timestamp: z.number().describe('Unix timestamp when the response was created'),
});

// Type for an LLM response
export type LlmResponse = z.infer<typeof LlmResponseSchema>;

// Schema for the submit response tool
export const SubmitResponseSchema = z.object({
  llmId: z.string().describe('Unique identifier for the LLM'),
  prompt: z.string().describe('The original prompt given to the LLM'),
  response: z.string().describe('The LLM\'s response to the prompt'),
});

// Schema for the get responses tool
export const GetResponsesSchema = z.object({
  prompt: z.string().optional().describe('Optional: Filter responses by prompt'),
}); 