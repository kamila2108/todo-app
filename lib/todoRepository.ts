import { Todo } from "@/lib/types/todo";
import { TodoFormValues } from "@/features/todo/types/todo";

let todosStore: Todo[] = [];

export const todoRepository = {
  getAll(): Todo[] {
    return [...todosStore].sort((a, b) => (a.createdAt.getTime() < b.createdAt.getTime() ? 1 : -1));
  },

  create(data: TodoFormValues): Todo {
    const now = new Date();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    todosStore = [newTodo, ...todosStore];
    return newTodo;
  },

  toggle(id: string): Todo | undefined {
    let updatedTodo: Todo | undefined;
    todosStore = todosStore.map((todo: Todo) => {
      if (todo.id === id) {
        updatedTodo = { ...todo, completed: !todo.completed, updatedAt: new Date() };
        return updatedTodo;
      }
      return todo;
    });
    return updatedTodo;
  },

  remove(id: string): void {
    todosStore = todosStore.filter((todo: Todo) => todo.id !== id);
  },
};
