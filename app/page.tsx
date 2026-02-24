'use client';

import { AudioPanel } from '@/components/AudioPanel';
import { FocusTimer } from '@/components/FocusTimer';
import { QuickNote } from '@/components/QuickNote';
import { TodoCard } from '@/components/TodoCard';
import { useAppStore } from '@/lib/store';

export default function HomePage() {
  const { state, companionMessage } = useAppStore();

  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col px-1 py-2 lg:px-2">
      <div className="mb-4 flex flex-col items-center justify-center">
        <button
          onClick={() => companionMessage(state.focusRuntime.status === 'running' ? 'running' : state.focusRuntime.status === 'break' ? 'break' : 'idle')}
          className="h-40 w-40 overflow-hidden rounded-full border-4 border-white/90 shadow-xl"
        >
          <img
            src={state.ui.avatarImage || 'https://picsum.photos/seed/lofi_study_girl/400/400'}
            alt="Companion"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
        <p className="mt-2 text-xs tracking-[0.3em] text-stone-500">CLICK TO CHAT</p>
        <div className="mt-2 rounded-full border border-stone-100 bg-white/80 px-4 py-1 text-sm font-medium text-stone-500">
          Level {state.xp.level} · {state.xp.totalXp} EXP
        </div>
      </div>

      <div className="grid flex-1 min-h-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="min-h-[320px]"><FocusTimer /></div>
        <div className="min-h-[320px]"><QuickNote /></div>
        <div className="min-h-[280px]"><TodoCard /></div>
        <div className="min-h-[280px]"><AudioPanel /></div>
      </div>
    </div>
  );
}
