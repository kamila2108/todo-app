'use client';

/**
 * ログインフォームコンポーネント
 * 
 * 【初心者向け説明】
 * このコンポーネントは、既存のユーザーがログインするためのフォームです。
 * 
 * 機能：
 * 1. メールアドレスとパスワードを入力
 * 2. 入力内容のバリデーション（検証）
 * 3. ログイン処理の実行
 * 4. エラーメッセージの表示
 */

import { useState } from 'react';
import { signIn } from '@/lib/supabase/auth';
import type { User } from '@/lib/supabase/auth';

interface LoginFormProps {
  onSuccess: (user: User) => void;
  onSwitchToSignUp: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignUp }: LoginFormProps): JSX.Element {
  // フォームの状態を管理
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * フォーム送信時の処理
   * 
   * 【初心者向け説明】
   * 1. 入力内容をチェック（バリデーション）
   * 2. 問題がなければログイン処理を実行
   * 3. 成功したら親コンポーネントに通知
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    // バリデーション（入力内容のチェック）
    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    // メールアドレスの形式チェック（簡単なチェック）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('正しいメールアドレスを入力してください');
      return;
    }

    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    // ログイン処理
    setIsLoading(true);
    const result = await signIn(email, password);

    if (result.error || !result.user) {
      setError(result.error || 'ログインに失敗しました');
      setIsLoading(false);
      return;
    }

    // 成功したら親コンポーネントに通知
    setIsLoading(false);
    onSuccess(result.user);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
          ログイン
        </h1>
        <p className="text-sm" style={{ color: '#666666' }}>
          アカウントにログインしましょう
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* メールアドレス入力 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
            メールアドレス <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="example@email.com"
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
            disabled={isLoading}
            autoFocus
          />
        </div>

        {/* パスワード入力 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
            パスワード <span className="text-red-600">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="パスワードを入力"
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
            disabled={isLoading}
          />
        </div>

        {/* エラーメッセージ表示 */}
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* ログインボタン */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isLoading ? '#cccccc' : 'var(--button-primary)',
            color: '#FFFFFF'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--button-primary-hover)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = 'var(--button-primary)';
            }
          }}
          onFocus={(e) => {
            if (!isLoading) {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(133, 79, 108, 0.2)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '';
          }}
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>

        {/* 会員登録画面への切り替えリンク */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onSwitchToSignUp}
            disabled={isLoading}
            className="text-sm underline hover:no-underline"
            style={{ color: 'var(--button-primary)' }}
          >
            アカウントをお持ちでない方はこちら
          </button>
        </div>
      </form>
    </div>
  );
}
