'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AudioTrack, DiaryEntry, HabitGoal, NoteItem, TodoItem } from './types';
import { applyXp, calcCompletedReward, calcEarlyEndReward } from './reward';

const STORAGE_KEY = 'focus-companion-state-v2';

const initialState: AppState = {
  focusConfig: { focusMin: 25, breakMin: 5, mode: 'standard' },
  focusRuntime: { status: 'idle', remainingSec: 25 * 60, elapsedSec: 0, cycleCount: 0 },
  xp: { totalXp: 0, todayXp: 0, level: 1, affinity: 0, streakDays: 0 },
  notes: [],
  diaries: [],
  habits: [],
  todos: [],
  audio: { noiseVolume: 50, musicVolume: 40, mixRatio: 0.5, tracks: [], playing: false, currentSec: 0, durationSec: 0 },
  companion: { hidden: false, voiceEnabled: true, currentTone: 'relaxed', lastMessage: '今天也一起专注完成目标。' }
};

type AppContextType = {
  state: AppState;
  setFocusConfig: (focusMin: number, breakMin: number, mode: AppState['focusConfig']['mode']) => void;
  startFocus: () => void;
  pauseFocus: () => void;
  resumeFocus: () => void;
  tickFocus: () => void;
  fastForward: () => void;
  endNow: () => void;
  saveQuickNote: (input: Pick<NoteItem, 'title' | 'content' | 'tags'>) => void;
  updateNote: (id: string, patch: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  saveDiary: (input: Pick<DiaryEntry, 'date' | 'title' | 'content'>) => void;
  updateDiary: (id: string, patch: Partial<DiaryEntry>) => void;
  deleteDiary: (id: string) => void;
  addHabit: (input: Omit<HabitGoal, 'id' | 'updatedAt' | 'completed'>) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  addTodo: (input: Omit<TodoItem, 'id' | 'done' | 'createdAt' | 'updatedAt'>) => void;
  updateTodo: (id: string, patch: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  setAudio: (patch: Partial<AppState['audio']>) => void;
  addTrack: (track: AudioTrack) => void;
  removeTrack: (id: string) => void;
  nextTrack: () => void;
  togglePlay: () => void;
  companionMessage: (scene: 'idle' | 'running' | 'break') => string;
  toggleCompanionVoice: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setState(JSON.parse(raw) as AppState);
      } catch {
        setState(initialState);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setFocusConfig = (focusMin: number, breakMin: number, mode: AppState['focusConfig']['mode']) => {
    setState((prev) => ({
      ...prev,
      focusConfig: { focusMin, breakMin, mode },
      focusRuntime: { ...prev.focusRuntime, remainingSec: focusMin * 60 }
    }));
  };

  const startFocus = () => {
    setState((prev) => ({
      ...prev,
      focusRuntime: {
        ...prev.focusRuntime,
        status: 'running',
        startedAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + prev.focusConfig.focusMin * 60000).toISOString(),
        remainingSec: prev.focusConfig.focusMin * 60,
        elapsedSec: 0,
        sessionId: crypto.randomUUID()
      }
    }));
  };

  const pauseFocus = () => setState((prev) => ({ ...prev, focusRuntime: { ...prev.focusRuntime, status: 'paused' } }));
  const resumeFocus = () => setState((prev) => ({ ...prev, focusRuntime: { ...prev.focusRuntime, status: 'running' } }));

  const settle = (kind: 'complete' | 'end') => {
    setState((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const reward = kind === 'complete'
        ? calcCompletedReward(prev.focusRuntime.elapsedSec, prev.focusConfig.mode, prev.xp.streakDays || 1)
        : calcEarlyEndReward(prev.focusRuntime.elapsedSec, prev.focusConfig.mode, prev.xp.streakDays || 1);
      const xp = applyXp(prev.xp, reward.xp, reward.affinity, today);
      const inBreak = kind === 'complete';
      return {
        ...prev,
        xp,
        companion: {
          ...prev.companion,
          currentTone: inBreak ? 'supportive' : 'relaxed',
          lastMessage: kind === 'complete' ? `本轮完成，获得 ${reward.xp} XP。` : `已结束并结算，累计 ${reward.xp} XP。`
        },
        focusRuntime: {
          ...prev.focusRuntime,
          status: inBreak ? 'break' : 'idle',
          cycleCount: prev.focusRuntime.cycleCount + 1,
          remainingSec: inBreak ? prev.focusConfig.breakMin * 60 : prev.focusConfig.focusMin * 60
        }
      };
    });
  };

  const tickFocus = () => {
    setState((prev) => {
      if (prev.focusRuntime.status !== 'running') return prev;
      const remainingSec = Math.max(0, prev.focusRuntime.remainingSec - 1);
      const elapsedSec = prev.focusRuntime.elapsedSec + 1;
      const next = { ...prev, focusRuntime: { ...prev.focusRuntime, remainingSec, elapsedSec } };
      if (remainingSec === 0) {
        const today = new Date().toISOString().slice(0, 10);
        const reward = calcCompletedReward(elapsedSec, prev.focusConfig.mode, prev.xp.streakDays || 1);
        const xp = applyXp(prev.xp, reward.xp, reward.affinity, today);
        return {
          ...next,
          xp,
          companion: { ...prev.companion, currentTone: 'supportive', lastMessage: `完成专注，获得 ${reward.xp} XP。` },
          focusRuntime: {
            ...next.focusRuntime,
            status: 'break',
            cycleCount: prev.focusRuntime.cycleCount + 1,
            remainingSec: prev.focusConfig.breakMin * 60
          }
        };
      }
      return next;
    });
  };

  const fastForward = () => settle('complete');
  const endNow = () => settle('end');

  const saveQuickNote = (input: Pick<NoteItem, 'title' | 'content' | 'tags'>) => {
    setState((prev) => ({
      ...prev,
      notes: [{
        id: crypto.randomUUID(),
        title: input.title,
        content: input.content,
        tags: input.tags,
        sessionId: prev.focusRuntime.sessionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, ...prev.notes]
    }));
  };

  const updateNote = (id: string, patch: Partial<NoteItem>) => setState((prev) => ({
    ...prev,
    notes: prev.notes.map((n) => n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n)
  }));
  const deleteNote = (id: string) => setState((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));

  const saveDiary = (input: Pick<DiaryEntry, 'date' | 'title' | 'content'>) => setState((prev) => ({
    ...prev,
    diaries: [{ id: crypto.randomUUID(), ...input, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev.diaries]
  }));
  const updateDiary = (id: string, patch: Partial<DiaryEntry>) => setState((prev) => ({
    ...prev,
    diaries: prev.diaries.map((d) => d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d)
  }));
  const deleteDiary = (id: string) => setState((prev) => ({ ...prev, diaries: prev.diaries.filter((d) => d.id !== id) }));

  const addHabit = (input: Omit<HabitGoal, 'id' | 'updatedAt' | 'completed'>) => setState((prev) => ({
    ...prev,
    habits: [{ ...input, id: crypto.randomUUID(), completed: false, updatedAt: new Date().toISOString() }, ...prev.habits]
  }));
  const toggleHabit = (id: string) => setState((prev) => ({
    ...prev,
    habits: prev.habits.map((h) => h.id === id ? { ...h, completed: !h.completed, updatedAt: new Date().toISOString() } : h)
  }));
  const deleteHabit = (id: string) => setState((prev) => ({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }));

  const addTodo = (input: Omit<TodoItem, 'id' | 'done' | 'createdAt' | 'updatedAt'>) => setState((prev) => ({
    ...prev,
    todos: [{ ...input, id: crypto.randomUUID(), done: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev.todos]
  }));
  const updateTodo = (id: string, patch: Partial<TodoItem>) => setState((prev) => ({
    ...prev,
    todos: prev.todos.map((t) => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)
  }));
  const deleteTodo = (id: string) => setState((prev) => ({ ...prev, todos: prev.todos.filter((t) => t.id !== id) }));

  const setAudio = (patch: Partial<AppState['audio']>) => setState((prev) => ({ ...prev, audio: { ...prev.audio, ...patch } }));
  const addTrack = (track: AudioTrack) => setState((prev) => ({
    ...prev,
    audio: {
      ...prev.audio,
      tracks: [...prev.audio.tracks, track],
      currentTrackId: prev.audio.currentTrackId ?? track.id
    }
  }));
  const removeTrack = (id: string) => setState((prev) => {
    const tracks = prev.audio.tracks.filter((t) => t.id !== id);
    const currentTrackId = prev.audio.currentTrackId === id ? tracks[0]?.id : prev.audio.currentTrackId;
    return { ...prev, audio: { ...prev.audio, tracks, currentTrackId, currentSec: 0, durationSec: 0 } };
  });
  const nextTrack = () => setState((prev) => {
    const idx = prev.audio.tracks.findIndex((t) => t.id === prev.audio.currentTrackId);
    if (idx < 0 || prev.audio.tracks.length === 0) return prev;
    const next = prev.audio.tracks[(idx + 1) % prev.audio.tracks.length];
    return { ...prev, audio: { ...prev.audio, currentTrackId: next.id, currentSec: 0 } };
  });
  const togglePlay = () => setState((prev) => ({ ...prev, audio: { ...prev.audio, playing: !prev.audio.playing } }));

  const companionMessage = (scene: 'idle' | 'running' | 'break') => {
    const mapping: Record<typeof scene, string> = {
      idle: '今天的安排很清晰，我们从一轮高质量专注开始。',
      running: '当前是专注时段，请先完成这轮任务，保持节奏。',
      break: '休息完成后继续下一轮，你的执行力正在稳定提升。'
    };
    setState((prev) => ({
      ...prev,
      companion: {
        ...prev.companion,
        currentTone: scene === 'running' ? 'focused' : scene === 'break' ? 'supportive' : 'relaxed',
        lastMessage: mapping[scene]
      }
    }));
    return mapping[scene];
  };
  const toggleCompanionVoice = () => setState((prev) => ({ ...prev, companion: { ...prev.companion, voiceEnabled: !prev.companion.voiceEnabled } }));

  const value = useMemo<AppContextType>(() => ({
    state,
    setFocusConfig,
    startFocus,
    pauseFocus,
    resumeFocus,
    tickFocus,
    fastForward,
    endNow,
    saveQuickNote,
    updateNote,
    deleteNote,
    saveDiary,
    updateDiary,
    deleteDiary,
    addHabit,
    toggleHabit,
    deleteHabit,
    addTodo,
    updateTodo,
    deleteTodo,
    setAudio,
    addTrack,
    removeTrack,
    nextTrack,
    togglePlay,
    companionMessage,
    toggleCompanionVoice
  }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used inside AppProvider');
  return ctx;
}
