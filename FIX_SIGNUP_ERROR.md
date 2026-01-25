# 会員登録エラー「ユーザー情報の保存に失敗しました」の解決方法

## エラーの原因

会員登録時に「ユーザー情報の保存に失敗しました」というエラーが表示される原因は、以下のいずれかです：

1. **RLSポリシーの問題**: Row Level Security (RLS) が有効になっているが、新規登録時に`users`テーブルへのINSERT権限がない
2. **データベーストリガーが設定されていない**: `auth.users`にユーザーが作成された時に、自動的に`public.users`に挿入するトリガーが設定されていない
3. **usersテーブルが作成されていない**: データベースのセットアップが完了していない

## 解決方法

### 方法1: データベーストリガーを追加（推奨）

SupabaseのSQL Editorで以下のSQLを実行してください：

```sql
-- 新規登録時にusersテーブルに自動挿入するための関数とトリガー
-- この関数は、auth.usersにユーザーが作成された時に自動的に実行されます
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'ユーザー')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーを作成：auth.usersにユーザーが作成された時にhandle_new_user関数を実行
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**実行手順：**
1. Supabaseのダッシュボードにログイン
2. 左側のメニューから「SQL Editor」をクリック
3. 「New query」をクリック
4. 上記のSQLをコピー＆ペースト
5. 「Run」ボタンをクリック（または `Ctrl + Enter`）
6. 「Success. No rows returned」と表示されれば成功です！

### 方法2: RLSポリシーを追加

もしトリガーを使用しない場合は、以下のRLSポリシーを追加してください：

```sql
-- usersテーブルへのINSERTを許可するポリシー
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

**注意：** この方法では、会員登録時に認証が完了している必要があります。Supabaseの設定によっては、メール確認が必要な場合があります。

### 方法3: データベースのセットアップを確認

もし`users`テーブルが作成されていない場合は、`SETUP_GUIDE_AUTH.md`の「ステップ4: Supabaseデータベースを設定する」を参照して、テーブルを作成してください。

## 確認方法

### 1. トリガーが正しく設定されているか確認

SupabaseのSQL Editorで以下のSQLを実行：

```sql
-- トリガーの一覧を確認
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';
```

`on_auth_user_created` というトリガーが表示されればOKです。

### 2. usersテーブルが存在するか確認

Supabaseのダッシュボードで：
1. 左側のメニューから「Table Editor」をクリック
2. `users`テーブルが表示されるか確認

### 3. RLSが有効になっているか確認

SupabaseのSQL Editorで以下のSQLを実行：

```sql
-- RLSが有効になっているか確認
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'users';
```

`rowsecurity` が `t` (true) になっていればOKです。

## テスト方法

1. ブラウザで `http://localhost:3000` を開く
2. 会員登録を試す
3. エラーが出ないか確認
4. Supabaseのダッシュボードで「Table Editor」→「users」を開き、ユーザーが作成されているか確認

## それでも解決しない場合

1. **ブラウザの開発者ツール（F12）を開く**
   - Consoleタブでエラーメッセージを確認
   - より詳細なエラー情報が表示される場合があります

2. **Supabaseのログを確認**
   - Supabaseのダッシュボードで「Logs」を確認
   - エラーログが表示される場合があります

3. **データベースの接続を確認**
   - `.env.local` ファイルの環境変数が正しく設定されているか確認
   - 開発サーバーを再起動

## 参考

- `SETUP_GUIDE_AUTH.md` の「ステップ4: Supabaseデータベースを設定する」を参照
- Supabase公式ドキュメント: https://supabase.com/docs/guides/auth
