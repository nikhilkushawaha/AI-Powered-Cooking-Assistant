import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, onRightIconClick, id, style, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    };

    const labelStyle: React.CSSProperties = {
      fontSize: '13px',
      fontWeight: 500,
      color: error ? '#FC8181' : '#A0AEC0',
      letterSpacing: '0.02em',
    };

    const wrapperStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: leftIcon ? '14px 16px 14px 44px' : '14px 16px',
      paddingRight: rightIcon ? '44px' : '16px',
      background: 'rgba(15, 52, 96, 0.6)',
      border: `1.5px solid ${error ? '#FC8181' : focused ? '#E94560' : '#2D3748'}`,
      borderRadius: '12px',
      color: '#FFFFFF',
      fontSize: '15px',
      fontFamily: 'Inter, sans-serif',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxShadow: focused
        ? error
          ? '0 0 0 3px rgba(252,129,129,0.15)'
          : '0 0 0 3px rgba(233,69,96,0.15)'
        : 'none',
      ...style,
    };

    const iconStyle: React.CSSProperties = {
      position: 'absolute',
      left: leftIcon ? '14px' : undefined,
      right: rightIcon ? '14px' : undefined,
      color: focused ? '#E94560' : '#4A5568',
      display: 'flex',
      alignItems: 'center',
      transition: 'color 0.2s ease',
      pointerEvents: onRightIconClick ? 'auto' : 'none',
      cursor: onRightIconClick ? 'pointer' : 'default',
      zIndex: 1,
    };

    const errorStyle: React.CSSProperties = {
      fontSize: '12px',
      color: '#FC8181',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    };

    return (
      <div style={containerStyle}>
        {label && (
          <label htmlFor={id} style={labelStyle}>
            {label}
          </label>
        )}
        <div style={wrapperStyle}>
          {leftIcon && <span style={{ ...iconStyle, left: '14px', right: undefined }}>{leftIcon}</span>}
          <input
            ref={ref}
            id={id}
            style={inputStyle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          {rightIcon && (
            <span
              style={{ ...iconStyle, left: undefined, right: '14px' }}
              onClick={onRightIconClick}
            >
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span style={errorStyle}>⚠ {error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
