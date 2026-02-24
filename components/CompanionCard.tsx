'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  utter.rate = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export function CompanionCard() {
  const { state, companionMessage, toggleCompanionVoice } = useAppStore();

  const scene = useMemo(() => {
    if (state.focusRuntime.status === 'running') return 'running';
    if (state.focusRuntime.status === 'break') return 'break';
    return 'idle';
  }, [state.focusRuntime.status]);

  const toneLabel = {
    relaxed: '轻松愉快',
    focused: '认真督促',
    supportive: '复盘支持'
  }[state.companion.currentTone];

  return (
    <section className="card space-y-2">
      <h2 className="text-lg font-semibold">虚拟人物</h2>
      <p className="text-sm">等级 Lv{state.xp.level} ｜ 当前语气：{toneLabel}</p>
      <p className="rounded bg-[#f1e9df] p-2">{state.companion.lastMessage}</p>
      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-white px-3 py-1" onClick={() => {
          const text = companionMessage(scene);
          if (state.companion.voiceEnabled) speak(text);
        }}>发起互动</button>
        <button className="rounded bg-white px-3 py-1" onClick={toggleCompanionVoice}>{state.companion.voiceEnabled ? '关闭语音' : '开启语音'}</button>
      </div>
      <p className="text-xs text-gray-500">未开始番茄钟时语气偏轻松，专注进行中语气更严格，休息阶段提供鼓励和复盘建议。</p>
    </section>
  );
}
