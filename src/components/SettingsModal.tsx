import type { GameSettings } from '../game/types';
import { Modal } from './Modal';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: GameSettings;
  onChange: (patch: Partial<GameSettings>) => void;
}

export function SettingsModal({
  open,
  onClose,
  settings,
  onChange,
}: SettingsModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="settings-list">
        <fieldset className="settings-group">
          <legend>Appearance</legend>
          <div className="settings-options">
            {(
              [
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`settings-chip${settings.theme === opt.value ? ' is-active' : ''}`}
                onClick={() => onChange({ theme: opt.value })}
                aria-pressed={settings.theme === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="settings-toggle">
          <span>
            <strong>High contrast</strong>
            <span className="settings-toggle__hint">
              Stronger color cues for letter states
            </span>
          </span>
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => onChange({ highContrast: e.target.checked })}
          />
        </label>

        <label className="settings-toggle">
          <span>
            <strong>Animations</strong>
            <span className="settings-toggle__hint">Tile flips and transitions</span>
          </span>
          <input
            type="checkbox"
            checked={settings.animations}
            onChange={(e) => onChange({ animations: e.target.checked })}
          />
        </label>
      </div>
    </Modal>
  );
}
