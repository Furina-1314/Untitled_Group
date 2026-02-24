import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const idx = serverStore.todos.findIndex((t) => t.id === params.id);
  if (idx < 0) return NextResponse.json({ code: 40401, message: 'TODO_NOT_FOUND' }, { status: 404 });
  serverStore.todos[idx] = { ...serverStore.todos[idx], ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json({ code: 0, data: serverStore.todos[idx] });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  serverStore.todos = serverStore.todos.filter((t) => t.id !== params.id);
  return NextResponse.json({ code: 0, data: true });
}
