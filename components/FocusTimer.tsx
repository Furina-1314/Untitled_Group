'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

function toClock(sec: number) {
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function FocusTimer() {
  const { state, setFocusConfig, startFocus, pauseFocus, resumeFocus, tickFocus, fastForward, endNow } = useAppStore();

  useEffect(() => {
    const timer = setInterval(() => tickFocus(), 1000);
    return () => clearInterval(timer);
  }, [tickFocus]);

  const runtime = state.focusRuntime;
  const statusText = { idle: '空闲', running: '专注中', paused: '已暂停', break: '休息中' }[runtime.status];

  return (
    <section className="card flex flex-col gap-2 overflow-hidden">
      <h2 className="card-title">⏱ 专注系统</h2>
      <div className="grid grid-cols-3 gap-1 text-xs">
        <input className="panel-input" type="number" min={1} max={180} value={state.focusConfig.focusMin}
          onChange={(e) => setFocusConfig(Number(e.target.value), state.focusConfig.breakMin, state.focusConfig.mode)} />
        <input className="panel-input" type="number" min={1} max={60} value={state.focusConfig.breakMin}
          onChange={(e) => setFocusConfig(state.focusConfig.focusMin, Number(e.target.value), state.focusConfig.mode)} />
        <select className="panel-input" value={state.focusConfig.mode}
          onChange={(e) => setFocusConfig(state.focusConfig.focusMin, state.focusConfig.breakMin, e.target.value as 'standard' | 'deep')}>
          <option value="standard">标准</option>
          <option value="deep">深度</option>
        </select>
      </div>

      <div className="panel-subtle text-center">
        <div className="text-3xl font-bold tracking-widest sm:text-4xl">{toClock(runtime.remainingSec)}</div>
        <div className="mt-1 truncate text-xs text-gray-600">{statusText}｜已专注 {Math.floor(runtime.elapsedSec / 60)} 分</div>
      </div>

      <div className="grid grid-cols-3 gap-1 text-xs">
        <button className="soft-chip" onClick={startFocus}>开始</button>
        <button className="soft-chip" onClick={pauseFocus}>暂停</button>
        <button className="soft-chip" onClick={resumeFocus}>恢复</button>
        <button className="soft-chip" onClick={fastForward}>快进</button>
        <button className="soft-chip" onClick={endNow}>结束结算</button>
      </div>

      <div className="mt-auto rounded-2xl border border-stone-100 bg-white/80 p-2 text-xs leading-5 break-words">
        经验 {state.xp.totalXp}｜等级{state.xp.level}｜好感 {state.xp.affinity}｜连续 {state.xp.streakDays} 天
      </div>
    </section>
  );
}
