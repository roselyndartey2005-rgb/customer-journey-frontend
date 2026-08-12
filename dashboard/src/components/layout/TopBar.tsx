import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <h1 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent-bg)] flex items-center justify-center border border-[var(--color-accent-border)]">
              <User size={16} className="text-[var(--color-accent)]" />
            </div>
            <span className="text-sm font-medium text-[var(--color-text-primary)] hidden sm:block max-w-[120px] truncate">
              {user?.username}
            </span>
          </button>

          {/* User dropdown */}
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-[var(--color-border)]">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{user?.username}</p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
