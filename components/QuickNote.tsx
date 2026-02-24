'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export function QuickNote() {
  const { saveQuickNote, state, updateNote, deleteNote } = useAppStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  return (
    <section className="card flex h-full flex-col gap-2 overflow-hidden">
      <h2 className="card-title">📝 Quick Notes</h2>
      <textarea className="h-20 w-full resize-none panel-input text-sm leading-5" placeholder="Type a quick note..." value={content} onChange={(e) => setContent(e.target.value)} />
      <div className="flex gap-2">
        <input className="w-full panel-input text-sm" placeholder="标题（可选）" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="soft-chip" onClick={() => {
          if (!content.trim() && !title.trim()) return;
          saveQuickNote({ title: title || '未命名笔记', content, tags: [] });
          setTitle('');
          setContent('');
        }}>保存</button>
      </div>

      <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto">
        {state.notes.slice(0, 5).map((note) => (
          <div key={note.id} className="panel-subtle p-2 text-sm">
            {editingId === note.id ? (
              <div className="space-y-2">
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="h-20 w-full resize-none panel-input" autoFocus />
                <div className="flex justify-end gap-2">
                  <button className="soft-chip" onClick={() => {
                    if (!editContent.trim()) return;
                    updateNote(note.id, { content: editContent });
                    setEditingId(null);
                  }}>保存</button>
                  <button className="soft-chip" onClick={() => setEditingId(null)}>取消</button>
                </div>
              </div>
            ) : (
              <>
                <p className="line-clamp-3 whitespace-pre-wrap text-stone-700">{note.content || note.title}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <button className="soft-chip" onClick={() => { setEditingId(note.id); setEditContent(note.content); }}>编辑</button>
                    <button className="soft-chip" onClick={() => deleteNote(note.id)}>删除</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
