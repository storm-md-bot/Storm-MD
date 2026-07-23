// ============================================
// Storm-MD — AI Commands (Free APIs)
// ============================================

const axios = require('axios');

const commands = [
  {
    name: 'ai',
    category: 'ai',
    desc: 'Chat with AI (Gemini free)',
    execute: async (sock, msg, args) => {
      const query = args.join(' ') || 'hello';
      const from = msg.key.remoteJid;
      
      // Try Gemini API (free) or fallback
      try {
        const response = await axios.get(`https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(query)}&chatid=${from}`);
        const reply = response.data?.answer || response.data?.result || `🤖 *AI Response*\n\nSorry, API limit reached. Try free key: https://aistudio.google.com/apikey`;
        await sock.sendMessage(from, { text: `🤖 *${global.botName} AI*\n\n${reply}` });
      } catch (e) {
        await sock.sendMessage(from, { text: `🤖 *AI (Fallback)*\n\nSorry, I'm thinking... Try again!` });
      }
    }
  },
  {
    name: 'chatgpt',
    category: 'ai',
    aliases: ['gpt', 'openai'],
    desc: 'ChatGPT style AI',
    execute: async (sock, msg, args) => {
      const query = args.join(' ') || 'hello';
      const from = msg.key.remoteJid;
      try {
        const { data } = await axios.get(`https://api.ryzendesu.vip/api/ai/gpt4?text=${encodeURIComponent(query)}`);
        await sock.sendMessage(from, { text: `🧠 *ChatGPT*\n\n${data.answer || data.result || 'No response'}` });
      } catch {
        await sock.sendMessage(from, { text: `🧠 *ChatGPT*\n\n${query}? Interesting question! Use Google Gemini free API: aistudio.google.com` });
      }
    }
  },
  {
    name: 'imagine',
    category: 'ai',
    desc: 'Generate AI image',
    execute: async (sock, msg, args) => {
      const prompt = args.join(' ') || 'beautiful landscape';
      const from = msg.key.remoteJid;
      try {
        const { data } = await axios.get(`https://api.ryzendesu.vip/api/ai/text2image?prompt=${encodeURIComponent(prompt)}`);
        if (data?.url || data?.result) {
          await sock.sendMessage(from, { image: { url: data.url || data.result }, caption: `🎨 *AI Generated*\nPrompt: ${prompt}` });
        }
      } catch {
        await sock.sendMessage(from, { text: `🎨 *Imagine AI*\n\nPrompt: ${prompt}\n\nUse Pollinations AI (free): https://pollinations.ai` });
      }
    }
  }
];

module.exports = { commands };
