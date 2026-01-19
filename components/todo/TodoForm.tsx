'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { createTodoSchema, type CreateTodoInput } from '@/lib/validations/todo';
import { createTodoAction } from '@/lib/actions/todo-actions';
import { getCategories } from '@/lib/actions/category-actions';

interface TodoFormProps {
  onSuccess?: () => void;
}

export function TodoForm({ onSuccess }: TodoFormProps): JSX.Element {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryInputMode, setCategoryInputMode] = useState<'select' | 'input'>('select');
  const [newCategory, setNewCategory] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      category: '',
    },
  });

  const selectedCategory = watch('category');

  // カテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    };
    void fetchCategories();
  }, []);

  // カテゴリモード変更時の処理
  useEffect(() => {
    if (categoryInputMode === 'input') {
      setValue('category', newCategory);
    } else {
      setValue('category', selectedCategory || '');
    }
  }, [categoryInputMode, newCategory, selectedCategory, setValue]);

  const onSubmit = async (data: CreateTodoInput): Promise<void> => {
    // カテゴリモードが「新規入力」の場合、入力された値を設定
    if (categoryInputMode === 'input' && newCategory.trim()) {
      data.category = newCategory.trim();
    }
    
    const result = await createTodoAction(data);
    if (result.success) {
      reset();
      setNewCategory('');
      setCategoryInputMode('select');
      // カテゴリ一覧を再取得
      const categoryResult = await getCategories();
      if (categoryResult.success && categoryResult.data) {
        setCategories(categoryResult.data);
      }
      onSuccess?.();
    } else {
      alert(result.error || 'Todoの作成に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: 'var(--border-default)',
            color: 'var(--text-color)',
            backgroundColor: '#FFFFFF'
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--focus-border)';
            (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(133, 79, 108, 0.2)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--border-default)';
            (e.target as HTMLInputElement).style.boxShadow = '';
          }}
          placeholder="Todoのタイトルを入力"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
          説明
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: '#98AEDE',
            color: '#000000',
            backgroundColor: '#FFFFFF'
          }}
          onFocus={(e) => {
            (e.target as HTMLTextAreaElement).style.borderColor = 'var(--focus-border)';
            (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 2px rgba(133, 79, 108, 0.2)';
          }}
          onBlur={(e) => {
            (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border-default)';
            (e.target as HTMLTextAreaElement).style.boxShadow = '';
          }}
          placeholder="Todoの説明を入力（任意）"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-black mb-1">
          期日（任意）
        </label>
        <input
          id="dueDate"
          type="date"
          min="1000-01-01"
          max="9999-12-31"
          {...register('dueDate')}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: 'var(--border-default)',
            color: 'var(--text-color)',
            backgroundColor: '#FFFFFF'
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--focus-border)';
            (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(133, 79, 108, 0.2)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--border-default)';
            (e.target as HTMLInputElement).style.boxShadow = '';
          }}
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          カテゴリ（任意）
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setCategoryInputMode('select');
                setNewCategory('');
              }}
              className="px-3 py-1 text-sm rounded-md transition-colors"
              style={{
                backgroundColor: categoryInputMode === 'select' ? 'var(--button-sub)' : 'var(--button-secondary)',
                color: categoryInputMode === 'select' ? '#FFFFFF' : 'var(--text-color)'
              }}
              onMouseEnter={(e) => {
                if (categoryInputMode !== 'select') {
                  e.currentTarget.style.backgroundColor = 'var(--button-sub)';
                }
              }}
              onMouseLeave={(e) => {
                if (categoryInputMode !== 'select') {
                  e.currentTarget.style.backgroundColor = 'var(--button-secondary)';
                }
              }}
            >
              既存から選択
            </button>
            <button
              type="button"
              onClick={() => {
                setCategoryInputMode('input');
                setValue('category', '');
              }}
              className="px-3 py-1 text-sm rounded-md transition-colors"
              style={{
                backgroundColor: categoryInputMode === 'input' ? 'var(--button-sub)' : 'var(--button-secondary)',
                color: categoryInputMode === 'input' ? '#FFFFFF' : 'var(--text-color)'
              }}
              onMouseEnter={(e) => {
                if (categoryInputMode !== 'input') {
                  e.currentTarget.style.backgroundColor = 'var(--button-sub)';
                }
              }}
              onMouseLeave={(e) => {
                if (categoryInputMode !== 'input') {
                  e.currentTarget.style.backgroundColor = 'var(--button-secondary)';
                }
              }}
            >
              新規作成
            </button>
          </div>

          {categoryInputMode === 'select' ? (
            <select
              {...register('category')}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: '#98AEDE',
            color: '#000000',
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
              <option value="">カテゴリを選択（任意）</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setValue('category', e.target.value);
              }}
              placeholder="新しいカテゴリ名を入力"
              maxLength={50}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2"
          style={{
            borderColor: 'var(--border-default)',
            color: 'var(--text-color)',
            backgroundColor: '#FFFFFF'
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--focus-border)';
            (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(133, 79, 108, 0.2)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--border-default)';
            (e.target as HTMLInputElement).style.boxShadow = '';
          }}
            />
          )}
        </div>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{
          backgroundColor: 'var(--button-primary)',
          color: '#FFFFFF'
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.backgroundColor = 'var(--button-primary)';
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(133, 79, 108, 0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = '';
        }}
      >
        {isSubmitting ? '作成中...' : 'Todoを作成'}
      </button>
    </form>
  );
}
