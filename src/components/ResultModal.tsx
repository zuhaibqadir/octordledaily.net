import { useEffect, useState } from 'react';
import type { GameState } from '../game/types';
import { findLastFilledRowIndex, getSolvedCount } from '../game/gameLogic';
import { buildShareText, shareResult } from '../game/shareResult';
import {
  formatCountdown,
  getDailyPuzzleNumber,
  msUntilMidnight,
  parsePuzzleDate,
} from '../game/puzzleGenerator';
import { Modal } from './Modal';

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  state: GameState;
  highContrast: boolean;
  onNewGame: () => void;
  onShareFeedback: (msg: string) => void;
}

export function ResultModal({
  open,
  onClose,
  state,
  highContrast,
  onNewGame,
  onShareFeedback,
}: ResultModalProps) {
  const [countdown, setCountdown] = useState(() =>
    formatCountdown(msUntilMidnight()),
  );
  const won = state.status === 'won';
  const solved = getSolvedCount(state);

  useEffect(() => {
    if (!open || state.mode !== 'daily') return;
    const id = window.setInterval(() => {
      setCountdown(formatCountdown(msUntilMidnight()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [open, state.mode]);

  const handleShare = async () => {
    const text = buildShareText(state, highContrast);
    const result = await shareResult(text);
    if (result === 'copied') onShareFeedback('Result copied!');
    else if (result === 'shared') onShareFeedback('Shared!');
    else if (result === 'failed') onShareFeedback('Could not share');
  };

  const title = won
    ? state.mode === 'sequence'
      ? 'Sequence Complete!'
      : 'Octordle Complete!'
    : 'Better luck next time';

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="result-content">
        {state.mode === 'daily' && state.puzzleDate && (
          <p className="result-meta">
            Daily #{getDailyPuzzleNumber(parsePuzzleDate(state.puzzleDate))}{' '}
            · {state.puzzleDate} UTC
          </p>
        )}

        <div className="result-summary">
          {won ? (
            state.mode === 'sequence' ? (
              <p>
                All 8 words solved in <strong>{state.guessCount}</strong> guesses
              </p>
            ) : (
              <p>
                Solved in <strong>{state.guessCount}</strong> / {state.maxGuesses}{' '}
                guesses
              </p>
            )
          ) : (
            <p>
              Solved <strong>{solved}</strong> of 8 words
            </p>
          )}
        </div>

        <div className="result-boards" aria-hidden="true">
          {state.boards.map((board) => {
            const rowIdx = board.solvedAtRow ?? findLastFilledRowIndex(board);
            const row = rowIdx >= 0 ? board.rows[rowIdx] : null;
            return (
              <div
                key={board.id}
                className={`result-mini${board.solved ? ' is-solved' : ''}`}
              >
                {row
                  ? row.map((t, i) => (
                      <span key={i} className={`result-cell result-cell--${t.status}`} />
                    ))
                  : Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className="result-cell result-cell--empty" />
                    ))}
              </div>
            );
          })}
        </div>

        {state.mode === 'daily' && (
          <p className="result-countdown">
            Next daily puzzle in <strong>{countdown}</strong>
          </p>
        )}

        <div className="result-actions">
          <button type="button" className="btn btn--primary" onClick={handleShare}>
            Share
          </button>
          {state.mode !== 'daily' && (
            <button type="button" className="btn btn--secondary" onClick={onNewGame}>
              New Game
            </button>
          )}
          {state.mode === 'daily' && state.status === 'lost' && (
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Close
            </button>
          )}
        </div>

        {state.status === 'lost' && (
          <details className="result-answers">
            <summary>Reveal answers</summary>
            <ul>
              {state.boards.map((b, i) => (
                <li key={b.id}>
                  Word {i + 1}: <strong>{b.target}</strong>
                  {b.solved ? ' ✓' : ''}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </Modal>
  );
}
