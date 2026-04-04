import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignup } from '../hooks/useAuthMutations';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { getPasswordStrength } from '../utils/helpers';

const DIETARY_OPTIONS = [
  { value: 'any', label: '🍽️ Any' },
  { value: 'vegetarian', label: '🥗 Vegetarian' },
  { value: 'vegan', label: '🌱 Vegan' },
  { value: 'non-vegetarian', label: '🥩 Non-Vegetarian' },
];

const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dietaryPreference, setDietaryPreference] = useState('any');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const signup = useSignup();
  const strength = getPasswordStrength(password);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    signup.mutate(
      { full_name: fullName, email, password, dietary_preference: dietaryPreference },
      {
        onError: (err: any) => {
          const msg = err?.response?.data?.detail || 'Failed to create account. Please try again.';
          setErrors({ general: msg });
        },
      }
    );
  };

  const strengthColor = { weak: '#FC8181', medium: '#F5A623', strong: '#48BB78' }[strength];
  const strengthWidth = { weak: '33%', medium: '66%', strong: '100%' }[strength];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0D0D0D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 24px',
      }}
    >
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,166,35,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 1,
          animation: 'fadeInUp 0.5s ease both',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '44px', marginBottom: '8px' }}>🍳</div>
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            Create your account
          </h1>
          <p style={{ color: '#A0AEC0', fontSize: '15px' }}>
            Start cooking smarter with Chef AI
          </p>
        </div>

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
              }}
            >
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                id="signup-fullname"
                type="text"
                label="Full Name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                leftIcon={<span style={{ fontSize: '16px' }}>👤</span>}
                autoComplete="name"
              />

              <Input
                id="signup-email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                leftIcon={<span style={{ fontSize: '16px' }}>✉️</span>}
                autoComplete="email"
              />

              <div>
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Create a strong password"
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
                  autoComplete="new-password"
                />
                {/* Password strength bar */}
                {password && (
                  <div style={{ marginTop: '8px' }}>
                    <div
                      style={{
                        height: '4px',
                        background: '#2D3748',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: strengthWidth,
                          background: strengthColor,
                          borderRadius: '4px',
                          transition: 'width 0.3s ease, background 0.3s ease',
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: strengthColor,
                        marginTop: '4px',
                        textTransform: 'capitalize',
                        fontWeight: 500,
                      }}
                    >
                      {strength} password
                    </p>
                  </div>
                )}
              </div>

              {/* Dietary Preference */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="signup-diet"
                  style={{ fontSize: '13px', fontWeight: 500, color: '#A0AEC0' }}
                >
                  Dietary Preference
                </label>
                <select
                  id="signup-diet"
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(15, 52, 96, 0.6)',
                    border: '1.5px solid #2D3748',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '15px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%23A0AEC0\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    backgroundSize: '12px',
                  }}
                >
                  {DIETARY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: '#1A1A2E' }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={signup.isPending}
                id="signup-submit"
              >
                Create Account 🚀
              </Button>
            </div>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#A0AEC0' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#E94560', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
