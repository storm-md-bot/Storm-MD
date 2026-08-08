// ============================================
// Storm-MD — Fun Commands (50+)
// ============================================
const axios = require('axios');

const commands = [
  { name: 'joke', aliases: ['jokes'], category: 'fun', desc: '😂 Random joke',
    execute: async (sock, msg) => {
      const jokes = [
        'Programmer ne job chhod di — kyunki usse arrays nahi mil rahe the! 😂',
        'Mummy: Beta ro kyun raha hai?\nBeta: Papa ne ungli hammer se mari!\nMummy: To mazak kiya hoga!\nBeta: Nahi, hammer se mari thi! 🤣',
        'Tumhara WiFi signal bhi itna weak hai ki data bhi darr ke reh jata hai! 😆',
        'Main itna lazy hoon ki "lazy" word bhi mujhse energy maangta hai! 😴'
      ];
      sock.sendMessage(msg.key.remoteJid, { text: '😂 *Joke:*\n\n' + jokes[Math.floor(Math.random() * jokes.length)] });
    } },
  { name: 'meme', aliases: ['memes'], category: 'fun', desc: '🤣 Random meme',
    execute: async (sock, msg) => {
      try {
        const { data } = await axios.get('https://meme-api.com/gimme');
        sock.sendMessage(msg.key.remoteJid, { image: { url: data.url }, caption: `🤣 ${data.title}` });
      } catch { sock.sendMessage(msg.key.remoteJid, { text: '🤣 Teri photo hi sabse bada meme hai!' }); }
    } },
  { name: 'quote', aliases: ['quotes'], category: 'fun', desc: '📝 Quote',
    execute: async (sock, msg) => {
      const q = [
        'Zindagi me 2 tarah ke log: sapne dekhne wale aur sapne jeene wale.',
        'Kamyabi ek safar hai, manzil nahi.',
        'Har mushkil ke baad ek aasan hota hai.',
        'Jo log bullet proof hote hain, wo kisi se nahi darte.'
      ];
      sock.sendMessage(msg.key.remoteJid, { text: '📝 *"' + q[Math.floor(Math.random() * q.length)] + '"*' });
    } },
  { name: 'fact', aliases: ['facts'], category: 'fun', desc: '📖 Random fact',
    execute: async (sock, msg) => {
      const f = [
        'Honey kabhi kharab nahi hota!',
        'Octopus ke 3 dil hote hain!',
        'Banana technically berry hai!',
        'Hathi iklauta animal hai jo jump nahi kar sakta!'
      ];
      sock.sendMessage(msg.key.remoteJid, { text: '📖 *Fact:* ' + f[Math.floor(Math.random() * f.length)] });
    } },
  { name: 'dice', aliases: ['roll'], category: 'fun', desc: '🎲 Dice roll',
    execute: async (sock, msg) => {
      const n = Math.floor(Math.random() * 6) + 1;
      sock.sendMessage(msg.key.remoteJid, { text: `🎲 *${n}* ${['⚀','⚁','⚂','⚃','⚄','⚅'][n-1]}` });
    } },
  { name: 'coinflip', aliases: ['coin'], category: 'fun', desc: '🪙 Coin flip',
    execute: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: `🪙 ${Math.random() > 0.5 ? 'Heads' : 'Tails'}` });
    } },
  { name: '8ball', aliases: ['magicball'], category: 'fun', desc: '🎱 Magic 8 ball',
    execute: async (sock, msg, args) => {
      const a = ['Yes ✅', 'No ❌', 'Maybe 🤔', 'Definitely! 🔥', 'Never 🚫', 'Ask again later ⏳'];
      sock.sendMessage(msg.key.remoteJid, { text: `🎱 Q: ${args.join(' ') || '...'}\n\n*${a[Math.floor(Math.random() * a.length)]}*` });
    } },
  { name: 'hack', aliases: ['fakehack'], category: 'fun', desc: '💻 Fake hack',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const t = args[0] || 'someone';
      await sock.sendMessage(from, { text: `🔍 Hacking ${t}...` });
      await new Promise(r => setTimeout(r, 1500));
      await sock.sendMessage(from, { text: `📱 IP: 192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}` });
      await new Promise(r => setTimeout(r, 1500));
      await sock.sendMessage(from, { text: `🔓 Password: *******\n✅ ${t} hacked! 🤣` });
    } },
  { name: 'love', aliases: ['lovecalc'], category: 'fun', desc: '💕 Love calculator',
    execute: async (sock, msg, args) => {
      const p = Math.floor(Math.random() * 100);
      const n1 = args[0] || 'You', n2 = args[1] || 'Crush';
      sock.sendMessage(msg.key.remoteJid, { text: `💕 *${n1} ❤️ ${n2}*\n\n💌 ${p}%\n${'❤️'.repeat(Math.max(1, Math.ceil(p/10)))}\n\n${p > 70 ? 'Perfect match! 🎉' : p > 40 ? 'Not bad! 😊' : 'Better luck! 😅'}` });
    } },
  { name: 'ship', aliases: ['shipping'], category: 'fun', desc: '🚢 Ship two people',
    execute: async (sock, msg, args) => {
      const n1 = args[0] || 'A', n2 = args[1] || 'B';
      sock.sendMessage(msg.key.remoteJid, { text: `🚢 ${n1} ⚓ ${n2}\nShip name: *${n1.slice(0, Math.ceil(n1.length/2))}${n2.slice(Math.floor(n2.length/2))}* 😂` });
    } },
  { name: 'simp', aliases: ['simprate'], category: 'fun', desc: '🧎 Simp rate',
    execute: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: `🧎 Simp rate: ${Math.floor(Math.random() * 101)}% 😂` });
    } },
  { name: 'gay', aliases: ['gayrate'], category: 'fun', desc: '🏳️🌈 Gay rate',
    execute: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: `🏳️🌈 Gay rate: ${Math.floor(Math.random() * 101)}% 😂` });
    } },
  { name: 'iq', aliases: ['iqtest'], category: 'fun', desc: '🧠 IQ test',
    execute: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: `🧠 IQ: ${Math.floor(Math.random() * 80) + 20} ${Math.random() > 0.7 ? '🤣 (thoda kam hai)' : ''}` });
    } },
  { name: 'pp', aliases: ['ppcheck'], category: 'fun', desc: '📏 PP size',
    execute: async (sock, msg) => {
      sock.sendMessage(msg.key.remoteJid, { text: `📏 PP: ${'='.repeat(Math.floor(Math.random() * 10) + 1)}D ${Math.random() > 0.8 ? '💀' : '😂'}` });
    } },
  { name: 'truth', aliases: ['truthq'], category: 'fun', desc: '🤫 Truth',
    execute: async (sock, msg) => {
      const q = ['Apni sabse badi galti kya hai?', 'Kisi ko secretly pasand karte ho?', 'Aakhri baar jhooth kab bola?', 'Sabse embarrassing moment?'];
      sock.sendMessage(msg.key.remoteJid, { text: `🤫 *Truth:* ${q[Math.floor(Math.random() * q.length)]}` });
    } },
  { name: 'dare', aliases: ['dareq'], category: 'fun', desc: '🔥 Dare',
    execute: async (sock, msg) => {
      const q = ['Next 1 hour apni DP me funny photo lagao!', 'Group me 10 baar "I love Storm-MD" likho!', 'Voice note me gaana gao!', 'Apna password hint do!'];
      sock.sendMessage(msg.key.remoteJid, { text: `🔥 *Dare:* ${q[Math.floor(Math.random() * q.length)]}` });
    } },
  { name: 'roast', aliases: ['gaali', 'roastme'], category: 'fun', desc: '🔥 Auto roast + gaali',
    execute: async (sock, msg) => {
      const roasts = [
        'Tu itna fail hai ki fail bhi tera baap hai! 🤣 BKL 🖕',
        'Teri shakal dekh ke ChatGPT bhi hang ho jata hai! 💀 MC 🖕',
        'Tera dimaag itna slow ki Google "Loading..." bolke chhod de! 😂 CHUTIYE 🖕',
        'Beauty competition me tera "unique award" pakka! 😭 MADARCHOD 🖕'
      ];
      sock.sendMessage(msg.key.remoteJid, { text: '🔥 *ROAST:*\n\n' + roasts[Math.floor(Math.random() * roasts.length)] });
    } }
];

// 😈 20+ ACTION COMMANDS (hug, kiss, slap, etc.)
const actions = {
  hug: '🤗 hugged', kiss: '😘 kissed', slap: '🖐️ slapped', punch: '👊 punched',
  kill: '🔪 killed', pat: '👋 patted', lick: '👅 licked', bite: '🦷 bit',
  poke: '👉 poked', dance: '💃 danced with', cry: '😭 cried for', laugh: '😂 laughed at',
  hi: '👋 said hi to', bye: '👋 said bye to', thanks: '🙏 thanked', sorry: '😔 apologized to',
  wink: '😉 winked at', blush: '😊 blushed at', smile: '😄 smiled at', wave: '👋 waved at'
};

for (const [name, action] of Object.entries(actions)) {
  commands.push({
    name, category: 'fun', aliases: [], desc: `${action}`,
    execute: async (sock, msg, args) => {
      const target = args[0] ? '@' + args[0].replace(/[^0-9]/g, '') : 'someone';
      sock.sendMessage(msg.key.remoteJid, { text: `*${msg.key.participant?.split('@')[0] || 'User'}* ${action} *${target}* ${['❤️','😊','😂','💕'][Math.floor(Math.random()*4)]}` });
    }
  });
}

module.exports = { commands };
