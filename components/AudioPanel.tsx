'use client';

import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';

function toClock(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function AudioPanel() {
  const { state, setAudio, addTrack, removeTrack, nextTrack, prevTrack, togglePlay } = useAppStore();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const currentTrack = useMemo(() => state.audio.tracks.find((t) => t.id === state.audio.currentTrackId), [state.audio.currentTrackId, state.audio.tracks]);

  return (
    <section className="card flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="card-title">🎵 本地音乐播放器</h2>
        <button className="soft-chip" onClick={() => setShowPlaylist((v) => !v)}>{showPlaylist ? '隐藏列表' : '播放列表'}</button>
      </div>

      <label className="text-xs">白噪音 {state.audio.noiseVolume}
        <input type="range" min={0} max={100} value={state.audio.noiseVolume} onChange={(e) => setAudio({ noiseVolume: Number(e.target.value) })} className="w-full accent-indigo-500" />
      </label>
      <label className="text-xs">音乐 {state.audio.musicVolume}
        <input type="range" min={0} max={100} value={state.audio.musicVolume} onChange={(e) => setAudio({ musicVolume: Number(e.target.value) })} className="w-full accent-indigo-500" />
      </label>

      <div className="panel-subtle">
        <div className="mb-1 flex items-center justify-between text-[11px] text-gray-700">
          <span>{toClock(state.audio.currentSec)}</span>
          <span>{toClock(state.audio.durationSec)}</span>
        </div>
        <input type="range" min={0} max={Math.max(1, state.audio.durationSec)} step={0.1}
          value={Math.min(state.audio.currentSec, Math.max(1, state.audio.durationSec))}
          onChange={(e) => {
            const sec = Number(e.target.value);
            setAudio({ currentSec: sec, seekToSec: sec });
          }} className="w-full accent-indigo-500" />
      </div>

      <div className="flex flex-wrap items-center gap-1 text-xs">
        <input type="file" accept=".mp3,.wav,.avi,audio/*,video/x-msvideo" multiple className="max-w-full text-[11px]"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            files.forEach((f) => addTrack({ id: crypto.randomUUID(), name: f.name, objectUrl: URL.createObjectURL(f), fileType: f.type, size: f.size, createdAt: new Date().toISOString() }));
          }} />
        <button className="soft-chip" onClick={prevTrack}>上一首</button>
        <button className="soft-chip" onClick={togglePlay}>{state.audio.playing ? '暂停' : '播放'}</button>
        <button className="soft-chip" onClick={nextTrack}>下一首</button>
      </div>

      <p className="truncate text-xs">当前：{currentTrack?.name ?? '未选择曲目'}</p>

      {showPlaylist && (
        <ul className="custom-scrollbar h-[132px] space-y-1 overflow-y-auto pr-1 text-xs">
          {state.audio.tracks.map((track) => (
            <li key={track.id} className="flex h-8 items-center gap-1">
              <button className="soft-chip" onClick={() => setAudio({ currentTrackId: track.id, playing: true })}>播放</button>
              <span className="flex-1 truncate">{track.name}</span>
              <button className="soft-chip" onClick={() => removeTrack(track.id)}>删</button>
            </li>
          ))}
          {state.audio.tracks.length === 0 && <li className="py-3 text-center text-gray-400">暂无导入曲目</li>}
        </ul>
      )}
      <p className="text-[11px] text-gray-500">播放列表固定显示4首高度，曲目较多时可滚动浏览。</p>
    </section>
  );
}
