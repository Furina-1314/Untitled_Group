import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  return NextResponse.json({ code: 0, data: serverStore.habits });
}

export async function POST(req: Request) {
  const body = await req.json();
  const habit = {
    id: crypto.randomUUID(),
    title: String(body.title ?? ''),
    targetType: body.targetType === 'weekly_focus_min' ? 'weekly_focus_min' : 'daily_pomodoro',
    targetValue: Number(body.targetValue ?? 1),
    completed: false,
    updatedAt: new Date().toISOString()
  };
  serverStore.habits.unshift(habit);
  return NextResponse.json({ code: 0, data: habit });
}
