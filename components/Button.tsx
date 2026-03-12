import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-lg active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-gold text-black hover:bg-brand-goldHover shadow-[0_4px_20px_-5px_rgba(247,174,17,0.4)] hover:shadow-[0_6px_25px_-5px_rgba(247,174,17,0.5)] border border-brand-gold",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm",
    outline: "border border-brand-gold text-brand-gold hover:bg-brand-gold/10",
    ghost: "text-neutral-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
    xl: "px-9 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;