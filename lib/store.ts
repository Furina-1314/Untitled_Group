import { HabitCheck, NoteItem, TodoItem } from './types';

const notes: NoteItem[] = [];
const habits: HabitCheck[] = [];
const todos: TodoItem[] = [];

export const db = {
  notes,
  habits,
  todos
};
