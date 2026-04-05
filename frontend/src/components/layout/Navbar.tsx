import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuthStore } from '../../store/authStore';
import { useFavoriteStore } from '../../store/favoriteStore';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { totalFavorites } = useFavoriteStore();
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
        <Link to="/" className={styles.logo}>
          <span className={styles['logo-icon']}>🍳</span>
          <span className={styles['logo-text']}>Chef AI</span>
        </Link>

        {/* Main Links */}
        {isAuthenticated && user && (
          <div className={styles['nav-links']}>
            <button
              className={`${styles['nav-link']} ${location.pathname === '/chat' ? styles.active : ''}`}
              onClick={() => navigate('/chat')}
            >
              💬 Chat
            </button>
            <button
              className={`${styles['nav-link']} ${location.pathname === '/recipes' ? styles.active : ''}`}
              onClick={() => navigate('/recipes')}
            >
              🍳 Recipes
            </button>
            <button
              className={`${styles['nav-link']} ${location.pathname === '/knowledge' ? styles.active : ''}`}
              onClick={() => navigate('/knowledge')}
            >
              📚 Knowledge
            </button>
            <button
              className={`${styles['nav-link']} ${location.pathname === '/favorites' ? styles.active : ''}`}
              onClick={() => navigate('/favorites')}
            >
              ❤️ Favorites
              {totalFavorites > 0 && <span className={styles['fav-badge']}>{totalFavorites}</span>}
            </button>
          </div>
        )}

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
                  <button
                    className={`${styles['dropdown-item']} ${location.pathname === '/knowledge' ? styles.active : ''}`}
                    role="menuitem"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/knowledge');
                    }}
                    id="nav-knowledge-btn"
                  >
                    📚 Knowledge
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
