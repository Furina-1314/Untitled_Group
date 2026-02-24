'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';

export default function HabitsPage() {
  const { state } = useAppStore();

  const chart = useMemo(() => {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const value = Math.min(6, Math.floor(state.xp.todayXp / 20));
    return labels.map((name, idx) => ({ name, value: idx === new Date().getDay() ? value : 0 }));
  }, [state.xp.todayXp]);

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-5xl font-bold text-stone-800">Statistics</h1>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm uppercase tracking-wider text-stone-500">Total Focus Time</p>
          <p className="mt-2 text-6xl font-bold text-indigo-600">{Math.floor(state.xp.totalXp / 2)} <span className="text-3xl text-stone-400">min</span></p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-wider text-stone-500">Sessions Completed</p>
          <p className="mt-2 text-6xl font-bold text-emerald-600">{state.focusRuntime.cycleCount}</p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-wider text-stone-500">Current Streak</p>
          <p className="mt-2 text-6xl font-bold text-orange-500">{state.xp.streakDays || 1} <span className="text-3xl text-stone-400">day</span></p>
        </div>
      </section>

      <section className="card">
        <h3 className="text-4xl font-bold text-stone-800">Weekly Activity</h3>
        <div className="mt-6 grid h-80 grid-cols-7 items-end gap-4">
          {chart.map((d) => (
            <div key={d.name} className="flex flex-col items-center gap-2">
              <div className="w-full rounded-xl bg-indigo-500/80" style={{ height: `${Math.max(12, d.value * 36)}px` }} />
              <span className="text-xl text-stone-500">{d.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
