import type { GameMode, GameStats } from './types';
import { DEFAULT_STATS } from './types';
import { getDateString } from './puzzleGenerator';

const STATS_KEY_PREFIX = 'octordle-stats-';

export function getStatsKey(mode: GameMode): string {
  return `${STATS_KEY_PREFIX}${mode}`;
}

export function loadStats(mode: GameMode): GameStats {
  try {
    const raw = localStorage.getItem(getStatsKey(mode));
    if (!raw) return { ...DEFAULT_STATS, guessDistribution: {} };
    const parsed = JSON.parse(raw) as Partial<GameStats>;
    return {
      ...DEFAULT_STATS,
      ...parsed,
      guessDistribution: parsed.guessDistribution ?? {},
      lastDailyWonDate: parsed.lastDailyWonDate ?? null,
      lastDailyPlayedDate: parsed.lastDailyPlayedDate ?? null,
    };
  } catch {
    return { ...DEFAULT_STATS, guessDistribution: {} };
  }
}

export function saveStats(mode: GameMode, stats: GameStats): void {
  try {
    localStorage.setItem(getStatsKey(mode), JSON.stringify(stats));
  } catch {
    // LocalStorage unavailable — silently ignore
  }
}

/** Previous calendar day in UTC as YYYY-MM-DD */
function previousUtcDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return getDateString(dt);
}

export function recordGameResult(
  mode: GameMode,
  won: boolean,
  guessCount: number,
  puzzleDate?: string,
): GameStats {
  const stats = loadStats(mode);

  if (mode === 'daily' && puzzleDate) {
    if (stats.lastDailyPlayedDate === puzzleDate) {
      return stats;
    }
  }

  stats.gamesPlayed += 1;

  if (won) {
    stats.gamesWon += 1;

    if (mode === 'daily' && puzzleDate) {
      if (stats.lastDailyWonDate === previousUtcDate(puzzleDate)) {
        stats.currentStreak += 1;
      } else {
        stats.currentStreak = 1;
      }
      stats.lastDailyWonDate = puzzleDate;
    } else {
      stats.currentStreak += 1;
    }

    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
    stats.guessDistribution[guessCount] =
      (stats.guessDistribution[guessCount] ?? 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  if (mode === 'daily' && puzzleDate) {
    stats.lastDailyPlayedDate = puzzleDate;
  }

  saveStats(mode, stats);
  return stats;
}

export function winRate(stats: GameStats): number {
  if (stats.gamesPlayed === 0) return 0;
  return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
}
