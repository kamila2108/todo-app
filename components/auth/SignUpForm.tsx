'use client';

/**
 * 会員登録フォームコンポーネント
 * 
 * 【初心者向け説明】
 * このコンポーネントは、新しいユーザーが会員登録するためのフォームです。
 * 
 * 機能：
 * 1. メールアドレス、パスワード、ユーザー名を入力
 * 2. 入力内容のバリデーション（検証）
 * 3. 会員登録処理の実行
 * 4. エラーメッセージの表示
 */

import { useState } from 'react';
import { signUp } from '@/lib/supabase/auth';
import type { User } from '@/lib/supabase/auth';

interface SignUpFormProps {
  onSuccess: (user: User) => void;
  onSwitchToLogin: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToLogin }: SignUpFormProps): JSX.Element {
  // フォームの状態を管理
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * フォーム送信時の処理
   * 
   * 【初心者向け説明】
   * 1. 入力内容をチェック（バリデーション）
   * 2. 問題がなければ会員登録処理を実行
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

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (!name.trim()) {
      setError('ユーザー名を入力してください');
      return;
    }

    if (name.trim().length > 50) {
      setError('ユーザー名は50文字以内で入力してください');
      return;
    }

    // 会員登録処理
    setIsLoading(true);
    const result = await signUp(email, password, name);

    if (result.error || !result.user) {
      setError(result.error || '会員登録に失敗しました');
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
          会員登録
        </h1>
        <p className="text-sm" style={{ color: '#666666' }}>
          新しいアカウントを作成しましょう
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
            placeholder="6文字以上"
            minLength={6}
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

        {/* パスワード確認入力 */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
            パスワード（確認） <span className="text-red-600">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            placeholder="パスワードを再入力"
            minLength={6}
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

        {/* ユーザー名入力 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
            ユーザー名 <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
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
            disabled={isLoading}
          />
        </div>

        {/* エラーメッセージ表示 */}
        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 登録ボタン */}
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
          {isLoading ? '登録中...' : '会員登録'}
        </button>

        {/* ログイン画面への切り替えリンク */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onSwitchToLogin}
            disabled={isLoading}
            className="text-sm underline hover:no-underline"
            style={{ color: 'var(--button-primary)' }}
          >
            すでにアカウントをお持ちの方はこちら
          </button>
        </div>
      </form>
    </div>
  );
}
