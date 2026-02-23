'use client';

import { useState } from 'react';

export function QuickNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <section className="card space-y-2">
      <h2 className="text-lg font-semibold">快速笔记</h2>
      <input className="w-full rounded border p-2" placeholder="标题" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <textarea className="h-24 w-full rounded border p-2" placeholder="记录灵感..." value={content} onChange={(e)=>setContent(e.target.value)} />
      <button className="rounded bg-lofi-accent px-3 py-1 text-white">保存（可关联当前番茄）</button>
    </section>
  );
}
