import { useMemo } from 'react';
import type { GameMode, GameStats } from '../game/types';
import { loadStats, winRate } from '../game/stats';
import { Modal } from './Modal';

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  mode: GameMode;
  /** bump to refresh after a game ends */
  refreshKey?: number;
}

export function StatsModal({ open, onClose, mode, refreshKey = 0 }: StatsModalProps) {
  const stats: GameStats = useMemo(() => loadStats(mode), [mode, open, refreshKey]);

  const maxDist = Math.max(1, ...Object.values(stats.guessDistribution));
  const distKeys = Object.keys(stats.guessDistribution)
    .map(Number)
    .sort((a, b) => a - b);

  const modeLabel =
    mode === 'daily' ? 'Daily' : mode === 'sequence' ? 'Sequence' : 'Unlimited';

  return (
    <Modal open={open} onClose={onClose} title={`${modeLabel} Statistics`}>
      <div className="stats-grid" role="group" aria-label="Game statistics">
        <Stat value={String(stats.gamesPlayed)} label="Played" />
        <Stat value={`${winRate(stats)}%`} label="Win %" />
        <Stat value={String(stats.currentStreak)} label="Streak" />
        <Stat value={String(stats.bestStreak)} label="Best" />
      </div>

      {distKeys.length > 0 && (
        <div className="stats-dist">
          <h3>Guess distribution</h3>
          <ul className="stats-dist__list">
            {distKeys.map((g) => {
              const count = stats.guessDistribution[g] ?? 0;
              const pct = Math.max(8, (count / maxDist) * 100);
              return (
                <li key={g} className="stats-dist__row">
                  <span className="stats-dist__guess">{g}</span>
                  <div className="stats-dist__bar-wrap">
                    <div
                      className="stats-dist__bar"
                      style={{ width: `${pct}%` }}
                    >
                      {count}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {stats.gamesPlayed === 0 && (
        <p className="stats-empty">Play a game to see your stats here.</p>
      )}
    </Modal>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
    </div>
  );
}
