import { useMemo } from 'react';
import { StepSet, StatKey, StatSet } from '@/domain/types';
import { computeFinalDamage } from '@/domain/calculator';
import { Card } from '@/ui/components/base';
import { STAT_LABELS } from '@/domain/constants';
import { TrendingUp, Edit3 } from 'lucide-react';
import { cn } from '@/ui/lib/utils';
import { motion } from 'framer-motion';

interface Props {
  old: StatSet;
  newSet: StatSet;
  steps: StepSet;
  onStepChange: (k: string, v: number) => void;
  pCustom: number;
  isPremium: boolean;
}

export const Efficiency = ({ newSet, steps, onStepChange, pCustom, isPremium }: Props) => {
  const data = useMemo(() => {
    const base = { ...newSet };
    if (!base.atk) base.atk = 100000;
    
    const baseDmg = computeFinalDamage(base, pCustom);
    if (baseDmg <= 0) return [];

    const list: { label: string, norm: number, raw: number, step: number, key: string }[] = [];
    const effKeys: StatKey[] = [
  'atk', 'cr', 'cd',
  // 'as', ❌ 삭제
  'dmg', 'boss', 'min', 'max', 'amp', 'final', 'skill', 'basic'
];

    
    effKeys.forEach(k => {
  const step = steps[k as keyof StepSet] ?? 1;
  if (step <= 0) return;

  const testSet = { ...base };
  if (k === 'atk') testSet.atk = (testSet.atk || 0) + step;
  else testSet[k] = (testSet[k] || 0) + step;

  const newD = computeFinalDamage(testSet, pCustom);
  const gain = (newD / baseDmg - 1) * 100;
  const norm = k === 'atk'
    ? gain / (step / 1000.0)
    : gain / step;

  list.push({
    label: STAT_LABELS[k],
    norm,
    raw: gain,
    step,
    key: k
  });
});

    // Virtual: 주스탯%
    const stepPct = steps['mainPctEff'] ?? 12;
    if (stepPct > 0) {
       const fixed = base.mainFixed || 0;
       const pct = base.mainPct || 0;
       const testSet = { ...base };
       testSet.stat = fixed * (1 + (pct + stepPct) / 100.0) * 0.01;
       const newD = computeFinalDamage(testSet, pCustom);
       const gain = (newD / baseDmg - 1) * 100;
       list.push({ label: "주스탯%(합연산)", norm: gain / stepPct, raw: gain, step: stepPct, key: 'mainPctEff' });
    }

    // Virtual: 고정 주스탯
    const stepFixed = steps['mainFixedEff'] ?? 600;
    if (stepFixed > 0) {
      const pct = base.mainPct || 0;
      const deltaStat = stepFixed * (1 + pct / 100.0) * 0.01;
      const testSet = { ...base };
      testSet.stat = (testSet.stat || 0) + deltaStat;
      const newD = computeFinalDamage(testSet, pCustom);
      const gain = (newD / baseDmg - 1) * 100;
      list.push({ label: "고정 주스탯", norm: gain / (deltaStat > 0 ? deltaStat : 1), raw: gain, step: stepFixed, key: 'mainFixedEff' });
    }

    const sorted = list.sort((a, b) => b.norm - a.norm);
    return isPremium ? sorted : sorted.slice(0, 5);
  }, [newSet, steps, pCustom, isPremium]);

  const topNorm = data.length > 0 ? data[0].norm : 1;

  return (
    <Card className="border-none shadow-2xl shadow-slate-200/50 p-0 overflow-hidden bg-white mt-8">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">효율 분석표</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">상세 효율 시뮬레이션</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
           <Edit3 className="w-3 h-3 text-indigo-400" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">비교 기준 설정</span>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100">
         <ul className="space-y-1.5 text-[11px] text-slate-500 font-medium list-disc list-inside">
            <li>효율 계산은 <span className="text-indigo-600 font-bold">현재 입력된 능력치</span> 기준입니다. (신규 수치 우선, 없으면 기존 수치 사용)</li>
            <li>기본 기준은 모든 %스탯 <span className="text-indigo-600 font-bold">+1%</span>, 장비로 변경되는 공격력은 <span className="text-indigo-600 font-bold">+1000</span>입니다. (아래에서 직접 수정 가능)</li>
            <li>장비 공격력 효율은 <span className="text-indigo-600 font-bold">기준 증가량 × 무기 (장착+보유)효과 × (1 + 스킬 공격력)</span>이 반영된 값 기준입니다.</li>
            <li>효율분석표의 기본 기준값은 <span className="text-indigo-600 font-bold">레전더리 잠재옵션과 레전더리 어빌리티 옵션</span>을 기준으로 하였습니다. <span className="text-indigo-400 font-bold">(수정 가능)</span></li>
         </ul>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider w-16">순위</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">항목</th>
              <th className="px-4 py-3 text-[10px] font-black text-indigo-500 uppercase tracking-wider text-center bg-indigo-50/30">기준 증가량</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">단순 증가율</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">정규화 효율</th>
              <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">비중</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const pct = Math.min(100, (row.norm / topNorm) * 100);
              const isFirst = idx === 0;
              return (
                <motion.tr layout key={row.key} className={cn("group transition-colors border-b border-slate-50 last:border-0", isFirst ? "bg-indigo-50/30" : "hover:bg-slate-50")}>
                  <td className="px-6 py-3">
                    <span className={cn("inline-flex w-5 h-5 items-center justify-center rounded-lg text-[10px] font-black shadow-sm", isFirst ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-100")}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[12px] text-slate-700">{row.label}</td>
                  <td className="px-4 py-3 bg-indigo-50/10 group-hover:bg-indigo-50/30 transition-colors">
                    <div className="flex justify-center">
                      <input 
                        type="number" 
                        value={row.step}
                        onChange={e => onStepChange(row.key, parseFloat(e.target.value))}
                        className="w-20 h-7 bg-white border border-indigo-100 rounded-lg text-center text-[11px] font-black text-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] font-bold text-slate-400">+{row.raw.toFixed(3)}%</td>
                  <td className="px-4 py-3 text-right font-mono text-[12px] font-black text-indigo-600 tabular-nums">{row.norm.toFixed(3)}%</td>
                  <td className="px-6 py-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          className={cn("h-full rounded-full", isFirst ? "bg-gradient-to-r from-indigo-600 to-violet-500 shadow-sm" : "bg-slate-300")}
                        />
                      </div>
                      <span className="text-[10px] font-black text-slate-300 w-6 text-right tabular-nums">{Math.round(pct)}%</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
