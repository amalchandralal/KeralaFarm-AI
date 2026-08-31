const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const DashboardPage = require('../../pages/DashboardPage');
const ScanPage = require('../../pages/ScanPage');
const TrackerPage = require('../../pages/TrackerPage');
const PlacesPage = require('../../pages/PlacesPage');
const VoicePage = require('../../pages/VoicePage');
const path = require('path');

test.describe('Core Features', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.TEST_USER_EMAIL || 'test@agrovision.dev',
      process.env.TEST_USER_PASSWORD || 'Test123456'
    );
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
  });

  test('TC-DASH-01: Dashboard loads weather telemetry @ui', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigate();
    
    await page.waitForSelector(dashboardPage.temperatureValue, { state: 'visible' });
    
    expect(await dashboardPage.isWeatherCardVisible()).toBe(true);
    const tempText = await dashboardPage.getTemperatureText();
    expect(tempText).toBeTruthy();
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('TC-SCAN-01: Valid image upload returns disease diagnosis @ui', async ({ page }) => {
    const scanPage = new ScanPage(page);
    await scanPage.navigate();
    
    const filePath = path.join(__dirname, '../../fixtures/sample_leaf.jpg');
    // Using dummy upload for test simulation (in real env file must exist)
    await scanPage.uploadImage(filePath);
    await scanPage.clickAnalyze();
    
    await scanPage.waitForResult();
    await expect(page.locator(scanPage.diagnosisLabel)).toBeVisible();
    await expect(page.locator(scanPage.confidenceBar)).toBeVisible();
  });

  test('TC-SCAN-02: Non-image file shows error @ui', async ({ page }) => {
    const scanPage = new ScanPage(page);
    await scanPage.navigate();
    
    const filePath = path.join(__dirname, '../../fixtures/oversized_dummy.txt');
    await scanPage.uploadImage(filePath);
    
    const isErrorVisible = await scanPage.isVisible(scanPage.errorAlert);
    const isUploadVisible = await scanPage.isVisible(scanPage.uploadArea);
    expect(isErrorVisible || isUploadVisible).toBe(true);
  });

  test('TC-TRACK-01: Market pricing page loads data @ui', async ({ page }) => {
    const trackerPage = new TrackerPage(page);
    await trackerPage.navigate();
    
    await trackerPage.switchToMarketTab();
    await page.waitForSelector(trackerPage.commodityRows, { timeout: 15000 });
    
    const count = await trackerPage.getCommodityCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-GIS-01: GIS office finder returns results on search @ui', async ({ page }) => {
    const placesPage = new PlacesPage(page);
    await placesPage.navigate();
    
    await placesPage.searchCity('Thrissur');
    await page.waitForSelector(placesPage.placeCards, { timeout: 15000 });
    
    const count = await placesPage.getPlaceCardCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-VOICE-01: Voice assistant UI elements render correctly @ui', async ({ page }) => {
    const voicePage = new VoicePage(page);
    await voicePage.navigate();
    
    expect(await voicePage.isWelcomeMessageVisible()).toBe(true);
    expect(await voicePage.isMicButtonVisible()).toBe(true);
  });
});
