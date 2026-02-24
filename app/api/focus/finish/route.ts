import { NextResponse } from 'next/server';
import { calcCompletedReward, calcEarlyEndReward } from '@/lib/reward';

export async function POST(req: Request) {
  const body = await req.json();
  const elapsedSec = Number(body.elapsedSec ?? 0);
  const streak = Number(body.streak ?? 1);
  const mode = body.mode === 'deep' ? 'deep' : 'standard';
  const finishType = body.finishType === 'end_now' ? 'end_now' : 'completed';

  const reward = finishType === 'completed'
    ? calcCompletedReward(elapsedSec, mode, streak)
    : calcEarlyEndReward(elapsedSec, mode, streak);

  return NextResponse.json({
    code: 0,
    data: {
      status: finishType,
      reward,
      xpAwarded: reward.xp,
      affinityAwarded: reward.affinity,
      specialStoryTriggered: Number(body.consecutiveDays ?? 0) >= 7
    }
  });
}
