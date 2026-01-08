export class ConversationMemory {
  constructor(maxMessages = 20) {
    this.maxMessages = maxMessages;
    this.conversations = new Map(); // groupId -> messages array
  }

  addMessage(groupId, sender, message) {
    if (!this.conversations.has(groupId)) {
      this.conversations.set(groupId, []);
    }

    const messages = this.conversations.get(groupId);
    messages.push({
      sender,
      message,
      timestamp: Date.now()
    });

    // Keep only recent messages
    if (messages.length > this.maxMessages) {
      messages.shift();
    }
  }

  getContext(groupId, includeLastN = 10) {
    const messages = this.conversations.get(groupId) || [];
    const recentMessages = messages.slice(-includeLastN);

    if (recentMessages.length === 0) {
      return "No recent conversation history.";
    }

    return "Recent conversation:\n" +
      recentMessages
        .map(m => `${m.sender}: ${m.message}`)
        .join('\n');
  }

  clear(groupId) {
    this.conversations.delete(groupId);
  }

  clearAll() {
    this.conversations.clear();
  }
}
