import { Todo } from '@/lib/types/todo';

// メモリ内のTodoストア（本番環境ではデータベースを使用すべき）
let todos: Todo[] = [];
let nextId = 1;

export function getAllTodos(): Todo[] {
  return [...todos];
}

export function getTodoById(id: string): Todo | undefined {
  return todos.find((todo) => todo.id === id);
}

export function createTodo(title: string, description?: string, dueDate?: Date, category?: string): Todo {
  const now = new Date();
  const todo: Todo = {
    id: `todo-${nextId++}`,
    title,
    description,
    dueDate,
    category,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  todos.push(todo);
  return todo;
}

export function updateTodo(
  id: string,
  updates: { title?: string; description?: string; completed?: boolean; dueDate?: Date; category?: string }
): Todo | null {
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return null;
  }

  Object.assign(todo, {
    ...updates,
    updatedAt: new Date(),
  });

  return { ...todo };
}

export function deleteTodo(id: string): boolean {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return false;
  }
  todos.splice(index, 1);
  return true;
}

export function toggleTodo(id: string): Todo | null {
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return null;
  }

  todo.completed = !todo.completed;
  todo.updatedAt = new Date();

  return { ...todo };
}
