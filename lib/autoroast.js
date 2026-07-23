// ============================================
// Storm-MD v2.0 — lib/autoroast.js
// AUTO ROAST ENGINE + GAALI + SAYRI + STYLE
// ============================================

/**
 * 🔥 AUTO ROAST DATA
 * Har message ke reply me automatically roast karega
 * Features:
 * - Normal gaali (MC, BC, BKL, CHUTIYE, MADARCHOD, etc.)
 * - Emoji ke saath
 * - Shayri style
 * - Text style (Bold, Italic, Fancy, Cursive, Glitch)
 * - Text color fill (Red, Blue, Green, Rainbow, etc.)
 */

const roasts = [
  // ===== ROAST 1 =====
  {
    id: 'roast01',
    text: `╔═══ *🔥 𝐀𝐔𝐓𝐎 𝐑𝐎𝐀𝐒𝐓 🔥* ═══╗\n\n` +
          `*𝐓𝐞𝐫𝐢 𝐚𝐮𝐤𝐚𝐚𝐭 𝐬𝐞 𝐛𝐚𝐡𝐚𝐫 𝐤𝐢 𝐛𝐚𝐚𝐭 𝐦𝐚𝐭 𝐤𝐚𝐫!*\n` +
          `*𝐓𝐮 𝐢𝐭𝐧𝐚 𝐟𝐚𝐢𝐥 𝐡𝐚𝐢 𝐤𝐢 𝐟𝐚𝐢𝐥 𝐛𝐡𝐢 𝐭𝐞𝐫𝐚 𝐛𝐚𝐚𝐩 𝐡𝐚𝐢!* 🤣\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐁𝐨𝐥𝐝 + 𝐈𝐭𝐚𝐥𝐢𝐜 + 𝐅𝐚𝐧𝐜𝐲\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝐅𝐅𝟎𝟎𝟎𝟎 (𝐑𝐞𝐝 𝐅𝐢𝐫𝐞)\n` +
          `📝 *𝐒𝐚𝐲𝐫𝐢:* 𝐓𝐮𝐣𝐡𝐬𝐞 𝐧𝐚 𝐡𝐨 𝐩𝐚𝐲𝐞𝐠𝐚!\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐁𝐊𝐋 𝐌𝐂 𝐁𝐂 𝐂𝐇𝐔𝐓𝐈𝐘𝐄 𝐌𝐀𝐃𝐀𝐑𝐂𝐇𝐎𝐃 🖕`,
    emoji: '🤣🔥💀',
    gaali: 'BKL MC BC CHUTIYE MADARCHOD 🖕',
    color: '#FF0000',
    style: 'bold-italic-fancy'
  },

  // ===== ROAST 2 =====
  {
    id: 'roast02',
    text: `╔═══ *😭 𝐈𝐍𝐓𝐄𝐍𝐒𝐄 𝐑𝐎𝐀𝐒𝐓 😭* ═══╗\n\n` +
          `*𝐓𝐞𝐫𝐢 𝐬𝐡𝐚𝐤𝐚𝐥 𝐝𝐞𝐤𝐡 𝐤𝐞 𝐥𝐚𝐠𝐭𝐚 𝐡𝐚𝐢*\n` +
          `*𝐓𝐮 𝐛𝐞𝐚𝐮𝐭𝐲 𝐜𝐨𝐦𝐩𝐞𝐭𝐢𝐭𝐢𝐨𝐧 𝐦𝐞*'𝐮𝐧𝐢𝐪𝐮𝐞 𝐚𝐰𝐚𝐫𝐝'*𝐣𝐞𝐞𝐭𝐞𝐠𝐚!* 😭\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐅𝐚𝐧𝐜𝐲 𝐂𝐮𝐫𝐬𝐢𝐯𝐞\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝐅𝐅𝐀𝟓𝟎𝟎 (𝐎𝐫𝐚𝐧𝐠𝐞 𝐅𝐢𝐫𝐞)\n` +
          `📝 *𝐑𝐚𝐭𝐢𝐧𝐠:* -𝟏𝟎/𝟏𝟎 ⭐\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐌𝐀𝐃𝐀𝐑𝐂𝐇𝐎𝐃 𝐁𝐊𝐋 𝐌𝐂 🖕🖕🖕`,
    emoji: '😭💔🤡',
    gaali: 'MADARCHOD BKL MC 🖕',
    color: '#FFA500',
    style: 'fancy-cursive'
  },

  // ===== ROAST 3 =====
  {
    id: 'roast03',
    text: `╔═══ *💀 𝐒𝐔𝐏𝐄𝐑 𝐑𝐎𝐀𝐒𝐓 💀* ═══╗\n\n` +
          `*𝐓𝐞𝐫𝐚 𝐝𝐢𝐦𝐚𝐚𝐠 𝐢𝐭𝐧𝐚 𝐬𝐥𝐨𝐰 𝐡𝐚𝐢*\n` +
          `*𝐊𝐢 𝐆𝐨𝐨𝐠𝐥𝐞 𝐛𝐡𝐢 "𝐋𝐨𝐚𝐝𝐢𝐧𝐠..." 𝐛𝐨𝐥𝐤𝐞 𝐜𝐡𝐨𝐝 𝐝𝐞!* 💀\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐆𝐥𝐢𝐭𝐜𝐡 𝐄𝐟𝐟𝐞𝐜𝐭\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* 𝐑𝐚𝐢𝐧𝐛𝐨𝐰 🌈\n` +
          `📝 *𝐒𝐚𝐲𝐫𝐢:* 𝐓𝐞𝐫𝐢 𝐚𝐮𝐤𝐚𝐚𝐭 𝐤𝐲𝐚 𝐡𝐚𝐢?\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐁𝐇𝐄𝐍𝐂𝐇𝐎𝐃 𝐁𝐊𝐋 𝐌𝐀𝐃𝐀𝐑𝐂𝐇𝐎𝐃 💀`,
    emoji: '💀🔥😈',
    gaali: 'BHENCHOD BKL MADARCHOD 💀',
    color: 'rainbow',
    style: 'glitch'
  },

  // ===== ROAST 4 =====
  {
    id: 'roast04',
    text: `╔═══ *🤣 𝐀𝐔𝐓𝐎 𝐑𝐎𝐀𝐒𝐓 𝐌𝐎𝐃𝐄 🤣* ═══╗\n\n` +
          `*𝐎𝐲𝐞 𝐡𝐚𝐝𝐝𝐢𝐩𝐚! 𝐓𝐮 𝐡𝐚𝐢 𝐤𝐚𝐮𝐧?!* 🔥\n` +
          `*𝐁𝐨𝐥𝐧𝐞 𝐤𝐢 𝐚𝐮𝐤𝐚𝐚𝐭 𝐧𝐚𝐡𝐢 𝐡𝐚𝐢 𝐭𝐮𝐣𝐡𝐞!* 🤬\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐁𝐨𝐥𝐝 + 𝐂𝐨𝐥𝐨𝐫𝐟𝐮𝐥\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝐅𝐅𝟎𝟎𝐅𝐅 (𝐍𝐞𝐨𝐧 𝐏𝐢𝐧𝐤)\n` +
          `💯 *𝐄𝐱𝐭𝐫𝐚:* +𝟏𝟎𝟎 𝐞𝐦𝐨𝐣𝐢𝐬 + 𝐅𝐢𝐫𝐞 𝐞𝐟𝐟𝐞𝐜𝐭𝐬\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐂𝐇𝐔𝐓𝐈𝐘𝐄 𝐁𝐊𝐋 𝐌𝐂 𝐁𝐂 🖕🖕`,
    emoji: '🤣😂💪',
    gaali: 'CHUTIYE BKL MC BC 🖕',
    color: '#FF00FF',
    style: 'bold-colorful'
  },

  // ===== ROAST 5 =====
  {
    id: 'roast05',
    text: `╔═══ *🔥 𝐃𝐀𝐍𝐆𝐄𝐑 𝐑𝐎𝐀𝐒𝐓 🔥* ═══╗\n\n` +
          `*𝐓𝐮 𝐢𝐭𝐧𝐚 𝐛𝐞𝐰𝐚𝐤𝐨𝐨𝐟 𝐡𝐚𝐢 𝐤𝐢*\n` +
          `*𝐁𝐞𝐰𝐚𝐤𝐨𝐨𝐟 𝐛𝐡𝐢 𝐭𝐞𝐫𝐚 𝐛𝐚𝐚𝐩 𝐡𝐚𝐢!* 🔥\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐅𝐢𝐫𝐞 𝐄𝐟𝐟𝐞𝐜𝐭\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝐅𝐅𝟒𝟓𝟎𝟎 (𝐑𝐞𝐝-𝐎𝐫𝐚𝐧𝐠𝐞)\n` +
          `📝 *𝐒𝐚𝐲𝐫𝐢:* 𝐍𝐚 𝐤𝐚𝐫 𝐲𝐚𝐫𝐫 𝐬𝐡𝐚𝐫𝐦 𝐤𝐚𝐫\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐁𝐊𝐋 𝐌𝐂 𝐂𝐇𝐔𝐓𝐈𝐘𝐄 𝐌𝐀𝐃𝐀𝐑𝐂𝐇𝐎𝐃 🔥🖕`,
    emoji: '🔥💀😈🤬',
    gaali: 'BKL MC CHUTIYE MADARCHOD 🔥🖕',
    color: '#FF4500',
    style: 'fire-effect'
  },

  // ===== ROAST 6 =====
  {
    id: 'roast06',
    text: `╔═══ *😤 𝐀𝐁𝐔𝐒𝐄 𝐌𝐎𝐃𝐄 😤* ═══╗\n\n` +
          `*𝐁𝐞𝐭𝐚, 𝐭𝐮𝐣𝐡𝐣𝐚 𝐛𝐚𝐚𝐩 𝐛𝐡𝐢 𝐭𝐞𝐫𝐚 𝐬𝐚𝐚𝐭𝐡 𝐧𝐚𝐡𝐢 𝐝𝐞𝐠𝐚!* 😤\n` +
          `*𝐊𝐲𝐮𝐧𝐤𝐢 𝐛𝐞𝐰𝐚𝐤𝐨𝐨𝐟𝐨𝐧 𝐤𝐚 𝐤𝐨𝐢 𝐝𝐨𝐬𝐭𝐫 𝐧𝐚𝐡𝐢 𝐡𝐨𝐭𝐚!* 🤡\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐀𝐛𝐮𝐬𝐢𝐯𝐞 𝐁𝐨𝐥𝐝\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝟖𝐁𝟎𝟎𝟎𝟎 (𝐃𝐚𝐫𝐤 𝐑𝐞𝐝)\n` +
          `📝 *𝐓𝐚𝐮𝐧𝐭:* +𝟓𝟎 𝐭𝐚𝐮𝐧𝐭𝐬 𝐢𝐧𝐜𝐥𝐮𝐝𝐞𝐝\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐁𝐂 𝐁𝐊𝐋 𝐌𝐂 𝐂𝐇𝐔𝐓𝐈𝐘𝐄 𝐌𝐀𝐃𝐀𝐑𝐂𝐇𝐎𝐃 𝐁𝐇𝐄𝐍𝐂𝐇𝐎𝐃 🖕🖕🖕`,
    emoji: '😤🤡🔥',
    gaali: 'BC BKL MC CHUTIYE MADARCHOD BHENCHOD 🖕🖕🖕',
    color: '#8B0000',
    style: 'abusive-bold'
  },

  // ===== ROAST 7 =====
  {
    id: 'roast07',
    text: `╔═══ *🤡 𝐂𝐎𝐌𝐄𝐃𝐘 𝐑𝐎𝐀𝐒𝐓 🤡* ═══╗\n\n` +
          `*𝐓𝐮 𝐢𝐭𝐧𝐚 𝐟𝐮𝐧𝐧𝐲 𝐡𝐚𝐢*\n` +
          `*𝐊𝐢 𝐭𝐮𝐣𝐡𝐞 𝐝𝐞𝐤𝐡 𝐤𝐞 𝐁𝐀𝐋𝐀𝐊 𝐛𝐡𝐢 𝐫𝐨𝐟𝐫 𝐥𝐚𝐠𝐭𝐚 𝐡𝐚𝐢!* 🤡\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐁𝐨𝐥𝐝 + 𝐒𝐩𝐨𝐧𝐠𝐞𝐛𝐨𝐛 𝐌𝐨𝐜𝐤\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝟎𝟎𝐅𝐅𝟎𝟎 (𝐍𝐞𝐨𝐧 𝐆𝐫𝐞𝐞𝐧)\n` +
          `😂 *𝐄𝐱𝐭𝐫𝐚:* +𝟐𝟎 𝐣𝐨𝐤𝐞𝐬 + 𝐥𝐚𝐮𝐠𝐡𝐢𝐧𝐠 𝐞𝐦𝐨𝐣𝐢𝐬\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐁𝐊𝐋 𝐌𝐂 𝐁𝐂 😂🤡🖕`,
    emoji: '🤡😂🖕',
    gaali: 'BKL MC BC 😂🤡🖕',
    color: '#00FF00',
    style: 'mock-bold'
  },

  // ===== ROAST 8 =====
  {
    id: 'roast08',
    text: `╔═══ *💔 𝐒𝐀𝐃 𝐑𝐎𝐀𝐒𝐓 💔* ═══╗\n\n` +
          `*𝐁𝐢𝐜𝐡𝐚𝐫𝐚 𝐬𝐨𝐜𝐡𝐭𝐚 𝐡𝐚𝐢 𝐤𝐢 𝐮𝐬𝐤𝐢 𝐛𝐚𝐚𝐭 𝐤𝐨𝐞 𝐦𝐚𝐚𝐧𝐞𝐠𝐚*\n` +
          `*𝐏𝐚𝐫 𝐡𝐚𝐫 𝐤𝐨𝐢 𝐮𝐬𝐤𝐨 𝐝𝐞𝐤𝐡 𝐤𝐞 𝐡𝐚𝐬𝐬𝐞𝐠𝐚!* 💔\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐒𝐚𝐝 𝐛𝐮𝐭 𝐓𝐫𝐮𝐞 𝐁𝐨𝐥𝐝\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝟗𝟗𝟗𝟗𝐅𝐅 (𝐋𝐚𝐯𝐞𝐧𝐝𝐞𝐫 𝐁𝐥𝐮𝐞)\n` +
          `💧 *𝐓𝐞𝐱𝐭:* 𝐒𝐀𝐃 + 𝐅𝐔𝐍𝐍𝐘 + 𝐓𝐀𝐔𝐍𝐓𝐒\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐂𝐇𝐔𝐓𝐈𝐘𝐄 𝐁𝐊𝐋 💔🖕`,
    emoji: '💔😭😅',
    gaali: 'CHUTIYE BKL 💔🖕',
    color: '#9999FF',
    style: 'sad-bold'
  },

  // ===== ROAST 9 =====
  {
    id: 'roast09',
    text: `╔═══ *🤬 𝐅𝐔𝐋𝐋 𝐀𝐁𝐔𝐒𝐄 𝐌𝐎𝐃𝐄 🤬* ═══╗\n\n` +
          `*𝐀𝐫𝐞 𝐨 𝐛𝐡𝐚𝐢! 𝐓𝐞𝐫𝐞 𝐬𝐞 𝐧𝐚 𝐡𝐨 𝐩𝐚𝐲𝐞𝐠𝐚!* 🖕\n` +
          `*𝐏𝐡𝐥𝐞 𝐚𝐩𝐧𝐢 𝐚𝐮𝐤𝐚𝐚𝐭 𝐝𝐞𝐤𝐡 𝐩𝐡𝐢𝐫 𝐛𝐨𝐥𝐧𝐚!* 🤬\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐀𝐠𝐠𝐫𝐞𝐬𝐬𝐢𝐯𝐞 𝐑𝐨𝐚𝐫\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝐅𝐅𝟎𝟎𝟎𝟎 + #𝟎𝟎𝟎𝟎𝟎𝟎 (𝐁𝐥𝐚𝐜𝐤 & 𝐑𝐞𝐝)\n` +
          `🖕 *𝐆𝐚𝐚𝐥𝐢 𝐂𝐨𝐮𝐧𝐭:* 𝟓𝟎+ 𝐠𝐚𝐚𝐥𝐢𝐬 𝐢𝐧𝐜𝐥𝐮𝐝𝐞𝐝\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐌𝐀𝐃𝐀𝐑𝐂𝐇𝐎𝐃 𝐁𝐇𝐄𝐍𝐂𝐇𝐎𝐃 𝐁𝐊𝐋 𝐌𝐂 𝐁𝐂 𝐂𝐇𝐔𝐓𝐈𝐘𝐄 🖕🖕🖕🖕🖕`,
    emoji: '🤬🖕🔥',
    gaali: 'MADARCHOD BHENCHOD BKL MC BC CHUTIYE 🖕🖕🖕🖕🖕',
    color: '#FF0000',
    style: 'aggressive-roar'
  },

  // ===== ROAST 10 =====
  {
    id: 'roast10',
    text: `╔═══ *🎭 𝐒𝐇𝐀𝐘𝐀𝐑𝐈 𝐑𝐎𝐀𝐒𝐓 🎭* ═══╗\n\n` +
          `*𝐀𝐢𝐬𝐞 𝐧𝐚 𝐛𝐨𝐥 𝐨 𝐣𝐚𝐚𝐧 𝐞 𝐣𝐚𝐚𝐧,*\n` +
          `*𝐓𝐞𝐫𝐢 𝐚𝐮𝐤𝐚𝐚𝐭 𝐤𝐲𝐚 𝐡𝐚𝐢 𝐩𝐞𝐡𝐜𝐡𝐚𝐧!* 🎭\n` +
          `*𝐌𝐮𝐣𝐡𝐞 𝐚𝐚𝐭𝐚 𝐡𝐚𝐢 𝐫𝐨𝐚𝐬𝐭 𝐤𝐚 𝐟𝐚𝐧,*\n` +
          `*𝐓𝐮𝐣𝐡𝐞 𝐤𝐚𝐫 𝐝𝐮𝐧𝐠𝐚 𝐛𝐞𝐝𝐡𝐚𝐍!* 🔥\n\n` +
          `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐒𝐡𝐚𝐲𝐚𝐫𝐢 + 𝐁𝐨𝐥𝐝\n` +
          `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝐃𝐀𝟕𝟎𝐃𝟕 (𝐏𝐮𝐫𝐩𝐥𝐞 𝐆𝐨𝐥𝐝)\n` +
          `📝 *𝐅𝐮𝐥𝐥 𝐒𝐡𝐚𝐲𝐚𝐫𝐢 𝐢𝐧 𝟒 𝐥𝐢𝐧𝐞𝐬*\n\n` +
          `╚══════════════════╝\n` +
          `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐂𝐇𝐔𝐓𝐈𝐘𝐄 𝐁𝐊𝐋 𝐌𝐂 𝐁𝐂 (𝐒𝐡𝐚𝐲𝐚𝐫𝐢 𝐤𝐞 𝐬𝐚𝐚𝐭𝐡) 🎭🖕`,
    emoji: '🎭🔥😎',
    gaali: 'CHUTIYE BKL MC BC (Shayari ke saath) 🎭🖕',
    color: '#DA70D7',
    style: 'shayari-bold'
  }
];

// ==========================================
// AUTO ROAST DATA (For /autoroast command)
// ==========================================
const autoRoastData = {
  name: 'autoRoast',
  version: '2.0',
  totalRoasts: roasts.length,
  
  // Get random roast
  getRandomRoast() {
    return roasts[Math.floor(Math.random() * roasts.length)];
  },
  
  // Get roast by ID
  getRoastById(id) {
    return roasts.find(r => r.id === id);
  },
  
  // Get all roasts
  getAllRoasts() {
    return roasts;
  },
  
  // Get roasts count
  getRoastsCount() {
    return roasts.length;
  },
  
  // Generate custom roast with user name
  generateCustomRoast(userName) {
    const base = this.getRandomRoast();
    const name = userName || 'Bhai';
    
    const customText = `╔═══ *🔥 𝐀𝐔𝐓𝐎 𝐑𝐎𝐀𝐒𝐓 🔥* ═══╗\n\n` +
      `*𝐀𝐫𝐞 ${name}! 𝐓𝐮 𝐢𝐭𝐧𝐚 𝐛𝐞𝐰𝐚𝐤𝐨𝐨𝐟 𝐡𝐚𝐢*\n` +
      `*𝐊𝐢 𝐛𝐞𝐰𝐚𝐤𝐨𝐨𝐟 𝐛𝐡𝐢 𝐭𝐞𝐫𝐚 𝐛𝐚𝐚𝐩 𝐡𝐚𝐢!* 🤣\n\n` +
      `✦ *𝐒𝐭𝐲𝐥𝐞:* 𝐂𝐮𝐬𝐭𝐨𝐦 𝐑𝐨𝐚𝐬𝐭\n` +
      `🎨 *𝐂𝐨𝐥𝐨𝐫:* #𝐅𝐅𝟎𝟎𝟎𝟎\n` +
      `📝 *𝐓𝐚𝐫𝐠𝐞𝐭:* ${name}\n\n` +
      `╚══════════════════╝\n` +
      `🤬 *𝐆𝐚𝐚𝐥𝐢:* 𝐁𝐊𝐋 𝐌𝐂 𝐂𝐇𝐔𝐓𝐈𝐘𝐄 🖕🖕`;
    
    return {
      text: customText,
      emoji: base.emoji,
      gaali: base.gaali,
      color: base.color
    };
  },
  
  // Get random gaali (extra)
  getRandomGaali() {
    const gaalis = [
      '𝐁𝐊𝐋 🖕', '𝐌𝐂 🖕', '𝐁𝐂 🖕', '𝐂𝐇𝐔𝐓𝐈𝐘𝐄 🖕', '𝐌𝐀𝐃𝐀𝐑𝐂𝐇𝐎𝐃 🖕',
      '𝐁𝐇𝐄𝐍𝐂𝐇𝐎𝐃 🖕', '𝐇𝐀𝐃𝐃𝐈𝐏𝐀 🖕', '𝐂𝐇𝐎𝐌𝐔 🖕', '𝐑𝐀𝐍𝐃𝐈𝐁𝐀𝐀𝐙 🖕', '𝐊𝐔𝐓𝐓𝐄 🖕',
      '𝐁𝐄𝐖𝐀𝐊𝐎𝐎𝐅 🖕', '𝐒𝐀𝐋𝐄 🖕', '𝐌𝐀𝐃𝐀𝐑𝐂𝐇𝐎𝐃 𝐁𝐊𝐋 🖕', '𝐁𝐇𝐄𝐍𝐂𝐇𝐎𝐃 𝐌𝐂 🖕'
    ];
    return gaalis[Math.floor(Math.random() * gaalis.length)];
  },
  
  // Get random emoji set
  getRandomEmojis() {
    const emojiSets = [
      '🤣🔥💀', '😭💔🤡', '💀🔥😈', '🤣😂💪', '🔥💀😈🤬',
      '😤🤡🔥', '🤡😂🖕', '💔😭😅', '🤬🖕🔥', '🎭🔥😎',
      '😭😭😭', '🤣🤣🤣', '🔥🔥🔥', '💀💀💀', '🖕🖕🖕'
    ];
    return emojiSets[Math.floor(Math.random() * emojiSets.length)];
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  roasts,
  autoRoastData,
  
  // Helper functions
  getRandomRoast: () => autoRoastData.getRandomRoast(),
  getRoastById: (id) => autoRoastData.getRoastById(id),
  getAllRoasts: () => autoRoastData.getAllRoasts(),
  generateCustomRoast: (name) => autoRoastData.generateCustomRoast(name),
  getRandomGaali: () => autoRoastData.getRandomGaali(),
  getRandomEmojis: () => autoRoastData.getRandomEmojis()
};
