'use client';

import { useState } from 'react';
import { Todo } from '@/lib/types/todo';
import { toggleTodoAction, deleteTodoAction } from '@/lib/actions/todo-actions';

interface TodoItemProps {
  todo: Todo;
  onUpdate?: () => void;
}

export function TodoItem({ todo, onUpdate }: TodoItemProps): JSX.Element {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  const handleToggle = async (): Promise<void> => {
    setIsToggling(true);
    const result = await toggleTodoAction({ id: todo.id });
    setIsToggling(false);
    if (result.success) {
      onUpdate?.();
    } else {
      alert(result.error || 'Todo update failed');
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm('Delete this todo?')) {
      return;
    }
    setIsDeleting(true);
    const result = await deleteTodoAction({ id: todo.id });
    setIsDeleting(false);
    if (result.success) {
      onUpdate?.();
    } else {
      alert(result.error || 'Todo delete failed');
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm transition-all ${
        todo.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isToggling}
          className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:opacity-50"
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium ${
              todo.completed
                ? 'text-gray-500 line-through'
                : 'text-gray-900'
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p
              className={`mt-1 text-sm ${
                todo.completed ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {todo.description}
            </p>
          )}
          {todo.dueDate && (
            <p
              className={`mt-1 text-xs ${
                todo.completed
                  ? 'text-gray-400'
                  : todo.dueDate < new Date()
                  ? 'text-red-600 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              期日:{' '}
              {todo.dueDate.toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="ml-2 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}