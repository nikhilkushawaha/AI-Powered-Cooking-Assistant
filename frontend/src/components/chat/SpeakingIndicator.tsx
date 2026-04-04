import React from 'react';
import { useSpeech } from '../../hooks/useSpeech';
import { useChatStore } from '../../store/chatStore';

const SpeakingIndicator: React.FC = () => {
  const isSpeaking = useChatStore((s) => s.isSpeaking);
  const { stopSpeaking } = useSpeech();

  if (!isSpeaking) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 16px',
        background: 'rgba(233,69,96,0.08)',
        border: '1px solid rgba(233,69,96,0.2)',
        borderRadius: '100px',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      {/* Sound waves */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        {[0.6, 1, 0.7, 1, 0.5].map((h, i) => (
          <div
            key={i}
            style={{
              width: '3px',
              height: `${h * 16}px`,
              background: 'linear-gradient(to top, #E94560, #F5A623)',
              borderRadius: '2px',
              animation: `pulse 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '13px', color: '#E94560', fontWeight: 500 }}>
        🔊 Speaking
      </span>
      <button
        onClick={stopSpeaking}
        style={{
          background: 'rgba(233,69,96,0.15)',
          border: 'none',
          borderRadius: '100px',
          padding: '3px 10px',
          color: '#E94560',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
        aria-label="Stop speaking"
      >
        Stop
      </button>
    </div>
  );
};

export default SpeakingIndicator;
