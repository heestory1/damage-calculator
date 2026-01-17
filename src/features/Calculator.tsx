import { __debugAttackSpeed } from '../domain/calculator';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCalculator } from './useCalculator';
import { Card } from '@/ui/components/base';
import { StatRow } from '@/ui/components/StatRow';
import { STAT_LABELS, STAT_ORDER, STAT_DESCRIPTIONS, MYSTIC_WEAPON_FIXED } from '@/domain/constants';
import { Efficiency } from './Efficiency';
import { StorageSection } from './Storage';
import { useAuth } from './useAuth';
import { HelpSection } from './HelpSection';
import { cn } from '@/ui/lib/utils';
import { 
  ChevronUp, 
  RotateCcw, 
  ShieldCheck, 
  User, 
  BarChart3, 
  Calculator as CalcIcon,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

export const Calculator = () => {
  console.log('[attackSpeedTest]', __debugAttackSpeed(66.7));
  
  const { isPremium } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { 
    rawOld,
    old, setOldValue, 
    delta, setDeltaValue, 
    newSet, 
    pCustom, setPCustom, 
    effSteps, setEffSteps,
    results,
    loadState
  } = useCalculator();

  return (
    <div className="min-h-screen bg-[#f1f5f9] selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        isScrolled ? "py-2 bg-white/90 backdrop-blur-2xl shadow-sm border-b border-slate-200" : "py-4 bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">T</div>
            <span className={cn("font-black tracking-tighter text-xl", isScrolled ? "text-slate-900" : "text-white uppercase")}>Torifun</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-400/30 text-indigo-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Active</span>
            </div>
            <div className={cn("flex items-center gap-2", isScrolled ? "text-slate-400" : "text-white/60")}>
               <User className="w-3.5 h-3.5" />
               <span className="text-[10px] font-black uppercase tracking-wider">9서버 희수토리</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <section className="relative h-[250px] md:h-[320px] flex items-center justify-center overflow-hidden bg-slate-950">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.85 }}
          transition={{ duration: 1.5 }}
          src="./banner.jpg" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-[#f1f5f9]"></div>
        
        <div className="relative z-10 text-center px-4 pt-4">
          <motion.a
            href="https://www.youtube.com/@heestory111"
            target="_blank"
            rel="noopener noreferrer" 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-[#ff0000] hover:bg-[#cc0000] text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest mb-6 shadow-2xl shadow-red-500/30 transition-all hover:scale-105"
          >
            <span className="fill-current">▶</span> HeeStory YouTube
          </motion.a>
        </div>
      </section>

      {/* Main UI */}
      <main className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Left Panel */}
          <div className="lg:col-span-8 space-y-6">
            <HelpSection />
            <StorageSection current={{ old, delta, pCustom, effSteps }} onLoad={loadState} />

            <Card className="border-none shadow-2xl shadow-slate-200/60 p-0 overflow-hidden bg-white/80 backdrop-blur-xl">
              <div className="px-6 py-5 bg-white/50 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    <CalcIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">스탯 입력 설정</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">정밀 수치 데이터 입력</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 rounded-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 md:p-4 space-y-0.5">
                {/* Minimal Header */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr,70px,90px,70px] gap-3 mb-2 hidden sm:grid px-4 opacity-30">
                  <div className="text-[9px] font-black text-slate-900 uppercase tracking-widest">항목</div>
                  <div className="text-[9px] font-black text-slate-900 uppercase tracking-widest text-right pr-1">기존</div>
                  <div className="text-[9px] font-black text-slate-900 uppercase tracking-widest text-center">변화량</div>
                  <div className="text-[9px] font-black text-slate-900 uppercase tracking-widest text-right pr-1">신규</div>
                </div>

                {STAT_ORDER.map(key => (
                  <div key={key} className="relative">
                    <StatRow
                      label={STAT_LABELS[key]}
                      desc={STAT_DESCRIPTIONS[key]}
                      oldVal={key === 'weapon' ? rawOld[key] : old[key]}
                      onOldChange={(v) => setOldValue(key, v)}
                      deltaVal={delta[key]}
                      onDeltaChange={(v) => setDeltaValue(key, v)}
                      newVal={key === 'weapon' ? (newSet[key] ?? 0) - MYSTIC_WEAPON_FIXED : newSet[key]}
                      readOnlyOld={key === 'mainFixed'}
                      disableDelta={key === 'stat' || key === 'weapon' || key === 'skillAtk'}
                      deltaPlaceholder="Auto"
                    />
                    
                    {/* Specialized AS/Weight UI */}
                  </div>
                ))}
              </div>
            </Card>

            <Efficiency 
              old={old} 
              newSet={newSet} 
              steps={effSteps} 
              onStepChange={(k, v) => setEffSteps(prev => ({...prev, [k]: v}))}
              pCustom={pCustom}
              isPremium={isPremium}
            />
          </div>

          {/* Sticky Results Dashboard (Right) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <Card className="bg-slate-900 border-none shadow-2xl shadow-indigo-500/30 p-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-slate-900 to-rose-600/10 opacity-60"></div>
              
              <div className="relative z-10 p-8">
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <BarChart3 className="w-4.5 h-4.5" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">성장 지표</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse delay-75" />
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Primary Variance */}
                  <div className="bg-white/[0.03] rounded-[40px] py-12 border border-white/5 text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                    <div className={cn(
                      "text-7xl font-black tracking-tighter transition-all duration-700 tabular-nums leading-none",
                      results.diff > 0 ? "text-rose-500" : (results.diff < 0 ? "text-indigo-400" : "text-white")
                    )}>
                      {results.diff > 0 ? "+" : ""}{(results.diff * 100).toFixed(2)}<span className="text-3xl ml-1 opacity-20">%</span>
                    </div>
                    <p className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">최종 데미지 증감률</p>
                  </div>

                  {/* Comparisons */}
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 group/box hover:bg-white/[0.05] transition-colors">
                      <div className="text-slate-500 text-[10px] font-black uppercase mb-2 tracking-widest flex items-center justify-center gap-1">
                        기존 <ArrowRight className="w-2.5 h-2.5 rotate-180" />
                      </div>
                      <div className="font-mono font-bold text-slate-300 tracking-tighter truncate text-lg">
                        {results.oldDmg.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20 group/box hover:bg-indigo-500/20 transition-colors">
                      <div className="text-indigo-400 text-[10px] font-black uppercase mb-2 tracking-widest flex items-center justify-center gap-1">
                        신규 <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                      <div className="font-mono font-bold text-white tracking-tighter truncate text-lg">
                        {results.newDmg.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>

                  {/* New Feature: Boosted Damage Result */}
                  <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20">
                    <div className="flex items-center justify-between mb-1">
                       <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">효율 기준 적용 예측</div>
                       <div className="bg-amber-500 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded leading-none uppercase">기준값 적용됨</div>
                    </div>
                    <div className="font-mono font-black text-white text-xl tracking-tighter">
                      {results.boostedDmg.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-[9px] text-amber-500/60 font-bold mt-1 uppercase tracking-tighter">효율 기준 수치 적용 시 예상 데미지</p>
                  </div>

                  {/* AS Integrated Info - Interactive & Visual */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-3">
                       <div className="text-indigo-400 text-[11px] font-black uppercase flex items-center gap-1.5 leading-none tracking-wider">
                          <Layers className="w-3 h-3" />
                          공격 속도 최적화
                       </div>
                       <div className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight">
                          Frame Optimization
                       </div>
                    </div>

                    <div className="bg-white/[0.03] rounded-2xl p-5 border border-white/5 space-y-5 relative overflow-hidden group/as">
                       <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/as:opacity-20 transition-opacity">
                          <RotateCcw className="w-12 h-12 text-indigo-500" />
                       </div>

                       {/* Input & Current Status */}
                       <div className="relative z-10 flex items-end justify-between gap-4">
                          <div className="flex-1">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 block">
                               내 캐릭터 공속 (%)
                            </label>
                            <div className="flex items-center gap-2">
                               <input 
                                  type="number" 
                                  value={old.as || 0}
                                  onChange={(e) => setOldValue('as', parseFloat(e.target.value))}
                                  className="bg-slate-950/50 border border-white/10 text-white text-xl font-black w-24 px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all tabular-nums text-center shadow-inner"
                                  placeholder="0"
                               />
                               <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">현재 적용</span>
                                  <span className="text-lg font-black text-indigo-400 leading-none">
                                     {results.asBreakdown.currentFrame}<span className="text-[10px] ml-0.5">프레임</span>
                                  </span>
                               </div>
                            </div>
                          </div>
                       </div>

                       {/* Visual Progress Bar */}
                       <div className="relative z-10">
                          <div className="flex justify-between items-end mb-1.5">
                             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                                다음 단계 (<span className="text-slate-300">{results.asBreakdown.nextFrame}프레임</span>) 까지
                             </span>
                             <span className="text-[10px] font-black text-rose-400 tabular-nums">
                                {results.asBreakdown.reqASForNext > results.asBreakdown.currentAS ? (
                                   <>+{ (results.asBreakdown.reqASForNext - results.asBreakdown.currentAS).toFixed(2) }% 필요</>
                                ) : (
                                   <span className="text-emerald-400">최적화 완료!</span>
                                )}
                             </span>
                          </div>
                          <div className="h-3 bg-slate-900/80 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-white/5 relative">
                             {/* Background Markers (Optional) */}
                             <div className="absolute inset-0 flex">
                                <div className="w-[33%] border-r border-white/5 h-full"></div>
                                <div className="w-[33%] border-r border-white/5 h-full"></div>
                             </div>
                             
                             {/* Fill Bar */}
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, Math.max(5, results.asBreakdown.progress * 100))}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                                className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-rose-500 relative"
                             >
                                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                             </motion.div>
                          </div>
                          <div className="flex justify-between text-[8px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                             <span>유지 최소컷 {Math.ceil(results.asBreakdown.minASForCurrent)}%</span>
                             <span>목표 {Math.ceil(results.asBreakdown.reqASForNext)}%</span>
                          </div>
                       </div>

                       {/* Efficiency Insight */}
                       <div className="relative z-10 bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                             <TrendingUp className="w-4 h-4 text-indigo-300" />
                          </div>
                          <div>
                             <div className="text-[9px] text-indigo-300 font-bold uppercase tracking-tight mb-0.5">
                                성장을 위한 팁
                             </div>
                             <div className="text-xs font-medium text-slate-300 leading-tight">
                                공속이 빨라지면 같은 시간 동안 <span className="text-white font-bold underline decoration-indigo-500 decoration-2 underline-offset-2">초당 타수</span>가 증가합니다.
                                <br/>
                                <span className="text-[10px] text-indigo-400 mt-1 block font-black">
                                   다음 단계 도달 시 공격 횟수 약 {((34/results.asBreakdown.nextFrame)/(34/results.asBreakdown.currentFrame) * 100 - 100).toFixed(1)}% 증가
                                </span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 group transition-all hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300">
               <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">9</div>
               <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 leading-none">Original Engine</div>
                 <div className="text-[14px] font-black text-slate-800 tracking-tight leading-none">Scania 9서버 희수토리</div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-200 text-center flex flex-col items-center gap-8 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">T</div>
          <div className="text-left">
            <span className="font-black tracking-tighter text-2xl text-slate-900 uppercase block leading-none">Torifun</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Project Maple</span>
          </div>
        </div>
        <div className="max-w-md text-[11px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
          본 도구의 모든 계산 로직과 기획은 희수토리님에 의해 제작되었습니다.<br/>
          무단 배포 및 상업적 이용을 금하며, 출처 표기를 권장합니다.
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 pt-4 border-t border-slate-100 w-full">
          © 2026 Torifun · Scania 9 HeeStory
        </div>
      </footer>

      {/* FAB */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          "fixed bottom-10 right-10 p-4 bg-indigo-600 text-white rounded-[24px] shadow-2xl shadow-indigo-500/40 transition-all duration-500 z-50 hover:-translate-y-2 active:scale-90 border border-white/20",
          isScrolled ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-50"
        )}
      >
        <ChevronUp className="w-7 h-7" />
      </button>
    </div>
  );
};
