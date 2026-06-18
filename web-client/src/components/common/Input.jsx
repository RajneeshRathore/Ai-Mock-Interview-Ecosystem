import { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Input = forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input 
        ref={ref}
        className={twMerge(clsx(
          "w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors",
          error 
            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
            : "border-slate-200 focus:ring-primary-500/20 focus:border-primary-500",
          className
        ))}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
