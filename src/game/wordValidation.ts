import { isValidGuess } from '../data/guesses';
import { WORD_LENGTH } from './types';

export function normalizeGuess(input: string): string {
  return input.toUpperCase().replace(/[^A-Z]/g, '').slice(0, WORD_LENGTH);
}

export function canSubmitGuess(guess: string): { ok: boolean; reason?: string } {
  if (guess.length < WORD_LENGTH) {
    return { ok: false, reason: 'Not enough letters' };
  }
  if (guess.length > WORD_LENGTH) {
    return { ok: false, reason: 'Too many letters' };
  }
  if (!isValidGuess(guess)) {
    return { ok: false, reason: 'Not in word list' };
  }
  return { ok: true };
}

export { isValidGuess };
