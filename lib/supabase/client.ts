/**
 * Supabaseクライアントの設定
 * クライアント側（ブラウザ）で使用
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 環境変数のチェック（開発環境でより分かりやすいエラーメッセージを表示）
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
========================================
【重要】Supabase環境変数が設定されていません

以下の手順を確認してください：

1. プロジェクトフォルダ（C:\\Users\\tokam\\Downloads\\1）に
   .env.local ファイルが存在するか確認してください

2. .env.local ファイルの内容を確認してください：
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

3. 環境変数が正しく設定されている場合：
   - 開発サーバーを再起動してください（Ctrl + C で停止してから npm run dev）
   - .env.local ファイルを保存した後、必ずサーバーを再起動してください

詳細は SETUP_GUIDE_AUTH.md の「ステップ6: 環境変数を設定する」を参照してください。
========================================
  `;
  
  console.error(errorMessage);
  
  // 開発環境ではエラーをスローして、設定を促す
  if (process.env.NODE_ENV === 'development') {
    throw new Error(
      'Supabase環境変数が設定されていません。.env.localファイルを作成して、NEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYを設定してください。\n' +
      '詳細は SETUP_GUIDE_AUTH.md を参照してください。'
    );
  }
}

/**
 * Supabaseクライアントインスタンス
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
