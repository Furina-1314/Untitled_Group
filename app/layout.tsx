'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppProvider, useAppStore } from '@/lib/store';
import { GlobalAudioPlayer } from '@/components/GlobalAudioPlayer';

const navs = [
  { href: '/', label: '专注', icon: '🏠' },
  { href: '/calendar', label: '日历', icon: '🗓️' },
  { href: '/todos', label: '待办', icon: '✅' },
  { href: '/notes', label: '笔记', icon: '📝' },
  { href: '/habits', label: '统计', icon: '📊' },
  { href: '/settings', label: '设置', icon: '⚙️' }
];

function Shell({ children }: { children: ReactNode }) {
  const { state } = useAppStore();
  const pathname = usePathname();

  return (
    <body
      className="text-lofi-text"
      style={state.ui.backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.35), rgba(255,255,255,0.35)), url(${state.ui.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : undefined}
    >
      <GlobalAudioPlayer />
      <div className={`app-bg ${state.ui.backgroundImage ? 'app-bg-transparent' : ''}`}>
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="blob blob-a" />
          <div className="blob blob-b" />
          <div className="blob blob-c" />
        </div>

        <div className="flex h-screen">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-dot" />
              <span className="hidden text-xl font-bold tracking-wide text-[#5d576b] lg:block">专注流</span>
            </div>

            <nav className="flex-1 space-y-2 px-3 py-5">
              {navs.map((n) => {
                const active = pathname === n.href;
                return (
                  <a key={n.href} href={n.href} className={`side-link ${active ? 'side-link-active' : ''}`}>
                    <span className="text-base">{n.icon}</span>
                    <span className="hidden lg:inline">{n.label}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          <main className={`flex-1 overflow-auto p-4 lg:p-8 ${state.ui.backgroundImage ? 'bg-white/60 backdrop-blur-[2px]' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </body>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <AppProvider>
        <Shell>{children}</Shell>
      </AppProvider>
    </html>
  );
}
