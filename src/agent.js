import Anthropic from '@anthropic-ai/sdk';
import { dalePersonality } from './personality.js';

export class DaleAgent {
  constructor(apiKey) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
    this.systemPrompt = dalePersonality.systemPrompt;
    this.model = 'claude-sonnet-4-5-20250929';
  }

  async respond(message, context = '') {
    try {
      const userMessage = context
        ? `${context}\n\nCurrent message to respond to: ${message}`
        : message;

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 300, // Keep responses concise for chat
        system: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      return response.content[0].text.trim();
    } catch (error) {
      // Log error type/message but not full stack trace with sensitive details
      console.error('Error generating response:', error.message || 'Unknown error');
      return "Error processing that. My brain's buffering.";
    }
  }
}
