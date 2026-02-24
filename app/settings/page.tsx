'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`relative h-8 w-14 rounded-full transition ${on ? 'bg-indigo-500' : 'bg-stone-300'}`}>
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${on ? 'left-7' : 'left-1'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const { state, setBackgroundImage, setAvatarImage, toggleSoundEnabled } = useAppStore();
  const [msg, setMsg] = useState('');

  return (
    <main className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-5xl font-bold text-stone-800">Settings</h1>

      <section className="card space-y-8 p-6">
        <div>
          <h2 className="text-4xl font-semibold text-stone-800">🔊 Sound</h2>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-stone-100 bg-white/70 p-4">
            <div>
              <p className="text-3xl text-stone-700">Task Completion Sound</p>
              <p className="text-stone-400">Play a sound when you check off a task</p>
            </div>
            <Switch on={state.ui.soundEnabled} onToggle={toggleSoundEnabled} />
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6">
          <h2 className="text-4xl font-semibold text-stone-800">👤 Companion Avatar</h2>
          <div className="mt-4 flex items-center gap-6">
            <img src={state.ui.avatarImage || 'https://picsum.photos/seed/avatar_default/200/200'} alt="avatar" className="h-28 w-28 rounded-full object-cover" />
            <div className="space-y-2">
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => { setAvatarImage(String(reader.result || '')); setMsg('头像已更新。'); };
                reader.readAsDataURL(file);
              }} />
              <button className="soft-chip" onClick={() => setAvatarImage(undefined)}>恢复默认头像</button>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6">
          <h2 className="text-4xl font-semibold text-stone-800">🖼️ Background</h2>
          <div className="mt-4 flex items-center gap-6">
            <img src={state.ui.backgroundImage || 'https://picsum.photos/seed/bg_default/300/160'} alt="background-preview" className="h-28 w-48 rounded-2xl object-cover" />
            <div className="space-y-2">
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => { setBackgroundImage(String(reader.result || '')); setMsg('背景已更新。'); };
                reader.readAsDataURL(file);
              }} />
              <button className="soft-chip" onClick={() => setBackgroundImage(undefined)}>恢复默认背景</button>
            </div>
          </div>
        </div>
      </section>

      {msg && <p className="text-sm text-[#7f5f73]">{msg}</p>}
    </main>
  );
}
