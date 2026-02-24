'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function CalendarPage() {
  const { state, saveDiary, updateDiary, deleteDiary } = useAppStore();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <main className="card space-y-3">
      <h1 className="text-xl font-semibold">日历与日记</h1>
      <div className="grid gap-2 md:grid-cols-4">
        <input className="rounded border p-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="rounded border p-2" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="rounded border p-2 md:col-span-2" placeholder="内容摘要" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <button className="rounded bg-lofi-accent px-3 py-1 text-white" onClick={() => {
        if (!title.trim() && !content.trim()) return;
        saveDiary({ date, title: title || '未命名日记', content });
        setTitle('');
        setContent('');
      }}>保存日记</button>

      <ul className="space-y-2">
        {state.diaries.filter((d) => d.date === date).map((d) => (
          <li key={d.id} className="rounded bg-[#f7efe5] p-2">
            <input className="mb-2 w-full rounded border p-2" value={d.title} onChange={(e) => updateDiary(d.id, { title: e.target.value })} />
            <textarea
              className="mb-2 min-h-[320px] w-full resize-y rounded border p-3 font-mono text-sm leading-6"
              value={d.content}
              onChange={(e) => updateDiary(d.id, { content: e.target.value })}
            />
            <p className="text-xs text-gray-500">创建：{new Date(d.createdAt).toLocaleString()} ｜ 编辑：{new Date(d.updatedAt).toLocaleString()}</p>
            <button className="mt-2 rounded bg-white px-2 py-1" onClick={() => deleteDiary(d.id)}>删除</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
