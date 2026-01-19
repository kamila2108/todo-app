import { NextRequest, NextResponse } from "next/server";
import { todoRepository } from "@/lib/todoRepository";
import { todoSchema } from "@/features/todo/schemas/todoSchema";

export function GET(): NextResponse {
  const todos = todoRepository.getAll();
  return NextResponse.json(todos, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const parsed = todoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const todo = todoRepository.create(parsed.data);
  return NextResponse.json(todo, { status: 201 });
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

  return NextResponse.json(updated, { status: 200 });
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
