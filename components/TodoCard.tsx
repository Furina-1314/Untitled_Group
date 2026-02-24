'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function TodoCard() {
  const { addTodo, updateTodo, deleteTodo, state } = useAppStore();
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');

  return (
    <section className="card flex h-full flex-col gap-2 overflow-hidden">
      <h2 className="card-title">✅ 待办</h2>
      <div className="grid grid-cols-12 gap-1 text-xs">
        <input className="col-span-7 rounded border p-2" value={content} onChange={(e) => setContent(e.target.value)} placeholder="待办内容" />
        <input className="col-span-3 rounded border p-2" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button className="col-span-2 soft-chip" onClick={() => {
          if (!content.trim()) return;
          addTodo({ content, dueDate });
          setContent('');
          setDueDate('');
        }}>新增</button>
      </div>

      <ul className="space-y-1 text-xs">
        {state.todos.slice(0, 5).map((t) => (
          <li key={t.id} className="rounded bg-[#fffaf5] p-2">
            <div className="flex items-center gap-1">
              <input type="checkbox" checked={t.done} onChange={() => updateTodo(t.id, { done: !t.done })} />
              <input className="min-w-0 flex-1 rounded border px-1 py-1" value={t.content} onChange={(e) => updateTodo(t.id, { content: e.target.value })} />
              <input className="w-28 rounded border px-1 py-1" type="date" value={t.dueDate || ''} onChange={(e) => updateTodo(t.id, { dueDate: e.target.value })} />
              <button className="soft-chip" onClick={() => deleteTodo(t.id)}>删</button>
            </div>
          </li>
        ))}
      </ul>
      {state.todos.length > 5 && <p className="mt-auto text-xs text-gray-500">仅展示前5条，前往待办页查看全部。</p>}
    </section>
  );
}
