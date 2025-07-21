#!/bin/bash

# コミットメッセージを引数から取得（デフォルトは"Update"）
MESSAGE=${1:-"Update"}

echo "📦 変更をステージング..."
git add -A

echo "💾 コミット中..."
git commit -m "$MESSAGE"

echo "🚀 リモートにプッシュ..."
git push

echo "✅ プッシュ完了！"