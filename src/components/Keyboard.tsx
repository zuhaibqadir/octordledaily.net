import { KEYBOARD_ROWS, type LetterStatus } from '../game/types';
import { KeyboardKey } from './KeyboardKey';

interface KeyboardProps {
  statuses: Record<string, LetterStatus>;
  onLetter: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  disabled?: boolean;
}

export function Keyboard({
  statuses,
  onLetter,
  onEnter,
  onBackspace,
  disabled,
}: KeyboardProps) {
  const handlePress = (key: string) => {
    if (disabled) return;
    if (key === 'ENTER') onEnter();
    else if (key === 'BACKSPACE') onBackspace();
    else onLetter(key);
  };

  return (
    <div className="keyboard" role="group" aria-label="On-screen keyboard">
      {KEYBOARD_ROWS.map((row, ri) => (
        <div key={ri} className="keyboard__row">
          {row.map((key) => (
            <KeyboardKey
              key={key}
              label={key}
              wide={key === 'ENTER' || key === 'BACKSPACE'}
              status={key.length === 1 ? statuses[key] : undefined}
              onPress={handlePress}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
