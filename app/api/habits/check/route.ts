import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(req: Request) {
  const body = await req.json();
  const item = {
    id: crypto.randomUUID(),
    title: String(body.title ?? ''),
    checked: Boolean(body.checked),
    date: body.date ?? new Date().toISOString().slice(0, 10)
  };
  db.habits.push(item);
  return NextResponse.json({ code: 0, data: item });
}
