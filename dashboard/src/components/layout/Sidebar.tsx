import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Route,
  Layers,
  Settings,
  X,
  Megaphone,
  Radio,
  Users,
  Shield,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/journeys', icon: Route, label: 'Journeys' },
  { to: '/campaigns', icon: Megaphone, label: 'Campaigns' },
  { to: '/channels', icon: Radio, label: 'Channels' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/manage', icon: Layers, label: 'Manage' },
  { to: '/stages', icon: Settings, label: 'Stages' },
];

const adminNavItems = [
  { to: '/setup', icon: Wrench, label: 'Setup' },
  { to: '/users', icon: Shield, label: 'Users' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border)] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center shadow-sm">
              <Route size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-[var(--color-sidebar-text)]">Journey Analytics</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-[var(--color-sidebar-text-muted)] hover:text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--color-sidebar-text)]'
                    : 'text-[var(--color-sidebar-text-muted)] hover:text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]'
                }`
              }
              end={to === '/'}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator - left border accent */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--color-sidebar-active-border)] rounded-r-full" />
                  )}
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-2 px-3">
                <p className="text-xs font-semibold text-[var(--color-sidebar-text-muted)] uppercase tracking-wider">Admin</p>
              </div>
              {adminNavItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[var(--color-sidebar-text)]'
                        : 'text-[var(--color-sidebar-text-muted)] hover:text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[var(--color-sidebar-active-border)] rounded-r-full" />
                      )}
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-[var(--color-border)]">
          <p className="px-3 text-xs text-[var(--color-sidebar-text-muted)]">Customer Journey v1.0</p>
        </div>
      </aside>
    </>
  );
}
