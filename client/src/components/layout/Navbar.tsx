import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/tracker', label: 'Tracker' },
  { path: '/strategy', label: 'Strategy' },
];

export default function Navbar() {
  const location = useLocation();
  const { dark, toggle } = useTheme();
  const { globalStats } = useProgress();

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 pointer-events-none relative">
      {/* Left - Logo */}
      <Link to="/" className="pointer-events-auto no-underline">
        <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg border-2 border-white">
          G
        </div>
      </Link>

      {/* Center - Bubble Nav (absolute centered) */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center rounded-full border border-border bg-white shadow-lg px-1.5 py-1.5 pointer-events-auto">
        {navItems.map(item => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-6 py-2 rounded-full text-[13px] font-medium transition-all no-underline ${
                isActive
                  ? 'bg-white text-text border border-border shadow-sm'
                  : 'text-text-muted hover:text-text border border-transparent'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right - Progress, Bell, Theme, User */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Mini progress badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-border shadow-lg">
          <div className="w-14 bg-border rounded-full h-1.5">
            <div className="bg-success h-1.5 rounded-full transition-all" style={{ width: `${globalStats.percentage}%` }} />
          </div>
          <span className="text-[10px] font-bold text-text-muted">{globalStats.percentage}%</span>
        </div>

        {/* Notification bell */}
        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-surface-secondary transition-colors cursor-pointer bg-white shadow-lg">
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-surface-secondary transition-colors cursor-pointer bg-white shadow-lg"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? (
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* User avatar */}
        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted hover:bg-surface-secondary transition-colors cursor-pointer bg-white shadow-lg">
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
