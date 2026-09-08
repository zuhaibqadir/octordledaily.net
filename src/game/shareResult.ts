import type { GameMode, GameState, LetterStatus } from './types';
import { getDailyPuzzleNumber, parsePuzzleDate } from './puzzleGenerator';
import { findLastFilledRowIndex, getSolvedCount } from './gameLogic';

const STATUS_EMOJI: Record<string, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬜',
};

const HC_EMOJI: Record<string, string> = {
  correct: '🟧',
  present: '🟦',
  absent: '⬛',
};

function modeTitle(mode: GameMode): string {
  switch (mode) {
    case 'daily':
      return 'Octordle Daily';
    case 'sequence':
      return 'Octordle Sequence';
    default:
      return 'Octordle Unlimited';
  }
}

export function buildShareText(
  state: GameState,
  highContrast = false,
): string {
  const emoji = highContrast ? HC_EMOJI : STATUS_EMOJI;
  const lines: string[] = [];

  const title = modeTitle(state.mode);
  if (state.mode === 'daily' && state.puzzleDate) {
    const num = getDailyPuzzleNumber(parsePuzzleDate(state.puzzleDate));
    lines.push(`${title} #${num}`);
  } else {
    lines.push(title);
  }

  if (state.status === 'won') {
    if (state.mode === 'sequence') {
      lines.push(`Solved all 8 words`);
    } else {
      lines.push(`Solved in ${state.guessCount}/${state.maxGuesses}`);
    }
  } else {
    lines.push(`X/${state.maxGuesses} · ${getSolvedCount(state)}/8 solved`);
  }

  lines.push('');

  if (state.mode === 'sequence') {
    for (let i = 0; i < state.boards.length; i++) {
      const board = state.boards[i];
      const usedRows = board.rows.filter((row) =>
        row.some((t) => t.status !== 'empty'),
      );
      if (usedRows.length === 0) continue;
      const last = usedRows[usedRows.length - 1];
      lines.push(
        last.map((t) => emoji[t.status as LetterStatus] ?? '⬜').join(''),
      );
    }
  } else {
    // Show final result row per board (last submitted or solved row)
    for (const board of state.boards) {
      const rowIdx = board.solvedAtRow ?? findLastFilledRowIndex(board);
      if (rowIdx < 0) {
        lines.push('⬜⬜⬜⬜⬜');
        continue;
      }
      lines.push(
        board.rows[rowIdx]
          .map((t) => emoji[t.status as LetterStatus] ?? '⬜')
          .join(''),
      );
    }
  }

  lines.push('');
  lines.push(typeof window !== 'undefined' ? window.location.origin : 'octordledaily.net');

  return lines.join('\n');
}

export async function shareResult(
  text: string,
): Promise<'shared' | 'copied' | 'cancelled' | 'failed'> {
  try {
    if (navigator.share) {
      await navigator.share({ text });
      return 'shared';
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      return 'cancelled';
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    // Fallback for older browsers
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return 'copied';
    } catch {
      return 'failed';
    }
  }
}
