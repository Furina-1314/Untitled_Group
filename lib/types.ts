export type FocusMode = 'standard' | 'deep';
export type FocusStatus = 'idle' | 'running' | 'paused' | 'break';

export interface FocusConfig {
  focusMin: number;
  breakMin: number;
  mode: FocusMode;
}

export interface FocusRuntime {
  status: FocusStatus;
  startedAt?: string;
  endsAt?: string;
  remainingSec: number;
  elapsedSec: number;
  cycleCount: number;
  sessionId?: string;
}

export interface XPProfile {
  totalXp: number;
  todayXp: number;
  level: number;
  affinity: number;
  streakDays: number;
  lastFocusDate?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  sessionId?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitGoal {
  id: string;
  title: string;
  targetType: 'daily_pomodoro' | 'weekly_focus_min';
  targetValue: number;
  completed: boolean;
  updatedAt: string;
}

export interface TodoItem {
  id: string;
  content: string;
  dueDate?: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AudioTrack {
  id: string;
  name: string;
  objectUrl: string;
  fileType: string;
  size: number;
  createdAt: string;
}

export interface AudioState {
  noiseVolume: number;
  musicVolume: number;
  mixRatio: number;
  tracks: AudioTrack[];
  currentTrackId?: string;
  playing: boolean;
  currentSec: number;
  durationSec: number;
  seekToSec?: number;
}

export interface CompanionState {
  hidden: boolean;
  voiceEnabled: boolean;
  currentTone: 'relaxed' | 'focused' | 'supportive';
  lastMessage: string;
}

export interface AppState {
  focusConfig: FocusConfig;
  focusRuntime: FocusRuntime;
  xp: XPProfile;
  notes: NoteItem[];
  diaries: DiaryEntry[];
  habits: HabitGoal[];
  todos: TodoItem[];
  audio: AudioState;
  companion: CompanionState;
}
