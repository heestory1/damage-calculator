import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface Props {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  textAlign?: 'left' | 'right' | 'center';
}

export const FormattedInput = ({ 
  value, onChange, readOnly, placeholder, className, textAlign = 'right' 
}: Props) => {
  // Internal string state to handle formatting
  const [str, setStr] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Sync prop value to internal string state when not focused
  useEffect(() => {
    if (value === undefined || value === null) {
      if (str !== "") setStr("");
    } else {
      if (!isFocused) {
        // Format with commas when not focused
        setStr(value.toLocaleString());
      }
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 1. Always update local string state immediately for responsiveness
    setStr(inputValue);

    // 2. Parse for parent component
    const raw = inputValue.replace(/,/g, '');
    
    // Allow empty or just minus sign -> Parent gets undefined
    if (raw === '' || raw === '-') {
      onChange(undefined);
      return;
    }

    // Allow decimals in progress (e.g. "12." -> don't update parent yet or update as 12)
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value !== undefined) {
      setStr(value.toLocaleString());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value !== undefined) {
      // Remove commas for editing
      setStr(value.toString()); 
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={str}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      readOnly={readOnly}
      placeholder={placeholder}
      className={cn(
        "h-8 w-full rounded-lg border border-slate-200 px-2 text-[11px] font-bold outline-none transition-all",
        textAlign === 'right' && "text-right",
        textAlign === 'center' && "text-center",
        textAlign === 'left' && "text-left",
        readOnly 
          ? "bg-slate-100 text-slate-400 border-transparent shadow-none cursor-default" 
          : "bg-white text-slate-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 shadow-sm",
        className
      )}
    />
  );
};
