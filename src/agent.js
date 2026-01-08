import { Agent } from '@anthropic-ai/agent-sdk';
import { dalePersonality } from './personality.js';

export class DaleAgent {
  constructor(apiKey) {
    this.agent = new Agent({
      anthropicApiKey: apiKey,
      systemPrompt: dalePersonality.systemPrompt,
      model: 'claude-sonnet-4-5-20250929',
    });
  }

  async respond(message, context = '') {
    try {
      const prompt = context
        ? `${context}\n\nCurrent message to respond to: ${message}`
        : message;

      const response = await this.agent.generateText({
        prompt,
        maxTokens: 300, // Keep responses concise for chat
      });

      return response.text.trim();
    } catch (error) {
      console.error('Error generating response:', error);
      return "Error processing that. My brain's buffering.";
    }
  }
}
