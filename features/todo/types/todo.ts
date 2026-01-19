import { z } from "zod";
import { todoSchema } from "../schemas/todoSchema";

export type TodoFormValues = z.infer<typeof todoSchema>;

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}
