'use client';

/**
 * メインページコンポーネント
 * 
 * 【初心者向け説明】
 * このページは、アプリのメイン画面です。
 * 
 * 機能：
 * 1. ログイン状態を確認
 * 2. ログインしていない場合は、会員登録・ログイン画面を表示
 * 3. ログインしている場合は、Todoアプリを表示
 */

import { useState, useEffect } from 'react';
import { TodoApp } from "@/features/todo/components/TodoApp";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { Todo } from "@/lib/types/todo";
import { getTodos } from "@/lib/actions/todo-actions";
import { getCurrentUser, type User } from "@/lib/supabase/auth";
import { useAuth } from "@/lib/contexts/AuthContext";

type AuthView = 'login' | 'signup';

export default function Page() {
  const { user, isLoading: authLoading, refreshUser, signOut } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [initialTodos, setInitialTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // ユーザーがログインした時にTodoデータを取得
  useEffect(() => {
    let isMounted = true;

    const loadTodos = async (): Promise<void> => {
      if (user) {
        try {
          setIsLoadingTodos(true);
          // ユーザーIDでTodoを取得
          const result = await getTodos(user.id);
          if (isMounted) {
            if (result.success && result.data) {
              setInitialTodos(result.data);
            }
            setIsLoadingTodos(false);
          }
        } catch (error) {
          // AbortErrorなどのエラーを無視（開発モードでのReact Strict Modeによるもの）
          if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('aborted'))) {
            // エラーを無視して終了
            return;
          }
          console.error('Todo取得エラー:', error);
          if (isMounted) {
            setIsLoadingTodos(false);
          }
        }
      } else {
        // ユーザーがログアウトした場合は、Todoをクリア
        if (isMounted) {
          setInitialTodos([]);
          setIsLoadingTodos(false);
        }
      }
    };

    void loadTodos();

    return () => {
      isMounted = false;
    };
  }, [user]);

  /**
   * 会員登録成功時の処理
   */
  const handleSignUpSuccess = async (newUser: User): Promise<void> => {
    // ユーザー情報を更新
    await refreshUser();
  };

  /**
   * ログイン成功時の処理
   */
  const handleLoginSuccess = async (loggedInUser: User): Promise<void> => {
    console.log('handleLoginSuccessが呼ばれました:', loggedInUser);
    // onAuthStateChangeのSIGNED_INイベントで自動的にユーザー情報が更新されるため、
    // ここでは何もしない（refreshUser()を呼び出す必要はない）
    // SIGNED_INイベントでセッション情報からユーザー情報が構築される
  };

  /**
   * ログアウト処理
   */
  const handleLogout = async (): Promise<void> => {
    if (confirm('ログアウトしますか？')) {
      setIsLoggingOut(true);
      await signOut();
      setIsLoggingOut(false);
    }
  };

  // ローディング中は何も表示しない（またはローディング表示）
  if (authLoading || isLoadingTodos) {
    return (
      <main 
        className="w-full max-w-7xl mx-auto p-4 md:p-6"
        style={{ 
          backgroundColor: 'var(--bg-main)',
          minHeight: '100vh'
        }}
      >
        <div className="text-center py-20">
          <p style={{ color: '#666666' }}>読み込み中...</p>
        </div>
      </main>
    );
  }

  // ログインしていない場合は会員登録・ログイン画面を表示
  if (!user) {
    return (
      <main 
        className="w-full max-w-7xl mx-auto p-4 md:p-6 flex items-center justify-center"
        style={{ 
          backgroundColor: 'var(--bg-main)',
          minHeight: '100vh'
        }}
      >
        <div
          className="w-full rounded-xl shadow-lg p-8 md:p-12"
          style={{ 
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            maxWidth: '600px'
          }}
        >
          {authView === 'login' ? (
            <LoginForm 
              onSuccess={handleLoginSuccess}
              onSwitchToSignUp={() => setAuthView('signup')}
            />
          ) : (
            <SignUpForm 
              onSuccess={handleSignUpSuccess}
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </div>
      </main>
    );
  }

  // ログインしている場合はTodo画面を表示

  return (
    <main 
      className="w-full max-w-7xl mx-auto p-4 md:p-6"
      style={{ 
        backgroundColor: 'var(--bg-main)',
        minHeight: '100vh'
      }}
    >
      {/* ヘッダー（タイトルとログアウトボタン） */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold" style={{ color: '#000000' }}>
          {user.name}さんのTodo
        </h1>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isLoggingOut ? '#cccccc' : 'var(--button-secondary, #6b7280)',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = 'var(--button-secondary-hover, #4b5563)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = 'var(--button-secondary, #6b7280)';
            }
          }}
        >
          {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
        </button>
      </div>

      <div
        className="w-full rounded-xl shadow-lg p-4 md:p-6"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)'
        }}
      >
        <TodoApp initialTodos={initialTodos} userId={user.id} userName={user.name} />
      </div>
    </main>
  );
}
