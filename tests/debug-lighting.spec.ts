import { test, expect } from '@playwright/test';

test('デバッグ: ライティング設定の確認', async ({ page }) => {
  // コンソールログを収集
  const logs: string[] = [];
  page.on('console', msg => {
    logs.push(`${msg.type()}: ${msg.text()}`);
  });

  // ページにアクセス
  await page.goto('http://localhost:5173/');
  
  // ページが完全に読み込まれるまで待機
  await page.waitForTimeout(3000);
  
  // コンソールログを表示
  console.log('\n=== Console Logs ===');
  logs.forEach(log => console.log(log));
  
  // YAMLの読み込みログを確認
  const yamlLogs = logs.filter(log => log.includes('YAML') || log.includes('config'));
  console.log('\n=== YAML/Config Logs ===');
  yamlLogs.forEach(log => console.log(log));
  
  // ライティング設定のログを確認
  const lightingLogs = logs.filter(log => log.includes('lighting') || log.includes('Light'));
  console.log('\n=== Lighting Logs ===');
  lightingLogs.forEach(log => console.log(log));
  
  // コンソールでJavaScriptを実行してconfig内容を取得
  const configData = await page.evaluate(() => {
    // React Fiberから設定を取得する（開発モードでのみ動作）
    const root = document.getElementById('root');
    if (root && (root as any)._reactRootContainer) {
      return (window as any).__METABOT_CONFIG || 'Config not exposed';
    }
    return 'React root not found';
  });
  console.log('\n=== Config from page ===');
  console.log(configData);
  
  // スクリーンショットを撮影
  await page.screenshot({ path: 'lighting-debug.png' });
});