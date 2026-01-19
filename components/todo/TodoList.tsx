'use client';

import { useState, useEffect, useRef } from 'react';
import { Todo, TodoFilter } from '@/lib/types/todo';
import { getTodos } from '@/lib/actions/todo-actions';
import { getCategories } from '@/lib/actions/category-actions';
import { TodoItem } from './TodoItem';
import { TodoFilterComponent } from './TodoFilter';

interface TodoListProps {
  onRefresh?: () => void;
}

export function TodoList({ onRefresh }: TodoListProps): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollPositionRef = useRef<number>(0);

  const fetchTodos = async (): Promise<void> => {
    // スクロール位置を保存
    scrollPositionRef.current = window.scrollY || window.pageYOffset || 0;

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
    const fetchCategories = async (): Promise<void> => {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    };
    void fetchCategories();
  }, []);

  // Todo作成後にカテゴリ一覧を更新
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    };
    void fetchCategories();
  }, [todos]);

  // スクロール位置を復元
  useEffect(() => {
    if (scrollPositionRef.current > 0 && !isLoading) {
      // 少し遅延を入れて、DOMの更新を待つ
      const timer = setTimeout(() => {
        window.scrollTo({
          top: scrollPositionRef.current,
          behavior: 'auto', // アニメーションなしで即座に移動
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [todos, isLoading]);

  const filteredTodos = todos.filter((todo) => {
    // ステータスフィルター
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    
    // カテゴリフィルター
    if (selectedCategory) {
      if (!todo.category || todo.category !== selectedCategory) return false;
    }
    
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
          className="mt-4 px-4 py-2 rounded-md transition-colors"
          style={{
            backgroundColor: 'var(--button-primary)',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--button-primary)';
          }}
        >
          再試行
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TodoFilterComponent currentFilter={filter} onFilterChange={setFilter} />
      
      {/* カテゴリフィルター */}
      <div>
        <label htmlFor="categoryFilter" className="block text-sm font-medium text-black mb-1">
          カテゴリで絞り込み
        </label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: 'var(--border-default)',
            color: 'var(--text-color)',
            backgroundColor: '#FFFFFF'
          }}
          onFocus={(e) => {
            (e.target as HTMLSelectElement).style.borderColor = 'var(--focus-border)';
            (e.target as HTMLSelectElement).style.boxShadow = '0 0 0 2px rgba(133, 79, 108, 0.2)';
          }}
          onBlur={(e) => {
            (e.target as HTMLSelectElement).style.borderColor = 'var(--border-default)';
            (e.target as HTMLSelectElement).style.boxShadow = '';
          }}
        >
          <option value="">すべてのカテゴリ</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {selectedCategory
            ? `カテゴリ「${selectedCategory}」のTodoがありません`
            : filter === 'all'
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
