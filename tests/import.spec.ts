import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';
import select from './elements/select';
import input from './elements/input';

const fillForm = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#warehouseId').fill('h');
	await select(page).locator('#orderId').fill('a');
	await input(page).locator('#description').fill(text);
};

const fillModal = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#productId').fill('l');
	await input(page).locator('#proposalQuantity').fill('10');
	await input(page).locator('#note').fill(text);
};

test.describe.serial('import CRUD', () => {
	const text = makeRamdomText(5);
	const editText = text + 'edit';
	// test('01. Create', async ({ page }) => {
	// 	await page.goto('/warehouse-process/warehousing-bill/import');

	// 	await page.getByTestId('add-import').click();
	// 	await page.waitForLoadState('networkidle');

	// 	await expect(page).toHaveURL('/warehouse-process/warehousing-bill/import/create');

	// 	await fillForm(page, text);
	// 	await page.getByTestId('modal-import-btn').click();

	// 	await fillModal(page, text);
	// 	await page.waitForTimeout(1000);

	// 	await page.getByTestId('submit-modal-btn').click();
	// 	await page.getByTestId('submit-btn').click();

	// 	await page.waitForLoadState('networkidle');

	// 	await expect(page).toHaveURL('/warehouse-process/warehousing-bill/import');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-import-input').fill(text);

	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('edit-import-btn').first().waitFor({ state: 'visible' });
	// 	await page.waitForTimeout(1000);
	// 	await expect(page.getByTestId('edit-import-btn')).toBeVisible();
	// });

	// test('02. Edit', async ({ page }) => {
	// 	await page.goto('/warehouse-process/warehousing-bill/import');

	// 	await page.getByTestId('search-import-input').fill(text);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('edit-import-btn').first().click();
	// 	await page.waitForLoadState('networkidle');

	// 	await fillForm(page, editText);
	// 	await page.waitForTimeout(1000);

	// 	await page.getByTestId('submit-btn').click();

	// 	await page.waitForLoadState('networkidle');
	// 	await expect(page).toHaveURL('/warehouse-process/warehousing-bill/import');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-import-input').fill(editText);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('edit-import-btn').first().waitFor({ state: 'visible' });
	// 	await page.waitForTimeout(1000);
	// 	await expect(page.getByTestId('edit-import-btn')).toBeVisible();
	// });
});
