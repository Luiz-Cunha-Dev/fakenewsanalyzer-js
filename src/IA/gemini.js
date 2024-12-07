const { GoogleGenerativeAI } = require("@google/generative-ai"); // Make sure to include these imports:
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const dotenv = require("dotenv");
dotenv.config();

async function getTextResponseBytextMessage(text) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(text);

    return JSON.parse(result.response.text()) || result.response.text();
  } catch (error) {
    console.log(error);
  }
}

async function getTextResponseByMedia(
  media = { path: "", mimetype: "" },
  text = ""
) {
  try {
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    const uploadResponse = await fileManager.uploadFile(media.path, {
      mimeType: media.mimetype,
      displayName: media.path,
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: text },
    ]);

    return JSON.parse(result.response.text()) || result.response.text();
  } catch (error) {
    console.log(error);
  }
}

getTextResponseByMedia(
  {
    path: "tmp/Gravação de Tela 2024-06-27 105651.mp4",
    mimetype: "video/mp4",
  },
  "Descreva o video"
)
  .then(console.log)
  .catch(console.log);

module.exports = {
  getTextResponseBytextMessage,
  getTextResponseByMedia,
};
