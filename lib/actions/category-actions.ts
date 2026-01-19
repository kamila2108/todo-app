'use server';

import { getAllCategories } from '@/lib/store/category-store';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * すべてのカテゴリを取得
 */
export async function getCategories(): Promise<ActionResult<string[]>> {
  try {
    const categories = getAllCategories();
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
