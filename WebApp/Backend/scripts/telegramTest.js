const TelegramBot = require('node-telegram-bot-api');

// Your BotFather token and your chat ID!
const bot = new TelegramBot('8357245229:AAHecox1M2QPVLH7y_TQ1KFGDKz74tya64k', { polling: false });
const chatId = '5318629880';

const message = 'Test alert: Your DMS Telegram bot setup works!';

bot.sendMessage(chatId, message)
  .then(() => {
    console.log("Sent test message to chat ID:", chatId);
    process.exit();
  })
  .catch((err) => {
    console.error("ERROR SENDING:", err);
    process.exit(1);
  });
