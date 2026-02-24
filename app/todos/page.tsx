'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function TodosPage() {
  const { state, addTodo, updateTodo } = useAppStore();
  const [content, setContent] = useState('');

  return (
    <main className="mx-auto max-w-4xl space-y-5">
      <h1 className="text-5xl font-bold text-stone-800">待办事项</h1>
      <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white/80 p-2">
        <input
          className="flex-1 bg-transparent px-3 py-2 text-lg outline-none"
          placeholder="添加新的待办..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          className="h-12 w-12 rounded-xl bg-indigo-600 text-2xl text-white"
          onClick={() => {
            if (!content.trim()) return;
            addTodo({ content, dueDate: '' });
            setContent('');
          }}
        >+
        </button>
      </div>

      <div className="space-y-3">
        {state.todos.map((task) => (
          <button
            key={task.id}
            className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-white/80 p-4 text-left text-3xl font-semibold text-stone-700"
            onClick={() => updateTodo(task.id, { done: !task.done })}
          >
            <span className={`h-8 w-8 rounded-full border-2 ${task.done ? 'border-emerald-500 bg-emerald-100' : 'border-stone-300'}`} />
            <span className={task.done ? 'text-stone-400 line-through' : ''}>{task.content || '未命名任务'}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
