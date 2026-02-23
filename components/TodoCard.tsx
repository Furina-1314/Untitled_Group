'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function TodoCard() {
  const { addTodo, updateTodo, deleteTodo, state } = useAppStore();
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');

  return (
    <section className="card space-y-2">
      <h2 className="text-lg font-semibold">待办系统</h2>
      <div className="flex flex-wrap gap-2">
        <input className="flex-1 rounded border p-2" value={content} onChange={(e) => setContent(e.target.value)} placeholder="待办内容" />
        <input className="rounded border p-2" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button className="rounded bg-lofi-accent px-3 py-1 text-white" onClick={() => {
          if (!content.trim()) return;
          addTodo({ content, dueDate });
          setContent('');
          setDueDate('');
        }}>新增</button>
      </div>

      <ul className="space-y-2">
        {state.todos.map((t) => (
          <li key={t.id} className="rounded bg-[#f7efe5] p-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} onChange={() => updateTodo(t.id, { done: !t.done })} />
              <input className="flex-1 rounded border px-2 py-1" value={t.content} onChange={(e) => updateTodo(t.id, { content: e.target.value })} />
              <input className="rounded border px-2 py-1" type="date" value={t.dueDate || ''} onChange={(e) => updateTodo(t.id, { dueDate: e.target.value })} />
              <button className="rounded bg-white px-2 py-1" onClick={() => deleteTodo(t.id)}>删除</button>
            </div>
            <p className="mt-1 text-xs text-gray-500">创建：{new Date(t.createdAt).toLocaleString()} ｜ 更新：{new Date(t.updatedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
