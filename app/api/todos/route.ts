import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ code: 0, data: db.todos });
}

export async function POST(req: Request) {
  const body = await req.json();
  const todo = {
    id: crypto.randomUUID(),
    content: String(body.content ?? ''),
    dueDate: body.dueDate,
    done: false
  };
  db.todos.push(todo);
  return NextResponse.json({ code: 0, data: todo });
}
