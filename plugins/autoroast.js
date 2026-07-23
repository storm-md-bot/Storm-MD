// ============================================
// Storm-MD — Auto Roast Plugin
// /autoroast — Auto reply with roast
// ============================================

const roasts = [
  { 
    name: 'roast1',
    text: `╔═══ *🔥 AUTO ROAST 🔥* ═══╗\n\n_Teri aukaat se bahar ki baat mat kar_\n_Tu itna fail hai ki fail bhi tera baap hai!_\n\n✦ *Style:* Bold + Italic + Fancy\n🎨 *Color:* #FF0000\n📝 *Sayri:* Tujhse na ho payega!\n\n╚══════════════════╝\n_Gaali: 🤬 BKL MC BC CHUTIYE_`,
    emoji: '🤣🔥💀'
  },
  {
    name: 'roast2',
    text: `╔═══ *😭 INTENSE ROAST 😭* ═══╗\n\n_Teri shakal dekh ke lagta hai_\n_Tu beauty competition me 'unique award' jeetega!_\n\n✦ *Rating:* -10/10\n🎨 *Color:* #FFA500\n📝 *Text Style:* Fancy Cursive\n\n╚══════════════════╝\n_Gaali: 🖕 BKL MC BC_`,
    emoji: '😭💔🤡'
  },
  {
    name: 'roast3',
    text: `╔═══ *💀 SUPER ROAST 💀* ═══╗\n\n_Tera dimaag itna slow hai_\n_Ki Google bhi "Loading..." bolke chhod de!_\n\n✦ *Style:* Glitch Effect\n🎨 *Color:* Rainbow 🌈\n📝 *Sayri:* Teri aukaat kya hai?\n\n╚══════════════════╝\n_Gaali: 🤬 MADARCHOD BKL_`,
    emoji: '💀🔥😈'
  },
  {
    name: 'roast4',
    text: `╔═══ *🤣 AUTO ROAST MODE 🤣* ═══╗\n\n_Oye haddipa! Tu hai kaun?!_\n_Teri aukaat nahi hai yahan bolne ki!_\n\n✦ *Style:* Bold + Colorful\n🎨 *Color:* #FF00FF\n📝 *Extra:* +100 emojis + taunts\n\n╚══════════════════╝\n_Gaali: 🖕 CHUTIYE BKL MC_`,
    emoji: '🤣😂💪'
  },
  {
    name: 'roast5',
    text: `╔═══ *🔥 DANGER ROAST 🔥* ═══╗\n\n_Tu itna bewakoof hai ki_\n_Bewakoof bhi tera baap hai!_\n\n✦ *Style:* Fire Effect\n🎨 *Color:* #FF4500\n📝 *Sayri:* Na kar yarr sharam kar\n\n╚══════════════════╝\n_Gaali: 🤬 BKL MC CHUTIYE MADARCHOD_`,
    emoji: '🔥💀😈🤬'
  }
];

const commands = [
  {
    name: 'autoroast',
    category: 'fun',
    aliases: ['roast', 'gaali', 'roastme'],
    desc: 'Auto roast with gaali + emoji + sayri + style + color',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const target = args[0] || (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) || msg.key.participant || from;
      
      const roast = roasts[Math.floor(Math.random() * roasts.length)];
      
      // Reply with roast to whoever sent the message
      await sock.sendMessage(from, { 
        text: roast.text,
        contextInfo: {
          mentionedJid: [target],
          forwardingScore: 999,
          isForwarded: true
        }
      });
    }
  }
];

module.exports = { commands };
