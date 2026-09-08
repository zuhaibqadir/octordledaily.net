import type { BoardState, GameMode, GameState, LetterStatus, TileState } from './types';
import {
  BOARD_COUNT,
  SEQUENCE_MAX_GUESSES,
  STANDARD_MAX_GUESSES,
  WORD_LENGTH,
} from './types';
import { evaluateGuess, mergeLetterStatus } from './wordEvaluation';
import { getDailyPuzzle } from './dailyPuzzle';
import { pickWords } from './puzzleGenerator';

function emptyRow(): TileState[] {
  return Array.from({ length: WORD_LENGTH }, () => ({
    letter: '',
    status: 'empty' as const,
  }));
}

function createBoard(id: number, target: string, maxGuesses: number): BoardState {
  return {
    id,
    target: target.toUpperCase(),
    rows: Array.from({ length: maxGuesses }, () => emptyRow()),
    solved: false,
    solvedAtRow: null,
  };
}

export function createGameState(
  mode: GameMode,
  options?: { words?: string[]; puzzleId?: string; puzzleDate?: string },
): GameState {
  const maxGuesses = mode === 'sequence' ? SEQUENCE_MAX_GUESSES : STANDARD_MAX_GUESSES;

  let words: string[];
  let puzzleId: string;
  let puzzleDate: string | undefined;

  if (options?.words) {
    words = options.words;
    puzzleId = options.puzzleId ?? `${mode}-${Date.now()}`;
    puzzleDate = options.puzzleDate;
  } else if (mode === 'daily') {
    const daily = getDailyPuzzle();
    words = daily.words;
    puzzleId = daily.puzzleId;
    puzzleDate = daily.date;
  } else {
    words = pickWords(`${mode}-${Date.now()}-${Math.random()}`, BOARD_COUNT);
    puzzleId = `${mode}-${Date.now()}`;
  }

  return {
    mode,
    status: 'playing',
    boards: words.map((w, i) => createBoard(i, w, maxGuesses)),
    currentGuess: '',
    guessCount: 0,
    maxGuesses,
    puzzleId,
    puzzleDate,
    sequenceIndex: 0,
    startedAt: Date.now(),
    finishedAt: null,
    statsRecorded: false,
  };
}

export function createUnlimitedGame(excludePuzzleId?: string): GameState {
  let words = pickWords(`unlimited-${Date.now()}-${Math.random()}`, BOARD_COUNT);
  let puzzleId = `unlimited-${Date.now()}`;

  if (excludePuzzleId) {
    for (let attempt = 0; attempt < 5; attempt++) {
      words = pickWords(`unlimited-${Date.now()}-${Math.random()}-${attempt}`, BOARD_COUNT);
      puzzleId = `unlimited-${Date.now()}-${attempt}`;
      if (puzzleId !== excludePuzzleId) break;
    }
  }

  return createGameState('unlimited', { words, puzzleId });
}

function applyGuessToBoard(
  board: BoardState,
  guess: string,
  rowIndex: number,
): BoardState {
  if (board.solved) return board;

  const statuses = evaluateGuess(guess, board.target);
  const newRows = board.rows.map((row, ri) => {
    if (ri !== rowIndex) return row;
    return guess.split('').map((letter, i) => ({
      letter,
      status: statuses[i],
    }));
  });

  const solved = statuses.every((s) => s === 'correct');
  return {
    ...board,
    rows: newRows,
    solved,
    solvedAtRow: solved ? rowIndex : board.solvedAtRow,
  };
}

function nextEmptyRowIndex(board: BoardState): number {
  return board.rows.findIndex((row) => row.every((t) => t.status === 'empty'));
}

export function submitGuess(state: GameState, guess: string): GameState {
  if (state.status !== 'playing') return state;
  if (state.mode !== 'sequence' && state.guessCount >= state.maxGuesses) {
    return state;
  }

  const upper = guess.toUpperCase();

  if (state.mode === 'sequence') {
    return submitSequenceGuess(state, upper);
  }

  const rowIndex = state.guessCount;
  const boards = state.boards.map((board) =>
    applyGuessToBoard(board, upper, rowIndex),
  );

  const guessCount = state.guessCount + 1;
  const allSolved = boards.every((b) => b.solved);
  const lost = !allSolved && guessCount >= state.maxGuesses;

  return {
    ...state,
    boards,
    currentGuess: '',
    guessCount,
    status: allSolved ? 'won' : lost ? 'lost' : 'playing',
    finishedAt: allSolved || lost ? Date.now() : null,
  };
}

function submitSequenceGuess(state: GameState, guess: string): GameState {
  const idx = state.sequenceIndex;
  const board = state.boards[idx];
  if (!board || board.solved) return state;

  const useRow = nextEmptyRowIndex(board);
  if (useRow < 0 || useRow >= SEQUENCE_MAX_GUESSES) return state;

  const updatedBoard = applyGuessToBoard(board, guess, useRow);
  const boards = state.boards.map((b, i) => (i === idx ? updatedBoard : b));

  let sequenceIndex = state.sequenceIndex;
  let status = state.status;
  let finishedAt = state.finishedAt;
  const totalGuesses = state.guessCount + 1;

  if (updatedBoard.solved) {
    if (sequenceIndex >= BOARD_COUNT - 1) {
      status = 'won';
      finishedAt = Date.now();
    } else {
      sequenceIndex += 1;
    }
  } else if (useRow + 1 >= SEQUENCE_MAX_GUESSES) {
    status = 'lost';
    finishedAt = Date.now();
  }

  return {
    ...state,
    boards,
    currentGuess: '',
    guessCount: totalGuesses,
    sequenceIndex,
    status,
    finishedAt,
  };
}

export function addLetter(state: GameState, letter: string): GameState {
  if (state.status !== 'playing') return state;
  if (state.currentGuess.length >= WORD_LENGTH) return state;
  const ch = letter.toUpperCase().replace(/[^A-Z]/g, '');
  if (!ch) return state;
  return { ...state, currentGuess: state.currentGuess + ch };
}

export function removeLetter(state: GameState): GameState {
  if (state.status !== 'playing') return state;
  if (!state.currentGuess.length) return state;
  return { ...state, currentGuess: state.currentGuess.slice(0, -1) };
}

/** Build display rows for a board including the current in-progress guess */
export function getDisplayRows(
  board: BoardState,
  currentGuess: string,
  guessCount: number,
  isActive: boolean,
  mode: GameMode,
): TileState[][] {
  return board.rows.map((row, ri) => {
    const isCurrentRow =
      isActive &&
      !board.solved &&
      (mode === 'sequence'
        ? nextEmptyRowIndex(board) === ri
        : ri === guessCount);

    if (!isCurrentRow) return row;

    return row.map((_, i) => {
      const letter = currentGuess[i] ?? '';
      return {
        letter,
        status: letter ? ('tbd' as const) : ('empty' as const),
      };
    });
  });
}

export function getKeyboardStatuses(
  state: GameState,
): Record<string, LetterStatus> {
  const map: Record<string, LetterStatus> = {};

  // Sequence: only the active board — prior words must not tint keys
  const boardsToScan =
    state.mode === 'sequence'
      ? [state.boards[state.sequenceIndex]].filter(Boolean)
      : state.boards;

  for (const board of boardsToScan) {
    for (const row of board.rows) {
      for (const tile of row) {
        if (!tile.letter || tile.status === 'empty' || tile.status === 'tbd') {
          continue;
        }
        const key = tile.letter.toUpperCase();
        map[key] = mergeLetterStatus(map[key], tile.status);
      }
    }
  }

  return map;
}

export function getSolvedCount(state: GameState): number {
  return state.boards.filter((b) => b.solved).length;
}

export function findLastFilledRowIndex(board: BoardState): number {
  for (let i = board.rows.length - 1; i >= 0; i--) {
    if (board.rows[i].some((t) => t.status !== 'empty')) return i;
  }
  return -1;
}
