# 🔍 名前入力画面が表示されない問題のトラブルシューティング

## 📋 問題の概要

デプロイ後のTodoアプリで、名前入力画面が表示されず、Todo一覧画面が直接表示される（または真っ白になる）問題。

---

## 🔍 原因候補

### 原因1: Supabase接続エラー（最も可能性が高い）

**なぜ発生するか：**
- Vercelの環境変数が正しく設定されていない
- Supabaseへの接続に失敗している
- `getTodos()`が失敗してエラーが発生し、画面が表示されない

**確認方法：**
1. ブラウザの開発者ツール（F12キー）を開く
2. 「Console」タブを確認
3. エラーメッセージを確認
   - `Supabase環境変数が設定されていません` と表示されていれば環境変数の問題
   - `Failed to fetch` や `Network error` が表示されていれば接続エラー

### 原因2: エラーハンドリングの不備

**なぜ発生するか：**
- `getTodos()`が失敗した時にエラーが発生
- エラーが適切に処理されず、画面が表示されない
- `isLoading`が永遠に`true`のままになる可能性

### 原因3: ハイドレーションエラー

**なぜ発生するか：**
- サーバーサイドとクライアントサイドでレンダリング結果が異なる
- `localStorage`はクライアントサイドでのみ利用可能のため、SSR時に問題が発生

### 原因4: ブラウザのキャッシュ

**なぜ発生するか：**
- 以前のバージョンのアプリがキャッシュされている
- 古いコードが実行されている

---

## ✅ 確認すべきポイントのチェックリスト

### チェック1: 環境変数の設定

- [ ] Vercelのダッシュボードで環境変数を確認
  - 「Settings」→「Environment Variables」を開く
  - `NEXT_PUBLIC_SUPABASE_URL` が設定されているか確認
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` が設定されているか確認
  - 両方の値が正しいか確認（Supabaseダッシュボードと一致しているか）

### チェック2: ブラウザのコンソールエラー

- [ ] ブラウザの開発者ツール（F12キー）を開く
- [ ] 「Console」タブを確認
- [ ] エラーメッセージがあるか確認
  - あれば、エラーメッセージをメモ

### チェック3: ネットワークエラー

- [ ] ブラウザの開発者ツール（F12キー）を開く
- [ ] 「Network」タブを確認
- [ ] リクエストが失敗しているか確認
  - 赤色のリクエストがないか確認
  - `api/todos` へのリクエストがあるか確認

### チェック4: デプロイログ

- [ ] Vercelのダッシュボードでデプロイログを確認
- [ ] ビルドエラーがないか確認
- [ ] ランタイムエラーがないか確認

### チェック5: ブラウザのキャッシュ

- [ ] ブラウザのキャッシュをクリア
  - `Ctrl + Shift + Delete` でキャッシュをクリア
  - または、シークレットモード（プライベートモード）で確認

---

## 🛠️ 修正方法

### 修正1: エラーハンドリングの改善

`app/page.tsx`を修正して、エラー時にも適切に処理するようにします：

```typescript
'use client';

import { useState, useEffect } from 'react';
import { TodoApp } from "@/features/todo/components/TodoApp";
import { NameInput } from "@/components/auth/NameInput";
import { Todo } from "@/lib/types/todo";
import { getTodos } from "@/lib/actions/todo-actions";
import { getUserName, hasUserName, saveUserName } from "@/lib/utils/user-storage";

export default function Page() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialTodos, setInitialTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // エラー状態を追加

  useEffect(() => {
    // ページ読み込み時に名前を確認
    const loadUser = async (): Promise<void> => {
      try {
        if (hasUserName()) {
          const name = getUserName();
          if (name) {
            setUserName(name);
            // Todoデータを取得
            setIsLoadingTodos(true);
            setError(null); // エラーをリセット
            const result = await getTodos(name);
            if (result.success && result.data) {
              setInitialTodos(result.data);
            } else {
              // Todoの取得に失敗した場合でも、名前入力画面は表示しない
              // （既にログイン済みのため）
              console.error('Todo取得エラー:', result.error);
              setInitialTodos([]); // 空の配列を設定
            }
            setIsLoadingTodos(false);
          }
        }
      } catch (err) {
        // 予期しないエラーが発生した場合
        console.error('ユーザー読み込みエラー:', err);
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
        // エラーが発生しても、名前入力画面を表示できるようにする
        if (hasUserName()) {
          const name = getUserName();
          if (name) {
            setUserName(name);
            setInitialTodos([]);
          }
        }
      } finally {
        setIsLoading(false);
        setIsLoadingTodos(false);
      }
    };
    void loadUser();
  }, []);

  const handleStart = async (name: string): Promise<void> => {
    try {
      // 名前を保存
      saveUserName(name);
      setUserName(name);
      setError(null); // エラーをリセット
      // Todoデータを取得
      setIsLoadingTodos(true);
      const result = await getTodos(name);
      if (result.success && result.data) {
        setInitialTodos(result.data);
      } else {
        console.error('Todo取得エラー:', result.error);
        setError(result.error || 'Todoの取得に失敗しました');
        setInitialTodos([]); // 空の配列を設定
      }
    } catch (err) {
      console.error('Todo取得エラー:', err);
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setInitialTodos([]);
    } finally {
      setIsLoadingTodos(false);
    }
  };

  // ローディング中は何も表示しない（またはローディング表示）
  if (isLoading) {
    return (
      <main 
        className="w-full max-w-7xl mx-auto p-4 md:p-6"
        style={{ 
          backgroundColor: 'var(--bg-main)',
          minHeight: '100vh'
        }}
      >
        <div className="text-center py-20">
          <p style={{ color: '#666666' }}>読み込み中...</p>
        </div>
      </main>
    );
  }

  // 名前が入力されていない場合は名前入力画面を表示
  if (!userName) {
    return (
      <main 
        className="w-full max-w-7xl mx-auto p-4 md:p-6 flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--bg-main)',
          minHeight: '100vh'
        }}
      >
        <div
          className="w-full rounded-xl shadow-lg p-8 md:p-12"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            maxWidth: '600px'
          }}
        >
          <NameInput onStart={handleStart} />
        </div>
      </main>
    );
  }

  // 名前が入力されている場合はTodo画面を表示
  return (
    <main 
      className="w-full max-w-7xl mx-auto p-4 md:p-6"
      style={{ 
        backgroundColor: 'var(--bg-main)',
        minHeight: '100vh'
      }}
    >
      <div
        className="w-full rounded-xl shadow-lg p-4 md:p-6"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)'
        }}
      >
        {error && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ {error}（Todoの読み込みに失敗しましたが、新規作成は可能です）
            </p>
          </div>
        )}
        <TodoApp initialTodos={initialTodos} userName={userName} />
      </div>
    </main>
  );
}
```

### 修正2: Supabaseクライアントのエラーチェック強化

`lib/supabase/client.ts`を修正して、環境変数が設定されていない場合のエラーを明確にします：

```typescript
/**
 * Supabaseクライアントの設定
 * クライアント側（ブラウザ）で使用
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase環境変数が設定されていません。');
    console.error('Vercelのダッシュボードで以下を設定してください：');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

/**
 * Supabaseクライアントインスタンス
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

---

## 🚀 修正を適用する手順

### ステップ1: 修正を適用

1. `app/page.tsx`を上記の修正版に置き換える
2. `lib/supabase/client.ts`を上記の修正版に置き換える

### ステップ2: ローカルで確認

```powershell
npm run dev
```

- ブラウザで `http://localhost:3000` を開く
- 名前入力画面が表示されるか確認
- 名前を入力して、正常に動作するか確認

### ステップ3: GitHubにプッシュ

```powershell
git add .
git commit -m "Fix: Improve error handling for login screen display"
git push
```

### ステップ4: Vercelで再デプロイ

1. Vercelが自動的に再デプロイを開始
2. デプロイが完了したら、公開サイトを確認

---

## 🔍 デバッグのヒント

### ブラウザのコンソールで確認

1. **ブラウザの開発者ツール（F12キー）を開く**
2. **「Console」タブを確認**
3. **以下のメッセージを探す：**
   - `Supabase環境変数が設定されていません` → 環境変数の問題
   - `ユーザー読み込みエラー:` → 予期しないエラー
   - `Todo取得エラー:` → Todo取得のエラー

### ネットワークタブで確認

1. **「Network」タブを確認**
2. **リクエストを確認：**
   - `api/todos` へのリクエストがあるか
   - リクエストが成功しているか（200 OK）
   - リクエストが失敗しているか（エラーコード）

---

## 💡 よくある問題と解決方法

### Q1: 環境変数が設定されているのに、エラーが出る

**A:** 環境変数を設定した後、**再デプロイが必要**です。
1. Vercelのダッシュボードで「Redeploy」をクリック
2. または、`git push`で新しいコミットをプッシュ

### Q2: 名前入力画面が表示されない

**A:** ブラウザのキャッシュをクリアしてください。
- `Ctrl + Shift + Delete` でキャッシュをクリア
- または、シークレットモードで確認

### Q3: Todoが表示されない

**A:** Supabaseのデータベーステーブルが正しく作成されているか確認してください。
1. Supabaseダッシュボード → 「Table Editor」
2. `users`、`todos`、`categories`のテーブルが存在するか確認

---

## ✅ 完了の確認

以下のすべてが確認できれば完了です：

1. ✅ 名前入力画面が表示される
2. ✅ 名前を入力して「開始」をクリックできる
3. ✅ Todo画面に切り替わる
4. ✅ Todoを作成できる
5. ✅ ページをリロードしても、名前が保存されている
