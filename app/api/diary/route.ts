import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  return NextResponse.json({ code: 0, data: serverStore.diaries });
}

export async function POST(req: Request) {
  const body = await req.json();
  const now = new Date().toISOString();
  const entry = {
    id: crypto.randomUUID(),
    date: String(body.date ?? new Date().toISOString().slice(0, 10)),
    title: String(body.title ?? '未命名日记'),
    content: String(body.content ?? ''),
    createdAt: now,
    updatedAt: now
  };
  serverStore.diaries.unshift(entry);
  return NextResponse.json({ code: 0, data: entry });
}
