import type { LetterStatus } from '../game/types';

interface TileProps {
  letter: string;
  status: LetterStatus;
  delay?: number;
  small?: boolean;
}

export function Tile({ letter, status, delay = 0, small }: TileProps) {
  const revealed = status === 'correct' || status === 'present' || status === 'absent';

  return (
    <div
      className={`tile tile--${status}${small ? ' tile--small' : ''}${revealed ? ' tile--revealed' : ''}${letter && status === 'tbd' ? ' tile--pop' : ''}`}
      style={revealed ? { animationDelay: `${delay}ms` } : undefined}
      aria-label={
        letter
          ? `${letter}, ${status === 'tbd' ? 'entered' : status}`
          : 'empty'
      }
    >
      <span className="tile__letter">{letter}</span>
    </div>
  );
}
