import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const FOOD_EMOJIS = ['🍕', '🍜', '🥗', '🍳', '🧁', '🥘', '🍱', '🥩'];

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Chat Assistant',
    desc: 'Context-aware conversations that remember your preferences and dietary habits.',
  },
  {
    icon: '🎤',
    title: 'Voice Enabled',
    desc: 'Speak your questions, hear the answers — perfect for hands-free cooking.',
  },
  {
    icon: '📚',
    title: 'Recipe Knowledge',
    desc: 'Thousands of recipes at your fingertips, personalized just for you.',
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#0D0D0D', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '64px',
        }}
      >
        {/* Animated gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 70% at 50% -10%, rgba(233,69,96,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(245,166,35,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating food emojis */}
        {FOOD_EMOJIS.map((emoji, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${20 + (i % 3) * 10}px`,
              opacity: 0.15,
              top: `${10 + (i * 11) % 70}%`,
              left: i < 4 ? `${5 + i * 8}%` : `${70 + (i - 4) * 7}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {emoji}
          </div>
        ))}

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '800px',
            padding: '0 24px',
            animation: 'fadeInUp 0.8s ease both',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(233,69,96,0.1)',
              border: '1px solid rgba(233,69,96,0.25)',
              borderRadius: '100px',
              padding: '6px 16px',
              fontSize: '13px',
              color: '#E94560',
              marginBottom: '28px',
              fontWeight: 500,
            }}
          >
            🚀 Powered by LLaMA 3.3 + Groq
          </div>

          <h1
            style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '20px',
              letterSpacing: '-0.03em',
            }}
          >
            Your AI-Powered
            <br />
            <span className="gradient-text">Personal Chef</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              color: '#A0AEC0',
              maxWidth: '560px',
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Ask anything about cooking — recipes, techniques, ingredients —
            powered by advanced AI that understands your taste.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/signup')}
              id="hero-get-started"
              style={{
                padding: '16px 36px',
                background: 'linear-gradient(135deg, #E94560, #F5A623)',
                border: 'none',
                borderRadius: '100px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(233,69,96,0.45)',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'translateY(-3px)';
                (e.target as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(233,69,96,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = '';
                (e.target as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(233,69,96,0.45)';
              }}
            >
              Get Started Free 🍳
            </button>

            <button
              onClick={scrollToFeatures}
              id="hero-learn-more"
              style={{
                padding: '16px 36px',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.15)',
                borderRadius: '100px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = '#E94560';
                (e.target as HTMLButtonElement).style.color = '#E94560';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.target as HTMLButtonElement).style.color = '#fff';
              }}
            >
              See How It Works
            </button>
          </div>

          {/* Stats bar */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              marginTop: '56px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { num: '10K+', label: 'Recipes' },
              { num: 'Free', label: 'To Use' },
              { num: 'AI', label: 'Powered' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #E94560, #F5A623)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.num}
                </div>
                <div style={{ fontSize: '13px', color: '#4A5568', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        ref={featuresRef}
        style={{
          padding: 'clamp(64px, 10vw, 120px) 24px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: '12px' }}>
            Everything you need to{' '}
            <span className="gradient-text">cook better</span>
          </h2>
          <p style={{ color: '#A0AEC0', fontSize: '16px' }}>
            Chef AI combines powerful AI with an intuitive interface
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="glass"
              style={{
                padding: '36px 28px',
                borderRadius: '20px',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(233,69,96,0.2)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(233,69,96,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = '';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                (e.currentTarget as HTMLDivElement).style.borderColor = '';
              }}
            >
              <div
                style={{
                  fontSize: '40px',
                  marginBottom: '20px',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ color: '#A0AEC0', fontSize: '15px', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        style={{
          padding: 'clamp(64px, 10vw, 100px) 24px',
          background: 'linear-gradient(145deg, #1A1A2E, #0D0D0D)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: '12px' }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: '#A0AEC0', marginBottom: '56px', fontSize: '16px' }}>
            Get started in under a minute
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '32px',
            }}
          >
            {[
              { step: '1', emoji: '👤', label: 'Create Account', desc: 'Sign up for free in seconds — no credit card required.' },
              { step: '2', emoji: '💬', label: 'Ask Your Question', desc: 'Chat naturally about recipes, ingredients, or techniques.' },
              { step: '3', emoji: '🍽️', label: 'Cook Amazing Food', desc: 'Follow AI-guided recipes and impress everyone at the table.' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E94560, #F5A623)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    margin: '0 auto 16px',
                    boxShadow: '0 0 24px rgba(233,69,96,0.35)',
                  }}
                >
                  {s.emoji}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{s.label}</h3>
                <p style={{ color: '#A0AEC0', fontSize: '14px', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/signup')}
            id="how-it-works-cta"
            style={{
              marginTop: '56px',
              padding: '16px 48px',
              background: 'linear-gradient(135deg, #E94560, #F5A623)',
              border: 'none',
              borderRadius: '100px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(233,69,96,0.4)',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = '';
            }}
          >
            Start Cooking with AI 🚀
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          padding: '40px 24px',
          borderTop: '1px solid #2D3748',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🍳 Chef AI</div>
        <p style={{ color: '#4A5568', fontSize: '14px' }}>
          Made with ❤️ for food lovers · © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
