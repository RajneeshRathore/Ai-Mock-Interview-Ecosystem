import { Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className, 
  disabled, 
  ...props 
}) {
  const baseStyles = "py-3 px-6 rounded-lg font-medium transition-colors flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:bg-slate-50",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:bg-slate-50",
    danger: "border border-red-200 text-red-500 hover:bg-red-50 disabled:bg-red-50 disabled:opacity-50"
  };

  return (
    <button 
      className={twMerge(clsx(baseStyles, variants[variant], className))}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
