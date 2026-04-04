import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles['navbar-inner']}>
        {/* Logo */}
        <Link to={isAuthenticated ? '/chat' : '/'} className={styles.logo}>
          <span className={styles['logo-icon']}>🍳</span>
          <span className={styles['logo-text']}>Chef AI</span>
        </Link>

        {/* Right side */}
        <div className={styles['nav-right']}>
          {isAuthenticated && user ? (
            <div className={styles['dropdown-wrapper']} ref={dropdownRef}>
              <button
                className={styles['avatar-btn']}
                onClick={() => setDropdownOpen((o) => !o)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                id="user-menu-button"
              >
                <Avatar name={user.full_name} src={user.avatar_url} size={32} />
                <span className={styles['avatar-btn-name']}>{user.full_name.split(' ')[0]}</span>
                <span className={`${styles['avatar-btn-arrow']} ${dropdownOpen ? styles.open : ''}`}>
                  ▼
                </span>
              </button>

              {dropdownOpen && (
                <div className={styles['dropdown-menu']} role="menu">
                  <button
                    className={styles['dropdown-item']}
                    role="menuitem"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/chat');
                    }}
                  >
                    💬 Chat
                  </button>
                  <button
                    className={`${styles['dropdown-item']} ${location.pathname === '/recipes' ? styles.active : ''}`}
                    role="menuitem"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/recipes');
                    }}
                    id="nav-recipes-btn"
                  >
                    🍳 Recipes
                  </button>
                  <div className={styles['dropdown-divider']} />
                  <button
                    className={`${styles['dropdown-item']} ${styles.danger}`}
                    role="menuitem"
                    onClick={handleLogout}
                    id="logout-btn"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles['auth-links']}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                id="nav-login-btn"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/signup')}
                id="nav-signup-btn"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
