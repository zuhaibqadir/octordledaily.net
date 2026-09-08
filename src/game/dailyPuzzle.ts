import { BOARD_COUNT } from './types';
import { getDateString, getDailyPuzzleNumber, pickWords } from './puzzleGenerator';

export interface DailyPuzzle {
  date: string;
  puzzleNumber: number;
  words: string[];
  puzzleId: string;
}

export function getDailyPuzzle(date: Date = new Date()): DailyPuzzle {
  const dateStr = getDateString(date);
  const puzzleNumber = getDailyPuzzleNumber(date);
  const words = pickWords(`daily-${dateStr}`, BOARD_COUNT);
  return {
    date: dateStr,
    puzzleNumber,
    words,
    puzzleId: `daily-${dateStr}`,
  };
}
