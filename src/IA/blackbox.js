// blackbox.js
const customPuppeteer = require("../browser/browser");

async function _getJSONResponse(page) {
  await page.waitForNetworkIdle({ idleTime: 5000, timeout: 180000 });

  const json = await page
    .waitForSelector(".prose code", { timeout: 10000 })
    .then(async () => {
      let lastCount = 0;
      let count = 0;
      let attempts = 0;

      do {
        lastCount = count;
        count = await page.$$eval(
          ".prose code .linenumber",
          (els) => els.length
        );
        if (count === lastCount) {
          attempts++;
        } else {
          attempts = 0;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } while (count > lastCount && attempts < 3);

      const json = await page.$$eval(".prose", (els) => {
        const tagCode = els[els.length - 1]?.querySelector("code");

        if (tagCode) {
          const lineNumbers = tagCode.querySelectorAll(".linenumber");
          lineNumbers.forEach((ln) => ln.remove());

          return tagCode.textContent;
        }
      });

      return json;
    })
    .catch(async (error) => {
      let text = await page.evaluate(() => {
        const els = document.querySelectorAll(".prose p");
        return els[1]?.textContent;
      });
      let currentText = "";

      do {
        currentText =
          (await page.evaluate(() => {
            const els = document.querySelectorAll(".prose p");
            return els[1]?.textContent;
          })) || "";
        await new Promise((resolve) => setTimeout(resolve, 4000));
      } while (currentText !== text);

      return text;
    });

  return JSON.parse(json);
}

async function getTextResponseBlackbox(text) {
  const browser = await customPuppeteer.getBrowser(); // Adicionado await
  const page = await browser.newPage();
  try {
    await page.goto("https://www.blackbox.ai/", { timeout: 60000 });
    await page.waitForNetworkIdle({ idleTime: 1000 });

    await page.type("#chat-input-box", text);
    await page.keyboard.press("Enter");
    await page.waitForNetworkIdle({ idleTime: 2000 });

    return await _getJSONResponse(page);
  } catch (error) {
    throw error;
  } finally {
    page.close();
    customPuppeteer.releaseBrowser(browser);
  }
}

async function getTextResponseByMediaBlackbox(image, text) {
  const browser = await customPuppeteer.getBrowser(); // Adicionado await
  const page = await browser.newPage();

  try {
    await page.goto("https://www.blackbox.ai/", { timeout: 60000 });
    await page.waitForNetworkIdle({ idleTime: 1000 });

    await page.waitForSelector("#file-input");
    const inputUploadHandle = await page.$("#file-input");
    await inputUploadHandle.uploadFile(image);
    await page.type("#chat-input-box", text);
    await page.keyboard.press("Enter");
    await page.waitForNetworkIdle({ idleTime: 2000, timeout: 600000 });

    await new Promise((resolve) => setTimeout(resolve, 15000));

    return await _getJSONResponse(page);
  } catch (error) {
    throw error;
  } finally {
    page.close();
    customPuppeteer.releaseBrowser(browser);
  }
}

module.exports = { getTextResponseBlackbox, getTextResponseByMediaBlackbox };