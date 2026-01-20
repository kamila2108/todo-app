# Supabase実装完了ガイド

## ✅ 実装完了内容

TodoアプリをSupabaseを使った本格的なログイン対応アプリに変更しました。

### 変更点

1. **Supabaseクライアントライブラリを追加**
   - `@supabase/supabase-js` をインストール（次のステップで実行）

2. **Supabase接続用ファイルを作成**
   - `lib/supabase/client.ts` - Supabaseクライアントの設定
   - `lib/supabase/database.types.ts` - データベース型定義
   - `lib/supabase/auth.ts` - ユーザー認証機能（名前ベース）
   - `lib/supabase/todos.ts` - Todoデータの操作
   - `lib/supabase/categories.ts` - カテゴリデータの操作

3. **既存のコードをSupabase対応に変更**
   - `lib/actions/todo-actions.ts` - Supabaseを使うように変更
   - `lib/actions/category-actions.ts` - Supabaseを使うように変更
   - `app/page.tsx` - ユーザー認証とTodo取得をSupabaseに変更
   - `components/todo/TodoForm.tsx` - 非同期処理に対応
   - `components/todo/TodoList.tsx` - 非同期処理に対応
   - `components/todo/TodoItem.tsx` - 非同期処理に対応

4. **データフロー**
   - 名前入力 → `findOrCreateUser()` でユーザーを検索/作成
   - Todo取得 → `getTodosByUserId()` でユーザーIDに紐づくTodoを取得
   - Todo作成 → `createTodo()` でSupabaseに保存
   - Todo更新/削除 → `updateTodo()` / `deleteTodo()` でSupabaseを更新

---

## 🚀 セットアップ手順

### ステップ1: Supabaseライブラリをインストール

PowerShellで以下のコマンドを実行：

```powershell
npm install @supabase/supabase-js
```

### ステップ2: Supabaseプロジェクトを作成

詳細は `SUPABASE_SETUP.md` を参照してください。

**簡単な流れ：**
1. [Supabase](https://supabase.com/) でアカウント作成
2. 新しいプロジェクトを作成
3. APIキーとURLを取得
4. データベーステーブルを作成（SQL Editorで実行）

### ステップ3: 環境変数を設定

プロジェクトのルートフォルダに `.env.local` ファイルを作成し、以下を追加：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要：**
- `xxxxx` の部分を実際のSupabase URLに置き換えてください
- キーも実際の `anon public` キーに置き換えてください
- `.env.local` ファイルは `.gitignore` に含まれているため、GitHubにアップロードされません

### ステップ4: データベーステーブルを作成

Supabaseダッシュボードの「SQL Editor」で、以下のSQLを実行：

**ユーザーテーブル：**
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
```

**Todoテーブル：**
```sql
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  category TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
```

**カテゴリテーブル：**
```sql
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
```

**認証ポリシー（簡易版）：**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on todos" ON todos
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);
```

### ステップ5: アプリを起動

#### 5-1. PowerShellを開く

1. **Windowsキー**を押す
2. 「**PowerShell**」と入力
3. 「**Windows PowerShell**」をクリックして開く

**💡 重要：**
- 必ず**新しいPowerShellウィンドウ**を開いてください
- 以前開いていたPowerShellがある場合は、閉じてから新しく開いてください

#### 5-2. プロジェクトフォルダに移動

PowerShellで以下のコマンドを実行して、プロジェクトフォルダに移動します：

```powershell
cd C:\Users\tokam\Downloads\1
```

**💡 コマンドのコピー方法：**
- 上記のコマンドをコピー（`cd C:\Users\tokam\Downloads\1` の部分だけ）
- PowerShellに貼り付け（右クリック → 貼り付け、または `Ctrl+V`）
- **Enterキー**を押す

**確認方法：**
- PowerShellの画面に `C:\Users\tokam\Downloads\1` と表示されればOK
- または、以下のコマンドで確認できます：
  ```powershell
  pwd
  ```
  （`pwd` と入力してEnterキーを押すと、現在のフォルダが表示されます）

#### 5-3. 開発サーバーを起動

PowerShellで以下のコマンドを実行：

```powershell
npm run dev
```

**💡 コマンドのコピー方法：**
- `npm run dev` の部分だけをコピー
- PowerShellに貼り付け
- **Enterキー**を押す

**実行後の表示：**

正常に起動すると、以下のようなメッセージが表示されます：

```
> todo-app@0.1.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

**✅ 成功のサイン：**
- `Local: http://localhost:3000` と表示される
- `Ready in X.Xs` と表示される
- エラーメッセージが表示されない

**⚠️ 注意：**
- PowerShellのウィンドウは**閉じないでください**
- このウィンドウを閉じると、開発サーバーが停止します
- サーバーを停止したい場合は、`Ctrl+C` を押してください

#### 5-4. ブラウザでアプリを開く

1. **ブラウザを開く**（Chrome、Edge、Firefoxなど、どのブラウザでもOK）

2. **アドレスバーに以下を入力：**
   ```
   http://localhost:3000
   ```
   - または、`localhost:3000` だけでもOK

3. **Enterキー**を押す

**💡 アドレスバーの見つけ方：**
- ブラウザの上部にある、URLを入力する欄です
- 通常は白い長方形のボックスで、現在のページのURLが表示されています

**✅ 成功のサイン：**
- Todoアプリの画面が表示される
- 名前入力画面が表示される（初回の場合）
- エラーページが表示されない

#### 5-5. 動作確認

**基本的な動作確認：**

1. **名前を入力**
   - 名前入力画面で、任意の名前を入力（例：「テストユーザー」）
   - 「開始」ボタンをクリック

2. **Todo画面が表示される**
   - 「〇〇さんのTodo」というタイトルが表示される
   - 左側に入力エリア、右側にTodo一覧エリアが表示される

3. **Todoを作成**
   - タイトルを入力して「Todoを作成」ボタンをクリック
   - 右側のTodo一覧に作成したTodoが表示される

**✅ 正常に動作している場合：**
- Todoが作成できる
- Todoのチェックボックスをクリックできる
- Todoを削除できる
- エラーメッセージが表示されない

#### 5-6. トラブルシューティング

##### Q1: `npm run dev` を実行しても何も表示されない

**原因：** コマンドが実行されていない、またはエラーが発生している可能性があります。

**解決方法：**
1. PowerShellで `npm run dev` と入力してEnterキーを押したか確認
2. エラーメッセージが表示されていないか確認
3. プロジェクトフォルダに正しく移動しているか確認（`cd C:\Users\tokam\Downloads\1`）

##### Q2: `npm: コマンドが見つかりません` というエラーが出る

**原因：** Node.jsがインストールされていない、またはPATHが設定されていません。

**解決方法：**
1. Node.jsがインストールされているか確認：
   ```powershell
   node --version
   ```
   - バージョン番号が表示されればOK
   - エラーが出る場合は、Node.jsをインストールしてください（`SETUP_GUIDE.md`のステップ2を参照）

2. PowerShellを閉じて、再度開いてから試してください

##### Q3: `Cannot find module '@supabase/supabase-js'` というエラーが出る

**原因：** Supabaseライブラリがインストールされていません。

**解決方法：**
1. PowerShellで `Ctrl+C` を押して開発サーバーを停止
2. 以下のコマンドを実行：
   ```powershell
   npm install @supabase/supabase-js
   ```
3. インストールが完了したら、再度 `npm run dev` を実行

##### Q4: ブラウザで「接続できません」や「ERR_CONNECTION_REFUSED」と表示される

**原因：** 開発サーバーが起動していない、または別のポートで起動している可能性があります。

**解決方法：**
1. PowerShellで開発サーバーが起動しているか確認
   - `Local: http://localhost:3000` と表示されているか確認
2. 開発サーバーが起動していない場合は、`npm run dev` を実行
3. 別のポート（例：`http://localhost:3001`）で起動している場合は、そのURLを開いてください

##### Q5: ブラウザで「Supabase環境変数が設定されていません」という警告が出る

**原因：** `.env.local` ファイルが作成されていない、または環境変数が正しく設定されていません。

**解決方法：**
1. `.env.local` ファイルがプロジェクトのルートフォルダにあるか確認
2. ファイルの中身が正しいか確認（`NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されているか）
3. 開発サーバーを再起動（`Ctrl+C` で停止してから `npm run dev` で再起動）

##### Q6: 名前を入力してもTodo画面に進まない

**原因：** Supabaseへの接続に失敗している可能性があります。

**解決方法：**
1. ブラウザの開発者ツール（F12キー）を開く
2. 「Console」タブをクリック
3. エラーメッセージを確認
4. `.env.local` ファイルの設定を確認
5. Supabaseプロジェクトが正しく作成されているか確認

#### 5-7. 開発サーバーを停止する方法

開発サーバーを停止したい場合は：

1. **PowerShellウィンドウに戻る**
2. **`Ctrl+C` を押す**
3. 確認メッセージが表示されたら、`Y` を押してEnterキー

**💡 注意：**
- 開発サーバーを停止すると、ブラウザでアプリを開けなくなります
- 再度アプリを使いたい場合は、`npm run dev` を実行してください

---

**✅ 完了の確認：**

以下の条件を満たしていれば、アプリの起動は成功です：

1. ✅ PowerShellで `npm run dev` を実行した
2. ✅ `Local: http://localhost:3000` と表示された
3. ✅ ブラウザで `http://localhost:3000` を開いた
4. ✅ Todoアプリの画面が表示された
5. ✅ 名前を入力してTodo画面に進めた

**次のステップ：**
- アプリが正常に起動したら、実際にTodoを作成・編集・削除して動作を確認してください
- 複数デバイスから同じ名前でログインして、データが同期されることを確認してください

---

## 📋 動作の確認方法

1. **名前を入力してログイン**
   - 初回は新規ユーザーとして登録されます
   - 同じ名前で再ログインすると、同じTodoリストが表示されます

2. **Todoを作成**
   - 作成したTodoはSupabaseデータベースに保存されます
   - 別のデバイスから同じ名前でログインすると、同じTodoが表示されます

3. **複数デバイスでの確認**
   - スマホ、PCなど異なるデバイスから同じ名前でログイン
   - すべて同じTodoリストが表示されることを確認

---

## 🔍 トラブルシューティング

### エラー: "Supabase環境変数が設定されていません"

**原因：** `.env.local` ファイルが作成されていない、または環境変数が正しく設定されていません。

**解決方法：**
1. `.env.local` ファイルがプロジェクトのルートフォルダにあるか確認
2. 環境変数の値が正しいか確認（URLとキー）
3. 開発サーバーを再起動（`Ctrl+C` で停止してから `npm run dev` で再起動）

### エラー: "ユーザーが見つかりませんでした"

**原因：** データベーステーブルが作成されていない可能性があります。

**解決方法：**
1. Supabaseダッシュボードの「Table Editor」でテーブルが存在するか確認
2. SQL Editorでテーブル作成SQLを再実行

### Todoが表示されない

**原因：** データベース接続の問題、または認証ポリシーの問題。

**解決方法：**
1. ブラウザの開発者ツール（F12）の「Console」タブでエラーを確認
2. Supabaseダッシュボードの「Logs」でエラーを確認
3. 認証ポリシーが正しく設定されているか確認

---

## 📚 参考資料

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js環境変数](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## 🎯 次のステップ（オプション）

実装が完了したら、以下の改善を検討できます：

1. **セキュリティ強化**
   - より厳密なRow Level Security（RLS）ポリシーの設定
   - ユーザーが自分のデータだけを操作できるように制限

2. **本格的な認証**
   - Supabase Authを使ったメール認証
   - パスワード保護
   - ソーシャルログイン（Google、GitHubなど）

3. **リアルタイム更新**
   - Supabase Realtimeを使って、複数デバイス間でリアルタイムにTodoを同期

4. **Vercelへのデプロイ**
   - Vercelダッシュボードで環境変数を設定
   - 本番環境でもSupabaseを使用
