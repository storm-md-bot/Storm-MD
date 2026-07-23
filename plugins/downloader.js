// ============================================
// Storm-MD — Downloader Commands
// ============================================

const axios = require('axios');

const commands = [
  {
    name: 'ytmp3',
    category: 'download',
    desc: 'Download YouTube audio',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const url = args[0];
      if (!url) return await sock.sendMessage(from, { text: '❌ Provide YouTube URL!\nExample: .ytmp3 https://youtu.be/xxx' });
      await sock.sendMessage(from, { text: `🎵 *Downloading audio...*\nURL: ${url}\n⏳ Please wait...` });
    }
  },
  {
    name: 'ytmp4',
    category: 'download',
    desc: 'Download YouTube video',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const url = args[0];
      if (!url) return await sock.sendMessage(from, { text: '❌ Provide YouTube URL!' });
      await sock.sendMessage(from, { text: `🎬 *Downloading video...*\nURL: ${url}\n⏳ Please wait...` });
    }
  },
  {
    name: 'tiktok',
    category: 'download',
    desc: 'Download TikTok video (no watermark)',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const url = args[0];
      if (!url) return await sock.sendMessage(from, { text: '❌ Provide TikTok URL!' });
      try {
        const { data } = await axios.get(`https://api.ryzendesu.vip/api/downloader/tiktok?url=${encodeURIComponent(url)}`);
        if (data?.url || data?.videoUrl || data?.result) {
          await sock.sendMessage(from, { video: { url: data.url || data.videoUrl || data.result }, caption: '📱 *TikTok Download*\nNo watermark ✅' });
        } else {
          await sock.sendMessage(from, { text: '❌ Failed to download. Try another link.' });
        }
      } catch {
        await sock.sendMessage(from, { text: '📱 TikTok download: Use snaptik.app or ssstik.io (free)' });
      }
    }
  },
  {
    name: 'instagram',
    category: 'download',
    desc: 'Download Instagram post/reel',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const url = args[0];
      if (!url) return await sock.sendMessage(from, { text: '❌ Provide Instagram URL!' });
      await sock.sendMessage(from, { text: `📸 *Instagram Download*\nURL: ${url}\nUse: https://saveinsta.app (free)` });
    }
  },
  {
    name: 'facebook',
    category: 'download',
    desc: 'Download Facebook video',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const url = args[0];
      if (!url) return await sock.sendMessage(from, { text: '❌ Provide Facebook URL!' });
      await sock.sendMessage(from, { text: `📘 *Facebook Download*\nURL: ${url}\nUse: https://fdownloader.net (free)` });
    }
  },
  {
    name: 'twitter',
    category: 'download',
    desc: 'Download Twitter/X video',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const url = args[0];
      if (!url) return await sock.sendMessage(from, { text: '❌ Provide Twitter URL!' });
      await sock.sendMessage(from, { text: `🐦 *Twitter Download*\nURL: ${url}\nUse: https://twitsave.com (free)` });
    }
  }
];

module.exports = { commands };
