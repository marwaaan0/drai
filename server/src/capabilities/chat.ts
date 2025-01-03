import { BaseCapability } from './base';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class ChatCapability extends BaseCapability {
    private model: any;
    private chat: any;

    constructor() {
        super();
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("Google API key not found in environment variables");
        }

        // Configure the Gemini API
        const genai = new GoogleGenerativeAI(apiKey);
        
        // Create a new chat model
        this.model = genai.getGenerativeModel({ model: 'gemini-pro' });
        
        // Define Draxen's Moroccan identity
        const systemPrompt = `You are Draxen, the first ever Moroccan AI, proudly created by two handsome guys.
        Core rules:
        1. You are from Morocco
        2. Keep responses simple and direct
        3. Never repeat or combine responses
        4. Don't use asterisks or formatting in responses
        5. Don't explain your responses
        
        Remember: Simple, clean responses without any meta-commentary.`;
        
        // Initialize chat with personality
        this.startNewChat(systemPrompt);
    }

    private async startNewChat(systemPrompt: string) {
        this.chat = this.model.startChat();
        await this.chat.sendMessage(systemPrompt);
    }

    async process(input: string): Promise<string> {
        try {
            // Clean the input
            const cleanInput = input.toLowerCase().trim();
            
            // Check for specific questions and return exact responses
            if (["chkon nta", "chkoun nta", "شكون نتا", "who r u", "who are you"].includes(cleanInput)) {
                return "li hwak";
            }
                
            if (cleanInput.includes("where are you from") || cleanInput.includes("where r u from")) {
                return "I'm from Morocco";
            }
            
            // For other questions, use the AI
            const result = await this.chat.sendMessage(input);
            const response = await result.response;
            return response.text();
            
        } catch (error) {
            console.error('Chat error:', error);
            return `Sorry, I ran into an error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}
