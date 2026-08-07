// ============================================
// Storm-MD v2.0 — Main Bot Engine
// CommonJS + Baileys (dynamic ESM import)
// ✅ Web Pairing (/pair) — No Termux Needed!
// ============================================

const express = require('express');
const pino = require('pino');
const fs = require('fs-extra');
const path = require('path');
const { Boom } = require('@hapi/boom');
require('./config.js');

const app = express();
const PORT = process.env.PORT || 3000;
const sessionDir = path.join(__dirname, 'session');
fs.ensureDirSync(sessionDir);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const commands = new Map();
const hasSession = () => fs.existsSync(path.join(sessionDir, 'creds.json'));

// ---------- HELPERS ----------
function getText(msg) {
  if (!msg || !msg.message) return '';
  const m = msg.message;
  return m.conversation || m.extendedTextMessage?.text ||
         m.imageMessage?.caption || m.videoMessage?.caption || '';
}

// ---------- COMMAND LOADER (plugins = CommonJS, no changes needed) ----------
function loadCommands() {
  const pluginDir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginDir)) { console.log('⚠️ plugins/ folder missing'); return; }
  const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const mod = require(path.join(pluginDir, file));
      const list = mod.commands || (mod.default && mod.default.commands) || [];
      for (const cmd of list) {
        commands.set(String(cmd.name).toLowerCase(), cmd);
        if (cmd.aliases) for (const a of cmd.aliases) commands.set(String(a).toLowerCase(), cmd);
      }
    } catch (e) { console.log(`⚠️ Plugin ${file}: ${e.message}`); }
  }
  console.log(`✅ Loaded ${commands.size}+ commands`);
}

// ---------- WEB ROUTES ----------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/pair', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>⚡ Storm-MD Pairing</title><style>
  body{background:#0b0b12;color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .card{background:#14141f;border:1px solid #ff3b3b55;border-radius:16px;padding:32px;max-width:420px;width:90%;text-align:center}
  h1{background:linear-gradient(45deg,#ff3b3b,#ff9500);-webkit-background-clip:text;background-clip:text;color:transparent}
  input{width:100%;padding:14px;margin:12px 0;border-radius:8px;border:1px solid #333;background:#1b1b2a;color:#fff;font-size:16px;text-align:center}
  button{width:100%;padding:14px;background:linear-gradient(45deg,#ff3b3b,#ff9500);border:0;border-radius:8px;color:#fff;font-size:16px;font-weight:700;cursor:pointer}
  .hint{color:#888;font-size:13px;margin-top:12px}
  </style></head><body><div class="card">
  <h1>⚡ Storm-MD Pairing</h1>
  <p>WhatsApp number with country code (NO +, NO spaces)</p>
  <form method="POST" action="/pair">
    <input type="tel" name="number" placeholder="e.g. 2250700000000 (Côte d'Ivoire +225)" required>
    <button type="submit">🔥 Generate REAL 8-Digit Code</button>
  </form>
  <p class="hint">WhatsApp → Settings → Linked Devices → Link with Phone Number</p>
  </div></body></html>`);
});

app.post('/pair', async (req, res) => {
  const raw = String(req.body.number || '').replace(/[^0-9]/g, '');
  if (raw.length < 10 || raw.length > 15) {
    return res.send(`<html><body style="background:#0b0b12;color:#fff;font-family:system-ui;text-align:center;padding-top:80px"><h3>❌ Invalid number (10–15 digits)</h3><a href="/pair" style="color:#ff9500">← Try again</a></body></html>`);
  }
  try {
    const { code, sock, saveCreds } = await makePairingSocket(raw);
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', ({ connection }) => {
      if (connection === 'open') { console.log('✅ WhatsApp linked! Starting bot...'); startBot(); }
    });
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>✅ Storm-MD Code</title><style>
    body{background:#0b0b12;color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    .card{background:#14141f;border:1px solid #00ff88aa;border-radius:16px;padding:32px;max-width:420px;width:90%;text-align:center}
    .code{font-size:32px;font-weight:800;letter-spacing:6px;color:#00ff88;background:#0d0d14;border:1px dashed #00ff8866;border-radius:10px;padding:16px;margin:16px 0;font-family:monospace}
    .steps{text-align:left;color:#ccc;font-size:14px;line-height:1.9}
    </style></head><body><div class="card">
    <h2 style="color:#00ff88">✅ REAL CODE GENERATED</h2>
    <p style="color:#888">Number: <b style="color:#fff">${raw}</b></p>
    <div class="code">${code}</div>
    <div class="steps"><b>📱 How to use:</b><br>
    1. Open WhatsApp on phone<br>
    2. Settings → Linked Devices<br>
    3. Tap "Link a Device"<br>
    4. Tap "Link with phone number"<br>
    5. Enter code <b>${code}</b><br>
    6. Bot connects automatically ✅</div>
    </div></body></html>`);
  } catch (e) {
    res.send(`<html><body style="background:#0b0b12;color:#fff;font-family:system-ui;text-align:center;padding-top:80px"><h3>❌ ${e.message}</h3><p style="color:#888">Known Baileys issue — wait 10s, retry.</p><a href="/pair" style="color:#ff9500">← Try again</a></body></html>`);
  }
});

app.get('/status', (req, res) => res.json({ bot: global.botName, version: global.botVersion, connected: !!global.botOnline }));

// ---------- PAIRING SOCKET ----------
async function makePairingSocket(phoneNumber) {
  const baileys = await import('@whiskeysockets/baileys');
  const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers } = baileys;
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const sock = makeWASocket({
    version, auth: state, printQRInTerminal: false,
    browser: global.browserDescription || Browsers.macOS('Chrome'),
    logger: pino({ level: 'silent' }), markOnlineOnConnect: false,
    syncFullHistory: false, defaultQueryTimeoutMs: 120000
  });
  await new Promise(r => setTimeout(r, 3500));
  const code = await sock.requestPairingCode(phoneNumber);
  return { code, sock, saveCreds };
}

// ---------- MAIN BOT ----------
async function startBot() {
  const baileys = await import('@whiskeysockets/baileys');
  const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = baileys;
  const { version } = await fetchLatestBaileysVersion();
  console.log(`📡 Baileys v${version.join('.')}`);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  const sock = makeWASocket({
    version, auth: state, printQRInTerminal: false,
    browser: global.browserDescription || Browsers.macOS('Chrome'),
    logger: pino({ level: 'silent' }), markOnlineOnConnect: true,
    syncFullHistory: false, defaultQueryTimeoutMs: 60000, keepAliveIntervalMs: 25000
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages && messages[0];
    if (!msg || !msg.key || msg.key.fromMe) return;
    if (msg.message?.reactionMessage) return;
    const from = msg.key.remoteJid;
    if (!from) return;
    const text = getText(msg).trim();
    const isGroup = from.endsWith('@g.us');
    const isChannel = from.endsWith('@newsletter');

    // 😈 AUTO REACT — har message pe (DM/GC/Channel)
    if (global.autoReactEnabled) {
      const pool = ['⚡','🔥','💥','👋','🤖','💪','🚀','✨','🎯','✅','❤️','😊','👍'];
      const react = pool[Math.floor(Math.random() * pool.length)];
      try { await sock.sendMessage(from, { react: { text: react, key: msg.key } }); } catch {}
    }

    // 🔥 AUTO ROAST
    if (global.autoroastEnabled && (text.startsWith('.autoroast') || text.startsWith('/autoroast') || text.toLowerCase().includes('roast me'))) {
      const roasts = loadAutoRoast();
      try {
        await sock.sendMessage(from, {
          text: roasts[Math.floor(Math.random() * roasts.length)],
          contextInfo: { mentionedJid: [msg.key.participant || from] }
        });
      } catch {}
    }

    // ⚡ COMMAND HANDLER
    if (text.startsWith(global.prefix)) {
      const full = text.slice(global.prefix.length).trim();
      const [name, ...args] = full.split(/\s+/);
      const cmd = commands.get(name.toLowerCase());
      if (cmd) {
        try { await cmd.execute(sock, msg, args, { isGroup, isChannel, from, prefix: global.prefix }); }
        catch (e) { console.log(`⚠️ [${name}] ${e.message}`); }
      }
    }
  });

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      global.botOnline = true;
      console.log('✅ Bot connected!');
      console.log(`🤖 ${global.botName} v${global.botVersion} ONLINE — 24/7`);
    }
    if (connection === 'close') {
      global.botOnline = false;
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(`❌ Disconnected (${code})`);
      if (code === DisconnectReason.loggedOut) {
        console.log('🚫 Logged out — delete session/, pair again via /pair');
        try { fs.emptyDirSync(sessionDir); } catch {}
      }
      console.log('🔄 Reconnecting in 5s...');
      setTimeout(() => startBot(), 5000);
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

function loadAutoRoast() {
  return [
    `🤣 *Auto Roast Activated!*\n_Tu itna fail hai ki fail bhi tera baap hai!_\n🔴 Style: Bold+Italic\n🎨 Color: #FF0000`,
    `😭 *Oye Haddipa!*\n_Teri aukaat se bahar ki baat mat kar_\n✨ _Tujhe dekh ke lagta hai tera Ghar paani me behta hai_`,
    `🔥 *Roasting Mode ON* 🔥\n_Gaali nahi doonga, par teri photo dekh ke ChatGPT bhi hang ho jaye!`,
    `😂 *Ae Chomu!*\n_Tera dimaag itna slow hai ki Google bhi "Loading..." bolke chhod de_`,
    `💀 *INTENSE ROAST* 💀\n_Tujhe dekh ke lagta hai teri shakal purani flop movie hai!_\n🎭 *Style: Fancy* 🌈 Color: Rainbow`,
    `🤪 *Toh roast karne bola?*\n_Teri photo vaccine hai — logo ko dekh ke immunity milti hai!`,
    `😎 *Roast Service* 😎\n_Tera naam sunke lagta hai tu free fire ka bot hai_\n🔷 Color: #00FFFF\n📝 Style: Cursive`,
    `🥴 *Auto Roast* 🤖\n_Teri shakal dekh ke lagta hai tu beauty competition me 'unique award' jeetega!_\n⭐ _-10/10 rating_`
  ];
}

// ---------- INIT ----------
loadCommands();
app.listen(PORT, () => console.log(`🌐 ${global.botName} web UI on port ${PORT}`));

(async () => {
  if (hasSession()) {
    await startBot();
  } else {
    console.log('📱 No session — open YOUR_URL/pair to link WhatsApp (no Termux!)');
  }
})();
