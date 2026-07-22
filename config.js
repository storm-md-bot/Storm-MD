// ============================================
// Storm-MD v2.0 — Advanced Config
// ============================================

const fs = require('fs-extra');
const path = require('path');

// ⚡ BOT SETTINGS
global.botName = 'Storm-MD';
global.botVersion = '2.0.0';
global.botEmoji = '⚡';
global.prefix = '.';
global.mode = 'public'; // 'public' or 'private'

// 📱 DEVICE SPOOFING — Real device showing
global.browserDescription = [
  'Chrome (Kali Linux)',   // Custom device name shown
  'Firefox (Ubuntu)',      // Second identifier  
  '4.0.0'                  // Version
];

// 👑 OWNER SETTINGS (HIDDEN FROM PUBLIC)
global.ownerNumbers = ['91XXXXXXXXXX']; // Only visible in owner commands
global.ownerName = 'Krishu';

// 🌐 FREE API KEYS (Real working free APIs)
global.apiKeys = {
  gemini: 'AQ.Ab8RN6Lqz3GwHf1gJiZgTUDPZ09m7SF26so6CQ50fISJCUfl7g', // 🔑 GET FREE: https://aistudio.google.com/apikey
  openroute: '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', // 🔑 GET FREE: https://openrouter.ai/keys  
  removebg: '',               // optional
  weather: ''                 // optional
};

// 🤖 FEATURE TOGGLES
global.autoroastEnabled = true;
global.autoReactEnabled = true;
global.aiEnabled = true;

// ⏱️ TIMEOUT SETTINGS
global.respondTimeout = 5000;
global.pairingTimeout = 60000;

module.exports = { config: global };
