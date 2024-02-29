import { test, expect } from '@playwright/test';

test('should warehouse enough entity', async ({ page }) => {
	await page.goto('/warehouse');

	await page.getByTestId('username').fill('admin');
	await page.getByTestId('password').fill('admin');

	await page.getByTestId('submit').click();

	await page.waitForLoadState('networkidle');

	await expect(page.locator('table > tbody > tr:nth-child(1) > td:nth-child(2)')).toHaveText('Hành chính');
	await expect(page.locator('table > tbody > tr:nth-child(2) > td:nth-child(2)')).toHaveText('Mìn');
	await expect(page.locator('table > tbody > tr:nth-child(3) > td:nth-child(2)')).toHaveText('Gara');
	await expect(page.locator('table > tbody > tr:nth-child(4) > td:nth-child(2)')).toHaveText('Nhà máy');
});
