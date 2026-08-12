import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className={`block text-sm font-bold mb-2 transition-colors ${
          isFocused ? 'text-[var(--color-primary)]' : 'text-zinc-700'
        }`}>
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border-2 rounded-xl text-zinc-900 placeholder-zinc-400 font-medium focus:outline-none transition-all duration-300 ${
          error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
            : 'border-zinc-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'
        } ${className}`}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
