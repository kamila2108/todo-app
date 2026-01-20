# Supabase対応Todoアプリのデプロイ手順

## 📚 概要

このガイドでは、Supabaseを使ったTodoアプリをVercelにデプロイ（インターネット上に公開）する手順を説明します。

**完成後の動作：**
- インターネット上で誰でもアクセスできる
- 複数デバイス間で同じデータを見られる
- Supabaseデータベースにデータが保存される

---

## ⚠️ 事前準備

デプロイを始める前に、以下が完了していることを確認してください：

1. ✅ Supabaseプロジェクトが作成されている
2. ✅ データベーステーブル（users、todos、categories）が作成されている
3. ✅ 認証ポリシー（RLS）が設定されている
4. ✅ ローカルでアプリが正常に動作している（`npm run dev`で確認）
5. ✅ GitHubアカウントがある
6. ✅ Vercelアカウントがある（GitHubアカウントでサインアップ可能）

---

## 🚀 ステップ1: 変更をGitHubにプッシュする

### 1-1. PowerShellを開く

1. **Windowsキー**を押す
2. 「**PowerShell**」と入力
3. 「**Windows PowerShell**」をクリック

### 1-2. プロジェクトフォルダに移動

PowerShellで以下のコマンドを実行：

```powershell
cd C:\Users\tokam\Downloads\1
```

**確認方法：**
- PowerShellに `C:\Users\tokam\Downloads\1` と表示されればOK

### 1-3. 変更を確認する

以下のコマンドで、変更されたファイルを確認します：

```powershell
git status
```

**期待される結果：**
- 変更されたファイルの一覧が表示されます
- 例：`modified: lib/supabase/client.ts`、`new file: lib/supabase/auth.ts` など

### 1-4. 変更をステージングする

すべての変更をステージング（コミットの準備）します：

```powershell
git add .
```

**何をしているのか：**
- 変更されたファイルをGitに「この変更をコミットします」と伝えます
- `.` は「すべてのファイル」を意味します

**💡 警告メッセージについて：**
- `warning: LF will be replaced by CRLF` というメッセージが出ることがあります
- これは警告なので、**無視して大丈夫です**
- デプロイには影響しません

### 1-5. 変更をコミットする

変更にメッセージを付けてコミットします：

```powershell
git commit -m "Add Supabase integration for user authentication and data storage"
```

**別のメッセージ例：**
```powershell
git commit -m "Supabase統合：ユーザー認証とデータ保存機能を追加"
```

**何をしているのか：**
- 変更を「コミット」という形で記録します
- `-m` の後の文字列は、変更内容を説明するメッセージです
- 日本語や英語、どちらでもOKです

### 1-6. GitHubにプッシュする

変更をGitHubにアップロードします：

```powershell
git push
```

**何をしているのか：**
- ローカルの変更をGitHubに送信します
- Vercelが自動的に変更を検知して、デプロイを開始します

**もしエラーが出た場合：**
- 認証画面が表示されたら、「**Authorize git-ecosystem**」をクリック
- または、以前と同じ認証手順を実行してください

**💡 プッシュが成功した場合：**
- PowerShellに `To https://github.com/...` のようなメッセージが表示されます
- `* [new branch] main -> main` と表示されれば成功です

---

## 🔧 ステップ2: Vercelで環境変数を設定する

### 2-1. Vercelダッシュボードを開く

1. ブラウザで [Vercelのダッシュボード](https://vercel.com/dashboard) を開く
2. 自分のアカウントでログイン（GitHubアカウントでログインしている場合は自動的にログインされます）

### 2-2. プロジェクトを選択

1. ダッシュボードで、デプロイしたいプロジェクトをクリック
2. プロジェクトの詳細ページが開きます

### 2-3. 設定画面を開く

1. 画面上部のタブから「**Settings**」をクリック
2. 左側のメニューから「**Environment Variables**」をクリック

**💡 見つからない場合：**
- 「Settings」→「Environment Variables」の順にクリックしてください
- または、検索ボックスで「Environment Variables」と検索してください

### 2-4. Supabase環境変数を追加

以下の2つの環境変数を追加します：

#### 環境変数1: `NEXT_PUBLIC_SUPABASE_URL`

1. 「**Key**」欄に以下を入力：
   ```
   NEXT_PUBLIC_SUPABASE_URL
   ```

2. 「**Value**」欄に、SupabaseのProject URLを貼り付け：
   - Supabaseダッシュボード → 「Settings」→「API」→「Project URL」からコピー
   - 例：`https://abcdefghijklmnop.supabase.co`

3. 「**Environment**」で以下を選択：
   - ✅ **Production**（本番環境）
   - ✅ **Preview**（プレビュー環境）
   - ✅ **Development**（開発環境）
   - すべてにチェックを入れることを推奨します

4. 「**Add**」ボタンをクリック

#### 環境変数2: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

1. 「**Key**」欄に以下を入力：
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. 「**Value**」欄に、Supabaseのanon public keyを貼り付け：
   - Supabaseダッシュボード → 「Settings」→「API」→「anon public」キーからコピー
   - 例：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

3. 「**Environment**」で以下を選択：
   - ✅ **Production**（本番環境）
   - ✅ **Preview**（プレビュー環境）
   - ✅ **Development**（開発環境）
   - すべてにチェックを入れることを推奨します

4. 「**Add**」ボタンをクリック

**✅ 設定完了の確認：**
- 環境変数の一覧に、`NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が表示されればOK

**💡 重要：**
- 環境変数を追加・変更した後は、**再デプロイが必要**です
- 次のステップで再デプロイを実行します

---

## 🔄 ステップ3: 再デプロイを実行する

### 3-1. デプロイ画面を開く

1. Vercelダッシュボードで、プロジェクトの詳細ページに戻る
2. 画面上部のタブから「**Deployments**」をクリック

### 3-2. 再デプロイを実行

**方法1: 最新のデプロイを再デプロイする（推奨）**

1. 最新のデプロイ（一番上に表示されているもの）をクリック
2. 右上の「**⋯**」（3つの点）メニューをクリック
3. 「**Redeploy**」をクリック
4. 確認画面で「**Redeploy**」をクリック

**方法2: 新しいコミットをプッシュする**

もし最新のコミットがまだプッシュされていない場合は、ステップ1を再度実行してください。

**方法3: 手動で再デプロイする**

1. 「**Deployments**」タブで「**Deploy**」ボタンをクリック
2. 最新のコミットを選択して「**Deploy**」をクリック

### 3-3. デプロイの進行状況を確認

1. 「**Deployments**」タブで、新しいデプロイが開始されます
2. デプロイの状態が表示されます：
   - **Building** - ビルド中
   - **Ready** - デプロイ完了
   - **Error** - エラーが発生

**デプロイが完了するまでの時間：**
- 通常、2〜5分程度かかります
- 「**Ready**」または「**Build Completed**」と表示されれば完了です

---

## ✅ ステップ4: デプロイ後の動作確認

### 4-1. 公開サイトを開く

1. Vercelのダッシュボードで、デプロイが完了したら「**Visit**」ボタンをクリック
2. または、プロジェクトのURL（例：`https://your-project.vercel.app`）を開く

### 4-2. 基本的な動作確認

**1. 名前入力画面が表示される**
- 名前入力画面が表示されることを確認
- エラーページが表示されないことを確認

**2. 名前を入力してログイン**
- 任意の名前を入力（例：「テストユーザー」）
- 「開始」ボタンをクリック
- Todo画面が表示されることを確認

**3. Todoを作成**
- タイトルを入力して「Todoを作成」ボタンをクリック
- 右側のTodo一覧に作成したTodoが表示されることを確認

**4. Todoの操作**
- チェックボックスをクリックして完了状態を切り替えられることを確認
- 「Delete」ボタンでTodoを削除できることを確認

### 4-3. 複数デバイスでの確認

**スマホや別のPCから確認：**
1. スマホや別のPCのブラウザで、同じURLを開く
2. **同じ名前**でログイン
3. 作成したTodoが表示されることを確認

**✅ 成功のサイン：**
- 複数デバイス間で同じTodoリストが表示される
- Todoを作成・編集・削除すると、すべてのデバイスで反映される

---

## 🔍 トラブルシューティング

### Q1: デプロイが失敗する（Build Error）

**原因：** ビルドエラーが発生している可能性があります。

**解決方法：**
1. Vercelのダッシュボードで「**Deployments**」タブを開く
2. 失敗したデプロイをクリック
3. 「**Build Logs**」タブでエラーメッセージを確認
4. よくある原因：
   - Supabaseライブラリがインストールされていない → `package.json`に`@supabase/supabase-js`が含まれているか確認
   - 環境変数が設定されていない → ステップ2を確認
   - 型エラー → ローカルで`npm run build`を実行して確認

### Q2: 環境変数が反映されない

**原因：** 環境変数を追加した後、再デプロイしていない可能性があります。

**解決方法：**
1. 環境変数を追加・変更した後は、**必ず再デプロイ**してください（ステップ3を参照）
2. 環境変数の値が正しいか確認：
   - `NEXT_PUBLIC_SUPABASE_URL` が正しいURLか
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` が正しいキーか
3. ブラウザのキャッシュをクリア（`Ctrl + Shift + R`）

### Q3: 「Supabase環境変数が設定されていません」という警告が出る

**原因：** Vercelで環境変数が設定されていない、または再デプロイしていない可能性があります。

**解決方法：**
1. Vercelのダッシュボードで環境変数が設定されているか確認（ステップ2を参照）
2. 環境変数を追加・変更した後、再デプロイを実行（ステップ3を参照）
3. ブラウザの開発者ツール（F12）の「Console」タブでエラーを確認

### Q4: 「ユーザーが見つかりませんでした」というエラーが出る

**原因：** Supabaseのデータベーステーブルが作成されていない可能性があります。

**解決方法：**
1. Supabaseダッシュボードの「**Table Editor**」で、以下のテーブルが存在するか確認：
   - `users`
   - `todos`
   - `categories`
2. テーブルが存在しない場合は、`SUPABASE_SETUP.md`のステップ3を参照してテーブルを作成してください

### Q5: Todoが表示されない

**原因：** データベース接続の問題、または認証ポリシーの問題。

**解決方法：**
1. ブラウザの開発者ツール（F12）の「Console」タブでエラーを確認
2. Supabaseダッシュボードの「**Logs**」でエラーを確認
3. 認証ポリシー（RLS）が正しく設定されているか確認（`SUPABASE_SETUP.md`のステップ4を参照）

### Q6: デプロイは成功したが、アプリが動作しない

**原因：** 環境変数の設定ミス、またはSupabase接続の問題。

**解決方法：**
1. ブラウザの開発者ツール（F12）の「Console」タブでエラーを確認
2. Vercelの環境変数が正しく設定されているか確認
3. Supabaseプロジェクトが正しく作成されているか確認
4. ローカル環境（`npm run dev`）で動作するか確認

---

## 📋 チェックリスト

デプロイが成功したか確認するためのチェックリスト：

- ✅ GitHubに変更がプッシュされた
- ✅ Vercelで環境変数（`NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_ANON_KEY`）が設定された
- ✅ 再デプロイが実行された
- ✅ デプロイが成功した（「Ready」と表示）
- ✅ 公開サイトで名前入力画面が表示される
- ✅ 名前を入力してTodo画面に進める
- ✅ Todoを作成できる
- ✅ 複数デバイス間で同じデータが見られる

---

## 🎯 次のステップ（オプション）

デプロイが完了したら、以下の改善を検討できます：

1. **カスタムドメインの設定**
   - Vercelのダッシュボードで、独自のドメインを設定できます

2. **セキュリティの強化**
   - より厳密なRow Level Security（RLS）ポリシーの設定
   - ユーザーが自分のデータだけを操作できるように制限

3. **パフォーマンスの最適化**
   - 画像の最適化
   - キャッシュの設定

---

## 📚 参考資料

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Next.js環境変数](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## ✅ 完了！

これで、Supabase対応のTodoアプリがインターネット上に公開されました！

**確認事項：**
- ✅ 複数デバイス間で同じデータが見られる
- ✅ Supabaseデータベースにデータが保存される
- ✅ 名前（ログインID）でユーザーを識別できる

問題があれば、トラブルシューティングセクションを参照してください。
