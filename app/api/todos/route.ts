import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  return NextResponse.json({ code: 0, data: serverStore.todos });
}

export async function POST(req: Request) {
  const body = await req.json();
  const now = new Date().toISOString();
  const todo = {
    id: crypto.randomUUID(),
    content: String(body.content ?? ''),
    dueDate: body.dueDate,
    done: false,
    createdAt: now,
    updatedAt: now
  };
  serverStore.todos.unshift(todo);
  return NextResponse.json({ code: 0, data: todo });
}
