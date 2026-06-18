# 診断アプリ MVP

note記事から遷移させる想定の、静的な診断アプリMVPです。

## 使い方

- ローカル確認: `affiliate-diagnosis-app/index.html` をブラウザで開く
- GitHub Pages: このディレクトリ内のファイルを公開リポジトリ直下へ配置し、Pagesの公開元を設定する
- 診断URL: `index.html?id=baby-lotion`
- 赤ちゃん保湿診断のnoteカード用URL: `cards/baby-lotion/`
- 転職診断URL: `index.html?id=career-change-a8-001`
- 転職診断のnoteカード用URL: `cards/career-change-a8-001/`

## 方針

- 回答データは保存しません。
- 医療判断や肌状態の診断はしません。
- 結果は「商品を断定する」ではなく、商品ページを見る前の確認点を整理する用途です。
- 楽天リンクを置くため、ページ冒頭にアフィリエイト表記を置いています。
- 価格、在庫、商品仕様は変わるため、購入前に楽天の商品ページで確認してもらう前提です。

## 診断追加

`data/diagnoses.js` に診断ID、質問、スコア、結果、商品候補を追加すると、同じUIで別記事向け診断を増やせます。

商品候補は `offers` 配列へ追加し、結果画面には各結果の `recommendedOffer` で指定した1商品だけを表示します。

## Markdown / Gemini パイプライン

今後の診断文言は、直接アプリへ書かず、MarkdownでGemini投入資料を作ってから反映します。

1. `pipeline/markdown/source-notes/` に、読者の悩みと候補4件までを整理する。
2. `pipeline/markdown/briefs/{diagnosis_id}-gemini-brief.md` に、Geminiへ渡す公開用ブリーフを作る。
3. `pipeline/markdown/templates/gemini-output-contract.md` を一緒に渡し、出力形式を固定する。
4. 以下のコマンドで、Geminiへ貼る1ファイル版を作る。

```bash
node scripts/build-gemini-brief-bundle.mjs career-change-a8-001
```

生成先は `pipeline/markdown/briefs/career-change-a8-001-gemini-prompt.md` です。

Geminiには、A8.netの成果報酬額、EPC、確定率、programIdなどの管理画面内情報を渡しません。

## シートから生成する診断

未経験エンジニア転職診断は、`pipeline/affiliate-diagnosis-pipeline-template.xlsx` から生成します。

```bash
CODEX_WORKSPACE_NODE_MODULES=/Users/sugimotokoichi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules \
  /Users/sugimotokoichi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node \
  scripts/generate-career-diagnosis-from-workbook.mjs
```

生成先は `data/career-change-a8-001.generated.js` です。

A8.net候補は現時点では提携申請前です。公開導線へ使う前に、提携承認後のアフィリエイトリンクへ差し替えてください。

## note記事に置く導線案

公開URLが決まったら、本文中の楽天リンク前または記事末尾に以下のように置きます。

```text
買う前に、いま自分が何を不安に感じているかだけ整理したい方は、こちらの簡単チェックも使えます。

https://example.com/affiliate-diagnosis-app/?id=baby-lotion
```

noteではURLを独立したブロックに置き、カード表示になるか公開後に確認します。

## noteカード用URL

GitHub Pagesの静的HTMLでは、`?id=...` ごとにOG画像を出し分けられません。
noteでリンクカード化する場合は、各診断専用の `cards/{diagnosis_id}/` URLを本文に置きます。

赤ちゃん保湿診断では、以下のURLをnoteに埋め込むと専用サムネイルが使われます。

```text
https://koxtuichi.github.io/product-diagnosis/cards/baby-lotion/
```

転職診断では、以下のURLをnoteに埋め込むと専用サムネイルが使われます。

```text
https://koxtuichi.github.io/product-diagnosis/cards/career-change-a8-001/
```

このカードURLは、クリック時に本体の診断URLへ移動します。
