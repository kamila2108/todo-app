/**
 * TodoデータのSupabase操作
 */

import { supabase } from './client';
import type { Todo } from '@/lib/types/todo';

/**
 * 指定されたユーザーのすべてのTodoを取得
 * @param userId ユーザーID
 * @returns Todo配列
 */
export async function getTodosByUserId(userId: string): Promise<Todo[]> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Todo取得エラー:', error);
      return [];
    }

    // データベースのデータをTodo型に変換
    return (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || undefined,
      dueDate: item.due_date ? new Date(item.due_date) : undefined,
      category: item.category || undefined,
      completed: item.completed,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
    }));
  } catch (error) {
    console.error('Todo取得エラー:', error);
    return [];
  }
}

/**
 * Todoを作成
 * @param userId ユーザーID
 * @param todoData Todoデータ
 * @returns 作成されたTodo
 */
export async function createTodo(
  userId: string,
  todoData: {
    title: string;
    description?: string;
    dueDate?: Date;
    category?: string;
  }
): Promise<Todo | null> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .insert({
        user_id: userId,
        title: todoData.title,
        description: todoData.description || null,
        due_date: todoData.dueDate ? todoData.dueDate.toISOString().split('T')[0] : null,
        category: todoData.category || null,
        completed: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Todo作成エラー:', error);
      return null;
    }

    // データベースのデータをTodo型に変換
    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      category: data.category || undefined,
      completed: data.completed,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('Todo作成エラー:', error);
    return null;
  }
}

/**
 * Todoを更新
 * @param userId ユーザーID
 * @param todoId Todo ID
 * @param updates 更新データ
 * @returns 更新されたTodo
 */
export async function updateTodo(
  userId: string,
  todoId: string,
  updates: {
    title?: string;
    description?: string;
    completed?: boolean;
    dueDate?: Date;
    category?: string;
  }
): Promise<Todo | null> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description || null;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.dueDate !== undefined) {
      updateData.due_date = updates.dueDate ? updates.dueDate.toISOString().split('T')[0] : null;
    }
    if (updates.category !== undefined) updateData.category = updates.category || null;

    const { data, error } = await supabase
      .from('todos')
      .update(updateData)
      .eq('id', todoId)
      .eq('user_id', userId) // セキュリティ：ユーザーIDも確認
      .select()
      .single();

    if (error) {
      console.error('Todo更新エラー:', error);
      return null;
    }

    // データベースのデータをTodo型に変換
    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      dueDate: data.due_date ? new Date(data.due_date) : undefined,
      category: data.category || undefined,
      completed: data.completed,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('Todo更新エラー:', error);
    return null;
  }
}

/**
 * Todoを削除
 * @param userId ユーザーID
 * @param todoId Todo ID
 * @returns 削除成功かどうか
 */
export async function deleteTodo(userId: string, todoId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', userId); // セキュリティ：ユーザーIDも確認

    if (error) {
      console.error('Todo削除エラー:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Todo削除エラー:', error);
    return false;
  }
}

/**
 * Todoの完了状態を切り替え
 * @param userId ユーザーID
 * @param todoId Todo ID
 * @returns 更新されたTodo
 */
export async function toggleTodo(userId: string, todoId: string): Promise<Todo | null> {
  try {
    // 現在のTodoを取得
    const { data: currentTodo, error: fetchError } = await supabase
      .from('todos')
      .select('completed')
      .eq('id', todoId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !currentTodo) {
      console.error('Todo取得エラー:', fetchError);
      return null;
    }

    // 完了状態を反転
    return await updateTodo(userId, todoId, {
      completed: !currentTodo.completed,
    });
  } catch (error) {
    console.error('Todo切り替えエラー:', error);
    return null;
  }
}
