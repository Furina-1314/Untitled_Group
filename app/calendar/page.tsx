'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';

function getMonthDays(date: Date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const items: (number | null)[] = [];
  for (let i = 0; i < first; i += 1) items.push(null);
  for (let d = 1; d <= days; d += 1) items.push(d);
  while (items.length % 7 !== 0) items.push(null);
  return items;
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function CalendarPage() {
  const { state, saveDiary, updateDiary } = useAppStore();
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [journal, setJournal] = useState('');
  const days = useMemo(() => getMonthDays(month), [month]);

  const selectedDate = formatDate(month.getFullYear(), month.getMonth() + 1, selectedDay);
  const dayDiary = useMemo(() => state.diaries.find((d) => d.date === selectedDate), [state.diaries, selectedDate]);

  useEffect(() => {
    setJournal(dayDiary?.content ?? '');
  }, [dayDiary?.id, selectedDate]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (journal === (dayDiary?.content ?? '')) return;
      if (!journal.trim()) return;
      if (dayDiary) {
        updateDiary(dayDiary.id, { content: journal });
      } else {
        saveDiary({ date: selectedDate, title: '日记', content: journal });
      }
    }, 500);
    return () => clearTimeout(t);
  }, [journal, dayDiary, selectedDate, saveDiary, updateDiary]);

  return (
    <main className="mx-auto grid h-[calc(100vh-4rem)] max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="card h-full p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-5xl font-bold text-stone-800">{month.toLocaleDateString('zh-CN', { month: 'long', year: 'numeric' })}</h2>
          <div className="flex gap-2">
            <button className="soft-chip" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
            <button className="soft-chip" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm text-stone-400">
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => <div key={d}>{d}</div>)}
          {days.map((d, i) => (
            <button
              key={`${d}-${i}`}
              className={`h-20 rounded-2xl text-lg ${d === selectedDay ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'hover:bg-white/70'}`}
              onClick={() => d && setSelectedDay(d)}
            >
              {d ?? ''}
            </button>
          ))}
        </div>
      </section>

      <section className="flex h-full flex-col gap-3">
        <div className="card h-auto py-4">
          <h3 className="text-3xl font-bold text-stone-800">{month.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long' })}{selectedDay}日</h3>
          <p className="text-stone-400">当日概览</p>
          <div className="mt-1 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/70 py-3 text-center"><p className="text-4xl font-bold text-indigo-600">0</p><p className="text-stone-400">专注分钟</p></div>
            <div className="rounded-2xl bg-white/70 py-3 text-center"><p className="text-4xl font-bold text-emerald-600">0</p><p className="text-stone-400">完成任务</p></div>
          </div>
        </div>

        <div className="card h-auto min-h-0 flex flex-1 flex-col">
          <h4 className="text-3xl font-semibold text-stone-700">日记</h4>
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="mt-3 w-full min-h-[220px] flex-1 resize-none rounded-2xl bg-white/70 p-4 text-xl outline-none"
            placeholder="写下今天的想法..."
          />
          <p className="mt-2 text-xs text-stone-400">自动保存到当天日记</p>
        </div>
      </section>
    </main>
  );
}
