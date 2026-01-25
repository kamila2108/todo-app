# Supabaseで「Confirm email」設定を見つける方法

## 問題

Supabaseのダッシュボードで「Confirm email」の設定が見つからない場合の対処法です。

## 解決方法

### 方法1: 「Authentication」→「Providers」から設定

1. Supabaseのダッシュボードにログイン
2. 左側のメニューから「**Authentication**」をクリック
3. 上部のタブから「**Providers**」をクリック
4. 「**Email**」プロバイダーを探す
5. 「Email」の行をクリック（または右側の設定アイコンをクリック）
6. 開いた設定画面で「**Enable email confirmations**」または「**Confirm email**」を探す
7. トグルスイッチを**OFF**にする
8. 「**Save**」ボタンをクリック

### 方法2: 「Authentication」→「Settings」から設定

1. Supabaseのダッシュボードにログイン
2. 左側のメニューから「**Authentication**」をクリック
3. 上部のタブから「**Settings**」をクリック
4. ページをスクロールして「**Email Auth**」セクションを探す
5. 「**Enable email confirmations**」または「**Confirm email**」を探す
6. トグルスイッチを**OFF**にする
7. 設定を保存

### 方法3: 検索機能を使用

1. Supabaseのダッシュボードで「Authentication」を開く
2. ページ内で `Ctrl + F`（Windows）または `Cmd + F`（Mac）を押す
3. 「confirm」または「email confirmation」と検索
4. 該当する設定を探す

### 方法4: すべてのタブを確認

「Authentication」配下のすべてのタブを確認：

- **Providers** - 認証プロバイダーの設定
- **Settings** - 認証の全般的な設定
- **Policies** - セキュリティポリシー
- **URL Configuration** - URL設定
- **Email Templates** - メールテンプレート

各タブを順番に確認して、メール確認に関する設定を探してください。

### 方法5: 直接URLでアクセス

以下のURLパターンで直接アクセスできる場合があります：

```
https://app.supabase.com/project/[プロジェクトID]/auth/providers
```

または

```
https://app.supabase.com/project/[プロジェクトID]/auth/settings
```

`[プロジェクトID]` の部分を、実際のプロジェクトIDに置き換えてください。

## 設定が見つからない場合の代替方法

### 方法A: メール確認をスキップするコード側の対応

もし設定が見つからない場合、コード側でメール確認をスキップすることもできますが、これは推奨されません。Supabaseの設定を変更する方が安全です。

### 方法B: Supabaseサポートに問い合わせ

1. Supabaseのダッシュボードで「Help」または「Support」を探す
2. サポートに問い合わせて、最新のUIでの設定方法を確認

### 方法C: Supabaseのドキュメントを確認

最新のドキュメントを確認：
- https://supabase.com/docs/guides/auth/auth-email
- https://supabase.com/docs/reference/javascript/auth-signup

## 確認方法

設定を変更した後、以下の方法で確認できます：

1. **会員登録を試す**
   - ブラウザで `http://localhost:3000` を開く
   - 会員登録を試す
   - 「email rate limit exceeded」エラーが出ないことを確認

2. **Supabaseのログを確認**
   - 「Authentication」→「Logs」を開く
   - メール送信のログが表示されないことを確認

## 参考

- Supabase公式ドキュメント: https://supabase.com/docs/guides/auth
- Supabase GitHub Issues: https://github.com/supabase/supabase/issues
