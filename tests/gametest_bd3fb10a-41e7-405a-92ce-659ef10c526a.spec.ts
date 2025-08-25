
import { test } from '@playwright/test';
import { expect } from '@playwright/test';

test('GameTest_2025-08-25', async ({ page, context }) => {
  
    // Navigate to URL
    await page.goto('http://localhost:5173');

    // Take screenshot
    await page.screenshot({ path: 'game_setup_screen.png' });

    // Fill input field
    await page.fill('input[placeholder*="Enter your name"]', 'Test Player');

    // Fill input field
    await page.fill('input[placeholder*="Name your game"]', 'Playwright Test Game');

    // Click element
    await page.click('button:has-text("🚀 Start New Game")');

    // Take screenshot
    await page.screenshot({ path: 'game_interface_loaded.png' });

    // Click element
    await page.click('.email-item:first-child');

    // Take screenshot
    await page.screenshot({ path: 'email_selected.png' });

    // Click element
    await page.click('.email-item:has(.text-orange-800:contains('Response Required'))"');

    // Click element
    await page.click('.email-item:has(.text-orange-800)');

    // Take screenshot
    await page.screenshot({ path: 'response_required_email.png' });

    // Click element
    await page.click('button:has-text("Compose Policy Response")');

    // Take screenshot
    await page.screenshot({ path: 'policy_composer_modal.png' });

    // Fill input field
    await page.fill('input[placeholder*="Enter a clear, descriptive title"]', 'Public Wi-Fi Infrastructure Initiative');

    // Fill input field
    await page.fill('textarea[placeholder*="Describe your policy proposal"]', 'I propose establishing a comprehensive public Wi-Fi network throughout the town to improve digital connectivity for all residents. This initiative will include installing high-speed Wi-Fi access points in public areas, parks, and community centers. The project will be funded through a combination of municipal budget allocation and partnerships with local internet service providers. This will particularly benefit young residents who rely on digital connectivity for education and employment opportunities, while also supporting local businesses by attracting more foot traffic to Wi-Fi enabled areas.');

    // Take screenshot
    await page.screenshot({ path: 'policy_form_filled.png' });

    // Click element
    await page.click('button:has-text("Cancel")');

    // Take screenshot
    await page.screenshot({ path: 'complete_working_interface.png', { fullPage: true } });
});