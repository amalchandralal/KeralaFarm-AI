const BasePage = require('./BasePage');

class VoicePage extends BasePage {
  constructor(page) {
    super(page);
    this.micButton = 'button:has(svg)'; 
    this.sendButton = 'button:has(svg)';
    this.textInput = 'textarea, input[type="text"]';
    this.chatMessages = '.chat-message'; 
    this.aiWelcomeMessage = 'text=Hello! I am your AgroVision assistant';
    this.processingIndicator = '.animate-pulse';
  }

  async navigate() {
    await super.navigate('/voice');
  }

  async isMicButtonVisible() {
    return await this.isVisible(this.micButton);
  }

  async isWelcomeMessageVisible() {
    return await this.isVisible(this.aiWelcomeMessage);
  }

  async typeAndSend(text) {
    await this.page.fill(this.textInput, text);
    await this.page.keyboard.press('Enter');
  }

  async getLastAIMessage() {
    const messages = this.page.locator(this.chatMessages);
    const count = await messages.count();
    if (count > 0) {
      return await messages.nth(count - 1).textContent();
    }
    return null;
  }
}

module.exports = VoicePage;
