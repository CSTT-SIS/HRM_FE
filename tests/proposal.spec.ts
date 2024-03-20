import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';
import select from './elements/select';
import input from './elements/input';

const fillForm = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await input(page).locator('#name').fill(text);
	await select(page).locator('#departmentId').fill('Phòng Kế hoạch');
	await select(page).locator('#warehouseId').fill('h');
	await input(page).locator('#content').fill(text);
};

const fillModal = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#productId').fill('l');
	await input(page).locator('#quantity').fill('10');
	await input(page).locator('#note').fill(text);
};

test.describe.serial('proposal CRUD', () => {
	const text = makeRamdomText(5);
	const editText = text + 'edit';
	test('01. Create', async ({ page }) => {
		await page.goto('/warehouse-process/proposal');

		await page.getByTestId('add-proposal').click();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/proposal/create');

		await fillForm(page, text);
		await page.getByTestId('modal-proposal-btn').click();

		await fillModal(page, text);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-modal-btn').click();
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/proposal');

		await page.getByTestId('search-proposal-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-proposal-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-proposal-btn')).toBeVisible();
	});

	test('02. Edit', async ({ page }) => {
		await page.goto('/warehouse-process/proposal');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-proposal-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-proposal-btn').first().click();
		await page.waitForLoadState('networkidle');

		await fillForm(page, editText);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/proposal');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-proposal-input').fill(editText);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-proposal-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-proposal-btn')).toBeVisible();
	});
});
