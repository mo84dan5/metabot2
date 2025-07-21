#!/bin/bash

echo "🔄 最新のmainブランチを取得中..."
git checkout main
git pull origin main

echo "🔨 ビルド中..."
npm run build

if [ $? -eq 0 ]; then
    echo "📤 GitHub Pagesにデプロイ中..."
    # gh-pagesは自動的に最新のビルドをデプロイ
    npx gh-pages -d dist
    
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