'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function SettingsPage() {
  const { state, setBackgroundImage } = useAppStore();
  const [msg, setMsg] = useState('');

  return (
    <main className="card space-y-3">
      <h1 className="text-xl font-semibold">设置</h1>
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

      <div className="flex gap-2 text-sm">
        <button className="soft-chip" onClick={() => { setBackgroundImage(undefined); setMsg('背景已清除。'); }}>恢复默认背景</button>
      </div>

      {state.ui.backgroundImage && (
        <div className="rounded border bg-white/70 p-2">
          <p className="mb-2 text-xs text-gray-600">当前背景预览：</p>
          <img src={state.ui.backgroundImage} alt="bg-preview" className="h-48 w-full rounded object-cover" />
        </div>
      )}

      {msg && <p className="text-xs text-[#7f5f73]">{msg}</p>}
    </main>
  );
}
