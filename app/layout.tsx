'use client';

import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { AppProvider, useAppStore } from '@/lib/store';
import { GlobalAudioPlayer } from '@/components/GlobalAudioPlayer';

const navs = [
  { href: '/', label: '主控台' },
  { href: '/notes', label: '笔记' },
  { href: '/calendar', label: '日历' },
  { href: '/habits', label: '习惯' },
  { href: '/todos', label: '待办' },
  { href: '/settings', label: '设置' }
];

function Shell({ children }: { children: ReactNode }) {
  const { state } = useAppStore();
  return (
    <body
      className="lofi-bg min-h-screen overflow-hidden text-lofi-text"
      style={state.ui.backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(255,255,255,0.35), rgba(255,255,255,0.35)), url(${state.ui.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } : undefined}
    >
      <GlobalAudioPlayer />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
      </div>

      <div className="mx-auto flex h-screen w-full max-w-7xl flex-col px-3 py-3">
        <header className="mb-3 flex h-10 items-center justify-between rounded-2xl border border-white/40 bg-white/50 px-3 backdrop-blur-sm">
          <div className="text-sm font-semibold">🌸 Focus Companion</div>
          <nav className="flex items-center gap-2 text-xs sm:text-sm">
            {navs.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-full px-2 py-1 hover:bg-white/70">
                {n.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="min-h-0 flex-1">{children}</div>
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
