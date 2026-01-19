import { z } from "zod";
import { todoSchema } from "../schemas/todoSchema";

export type TodoFormValues = z.infer<typeof todoSchema>;

// Todo型は lib/types/todo.ts からインポートする
export type { Todo } from "@/lib/types/todo";
