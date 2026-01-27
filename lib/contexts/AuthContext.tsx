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
      // AbortErrorなどのエラーを無視（開発モードでのReact Strict Modeによるもの）
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
        // エラーを無視して終了
        return;
      }
      console.error('ユーザー情報取得エラー:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * ログアウト処理
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      console.log('ログアウト処理を開始します...');
      // まず、ユーザー情報をクリア（即座にログアウト状態にする）
      setUser(null);
      setIsLoading(false);
      
      // Supabase Authでログアウト
      const result = await authSignOut();
      if (result.error) {
        console.error('ログアウトエラー:', result.error);
        // エラーが発生しても、既にユーザー情報はクリア済み
        return;
      }
      console.log('ログアウト成功しました');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      // エラーが発生しても、ユーザー情報をクリア
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // コンポーネントがマウントされた時にユーザー情報を取得
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    let authInitialized = false;

    // 初期認証状態を即座に取得（onAuthStateChangeを待たない）
    const initializeAuthImmediately = async (): Promise<void> => {
      try {
        // セッションを直接取得（タイムアウト付き）
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: null }, error: null }>((resolve) => {
          setTimeout(() => {
            resolve({ data: { session: null }, error: null });
          }, 300);
        });

        const result = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (result.error) {
          console.error('初期認証: セッション取得エラー:', result.error);
          if (isMounted && !authInitialized) {
            setUser(null);
            setIsLoading(false);
            authInitialized = true;
          }
          return;
        }

        const session = result.data?.session;

        if (session?.user) {
          // セッションがある場合、セッション情報からユーザー情報を構築
          // getCurrentUser()を呼び出すとAbortErrorが発生する可能性があるため、
          // セッション情報から直接構築する
          const sessionUser = session.user;
          const fallbackUser: User = {
            id: sessionUser.id,
            email: sessionUser.email || '',
            name: (sessionUser.user_metadata?.name as string) || 'ユーザー',
            created_at: sessionUser.created_at || new Date().toISOString(),
          };
          if (isMounted && !authInitialized) {
            setUser(fallbackUser);
            setIsLoading(false);
            authInitialized = true;
            console.log('初期認証: セッション情報からユーザー情報を構築しました');
          }
        } else {
          // セッションがない場合はログアウト状態
          if (isMounted && !authInitialized) {
            setUser(null);
            setIsLoading(false);
            authInitialized = true;
            console.log('初期認証: セッションがありません（ログアウト状態）');
          }
        }
      } catch (error) {
        // AbortErrorなどのエラーを無視
        if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
          console.log('初期認証: AbortErrorが発生しました。ログアウト状態として処理します。');
        } else {
          console.error('初期認証エラー:', error);
        }
        if (isMounted && !authInitialized) {
          setUser(null);
          setIsLoading(false);
          authInitialized = true;
        }
      }
    };

    // 即座に初期認証状態を取得
    void initializeAuthImmediately();

    // Supabaseの認証状態変更を監視
    // INITIAL_SESSIONイベントで初期認証状態を取得
    // （別のタブでログアウトした場合などに対応）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('認証状態変更:', event, session?.user?.id);
        
        if (event === 'SIGNED_OUT') {
          console.log('認証状態変更: SIGNED_OUTイベント。ログアウト状態に設定します。');
          // SIGNED_OUTイベントが発火した場合、確実にログアウト状態にする
          setUser(null);
          setIsLoading(false);
          authInitialized = true;
          console.log('認証状態変更: ログアウト状態に設定しました');
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          console.log('認証状態変更: SIGNED_IN/TOKEN_REFRESHED/INITIAL_SESSION', { event, hasSession: !!session?.user });
          try {
            // セッションがある場合のみユーザー情報を取得
            if (session?.user) {
              console.log('認証状態変更: ユーザー情報を取得します...');
              setIsLoading(true);
              
              // SIGNED_INイベントの場合は、signIn関数内で既にユーザー情報を取得しているため、
              // ここではセッション情報から直接ユーザー情報を構築する
              // これにより、AbortErrorの競合を回避できる
              if (event === 'SIGNED_IN') {
                console.log('認証状態変更: SIGNED_INイベント。セッション情報からユーザー情報を構築します。');
                // セッション情報からユーザー情報を構築
                const sessionUser = session.user;
                const fallbackUser: User = {
                  id: sessionUser.id,
                  email: sessionUser.email || '',
                  name: (sessionUser.user_metadata?.name as string) || 'ユーザー',
                  created_at: sessionUser.created_at || new Date().toISOString(),
                };
                if (isMounted) {
                  setUser(fallbackUser);
                  setIsLoading(false);
                  authInitialized = true;
                  console.log('認証状態変更: ユーザー情報を設定しました（セッション情報から）');
                }
              } else {
                // INITIAL_SESSIONやTOKEN_REFRESHEDの場合は、getCurrentUser()を呼び出す
                const currentUser = await getCurrentUser();
                console.log('認証状態変更: ユーザー情報を取得しました:', currentUser);
                if (isMounted) {
                  setUser(currentUser);
                  setIsLoading(false);
                  authInitialized = true;
                  console.log('認証状態変更: ユーザー情報を設定しました');
                }
              }
            } else {
              // セッションがない場合はログアウト状態
              console.log('認証状態変更: セッションがありません');
              if (isMounted) {
                setUser(null);
                setIsLoading(false);
                authInitialized = true;
              }
            }
          } catch (error) {
            // AbortErrorなどのエラーを無視（開発モードでのReact Strict Modeによるもの）
            if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
              console.warn('認証状態変更: AbortErrorが発生しました。セッション情報からユーザー情報を構築します。');
              // セッション情報からユーザー情報を構築
              if (session?.user && isMounted) {
                const fallbackUser: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: (session.user.user_metadata?.name as string) || 'ユーザー',
                  created_at: session.user.created_at || new Date().toISOString(),
                };
                setUser(fallbackUser);
                setIsLoading(false);
                authInitialized = true;
              }
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

    // タイムアウト処理（500ms後に強制的にローディングを解除）
    // 即座に初期認証状態を取得しているため、タイムアウトは短く設定
    timeoutId = setTimeout(() => {
      if (isMounted && !authInitialized) {
        console.warn('認証状態の取得がタイムアウトしました。ログアウト状態として処理します。');
        setUser(null);
        setIsLoading(false);
        authInitialized = true;
      }
    }, 500);

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
