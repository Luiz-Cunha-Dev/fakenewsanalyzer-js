const clientWhatsapp = require("./whatsapp/whatsapp.js");
const { sendTextMessage } = require("./utils/sendMessage.js");
const { getTextResponseBlackbox, getTextResponseByMediaBlackbox } = require("./IA/blackbox.js");
const { retry, generateMD5FromBuffer } = require("./utils/commonFunction.js");  
const { getMessageByMd5, insertMessage } = require("./db/dao/message.js");
const fs = require('fs');
const mime = require('mime-types');
const dotenv = require("dotenv");
dotenv.config();

const messageQueue = [];
let processingCount = 0;
const MAX_PROCESSING = parseInt(process.env.MAX_CONCURRENT_MESSAGES, 10);

//função que envia a resposta encontrada no banco de dados
async function sendResponseFromDB(message, messageDB){
  await sendTextMessage(message.from, `Essa mensagem já foi analisada. Ela é ${messageDB.fake ? 'fake' : 'verdadeira'}.`+
    `\nJustificativa: ${messageDB.justificativa}`);
}

async function processMessageQueue() {
  if (processingCount >= MAX_PROCESSING || messageQueue.length === 0) {
    return;
  }

  const message = messageQueue.shift();
  processingCount++;

  try {
    await handleMessage(message);
  } catch (error) {
    console.error("Error processing message:", error);
  } finally {
    processingCount--;
    processMessageQueue();
  }
}

async function handleMessage(message) {
  if (message.from != '5519987292994@c.us') return;

  console.dir(message, { depth: null, colors: true });

  if (message.links.length > 0) {
    const md5 = generateMD5FromBuffer(Buffer.from(message.body));
    const messageDB = await getMessageByMd5(md5);

    if (messageDB) {
      await sendResponseFromDB(message, messageDB);
      return;
    }

    await sendTextMessage(message.from, "Aguarde um momento, estamos analisando seu link...");

    const response = await retry(() => getTextResponseBlackbox(`@GPT-4o Link: ${message.links[0].link}. Analise o link passado e responda se se trata de uma fakenews ou não. Responda a mensagem em portugues em formato JSON, um objeto com a chave "text" contendo a resposta e uma chave "fake" do tipo boolean com a informação se é ou não uma fakenews. Não responda nada além disso, apenas a resposta em formato JSON`));

    await sendTextMessage(message.from, response.text);

    await insertMessage({
      md5: md5,
      tipo: 3,
      conteudo: message.body.substring(0, 500),
      verificado: 0,
      fake: response?.fake || false,
      justificativa: response?.text.substring(0, 500) || ''
    });

  } else if (message.type == 'image' || message.type == 'video' || message.type == 'audio') {
    const media = await message.downloadMedia();
    const buffer = Buffer.from(media.data, 'base64');
    const md5 = generateMD5FromBuffer(buffer);
    const messageDB = await getMessageByMd5(md5);

    if (messageDB) {
      await sendResponseFromDB(message, messageDB);
      return;
    }

    const path = `tmp/${media.filename || md5}.${mime.extension(media.mimetype)}`;
    fs.writeFileSync(path, buffer);

    const response = await retry(() => getTextResponseByMediaBlackbox(path, `@GPT-4o Você é um bot que analisa mensagens para saber se é fakenews. Analise o arquivo passado e responda. Responda a mensagem em portugues em formato JSON, um objeto com a chave "text" contendo a resposta e uma chave "fake" do tipo boolean com a informação se é ou não uma fakenews. Não responda nada além disso, apenas a resposta em formato JSON.`));

    await sendTextMessage(message.from, response.text);

    fs.unlinkSync(path);

    await insertMessage({
      md5: md5,
      tipo: 2,
      conteudo: '',
      verificado: 0,
      fake: response?.fake || false,
      justificativa: response?.text.substring(0, 500) || ''
    });

  } else if (message.type == 'chat') {
    const md5 = generateMD5FromBuffer(Buffer.from(message.body));
    const messageDB = await getMessageByMd5(md5);
    console.log(messageDB);

    if (messageDB) {
      await sendResponseFromDB(message, messageDB);
      return;
    }

    const response = await retry(() => getTextResponseBlackbox(`@GPT-4o Você é um bot que analisa mensagens para saber se é fakenews. Analise a mensagem passada e responda. Responda a mensagem em portugues em formato JSON, um objeto com a chave "text" contendo a resposta e uma chave "fake" do tipo boolean com a informação se é ou não uma fakenews. Não responda nada além disso, apenas a resposta em formato JSON. Mensagem: ${message.body}`));

    await sendTextMessage(message.from, response.text);

    await insertMessage({
      md5: md5,
      tipo: 1,
      conteudo: message.body.substring(0, 500),
      verificado: 0,
      fake: response?.fake || false,
      justificativa: response?.text.substring(0, 500) || ''
    });
  }
}

clientWhatsapp.on("message_create", (message) => {
  messageQueue.push(message);
  processMessageQueue();
});