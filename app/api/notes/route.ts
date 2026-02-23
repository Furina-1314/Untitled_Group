import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ code: 0, data: db.notes });
}

export async function POST(req: Request) {
  const body = await req.json();
  const note = {
    id: crypto.randomUUID(),
    title: String(body.title ?? ''),
    content: String(body.content ?? ''),
    tags: Array.isArray(body.tags) ? body.tags : [],
    sessionId: body.sessionId,
    createdAt: new Date().toISOString()
  };
  db.notes.push(note);
  return NextResponse.json({ code: 0, data: note });
}
