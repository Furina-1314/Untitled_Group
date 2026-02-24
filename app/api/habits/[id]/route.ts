import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const idx = serverStore.habits.findIndex((h) => h.id === params.id);
  if (idx < 0) return NextResponse.json({ code: 40401, message: 'HABIT_NOT_FOUND' }, { status: 404 });
  serverStore.habits[idx] = { ...serverStore.habits[idx], ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json({ code: 0, data: serverStore.habits[idx] });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  serverStore.habits = serverStore.habits.filter((h) => h.id !== params.id);
  return NextResponse.json({ code: 0, data: true });
}
