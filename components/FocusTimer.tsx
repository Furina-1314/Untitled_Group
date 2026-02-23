'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

function toClock(sec: number) {
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function FocusTimer() {
  const {
    state,
    setFocusConfig,
    startFocus,
    pauseFocus,
    resumeFocus,
    tickFocus,
    fastForward,
    endNow
  } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => tickFocus(), 1000);
    return () => clearInterval(timer);
  }, [tickFocus]);

  const runtime = state.focusRuntime;

  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold">专注系统</h2>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-sm">专注(min)
          <input className="w-full rounded border p-1" type="number" min={1} max={180} value={state.focusConfig.focusMin}
            onChange={(e) => setFocusConfig(Number(e.target.value), state.focusConfig.breakMin, state.focusConfig.mode)} />
        </label>
        <label className="text-sm">休息(min)
          <input className="w-full rounded border p-1" type="number" min={1} max={60} value={state.focusConfig.breakMin}
            onChange={(e) => setFocusConfig(state.focusConfig.focusMin, Number(e.target.value), state.focusConfig.mode)} />
        </label>
        <label className="text-sm">模式
          <select className="w-full rounded border p-1" value={state.focusConfig.mode}
            onChange={(e) => setFocusConfig(state.focusConfig.focusMin, state.focusConfig.breakMin, e.target.value as 'standard' | 'deep')}>
            <option value="standard">标准模式</option>
            <option value="deep">深度模式</option>
          </select>
        </label>
      </div>

      <div className="rounded-2xl bg-[#efe3d6] p-4 text-center">
        <div className="text-4xl font-bold tracking-widest">{toClock(runtime.remainingSec)}</div>
        <div className="mt-1 text-sm text-gray-600">状态：{runtime.status} ｜ 已专注 {Math.floor(runtime.elapsedSec / 60)} 分钟</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-lofi-accent px-3 py-1 text-white" onClick={startFocus}>开始</button>
        <button className="rounded bg-white px-3 py-1" onClick={pauseFocus}>暂停</button>
        <button className="rounded bg-white px-3 py-1" onClick={resumeFocus}>恢复</button>
        <button className="rounded bg-white px-3 py-1" onClick={fastForward}>快进</button>
        <button className="rounded bg-white px-3 py-1" onClick={endNow}>立即结束并结算</button>
      </div>

      <div className="rounded bg-[#f7efe5] p-2 text-sm">
        XP：总计 {state.xp.totalXp} / 今日 {state.xp.todayXp} ｜ 等级 Lv{state.xp.level} ｜ 好感 {state.xp.affinity} ｜ 连续 {state.xp.streakDays} 天
      </div>
    </section>
  );
}
