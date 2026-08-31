const BasePage = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.nameInput = 'input#name';
    this.emailInput = 'input#email';
    this.passwordInput = 'input#password';
    this.submitButton = 'button[type="submit"]';
    this.errorAlert = '.text-rose-600, .text-rose-400';
  }

  async navigate() {
    await super.navigate('/register');
  }

  async register(name, email, password) {
    if (name) await this.page.fill(this.nameInput, name);
    if (email) await this.page.fill(this.emailInput, email);
    if (password) await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitButton);
  }

  async getErrorMessage() {
    return await this.getText(this.errorAlert);
  }

  async getValidationHint() {
    return await this.getText('.text-rose-500');
  }
}

module.exports = RegisterPage;
