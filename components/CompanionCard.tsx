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
  const scene = useMemo(() => (state.focusRuntime.status === 'running' ? 'running' : state.focusRuntime.status === 'break' ? 'break' : 'idle'), [state.focusRuntime.status]);
  const toneLabel = { relaxed: '轻松', focused: '认真', supportive: '鼓励' }[state.companion.currentTone];

  return (
    <section className="card flex flex-col gap-2 overflow-hidden">
      <h2 className="card-title">🐰 陪伴角色</h2>
      <div className="rounded-2xl bg-[#fff5fa] p-3">
        <p className="text-xs">Lv{state.xp.level} · 语气：{toneLabel}</p>
        <p className="mt-2 break-words text-sm">{state.companion.lastMessage}</p>
      </div>
      <div className="flex gap-2 text-xs">
        <button className="soft-chip" onClick={() => {
          const text = companionMessage(scene);
          if (state.companion.voiceEnabled) speak(text);
        }}>互动</button>
        <button className="soft-chip" onClick={toggleCompanionVoice}>{state.companion.voiceEnabled ? '关闭语音' : '开启语音'}</button>
      </div>
      <p className="mt-auto text-xs text-gray-500">专注时更严格，休息时更温和。</p>
    </section>
  );
}
