import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select: React.FC<SelectProps> = ({ label, className = '', children, id, ...props }) => {
  const selectId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2.5 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;