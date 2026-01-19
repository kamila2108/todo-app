import { z } from "zod";
import { todoSchema } from "../schemas/todoSchema";
import { createTodoSchema } from "@/lib/validations/todo";

export type TodoFormValues = z.infer<typeof createTodoSchema>;

// Todo型は lib/types/todo.ts からインポートする
export type { Todo } from "@/lib/types/todo";
