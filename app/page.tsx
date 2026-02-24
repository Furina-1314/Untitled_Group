import { AudioPanel } from '@/components/AudioPanel';
import { CompanionCard } from '@/components/CompanionCard';
import { FocusTimer } from '@/components/FocusTimer';
import { QuickNote } from '@/components/QuickNote';
import { TodoCard } from '@/components/TodoCard';

export default function HomePage() {
  return (
    <main className="grid h-full grid-cols-12 grid-rows-12 gap-3 overflow-hidden">
      <section className="col-span-12 row-span-3 min-h-0 sm:col-span-6 lg:col-span-4 lg:row-span-6">
        <FocusTimer />
      </section>
      <section className="col-span-12 row-span-4 min-h-0 sm:col-span-6 lg:col-span-4 lg:row-span-6">
        <AudioPanel />
      </section>
      <section className="col-span-12 row-span-3 min-h-0 sm:col-span-6 lg:col-span-4 lg:row-span-6">
        <CompanionCard />
      </section>
      <section className="col-span-12 row-span-4 min-h-0 sm:col-span-6 lg:col-span-6 lg:row-span-6">
        <QuickNote />
      </section>
      <section className="col-span-12 row-span-5 min-h-0 lg:col-span-6 lg:row-span-6">
        <TodoCard />
      </section>
    </main>
  );
}
