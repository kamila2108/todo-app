# 🔍 名前入力画面が表示されない問題のトラブルシューティング

## ❌ 問題の症状

- デプロイしたTodoアプリにアクセスすると、名前入力画面が表示されない
- Todo一覧画面がいきなり表示される
- 本来は初回アクセス時に名前入力画面が表示されるはず

---

## 🔍 原因候補と確認ポイント

### 原因1: ブラウザのlocalStorageに既に名前が保存されている（最も可能性が高い）

**なぜ起こるのか：**
- ローカルで開発中に名前を入力した場合、ブラウザの`localStorage`に保存されます
- デプロイ先のサイトでも、**同じブラウザ**でアクセスすると、保存された名前が読み込まれます
- その結果、名前入力画面をスキップしてTodo画面が表示されます

**確認方法：**
1. **ブラウザの開発者ツールを開く**
   - Windows: `F12`キーまたは`Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`
2. **「Application」タブ（Chrome/Edge）または「Storage」タブ（Firefox）をクリック**
3. **左側のメニューから「Local Storage」→ サイトのURLをクリック**
   - 例：`https://your-project.vercel.app`
4. **`todo-app-user-name`というキーが存在するか確認**
   - 存在していれば、値（名前）が表示されます

**解決方法：**
- **方法1: localStorageをクリアする（推奨）**
  1. 開発者ツールの「Application」タブを開く
  2. 「Local Storage」→ サイトのURLをクリック
  3. `todo-app-user-name`を右クリック → 「Delete」をクリック
  4. ページをリロード（`F5`キー）
  
- **方法2: シークレットウィンドウ（プライベートブラウジング）で確認**
  - 新しいシークレットウィンドウで開く
  - `localStorage`が空の状態なので、名前入力画面が表示されます

---

### 原因2: `getTodos`が失敗している（Supabase接続エラー・404エラー）

**なぜ起こるのか：**
- Supabaseの環境変数が正しく設定されていない（最も可能性が高い）
- または、Supabaseデータベースへの接続に失敗している
- しかし、`localStorage`に名前が保存されているため、Todo画面が表示される

**症状：**
- `Failed to load resource: the server responded with a status of 404 ()`というエラーが表示される
- Supabaseへのリクエストが失敗している

**確認方法：**
1. **ブラウザの開発者ツールを開く**（`F12`キー）
2. **「Console」タブを開く**
3. **エラーメッセージがないか確認**
   - `404`エラーが表示されている場合は、環境変数の問題
   - 赤色のエラーメッセージがある場合は、エラー内容を確認
4. **「Network」タブを開く**
   - `supabase.co`へのリクエストが404エラーになっていないか確認

**解決方法：**
- **詳細は`FIX_404_ERROR.md`を参照してください**
- Vercelの環境変数が正しく設定されているか確認（`DEPLOY_SUPABASE.md`のステップ2を参照）
- 環境変数を設定した後、**必ず再デプロイを実行**
- Supabaseダッシュボードでデータベースが正常に動作しているか確認

---

### 原因3: コードのバグ（型エラーやロジックエラー）

**なぜ起こるのか：**
- `app/page.tsx`の条件分岐が正しく動作していない可能性
- または、Reactのレンダリングタイミングの問題

**確認方法：**
1. **ブラウザの開発者ツールを開く**（`F12`キー）
2. **「Console」タブを開く**
3. **以下のコードを実行して、localStorageの値を確認：**
   ```javascript
   localStorage.getItem('todo-app-user-name')
   ```
   - `null`が返されれば、名前は保存されていない
   - 文字列が返されれば、名前が保存されている

---

## ✅ 確認チェックリスト

デプロイしたサイトで、以下を確認してください：

### チェック1: シークレットウィンドウで確認

- [ ] **新しいシークレットウィンドウ（プライベートブラウジング）でサイトを開く**
  - Chrome/Edge: `Ctrl + Shift + N`
  - Firefox: `Ctrl + Shift + P`
- [ ] **名前入力画面が表示されるか確認**
  - ✅ 表示される → 問題なし（通常のブラウザで`localStorage`に名前が保存されているだけ）
  - ❌ 表示されない → コードの問題の可能性

### チェック2: localStorageを確認

- [ ] **開発者ツール（F12）を開く**
- [ ] **「Application」タブ → 「Local Storage」を確認**
- [ ] **`todo-app-user-name`というキーが存在するか確認**
  - ✅ 存在する → 名前入力画面がスキップされる原因
  - ❌ 存在しない → コードの問題の可能性

### チェック3: コンソールエラーを確認

- [ ] **開発者ツール（F12）の「Console」タブを開く**
- [ ] **エラーメッセージ（赤色）がないか確認**
  - ✅ エラーなし → localStorageの問題の可能性が高い
  - ❌ エラーあり → エラー内容を確認

### チェック4: ネットワーク接続を確認

- [ ] **開発者ツール（F12）の「Network」タブを開く**
- [ ] **Supabaseへのリクエストが成功しているか確認**
  - `supabase.co`へのリクエストが200（成功）か確認

---

## 🔧 修正例（初心者向け）

### 修正1: デバッグ用のコンソールログを追加

問題を特定するために、`app/page.tsx`にデバッグログを追加します：

```typescript
useEffect(() => {
  const loadUser = async (): Promise<void> => {
    console.log('🔍 [DEBUG] ページ読み込み開始');
    const hasName = hasUserName();
    console.log('🔍 [DEBUG] hasUserName():', hasName);
    
    if (hasName) {
      const name = getUserName();
      console.log('🔍 [DEBUG] getUserName():', name);
      
      if (name) {
        setUserName(name);
        console.log('🔍 [DEBUG] userNameを設定:', name);
        
        setIsLoadingTodos(true);
        const result = await getTodos(name);
        console.log('🔍 [DEBUG] getTodos結果:', result);
        
        if (result.success && result.data) {
          setInitialTodos(result.data);
        }
        setIsLoadingTodos(false);
      }
    }
    setIsLoading(false);
    console.log('🔍 [DEBUG] ページ読み込み完了');
  };
  void loadUser();
}, []);
```

**使い方：**
1. 上記のコードを`app/page.tsx`の`useEffect`内に置き換える
2. サイトを開く
3. 開発者ツール（F12）の「Console」タブでログを確認
4. どの段階で問題が発生しているか確認

### 修正2: ログアウト機能を追加（名前をリセット）

名前入力画面を再度表示させるために、ログアウト機能を追加します：

**`components/todo/TodoApp.tsx`にログアウトボタンを追加：**

```typescript
import { clearUserName } from '@/lib/utils/user-storage';

// TodoAppコンポーネント内に追加
const handleLogout = (): void => {
  clearUserName();
  window.location.reload(); // ページをリロード
};

// 戻り値のJSX内に追加（タイトルの近く）
<button
  onClick={handleLogout}
  className="ml-4 px-3 py-1 text-sm rounded-md"
  style={{
    backgroundColor: 'var(--button-secondary)',
    color: '#000000'
  }}
>
  ログアウト
</button>
```

**使い方：**
- 「ログアウト」ボタンをクリックすると、`localStorage`から名前が削除され、名前入力画面が表示されます

### 修正3: 初期状態を明示的に設定

`app/page.tsx`で、初期状態をより明確にします：

```typescript
// 名前が入力されていない場合は名前入力画面を表示
if (!userName && !isLoading) {
  return (
    // ... 名前入力画面のJSX
  );
}
```

**変更点：**
- `if (!userName)` を `if (!userName && !isLoading)` に変更
- これにより、ローディング中は名前入力画面が表示されません

---

## 🧪 テスト手順

### テスト1: 初回アクセステスト

1. **シークレットウィンドウ（プライベートブラウジング）でサイトを開く**
2. **名前入力画面が表示されることを確認**
3. **名前を入力して「開始」ボタンをクリック**
4. **Todo画面が表示されることを確認**

### テスト2: 再アクセステスト

1. **通常のブラウザでサイトを開く**（既に名前が保存されている状態）
2. **Todo画面が直接表示されることを確認**
3. **ページをリロード（F5）**
4. **Todo画面が表示され続けることを確認**

### テスト3: ログアウトテスト

1. **Todo画面で「ログアウト」ボタンをクリック**（修正2を適用した場合）
2. **名前入力画面が表示されることを確認**
3. **再度名前を入力して「開始」ボタンをクリック**
4. **Todo画面が表示されることを確認**

---

## 🎯 最も可能性が高い原因と対処

**最も可能性が高い原因：**
- **ブラウザの`localStorage`に既に名前が保存されている**

**最も簡単な対処方法：**
1. **シークレットウィンドウ（プライベートブラウジング）でサイトを開く**
2. **名前入力画面が表示されることを確認**
3. 通常のブラウザでアクセスした場合は、既に名前が保存されているため、Todo画面が表示される（これは正常な動作です）

**本番環境での動作：**
- 初めてアクセスするユーザー → 名前入力画面が表示される ✅
- 既に名前を入力したユーザー → Todo画面が表示される ✅

---

## 📞 追加のヘルプが必要な場合

問題が解決しない場合は、以下を確認してください：

1. **ブラウザのコンソール（F12）のエラーメッセージ**
2. **Vercelのデプロイログ**
3. **Supabaseダッシュボードのログ**

これらの情報があれば、より具体的な解決策を提案できます。
