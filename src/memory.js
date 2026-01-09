export class ConversationMemory {
  constructor(maxMessages = 20, maxGroups = 100) {
    this.maxMessages = maxMessages;
    this.maxGroups = maxGroups; // Prevent unbounded memory growth
    this.conversations = new Map(); // groupId -> messages array
  }

  addMessage(groupId, sender, message) {
    // If group doesn't exist and we're at capacity, evict oldest group (LRU)
    if (!this.conversations.has(groupId) && this.conversations.size >= this.maxGroups) {
      const oldestGroup = this.conversations.keys().next().value;
      this.conversations.delete(oldestGroup);
    }

    if (!this.conversations.has(groupId)) {
      this.conversations.set(groupId, []);
    }

    // Move group to end of Map (most recently used)
    const messages = this.conversations.get(groupId);
    this.conversations.delete(groupId);
    this.conversations.set(groupId, messages);

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
