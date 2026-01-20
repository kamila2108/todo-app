# デプロイ後の問題：名前入力画面が表示されない

## 🔍 考えられる原因（優先度順）

### 🔴 優先度1: ブラウザのlocalStorageに既に名前が保存されている（最も可能性が高い）

**原因：**
- デプロイ前のテストで名前を入力した場合、そのブラウザのlocalStorageに名前が残っている
- 別のユーザーが同じブラウザを使った場合、前のユーザーの名前が残っている
- コードは正しく動作しているが、localStorageに名前があるため名前入力画面をスキップしている

**確認方法：**
1. ブラウザの開発者ツール（F12キー）を開く
2. 「Application」タブ（Chrome/Edge）または「ストレージ」タブ（Firefox）をクリック
3. 左側のメニューから「Local Storage」→「https://your-project.vercel.app」をクリック
4. `todo-app-user-name` というキーがあるか確認
5. 値に名前が保存されているか確認

**解決方法：**
- **方法1: localStorageをクリアする**
  1. 開発者ツールの「Application」タブで「Local Storage」を開く
  2. `todo-app-user-name` を右クリック → 「Delete」をクリック
  3. ページをリロード（F5キー）

- **方法2: シークレットモード/プライベートモードで確認**
  1. ブラウザでシークレットモード/プライベートモードを開く（Ctrl + Shift + N）
  2. デプロイしたURLを開く
  3. 名前入力画面が表示されるか確認

- **方法3: 別のブラウザで確認**
  1. 普段使っているブラウザとは別のブラウザで開く
  2. 名前入力画面が表示されるか確認

---

### 🟡 優先度2: SSR/SSGの問題（可能性は低い）

**原因：**
- Next.jsのサーバー側レンダリング時にlocalStorageが使えない
- ただし、`'use client'`を使っているので、この問題は発生しないはず

**確認方法：**
1. ブラウザの開発者ツール（F12）の「Console」タブを開く
2. エラーメッセージがないか確認
3. `localStorage is not defined` のようなエラーが出ていないか確認

**解決方法：**
- コードは既に`'use client'`を使っているので、この問題は発生しないはず
- もしエラーが出る場合は、`lib/utils/user-storage.ts`の`typeof window !== 'undefined'`チェックが正しく動作しているか確認

---

### 🟢 優先度3: コードのロジック問題（可能性は低い）

**原因：**
- `hasUserName()`が常に`true`を返している
- `getUserName()`が常に値を返している

**確認方法：**
1. ブラウザの開発者ツール（F12）の「Console」タブを開く
2. 以下のコードを実行して確認：
   ```javascript
   localStorage.getItem('todo-app-user-name')
   ```
3. `null`が返されれば、localStorageには名前が保存されていない
4. 文字列が返されれば、localStorageに名前が保存されている

**解決方法：**
- コードのロジックは正しいので、この問題は発生しないはず
- もし問題がある場合は、`lib/utils/user-storage.ts`の実装を確認

---

## 🔧 デバッグ用コードの追加

問題を特定するために、デバッグ用のログを追加しました。

### 追加したデバッグログ

`app/page.tsx`にデバッグログを追加しました。開発環境（`npm run dev`）で実行すると、コンソールに以下のログが表示されます：

- `🔍 [DEBUG] ページ読み込み開始`
- `🔍 [DEBUG] hasUserName(): true/false`
- `🔍 [DEBUG] localStorageから名前を取得: [名前]` または `🔍 [DEBUG] 名前が保存されていないため、名前入力画面を表示`
- `🔍 [DEBUG] getTodos結果: [結果]`

**確認方法：**
1. ローカル環境で `npm run dev` を実行
2. ブラウザの開発者ツール（F12）の「Console」タブを開く
3. ページをリロードしてログを確認

---

## ✅ 推奨される確認手順

1. **ブラウザの開発者ツールでlocalStorageを確認**
   - F12キー → 「Application」タブ → 「Local Storage」
   - `todo-app-user-name` の値を確認
   - **これが最も重要です！**

2. **シークレットモード/プライベートモードで確認**
   - Ctrl + Shift + N でシークレットモードを開く
   - デプロイしたURLを開く
   - 名前入力画面が表示されるか確認
   - **これで名前入力画面が表示されれば、localStorageが原因です**

3. **別のブラウザで確認**
   - 普段使っているブラウザとは別のブラウザで開く
   - 名前入力画面が表示されるか確認

4. **デバッグログを確認**
   - ローカル環境で `npm run dev` を実行
   - ブラウザのコンソールでログを確認
   - `hasUserName()` の結果を確認

---

## 🎯 根本的な解決策

もし「初回アクセス時は必ず名前入力画面を表示したい」という要件がある場合は、以下の修正を検討してください：

### 修正案1: セッションストレージを使用する（推奨）

localStorageの代わりにsessionStorageを使用することで、ブラウザタブを閉じると名前が消えるようにする：

```typescript
// lib/utils/user-storage.ts
const USER_NAME_KEY = 'todo-app-user-name';

export function saveUserName(name: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(USER_NAME_KEY, name.trim());  // localStorage → sessionStorage
  }
}

export function getUserName(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(USER_NAME_KEY);  // localStorage → sessionStorage
  }
  return null;
}

export function clearUserName(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(USER_NAME_KEY);  // localStorage → sessionStorage
  }
}

export function hasUserName(): boolean {
  const name = getUserName();
  return name !== null && name.trim().length > 0;
}
```

**メリット：**
- ブラウザタブを閉じると名前が消える
- 次回アクセス時は必ず名前入力画面が表示される
- 複数のユーザーが同じブラウザを使っても問題ない

**デメリット：**
- ブラウザタブを閉じると名前が消える（再入力が必要）

### 修正案2: ログアウト機能を追加する

Todo画面に「ログアウト」ボタンを追加して、名前を削除できるようにする：

```typescript
// features/todo/components/TodoApp.tsx に追加
import { clearUserName } from '@/lib/utils/user-storage';

// ログアウトボタンを追加
<button
  onClick={() => {
    clearUserName();
    window.location.reload();
  }}
>
  ログアウト
</button>
```

---

## 📋 チェックリスト

問題を特定するためのチェックリスト：

- [ ] ブラウザの開発者ツールでlocalStorageを確認した
- [ ] `todo-app-user-name` の値が空（null）か確認した
- [ ] シークレットモード/プライベートモードで確認した
- [ ] 別のブラウザで確認した
- [ ] デバッグログを追加して確認した（ローカル環境）
- [ ] コンソールにエラーメッセージがないか確認した

---

## 💡 次のステップ

1. **まず、優先度1（localStorageの確認）から始めてください**
   - ブラウザの開発者ツールでlocalStorageを確認
   - `todo-app-user-name` の値を確認

2. **シークレットモード/プライベートモードで確認**
   - これで名前入力画面が表示されれば、localStorageが原因です

3. **それでも問題が解決しない場合は、デバッグログを確認**
   - ローカル環境で `npm run dev` を実行
   - ブラウザのコンソールでログを確認

4. **根本的な解決策を検討**
   - セッションストレージを使用する
   - ログアウト機能を追加する
