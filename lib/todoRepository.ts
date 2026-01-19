import { Todo, TodoFormValues } from "@/features/todo/types/todo";

let todosStore: Todo[] = [];

export const todoRepository = {
  getAll(): Todo[] {
    return [...todosStore].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  create(data: TodoFormValues): Todo {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: data.title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    todosStore = [newTodo, ...todosStore];
    return newTodo;
  },

  toggle(id: string): Todo | undefined {
    let updatedTodo: Todo | undefined;
    todosStore = todosStore.map((todo: Todo) => {
      if (todo.id === id) {
        updatedTodo = { ...todo, completed: !todo.completed };
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
