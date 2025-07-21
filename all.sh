#!/bin/bash

# コミットメッセージを引数から取得（デフォルトは"Update and deploy"）
MESSAGE=${1:-"Update and deploy"}

echo "📦 変更をステージング..."
git add -A

echo "💾 コミット中..."
git commit -m "$MESSAGE"

echo "🚀 リモートにプッシュ..."
git push

echo "🔨 ビルド中..."
npm run build

if [ $? -eq 0 ]; then
    echo "📤 GitHub Pagesにデプロイ中..."
    gh-pages -d dist
    
    if [ $? -eq 0 ]; then
        echo "✅ すべて完了！"
        echo "🌐 URL: https://mo84dan5.github.io/metabot2/"
    else
        echo "❌ デプロイに失敗しました"
        exit 1
    fi
else
    echo "❌ ビルドに失敗しました"
    exit 1
fi