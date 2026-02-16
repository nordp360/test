import { test, expect } from '@playwright/test';

test.describe('Dark Mode Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Dismiss any blocking modals (e.g., consent modal)
    const modalButton = page.getByRole('button', { name: /Akceptuję|Zamknij|Close/i });
    if (await modalButton.isVisible().catch(() => false)) {
      await modalButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('should toggle dark mode on and off', async ({ page }) => {
    // Find the dark mode toggle button in the navbar
    const toggleButton = page.getByRole('navigation').getByRole('button', { name: /Przełącz na tryb/i });
    
    // Initially should be in light mode
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    
    // Click to enable dark mode
    await toggleButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Click again to disable dark mode
    await toggleButton.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should persist dark mode across page reloads', async ({ page }) => {
    // Enable dark mode
    const toggleButton = page.getByRole('navigation').getByRole('button', { name: /Przełącz na tryb/i });
    await toggleButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Reload the page
    await page.reload();
    
    // Dark mode should still be enabled
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Clean up - disable dark mode
    await page.getByRole('navigation').getByRole('button', { name: /Przełącz na tryb/i }).click();
  });

  test('should show correct icon for current theme', async ({ page }) => {
    const toggleButton = page.getByRole('navigation').getByRole('button', { name: /Przełącz na tryb/i });
    
    // In light mode, button should have aria-label for switching to dark
    await expect(toggleButton).toHaveAttribute('aria-label', /ciemny/i);
    
    // Switch to dark mode
    await toggleButton.click();
    
    // In dark mode, button should have aria-label for switching to light
    const toggleButtonAfter = page.getByRole('navigation').getByRole('button', { name: /Przełącz na tryb/i });
    await expect(toggleButtonAfter).toHaveAttribute('aria-label', /jasny/i);
    
    // Clean up
    await toggleButtonAfter.click();
  });

  test('should apply dark mode to all pages', async ({ page }) => {
    // Enable dark mode on home page
    const toggleButton = page.getByRole('navigation').getByRole('button', { name: /Przełącz na tryb/i });
    await toggleButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Navigate to knowledge base
    await page.getByRole('navigation').getByRole('link', { name: /Baza wiedzy/i }).first().click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Navigate to document analysis
    await page.getByRole('navigation').getByRole('link', { name: /Analiza Dokumentów/i }).first().click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    
    // Clean up - disable dark mode
    await page.getByRole('navigation').getByRole('button', { name: /Przełącz na tryb/i }).click();
  });
});
