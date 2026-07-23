// ============================================
// Storm-MD — Sticker Commands
// ============================================

const commands = [
  {
    name: 'sticker',
    category: 'sticker',
    aliases: ['s', 'stiker', 'stick'],
    desc: 'Create sticker from image/video',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { text: `🖼️ *Sticker Maker*\n\nSend an image/video with caption:\n${global.prefix}sticker\n\nOr reply to an image with:\n${global.prefix}sticker` });
    }
  },
  {
    name: 'toimg',
    category: 'sticker',
    desc: 'Convert sticker to image',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { text: '🖼️ Reply to a sticker with .toimg to convert!' });
    }
  },
  {
    name: 'swm',
    category: 'sticker',
    desc: 'Sticker with watermark',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const [pack, author] = args.join(' ').split('|');
      await sock.sendMessage(from, { text: `🏷️ *Sticker Watermark*\n\nPack: ${pack || global.botName}\nAuthor: ${author || 'Storm'}` });
    }
  },
  {
    name: 'emojimix',
    category: 'sticker',
    desc: 'Mix two emojis',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const [emoji1, emoji2] = args;
      if (!emoji1 || !emoji2) return await sock.sendMessage(from, { text: '❌ Provide two emojis!\nExample: .emojimix 😂😭' });
      try {
        await sock.sendMessage(from, { image: { url: `https://emojiapi.dev/api/v1/${encodeURIComponent(emoji1+emoji2)}.png` }, caption: `🎭 *Emoji Mix*\n${emoji1} + ${emoji2}` });
      } catch {
        await sock.sendMessage(from, { text: `🎭 ${emoji1} + ${emoji2} = (Use https://emojikitchen.dev)` });
      }
    }
  }
];

module.exports = { commands };
