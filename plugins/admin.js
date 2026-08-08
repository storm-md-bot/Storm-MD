// ============================================
// Storm-MD — Admin Commands (REAL WhatsApp API)
// ============================================
const fs = require('fs-extra');
const path = require('path');

const warnFile = path.join(__dirname, '..', 'database', 'warns.json');
fs.ensureDirSync(path.dirname(warnFile));
const loadWarns = () => { try { return fs.readJSONSync(warnFile); } catch { return {}; } };
const saveWarns = (d) => fs.writeJSONSync(warnFile, d, { spaces: 2 });

const commands = [
  { name: 'add', aliases: ['adduser'], category: 'admin', desc: '➕ Add number to group',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return sock.sendMessage(from, { text: '❌ Group me use karo!' });
      const num = (args[0] || '').replace(/[^0-9]/g, '');
      if (num.length < 10) return sock.sendMessage(from, { text: '❌ .add 2250700000000' });
      try { await sock.groupParticipantsUpdate(from, [num + '@s.whatsapp.net'], 'add'); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'kick', aliases: ['remove', 'ban'], category: 'admin', desc: '👢 Kick member (tag karo)',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (!from.endsWith('@g.us')) return sock.sendMessage(from, { text: '❌ Group me use karo!' });
      if (!mentioned?.length) return sock.sendMessage(from, { text: '❌ .kick @user' });
      try { await sock.groupParticipantsUpdate(from, mentioned, 'remove'); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'promote', aliases: ['admin'], category: 'admin', desc: '⭐ Promote admin',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (!mentioned?.length) return sock.sendMessage(from, { text: '❌ .promote @user' });
      try { await sock.groupParticipantsUpdate(from, mentioned, 'promote'); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'demote', aliases: ['unadmin'], category: 'admin', desc: '⬇️ Demote admin',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
      if (!mentioned?.length) return sock.sendMessage(from, { text: '❌ .demote @user' });
      try { await sock.groupParticipantsUpdate(from, mentioned, 'demote'); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'mute', aliases: ['lock'], category: 'admin', desc: '🔇 Mute group',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try { await sock.groupSettingUpdate(from, 'announcement'); sock.sendMessage(from, { text: '🔇 Group muted!' }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'unmute', aliases: ['unlock'], category: 'admin', desc: '🔊 Unmute group',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try { await sock.groupSettingUpdate(from, 'not_announcement'); sock.sendMessage(from, { text: '🔊 Group unmuted!' }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'close', aliases: ['closegc'], category: 'admin', desc: '🔒 Close group (only admins msg)',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try { await sock.groupSettingUpdate(from, 'announcement'); sock.sendMessage(from, { text: '🔒 Group closed!' }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'open', aliases: ['opengc'], category: 'admin', desc: '🔓 Open group',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try { await sock.groupSettingUpdate(from, 'not_announcement'); sock.sendMessage(from, { text: '🔓 Group opened!' }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'grouplink', aliases: ['linkgc', 'link'], category: 'admin', desc: '🔗 Group link',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try { const c = await sock.groupInviteCode(from); sock.sendMessage(from, { text: '🔗 https://chat.whatsapp.com/' + c }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'revoke', aliases: ['newlink'], category: 'admin', desc: '🔄 Revoke group link',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try { const c = await sock.groupRevokeInvite(from); sock.sendMessage(from, { text: '✅ New link: https://chat.whatsapp.com/' + c }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'setname', aliases: ['setgcname'], category: 'admin', desc: '✏️ Set group name',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const name = args.join(' ');
      if (!name) return sock.sendMessage(from, { text: '❌ .setname New Name' });
      try { await sock.groupUpdateSubject(from, name); sock.sendMessage(from, { text: '✅ Name updated!' }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'setdesc', aliases: ['setgcdesc'], category: 'admin', desc: '📝 Set group description',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const desc = args.join(' ');
      try { await sock.groupUpdateDescription(from, desc); sock.sendMessage(from, { text: '✅ Description updated!' }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'setpp', aliases: ['setgpic'], category: 'admin', desc: '🖼️ Set group icon (reply image)',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      if (!quoted?.imageMessage) return sock.sendMessage(from, { text: '❌ Image pe reply karke .setpp karo!' });
      try {
        const buff = await sock.downloadMediaMessage({ key: msg.key, message: { imageMessage: quoted.imageMessage } });
        await sock.updateProfilePicture(from, buff);
        sock.sendMessage(from, { text: '✅ Group icon updated!' });
      } catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'tagall', aliases: ['everyone', 'all'], category: 'admin', desc: '📢 Tag all members',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const text = args.join(' ') || 'Hello everyone!';
      try {
        const meta = await sock.groupMetadata(from);
        const ids = meta.participants.map(p => p.id);
        await sock.sendMessage(from, { text: `📢 ${text}`, mentions: ids });
      } catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'hidetag', aliases: ['htag'], category: 'admin', desc: '👻 Hidden tag',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      try {
        const meta = await sock.groupMetadata(from);
        const ids = meta.participants.map(p => p.id);
        await sock.sendMessage(from, { text: args.join(' ') || '👻', mentions: ids });
      } catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'warn', aliases: ['warning'], category: 'admin', desc: '⚠️ Warn member (3 = kick)',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!mentioned) return sock.sendMessage(from, { text: '❌ .warn @user' });
      const warns = loadWarns();
      warns[mentioned] = (warns[mentioned] || 0) + 1;
      saveWarns(warns);
      if (warns[mentioned] >= 3) {
        await sock.groupParticipantsUpdate(from, [mentioned], 'remove');
        delete warns[mentioned]; saveWarns(warns);
        sock.sendMessage(from, { text: `🚫 @${mentioned.split('@')[0]} kicked (3 warns)!` });
      } else {
        sock.sendMessage(from, { text: `⚠️ @${mentioned.split('@')[0]} warned (${warns[mentioned]}/3)!` });
      }
    } },
  { name: 'warns', aliases: ['warnings'], category: 'admin', desc: '📋 Check warns',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!mentioned) return sock.sendMessage(from, { text: '❌ .warns @user' });
      const warns = loadWarns();
      sock.sendMessage(from, { text: `📋 @${mentioned.split('@')[0]}: ${warns[mentioned] || 0} warns` });
    } },
  { name: 'delwarn', aliases: ['removewarn'], category: 'admin', desc: '✅ Remove 1 warn',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      if (!mentioned) return sock.sendMessage(from, { text: '❌ .delwarn @user' });
      const warns = loadWarns();
      if (warns[mentioned]) { warns[mentioned]--; if (warns[mentioned] <= 0) delete warns[mentioned]; saveWarns(warns); }
      sock.sendMessage(from, { text: `✅ Warn removed @${mentioned.split('@')[0]}` });
    } },
  { name: 'resetwarn', aliases: ['clearwarn'], category: 'admin', desc: '🔄 Reset all warns',
    execute: async (sock, msg) => {
      saveWarns({});
      sock.sendMessage(msg.key.remoteJid, { text: '✅ All warns reset!' });
    } },
  { name: 'antilink', aliases: ['antigc'], category: 'admin', desc: '🚫 Anti group link (toggle)',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      global.antilink = !global.antilink;
      sock.sendMessage(from, { text: `${global.antilink ? '✅' : '❌'} Anti-link ${global.antilink ? 'ON' : 'OFF'}` });
    } },
  { name: 'welcome', aliases: ['welcomemsg'], category: 'admin', desc: '👋 Toggle welcome',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      global.welcomeOn = !global.welcomeOn;
      sock.sendMessage(from, { text: `${global.welcomeOn ? '✅' : '❌'} Welcome ${global.welcomeOn ? 'ON' : 'OFF'}` });
    } },
  { name: 'goodbye', aliases: ['byemsg'], category: 'admin', desc: '👋 Toggle goodbye',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      global.goodbyeOn = !global.goodbyeOn;
      sock.sendMessage(from, { text: `${global.goodbyeOn ? '✅' : '❌'} Goodbye ${global.goodbyeOn ? 'ON' : 'OFF'}` });
    } },
  { name: 'delete', aliases: ['del'], category: 'admin', desc: '🗑️ Delete bot message (reply)',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
      if (!quoted) return sock.sendMessage(from, { text: '❌ Bot ki message pe reply karke .delete karo!' });
      try { await sock.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: quoted, participant: msg.key.participant } }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'invite', aliases: ['inv'], category: 'admin', desc: '📨 Invite link',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try { const c = await sock.groupInviteCode(from); sock.sendMessage(from, { text: '🔗 https://chat.whatsapp.com/' + c }); }
      catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } },
  { name: 'adminlist', aliases: ['admins', 'adm'], category: 'group', desc: '📋 List admins',
    execute: async (sock, msg) => {
      const from = msg.key.remoteJid;
      try {
        const meta = await sock.groupMetadata(from);
        const admins = meta.participants.filter(p => p.admin).map(p => '👑 @' + p.id.split('@')[0]);
        sock.sendMessage(from, { text: '📋 *Admins:*\n' + (admins.join('\n') || 'None') });
      } catch (e) { sock.sendMessage(from, { text: '❌ ' + e.message }); }
    } }
];

module.exports = { commands };
