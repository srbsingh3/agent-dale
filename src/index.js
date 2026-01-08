import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import dotenv from 'dotenv';
import { DaleAgent } from './agent.js';
import { ConversationMemory } from './memory.js';

dotenv.config();

// Configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const AGENT_NAME = process.env.AGENT_NAME || 'Dale';
const ALLOWED_GROUP_IDS = process.env.ALLOWED_GROUP_IDS?.split(',').filter(Boolean) || [];

if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY not found in .env file');
  process.exit(1);
}

// Initialize components
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

const daleAgent = new DaleAgent(ANTHROPIC_API_KEY);
const memory = new ConversationMemory(20);

// Track message processing to avoid loops
const processedMessages = new Set();
const MESSAGE_COOLDOWN = 5000; // 5 seconds between responses
const lastResponseTime = new Map();

// Helper functions
function shouldRespondToMessage(message, groupId) {
  // Don't respond to own messages
  if (message.fromMe) return false;

  // Check if we've already processed this message
  if (processedMessages.has(message.id._serialized)) return false;

  // Check cooldown period
  const lastResponse = lastResponseTime.get(groupId);
  if (lastResponse && Date.now() - lastResponse < MESSAGE_COOLDOWN) {
    return false;
  }

  // If ALLOWED_GROUP_IDS is set, only respond in those groups
  if (ALLOWED_GROUP_IDS.length > 0 && !ALLOWED_GROUP_IDS.includes(groupId)) {
    return false;
  }

  const body = message.body.toLowerCase();
  const agentNameLower = AGENT_NAME.toLowerCase();

  // Respond if mentioned by @tag or name
  const mentionedIds = message.mentionedIds || [];
  const isMentioned = mentionedIds.length > 0; // If there are any mentions, check if it's us
  const nameInMessage = body.includes(agentNameLower);

  return isMentioned || nameInMessage;
}

async function handleMessage(message) {
  try {
    const chat = await message.getChat();

    // Only respond in group chats
    if (!chat.isGroup) {
      return;
    }

    const groupId = chat.id._serialized;
    const contact = await message.getContact();
    const senderName = contact.pushname || contact.name || 'Someone';
    const messageBody = message.body;

    // Store message in memory
    memory.addMessage(groupId, senderName, messageBody);

    // Check if we should respond
    if (!shouldRespondToMessage(message, groupId)) {
      return;
    }

    // Mark message as processed
    processedMessages.add(message.id._serialized);

    // Clean up old processed messages (keep last 100)
    if (processedMessages.size > 100) {
      const toDelete = Array.from(processedMessages).slice(0, 50);
      toDelete.forEach(id => processedMessages.delete(id));
    }

    // Show typing indicator
    chat.sendStateTyping();

    // Get conversation context
    const context = memory.getContext(groupId, 10);

    // Generate response
    const response = await daleAgent.respond(messageBody, context);

    // Send response
    if (response) {
      await chat.sendMessage(response);
      lastResponseTime.set(groupId, Date.now());

      // Store Dale's response in memory too
      memory.addMessage(groupId, AGENT_NAME, response);
    }

  } catch (error) {
    console.error('Error handling message:', error);
  }
}

// WhatsApp Client Event Handlers
client.on('qr', (qr) => {
  console.log('\n🔐 Scan this QR code with WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\nWaiting for QR code scan...\n');
});

client.on('ready', () => {
  console.log('✅ Dale is ready and lurking in your groups!');
  console.log(`📱 Responding to: @mentions and messages containing "${AGENT_NAME}"\n`);
});

client.on('authenticated', () => {
  console.log('🔑 Authenticated successfully');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failure:', msg);
});

client.on('disconnected', (reason) => {
  console.log('⚠️  Disconnected:', reason);
  memory.clearAll();
});

client.on('message', handleMessage);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Shutting down Dale...');
  await client.destroy();
  process.exit(0);
});

// Initialize
console.log('🚀 Starting Dale...\n');
client.initialize();
