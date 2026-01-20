# 🔧 404エラー解決ガイド

## ❌ エラーの症状

- `Failed to load resource: the server responded with a status of 404 ()`
- Supabaseへの接続が失敗している
- Todoアプリが正常に動作しない

---

## 🔍 原因候補

### 原因1: Vercelの環境変数が設定されていない（最も可能性が高い）

**なぜ起こるのか：**
- 環境変数（`NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_ANON_KEY`）がVercelに設定されていない
- または、設定されているが値が間違っている

**確認方法：**

1. **Vercelのダッシュボードを開く**
   - https://vercel.com/dashboard
   
2. **プロジェクトを選択**

3. **「Settings」タブ → 「Environment Variables」を開く**

4. **以下の2つの環境変数が存在するか確認：**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **値が正しいか確認：**
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://xxxxx.supabase.co` の形式であること
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 長い文字列（`eyJhbGciOi...`で始まる）

**解決方法：**
環境変数が設定されていない、または間違っている場合は、`DEPLOY_SUPABASE.md`の「ステップ2: Vercelで環境変数を設定」を参照して設定してください。

**重要：** 環境変数を設定した後、**再デプロイが必要**です。

---

### 原因2: 環境変数の値に空白や改行が含まれている

**なぜ起こるのか：**
- コピー&ペーストの際に、値の前後に空白や改行が含まれてしまった
- これにより、SupabaseのURLが正しく認識されない

**確認方法：**
1. Vercelのダッシュボード → 「Settings」→ 「Environment Variables」
2. 各環境変数の値をクリックして編集
3. 値の前後に空白や改行がないか確認

**解決方法：**
1. 値の前後の空白を削除
2. 改行があれば削除
3. 値を再設定して保存
4. **再デプロイを実行**

---

### 原因3: SupabaseのURLやキーが間違っている

**なぜ起こるのか：**
- Supabaseダッシュボードから取得したURLやキーが間違っている
- または、プロジェクトが削除されている

**確認方法：**

1. **Supabaseダッシュボードを開く**
   - https://supabase.com/dashboard

2. **プロジェクトを選択**

3. **「Settings」→「API」を開く**

4. **「Project URL」と「anon public」キーを確認**

5. **Vercelの環境変数と比較：**
   - 値が完全に一致しているか確認
   - URLは`https://`で始まる必要がある
   - キーは`eyJhbGciOi...`で始まる長い文字列である必要がある

**解決方法：**
1. Supabaseダッシュボードから正しい値をコピー
2. Vercelの環境変数を更新
3. **再デプロイを実行**

---

### 原因4: Supabaseのプロジェクトが無効になっている

**なぜ起こるのか：**
- Supabaseのプロジェクトが一時停止している
- または、プロジェクトが削除されている

**確認方法：**
1. Supabaseダッシュボードでプロジェクトを開く
2. プロジェクトが正常に動作しているか確認
3. 「Table Editor」でテーブルが表示されるか確認

**解決方法：**
- プロジェクトが一時停止している場合は、再開する
- プロジェクトが削除されている場合は、新しいプロジェクトを作成する

---

## ✅ 解決手順（ステップバイステップ）

### ステップ1: ブラウザでエラーの詳細を確認

1. **デプロイしたサイトを開く**

2. **開発者ツールを開く**（`F12`キー）

3. **「Network」タブを開く**

4. **ページをリロード**（`F5`キー）

5. **404エラーが出ているリクエストを確認：**
   - どのURLにリクエストが送られているか確認
   - 例：`https://xxxxx.supabase.co/rest/v1/users` のようなURL

6. **リクエストのURLを確認：**
   - 正しいSupabaseのURLになっているか
   - 間違ったURLになっている場合は、環境変数が正しく設定されていない可能性が高い

---

### ステップ2: Vercelの環境変数を確認

1. **Vercelのダッシュボードを開く**
   - https://vercel.com/dashboard

2. **プロジェクトを選択**

3. **「Settings」タブをクリック**

4. **左側のメニューから「Environment Variables」をクリック**

5. **以下の2つの環境変数が存在するか確認：**
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

6. **各環境変数の値を確認：**
   - 値の前後に空白がないか
   - 値が正しいか（Supabaseダッシュボードの値と一致しているか）

---

### ステップ3: 環境変数を設定または修正

**環境変数が存在しない、または間違っている場合：**

1. **Supabaseダッシュボードを開く**
   - https://supabase.com/dashboard
   
2. **プロジェクトを選択**

3. **「Settings」→「API」を開く**

4. **「Project URL」の値をコピー**
   - 例：`https://abcdefghijklmnop.supabase.co`

5. **「anon public」キーの値をコピー**
   - 例：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

6. **Vercelのダッシュボードに戻る**

7. **環境変数を設定：**

   **`NEXT_PUBLIC_SUPABASE_URL`の設定：**
   1. 「Add New」ボタンをクリック
   2. **Key**: `NEXT_PUBLIC_SUPABASE_URL` と入力
   3. **Value**: コピーしたProject URLを貼り付け
     - ⚠️ **注意**: 値の前後に空白がないことを確認
   4. **Environment**: すべてにチェック（Production、Preview、Development）
   5. 「Save」をクリック

   **`NEXT_PUBLIC_SUPABASE_ANON_KEY`の設定：**
   1. もう一度「Add New」ボタンをクリック
   2. **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` と入力
   3. **Value**: コピーしたanon publicキーを貼り付け
     - ⚠️ **注意**: 値の前後に空白がないことを確認
     - ⚠️ **注意**: 改行がないことを確認
   4. **Environment**: すべてにチェック
   5. 「Save」をクリック

---

### ステップ4: 再デプロイを実行

**環境変数を設定または修正した後、必ず再デプロイが必要です：**

1. **Vercelのダッシュボードでプロジェクトを開く**

2. **「Deployments」タブをクリック**

3. **右上の「Redeploy」ボタンをクリック**

4. **「Redeploy」を確認**

5. **デプロイが完了するまで待つ**（2〜5分程度）

6. **完了後、サイトを再度確認**

---

### ステップ5: 動作確認

1. **デプロイしたサイトを開く**

2. **シークレットウィンドウ（プライベートブラウジング）で開く**
   - これにより、`localStorage`が空の状態で確認できます

3. **名前入力画面が表示されることを確認**

4. **名前を入力して「開始」ボタンをクリック**

5. **Todo画面が表示されることを確認**

6. **開発者ツール（F12）の「Console」タブを開く**

7. **エラーが表示されていないことを確認**

8. **「Network」タブを開く**

9. **Supabaseへのリクエストが成功しているか確認：**
   - `supabase.co`へのリクエストが200（成功）になっているか確認
   - 404エラーが出ていないか確認

---

## 🔍 デバッグ方法（上級者向け）

### 方法1: コンソールで環境変数を確認

**注意：** これは開発環境でのみ使用可能です。本番環境ではセキュリティのため、環境変数は表示されません。

ブラウザのコンソール（F12 → Console）で以下を実行：

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定されています' : '設定されていません');
```

**結果の見方：**
- `undefined`と表示される → 環境変数が設定されていない
- URLが表示される → 環境変数が設定されている（ただし、本番環境では`undefined`になることがあります）

### 方法2: Supabaseクライアントの初期化を確認

`lib/supabase/client.ts`にデバッグログを追加：

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// デバッグ用（本番環境では削除してください）
if (typeof window !== 'undefined') {
  console.log('🔍 [DEBUG] Supabase URL:', supabaseUrl ? '設定されています' : '設定されていません');
  console.log('🔍 [DEBUG] Supabase Key:', supabaseAnonKey ? '設定されています' : '設定されていません');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [ERROR] Supabase環境変数が設定されていません');
  console.error('URL:', supabaseUrl || '未設定');
  console.error('Key:', supabaseAnonKey ? '設定されています' : '未設定');
}
```

---

## ✅ 確認チェックリスト

問題を解決するために、以下を確認してください：

- [ ] **Vercelの環境変数が設定されている**
  - `NEXT_PUBLIC_SUPABASE_URL` が存在する
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` が存在する

- [ ] **環境変数の値が正しい**
  - Supabaseダッシュボードの値と一致している
  - 値の前後に空白がない
  - 改行が含まれていない

- [ ] **環境変数を設定後、再デプロイを実行した**

- [ ] **Supabaseのプロジェクトが正常に動作している**
  - プロジェクトが一時停止していない
  - テーブルが存在する

- [ ] **ブラウザのコンソールでエラーを確認した**
  - 404エラーが出ていない
  - Supabaseへのリクエストが成功している

---

## 🎯 最も可能性が高い原因

**Vercelの環境変数が設定されていない、または再デプロイが実行されていない**

**解決方法：**
1. Vercelのダッシュボードで環境変数を設定（`DEPLOY_SUPABASE.md`のステップ2を参照）
2. **環境変数を設定した後、必ず再デプロイを実行**
3. デプロイ完了後、サイトを再度確認

---

## 📞 追加のヘルプが必要な場合

問題が解決しない場合は、以下を確認してください：

1. **Vercelのデプロイログ**
   - Vercelのダッシュボード → 「Deployments」→ 失敗したデプロイをクリック → ログを確認

2. **ブラウザのコンソールエラー**
   - 開発者ツール（F12）→ 「Console」タブ → エラーメッセージを確認

3. **Supabaseダッシュボードのログ**
   - Supabaseダッシュボード → 「Logs」→ エラーを確認

これらの情報があれば、より具体的な解決策を提案できます。
