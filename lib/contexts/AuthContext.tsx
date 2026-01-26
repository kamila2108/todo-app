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

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    let authInitialized = false;

    // 初期認証状態を取得（INITIAL_SESSIONイベントのフォールバック）
    const initializeAuth = async (): Promise<void> => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted && !authInitialized) {
          setUser(currentUser);
          setIsLoading(false);
          authInitialized = true;
        }
      } catch (error) {
        // AbortErrorなどのエラーを無視（開発モードでのReact Strict Modeによるもの）
        if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
          // エラーを無視して終了
          return;
        }
        console.error('認証初期化エラー:', error);
        if (isMounted && !authInitialized) {
          setUser(null);
          setIsLoading(false);
          authInitialized = true;
        }
      }
    };

    // 初期化を実行（INITIAL_SESSIONイベントと並行して実行）
    void initializeAuth();

    // Supabaseの認証状態変更を監視
    // INITIAL_SESSIONイベントで初期認証状態を取得
    // （別のタブでログアウトした場合などに対応）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('認証状態変更:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
          authInitialized = true;
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          try {
            // セッションがある場合のみユーザー情報を取得
            if (session?.user) {
              setIsLoading(true);
              const currentUser = await getCurrentUser();
              if (isMounted) {
                setUser(currentUser);
                setIsLoading(false);
                authInitialized = true;
              }
            } else {
              // セッションがない場合はログアウト状態
              if (isMounted) {
                setUser(null);
                setIsLoading(false);
                authInitialized = true;
              }
            }
          } catch (error) {
            // AbortErrorなどのエラーを無視（開発モードでのReact Strict Modeによるもの）
            if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
              // エラーを無視して終了
              return;
            }
            console.error('認証状態変更時のエラー:', error);
            if (isMounted) {
              setUser(null);
              setIsLoading(false);
              authInitialized = true;
            }
          }
        }
      }
    );

    // タイムアウト処理（5秒後に強制的にローディングを解除）
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('認証状態の取得がタイムアウトしました');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
