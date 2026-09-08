import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameMode } from './game/types';
import { SEQUENCE_MAX_GUESSES } from './game/types';
import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import { useSettings } from './hooks/useSettings';
import { useToast } from './hooks/useToast';
import { useGameLayout } from './hooks/useGameLayout';
import { Header } from './components/Header';
import { GameGrid } from './components/GameGrid';
import { SequenceBoard } from './components/SequenceBoard';
import { Keyboard } from './components/Keyboard';
import { Toast } from './components/Toast';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { ResultModal } from './components/ResultModal';
import { Footer } from './components/Footer';
import { SeoContent } from './components/SeoContent';
import { getDailyPuzzleNumber, parsePuzzleDate } from './game/puzzleGenerator';

function App() {
  const [mode, setMode] = useState<GameMode>('daily');
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [statsKey, setStatsKey] = useState(0);
  const [seenHelp, setSeenHelp] = useState(() => {
    try {
      return localStorage.getItem('octordle-seen-help') === '1';
    } catch {
      return true;
    }
  });

  const shellRef = useRef<HTMLElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  useGameLayout(shellRef, playRef);

  const { settings, setSettings } = useSettings();
  const { toasts, showToast } = useToast();
  const {
    state,
    onLetter,
    onBackspace,
    onEnter,
    newGame,
    keyboardStatuses,
    solvedCount,
  } = useGame(mode, showToast);

  const modalOpen = helpOpen || settingsOpen || statsOpen || resultOpen;

  useKeyboard({
    onLetter,
    onEnter,
    onBackspace,
    enabled: !modalOpen && state.status === 'playing',
  });

  // First-visit help
  useEffect(() => {
    if (!seenHelp) {
      const t = window.setTimeout(() => setHelpOpen(true), 400);
      return () => window.clearTimeout(t);
    }
  }, [seenHelp]);

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
    try {
      localStorage.setItem('octordle-seen-help', '1');
    } catch {
      /* ignore */
    }
    setSeenHelp(true);
  }, []);

  // Open results when game ends
  useEffect(() => {
    if (state.status === 'playing') {
      setResultOpen(false);
      return;
    }
    const t = window.setTimeout(() => {
      setResultOpen(true);
      setStatsKey((k) => k + 1);
    }, 600);
    return () => window.clearTimeout(t);
  }, [state.status, state.puzzleId]);

  const handleModeChange = (m: GameMode) => {
    setMode(m);
    setResultOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remaining =
    state.mode === 'sequence'
      ? Math.max(
          0,
          SEQUENCE_MAX_GUESSES -
            (state.boards[state.sequenceIndex]?.rows.filter((r) =>
              r.some((t) => t.status !== 'empty'),
            ).length ?? 0),
        )
      : Math.max(0, state.maxGuesses - state.guessCount);

  return (
    <div className="app" id="top">
      <Header
        mode={mode}
        onModeChange={handleModeChange}
        onOpenStats={() => setStatsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main className="game-shell" ref={shellRef}>
        <div className="game-status-bar">
          <h1 className="game-title">
            {mode === 'daily' && (
              <>
                Daily Octordle
                {state.puzzleDate && (
                  <span className="game-title__meta">
                    #{getDailyPuzzleNumber(parsePuzzleDate(state.puzzleDate))}
                  </span>
                )}
              </>
            )}
            {mode === 'unlimited' && 'Unlimited Octordle'}
            {mode === 'sequence' && 'Octordle Sequence'}
          </h1>
          <div className="game-status-bar__meta" aria-live="polite">
            <span>
              {solvedCount}/8 solved
            </span>
            <span className="dot-sep" aria-hidden="true">
              ·
            </span>
            <span>
              {remaining} guess{remaining === 1 ? '' : 'es'} left
            </span>
            {state.status !== 'playing' && (
              <>
                <span className="dot-sep" aria-hidden="true">
                  ·
                </span>
                <span className={state.status === 'won' ? 'status-won' : 'status-lost'}>
                  {state.status === 'won' ? 'Won' : 'Lost'}
                </span>
              </>
            )}
          </div>
          {mode === 'unlimited' && state.status !== 'playing' && (
            <button type="button" className="btn btn--tiny" onClick={newGame}>
              New Game
            </button>
          )}
          {mode === 'sequence' && state.status !== 'playing' && (
            <button type="button" className="btn btn--tiny" onClick={newGame}>
              New Sequence
            </button>
          )}
        </div>

        <div className="game-play-area" ref={playRef}>
          {mode === 'sequence' ? (
            <SequenceBoard state={state} />
          ) : (
            <GameGrid state={state} />
          )}
        </div>

        <Keyboard
          statuses={keyboardStatuses}
          onLetter={onLetter}
          onEnter={onEnter}
          onBackspace={onBackspace}
          disabled={state.status !== 'playing'}
        />
      </main>

      <SeoContent />
      <Footer onOpenHelp={() => setHelpOpen(true)} onMode={handleModeChange} />

      <Toast toasts={toasts} />

      <HelpModal open={helpOpen} onClose={closeHelp} />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={setSettings}
      />
      <StatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        mode={mode}
        refreshKey={statsKey}
      />
      <ResultModal
        open={resultOpen && state.status !== 'playing'}
        onClose={() => setResultOpen(false)}
        state={state}
        highContrast={settings.highContrast}
        onNewGame={() => {
          newGame();
          setResultOpen(false);
        }}
        onShareFeedback={showToast}
      />
    </div>
  );
}

export default App;
