// カテゴリ管理用のストア（メモリ内）
let categories: string[] = [];

/**
 * すべてのカテゴリを取得
 */
export function getAllCategories(): string[] {
  return [...categories];
}

/**
 * カテゴリを追加（重複チェック）
 */
export function addCategory(category: string): void {
  const trimmed = category.trim();
  if (trimmed && !categories.includes(trimmed)) {
    categories.push(trimmed);
  }
}

/**
 * カテゴリを削除
 */
export function removeCategory(category: string): void {
  const index = categories.indexOf(category);
  if (index > -1) {
    categories.splice(index, 1);
  }
}

/**
 * カテゴリが存在するかチェック
 */
export function hasCategory(category: string): boolean {
  return categories.includes(category.trim());
}
