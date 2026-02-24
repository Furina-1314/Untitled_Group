'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function NotesPage() {
  const { state, saveQuickNote } = useAppStore();
  const [content, setContent] = useState('');

  return (
    <main className="mx-auto max-w-5xl space-y-5">
      <h1 className="text-5xl font-bold text-stone-800">Notes</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card h-72">
          <textarea
            className="h-[170px] w-full resize-none bg-transparent text-3xl text-stone-500 outline-none"
            placeholder="Write a new note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="mt-3 rounded-xl bg-indigo-500 px-6 py-2 text-2xl text-white"
            onClick={() => {
              if (!content.trim()) return;
              saveQuickNote({ title: '新笔记', content, tags: [] });
              setContent('');
            }}
          >
            + Add Note
          </button>
        </div>

        {state.notes.map((note) => (
          <div key={note.id} className="h-72 rounded-3xl border border-yellow-100 bg-[#f5f2d8] p-4">
            <p className="line-clamp-6 whitespace-pre-wrap text-2xl text-stone-700">{note.content || note.title}</p>
            <p className="mt-16 text-sm text-stone-400">{new Date(note.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
