import type { BoardState, GameMode, TileState } from '../game/types';
import { getDisplayRows } from '../game/gameLogic';
import { Tile } from './Tile';

interface GameBoardProps {
  board: BoardState;
  index: number;
  currentGuess: string;
  guessCount: number;
  isActive: boolean;
  mode: GameMode;
  compact?: boolean;
}

export function GameBoard({
  board,
  index,
  currentGuess,
  guessCount,
  isActive,
  mode,
  compact,
}: GameBoardProps) {
  const rows: TileState[][] = getDisplayRows(
    board,
    currentGuess,
    guessCount,
    isActive,
    mode,
  );

  // For standard mode, show only rows that matter visually — all 13 but sized down
  const visibleRows =
    mode === 'sequence'
      ? rows
      : rows;

  return (
    <div
      className={`game-board${board.solved ? ' game-board--solved' : ''}${!isActive && mode === 'sequence' ? ' game-board--locked' : ''}${compact ? ' game-board--compact' : ''}`}
      aria-label={`Word ${index + 1}${board.solved ? ', solved' : ''}`}
    >
      <div className="game-board__label">
        <span>{index + 1}</span>
        {board.solved && (
          <span className="game-board__check" aria-hidden="true">
            ✓
          </span>
        )}
      </div>
      <div className="game-board__grid" role="group">
        {visibleRows.map((row, ri) => (
          <div key={ri} className="game-board__row">
            {row.map((tile, ti) => (
              <Tile
                key={ti}
                letter={tile.letter}
                status={tile.status}
                delay={ri === guessCount - 1 || (mode === 'sequence' && board.solved && ri === board.solvedAtRow) ? ti * 80 : 0}
                small={compact || mode !== 'sequence'}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
