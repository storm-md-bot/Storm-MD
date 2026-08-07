// ============================================
// Storm-MD v2.0 — Pairing Code Generator (ESM)
// ============================================

import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sessionDir = path.join(__dirname, 'session');
fs.ensureDirSync(sessionDir);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generatePairing() {
  console.log('');
  console.log('╔══════════════════════════════════╗');
  console.log(`║     ${global.botName} v${global.botVersion}       ║`);
  console.log('║   🔥 REAL 8-DIGIT PAIRING 🔥    ║');
  console.log('║   📱 No Termux | Any Number     ║');
  console.log('║   ✅ @whiskeysockets/baileys     ║');
  console.log('╚══════════════════════════════════╝');
  console.log('');

  const number = await new Promise((resolve) => {
    rl.question('📱 Your WhatsApp Number (country code, NO + sign, NO spaces):\n> ', (answer) => {
      resolve(answer.trim());
    });
  });

  const phoneNumber = number.replace(/[^0-9]/g, '');
  if (phoneNumber.length < 10 || phoneNumber.length > 15) {
    console.log('❌ Invalid number! Must be 10-15 digits with country code.');
    console.log('✅ Example: 919337948764 (for India +91)');
    rl.close();
    return;
  }

  console.log(`\n📞 Number: ${phoneNumber}`);
  console.log('⏳ Connecting to WhatsApp servers...\n');

  try {
    const { version } = await fetchLatestBaileysVersion();
    console.log(`📡 Baileys v${version.join('.')}`);

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    const sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      browser: global.browserDescription || ['Chrome (Kali Linux)', 'Firefox (Ubuntu)', '4.0.0'],
      logger: pino({ level: 'silent' }),
      markOnlineOnConnect: false,
      syncFullHistory: false,
      defaultQueryTimeoutMs: 120000,
      keepAliveIntervalMs: 30000,
      generateHighQualityLinkPreview: false
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    if (!sock.authState.creds.registered) {
      console.log('🔄 Generating REAL 8-digit pairing code...\n');
      
      const pairingCode = await sock.requestPairingCode(phoneNumber);
      const formattedCode = pairingCode.match(/.{1,4}/g)?.join('-') || pairingCode;
      
      console.log('');
      console.log('╔══════════════════════════════════════╗');
      console.log('║     ✅ PAIRING CODE GENERATED ✅     ║');
      console.log('╠══════════════════════════════════════╣');
      console.log(`║  📱 Number: ${phoneNumber}            `);
      console.log(`║  🔑 Code:   ${formattedCode}              `);
      console.log('╠══════════════════════════════════════╣');
      console.log('║  HOW TO USE:                        ║');
      console.log('║  1. Open WhatsApp on your phone     ║');
      console.log('║  2. Menu → Linked Devices           ║');
      console.log('║  3. Tap "Link a Device"             ║');
      console.log('║  4. Tap "Link with phone number"    ║');
      console.log('║  5. Enter this 8-digit code         ║');
      console.log('╠══════════════════════════════════════╣');
      console.log(`║  💡 Code: ${formattedCode}           `);
      console.log('╚══════════════════════════════════════╝');
      console.log('');

      sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
          console.log('✅ ✅ ✅ BOT CONNECTED SUCCESSFULLY! ✅ ✅ ✅');
          console.log(`🤖 ${global.botName} is now ONLINE`);
          console.log('💾 Session saved! You can now run: npm start');
          
          sock.ev.on('creds.update', saveCreds);
          
          rl.close();
          process.exit(0);
        } else if (connection === 'close') {
          const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
          if (statusCode === DisconnectReason.loggedOut) {
            console.log('❌ Logged out! Delete session folder and try again.');
          } else {
            console.log(`❌ Connection error (${statusCode}). Retrying...`);
          }
          rl.close();
          process.exit(1);
        }
      });

      console.log('⏳ Waiting for you to enter the code in WhatsApp...');
      console.log('⏳ This will auto-detect when connected.\n');
      
    } else {
      console.log('✅ Already registered! Just run: npm start');
      rl.close();
      process.exit(0);
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('⚠️ Connection error. This is a known Baileys issue.');
    console.log('✅ Fixes applied. Try again after 10 seconds.');
    console.log('💡 Still failing? Delete the session folder and retry.');
    rl.close();
    process.exit(1);
  }
}

generatePairing();
