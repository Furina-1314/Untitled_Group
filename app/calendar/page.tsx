'use client';

import { useMemo, useState } from 'react';
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

export default function CalendarPage() {
  const { state, saveDiary } = useAppStore();
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [journal, setJournal] = useState('');
  const days = useMemo(() => getMonthDays(month), [month]);

  return (
    <main className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-5xl font-bold text-stone-800">{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <div className="flex gap-2">
            <button className="soft-chip" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
            <button className="soft-chip" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm text-stone-400">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => <div key={d}>{d}</div>)}
          {days.map((d, i) => (
            <button
              key={`${d}-${i}`}
              className={`h-24 rounded-2xl text-lg ${d === selectedDay ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'hover:bg-white/70'}`}
              onClick={() => d && setSelectedDay(d)}
            >
              {d ?? ''}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="card">
          <h3 className="text-4xl font-bold text-stone-800">{month.toLocaleDateString('en-US', { weekday: 'long', month: 'long' })} {selectedDay}th</h3>
          <p className="text-stone-400">Daily Overview</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center"><p className="text-5xl font-bold text-indigo-600">0</p><p className="text-stone-400">FOCUS MIN</p></div>
          <div className="card text-center"><p className="text-5xl font-bold text-emerald-600">0</p><p className="text-stone-400">TASKS DONE</p></div>
        </div>

        <div className="card">
          <h4 className="text-3xl font-semibold text-stone-700">Journal</h4>
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="mt-3 h-80 w-full resize-none rounded-2xl bg-white/70 p-4 text-xl outline-none"
            placeholder="Write your thoughts for today..."
          />
          <button className="mt-2 soft-chip" onClick={() => {
            if (!journal.trim()) return;
            const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
            saveDiary({ date, title: 'Journal', content: journal });
            setJournal('');
          }}>保存日记（当前共 {state.diaries.length} 条）</button>
        </div>
      </section>
    </main>
  );
}
