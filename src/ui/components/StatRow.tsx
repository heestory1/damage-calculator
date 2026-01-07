import { Info } from 'lucide-react';
import { DeltaInput } from './DeltaInput';
import { fmt } from '@/domain/format';
import { cn } from '../lib/utils';

interface Props {
  label: string;
  desc?: string;
  oldVal: number | undefined;
  onOldChange: (v: number | undefined) => void;
  deltaVal: number | undefined;
  onDeltaChange: (v: number | undefined) => void;
  newVal: number | undefined;
  readOnlyOld?: boolean;
  disableDelta?: boolean;
  deltaPlaceholder?: string;
}

export const StatRow = ({ 
  label, desc,
  oldVal, onOldChange, 
  deltaVal, onDeltaChange,
  newVal,
  readOnlyOld, disableDelta, deltaPlaceholder
}: Props) => {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-[12px] font-black text-slate-500 uppercase tracking-tighter truncate">{label}</span>
        {desc && (
          <div className="relative group/tip flex-shrink-0">
            <Info className="w-3.5 h-3.5 text-slate-300 hover:text-indigo-500 cursor-help transition-colors" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tip:block z-50 w-56 p-3 bg-slate-900 text-white text-[11px] font-medium leading-relaxed rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {desc}
              <div className="absolute top-full left-2 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-[80px]">
          <input 
            type="number" 
            value={oldVal ?? ''} 
            onChange={e => onOldChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
            readOnly={readOnlyOld}
            className={cn(
              "h-8 w-full rounded-lg border border-slate-200 px-2 text-right text-[11px] font-bold outline-none transition-all",
              readOnlyOld ? "bg-slate-100 text-slate-400 border-transparent shadow-none" : "bg-white text-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 shadow-sm"
            )}
            placeholder={readOnlyOld ? "자동" : "0"}
          />
        </div>
        
        <div className="w-[100px]">
          {disableDelta ? (
             <div className="h-8 w-full flex items-center justify-center text-[10px] text-slate-300 font-bold bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
               {deltaPlaceholder || "-"}
             </div>
          ) : (
            <DeltaInput value={deltaVal} onChange={onDeltaChange} className="w-full h-8" />
          )}
        </div>
        
        <div className="w-[80px] h-8 flex items-center justify-end rounded-lg bg-indigo-50 px-2 text-[11px] font-black text-indigo-600 tabular-nums border border-indigo-100/50 shadow-inner">
          {fmt(newVal ?? 0, 2)}
        </div>
      </div>
    </div>
  );
};
