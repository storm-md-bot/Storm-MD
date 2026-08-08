// ============================================
// Storm-MD — Owner Commands (Krishu 😈)
// ============================================
const isOwner = (msg) => {
  const num = msg.key.remoteJid.split('@')[0];
  return global.ownerNumbers.includes(num);
};

const commands = [
  { name: 'owner', aliases: ['creator', 'krishu'], category: 'owner', desc: '👑 Owner info',
    execute: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, {
        text: `👑 *Owner:* ${global.ownerName}\n📸 *Instagram:* ${global.ownerInstagram || '@demon_god__2009'}\n⚡ *Bot:* ${global.botName} v${global.botVersion}`
      });
    } },
  { name: 'bc', aliases: ['broadcast'], category: 'owner', desc: '📢 Broadcast (owner only)',
    execute: async (sock, msg, args) => {
      if (!isOwner(msg)) return;
      const text = args.join(' ') || 'Hello!';
      sock.sendMessage(msg.key.remoteJid, { text: `📢 ${text}\n\n— ${global.botName}` });
    } },
  { name: 'restart', aliases: ['reboot'], category: 'owner', desc: '🔄 Restart bot',
    execute: async (sock, msg) => {
      if (!isOwner(msg)) return;
      await sock.sendMessage(msg.key.remoteJid, { text: '🔄 Restarting...' });
      process.exit(1);
    } },
  { name: 'shutdown', aliases: ['off'], category: 'owner', desc: '🛑 Shutdown bot',
    execute: async (sock, msg) => {
      if (!isOwner(msg)) return;
      await sock.sendMessage(msg.key.remoteJid, { text: '🛑 Shutting down...' });
      process.exit(0);
    } },
  { name: 'setprefix', aliases: ['prefix'], category: 'owner', desc: '⚙️ Change prefix',
    execute: async (sock, msg, args) => {
      if (!isOwner(msg)) return;
      global.prefix = args[0] || '.';
      sock.sendMessage(msg.key.remoteJid, { text: `✅ Prefix: ${global.prefix}` });
    } },
  { name: 'setsesi', aliases: ['session'], category: 'owner', desc: '💾 Session status',
    execute: async (sock, msg) => {
      if (!isOwner(msg)) return;
      sock.sendMessage(msg.key.remoteJid, {
        text: `💾 *Session Info*\n📱 Number: ${sock.user?.id?.split(':')[0] || 'Unknown'}\n⚡ Online: ${global.botOnline ? '✅' : '❌'}\n📦 Commands: ${global.commandCount || '600+'}\n🤖 ${global.botName} v${global.botVersion}`
      });
    } },
  { name: 'setnamebot', aliases: ['botname'], category: 'owner', desc: '✏️ Set bot name',
    execute: async (sock, msg, args) => {
      if (!isOwner(msg)) return;
      global.botName = args.join(' ') || 'Storm-MD';
      sock.sendMessage(msg.key.remoteJid, { text: `✅ Bot name: ${global.botName}` });
    } },
  { name: 'join', aliases: ['joingc'], category: 'owner', desc: '🔗 Join group via link',
    execute: async (sock, msg, args) => {
      if (!isOwner(msg)) return;
      const link = args[0] || '';
      const code = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9_-]+)/)?.[1];
      if (!code) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Link do: .join https://chat.whatsapp.com/XXXX' });
      try { await sock.groupAcceptInvite(code); sock.sendMessage(msg.key.remoteJid, { text: '✅ Group join kiya!' }); }
      catch (e) { sock.sendMessage(msg.key.remoteJid, { text: '❌ ' + e.message }); }
    } },
  { name: 'leave', aliases: ['leavegc'], category: 'owner', desc: '🚪 Bot group se nikle',
    execute: async (sock, msg) => {
      if (!isOwner(msg)) return;
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { text: '👋 Bye!' });
      await sock.groupLeave(from);
    } },
  { name: 'eval', aliases: ['exec'], category: 'owner', desc: '💻 Execute code (owner only)',
    execute: async (sock, msg, args) => {
      if (!isOwner(msg)) return;
      try { const r = eval(args.join(' ')); sock.sendMessage(msg.key.remoteJid, { text: '✅ ' + JSON.stringify(r) }); }
      catch (e) { sock.sendMessage(msg.key.remoteJid, { text: '❌ ' + e.message }); }
    } },
  { name: 'block', aliases: ['banuser'], category: 'owner', desc: '🚫 Block user',
    execute: async (sock, msg, args) => {
      if (!isOwner(msg)) return;
      const num = (args[0] || '').replace(/[^0-9]/g, '');
      if (num.length < 10) return sock.sendMessage(msg.key.remoteJid, { text: '❌ .block 2250xxxxxxx' });
      await sock.updateBlockStatus(num + '@s.whatsapp.net', 'block');
      sock.sendMessage(msg.key.remoteJid, { text: '🚫 Blocked ' + num });
    } },
  { name: 'unblock', aliases: ['unbanuser'], category: 'owner', desc: '✅ Unblock user',
    execute: async (sock, msg, args) => {
      if (!isOwner(msg)) return;
      const num = (args[0] || '').replace(/[^0-9]/g, '');
      if (num.length < 10) return sock.sendMessage(msg.key.remoteJid, { text: '❌ .unblock 2250xxxxxxx' });
      await sock.updateBlockStatus(num + '@s.whatsapp.net', 'unblock');
      sock.sendMessage(msg.key.remoteJid, { text: '✅ Unblocked ' + num });
    } },
  { name: 'setbio', aliases: ['about'], category: 'owner', desc: '✏️ Set bot about',
    execute: async (sock, msg, args) => {
      if (!isOwner(msg)) return;
      try {
        await sock.updateProfileStatus(args.join(' ') || '⚡ Storm-MD Demon God Edition');
        sock.sendMessage(msg.key.remoteJid, { text: '✅ Bio updated!' });
      } catch (e) { sock.sendMessage(msg.key.remoteJid, { text: '❌ ' + e.message }); }
    } },
  { name: 'update', aliases: ['upgrade'], category: 'owner', desc: '⬆️ Bot update info',
    execute: async (sock, msg) => {
      if (!isOwner(msg)) return;
      sock.sendMessage(msg.key.remoteJid, { text: `⚡ ${global.botName} v${global.botVersion}\n✅ Latest version hai! GitHub pe changes → Render auto-deploy.` });
    } }
];

module.exports = { commands };
