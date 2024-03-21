import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';
import select from './elements/select';
import input from './elements/input';

const fillForm = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await input(page).locator('#vehicleRegistrationNumber').fill(text);
	await select(page).locator('#repairById').fill('a');
	await input(page).locator('#customerName').fill(text);
	await input(page).locator('#description').fill(text);
	await input(page).locator('#damageLevel').fill(text);
};

const fillModal = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#replacementPartId').fill('l');
	await input(page).locator('#quantity').fill('10');
	await input(page).locator('#brokenPart').fill(text);
	await input(page).locator('#note').fill(text);
};

test.describe.serial('repair CRUD', () => {
	const text = makeRamdomText(5);
	const editText = text + 'edit';
	test('01. Create', async ({ page }) => {
		await page.goto('/warehouse-process/repair');

		await page.getByTestId('add-repair').click();
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/repair/create');

		await fillForm(page, text);
		await page.getByTestId('modal-repair-btn').click();

		await fillModal(page, text);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-modal-btn').click();
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-repair-btn')).toBeVisible();
	});

	test('02. Edit', async ({ page }) => {
		await page.goto('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(text);
		await page.waitForLoadState('networkidle');

		await page.getByTestId('edit-repair-btn').first().click();
		await page.waitForLoadState('networkidle');

		await fillForm(page, editText);
		await page.waitForTimeout(1000);

		await page.getByTestId('submit-btn').click();

		await page.waitForLoadState('networkidle');
		await expect(page).toHaveURL('/warehouse-process/repair');

		await page.waitForTimeout(1000);
		await page.getByTestId('search-repair-input').fill(editText);
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(1000);

		await page.getByTestId('edit-repair-btn').first().waitFor({ state: 'visible' });
		await page.waitForTimeout(1000);
		await expect(page.getByTestId('edit-repair-btn')).toBeVisible();
	});
});
