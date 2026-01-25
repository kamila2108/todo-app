import { getCategoriesByUserId } from '@/lib/supabase/categories';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 指定されたユーザーIDのすべてのカテゴリを取得
 */
export async function getCategories(userId: string): Promise<ActionResult<string[]>> {
  try {
    const categories = await getCategoriesByUserId(userId);
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
