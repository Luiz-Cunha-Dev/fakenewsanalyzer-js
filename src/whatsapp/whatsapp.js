const { Client, LocalAuth,  } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Configuração do cliente com sessão persistente
const clientWhatsapp = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: false,
    },
});

// Evento para gerar o QR code
clientWhatsapp.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR code gerado, escaneie com o WhatsApp.');
});

// Evento para indicar que o cliente está autenticado
clientWhatsapp.on('authenticated', () => {
    console.log('Autenticado com sucesso.');
});

// Evento para indicar que o cliente está pronto para uso
clientWhatsapp.on('ready', () => {
    console.log('Cliente está pronto.');
});

// Inicializar o cliente
clientWhatsapp.initialize();

module.exports = clientWhatsapp;