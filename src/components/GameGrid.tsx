import type { GameState } from '../game/types';
import { GameBoard } from './GameBoard';

interface GameGridProps {
  state: GameState;
}

export function GameGrid({ state }: GameGridProps) {
  return (
    <div className="game-grid" role="region" aria-label="Eight word boards">
      {state.boards.map((board, i) => (
        <GameBoard
          key={board.id}
          board={board}
          index={i}
          currentGuess={state.currentGuess}
          guessCount={state.guessCount}
          isActive={!board.solved && state.status === 'playing'}
          mode={state.mode}
          compact
        />
      ))}
    </div>
  );
}
