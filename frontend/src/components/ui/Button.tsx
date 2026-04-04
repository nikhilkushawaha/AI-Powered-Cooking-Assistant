import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      cursor: loading || disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      borderRadius: '24px',
      transition: 'all 0.2s ease',
      width: fullWidth ? '100%' : undefined,
      opacity: loading || disabled ? 0.65 : 1,
      position: 'relative',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      letterSpacing: '0.01em',
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '8px 16px', fontSize: '13px' },
      md: { padding: '12px 24px', fontSize: '15px' },
      lg: { padding: '16px 32px', fontSize: '16px' },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'linear-gradient(135deg, #E94560 0%, #F5A623 100%)',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(233,69,96,0.35)',
      },
      secondary: {
        background: '#1A1A2E',
        color: '#fff',
        border: '1px solid #2D3748',
      },
      outline: {
        background: 'transparent',
        color: '#E94560',
        border: '2px solid #E94560',
      },
      ghost: {
        background: 'transparent',
        color: '#A0AEC0',
      },
      danger: {
        background: '#FC8181',
        color: '#fff',
      },
    };

    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        style={{
          ...baseStyle,
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        {...props}
        onMouseEnter={(e) => {
          if (!loading && !disabled) {
            if (variant === 'primary') {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(233,69,96,0.5)';
            } else {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = '';
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            variant === 'primary' ? '0 4px 15px rgba(233,69,96,0.35)' : '';
          props.onMouseLeave?.(e);
        }}
      >
        {loading ? (
          <>
            <span className="spinner" />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
