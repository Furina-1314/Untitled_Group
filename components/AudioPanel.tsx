'use client';

import { useState } from 'react';

export function AudioPanel() {
  const [noiseVolume, setNoiseVolume] = useState(50);
  const [musicVolume, setMusicVolume] = useState(40);
  const [mix, setMix] = useState(0.5);
  const [fileName, setFileName] = useState('');

  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold">音乐与环境</h2>
      <label className="block">白噪音音量: {noiseVolume}
        <input type="range" min={0} max={100} value={noiseVolume} onChange={(e)=>setNoiseVolume(Number(e.target.value))} className="w-full"/>
      </label>
      <label className="block">音乐音量: {musicVolume}
        <input type="range" min={0} max={100} value={musicVolume} onChange={(e)=>setMusicVolume(Number(e.target.value))} className="w-full"/>
      </label>
      <label className="block">混音比例: {mix}
        <input type="range" min={0} max={1} step={0.1} value={mix} onChange={(e)=>setMix(Number(e.target.value))} className="w-full"/>
      </label>
      <label className="block text-sm">导入本地音乐(mp3/avi/wav)
        <input
          type="file"
          accept=".mp3,.avi,.wav,audio/*,video/x-msvideo"
          onChange={(e)=>setFileName(e.target.files?.[0]?.name ?? '')}
          className="block w-full"
        />
      </label>
      {fileName && <p className="text-sm">已选择：{fileName}</p>}
    </section>
  );
}
