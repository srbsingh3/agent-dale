# Agent Dale

**Your brutally honest, delightfully sarcastic AI friend for WhatsApp group chats.**

Dale isn't your typical helpful assistant. He's the friend who roasts you with love, drops unsolicited opinions, and somehow makes your group chat 10x more entertaining.

## What Makes Dale... Dale

- Sarcastic wit that hits just right
- Zero filter, maximum entertainment
- Actually helpful (when he feels like it)
- Remembers context so his comebacks land perfectly

## Quick Start

```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm start
```

Scan the QR code with WhatsApp, add Dale to your group, and watch the chaos unfold.

## Summoning Dale

Just mention him naturally:
- "dale what do you think?"
- "@Dale thoughts?"
- "someone get dale in here"

He'll respond. Whether you like it or not.

## Make Dale Your Own

Edit `system-prompt.md` to tweak his personality. Make him nicer (boring), meaner (risky), or give him a pirate accent (chaotic). No code changes needed.

## Project Structure

```
src/
├── index.js      # WhatsApp integration
├── agent.js      # Claude Agent SDK wrapper
├── personality.js # Loads the sass
└── memory.js     # Remembers your mistakes
```

---

Built with [Claude Agent SDK](https://github.com/anthropics/anthropic-sdk-python) and [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).

MIT License - Do whatever you want with Dale. He doesn't care.
