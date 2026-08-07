// ============================================
// Storm-MD v2.0 — Demon God Edition
// CommonJS + dynamic Baileys import
// ✅ /pair web — No Termux
// ✅ Pairing socket hi bot ban jata hai
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
let pendingPair = null;

const hasSession = () => fs.existsSync(path.join(sessionDir, 'creds.json'));

function getText(msg) {
  if (!msg?.message) return '';
  const m = msg.message;
  return m.conversation || m.extendedTextMessage?.text ||
         m.imageMessage?.caption || m.videoMessage?.caption || '';
}

// ---------- COMMAND LOADER ----------
function loadCommands() {
  const pluginDir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginDir)) { console.log('⚠️ plugins/ missing'); return; }
  const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));
  for (const file of files) {
    try {
      const mod = require(path.join(pluginDir, file));
      const list = mod.commands || mod.default?.commands || [];
      for (const c of list) {
        if (!c?.name) continue;
        commands.set(String(c.name).toLowerCase(), c);
        if (c.aliases) for (const a of c.aliases) commands.set(String(a).toLowerCase(), c);
      }
    } catch (e) { console.log(`⚠️ ${file}: ${e.message}`); }
  }
  console.log(`✅ ${commands.size}+ commands loaded`);
}

// ---------- SOCKET FACTORY ----------
async function makeSocket() {
  const baileys = await import('@whiskeysockets/baileys');
  const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = baileys;
  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    browser: global.browserDescription || Browsers.macOS('Chrome'),
    logger: pino({ level: 'silent' }),
    markOnlineOnConnect: true,
    syncFullHistory: false,
    defaultQueryTimeoutMs: 60000,
    keepAliveIntervalMs: 25000
  });
  return { sock, saveCreds, DisconnectReason };
}

// ---------- BOT HANDLERS ----------
function attachHandlers(sock, saveCreds) {
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages?.[0];
    if (!msg?.key || msg.key.fromMe) return;
    if (msg.message?.reactionMessage || msg.message?.protocolMessage) return;
    const from = msg.key.remoteJid;
    if (!from) return;
    const text = getText(msg).trim();
    const isGroup = from.endsWith('@g.us');
    const isChannel = from.endsWith('@newsletter');

    // 😈 AUTO REACT — DM / GC / Channel (sab public)
    if (global.autoReactEnabled) {
      const pool = ['⚡','🔥','💥','👋','🤖','💪','🚀','✨','🎯','✅','❤️','😊','👍'];
      try {
        await sock.sendMessage(from, { react: { text: pool[Math.floor(Math.random() * pool.length)], key: msg.key } });
      } catch {}
    }

    // 🔥 AUTO ROAST
    if (global.autoroastEnabled && (/^(\.|\/)autoroast/i.test(text) || /roast me/i.test(text))) {
      try {
        const roasts = loadAutoRoast();
        await sock.sendMessage(from, {
          text: roasts[Math.floor(Math.random() * roasts.length)],
          contextInfo: { mentionedJid: [msg.key.participant || from] }
        });
      } catch {}
    }

    // ⚡ COMMANDS — public mode: har koi (DM/GC/Channel) use kar sakta hai
    if (text.startsWith(global.prefix)) {
      const full = text.slice(global.prefix.length).trim();
      const [name, ...args] = full.split(/\s+/);
      const cmd = commands.get(name.toLowerCase());
      if (cmd) {
        try { await cmd.execute(sock, msg, args, { isGroup, isChannel, from, prefix: global.prefix, commands }); }
        catch (e) { console.log(`⚠️ [${name}] ${e.message}`); }
      }
    }
  });

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      global.botOnline = true;
      console.log('✅ LINKED & ONLINE — 24/7');
      if (pendingPair) { console.log(`📱 Number ${pendingPair} connected!`); pendingPair = null; }
    }
    if (connection === 'close') {
      global.botOnline = false;
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log(`❌ Disconnected (${code})`);
      if (code === 401) {
        console.log('🚫 Logged out — pair again via /pair');
        try { fs.emptyDirSync(sessionDir); } catch {}
      }
      if (hasSession()) setTimeout(() => startBot(), 5000);
      else console.log('📱 No session — open /pair to link');
    }
  });
}

// ---------- MAIN START ----------
async function startBot() {
  try {
    const { sock, saveCreds } = await makeSocket();
    attachHandlers(sock, saveCreds);
  } catch (e) {
    console.log('❌ startBot: ' + e.message);
    setTimeout(() => startBot(), 8000);
  }
}

// ---------- WEB ROUTES ----------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.get('/status', (req, res) => res.json({ online: !!global.botOnline, session: hasSession(), commands: commands.size }));

app.get('/pair', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>😈 Storm-MD Pairing</title><style>
  body{background:linear-gradient(135deg,#0b0b12,#2a0505);color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .card{background:#14141f;border:1px solid #ff3b3b55;border-radius:16px;padding:32px;max-width:420px;width:90%;text-align:center;box-shadow:0 0 40px #ff3b3b22}
  h1{background:linear-gradient(45deg,#ff3b3b,#ff9500);-webkit-background-clip:text;background-clip:text;color:transparent;font-size:28px}
  p{color:#888;font-size:14px}
  input{width:100%;padding:14px;margin:14px 0;border-radius:8px;border:1px solid #333;background:#1b1b2a;color:#fff;font-size:16px;text-align:center}
  button{width:100%;padding:14px;background:linear-gradient(45deg,#ff3b3b,#ff9500);border:0;border-radius:8px;color:#fff;font-size:16px;font-weight:700;cursor:pointer}
  .tip{color:#777;font-size:12px;margin-top:12px;line-height:1.7}
  </style></head><body><div class="card">
  <h1>😈 Storm-MD Pairing</h1>
  <p>Country code + number (NO +, NO spaces)</p>
  <form method="POST" action="/pair">
    <input type="tel" name="number" placeholder="e.g. 2250564970037 (Côte d'Ivoire +225)" required>
    <button type="submit">🔥 Generate REAL 8-Digit Code</button>
  </form>
  <div class="tip">⚠️ LINK KARNE SE PEHLE:<br>• Linked Devices me se 1-2 purane devices HATAO (max 4)<br>• Code 60 second me enter karo<br>• Usi number ke WhatsApp me dalo jiska code liya</div>
  </div></body></html>`);
});

app.post('/pair', async (req, res) => {
  const raw = String(req.body.number || '').replace(/[^0-9]/g, '');
  if (raw.length < 10 || raw.length > 15) {
    return res.send('<html><body style="background:#0b0b12;color:#fff;font-family:system-ui;text-align:center;padding-top:80px"><h3>❌ Invalid number (10-15 digits)</h3><a href="/pair" style="color:#ff9500">← Try again</a></body></html>');
  }
  if (hasSession()) {
    return res.send('<html><body style="background:#0b0b12;color:#fff;font-family:system-ui;text-align:center;padding-top:80px"><h3 style="color:#00ff88">✅ Bot already linked!</h3><p>WhatsApp pe .menu bhejo!</p></body></html>');
  }
  try {
    const { sock, saveCreds } = await makeSocket();
    pendingPair = raw;
    await new Promise(r => setTimeout(r, 3500));
    const code = await sock.requestPairingCode(raw);
    // Pairing socket hi bot ban jayega
    attachHandlers(sock, saveCreds);
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>✅ Storm-MD Code</title><style>
    body{background:linear-gradient(135deg,#0b0b12,#2a0505);color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    .card{background:#14141f;border:1px solid #00ff88aa;border-radius:16px;padding:32px;max-width:420px;width:90%;text-align:center}
    .code{font-size:34px;font-weight:800;letter-spacing:6px;color:#00ff88;background:#0d0d14;border:1px dashed #00ff8866;border-radius:10px;padding:18px;margin:16px 0;font-family:monospace}
    .steps{text-align:left;color:#ccc;font-size:14px;line-height:2}
    .warn{background:#ff3b3b22;border:1px solid #ff3b3b66;border-radius:8px;padding:10px;font-size:12px;color:#ff9b9b;margin-top:14px;text-align:left}
    </style></head><body><div class="card">
    <h2 style="color:#00ff88">✅ REAL CODE GENERATED</h2>
    <p style="color:#888">Number: <b style="color:#fff">${raw}</b></p>
    <div class="code">${code}</div>
    <div class="steps"><b>📱 JALDI KARO (60 sec):</b><br>
    1. Usi phone pe WhatsApp kholo (${raw})<br>
    2. Settings → Linked Devices<br>
    3. Pahle 1-2 purane devices HATAO (max 4)<br>
    4. "Link a Device" → "Link with phone number"<br>
    5. Code dalo: <b>${code}</b><br>
    6. ✅ Bot auto-connect ho jayega!</div>
    <div class="warn">⚠️ Agar "couldn't link device" aaye:<br>
    • Purana device hatao (4 ki limit hai)<br>
    • Code expire ho gaya → /pair se naya lo<br>
    • WhatsApp app update karo<br>
    • 10 sec ruko, dobara try karo</div>
    </div></body></html>`);
  } catch (e) {
    res.send(`<html><body style="background:#0b0b12;color:#fff;font-family:system-ui;text-align:center;padding-top:80px"><h3>❌ ${e.message}</h3><p style="color:#888">10 sec ruko, dobara try karo.</p><a href="/pair" style="color:#ff9500">← Try again</a></body></html>`);
  }
});

// ---------- ROAST DATA ----------
function loadAutoRoast() {
  return [
    `🤣 *Auto Roast Activated!*\n_Tu itna fail hai ki fail bhi tera baap hai!_\n🔴 Style: Bold+Italic\n🎨 Color: #FF0000`,
    `😭 *Oye Haddipa!*\n_Teri aukaat se bahar ki baat mat kar_\n✨ _Tujhe dekh ke lagta hai tera Ghar paani me behta hai_`,
    `🔥 *Roasting Mode ON* 🔥\n_Gaali nahi doonga, par teri photo dekh ke ChatGPT bhi hang ho jaye!`,
    `😂 *Ae Chomu!*\n_Tera dimaag itna slow hai ki Google bhi "Loading..." bolke chhod de_`,
    `💀 *INTENSE ROAST* 💀\n_Tujhe dekh ke lagta hai teri shakal purani flop movie hai!_\n🎭 Style: Fancy 🌈 Color: Rainbow`,
    `🤪 *Roast karne bola?*\n_Teri photo vaccine hai — logo ko dekh ke immunity milti hai!`,
    `😎 *Roast Service* 😎\n_Tera naam sunke lagta hai tu free fire ka bot hai_\n🔷 Color: #00FFFF 📝 Style: Cursive`,
    `🥴 *Auto Roast* 🤖\n_Teri shakal dekh ke lagta hai tu beauty competition me 'unique award' jeetega!_\n⭐ _-10/10 rating_`
  ];
}

// ---------- INIT ----------
loadCommands();
app.listen(PORT, () => console.log(`🌐 ${global.botName} web UI on ${PORT}`));

if (hasSession()) startBot();
else console.log('📱 No session — open YOUR_URL/pair to link (no Termux!)');
