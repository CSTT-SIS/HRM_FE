import { test as setup } from '@playwright/test';

setup('setup', async ({ page }) => {
	await page.goto('/auth/boxed-signin');

	await page.getByTestId('username').fill('admin');
	await page.getByTestId('password').fill('admin');

	await page.getByTestId('submit').click();

	await page.waitForLoadState('networkidle');
});
