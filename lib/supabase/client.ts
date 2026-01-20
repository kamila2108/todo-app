/**
 * Supabaseクライアントの設定
 * クライアント側（ブラウザ）で使用
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase環境変数が設定されていません。.env.localファイルを確認してください。');
}

/**
 * Supabaseクライアントインスタンス
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
