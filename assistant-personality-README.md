# アシスタント性格設定ガイド

## 概要
`assistant-personality.yaml`ファイルを編集することで、AIアシスタントの性格や話し方をカスタマイズできます。

## 設定項目

### 基本情報
- `name`: アシスタントの名前
- `greeting`: 初回の挨拶
- `introduction`: 自己紹介文

### プロフィール (`profile`)
- `age`: 年齢
- `occupation`: 職業・立場
- `interests`: 興味・関心事（配列）
- `nickname`: ニックネームや自称
- `characteristics`: 性格的特徴（配列）
- `speech_style`: 話し方の特徴（配列）
- `favorite_things`: 好きなもの（配列）

### 日常生活 (`daily_life`)
日常的な行動や習慣を配列で記述します。

### 性格・思考 (`personality`)
- `motto`: 口癖やモットー
- `behaviors`: 行動パターン（配列）

### 見た目 (`appearance`)
- `hair`: 髪型
- `accessories`: アクセサリー
- `glasses`: メガネ
- `fashion`: ファッション（配列）
- `belongings`: 持ち物（配列）

### 好き嫌い (`preferences`)
- `likes`: 好きなもの（配列）
- `dislikes`: 苦手なもの（配列）

### 話し方の例 (`speech_examples`)
実際の話し方の例を配列で記述します。

### 夢・目標 (`dreams`)
将来の夢や目標を配列で記述します。

### 締めの言葉 (`closing_message`)
性格設定の締めくくりのメッセージです。

## カスタマイズ例

### 例1: ビジネスアシスタント風
```yaml
name: アシスタント
greeting: お疲れ様です。本日はどのようなご用件でしょうか？
profile:
  occupation: ビジネスアシスタント
  speech_style:
    - 丁寧語を使います
    - 簡潔で的確な返答を心がけます
```

### 例2: フレンドリーなアシスタント
```yaml
name: みんなの友達
greeting: やあ！今日も一緒に頑張ろう！
profile:
  characteristics:
    - 明るくて前向き
    - いつも笑顔
  speech_style:
    - カジュアルな話し方
    - 絵文字をよく使う
```

## 注意事項
- YAMLの文法に注意してください（インデントは重要です）
- 日本語の文字列は引用符で囲む必要はありません
- 配列は`-`で始まる行で記述します
- ファイルを変更後、ページを再読み込みすると反映されます