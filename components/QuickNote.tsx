'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function QuickNote() {
  const { saveQuickNote, state } = useAppStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  return (
    <section className="card space-y-2">
      <h2 className="text-lg font-semibold">快速笔记</h2>
      <input className="w-full rounded border p-2" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="h-24 w-full rounded border p-2" placeholder="记录要点" value={content} onChange={(e) => setContent(e.target.value)} />
      <input className="w-full rounded border p-2" placeholder="标签（逗号分隔）" value={tags} onChange={(e) => setTags(e.target.value)} />
      <button
        className="rounded bg-lofi-accent px-3 py-1 text-white"
        onClick={() => {
          if (!title.trim() && !content.trim()) return;
          saveQuickNote({ title: title || '未命名笔记', content, tags: tags.split(',').map((x) => x.trim()).filter(Boolean) });
          setTitle('');
          setContent('');
          setTags('');
        }}
      >保存</button>
      <p className="text-xs text-gray-500">当前累计笔记：{state.notes.length} 条（保存后可在“笔记”页查看与编辑）。</p>
    </section>
  );
}
