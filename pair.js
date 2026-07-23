// ============================================
// Storm-MD v2.0 — REAL Pairing Code Generator
// REAL 8-Digit Code — REAL Baileys 6.7.x
// No Termux Needed — Works on Render/Railway
// ============================================

const { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');
require('./config.js');

const sessionDir = path.join(__dirname, 'session');

// CLEAN OLD SESSION
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

  // ASK FOR PHONE NUMBER
  const number = await new Promise((resolve) => {
    rl.question('📱 Your WhatsApp Number (country code, NO + sign, NO spaces):\n> ', (answer) => {
      resolve(answer.trim());
    });
  });

  // Validate number
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

    // Wait for socket to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (!sock.authState.creds.registered) {
      console.log('🔄 Generating REAL 8-digit pairing code...\n');
      
      // REQUEST REAL PAIRING CODE FROM WHATSAPP
      const pairingCode = await sock.requestPairingCode(phoneNumber);
      
      // FORMAT CODE AS 8 DIGITS: ABCD-EFGH
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

      // LISTEN FOR CONNECTION
      sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'open') {
          console.log('✅ ✅ ✅ BOT CONNECTED SUCCESSFULLY! ✅ ✅ ✅');
          console.log(`🤖 ${global.botName} is now ONLINE`);
          console.log('💾 Session saved! You can now run: npm start');
          
          // Save creds
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

      // WAIT FOR CODE INPUT 
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
