# Todoアプリ - 会員登録・ログイン機能付きセットアップガイド（Windows環境）

このガイドでは、**会員登録・ログイン機能付き**のTodoアプリをWindows環境でローカル実行する手順を、初心者の方にも分かりやすく説明します。

---

## 📋 前提条件

このアプリを実行するには、以下のソフトウェアが必要です：

1. **PowerShell** (Windows 10以降は標準でインストールされています)
2. **Node.js** (バージョン 18以上)
3. **npm** (Node.jsと一緒にインストールされます)
4. **Supabaseアカウント** (無料で作成できます)

---

## 🔧 ステップ0: Node.jsのインストール確認

### 0-1. PowerShellを開く

1. Windowsキーを押す
2. 「PowerShell」と入力
3. 「Windows PowerShell」をクリックして開く

### 0-2. Node.jsのバージョンを確認

PowerShellで以下のコマンドを入力してEnterキーを押します：

```powershell
node --version
```

**期待される結果：**
- `v18.x.x` または `v20.x.x` などのバージョン番号が表示される

**もしエラーが出た場合：**
- Node.jsがインストールされていません
- 以下の手順でインストールしてください：

### 0-3. Node.jsをインストールする（必要な場合のみ）

1. ブラウザで以下のURLにアクセス：
   ```
   https://nodejs.org/ja/
   ```
2. 「推奨版」と書かれた緑色のボタン（例：`v20.x.x LTS`）をクリック
3. 「Windowsインストーラー」をダウンロード
4. ダウンロードしたファイルをダブルクリックしてインストール
5. インストールが完了したら、**PowerShellを閉じて再度開く**
6. 再度 `node --version` を実行して確認

---

## 📂 ステップ1: プロジェクトフォルダに移動する

### 1-1. プロジェクトフォルダに移動

PowerShellで以下のコマンドを実行：

```powershell
cd C:\Users\tokam\Downloads\1
```

**確認方法：**
```powershell
pwd
```

`C:\Users\tokam\Downloads\1` と表示されればOKです！

---

## 📦 ステップ2: 必要なパッケージをインストールする

### 2-1. インストールコマンドを実行

プロジェクトフォルダに移動した状態で、以下のコマンドを実行：

```powershell
npm install
```

**期待される結果：**
- たくさんのログが表示されます
- 最後に `added XXX packages` のようなメッセージが表示されます
- エラーが出なければ成功です！

**インストールが完了したか確認する方法：**
- エクスプローラーで `node_modules` フォルダが作成されているか確認
- または、以下のコマンドで確認：
  ```powershell
  Test-Path node_modules
  ```
  `True` と表示されれば成功です！

---

## 🔐 ステップ3: Supabaseアカウントを作成する

### 3-1. Supabaseにアクセス

1. ブラウザを開く
2. 以下のURLにアクセス：
   ```
   https://supabase.com/
   ```
3. 右上の「Start your project」または「サインアップ」をクリック

### 3-2. アカウントを作成

1. **GitHubアカウントでサインアップ（推奨）**
   - 「Continue with GitHub」をクリック
   - GitHubアカウントでログイン
   - 認証を許可

2. **または、メールアドレスでサインアップ**
   - メールアドレスとパスワードを入力
   - 確認メールを確認してアカウントを有効化

### 3-3. 新しいプロジェクトを作成

1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：
   - **Organization**: 既存の組織を選択、または新規作成
   - **Name**: プロジェクト名（例：`todo-app`）
   - **Database Password**: データベースのパスワード（**必ずメモしておいてください！**）
   - **Region**: 最寄りのリージョンを選択（例：`Northeast Asia (Tokyo)`）
3. 「Create new project」をクリック
4. プロジェクトの作成が完了するまで待ちます（1〜2分かかることがあります）

---

## 🗄️ ステップ4: Supabaseデータベースを設定する

### 4-1. SQL Editorを開く

1. Supabaseのダッシュボードで、左側のメニューから「SQL Editor」をクリック
2. 「New query」をクリック

### 4-2. データベーステーブルを作成

SQL Editorに以下のSQLをコピー＆ペーストして実行します：

```sql
-- usersテーブルを作成
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- todosテーブルを作成
CREATE TABLE IF NOT EXISTS public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  category TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- categoriesテーブルを作成
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Row Level Security (RLS) を有効化
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- usersテーブルのRLSポリシー
-- ユーザーは自分の情報のみ閲覧・更新可能
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーを作成：auth.usersにユーザーが作成された時にhandle_new_user関数を実行
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- todosテーブルのRLSポリシー
-- ユーザーは自分のTodoのみ閲覧・作成・更新・削除可能
CREATE POLICY "Users can view own todos" ON public.todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos" ON public.todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON public.todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON public.todos
  FOR DELETE USING (auth.uid() = user_id);

-- categoriesテーブルのRLSポリシー
-- ユーザーは自分のカテゴリのみ閲覧・作成・更新・削除可能
CREATE POLICY "Users can view own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);
```

3. 「Run」ボタンをクリック（または `Ctrl + Enter`）
4. 「Success. No rows returned」と表示されれば成功です！

### 4-3. 認証設定を確認

1. 左側のメニューから「Authentication」→「Settings」をクリック
2. 「Email Auth」が有効になっていることを確認
3. **「Confirm email」を「OFF」にする（重要！）**
   - トグルスイッチを左側（OFF）に設定
   - **開発環境では必ず「OFF」にしてください**
   - これにより、メール確認なしでログインできるようになります
   - 「email rate limit exceeded」エラーを回避できます
   - 本番環境では「ON」にすることを推奨します

**⚠️ 重要：** 「Confirm email」が「ON」のままだと、会員登録時にメール確認が必要になり、「email rate limit exceeded」エラーが発生する可能性があります。

---

## 🔑 ステップ5: Supabaseの認証情報を取得する

### 5-1. API設定を開く

1. Supabaseのダッシュボードで、左側のメニューから「Settings」→「API」をクリック

### 5-2. 認証情報をコピー

以下の2つの情報をコピーしておいてください：

1. **Project URL**
   - 「Project URL」の下に表示されているURL（例：`https://xxxxxxxxxxxxx.supabase.co`）
   - このURLをコピー

2. **anon public key**
   - 「Project API keys」セクションの「anon public」キー
   - 「Reveal」をクリックして表示
   - このキーをコピー

**重要：** これらの情報は後で使用します。安全に保管してください。

---

## 📝 ステップ6: 環境変数を設定する

### 6-1. .env.localファイルを作成

1. プロジェクトフォルダ（`C:\Users\tokam\Downloads\1`）をエクスプローラーで開く
2. 新しいファイルを作成（右クリック → 新規作成 → テキストドキュメント）
3. ファイル名を `.env.local` に変更
   - **注意：** ファイル名の最初に `.`（ドット）が必要です
   - もし「拡張子を変更するとファイルが使えなくなる可能性があります」という警告が出たら、「はい」をクリック

### 6-2. 環境変数を記入

`.env.local` ファイルをメモ帳などで開き、以下の内容を記入します：

```
NEXT_PUBLIC_SUPABASE_URL=ここにProject URLを貼り付け
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon public keyを貼り付け
```

**例：**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE5NTU1NzYwMDB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**重要：**
- `=` の前後にスペースを入れないでください
- 値（URLやキー）を引用符（`"` や `'`）で囲まないでください
- ファイルを保存してください（`Ctrl + S`）

### 6-3. 環境変数が正しく設定されているか確認

**⚠️ 重要：環境変数を変更した後は、必ず開発サーバーを再起動してください！**

1. **開発サーバーを停止**
   - PowerShellで `Ctrl + C` を押してサーバーを停止

2. **開発サーバーを再起動**
   ```powershell
   npm run dev
   ```

3. **環境変数が読み込まれているか確認**
   - ブラウザで `http://localhost:3000` を開く
   - ブラウザの開発者ツール（F12キー）を開く
   - Consoleタブで「Supabase環境変数が設定されていません」という警告が出ていないか確認
   - 警告が出ていない場合は、環境変数が正しく読み込まれています

**もし「Error: supabaseUrl is required」というエラーが出た場合：**
- `.env.local` ファイルが正しい場所（プロジェクトフォルダのルート）にあるか確認
- ファイル名が `.env.local` になっているか確認（`.env.local.txt` などになっていないか）
- 環境変数の値が正しく記入されているか確認
- 開発サーバーを再起動したか確認

---

## 🚀 ステップ7: 開発サーバーを起動する

### 7-1. 開発サーバーを起動

PowerShellで以下のコマンドを実行：

```powershell
npm run dev
```

**期待される結果：**
- 以下のようなメッセージが表示されます：

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

**重要：**
- このコマンドは**実行し続ける必要があります**
- サーバーを停止したい場合は、`Ctrl + C` を押してください

---

## 🌐 ステップ8: ブラウザでアプリを開く

### 8-1. ブラウザを開く

1. お好きなブラウザ（Chrome、Edge、Firefoxなど）を開く
2. アドレスバーに以下を入力してEnterキーを押す：

```
http://localhost:3000
```

### 8-2. アプリが表示されることを確認

以下のような画面が表示されれば成功です：
- 「ログイン」または「会員登録」画面
- メールアドレスとパスワードの入力欄

---

## ✅ 動作確認

### テスト1: 会員登録

1. 「会員登録」画面で以下を入力：
   - メールアドレス（例：`test@example.com`）
   - パスワード（6文字以上、例：`password123`）
   - パスワード（確認）
   - ユーザー名（例：`テストユーザー`）
2. 「会員登録」ボタンをクリック
3. ログイン画面に切り替わり、Todo画面が表示されることを確認

### テスト2: ログアウト

1. 右上の「ログアウト」ボタンをクリック
2. ログイン画面に戻ることを確認

### テスト3: ログイン

1. 登録したメールアドレスとパスワードでログイン
2. Todo画面が表示されることを確認

### テスト4: Todoを追加

1. フォームに「買い物に行く」と入力
2. 「Todoを作成」ボタンをクリック
3. Todoリストに追加されたことを確認

### テスト5: ユーザーごとにTodoが分かれていることを確認

1. ログアウト
2. 別のメールアドレスで新規登録（例：`test2@example.com`）
3. Todoを追加
4. ログアウトして最初のユーザーでログイン
5. 最初のユーザーのTodoのみが表示されることを確認（2人目のユーザーのTodoは表示されない）

---

## 🛑 サーバーを停止する方法

開発サーバーを停止したい場合：

1. PowerShellのウィンドウに戻る
2. `Ctrl + C` キーを押す
3. 確認メッセージが出たら `Y` を押してEnter

---

## 🔧 よくある問題と解決方法

### 問題1: `.env.local` ファイルが作成できない

**原因：** Windowsで `.` で始まるファイル名を作成するのが難しい

**解決方法：**

1. **方法1: PowerShellで作成**
   ```powershell
   New-Item -Path .env.local -ItemType File
   ```
   その後、メモ帳などで開いて編集

2. **方法2: エクスプローラーで作成**
   - エクスプローラーで「表示」タブを開く
   - 「ファイル名拡張子」にチェックを入れる
   - 新規テキストドキュメントを作成
   - ファイル名を `.env.local.` に変更（最後にも `.` を付ける）
   - Enterキーを押すと `.env.local` になります

### 問題2: 環境変数が読み込まれない、または「Error: supabaseUrl is required」エラー

**原因：** `.env.local` ファイルが存在しない、形式が間違っている、またはサーバーを再起動していない

**解決方法：**

#### ステップ1: .env.localファイルの存在確認

1. エクスプローラーでプロジェクトフォルダ（`C:\Users\tokam\Downloads\1`）を開く
2. `.env.local` ファイルが存在するか確認
   - **注意：** `.` で始まるファイルは、エクスプローラーで「隠しファイルを表示」しないと見えない場合があります
   - エクスプローラーの「表示」タブ → 「隠しファイル」にチェックを入れる

#### ステップ2: .env.localファイルの内容確認

`.env.local` ファイルをメモ帳などで開き、以下の点を確認：

1. **ファイルの形式が正しいか確認：**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - `=` の前後にスペースがないか確認
   - 値が引用符（`"` や `'`）で囲まれていないか確認
   - 各行の最後に余分なスペースがないか確認

2. **値が正しく設定されているか確認：**
   - `NEXT_PUBLIC_SUPABASE_URL` の値が `https://` で始まっているか
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` の値が長い文字列になっているか
   - 値が空でないか確認

#### ステップ3: ファイル名の確認

1. ファイル名が正確に `.env.local` になっているか確認
   - ❌ 間違い：`.env.local.txt`、`env.local`、`.env`
   - ✅ 正しい：`.env.local`

2. **ファイル名を確認する方法（PowerShell）：**
   ```powershell
   Get-ChildItem -Force | Where-Object { $_.Name -like ".env*" }
   ```
   このコマンドで `.env.local` ファイルが表示されればOKです

#### ステップ4: サーバーを再起動

**⚠️ 重要：環境変数を変更した後は、必ず開発サーバーを再起動してください！**

1. PowerShellで `Ctrl + C` を押してサーバーを停止
2. 再度 `npm run dev` を実行
3. エラーが出ないか確認

#### ステップ5: 環境変数が正しく読み込まれているか確認

1. ブラウザで `http://localhost:3000` を開く
2. ブラウザの開発者ツール（F12キー）を開く
3. Consoleタブでエラーメッセージを確認
   - 「Supabase環境変数が設定されていません」という警告が出ていないか確認
   - 「Error: supabaseUrl is required」というエラーが出ていないか確認

#### それでも解決しない場合

1. **PowerShellで環境変数を直接確認：**
   ```powershell
   # プロジェクトフォルダで実行
   Get-Content .env.local
   ```
   これで `.env.local` の内容が表示されます。正しく設定されているか確認してください

2. **.env.localファイルを再作成：**
   - 既存の `.env.local` ファイルを削除
   - ステップ6の手順に従って、新しく `.env.local` ファイルを作成
   - サーバーを再起動

### 問題3: 「email rate limit exceeded」エラー

**原因：** Supabaseのメール送信レート制限に達した

**解決方法：**

1. **メール確認を無効にする（開発環境・推奨）**
   - Supabaseのダッシュボードで「Authentication」→「Settings」を開く
   - 「Confirm email」のトグルスイッチを**OFF**にする
   - これにより、メール確認なしで会員登録できるようになります
   - 詳細は `FIX_EMAIL_RATE_LIMIT.md` を参照してください

2. **しばらく待ってから再試行する**
   - 1時間待ってから再度会員登録を試す
   - ただし、開発中に何度も試すと再び制限に達する可能性があります

3. **別のメールアドレスを使用する**
   - 同じメールアドレスで何度も登録を試している場合、別のメールアドレスを使用

**重要：** 開発環境では、必ず「Confirm email」を「OFF」にしてください。

### 問題4: ログインできない、または「Invalid login credentials」エラー

**原因：** メールアドレスまたはパスワードが間違っている、またはアカウントが作成されていない

**解決方法：**

1. メールアドレスとパスワードが正しいか確認
2. 会員登録が完了しているか確認
3. Supabaseのダッシュボードで「Authentication」→「Users」を確認
4. ユーザーが作成されているか確認

### 問題5: Todoが表示されない、または作成できない

**原因：** データベースのテーブルが作成されていない、またはRLSポリシーが正しく設定されていない

**解決方法：**

1. Supabaseのダッシュボードで「Table Editor」を開く
2. `users`、`todos`、`categories` テーブルが存在するか確認
3. 存在しない場合は、ステップ4のSQLを再度実行
4. RLSポリシーが有効になっているか確認：
   - 「Table Editor」で各テーブルを開く
   - 右上の「RLS」が有効になっているか確認

### 問題6: 「接続できません」やエラーが表示される

**原因：** サーバーが起動していない、またはURLが間違っている

**解決方法：**

1. PowerShellで `npm run dev` が実行されているか確認
2. `http://localhost:3000` が正しいか確認（`https://` ではなく `http://`）
3. サーバーを再起動してみる

---

## 📝 次のステップ

アプリが正常に動作することを確認したら：

1. **コードを編集してみる**
   - `components/auth/LoginForm.tsx` を開いて、ボタンのテキストを変更してみる
   - 保存すると自動的にブラウザが更新されます

2. **スタイルを変更してみる**
   - `app/globals.css` を開いて、色やフォントを変更してみる

3. **機能を追加してみる**
   - パスワードリセット機能
   - プロフィール編集機能
   - Todoの並び替え機能

---

## 💡 参考情報

- **Next.js公式ドキュメント（日本語）**: https://nextjs.org/docs
- **React公式ドキュメント（日本語）**: https://ja.react.dev/
- **Supabase公式ドキュメント（日本語）**: https://supabase.com/docs
- **Supabase Authドキュメント**: https://supabase.com/docs/guides/auth

---

## 🎉 おめでとうございます！

これで会員登録・ログイン機能付きのTodoアプリがローカルで実行できるようになりました！

各ユーザーが自分のTodoを管理できるようになっています。スマホやPCのブラウザから `http://localhost:3000` にアクセスすれば、どちらからでも使用できます。

何か問題が発生した場合は、エラーメッセージを確認して、上記の「よくある問題と解決方法」を参考にしてください。
