// browser.js
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const dotenv = require("dotenv");
dotenv.config();

class Browser {
  constructor() {
    this.browsers = [];
    this.currentIndex = 0;
    this.init();
    this.setupProcessHandlers();
  }

  async init() {
    const maxConcurrentMessages = parseInt(process.env.MAX_CONCURRENT_MESSAGES, 10);
    await Promise.all(
      Array.from({ length: maxConcurrentMessages }).map(async () => {
        const browser = await puppeteer.launch({
          headless: false,
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-experimental-web-platform-features"],
        });
        this.browsers.push({ browser, inUse: false });
      })
    );
  }

  async getBrowser() {
    let browserObj;
    for (let i = 0; i < this.browsers.length; i++) {
      const index = (this.currentIndex + i) % this.browsers.length;
      if (!this.browsers[index].inUse) {
        browserObj = this.browsers[index];
        this.browsers[index].inUse = true;
        this.currentIndex = (index + 1) % this.browsers.length;
        break;
      }
    }
    if (!browserObj) {
      throw new Error("No available browsers");
    }
    return browserObj.browser;
  }

  releaseBrowser(browser) {
    const browserObj = this.browsers.find(b => b.browser === browser);
    if (browserObj) {
      browserObj.inUse = false;
    }
  }

  async closeAllBrowsers() {
    await Promise.all(this.browsers.map(async ({ browser }) => {
      await browser.close();
    }));
  }

  setupProcessHandlers() {
    const handleExit = async () => {
      await this.closeAllBrowsers();
      process.exit();
    };

    process.on('exit', handleExit);
    process.on('SIGINT', handleExit);
    process.on('SIGTERM', handleExit);
  }
}

module.exports = new Browser();