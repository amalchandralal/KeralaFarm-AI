const BasePage = require('./BasePage');

class TrackerPage extends BasePage {
  constructor(page) {
    super(page);
    this.marketTab = 'text="Market Prices"';
    this.stateDropdown = 'select';
    this.commodityRows = 'tr, li';
    this.loadingSpinner = '.animate-spin';
  }

  async navigate() {
    await super.navigate('/tracker');
  }

  async switchToMarketTab() {
    await this.page.click(this.marketTab);
  }

  async selectState(stateName) {
    await this.page.selectOption(this.stateDropdown, stateName);
  }

  async getFirstCommodityName() {
    const locators = this.page.locator(this.commodityRows);
    return await locators.first().textContent();
  }

  async getCommodityCount() {
    return await this.page.locator(this.commodityRows).count();
  }
}

module.exports = TrackerPage;
