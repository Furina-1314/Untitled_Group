'use client';

import { useMemo, useState } from 'react';

export function CompanionCard() {
  const [level, setLevel] = useState(1);
  const [silent, setSilent] = useState(false);

  const line = useMemo(() => {
    if (silent) return '已静默：专注优先，我会在你需要时出现。';
    if (level < 10) return '先完成这一轮，我们慢慢来。';
    if (level < 30) return '你今天的节奏很稳，继续就会看到变化。';
    return '我一直在，你已经是非常可靠的自己。';
  }, [level, silent]);

  return (
    <section className="card space-y-2">
      <h2 className="text-lg font-semibold">虚拟人物 A</h2>
      <p className="text-xs text-gray-600">AI/系统生成内容，仅供陪伴参考。</p>
      <div className="flex items-center gap-2">
        <span>Lv {level}</span>
        <input type="range" min={1} max={50} value={level} onChange={(e)=>setLevel(Number(e.target.value))} className="w-full"/>
      </div>
      <button className="rounded bg-white px-3 py-1" onClick={()=>setSilent(s=>!s)}>{silent ? '取消静默' : '静默模式'}</button>
      <p className="rounded bg-[#f1e9df] p-2">{line}</p>
    </section>
  );
}
