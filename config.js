// ============================================
// Storm-MD v2.0 — Config
// 👑 Owner: Krishu | 😈 Demon God
// ============================================

global.botName = 'Storm-MD';
global.botVersion = '2.0.0';
global.botEmoji = '😈';
global.prefix = '.';
global.mode = 'public';

// 📱 REAL DEVICE — Kali Linux / Ubuntu / etc.
global.browserDescription = [
  'Chrome (Kali Linux)',
  'Firefox (Ubuntu)',
  '4.0.0'
];

// 👑 OWNER (hidden from public)
global.ownerName = 'Krishu';
global.ownerInstagram = '@demon_god__2009';
global.ownerNumbers = process.env.OWNER_NUMBER ? [process.env.OWNER_NUMBER] : ['2250700000000'];

// 🌐 API KEYS (env se bhi read hota hai)
global.apiKeys = {
  gemini: process.env.GEMINI_API_KEY || 'AQ.Ab8RN6Lqz3GwHf1gJiZgTUDPZ09m7SF26so6CQ50fISJCUfl7g',
  openroute: process.env.OPENROUTER_API_KEY || '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',
  removebg: process.env.REMOVEBG_API_KEY || 'CanhJFceWMz4NgNy1WqBr4QQ',
  weather: process.env.WEATHER_API_KEY || '08f1d261bff8466f99a145653262307'
};

global.autoroastEnabled = true;
global.autoReactEnabled = true;
global.aiEnabled = true;
global.respondTimeout = 5000;
global.pairingTimeout = 60000;
