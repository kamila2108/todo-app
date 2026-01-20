# Supabaseを使った本格的なログイン対応

## 📚 概要

このガイドでは、TodoアプリをSupabaseを使った本格的なログイン対応アプリに変更する手順を説明します。

**完成後の動作：**
- 複数デバイス間で同じデータを見られる
- 名前（ログインID）でユーザーを識別
- サーバー側にデータを保存（localStorageは補助的にのみ使用）

---

## 🔧 ステップ1: Supabaseプロジェクトの作成

### 1-1. Supabaseアカウントの作成

1. ブラウザで [Supabase](https://supabase.com/) を開く
2. 「Start your project」または「Get Started」をクリック
3. GitHubアカウントでサインアップ（推奨）またはメールアドレスでサインアップ

### 1-2. 新しいプロジェクトを作成

1. ダッシュボードで「New Project」をクリック
2. 以下を入力：
   - **Project Name**: `todo-app`（任意の名前でOK）
   - **Database Password**: 強力なパスワードを設定（メモしておく）
   - **Region**: 最も近いリージョンを選択（例：`Tokyo (ap-northeast-1)`）
3. 「Create new project」をクリック
4. プロジェクトの作成完了まで待つ（1〜2分）

---

## 🔑 ステップ2: APIキーとURLの取得

### 2-1. プロジェクトの設定を開く

1. Supabaseダッシュボードで、作成したプロジェクトを開く
2. 左側のメニューから「Settings」→「API」をクリック

### 2-2. 必要な情報をコピー

以下の情報をコピーして、後で使用します：

1. **Project URL**
   - 例：`https://xxxxx.supabase.co`
   - 「Project URL」の下に表示されます

2. **anon public key**
   - 例：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - 「Project API keys」セクションの「anon public」キー

---

## 🗄️ ステップ3: データベーステーブルの作成

### 3-1. SQL Editorを開く

1. Supabaseダッシュボードの左側メニューから「SQL Editor」をクリック
2. 「New query」をクリック

### 3-2. ユーザーテーブルを作成

以下のSQLをコピー＆ペーストして実行：

```sql
-- ユーザーテーブル（名前=ログインID）
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを追加（検索を高速化）
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
```

**実行方法：**
1. SQLをコピー＆ペースト
2. 「Run」ボタンをクリック
3. 「Success. No rows returned」と表示されれば成功

### 3-3. Todoテーブルを作成

以下のSQLをコピー＆ペーストして実行：

```sql
-- Todoテーブル
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

-- インデックスを追加（検索を高速化）
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
```

### 3-4. カテゴリテーブルを作成（オプション）

以下のSQLをコピー＆ペーストして実行：

```sql
-- カテゴリテーブル（ユーザーごと）
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
```

### 3-5. テーブル作成の確認

1. 左側のメニューから「Table Editor」をクリック
2. `users`、`todos`、`categories` のテーブルが作成されていることを確認

---

## 🔐 ステップ4: 認証ポリシーの設定（簡易版）

名前ベースの簡易認証のため、認証ポリシーは緩めに設定します。

### 4-1. Row Level Security (RLS) を有効化

「SQL Editor」で以下を実行：

```sql
-- Row Level Securityを有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーが読み書きできるように設定（簡易版）
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on todos" ON todos
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL USING (true) WITH CHECK (true);
```

**注意：** 本番環境では、より厳密なセキュリティポリシーを設定してください。

---

## 📦 ステップ5: 環境変数の設定

### 5-1. `.env.local` ファイルを作成

プロジェクトのルートフォルダ（`package.json`がある場所）に `.env.local` ファイルを作成します。

### 5-2. 環境変数を追加

`.env.local` ファイルに以下を追加（実際の値に置き換えてください）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要：**
- `NEXT_PUBLIC_` プレフィックスは必須（クライアント側で使用するため）
- 実際のSupabase URLとキーに置き換えてください
- このファイルは`.gitignore`に含まれているため、GitHubにアップロードされません

---

## ✅ 次のステップ

環境変数を設定したら、以下の手順を実行：

1. Supabaseクライアントライブラリのインストール
2. Supabaseクライアントの設定
3. APIルートの更新
4. コンポーネントの更新

詳細は、実装ファイルを参照してください。
