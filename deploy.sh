#!/bin/bash

echo "🔨 ビルド中..."
npm run build

if [ $? -eq 0 ]; then
    echo "📤 GitHub Pagesにデプロイ中..."
    gh-pages -d dist
    
    if [ $? -eq 0 ]; then
        echo "✅ デプロイ完了！"
        echo "🌐 URL: https://mo84dan5.github.io/metabot2/"
    else
        echo "❌ デプロイに失敗しました"
        exit 1
    fi
else
    echo "❌ ビルドに失敗しました"
    exit 1
fi