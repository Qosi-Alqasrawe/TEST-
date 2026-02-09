import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || props.name;
  
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} text-slate-100 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 placeholder-slate-500 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;