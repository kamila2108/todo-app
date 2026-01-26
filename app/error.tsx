'use client';

/**
 * エラーバウンダリコンポーネント
 * アプリ全体で発生したエラーをキャッチして表示
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  // AbortErrorは無視（開発モードでのReact Strict Modeによるもの）
  if (error.name === 'AbortError') {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
