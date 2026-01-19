/**
 * ユーザー名ごとのカテゴリ管理（localStorage使用）
 */

// localStorageのキー生成
function getCategoriesKey(userName: string): string {
  return `todo-categories-${userName}`;
}

// ユーザーのカテゴリを取得
function getCategoriesFromStorage(userName: string): string[] {
  if (typeof window === 'undefined') return [];
  const key = getCategoriesKey(userName);
  const data = localStorage.getItem(key);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// ユーザーのカテゴリを保存
function saveCategoriesToStorage(userName: string, categories: string[]): void {
  if (typeof window === 'undefined') return;
  const key = getCategoriesKey(userName);
  localStorage.setItem(key, JSON.stringify(categories));
}

/**
 * 指定されたユーザーのすべてのカテゴリを取得
 */
export function getAllCategories(userName: string): string[] {
  return getCategoriesFromStorage(userName);
}

/**
 * 指定されたユーザーのカテゴリを追加（重複チェック）
 */
export function addCategory(userName: string, category: string): void {
  const trimmed = category.trim();
  if (!trimmed) return;
  
  const categories = getCategoriesFromStorage(userName);
  if (!categories.includes(trimmed)) {
    categories.push(trimmed);
    saveCategoriesToStorage(userName, categories);
  }
}

/**
 * 指定されたユーザーのカテゴリを削除
 */
export function removeCategory(userName: string, category: string): void {
  const categories = getCategoriesFromStorage(userName);
  const index = categories.indexOf(category);
  if (index > -1) {
    categories.splice(index, 1);
    saveCategoriesToStorage(userName, categories);
  }
}

/**
 * 指定されたユーザーのカテゴリが存在するかチェック
 */
export function hasCategory(userName: string, category: string): boolean {
  const categories = getCategoriesFromStorage(userName);
  return categories.includes(category.trim());
}
