"use client";

import { useEffect, useState } from "react";
import { Todo } from "../types/todo";
import { TodoForm } from "../../../components/todo/TodoForm";
import { TodoList } from "../../../components/todo/TodoList";

export interface TodoAppProps {
  initialTodos: Todo[];
}

export const TodoApp: React.FC<TodoAppProps> = ({ initialTodos }) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const refreshTodos = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/todos", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
      // 実運用ではトーストなどで通知
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshTodos();
  }, []);

  const handleCreated = async (): Promise<void> => {
    // Todo作成後にTodoListを更新するためのトリガーを更新
    setRefreshTrigger(prev => prev + 1);
  };

  const handleToggled = async (id: string): Promise<void> => {
    try {
      const response = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to toggle todo");
      }
      await refreshTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleted = async (id: string): Promise<void> => {
    try {
      const url: string = `/api/todos?id=${encodeURIComponent(id)}`;
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      await refreshTodos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <TodoForm onSuccess={handleCreated} />
      <TodoList key={refreshTrigger} onRefresh={refreshTodos} />
    </div>
  );
};
