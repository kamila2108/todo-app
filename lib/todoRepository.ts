import { Todo } from "@/lib/types/todo";
import { TodoFormValues } from "@/features/todo/types/todo";
import { addCategory } from "@/lib/store/category-store";

let todosStore: Todo[] = [];

export const todoRepository = {
  getAll(): Todo[] {
    return [...todosStore].sort((a, b) => (a.createdAt.getTime() < b.createdAt.getTime() ? 1 : -1));
  },

  create(data: TodoFormValues): Todo {
    const now = new Date();
    
    // dueDateをDateオブジェクトに変換
    let dueDate: Date | undefined = undefined;
    if (data.dueDate) {
      const dateStr = data.dueDate.trim();
      // YYYY-MM-DD形式
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        dueDate = new Date(`${dateStr}T00:00:00`);
      }
      // YYYYMMDD形式
      else if (/^\d{8}$/.test(dateStr)) {
        const year = dateStr.slice(0, 4);
        const month = dateStr.slice(4, 6);
        const day = dateStr.slice(6, 8);
        dueDate = new Date(`${year}-${month}-${day}T00:00:00`);
      }
    }
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      dueDate,
      category: data.category,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    todosStore = [newTodo, ...todosStore];
    
    // カテゴリをストアに追加
    if (data.category) {
      addCategory(data.category);
    }
    
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
