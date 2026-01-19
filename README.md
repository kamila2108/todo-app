# Todo アプリ

React + TypeScript + Next.js で構築されたTodoアプリケーションです。

## 📋 機能

- ✅ Todoの追加
- ✅ Todoの完了/未完了の切り替え
- ✅ Todoの削除
- ✅ リアルタイムバリデーション（React Hook Form + Zod）

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **フレームワーク**: Next.js 14 (App Router)
- **スタイリング**: Tailwind CSS
- **フォーム管理**: React Hook Form
- **バリデーション**: Zod

## 🚀 セットアップ手順

### Windows環境での実行方法

**初心者の方：**
👉 [SETUP_GUIDE.md](./SETUP_GUIDE.md) を参照してください（詳細なステップバイステップガイド）

**経験者の方：**
👉 [QUICK_START.md](./QUICK_START.md) を参照してください（簡易手順）

### 基本的な手順

1. Node.js（v18以上）をインストール
2. プロジェクトフォルダに移動
3. 依存関係をインストール: `npm install`
4. 開発サーバーを起動: `npm run dev`
5. ブラウザで `http://localhost:3000` を開く

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

## 📚 参考資料

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [React公式ドキュメント](https://ja.react.dev/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
