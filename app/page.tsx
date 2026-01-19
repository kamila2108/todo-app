import { TodoApp } from "@/features/todo/components/TodoApp";
import { Todo } from "@/lib/types/todo";
import { getAllTodos } from "@/lib/store/todo-store";

export default function Page() {
  const initialTodos: Todo[] = getAllTodos();

  return (
    <main 
      className="w-full max-w-7xl mx-auto p-4 md:p-6"
      style={{ 
        backgroundColor: 'var(--bg-main)',
        minHeight: '100vh'
      }}
    >
      <div
        className="w-full rounded-xl shadow-lg p-4 md:p-6"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)'
        }}
      >
        <TodoApp initialTodos={initialTodos} />
      </div>
    </main>
  );
}
