import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  return NextResponse.json({ code: 0, data: serverStore.notes });
}

export async function POST(req: Request) {
  const body = await req.json();
  const now = new Date().toISOString();
  const note = {
    id: crypto.randomUUID(),
    title: String(body.title ?? '未命名笔记'),
    content: String(body.content ?? ''),
    tags: Array.isArray(body.tags) ? body.tags : [],
    sessionId: body.sessionId,
    createdAt: now,
    updatedAt: now
  };
  serverStore.notes.unshift(note);
  return NextResponse.json({ code: 0, data: note });
}
