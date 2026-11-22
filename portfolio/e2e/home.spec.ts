import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home shell loads with a single page heading', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Portfolio');
  await expect(page.getByRole('heading', { level: 1, name: 'Portfolio' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});

test('home shell has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(
    results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'),
  ).toEqual([]);
});
