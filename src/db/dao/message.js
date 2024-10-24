const db = require("../db.js");

// Table: mensagem
// Columns:
// md5 varchar(35) PK
// tipo int(11)
// conteudo varchar(500)
// verificado int(11)
// fake int(11)
// justificativa varchar(500)

//tipos:
//1-texto comum
//2-imagem ou video
//3-url

async function getAllMessages() {
  try {
    const [results] = await db.query("SELECT * FROM mensagem");
    return results;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getMessageByMd5(md5) {
  try {
    const [results] = await db.query(
      "SELECT * FROM mensagem WHERE md5 = ? LIMIT 1",
      [md5]
    );

    return results[0] || null;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function insertMessage({ md5, tipo, conteudo, verificado, fake, justificativa }) {
  try {
    const [results] = await db.query(
      "INSERT INTO mensagem (md5, tipo, conteudo, verificado, fake, justificativa) VALUES (?, ?, ?, ?, ?, ?)",
      [md5, tipo, conteudo, verificado, fake, justificativa]
    );
    return results;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  getAllMessages,
  getMessageByMd5,
  insertMessage,
};