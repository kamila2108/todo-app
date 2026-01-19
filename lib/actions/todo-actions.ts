'use server';

import { z } from 'zod';
import {
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
  toggleTodoSchema,
  type CreateTodoInput,
  type UpdateTodoInput,
  type DeleteTodoInput,
  type ToggleTodoInput,
} from '@/lib/validations/todo';
import {
  getAllTodos,
  createTodo as createTodoInStore,
  updateTodo as updateTodoInStore,
  deleteTodo as deleteTodoInStore,
  toggleTodo as toggleTodoInStore,
} from '@/lib/store/todo-store';
import { addCategory } from '@/lib/store/category-store';
import { Todo } from '@/lib/types/todo';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getTodos(): Promise<ActionResult<Todo[]>> {
  try {
    const todos = getAllTodos();
    return {
      success: true,
      data: todos,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Todoの取得に失敗しました',
    };
  }
}

function parseDueDate(input?: string): Date | undefined {
  if (!input) return undefined;
  const value = input.trim();
  if (!value) return undefined;

  // HTML date input (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }

  // 8桁形式 (YYYYMMDD)
  if (/^\d{8}$/.test(value)) {
    const year = value.slice(0, 4);
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    return new Date(`${year}-${month}-${day}T00:00:00`);
  }

  return undefined;
}

export async function createTodoAction(
  input: CreateTodoInput
): Promise<ActionResult<Todo>> {
  try {
    const validatedInput = createTodoSchema.parse(input);
    const dueDate = parseDueDate(validatedInput.dueDate);
    
    // カテゴリが指定されている場合は、カテゴリストアに追加
    if (validatedInput.category) {
      addCategory(validatedInput.category);
    }
    
    const todo = createTodoInStore(
      validatedInput.title,
      validatedInput.description,
      dueDate,
      validatedInput.category
    );
    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '入力データが不正です',
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Todoの作成に失敗しました',
    };
  }
}

export async function updateTodoAction(
  input: UpdateTodoInput
): Promise<ActionResult<Todo>> {
  try {
    const validatedInput = updateTodoSchema.parse(input);
    const dueDate = parseDueDate(validatedInput.dueDate);
    
    // カテゴリが指定されている場合は、カテゴリストアに追加
    if (validatedInput.category) {
      addCategory(validatedInput.category);
    }
    
    const todo = updateTodoInStore(validatedInput.id, {
      title: validatedInput.title,
      description: validatedInput.description,
      completed: validatedInput.completed,
      dueDate,
      category: validatedInput.category,
    });

    if (!todo) {
      return {
        success: false,
        error: 'Todoが見つかりませんでした',
      };
    }

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '入力データが不正です',
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Todoの更新に失敗しました',
    };
  }
}

export async function deleteTodoAction(
  input: DeleteTodoInput
): Promise<ActionResult<void>> {
  try {
    const validatedInput = deleteTodoSchema.parse(input);
    const deleted = deleteTodoInStore(validatedInput.id);

    if (!deleted) {
      return {
        success: false,
        error: 'Todoが見つかりませんでした',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '入力データが不正です',
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Todoの削除に失敗しました',
    };
  }
}

export async function toggleTodoAction(
  input: ToggleTodoInput
): Promise<ActionResult<Todo>> {
  try {
    const validatedInput = toggleTodoSchema.parse(input);
    const todo = toggleTodoInStore(validatedInput.id);

    if (!todo) {
      return {
        success: false,
        error: 'Todoが見つかりませんでした',
      };
    }

    return {
      success: true,
      data: todo,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: '入力データが不正です',
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Todoの更新に失敗しました',
    };
  }
}
