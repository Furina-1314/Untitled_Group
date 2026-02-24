'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function GlobalAudioPlayer() {
  const { state, nextTrack, setAudio } = useAppStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
      return;
    }

    if (player.src !== currentTrack.objectUrl) {
      player.src = currentTrack.objectUrl;
      player.load();
    }

    if (state.audio.playing) {
      void player.play().catch(() => {
        setAudio({ playing: false });
      });
    } else {
      player.pause();
    }
  }, [currentTrack, state.audio.playing, setAudio]);

  return (
    <audio
      ref={audioRef}
      className="hidden"
      onEnded={() => {
        if (state.audio.tracks.length === 0) return;
        nextTrack();
      }}
    />
  );
}
