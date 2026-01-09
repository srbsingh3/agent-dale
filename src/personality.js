import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load system prompt from markdown file
function loadSystemPrompt() {
  try {
    const promptPath = join(__dirname, '..', 'SOUL.md');
    return readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.error('Error loading system prompt:', error);
    throw new Error('Failed to load SOUL.md');
  }
}

export const dalePersonality = {
  systemPrompt: loadSystemPrompt()
};
