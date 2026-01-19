/**
 * ユーザー名の保存・取得用ユーティリティ
 * localStorageを使用して名前を永続化
 */

const USER_NAME_KEY = 'todo-app-user-name';

/**
 * ユーザー名を保存
 */
export function saveUserName(name: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_NAME_KEY, name.trim());
  }
}

/**
 * ユーザー名を取得
 */
export function getUserName(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_NAME_KEY);
  }
  return null;
}

/**
 * ユーザー名を削除（ログアウト用）
 */
export function clearUserName(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_NAME_KEY);
  }
}

/**
 * ユーザー名が保存されているかチェック
 */
export function hasUserName(): boolean {
  const name = getUserName();
  return name !== null && name.trim().length > 0;
}
