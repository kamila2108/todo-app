'use client';

import { useState } from 'react';
import { Todo } from '@/lib/types/todo';
import { toggleTodoAction, deleteTodoAction } from '@/lib/actions/todo-actions';

interface TodoItemProps {
  userName: string;
  todo: Todo;
  onUpdate?: () => void;
}

export function TodoItem({ userName, todo, onUpdate }: TodoItemProps): JSX.Element {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  const handleToggle = async (): Promise<void> => {
    // スクロール位置を保存（チェックボックス更新前に）
    const scrollY = window.scrollY || window.pageYOffset || 0;
    
    setIsToggling(true);
    const result = await toggleTodoAction(userName, { id: todo.id });
    setIsToggling(false);
    if (result.success) {
      // スクロール位置を復元
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'auto',
        });
      });
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
    const result = await deleteTodoAction(userName, { id: todo.id });
    setIsDeleting(false);
    if (result.success) {
      onUpdate?.();
    } else {
      alert(result.error || 'Todo delete failed');
    }
  };

  return (
    <div
      className="p-4 border rounded-lg shadow-sm transition-all"
      style={{
        backgroundColor: todo.completed ? '#CCE2ED' : '#FFFFFF',
        borderColor: 'var(--border-default)',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isToggling}
          className="mt-1 h-5 w-5 rounded cursor-pointer disabled:opacity-50"
          style={{
            accentColor: 'var(--accent-checkbox)',
            borderColor: 'var(--border-default)'
          }}
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
          <div className="mt-2 flex flex-wrap gap-2 items-center">
            {todo.category && (
              <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: todo.completed ? 'rgba(223, 182, 178, 0.5)' : 'var(--color-accent)',
                color: 'var(--text-color)'
              }}
              >
                {todo.category}
              </span>
            )}
            {todo.dueDate && (
              <p
                className={`text-xs ${
                  todo.completed
                    ? 'text-gray-400'
                    : new Date(todo.dueDate) < new Date()
                    ? 'text-red-600 font-semibold'
                    : 'text-gray-500'
                }`}
              >
                期日:{' '}
                {new Date(todo.dueDate).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </p>
            )}
          </div>
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