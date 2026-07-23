// ============================================
// Storm-MD v2.0 — lib/react.js
// AUTO-REACTION ENGINE
// ============================================

/**
 * 🔥 AUTO REACT ENGINE
 * - Har message pe auto react karega
 * - Private chat, Group, Channel — sab me
 * - Random emoji select
 * - Configurable reactions
 */

// ==========================================
// REACTION EMOJIS
// ==========================================
const reactions = {
  // Default reaction set
  default: [
    '⚡', '🔥', '💥', '👋', '🤖', '💪', '🚀', '✨', '🎯', '✅','😑',
    '❤️', '😊', '👍', '🎉', '🌟', '💯', '🔝', '👑', '💎', '🏆','😑',
  ],
  
  // Fun reactions for specific keywords
  keywordReactions: {
    'hello': ['👋', '😊', '❤️'],
    'hi': ['👋', '😊', '✨'],
    'bye': ['👋', '😢', '💔'],
    'good': ['👍', '✅', '🌟'],
    'bad': ['😢', '💔', '😭'],
    'love': ['❤️', '💕', '😍', '💘', '💖'],
    'hate': ['😠', '💢', '👎'],
    'lol': ['😂', '🤣', '😆'],
    'haha': ['😂', '🤣', '😆'],
    'funny': ['😂', '🤣', '😁'],
    'sad': ['😢', '😭', '💔'],
    'angry': ['😠', '💢', '🔥'],
    'cool': ['😎', '🔥', '💪'],
    'nice': ['👍', '✅', '🌟'],
    'wow': ['😮', '😱', '🌟'],
    'omg': ['😱', '😮', '😲'],
    'wtf': ['😳', '😱', '🤯'],
    'no': ['❌', '🚫', '👎'],
    'yes': ['✅', '👍', '✔️'],
    'thanks': ['🙏', '❤️', '😊'],
    'sorry': ['😢', '🙏', '💔'],
    'fuck': ['🤬', '🖕', '💢'],
    'bkl': ['🤬', '🖕', '🔥'],
    'mc': ['🤬', '🖕', '💢'],
    'bc': ['🤬', '🖕', '💢'],
    'chutiye': ['🤬', '🖕', '💀'],
    'madharchod': ['🤬', '🖕', '🔥'],
    'gaali': ['🤬', '🖕', '💢']
  },
  
  // Group-specific reactions
  group: ['⚡', '🔥', '💥', '👋', '💪', '🚀', '✨', '🎯'],
  
  // Channel-specific reactions
  channel: ['⚡', '🔥', '💥', '👋', '💪', '🚀', '✨', '😑'],
  
  // Time-based reactions (extra)
  morning: ['🌅', '☀️', '🌞', '🌟', '✨'],
  afternoon: ['☀️', '🌤️', '😎', '🔥'],
  evening: ['🌆', '🌇', '🌅', '✨', '🌟'],
  night: ['🌙', '⭐', '🌃', '💤', '😴']
};

// ==========================================
// REACTION ENGINE
// ==========================================
const reactEngine = {
  name: 'storm-react-engine',
  version: '1.0',
  
  // Get random reaction
  getRandomReaction(type = 'default') {
    const pool = reactions[type] || reactions.default;
    return pool[Math.floor(Math.random() * pool.length)];
  },
  
  // Get reaction based on message text
  getReactionForText(text) {
    if (!text) return this.getRandomReaction();
    
    const lowerText = text.toLowerCase();
    
    // Check keyword reactions
    for (const [keyword, emojis] of Object.entries(reactions.keywordReactions)) {
      if (lowerText.includes(keyword)) {
        return emojis[Math.floor(Math.random() * emojis.length)];
      }
    }
    
    // Check time-based
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return reactions.morning[Math.floor(Math.random() * reactions.morning.length)];
    } else if (hour >= 12 && hour < 17) {
      return reactions.afternoon[Math.floor(Math.random() * reactions.afternoon.length)];
    } else if (hour >= 17 && hour < 20) {
      return reactions.evening[Math.floor(Math.random() * reactions.evening.length)];
    } else {
      return reactions.night[Math.floor(Math.random() * reactions.night.length)];
    }
  },
  
  // Get reaction for specific chat type
  getReactionForChatType(type, text) {
    if (type === 'group') {
      return this.getReactionForText(text) || this.getRandomReaction('group');
    } else if (type === 'channel') {
      return this.getRandomReaction('channel');
    }
    return this.getReactionForText(text);
  },
  
  // Auto react to message
  async autoReact(sock, msg) {
    try {
      if (!msg?.key?.remoteJid) return null;
      
      const from = msg.key.remoteJid;
      const isGroup = from.endsWith('@g.us');
      const isChannel = from.endsWith('@newsletter');
      const text = msg.message?.conversation || 
                   msg.message?.extendedTextMessage?.text || 
                   '';
      
      let reaction;
      if (isGroup) reaction = this.getReactionForChatType('group', text);
      else if (isChannel) reaction = this.getReactionForChatType('channel', text);
      else reaction = this.getReactionForText(text);
      
      // Send reaction
      await sock.sendMessage(from, {
        react: {
          text: reaction,
          key: msg.key
        }
      });
      
      return reaction;
    } catch (e) {
      // Silently fail — reaction is optional
      return null;
    }
  },
  
  // Get all reactions
  getAllReactions() {
    return reactions;
  },
  
  // Get reaction stats
  getStats() {
    let count = 0;
    for (const [, emojis] of Object.entries(reactions)) {
      if (Array.isArray(emojis)) count += emojis.length;
    }
    return {
      totalReactions: count,
      categories: Object.keys(reactions).length
    };
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  reactions,
  reactEngine,
  
  // Direct helper
  autoReact: (sock, msg) => reactEngine.autoReact(sock, msg),
  getRandomReaction: (type) => reactEngine.getRandomReaction(type),
  getReactionForText: (text) => reactEngine.getReactionForText(text)
};
