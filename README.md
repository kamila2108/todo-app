# Todo アプリ

React + TypeScript + Next.js で構築されたTodoアプリケーションです。

## 📋 機能

- ✅ **会員登録・ログイン機能**（メールアドレス + パスワード）
- ✅ **ユーザーごとのTodo管理**（ログインしたユーザーごとにTodoを分離）
- ✅ Todoの追加
- ✅ Todoの完了/未完了の切り替え
- ✅ Todoの削除
- ✅ カテゴリ機能
- ✅ リアルタイムバリデーション（React Hook Form + Zod）
- ✅ レスポンシブデザイン（スマホ/PC対応）

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **フレームワーク**: Next.js 14 (App Router)
- **バックエンド**: Supabase (認証・データベース)
- **スタイリング**: Tailwind CSS
- **フォーム管理**: React Hook Form
- **バリデーション**: Zod

## 🚀 セットアップ手順

### Windows環境での実行方法

**会員登録・ログイン機能付きアプリをセットアップする場合：**
👉 **[SETUP_GUIDE_AUTH.md](./SETUP_GUIDE_AUTH.md)** を参照してください（詳細なステップバイステップガイド）
- Supabaseアカウントの作成
- データベースの設定
- 環境変数の設定
- すべて初心者向けに詳しく説明しています

**基本的なセットアップ（認証機能なし）の場合：**
👉 [SETUP_GUIDE.md](./SETUP_GUIDE.md) を参照してください

**経験者の方：**
👉 [QUICK_START.md](./QUICK_START.md) を参照してください（簡易手順）

### 基本的な手順（会員登録・ログイン機能付き）

1. Node.js（v18以上）をインストール
2. Supabaseアカウントを作成
3. Supabaseでデータベースを設定（SQLを実行）
4. 環境変数を設定（`.env.local` ファイルを作成）
5. プロジェクトフォルダに移動
6. 依存関係をインストール: `npm install`
7. 開発サーバーを起動: `npm run dev`
8. ブラウザで `http://localhost:3000` を開く

**詳細は [SETUP_GUIDE_AUTH.md](./SETUP_GUIDE_AUTH.md) を参照してください。**

## 📁 プロジェクト構成

```
.
├── app/                    # Next.js App Router
│   ├── api/todos/         # API Routes
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # トップページ
│   └── globals.css        # グローバルスタイル
├── features/todo/         # Todo機能
│   ├── components/        # UIコンポーネント
│   ├── schemas/           # Zodスキーマ
│   └── types/             # TypeScript型定義
└── lib/                   # 共通ライブラリ
    └── todoRepository.ts  # ビジネスロジック
```

## 🎯 設計原則

- ✅ Function Componentのみ使用
- ✅ `any`型は禁止、すべて明示的に型定義
- ✅ Propsはinterfaceで定義
- ✅ Client Componentには `"use client"` を明示
- ✅ ビジネスロジックはサーバー側に集約
- ✅ コンポーネントはfeature単位で分割
- ✅ UIとロジックを可能な限り分離

## 📝 開発コマンド

```bash
# 開発サーバーを起動
npm run dev

# 本番用ビルド
npm run build

# 本番サーバーを起動
npm start

# リンターを実行
npm run lint
```

## 🚀 デプロイ手順

**会員登録・ログイン機能付きアプリをデプロイする場合：**
👉 **[DEPLOY_GUIDE_AUTH.md](./DEPLOY_GUIDE_AUTH.md)** を参照してください（詳細なステップバイステップガイド）
- GitHubへのプッシュ
- Vercelでの環境変数設定
- 再デプロイの実行
- 動作確認
- すべて初心者向けに詳しく説明しています

**基本的なデプロイ手順：**
👉 [DEPLOY_STEPS.md](./DEPLOY_STEPS.md) を参照してください

## 📚 参考資料

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [React公式ドキュメント](https://ja.react.dev/)
- [Supabase公式ドキュメント（日本語）](https://supabase.com/docs)
- [Supabase Authドキュメント](https://supabase.com/docs/guides/auth)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🔐 認証機能について

このアプリはSupabase Authを使用して会員登録・ログイン機能を実装しています。

- **認証方式**: メールアドレス + パスワード
- **データベース**: Supabase PostgreSQL
- **セキュリティ**: Row Level Security (RLS) により、各ユーザーは自分のデータのみアクセス可能

各ユーザーのTodoは完全に分離されており、他のユーザーのTodoを見ることはできません。
