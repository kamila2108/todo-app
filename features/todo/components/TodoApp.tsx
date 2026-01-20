"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/lib/types/todo";
import { TodoForm } from "../../../components/todo/TodoForm";
import { TodoList } from "../../../components/todo/TodoList";

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

  return (
    <div className="flex flex-col md:flex-row md:items-start w-full todo-columns-container">
      {/* 左側：入力エリア */}
      <div className="todo-container-left w-full">
        <h1 className="mb-4 text-center md:text-left text-2xl font-bold" style={{ color: '#000000' }}>
          {userName}さんのTodo
        </h1>
        <TodoForm userName={userName} onSuccess={handleCreated} />
      </div>

      {/* 右側：Todo一覧エリア */}
      <div className="todo-container-right w-full">
        <TodoList userName={userName} key={refreshTrigger} />
      </div>
    </div>
  );
};
