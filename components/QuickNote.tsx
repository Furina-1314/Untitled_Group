'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function QuickNote() {
  const { saveQuickNote, state } = useAppStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  return (
    <section className="card flex h-full flex-col gap-2 overflow-hidden">
      <h2 className="card-title">📝 快速笔记</h2>
      <input className="w-full rounded border p-2 text-sm" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="h-24 w-full resize-none rounded border p-2 text-sm leading-5" placeholder="随手记录..." value={content} onChange={(e) => setContent(e.target.value)} />
      <input className="w-full rounded border p-2 text-sm" placeholder="标签（逗号分隔）" value={tags} onChange={(e) => setTags(e.target.value)} />
      <div className="mt-auto flex items-center justify-between">
        <button className="soft-chip" onClick={() => {
          if (!title.trim() && !content.trim()) return;
          saveQuickNote({ title: title || '未命名笔记', content, tags: tags.split(',').map((x) => x.trim()).filter(Boolean) });
          setTitle('');
          setContent('');
          setTags('');
        }}>保存</button>
        <p className="text-xs text-gray-500">{state.notes.length} 条</p>
      </div>
    </section>
  );
}
