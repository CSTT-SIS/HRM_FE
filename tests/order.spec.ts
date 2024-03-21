import { test, expect, Page } from '@playwright/test';
import { makeRamdomText } from '@/utils/commons';
import select from './elements/select';
import input from './elements/input';
import moment from 'moment';

const fillForm = async (page: Page, text: string) => {
	const date = moment().format('DD');
	await page.waitForTimeout(1000);
	await input(page).locator('#name').fill(text);
	await input(page).locator('#code').fill(text);
	await select(page).locator('#warehouseId').fill('h');
	await select(page).locator('#proposalIds').fill('7');
	await page.getByTestId('date').first().click();
	await page.getByText(`${date}`).nth(1).click();
};

const fillModal = async (page: Page, text: string) => {
	await page.waitForTimeout(1000);
	await select(page).locator('#productId').fill('l');
	await input(page).locator('#quantity').fill('10');
	await input(page).locator('#note').fill(text);
};

test.describe.serial('order CRUD', () => {
	const text = makeRamdomText(5);
	const editText = text + 'edit';
	const searchText = 'search=' + text;
	const searchEditText = 'search=' + editText;

	// test('01. Create', async ({ page }) => {
	// 	await page.goto('/warehouse-process/order');

	// 	await page.getByTestId('add-order').click();
	// 	await page.waitForLoadState('networkidle');

	// 	await expect(page).toHaveURL('/warehouse-process/order/create');

	// 	await fillForm(page, text);
	// 	// await page.getByTestId('modal-order-btn').click();

	// 	// await fillModal(page, text);
	// 	// await page.waitForTimeout(1000);

	// 	// await page.getByTestId('submit-modal-btn').click();
	// 	await page.waitForTimeout(1000);

	// 	await page.getByTestId('submit-btn').click();
	// 	await page.waitForLoadState('networkidle');

	// 	await expect(page).toHaveURL('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(text);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.waitForTimeout(1000);
	// 	await page.goto(`/warehouse-process/order?${searchText}`);

	// 	await page.getByTestId('edit-order-btn').first().waitFor({ state: 'visible' });
	// 	await page.waitForTimeout(1000);
	// 	await expect(page.getByTestId('edit-order-btn')).toBeVisible();
	// });

	// test('02. Edit', async ({ page }) => {
	// 	await page.goto('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(text);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('edit-order-btn').first().click();
	// 	await page.waitForLoadState('networkidle');

	// 	await fillForm(page, editText);
	// 	await page.waitForTimeout(1000);

	// 	await page.getByTestId('submit-btn').click();

	// 	await page.waitForLoadState('networkidle');
	// 	await expect(page).toHaveURL('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(editText);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.waitForTimeout(1000);
	// 	await page.goto(`/warehouse-process/order?${searchEditText}`);

	// 	await page.getByTestId('edit-order-btn').first().waitFor({ state: 'visible' });
	// 	await page.waitForTimeout(1000);
	// 	await expect(page.getByTestId('edit-order-btn')).toBeVisible();
	// });

	// test('03. Approve', async ({ page }) => {
	// 	await page.goto('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(editText);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('detail-order-btn').first().click();
	// 	await page.waitForLoadState('networkidle');

	// 	await page.getByTestId('submit-approve-btn').click();

	// 	await page.waitForLoadState('networkidle');
	// 	await expect(page).toHaveURL('/warehouse-process/order');

	// 	await page.waitForTimeout(1000);
	// 	await page.getByTestId('search-order-input').fill(editText);
	// 	await page.waitForLoadState('networkidle');

	// 	await page.waitForTimeout(1000);
	// 	await page.goto(`/warehouse-process/order?${searchEditText}`);

	// 	await page.getByTestId('detail-order-btn').first().waitFor({ state: 'visible' });
	// 	await page.waitForTimeout(1000);
	// 	await expect(page.getByTestId('detail-order-btn')).toBeVisible();
	// });
});
