export type LetterStatus = 'empty' | 'tbd' | 'correct' | 'present' | 'absent';

export type GameStatus = 'playing' | 'won' | 'lost';

export type GameMode = 'daily' | 'unlimited' | 'sequence';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface TileState {
  letter: string;
  status: LetterStatus;
}

export interface BoardState {
  id: number;
  target: string;
  rows: TileState[][];
  solved: boolean;
  solvedAtRow: number | null;
}

export interface GameState {
  mode: GameMode;
  status: GameStatus;
  boards: BoardState[];
  currentGuess: string;
  guessCount: number;
  maxGuesses: number;
  puzzleId: string;
  puzzleDate?: string;
  /** Sequence mode: which word index (0–7) is currently active */
  sequenceIndex: number;
  startedAt: number;
  finishedAt: number | null;
  /** Prevents double-counting stats after reload / remount */
  statsRecorded?: boolean;
}

export interface GameSettings {
  theme: ThemeMode;
  highContrast: boolean;
  animations: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  guessDistribution: Record<number, number>;
  lastDailyWonDate: string | null;
  lastDailyPlayedDate: string | null;
}

export interface ToastMessage {
  id: number;
  text: string;
  duration?: number;
}

export const WORD_LENGTH = 5;
export const BOARD_COUNT = 8;
export const STANDARD_MAX_GUESSES = 13;
export const SEQUENCE_MAX_GUESSES = 8;

export const DEFAULT_SETTINGS: GameSettings = {
  theme: 'system',
  highContrast: false,
  animations: true,
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  guessDistribution: {},
  lastDailyWonDate: null,
  lastDailyPlayedDate: null,
};

export const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
] as const;
