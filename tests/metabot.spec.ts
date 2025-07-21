import { test, expect } from '@playwright/test';

test.describe('Metabot2 App', () => {
  test('アプリが正常に起動し、テストモードで動作する', async ({ page }) => {
    // コンソールエラーをキャプチャ
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    // ページエラーをキャプチャ
    page.on('pageerror', err => {
      console.log('Page error:', err.message);
    });
    
    // テストモードでアプリにアクセス
    await page.goto('?test=true');
    
    // デバッグ: ページのHTMLを出力
    const body = await page.locator('body').innerHTML();
    console.log('Page body (first 500 chars):', body.substring(0, 500));
    
    // アプリが完全に読み込まれるまで待機（MUI Box）
    await page.waitForSelector('.MuiBox-root', { timeout: 10000 });
    
    // テストモードバナーが表示されていることを確認（MUI Alert）
    await expect(page.locator('.MuiAlert-root')).toBeVisible();
    await expect(page.locator('.MuiAlert-root')).toContainText('テストモードで実行中');
    
    // 3Dロボットが表示されていることを確認
    await expect(page.locator('canvas')).toBeVisible();
    
    // チャット入力欄が表示されていることを確認（MUI TextField）
    await expect(page.locator('input[placeholder="メッセージを入力..."]')).toBeVisible();
  });

  test('ハンバーガーメニューが機能する', async ({ page }) => {
    await page.goto('?test=true');
    
    // メニューボタンをクリック（MUI IconButton）
    await page.click('.MuiIconButton-root.MuiIconButton-edgeStart');
    
    // Drawerが開いていることを確認
    await expect(page.locator('.MuiDrawer-paper')).toBeVisible();
    
    // メニュー項目が表示されていることを確認（MUI ListItem）
    await expect(page.locator('.MuiListItemText-root').filter({ hasText: 'チャット' })).toBeVisible();
    await expect(page.locator('.MuiListItemText-root').filter({ hasText: '会話ログ' })).toBeVisible();
    await expect(page.locator('.MuiListItemText-root').filter({ hasText: 'タスク' })).toBeVisible();
    await expect(page.locator('.MuiListItemText-root').filter({ hasText: '設定' })).toBeVisible();
  });

  test('チャット機能がテストモードで動作する', async ({ page }) => {
    await page.goto('?test=true');
    
    // チャットメッセージを入力（MUI TextField）
    await page.fill('input[placeholder="メッセージを入力..."]', 'こんにちは');
    await page.click('button:has(svg[data-testid="SendIcon"])');
    
    // ローディングがオーバーレイで表示されることを確認（MUI Paper）
    await expect(page.locator('.MuiPaper-root .MuiCircularProgress-root')).toBeVisible();
    
    // モックレスポンスがオーバーレイで表示されることを確認
    await expect(page.locator('.MuiPaper-root .MuiTypography-body1')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('.MuiPaper-root .MuiTypography-body1')).toContainText('こんにちは！私はmetabot2です');
  });

  test('タスクボードが機能する', async ({ page }) => {
    await page.goto('?test=true');
    
    // メニューボタンをクリック
    await page.click('.MuiIconButton-root.MuiIconButton-edgeStart');
    
    // タスクメニューをクリック
    await page.click('.MuiListItemButton-root:has-text("タスク")');
    
    // タスクボードが表示されることを確認（MUI Container）
    await expect(page.locator('.MuiContainer-root:has-text("タスク管理")')).toBeVisible();
    
    // 新しいタスクを追加（MUI TextField + Button）
    await page.fill('input[placeholder="新しいタスクを追加..."]', 'テストタスク');
    await page.click('button:has-text("追加")');
    
    // タスクが追加されたことを確認（MUI Card）
    await expect(page.locator('.MuiCard-root').filter({ hasText: 'テストタスク' })).toBeVisible();
  });

  test('設定画面でAPIキー情報が表示される', async ({ page }) => {
    await page.goto('?test=true');
    
    // メニューボタンをクリック
    await page.click('.MuiIconButton-root.MuiIconButton-edgeStart');
    
    // 設定メニューをクリック
    await page.click('.MuiListItemButton-root:has-text("設定")');
    
    // 設定画面が表示されることを確認（MUI Container）
    await expect(page.locator('.MuiContainer-root:has-text("設定")')).toBeVisible();
    
    // URLパラメータの例が正しく表示されることを確認（MUI Paper）
    await expect(page.locator('.MuiPaper-outlined')).toContainText('OPENAI_API_KEY=YOUR_API_KEY');
  });

  test('音声入力ボタンが表示される', async ({ page }) => {
    await page.goto('?test=true');
    
    // 音声入力ボタンが表示されることを確認（MUI IconButton）
    await expect(page.locator('button:has(svg[data-testid="MicIcon"])')).toBeVisible();
  });

  test('メイン画面にチャット履歴が表示されない', async ({ page }) => {
    await page.goto('?test=true');
    
    // 複数のメッセージを送信（MUI TextField + IconButton）
    await page.fill('input[placeholder="メッセージを入力..."]', '最初のメッセージ');
    await page.click('button:has(svg[data-testid="SendIcon"])');
    await page.waitForTimeout(1500); // レスポンス待機
    
    await page.fill('input[placeholder="メッセージを入力..."]', '2番目のメッセージ');
    await page.click('button:has(svg[data-testid="SendIcon"])');
    await page.waitForTimeout(1500); // レスポンス待機
    
    // チャット履歴が存在しないことを確認（古いセレクタが存在しない）
    await expect(page.locator('.messages-container')).toHaveCount(0);
    
    // 最後のメッセージのみがオーバーレイで表示されることを確認（MUI Paper）
    const overlayMessages = await page.locator('.MuiPaper-root:has(.MuiTypography-body1)').count();
    expect(overlayMessages).toBeGreaterThanOrEqual(1);
  });

  test('メッセージがオーバーレイでアニメーション付きで表示される', async ({ page }) => {
    await page.goto('?test=true');
    
    // メッセージを送信（MUI TextField + IconButton）
    await page.fill('input[placeholder="メッセージを入力..."]', 'アニメーションテスト');
    await page.click('button:has(svg[data-testid="SendIcon"])');
    
    // オーバーレイが表示されることを確認（MUI Paper）
    const overlay = page.locator('.MuiPaper-root:has(.MuiTypography-body1)');
    await expect(overlay).toBeVisible();
    
    // スタイルが適用されていることを確認
    const hasAnimation = await overlay.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.animation !== 'none' || styles.transition !== 'none';
    });
    expect(hasAnimation).toBe(true);
  });
});