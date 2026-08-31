const BasePage = require('./BasePage');

class PlacesPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = 'input[placeholder], input[type="text"]';
    this.searchButton = 'button:has-text("Search"), button:has(svg)';
    this.nearMeButton = 'button:has-text("Use My Location"), button:has-text("Near Me")';
    this.placeCards = '.place-card, div > h3';
    this.mapContainer = '.leaflet-container';
    this.errorMessage = '.text-rose-600, .text-rose-400';
    this.loadingSpinner = '.animate-spin';
  }

  async navigate() {
    await super.navigate('/places');
  }

  async searchCity(cityName) {
    await this.page.fill(this.searchInput, cityName);
    await this.page.click(this.searchButton);
  }

  async getPlaceCardCount() {
    return await this.page.locator(this.placeCards).count();
  }

  async isMapRendered() {
    return await this.isVisible(this.mapContainer);
  }
}

module.exports = PlacesPage;
