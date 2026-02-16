import { test, expect } from '@playwright/test';

test('complete user journey: login, theme switch, dashboard navigation', async ({ page }) => {
  // 1. Go to Home Page
  await page.goto('/');
  await expect(page).toHaveTitle(/LexPortal/);

  // 2. Open login page
  await page.click('text=Zaloguj');
  await expect(page).toHaveURL(/.*login/);

  // 3. Login (using mock/test account should be careful, for e2e it might need real or well-seeded DB)
  // Assuming a test account exists or we bypass for demo purposes
  await page.fill('input[type="email"]', 'client@lexportal.pl');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');

  // 4. Verify Dashboard
  await expect(page).toHaveURL(/.*client-dashboard/);
  await expect(page.locator('text=Panel Klienta')).toBeVisible();

  // 5. Test Theme Switch in Dashboard (Wait, toggle is in Navbar)
  // Actually, Navbar is always present except maybe in dashboard? 
  // Let's check Navbar in dashboard. Dashboard has its own header.
  
  // 6. Navigate to Help section in dashboard
  await page.click('text=Pomoc');
  await expect(page.locator('text=Centrum Pomocy')).toBeVisible();

  // 7. Toggle Theme (assuming Navbar/Header has it)
  const themeToggle = page.locator('button[aria-label*="Przełącz na tryb"]');
  await expect(themeToggle).toBeVisible();
  await themeToggle.click();
  
  // Verify dark mode class on html
  await expect(page.locator('html')).toHaveClass(/dark/);
});
