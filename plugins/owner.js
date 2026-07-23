// ============================================
// Storm-MD — Owner Commands
// ============================================

const commands = [
  {
    name: 'bc',
    category: 'owner',
    desc: 'Broadcast message',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      // Hidden: Only owner can use
      await sock.sendMessage(from, { text: `📢 *Broadcast*\n\n${args.join(' ') || 'Hello everyone!'}` });
    }
  },
  {
    name: 'eval',
    category: 'owner',
    desc: 'Evaluate code',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      try {
        const result = eval(args.join(' '));
        await sock.sendMessage(from, { text: `💻 *Eval Result*\n\n\`\`\`${JSON.stringify(result, null, 2)}\`\`\`` });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
      }
    }
  },
  {
    name: 'shutdown',
    category: 'owner',
    desc: 'Shutdown bot',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { text: '🛑 *Shutting down...*' });
      process.exit(0);
    }
  },
  {
    name: 'restart',
    category: 'owner',
    desc: 'Restart bot',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { text: '🔄 *Restarting...*' });
      process.exit(1);
    }
  },
  {
    name: 'setprefix',
    category: 'owner',
    desc: 'Change command prefix',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const newPrefix = args[0] || '.';
      global.prefix = newPrefix;
      await sock.sendMessage(from, { text: `✅ Prefix changed to *${newPrefix}*` });
    }
  },
  {
    name: 'setsesi',
    category: 'owner',
    desc: 'Show session status',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      await sock.sendMessage(from, { text: `📱 *Session Info*\n\n📍 Number: ${sock.user?.id?.split(':')[0] || 'Unknown'}\n📛 Name: ${sock.user?.name || 'Unknown'}\n⚡ Status: Connected ✅\n💾 Session: Active\n🤖 Bot: ${global.botName} v${global.botVersion}` });
    }
  }
];

module.exports = { commands };
