const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = 'input#email';
    this.passwordInput = 'input#password';
    this.submitButton = 'button[type="submit"]';
    this.errorAlert = '.text-rose-600, .text-rose-400';
    this.successAlert = '.text-emerald-700, .text-emerald-300';
  }

  async navigate() {
    await super.navigate('/login');
  }

  async login(email, password) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitButton);
  }

  async getErrorMessage() {
    return await this.getText(this.errorAlert);
  }

  async getSuccessMessage() {
    return await this.getText(this.successAlert);
  }

  async isOnDashboard() {
    const url = this.page.url();
    return url.includes('/dashboard');
  }
}

module.exports = LoginPage;
