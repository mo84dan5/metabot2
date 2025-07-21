import { test } from '@playwright/test';

test('メッセージ位置確認', async ({ page }) => {
  await page.goto('?test=true');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // メッセージ送信
  await page.fill('input[placeholder="メッセージを入力..."]', 'テストメッセージ');
  await page.click('button:has(svg[data-testid="SendIcon"])');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'screenshots/message-position.png', fullPage: true });
});