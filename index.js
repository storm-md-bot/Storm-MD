// ============================================
// Storm-MD v2.0 — Main Bot Engine
// REAL Baileys 6.7.x — Real 8-Digit Pairing
// ============================================

const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
require('./config.js');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== EXPRESS WEB UI =====
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 ${global.botName} Web UI running on port ${PORT}`);
});

// ===== SESSION DIRECTORY =====
const sessionDir = path.join(__dirname, 'session');
fs.ensureDirSync(sessionDir);

// ===== LOAD COMMANDS =====
const commands = new Map();
const loadCommands = () => {
  const pluginDir = path.join(__dirname, 'plugins');
  const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const cmdModule = require(path.join(pluginDir, file));
      if (cmdModule.commands) {
        cmdModule.commands.forEach(cmd => {
          commands.set(cmd.name, cmd);
        });
      }
    } catch (e) {
      console.log(`⚠️ Failed to load ${file}: ${e.message}`);
    }
  }
  console.log(`✅ Loaded ${commands.size} commands`);
};

// ===== START BOT =====
async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`📡 Baileys v${version.join('.')} (${isLatest ? 'latest' : 'update available'})`);

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: global.browserDescription || Browsers.macOS('Chrome'),
    logger: pino({ level: 'silent' }),
    markOnlineOnConnect: true,
    syncFullHistory: false,
    generateHighQualityLinkPreview: true,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    patch: true
  });

  // === AUTO REACT ON MESSAGES ===
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (!messages[0]?.key?.remoteJid) return;
    const msg = messages[0];
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const isChannel = from.endsWith('@newsletter');

    // Auto React
    if (global.autoReactEnabled && !msg.key.fromMe && msg.message?.conversation) {
      const reactions = ['⚡', '🔥', '💥', '👋', '🤖', '💪', '🚀', '✨', '🎯', '✅'];
      const randomReact = reactions[Math.floor(Math.random() * reactions.length)];
      try {
        await sock.sendMessage(from, { react: { text: randomReact, key: msg.key } });
      } catch (e) {}
    }

    // Auto Roast Feature
    if (global.autoroastEnabled && !msg.key.fromMe && msg.message?.conversation) {
      const text = msg.message.conversation.toLowerCase();
      if (text.startsWith('/autoroast') || text.includes('roast me')) {
        const roasts = loadAutoRoast();
        const roastMsg = roasts[Math.floor(Math.random() * roasts.length)];
        await sock.sendMessage(from, { 
          text: roastMsg,
          contextInfo: { quotedMessage: msg.message, mentionedJid: [msg.key.participant || msg.key.remoteJid] }
        });
      }
    }

    // Command Handler
    if (!msg.key.fromMe && msg.message?.conversation?.startsWith(global.prefix)) {
      const fullCmd = msg.message.conversation.slice(global.prefix.length).trim();
      const [cmdName, ...args] = fullCmd.split(' ');
      const cmd = commands.get(cmdName.toLowerCase());
      
      if (cmd) {
        try {
          await cmd.execute(sock, msg, args, { isGroup, isChannel, from, prefix: global.prefix });
        } catch (e) {
          console.log(`⚠️ Command error [${cmdName}]: ${e.message}`);
        }
      }
    }
  });

  // === CONNECTION HANDLER ===
  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr && !sock.authState.creds?.registered) {
      console.log('📱 QR Code generated - scan with WhatsApp!');
    }
    
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(`❌ Disconnected: ${reason}`);
      if (reason === DisconnectReason.loggedOut) {
        console.log('🚫 Session expired! Delete session folder and re-pair.');
        fs.emptyDirSync(sessionDir);
      }
      console.log('🔄 Restarting in 5 seconds...');
      setTimeout(startBot, 5000);
    } else if (connection === 'open') {
      console.log('✅ Bot connected successfully!');
      console.log(`🤖 ${global.botName} v${global.botVersion} is ONLINE`);
    }
  });

  // === CREDS SAVE ===
  sock.ev.on('creds.update', saveCreds);

  return sock;
}

// ===== AUTO ROAST DATA =====
function loadAutoRoast() {
  return [
    `🤣 *Auto Roast Activated!*\n_Tu itna fail hai ki fail bhi tera baap hai!_\n🔴 Text Style: *Bold+Italic*\n🎨 Color: #FF0000`,
    `😭 *Oye Haddipa!*\n_Teri aukaat se bahar ki baat mat kar_\n✨ _Tujhe dekh ke lagta hai tera Ghar paani me behta hai_`,
    `🔥 *Roasting Mode ON* 🔥\n_Gaali nahi doonga, par teri photo dekh ke to ChatGPT bhi hang ho jaye!_`,
    `😂 *Ae Chomu!*\n_Tera dimaag itna slow hai ki Google bhi "Loading..." bolke chhod de_`,
    `💀 *INTENSE ROAST* 💀\n_Tujhe dekh ke lagta hai teri shakal kaafi purani movie hai - flop!_\n🎭 *Style: Fancy*\n🌈 Color: Rainbow`,
    `🤪 *Toh aapne mujhe roast karne bola?*\n_Toh aaiye... teri photo vaccine hai - logo ko dekh ke immunity milti hai!_`,
    `😎 *Roast Service* 😎\n_Tera naam sunke lagta hai tu free fire ka bot hai_\n🔷 *Color: #00FFFF*\n📝 *Text Style: Cursive*`,
    `🥴 *Auto Roast* 🤖\n_Jo teri shakal hai na.. usse dekh ke lagta hai tu beauty competition me 'unique award' jeetega!_\n⭐ _-10/10 rating_`
  ];
}

// ===== INIT =====
loadCommands();
startBot().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
