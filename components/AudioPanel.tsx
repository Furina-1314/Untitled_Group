'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function AudioPanel() {
  const { state, setAudio, addTrack, removeTrack, nextTrack, togglePlay } = useAppStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = useMemo(() => state.audio.tracks.find((t) => t.id === state.audio.currentTrackId), [state.audio.currentTrackId, state.audio.tracks]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = state.audio.musicVolume / 100;
  }, [state.audio.musicVolume]);

  useEffect(() => {
    const player = audioRef.current;
    if (!player || !currentTrack) return;
    player.src = currentTrack.objectUrl;
    if (state.audio.playing) void player.play();
  }, [currentTrack, state.audio.playing]);

  return (
    <section className="card space-y-3">
      <h2 className="text-lg font-semibold">音乐与环境</h2>
      <label className="block">白噪音音量: {state.audio.noiseVolume}
        <input type="range" min={0} max={100} value={state.audio.noiseVolume} onChange={(e) => setAudio({ noiseVolume: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="block">音乐音量: {state.audio.musicVolume}
        <input type="range" min={0} max={100} value={state.audio.musicVolume} onChange={(e) => setAudio({ musicVolume: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="block">混音比例: {state.audio.mixRatio.toFixed(1)}
        <input type="range" min={0} max={1} step={0.1} value={state.audio.mixRatio} onChange={(e) => setAudio({ mixRatio: Number(e.target.value) })} className="w-full" />
      </label>

      <div className="space-y-2 rounded bg-[#f7efe5] p-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            accept=".mp3,.wav,.avi,audio/*,video/x-msvideo"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              files.forEach((f) => addTrack({
                id: crypto.randomUUID(),
                name: f.name,
                objectUrl: URL.createObjectURL(f),
                fileType: f.type,
                size: f.size,
                createdAt: new Date().toISOString()
              }));
            }}
          />
          <button className="rounded bg-white px-2 py-1" onClick={togglePlay}>{state.audio.playing ? '暂停' : '播放'}</button>
          <button className="rounded bg-white px-2 py-1" onClick={nextTrack}>下一首</button>
        </div>
        <audio ref={audioRef} controls className="w-full" onEnded={nextTrack} />
        <p className="text-sm">当前：{currentTrack?.name ?? '未选择曲目'}</p>
        <ul className="space-y-1">
          {state.audio.tracks.map((track) => (
            <li key={track.id} className="flex items-center gap-2 text-sm">
              <button className="rounded bg-white px-2 py-1" onClick={() => setAudio({ currentTrackId: track.id })}>选择</button>
              <span className="flex-1 truncate">{track.name}</span>
              <button className="rounded bg-white px-2 py-1" onClick={() => removeTrack(track.id)}>删除</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
