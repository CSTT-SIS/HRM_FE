import { test, expect } from '@playwright/test';

// test('has title', async ({ page }) => {
// 	await page.goto('https://playwright.dev/');

// 	// Expect a title "to contain" a substring.
// 	await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
// 	await page.goto('https://playwright.dev/');

// 	// Click the get started link.
// 	await page.getByRole('link', { name: 'Get started' }).click();

// 	// Expects page to have a heading with the name of Installation.
// 	await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

test('should login with valid credentials', async ({ page }) => {
	await page.goto('http://103.167.89.184/auth/boxed-signin/');

	await page.getByTestId('username').fill('admin');
	await page.getByTestId('password').fill('admin');

	await page.getByTestId('submit').click();

	await page.waitForLoadState('networkidle');

	await expect(page).toHaveURL('http://103.167.89.184');
});
