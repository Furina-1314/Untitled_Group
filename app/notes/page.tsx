'use client';

import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function NotesPage() {
  const { state, saveQuickNote, updateNote, deleteNote } = useAppStore();
  const [keyword, setKeyword] = useState('');
  const [tag, setTag] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const notes = useMemo(() => state.notes.filter((n) => {
    const matchesKeyword = !keyword || `${n.title} ${n.content}`.toLowerCase().includes(keyword.toLowerCase());
    const matchesTag = !tag || n.tags.includes(tag);
    return matchesKeyword && matchesTag;
  }), [state.notes, keyword, tag]);

  return (
    <main className="card h-full space-y-3 overflow-auto">
      <h1 className="text-xl font-semibold">笔记</h1>

      <section className="rounded bg-[#f7efe5] p-3">
        <h2 className="mb-2 text-sm font-semibold">新增笔记</h2>
        <input className="mb-2 w-full rounded border p-2" placeholder="标题" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <textarea className="mb-2 h-24 w-full resize-none rounded border p-2" placeholder="内容" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
        <input className="mb-2 w-full rounded border p-2" placeholder="标签（逗号分隔）" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
        <button className="soft-chip" onClick={() => {
          if (!newTitle.trim() && !newContent.trim()) return;
          saveQuickNote({ title: newTitle || '未命名笔记', content: newContent, tags: newTags.split(',').map((x) => x.trim()).filter(Boolean) });
          setNewTitle('');
          setNewContent('');
          setNewTags('');
        }}>新增</button>
      </section>

      <div className="flex gap-2">
        <input className="flex-1 rounded border p-2" placeholder="搜索关键词" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <input className="w-48 rounded border p-2" placeholder="按标签筛选" value={tag} onChange={(e) => setTag(e.target.value)} />
      </div>

      <ul className="space-y-2">
        {notes.map((n) => {
          const expanded = expandedId === n.id;
          return (
            <li key={n.id} className="rounded bg-[#f7efe5] p-2">
              <button className="flex w-full items-center gap-2 text-left" onClick={() => setExpandedId(expanded ? null : n.id)}>
                <span className="flex-1 truncate font-medium">{n.title || '未命名笔记'}</span>
                <span className="text-xs text-gray-600">{expanded ? '收起' : '展开'}</span>
              </button>

              {expanded && (
                <div className="mt-2 space-y-2">
                  <input className="w-full rounded border p-2" value={n.title} onChange={(e) => updateNote(n.id, { title: e.target.value })} />
                  <textarea
                    className="max-h-[42vh] min-h-[180px] w-full resize-y rounded border p-3 font-mono text-sm leading-6"
                    value={n.content}
                    onChange={(e) => updateNote(n.id, { content: e.target.value })}
                  />
                  <input className="w-full rounded border p-2" value={n.tags.join(',')} onChange={(e) => updateNote(n.id, { tags: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} />
                  <p className="text-xs text-gray-500">创建：{new Date(n.createdAt).toLocaleString()} ｜ 编辑：{new Date(n.updatedAt).toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button className="soft-chip" onClick={() => setExpandedId(null)}>保存并收起</button>
                    <button className="soft-chip" onClick={() => deleteNote(n.id)}>删除</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
