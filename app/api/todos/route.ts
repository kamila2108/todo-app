import { NextRequest, NextResponse } from "next/server";
import { todoRepository } from "@/lib/todoRepository";
import { createTodoSchema } from "@/lib/validations/todo";

export function GET(): NextResponse {
  const todos = todoRepository.getAll();
  // DateオブジェクトをISO文字列に変換してJSONで返す
  const serializedTodos = todos.map(todo => ({
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined,
  }));
  return NextResponse.json(serializedTodos, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const parsed = createTodoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const todo = todoRepository.create(parsed.data);
  // DateオブジェクトをISO文字列に変換してJSONで返す
  const serializedTodo = {
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined,
  };
  return NextResponse.json(serializedTodo, { status: 201 });
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const id: unknown = body.id;

  if (typeof id !== "string") {
    return NextResponse.json(
      { message: "Invalid id" },
      { status: 400 }
    );
  }

  const updated = todoRepository.toggle(id);
  if (!updated) {
    return NextResponse.json(
      { message: "Todo not found" },
      { status: 404 }
    );
  }

  // DateオブジェクトをISO文字列に変換してJSONで返す
  const serializedTodo = {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
    dueDate: updated.dueDate ? updated.dueDate.toISOString() : undefined,
  };
  return NextResponse.json(serializedTodo, { status: 200 });
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id: string | null = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "id is required" },
      { status: 400 }
    );
  }

  todoRepository.remove(id);
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
