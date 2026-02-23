import { AudioPanel } from '@/components/AudioPanel';
import { CompanionCard } from '@/components/CompanionCard';
import { FocusTimer } from '@/components/FocusTimer';
import { QuickNote } from '@/components/QuickNote';
import { TodoCard } from '@/components/TodoCard';

export default function HomePage() {
  return (
    <main className="grid gap-4 md:grid-cols-2">
      <FocusTimer />
      <AudioPanel />
      <CompanionCard />
      <QuickNote />
      <TodoCard />
    </main>
  );
}
