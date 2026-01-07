import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface DeltaInputProps {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export const DeltaInput = ({ value, onChange, disabled, className }: DeltaInputProps) => {
  const [str, setStr] = useState("");
  
  useEffect(() => {
    if (value === undefined) {
      if (str !== "") setStr("");
    } else {
      const current = parseFloat(str);
      if (isNaN(current) || Math.abs(current - value) > 0.0001) {
        setStr(value > 0 ? `+${value}` : `${value}`);
      }
    }
  }, [value]);

  const handleToggle = () => {
    if (!str) return;
    const n = parseFloat(str);
    if (!isNaN(n)) {
      const newVal = -n;
      setStr(newVal > 0 ? `+${newVal}` : `${newVal}`);
      onChange(newVal);
    }
  };

  const val = parseFloat(str);
  const colorClass = !isNaN(val) && val !== 0 
    ? (val > 0 ? "text-rose-500" : "text-blue-500") 
    : "text-slate-400";

  return (
    <div className={cn("flex h-7 items-stretch gap-0", className)}>
      <button 
        type="button"
        onClick={handleToggle}
        disabled={disabled || !str}
        className="flex w-6 items-center justify-center rounded-l border border-slate-200 bg-slate-50 text-[10px] font-black text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-30"
      >
        ±
      </button>
      <input 
        value={str} 
        onChange={(e) => {
          const s = e.target.value;
          setStr(s);
          const n = parseFloat(s);
          onChange(isNaN(n) ? undefined : n);
        }} 
        placeholder="0" 
        className={cn(
          "w-full border-y border-r border-slate-200 px-1 text-center text-[10px] font-bold outline-none focus:border-indigo-300 focus:bg-indigo-50/5 rounded-r transition-all",
          colorClass,
          disabled && "bg-slate-50 opacity-50"
        )}
        disabled={disabled}
      />
    </div>
  );
};
