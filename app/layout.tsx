import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: '沉浸式专注陪伴工具',
  description: 'Next.js + TypeScript + Tailwind MVP'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="mx-auto max-w-5xl p-4">
        <header className="mb-4 flex flex-wrap gap-3 text-sm">
          <Link href="/">主控台</Link>
          <Link href="/notes">笔记</Link>
          <Link href="/calendar">日历</Link>
          <Link href="/habits">习惯</Link>
          <Link href="/todos">待办</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
