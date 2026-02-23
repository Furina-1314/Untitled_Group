export type FocusMode = 'standard' | 'deep';
export type SessionStatus = 'running' | 'paused' | 'completed' | 'ended';

export interface FocusSession {
  id: string;
  mode: FocusMode;
  plannedFocusMin: number;
  plannedBreakMin: number;
  elapsedSec: number;
  status: SessionStatus;
  startedAt: string;
}

export interface RewardResult {
  points: number;
  affinity: number;
  streakMultiplier: number;
  modeMultiplier: number;
  qualified: boolean;
}

export interface NoteItem {
  id: string;
  sessionId?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface HabitCheck {
  id: string;
  title: string;
  checked: boolean;
  date: string;
}

export interface TodoItem {
  id: string;
  content: string;
  dueDate?: string;
  done: boolean;
}
