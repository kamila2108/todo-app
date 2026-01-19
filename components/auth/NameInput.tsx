'use client';

import { useState } from 'react';
import { saveUserName } from '@/lib/utils/user-storage';

interface NameInputProps {
  onStart: (name: string) => void;
}

export function NameInput({ onStart }: NameInputProps): JSX.Element {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('名前を入力してください');
      return;
    }

    if (trimmedName.length > 50) {
      setError('名前は50文字以内で入力してください');
      return;
    }

    // 名前を保存
    saveUserName(trimmedName);
    setError('');
    onStart(trimmedName);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
          Todo アプリへようこそ
        </h1>
        <p className="text-sm" style={{ color: '#666666' }}>
          名前を入力して始めましょう
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
            お名前 <span className="text-red-600">*</span>
          </label>
          <input
            id="userName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="お名前を入力"
            maxLength={50}
            className="w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border-default)',
              color: '#000000',
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
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium"
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
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(133, 79, 108, 0.2)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '';
          }}
        >
          開始
        </button>
      </form>
    </div>
  );
}
