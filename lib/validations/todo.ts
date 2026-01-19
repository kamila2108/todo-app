import { z } from 'zod';

// Todo作成用のスキーマ
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  description: z.string().optional(),
  // 期日（任意）: YYYYMMDD または YYYY-MM-DD 形式の文字列、空文字列はundefinedに変換
  dueDate: z
    .union([z.string(), z.literal('')])
    .optional()
    .transform((val) => (val === '' || !val ? undefined : val))
    .refine(
      (val) => !val || /^(?:\d{8}|\d{4}-\d{2}-\d{2})$/.test(val),
      '期日はYYYYMMDDまたはYYYY-MM-DD形式で入力してください'
    ),
});

// Todo更新用のスキーマ
export const updateTodoSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください')
    .optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  dueDate: z
    .union([z.string(), z.literal('')])
    .optional()
    .transform((val) => (val === '' || !val ? undefined : val))
    .refine(
      (val) => !val || /^(?:\d{8}|\d{4}-\d{2}-\d{2})$/.test(val),
      '期日はYYYYMMDDまたはYYYY-MM-DD形式で入力してください'
    ),
});

// Todo削除用のスキーマ
export const deleteTodoSchema = z.object({
  id: z.string(),
});

// Todo切り替え用のスキーマ
export const toggleTodoSchema = z.object({
  id: z.string(),
});

// 型定義
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>;
export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>;
