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
    <section className="card flex flex-row items-center gap-4 overflow-hidden">
      <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-md">
        <img
          src={state.ui.avatarImage || 'https://picsum.photos/seed/lofi_study_girl/300/300'}
          alt="Companion"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="card-title">🐰 Companion</h2>
        <div className="panel-subtle mt-1">
          <p className="text-xs">Lv{state.xp.level} · 语气：{toneLabel}</p>
          <p className="mt-1 truncate text-sm">{state.companion.lastMessage}</p>
        </div>
        <div className="mt-2 flex gap-2 text-xs">
          <button className="soft-chip" onClick={() => {
            const text = companionMessage(scene);
            if (state.companion.voiceEnabled) speak(text);
          }}>互动</button>
          <button className="soft-chip" onClick={toggleCompanionVoice}>{state.companion.voiceEnabled ? '关闭语音' : '开启语音'}</button>
        </div>
      </div>
    </section>
  );
}
