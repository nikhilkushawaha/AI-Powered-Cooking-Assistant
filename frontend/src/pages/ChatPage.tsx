import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import ChatWindow from '../components/chat/ChatWindow';
import { useAuthStore } from '../store/authStore';
import { useChatStore } from '../store/chatStore';
import { chatApi } from '../api/chatApi';
import { truncateText, getDietaryBadgeColor } from '../utils/helpers';
import Avatar from '../components/ui/Avatar';

const ChatPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { session_id, messages, resetSession, clearMessages } = useChatStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const firstMessage = messages.find((m) => m.role === 'user');
  const sessionLabel = firstMessage
    ? truncateText(firstMessage.content, 36)
    : 'New conversation';

  const handleNewChat = async () => {
    // Clear current session on backend
    if (messages.length > 0) {
      try {
        await chatApi.clearSession(session_id);
      } catch {
        // ignore
      }
    }
    resetSession();
  };

  const badgeColor = getDietaryBadgeColor(user.dietary_preference);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0D0D0D',
        overflow: 'hidden',
      }}
    >
      <Navbar />

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          paddingTop: '64px',
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          style={{
            width: sidebarOpen ? '280px' : '0px',
            minWidth: sidebarOpen ? '280px' : '0px',
            background: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)',
            borderRight: '1px solid #2D3748',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
            {/* User info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Avatar name={user.full_name} src={user.avatar_url} size={42} />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.full_name}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: `${badgeColor}22`,
                    color: badgeColor,
                    borderRadius: '100px',
                    fontWeight: 500,
                    marginTop: '3px',
                    display: 'inline-block',
                    textTransform: 'capitalize',
                  }}
                >
                  {user.dietary_preference}
                </div>
              </div>
            </div>

            {/* New chat */}
            <button
              onClick={handleNewChat}
              id="new-chat-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, rgba(233,69,96,0.15), rgba(245,166,35,0.1))',
                border: '1px dashed rgba(233,69,96,0.4)',
                borderRadius: '12px',
                color: '#E94560',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                width: '100%',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(233,69,96,0.25), rgba(245,166,35,0.15))';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(233,69,96,0.15), rgba(245,166,35,0.1))';
              }}
            >
              <span style={{ fontSize: '18px' }}>+</span>
              New Chat
            </button>

            {/* Session history */}
            <div>
              <p style={{ fontSize: '11px', color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                Current Session
              </p>
              {messages.length > 0 && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(233,69,96,0.08)',
                    border: '1px solid rgba(233,69,96,0.25)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500, marginBottom: '4px' }}>
                    💬 {sessionLabel}
                  </div>
                  <div style={{ fontSize: '11px', color: '#4A5568' }}>
                    {messages.length} message{messages.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar footer */}
          <div style={{ padding: '16px', borderTop: '1px solid #2D3748' }}>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: '1px solid #2D3748',
                borderRadius: '10px',
                color: '#4A5568',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#FC8181';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#FC8181';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#4A5568';
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#2D3748';
              }}
              id="sidebar-logout"
            >
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* ── Sidebar toggle ── */}
        <button
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          style={{
            position: 'absolute',
            left: sidebarOpen ? '270px' : '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 100,
            width: '24px',
            height: '48px',
            background: '#1A1A2E',
            border: '1px solid #2D3748',
            borderRadius: '0 8px 8px 0',
            color: '#4A5568',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            transition: 'all 0.3s ease',
          }}
        >
          {sidebarOpen ? '‹' : '›'}
        </button>

        {/* ── Chat ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ChatWindow user={user} />
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
