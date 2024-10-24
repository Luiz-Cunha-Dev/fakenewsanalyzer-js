const crypto = require('crypto');

// Função para gerar hash MD5 de um buffer
function generateMD5FromBuffer(buffer) {
  return crypto.createHash('md5').update(buffer).digest('hex');
}

async function retry(fn, retries = 10) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }
            console.warn(`Tentativa ${attempt} falhou. Tentando novamente...`);
        }
    }
    throw new Error('Todas as tentativas falharam');
}

module.exports = {
    retry,
    generateMD5FromBuffer
}