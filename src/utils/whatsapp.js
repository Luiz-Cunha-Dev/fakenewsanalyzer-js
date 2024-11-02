const clientWhatsapp = require('../whatsapp/whatsapp.js');

async function sendTextMessage (chatId, message) {
    await clientWhatsapp.sendMessage(chatId, message);
    console.log(`Mensagem enviada para ${chatId}: ${message}`);
};

async function clearChatMessages(chatId) {
    try {
        const chat = await clientWhatsapp.getChatById(chatId);
        await chat.clearMessages()
        console.log(`Mensagens do chat ${chatId} limpas`);
    } catch (error) {
        console.log(`Erro ao limpar mensagens do chat ${chatId}: ${error}`);
    }
}

module.exports = { sendTextMessage, clearChatMessages };