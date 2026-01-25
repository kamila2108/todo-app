# デプロイ用コマンド一覧（PowerShell用）

このファイルには、デプロイに必要なすべてのコマンドが含まれています。
各コマンドを順番にコピー&ペーストして実行してください。

---

## 📋 ステップ1: プロジェクトフォルダに移動

```powershell
cd C:\Users\tokam\Downloads\1
```

---

## 📋 ステップ2: 変更を確認

```powershell
git status
```

**期待される結果：**
- 変更されたファイルの一覧が表示されます

---

## 📋 ステップ3: 変更をステージング

```powershell
git add .
```

**何をしているのか：**
- すべての変更をGitに「この変更をコミットします」と伝えます

---

## 📋 ステップ4: 変更をコミット

```powershell
git commit -m "Add user authentication and login functionality"
```

**別のメッセージ例（日本語）：**
```powershell
git commit -m "会員登録・ログイン機能を追加"
```

---

## 📋 ステップ5: GitHubにプッシュ

```powershell
git push
```

**何をしているのか：**
- ローカルの変更をGitHubに送信します
- Vercelが自動的に変更を検知して、デプロイを開始します

**もしエラーが出た場合：**
- 認証画面が表示されたら、「**Authorize git-ecosystem**」をクリック

---

## ✅ 完了！

これで、GitHubに変更がプッシュされました。

**次のステップ：**
1. Vercelのダッシュボードで環境変数を設定（`DEPLOY_GUIDE_AUTH.md`のステップ2を参照）
2. 再デプロイを実行（`DEPLOY_GUIDE_AUTH.md`のステップ3を参照）

---

## 🔍 トラブルシューティング

### エラー: `git: command not found`

**解決方法：**
- Gitがインストールされていません
- [Git for Windows](https://git-scm.com/download/win)をダウンロードしてインストールしてください

### エラー: `fatal: not a git repository`

**解決方法：**
- プロジェクトフォルダがGitリポジトリではありません
- 以下のコマンドでGitリポジトリを初期化：
  ```powershell
  git init
  git remote add origin [GitHubリポジトリのURL]
  ```

### エラー: 認証エラー

**解決方法：**
- GitHubの認証が必要です
- ブラウザで認証画面が開いたら、「Authorize git-ecosystem」をクリック

---

## 📝 参考

詳細な手順は `DEPLOY_GUIDE_AUTH.md` を参照してください。
