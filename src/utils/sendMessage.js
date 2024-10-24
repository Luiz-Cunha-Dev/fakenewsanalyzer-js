const clientWhatsapp = require('../whatsapp/whatsapp.js');

async function sendTextMessage (chatId, message) {
    await clientWhatsapp.sendMessage(chatId, message);
    console.log(`Mensagem enviada para ${chatId}: ${message}`);
};

module.exports = { sendTextMessage };