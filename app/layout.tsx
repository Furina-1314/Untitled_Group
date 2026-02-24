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
      <body className="mx-auto max-w-6xl p-4">
        <AppProvider>
          <GlobalAudioPlayer />
          <header className="mb-4 flex flex-wrap gap-3 text-sm">
            <Link href="/">主控台</Link>
            <Link href="/notes">笔记</Link>
            <Link href="/calendar">日历</Link>
            <Link href="/habits">习惯</Link>
            <Link href="/todos">待办</Link>
          </header>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
