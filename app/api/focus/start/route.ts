import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { mode, plannedFocusMin, plannedBreakMin } = body;

  if (![25, 45, 60].includes(plannedFocusMin) && (plannedFocusMin < 1 || plannedFocusMin > 180)) {
    return NextResponse.json({ code: 40001, message: 'INVALID_FOCUS_DURATION' }, { status: 400 });
  }

  if (![5, 10].includes(plannedBreakMin) && (plannedBreakMin < 1 || plannedBreakMin > 60)) {
    return NextResponse.json({ code: 40002, message: 'INVALID_BREAK_DURATION' }, { status: 400 });
  }

  return NextResponse.json({
    code: 0,
    data: {
      sessionId: crypto.randomUUID(),
      mode: mode ?? 'standard',
      plannedFocusMin,
      plannedBreakMin,
      startedAt: new Date().toISOString()
    }
  });
}
