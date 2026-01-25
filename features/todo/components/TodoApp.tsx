"use client";

/**
 * TodoAppコンポーネント
 * 
 * 【初心者向け説明】
 * このコンポーネントは、Todoアプリのメイン画面です。
 * Todoの作成・表示・管理を行います。
 */

import { useState } from "react";
import { Todo } from "@/lib/types/todo";
import { TodoForm } from "../../../components/todo/TodoForm";
import { TodoList } from "../../../components/todo/TodoList";

export interface TodoAppProps {
  initialTodos: Todo[];
  userId: string;
  userName: string;
}

export const TodoApp: React.FC<TodoAppProps> = ({ initialTodos, userId, userName }) => {
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleCreated = async (): Promise<void> => {
    // Todo作成後にTodoListを更新するためのトリガーを更新
    setRefreshTrigger((prev: number) => prev + 1);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Todoアプリ本体 */}
      <div className="flex flex-col md:flex-row md:items-start w-full todo-columns-container">
        {/* 左側：入力エリア */}
        <div className="todo-container-left w-full">
          <TodoForm userId={userId} onSuccess={handleCreated} />
        </div>

        {/* 右側：Todo一覧エリア */}
        <div className="todo-container-right w-full">
          <TodoList userId={userId} key={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};
