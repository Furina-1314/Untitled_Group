import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const action = body.action as 'pause' | 'resume' | 'fast_forward' | 'end_now';

  if (!['pause', 'resume', 'fast_forward', 'end_now'].includes(action)) {
    return NextResponse.json({ code: 42201, message: 'INVALID_ACTION' }, { status: 422 });
  }

  return NextResponse.json({ code: 0, data: { action, timestamp: new Date().toISOString() } });
}
