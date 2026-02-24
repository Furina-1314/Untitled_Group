import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const idx = serverStore.notes.findIndex((n) => n.id === params.id);
  if (idx < 0) return NextResponse.json({ code: 40401, message: 'NOTE_NOT_FOUND' }, { status: 404 });
  serverStore.notes[idx] = { ...serverStore.notes[idx], ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json({ code: 0, data: serverStore.notes[idx] });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  serverStore.notes = serverStore.notes.filter((n) => n.id !== params.id);
  return NextResponse.json({ code: 0, data: true });
}
