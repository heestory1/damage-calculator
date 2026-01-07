import React from 'react';
import { cn } from '../lib/utils';

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-2xl border border-slate-200 p-4 shadow-sm", className)}>
    {children}
  </div>
);

export const Button = ({ variant = 'primary', size = 'default', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'danger'|'ghost', size?: 'default'|'sm'|'lg' }) => {
  const base = "inline-flex items-center justify-center rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    danger: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base"
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, readOnly, ...props }, ref) => (
  <input 
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
      readOnly && "bg-slate-50 text-slate-500 cursor-default",
      className
    )}
    readOnly={readOnly}
    {...props}
  />
));
