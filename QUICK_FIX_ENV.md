# 環境変数エラーの解決方法

## 問題
`Error: supabaseUrl is required` エラーが発生している

## 解決手順

### 1. プロジェクトフォルダに移動

PowerShellで以下のコマンドを実行：

```powershell
cd C:\Users\tokam\Downloads\1
```

### 2. .env.localファイルの存在確認

```powershell
Test-Path .env.local
```

- `True` と表示されれば、ファイルが存在します（ステップ3へ）
- `False` と表示されれば、ファイルが存在しません（ステップ2-1へ）

### 2-1. .env.localファイルを作成（存在しない場合）

```powershell
New-Item -Path .env.local -ItemType File
```

### 3. .env.localファイルを編集

メモ帳などで `.env.local` ファイルを開き、以下の内容を記入：

```
NEXT_PUBLIC_SUPABASE_URL=ここにSupabaseのProject URLを貼り付け
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにSupabaseのanon public keyを貼り付け
```

**重要：**
- `=` の前後にスペースを入れない
- 値（URLやキー）を引用符で囲まない
- ファイルを保存（`Ctrl + S`）

### 4. 内容の確認

```powershell
Get-Content .env.local
```

正しく設定されていれば、2行の環境変数が表示されます。

### 5. 開発サーバーを再起動

**⚠️ 重要：環境変数を変更した後は、必ず開発サーバーを再起動してください！**

1. 開発サーバーを停止：`Ctrl + C`
2. 再起動：
   ```powershell
   npm run dev
   ```

## Supabaseの認証情報を取得する方法

1. Supabaseのダッシュボードにログイン
2. 左側のメニューから「Settings」→「API」をクリック
3. 以下の2つをコピー：
   - **Project URL**（例：`https://xxxxxxxxxxxxx.supabase.co`）
   - **anon public key**（「Reveal」をクリックして表示）

詳細は `SETUP_GUIDE_AUTH.md` の「ステップ5: Supabaseの認証情報を取得する」を参照してください。
