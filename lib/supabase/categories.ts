/**
 * カテゴリデータのSupabase操作
 */

import { supabase } from './client';
import type { Database } from './database.types';

/**
 * 指定されたユーザーのすべてのカテゴリを取得
 * @param userId ユーザーID
 * @returns カテゴリ名の配列
 */
export async function getCategoriesByUserId(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .eq('user_id', userId)
      .order('name');

    if (error) {
      console.error('カテゴリ取得エラー:', error);
      return [];
    }

    return (data || []).map((item) => item.name);
  } catch (error) {
    console.error('カテゴリ取得エラー:', error);
    return [];
  }
}

/**
 * カテゴリを追加（重複チェック）
 * @param userId ユーザーID
 * @param categoryName カテゴリ名
 * @returns 追加成功かどうか
 */
export async function addCategory(userId: string, categoryName: string): Promise<boolean> {
  try {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;

    // 既に存在するかチェック
    const existing = await getCategoriesByUserId(userId);
    if (existing.includes(trimmed)) {
      return true; // 既に存在する場合は成功とみなす
    }

    // カテゴリを追加
    const { error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name: trimmed,
      } as Database['public']['Tables']['categories']['Insert']);

    if (error) {
      console.error('カテゴリ追加エラー:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('カテゴリ追加エラー:', error);
    return false;
  }
}

/**
 * カテゴリを削除
 * @param userId ユーザーID
 * @param categoryName カテゴリ名
 * @returns 削除成功かどうか
 */
export async function removeCategory(userId: string, categoryName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('user_id', userId)
      .eq('name', categoryName.trim());

    if (error) {
      console.error('カテゴリ削除エラー:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('カテゴリ削除エラー:', error);
    return false;
  }
}
