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
-- Row Level Securityを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーがあれば削除（エラー回避のため）
DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on todos" ON todos;
DROP POLICY IF EXISTS "Allow all operations on categories" ON categories;

-- すべてのユーザーが読み書きできるように設定（簡易版）
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on todos" ON todos
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);
```

**💡 エラーが出た場合：**
もし「policy already exists」というエラーが出た場合は、上記のSQL（`DROP POLICY IF EXISTS`を含む）を実行すれば解決します。

### ステップ5: アプリを起動

PowerShellで以下のコマンドを実行：

```powershell
npm run dev
```

ブラウザで `http://localhost:3000` を開いて動作確認してください。

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
