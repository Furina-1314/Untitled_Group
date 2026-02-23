import { NextResponse } from 'next/server';
import { calcReward } from '@/lib/reward';

export async function POST(req: Request) {
  const body = await req.json();
  const elapsedSec = Number(body.elapsedSec ?? 0);
  const streak = Number(body.streak ?? 1);
  const mode = body.mode === 'deep' ? 'deep' : 'standard';

  const reward = calcReward({ elapsedSec, streak, mode });

  return NextResponse.json({
    code: 0,
    data: {
      status: reward.qualified ? 'completed' : 'ended',
      reward,
      specialStoryTriggered: Number(body.consecutiveDays ?? 0) >= 7
    }
  });
}
