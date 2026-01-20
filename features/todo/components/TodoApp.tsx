"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/lib/types/todo";
import { TodoForm } from "../../../components/todo/TodoForm";
import { TodoList } from "../../../components/todo/TodoList";
import { clearUserName } from "@/lib/utils/user-storage";

export interface TodoAppProps {
  initialTodos: Todo[];
  userName: string;
}

export const TodoApp: React.FC<TodoAppProps> = ({ initialTodos, userName }) => {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleCreated = async (): Promise<void> => {
    // Todo作成後にTodoListを更新するためのトリガーを更新
    setRefreshTrigger((prev: number) => prev + 1);
  };

  const handleLogout = (): void => {
    // 名前を削除してログアウト
    clearUserName();
    // ページをリロードして名前入力画面を表示
    window.location.reload();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start w-full todo-columns-container">
      {/* 左側：入力エリア */}
      <div className="todo-container-left w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-center md:text-left text-2xl font-bold" style={{ color: '#000000' }}>
            {userName}さんのTodo
          </h1>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm rounded-md transition-colors"
            style={{
              backgroundColor: 'var(--button-secondary)',
              color: '#000000'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--button-sub)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--button-secondary)';
              e.currentTarget.style.color = '#000000';
            }}
          >
            ログアウト
          </button>
        </div>
        <TodoForm userName={userName} onSuccess={handleCreated} />
      </div>

      {/* 右側：Todo一覧エリア */}
      <div className="todo-container-right w-full">
        <TodoList userName={userName} key={refreshTrigger} />
      </div>
    </div>
  );
};
