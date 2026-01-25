/**
 * ユーザー認証機能（Supabase Authを使用）
 * 
 * このファイルでは、Supabaseの認証機能を使って会員登録・ログインを実装しています。
 * 
 * 【初心者向け説明】
 * - signUp: 新しいユーザーを登録する関数
 * - signIn: 既存のユーザーでログインする関数
 * - signOut: ログアウトする関数
 * - getCurrentUser: 現在ログインしているユーザーを取得する関数
 */

import { supabase } from './client';
import type { Database } from './database.types';

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

/**
 * 会員登録
 * @param email メールアドレス
 * @param password パスワード
 * @param name ユーザー名
 * @returns 登録結果（成功時はユーザー情報、失敗時はnull）
 * 
 * 【初心者向け説明】
 * 1. Supabase Authでメールアドレスとパスワードでアカウントを作成
 * 2. 作成成功後、usersテーブルにユーザー情報を保存
 * 3. エラーが発生した場合はnullを返す
 */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    // 1. Supabase Authでアカウントを作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'ユーザー作成に失敗しました' };
    }

    // 2. usersテーブルにユーザー情報を保存
    // 注意：データベーストリガーが設定されている場合、自動的に挿入される可能性があります
    // そのため、まず既存のユーザーを確認してから、必要に応じて挿入します
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    let userData;
    
    if (existingUser) {
      // 既にトリガーで作成されている場合
      userData = existingUser;
    } else {
      // トリガーが動作していない場合、手動で挿入
      const insertData: Database['public']['Tables']['users']['Insert'] = {
        id: authData.user.id,
        name: name.trim(),
        email: email.trim(),
      };

      const { data: insertedUser, error: insertError } = await supabase
        .from('users')
        .insert(insertData)
        .select()
        .single();

      if (insertError) {
        console.error('ユーザー情報保存エラー:', insertError);
        // より詳細なエラーメッセージを返す
        return { 
          user: null, 
          error: `ユーザー情報の保存に失敗しました: ${insertError.message}. データベースの設定（RLSポリシーやトリガー）を確認してください。` 
        };
      }

      userData = insertedUser;
    }

    return { user: userData as User, error: null };
  } catch (error) {
    console.error('会員登録エラー:', error);
    return { user: null, error: '予期しないエラーが発生しました' };
  }
}

/**
 * ログイン
 * @param email メールアドレス
 * @param password パスワード
 * @returns ログイン結果（成功時はユーザー情報、失敗時はnull）
 * 
 * 【初心者向け説明】
 * 1. Supabase Authでメールアドレスとパスワードを検証
 * 2. 成功したら、usersテーブルからユーザー情報を取得
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    // 1. Supabase Authでログイン
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    if (!authData.user) {
      return { user: null, error: 'ログインに失敗しました' };
    }

    // 2. usersテーブルからユーザー情報を取得
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (selectError || !userData) {
      return { user: null, error: 'ユーザー情報の取得に失敗しました' };
    }

    return { user: userData as User, error: null };
  } catch (error) {
    console.error('ログインエラー:', error);
    return { user: null, error: '予期しないエラーが発生しました' };
  }
}

/**
 * ログアウト
 * @returns ログアウト結果
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (error) {
    console.error('ログアウトエラー:', error);
    return { error: '予期しないエラーが発生しました' };
  }
}

/**
 * 現在ログインしているユーザーを取得
 * @returns ユーザー情報（ログインしていない場合はnull）
 * 
 * 【初心者向け説明】
 * 1. Supabase Authから現在のセッションを取得
 * 2. セッションがあれば、usersテーブルからユーザー情報を取得
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // 1. 現在のセッションを取得
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    // 2. usersテーブルからユーザー情報を取得
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (selectError || !userData) {
      return null;
    }

    return userData as User;
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
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
 * メールアドレスでユーザーを取得
 * @param email メールアドレス
 * @returns ユーザー情報
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.trim())
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
