import type { FocusMode, XPProfile } from './types';

const XP_PER_25_MIN = 10;
const BASE_SEC = 25 * 60;

export function getStreakMultiplier(streak: number): number {
  if (streak >= 7) return 1.3;
  if (streak >= 4) return 1.2;
  return 1.0;
}

export function getModeMultiplier(mode: FocusMode): number {
  return mode === 'deep' ? 1.1 : 1;
}

export function calcCompletedReward(elapsedSec: number, mode: FocusMode, streak: number) {
  if (elapsedSec < BASE_SEC) return { xp: 0, affinity: 0, qualified: false };
  const blocks = Math.floor(elapsedSec / BASE_SEC);
  const base = blocks * XP_PER_25_MIN;
  const total = Math.floor(base * getStreakMultiplier(streak) * getModeMultiplier(mode));
  return { xp: total, affinity: total, qualified: true };
}

export function calcEarlyEndReward(elapsedSec: number, mode: FocusMode, streak: number) {
  const base = (elapsedSec / BASE_SEC) * XP_PER_25_MIN;
  const total = Math.max(0, Math.floor(base * getStreakMultiplier(streak) * getModeMultiplier(mode)));
  return { xp: total, affinity: Math.floor(total * 0.8), qualified: elapsedSec > 0 };
}

export function calcLevel(totalXp: number): number {
  return Math.max(1, Math.floor(totalXp / 100) + 1);
}

export function applyXp(profile: XPProfile, gainXp: number, gainAffinity: number, focusDate: string): XPProfile {
  const sameDay = profile.lastFocusDate === focusDate;
  const todayXp = sameDay ? profile.todayXp + gainXp : gainXp;
  const totalXp = profile.totalXp + gainXp;
  const affinity = profile.affinity + gainAffinity;

  const streakDays = (() => {
    if (!profile.lastFocusDate) return gainXp > 0 ? 1 : 0;
    if (profile.lastFocusDate === focusDate) return profile.streakDays;
    const last = new Date(profile.lastFocusDate + 'T00:00:00');
    const current = new Date(focusDate + 'T00:00:00');
    const diff = Math.round((current.getTime() - last.getTime()) / 86400000);
    if (diff === 1 && gainXp > 0) return profile.streakDays + 1;
    return gainXp > 0 ? 1 : profile.streakDays;
  })();

  return {
    ...profile,
    totalXp,
    todayXp,
    level: calcLevel(totalXp),
    affinity,
    streakDays,
    lastFocusDate: focusDate
  };
}
