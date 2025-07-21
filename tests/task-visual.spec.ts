import { test } from '@playwright/test';

test('タスク管理画面の確認', async ({ page }) => {
  await page.goto('?test=true');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  // メニューボタンを探して クリック
  const menuButton = await page.locator('button').filter({ has: page.locator('svg') }).first();
  await menuButton.click();
  await page.waitForTimeout(500);
  
  // タスクメニューをクリック
  await page.getByText('タスク').click();
  await page.waitForTimeout(1000);
  
  // スクリーンショット
  await page.screenshot({ path: 'screenshots/task-board-fixed.png', fullPage: true });
});