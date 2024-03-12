import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';

const fillProductForm = async (page: Page, text: string) => {
	await page.getByTestId('name').click();
	await page.keyboard.press('Control+A');
	await page.keyboard.type(text);

	await page.getByTestId('code').click();
	await page.keyboard.press('Control+A');
	await page.keyboard.type(text);

	await page.locator('#unitId').click();
	await page.keyboard.type('g');
	await page.keyboard.press('Enter');

	await page.locator('#categoryId').click();
	await page.keyboard.type('Vật tư hàng hoá');
	await page.keyboard.press('Enter');

	await page.getByTestId('minQuantity').click();
	await page.keyboard.press('Control+A');
	await page.keyboard.type('1');

	await page.getByTestId('maxQuantity').click();
	await page.keyboard.press('Control+A');
	await page.keyboard.type('10');
};

test.describe('Product CRUD', () => {
	const text = makeRamdomText(5);
	const editText = text + '-edit';
	test('Create', async ({ page }) => {
		await page.goto('/warehouse/product/list');

		await page.getByTestId('add-product').click();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse/product/list/create');

		await fillProductForm(page, text);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse/product/list');

		await page.getByTestId('search-product-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-product-btn').first().waitFor();
		await expect(await page.getByTestId('edit-product-btn').count()).toBe(1);
	});

	test('Edit', async ({ page }) => {
		await page.goto('/warehouse/product/list');

		await page.getByTestId('search-product-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-product-btn').first().click();

		await page.waitForLoadState('networkidle');

		await fillProductForm(page, editText);``

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse/product/list');

		await page.getByTestId('search-product-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('delete-product-btn').first().waitFor();
		await expect(await page.getByTestId('edit-product-btn').count()).toBe(1);
	});

	test('Delete', async ({ page }) => {
		await page.goto('/warehouse/product/list');

		await page.getByTestId('search-product-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('delete-product-btn').first().click();
		await page.waitForLoadState('networkidle');

		await page.locator('.testid-confirm-btn').first().click();

		await page.waitForLoadState('networkidle');

		await expect(page.getByTestId('delete-product-btn')).not.toBeVisible();
	});
});
