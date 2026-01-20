# 🧹 localStorageをクリアする方法

## 🔍 問題の確認

コンソールに以下のログが表示されていれば、`localStorage`に名前が保存されていることが確認できています：

```
🔍 [DEBUG] hasUserName(): true
🔍 [DEBUG] localStorageから名前を取得: kamila
```

これが、名前入力画面が表示されない原因です。

---

## ✅ 解決方法

### 方法1: コンソールでlocalStorageをクリア（最も簡単）

#### ステップ1: ブラウザのコンソールを開く

1. **ブラウザで`http://localhost:3002`を開く**
2. **開発者ツールを開く**
   - Windows: `F12`キーを押す
   - または、`Ctrl + Shift + I`（Chrome/Edge）
   - または、`Ctrl + Shift + K`（Firefox）

3. **「Console」タブをクリック**
   - 開発者ツールの上部にタブが並んでいます
   - 「Console」「Network」「Application」などのタブがあります
   - 「Console」タブをクリックしてください

#### ステップ2: コードを入力する場所を確認

- **白いテキスト入力欄**があります
- この欄にコマンドを入力します
- 入力欄の右下に「>`」という記号があるはずです

#### ステップ3: 警告メッセージについて

コードを貼り付けようとすると、以下の警告が表示される場合があります：

```
Warning: Don't paste code into the DevTools Console that you don't understand or haven't reviewed yourself. This could allow attackers to steal your identity or take control of your computer. Please type 'allow pasting' below and press Enter to allow pasting.
```

**これはChrome/Edgeのセキュリティ機能です。安全に対処する方法：**

1. **警告メッセージが表示されたら、その下の入力欄に以下を入力：**
   ```
   allow pasting
   ```
2. **Enterキーを押す**
3. **これで、コードを貼り付けられるようになります**

**または、警告を無視して直接コードを入力することもできます**（コピー&ペーストではなく、手動で入力）

#### ステップ4: localStorageをクリアするコードを実行

**方法A: コピー&ペースト（警告を解除した後）**

1. **以下のコードをコピー：**
   ```javascript
   localStorage.removeItem('todo-app-user-name')
   ```

2. **コンソールの入力欄に貼り付け**（または手動で入力）

3. **Enterキーを押す**

4. **以下のコードを実行（ページをリロード）：**
   ```javascript
   location.reload()
   ```

**方法B: 1つのコマンドで実行**

以下のコードを1行で実行できます：

```javascript
localStorage.removeItem('todo-app-user-name'); location.reload()
```

**実行手順：**
1. 上記のコードをコピー（または手動で入力）
2. コンソールの入力欄に貼り付け（または入力）
3. Enterキーを押す
4. ページが自動的にリロードされ、名前入力画面が表示されます

---

### 方法2: ApplicationタブからlocalStorageをクリア

#### ステップ1: Applicationタブを開く

1. **開発者ツール（F12）を開く**

2. **「Application」タブをクリック**
   - Chrome/Edgeの場合
   - Firefoxの場合は「Storage」タブ

#### ステップ2: Local Storageを開く

1. **左側のメニューから「Local Storage」を展開**
   - 三角形（▶）をクリックして展開

2. **`http://localhost:3002`をクリック**
   - または、サイトのURLをクリック

#### ステップ3: キーを削除

1. **右側の一覧で`todo-app-user-name`というキーを探す**

2. **キーを右クリック**

3. **「Delete」または「削除」をクリック**

4. **ページをリロード**（`F5`キー）

5. **名前入力画面が表示されることを確認**

---

### 方法3: Todo画面のログアウトボタンを使用

もしTodo画面が表示されている場合：

1. **Todo画面の右上に「ログアウト」ボタンがあるか確認**

2. **「ログアウト」ボタンをクリック**

3. **名前入力画面が表示されることを確認**

---

## 🔍 動作確認

localStorageをクリアした後、以下を確認してください：

1. **ページがリロードされる**

2. **名前入力画面が表示される**

3. **コンソール（F12 → Console）で以下を実行して確認：**
   ```javascript
   localStorage.getItem('todo-app-user-name')
   ```
   
   **結果：**
   - `null`が返されれば → 正常にクリアされています ✅
   - 文字列が返される → まだクリアされていません

---

## 📝 コードの説明

**`localStorage.removeItem('todo-app-user-name')`**
- `localStorage`から`todo-app-user-name`というキーを削除します
- これにより、保存されていた名前（`kamila`）が削除されます

**`location.reload()`**
- ページをリロード（再読み込み）します
- `F5`キーを押すのと同じ動作です

**1行で実行：**
```javascript
localStorage.removeItem('todo-app-user-name'); location.reload()
```
- セミコロン（`;`）で区切って、2つのコマンドを1行で実行できます

---

## ⚠️ 注意事項

1. **警告メッセージについて**
   - Chrome/Edgeは、セキュリティのため、コードの貼り付けに警告を表示します
   - `allow pasting`と入力してEnterを押すと、貼り付けが可能になります
   - または、コードを手動で入力することもできます

2. **localStorageをクリアした後**
   - 名前が削除されるため、次回アクセス時に再度名前を入力する必要があります
   - これは正常な動作です

3. **デバッグログについて**
   - `🔍 [DEBUG]`というログは、開発環境でのみ表示されます
   - 本番環境では表示されません

---

## ✅ 完了の確認

以下の状態になれば完了です：

- ✅ ページがリロードされる
- ✅ 名前入力画面が表示される
- ✅ コンソールで`localStorage.getItem('todo-app-user-name')`を実行すると`null`が返される

---

## 🎯 まとめ

**最も簡単な方法：**

1. **開発者ツール（F12）を開く**
2. **「Console」タブをクリック**
3. **以下のコードを入力（または貼り付け）：**
   ```javascript
   localStorage.removeItem('todo-app-user-name'); location.reload()
   ```
4. **Enterキーを押す**
5. **名前入力画面が表示されます**

これで問題が解決するはずです！
