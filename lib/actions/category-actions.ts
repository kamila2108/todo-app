import { getCategoriesByUserId } from '@/lib/supabase/categories';
import { getUserByName } from '@/lib/supabase/auth';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * 指定されたユーザー名のすべてのカテゴリを取得
 */
export async function getCategories(userName: string): Promise<ActionResult<string[]>> {
  try {
    const user = await getUserByName(userName);
    if (!user) {
      return {
        success: false,
        error: 'ユーザーが見つかりませんでした',
      };
    }

    const categories = await getCategoriesByUserId(user.id);
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
