#!/bin/bash

echo "🔨 ビルド中..."
npm run build

echo "📁 ルートにファイルをコピー中..."
# ルートのビルド関連ファイルを削除（開発用ファイルは残す）
rm -f index.html
rm -rf assets
rm -f vite.svg

# distの内容をルートにコピー
cp dist/index.html .
cp -r dist/assets .
cp dist/vite.svg .

# modelsディレクトリもコピー（必要な場合）
if [ -d "dist/models" ]; then
    cp -r dist/models .
fi

echo "✅ デプロイ準備完了！"