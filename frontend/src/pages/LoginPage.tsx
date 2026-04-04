import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuthMutations';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const login = useLogin();

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    login.mutate(
      { email, password },
      {
        onError: (err: any) => {
          const msg = err?.response?.data?.detail || 'Invalid email or password';
          setErrors({ general: msg });
        },
      }
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D0D0D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(233,69,96,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          position: 'relative',
          zIndex: 1,
          animation: 'fadeInUp 0.5s ease both',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🍳</div>
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            Welcome back
          </h1>
          <p style={{ color: '#A0AEC0', fontSize: '15px' }}>
            Sign in to continue cooking with AI
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'linear-gradient(145deg, #1A1A2E, #16213E)',
            border: '1px solid #2D3748',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          {errors.general && (
            <div
              style={{
                background: 'rgba(252,129,129,0.1)',
                border: '1px solid rgba(252,129,129,0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#FC8181',
                fontSize: '14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                id="login-email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<span style={{ fontSize: '16px' }}>✉️</span>}
                autoComplete="email"
              />

              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<span style={{ fontSize: '16px' }}>🔒</span>}
                rightIcon={
                  <span style={{ fontSize: '14px', userSelect: 'none' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                }
                onRightIconClick={() => setShowPassword((s) => !s)}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={login.isPending}
                id="login-submit"
              >
                Sign In
              </Button>
            </div>
          </form>

          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#A0AEC0',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#E94560',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
