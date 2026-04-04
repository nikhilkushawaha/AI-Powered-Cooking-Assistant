import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 0',
        animation: 'fadeInUp 0.3s ease both',
      }}
    >
      {/* Chef AI avatar */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #E94560, #F5A623)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
          boxShadow: '0 0 12px rgba(233,69,96,0.4)',
        }}
      >
        🍳
      </div>

      <div
        style={{
          background: 'linear-gradient(145deg, #1A1A2E, #16213E)',
          border: '1px solid #2D3748',
          borderRadius: '18px 18px 18px 4px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Dots */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E94560, #F5A623)',
                display: 'block',
                animation: `typingDot 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontSize: '13px',
            color: '#4A5568',
            fontStyle: 'italic',
          }}
        >
          Chef AI is thinking…
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
