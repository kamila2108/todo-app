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

**💡 初心者の方へ：**
SQL実行の詳しい手順は、`SQL_EXECUTION_GUIDE.md` を参照してください。
- コピー＆ペーストの方法
- Runボタンの見つけ方
- エラーが出たときの対処法
など、詳しく説明しています。

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
これは既存のポリシーを削除してから再作成するため、エラーが発生しません。

**注意：** 本番環境では、より厳密なセキュリティポリシーを設定してください。

---

## 📦 ステップ5: 環境変数の設定

### 💡 環境変数とは？

**環境変数**とは、アプリケーションが動作するために必要な「設定情報」を保存する仕組みです。

**簡単に言うと：**
- SupabaseのURL（住所）とキー（パスワードのようなもの）を保存する
- これにより、アプリがSupabaseデータベースに接続できるようになる

**なぜ必要か：**
- アプリが「どのSupabaseプロジェクトに接続するか」を知るため
- 機密情報（キー）をコードに直接書かずに、別ファイルで管理するため

---

### 5-1. プロジェクトのルートフォルダを確認

まず、プロジェクトのルートフォルダ（`package.json`がある場所）を見つけます。

**確認方法：**

1. **エクスプローラーでフォルダを開く**
   - プロジェクトのフォルダは **`C:\Users\tokam\Downloads\1`** です
   - エクスプローラーでこのパスを開いてください
   - または、ファイルエクスプローラーのアドレスバーに `C:\Users\tokam\Downloads\1` と入力してEnterキーを押す
   
2. **`package.json`というファイルがあるか確認**
   - このファイルがあるフォルダが「ルートフォルダ」です
   - **`package.json`ファイルは必ず存在します**（このプロジェクトに含まれています）

**💡 `package.json`が見つからない場合の対処法：**

**方法1: エクスプローラーで確認**
1. エクスプローラーを開く
2. アドレスバーに **`C:\Users\tokam\Downloads\1`** と入力してEnterキーを押す
3. フォルダ内のファイル一覧を確認
4. **`package.json`** というファイル名を探す
   - ファイル名で並び替えると見つけやすいです（「表示」→「名前で並び替え」）

**方法2: エクスプローラーで検索する**
1. エクスプローラーで **`C:\Users\tokam\Downloads\1`** フォルダを開く
2. 右上の検索ボックスに **`package.json`** と入力
3. 検索結果に表示されるはずです

**方法3: PowerShellで確認する**
1. PowerShellを開く（Windowsキー → 「PowerShell」と入力 → Enter）
2. 以下のコマンドを実行：
   ```powershell
   cd C:\Users\tokam\Downloads\1
   Get-ChildItem package.json
   ```
3. `package.json` と表示されれば、ファイルは存在します

**方法4: 現在のフォルダの場所を確認する**
- 現在の作業フォルダが **`C:\Users\tokam\Downloads\1`** であれば、ここが「ルートフォルダ」です
- このフォルダに `.env.local` ファイルを作成してください

**✅ 確認できたら：**
- `package.json`ファイルが見つかったフォルダが「ルートフォルダ」です
- このフォルダに `.env.local` ファイルを作成してください

---

### 5-2. `.env.local` ファイルを作成

プロジェクトのルートフォルダに `.env.local` というファイルを作成します。

**⚠️ 重要：** ファイル名は **`.env.local`** です（最初にピリオド（`.`）がつきます）

#### 方法1: メモ帳で作成する（初心者向け・推奨）

1. **メモ帳を開く**
   - Windowsキー → 「メモ帳」と入力 → Enterキー

2. **Supabaseの設定情報を貼り付け**
   
   ステップ2で取得した情報を使って、以下を入力してください：
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=ここにProject URLを貼り付け
   NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon public keyを貼り付け
   ```
   
   **例（実際の値に置き換えてください）：**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   **💡 コピー方法：**
   - Supabaseダッシュボードの「Settings」→「API」を開く
   - 「Project URL」の値をコピー → メモ帳の `NEXT_PUBLIC_SUPABASE_URL=` の後ろに貼り付け
   - 「anon public」キーの値をコピー → メモ帳の `NEXT_PUBLIC_SUPABASE_ANON_KEY=` の後ろに貼り付け

3. **ファイルを保存**
   - 「ファイル」→「名前を付けて保存」をクリック
   - **保存先**：プロジェクトのルートフォルダ（`package.json`がある場所）を選択
   - **ファイル名**：`.env.local` と入力
     - ⚠️ 注意：最初にピリオド（`.`）を忘れずに入力してください
   - **ファイルの種類**：「すべてのファイル（*.*）」を選択
     - 「テキスト文書（*.txt）」のままでは `.env.local.txt` になってしまいます
   - 「保存」をクリック

**💡 ファイル名の注意点：**
- ✅ 正しい：`.env.local`
- ❌ 間違い：`env.local`（ピリオドがない）
- ❌ 間違い：`.env.local.txt`（拡張子がついている）

#### 方法2: PowerShellで作成する（上級者向け）

PowerShellで以下のコマンドを実行：

```powershell
# プロジェクトのルートフォルダに移動（必要に応じて）
cd C:\Users\tokam\Downloads\1

# .env.localファイルを作成
New-Item -Path ".env.local" -ItemType File -Force

# ファイルを開いて編集（メモ帳で開く）
notepad .env.local
```

メモ帳が開いたら、上記「方法1」の手順2に従って内容を入力し、保存してください。

---

### 5-3. ファイルの内容を確認

`.env.local` ファイルが正しく作成されたか確認します。

**確認方法：**

1. **エクスプローラーでプロジェクトのルートフォルダを開く**
2. **`.env.local` ファイルがあるか確認**
   - ⚠️ 注意：ファイル名の最初がピリオド（`.`）なので、一部のエクスプローラー設定では表示されない場合があります
   - 「表示」→「ファイル名拡張子」と「隠しファイル」にチェックを入れてみてください

3. **メモ帳でファイルを開いて内容を確認**
   - ファイルを右クリック → 「プログラムから開く」→「メモ帳」

**正しい内容の例：**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**確認ポイント：**
- ✅ 2行になっている
- ✅ `NEXT_PUBLIC_SUPABASE_URL=` の後ろにSupabaseのURLがある（`https://`で始まる）
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY=` の後ろにキーがある（長い文字列）
- ✅ 各行の末尾に余計なスペースや改行がない

---

### 5-4. 重要事項の説明

**なぜ `NEXT_PUBLIC_` という名前なのか：**
- Next.jsでは、ブラウザ側（クライアント側）で使用する環境変数には `NEXT_PUBLIC_` というプレフィックス（接頭辞）が必要です
- これがないと、ブラウザ側で環境変数を読み込めません

**なぜ別ファイルに保存するのか：**
- 機密情報（キー）をコードに直接書かないため
- `.gitignore` という設定により、このファイルはGitHubにアップロードされません（安全）

**ファイル名が `.env.local` なのはなぜ：**
- `.env` = 環境変数（Environment Variables）を意味する
- `.local` = ローカル環境（自分のPC）で使用するという意味
- これにより、開発環境と本番環境で異なる設定を使い分けられます

---

### 5-5. トラブルシューティング

#### Q1: ファイルが見つからない

**原因：** ファイル名の最初のピリオド（`.`）が見えない、または保存先が間違っている

**解決方法：**
1. エクスプローラーの「表示」→「ファイル名拡張子」と「隠しファイル」にチェックを入れる
2. 保存先がプロジェクトのルートフォルダ（`package.json`がある場所）か確認
3. PowerShellで `Get-ChildItem .env.local` と実行して、ファイルが存在するか確認

#### Q2: ファイル名が `.env.local.txt` になってしまった

**原因：** メモ帳で保存する際に「ファイルの種類」を「すべてのファイル（*.*）」にしなかった

**解決方法：**
1. `.env.local.txt` というファイルを削除
2. もう一度「方法1」の手順で、今度は「ファイルの種類」を「すべてのファイル（*.*）」にして保存

#### Q3: SupabaseのURLやキーがわからない

**解決方法：**
- ステップ2「APIキーとURLの取得」を参照してください
- Supabaseダッシュボード → 「Settings」→「API」で確認できます

#### Q4: ファイルを開いても何も表示されない

**原因：** 保存時に内容が消えてしまった可能性

**解決方法：**
- もう一度内容を入力して保存してください
- 保存する前に、内容が正しく入力されているか確認してください

---

### ✅ 完了の確認

以下の条件を満たしていれば完了です：

1. ✅ `.env.local` ファイルがプロジェクトのルートフォルダに存在する
2. ✅ ファイルの中に2行の設定が書かれている
3. ✅ `NEXT_PUBLIC_SUPABASE_URL=` の後ろにSupabaseのURLがある
4. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY=` の後ろにキーがある

**次のステップ：**
環境変数の設定が完了したら、Supabaseクライアントライブラリをインストールして、アプリを起動してください。

---

## ✅ 次のステップ

環境変数を設定したら、以下の手順を実行：

1. Supabaseクライアントライブラリのインストール
2. Supabaseクライアントの設定
3. APIルートの更新
4. コンポーネントの更新

詳細は、実装ファイルを参照してください。
