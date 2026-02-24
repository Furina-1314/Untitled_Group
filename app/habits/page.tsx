'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';

export default function HabitsPage() {
  const { state } = useAppStore();

  const chart = useMemo(() => {
    const labels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const value = Math.min(6, Math.floor(state.xp.todayXp / 20));
    return labels.map((name, idx) => ({ name, value: idx === new Date().getDay() ? value : 0 }));
  }, [state.xp.todayXp]);

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-5xl font-bold text-stone-800">统计</h1>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card">
          <p className="text-sm uppercase tracking-wider text-stone-500">总专注时长</p>
          <p className="mt-2 text-6xl font-bold text-indigo-600">{Math.floor(state.xp.totalXp / 2)} <span className="text-3xl text-stone-400">分钟</span></p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-wider text-stone-500">完成轮次</p>
          <p className="mt-2 text-6xl font-bold text-emerald-600">{state.focusRuntime.cycleCount}</p>
        </div>
        <div className="card">
          <p className="text-sm uppercase tracking-wider text-stone-500">当前连续天数</p>
          <p className="mt-2 text-6xl font-bold text-orange-500">{state.xp.streakDays || 1} <span className="text-3xl text-stone-400">天</span></p>
        </div>
      </section>

      <section className="card">
        <h3 className="text-4xl font-bold text-stone-800">本周活跃度</h3>
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
