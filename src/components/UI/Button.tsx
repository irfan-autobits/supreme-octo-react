// project/src/components/UI/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'lightGreen' | 'lightGreenoutline' | 'disabled' | 'darkGreen' | 'darkGreenoutline' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  
  const variantClasses = {
    disabled: 'bg-zinc-400 text-white',
    lightGreen: 'bg-[#85AF49] text-white hover:bg-transparent hover:text-[#85AF49] hover:border hover:border-[#85AF49]',
    lightGreenoutline: 'bg-transparent border border-[#85AF49] text-[#85AF49] hover:bg-[#85AF49] hover:text-white',
    darkGreen: 'bg-[#43893D] text-white hover:bg-transparent hover:text-[#43893D] hover:border hover:border-[#43893D]',
    darkGreenoutline: 'bg-transparent border border-[#43893D] text-[#43893D] hover:bg-[#43893D] hover:text-white',
    // ✅ Green Primary
    primary: 'bg-[#85AF49] text-white hover:bg-[#6B9436]',

    // ✅ Keep secondary clean, maybe add subtle green tone if needed
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',

    // ✅ Green Outline (soft hover)
    outline: 'bg-transparent border border-[#85AF49] text-[#85AF49] hover:bg-[#F3F9EC]'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;