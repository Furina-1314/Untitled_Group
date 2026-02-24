import type { DiaryEntry, HabitGoal, NoteItem, TodoItem } from './types';

export const serverStore: {
  notes: NoteItem[];
  diaries: DiaryEntry[];
  habits: HabitGoal[];
  todos: TodoItem[];
} = {
  notes: [],
  diaries: [],
  habits: [],
  todos: []
};
