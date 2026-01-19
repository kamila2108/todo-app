import { Todo } from '@/lib/types/todo';

/**
 * ユーザー名ごとのTodoデータをlocalStorageに保存・取得
 */

// localStorageのキー生成
function getTodosKey(userName: string): string {
  return `todo-data-${userName}`;
}

function getNextIdKey(userName: string): string {
  return `todo-next-id-${userName}`;
}

// Dateオブジェクトを文字列に変換（保存用）
function serializeTodos(todos: Todo[]): string {
  return JSON.stringify(todos.map(todo => ({
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined,
  })));
}

// 文字列をDateオブジェクトに変換（取得用）
function deserializeTodos(json: string): Todo[] {
  const data = JSON.parse(json);
  return data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
  }));
}

// ユーザーのTodoデータを取得
function getTodosFromStorage(userName: string): Todo[] {
  if (typeof window === 'undefined') return [];
  const key = getTodosKey(userName);
  const data = localStorage.getItem(key);
  if (!data) return [];
  try {
    return deserializeTodos(data);
  } catch {
    return [];
  }
}

// ユーザーのTodoデータを保存
function saveTodosToStorage(userName: string, todos: Todo[]): void {
  if (typeof window === 'undefined') return;
  const key = getTodosKey(userName);
  localStorage.setItem(key, serializeTodos(todos));
}

// 次IDを取得
function getNextId(userName: string): number {
  if (typeof window === 'undefined') return 1;
  const key = getNextIdKey(userName);
  const current = localStorage.getItem(key);
  const next = current ? parseInt(current, 10) + 1 : 1;
  localStorage.setItem(key, next.toString());
  return next;
}

/**
 * 指定されたユーザーのすべてのTodoを取得
 */
export function getAllTodos(userName: string): Todo[] {
  return getTodosFromStorage(userName);
}

/**
 * 指定されたユーザーのTodoをIDで取得
 */
export function getTodoById(userName: string, id: string): Todo | undefined {
  const todos = getTodosFromStorage(userName);
  return todos.find((todo) => todo.id === id);
}

/**
 * 指定されたユーザーのTodoを作成
 */
export function createTodo(userName: string, title: string, description?: string, dueDate?: Date, category?: string): Todo {
  const now = new Date();
  const todo: Todo = {
    id: `todo-${getNextId(userName)}`,
    title,
    description,
    dueDate,
    category,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  
  const todos = getTodosFromStorage(userName);
  todos.push(todo);
  saveTodosToStorage(userName, todos);
  
  return todo;
}

/**
 * 指定されたユーザーのTodoを更新
 */
export function updateTodo(
  userName: string,
  id: string,
  updates: { title?: string; description?: string; completed?: boolean; dueDate?: Date; category?: string }
): Todo | null {
  const todos = getTodosFromStorage(userName);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return null;
  }

  Object.assign(todo, {
    ...updates,
    updatedAt: new Date(),
  });
  
  saveTodosToStorage(userName, todos);
  
  return { ...todo };
}

/**
 * 指定されたユーザーのTodoを削除
 */
export function deleteTodo(userName: string, id: string): boolean {
  const todos = getTodosFromStorage(userName);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return false;
  }
  todos.splice(index, 1);
  saveTodosToStorage(userName, todos);
  return true;
}

/**
 * 指定されたユーザーのTodoを切り替え
 */
export function toggleTodo(userName: string, id: string): Todo | null {
  const todos = getTodosFromStorage(userName);
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return null;
  }

  todo.completed = !todo.completed;
  todo.updatedAt = new Date();
  
  saveTodosToStorage(userName, todos);
  
  return { ...todo };
}
