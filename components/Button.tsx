import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'dark';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // TaskNest Pink
    primary: "bg-brand-pink hover:bg-brand-pinkHover text-brand-dark shadow-md shadow-pink-200 focus:ring-brand-pink",
    // Standard white/gray
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm focus:ring-slate-400",
    // TaskNest Dark Purple
    dark: "bg-brand-dark hover:bg-brand-purple text-white shadow-lg focus:ring-brand-dark",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 focus:ring-rose-500",
    ghost: "bg-transparent hover:bg-brand-pink/10 text-brand-dark focus:ring-slate-300"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};