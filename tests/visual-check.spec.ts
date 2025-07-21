import { test } from '@playwright/test';

test.describe('Visual Check', () => {
  test('メイン画面のスクリーンショットを取得', async ({ page }) => {
    // テストモードでアクセス
    await page.goto('?test=true');
    
    // ページが完全に読み込まれるまで待機
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // メイン画面のスクリーンショット
    await page.screenshot({ path: 'screenshots/main-screen.png', fullPage: true });
    
    // チャットメッセージを送信してオーバーレイ確認
    await page.fill('input[placeholder="メッセージを入力..."]', 'テストメッセージ');
    await page.click('button:has(svg[data-testid="SendIcon"])');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'screenshots/main-with-message.png', fullPage: true });
  });

  test('タスク管理画面のスクリーンショットを取得', async ({ page }) => {
    await page.goto('?test=true');
    await page.waitForLoadState('networkidle');
    
    // メニューを開く
    await page.click('.MuiIconButton-root.MuiIconButton-edgeStart');
    await page.waitForTimeout(500);
    
    // タスクメニューをクリック
    await page.click('.MuiListItemButton-root:has-text("タスク")');
    await page.waitForTimeout(1000);
    
    // タスクボード画面のスクリーンショット
    await page.screenshot({ path: 'screenshots/task-board.png', fullPage: true });
    
    // タスクを追加
    await page.fill('input[placeholder="新しいタスクを追加..."]', 'サンプルタスク');
    await page.click('button:has-text("追加")');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'screenshots/task-board-with-task.png', fullPage: true });
  });
});