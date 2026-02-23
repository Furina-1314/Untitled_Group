import { NextResponse } from 'next/server';

const events: Array<{event: string; at: string; properties: Record<string, unknown>}> = [];

export async function POST(req: Request) {
  const body = await req.json();
  const event = String(body.event ?? 'unknown');
  events.push({ event, at: new Date().toISOString(), properties: body.properties ?? {} });
  return NextResponse.json({ code: 0, data: { accepted: true, count: events.length } });
}
