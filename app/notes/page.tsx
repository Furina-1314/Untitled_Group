'use client';

import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function NotesPage() {
  const { state, updateNote, deleteNote } = useAppStore();
  const [keyword, setKeyword] = useState('');
  const [tag, setTag] = useState('');

  const notes = useMemo(() => state.notes.filter((n) => {
    const matchesKeyword = !keyword || `${n.title} ${n.content}`.toLowerCase().includes(keyword.toLowerCase());
    const matchesTag = !tag || n.tags.includes(tag);
    return matchesKeyword && matchesTag;
  }), [state.notes, keyword, tag]);

  return (
    <main className="card space-y-3">
      <h1 className="text-xl font-semibold">笔记</h1>
      <div className="flex gap-2">
        <input className="flex-1 rounded border p-2" placeholder="搜索关键词" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <input className="w-48 rounded border p-2" placeholder="按标签筛选" value={tag} onChange={(e) => setTag(e.target.value)} />
      </div>
      <ul className="space-y-2">
        {notes.map((n) => (
          <li key={n.id} className="rounded bg-[#f7efe5] p-2">
            <input className="mb-2 w-full rounded border p-2" value={n.title} onChange={(e) => updateNote(n.id, { title: e.target.value })} />
            <textarea className="mb-2 h-24 w-full rounded border p-2" value={n.content} onChange={(e) => updateNote(n.id, { content: e.target.value })} />
            <input className="mb-2 w-full rounded border p-2" value={n.tags.join(',')} onChange={(e) => updateNote(n.id, { tags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
            <p className="text-xs text-gray-500">创建：{new Date(n.createdAt).toLocaleString()} ｜ 编辑：{new Date(n.updatedAt).toLocaleString()}</p>
            <button className="mt-2 rounded bg-white px-2 py-1" onClick={() => deleteNote(n.id)}>删除</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
