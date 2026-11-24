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

test('theme selection is applied and persists after reload', async ({ page }) => {
  await page.goto('/');

  const root = page.locator('html');
  const currentTheme = await root.getAttribute('data-theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  const actionLabel = nextTheme === 'light' ? 'Switch to light theme' : 'Switch to dark theme';

  await page.getByRole('button', { name: actionLabel }).click();
  await expect(root).toHaveAttribute('data-theme', nextTheme);

  await page.reload();
  await expect(root).toHaveAttribute('data-theme', nextTheme);
});

test('default theme follows the browser color scheme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(26, 23, 19)');
});

test('language toggle updates the shell labels', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'FR' }).click();

  await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projets' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Passer au contenu' })).toBeAttached();
});

test('mobile menu opens and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});
