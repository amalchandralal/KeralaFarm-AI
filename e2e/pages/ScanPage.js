const BasePage = require('./BasePage');

class ScanPage extends BasePage {
  constructor(page) {
    super(page);
    this.uploadArea = '.border-dashed';
    this.fileInput = 'input[type="file"]';
    this.analyzeButton = 'text=Analyze Image';
    this.loadingSpinner = '.animate-spin';
    this.diagnosisLabel = 'text=Diagnosis';
    this.diseaseNameText = 'h3:has-text("Diagnosis") + p, .text-xl.font-semibold';
    this.confidenceBar = '.bg-emerald-500';
    this.errorAlert = '.text-rose-600, .text-rose-400';
    this.resultContainer = '.result-container';
  }

  async navigate() {
    await super.navigate('/scan');
  }

  async uploadImage(filePath) {
    await this.page.setInputFiles(this.fileInput, filePath);
  }

  async clickAnalyze() {
    await this.page.click(this.analyzeButton);
  }

  async waitForResult() {
    await this.page.waitForSelector(this.diagnosisLabel, { timeout: 30000 });
  }

  async getDiseaseNameText() {
    const locators = this.page.locator(this.diseaseNameText);
    return await locators.first().textContent();
  }

  async isConfidenceBarVisible() {
    return await this.isVisible(this.confidenceBar);
  }

  async getErrorMessage() {
    return await this.getText(this.errorAlert);
  }
}

module.exports = ScanPage;
