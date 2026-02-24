'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

function playCompletionSound() {
  const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const ctx = new AudioContextCtor();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}

export function TodoCard() {
  const { addTodo, updateTodo, deleteTodo, state } = useAppStore();
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');

  return (
    <section className="card flex h-full flex-col gap-2 overflow-hidden">
      <h2 className="card-title">✅ 快速待办</h2>
      <div className="grid grid-cols-12 gap-1 text-xs">
        <input className="col-span-7 panel-input" value={content} onChange={(e) => setContent(e.target.value)} placeholder="添加待办..." />
        <input className="col-span-3 panel-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button className="col-span-2 soft-chip" onClick={() => {
          if (!content.trim()) return;
          addTodo({ content, dueDate });
          setContent('');
          setDueDate('');
        }}>新增</button>
      </div>

      <ul className="custom-scrollbar space-y-1 overflow-y-auto text-xs">
        {state.todos.slice(0, 5).map((t) => (
          <li key={t.id} className="panel-subtle p-2">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => {
                  updateTodo(t.id, { done: !t.done });
                  if (!t.done && state.ui.soundEnabled) playCompletionSound();
                }}
              />
              <input className="min-w-0 flex-1 panel-input px-1 py-1" value={t.content} onChange={(e) => updateTodo(t.id, { content: e.target.value })} />
              <input className="w-28 panel-input px-1 py-1" type="date" value={t.dueDate || ''} onChange={(e) => updateTodo(t.id, { dueDate: e.target.value })} />
              <button className="soft-chip" onClick={() => deleteTodo(t.id)}>删</button>
            </div>
          </li>
        ))}
      </ul>
      {state.todos.length === 0 && <p className="py-2 text-center text-xs text-gray-400">暂无待办</p>}
      {state.todos.length > 5 && <p className="mt-auto text-xs text-gray-500">仅展示前5条，前往待办页查看全部。</p>}
    </section>
  );
}
