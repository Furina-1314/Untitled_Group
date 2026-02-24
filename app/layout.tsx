import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { AppProvider } from '@/lib/store';
import { GlobalAudioPlayer } from '@/components/GlobalAudioPlayer';

export const metadata = {
  title: '沉浸式专注陪伴工具',
  description: '专注、音乐、陪伴、笔记、习惯、待办一体化应用'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="mx-auto h-screen max-w-7xl overflow-hidden p-3">
        <AppProvider>
          <GlobalAudioPlayer />
          <header className="mb-3 flex h-8 flex-wrap items-center gap-3 text-sm">
            <Link href="/">主控台</Link>
            <Link href="/notes">笔记</Link>
            <Link href="/calendar">日历</Link>
            <Link href="/habits">习惯</Link>
            <Link href="/todos">待办</Link>
          </header>
          <div className="h-[calc(100vh-3.5rem)] overflow-hidden">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}
