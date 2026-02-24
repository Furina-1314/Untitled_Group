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

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function CalendarPage() {
  const { state, saveDiary, updateDiary, deleteDiary } = useAppStore();
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [journal, setJournal] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const days = useMemo(() => getMonthDays(month), [month]);

  const selectedDate = formatDate(month.getFullYear(), month.getMonth() + 1, selectedDay);
  const dayDiaries = useMemo(() => state.diaries.filter((d) => d.date === selectedDate), [state.diaries, selectedDate]);

  const saveJournal = () => {
    if (!journal.trim()) return;
    if (activeId) {
      updateDiary(activeId, { content: journal });
    } else {
      saveDiary({ date: selectedDate, title: '日记', content: journal });
    }
    setJournal('');
    setActiveId(null);
  };

  return (
    <main className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="card p-6">
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
              className={`h-24 rounded-2xl text-lg ${d === selectedDay ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'hover:bg-white/70'}`}
              onClick={() => {
                if (!d) return;
                setSelectedDay(d);
                setJournal('');
                setActiveId(null);
              }}
            >
              {d ?? ''}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="card">
          <h3 className="text-4xl font-bold text-stone-800">{month.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long' })}{selectedDay}日</h3>
          <p className="text-stone-400">当日概览</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center"><p className="text-5xl font-bold text-indigo-600">0</p><p className="text-stone-400">专注分钟</p></div>
          <div className="card text-center"><p className="text-5xl font-bold text-emerald-600">0</p><p className="text-stone-400">完成任务</p></div>
        </div>

        <div className="card">
          <h4 className="text-3xl font-semibold text-stone-700">日记</h4>
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="mt-3 h-52 w-full resize-none rounded-2xl bg-white/70 p-4 text-xl outline-none"
            placeholder="写下今天的想法..."
          />
          <div className="mt-2 flex gap-2">
            <button className="soft-chip" onClick={saveJournal}>{activeId ? '更新日记' : '保存日记'}</button>
            {activeId && <button className="soft-chip" onClick={() => { setActiveId(null); setJournal(''); }}>取消编辑</button>}
          </div>

          <div className="custom-scrollbar mt-3 max-h-48 space-y-2 overflow-y-auto">
            {dayDiaries.map((d) => (
              <div key={d.id} className="rounded-xl border border-stone-100 bg-white/70 p-3">
                <p className="line-clamp-2 whitespace-pre-wrap text-sm text-stone-700">{d.content}</p>
                <p className="mt-1 text-[11px] text-stone-400">更新：{new Date(d.updatedAt).toLocaleString('zh-CN')}</p>
                <div className="mt-2 flex gap-2">
                  <button className="soft-chip" onClick={() => { setActiveId(d.id); setJournal(d.content); }}>编辑</button>
                  <button className="soft-chip" onClick={() => { deleteDiary(d.id); if (activeId === d.id) { setActiveId(null); setJournal(''); } }}>删除</button>
                </div>
              </div>
            ))}
            {dayDiaries.length === 0 && <p className="py-2 text-center text-sm text-stone-400">当天暂无日记</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
