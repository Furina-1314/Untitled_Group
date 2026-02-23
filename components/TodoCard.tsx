'use client';

import { useState } from 'react';

type Todo = { content: string; dueDate: string; done: boolean };

export function TodoCard() {
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<Todo[]>([]);

  return (
    <section className="card space-y-2">
      <h2 className="text-lg font-semibold">待办系统</h2>
      <div className="flex gap-2">
        <input className="flex-1 rounded border p-2" value={content} onChange={(e)=>setContent(e.target.value)} placeholder="输入待办内容" />
        <input className="rounded border p-2" type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} />
        <button
          className="rounded bg-lofi-accent px-3 text-white"
          onClick={() => {
            if (!content.trim()) return;
            setItems((prev) => [...prev, { content, dueDate, done: false }]);
            setContent('');
          }}
        >新增</button>
      </div>
      <ul className="space-y-1">
        {items.map((t, i) => (
          <li key={`${t.content}-${i}`} className="flex items-center gap-2 rounded bg-[#f7efe5] p-2">
            <input type="checkbox" checked={t.done} onChange={() => setItems((prev) => prev.map((x, idx) => idx === i ? { ...x, done: !x.done } : x))} />
            <span className={t.done ? 'line-through' : ''}>{t.content}</span>
            <span className="ml-auto text-xs text-gray-500">{t.dueDate || '无截止日'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
