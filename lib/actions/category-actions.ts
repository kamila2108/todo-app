import { getAllCategories } from '@/lib/store/category-store';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 指定されたユーザー名のすべてのカテゴリを取得（localStorageベース）
 */
export async function getCategories(userName: string): Promise<ActionResult<string[]>> {
  try {
    const categories = getAllCategories(userName);
    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'カテゴリの取得に失敗しました',
    };
  }
}
