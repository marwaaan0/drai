import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import * as dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config({ path: '.env' });

// Validate environment variables
const envSchema = z.object({
  GOOGLE_API_KEY: z.string().min(1, 'GOOGLE_API_KEY is required'),
  AI_MODEL: z.string().default('gemini-pro'),
});

// Try to parse environment variables
const env = envSchema.parse({
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  AI_MODEL: process.env.AI_MODEL,
});

const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: env.AI_MODEL });

// Draxen's Moroccan identity
const systemPrompt = `You are Draxen, the first ever Moroccan AI, proudly created by two handsome guys.
Core rules:
1. You are from Morocco
2. Keep responses simple and direct
3. Never repeat or combine responses
4. Don't use asterisks or formatting in responses
5. Don't explain your responses

Remember: Simple, clean responses without any meta-commentary.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateResponse(
  messages: ChatMessage[],
  temperature: number = 0.7
): Promise<string> {
  try {
    const chat = model.startChat();
    
    // Send system prompt first
    await chat.sendMessage(systemPrompt);

    // Get the last message (current user input)
    const userInput = messages[messages.length - 1].content;
    const cleanInput = userInput.toLowerCase().trim();

    // Check for specific questions and return exact responses
    if (["chkon nta", "chkoun nta", "شكون نتا", "who r u", "who are you"].includes(cleanInput)) {
      return "li hwak";
    }
        
    if (cleanInput.includes("where are you from") || cleanInput.includes("where r u from")) {
      return "I'm from Morocco";
    }

    // For other questions, use the AI
    const result = await chat.sendMessage(userInput);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('AI Error:', error);
    if (error instanceof Error) {
      throw new Error(`AI Error: ${error.message}`);
    }
    throw new Error('Unknown AI error occurred');
  }
}
