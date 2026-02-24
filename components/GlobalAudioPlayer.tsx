'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function GlobalAudioPlayer() {
  const { state, nextTrack, setAudio } = useAppStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceTrackIdRef = useRef<string | undefined>(undefined);
  const currentTrack = useMemo(() => state.audio.tracks.find((t) => t.id === state.audio.currentTrackId), [state.audio.currentTrackId, state.audio.tracks]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = state.audio.musicVolume / 100;
  }, [state.audio.musicVolume]);

  useEffect(() => {
    const player = audioRef.current;
    if (!player) return;
    if (!currentTrack) {
      player.removeAttribute('src');
      player.load();
      sourceTrackIdRef.current = undefined;
      setAudio({ currentSec: 0, durationSec: 0, playing: false });
      return;
    }

    if (sourceTrackIdRef.current !== currentTrack.id) {
      player.src = currentTrack.objectUrl;
      player.load();
      sourceTrackIdRef.current = currentTrack.id;
      setAudio({ currentSec: 0 });
    }
  }, [currentTrack, setAudio]);

  useEffect(() => {
    const player = audioRef.current;
    if (!player || !currentTrack) return;
    if (state.audio.playing) {
      void player.play().catch(() => setAudio({ playing: false }));
    } else {
      player.pause();
    }
  }, [state.audio.playing, currentTrack, setAudio]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (typeof state.audio.seekToSec !== 'number') return;
    audioRef.current.currentTime = state.audio.seekToSec;
    setAudio({ seekToSec: undefined });
  }, [state.audio.seekToSec, setAudio]);

  return (
    <audio
      ref={audioRef}
      className="hidden"
      onLoadedMetadata={(e) => setAudio({ durationSec: Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0 })}
      onTimeUpdate={(e) => setAudio({ currentSec: e.currentTarget.currentTime })}
      onEnded={() => {
        if (state.audio.tracks.length === 0) return;
        nextTrack();
      }}
    />
  );
}
