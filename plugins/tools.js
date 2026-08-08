// ============================================
// Storm-MD — Tools (30+)
// ============================================
const axios = require('axios');

const commands = [
  { name: 'menu', aliases: ['help', 'cmds', 'list'], category: 'tools', desc: '📋 All commands',
    execute: async (sock, msg, args, ctx) => {
      const from = ctx.from;
      const cats = {};
      ctx.commands.forEach((c) => { const k = c.category || 'other'; (cats[k] = cats[k] || []).push(c.name); });
      let txt = `╔══ *${global.botName} v${global.botVersion}* ══╗\n\n😈 *Demon God Edition*\n📱 Device: Kali Linux\n⚡ Prefix: ${global.prefix}\n\n`;
      for (const [cat, cmds] of Object.entries(cats)) {
        txt += `━━━━━━━━━━━━\n📂 *${cat.toUpperCase()} (${cmds.length})*\n━━━━━━━━━━━━\n`;
        txt += cmds.map(c => `▸ ${global.prefix}${c}`).join('\n') + '\n\n';
      }
      txt += `✅ *Total: ${ctx.commands.size}+ commands*\n😈 Made by ${global.ownerName}`;
      sock.sendMessage(from, { text: txt });
    } },
  { name: 'ping', aliases: ['pong', 'alive'], category: 'tools', desc: '🏓 Bot alive?',
    execute: async (sock, msg) => {
      const start = Date.now();
      await sock.sendMessage(msg.key.remoteJid, { text: '🏓 PONG!' });
      sock.sendMessage(msg.key.remoteJid, { text: `⚡ ${Date.now() - start}ms | ${global.botName} v${global.botVersion} ONLINE 24/7` });
    } },
  { name: 'speed', aliases: ['speedtest'], category: 'tools', desc: '⚡ Response speed',
    execute: async (sock, msg) => {
      const start = Date.now();
      sock.sendMessage(msg.key.remoteJid, { text: `⚡ Response: ${Date.now() - start}ms ✅ Fast` });
    } },
  { name: 'weather', aliases: ['wt'], category: 'tools', desc: '🌤️ Weather (FREE API)',
    execute: async (sock, msg, args) => {
      const city = args.join(' ') || 'Abidjan';
      const key = global.apiKeys.weather;
      try {
        const { data } = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(city)}&aqi=no`);
        sock.sendMessage(msg.key.remoteJid, {
          text: `🌤️ *${data.location.name}, ${data.location.country}*\n🌡️ ${data.current.temp_c}°C\n💧 ${data.current.humidity}%\n💨 ${data.current.wind_kph} km/h\n☁️ ${data.current.condition.text}`
        });
      } catch {
        sock.sendMessage(msg.key.remoteJid, { text: `❌ "${city}" nahi mila. .weather Abidjan try karo` });
      }
    } },
  { name: 'calc', aliases: ['math'], category: 'tools', desc: '🧮 Calculator',
    execute: async (sock, msg, args) => {
      const expr = args.join(' ').replace(/[^0-9+\-*/.()%\s]/g, '');
      try { sock.sendMessage(msg.key.remoteJid, { text: `🧮 ${expr} = ${Function('"use strict";return(' + expr + ')')()}` }); }
      catch { sock.sendMessage(msg.key.remoteJid, { text: '❌ .calc 2+2*3' }); }
    } },
  { name: 'sticker', aliases: ['s', 'stiker'], category: 'tools', desc: '🖼️ Sticker banao (image reply)',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted?.imageMessage) return sock.sendMessage(from, { text: '🖼️ Image pe reply karke .sticker bhejo!' });
      try {
        const buff = await sock.downloadMediaMessage({ key: msg.key, message: { imageMessage: quoted.imageMessage } });
        await sock.sendMessage(from, { sticker: buff });
      } catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'toimg', aliases: ['toimage'], category: 'tools', desc: '🖼️ Sticker → image',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted?.stickerMessage) return sock.sendMessage(from, { text: '❌ Sticker pe reply karke .toimg karo!' });
      try {
        const buff = await sock.downloadMediaMessage({ key: msg.key, message: { stickerMessage: quoted.stickerMessage } });
        await sock.sendMessage(from, { image: buff });
      } catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'translate', aliases: ['tr'], category: 'tools', desc: '🌐 Translate → English',
    execute: async (sock, msg, args) => {
      const text = args.join(' ') || 'Hello';
      try {
        const { data } = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`);
        const t = data.responseData?.translatedText || text;
        sock.sendMessage(msg.key.remoteJid, { text: `🌐 *Translate:*\n${t}` });
      } catch { sock.sendMessage(msg.key.remoteJid, { text: '🌐 ' + text }); }
    } },
  { name: 'short', aliases: ['shorturl'], category: 'tools', desc: '🔗 Short URL',
    execute: async (sock, msg, args) => {
      const url = args[0];
      if (!url) return sock.sendMessage(msg.key.remoteJid, { text: '❌ .short https://example.com' });
      try { const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`); sock.sendMessage(msg.key.remoteJid, { text: '🔗 ' + data }); }
      catch { sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid URL' }); }
    } },
  { name: 'qr', aliases: ['qrcode'], category: 'tools', desc: '📱 QR code banao',
    execute: async (sock, msg, args) => {
      const text = args.join(' ') || 'https://github.com/storm-md-bot/Storm-MD';
      sock.sendMessage(msg.key.remoteJid, { image: { url: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(text)}` }, caption: '📱 QR Code' });
    } },
  { name: 'base64', aliases: ['b64'], category: 'tools', desc: '🔐 Base64 encode/decode',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const mode = args[0]?.toLowerCase();
      const text = args.slice(1).join(' ');
      if (!text) return sock.sendMessage(from, { text: '❌ .base64 encode Hello | .base64 decode SGVsbG8=' });
      try {
        if (mode === 'decode') sock.sendMessage(from, { text: '🔓 ' + Buffer.from(text, 'base64').toString('utf-8') });
        else sock.sendMessage(from, { text: '🔐 ' + Buffer.from(text).toString('base64') });
      } catch { sock.sendMessage(from, { text: '❌ Invalid base64' }); }
    } },
  { name: 'hash', aliases: ['md5'], category: 'tools', desc: '🔒 MD5 hash',
    execute: async (sock, msg, args) => {
      const crypto = require('crypto');
      sock.sendMessage(msg.key.remoteJid, { text: '🔒 *MD5:* ' + crypto.createHash('md5').update(args.join(' ') || 'storm').digest('hex') });
    } },
  { name: 'reverse', aliases: ['rev'], category: 'tools', desc: '↩️ Reverse text',
    execute: async (sock, msg, args) => {
      sock.sendMessage(msg.key.remoteJid, { text: '↩️ ' + (args.join(' ') || '').split('').reverse().join('') });
    } },
  { name: 'mock', aliases: ['mocktext'], category: 'tools', desc: '🃏 Spongebob mock text',
    execute: async (sock, msg, args) => {
      const t = args.join(' ') || 'hello';
      sock.sendMessage(msg.key.remoteJid, { text: t.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('') });
    } },
  { name: 'bold', aliases: ['boldtext'], category: 'tools', desc: '𝐁 Bold text',
    execute: async (sock, msg, args) => {
      const map = { a: '𝐚', b: '𝐛', c: '𝐜', d: '𝐝', e: '𝐞', f: '𝐟', g: '𝐠', h: '𝐡', i: '𝐢', j: '𝐣', k: '𝐤', l: '𝐥', m: '𝐦', n: '𝐧', o: '𝐨', p: '𝐩', q: '𝐪', r: '𝐫', s: '𝐬', t: '𝐭', u: '𝐮', v: '𝐯', w: '𝐰', x: '𝐱', y: '𝐲', z: '𝐳', A: '𝐀', B: '𝐁', C: '𝐂', D: '𝐃', E: '𝐄', F: '𝐅', G: '𝐆', H: '𝐇', I: '𝐈', J: '𝐉', K: '𝐊', L: '𝐋', M: '𝐌', N: '𝐍', O: '𝐎', P: '𝐏', Q: '𝐐', R: '𝐑', S: '𝐒', T: '𝐓', U: '𝐔', V: '𝐕', W: '𝐖', X: '𝐗', Y: '𝐘', Z: '𝐙' };
      sock.sendMessage(msg.key.remoteJid, { text: (args.join(' ') || '').split('').map(c => map[c] || c).join('') });
    } },
  { name: 'count', aliases: ['wordcount'], category: 'tools', desc: '🔢 Word/char count',
    execute: async (sock, msg, args) => {
      const t = args.join(' ') || '';
      sock.sendMessage(msg.key.remoteJid, { text: `🔢 Words: ${t.trim() ? t.trim().split(/\s+/).length : 0}\n🔤 Chars: ${t.length}` });
    } },
  { name: 'timer', aliases: ['remind'], category: 'tools', desc: '⏱️ Timer (seconds)',
    execute: async (sock, msg, args) => {
      const secs = parseInt(args[0]);
      if (!secs || secs > 3600) return sock.sendMessage(msg.key.remoteJid, { text: '❌ .timer 60' });
      sock.sendMessage(msg.key.remoteJid, { text: `⏱️ Timer ${secs}s set!` });
      setTimeout(async () => {
        try { await sock.sendMessage(msg.key.remoteJid, { text: `⏰ *Time up!* ${secs}s ho gaye!`, mentions: [msg.key.participant || msg.key.remoteJid] }); } catch {}
      }, secs * 1000);
    } },
  { name: 'removebg', aliases: ['nobg'], category: 'tools', desc: '🖼️ Background remove (image reply)',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted?.imageMessage) return sock.sendMessage(from, { text: '🖼️ Image pe reply karke .removebg karo!' });
      sock.sendMessage(from, { text: '⏳ Removing background...' });
      try {
        const buff = await sock.downloadMediaMessage({ key: msg.key, message: { imageMessage: quoted.imageMessage } });
        const fd = new FormData();
        fd.append('image_file', new Blob([buff]), 'img.jpg');
        fd.append('size', 'auto');
        const { data } = await axios.post('https://api.remove.bg/v1.0/removebg', fd, {
          headers: { 'X-Api-Key': global.apiKeys.removebg }, responseType: 'arraybuffer'
        });
        sock.sendMessage(from, { image: Buffer.from(data), caption: '✅ Background removed!' });
      } catch { sock.sendMessage(from, { text: '❌ Try: https://www.remove.bg (free)' }); }
    } }
];

module.exports = { commands };
