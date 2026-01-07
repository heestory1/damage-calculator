import { Card } from '@/ui/components/base';
import { HelpCircle, AlertCircle } from 'lucide-react';

export const HelpSection = () => {
  return (
    <Card className="border-none shadow-xl shadow-slate-200/40 p-0 overflow-hidden mb-8">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Usage Guidelines</h3>
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase">Ver 2.0 Guide</span>
      </div>
      
      <div className="p-6 bg-slate-50/50">
        <div className="flex gap-4 items-start">
          <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <ul className="space-y-2 text-[13px] text-slate-600 leading-relaxed font-medium list-disc list-outside ml-1">
            <li>
              모든 % 수치는 <span className="text-slate-900 font-bold">그대로 입력</span>합니다. 
              (예: 크리티컬 데미지 172.3% → <span className="text-rose-600 font-black">172.3</span>, 스킬데미지 58% → <span className="text-rose-600 font-black">58</span>)
            </li>
            <li>
              <span className="text-indigo-600 font-bold">증가/감소</span> 칸에는 <span className="text-indigo-600 font-bold">신규 장비로 인한 순수 + / − 변화량</span>만 입력합니다.
              (예: 크확 +0.7% → <span className="text-rose-600 font-black">+0.7</span>, 크뎀 -5.5% → <span className="text-rose-600 font-black">-5.5</span>)
            </li>
            <li>
              <span className="text-indigo-600 font-bold">마을 상태창 공격력</span>은 마을 기준 그대로 입력합니다. (무기 착용 및 보유효과 포함 / 스킬 제외)
            </li>
            <li>
              공격력 증감란에는 <span className="text-indigo-600 font-bold">신규 장비로 인한 순수 공격력 변화량</span>만 입력합니다.
            </li>
            <li>
              증감을 비워두면 <span className="text-indigo-600 font-bold">신규 수치 = 기존 수치</span>로 자동 유지됩니다.
            </li>
            <li>
              <span className="text-indigo-600 font-bold">스탯비례 데미지(%)</span>와 <span className="text-indigo-600 font-bold">현재 주스탯%(합연산,%)</span>를 입력하면, 
              <span className="text-slate-900 font-bold underline decoration-indigo-200 decoration-2 underline-offset-2">고정 주스탯이 자동 추정</span>됩니다.
            </li>
            <li>
              신규 장비로 <span className="text-indigo-600 font-bold">주스탯%(합연산,%)</span>가 변하면, 추정된 고정 주스탯을 기준으로 
              <span className="text-indigo-600 font-bold">스탯비례 데미지(%)</span>가 <span className="text-slate-900 font-bold">자동 갱신</span>됩니다.
            </li>
            <li>
              <span className="text-indigo-600 font-bold">무기 장착 및 보유효과(합연산,%)</span>은 직접 계산기를 통하여 합산 후 그 값을 입력합니다.
            </li>
            <li>
              <span className="text-indigo-600 font-bold">스킬로 올라가는 공격력%(합연산,%)</span>도 스킬/버프 등으로 인한 증가분을 모두 합산한 값을 그대로 입력합니다.
            </li>
            <li>
              <span className="text-indigo-600 font-bold">공격 속도</span>는 <span className="text-indigo-600 font-bold">기본기술 비중(p)</span>만큼만 DPS에 반영됩니다.
            </li>
            <li>
              <span className="text-indigo-600 font-bold">스킬 데미지(%)</span>는 <span className="text-indigo-600 font-bold">스킬공격 비중(1-p)</span>만큼만 DPS에 반영됩니다.
            </li>
          </ul>
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-t border-slate-100 flex justify-between items-center">
        <div className="text-[10px] text-slate-400 font-bold italic">* All logic follows the original 'Torifun' design.</div>
        <div className="flex gap-4">
           <span className="text-[10px] text-slate-400 font-black tracking-tighter uppercase">Scania Server</span>
           <span className="text-[10px] text-slate-400 font-black tracking-tighter uppercase">Scania 9 HeeStory</span>
        </div>
      </div>
    </Card>
  );
};
