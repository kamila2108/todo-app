'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoFilter } from '@/lib/types/todo';
import { getTodos } from '@/lib/actions/todo-actions';
import { TodoItem } from './TodoItem';
import { TodoFilterComponent } from './TodoFilter';

interface TodoListProps {
  onRefresh?: () => void;
}

export function TodoList({ onRefresh }: TodoListProps): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    const result = await getTodos();
    if (result.success && result.data) {
      setTodos(result.data);
    } else {
      setError(result.error || 'Todoの取得に失敗しました');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchTodos}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TodoFilterComponent currentFilter={filter} onFilterChange={setFilter} />
      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filter === 'all'
            ? 'Todoがありません'
            : filter === 'active'
            ? '未完了のTodoがありません'
            : '完了したTodoがありません'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
          ))}
        </div>
      )}
    </div>
  );
}
