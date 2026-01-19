import { z } from "zod";
import { createTodoSchema } from "@/lib/validations/todo";

export type TodoFormValues = z.infer<typeof createTodoSchema>;

// Todo型は lib/types/todo.ts から直接インポートしてください
// このファイルから再エクスポートしないことで、型の不一致を防ぎます
