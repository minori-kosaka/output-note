# Note読後アウトプットフォーム

GitHub Pagesに置く自作フォームから、Google Apps Script経由でGoogle Sheetsへ回答を保存する構成です。

## 仕組み

- 読者は `index.html` のフォームから読後アウトプットを送信します。
- プラスαとして、任意の近況質問をランダムに1つ表示します。
- URLの `source` パラメータを読み取り、回答と一緒に保存します。
- Google Apps Scriptが受け取った回答をスプレッドシートの `responses` シートへ追記します。

例:

```text
https://ユーザー名.github.io/リポジトリ名/?source=note_001
```

## Google Sheets側の準備

1. Google Sheetsで新しいスプレッドシートを作ります。
2. `拡張機能` → `Apps Script` を開きます。
3. `apps-script/Code.gs` の内容を貼り付けます。
4. Apps Scriptの右上から `デプロイ` → `新しいデプロイ` を選びます。
5. 種類は `ウェブアプリ` を選びます。
6. 実行ユーザーは `自分`、アクセスできるユーザーは `全員` にします。
7. デプロイ後に表示されるWebアプリURLをコピーします。
8. `script.js` の `GAS_ENDPOINT` にそのURLを貼ります。

## GitHub Pages側の準備

1. このフォルダの `index.html`, `styles.css`, `script.js` をGitHubリポジトリに置きます。
2. GitHubのリポジトリ設定で Pages を有効にします。
3. 公開URLを開き、テスト送信します。
4. Google Sheetsの `responses` シートに行が追加されることを確認します。

## Noteに貼るURL

Noteごとに `source` だけ変えます。

```text
https://ユーザー名.github.io/リポジトリ名/?source=note_2026_05_08_first
https://ユーザー名.github.io/リポジトリ名/?source=note_2026_05_09_second
```

`source` はあとで集計しやすいように、日付や記事の短い名前を入れるのがおすすめです。

## スプレッドシートに保存される列

- `timestamp`: 回答日時
- `source`: どのNoteから来たか
- `output`: 読後アウトプット
- `extraPrompt`: 表示されたプラスα質問
- `extraAnswer`: プラスα質問への回答
- `name`: 名前またはニックネーム
- `pageUrl`: 回答時に開いていたフォームURL
- `userAgent`: ブラウザ情報

## 項目設計の考え方

毎回Note下に置く常設フォームなので、既存アンケートの全項目は入れず、回答の心理的ハードルが低い項目に絞っています。
読後アウトプットは固定しつつ、同じ人が何度開いても「これ前も答えた」となりにくいよう、プラスαの近況質問をランダム表示します。

- 必須: 読後アウトプット
- 任意: プラスαの近況質問
- 任意: 名前またはニックネーム

生まれ年、年代、知ったきっかけ、LINE特典などは、別の「詳しめアンケート」に分けるのがおすすめです。

## 質問の変え方

`script.js` の `extraPrompts` に質問を追加・削除できます。
