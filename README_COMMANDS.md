# metabot2 コマンド一覧

## 🚀 よく使うコマンド

### 1. **開発中の保存のみ** (最も使う)
```bash
npm run save
# または短縮版
npm run quick
```
- コードをGitHubに保存
- サイトは更新しない

### 2. **保存＋サイト公開** (完成時)
```bash
npm run release
# または短縮版
npm run full
```
- コードを保存
- ビルドしてサイトを更新

### 3. **サイト公開のみ** (再デプロイ)
```bash
npm run publish
```
- すでに保存済みのコードをビルド・公開

## 📋 全コマンド一覧

| コマンド | 説明 | 使用場面 |
|---------|------|---------|
| `npm run dev` | 開発サーバー起動 | 開発時 |
| `npm run build` | ビルドのみ | ビルド確認 |
| `npm run test` | テスト実行 | テスト |
| `npm run lint` | コード検査 | 品質チェック |
| `npm run save` | 保存のみ | 作業途中 |
| `npm run publish` | 公開のみ | 再デプロイ |
| `npm run release` | 保存＋公開 | リリース時 |

## 💡 使い分けのコツ

- **普段**: `npm run save` でこまめに保存
- **完成時**: `npm run release` で公開
- **修正時**: `npm run publish` で再公開

## 🔧 カスタムメッセージ付きコミット
```bash
npm run commit "機能Aを追加"
npm run push
```