import { AudioPanel } from '@/components/AudioPanel';
import { CompanionCard } from '@/components/CompanionCard';
import { FocusTimer } from '@/components/FocusTimer';
import { QuickNote } from '@/components/QuickNote';
import { TodoCard } from '@/components/TodoCard';

export default function HomePage() {
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col px-1 py-2 lg:px-2">
      <div className="mb-4 flex flex-col items-center justify-center">
        <div className="text-6xl">🐰</div>
        <div className="mt-2 rounded-full border border-stone-100 bg-white/50 px-4 py-1 text-sm font-medium text-stone-500 backdrop-blur-sm">
          Focus Companion
        </div>
      </div>

      <div className="grid flex-1 min-h-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col gap-6">
          <div className="min-h-0 flex-1">
            <FocusTimer />
          </div>
          <div className="h-72">
            <TodoCard />
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-6">
          <div className="min-h-[280px] flex-1">
            <QuickNote />
          </div>
          <div className="h-72">
            <AudioPanel />
          </div>
        </div>
      </div>

      <div className="mt-6 h-40">
        <CompanionCard />
      </div>
    </div>
  );
}
