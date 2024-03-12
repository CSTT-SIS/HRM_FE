import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';

const fillForm = async (page: Page, text: string) => {
	await page.locator('#name').fill(text)

	await page.locator('#warehouseId').click();
	await page.keyboard.type('hành chính');
	await page.keyboard.press('Enter');
};

test.describe('Product Category CRUD', () => {
	const text = makeRamdomText(5);
	const editText = text + '-edit';
	test('01. Create', async ({ page }) => {
		await page.goto('/warehouse/product/category');

		await page.getByTestId('add-category').click();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse/product/category/create');

		await fillForm(page, text);
		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse/product/category');

		await page.getByTestId('search-category-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-category-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-category-btn')).toBeVisible();
	});

	test('02. Edit', async ({ page }) => {
		await page.goto('/warehouse/product/category');

		await page.getByTestId('search-category-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-category-btn').first().click();
		await page.waitForLoadState('networkidle');

		await fillForm(page, editText);
		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse/product/category');

		await page.getByTestId('search-category-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-category-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-category-btn')).toBeVisible();
	});

	test('03. Delete', async ({ page }) => {
		await page.goto('/warehouse/product/category');

		await page.getByTestId('search-category-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('delete-category-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.locator('.testid-confirm-btn').first().click();

		await page.waitForLoadState('networkidle');

		await expect(page.getByTestId('delete-category-btn')).not.toBeVisible();
	});
});
