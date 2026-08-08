// ============================================
// Storm-MD v2.0 — Demon God Edition
// ✅ FIXED: 8-char code (letters + numbers) — dash sirf hatata hai
// ✅ FIXED: connection wait before requestPairingCode
// ✅ FIXED: fresh session cleanup
// ✅ /api/pair JSON + /pair HTML
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
global.botOnline = false;

const hasSession = () => fs.existsSync(path.join(sessionDir, 'creds.json'));

// 🧹 Stale session cleanup — fresh pairing
function cleanStaleSession() {
  if (hasSession()) return;
  try {
    const files = fs.readdirSync(sessionDir);
    let removed = 0;
    for (const f of files) {
      if (f !== '.gitkeep') { fs.removeSync(path.join(sessionDir, f)); removed++; }
    }
    if (removed) console.log(`🧹 ${removed} stale session files removed`);
  } catch {}
}

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
  cleanStaleSession();
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
    defaultQueryTimeoutMs: 0,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000
  });
  return { sock, saveCreds, DisconnectReason };
}

// 🔥 WAIT for connection ready (Baileys fix)
function waitForConnection(sock, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { cleanup(); reject(new Error('Connection timeout')); }, timeoutMs);
    const onUpdate = ({ connection, lastDisconnect }) => {
      if (connection === 'connecting') { cleanup(); resolve(); }
      if (connection === 'close') { cleanup(); reject(new Error('Connection closed — ' + (new Boom(lastDisconnect?.error)?.output?.statusCode || 'unknown'))); }
      if (connection === 'open') { cleanup(); resolve(); }
    };
    const cleanup = () => { clearTimeout(timer); sock.ev.off('connection.update', onUpdate); };
    sock.ev.on('connection.update', onUpdate);
    if (sock.ws?.readyState === 1) { cleanup(); resolve(); }
  });
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

    // 😈 AUTO REACT
    if (global.autoReactEnabled) {
      const pool = ['⚡','🔥','💥','👋','🤖','💪','🚀','✨','🎯','✅','❤️','😊','👍'];
      try { await sock.sendMessage(from, { react: { text: pool[Math.floor(Math.random() * pool.length)], key: msg.key } }); } catch {}
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

    // ⚡ COMMANDS — public mode
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
        console.log('🚫 Logged out — pair again');
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

function friendlyError(e) {
  const m = (e?.message || '').toLowerCase();
  if (m.includes('401') || m.includes('unauthorized')) return 'Session invalid — session folder clean karke dobara try karo';
  if (m.includes('429') || m.includes('rate') || m.includes('too many')) return '⚠️ WhatsApp ne temporary block kiya — 15-30 min WAIT karo, phir 1 baar try karo!';
  if (m.includes('conflict') || m.includes('close')) return 'Connection close — 10 sec wait karke dobara try karo';
  if (m.includes('not-registered')) return '❌ Ye number WhatsApp pe REGISTERED nahi hai!';
  if (m.includes('timeout')) return 'Connection timeout — server slow hai, dobara try karo';
  return (e?.message || 'Unknown error').slice(0, 180);
}

// ---------- WEB ROUTES ----------
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/status', (req, res) => res.json({ online: !!global.botOnline, session: hasSession(), commands: commands.size }));

// ============================================================
// ✅ /api/pair — JSON (Web UI) — REAL 8-CHAR CODE
// ============================================================
app.post('/api/pair', async (req, res) => {
  try {
    const raw = String(req.body?.number || '').replace(/[^0-9]/g, '');
    if (raw.length < 10 || raw.length > 15) {
      return res.json({ error: 'Invalid number (10-15 digits) — country code ke saath, bina + ke. e.g. 2250564970037' });
    }
    if (hasSession()) {
      return res.json({ error: 'Bot already linked hai! WhatsApp pe .menu bhejo ✅' });
    }

    cleanStaleSession();
    const { sock, saveCreds } = await makeSocket();
    pendingPair = raw;

    // 🔥 Connection ready hone ka wait
    await waitForConnection(sock, 20000);
    console.log('🔌 Connection ready — requesting pairing code...');

    if (sock.authState?.creds?.registered) {
      return res.json({ error: 'Session already registered — session folder delete karke dobara try karo' });
    }

    // 🔥 8 sec extra delay (Baileys issue #1774 fix)
    await new Promise(r => setTimeout(r, 8000));

    const code = await sock.requestPairingCode(raw);

    // ✅ REAL FIX: SIRF dash/space hatana — LETTERS RAKHNA!
    const clean = String(code).replace(/[- ]/g, '').toUpperCase();
    console.log(`✅ REAL CODE for ${raw}: ${clean} (${clean.length} chars)`);

    attachHandlers(sock, saveCreds);

    return res.json({
      code: clean,
      display: clean.slice(0, 4) + '-' + clean.slice(4),
      number: raw,
      expires: 60,
      tip: '8 characters (numbers + letters) — BINA DASH ke dalo: ' + clean
    });
  } catch (e) {
    console.log('❌ /api/pair: ' + e.message);
    return res.json({ error: friendlyError(e) + ' — 30 sec wait karke dobara try karo' });
  }
});

// ============================================================
// /pair HTML (browser fallback)
// ============================================================
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
  .warn{background:#ff3b3b22;border:1px solid #ff3b3b66;border-radius:8px;padding:10px;font-size:12px;color:#ff9b9b;margin-top:14px;text-align:left}
  </style></head><body><div class="card">
  <h1>😈 Storm-MD Pairing</h1>
  <p>Country code + number (NO +, NO spaces)</p>
  <form method="POST" action="/pair">
    <input type="tel" name="number" placeholder="e.g. 2250564970037 (Côte d'Ivoire +225)" required>
    <button type="submit">🔥 Generate REAL 8-Character Code</button>
  </form>
  <div class="tip">⏳ Code aane me 20-40 sec lagte hain (connection ready hota hai)</div>
  <div class="warn">⚠️ CODE = 8 CHARACTERS (numbers + letters dono) — e.g. W7WS6V2A<br><br>
  LINK FAIL HO TO:<br>
  1. Linked Devices se 1-2 HATAO (max 4)<br>
  2. Code BINA DASH dalo (8 characters)<br>
  3. 60 sec ke andar dalo<br>
  4. Baar-baar mat try karo — 15-30 min WhatsApp block karta hai!<br>
  5. 2-step verification OFF karo (temporarily)<br>
  6. VPN OFF karo</div>
  </div></body></html>`);
});

app.post('/pair', async (req, res) => {
  const raw = String(req.body.number || '').replace(/[^0-9]/g, '');
  if (raw.length < 10 || raw.length > 15) {
    return res.send('<html><body style="background:#0b0b12;color:#fff;text-align:center;padding-top:80px"><h3>❌ Invalid number</h3><a href="/pair" style="color:#ff9500">← Try again</a></body></html>');
  }
  if (hasSession()) {
    return res.send('<html><body style="background:#0b0b12;color:#fff;text-align:center;padding-top:80px"><h3 style="color:#00ff88">✅ Bot already linked!</h3></body></html>');
  }
  try {
    cleanStaleSession();
    const { sock, saveCreds } = await makeSocket();
    pendingPair = raw;
    await waitForConnection(sock, 20000);
    await new Promise(r => setTimeout(r, 8000));
    const code = await sock.requestPairingCode(raw);
    // ✅ REAL FIX: SIRF dash hatana — letters rakhna
    const clean = String(code).replace(/[- ]/g, '').toUpperCase();
    attachHandlers(sock, saveCreds);
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>✅ Storm-MD Code</title><style>
    body{background:linear-gradient(135deg,#0b0b12,#2a0505);color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    .card{background:#14141f;border:1px solid #00ff88aa;border-radius:16px;padding:32px;max-width:420px;width:90%;text-align:center}
    .code{font-size:34px;font-weight:800;letter-spacing:6px;color:#00ff88;background:#0d0d14;border:1px dashed #00ff8866;border-radius:10px;padding:18px;margin:16px 0;font-family:monospace}
    .steps{text-align:left;color:#ccc;font-size:14px;line-height:2}
    .warn{background:#ff3b3b22;border:1px solid #ff3b3b66;border-radius:8px;padding:10px;font-size:12px;color:#ff9b9b;margin-top:14px;text-align:left}
    </style></head><body><div class="card">
    <h2 style="color:#00ff88">✅ REAL CODE READY (8 characters)</h2>
    <p style="color:#888">Number: <b style="color:#fff">${raw}</b></p>
    <div class="code">${clean.slice(0,4)}-${clean.slice(4)}</div>
    <div class="steps"><b>📱 BINA DASH DALO: ${clean}</b><br>
    1. Usi phone pe WhatsApp kholo (${raw})<br>
    2. Settings → Linked Devices<br>
    3. Pahle 1-2 purane devices HATAO (max 4)<br>
    4. "Link a Device" → "Link with phone number"<br>
    5. Code dalo: <b>${clean}</b> (bina dash, 8 characters)<br>
    6. ⏱️ 60 sec ke andar! ✅ Bot auto-connect!</div>
    <div class="warn">⚠️ Fail aaye to:<br>
    • 15-30 MIN WAIT karo (WhatsApp temporary block!)<br>
    • 2-step verification OFF karo (temporarily)<br>
    • VPN OFF karo<br>
    • WhatsApp app update karo</div>
    </div></body></html>`);
  } catch (e) {
    res.send(`<html><body style="background:#0b0b12;color:#fff;text-align:center;padding-top:80px"><h3>❌ ${friendlyError(e)}</h3><p style="color:#888">30 sec wait karke dobara try karo.</p><a href="/pair" style="color:#ff9500">← Try again</a></body></html>`);
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
