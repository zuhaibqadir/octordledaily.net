import type { GameMode } from '../game/types';

interface ModeSelectorProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

export function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="mode-selector" role="tablist" aria-label="Select game mode">
      {(
        [
          { id: 'daily', label: 'Daily' },
          { id: 'unlimited', label: 'Unlimited' },
          { id: 'sequence', label: 'Sequence' },
        ] as const
      ).map((m) => (
        <button
          key={m.id}
          type="button"
          role="tab"
          aria-selected={mode === m.id}
          className={`mode-selector__btn${mode === m.id ? ' is-active' : ''}`}
          onClick={() => onChange(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
