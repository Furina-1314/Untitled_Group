'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function HabitsPage() {
  const { state, addHabit, toggleHabit, deleteHabit } = useAppStore();
  const [title, setTitle] = useState('');
  const [targetType, setTargetType] = useState<'daily_pomodoro' | 'weekly_focus_min'>('daily_pomodoro');
  const [targetValue, setTargetValue] = useState(2);

  return (
    <main className="card space-y-3">
      <h1 className="text-xl font-semibold">习惯追踪</h1>
      <div className="flex flex-wrap gap-2">
        <input className="flex-1 rounded border p-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="目标名称" />
        <select className="rounded border p-2" value={targetType} onChange={(e) => setTargetType(e.target.value as 'daily_pomodoro' | 'weekly_focus_min')}>
          <option value="daily_pomodoro">每日番茄数</option>
          <option value="weekly_focus_min">每周专注分钟</option>
        </select>
        <input className="w-28 rounded border p-2" type="number" value={targetValue} onChange={(e) => setTargetValue(Number(e.target.value))} />
        <button className="rounded bg-lofi-accent px-3 py-1 text-white" onClick={() => {
          if (!title.trim()) return;
          addHabit({ title, targetType, targetValue });
          setTitle('');
        }}>新增</button>
      </div>

      <ul className="space-y-2">
        {state.habits.map((h) => (
          <li key={h.id} className="flex items-center gap-2 rounded bg-[#f7efe5] p-2">
            <button className="rounded border px-2 py-1" onClick={() => toggleHabit(h.id)}>{h.completed ? '✓' : '○'}</button>
            <span className="flex-1">{h.title}（{h.targetType === 'daily_pomodoro' ? '每日番茄' : '每周分钟'}：{h.targetValue}）</span>
            <span className="text-xs text-gray-500">更新：{new Date(h.updatedAt).toLocaleString()}</span>
            <button className="rounded bg-white px-2 py-1" onClick={() => deleteHabit(h.id)}>删除</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
