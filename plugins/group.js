// ============================================
// Storm-MD — Group Commands
// ============================================

const commands = [
  {
    name: 'group',
    category: 'group',
    desc: 'Group info',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return await sock.sendMessage(from, { text: '❌ This command only works in groups!' });
      const metadata = await sock.groupMetadata(from);
      await sock.sendMessage(from, { text: `👥 *Group Info*\n\n📛 Name: ${metadata.subject}\n👑 Owner: ${metadata.owner?.split('@')[0] || 'Unknown'}\n👥 Members: ${metadata.participants.length}\n📅 Created: ${new Date(metadata.creation * 1000).toDateString()}\n🆔 ID: ${metadata.id}` });
    }
  },
  {
    name: 'tagall',
    category: 'group',
    desc: 'Tag all group members',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return;
      const metadata = await sock.groupMetadata(from);
      const members = metadata.participants.map(p => p.id);
      await sock.sendMessage(from, { text: `📢 *@${msg.key.participant?.split('@')[0] || 'Admin'}* said: ${args.join(' ') || 'Hello everyone!'}`, mentions: members });
    }
  },
  {
    name: 'hidetag',
    category: 'group',
    desc: 'Send with hidden tag',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return;
      const metadata = await sock.groupMetadata(from);
      const members = metadata.participants.map(p => p.id);
      await sock.sendMessage(from, { text: args.join(' ') || '👋 Hello everyone!', mentions: members });
    }
  },
  {
    name: 'link',
    category: 'group',
    desc: 'Get group invite link',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return;
      try {
        const code = await sock.groupInviteCode(from);
        await sock.sendMessage(from, { text: `🔗 *Group Link*\n\nhttps://chat.whatsapp.com/${code}` });
      } catch {
        await sock.sendMessage(from, { text: '❌ Failed to get link (Admin only feature)' });
      }
    }
  },
  {
    name: 'promote',
    category: 'group',
    desc: 'Promote member to admin',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (!mentioned?.length) return await sock.sendMessage(from, { text: '❌ Tag a user to promote!' });
      try {
        await sock.groupParticipantsUpdate(from, mentioned, 'promote');
        await sock.sendMessage(from, { text: `✅ Promoted @${mentioned[0].split('@')[0]} to admin!` });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
      }
    }
  },
  {
    name: 'demote',
    category: 'group',
    desc: 'Demote admin to member',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (!mentioned?.length) return await sock.sendMessage(from, { text: '❌ Tag an admin to demote!' });
      try {
        await sock.groupParticipantsUpdate(from, mentioned, 'demote');
        await sock.sendMessage(from, { text: `✅ Demoted @${mentioned[0].split('@')[0]} to member!` });
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
      }
    }
  },
  {
    name: 'kick',
    category: 'group',
    desc: 'Remove member from group',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (!mentioned?.length) return await sock.sendMessage(from, { text: '❌ Tag a user to kick!' });
      try {
        await sock.groupParticipantsUpdate(from, mentioned, 'remove');
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
      }
    }
  },
  {
    name: 'add',
    category: 'group',
    desc: 'Add user to group',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const number = args[0]?.replace(/[^0-9]/g, '');
      if (!number) return await sock.sendMessage(from, { text: '❌ Provide a number!\nExample: .add 919337948764' });
      try {
        await sock.groupParticipantsUpdate(from, [`${number}@s.whatsapp.net`], 'add');
      } catch (e) {
        await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
      }
    }
  }
];

module.exports = { commands };
