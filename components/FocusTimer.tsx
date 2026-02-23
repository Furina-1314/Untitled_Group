'use client';

import { useMemo, useState } from 'react';
import { calcReward } from '@/lib/reward';
import type { FocusMode } from '@/lib/types';

export function FocusTimer() {
  const [mode, setMode] = useState<FocusMode>('standard');
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [streak, setStreak] = useState(1);

  const reward = useMemo(
    () => calcReward({ elapsedSec, mode, streak }),
    [elapsedSec, mode, streak]
  );

  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold">专注系统（MVP）</h2>
      <div className="flex gap-2">
        <button className="rounded bg-white px-2 py-1" onClick={() => setMode('standard')}>标准</button>
        <button className="rounded bg-white px-2 py-1" onClick={() => setMode('deep')}>深度</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <label>专注(min)<input className="w-full rounded border" type="number" value={focusMin} onChange={(e)=>setFocusMin(Number(e.target.value)||25)} /></label>
        <label>休息(min)<input className="w-full rounded border" type="number" value={breakMin} onChange={(e)=>setBreakMin(Number(e.target.value)||5)} /></label>
        <label>连续数<input className="w-full rounded border" type="number" value={streak} onChange={(e)=>setStreak(Number(e.target.value)||1)} /></label>
      </div>
      <div className="flex gap-2">
        <button className="rounded bg-lofi-accent px-3 py-1 text-white" onClick={() => setRunning(true)}>开始</button>
        <button className="rounded bg-white px-3 py-1" onClick={() => setRunning(false)}>暂停</button>
        <button className="rounded bg-white px-3 py-1" onClick={() => setElapsedSec(focusMin * 60)}>快进</button>
        <button className="rounded bg-white px-3 py-1" onClick={() => { setRunning(false); setElapsedSec(0); }}>立即结束</button>
      </div>
      <div>状态：{running ? '进行中' : '暂停/未开始'}，已计时 {Math.floor(elapsedSec / 60)} 分</div>
      <button className="rounded bg-white px-3 py-1" onClick={() => setElapsedSec((s) => s + 60)}>+1分钟(模拟)</button>
      <div className="rounded bg-[#f1e9df] p-2 text-sm">
        结算：积分 {reward.points} / 好感 {reward.affinity} / 达标 {reward.qualified ? '是' : '否'}
      </div>
      <p className="text-xs text-gray-600">规则：不足25分钟不计入奖励；深度模式1.1倍；连续倍率1.0/1.2/1.3。</p>
    </section>
  );
}
