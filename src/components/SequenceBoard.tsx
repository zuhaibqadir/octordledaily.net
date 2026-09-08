import type { GameState } from '../game/types';
import { GameBoard } from './GameBoard';

interface SequenceBoardProps {
  state: GameState;
}

export function SequenceBoard({ state }: SequenceBoardProps) {
  const idx = state.sequenceIndex;
  const board = state.boards[idx];
  const progress = Math.min(idx + (board?.solved ? 1 : 0), 8);

  return (
    <div className="sequence-view" role="region" aria-label="Sequence mode">
      <div className="sequence-view__progress">
        <div className="sequence-view__dots" aria-hidden="true">
          {state.boards.map((b, i) => (
            <span
              key={b.id}
              className={`sequence-dot${b.solved ? ' sequence-dot--done' : ''}${i === idx && !b.solved ? ' sequence-dot--active' : ''}${i > idx ? ' sequence-dot--locked' : ''}`}
            />
          ))}
        </div>
        <p className="sequence-view__label">
          Word <strong>{Math.min(idx + 1, 8)}</strong> of 8
          {state.status === 'won' ? ' · Complete' : ''}
        </p>
        <p className="sequence-view__guesses" aria-live="polite">
          Guesses left:{' '}
          <strong>
            {Math.max(
              0,
              8 -
                (board?.rows.filter((r) =>
                  r.some((t) => t.status !== 'empty'),
                ).length ?? 0),
            )}
          </strong>
        </p>
      </div>

      {board && (
        <div className="sequence-view__board-wrap">
          <GameBoard
            board={board}
            index={idx}
            currentGuess={state.currentGuess}
            guessCount={state.guessCount}
            isActive={state.status === 'playing' && !board.solved}
            mode="sequence"
          />
        </div>
      )}

      <div className="sequence-view__upcoming" aria-hidden="true">
        {state.boards.map((b, i) => {
          if (i === idx) return null;
          return (
            <div
              key={b.id}
              className={`sequence-chip${b.solved ? ' sequence-chip--done' : i < idx ? '' : ' sequence-chip--locked'}`}
            >
              {b.solved ? '✓' : i + 1}
            </div>
          );
        })}
      </div>

      <span className="sr-only">
        Progress {progress} of 8 words solved
      </span>
    </div>
  );
}
