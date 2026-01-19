import { TodoApp } from "@/features/todo/components/TodoApp";
import { Todo } from "@/lib/types/todo";
import { getAllTodos } from "@/lib/store/todo-store";

export default function Page() {
  const initialTodos: Todo[] = getAllTodos();

  return (
    <main className="w-full max-w-xl rounded-xl bg-slate-800 p-6 shadow-lg">
      <h1 className="mb-4 text-center text-2xl font-bold text-slate-50">
        Todo アプリ
      </h1>
      <TodoApp initialTodos={initialTodos} />
    </main>
  );
}
