import type { LetterStatus } from './types';

/**
 * Wordle-style evaluation with correct duplicate-letter handling.
 * 1) Mark exact matches (correct) and deplete letter counts.
 * 2) Mark remaining letters that appear elsewhere (present).
 * 3) Everything else is absent.
 */
export function evaluateGuess(guess: string, target: string): LetterStatus[] {
  const g = guess.toLowerCase();
  const t = target.toLowerCase();
  const len = Math.min(g.length, t.length);
  const result: LetterStatus[] = Array(len).fill('absent');
  const remaining: Record<string, number> = {};

  for (let i = 0; i < len; i++) {
    if (g[i] === t[i]) {
      result[i] = 'correct';
    } else {
      remaining[t[i]] = (remaining[t[i]] ?? 0) + 1;
    }
  }

  for (let i = 0; i < len; i++) {
    if (result[i] === 'correct') continue;
    const ch = g[i];
    if (remaining[ch] && remaining[ch] > 0) {
      result[i] = 'present';
      remaining[ch]--;
    } else {
      result[i] = 'absent';
    }
  }

  return result;
}

/** Priority for merging keyboard key status across boards */
const STATUS_PRIORITY: Record<LetterStatus, number> = {
  empty: 0,
  tbd: 1,
  absent: 2,
  present: 3,
  correct: 4,
};

export function mergeLetterStatus(
  current: LetterStatus | undefined,
  next: LetterStatus,
): LetterStatus {
  if (!current) return next;
  return STATUS_PRIORITY[next] > STATUS_PRIORITY[current] ? next : current;
}
