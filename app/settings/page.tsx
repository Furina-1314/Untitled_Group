'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function SettingsPage() {
  const { state, setBackgroundImage, setAvatarImage, toggleSoundEnabled } = useAppStore();
  const [msg, setMsg] = useState('');

  return (
    <main className="card space-y-4">
      <h1 className="text-xl font-semibold">设置</h1>

      <section className="panel-subtle space-y-2 p-3">
        <h2 className="text-sm font-semibold">声音设置</h2>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">任务完成提示音</p>
          <button className="soft-chip" onClick={toggleSoundEnabled}>{state.ui.soundEnabled ? '开启' : '关闭'}</button>
        </div>
      </section>

      <section className="panel-subtle space-y-2 p-3">
        <h2 className="text-sm font-semibold">头像设置</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              setAvatarImage(String(reader.result || ''));
              setMsg('头像已更新。');
            };
            reader.readAsDataURL(file);
          }}
        />
        {state.ui.avatarImage && <img src={state.ui.avatarImage} alt="avatar-preview" className="h-24 w-24 rounded-full object-cover" />}
        <button className="soft-chip" onClick={() => setAvatarImage(undefined)}>恢复默认头像</button>
      </section>

      <section className="panel-subtle space-y-2 p-3">
        <h2 className="text-sm font-semibold">背景设置</h2>
        <p className="text-sm text-gray-600">上传背景图后会自适应窗口（cover + center），不合尺寸将自动裁切以铺满。</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              setBackgroundImage(String(reader.result || ''));
              setMsg('背景已更新。');
            };
            reader.readAsDataURL(file);
          }}
        />

        <button className="soft-chip" onClick={() => { setBackgroundImage(undefined); setMsg('背景已清除。'); }}>恢复默认背景</button>

        {state.ui.backgroundImage && (
          <div className="rounded border bg-white/70 p-2">
            <p className="mb-2 text-xs text-gray-600">当前背景预览：</p>
            <img src={state.ui.backgroundImage} alt="bg-preview" className="h-48 w-full rounded object-cover" />
          </div>
        )}
      </section>

      {msg && <p className="text-xs text-[#7f5f73]">{msg}</p>}
    </main>
  );
}
