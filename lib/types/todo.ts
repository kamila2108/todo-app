export interface Todo {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  category?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoFilter = 'all' | 'active' | 'completed';
