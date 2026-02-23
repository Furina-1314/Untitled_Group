import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function POST(req: Request) {
  const body = await req.json();
  const id = String(body.id ?? '');
  const idx = serverStore.habits.findIndex((h) => h.id === id);
  if (idx < 0) return NextResponse.json({ code: 40401, message: 'HABIT_NOT_FOUND' }, { status: 404 });
  serverStore.habits[idx] = { ...serverStore.habits[idx], completed: Boolean(body.completed), updatedAt: new Date().toISOString() };
  return NextResponse.json({ code: 0, data: serverStore.habits[idx] });
}
