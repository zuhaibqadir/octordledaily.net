import type { LetterStatus } from '../game/types';

interface KeyboardKeyProps {
  label: string;
  status?: LetterStatus;
  wide?: boolean;
  onPress: (key: string) => void;
}

export function KeyboardKey({ label, status, wide, onPress }: KeyboardKeyProps) {
  const display =
    label === 'BACKSPACE' ? '⌫' : label === 'ENTER' ? 'ENTER' : label;
  const aria =
    label === 'BACKSPACE'
      ? 'Backspace'
      : label === 'ENTER'
        ? 'Submit guess'
        : label;

  return (
    <button
      type="button"
      className={`key${wide ? ' key--wide' : ''}${status && status !== 'empty' && status !== 'tbd' ? ` key--${status}` : ''}`}
      onClick={() => onPress(label)}
      aria-label={aria}
      tabIndex={-1}
    >
      {display}
    </button>
  );
}
