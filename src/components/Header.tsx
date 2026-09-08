import type { GameMode } from '../game/types';

interface HeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

const MODES: { id: GameMode; label: string; short: string }[] = [
  { id: 'daily', label: 'Daily', short: 'Daily' },
  { id: 'unlimited', label: 'Unlimited', short: 'Free' },
  { id: 'sequence', label: 'Sequence', short: 'Seq' },
];

export function Header({
  mode,
  onModeChange,
  onOpenStats,
  onOpenHelp,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="/" className="site-header__brand" aria-label="Octordle home">
          <span className="site-header__logo" aria-hidden="true">
            8
          </span>
          <span className="site-header__name">Octordle</span>
        </a>

        <nav className="site-header__modes" aria-label="Game modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mode-tab${mode === m.id ? ' mode-tab--active' : ''}`}
              onClick={() => onModeChange(m.id)}
              aria-current={mode === m.id ? 'page' : undefined}
            >
              <span className="mode-tab__full">{m.label}</span>
              <span className="mode-tab__short">{m.short}</span>
            </button>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenStats}
            aria-label="Statistics"
          >
            <StatsIcon />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenHelp}
            aria-label="How to play"
          >
            <HelpIcon />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onOpenSettings}
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function StatsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20V10M10 20V4M16 20v-7M22 20V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.5 9.5a2.5 2.5 0 115 1c0 1.5-2.5 2-2.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
