# 📝 SQL実行ガイド（初心者向け）

## 🎯 このガイドの目的

Supabaseでデータベースのテーブルを作成するために、SQLという「データベースを操作するための命令文」を実行します。

**簡単に言うと：**
- SQL = データベースに「テーブル（表）を作って！」と命令する文章
- 例：Excelで表を作るようなイメージです

---

## 📍 ステップ1: Supabaseダッシュボードにログイン

1. ブラウザで [https://supabase.com/](https://supabase.com/) を開く
2. 右上の「Sign In」をクリックしてログイン
3. 作成したプロジェクトを選択（例：「todo-app」）

**画面の確認：**
- 左側にメニューが並んでいる画面が表示されればOK

---

## 📍 ステップ2: SQL Editorを開く

### 2-1. メニューから「SQL Editor」をクリック

1. **左側のメニュー**（縦に並んでいるボタン群）を見る
2. **「SQL Editor」** というボタンを探す
   - 通常は「Database」の下にある
   - アイコンは「</>」または「SQL」のようなマーク
3. **「SQL Editor」をクリック**

**画面の確認：**
- 大きなテキスト入力欄がある画面に切り替わればOK
- 上に「New query」というボタンが見えているはず

### 2-2. 「New query」をクリック

1. 画面上部に **「New query」** というボタンがある
2. このボタンを **クリック**
3. 新しいSQL入力欄が表示される

**画面の確認：**
- 大きな白いテキスト入力欄（コードエディタ）が表示されればOK

---

## 📍 ステップ3: SQLコードをコピー＆ペーストする

### 3-1. SQLコードの全体をコピーする

ここでは「ユーザーテーブルを作成するSQL」を例に説明します。

**コピーするコード（すべてコピーしてください）：**

```
-- ユーザーテーブル（名前=ログインID）
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを追加（検索を高速化）
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
```

**コピー方法：**
1. 上記のコード部分を **マウスでドラッグして選択**（全部選択）
   - 最初の `--` から最後の `);` まで
2. **右クリック** → **「コピー」**を選択
   - または **`Ctrl + C`** キーを押す

**💡 コピーのコツ：**
- `--` で始まる行（灰色の部分）も含めてコピーしてください
- 一番上の行から一番下の行まで、すべて選択してください

---

### 3-2. SupabaseのSQL Editorに貼り付ける

1. **SQL Editorの白いテキスト入力欄**をクリックして選択
   - カーソル（縦線）が点滅している状態にする
2. **右クリック** → **「貼り付け」**を選択
   - または **`Ctrl + V`** キーを押す
3. SQLコードが入力欄に表示される

**画面の確認：**
- 白い入力欄に、コピーしたSQLコードが表示されればOK
- 色がついて表示される場合もあります（これは正常です）

**⚠️ 注意：**
- もし入力欄に何か文字が残っていたら、**すべて消去**（`Ctrl + A` → `Delete`）してから貼り付けてください

---

## 📍 ステップ4: 「Run」ボタンをクリックして実行

### 4-1. Runボタンの場所を確認

SQL Editorの画面で、以下の場所を探してください：

1. **右下** に **「Run」** という緑色のボタンがある
   - または **「▶ Run」** というアイコン付きボタン
2. キーボードショートカット **`Ctrl + Enter`** でも実行できます

**画面の確認：**
- 入力欄の右下あたりに、緑色または青色のボタンが見えていればOK

### 4-2. Runボタンをクリック

1. **「Run」ボタンをクリック**
   - またはキーボードで **`Ctrl + Enter`** を押す
2. 少し待つ（1〜2秒）

**画面の確認：**
- ボタンをクリックすると、ボタンが少し無効化されたように見える場合があります
- これは実行中です（正常です）

---

## 📍 ステップ5: 実行結果を確認する

### 5-1. 成功した場合

**表示されるメッセージ：**
- **「Success. No rows returned」** または **「成功」**
- 画面下部に緑色または青色のメッセージが表示されます

**これが表示されれば：**
- ✅ テーブルが正常に作成されました！
- 次のSQL（Todoテーブル）に進んでOKです

### 5-2. エラーが表示された場合

**エラーメッセージの例：**
- 「Error: ...」
- 「syntax error...」
- 赤色のメッセージ

**対処方法：**
1. **エラーメッセージをよく読む**
   - 何が間違っているか書いてあります
2. **よくあるミス：**
   - SQLコードを全部コピーしていない
   - 一部だけコピーしてしまった
   - 貼り付ける前に古い文字が残っていた
3. **解決策：**
   - SQL Editorの入力欄を **すべて消去**（`Ctrl + A` → `Delete`）
   - もう一度、**最初から最後まで全部**コピー＆ペースト
   - 再度「Run」ボタンをクリック

---

## 📍 ステップ6: すべてのSQLを順番に実行する

同じ手順で、以下のSQLを **1つずつ順番に**実行してください：

### 6-1. ユーザーテーブル（1回目）

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

**実行手順：**
1. 「New query」をクリック（新しいタブが開く）
2. 上記のSQLを全部コピー＆ペースト
3. 「Run」ボタンをクリック
4. 「Success」と表示されることを確認

---

### 6-2. Todoテーブル（2回目）

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

**実行手順：**
1. **新しいタブ**を開く（「New query」をクリック）
2. 上記のSQLを全部コピー＆ペースト
3. 「Run」ボタンをクリック
4. 「Success」と表示されることを確認

---

### 6-3. カテゴリテーブル（3回目）

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

**実行手順：**
1. **新しいタブ**を開く（「New query」をクリック）
2. 上記のSQLを全部コピー＆ペースト
3. 「Run」ボタンをクリック
4. 「Success」と表示されることを確認

---

### 6-4. 認証ポリシー（4回目）

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

**実行手順：**
1. **新しいタブ**を開く（「New query」をクリック）
2. 上記のSQLを全部コピー＆ペースト
3. 「Run」ボタンをクリック
4. 「Success」と表示されることを確認

**⚠️ エラーが出た場合：**
もし「policy already exists」というエラーが出た場合は、上記のSQL（`DROP POLICY IF EXISTS`を含む）を実行してください。
これは既存のポリシーを削除してから再作成するため、エラーが発生しません。

---

## 📍 ステップ7: テーブルが作成されたか確認する

### 7-1. Table Editorを開く

1. 左側のメニューから **「Table Editor」**をクリック
   - または **「Database」** → **「Tables」**をクリック

### 7-2. テーブル一覧を確認

以下のテーブルが表示されていれば成功です：

- ✅ **users** （ユーザーテーブル）
- ✅ **todos** （Todoテーブル）
- ✅ **categories** （カテゴリテーブル）

**画面の確認：**
- 左側にテーブル名の一覧が表示されます
- それぞれをクリックすると、テーブルの内容（今は空）が表示されます

---

## 🔍 よくある質問（FAQ）

### Q1: SQLコードを全部コピーし忘れたら？

**A:** 入力欄を全部消去（`Ctrl + A` → `Delete`）して、もう一度全部コピー＆ペーストしてください。

---

### Q2: 「Run」ボタンが見つからない

**A:** 画面を下にスクロールしてみてください。または、キーボードで **`Ctrl + Enter`** を押してください。

---

### Q3: エラーメッセージが出た

**A:** 
1. エラーメッセージを読んで、何が間違っているか確認
2. SQLコードを全部コピーし直す
3. もう一度実行

よくある原因：
- SQLコードが途中で切れている
- 古いコードが残っている

---

### Q4: 「New query」を何度もクリックしていいの？

**A:** はい、大丈夫です。各SQLは別々のタブで実行するか、1つのタブで順番に実行できます。

**おすすめ：**
- 各SQLごとに「New query」で新しいタブを開く方法が分かりやすいです

---

### Q5: 同じSQLを2回実行しても大丈夫？

**A:** 
- テーブル作成のSQLは大丈夫です。`IF NOT EXISTS`という命令が入っているので、既に存在する場合は何もしません。
- ただし、認証ポリシー（CREATE POLICY）のSQLは、既に存在する場合にエラーが出ることがあります。
  - その場合は、`DROP POLICY IF EXISTS`を含むSQL（6-4の最新版）を実行してください。

### Q6: 「policy already exists」というエラーが出た

**A:** 
これは認証ポリシーが既に存在するために出るエラーです。以下のSQL（`DROP POLICY IF EXISTS`を含む）を実行すれば解決します：

```sql
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

このSQLは既存のポリシーを削除してから再作成するため、エラーが発生しません。

---

## ✅ 完了の確認

すべてのSQLを実行して、Table Editorに以下の3つのテーブルが表示されていれば完了です：

- ✅ `users`
- ✅ `todos`
- ✅ `categories`

**次は環境変数の設定に進んでください！**

詳しくは `SUPABASE_SETUP.md` の「ステップ5: 環境変数の設定」を参照してください。
