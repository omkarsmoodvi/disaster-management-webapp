const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('8357245229:AAHecox1M2QPVLH7y_TQ1KFGDKz74tya64k', { polling: true });

bot.on('message', (msg) => {
  console.log("CHAT ID:", msg.chat.id);
  console.log("USERNAME:", msg.chat.username);
  bot.stopPolling();
  process.exit();
});
