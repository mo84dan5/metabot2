import { test } from '@playwright/test';

test('修正後の画面確認', async ({ page }) => {
  // テストモードでアクセス
  await page.goto('?test=true');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Three.jsの読み込み待機
  
  // メイン画面
  await page.screenshot({ path: 'screenshots/fixed-main.png', fullPage: true });
  
  // メッセージ送信
  await page.fill('input[placeholder="メッセージを入力..."]', 'こんにちは！');
  await page.click('button:has(svg[data-testid="SendIcon"])');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'screenshots/fixed-main-with-overlay.png', fullPage: true });
});