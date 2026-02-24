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
  const { state, setAudio, addTrack, removeTrack, nextTrack, togglePlay } = useAppStore();
  const [showAll, setShowAll] = useState(false);
  const currentTrack = useMemo(() => state.audio.tracks.find((t) => t.id === state.audio.currentTrackId), [state.audio.currentTrackId, state.audio.tracks]);
  const visibleTracks = showAll ? state.audio.tracks : state.audio.tracks.slice(0, 4);

  return (
    <section className="card flex flex-col gap-2 overflow-hidden">
      <h2 className="card-title">🎵 音乐与环境</h2>
      <label className="text-xs">白噪音 {state.audio.noiseVolume}
        <input type="range" min={0} max={100} value={state.audio.noiseVolume} onChange={(e) => setAudio({ noiseVolume: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="text-xs">音乐 {state.audio.musicVolume}
        <input type="range" min={0} max={100} value={state.audio.musicVolume} onChange={(e) => setAudio({ musicVolume: Number(e.target.value) })} className="w-full" />
      </label>

      <div className="rounded bg-[#fef7f0] p-2">
        <div className="mb-1 flex items-center justify-between text-[11px] text-gray-700">
          <span>{toClock(state.audio.currentSec)}</span>
          <span>{toClock(state.audio.durationSec)}</span>
        </div>
        <input type="range" min={0} max={Math.max(1, state.audio.durationSec)} step={0.1}
          value={Math.min(state.audio.currentSec, Math.max(1, state.audio.durationSec))}
          onChange={(e) => {
            const sec = Number(e.target.value);
            setAudio({ currentSec: sec, seekToSec: sec });
          }} className="w-full" />
      </div>

      <div className="flex flex-wrap items-center gap-1 text-xs">
        <input type="file" accept=".mp3,.wav,.avi,audio/*,video/x-msvideo" multiple className="max-w-full text-[11px]"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            files.forEach((f) => addTrack({ id: crypto.randomUUID(), name: f.name, objectUrl: URL.createObjectURL(f), fileType: f.type, size: f.size, createdAt: new Date().toISOString() }));
          }} />
        <button className="soft-chip" onClick={togglePlay}>{state.audio.playing ? '暂停' : '播放'}</button>
        <button className="soft-chip" onClick={nextTrack}>下一首</button>
      </div>

      <p className="truncate text-xs">当前：{currentTrack?.name ?? '未选择曲目'}</p>

      <ul className="space-y-1 text-xs">
        {visibleTracks.map((track) => (
          <li key={track.id} className="flex items-center gap-1">
            <button className="soft-chip" onClick={() => setAudio({ currentTrackId: track.id, playing: true })}>播放</button>
            <span className="flex-1 truncate">{track.name}</span>
            <button className="soft-chip" onClick={() => removeTrack(track.id)}>删</button>
          </li>
        ))}
      </ul>
      {state.audio.tracks.length > 4 && (
        <button className="self-start text-xs text-[#7f5f73] underline" onClick={() => setShowAll((s) => !s)}>
          {showAll ? '收起列表' : `展开全部（${state.audio.tracks.length} 首）`}
        </button>
      )}
    </section>
  );
}
