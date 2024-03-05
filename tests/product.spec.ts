import { test, expect, Page } from '@playwright/test';

test('create/delete new product', async ({ page }) => {
    // Create new product
	await page.goto('/warehouse/product/list');

	await page.getByTestId('add-product').click();
	await page.waitForLoadState('networkidle');

	await expect(page).toHaveURL('/warehouse/product/list/create');

	await page.getByTestId('name').click();
	await page.keyboard.type('product-name-test');

	await page.getByTestId('code').click();
	await page.keyboard.type('product-code-test');

	await page.locator('#unitId').click();
	await page.keyboard.type('g');
	await page.keyboard.press('Enter');

	await page.locator('#categoryId').click();
	await page.keyboard.type('Computers');
	await page.keyboard.press('Enter');

	await page.getByTestId('submit-btn').click();

	await page.waitForLoadState('networkidle');

	await expect(page).toHaveURL('/warehouse/product/list');

    // Delete product
    await page.getByTestId('search-product-input').fill('product name test');
	await page.waitForLoadState('networkidle');

	await page.getByTestId('delete-product-btn').click();
	await page.waitForLoadState('networkidle');

	await page.locator('.testid-confirm-btn').first().click();

	await page.waitForLoadState('networkidle');

	await expect(page.getByTestId('delete-product-btn')).not.toBeVisible();
});

