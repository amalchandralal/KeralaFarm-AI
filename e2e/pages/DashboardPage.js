const BasePage = require('./BasePage');

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.weatherCard = '.bg-gradient-to-br';
    this.temperatureValue = '.stat-value';
    this.humidityMetric = 'text=Humidity';
    this.welcomeHeader = 'text=Welcome back';
    this.quickActionLinks = 'a[href="/voice"], a[href="/scan"], a[href="/tracker"], a[href="/offline"]';
    this.loadingIndicator = '.animate-pulse';
  }

  async navigate() {
    await super.navigate('/dashboard');
  }

  async isWeatherCardVisible() {
    return await this.isVisible(this.weatherCard);
  }

  async getTemperatureText() {
    const locators = this.page.locator(this.temperatureValue);
    return await locators.first().textContent();
  }

  async areQuickActionsVisible() {
    const count = await this.page.locator(this.quickActionLinks).count();
    return count >= 4;
  }
}

module.exports = DashboardPage;
