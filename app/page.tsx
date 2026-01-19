'use client';

import { useState, useEffect } from 'react';
import { TodoApp } from "@/features/todo/components/TodoApp";
import { NameInput } from "@/components/auth/NameInput";
import { Todo } from "@/lib/types/todo";
import { getTodos } from "@/lib/actions/todo-actions";
import { getUserName, hasUserName, saveUserName } from "@/lib/utils/user-storage";

export default function Page() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialTodos, setInitialTodos] = useState<Todo[]>([]);
  const [isLoadingTodos, setIsLoadingTodos] = useState<boolean>(false);

  useEffect(() => {
    // ページ読み込み時に名前を確認
    const loadUser = async (): Promise<void> => {
      if (hasUserName()) {
        const name = getUserName();
        if (name) {
          setUserName(name);
          // Todoデータを取得
          setIsLoadingTodos(true);
          const result = await getTodos(name);
          if (result.success && result.data) {
            setInitialTodos(result.data);
          }
          setIsLoadingTodos(false);
        }
      }
      setIsLoading(false);
    };
    void loadUser();
  }, []);

  const handleStart = async (name: string): Promise<void> => {
    // 名前を保存
    saveUserName(name);
    setUserName(name);
    // Todoデータを取得
    setIsLoadingTodos(true);
    const result = await getTodos(name);
    if (result.success && result.data) {
      setInitialTodos(result.data);
    }
    setIsLoadingTodos(false);
  };

  // ローディング中は何も表示しない（またはローディング表示）
  if (isLoading || isLoadingTodos) {
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

  // 名前が入力されていない場合は名前入力画面を表示
  if (!userName) {
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
          <NameInput onStart={handleStart} />
        </div>
      </main>
    );
  }

  // 名前が入力されている場合はTodo画面を表示
  return (
    <main 
      className="w-full max-w-7xl mx-auto p-4 md:p-6"
      style={{ 
        backgroundColor: 'var(--bg-main)',
        minHeight: '100vh'
      }}
    >
      <div
        className="w-full rounded-xl shadow-lg p-4 md:p-6"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)'
        }}
      >
        <TodoApp initialTodos={initialTodos} userName={userName} />
      </div>
    </main>
  );
}
