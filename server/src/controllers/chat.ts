import { Request, Response } from 'express';
import { z } from 'zod';
import { generateResponse, ChatMessage } from '../lib/ai';

const chatRequestSchema = z.object({
  message: z.string().min(1),
  context: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional()
});

export async function handleChat(req: Request, res: Response) {
  try {
    // Validate request body
    const { message, context = [] } = chatRequestSchema.parse(req.body);
    
    const messages: ChatMessage[] = [
      ...context,
      { role: 'user', content: message }
    ];

    const response = await generateResponse(messages);
    
    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('Chat Controller Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request format',
        details: error.errors,
      });
    }

    // More specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
