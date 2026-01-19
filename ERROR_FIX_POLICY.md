# 🔧 エラー修正: "policy already exists"

## ❌ エラーメッセージ

```
Error: Failed to run sql query: ERROR: 42710: policy "Allow all operations on users" for table "users" already exists
```

## 🎯 エラーの原因

このエラーは、認証ポリシー（`CREATE POLICY`）を実行しようとしたが、**既に同じ名前のポリシーが存在している**ために発生します。

**よくある原因：**
- 同じSQLを2回実行してしまった
- 以前にSQLを実行してポリシーが既に作成されている

## ✅ 解決方法

以下のSQLを実行してください。既存のポリシーを削除してから再作成するため、エラーが発生しません。

### 修正版SQL（エラーが出た場合に使用）

Supabaseの「SQL Editor」で以下を実行：

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

## 📋 実行手順

1. **Supabaseダッシュボード**を開く
2. **「SQL Editor」**をクリック
3. **「New query」**をクリック
4. **上記のSQLを全部コピー＆ペースト**
5. **「Run」ボタン**をクリック
6. **「Success」**と表示されれば成功

## 💡 説明

- `DROP POLICY IF EXISTS` = 既存のポリシーがあれば削除する（なければ何もしない）
- `CREATE POLICY` = 新しいポリシーを作成する

この順序で実行することで：
- 既にポリシーが存在する場合 → 削除してから再作成（エラーなし）
- ポリシーが存在しない場合 → 削除は何もしない → 新規作成（エラーなし）

どちらの場合でもエラーが発生しません。

## ✅ 完了の確認

「Success」と表示されれば完了です。次は環境変数の設定に進んでください。
