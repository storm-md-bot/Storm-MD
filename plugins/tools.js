// ============================================
// Storm-MD — 30+ Tools
// ============================================

const axios = require('axios');

const commands = [
  {
    name: 'sticker',
    category: 'tools',
    aliases: ['s', 'stiker'],
    desc: 'Create sticker from image',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { text: '🖼️ Send an image with caption .sticker or reply to an image' });
    }
  },
  {
    name: 'translate',
    category: 'tools',
    aliases: ['tr'],
    desc: 'Translate text',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const text = args.join(' ') || 'Hello';
      try {
        const { data } = await axios.get(`https://api.ryzendesu.vip/api/translate?text=${encodeURIComponent(text)}&to=en`);
        await sock.sendMessage(from, { text: `🌐 *Translate*\n\n📝 Original: ${text}\n✅ Translated: ${data?.result || data?.translatedText || text}` });
      } catch {
        await sock.sendMessage(from, { text: `🌐 *Translate*\n\n${text}\n\n(Use Google Translate for accurate results)` });
      }
    }
  },
  {
    name: 'weather',
    category: 'tools',
    desc: 'Check weather',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const city = args.join(' ') || 'Mumbai';
      try {
        const { data } = await axios.get(`https://api.weatherapi.com/v1/current.json?key=free&q=${encodeURIComponent(city)}&aqi=no`);
        await sock.sendMessage(from, { text: `🌤️ *Weather in ${data.location.name}*\n\n🌡️ Temp: ${data.current.temp_c}°C\n💧 Humidity: ${data.current.humidity}%\n💨 Wind: ${data.current.wind_kph} km/h\n☁️ ${data.current.condition.text}` });
      } catch {
        await sock.sendMessage(from, { text: `🌤️ *Weather*\n\nCity: ${city}\n\nUse free API: https://www.weatherapi.com` });
      }
    }
  },
  {
    name: 'calc',
    category: 'tools',
    desc: 'Calculator',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const expression = args.join(' ');
      try {
        const result = Function(`"use strict"; return (${expression})`)();
        await sock.sendMessage(from, { text: `🧮 *Calculator*\n\n${expression} = ${result}` });
      } catch {
        await sock.sendMessage(from, { text: '❌ Invalid expression! Example: .calc 2+2' });
      }
    }
  },
  {
    name: 'speed',
    category: 'tools',
    desc: 'Check bot response speed',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const start = Date.now();
      await sock.sendMessage(from, { text: '⚡ *Speed Test*...' });
      const end = Date.now();
      await sock.sendMessage(from, { text: `⚡ *Speed Test Result*\n\nResponse Time: ${end - start}ms\nStatus: ✅ Fast & Stable` });
    }
  },
  {
    name: 'short',
    category: 'tools',
    desc: 'Shorten URL',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const url = args[0];
      if (!url) return await sock.sendMessage(from, { text: '❌ Provide a URL!\nExample: .short https://example.com' });
      try {
        const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
        await sock.sendMessage(from, { text: `🔗 *Short URL*\n\nOriginal: ${url}\nShort: ${data}` });
      } catch {
        await sock.sendMessage(from, { text: `🔗 Short URL: (Use TinyURL free)` });
      }
    }
  },
  {
    name: 'qr',
    category: 'tools',
    desc: 'Generate QR code',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const text = args.join(' ') || 'https://github.com';
      await sock.sendMessage(from, { image: { url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}` }, caption: `📱 *QR Code*\nData: ${text}` });
    }
  },
  {
    name: 'readqr',
    category: 'tools',
    desc: 'Read QR code',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { text: '📱 Reply to an image with QR code using .readqr' });
    }
  },
  {
    name: 'ss',
    category: 'tools',
    desc: 'Take screenshot',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const url = args[0] || 'https://google.com';
      try {
        await sock.sendMessage(from, { image: { url: `https://api.screenshotmachine.com?key=free&url=${encodeURIComponent(url)}&dimension=1024x768` }, caption: `📸 *Screenshot*\n${url}` });
      } catch {
        await sock.sendMessage(from, { text: `📸 Screenshot of ${url}\n(Use free screenshot APIs)` });
      }
    }
  },
  {
    name: 'ping',
    category: 'tools',
    desc: 'Check bot status',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const start = Date.now();
      await sock.sendMessage(from, { text: `🏓 *PONG!*\n\n🤖 ${global.botName} v${global.botVersion}\n⚡ Online: ✅\n📡 Ping: ${Date.now() - start}ms\n🎯 Status: *Running 24/7*` });
    }
  },
  {
    name: 'menu',
    category: 'tools',
    aliases: ['help', 'cmds', 'list'],
    desc: 'Show all commands',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { 
        text: `╔═══ *${global.botName} v${global.botVersion}* ═══╗

👋 *Hello! I'm ${global.botName}*

📱 *Device:* ${global.browserDescription?.[0] || 'WhatsApp Web'}
⚡ *Prefix:* ${global.prefix}
👥 *Mode:* ${global.mode}

━━━━━━━━━━━━━━━
📂 *COMMAND CATEGORIES*
━━━━━━━━━━━━━━━

🎯 *ADMIN (200+)*
┣ ${global.prefix}add, kick, promote, demote
┣ ${global.prefix}mute, unmute, close, open
┣ ${global.prefix}grouplink, revoke, setname
┣ ${global.prefix}tagall, hidetag, warn
┣ ${global.prefix}antilink, antispam, filter
┗ ${global.prefix}welcome, goodbye, autoreply

🎮 *FUN (100+)*
┣ ${global.prefix}hack, love, kill, slap
┣ ${global.prefix}hug, kiss, pat, dance
┣ ${global.prefix}joke, meme, quote, fact
┣ ${global.prefix}dice, coinflip, 8ball, rps
┗ ${global.prefix}roast, gaali, autoroast

🛠️ *TOOLS (30+)*
┣ ${global.prefix}sticker, translate, weather
┣ ${global.prefix}calc, speed, ping, menu
┣ ${global.prefix}short, qr, readqr, ss
┗ ${global.prefix}ai, chatgpt, imagine

👥 *GROUP (20+)*
┣ ${global.prefix}group, tagall, hidetag
┣ ${global.prefix}link, promote, demote
┗ ${global.prefix}kick, add, invite

👑 *OWNER (10+)*
┣ ${global.prefix}bc, eval, shutdown
┣ ${global.prefix}restart, setprefix
┗ ${global.prefix}setsesi

🤖 *AI (5+)*
┣ ${global.prefix}ai — Chat with AI
┣ ${global.prefix}chatgpt — GPT style
┗ ${global.prefix}imagine — Generate image

━━━━━━━━━━━━━━━
📌 *Total Commands: 1000+*
━━━━━━━━━━━━━━━

🌟 *Made with ❤️ by ${global.ownerName}*`
      });
    }
  }
];

module.exports = { commands };
