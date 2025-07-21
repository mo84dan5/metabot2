#!/bin/bash

echo "🔍 ブランチの同期状態を確認中..."

# 最新の情報を取得
git fetch origin

# mainブランチの最新コミット
MAIN_COMMIT=$(git rev-parse origin/main)

# gh-pagesブランチが存在するか確認
if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    # gh-pagesの最後のデプロイ時のソースコミットを確認
    echo "📊 同期状態:"
    echo "  Main branch: $(git log origin/main -1 --pretty=format:'%h - %s')"
    echo "  Last deploy: $(git log origin/gh-pages -1 --pretty=format:'%h - %s')"
else
    echo "⚠️  gh-pagesブランチがまだ存在しません"
fi

# ローカルの未コミット変更を確認
if [[ -n $(git status -s) ]]; then
    echo "⚠️  ローカルに未コミットの変更があります"
    git status -s
fi