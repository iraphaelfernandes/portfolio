import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home shell loads with a single page heading', async ({ page }) => {
  await page.goto('/en');

  await expect(page).toHaveTitle('Portfolio');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1, name: 'Portfolio' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});

test('home shell has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/en');

  const results = await new AxeBuilder({ page }).analyze();

  expect(
    results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'),
  ).toEqual([]);
});

test('theme selection is applied and persists after reload', async ({ page }) => {
  await page.goto('/en');

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
  await page.goto('/en');

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(26, 23, 19)');
});

test('language toggle updates the shell labels', async ({ page }) => {
  await page.goto('/en');

  await page.getByRole('button', { name: 'FR' }).click();

  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projets' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Passer au contenu' })).toBeAttached();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://raphaelfernandes.dev/fr',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    'href',
    'https://raphaelfernandes.dev/en',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="fr"]')).toHaveAttribute(
    'href',
    'https://raphaelfernandes.dev/fr',
  );

  await page.goto('/');
  await expect(page).toHaveURL(/\/fr$/);

  await page.getByRole('link', { name: 'Projets' }).first().click();
  await expect(page).toHaveURL(/\/fr\/projects$/);
  await page.getByRole('button', { name: 'EN' }).click();
  await expect(page).toHaveURL(/\/en\/projects$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();
});

test('root redirects to the browser language', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'language', { configurable: true, value: 'fr-FR' });
  });

  await page.goto('/');

  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('heading', { level: 1, name: 'Portfolio' })).toBeVisible();
});

test('root redirect prefers a saved language over the browser language', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('lang', 'en');
    Object.defineProperty(navigator, 'language', { configurable: true, value: 'fr-FR' });
  });

  await page.goto('/');

  await expect(page).toHaveURL(/\/en$/);
});

test('selecting the current language persists that choice', async ({ page }) => {
  await page.goto('/fr');
  await page.getByRole('button', { name: 'FR' }).click();
  await page.goto('/');

  await expect(page).toHaveURL(/\/fr$/);
});

test('not-found content follows the language in the URL', async ({ page }) => {
  await page.goto('/fr/not-a-page');

  await expect(page.getByRole('heading', { level: 1, name: 'Page introuvable' })).toBeVisible();
  await expect(page.getByText('La page que vous recherchez n’existe pas.')).toBeVisible();
});

test('mobile menu opens and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');

  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});
