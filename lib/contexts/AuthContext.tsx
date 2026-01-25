'use client';

/**
 * 認証状態を管理するコンテキスト
 * 
 * 【初心者向け説明】
 * React Contextは、アプリ全体で状態を共有するための機能です。
 * このコンテキストでは、以下の情報を管理します：
 * - 現在ログインしているユーザー情報
 * - ログイン状態（ログイン中かどうか）
 * - ログイン・ログアウトの関数
 * 
 * 使い方：
 * 1. AuthProviderでアプリ全体をラップ
 * 2. useAuth()フックで認証情報にアクセス
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signOut as authSignOut, type User } from '@/lib/supabase/auth';
import { supabase } from '@/lib/supabase/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * 認証プロバイダーコンポーネント
 * 
 * 【初心者向け説明】
 * このコンポーネントでアプリ全体をラップすることで、
 * どこからでも認証情報にアクセスできるようになります。
 */
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * 現在のユーザー情報を取得
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ログアウト処理
   */
  const signOut = async (): Promise<void> => {
    try {
      const result = await authSignOut();
      if (result.error) {
        console.error('ログアウトエラー:', result.error);
        return;
      }
      setUser(null);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  // コンポーネントがマウントされた時にユーザー情報を取得
  useEffect(() => {
    void refreshUser();

    // Supabaseの認証状態変更を監視
    // （別のタブでログアウトした場合などに対応）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await refreshUser();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 認証情報にアクセスするためのフック
 * 
 * 【初心者向け説明】
 * このフックを使うことで、コンポーネント内で認証情報にアクセスできます。
 * 
 * 使用例：
 * const { user, isLoading, signOut } = useAuth();
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
