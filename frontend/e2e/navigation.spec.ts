import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Dismiss any blocking modals (e.g., consent modal)
    const modalButton = page.getByRole('button', { name: /Akceptuję|Zamknij|Close/i });
    if (await modalButton.isVisible().catch(() => false)) {
      await modalButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('should navigate to all main pages', async ({ page }) => {
    // Test Start link
    await page.getByRole('navigation').getByRole('link', { name: /Start|LexPortal/i }).first().click();
    await expect(page).toHaveURL(/\/#?\/?$/); 
    
    // Test Knowledge Base link
    await page.getByRole('navigation').getByRole('link', { name: /Baza wiedzy/i }).first().click();
    await expect(page).toHaveURL(/knowledge-base/);
    
    // Test Document Analysis link
    await page.getByRole('navigation').getByRole('link', { name: /Analiza Dokumentów/i }).first().click();
    await expect(page).toHaveURL(/document-analysis/);
  });

  test('should show logo and brand name', async ({ page }) => {
    // Target the logo specifically in the navigation bar
    const logo = page.getByRole('navigation').getByRole('link', { name: /LexPortal/i });
    await expect(logo).toBeVisible();
  });

  test('should highlight active navigation link', async ({ page }) => {
    // Navigate to knowledge base using navbar link
    await page.getByRole('navigation').getByRole('link', { name: /Baza wiedzy/i }).click();
    
    // Check if the navbar link has active styling
    const activeLink = page.getByRole('navigation').getByRole('link', { name: /Baza wiedzy/i });
    const classes = await activeLink.getAttribute('class');
    expect(classes).toContain('text-blue-600');
  });

  test('should show login button when not authenticated', async ({ page }) => {
    // Target login button specifically in navigation (use first() for desktop/mobile variants)
    const loginButton = page.getByRole('navigation').getByRole('link', { name: /Zaloguj/i }).first();
    await expect(loginButton).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    // Click login button in navbar (use first() for desktop/mobile variants)
    await page.getByRole('navigation').getByRole('link', { name: /Zaloguj/i }).first().click();
    await expect(page).toHaveURL(/login/);
  });
});
