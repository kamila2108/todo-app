'use client';

import { TodoFilter } from '@/lib/types/todo';

interface TodoFilterProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

const filterOptions: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了' },
];

export function TodoFilterComponent({
  currentFilter,
  onFilterChange,
}: TodoFilterProps): JSX.Element {
  return (
    <div className="flex gap-2">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          style={{
            backgroundColor: currentFilter === option.value ? 'var(--button-sub)' : 'var(--button-secondary)',
            color: currentFilter === option.value ? '#FFFFFF' : 'var(--text-color)'
          }}
          onMouseEnter={(e) => {
            if (currentFilter !== option.value) {
              e.currentTarget.style.backgroundColor = 'var(--button-sub)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentFilter !== option.value) {
              e.currentTarget.style.backgroundColor = 'var(--button-secondary)';
            }
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
