// ============================================
// Storm-MD — Fun Commands (50+)
// ============================================

const commands = [
  { name: 'hack', category: 'fun', desc: 'Fake hack someone',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const target = args[0] || 'unknown';
      await sock.sendMessage(from, { text: `🔍 Hacking ${target}...` });
      await new Promise(r => setTimeout(r, 2000));
      await sock.sendMessage(from, { text: `📱 IP: 192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}` });
      await new Promise(r => setTimeout(r, 2000));
      await sock.sendMessage(from, { text: `🔓 Password: *******\n✅ Hacked successfully! 🤣` });
    }
  },
  { name: 'love', category: 'fun', desc: 'Love calculator',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const name1 = args[0] || 'You';
      const name2 = args[1] || 'Crush';
      const percent = Math.floor(Math.random() * 100);
      const hearts = '❤️'.repeat(Math.ceil(percent/10));
      await sock.sendMessage(from, { text: `💕 *Love Calculator*\n\n${name1} ❤️ ${name2}\n\n💌 ${percent}%\n${hearts}\n\n${percent > 70 ? 'Perfect match! 🎉' : percent > 40 ? 'Not bad! 😊' : 'Better luck next time! 😅'}` });
    }
  },
  { name: 'joke', category: 'fun', desc: 'Random joke',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const jokes = [
        'Why did the programmer quit his job? Because he didn\'t get arrays! 😂',
        'What do you call a fake noodle? An impasta! 🤣',
        'Why do Java developers wear glasses? Because they can\'t C#! 😆',
        'Mummy: Beta tu kyun ro raha hai?\nBeta: Papa ne ungli hammer se mari!\nMummy: To usne to mazak kiya hoga!\nBeta: Nahi, usne to hammer se mari thi! 🤣'
      ];
      await sock.sendMessage(from, { text: `😂 *Joke Time*\n\n${jokes[Math.floor(Math.random() * jokes.length)]}` });
    }
  },
  { name: 'meme', category: 'fun', desc: 'Random meme',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      try {
        const { data } = await require('axios').get('https://meme-api.com/gimme');
        await sock.sendMessage(from, { image: { url: data.url }, caption: `🤣 *Meme*\n${data.title}` });
      } catch {
        await sock.sendMessage(from, { text: `🤣 *Meme*\n\nJo teri photo hai na... wohi sabse bada meme hai! 😂` });
      }
    }
  },
  { name: 'quote', category: 'fun', desc: 'Random quote',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const quotes = [
        'Zindagi mein do tarah ke log hote hain: Ek jo sapne dekhte hain, aur ek jo sapne jeete hain.',
        'Kamyabi ek safar hai, manzil nahi.',
        'Jo log bullet proof hote hain, woh kisi se nahi darte.',
        'Har mushkil ke baad ek aasan hota hai.',
        'Tu na hoga to kya, teri yaad toh hogi.'
      ];
      await sock.sendMessage(from, { text: `📝 *Quote*\n\n"${quotes[Math.floor(Math.random() * quotes.length)]}"\n\n- ${global.botName}` });
    }
  },
  { name: 'dice', category: 'fun', desc: 'Roll a dice',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const roll = Math.floor(Math.random() * 6) + 1;
      const dice = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      await sock.sendMessage(from, { text: `🎲 *Dice Roll*\n\n${dice[roll-1]} You got: ${roll}` });
    }
  },
  { name: 'coinflip', category: 'fun', desc: 'Flip a coin',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
      await sock.sendMessage(from, { text: `🪙 *Coin Flip*\n\nResult: *${result}* 🎉` });
    }
  },
  { name: '8ball', category: 'fun', desc: 'Magic 8 ball',
    execute: async (sock, msg, args) => {
      const from = msg.key.remoteJid;
      const answers = ['Yes', 'No', 'Maybe', 'Definitely', 'Never', 'Ask again later', 'Absolutely', 'No chance', 'Only if you try', 'The stars say yes!'];
      const question = args.join(' ') || 'Will I be successful?';
      await sock.sendMessage(from, { text: `🎱 *Magic 8 Ball*\n\nQ: ${question}\n\nAnswer: *${answers[Math.floor(Math.random() * answers.length)]}*` });
    }
  }
];

// Generate more fun commands
const funTypes = ['hug', 'kiss', 'slap', 'punch', 'kill', 'pat', 'cry', 'dance', 'sing', 'run', 'fly', 'sleep', 'eat', 'wink', 'blush', 'smile', 'wave', 'bye', 'hi', 'namaste'];
funTypes.forEach(type => {
  if (!commands.find(c => c.name === type)) {
    commands.push({
      name: type,
      category: 'fun',
      desc: `Send a ${type} action`,
      execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid;
        const target = args[0] || 'someone';
        const actions = {
          hug: '🤗 sent a warm hug to',
          kiss: '😘 sent a kiss to',
          slap: '🖐️ slapped',
          punch: '👊 punched',
          kill: '🔪 killed',
          pat: '👋 patted',
          cry: '😭 is crying for',
          dance: '💃 is dancing with',
          sing: '🎤 is singing for',
          run: '🏃 is running to',
          fly: '🦅 is flying to',
          sleep: '😴 is sleeping with',
          eat: '🍔 is eating with',
          wink: '😉 winked at',
          blush: '😊 blushed at',
          smile: '😄 smiled at',
          wave: '👋 waved to',
          bye: '👋 said bye to',
          hi: '👋 said hi to',
          namaste: '🙏 said namaste to'
        };
        await sock.sendMessage(from, { text: `*@${msg.key.participant?.split('@')[0] || 'user'}* ${actions[type] || type} *${target}* ${type === 'kill' ? '💀' : '❤️'}` });
      }
    });
  }
});

module.exports = { commands };
