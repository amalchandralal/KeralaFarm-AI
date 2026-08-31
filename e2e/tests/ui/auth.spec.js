const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const RegisterPage = require('../../pages/RegisterPage');

test('TC-AUTH-01: Valid login redirects to dashboard @ui', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(
    process.env.TEST_USER_EMAIL || 'test@agrovision.dev',
    process.env.TEST_USER_PASSWORD || 'Test123456'
  );
  
  await expect(page).toHaveURL(/.*\/dashboard/);
  await expect(page.locator('text=Welcome back')).toBeVisible();
});

test('TC-AUTH-02: Invalid login shows error message @ui', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login('wrong@example.com', 'wrongpassword123');
  
  await page.waitForSelector(loginPage.errorAlert);
  const errorMsg = await loginPage.getErrorMessage();
  expect(errorMsg).toMatch(/No account|Incorrect|not found|invalid/i);
});

test('TC-AUTH-03: Registration form validates empty fields and bad email @ui', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.navigate();
  
  await page.click(registerPage.submitButton);
  let errorMsg = await registerPage.getErrorMessage();
  expect(errorMsg).toMatch(/fill|required/i);
  
  await registerPage.register('Test', 'not-an-email', '123456');
  errorMsg = await registerPage.getErrorMessage();
  expect(errorMsg).toMatch(/email|valid/i);
});
