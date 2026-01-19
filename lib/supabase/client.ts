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
