import React from 'react';
import './Button.css';

const Button = ({ 
  children,      
  variant = 'primary', 
  size = 'medium',      
  outline = false,      
  onClick,              
  type = 'button',      
  disabled = false,     
  className = ''       
}) => {


  const buttonClass = `btn btn-${variant} btn-${size} ${outline ? 'btn-outline' : ''} ${disabled ? 'btn-disabled' : ''} ${className}`;

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
