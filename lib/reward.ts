import { FocusMode, RewardResult } from './types';

export function getStreakMultiplier(streak: number): number {
  if (streak >= 7) return 1.3;
  if (streak >= 4) return 1.2;
  return 1.0;
}

export function calcReward(params: {
  elapsedSec: number;
  mode: FocusMode;
  streak: number;
}): RewardResult {
  const qualified = params.elapsedSec >= 25 * 60;
  if (!qualified) {
    return {
      points: 0,
      affinity: 0,
      streakMultiplier: getStreakMultiplier(params.streak),
      modeMultiplier: params.mode === 'deep' ? 1.1 : 1,
      qualified: false
    };
  }

  const base = Math.floor(params.elapsedSec / (25 * 60)) * 10;
  const streakMultiplier = getStreakMultiplier(params.streak);
  const modeMultiplier = params.mode === 'deep' ? 1.1 : 1;
  const points = Math.floor(base * streakMultiplier * modeMultiplier);
  const affinity = Math.floor(base * streakMultiplier * modeMultiplier);

  return { points, affinity, streakMultiplier, modeMultiplier, qualified: true };
}
