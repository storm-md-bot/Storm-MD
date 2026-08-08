// ============================================
// Storm-MD — Member/Group Commands
// ============================================

const commands = [
  { name: 'group', aliases: ['gcinfo', 'gc'], category: 'group', desc: '👥 Group info',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return sock.sendMessage(from, { text: '❌ Group me use karo!' });
      try {
        const meta = await sock.groupMetadata(from);
        sock.sendMessage(from, { text: `👥 *${meta.subject}*\n👑 Owner: ${meta.owner?.split('@')[0] || 'Unknown'}\n👥 Members: ${meta.participants.length}\n🆔 ${meta.id}` });
      } catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'members', aliases: ['memberlist'], category: 'group', desc: '👥 List members',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try {
        const meta = await sock.groupMetadata(from);
        const list = meta.participants.map(p => '@' + p.id.split('@')[0]).join('\n');
        sock.sendMessage(from, { text: `👥 *Members (${meta.participants.length}):*\n${list}` });
      } catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'profile', aliases: ['me'], category: 'group', desc: '👤 Your info',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const num = msg.key.participant?.split('@')[0] || msg.key.remoteJid.split('@')[0];
      sock.sendMessage(from, { text: `👤 *Profile:*\n📱 Number: ${num}\n📍 Chat: ${from.endsWith('@g.us') ? 'Group' : 'Private'}\n🤖 Bot: ${global.botName}` });
    } },
  { name: 'myid', aliases: ['id'], category: 'group', desc: '🆔 Your ID',
    execute: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: `🆔 *Your ID:*\n${msg.key.participant || msg.key.remoteJid}` });
    } },
  { name: 'botinfo', aliases: ['info', 'stats'], category: 'group', desc: '🤖 Bot info',
    execute: async (sock, msg) => {
      const uptime = Math.floor(process.uptime());
      sock.sendMessage(msg.key.remoteJid, {
        text: `🤖 *${global.botName} v${global.botVersion}*\n😈 Demon God Edition\n⚡ Online: ${global.botOnline ? '✅' : '❌'}\n⏱️ Uptime: ${uptime}s\n📦 Commands: 600+\n👑 Owner: ${global.ownerName}\n📸 @${global.ownerInstagram?.replace('@','') || 'demon_god__2009'}\n🌍 Countries: All (+225)`
      });
    } },
  { name: 'runtime', aliases: ['uptime'], category: 'group', desc: '⏱️ Bot runtime',
    execute: async (sock, msg) => {
      const s = Math.floor(process.uptime());
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      sock.sendMessage(msg.key.remoteJid, { text: `⏱️ *Runtime:* ${h}h ${m}m ${sec}s` });
    } },
  { name: 'device', aliases: ['browser'], category: 'group', desc: '📱 Bot device',
    execute: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: `📱 *Device:* ${global.browserDescription?.[0] || 'Kali Linux'}\n🌐 ${global.browserDescription?.[1] || 'Firefox (Ubuntu)'}` });
    } },
  { name: 'vote', aliases: ['poll'], category: 'group', desc: '📊 Poll banao',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const q = args.join(' ') || 'Is bot best?';
      try { await sock.sendMessage(from, { poll: { name: q, values: ['Yes ✅', 'No ❌', 'Maybe 🤔'] } }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'request', aliases: ['req'], category: 'group', desc: '📩 Feature request',
    execute: async (sock, msg, args) => {
      const text = args.join(' ');
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: '❌ .request new command name' });
      sock.sendMessage(msg.key.remoteJid, { text: `✅ Request saved! "${text}"\nOwner review karega 😈` });
    } },
  { name: 'report', aliases: ['bug'], category: 'group', desc: '🐛 Report bug',
    execute: async (sock, msg, args) => {
      const text = args.join(' ');
      if (!text) return sock.sendMessage(msg.key.remoteJid, { text: '❌ .report problem describe karo' });
      sock.sendMessage(msg.key.remoteJid, { text: `🐛 Bug reported: "${text}"\nThanks! Fix jald hi aayega ✅` });
    } }
];

module.exports = { commands };
