# Agent Dale 🤖

A witty, sarcastic WhatsApp agent powered by Claude Agent SDK. Dale is your AI friend who loves playful banter and never holds back.

## Features

- **Personality**: Witty and sarcastic friend who engages in playful banter
- **Easy Customization**: Edit `system-prompt.md` to change Dale's personality - no code required!
- **Smart Activation**: Responds when @mentioned or when name "dale" is mentioned in messages
- **Memory**: Remembers recent conversation context for better responses
- **Group Chat Native**: Built specifically for WhatsApp group dynamics
- **Natural Conversation**: No commands, just natural chat flow

## Prerequisites

- Node.js (v18 or higher)
- An Anthropic API key ([get one here](https://console.anthropic.com/))
- A WhatsApp account (for the bot to use)

## Installation

1. **Clone and navigate to the project:**
   ```bash
   cd agent-dale
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your environment:**
   ```bash
   cp .env.example .env
   ```

4. **Add your Anthropic API key to `.env`:**
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

## Running Dale

1. **Start the agent:**
   ```bash
   npm start
   ```

2. **Scan the QR code** that appears in your terminal with WhatsApp (like you're linking a device)

3. **Add Dale to your group** - The WhatsApp account you linked is now Dale!

4. **Start chatting** - Mention @Dale or just use the name "dale" in messages

## How Dale Responds

Dale will respond when:
- Someone @mentions the bot
- Someone says "dale" or "Dale" in a message

Dale won't spam - there's a 5-second cooldown between responses to keep things natural.

## Usage Examples

- "hey dale, what do you think about this?"
- "@Dale thoughts?"
- "dale you seeing this?"
- "someone get dale's opinion on this"

Dale will jump into the conversation with witty, sarcastic responses based on the context.

## Configuration

### Optional Settings in `.env`:

```bash
# Change the agent name (default: Dale)
AGENT_NAME=Dale

# Restrict to specific groups (comma-separated group IDs)
# Leave blank to respond in all groups
ALLOWED_GROUP_IDS=

# Example with specific groups:
# ALLOWED_GROUP_IDS=123456789@g.us,987654321@g.us
```

### Finding Group IDs

If you want to restrict Dale to specific groups:

1. Add this line in `src/index.js` inside the `handleMessage` function (after `const groupId = chat.id._serialized;`):
   ```javascript
   console.log('Group ID:', groupId, 'Name:', chat.name);
   ```

2. Run Dale and watch the console when messages come in
3. Copy the group IDs you want and add them to `.env`

## Project Structure

```
agent-dale/
├── src/
│   ├── index.js          # Main bot & WhatsApp integration
│   ├── agent.js          # Claude Agent SDK wrapper
│   ├── personality.js    # Loads system prompt
│   └── memory.js         # Conversation memory system
├── system-prompt.md      # Dale's personality (EDIT THIS!)
├── .env                  # Your configuration (not in git)
├── .env.example          # Example configuration
├── package.json          # Dependencies
└── README.md            # This file
```

## Customizing Dale's Personality

Want to change Dale's vibe? Simply edit `system-prompt.md` in the root directory:

- Change personality traits (witty, supportive, chaotic, etc.)
- Adjust response length guidelines
- Modify humor style, emoji usage, formality level
- Add or remove behavioral guidelines

Example changes:
```markdown
# Make Dale more encouraging instead of sarcastic
You are Dale, an enthusiastic and supportive friend...

# Make Dale speak like a pirate
You are Dale, a witty pirate friend who speaks in pirate slang...

# Make Dale more professional
You are Dale, a helpful and professional assistant...
```

**No code changes needed** - just edit the markdown file and restart Dale!

## Tips for Using Dale

1. **Mention naturally** - Just say "dale" in your message, no need to @ every time
2. **Context matters** - Dale remembers the last 20 messages, so callbacks and references work great
3. **Let conversations flow** - Dale will chime in when mentioned, just like a real friend would
4. **Cooldown is intentional** - Prevents Dale from dominating the chat
5. **Be specific** - If you want Dale's take on something specific, mention it clearly

## Troubleshooting

### QR Code won't scan
- Make sure you're using WhatsApp on your phone (not another linked device)
- The QR code expires quickly - restart if needed

### Dale isn't responding
- Check that messages mention "dale" or @mention the bot
- Verify your API key is correct in `.env`
- Check the console for errors

### "Error: Cannot find module"
- Run `npm install` again
- Make sure you're using Node.js v18+

### Rate limits / API errors
- You might be hitting Anthropic API rate limits
- Consider increasing the `MESSAGE_COOLDOWN` in `src/index.js`

## Development

Run with auto-reload during development:
```bash
npm run dev
```

## Privacy & Security

- **Auth files**: WhatsApp session data is stored locally in `.wwebjs_auth/` (not committed to git)
- **Conversation memory**: Stored in-memory only, cleared on restart
- **API key**: Never commit your `.env` file

## Contributing

Feel free to fork and customize Dale for your friend group! Some ideas:
- Integrate with APIs (weather, news, sports scores, etc.)
- Add image/GIF responses
- Create different personality modes
- Add multi-language support

## License

MIT - Do whatever you want with Dale!

---

**Note**: This uses `whatsapp-web.js` which is an unofficial WhatsApp library. Use at your own risk and be respectful of WhatsApp's terms of service.
