/**
 * ユーザー認証機能（名前ベースの簡易認証）
 */

import { supabase } from './client';

export interface User {
  id: string;
  name: string;
  created_at: string;
}

/**
 * ユーザー名でユーザーを検索または作成
 * @param name ユーザー名（ログインID）
 * @returns ユーザー情報
 */
export async function findOrCreateUser(name: string): Promise<User | null> {
  try {
    // 既存のユーザーを検索
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('name', name.trim())
      .single();

    if (existingUser && !selectError) {
      // 既存のユーザーが見つかった場合
      return existingUser as User;
    }

    // ユーザーが見つからない場合、新規作成
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ name: name.trim() })
      .select()
      .single();

    if (insertError) {
      console.error('ユーザー作成エラー:', insertError);
      return null;
    }

    return newUser as User;
  } catch (error) {
    console.error('ユーザー検索/作成エラー:', error);
    return null;
  }
}

/**
 * ユーザーIDでユーザーを取得
 * @param userId ユーザーID
 * @returns ユーザー情報
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('ユーザー取得エラー:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return null;
  }
}

/**
 * ユーザー名でユーザーを取得
 * @param name ユーザー名
 * @returns ユーザー情報
 */
export async function getUserByName(name: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('name', name.trim())
      .single();

    if (error) {
      console.error('ユーザー取得エラー:', error);
      return null;
    }

    return data as User;
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return null;
  }
}
