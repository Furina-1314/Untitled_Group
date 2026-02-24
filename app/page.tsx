import { AudioPanel } from '@/components/AudioPanel';
import { CompanionCard } from '@/components/CompanionCard';
import { FocusTimer } from '@/components/FocusTimer';
import { QuickNote } from '@/components/QuickNote';
import { TodoCard } from '@/components/TodoCard';

export default function HomePage() {
  return (
    <main className="grid h-full grid-cols-12 grid-rows-12 gap-3 overflow-hidden">
      <section className="col-span-12 row-span-4 min-h-0 overflow-hidden lg:col-span-4 lg:row-span-6">
        <div className="h-full overflow-auto"><FocusTimer /></div>
      </section>
      <section className="col-span-12 row-span-4 min-h-0 overflow-hidden lg:col-span-4 lg:row-span-6">
        <div className="h-full overflow-auto"><AudioPanel /></div>
      </section>
      <section className="col-span-12 row-span-4 min-h-0 overflow-hidden lg:col-span-4 lg:row-span-6">
        <div className="h-full overflow-auto"><CompanionCard /></div>
      </section>
      <section className="col-span-12 row-span-4 min-h-0 overflow-hidden lg:col-span-6 lg:row-span-6">
        <div className="h-full overflow-auto"><QuickNote /></div>
      </section>
      <section className="col-span-12 row-span-4 min-h-0 overflow-hidden lg:col-span-6 lg:row-span-6">
        <div className="h-full overflow-auto"><TodoCard /></div>
      </section>
    </main>
  );
}
