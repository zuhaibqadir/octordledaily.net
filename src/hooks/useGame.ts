import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameMode, GameState } from '../game/types';
import {
  addLetter,
  createGameState,
  createUnlimitedGame,
  getKeyboardStatuses,
  getSolvedCount,
  removeLetter,
  submitGuess,
} from '../game/gameLogic';
import { canSubmitGuess } from '../game/wordValidation';
import { getDailyPuzzle } from '../game/dailyPuzzle';
import { getDateString } from '../game/puzzleGenerator';
import { recordGameResult } from '../game/stats';

const STORAGE_PREFIX = 'octordle-game-';

function storageKey(mode: GameMode): string {
  return `${STORAGE_PREFIX}${mode}`;
}

function loadGame(mode: GameMode): GameState | null {
  try {
    const raw = localStorage.getItem(storageKey(mode));
    if (!raw) return null;
    const state = JSON.parse(raw) as GameState;

    if (mode === 'daily') {
      const today = getDateString();
      if (state.puzzleDate !== today) return null;
    }

    return state;
  } catch {
    return null;
  }
}

function saveGame(state: GameState): void {
  try {
    localStorage.setItem(storageKey(state.mode), JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function initGame(mode: GameMode): GameState {
  const saved = loadGame(mode);
  if (saved) return saved;

  if (mode === 'daily') {
    const daily = getDailyPuzzle();
    return createGameState('daily', {
      words: daily.words,
      puzzleId: daily.puzzleId,
      puzzleDate: daily.date,
    });
  }

  if (mode === 'unlimited') {
    return createUnlimitedGame();
  }

  return createGameState('sequence');
}

export function useGame(
  mode: GameMode,
  showToast: (msg: string) => void,
) {
  const [state, setState] = useState<GameState>(() => initGame(mode));
  const modeRef = useRef(mode);
  const recordingRef = useRef<string | null>(null);

  // Switch mode / hydrate
  useEffect(() => {
    if (modeRef.current !== mode) {
      modeRef.current = mode;
      recordingRef.current = null;
      setState(initGame(mode));
    }
  }, [mode]);

  // Persist
  useEffect(() => {
    saveGame(state);
  }, [state]);

  // Record stats once when game ends (persist flag so reloads don't double-count)
  useEffect(() => {
    if (state.status === 'playing' || state.statsRecorded) return;
    if (recordingRef.current === state.puzzleId) return;
    recordingRef.current = state.puzzleId;

    recordGameResult(
      state.mode,
      state.status === 'won',
      state.mode === 'sequence'
        ? state.boards.reduce(
            (sum, b) =>
              sum +
              b.rows.filter((r) => r.some((t) => t.status !== 'empty')).length,
            0,
          )
        : state.guessCount,
      state.puzzleDate,
    );

    setState((s) => {
      if (s.puzzleId !== state.puzzleId || s.statsRecorded) return s;
      return { ...s, statsRecorded: true };
    });
  }, [state]);

  const onLetter = useCallback((letter: string) => {
    setState((s) => addLetter(s, letter));
  }, []);

  const onBackspace = useCallback(() => {
    setState((s) => removeLetter(s));
  }, []);

  const onEnter = useCallback(() => {
    setState((s) => {
      if (s.status !== 'playing') return s;
      const check = canSubmitGuess(s.currentGuess);
      if (!check.ok) {
        showToast(check.reason ?? 'Invalid guess');
        return s;
      }
      return submitGuess(s, s.currentGuess);
    });
  }, [showToast]);

  const newGame = useCallback(() => {
    recordingRef.current = null;
    if (mode === 'daily') {
      const daily = getDailyPuzzle();
      setState(
        createGameState('daily', {
          words: daily.words,
          puzzleId: daily.puzzleId,
          puzzleDate: daily.date,
        }),
      );
      showToast('Daily puzzle loaded');
      return;
    }
    if (mode === 'unlimited') {
      setState((s) => createUnlimitedGame(s.puzzleId));
      return;
    }
    setState(createGameState('sequence'));
  }, [mode, showToast]);

  const keyboardStatuses = useMemo(() => getKeyboardStatuses(state), [state]);
  const solvedCount = useMemo(() => getSolvedCount(state), [state]);

  return {
    state,
    onLetter,
    onBackspace,
    onEnter,
    newGame,
    keyboardStatuses,
    solvedCount,
  };
}
