// ============================================
// Storm-MD v2.0 — Pairing Code Generator (CLI)
// ✅ +225 (Côte d'Ivoire) aur sab countries
// ============================================

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
require('./config.js');

const sessionDir = path.join(__dirname, 'session');
fs.ensureDirSync(sessionDir);
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function run() {
  const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, DisconnectReason } = await import('@whiskeysockets/baileys');
  console.log('');
  console.log('╔══════════════════════════════════╗');
  console.log(`║   ${global.botName} v${global.botVersion}         ║`);
  console.log('║   🔥 REAL 8-DIGIT PAIRING 🔥    ║');
  console.log('║   📱 No Termux | Any Number     ║');
  console.log('╚══════════════════════════════════╝');
  console.log('');

  const number = await new Promise(r => rl.question('📱 Number (country code + number, NO +):\n> ', a => a.trim()));
  const phone = number.replace(/[^0-9]/g, '');
  if (phone.length < 10 || phone.length > 15) {
    console.log('❌ Invalid!');
    console.log('✅ Côte d\'Ivoire (+225): 2250700000000');
    console.log('✅ India (+91): 919337948764');
    rl.close(); return;
  }

  console.log(`\n📞 ${phone} — connecting to WhatsApp servers...\n`);
  try {
    const { version } = await fetchLatestBaileysVersion();
    console.log(`📡 Baileys v${version.join('.')}`);
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const sock = makeWASocket({
      version, auth: state, printQRInTerminal: false,
      browser: global.browserDescription || ['Chrome (Kali Linux)', 'Firefox (Ubuntu)', '4.0.0'],
      logger: pino({ level: 'silent' }), markOnlineOnConnect: false,
      syncFullHistory: false, defaultQueryTimeoutMs: 120000, keepAliveIntervalMs: 30000
    });
    await new Promise(r => setTimeout(r, 3500));

    if (!sock.authState.creds.registered) {
      console.log('🔄 Generating REAL 8-digit pairing code...\n');
      const code = await sock.requestPairingCode(phone);
      const f = code.match(/.{1,4}/g)?.join('-') || code;
      console.log('╔══════════════════════════════════════╗');
      console.log('║     ✅ PAIRING CODE GENERATED ✅     ║');
      console.log(`║  📱 Number: ${phone}`);
      console.log(`║  🔑 Code:   ${f}`);
      console.log('╠══════════════════════════════════════╣');
      console.log('║  1. WhatsApp → Settings → Linked     ║');
      console.log('║  2. Link a Device                    ║');
      console.log('║  3. Link with phone number           ║');
      console.log('║  4. Enter code                       ║');
      console.log('╚══════════════════════════════════════╝\n');
      sock.ev.on('creds.update', saveCreds);
      sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open') { console.log('✅ CONNECTED! Session saved. Run: npm start'); process.exit(0); }
        if (connection === 'close') { console.log('❌ Disconnected. Try again in 10s.'); process.exit(1); }
      });
      console.log('⏳ Waiting for you to enter the code in WhatsApp...\n');
    } else {
      console.log('✅ Already registered — just run: npm start');
      process.exit(0);
    }
  } catch (e) {
    console.log('❌ ' + e.message);
    console.log('⚠️ Known Baileys issue — wait 10s, delete session/, retry.');
    process.exit(1);
  }
}
run();
