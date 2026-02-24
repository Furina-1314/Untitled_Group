import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const idx = serverStore.diaries.findIndex((d) => d.id === params.id);
  if (idx < 0) return NextResponse.json({ code: 40401, message: 'DIARY_NOT_FOUND' }, { status: 404 });
  serverStore.diaries[idx] = { ...serverStore.diaries[idx], ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json({ code: 0, data: serverStore.diaries[idx] });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  serverStore.diaries = serverStore.diaries.filter((d) => d.id !== params.id);
  return NextResponse.json({ code: 0, data: true });
}
